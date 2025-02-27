document.addEventListener("DOMContentLoaded", function () {
  const formlogin = document.getElementById("loginForm");
  if (formlogin) {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const url = "http://localhost:3000/login";

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Login failed with status ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          localStorage.setItem("token", data.token);
          alert('Login Successfully!');
          window.location.reload();
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Unauthorized!');
        });
    });
  }
});

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
  var loginUrl = "${pageContext.request.contextPath}/requestLogin";
  var usernameInput = $("#username").val();
  var passwordInput = $("#password").val();
  fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ username: usernameInput, password: passwordInput })
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      if (data === true) {
        show_toast_success();
        setTimeout(() => {
          window.location.href = "${pageContext.request.contextPath}/"
        }, 2500);

      } else {
        show_toast_error();
      }

    })
    .catch(error => {
      show_toast_error();
    });
}

