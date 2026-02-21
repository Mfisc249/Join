checkSessionForAnimation();

/** Validates credentials and redirects on success */
async function login() {
    document.getElementById('loginError').textContent = '';
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    document.getElementById('loginButton').disabled = true;
    let loginData = await getLoginData();
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
    await fetchContact(userKey);
    // Save data to sessionStorage
    sessionStorage.setItem("id", "value");
}

// Get saved data from sessionStorage
let data = sessionStorage.getItem("key");

// Remove saved data from sessionStorage
sessionStorage.removeItem("key");

// Remove all saved data from sessionStorage
sessionStorage.clear();



async function getLoginData() {
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
    window.location.href = 'summary.html';
});

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