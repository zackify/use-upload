global.XMLHttpRequest = function () {
  let addEventListener = (name, callback) =>
    global.xhrListener?.(name, callback);
  let fake = () => true;
  return {
    open: global.xhrOpen ?? fake,
    send: global.xhrSend ?? fake,
    upload: {
      addEventListener,
    },
    addEventListener,
    setRequestHeader: global.xhrRequestHeader ?? fake,
    getAllResponseHeaders: () => "Test: The test response header",
  };
};
