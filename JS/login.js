console.log("Login loaded, baby!");

async function login() {
    document.getElementById('login-error').textContent = '';
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;
    let loginData = await getLoginData();
    let isValid = checkLoginData(loginData, email, password);
    
    if (isValid) {
    window.location.href = 'summary.html';
    } else {
    document.getElementById('login-error').textContent = 'Check your email and password. Please try again.';
}
}


document.getElementById('loginButton').addEventListener('click', function(event) {
    event.preventDefault();
    login();
});


document.getElementById('guestButton').addEventListener('click', function() {
    window.location.href = 'summary.html';
});


async function getLoginData() {
    let response = await fetch('https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/LoginData.json');
    let data = await response.json();
    return data;
}


function checkLoginData(loginData, email, password) {
    let users = Object.values(loginData);
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            return true;
        }
    }
    return false;
}