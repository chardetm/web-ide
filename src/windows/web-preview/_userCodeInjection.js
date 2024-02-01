// Web IDE injected code
function __webIdeCodeInjection() {
  function _messageParent(message) {
    window.parent.postMessage(message, "*");
  }
  function tellParentReady() {
    _messageParent({
      type: "ready",
    });
  }
  tellParentReady();
}
__webIdeCodeInjection();
