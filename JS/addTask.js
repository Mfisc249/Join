const BASE_URL =
  "https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/";

let subtasks = [];
let contacts = [];
let editingSubtaskIndex = null;

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
  field: "1",
};

document.getElementById("sidebar-slot").innerHTML = sidebarTemplate();
document.getElementById("header-slot").innerHTML = headerTemplate();

async function init() {
  renderTemplate();
  setupLiveValidation();
  setupPriorityButtons();
  setDefaultPriority();
  setDateMin();
  await loadContacts();
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
    const response = await fetch(`${BASE_URL}Tasks/${taskKey}.json`, {
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
  const categoryInput = document.getElementById("category");
  const dateInput = document.getElementById("DueDate");

  task.category = categoryInput.value;
  task.title = titleInput.value;
  task.description = descInput.value;
  task.dueDate = dateInput.value;

  errorMessage();
  if (!task.title || !task.description || !task.dueDate || !task.category) {
    return;
  }
  const success = await saveTask(task);

  if (success) {
    showToast(); // 🎉 NUR BEI ERFOLG
    clearForm();
  }
}

async function loadContacts() {
  try {
    const response = await fetch(`${BASE_URL}Contacts.json`);
    const data = await response.json();

    if (!data) return;

    contacts = Object.values(data);
    renderAssignedTo();
  } catch (error) {
    console.error("Fehler beim Laden der Contacts:", error);
  }
}

function errorMessage() {
  toggleRequired(document.getElementById("taskName"));
  toggleRequired(document.getElementById("taskDesc"));
  toggleRequired(document.getElementById("DueDate"));
  toggleRequired(document.getElementById("category"));
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
  task.field = "1";
  task.createdAt = null;

  const subtaskInput = document.getElementById("subtaskInput");
  if (subtaskInput) subtaskInput.value = "";

  console.log("Formular + Task-Objekt + Subtasks zurückgesetzt ✅");
}

function toggleRequired(inputElement) {
  if (!inputElement) return;

  const label = inputElement.closest("label");
  const requiredText = label?.querySelector(".requiredField");

  if (!requiredText) return;

  if (!inputElement.value) {
    requiredText.classList.add("visible");
    inputElement.classList.add("input-error"); // 🔴 Border rot
  } else {
    requiredText.classList.remove("visible");
    inputElement.classList.remove("input-error"); // ✅ Border normal
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

function renderAssignedTo() {
  const container = document.getElementById("assignedDropdown");
  if (!container) return;

  container.innerHTML = "";

  contacts.forEach((contact) => {
    container.innerHTML += `
      <div class="assignedOption" onclick="toggleContact('${contact.name}', this)">
     <span>${contact.name}</span>
        <img src="./assets/img/Rectangle_5.svg" alt="checkbox" class="checkBox">
      </div>
    `;
  });
}
function toggleContact(name, element) {
  const index = task.assignedTo.indexOf(name);

  if (index === -1) {
    task.assignedTo.push(name);
    element.classList.add("selected");
  } else {
    task.assignedTo.splice(index, 1);
    element.classList.remove("selected");
  }
}

function toggleAssignedDropdown() {
  const dropdown = document.getElementById("assignedDropdown");
  const arrow = document.querySelector(".dropDownArrow");
  const taskArrow = document.getElementById("taskArrow");

  dropdown.classList.toggle("hidden");

  if (dropdown.classList.contains("hidden")) {
    arrow.classList.remove("rotate");
    taskArrow.classList.remove("rotate");
  } else {
    arrow.classList.add("rotate");
    taskArrow.classList.add("rotate");
  }
}

function toggleOption(element) {
  element.classList.toggle("selected");
}

document.getElementById("taskName").classList.add("input-error");
