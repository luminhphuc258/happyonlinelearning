$(document).ready(function () {
  $('#btnSearch').on('click', function () {
    // Get the search term
    var searchTerm = $("#textinputsearch").val().toLowerCase();

    // Loop through each row and hide those that do not match the search term
    $('#userliststable tbody tr').each(function () {
      // Program Name (Level 1)
      var programNameText = $(this).find('td').eq(0).text().toLowerCase();
      // Description (Level 2)
      var descriptionText = $(this).find('td').eq(1).text().toLowerCase();

      // Check if the Program Name or Description contains the search term
      if (programNameText.indexOf(searchTerm) !== -1 || descriptionText.indexOf(searchTerm) !== -1) {
        $(this).fadeIn(500); // Show matching row
      } else {
        $(this).hide(500); // Hide non-matching row
      }
    });
  });

  // For live search on keyup
  $('#textinputsearch').on('keyup', function () {
    // Get the search term
    var searchTerm = $(this).val().toLowerCase();

    // Loop through each row and hide those that do not match the search term
    $('#userliststable tbody tr').each(function () {
      // Program Name (Level 1)
      var programNameText = $(this).find('td').eq(0).text().toLowerCase();
      // Description (Level 2)
      var descriptionText = $(this).find('td').eq(1).text().toLowerCase();

      // Check if the Program Name or Description contains the search term
      if (programNameText.indexOf(searchTerm) !== -1 || descriptionText.indexOf(searchTerm) !== -1) {
        // Show matching row
        $(this).fadeIn(500);
      } else {
        // Hide non-matching row
        $(this).hide(500);
      }
    });
  });

  // combox control in update user
  $('#dropdownRole').on('click', function (event) {
    event.stopPropagation();
    $('#dropdownMenuRole').toggle();
  });

  // Change button text when an option is selected
  $('#dropdownMenuRole li').on('click', function () {
    var selectedText = $(this).text();
    $('#dropdownRole').text(selectedText);
    $('#dropdownMenuRole').hide();
  });

  // Hide dropdown when clicking outside
  $(document).on('click', function (event) {
    if (!$(event.target).closest('#dropdownRole, #dropdownMenuRole').length) {
      $('#dropdownMenuRole').hide();
    }
  });

});

// toast area 
function show_toast_success() {
  $("#toast_wrapper").fadeIn(1000).delay(2000).slideUp(1000);
  setTimeout(() => {
    location.reload();
  }, 2000);
}

function show_toast_error() {
  $("#toast_wrapper_error").fadeIn(1000).delay(2000).slideUp(1000);
}

function closeModalUpdate() {
  $("#modalUpdateUser").hide(500);
}

function closeModalDelete() {
  $("#modal_delete").hide(500);
}


// function areas
function show_Modal_update() {
  alert("call me")
  $("#modalUpdateUser").fadeIn(500);
}

function show_Modal_delete(usrID) {
  $("#userfordeleted").val(usrID);
  $("#modal_delete").fadeIn(500);
}


async function CallBackendUpdate() {
  // Get input values
  var programName = $("#program_name").val();
  var description = $("#description").val();
  var totalCredits = $("#total_credits").val();
  var startDate = $("#start_date").val();
  var endDate = $("#end_date").val();

  // Validation to ensure all fields are filled
  if (!programName || !totalCredits || !startDate || !endDate) {
    alert("Program name, total credits, start date, and end date are required.");
    return;
  }

  const url = "http://localhost:3000/addnewstudyprogram";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program_name: programName,
        description: description,
        total_credits: totalCredits,
        start_date: startDate,
        end_date: endDate
      }),
    });

    // Handling the response
    const data = await response.json();
    console.log("===> data", data);

    if (data.status === "success") {
      show_toast_success(); // Assuming you have this function for a success message
    } else {
      show_toast_error(); // Assuming you have this function for an error message
    }
    closeModalUpdate(); // Close the modal after submission
  } catch (error) {
    console.error("Error:", error);
    closeModalUpdate(); // Close the modal on error
  }
}



async function CallBackEndToDeleteInfo() {
  const program_id = $("#userfordeleted").val();
  try {
    const localurl = "http://localhost:3000/deletestudyprogram";
    const response = await fetch(localurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program_id
      }),
    });

    // Handling the response
    const data = await response.json();
    console.log("===> data" + data);

    if (data.status === "success") {
      show_toast_success();
    } else {
      show_toast_error();
    }
    closeModalDelete();
  } catch (error) {
    closeModalDelete();
  }
}


