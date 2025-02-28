var selectedUserId = "1";
$(document).ready(function () {
  // search function 
  $('#btnSearch').on('click', function () {
    // Get the search term
    var searchTerm = $("#textinputsearch").val().toLowerCase();

    // Loop through each row and hide those that do not match the search term
    $('#userliststable tbody tr').each(function () {
      var rowText = $(this).text().toLowerCase();

      // Check if the row text contains the search term
      if (rowText.indexOf(searchTerm) !== -1) {
        $(this).fadeIn(500);
      } else {
        $(this).hide(500);
      }
    });
  });

  $('#textinputsearch').on('keyup', function () {
    // Get the search term
    var searchTerm = $(this).val().toLowerCase();

    // Loop through each row and hide those that do not match the search term
    $('#userliststable tbody tr').each(function () {
      var rowText = $(this).text().toLowerCase();

      // Check if the row text contains the search term
      if (rowText.indexOf(searchTerm) !== -1) {
        $(this).fadeIn(500);
      } else {
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
function UpdateInfo(userId, lastName, firstName, email, role, phone, address) {
  // show previous info
  selectedUserId = userId;
  $("#lastName").val(lastName);
  $("#firstName").val(firstName);
  $("#email").val(email);
  $('#dropdownRole').text(role);
  $("#phone").val(phone);
  $("#address").val(address);
  // update info 
  $("#modalUpdateUser").fadeIn(500);
}


async function CallBackendUpdateUser() {
  // Get input values
  var lastName = $("#lastName").val();
  var firstName = $("#firstName").val();
  var email = $("#email").val();
  var role = $('#dropdownRole').text();
  var phone = $("#phone").val();
  var address = $("#address").val();
  var userId = selectedUserId;

  // Logging values for debugging

  const url = "http://localhost:3000/updateuser";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        lastName,
        firstName,
        email,
        role,
        phone,
        address
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
    closeModalUpdate();
  } catch (error) {
    closeModalUpdate();
  }
}
function show_Modal_delete(usrID) {
  $("#userfordeleted").val(usrID);
  $("#modal_delete").fadeIn(500);
}


async function CallBackEndToDeleteInfo() {
  const myuserid = $("#userfordeleted").val();
  try {
    const localurl = "http://localhost:3000/deleteUser";
    const response = await fetch(localurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        myuserid
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


