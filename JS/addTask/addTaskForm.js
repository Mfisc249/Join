/** Validates required form fields and toggles their error indicators. */
function errorMessage() {
  toggleRequired(document.getElementById("taskName"));
  toggleRequired(document.getElementById("DueDate"));
  validateCategory();
}

/** Shows or hides required-field styling based on the input value. */
function toggleRequired(inputElement) {
  if (!inputElement) return;

  const label = inputElement.closest("label");
  const requiredText = label?.querySelector(".requiredField");

  if (!requiredText) return;

  if (!inputElement.value) {
    requiredText.classList.add("visible");
    inputElement.classList.add("input-error");
  } else {
    requiredText.classList.remove("visible");
    inputElement.classList.remove("input-error");
  }
}

/** Attaches live input validation handlers to add-task form controls. */
function setupLiveValidation() {
  const inputs = document.querySelectorAll(
    "#taskForm textarea, #taskForm input, #taskForm select",
  );

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      toggleRequired(input);
    });
  });
}

/** Initializes priority button behavior and updates task priority state. */
function setupPriorityButtons() {
  const buttons = document.querySelectorAll(".priorityButton");

  buttons.forEach((btn) => {
    btn.onclick = () => {
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
        task.priority = "";
        return;
      }

      buttons.forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      if (btn.classList.contains("urgent")) task.priority = "Urgent";
      if (btn.classList.contains("medium")) task.priority = "Medium";
      if (btn.classList.contains("low")) task.priority = "Low";
    };
  });
}

/** Sets the default active priority button and task priority value. */
function setDefaultPriority(standartSelect = ".priorityButton.medium") {
  const defaultBtn = document.querySelector(standartSelect);
  defaultBtn.classList.add("active");
  task.priority = "Medium";
}

/** Wires formatting and validation handlers to the due date field. */
function setupDueDateInput() {
  const input = document.getElementById("DueDate");
  if (!input) return;

  const today = getTodayLocal();

  // Prevent past dates in the calendar
  input.min = today;

  input.addEventListener("blur", () => {
    if (!input.value) return;

    // Allow only today or future dates
    if (input.value < today) {
      input.value = "";
    }
  });
}

function getTodayLocal() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/** Toggles the category dropdown arrow rotation state. */
function toggleCategoryDropdown(event) {
  event.stopPropagation(); // Prevent other click handlers from firing

  const dropdown = document.getElementById("categoryDropdown");
  const arrow = document.getElementById("categoryDropdownArrow");

  dropdown.classList.toggle("hidden");
  arrow.classList.toggle("rotate");
}

function validateCategory() {
  const categoryLabel = document.getElementById("categoryLabel");
  const error = document.getElementById("categoryError"); // Fix
  const button = document.querySelector(".TaskCategoryInput");

  if (!categoryLabel || !error || !button) return;

  const isEmpty = categoryLabel.textContent === "Select task category";

  if (isEmpty) {
    error.classList.add("visible");
    button.classList.add("input-error");
  } else {
    error.classList.remove("visible");
    button.classList.remove("input-error");
  }
}

function closeCategoryDropdown(event) {
  const dropdown = document.getElementById("categoryDropdown");
  const button = document.querySelector(".TaskCategoryInput");
  const arrow = document.getElementById("categoryDropdownArrow");

  if (!dropdown || !button) return;

  // If the click is outside the button and dropdown
  if (!button.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.add("hidden");
    arrow.classList.remove("rotate");
  }
}

function resetValidation() {
  // Fehlermeldungen ausblenden
  document.querySelectorAll(".requiredField").forEach((el) => {
    el.classList.remove("visible");
  });

  // Rote Rahmen entfernen
  document.querySelectorAll(".input-error").forEach((el) => {
    el.classList.remove("input-error");
  });
}

function resetValidation() {
  // Fehlermeldungen ausblenden
  document.querySelectorAll(".requiredField").forEach((el) => {
    el.classList.remove("visible");
  });

  // Rote Rahmen entfernen
  document.querySelectorAll(".input-error").forEach((el) => {
    el.classList.remove("input-error");
  });
}
