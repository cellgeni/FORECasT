$(document).ready(function () {
    $(document.body).on("click", "#download-report", function () {
                window.open("/profile"  + "?seq=" + $("#seq").val() + "&pam_idx=" + $("#pam_idx").val());

        });


});



$(document).ready(function () {

    if ($('#plot').length) {
        $('#download-report').removeAttr('hidden')
    }
});

