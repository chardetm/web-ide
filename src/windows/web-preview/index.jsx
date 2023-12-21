import React, { useEffect, useState, useCallback, useMemo } from "react";

import { TabbedWindow } from "../../features/windows/WindowWithTabs";
import { ToolbarAddressBar } from "../../features/windows/contents";
import {
  RoundedButton,
  MaterialButtonGroup,
  MaterialIcon,
} from "../../features/ui/materialComponents";

import OpenExternalLinkDialog from "../dialogs/OpenExternalLinkDialog";

import styles from "./index.module.scss";
import {
  useIDEChosenState,
  useIDEChosenStateDispatch,
} from "../../contexts/IDEStateProvider";
import { noPageSelectedHTML } from "../../content/files";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";

import { scriptInjection } from "./codeInjection";
import { objectMap, stringToUrlBase64 } from "../../utils";

const isAbsoluteRegex = new RegExp("^(?:[a-z]+:)?//", "i");

function simplifyRelativePath(path) {
  path = path.replace(/^(\.\/)+/g, "");
  path = path.replace(/\/(\.\/)+/g, "/");
  return path;
}

function getFilesFromFilesPreviewData(filesPreviewData) {
  return objectMap(filesPreviewData, (fileName, previewData) => {
    return [fileName, previewData.base64Url];
  });
}

function performHtmlUpdate(currentFile, htmlCode, filesPreviewData) {
  const filesBase64 = getFilesFromFilesPreviewData(filesPreviewData);
  const htmlDocument = new DOMParser().parseFromString(htmlCode, "text/html");
  const titleElement = htmlDocument.head?.querySelector("title");
  const title = titleElement ? titleElement.textContent : null;
  const linkIconElement = htmlDocument.head?.querySelector('link[rel="icon"]');
  let linkIconData = null;
  if (linkIconElement) {
    const hrefAtt = linkIconElement.getAttribute("href");
    if (hrefAtt) {
      if (isAbsoluteRegex.test(hrefAtt)) {
        linkIconData = hrefAtt;
      } else {
        const href = simplifyRelativePath(hrefAtt);
        if (href in filesPreviewData) {
          linkIconData = filesBase64[href];
        }
      }
    }
  }

  if (Object.keys(filesBase64).length > 0) {
    // Replace all links to css files with inline css
    const cssLinks = htmlDocument.querySelectorAll('link[rel="stylesheet"]');
    for (const link of cssLinks) {
      const hrefAtt = link.getAttribute("href");
      if (hrefAtt) {
        const href = simplifyRelativePath(hrefAtt);
        if (href in filesBase64) {
          link.setAttribute("href", filesBase64[href]);
        }
      }
    }

    // Replace image sources with included images
    const imageNodes = htmlDocument.querySelectorAll("img[src]");
    for (const image of imageNodes) {
      const srcAtt = image.getAttribute("src");
      if (srcAtt) {
        const src = simplifyRelativePath(srcAtt);
        if (src in filesPreviewData) {
          image.setAttribute("src", filesBase64[src]);
        }
      }
    }

    // Replace all links to js files with inline js
    const jsScripts = htmlDocument.querySelectorAll("script[src]");
    for (const script of jsScripts) {
      const srcAtt = script.getAttribute("src");
      if (srcAtt) {
        const src = simplifyRelativePath(srcAtt);
        if (src in filesBase64) {
          script.setAttribute("src", filesBase64[src]);
        }
      }
    }
  }

  const newHtmlCode = htmlDocument.documentElement
    ? htmlDocument.documentElement.outerHTML
    : "";
  const bodyCloseWithScript = `</body>
  ${scriptInjection(currentFile, filesBase64)}`;
  const newHtmlCodeNoLink = newHtmlCode.replace("</body>", bodyCloseWithScript);
  return {
    title: title,
    htmlContent: newHtmlCodeNoLink,
    linkIconData: linkIconData,
  };
}

const Iframe = React.forwardRef(({ title, sandbox, src, srcDoc }, ref) => {
  return (
    <iframe
      title={title}
      className={styles.iframe}
      sandbox={sandbox}
      src={src}
      srcDoc={srcDoc}
      ref={ref}
    ></iframe>
  );
});

export default function WebPreviewWindow({ onMaximize, onDemaximize }) {
  const ideState = useIDEChosenState();
  const ideStateDispatch = useIDEChosenStateDispatch();
  const [tabTitle, setTabTitle] = useState(ideState.activeHtmlFile);
  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
  const [infoSnackbarMessage, setInfoSnackbarMessage] = useState("");
  const [linkIcon, setLinkIcon] = useState(null);
  const [htmlIframeNode, setHtmlIframeNode] = useState(null);
  const htmlIframeRef = useCallback((node) => {
    setHtmlIframeNode(node);
  }, []);
  const [previewHtmlBase64, setPreviewHtmlBase64] = useState("");
  const [openExternalLinkDialogOpen, setOpenExternalLinkDialogOpen] =
    useState(false);
  const [externalLink, setExternalLink] = useState(null);
  const [iframeActiveFile, setIframeActiveFile] = useState(null); // Which file is currently active in the iframe (confirmed by message)
  const [messageQueue, setMessageQueue] = useState({});

  function postMessageToIframe(message) {
    const page = ideState.activeHtmlFile;
    setMessageQueue((prev) => {
      const newMessageQueue = { ...prev };
      if (page in newMessageQueue) {
        newMessageQueue[page].push(message);
      } else {
        newMessageQueue[page] = [message];
      }
      return newMessageQueue;
    });
  }

  useEffect(() => {
    if (ideState.activeHtmlFile === iframeActiveFile) {
      if (messageQueue[iframeActiveFile]) {
        for (const message of messageQueue[iframeActiveFile]) {
          htmlIframeNode?.contentWindow?.postMessage(message, "*");
        }
        setMessageQueue((prev) => {
          const newMessageQueue = { ...prev };
          delete newMessageQueue[iframeActiveFile];
          return newMessageQueue;
        });
      }
    }
  }, [ideState.activeHtmlFile, iframeActiveFile, messageQueue]);

  // const handleCloseNewTabSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
  const handleCloseNewTabSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setInfoSnackbarOpen(false);
  };

  const shouldRefresh = useMemo(() => {
    for (const fileData of Object.values(ideState.filesPreview)) {
      if (!fileData.upToDate) {
        return true;
      }
    }
    return false;
  }, [ideState.filesPreview]);

  const htmlCode = useMemo(() => {
    return ideState.activeHtmlFile
      ? ideState.filesPreview[ideState.activeHtmlFile].content
      : noPageSelectedHTML();
  }, [ideState.activeHtmlFile, ideState.filesPreview]);

  useEffect(() => {
    if (htmlIframeNode != null) {
      const { title, htmlContent, linkIconData } = performHtmlUpdate(
        ideState.activeHtmlFile,
        htmlCode,
        ideState.filesPreview
      );
      setPreviewHtmlBase64(stringToUrlBase64("text/html", htmlContent));
      if (title !== null) {
        if (title !== "") {
          setTabTitle(title);
        } else {
          setTabTitle(
            <span className={styles.title_error}>
              {ideState.activeHtmlFile} (titre vide)
            </span>
          );
        }
      } else {
        setTabTitle(
          <span className={styles.title_error}>
            {ideState.activeHtmlFile} (pas de titre)
          </span>
        );
      }
      if (linkIconData !== null) {
        setLinkIcon(linkIconData);
      } else {
        setLinkIcon(null);
      }
    }
  }, [
    htmlCode,
    ideState.filesPreview,
    htmlIframeNode,
    ideState.activeHtmlFile,
  ]);

  const showSnackbarMessage = (message) => {
    setInfoSnackbarMessage(message);
    setInfoSnackbarOpen(true);
  };

  const openLocalLink = (link, anchor, target) => {
    const fileToOpen = link || ideState.activeHtmlFile;
    ideStateDispatch({
      type: "set_active_file",
      fileName: fileToOpen,
      anchor: anchor,
    });
    if (target === "_blank") {
      showSnackbarMessage("Ce lien s'ouvre dans un nouvel onglet.");
    }
    if (!fileToOpen.endsWith(".html")) {
      showSnackbarMessage(
        "Impossible d'afficher autre chose qu'une page web dans la fenêtre de prévisualisation."
      );
    }
  };

  const openExternalLink = (link) => {
    setExternalLink(link);
    setOpenExternalLinkDialogOpen(true);
  };

  // TODO: move to the right place (in the preview)
  const handleMessage = useCallback(
    (event) => {
      const { data } = event;
      if (data.type === "ready") {
        setIframeActiveFile(data.file);
      } else if (data.type === "set_active_file") {
        openLocalLink(data.fileName, data.anchor, data.target);
      } else if (data.type === "open_external_link") {
        openExternalLink(data.link);
      } else if (data.type === "open_link") {
        const href = data.href;
        const resolvedHref = data.resolvedHref;
        const target = data.target;
        if (!resolvedHref) {
          showSnackbarMessage("Lien vide !");
        } else if (isAbsoluteRegex.test(href)) {
          openExternalLink(resolvedHref);
        } else {
          const pathAndAnchor = href.split("#");
          const linkPath = pathAndAnchor[0];
          const linkAnchor = pathAndAnchor.length > 1 ? pathAndAnchor[1] : null;
          if (linkPath in ideState.filesPreview) {
            openLocalLink(linkPath, linkAnchor, target);
          } else if (linkPath === "") {
            openLocalLink(linkPath, linkAnchor);
          } else if (
            (linkPath === "/" || linkPath === "./") &&
            "index.html" in ideState.filesPreview
          ) {
            openLocalLink("index.html", linkAnchor);
          } else if (
            (linkPath === "/" || linkPath === "./") &&
            "INDEX.html" in ideState.filesPreview
          ) {
            openLocalLink("INDEX.html", linkAnchor);
          } else {
            showSnackbarMessage(
              "Ce lien ne mène pas vers un fichier du projet (erreur 404) !"
            );
          }
        }
      }
    },
    [ideStateDispatch, ideState.activeHtmlFile]
  );
  useEffect(
    function () {
      window.addEventListener("message", handleMessage);
      return function () {
        window.removeEventListener("message", handleMessage);
      };
    },
    [handleMessage]
  );

  const tabs = useMemo(() => {
    if (ideState.activeHtmlFile) {
      return {
        1: {
          title: tabTitle,
          icon: linkIcon ? (
            <img src={linkIcon} className={styles.link_icon} />
          ) : null,
        },
      };
    } else {
      return [];
    }
  }, [ideState.activeHtmlFile, tabTitle, linkIcon]);

  useEffect(() => {
    if (ideState.previewAnchor) {
      postMessageToIframe(
        {
          type: "scroll_to_anchor",
          anchor: ideState.previewAnchor,
        },
        "*"
      );
      ideStateDispatch({
        type: "remove_preview_anchor",
      });
    }
  }, [ideState.previewAnchor, htmlIframeNode, ideStateDispatch]);

  return (
    <TabbedWindow
      className={styles.WebPreviewWindow}
      title="Prévisualisation"
      aria-label="Prévisualisation"
      icon={<MaterialIcon.Rounded name="public" />}
      tabs={tabs}
      activeTabId={ideState.activeHtmlFile ? "1" : null}
      onMaximize={onMaximize}
      onDemaximize={onDemaximize}
      toolbarContent={
        !ideState.activeHtmlFile ? null : (
          <>
            <MaterialButtonGroup>
              <RoundedButton
                icon={<MaterialIcon.Rounded name="arrow_back" />}
                disabled={true}
                round={true}
              />
              <RoundedButton
                icon={<MaterialIcon.Rounded name="arrow_forward" />}
                disabled={true}
                round={true}
              />
              <RoundedButton
                icon={<MaterialIcon.Sharp name="refresh" />}
                disabled={ideState.settings.previewIsLive}
                round={true}
                onClick={() => ideStateDispatch({ type: "update_preview" })}
                badgeVisible={shouldRefresh ? true : false}
              />
            </MaterialButtonGroup>

            <ToolbarAddressBar>
              ~/
              {ideState.activeHtmlFile === "index.html"
                ? ""
                : ideState.activeHtmlFile}
            </ToolbarAddressBar>
            <FormControlLabel
              className={styles.live_switch}
              control={
                <Switch
                  checked={ideState.settings.previewIsLive}
                  disabled={ideState.settings.canChangePreviewMode === false}
                  onChange={() => {
                    ideStateDispatch({
                      type: "set_settings",
                      settings: {
                        previewIsLive: !ideState.settings.previewIsLive,
                      },
                    });
                  }}
                />
              }
              label={"En direct"}
            />
          </>
        )
      }
    >
      <Iframe
        title="Prévisualisation"
        src={previewHtmlBase64}
        sandbox="allow-same-origin allow-scripts allow-modals"
        ref={htmlIframeRef}
      />
      <Snackbar
        open={infoSnackbarOpen}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleCloseNewTabSnackbar}
        message={infoSnackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseNewTabSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <OpenExternalLinkDialog
        link={externalLink}
        onClose={() => setOpenExternalLinkDialogOpen(false)}
        open={openExternalLinkDialogOpen}
      />
    </TabbedWindow>
  );
}
