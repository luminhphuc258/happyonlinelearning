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

async function createCombox_AllCourses(comboxID) {
  try {
    const response = await fetch("http://localhost:3000/getallmycourses", {
      method: "GET",
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // Assuming data.programs contains the list of programs.
      let options = "";
      data.CourseLists.forEach((course) => {
        options += `<option value="${course.course_code}" programid="${course.program_id}">${course.title}</option>
        `;

      });

      // Append the generated HTML content to the section
      $("#" + comboxID).html(options);

    } else {
      console.error("Cannot load data for combox:", data.message);
    }
  } catch (error) {
    console.error("Error load data:", error);
  }
}

// function areas
function UpdateInfo() {
  //load box 
  createCombox_AllCourses("courseLists");
  //========= show modal 
  $("#modalUpdateUser").fadeIn(500);
}

async function GoToAddQuestionPage(quizinputID, quizName) {
  localStorage.setItem('quizinputID', quizinputID);
  localStorage.setItem('quizName', quizName);
  // window.location.href = "/getallquestions/" + quizinputID;
  const url = "http://localhost:3000/getallquestions";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizId: quizinputID
      }),
    });

    // Handling the response
    const data = await response.json();
    console.log("===> data" + data);

    if (data.status === "success") {
      show_toast_success();
      window.location.href = "/getallquestions";
    } else {
      show_toast_error();
    }
    closeModalUpdate();
  } catch (error) {
    closeModalUpdate();
  }

}

async function CallBackendMakequiz() {
  // Get input values
  var courseLists = $("#courseLists").val();
  var quizTitle = $("#quizTitle").val();
  var quizdescription = $("#quizdescription").val();
  var start_time = $('#start_time').val();
  var end_time = $("#end_time").val();
  var totaltime = $("#totaltime").val();
  var totalpoint = $("#totalpoint").val();
  var published = $("#published").val();

  // Logging values for debugging

  const url = "http://localhost:3000/storeQuiz";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: courseLists,
        title: quizTitle,
        description: quizdescription,
        start_time: start_time,
        end_time: end_time,
        duration_minutes: totaltime,
        total_points: totalpoint,
        is_published: published
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
  const quizID = $("#userfordeleted").val();
  try {
    const localurl = "http://localhost:3000/deleteQuiz";
    const response = await fetch(localurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizID
      }),
    });

    // Handling the response
    const data = await response.json();
    console.log("===> data" + data);

    if (data) {
      show_toast_success();
      window.reload();
    } else {
      show_toast_error();
    }
    closeModalDelete();
  } catch (error) {
    closeModalDelete();
  }
}


