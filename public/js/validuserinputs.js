function validateRegisterForm() {
  console.log("Validating form...");

  // Sanitize & Get Form Values
  const sanitize = (str) => str.replace(/[<>'"(){};]/g, "").trim();

  const firstName = document.getElementById("givenname").value;
  const lastName = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("repassword").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  // Validate Required Fields
  if (!firstName || !lastName || !email || !password || !confirmPassword || !address || !phone || !username) {
    showErrorMessage("Please fill out all required fields.");
    return false;
  }

  // Validate Email Format
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    showErrorMessage("Please enter a valid email address.");
    return false;
  }

  // Validate Password Strength
  if (password.length < 8) {
    showErrorMessage("Password must be at least 8 characters long.");
    return false;
  }

  // Validate Password Match
  if (password !== confirmPassword) {
    showErrorMessage("Passwords do not match.");
    return false;
  }

  console.log("Form validated successfully!");
  return true;
}


function showErrorMessage(messagecontent) {
  $("#validnotifcation_messagecontent").text(messagecontent);
  $("#validnotifcation").fadeIn(500);
}

// catch event for close button on the notification 
document.addEventListener('DOMContentLoaded', function () {
  // Adding a click event listener to the SVG close icon
  $("#btnclosemessagevalid").click(function () {
    $("#validnotifcation").hide(500);

  })
});



