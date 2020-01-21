javascript: function textToClipboard(text) {
    var dummy = document.createElement("a");
    dummy.innerHTML = text;
    dummy.href = window.location.href;
    document.body.appendChild(dummy);
    const range = document.createRange();
    range.selectNode(dummy);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    const successful = document.execCommand('copy');
    document.body.removeChild(dummy);
}
url = window.location.href;
num = url.substr(url.lastIndexOf('/') + 1);
textToClipboard(num);