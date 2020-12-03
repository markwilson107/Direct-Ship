$(document).ready(function () {

  // SET DEFAULT OBJECTS FOR FUTURE REFERENCE
  const buttons = {};
  const roles = {};
  const statuses = {};

  // SET FILTER TO DEFAULT
  let filterRoleBy = "all";
  let filterStatusBy = "all";

  // DECLARE VARIABLES
  let startI = 0;
  let totalDisplay = 10;
  let displayCount = 0;
  let totalCount = 0;

  // DEFAULT FUNCTION
  getUsers();

  // CREATE BOOTSTRAP PAGINATION
  function createPagination(total) {

    // CHECK TOTAL PAGES REQUIRED
    let totalPages = Math.ceil(total / totalDisplay);

    // CLEAR OLD PAGINATION
    $(".pagination").empty();

    // ONLY PERFORM PAGINATION IF MORE THAN 1 PAGE
    if (totalPages > 1) {

      for (var i = 0; i < totalPages; i++) {

        let newLi = $("<li>");
        newLi.addClass("page-item");

        // SET ACTIVE CLASS
        if ((startI >= i * totalDisplay) && (startI < (i + 1) * totalDisplay)) {
          newLi.addClass("active");
        }

        // SETUP PAGINATION BUTTONS
        let newA = $("<a>");
        newA.addClass("page-link");
        newA.text(i + 1);
        newA.attr("href", "#Paginate");
        newA.data("start", i * totalDisplay)

        newLi.append(newA);
        $(".pagination").append(newLi);

      }
    }
  }

  // GET USERS FUNCTION
  function getUsers() {

    // GET CURRENT USERS
    $.get("/api/users", function (data) {

      $("#usersTable").empty();

      displayCount = 0;
      totalCount = 0;

      // CHECK TOTAL RESULTS TO DISPLAY
      for (var c = 0; c < data.length; c++) {

        if (checkSelection(data[c].role, data[c].status)) {
          totalCount++;
        }
      }

      // CREATE PAGINATION
      createPagination(totalCount);

      // LOOP THROUGH START POINT TO END
      for (var i = startI; i < data.length; i++) {

        // CHECK IF ROW MATCHES CRITERIA
        if ((checkSelection(data[i].role, data[i].status)) && (displayCount < totalDisplay)) {

          displayCount++;

          // NEW TABLE ROW
          newTr = $("<tr>");

          // USER NAME
          newName = $("<td>");
          newName.text(`${data[i].firstname} ${data[i].lastname}`);
          newName.addClass("align-middle");

          // USER EMAIL
          newEmail = $("<td>");
          newEmail.text(data[i].email);
          newEmail.addClass("align-middle");

          // ROLE DROP DOWN
          newTDrole = $("<td>");

          newRole = $("<select>");
          newRole.attr("class", "custom-select role");
          newRole.data("id", data[i].id);

          // ROLE TYPES
          newRole1 = $("<option>");
          newRole1.val("admin");
          newRole1.text("Admin");

          newRole2 = $("<option>");
          newRole2.val("parts");
          newRole2.text("Parts");

          newRole3 = $("<option>");
          newRole3.val("warehouse");
          newRole3.text("Warehouse");

          // SET CURRENT SELECTED
          switch (data[i].role) {
            case "admin":
              newRole1.attr("selected", "selected");
              break;

            case "parts":
              newRole2.attr("selected", "selected");
              break;

            case "warehouse":
              newRole3.attr("selected", "selected");
              break;
          }

          newRole.append(newRole1, newRole2, newRole3);
          newTDrole.append(newRole);

          // ADD ROLE ID FOR FURTHER USE
          roles[data[i].id] = newRole;

          // NEW STATUS
          newTDstatus = $("<td>");

          newStatus = $("<select>");
          newStatus.attr("class", "custom-select status");
          newStatus.data("id", data[i].id);

          // STATUS TYPES
          newStatus1 = $("<option>");
          newStatus1.val("active");
          newStatus1.text("active");

          newStatus2 = $("<option>");
          newStatus2.val("inactive");
          newStatus2.text("inactive");

          // SET CURRENT SELECTED
          switch (data[i].status) {
            case "active":
              newStatus1.attr("selected", "selected");
              break;

            case "inactive":
              newStatus2.attr("selected", "selected");
              break;
          }

          newStatus.append(newStatus1, newStatus2);
          newTDstatus.append(newStatus);

          // ADD STATUS ID FOR FURTHER USE
          statuses[data[i].id] = newStatus;

          // LAST LOGIN DATE
          newLogin = $("<td>");
          newLogin.addClass("align-middle");

          // CONVERT TO READABLE FORMAT
          if (data[i].last_login != null) {
            let current_datetime = new Date(data[i].last_login);
            let formatted_date = current_datetime.getDate() + "/" + (current_datetime.getMonth() + 1) + "/" + current_datetime.getFullYear() + " - " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()
            newLogin.text(formatted_date);
          }
          else {
            newLogin.text(data[i].last_login);
          }

          // APPLY CHANGES BUTTON
          newApply = $("<td>");

          newApplyBtn = $("<button>");
          newApplyBtn.attr("class", "btn btn-success apply rounded");
          newApplyBtn.data("id", data[i].id);
          newApplyBtn.html('<i class="fa fa-check"></i>')

          newApply.append(newApplyBtn);
          newApplyBtn.hide();

          // ADD APPLY ID FOR FURTHER USE
          buttons[data[i].id] = newApplyBtn;

          newTr.append(newName, newEmail, newTDrole, newTDstatus, newLogin, newApply);
          $("#usersTable").append(newTr);
        }
      }
    });
  }

  // CLASS BASED CLICKS / ON CHANGE
  // PAGINATION
  $(document.body).on('click', ".page-link", function (e) {
    startI = $(this).data("start");
    getUsers();
  });

  // FILTER ROLE
  $(document.body).on('change', "#filterRole", function (e) {
    filterRoleBy = $(this).val();
    getUsers();
  });

  // FILTER STATUS
  $(document.body).on('change', "#filterStatus", function (e) {
    filterStatusBy = $(this).val();
    getUsers();
  });

  // CHANGE STATUS
  $(document.body).on('change', ".status", function (e) {
    buttons[$(this).data("id")].show();
  });

  // CHANGE ROLE
  $(document.body).on('change', ".role", function (e) {
    buttons[$(this).data("id")].show();
  });

  // APPLY CHANGE BUTTON
  $(document.body).on('click', ".apply", function (e) {
    
    let theId = $(this).data("id");
    let newRole = roles[$(this).data("id")].val();
    let newStatus = statuses[$(this).data("id")].val();

    $.post("/api/update_user", {
      id: theId,
      role: newRole,
      status: newStatus
    })
      .then(function (data) {
        getUsers();
      })
  });

  // CHECK CURRENT ROW MATCHES CRITERIA
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

