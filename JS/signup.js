/**
 * Firebase base URL for the Join project database
 * @constant {string}
 */
const FIREBASE_URL = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app';


/**
 * Validates the sign-up form and creates a new user if valid.
 * Checks all fields, shows errors, sends data to Firebase on success.
 * @async
 */
async function signUp() {
  clearSignupErrors();
  let name = document.getElementById('signupName');
  let email = document.getElementById('signupEmail');
  let password = document.getElementById('signupPassword');
  let confirm = document.getElementById('signupConfirm');
  if (!validateSignupFields(name, email, password, confirm)) return;
  document.getElementById('signupButton').disabled = true;
  await saveNewUser(email.value, password.value);
  showToast('You Signed Up successfully');
  setTimeout(function() {
    window.location.href = 'summary.html';
  }, 1100);
}


/**
 * Validates all sign-up form fields and shows error messages.
 * @param {HTMLInputElement} name - Name input element
 * @param {HTMLInputElement} email - Email input element
 * @param {HTMLInputElement} password - Password input element
 * @param {HTMLInputElement} confirm - Confirm password input element
 * @returns {boolean} True if all fields are valid
 */
function validateSignupFields(name, email, password, confirm) {
  let isValid = true;
  if (name.value.trim() === '') {
    showFieldError(name, 'Please enter your name.');
    isValid = false;
  }
  if (!isValidEmail(email.value)) {
    showFieldError(email, 'Please enter a valid email address.');
    isValid = false;
  }
  if (password.value.length < 1) {
    showFieldError(password, 'Please enter a password.');
    isValid = false;
  }
  if (confirm.value !== password.value) {
    showFieldError(confirm, "Your passwords don't match. Please try again.");
    isValid = false;
  }
  return isValid;
}


/**
 * Checks if an email address has a valid format.
 * @param {string} email - The email string to validate
 * @returns {boolean} True if the email format is valid
 */
function isValidEmail(email) {
  let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}


/**
 * Displays an error state on an input field with a message below it.
 * @param {HTMLInputElement} input - The input element to mark as error
 * @param {string} message - Error message to display
 */
function showFieldError(input, message) {
  input.classList.add('InputFieldError');
  let errorSpan = document.getElementById('signupError');
  if (errorSpan.textContent === '') {
    errorSpan.textContent = message;
  }
}


/**
 * Clears all error states and messages from the sign-up form.
 */
function clearSignupErrors() {
  document.getElementById('signupError').textContent = '';
  let inputs = document.querySelectorAll('.InputField');
  inputs.forEach(function(input) {
    input.classList.remove('InputFieldError');
  });
}


/**
 * Saves a new user to Firebase LoginData.
 * @async
 * @param {string} email - User's email address
 * @param {string} password - User's password
 */
async function saveNewUser(email, password) {
  await fetch(FIREBASE_URL + '/LoginData.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password })
  });
}


/**
 * Displays a toast notification that slides in and fades out.
 * @param {string} message - The message to show in the toast
 */
function showToast(message) {
  let toast = document.createElement('div');
  toast.className = 'Toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function() { toast.classList.add('ToastVisible'); }, 50);
}


/**
 * Enables or disables the sign-up button based on form state.
 * Button is enabled only when checkbox is checked and all fields have content.
 */
function updateSignupButton() {
  let name = document.getElementById('signupName').value.trim();
  let email = document.getElementById('signupEmail').value.trim();
  let password = document.getElementById('signupPassword').value;
  let confirm = document.getElementById('signupConfirm').value;
  let checkbox = document.getElementById('signupPrivacy').checked;
  let button = document.getElementById('signupButton');
  button.disabled = !(name && email && password && confirm && checkbox);
}


/**
 * Sets up all event listeners for the sign-up page.
 */
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
      updateSignupButton();
    });
  });
  let checkbox = document.getElementById('signupPrivacy');
  checkbox.addEventListener('change', updateSignupButton);
}


initSignup();
initPasswordToggles();
