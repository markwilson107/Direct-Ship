$('.card-header').on("click", function() {
    let $collapseTarget = $(this).data("target");
    console.log($collapseTarget)
    $($collapseTarget).collapse("toggle");
})