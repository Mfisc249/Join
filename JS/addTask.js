const BASE_URL =
  "https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/";

let taskCounter = 1;

let subtasks = [];

const urgentBtn = document.querySelector(".importanceLevel:nth-child(1)");
const mediumBtn = document.querySelector(".importanceLevel:nth-child(2)");
const lowBtn = document.querySelector(".importanceLevel:nth-child(3)");

let task = {
  title: "",
  description: "",
  dueDate: "",
  priority: "",
  assignedTo: [],
  category: "",
  subtasks: [],
};

async function init() {
  renderTemplate();
  setupPriorityButtons();
  setDefaultPriority();
  setDateMin();
  await loadTaskCounter();
}

function renderTemplate() {
  document.getElementById("mainContent").innerHTML = createTaskTemplate();
}

async function saveTask(task) {
  const taskKey = `addTask${taskCounter}`;

  const response = await fetch(`${BASE_URL}addTask/${taskKey}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (response.ok) {
    console.log("Task gespeichert als:", taskKey);
    taskCounter++; // nächster Task
  }
}

async function loadTaskCounter() {
  const response = await fetch(`${BASE_URL}tasks.json`);
  const data = await response.json();

  if (!data) {
    taskCounter = 1;
  } else {
    taskCounter = Object.keys(data).length + 1;
  }
}

async function createTask() {
  const titleInput = document.getElementById("taskName");
  const descInput = document.getElementById("taskDesc");
  const subtaskInput = document.getElementById("subtaskInput");
  const assignedInput = document.getElementById("assignedTo");
  const categoryInput = document.getElementById("category");
  const dateInput = document.getElementById("DueDate");

  task.assignedTo = assignedInput.value;
  task.category = categoryInput.value;
  task.title = titleInput.value;
  task.description = descInput.value;
  task.dueDate = dateInput.value;
  task.createdAt = Date.now();

  if (subtaskInput.value) {
    task.subtasks = subtaskInput.value.split(",");
  } else {
    task.subtasks = [];
  }
  errorMessage();
  if (
    !task.title ||
    !task.description ||
    !task.dueDate ||
    !task.priority ||
    !task.category
  ) {
  }

  await saveTask(task);
  clearForm();
}

function errorMessage() {
  toggleRequired(document.getElementById("taskName"));
  toggleRequired(document.getElementById("taskDesc"));
  toggleRequired(document.getElementById("DueDate"));
  toggleRequired(document.getElementById("priority"));
}
function clearForm() {
  document.getElementById("taskForm").reset();
  task.title = "";
  task.description = "";
  task.dueDate = "";
  task.priority = "";
  task.assignedTo = [];
  task.category = "";
  task.subtasks = [];
  task.createdAt = null;

  const subtaskInput = document.getElementById("subtaskInput");
  if (subtaskInput) subtaskInput.value = "";

  console.log("Formular + Task-Objekt + Subtasks zurückgesetzt ✅");
}

function toggleRequired(inputElement) {
  if (!inputElement) return;

  const container = inputElement.closest("label") || inputElement.parentElement;
  const requiredText = container.querySelector(".requiredField");

  if (!requiredText) return;

  if (!inputElement.value) {
    requiredText.classList.add("visible");
  } else {
    requiredText.classList.remove("visible");
  }
}

function setupPriorityButtons() {
  const buttons = document.querySelectorAll(".importanceLevel");

  buttons.forEach((btn) => {
    btn.onclick = () => {
      if (btn.classList.contains("active")) {
        // Button deaktivieren
        btn.classList.remove("active");
        btn.style.backgroundColor = "white";
        btn.style.color = "black";
        task.priority = "";
      } else {
        // Alle Buttons zurücksetzen
        buttons.forEach((b) => {
          b.classList.remove("active");
          b.style.backgroundColor = "white";
          b.style.color = "black";
        });

        // Geklickten Button aktivieren
        btn.classList.add("active");
        task.priority = btn.textContent;

        if (btn.textContent === "Urgent") btn.style.backgroundColor = "#ff2020";
        if (btn.textContent === "Medium") btn.style.backgroundColor = "orange";
        if (btn.textContent === "Low") btn.style.backgroundColor = "#00cf00";

        btn.style.color = "white";
      }
    };
  });
}

function setDefaultPriority() {
  const buttons = document.querySelectorAll(".importanceLevel");
  const defaultBtn = buttons[1]; // Medium
  defaultBtn.classList.add("active");
  defaultBtn.style.backgroundColor = "orange";
  defaultBtn.style.color = "white"; // Schriftfarbe beim Standardwert
  task.priority = "Medium";
}

function setDateMin() {
  const dateInput = document.getElementById("DueDate");
  if (!dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  dateInput.min = `${yyyy}-${mm}-${dd}`;
  dateInput.value = "";
}
