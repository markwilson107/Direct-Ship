$('.card-header').on("click", function () {
    let $collapseTarget = $(this).data("target");
    console.log($collapseTarget)
    $($collapseTarget).collapse("toggle");
})

$(".req-on").each(function (index) {
    let $requestedOn = $(this).text();
    let parts = $requestedOn.split(" ");
    $(this).text(`${parts[1]} ${parts[2]} ${parts[3]}`);
})

$(".notes").each(function (index) {
    let $notesId = $(this).data("value");
    $(this).text($notesId);
})
