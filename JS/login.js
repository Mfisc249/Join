getLoginHtml(); 


/**
 * Loads and displays the login HTML content in the content container
 */
function getLoginHtml() {
   document.getElementById('content').innerHTML = loginHtml();
   initPasswordToggles();
}


/**
 * Handles the login process by validating user credentials
 * Displays error messages if login fails, redirects to summary page on success
 * @async
 */
async function login() {
    document.getElementById('loginError').textContent = '';
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    document.getElementById('loginButton').disabled = true;
    let loginData = await getLoginData();
    let isValid = checkLoginData(loginData, email, password);
    
    if (isValid) {
    window.location.href = 'summary.html';
    document.getElementById('loginButton').disabled = false;
    } else {
    document.getElementById('loginEmail').classList.add('InputFieldError');
    document.getElementById('loginPassword').classList.add('InputFieldError');
    document.getElementById('loginError').textContent = 'Check your email and password. Please try again.';
    document.getElementById('loginButton').disabled = false;
    }
}


/**
 * Fetches login data from Firebase database
 * @async
 * @returns {Promise<Object>} Object containing user login data
 */
async function getLoginData() {
    let response = await fetch('https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/LoginData.json');
    let data = await response.json();
    return data;
}


/**
 * Validates user credentials against stored login data
 * @param {Object} loginData - Object containing all user login credentials
 * @param {string} email - Email address entered by the user
 * @param {string} password - Password entered by the user
 * @returns {boolean} True if credentials are valid, false otherwise
 */
function checkLoginData(loginData, email, password) {
    let users = Object.values(loginData);
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            return true;
        }
    }
    return false;
}


/**
 * Event listener for login button
 * Prevents default form submission and triggers login function
 */
document.getElementById('loginButton').addEventListener('click', function(event) {
    event.preventDefault();
    login();
});


/**
 * Event listener for guest login button
 * Redirects directly to summary page without authentication
 */
document.getElementById('guestButton').addEventListener('click', function() {
    window.location.href = 'summary.html';
});

/**
 * Event listener for email input field
 * Removes error styling from both email and password fields when user types
 */
document.getElementById('loginEmail').addEventListener('input', function(event) {
    event.target.classList.remove('InputFieldError');
    document.getElementById('loginPassword').classList.remove('InputFieldError');
});

