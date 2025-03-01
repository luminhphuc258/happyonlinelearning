var globalprogramID = "1";
$(document).ready(function () {
  // catch event of combox 
  $('#programSelect').on('change', function () {
    // Get the selected value (program_id)
    var selectedProgramId = $(this).val();

    // Update the program_id with the selected value
    globalprogramID = selectedProgramId;

    console.log("Updated program_id: " + selectedProgramId);
  });

  // Search functionality
  $('#btnSearch').on('click', function () {
    var searchTerm = $("#textinputsearch").val().toLowerCase();

    $('#userliststable tbody tr').each(function () {
      // Program Name (Level 1) - course title
      var courseTitleText = $(this).find('td').eq(0).text().toLowerCase();
      // Description (Level 2)
      var descriptionText = $(this).find('td').eq(1).text().toLowerCase();

      if (courseTitleText.indexOf(searchTerm) !== -1 || descriptionText.indexOf(searchTerm) !== -1) {
        $(this).fadeIn(500);
      } else {
        $(this).hide(500);
      }
    });
  });

  // Live search on keyup
  $('#textinputsearch').on('keyup', function () {
    var searchTerm = $(this).val().toLowerCase();

    $('#userliststable tbody tr').each(function () {
      var courseTitleText = $(this).find('td').eq(0).text().toLowerCase();
      var descriptionText = $(this).find('td').eq(1).text().toLowerCase();

      if (courseTitleText.indexOf(searchTerm) !== -1 || descriptionText.indexOf(searchTerm) !== -1) {
        $(this).fadeIn(500); // Show matching row
      } else {
        $(this).hide(500); // Hide non-matching row
      }
    });
  });
});

//  ============================ FUNCTIONS AREA ============================

// get data for  program combox 
async function getProgramsData() {
  try {
    const response = await fetch("http://localhost:3000/getprogramsforcourseform", {
      method: "GET"
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      const selectElement = document.createElement("select");
      selectElement.id = "programSelect";
      var programArray = data.ProgramLists;
      programArray.forEach((program) => {
        const option = document.createElement("option");
        option.value = program.program_id;
        option.setAttribute("startdate", program.start_date);
        option.setAttribute("enddate", program.end_date);
        option.textContent = program.program_name + " - (Start Date " + program.start_date + " )";
        selectElement.appendChild(option);
      });

      //append 
      $("#comboxprogram_content").html(selectElement);
    } else {
      console.error(" failed:", data.message);
    }

  } catch (error) {
    console.error("Error uploading file:", error);
  }
}


// Function for adding a new course
async function CallBackendUpdate() {
  // Get input values
  var courseCode = $("#course_code").val();
  var title = $("#course_title").val();
  var description = $("#description").val();
  var credits = $("#total_credits").val();
  var semester = $("#semester").val();
  var registrationStart = $("#start_date").val();
  var registrationEnd = $("#end_date").val();

  // Validate the inputs
  if (!courseCode || !title || !credits || !semester || !registrationStart || !registrationEnd) {
    alert("All fields are required.");
    return;
  }

  const url = "http://localhost:3000/addnewcourses";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program_id: globalprogramID,
        course_code: courseCode,
        title: title,
        description: description,
        credits: credits,
        semester: semester,
        registration_start: registrationStart,
        registration_end: registrationEnd
      }),
    });

    const data = await response.json();
    console.log("===> data", data);

    if (data.status === "success") {
      show_toast_success();
    } else {
      show_toast_error();
    }
    closeModalUpdate();
  } catch (error) {
    console.error("Error:", error);
    closeModalUpdate();
  }
}

// Function for deleting a course
async function CallBackEndToDeleteInfo() {
  const course_id = $("#userfordeleted").val();

  try {
    const localurl = "http://localhost:3000/deletecourse";
    const response = await fetch(localurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course_id })
    });

    const data = await response.json();
    console.log("===> data", data);

    if (data.status === "success") {
      show_toast_success(); // Show success toast
    } else {
      show_toast_error(); // Show error toast
    }
    closeModalDelete();
  } catch (error) {
    closeModalDelete();
  }
}

// Function to display success toast
function show_toast_success() {
  $("#toast_wrapper").fadeIn(1000).delay(2000).slideUp(1000);
  setTimeout(() => {
    location.reload(); // Reload page after success
  }, 2000);
}

// Function to display error toast
function show_toast_error() {
  $("#toast_wrapper_error").fadeIn(1000).delay(2000).slideUp(1000);
}

function show_Add_course() {
  getProgramsData();
  $("#modalUpdateUser").fadeIn(500);
}
// Close modal update function
function closeModalUpdate() {
  $("#modalUpdateUser").hide(500);
}

// Close modal delete function
function closeModalDelete() {
  $("#modal_delete").hide(500);
}

// Function to show modal for delete
function show_Modal_delete(courseID) {
  $("#userfordeleted").val(courseID);
  $("#modal_delete").fadeIn(500);
}