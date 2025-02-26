document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("createnewaccount");
  if (form) {
    document.getElementById("createnewaccount").addEventListener("submit", async function (event) {
      event.preventDefault();

      // Capture form values
      const role = document.getElementById("Role").value;
      const firstname = document.getElementById("FirstName").value;
      const lastname = document.getElementById("LastName").value;
      const username = document.getElementById("UserName").value;
      const password = document.getElementById("Password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // Validate passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // sanitize special character to avoid injection attack
      const isvalid = validateRegisterForm();
      if (!isvalid) {
        alert("Cannot valid!");
        return;
      }


      const url = "http://localhost:3000/register"; // Adjust API URL if needed

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            firstname,
            lastname,
            username,
            password
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Account created successfully!");
          console.log("Response Data:", data);
          window.location.href = "http://localhost:3000/login";
        } else {
          alert(`Error: ${data.message}`);
          console.error("Error:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to connect to the server!");
      }
    });
  }

});
