$(document).ready(function () {

  const buttons = {};
  const roles = {};
  const statuses = {};

  getUsers();

  function getUsers() {

    $.get("/api/users", function (data) {

      for (var i = 0; i < data.length; i++) {

        newTr = $("<tr>");

        newName = $("<td>");
        newName.text(data[i].firstname + " " + data[i].lastname);
        newName.addClass("align-middle");

        newEmail = $("<td>");
        newEmail.text(data[i].email);
        newEmail.addClass("align-middle");

        newTDrole = $("<td>");

        newRole = $("<select>");
        newRole.addClass("custom-select");
        newRole.addClass("role");
        newRole.data("id", i);

        newRole1 = $("<option>");
        newRole1.val("admin");
        newRole1.text("Admin");

        newRole2 = $("<option>");
        newRole2.val("parts");
        newRole2.text("Parts");

        newRole3 = $("<option>");
        newRole3.val("warehouse");
        newRole3.text("Warehouse");

        if (data[i].role == "admin") {
          newRole1.attr("selected", "selected");
        }

        if (data[i].role == "parts") {
          newRole2.attr("selected", "selected");
        }

        if (data[i].role == "warehouse") {
          newRole3.attr("selected", "selected");
        }

        newRole.append(newRole1, newRole2, newRole3);
        newTDrole.append(newRole);

        roles[i] = newRole;

        newTDstatus = $("<td>");

        newStatus = $("<select>");
        newStatus.addClass("custom-select");
        newStatus.addClass("status");
        newStatus.data("id", i);

        newStatus1 = $("<option>");
        newStatus1.val("active");
        newStatus1.text("active");

        newStatus2 = $("<option>");
        newStatus2.val("inactive");
        newStatus2.text("inactive");

        if (data[i].status == "active") {
          newStatus1.attr("selected", "selected");
        }

        if (data[i].status == "inactive") {
          newStatus2.attr("selected", "selected");
        }

        newStatus.append(newStatus1, newStatus2);

        statuses[i] = newStatus;

        newTDstatus.append(newStatus);

        newLogin = $("<td>");
        newLogin.text(data[i].last_login);
        newLogin.addClass("align-middle");

        newApply = $("<td>");

        newApplyBtn = $("<button>");
        newApplyBtn.addClass("btn");
        newApplyBtn.addClass("btn-success");
        newApplyBtn.addClass("apply");
        newApplyBtn.addClass("rounded");
        newApplyBtn.data("id", i);
        newApplyBtn.html('<i class="fa fa-check"></i>')

        newApply.append(newApplyBtn);
        newApplyBtn.hide();

        buttons[i] = newApplyBtn;

        newTr.append(newName, newEmail, newTDrole, newTDstatus, newLogin, newApply);
        $("#usersTable").append(newTr);
      }

    });
  }


  $(document.body).on('change', ".status", function (e) {
    console.log(`Status change to id ${$(this).data("id")} of ${$(this).val()}`);
    buttons[$(this).data("id")].show();
  });

  $(document.body).on('change', ".role", function (e) {
    console.log(`Role change to id ${$(this).data("id")} of ${$(this).val()}`);
    buttons[$(this).data("id")].show();
  });

  $(document.body).on('click', ".apply", function (e) {
    console.log(`Apply change to apply ${$(this).data("id")}`);
    console.log(`-> $(roles[$(this).data("id")].val())`)
    console.log(`-> $(statuses[$(this).data("id")].val())`)

    let theId = $(this).data("id")+1;
    let newRole = roles[$(this).data("id")].val();
    let newStatus = statuses[$(this).data("id")].val();

    $.post("/api/update_user", {
      id: theId,
      role: newRole,
      status: newStatus
    })
      .then(function(data) {
        window.location.replace("/users");
      })
  });


});
