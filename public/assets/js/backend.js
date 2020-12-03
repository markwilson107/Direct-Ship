function updateNotes(thisElement) {
    // Gets the current request id
    console.log("pressed")
    const noteId = thisElement.data("target");
    const $newNote = $(`#add-note-${noteId}`).val().trim();
    // Sends PUT
    function sendPut(newNote) {
        $.ajax({
            method: "PUT",
            url: "/api/updaterequest",
            data: { "id": `${noteId}`, "note": newNote },
            success: () => {
                // Appends new note to notes list
                $(`#notes-list-${noteId} ul`).append(`<li><span class="bold">${currentUser}:</span> ${$newNote}</li>`);
                // Updates original notes object so it contains the new note
                originNotes.find(id => id.id === `${noteId}`).note = newNote;
                // Clears note input field 
                $(`#add-note-${noteId}`).val("");
            }
        });
    }
    // Ensures note input is not empty
    if ($newNote !== "") {
        // Finds the original notes string for corresponding id
        const thisOriginNotes = originNotes.find(id => id.id === `${noteId}`);
        // Converts original notes string to JSON object
        const originNotesObj = JSON.parse(thisOriginNotes.note);
        // Adds new note to the original notes object
        originNotesObj.push({ "user": currentUser, "note": $newNote });
        // Sends stringified notes object (original notes object + new note object)
        sendPut(JSON.stringify(originNotesObj));
    }
}

// Checks if notes submit has been pressed
$('.submit-note-btn').on('click', function () {
    updateNotes($(this));
});

// Check if notes has been submitted with enter press
$('.notes-input').on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        updateNotes($(this));
    }
});

// Requests
$("#request-header").each(function (index) {
    if ($(this).data("status") === "Alert") {
        $(this).css("backgroundColor", "rgba(255, 0, 0, 0.2)");
    } else if ($(this).data("status") === "Complete") {
        $(this).css("backgroundColor", "rgba(0, 0, 0, 0.144)");
        $(this).css("color", "rgba(0, 0, 0, 0.5)");
    }
})

// Check if request has been clicked
$('.card-header').on('click', function () {
    let $collapseTarget = $(this).data("target");
    console.log($collapseTarget)
    $($collapseTarget).collapse("toggle");
});