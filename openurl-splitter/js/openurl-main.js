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
    $('.url-error').remove();
    //decode();
    //remove all previuos line breaks
    replaceInText("\n", "");
    // add new line breaks
    replaceInText("&", "&\n");
    printAtt();
    validateURL();
    ($('#error_list').children('div').length == 0) ? $('#errors').hide() : $('#errors').show();
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
    showAtt('<strong>Endpoint</strong>',getEndPoint());
    $.each( getUrlVars(), function( key, value ){
    key=key.replace(new RegExp("\n", "g"), "");
    //error logic
    if (value.indexOf(" ") > -1){
      addError("<strong>"+key+"</strong> has an unencoded space in value");
    }

    let numericalOnlyKeys = ["campaignid","adgroupid","adgroupid"];
    if (numericalOnlyKeys.includes(key)){
      if (value.match(/[^\d]/)){
        addError("<strong>"+key+"</strong> SHOULD BE ONLY DIGITS","warning");
        }
    }

    if (value.match(/[^\x20-\x7E]/)){
      addError("<strong>"+key+"</strong> might have invalid characters in it. <a href='https://www.soscisurvey.de/tools/view-chars.php' target='_blank' class='alert-link'>Test here</a>");
    }

    showAtt(key,value);
    });
    replaceInText("&lt;", "<");
    replaceInText("&gt;", ">");
}

function validateURL(){
  var url = $('#dencoder').val();
  //validation rules
  if (url.replace(/[^\?]/g, "").length > 1){
    addError('Found <strong>'+url.replace(/[^\?]/g, "").length+'</strong> question marks!');
  }

  if (url.replace(/[^\?]/g, "").length < 1){
    addError('Question mark after endpoint is missing!');
  }

  //update badges
  let numOfDanger = $('div.url-error.alert-danger').length;
  let numOfWarning = $('div.url-error.alert-warning').length;
  if (numOfDanger > 0){
    $('#error_badge').append('<span class="badge badge-pill badge-danger url-error" id="danger-badge">'+numOfDanger+'</span>');
  }
  if (numOfWarning > 0){
    $('#error_badge').append('<span class="badge badge-pill badge-warning url-error" id="danger-badge">'+numOfWarning+'</span>');
  }
}

function addError(err,type){
  //type is bootstrap type
  if (!type){
    type = 'danger';
  }
  var errorLine = "<div class='alert url-error alert-"+type+"' role='alert'>"+err+"</div>";
  console.log("error:", errorLine);
  $('#error_list').append(errorLine);
}
function getUrlVars() {
    var url=$('#dencoder').val();
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getEndPoint(){
  var url=$('#dencoder').val();
  var endpoint = $('#dencoder').val().match(new RegExp("[^?]*", 'i'));
  return endpoint[0];
}

function getAtt(att) {
    var subStr = $('#dencoder').val().match(new RegExp("" + att + "=(.*)&", 'i'));
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

    if (window.location.href.indexOf("demo=true") > -1) {
    $('#dencoder').val("https://5035.xg4ken.com/trk/v1??prof=15525&camp=50543&kct=google&kchid=1070664021&criteriaid=kwd-473717616139&campaignid=a8557496860&locphy=&adgroupid=83431984501&adpos=&cid=405991884886&networkType=search&kdv=c&kext=&kadtype=&kmc=&kpid=&campaign_name=CatchM­eIfYouCan&url=https://www.randsroofing.co.uk/fascias soffits-and-guttering");
}
});
