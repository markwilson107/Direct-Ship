$(document).ready(function () {

    function updateNotes(thisElement) {
        // Gets the current request id
        console.log("pressed")
        const noteId = thisElement.data("target");
        const $newNote = $(`#add-note-${noteId}`).val().trim();
        // Sends PUT
        function sendPut(newNote) {
            $.ajax({
                method: "PUT",
                url: "/api/update_request/" + noteId,
                data: { "notes": `${newNote}` },
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

    // Check if request has been clicked
    $('.card-header').on('click', function () {
        let $collapseTarget = $(this).data("target");
        console.log($collapseTarget)
        $($collapseTarget).collapse("toggle");
    });

    // Requests colour coding and status buttons
    $(".request-block").each(function (index) {
        if ($(this).data("status") === "Alert") {
            $(this).find(".request-header").css("backgroundColor", "rgba(255, 0, 0, 0.2)");
            $(this).find(".alert-btn").css("display", "none");
            $(this).find(".resolved-btn").css("display", "block");
            $(this).find(".cancel-btn").css("display", "block");
        } else if ($(this).data("status") === "Complete") {
            $(this).find(".request-header").css("backgroundColor", "rgba(0, 0, 0, 0.05)");
            $(this).find(".request-header").css("color", "rgba(0, 0, 0, 0.6)");
            $(this).find(".complete-btn").css("display", "none");
            $(this).find(".alert-btn").css("display", "none");
            $(this).find(".edit-btn").css("display", "none");
            $(this).find(".cancel-btn").css("display", "none");
            $(this).find(".incomplete-btn").css("display", "block");
            $(this).find(".archive-btn").css("display", "block");
        } else if ($(this).data("status") === "New") {
            $(this).find(".request-header").css("backgroundColor", "rgba(178, 215, 226, 0.315)");
        }else if ($(this).data("status") === "Cancelled") {
            $(this).find(".request-header").css("backgroundColor", "rgba(0, 0, 0, 0.05)");
            $(this).find(".request-header").css("color", "rgba(0, 0, 0, 0.6)");
        }
    });

    function updateStatus(id, status) {
        $.ajax({
            method: "PUT",
            url: "/api/update_request/" + id,
            data: { "StatusId": `${status}` },
            success: () => {
                location.reload();
            }
        });
    }

    // Status buttons
    $('.alert-btn, .resolved-btn, .complete-btn, .incomplete-btn, .archive-btn, .cancel-btn').on('click', function () {
        updateStatus($(this).data("target"), $(this).data("id"));
    });

    // DEFAULT VALUES
    let currentRequestCount = 0;
    let checkRequests;

    // CHECK FIRST TIME
    $.ajax({
        method: "GET",
        url: "/api/countrequests",
        success: (results) => {
            // SET INITIAL COUNT
            tempRequestCount = parseInt(results);
            currentRequestCount = tempRequestCount;
            // SET TIMER
            checkRequests = setInterval(checkNewRequests, 60000);
        }
    });

    // CHECK FOR NEW REQUESTS
    function checkNewRequests() {
        $.ajax({
            method: "GET",
            url: "/api/countrequests",
            success: (results) => {
                tempRequestCount = parseInt(results);

                if (tempRequestCount > currentRequestCount) {
                    if ($('.newrequestsalert~').contents().length == 0) {
                        newButton = $("<button>");
                        newButton.attr("class", "btn btn-success ml-auto mb-3 refresh");
                        newButton.html('<i class="fa fa-bell"></i> New requests')

                        $('.newrequestsalert').append(newButton);
                        $('.newrequestcontainer').attr("style", "display:block")
                    }
                }
                currentRequestCount = tempRequestCount;
            }
        });
    }

    // REFRESH PAGE BUTTON
    $(document.body).on('click', ".refresh", function (e) {
        location.reload();
    });

    // EDIT DASHBOARD BUTTON
    $(document.body).on('click', ".edit-btn", function (e) {

        let editBlock = $(this).data("target");
        let allFields = $(`*[data-edit="${editBlock}"]`);
        let editButton = $(`*[data-update="${editBlock}"]`);

        for (var i = 0; i < allFields.length; i++) {
            allFields[i].removeAttribute("readonly");
        }

        $(editButton[0]).attr("class", "btn btn-warning update-btn");
        $(editButton[0]).text("Update")

    });

    const theBranches = ["Albany","Bunbury","Forrestfield","Geraldton","Guildford","Port Hedland","Spearwood"]

    $(document.body).on('click', ".update-btn", function (e) {

        let updateBlock = $(this).data("target");
        let allFields = $(`*[data-edit="${updateBlock}"]`);
        let editButton = $(`*[data-update="${updateBlock}"]`);

        let newValues = [];

        for (var i = 0; i < allFields.length; i++) {
            newValues.push($(allFields[i]).val());
            allFields[i].setAttribute("readonly", true);
        }

        $.ajax({
            method: "PUT",
            url: "/api/update_request/" + updateBlock,
            data: {
                "customerName": `${newValues[0]}`,
                "customerContact": `${newValues[1]}`,
                "customerPhone": `${newValues[2]}`,
                "customerAddress": `${newValues[3]}`,
                "ibt": `${newValues[4]}`,
                "proforma": `${newValues[5]}`,
                "requiringBranch": `${theBranches.indexOf(newValues[6])+1}`,
                "freightCostAllocation": `${newValues[7]}`,
                "freightAccount": `${newValues[8]}`,
                "parts": `${newValues[9]}`
            },
            success: () => {
                $(editButton[0]).attr("class", "btn btn-light edit-btn");
                $(editButton[0]).text("Edit")

                updateStatus(updateBlock, 2);
            }
        });       

    });

})