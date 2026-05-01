/** Firebase base URL */
const FIREBASE_URL = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app';


/** Validates form and creates user account */
async function signUp() {
  clearSignupErrors();
  let signupObj = getSignupData();
  if (!checkSignupInputs(signupObj.name, signupObj.email, signupObj.password, signupObj.confirm))
    return;
  if (await checkEmailExists(signupObj.email.value)) {
    showSignupError();
    return;
  }
  document.getElementById('signupButton').disabled = true;
  await gatherUserInfo(signupObj.name.value, signupObj.email.value, signupObj.password.value);
  showToast('You Signed Up successfully');
  setTimeout(function () {
    window.location.href = 'index.html';
  }, 1100);
}

/**
 * returns the DOM Elements from the signup Form
 * @returns {Object} signup object
 */
function getSignupData() {
  return {
    name: document.getElementById('signupName'),
    email: document.getElementById('signupEmail'),
    password: document.getElementById('signupPassword'),
    confirm: document.getElementById('signupConfirm'),
  };
}

/** Shows error if the email is already registered */
function showSignupError() {
  document.getElementById('signupEmail').classList.add('InputFieldError');
  document.getElementById('signupError').textContent = 'This email is already registered.';
}

/**
 * starts email check and returns logindata and email
 * @param {string} email - the entered email
 * @returns {boolean} True if email is already registered
 */
async function checkEmailExists(email) {
  let loginData = await fetchLoginData();
  return checkEmailData(loginData, email);
}

/** @returns {boolean} */
function checkEmailData(loginData, email) {
  let users = Object.values(loginData);
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      return true;
    }
  }
  return false;
}

/** @returns {boolean} True if all inputs are valid */
function checkSignupInputs(name, email, password, confirm) {
  let isValid = validateName(name);
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

/**
 * checks inputs and trims name, if first and last name are entered, shows error messages, and returns true if correct
 * @param {HTMLInputElement} name - entered name from input
 * @returns {boolean} return false if only one name or nothing is entered
 */
function validateName(name) {
  if (name.value.trim() === '') {
    showInputError(name, 'Please enter your name.');
    return false;
  }
  if (!name.value.trim().includes(' ')) {
    showInputError(name, 'Please enter your first and last name.');
    return false;
  }
  return true;
}

/** @returns {boolean} */
function isValidEmail(email) {
  let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * renders error messages and adds red borders at inputs
 * @param {HTMLInputElement} input - value of input
 * @param {string} message - message recived from function validate name 
 */
function showInputError(input, message) {
  input.classList.add('InputFieldError');
  let errorSpan = document.getElementById('signupError');
  if (errorSpan.textContent === '') {
    errorSpan.textContent = message;
  }
}

/** clears the error messages and removes error css for all inputs */
function clearSignupErrors() {
  document.getElementById('signupError').textContent = '';
  let inputs = document.querySelectorAll('.InputField');
  inputs.forEach(function (input) {
    input.classList.remove('InputFieldError');
  });
}

/**
 * collects all data from user
 * @param {string} name - entered value 
 * @param {string} email - entered value
 * @param {string} password - entered value
 */
async function gatherUserInfo(name, email, password) {
  let id = await getNextContactId();
  let initials = generateInitials(name);
  let date = new Date().toISOString();
  let color = generateRandomColor();
  await createNewUserContact(id, color, date, email, initials, name);
  await createNewUserLogin(id, email, password);
}

/**
 * Creates new user object in Contacts in Firebase
 * @param {string} id - user id
 * @param {string} color - user color
 * @param {string} date - date of creation
 * @param {string} email - entered value in input
 * @param {string} initials - Created from user first and last name
 * @param {string} name - entered value in input
 */
async function createNewUserContact(id, color, date, email, initials, name) {
  await fetch(FIREBASE_URL + `/Contacts/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      color: color,
      createdAt: date,
      email: email,
      id: id,
      initials: initials,
      name: name,
      phone: '',
      updatedAt: date,
    }),
  });
}

/**
 * creates new login data for user in logindata in firebase
 * @param {string} id - contact user id
 * @param {string} email - entered value in input
 * @param {string} password - entered value in input
 */
async function createNewUserLogin(id, email, password) {
  await fetch(FIREBASE_URL + `/LoginData/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
}

/**
 * Creates toast element with success message after successful signup
 * @param {string} message - the success message
 */
function showToast(message) {
  let toast = document.createElement('div');
  toast.className = 'Toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.classList.add('ToastVisible');
  }, 50);
}

/** Toggles the signup button by checking all inputs */
function toggleSignupButton() {
  let name = getSignupUserName();
  let email = getSignupEmail();
  let password = getSignupPassword();
  let confirm = document.getElementById('signupConfirm').value;
  let checkbox = document.getElementById('signupPrivacy').checked;
  let button = document.getElementById('signupButton');
  button.disabled = !(name && email && password && confirm && checkbox);
}

/**
 * Gets trimmed signup name
 * @returns {string} Trimmed name
 */
function getSignupUserName() {
  let name = document.getElementById('signupName').value.trim();
  return name;
}

/**
 * Gets trimmed email from signup
 * @returns {string} Trimmed email
 */
function getSignupEmail() {
  let email = document.getElementById('signupEmail').value.trim();
  return email;
}

/**
 * gets password from signup
 * @returns {string} returns password
 */
function getSignupPassword() {
  let password = document.getElementById('signupPassword').value;
  return password;
}

/** Initializes signup: prevents refresh, places event listeners on inputs to toggle signup button and change eye icon */
function initSignup() {
  let form = document.querySelector('form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    signUp();
  });
  let fields = document.querySelectorAll('.InputField');
  fields.forEach(function (field) {
    field.addEventListener('input', function () {
      field.classList.remove('InputFieldError');
      toggleSignupButton();
    });
  });
  let checkbox = document.getElementById('signupPrivacy');
  checkbox.addEventListener('change', toggleSignupButton);
}

/**
 * fetches complete database contacts and extracts next highest free number for new user id
 * @returns {string} new user id
 */
async function getNextContactId() {
  let response = await fetch(FIREBASE_URL + '/Contacts.json');
  let contacts = await response.json();
  if (!contacts) return 'c1';
  let keys = Object.keys(contacts);
  let maxNumber = 0;
  for (let i = 0; i < keys.length; i++) {
    let number = parseInt(keys[i].replace('c', ''));
    if (number > maxNumber) {
      maxNumber = number;
    }
  }
  return 'c' + (maxNumber + 1);
}

/**
 * generates initals from user first and last name
 * @param {string} name - user first and last name
 * @returns {string} Uppercase initials (e.g. 'SM')
 */
function generateInitials(name) {
  let parts = name.split(' ');
  let initials = parts[0][0] + parts[1][0];
  return initials.toUpperCase();
}

/**
 * Assigns random color to new user
 * @returns {string} user color
 */
function generateRandomColor() {
  let colors = [
    '#FF7A00',
    '#9327FF',
    '#6E52FF',
    '#FC71FF',
    '#FFBB2B',
    '#1FD7C1',
    '#FF5EB3',
    '#00BEE8',
    '#1FC71F',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}


initSignup();
initPasswordToggles();
