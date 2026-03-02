function errorMessage() {
  toggleRequired(document.getElementById("taskName"));
  toggleRequired(document.getElementById("taskDesc"));
  toggleRequired(document.getElementById("DueDate"));
}

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

function setDefaultPriority() {
  const defaultBtn = document.querySelector(".priorityButton.medium");
  defaultBtn.classList.add("active");
  task.priority = "Medium";
}

function formatDueDateInput(input) {
  input.addEventListener("input", () => {
    // Nur Zahlen erlauben
    let val = input.value.replace(/[^\d]/g, "");
    if (val.length > 8) val = val.slice(0, 8);

    // Automatisch Slashes setzen
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

function validateDueDateInput(input) {
  input.addEventListener("blur", () => {
    // Prüfen, ob Format DD/MM/YYYY korrekt ist
    const regex = /^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/(\d{4})$/;
    if (!regex.test(input.value)) {
      input.value = "";
      return;
    }

    // Prüfen, ob Datum in der Zukunft liegt
    const [d, m, y] = input.value.split("/").map(Number);
    const chosenDate = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (chosenDate < today) {
      input.value = "";
    }
  });
}

function setupDueDateInput() {
  const input = document.getElementById("DueDate");
  if (!input) return;

  formatDueDateInput(input);
  validateDueDateInput(input);
}

function toggleCategoryArrow() {
  const arrow = document.getElementById("taskArrow");
  arrow.classList.toggle("rotate");
}
