var current_pos = 0;
var previous_idx = -2;

$(document).ready(function () {
    $(document.body).on("click", "#download-report", function () {
        window.open("/profile" + "?seq=" + $("#seq").val() + "&pam_idx=" + $("#pam_idx").val());

    });


});

$(document).ready(function () {
    $(document.body).on("change", "#seq", function () {
        current_pos = 0;
    })
});

function recount(seq, matches) {
    let result = matches[window.current_pos];
    let current_idx = seq.indexOf(result, window.previous_idx + 2) - 1;
    if (window.current_pos == matches.length) {
        window.current_pos = 0;
        window.previous_idx = -2;
        return recount(seq, matches);
    } else {
        window.current_pos += 1;
        window.previous_idx = current_idx;
    }
    return current_idx;
}

$(document).ready(function () {
    $(document.body).on("click", "#suggest-idx", function () {
        let seq = $("#seq").val();
        let pam_idx = $("#pam_idx");
        let matches = seq.match(/GG+/gm);
        if ((matches == null) || !(matches.length)) {
            pam_idx.val("Empty or non-PAM sequence");
            return;
        }
        let current_idx = recount(seq, matches);
        pam_idx.val(current_idx);

    });
});


$(document).ready(function () {

    if ($('#plot').length) {
        $('#download-report').removeAttr('hidden')
    }
});

