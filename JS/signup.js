/** Firebase base URL */
const FIREBASE_URL = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app';


/** Validates form and creates user account */
async function signUp() {
  clearSignupErrors();
  let signupObj = getSignupData(); 
  if (!checkSignupInputs(signupObj.name, signupObj.email, signupObj.password, signupObj.confirm)) return;
  if (await checkEmailExists(signupObj.email.value)) {
      showSignupError(); 
    return; 
  }
 await gatherUserInfo(signupObj.name.value, signupObj.email.value, signupObj.password.value);
  document.getElementById('signupButton').disabled = true;
  showToast('You Signed Up successfully');
  setTimeout(function() {
    window.location.href = 'index.html';
  }, 1100);
}

function getSignupData() {
   return {
    name: document.getElementById('signupName'),
    email: document.getElementById('signupEmail'),
    password: document.getElementById('signupPassword'),
    confirm: document.getElementById('signupConfirm')
  };
}

function showSignupError() {
    document.getElementById('signupEmail').classList.add('InputFieldError');
    document.getElementById('signupError').textContent = 'This email is already registered.';
}

 
async function checkEmailExists(email) {
  let loginData = await fetchLoginData();
  return checkEmailData(loginData, email);

}


async function fetchLoginData() {
    let response = await fetch('https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/LoginData.json');
    let loginData = await response.json();
    return loginData;
}


/** @returns {boolean} */
function checkEmailData(loginData,email) {
    let users = Object.values(loginData);
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            // dann sollte hier eine Funktion rein, die Fehlermeldung ausgibt
          return true;
        }
    }
    return false;
}



/** @returns {boolean} True if all inputs are valid */
function checkSignupInputs(name, email, password, confirm) {
  let isValid = true;
  if (name.value.trim() === '') {
    showInputError(name, 'Please enter your name.');
    isValid = false;
  } else if (!name.value.trim().includes(' ')) {
    showInputError(name, 'Please enter your first and last name.')
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

async function gatherUserInfo(name, email, password) {
  let id = await getNextContactId();
  let initials = generateInitials(name);
  let date = new Date().toISOString();
  let color = generateRandomColor()
  await createNewUserContact(id, color, date, email, initials, name); 
  await createNewUserLogin(id, email, password); 
}

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
      phone: "",
      updatedAt: date})
  });
}

async function createNewUserLogin(id, email, password) {
   await fetch(FIREBASE_URL + `/LoginData/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      password: password})
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
  let name = getSignupUserName(); 
  let email = getSignupEmail(); 
  let password = getSignupPassword();
  let confirm = document.getElementById('signupConfirm').value;
  let checkbox = document.getElementById('signupPrivacy').checked;
  let button = document.getElementById('signupButton');
  button.disabled = !(name && email && password && confirm && checkbox);
}

function getSignupUserName() {
  let name = document.getElementById('signupName').value.trim();
  return name; 
}

function getSignupEmail() {
  let email = document.getElementById('signupEmail').value.trim();
  return email; 
}

function getSignupPassword() {
  let password = document.getElementById('signupPassword').value;
  return password; 
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


function generateInitials(name) {
let parts = name.split(' ');
let initials = parts[0][0] + parts[1][0];
return initials.toUpperCase();
}

function generateRandomColor() {
  let colors = [
    '#FF7A00', '#9327FF', '#6E52FF', '#FC71FF',
    '#FFBB2B', '#1FD7C1', '#FF5EB3', '#00BEE8',
    '#1FC71F', '#FF745E', '#FFA35E', '#FC71FF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}




initSignup();
initPasswordToggles();
