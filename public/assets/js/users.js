$(document).ready(function () {

  const buttons = {};
  const roles = {};
  const statuses = {};

  let filterRoleBy = "all";
  let filterStatusBy = "all";

  let startI = 0;
  let totalDisplay = 5;
  let displayCount = 0;
  let totalCount = 0;

  getUsers(true);

  function createPagination(total) {

    let totalPages = Math.ceil(total / totalDisplay);

    $(".pagination").empty();

    for (var i = 0; i < totalPages; i++) {

      let newLi = $("<li>");
      newLi.addClass("page-item");

      if (startI == i){
        newLi.addClass("active");
      }

      let newA = $("<a>");
      newA.addClass("page-link");
      newA.text(i+1);
      newA.attr("href","#Paginate");
      newA.data("start",i*totalDisplay)

      newLi.append(newA);

      $(".pagination").append(newLi);

    }
  }

  function getUsers(updatePagination) {

    $.get("/api/users", function (data) {

      $("#usersTable").empty();

      displayCount = 0;
      totalCount = 0;

      if (updatePagination) {
        for (var c = startI; c < data.length; c++) {

          if (checkSelection(data[c].role, data[c].status)) {
            totalCount++;
          }
        }

        createPagination(data.length);
      }

      for (var i = startI; i < data.length; i++) {

        if ((checkSelection(data[i].role, data[i].status)) && (displayCount < totalDisplay)) {

          displayCount++;

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
          newRole.data("id", data[i].id);

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

          roles[data[i].id] = newRole;

          newTDstatus = $("<td>");

          newStatus = $("<select>");
          newStatus.addClass("custom-select");
          newStatus.addClass("status");
          newStatus.data("id", data[i].id);

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

          statuses[data[i].id] = newStatus;

          newTDstatus.append(newStatus);

          newLogin = $("<td>");
          newLogin.addClass("align-middle");

          if (data[i].last_login != null) {
            let current_datetime = new Date(data[i].last_login);
            let formatted_date = current_datetime.getDate() + "/" + (current_datetime.getMonth() + 1) + "/" + current_datetime.getFullYear() + " - " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()
            newLogin.text(formatted_date);
          }
          else {
            newLogin.text(data[i].last_login);
          }

          newApply = $("<td>");

          newApplyBtn = $("<button>");
          newApplyBtn.addClass("btn");
          newApplyBtn.addClass("btn-success");
          newApplyBtn.addClass("apply");
          newApplyBtn.addClass("rounded");
          newApplyBtn.data("id", data[i].id);
          newApplyBtn.html('<i class="fa fa-check"></i>')

          newApply.append(newApplyBtn);
          newApplyBtn.hide();

          buttons[data[i].id] = newApplyBtn;

          newTr.append(newName, newEmail, newTDrole, newTDstatus, newLogin, newApply);
          $("#usersTable").append(newTr);
        }
      }

    });
  }

  $(document.body).on('click', ".page-link", function (e) {
    console.log(`Clicked: ${$(this).data("start")}`);
    startI = $(this).data("start");
    getUsers(true);
  });


  $(document.body).on('change', "#filterRole", function (e) {
    console.log(`Only show role of: ${$(this).val()}`);
    filterRoleBy = $(this).val();
    getUsers(true);
  });

  $(document.body).on('change', "#filterStatus", function (e) {
    console.log(`Only show status of: ${$(this).val()}`);
    filterStatusBy = $(this).val();
    getUsers(true);
  });

  $(document.body).on('change', ".status", function (e) {
    console.log(`Status change to id ${$(this).data("id")} of ${$(this).val()}`);
    buttons[$(this).data("id")].show();
  });

  $(document.body).on('change', ".role", function (e) {
    console.log(`Role change to id ${$(this).data("id")} of ${$(this).val()}`);
    buttons[$(this).data("id")].show();
  });

  $(document.body).on('click', ".apply", function (e) {
    console.log(`Apply change to id ${$(this).data("id")}`);
    console.log(`-> ${roles[$(this).data("id")].val()}`)
    console.log(`-> ${statuses[$(this).data("id")].val()}`)

    let theId = $(this).data("id");
    let newRole = roles[$(this).data("id")].val();
    let newStatus = statuses[$(this).data("id")].val();

    $.post("/api/update_user", {
      id: theId,
      role: newRole,
      status: newStatus
    })
      .then(function (data) {
        // window.location.replace("/users");
        getUsers();
        console.log("Updated");
      })
  });

  function checkSelection(whichRole, whichStatus) {

    if ((filterRoleBy == "all") && (filterStatusBy == "all")) {
      return true;
    }
    else if ((whichRole == filterRoleBy) && (filterStatusBy == "all")) {
      return true;
    }
    else if ((filterRoleBy == "all") && (whichStatus == filterStatusBy)) {
      return true;
    }
    else if ((whichRole == filterRoleBy) && (whichStatus == filterStatusBy)) {
      return true;
    }

    return false;
  }
});

