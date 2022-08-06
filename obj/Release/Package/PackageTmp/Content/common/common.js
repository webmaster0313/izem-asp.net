$('[data-toggle="tooltip"]').tooltip();

/* use loading */
$("body").addClass("loading");

$(window).on("load", function () {
    $("body").removeClass("loading");
});
/* End Section 1 */

/* use to get querystring value */
getQueryStringValue = (url) => {
    var queryString = new Array();
    if (url.split('?').length > 1) {
        var params = url.split('?')[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var key = params[i].split('=')[0];
            var value = decodeURIComponent(params[i].split('=')[1]);
            queryString[key] = value;
        }
    }
    return queryString;
}

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}
/* End Section 2 */

/* use to get default value for paging */
function defaultpagecount() {
    return 5;
}
function defaultpagesize() {
    return "15";
}
function defaultpagesize10() {
    return "10";
}
/* End Section 3 */

/* common message pop up */

function insertMsg() {
    toastr.success("Insert", "Your record successfully Inserted!");
}

function updateMsg() {
    toastr.success("Update", "Your record successfully Updated!");
}

function deleteMsg() {
    toastr.warning("Delete", "Your record successfully removed!");
}

function successMsg(title, note) {
    toastr.success(title, note);
}

function warningMsg(title, note) {
    toastr.warning(title, note);
}

/* End Section 4 */

/* delete confirmation */

deleteConfirm = () => {
    var txt;
    if (confirm("This action cannot be undone. Are you sure you want to delete record ?")) {
        txt = "Yes";
    } else {
        txt = "No";
    }
    return txt;
}

exitConfirm = () => {
    var txt;
    if (confirm("Are you sure you want to Exit?")) {
        txt = "Yes";
    } else {
        txt = "No";
    }
    return txt;
}

processConfirm = () => {
    var txt;
    if (confirm("Are you sure you want to submit?")) {
        txt = "Yes";
    } else {
        txt = "No";
    }
    return txt;
}
salaryConfirm = () => {
    var txt;
    if (confirm("Salary already submitted, are you sure you want to override the salary?")) {
        txt = "Yes";
    } else {
        txt = "No";
    }
    return txt;
}

customConfirm = (x) => {
    var txt;
    if (confirm(x)) {
        txt = "Yes";
    } else {
        txt = "No";
    }
    return txt;
}
/* End Section 5 */

/* Text Validation */

$('.decimalInputValidation').keyup(function () {
    var val = $(this).val();
    if (isNaN(val)) {
        val = val.replace(/[^0-9\.]/g, '');
        if (val.split('.').length > 2)
            val = val.replace(/\.+$/, "");
    }
    $(this).val(val);
});

function preventNonNumericalInput(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);

    if (!charStr.match(/^[0-9]+$/))
        e.preventDefault();
}

function ConvertDateforDatabase(Value) {
    let ConvertedDate = new Date(Value);
    return ConvertedDate.getFullYear() + '-' + ('0' + (ConvertedDate.getMonth() + 1)).slice(-2) + '-' + ('0' + (ConvertedDate.getDate())).slice(-2) + ' ' +
        ('0' + (ConvertedDate.getHours())).slice(-2) + ':' + ('0' + (ConvertedDate.getMinutes())).slice(-2) + ':' + ('0' + (ConvertedDate.getSeconds())).slice(-2);
}

function ConvertDateforDatabaseOnlyDate(Value) {
    let ConvertedDate = new Date(Value);
    return ConvertedDate.getFullYear() + '-' + ('0' + (ConvertedDate.getMonth() + 1)).slice(-2) + '-' + ('0' + (ConvertedDate.getDate())).slice(-2);
}

function getMonthName() {
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    return month;
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

function imageExists(url, callback) {
    var img = new Image();
    img.onload = function () { callback(true); };
    img.onerror = function () { callback(false); };
    img.src = url;
}

/* NRC */
function manageNRICpattern() {
    var NRICpattern = [{ "mask": "######-##-####" }, { "mask": "######-##-####" }];
    $('#nricpattern').inputmask({
        mask: NRICpattern,
        greedy: false,
        definitions: { '#': {} }
        //definitions: { '#': { validator: "[0-9]", cardinality: 1 } }
    });
}

/* Excel File */
var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name) {

        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

        var link = document.createElement("a");
        link.download = name;
        link.href = uri + base64(format(template, ctx));
        link.click();
    }
})();

function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    csvFile = new Blob([csv], { type: "text/csv" });
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function export_table_to_csv(html, filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);
        csv.push(row.join(","));
    }
    download_csv(csv.join("\n"), filename);
}

function add_years(dt, n) {
    return new Date(dt.setFullYear(dt.getFullYear() + n));
}