const MIN_INDEX = 11;

$(document).ready(function () {
    $(document.body).on("click", "#download-report", function () {
        window.open("/profile" + "?seq=" + $("#seq").val() + "&pam_idx=" + $("#pam_idx").val());

    });


});

$(document).ready(function () {
    $(document.body).on("change", "#seq", function () {
        $("#pam_idx").val("");
    })
});

function recount(seq, current_idx) {
    if (!current_idx)
        current_idx = 0;
    current_idx = parseInt(current_idx);
    let new_idx = seq.indexOf("GG", current_idx + 2) - 1;
    if (new_idx > 0 && new_idx < MIN_INDEX) {
        let next_idx = seq.indexOf("GG", new_idx + 2) - 1;
        if (next_idx && next_idx > 0)
            return recount(seq, new_idx);
        else
            $("#pam_idx").val("Sequence too short or PAM too close to edge of sequence (must have at least 10nt either side of cut site)");
    } else if (new_idx < 0)
        return recount(seq, 0);
    else
        return new_idx;
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
        let current_idx = pam_idx.val();
        let new_idx = recount(seq, current_idx);
        if (new_idx)
            pam_idx.val(new_idx);

    });
});


$(document).ready(function () {

    if ($('#plot').length) {
        $('#download-report').removeAttr('hidden')
    }
});

