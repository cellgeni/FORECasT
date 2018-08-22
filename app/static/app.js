$(document).ready(function () {

    $(document.body).on("click", "#download-report", function () {
        a = $("#download-report"); //or grab it by tagname etc
        a.attr("href", a.attr("href") + "?seq=" + $("#seq").val() + "&pam_idx=" + $("#pam_idx").val());
    });
});


$(document).ready(function () {

    if ($('#plot').length) {
        $('#download-report').removeAttr('hidden')
    }
});



