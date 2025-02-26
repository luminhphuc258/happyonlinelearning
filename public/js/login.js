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

