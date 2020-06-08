/* Based on https://github.com/lowply/copy-zendesk-link-bookmarklet */
javascript:(() => {

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

    const url = window.location.href;

    if (url.indexOf("zendesk.com") < 0) {
        console.log("This bookmarklet only works on zendesk.com.");
        return false;
    }

    const selected = document.querySelector("div[aria-label=Tabs] [aria-selected=true]");
    if (selected == null){
        console.log("Can't find the selected tab.");
        return false;
    }

    if (selected.getAttribute("data-entity-type") != "ticket"){
        console.log("The selected tab is not a ticket tab.");
        return false;
    }

    const title = selected.getAttribute("aria-label").replace(/^web /, "");
    const tid = selected.getAttribute("data-entity-id");
    
    if (title == null || tid == null){
        console.log("Can't find the title or ticket id of the selected tab.");
        return false;
    }

    bearNum = tid.trim();
    bearURL = encodeURI(url);
    bearTitle = tid.trim()+" - "+title.trim();
    bearTag = "tickets";
    bearBody = "[" + tid.trim() + " - " + title.trim() + "](" + encodeURI(url) + ")";
    callbackURL = "bear://x-callback-url/create?title="+encodeURI(bearTitle)+"&tags="+encodeURI(bearTag)+"&new_window=no&edit=yes&text="+encodeURI(bearBody)+"";
    console.log("Creating new bear note:",callbackURL);
    window.open(callbackURL);
})();