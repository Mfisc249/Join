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
