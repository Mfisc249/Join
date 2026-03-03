function renderSubtasks() {
  var list = document.getElementById("subtaskList");
  list.innerHTML = "";

  var i;
  for (i = 0; i < task.subtasks.length; i++) {
    list.innerHTML += subtaskTemplate(task.subtasks[i], i);
  }
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

function handleSubtaskKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // 🚨 verhindert Form Submit
    confirmSubtask(); // erstellt NUR den Subtask
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
      event.preventDefault(); // verhindert Form Submit (Haupttask)
      confirmSubtask(); // erstellt Subtask
    }
  });
}
