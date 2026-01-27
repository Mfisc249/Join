const BASE_URL =
  "https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/";

let subtasks = [];

let editingSubtaskIndex = null;

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
}

function renderTemplate() {
  document.getElementById("mainContent").innerHTML = createTaskTemplate();
}

function renderSubtasks() {
  var list = document.getElementById("subtaskList");
  list.innerHTML = "";

  var i;
  for (i = 0; i < task.subtasks.length; i++) {
    list.innerHTML += subtaskTemplate(task.subtasks[i], i);
  }
}

async function saveTask(task) {
  const taskKey = `addTask${Date.now()}`;

  try {
    const response = await fetch(`${BASE_URL}addTask/${taskKey}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Firebase save failed");
    }

    return true; // ✅ Erfolg
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    return false; // ❌ Fehler
  }
}

async function createTask() {
  const titleInput = document.getElementById("taskName");
  const descInput = document.getElementById("taskDesc");
  const assignedInput = document.getElementById("assignedTo");
  const categoryInput = document.getElementById("category");
  const dateInput = document.getElementById("DueDate");

  task.assignedTo = assignedInput.value;
  task.category = categoryInput.value;
  task.title = titleInput.value;
  task.description = descInput.value;
  task.dueDate = dateInput.value;
  task.createdAt = Date.now();

  errorMessage();
  if (
    !task.title ||
    !task.description ||
    !task.dueDate ||
    !task.priority ||
    !task.category
  ) {
    return;
  }
  const success = await saveTask(task);

  if (success) {
    showToast(); // 🎉 NUR BEI ERFOLG
    clearForm();
  }
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
  const buttons = document.querySelectorAll(".priorityButton");

  buttons.forEach((btn) => {
    btn.onclick = () => {
      // 👉 FALL 1: Button war schon aktiv → deaktivieren
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
        task.priority = "";
        return;
      }

      // 👉 FALL 2: neuer Button → alle anderen aus
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

function confirmSubtask() {
  const input = document.getElementById("subtaskInput");
  const value = input.value.trim();
  if (!value) return;

  task.subtasks.push(value);
  editingSubtaskIndex = null;
  renderSubtasks(); // ✅ NUR NOCH DAS
  input.value = "";
  input.focus();
}

function cancelSubtask() {
  const input = document.getElementById("subtaskInput");
  input.value = "";
  input.focus();
}

function deleteSubtask(index) {
  task.subtasks.splice(index, 1);
  renderSubtasks();
}

function startEditSubtask(index) {
  editingSubtaskIndex = index;
  renderSubtasks();
}

function saveEditedSubtask(index) {
  // alle Edit-Inputs abrufen
  const inputs = document.querySelectorAll(".subTaskEditInput");
  const input = inputs[0]; // es gibt nur ein aktives Edit-Input zurzeit
  const value = input.value.trim();

  if (!value) {
    editingSubtaskIndex = null;
    renderSubtasks();
    return;
  }

  // Wert speichern
  task.subtasks[index] = value;
  editingSubtaskIndex = null;
  renderSubtasks();
}

function handleEditKey(event, index, value) {
  if (event.key === "Enter") {
    saveEditedSubtask(index, value);
  }

  if (event.key === "Escape") {
    editingSubtaskIndex = null;
    renderSubtasks();
  }
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
