function encode() {
    var obj = document.getElementById('dencoder');
    var unencoded = obj.value;
    obj.value = encodeURIComponent(unencoded).replace(/'/g, "%27").replace(/"/g, "%22");
}

function decode() {
    var obj = document.getElementById('dencoder');
    var encoded = obj.value;
    obj.value = decodeURIComponent(encoded.replace(/\+/g, " "));
}

function split() {
    $('#attDetailsTable').show();
    decode();
    //remove all previuos line breaks
    replaceInText("\n", "");
    // add new line breaks
    replaceInText("&", "&\n");

    printAtt();
    autoExpand(document.getElementById('dencoder'));
}

function go() {
    $('#dencoder').val(
        $('#dencoder').val().replace(new RegExp("\n", "g"), "")
    );
    window.open($('#dencoder').val());
    split();
}

function copyUrl() {
    $('#dencoder').val(
        $('#dencoder').val().replace(new RegExp("\n", "g"), "")
    );
    window.open($('#dencoder').val());
    split();
}

function printAtt() {
    //Show common attributes
    replaceInText("<", "&lt;");
    replaceInText(">", "&gt;");

    $('#attDetails').empty();
    showAtt("Journal Title", getAtt("jtitle"));
    showAtt("Book Title", getAtt("btitle"));
    showAtt("Article Title", getAtt("atitle"));
    showAtt("Type", getAtt("genre"));
    showAtt("E-ISSN", addDash(getAtt("eissn")));
    showAtt("ISSN", addDash(getAtt("issn")));
    showAtt("ISBN", getAtt("isbn"));
    showAtt("E-ISBN", getAtt("eisbn"));
    showAtt("Year/Date", getAtt("date"));
    showAtt("Volume", getAtt("volume"));
    showAtt("Issue", getAtt("issue"));
    showAtt("Start Page", getAtt("spage"));
    showAtt("DOI", getAtt("rft_id=info:doi"));
    showAtt("pmid", getAtt("rft_id=info:pmid"));
    showAtt("oclc", getAtt("rft_id=info:oclcnum"));
    showAtt("lccn", getAtt("rft_id=info:lccn"));
    showAtt("PCO Record", getAtt("rft_dat"));
    showAtt("Source of openURL", getAtt("rfr_id=info:sid"));

    replaceInText("&lt;", "<");
    replaceInText("&gt;", ">");
}

function getAtt(att) {
    if (att.startsWith("rft_id") || att.startsWith("rfr_id")) {
        var subStr = $('#dencoder').val().match(new RegExp("" + att + "/(.*)&", 'i'));
    } else {
        var subStr = $('#dencoder').val().match(new RegExp("" + att + "=(.*)&", 'i'));
    }
    if (subStr == null) {
        return "N/A";
    } else {
        //console.log('subStr :', subStr);
        return subStr[1];
    }
}

function replaceInText(oldStr, newStr) {
    $('#dencoder').val(
        $('#dencoder').val().replace(new RegExp(oldStr, "g"), newStr)
    );
}


function showAtt(name, data) {
    //alert(name);
    //alert(data);
    if (data == "N/A" || data == "") {
        return null;
    } else {
        $('#attDetails').append("<tr><th>" + name + "</th><td>" + data + "</td></tr>");
    }
}

function addDash(issn) {
    if ((issn.indexOf('-') > -1) || issn == "N/A" || issn == "") {
        return issn;
    }
    var insert = "-";
    var position = "4";
    return [issn.slice(0, position), insert, issn.slice(position)].join('');
}

function autoExpand(field) {
    // Reset field height
    field.style.height = 'inherit';

    // Get the computed styles for the element
    var computed = window.getComputedStyle(field);

    // Calculate the height
    var height = parseInt(computed.getPropertyValue('border-top-width'), 10) +
        parseInt(computed.getPropertyValue('padding-top'), 10) +
        field.scrollHeight +
        parseInt(computed.getPropertyValue('padding-bottom'), 10) +
        parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    field.style.height = height + 'px';

}

$(document).ready(function () {
    //Expand TextArea automatically
    document.addEventListener('input', function (event) {
        if (event.target.tagName.toLowerCase() !== 'textarea') return;
        autoExpand(event.target);
    }, false);

    $('#attDetailsTable').hide();
});