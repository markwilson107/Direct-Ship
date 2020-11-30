$(document).ready(function() {
    
    getFreightMethods();

    function getFreightMethods() {
        
      $.get("/api/users", function(data) {

        for (var i = 0; i < data.length; i++) {

          newTr = $("<tr>");
          
          newName = $("<td>");
          newName.text(data[i].firstname + " " + data[i].lastname);

          newEmail = $("<td>");
          newEmail.text(data[i].email);

          newStatus = $("<td>");
          newStatus.text(data[i].status);

          newLogin = $("<td>");
          newLogin.text(data[i].last_login);

          newTr.append(newName, newEmail, newStatus, newLogin);
          $("#usersTable").append(newTr);
        }
        
      });
    }
  
  });
  