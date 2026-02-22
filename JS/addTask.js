const BASE_URL =
  "https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/";

let subtasks = [];
let contacts = [];
let editingSubtaskIndex = null;
let assignedPreviewMode = false;

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
  renderSubtasks();
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
  const inputs = document.querySelectorAll(".subTaskEditInput");
  const input = inputs[0];
  const value = input.value.trim();

  if (!value) {
    editingSubtaskIndex = null;
    renderSubtasks();
    return;
  }

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

async function renderAssignedTo() {
  const container = document.getElementById("assignedDropdown");
  if (!container) return;

  let html = "";

  contacts.forEach((contact) => {
    html += contactInitialsCircleTemplate(contact);
  });

  container.innerHTML = html;
}

function toggleContact(name, element) {
  const index = task.assignedTo.indexOf(name);
  const img = element.querySelector(".checkBox");

  if (index === -1) {
    task.assignedTo.push(name);
    element.classList.add("selected");
    img.src = "./assets/img/checkButton.svg";
  } else {
    task.assignedTo.splice(index, 1);
    element.classList.remove("selected");
    img.src = "./assets/img/Rectangle_5.svg";
  }

  const dropdown = document.getElementById("assignedDropdown");
  if (dropdown.classList.contains("hidden")) {
    renderSelectedContactsBelowInput();
  }
}

function toggleAssignedDropdown() {
  const dropdown = document.getElementById("assignedDropdown");
  const arrow = document.getElementById("assignedDropdownArrow");
  const label = document.getElementById("clearContact");

  if (dropdown.classList.contains("hidden")) {
    openDropdown(dropdown, arrow, label);
    return;
  }

  if (!assignedPreviewMode) {
    openPreview(dropdown, arrow, label);
    return;
  }

  closeDropdown(dropdown, arrow, label);
}

function updateAssignedLabel() {
  const label = document.getElementById("clearContact");
  label.textContent = "Select contacts to assign";
}

function renderSelectedContactsInDropdown() {
  const container = document.getElementById("assignedDropdown");
  if (!container) return;

  let html = "";
  contacts.forEach((contact) => {
    if (task.assignedTo.includes(contact.name)) {
      html += contactInitialsCircleTemplate(contact);
    }
  });

  container.innerHTML = html;

  if (task.assignedTo.length === 0) {
    container.innerHTML = "";
  }
}

function toggleCategoryArrow() {
  const arrow = document.getElementById("taskArrow");
  arrow.classList.toggle("rotate");
}

function renderSelectedContactsBelowInput() {
  const previewContainer = document.getElementById("assignedPreviewContainer");
  const dropdown = document.getElementById("assignedDropdown");
  if (!previewContainer) return;

  if (!dropdown.classList.contains("hidden")) {
    previewContainer.innerHTML = "";
    return;
  }

  if (task.assignedTo.length === 0) {
    previewContainer.innerHTML = "";
    return;
  }
  let html = "";
  contacts.forEach((contact) => {
    if (task.assignedTo.includes(contact.name)) {
      html += contactInitialsPreviewTemplate(contact);
    }
  });

  previewContainer.innerHTML = html;
}

function openDropdown(dropdown, arrow, label) {
  dropdown.classList.remove("hidden");
  arrow.classList.add("rotate");
  renderAssignedTo();
  label.textContent = "";
  assignedPreviewMode = false;
}

function openPreview(dropdown, arrow, label) {
  if (task.assignedTo.length > 0) {
    renderSelectedContactsInDropdown();
    label.textContent = "An:";
    assignedPreviewMode = true;
  } else {
    dropdown.classList.add("hidden");
    arrow.classList.remove("rotate");
    assignedPreviewMode = false;
  }
}

function closeDropdown(dropdown, arrow, label) {
  dropdown.classList.add("hidden");
  arrow.classList.remove("rotate");
  assignedPreviewMode = false;
  label.textContent = "Select contacts to assign";
  renderSelectedContactsBelowInput();
}
