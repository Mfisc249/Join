getLoginHtml(); 

function getLoginHtml() {
   document.getElementById('content').innerHTML = loginHtml(); 
}


async function login() {
    document.getElementById('loginError').textContent = '';
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let loginData = await getLoginData();
    let isValid = checkLoginData(loginData, email, password);
    
    if (isValid) {
    window.location.href = 'summary.html';
    } else {
    document.getElementById('loginError').textContent = 'Check your email and password. Please try again.';
}
}


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


document.getElementById('loginButton').addEventListener('click', function(event) {
    event.preventDefault();
    login();
});


document.getElementById('guestButton').addEventListener('click', function() {
    window.location.href = 'summary.html';
});