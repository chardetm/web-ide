export function scriptInjection(
  assetsLocation: string = "",
  allowedLinks: string[] = []
): string {
  return `<!-- Début du script inséré pour le fonctionnement de la prévisualisation -->
  <script>
    function _webIdeInjectedCode() {
      function messageParent(message) {
        window.parent.postMessage(message, "*");
      }
      function makeParentSetFile(fileName, anchor) {
        messageParent({
          type: "set_active_file",
          fileName: fileName,
          anchor: anchor
        });
      }
      const anchors = document.getElementsByTagName('a');
      const allowedLinks = ${JSON.stringify(allowedLinks)};
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
            if (allowedLinks.includes(linkPath)) {
              makeParentSetFile(linkPath, linkAnchor);
            } else if ((linkPath === "/" || linkPath === "./") && allowedLinks.includes("index.html")) {
              makeParentSetFile("index.html", linkAnchor);
            } else {
              alert("Ce lien ne mène pas vers un fichier du projet (erreur 404) !");
            }
          }
        });
      }
      const isAbsoluteRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
      const images = document.getElementsByTagName('img');
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
    }
    _webIdeInjectedCode();
  </script>
  <!-- Fin du script inséré pour le fonctionnement de la prévisualisation -->`;
}
