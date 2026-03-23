/** Validates required form fields and toggles their error indicators. */
function errorMessage() {
  toggleRequired(document.getElementById("taskName"));
  toggleRequired(document.getElementById("taskDesc"));
  toggleRequired(document.getElementById("DueDate"));
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

/** Formats due date input as DD/MM/YYYY while the user types. */
function formatDueDateInput(input) {
  input.addEventListener("input", () => {
    let val = input.value.replace(/[^\d]/g, "");
    if (val.length > 8) val = val.slice(0, 8);

    let formatted = "";
    if (val.length > 4) {
      formatted = val.slice(0, 2) + "/" + val.slice(2, 4) + "/" + val.slice(4);
    } else if (val.length > 2) {
      formatted = val.slice(0, 2) + "/" + val.slice(2);
    } else {
      formatted = val;
    }

    input.value = formatted;
  });
}

/** Validates due date format and blocks dates earlier than today. */
function validateDueDateInput(input) {
  input.addEventListener("blur", () => {
    const regex = /^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/(\d{4})$/;
    if (!regex.test(input.value)) {
      input.value = "";
      return;
    }

    const [d, m, y] = input.value.split("/").map(Number);
    const chosenDate = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (chosenDate < today) {
      input.value = "";
    }
  });
}

/** Wires formatting and validation handlers to the due date field. */
function setupDueDateInput() {
  const input = document.getElementById("DueDate");
  if (!input) return;

  formatDueDateInput(input);
  validateDueDateInput(input);
}

/** Toggles the category dropdown arrow rotation state. */
function toggleCategoryArrow() {
  const arrow = document.getElementById("taskArrow");
  arrow.classList.toggle("rotate");
}
