import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

import userCodeInjection from "./_userCodeInjection.js?raw";
import previewContainerCode from "./_previewContainerCode.html?raw";

import { TabbedWindow } from "../../features/windows/WindowWithTabs";
import { ToolbarAddressBar } from "../../features/windows/contents";
import {
  RoundedButton,
  MaterialButtonGroup,
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
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import RefreshSharpIcon from "@mui/icons-material/RefreshSharp";

import { isAbsoluteUrl, objectMap, useInterval } from "../../utils";
import { FilePreview } from "src/state/types";
import FormSubmitDialog from "../dialogs/FormSubmitDialog";
import { useAppStore } from "../../store";

const MESSAGE_INTERVAL_MS = 500;

function simplifyRelativePath(path) {
  path = path.replace(/^(\.\/)+/g, "");
  path = path.replace(/\/(\.\/)+/g, "/");
  return path;
}

function getFileBlobsFromFilesPreviewData(filesPreviewData: {
  [fileName: string]: FilePreview;
}) {
  return objectMap(filesPreviewData, (fileName, previewData) => {
    return [fileName, previewData.blob];
  });
}

function performHtmlUpdate(htmlCode, filesPreviewData) {
  const fileBlobs = getFileBlobsFromFilesPreviewData(filesPreviewData);
  const htmlDocument = new DOMParser().parseFromString(htmlCode, "text/html");
  const titleElement = htmlDocument.head?.querySelector("title");
  const title = titleElement ? titleElement.textContent : null;
  const linkIconElement = htmlDocument.head?.querySelector('link[rel="icon"]');
  let linkIconData = null;
  if (linkIconElement) {
    const hrefAtt = linkIconElement.getAttribute("href");
    if (hrefAtt) {
      if (isAbsoluteUrl(hrefAtt)) {
        linkIconData = hrefAtt;
      } else {
        const href = simplifyRelativePath(hrefAtt);
        if (href in filesPreviewData) {
          linkIconData = fileBlobs[href];
        }
      }
    }
  }

  // Add script injection
  const script = htmlDocument.createElement("script");
  script.innerHTML = userCodeInjection;
  if (htmlDocument.body) {
    htmlDocument.body.appendChild(script);
  } else {
    htmlDocument.appendChild(script);
  }

  const newHtmlCode = htmlDocument.documentElement
    ? htmlDocument.documentElement.outerHTML
    : "";
  return {
    title: title,
    htmlContent: newHtmlCode,
    linkIconData: linkIconData,
    fileBlobs: fileBlobs,
  };
}

export default function WebPreviewWindow({ onMaximize, onDemaximize }) {
  const ideState = useIDEChosenState();
  const ideStateDispatch = useIDEChosenStateDispatch();
  const [tabTitle, setTabTitle] = useState<ReactNode>(ideState.activeHtmlFile);
  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
  const [infoSnackbarMessage, setInfoSnackbarMessage] = useState("");
  const [linkIcon, setLinkIcon] = useState(null);
  const [htmlIframeNode, setHtmlIframeNode] = useState(null);
  const htmlIframeRef = useCallback((node) => {
    setHtmlIframeNode(node);
  }, []);

  const [externalLinkDialogOpen, setExternalLinkDialogOpen] = useState(false);
  const [externalLink, setExternalLink] = useState(null);

  const [formSubmitDialogOpen, setFormSubmitDialogOpen] = useState(false);
  const [formSubmitData, setFormSubmitData] = useState<Object>(null);
  const [formSubmitMethod, setFormSubmitMethod] = useState<
    "post" | "get" | String | null
  >(null);
  const [formSubmitAction, setFormSubmitAction] = useState<string | null>(null);

  const [iframeIsReady, setIframeIsReady] = useState(false);
  const [iframeUpdateMessageNumber, setIframeUpdateMessageNumber] = useState(0);
  const [iframeUpdateNextMessage, setIframeUpdateNextMessage] = useState(null);

  const previewIframeUrl = useAppStore((state) => state.previewIframeUrl);

  useInterval(() => {
    if (iframeIsReady) {
      if (iframeUpdateNextMessage) {
        setIframeUpdateNextMessage((message) => {
          doPostMessageToIframe({
            ...message,
            messageNumber: iframeUpdateMessageNumber,
          });
          return null;
        });
        setIframeUpdateMessageNumber((oldNumber) => oldNumber + 1);
      }
    }
  }, MESSAGE_INTERVAL_MS);

  function doPostMessageToIframe(message) {
    if (iframeIsReady) {
      htmlIframeNode?.contentWindow?.postMessage(message, "*");
    }
  }

  function postMessageToIframe(message) {
    if (message.type === "update") {
      setIframeUpdateNextMessage(message);
    } else {
      doPostMessageToIframe(message);
    }
  }

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
    if (ideState.activeHtmlFile) {
      const filePreviewData = ideState.filesPreview[ideState.activeHtmlFile];
      if (filePreviewData.contentType !== "text") {
        // To make TypeScript happy, should never happen
        return noPageSelectedHTML();
      }
      return filePreviewData.content;
    } else {
      return noPageSelectedHTML();
    }
  }, [ideState.activeHtmlFile, ideState.filesPreview]);

  useEffect(() => {
    if (!htmlIframeNode || !iframeIsReady) {
      return;
    }
    const { title, htmlContent, linkIconData, fileBlobs } = performHtmlUpdate(
      htmlCode,
      ideState.filesPreview
    );
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
    postMessageToIframe({
      type: "update",
      fileBlobs: fileBlobs,
      html: htmlContent,
      htmlFile: ideState.activeHtmlFile,
      anchor: ideState.previewAnchor,
    });
    if (ideState.previewAnchor) {
      ideStateDispatch({
        type: "remove_preview_anchor",
      });
    }
  }, [
    htmlCode,
    ideState.filesPreview,
    htmlIframeNode,
    ideState.activeHtmlFile,
    iframeIsReady,
  ]);

  const showSnackbarMessage = (message) => {
    setInfoSnackbarMessage(message);
    setInfoSnackbarOpen(true);
  };

  const openLocalLink = (link: string, anchor: string, target?: string) => {
    const fileToOpen = link || ideState.activeHtmlFile;
    if (fileToOpen === ideState.activeHtmlFile) {
      // There won't be any change in the state
      postMessageToIframe({
        type: "update_anchor",
        anchor: anchor,
      });
    } else {
      ideStateDispatch({
        type: "set_active_file",
        fileName: fileToOpen,
        anchor: anchor,
      });
    }

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
    setExternalLinkDialogOpen(true);
  };

  const handleMessage = useCallback(
    (event) => {
      const { data } = event;
      if (data.type === "ready") {
        setIframeIsReady(true);
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
        } else if (isAbsoluteUrl(href)) {
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
      } else if (data.type === "submit_form") {
        console.log("Form submited", data.action, data.method, data.data);
        setFormSubmitData(data.data);
        setFormSubmitAction(data.action || ideState.activeHtmlFile);
        setFormSubmitMethod(data.method?.toLowerCase?.() || "get");
        setFormSubmitDialogOpen(true);
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

  return (
    <TabbedWindow
      className={styles.WebPreviewWindow}
      title="Prévisualisation"
      aria-label="Prévisualisation"
      icon={<PublicRoundedIcon />}
      tabs={tabs}
      activeTabId={ideState.activeHtmlFile ? "1" : null}
      onMaximize={onMaximize}
      onDemaximize={onDemaximize}
      toolbarContent={
        !ideState.activeHtmlFile ? null : (
          <>
            <MaterialButtonGroup>
              <RoundedButton
                icon={<ArrowBackRoundedIcon />}
                disabled={true}
                round={true}
              />
              <RoundedButton
                icon={<ArrowForwardRoundedIcon />}
                disabled={true}
                round={true}
              />
              <RoundedButton
                icon={<RefreshSharpIcon />}
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
                      type: "set_preview_auto_refresh",
                      value: !ideState.settings.previewIsLive,
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
      <iframe
        className={styles.preview_iframe}
        title="Prévisualisation"
        src={previewIframeUrl === "" ? undefined : previewIframeUrl}
        srcDoc={previewIframeUrl === "" ? previewContainerCode : undefined}
        sandbox="allow-same-origin allow-scripts allow-modals allow-forms"
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
            onClick={() => handleCloseNewTabSnackbar(null, null)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <OpenExternalLinkDialog
        link={externalLink}
        onClose={() => setExternalLinkDialogOpen(false)}
        open={externalLinkDialogOpen}
      />
      <FormSubmitDialog
        method={formSubmitMethod}
        action={formSubmitAction}
        data={formSubmitData}
        onClose={() => setFormSubmitDialogOpen(false)}
        open={formSubmitDialogOpen}
      />
    </TabbedWindow>
  );
}
