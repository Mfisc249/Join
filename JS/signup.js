/** Firebase base URL */
const FIREBASE_URL = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app';


/** Validates form and creates user account */
async function signUp() {
  clearSignupErrors();
  let name = document.getElementById('signupName');
  let email = document.getElementById('signupEmail');
  let password = document.getElementById('signupPassword');
  let confirm = document.getElementById('signupConfirm');
  if (!checkSignupInputs(name, email, password, confirm)) return;
  document.getElementById('signupButton').disabled = true;
  await createNewUser(email.value, password.value);
  showToast('You Signed Up successfully');
  setTimeout(function() {
    window.location.href = 'summary.html';
  }, 1100);
}


/** @returns {boolean} True if all inputs are valid */
function checkSignupInputs(name, email, password, confirm) {
  let isValid = true;
  if (name.value.trim() === '') {
    showInputError(name, 'Please enter your name.');
    isValid = false;
  }
  if (!isValidEmail(email.value)) {
    showInputError(email, 'Please enter a valid email address.');
    isValid = false;
  }
  if (password.value.length < 1) {
    showInputError(password, 'Please enter a password.');
    isValid = false;
  }
  if (confirm.value !== password.value) {
    showInputError(confirm, "Your passwords don't match. Please try again.");
    isValid = false;
  }
  return isValid;
}


/** @returns {boolean} */
function isValidEmail(email) {
  let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}


function showInputError(input, message) {
  input.classList.add('InputFieldError');
  let errorSpan = document.getElementById('signupError');
  if (errorSpan.textContent === '') {
    errorSpan.textContent = message;
  }
}


function clearSignupErrors() {
  document.getElementById('signupError').textContent = '';
  let inputs = document.querySelectorAll('.InputField');
  inputs.forEach(function(input) {
    input.classList.remove('InputFieldError');
  });
}


async function createNewUser(email, password) {
  await fetch(FIREBASE_URL + '/LoginData.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password })
  });
}


function showToast(message) {
  let toast = document.createElement('div');
  toast.className = 'Toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function() { toast.classList.add('ToastVisible'); }, 50);
}


function toggleSignupButton() {
  let name = document.getElementById('signupName').value.trim();
  let email = document.getElementById('signupEmail').value.trim();
  let password = document.getElementById('signupPassword').value;
  let confirm = document.getElementById('signupConfirm').value;
  let checkbox = document.getElementById('signupPrivacy').checked;
  let button = document.getElementById('signupButton');
  button.disabled = !(name && email && password && confirm && checkbox);
}


function initSignup() {
  let form = document.querySelector('form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    signUp();
  });
  let fields = document.querySelectorAll('.InputField');
  fields.forEach(function(field) {
    field.addEventListener('input', function() {
      field.classList.remove('InputFieldError');
      toggleSignupButton();
    });
  });
  let checkbox = document.getElementById('signupPrivacy');
  checkbox.addEventListener('change', toggleSignupButton);
}


initSignup();
initPasswordToggles();
