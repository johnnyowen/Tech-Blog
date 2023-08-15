const loginFormHandler = async(event) => {
  event.preventDefault();
  const userEmail = document.querySelector('#user-email').value.trim();
  const userPassword = document.querySelector('#user-password').value.trim();
  const response = await fetch('api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail, password: userPassword }),
  });
  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  };

};

document.querySelector('#login-form').addEventListener('submit', loginFormHandler);