import React, { useEffect, useState, useCallback, useMemo } from "react";

import { TabbedWindow } from "../features/windows/WindowWithTabs";
import { ToolbarAddressBar } from "../features/windows/contents";
import {
  RoundedButton,
  MaterialButtonGroup,
  MaterialIcon,
} from "../features/ui/materialComponents";

import styles from "./WebPreviewWindow.module.scss";
import {
  useIDEChosenState,
  useIDEChosenStateDispatch,
} from "../contexts/IDEStateProvider";
import { noPageSelectedHTML } from "../content/files";
import { FormControlLabel, Switch } from "@mui/material";

function simplifyRelativePath(path) {
  path = path.replace(/^(\.\/)+/g, "");
  path = path.replace(/\/(\.\/)+/g, "/");
  return path;
}

function scriptInjection(assetsLocation = "", allowedLinks = []) {
  return `<!-- Début du script inséré pour le fonctionnement de la prévisualisation -->
<script>
  function messageParent(message) {
    window.parent.postMessage(message, "*");
  }
  function makeParentSetFile(fileName) {
    messageParent({ type: "set_active_file", fileName: fileName });
  }
  var anchors = document.getElementsByTagName('a');
  var alowedLinks = ${JSON.stringify(allowedLinks)};
  for (const a of anchors) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        const href = e?.target.getAttribute('href');
        const resolvedHref = e?.target?.href;
        const target = e?.target?.href;
        if (!target) {
          alert("Lien vide !");
        } else if (e?.target?.host !== window.location.host) {
          confirm("Ce lien externe ne peut pas être ouvert dans la prévisualisation. Voulez-vous ouvrir la page suivante dans un nouvel onglet ?\\n\\n" + resolvedHref) && window.open(resolvedHref, '_blank');
        } else if (alowedLinks.includes(href)) {
          makeParentSetFile(href);
        } else if ((href === "/" || href === "./") && alowedLinks.includes("index.html")) {
          makeParentSetFile("index.html");
        } else {
          alert("Ce lien ne mène pas vers un fichier du projet (erreur 404) !");
        }
      });
  }
  var isAbsoluteRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
  var images = document.getElementsByTagName('img');
  for (const img of images) {
    src = img.getAttribute('src');
    if (!isAbsoluteRegex.test(src)) {
      img.setAttribute('src', \`${assetsLocation}\` + src);
    }
  }

  function treatCssRule(rule) {
    if (rule.type == CSSRule.MEDIA_RULE) {
      for (const subrule of rule.cssRules) {
        treatCssRime(subrule);
      }
    } else if (rule.type == CSSRule.STYLE_RULE) {
      const styleMap = rule.styleMap;
      for (const [key, value] of styleMap.entries()) {
        if (key == "background-image") {
          const strVal = value.toString();
          if (strVal.startsWith("url")) {
            const path = strVal.substring(5, strVal.length-2);
            if (!isAbsoluteRegex.test(path)) {
              const newStrVal = \`url('${assetsLocation}\${path}')\`;
              styleMap.set("background-image", newStrVal);
            }
          }
        }
      }
    }
  }

  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules) {
      treatCssRule(rule);
    }
  }
</script>
<!-- Fin du script inséré pour le fonctionnement de la prévisualisation -->`;
}

function performHtmlUpdate(
  htmlCode,
  filesPreviewData,
  assetsLocation,
  htmlIframeNode
) {
  const htmlDocument = new DOMParser().parseFromString(htmlCode, "text/html");
  const titleElement = htmlDocument.head?.querySelector("title");
  const title = titleElement ? titleElement.textContent : null;
  if (Object.keys(filesPreviewData).length > 0) {
    // Replace all links to css files with inline css
    const cssLinks = htmlDocument.querySelectorAll('link[rel="stylesheet"]');
    for (const link of cssLinks) {
      const hrefAtt = link.getAttribute("href");
      if (hrefAtt) {
        const styleNode = htmlDocument.createElement("style");
        const href = simplifyRelativePath(hrefAtt);
        if (href in filesPreviewData) {
          styleNode.innerHTML = filesPreviewData[href].content;
          link.parentNode.insertBefore(styleNode, link);
          link.parentNode.removeChild(link);
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
          image.setAttribute("src", filesPreviewData[src].content);
        }
      }
    }

    // Replace all links to js files with inline js
    const jsScripts = htmlDocument.querySelectorAll("script[src]");
    for (const script of jsScripts) {
      const srcAtt = script.getAttribute("src");
      if (srcAtt) {
        const src = simplifyRelativePath(srcAtt);
        if (src in filesPreviewData) {
          script.innerHTML = filesPreviewData[src].content;
          script.removeAttribute("src");
        }
      }
    }
  }

  const newHtmlCode = htmlDocument.documentElement
    ? htmlDocument.documentElement.outerHTML
    : "";
  const bodyCloseWithScript = `</body>
  ${scriptInjection(assetsLocation, Object.keys(filesPreviewData))}`;
  const newHtmlCodeNoLink = newHtmlCode.replace("</body>", bodyCloseWithScript);
  const doc = htmlIframeNode.contentWindow.document;
  doc.open();
  doc.write(newHtmlCodeNoLink);
  doc.close();
  return title;
}

const Iframe = React.forwardRef(({ title, sandbox }, ref) => {
  return (
    <iframe
      title={title}
      className={styles.iframe}
      sandbox={sandbox}
      ref={ref}
    ></iframe>
  );
});

export function WebPreviewWindow({
  assetsLocation = "",
  onMaximize,
  onDemaximize,
}) {
  const ideState = useIDEChosenState();
  const ideStateDispatch = useIDEChosenStateDispatch();
  const [tabTitle, setTabTitle] = useState(ideState.activeHtmlFile);
  const [htmlIframeNode, setHtmlIframeNode] = useState(null);
  const htmlIframeRef = useCallback((node) => {
    setHtmlIframeNode(node);
  }, []);

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
      const title = performHtmlUpdate(
        htmlCode,
        ideState.filesPreview,
        assetsLocation,
        htmlIframeNode
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
    }
  }, [
    htmlCode,
    ideState.filesPreview,
    assetsLocation,
    htmlIframeNode,
    ideState.activeHtmlFile,
  ]);

  // TODO: move to the right place (in the preview)
  const handleMessage = useCallback(
    (event) => {
      const { data } = event;
      if (data.type === "set_active_file") {
        ideStateDispatch({ type: "set_active_file", fileName: data.fileName });
      }
    },
    [ideStateDispatch]
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
        },
      };
    } else {
      return [];
    }
  }, [ideState.activeHtmlFile, tabTitle]);

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

            <ToolbarAddressBar>~/{ideState.activeHtmlFile}</ToolbarAddressBar>
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
        sandbox="allow-scripts allow-modals allow-same-origin allow-popups"
        ref={htmlIframeRef}
      />
    </TabbedWindow>
  );
}
