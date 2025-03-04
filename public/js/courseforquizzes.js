var globalselectprogramID = "";
$(document).ready(function () {

  // catch event load all courses
  getAllCourse();

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


function closeModalDelete() {
  $("#modal_delete").hide(500);
}


// function areas
function show_Modal_Add() {
  $("#modalUpdateUser").fadeIn(500);
}

async function show_Modal(course_id, courname) {
  try {
    const response = await fetch("http://localhost:3000/getquizzlistforstudents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: course_id
      }),
    });

    // Handling the response
    const data = await response.json();

    if (data.status === "success") {
      localStorage.setItem("courseQuizeName", courname);

      // ------- calling to assignment lists
      setTimeout(() => {
        window.location.href = '/getquizzlistpage';
      }, 500);
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
              <a href="javascript:void(0);" onclick="show_Modal('${course.course_id}','${course.title}');" class="mt-4 inline-block px-4 py-2 rounded tracking-wider bg-orange-500 hover:bg-orange-600 text-white text-[13px]">Take Quizzes</a>
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





