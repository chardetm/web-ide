// Web IDE injected code
function __webIdeCodeInjection() {
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
  const anchors = document.getElementsByTagName("a");
  for (const a of anchors) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const linkElement = e.target.closest("a");
      const href = linkElement?.getAttribute("href");
      if (href && href.length > 0 && href[0] === "#") {
        document.getElementById(href.substring(1)).scrollIntoView(true);
        return;
      }
      const resolvedHref = linkElement?.href;
      const linkTarget = linkElement?.getAttribute("target");
      makeParentOpenLink(href, resolvedHref, linkTarget);
    });
  }
  tellParentReady();
}
__webIdeCodeInjection();
