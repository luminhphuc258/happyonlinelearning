var globalselectprogramID = "";
$(document).ready(function () {

  // catch event when user select the date pickers
  $('#end_date').on('change', function () {
    var startdate = $("#start_date").val();
    var enddate = $("#end_date").val();

    // Convert string to Date objects
    var startDateObj = new Date(startdate);
    var endDateObj = new Date(enddate);

    // Compare the dates
    if (endDateObj > startDateObj) {
      // get program lists from backend
      getProgramsData(startDateObj, endDateObj);
    } else {
      showErrorMessage("The end date must be after the start date!");
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


function closeModalDelete() {
  $("#modal_delete").hide(500);
}


// function areas
function show_Modal_Add() {
  $("#modalUpdateUser").fadeIn(500);
}

function show_Modal_delete(prorgamname, programid) {
  globalselectprogramID = programid;
  $("#title_program").text(prorgamname);
  $("#modal_delete").fadeIn(500);
}

// get data for  program combox 
async function getProgramsData(querystartdate, queryEndDate) {
  try {
    const response = await fetch("http://localhost:3000/getprogramsforcourseform", {
      method: "GET",
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // Assuming data.programs contains the list of programs.
      let programArray = "";
      data.ProgramLists.forEach((program) => {
        // filter based on start date and end date of program 
        var startDateCurrent = new Date(program.start_date);
        var endDateCurrent = new Date(program.end_date);
        if (querystartdate < startDateCurrent && queryEndDate < endDateCurrent) {
          programArray += `
          <div class="bg-white rounded-2xl p-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 512 512">
              <g fill-rule="evenodd" clip-rule="evenodd">
                <path fill="#ff405c" d="M255.997.007c-141.156 0-256 114.844-256 256 0 141.16 114.844 256 256 256 141.16 0 256.004-114.84 256.004-256C512 114.851 397.157.007 255.997.007z"/>
                <path fill="#d01273" d="M269.845 511.629c110.122-5.9 201.974-81.716 231.869-183.747l-99.461-99.461a12.002 12.002 0 0 0-1.223-1.135l-137.504-110.9a11.994 11.994 0 0 0-15.061 0l-137.5 110.9a12.01 12.01 0 0 0-3.788 13.337 12.008 12.008 0 0 0 3.109 4.757l39.179 39.186v101.722a11.97 11.97 0 0 0 3.796 8.758z"/>
                <path fill="#fff" d="M350.528 224.627c-6.632 0-11.999 5.372-11.999 11.999V374.29h-35.472v-93.423c0-6.627-5.367-11.999-11.999-11.999H220.94c-6.631 0-11.999 5.372-11.999 11.999v93.423h-35.472V236.626c0-6.627-5.372-11.999-11.999-11.999h-8.983l103.509-83.484 103.514 83.484zm50.503 2.659-137.504-110.9a11.992 11.992 0 0 0-15.06 0l-137.5 110.9a12.01 12.01 0 0 0-3.788 13.337 12.008 12.008 0 0 0 11.318 8.006h30.97v137.66c0 6.627 5.372 12.003 12.003 12.003h59.469c6.619 0 11.999-5.376 11.999-12.003v-93.423h46.12v93.423c0 6.627 5.38 12.003 11.999 12.003h59.47c6.631 0 12.003-5.376 12.003-12.003v-137.66h30.97c5.088 0 9.619-3.209 11.318-8.006a12.009 12.009 0 0 0-3.787-13.337z"/>
              </g>
            </svg>
            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3">${program.program_name}</h3>
                 <p class="text-lg font-bold text-gray-800 mb-3"><span class="text-blue-600">Start From: ${program.start_date}</p>
               <p class="text-lg font-bold text-gray-800 mb-3"><span class="text-red-600">To: ${program.end_date}</p>
                 <h5 class="text-lg font-bold text-gray-800 mb-3">${program.total_credits} Credits</h5>
                 <p class="text-gray-800 text-sm">${program.description}</p>
              <div class="mt-6">
                <button type="button" onclick="show_Modal_delete('${program.program_name}','${program.program_id} ');"
                        class="flex items-center flex-wrap justify-between gap-2 border rounded-3xl pl-5 pr-3 h-14 w-full hover:bg-purple-100 transition-all duration-300">
                  Register
                  <div class="w-11 h-11 rounded-full bg-purple-200 flex justify-center items-center">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.1313 9.75H3V8.25H12.1313L7.93125 4.05L9 3L15 9L9 15L7.93125 13.95L12.1313 9.75Z" fill="#222222"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        `;
        }
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

    if (data.status === "success") {
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



