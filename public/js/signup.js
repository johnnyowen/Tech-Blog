const signupFormHandler = async(event) => {
  event.preventDefault();
  const username = document.querySelector('#username').value.trim();
  const email = document.querySelector('#user-email').value.trim();
  const password = document.querySelector('#user-password').value.trim();
  const response = await fetch('api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  };
};

document.querySelector('#signup-form').addEventListener('submit', signupFormHandler);