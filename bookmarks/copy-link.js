javascript: 
url = window.location.href;
num = url.substr(url.lastIndexOf('/') + 1);
title = ''; 
if (url.lastIndexOf('zendesk.com') > 0) {
    title = ' - ' + copyFromZendesk()[0];
}
if (url.lastIndexOf('atlassian.net') > 0) {
    title = ' - ' + document.getElementById('summary-val').innerText;
}
textToClipboard(num + title);

function textToClipboard(text) {
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

function copyFromZendesk() {
    const url = window.location.href;

    if (url.indexOf("zendesk.com") < 0) {
        console.log("This bookmarklet only works on zendesk.com.");
        return false;
    }

    const selected = document.querySelector("div[aria-label=Tabs] [aria-selected=true]");
    if (selected == null) {
        console.log("Can't find the selected tab.");
        return false;
    }

    if (selected.getAttribute("data-entity-type") != "ticket") {
        console.log("The selected tab is not a ticket tab.");
        return false;
    }

    const title = selected.getAttribute("aria-label").replace(/^web /, "");
    const tid = selected.getAttribute("data-entity-id");

    if (title == null || tid == null) {
        console.log("Can't find the title or ticket id of the selected tab.");
        return false;
    }

    params = [title.trim(),tid.trim()];
    return params;
}