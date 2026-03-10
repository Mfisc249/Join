checkSessionForAnimation();

/** Validates credentials and redirects on success */
async function login() {
  document.getElementById('loginError').textContent = '';
  let email = document.getElementById('loginEmail').value;
  let password = document.getElementById('loginPassword').value;
  document.getElementById('loginButton').disabled = true;
  let loginData = await fetchLoginData();
  let userKey = checkLoginData(loginData, email, password);

  if (userKey) {
    await startUserSession(userKey);
  } else {
    showLoginError();
  }
}


/**
 * Transmits the user key and starts the session. 
 * @param {string} userKey - corresponds to key in login-data json
 */
async function startUserSession(userKey) {
    await saveLoggedInUser(userKey);
    window.location.href = 'summary.html';
}


/** shows login-Error with red borders and show message, disables button */
function showLoginError() {
    document.getElementById('loginEmail').classList.add('InputFieldError');
    document.getElementById('loginPassword').classList.add('InputFieldError');
    document.getElementById('loginError').textContent =
      'Check your email and password. Please try again.';
    document.getElementById('loginButton').disabled = false;
}


/**
 * saves user in session storage
 * @param {string} userKey - same as contacts/login key in firebase
 */
async function saveLoggedInUser(userKey) {
  let user = await fetchContactData(userKey);
  let name = user.name;
  let initials = user.initials;
  let color = user.color;

  sessionStorage.setItem('contactId', userKey);
  sessionStorage.setItem('userName', name);
  sessionStorage.setItem('userInitials', initials);
  sessionStorage.setItem('userColor', color);

  sessionStorage.setItem('isGuest', 'false');
}


/**
 * Fetches contact data for a user from Firebase
 * @param {string} userKey - The contact ID in Firebase
 * @returns {Object} the contact object with name, initials, color, email etc.
 */
async function fetchContactData(userKey) {
  let response = await fetch(
    `https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/Contacts/${userKey}.json`,
  );
  let contactData = await response.json();
  return contactData;
}


/** 
 * Checks the login input values vs. database.
 * @param {Object} loginData - all login entries from Firebase
 * @param {string} email - the entered email address
 * @param {string} password - the entered password
 * @returns {string|false} the user key if match found, false otherwise
 */
function checkLoginData(loginData, email, password) {
  let users = Object.keys(loginData);
  for (let i = 0; i < users.length; i++) {
    if (loginData[users[i]].email === email && loginData[users[i]].password === password) {
      return users[i];
    }
  }
  return false;
}


document.getElementById('loginButton').addEventListener('click', function (event) {
  event.preventDefault();
  login();
});


document.getElementById('guestButton').addEventListener('click', function () {
  setGuest();
  window.location.href = 'summary.html';
});


/** saves guestlogin in sessionStorage */
function setGuest() {
  sessionStorage.setItem('contactId', '');
  sessionStorage.setItem('userName', '');
  sessionStorage.setItem('userInitials', 'G');
  sessionStorage.setItem('userColor', '#2A3647');
  sessionStorage.setItem('isGuest', 'true');
}

/** eventlistner removes error-message at new input */
document.getElementById('loginEmail').addEventListener('input', function (event) {
  event.target.classList.remove('InputFieldError');
  document.getElementById('loginPassword').classList.remove('InputFieldError');
});


/** checks sessionStorage if the animation already played and removes the skipAnimation if necessary */
function checkSessionForAnimation() {
  if (!sessionStorage.getItem('animationPlayed')) {
    document.getElementById('logoAnimation').classList.remove('skipAnimation');
    sessionStorage.setItem('animationPlayed', 'true');
  }
}


initPasswordToggles();
