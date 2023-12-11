export function scriptInjection(
  currentFile: string,
  filesBase64: Object = {},
): string {
  return `<!-- Début du script inséré pour le fonctionnement de la prévisualisation -->
  <script>
    function _webIdeInjectedCode() {
      const currentFile = ${JSON.stringify(currentFile)};
      const filesBase64 = ${JSON.stringify(filesBase64)};
      window.addEventListener("message", function (event) {
        if (event.data.type === "scroll_to_anchor") {
          const anchor = event.data.anchor;
          if (anchor) {
            const element = document.getElementById(anchor);
            if (element) {
              element.scrollIntoView(true);
            }
          }
        }
      });

      function _messageParent(message) {
        window.parent.postMessage(message, "*");
      }
      function makeParentOpenLink(href, resolvedHref, target) {
        _messageParent({
          type: "open_link",
          href,
          resolvedHref,
          target,
        });
      }
      function tellParentReady() {
        _messageParent({
          type: "ready",
          file: currentFile,
        });
      }
      const cssUrlRegex = /url\\(\\s*(".+?"|'.+?'|.+?)\\s*\\)/g;
      const isAbsoluteRegex = new RegExp("^(?:[a-z]+:)?//", "i");
      const cssRulesContainingUrl = ["background", "background-image", "border", "border-image", "border-image-source", "content", "cursor", "filter", "list-style", "list-style-image", "mask", "mask-image", "offset-path", "clip-path", "src"];
      const anchors = document.getElementsByTagName('a');
      for (const a of anchors) {
        a.addEventListener('click', function(e) {
          e.preventDefault();
          const linkElement = e.target.closest('a');
          const href = linkElement?.getAttribute('href');
          const resolvedHref = linkElement?.href;
          const linkTarget = linkElement?.getAttribute('target');
          makeParentOpenLink(href, resolvedHref, linkTarget);
        });
      }
  
      function treatCssRule(rule) {
        if (rule.type == CSSRule.MEDIA_RULE) {
          for (const subrule of rule.cssRules) {
            treatCssRule(subrule);
          }
        } else if (rule.type == CSSRule.STYLE_RULE) {
          /*
          const styleMap = rule.styleMap;
          for (const [key, value] of styleMap.entries()) {
            if (cssRulesContainingUrl.includes(key)) {
              const oldVal = value.toString();
              const newVal = oldVal.replace(cssUrlRegex, (old, g1) => {
                const urlPath =
                  (g1[0] === '"' && g1.slice(-1) === '"') ||
                  (g1[0] === "'" && g1.slice(-1) === "'")
                    ? g1.substring(1, g1.length - 1)
                    : g1;
                if (!isAbsoluteRegex.test(urlPath) && urlPath in filesBase64) {
                  return "url(" + filesBase64[urlPath] + ")";
                }
                return old;
              });
              styleMap.set(key, newVal);
            }
          }
          */
          for (const key of rule.style) {
            if (cssRulesContainingUrl.includes(key)) {
              const oldVal = rule.style[key];
              const newVal = oldVal.replace(cssUrlRegex, (old, g1) => {
                const urlPath =
                  (g1[0] === '"' && g1.slice(-1) === '"') ||
                  (g1[0] === "'" && g1.slice(-1) === "'")
                    ? g1.substring(1, g1.length - 1)
                    : g1;
                if (!isAbsoluteRegex.test(urlPath) && urlPath in filesBase64) {
                  return "url(" + filesBase64[urlPath] + ")";
                }
                return old;
              });
              rule.style.setProperty(key, newVal);
            }
          }
        }
      }
  
      for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
          treatCssRule(rule);
        }
      }
      tellParentReady();
    }
    _webIdeInjectedCode();
  </script>
  <!-- Fin du script inséré pour le fonctionnement de la prévisualisation -->`;
}
