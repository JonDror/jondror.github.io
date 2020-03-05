$(document).ready(function () {
    bsCustomFileInput.init();
})

function handleFileSelect() {
    $('#spinner').html('');
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }

    var input = document.getElementById('fileinput');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    } else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
        alert("Please select a file before clicking 'Convert'");
    } else if (!input.files[0].name.endsWith(".xml")) {
        alert("Please choose an XML file only!");
    } else if (input.files[0].size > 30000000) {
        alert("File size is larger than 30MB and will crash your browser. \Alex says you should get a real computer :)");
    }else {
        $('#spinner').html('<i class="fa fa-spinner fa-spin"></i> Processing file');
        var longtimer = setTimeout(function(){ $('#spinner').append("<p>This will take some time....</p>"); }, 3000);
        var file = input.files[0];
        var fr = new FileReader();
        fr.onloadend = function () {
            clearTimeout(longtimer);
            $('#spinner').html('<i class="fa fa-check" aria-hidden="true"></i> Done! csv file is ready...');
        };
        fr.onload = function () {
            var data = fr.result;
            var xml = "";
            if (data !== null && data.trim().length !== 0) {

                try {
                    xml = $.parseXML(data);
                } catch (e) {
                    alert('Error parsing xml - Check console log');
                    console.error('Error parsing xml', e);
                    throw e;
                }

                var x2js = new X2JS();

                data = x2js.xml2json(xml);
                jsonTocsvbyjson(data);

            }
        };
        fr.readAsText(file);
        //fr.readAsDataURL(file);
        console.log('fr :', fr);
    }
}

function jsonTocsvbyjson(data, returnFlag) {

    arr = [];
    flag = true;

    var header = "";
    var content = "";
    var headFlag = true;

    try {

        var type1 = typeof data;

        if (type1 != "object") {
            data = processJSON($.parseJSON(data));
        } else {
            data = processJSON(data);
        }

    } catch (e) {
        if (returnFlag === undefined || !returnFlag) {
            console.error("Error in Convert to CSV");
        } else {
            console.error("Error in Convert :" + e);
        }
        return false;
    }

    $.each(data, function (k, value) {
        if (k % 2 === 0) {
            if (headFlag) {
                if (value != "end") {
                    header += value + ",";
                } else {
                    // remove last colon from string
                    header = header.substring(0, header.length - 1);
                    headFlag = false;
                }
            }
        } else {
            if (value != "end") {
                var temp = data[k - 1];
                if (header.search(temp) != -1) {
                    content += value + ",";
                }
            } else {
                // remove last colon from string
                content = content.substring(0, content.length - 1);
                content += "\n";
            }
        }

    });

    if (returnFlag === undefined || !returnFlag) {
        //$("#csvArea").val(header + "\n" + content);
        var blob = new Blob([header + "\n" + content], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(blob, document.getElementById('fileinput').files[0].name.replace(".xml", "") + "-xml2csv.csv");
    } else {
        return (header + "\n" + content);
    }
}

function processJSON(data) {

    $.each(data, function (k, data1) {

        var type1 = typeof data1;

        if (type1 == "object") {

            flag = false;
            processJSON(data1);
            arr.push("end");
            arr.push("end");

        } else {
            arr.push(k, data1);
        }

    });
    return arr;
}

function gettime() {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + '-' + time;
    return dateTime;
}