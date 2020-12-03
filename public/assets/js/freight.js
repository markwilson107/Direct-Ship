$(document).ready(function() {


});


$(function() {
  $(".create-form").on("submit", function(event) {

    // Make sure to preventDefault on a submit event.
   event.preventDefault();

   var newRequest = {
    requestingBranch: $("#requestingBranch option:selected" ).attr("value"),
    requiringBranch: $("#requiringBranch option:selected" ).attr("value"),
    ibt: $("#ibt").val(),
    proforma: $("#proforma").val(),
    branchInvoice: $("#branchInvoice").val(),
    parts: $("#parts").val(),
    freightCostAllocation: $('input[name="radioFreight"]:checked').val(),
    customerName: $("#customerName").val(),
    customerContact: $("#customerContact").val(),
    customerPhone: $("#customerPhone").val(),
    customerAddress: $("#customerAddress").val(),
    CustomerId: "1",
    notes: $("#notes").val(),
    FreightmethodId: $("#freightMethod option:selected" ).attr("value"),
    freightAccount: $("#freightAccount").val(),
    StatusId: "1",
    UserId: "1"

   };
   console.log(newRequest);
   console.log("===============================================");

  // Send the POST request.
  $.ajax("/api/newrequest", {
    type: "POST",
    data: newRequest
  }).then(
    function() {
      console.log("created new request");
      // Reload the page to get the updated list
      // location.reload();
    }
  );
  });
});

