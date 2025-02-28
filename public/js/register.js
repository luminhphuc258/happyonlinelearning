let correctOTP = '';
function show_toast_success() {
  $("#toast_wrapper").fadeIn(1000).delay(2000).slideUp(1000);

}

function show_toast_error() {
  $("#toast_wrapper_error").fadeIn(1000).delay(2000).slideUp(1000);
}


document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("createnewaccount").addEventListener("click", async function (event) {
    // Capture form values
    const givenname = document.getElementById("givenname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("repassword").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const pictureurl = document.getElementById("pictureurl").value;

    // Validate passwords match
    if (password !== confirmPassword) {
      showErrorMessage("Passwords do not match!");
      return;
    }

    // sanitize special character to avoid injection attack
    const isvalid = validateRegisterForm();
    if (!isvalid) {
      console.log("Missing essential information!");
      return;
    }


    const url = "http://localhost:3000/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          givenname,
          lastname,
          email,
          username,
          password,
          phone,
          address,
          pictureurl
        }),
      });

      const data = await response.json();

      if (response.ok) {
        show_toast_success();
        correctOTP = data.user.verificationotp;
        console.log("===> Response Data:", data.user.verificationotp);
        setTimeout(() => {
          $("#modal_OTP").fadeIn(500);
        }, 1000);

      } else {
        show_toast_error();
        window.location.href = "http://localhost:3000/register";
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showErrorMessage("Cannot connect to server!");
    }
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
      var filename = " (your file name:" + file.name.substring(0, 5) + "...jpg)";
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
  //------------------- end --------------------------

});
