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
    await saveLogedInUser(userKey); 
    window.location.href = 'summary.html';
    document.getElementById('loginButton').disabled = false;
    } else {
    document.getElementById('loginEmail').classList.add('InputFieldError');
    document.getElementById('loginPassword').classList.add('InputFieldError');
    document.getElementById('loginError').textContent = 'Check your email and password. Please try again.';
    document.getElementById('loginButton').disabled = false;
    }
}

async function saveLogedInUser(userKey) {
    let user = await fetchContactData(userKey); 
    let name = user.name; 
    let initials = user.initials;
    let color = user.color; 
   
    sessionStorage.setItem("contactId", userKey);
    sessionStorage.setItem("userName", name);
    sessionStorage.setItem("userInitials", initials);
    sessionStorage.setItem("userColor", color);
    
    sessionStorage.setItem("isGuest", "false");
}


async function fetchContactData(userKey) {
    let response = await fetch(`https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/Contacts/${userKey}.json`);
    let contactData = await response.json();
    return contactData; 
}


async function fetchLoginData() {
    let response = await fetch('https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/LoginData.json');
    let data = await response.json();
    return data;
}


/** @returns {boolean} */
function checkLoginData(loginData, email, password) {
    let users = Object.keys(loginData);
    for (let i = 0; i < users.length; i++) {
        if (loginData[users[i]].email === email && loginData[users[i]].password === password) {
            return users[i];
        }
    }
    return false;
}


document.getElementById('loginButton').addEventListener('click', function(event) {
    event.preventDefault();
    login();
});


document.getElementById('guestButton').addEventListener('click', function() {
    setGuest(); 
    window.location.href = 'summary.html';
});

function setGuest() {
    sessionStorage.setItem("contactId", "");
    sessionStorage.setItem("userName", "");
    sessionStorage.setItem("userInitials", "G");
    sessionStorage.setItem("userColor", "#2A3647");
    sessionStorage.setItem("isGuest", "true");
}


document.getElementById('loginEmail').addEventListener('input', function(event) {
    event.target.classList.remove('InputFieldError');
    document.getElementById('loginPassword').classList.remove('InputFieldError');
});

function checkSessionForAnimation() {
 if (!(sessionStorage.getItem('animationPlayed'))) {
  document.getElementById('logoAnimation').classList.remove('skipAnimation');
  sessionStorage.setItem('animationPlayed', 'true');
} 
}

initPasswordToggles();