const BASE_URL =
  "https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/";

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
  subTasks: [],
  field: "1",
};

async function init() {
  const boardDialog = document.getElementById("boardAddTask");
  if (boardDialog) {
    boardDialog.classList.remove("edit-task-dialog");
  }
  if (typeof isEditTaskMode !== "undefined") {
    isEditTaskMode = false;
  }
  renderTemplate();
  setupSubtaskEnter();
  setupAssignedDropdownClose();
  setupLiveValidation();
  setupPriorityButtons();
  setDefaultPriority();
  setupDueDateInput();
  await loadContacts();
}

function renderTemplate() {
  document.getElementById("mainContent").innerHTML = createTaskTemplate();
}

async function saveTask(task) {
  try {
    const existingTasks = (await DataGET("Tasks")) || {};
    const { taskID, taskKey } = generateTaskKey(existingTasks);

    return await saveTaskToFirebase(task, taskID, taskKey);
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    return null;
  }
}

async function saveTaskToFirebase(task, taskID, taskKey) {
  let checkboxString = task.subTasks.map(() => "U").toString();

  const payload = {
    ...task,
    id: taskID,
    field: { field: "field1" },
    assignedTo: task.assignedTo,
    subTasks: task.subTasks,
    subTasksReview: {
      0: checkboxString,
    },
  };

  await DataPUT(`Tasks/${taskKey}`, payload);

  console.log("Task saved:", taskKey);
  count++;
  return taskKey;
}

function generateTaskKey(existingTasks) {
  const keys = Object.keys(existingTasks || {});
  const lastIndex =
    keys.length > 0
      ? Math.max(...keys.map((k) => parseInt(k.replace("Task", ""))))
      : 0;
  const taskID = lastIndex + 1;
  const taskKey = "Task" + taskID;
  return { taskID, taskKey };
}

async function createTask() {
  const titleInput = document.getElementById("taskName");
  const descInput = document.getElementById("taskDesc");
  const dateInput = document.getElementById("DueDate");

  task.title = titleInput.value;
  task.description = descInput.value;
  task.dueDate = dateInput.value;
  task.category = selectedCategory;

  errorMessage();
  if (!task.title || !task.description || !task.dueDate) return null;

  const taskKey = await saveTask(task);

  if (taskKey) {
    showToast();
    clearForm();
    return taskKey;
  }

  return null;
}

async function createTaskAndRefreshBoard() {
  const taskKey = await createTask();
  if (taskKey) {
    createTaskBoard();
  }
}

function resetTaskData() {
  document.getElementById("taskForm").reset();

  task = {
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    assignedTo: [],
    category: "",
    subTasks: [],
    field: "1",
    createdAt: null,
  };
}

function resetSubTasksAndCategory() {
  document.getElementById("subtaskInput").value = "";
  renderSubTasks();

  selectedCategory = "";
  document.getElementById("categoryLabel").textContent = "Select category";
}

function resetAssignedContactsAndPriority() {
  document.getElementById("assignedPreviewContainer").innerHTML = "";
  renderSelectedContactsBelowInput();

  document
    .querySelectorAll(".priorityButton")
    .forEach((b) => b.classList.remove("active"));
  setDefaultPriority();
}

function clearForm() {
  resetTaskData();
  resetSubTasksAndCategory();
  resetAssignedContactsAndPriority();
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
