export function scriptInjection(
  filesBase64: Object = {}
): string {
  return `<!-- Début du script inséré pour le fonctionnement de la prévisualisation -->
  <script>
    function _webIdeInjectedCode() {
      function messageParent(message) {
        window.parent.postMessage(message, "*");
      }
      function makeParentSetFile(fileName, anchor, target) {
        messageParent({
          type: "set_active_file",
          fileName: fileName,
          anchor: anchor,
          target: target,
        });
      }
      const cssUrlRegex = /url\\(\\s*(".+?"|'.+?'|.+?)\\s*\\)/g;
      const cssRulesContainingUrl = ["background", "background-image", "border", "border-image", "border-image-source", "content", "cursor", "filter", "list-style", "list-style-image", "mask", "mask-image", "offset-path", "clip-path", "src"];
      const anchors = document.getElementsByTagName('a');
      const filesBase64 = ${JSON.stringify(filesBase64)};
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
          } else {
            const pathAndAnchor = href.split("#");
            const linkPath = pathAndAnchor[0];
            const linkAnchor = pathAndAnchor.length > 1 ? pathAndAnchor[1] : null;
            const linkTarget = e?.target.getAttribute('target');
            if (linkPath in filesBase64) {
              makeParentSetFile(linkPath, linkAnchor, linkTarget);
            } else if (linkPath === "") {
                makeParentSetFile(null, linkAnchor);
            } else if ((linkPath === "/" || linkPath === "./") && "index.html" in filesBase64) {
              makeParentSetFile("index.html", linkAnchor);
            } else {
              alert("Ce lien ne mène pas vers un fichier du projet (erreur 404) !");
            }
          }
        });
      }
      const isAbsoluteRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
  
      function treatCssRule(rule) {
        if (rule.type == CSSRule.MEDIA_RULE) {
          for (const subrule of rule.cssRules) {
            treatCssRule(subrule);
          }
        } else if (rule.type == CSSRule.STYLE_RULE) {
          const styleMap = rule.styleMap;
          for (const [key, value] of styleMap.entries()) {
            if (cssRulesContainingUrl.includes(key)) {
              debugger;
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
        }
      }
  
      for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
          treatCssRule(rule);
        }
      }
    }
    _webIdeInjectedCode();
  </script>
  <!-- Fin du script inséré pour le fonctionnement de la prévisualisation -->`;
}
