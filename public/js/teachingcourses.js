var globalselectprogramID = "";
var inputstudentid = '';
var inputassignmentid = '';
var localAssignmentId = "";
$(document).ready(function () {
  // Get all the accordion buttons
  const accordionButtons = document.querySelectorAll('.accordion-button');

  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling; // Get the next div with class 'accordion-content'
      const arrow = button.querySelector('svg.arrow'); // Get the arrow icon inside the button

      // Toggle the max-height for smooth transition effect
      content.classList.toggle('max-h-0'); // Toggle the class that controls visibility
      content.classList.toggle('max-h-[1000px]'); // You can adjust the max height as per your content's needs

      // Rotate the arrow
      arrow.classList.toggle('rotate-180'); // Toggle the rotation of the arrow
    });
  });

  // loading all courses 
  getAllCourse();
});

function setAssignmentID(assignmentid) {
  localAssignmentId = assignmentid;
}

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


function closeModalDelete() {
  $("#modal_delete").hide(500);
}


// function areas
function show_Modal_AddGrade(inputstudentid1, firstname, lastname) {
  inputstudentid = inputstudentid1;
  inputassignmentid = $("#assignmentIDVal").val();
  $("#lastName").val(lastname);
  $("#firstName").val(firstname);
  $("#modalUpdateUser").fadeIn(500);
}

function closeModalUpdate() {
  $("#modalUpdateUser").hide(500);
}

async function updatestudentGrade() {
  try {
    var studentgrade = $("#Grade").val();
    var teacherfeedback = $("#Feedback").val();
    const response = await fetch("http://localhost:3000/updatestudenttGrade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentid: inputstudentid,
        assignmentid: inputassignmentid,
        grade: studentgrade,
        feedback: teacherfeedback
      }),
    });

    // Handling the response
    const data = await response.json();
    console.log(data);

    if (data.message === "Grade and feedback updated successfully") {
      show_toast_success();
      var programID = localStorage.getItem('programID');
      var course_code = localStorage.getItem('course_code');
      setTimeout(() => {
        show_Modal(programID, course_code);
        window.location.href = "/assignmentslistsubmissionsforinstructor";
      }, 1500);
    } else {
      show_toast_error();
    }
    closeModalUpdate();
  } catch (error) {
    console.log(error);
    closeModalUpdate();
  }
}



async function show_Modal(programID, course_code) {
  localStorage.setItem('programID', programID);
  localStorage.setItem('course_code', course_code);
  try {
    const response = await fetch("http://localhost:3000/getalllistofstudentassignment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program_id: programID,
        course_code: course_code
      }),
    });

    // Handling the response
    const data = await response.json();

    if (data.message === "success") {
      // ------- calling to assignment lists
      window.location.href = '/assignmentslistsubmissionsforinstructor';
    } else {
      show_toast_error();
    }
    closeModalDelete();
  } catch (error) {
    console.log(error);
    closeModalDelete();
  }

}

// get data for  program combox 
async function getAllCourse() {
  try {
    const response = await fetch("http://localhost:3000/getallmycourses", {
      method: "GET",
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // Assuming data.programs contains the list of programs.
      let programArray = "";
      data.CourseLists.forEach((course) => {
        programArray += `
          <div class="bg-white rounded-2xl p-6">
          <img src="https://readymadeui.com/cardImg.webp" alt="Blog Post 1" class="w-full h-52 object-cover" />
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3">${course.title}</h3>
              <p class="text-gray-500 text-sm">${course.description}</p>
              <p class="text-orange-500 text-[13px] font-semibold mt-4">${course.semester}</p>
              <a href="javascript:void(0);" onclick="show_Modal('${course.program_id}','${course.course_code} ');" class="mt-4 inline-block px-4 py-2 rounded tracking-wider bg-orange-500 hover:bg-orange-600 text-white text-[13px]">Grading assignments</a>
            </div>
          </div>
        `;

      });

      // Append the generated HTML content to the section
      $("#comboboxprogram_content").html(programArray);

    } else {
      console.error("Failed:", data.message);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}


async function CallBackendAddData() {

  // Validation to ensure all fields are filled
  if (!globalselectprogramID) {
    console.log("globalselectprogramID are required.");
    return;
  }

  const url = "http://localhost:3000/RequestToEnrollment";
  const semesterSelected = $("#enrollsemester").val();
  console.log(semesterSelected);
  console.log(globalselectprogramID);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program_id: globalselectprogramID,
        semester: semesterSelected
      }),
    });

    // Handling the response
    const data = await response.json();
    console.log("===> data", data);

    if (data.message === "success") {
      show_toast_success();
    } else {
      show_toast_error();
    }
    closeModalDelete();
  } catch (error) {
    console.error("Error:", error);
    closeModalDelete();
  }
}





