/**
 * Auth Guard – Redirects unauthenticated users to login.
 * Only runs on protected pages (not login, signup, legal, etc.).
 */
function checkAuth() {
  let publicPages = ["index.html", "signup.html", "privacy_policy.html", "legal_notice.html", "help.html", ""];
  let currentPage = location.pathname.split("/").pop() || "index.html";
  if (publicPages.includes(currentPage)) return;
  let contactId = sessionStorage.getItem("contactId");
  let isGuest = sessionStorage.getItem("isGuest");
  if (!contactId && isGuest !== "true") {
    window.location.href = "index.html";
  }
}

checkAuth();


/**
 * Initializes password toggle functionality for all password fields.
 * Swaps icons based on input state: lock (empty), visibility_off (hidden), visibility (visible).
 */
function initPasswordToggles() {
  let wrappers = document.querySelectorAll(".InputWrapper");

  wrappers.forEach(function (wrapper) {
    let input = wrapper.querySelector('input[type="password"]');
    if (!input) return;

    let icon = wrapper.querySelector(".InputFieldIcon");

    input.addEventListener("input", function () {
      updatePasswordIcon(input, icon);
    });

    icon.addEventListener("click", function () {
      togglePasswordVisibility(input, icon);
    });
  });
}

/**
 * Updates the password field icon based on whether the input has content.
 * @param {HTMLInputElement} input - The password input field
 * @param {HTMLImageElement} icon - The icon element next to the input
 */
function updatePasswordIcon(input, icon) {
  if (input.value.length > 0) {
    if (input.type === "password") {
      icon.src = "./assets/img/visibility_off.svg";
    }
    icon.classList.add("clickable");
  } else {
    input.type = "password";
    icon.src = "./assets/img/lock.svg";
    icon.classList.remove("clickable");
  }
}

/**
 * Toggles password visibility between hidden and visible states.
 * @param {HTMLInputElement} input - The password input field
 * @param {HTMLImageElement} icon - The icon element to swap
 */
function togglePasswordVisibility(input, icon) {
  if (input.value.length === 0) return;

  if (input.type === "password") {
    input.type = "text";
    icon.src = "./assets/img/visibility.svg";
  } else {
    input.type = "password";
    icon.src = "./assets/img/visibility_off.svg";
  }
}


/** Injects landscape overlay into body (global, no HTML copy-paste needed) */
function initLandscapeOverlay() {
  let overlay = document.createElement('div');
  overlay.className = 'landscapeOverlay';
  overlay.innerHTML = `
    <img src="./assets/icons/logo-login.svg" alt="Join Logo">
    <p>Please rotate your device to portrait mode.</p>`;
  document.body.insertBefore(overlay, document.body.firstChild);
}


async function fetchLoginData() {
    let response = await fetch('https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/LoginData.json');
    let loginData = await response.json();
    return loginData;
}


initLandscapeOverlay();