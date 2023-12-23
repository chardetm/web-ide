if (true) {
  if (true) {
    function _webIdeInjectedCode(currentFile) {
      function simplifyRelativePath(path) {
        path = path.replace(/^(\.\/)+/g, "");
        path = path.replace(/\/(\.\/)+/g, "/");
        return path;
      }

      // Copy from here

      function handle_file_blobs(fileBlobs) {
        const fileUrls = {};
        for (const name in fileBlobs) {
          const blob = fileBlobs[name];
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            fileUrls[name] = blobUrl;
          }
        }
        console.log(fileUrls);

        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        for (const link of cssLinks) {
          const hrefAtt = link.getAttribute("href");
          if (hrefAtt) {
            const href = simplifyRelativePath(hrefAtt);
            if (href in fileUrls) {
              link.setAttribute("href", fileUrls[href]);
            }
          }
        }

        // Replace all elements with src attribute with inline blob URLs
        const elementsWithSrc = document.querySelectorAll("*[src]");
        for (const element of elementsWithSrc) {
          const srcAtt = element.getAttribute("src");
          if (srcAtt) {
            const src = simplifyRelativePath(srcAtt);
            if (src in fileUrls) {
              element.setAttribute("src", fileUrls[src]);
            }
          }
        }

        // Handle CSS rules
        for (const sheet of document.styleSheets) {
          for (const rule of sheet.cssRules) {
            treatCssRule(rule, fileUrls);
          }
        }
      }

      window.addEventListener("message", function (event) {
        if (event.data.type === "scroll_to_anchor") {
          const anchor = event.data.anchor;
          if (anchor) {
            const element = document.getElementById(anchor);
            if (element) {
              element.scrollIntoView(true);
            }
          }
        } else if (event.data.type === "handle_file_blobs") {
          handle_file_blobs(event.data.filesBlobs);
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
      const cssRulesContainingUrl = [
        "background",
        "background-image",
        "border",
        "border-image",
        "border-image-source",
        "content",
        "cursor",
        "filter",
        "list-style",
        "list-style-image",
        "mask",
        "mask-image",
        "offset-path",
        "clip-path",
        "src",
      ];
      const anchors = document.getElementsByTagName("a");
      for (const a of anchors) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          const linkElement = e.target.closest("a");
          const href = linkElement?.getAttribute("href");
          const resolvedHref = linkElement?.href;
          const linkTarget = linkElement?.getAttribute("target");
          makeParentOpenLink(href, resolvedHref, linkTarget);
        });
      }

      function treatCssRule(rule, fileUrls) {
        if (rule.type == CSSRule.MEDIA_RULE) {
          for (const subrule of rule.cssRules) {
            treatCssRule(subrule);
          }
        } else if (rule.type == CSSRule.STYLE_RULE) {
          for (const key of rule.style) {
            if (cssRulesContainingUrl.includes(key)) {
              const oldVal = rule.style[key];
              const newVal = oldVal.replace(cssUrlRegex, (old, g1) => {
                const urlPath =
                  (g1[0] === '"' && g1.slice(-1) === '"') ||
                  (g1[0] === "'" && g1.slice(-1) === "'")
                    ? g1.substring(1, g1.length - 1)
                    : g1;
                if (!isAbsoluteRegex.test(urlPath) && urlPath in fileUrls) {
                  return "url(" + fileUrls[urlPath] + ")";
                }
                return old;
              });
              rule.style.setProperty(key, newVal);
            }
          }
        }
      }
      tellParentReady();

      // Copy to here
    }
  }
}
