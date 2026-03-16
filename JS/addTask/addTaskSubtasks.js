function renderSubTasks() {
  var list = document.getElementById("subtaskList");
  list.innerHTML = "";

  var i;
  for (i = 0; i < task.subTasks.length; i++) {
    list.innerHTML += subTaskTemplate(task.subTasks[i], i);
  }
}

function confirmSubtask() {
  const input = document.getElementById("subtaskInput");
  const value = input.value.trim();
  if (!value) return;

  task.subTasks.push(value);
  editingSubtaskIndex = null;
  renderSubTasks();
  input.value = "";
  input.focus();
}

function cancelSubtask() {
  const input = document.getElementById("subtaskInput");
  input.value = "";
  input.focus();
}

function deleteSubtask(index) {
  task.subTasks.splice(index, 1);
  renderSubTasks();
}

function startEditSubtask(index) {
  editingSubtaskIndex = index;
  renderSubTasks();
}

function saveEditedSubtask(index) {
  const inputs = document.querySelectorAll(".subTaskEditInput");
  const input = inputs[0];
  const value = input.value.trim();

  if (!value) {
    editingSubtaskIndex = null;
    renderSubTasks();
    return;
  }

  task.subTasks[index] = value;
  editingSubtaskIndex = null;
  renderSubTasks();
}

function handleEditKey(event, index, value) {
  if (event.key === "Enter") {
    saveEditedSubtask(index, value);
  }

  if (event.key === "Escape") {
    editingSubtaskIndex = null;
    renderSubTasks();
  }
}

function handleSubtaskKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    confirmSubtask();
  }
}

function setupSubtaskEnter() {
  const input = document.getElementById("subtaskInput");

  if (!input) {
    console.log("subtaskInput not found");
    return;
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmSubtask();
    }
  });
}
