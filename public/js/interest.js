document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  alert(formData.get('name'));
  const url = "http://localhost:3000/register";
  const apiKey = 'thisislab2';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: formData.get('name'),
      address: formData.get('address'),
      email: formData.get('email'),
      phone: formData.get('phone')
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      alert('Register Successful!');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Login Failed');
    });
});