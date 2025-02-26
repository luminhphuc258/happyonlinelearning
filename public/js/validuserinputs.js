function validateRegisterForm() {
  console.log("Validating form...");

  // Sanitize & Get Form Values
  const sanitize = (str) => str.replace(/[<>'"(){};]/g, "").trim();

  const firstName = sanitize(document.getElementById('FirstName').value);
  const lastName = sanitize(document.getElementById('LastName').value);
  const email = sanitize(document.getElementById('UserName').value);
  const password = sanitize(document.getElementById('Password').value);
  const confirmPassword = sanitize(document.getElementById('confirmPassword').value);
  const role = document.getElementById('Role').value;

  // Validate Required Fields
  if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
    alert("Please fill out all required fields.");
    return false;
  }

  // Validate Email Format
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  // Validate Password Strength
  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return false;
  }

  // Validate Password Match
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }

  console.log("Form validated successfully!");
  return true;
}
