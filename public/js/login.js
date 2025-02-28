// FUNCTIONS ZONE
function show_toast_success() {
  $("#toast_wrapper").fadeIn(1000).delay(2000).slideUp(1000);

}

function show_toast_error() {
  $("#toast_wrapper_error").fadeIn(1000).delay(2000).slideUp(1000);
}

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.setAttribute("fill", "#000");
  } else {
    passwordInput.type = "password";
    eyeIcon.setAttribute("fill", "#bbb");
  }
}
/* login  */
function RequestToLogin() {
  var loginUrl = "http://localhost:3000/login";
  var username = $("#username").val();
  var password = $("#password").val();

  fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password
    })
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      if (data.status === "success") {
        show_toast_success();
        setTimeout(() => {
          window.location.href = "http://localhost:3000/"
        }, 2000);

      } else {
        show_toast_error();
      }

    })
    .catch(error => {
      show_toast_error();
    });
}

$(document).ready(function () {
  $('#password').on('keydown', function (event) {
    if (event.key === 'Enter') {
      console.log('Enter key was pressed.');
      RequestToLogin();
    }
  });
})

