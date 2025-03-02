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


  // catch event for upload file to firebase storage 
  // Select DOM Elements
  const fileInput = document.getElementById("uploadFile1");
  // const uploadLabel = document.querySelector("#displayfilename");
  const uploadText = document.querySelector(".flex.mb-2 p");

  // Handle File Selection
  fileInput.addEventListener("change", async function () {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Show selected file name
      var filename = " (File Name:" + file.name.substring(0, 5) + "..doc file)";
      $("#uploadmessage").text(filename);

      // Upload file to Firebase
      await uploadFileToServer(file);
    }
  });

  async function uploadFileToServer(file) {
    const formData = new FormData();
    formData.append("userfile", file);

    try {
      const response = await fetch("http://localhost:3000/uploaduserpicture", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      $("#uploaded_result").fadeIn(500);
      if (response.ok) {
        console.log("File uploaded:", data.url);
        uploadText.textContent = "Upload complete!";
        $("#pictureurl").val(data.url);
      } else {
        console.error("Upload failed:", data.message);
        uploadText.textContent = "Upload failed.";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
})

function show_toast_success() {
  $("#toast_wrapper").fadeIn(1000).delay(2000).slideUp(1000);

}

function show_toast_error() {
  $("#toast_wrapper_error").fadeIn(1000).delay(2000).slideUp(1000);
}

function setAssignmentID(assignmentid) {
  localAssignmentId = assignmentid;
}

// submit docs to server
async function submitThisAssignment() {
  var fileURL = $("#pictureurl").val();
  var noteContent = $("#assignmentnote").val();

  //calling server for submission 
  const url = "http://localhost:3000/callingtosubmission";
  const currentTime = new Date();
  console.log(currentTime);

  // calling to server
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignment_id: localAssignmentId,
        file_path: fileURL,
        submission_time: currentTime,
        submission_text: noteContent
      }),
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      show_toast_success();
      setTimeout(() => {
        window.location.href = "/assignmentslist";
      }, 1000);

    } else {
      show_toast_error();
      window.location.href = "http://localhost:3000/register";
      console.error("Error:", data);
    }
  } catch (error) {
    $("#modal_OTP").hide();
    console.error("Fetch error:", error);
    showErrorMessage("Cannot connect to server!");
  }

}