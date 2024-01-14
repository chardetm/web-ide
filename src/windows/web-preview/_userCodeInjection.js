// Web IDE injected code
function handleFileUrls(fileUrls) {
  // Handle CSS rules
  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules) {
      treatCssRule(rule, fileUrls);
    }
  }
}

window.addEventListener("message", function (event) {
  if (event.data.type === "handle_file_urls") {
    handleFileUrls(event.data.fileUrls);
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
    const linkElement = e.target.closest("a");
    const href = linkElement?.getAttribute("href");
    if (href && href.length > 0 && href[0] === "#") {
      return;
    }
    e.preventDefault();
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
