
const BOARDURLBASE = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/';
let TASK = [];
let TASKKEYS = [];
let count = 0;
let highlightTaskCount = 0;
let curentTraggedElement;
let allContactDetails = [];
let myMediaQuery = window.matchMedia('(max-width: 1723px)');

/** Initializes the board and renders tasks. */
async function boardInit() {
    if (myMediaQuery.matches) {
        document.getElementById('taskTableContent').innerHTML = taskBoardTamplateMobile();
        startLoadingScreenMobile();
    } else {
        document.getElementById('taskTableContent').innerHTML = taskBoardTamplate();
        startLoadingScreen();
    }
    await render();
}

/** Fetches tasks from Firebase and stores them in TASK. */
async function DataGET(path = "") {
    try {
        let response = await fetch(BOARDURLBASE + path + '.json');
        if (!response.ok) {
            return null;
        }
        let responseASJson = await response.json();
        return responseASJson;
    } catch (error) {
        return null;
    }
}

/** Writes/updates a task at the specified Firebase path. */
async function DataPUT(path = "", data = {}) {
    let response = await fetch(BOARDURLBASE + path + '.json', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

/** Loads tasks and renders board columns by category. */
async function render() {
    TASK = [];
    TASK.push(await DataGET('Tasks') || {});
    allContactDetails = await DataGET(`Contacts`) || {};
    emtyFieldContent();
    TASKKEYS = [];
    TASKKEYS.push(Object.keys(TASK[0] || {}));
    TASKKEYS[0].forEach(task => {
        loadTaskTamplate(TASK[0][`${task}`])
    });
    checkFieldIsEmpty();

}

/** Appends the task template to the appropriate column. */
async function loadTaskTamplate(refTask) {
    if (!refTask || refTask.id === undefined || refTask.id === null) {
        return;
    }

    let targetField = refTask?.field?.field;
    appendTaskToField(targetField, refTask.id);
    renderTaskCardDetails(refTask.id);
}

/** Appends a task card to the requested board column or falls back to the first column. */
function appendTaskToField(targetField, taskID) {
    let allFields = ['field1', 'field2', 'field3', 'field4'];
    if (allFields.includes(targetField)) {
        insertTaskIntoField(targetField, taskID);
        return;
    }
    insertTaskIntoField('field1', taskID);
}

/** Inserts a rendered task card into the given board column. */
function insertTaskIntoField(fieldID, taskID) {
    document.getElementById(fieldID).insertAdjacentHTML('beforeend', taskTamplate(taskID));
}

/** Populates the visual details of a rendered task card. */
function renderTaskCardDetails(taskID) {
    taskCatagory(taskID, document.getElementById(`boardTaskCatagory${taskID}`));
    updateSubtaskProgressbar(taskID);
    getTaskDetailsContacts(taskID, 0);
    taskCheckPriority(taskID, document.getElementById(`taskPriorityContainer${taskID}`));
}

/** Clears the content of all board columns. */
function emtyFieldContent() {
    ['field1', 'field2', 'field3', 'field4'].forEach(fieldId => {
        let field = document.getElementById(fieldId);
        if (field) {
            field.innerHTML = "";
        }
    });
}

/** Renders the moved task in the target column and removes the old one. */
function renderMovedTask(field, taskID = curentTraggedElement) {
    let task = getTaskById(taskID);
    if (task.id === undefined || task.id === null) {
        return;
    }
    removeExistingTaskElement(task.id);

    document.getElementById(`${field}`).insertAdjacentHTML('beforeend', taskTamplate(task.id));
    removeHighlightBoardTaskFields();
    renderTaskCardDetails(taskID);
    checkFieldIsEmpty();
}

/** Removes an already rendered task card element from the DOM before reinserting it. */
function removeExistingTaskElement(taskID) {
    let refMovedTask = document.getElementById(`${taskID}`);
    if (refMovedTask && refMovedTask.parentNode) {
        refMovedTask.parentNode.removeChild(refMovedTask);
    }
}

/** Sets the currently dragged task and starts the animation. */
function draggedTask(taskID) {
    curentTraggedElement = taskID;
    highlightBoardTaskFields();
    transormTask();

}

/** Enables dropping by preventing default behavior. */
function dragoverHandler(ev) {
    ev.preventDefault();
}

/** Moves the dragged task to the column and persists it. */
async function moveTo(field) {
    let task = getTaskById(curentTraggedElement);
    if (Object.keys(task).length === 0) {
        return;
    }

    updateTaskFieldForMove(task, field);
    document.getElementById(`${field}`).classList.remove("highlight");
    renderMovedTask(field);
    await persistMovedTaskField(field);
}

/** Updates the in-memory field value of the moved task. */
function updateTaskFieldForMove(task, field) {
    task.field = task.field || {};
    task.field.field = `${field}`;
}

/** Persists the updated task column after a drag-and-drop move. */
async function persistMovedTaskField(field) {
    await DataPUT(`Tasks/Task${curentTraggedElement}/field`, {
        'field': `${field}`,
    });
}

/** Shows hints when columns are empty (checks for real task elements). */
function checkFieldIsEmpty() {
    updateEmptyHintForField('field1', 'noTaskField1', 'No Tasks to do');
    updateEmptyHintForField('field2', 'noTaskField2', 'No Tasks in progress');
    updateEmptyHintForField('field3', 'noTaskField3', 'No Tasks await feedback');
    updateEmptyHintForField('field4', 'noTaskField4', 'No Tasks done');
}

/** Adds/removes the "no tasks" placeholder depending on whether the field has any task elements. */
function updateEmptyHintForField(fieldId, placeholderId, placeholderText) {
    let field = document.getElementById(fieldId);
    let hasTasks = field.querySelector('.task') !== null;
    let placeholder = document.getElementById(placeholderId);

    if (!hasTasks) {
        addEmptyFieldPlaceholder(field, placeholder, placeholderId, placeholderText);
        return;
    }
    removeExistingPlaceholder(placeholder);
}

/** Creates the empty-state placeholder inside a board column when no tasks exist. */
function addEmptyFieldPlaceholder(field, placeholder, placeholderId, placeholderText) {
    if (!placeholder) {
        field.innerHTML = `<div id="${placeholderId}" class="taskContainer noTaskField">${placeholderText}</div>`;
    }
}

/** Removes an existing empty-state placeholder from a board column. */
function removeExistingPlaceholder(placeholder) {
    if (placeholder) {
        placeholder.remove();
    }
}

/** Starts the rotation animation for the dragged task. */
function transormTask() {
    document.getElementById(`${curentTraggedElement}`).classList.add('rotate5deg');
}

/** Stops the rotation animation after a short delay. */
function endTransformTask() {
    removeHighlightBoardTaskFields();
    setTimeout(() => {
        document.getElementById(`${curentTraggedElement}`).classList.remove('rotate5deg')
    }, 100);
}

/** Closes the add-task dialog and reinitializes the board when necessary. */
function createTaskBoard(){
  const dialog = document.getElementById("boardAddTask");
   if (!!dialog?.open) {
       closedialog('boardAddTask');
       setTimeout(() => {
            boardInit();
       }, 200);
   }
    
}

/** Searches tasks by title and updates the view. */
function getActiveSearchInput() {
    let activeElement = document.activeElement;
    if (activeElement?.id === 'searchInput' || activeElement?.id === 'searchInputMobile') {
        return activeElement;
    }
}

async function searchTask() {
    let refSearchInput = getActiveSearchInput();
    if (!refSearchInput) {
        return;
    }

    if (refSearchInput.value.length >= 1) {
        startTheSearch(refSearchInput);
        return;
    }

    if (refSearchInput.value.length == 0) {
        setTaskTableTemplateByViewport();
        await resetTaskDataAndRender();
    }
}

/** Switches the board table template to the current desktop or mobile variant. */
function setTaskTableTemplateByViewport() {
    if (myMediaQuery.matches) {
        document.getElementById('taskTableContent').innerHTML = taskBoardTamplateMobile();
        return;
    }
    document.getElementById('taskTableContent').innerHTML = taskBoardTamplate();
}

/** Clears cached board data and renders the board again from the backend. */
async function resetTaskDataAndRender() {
    TASK = [];
    TASKKEYS = [];
    count = 0;
    await render();
}

/** Filters tasks by title and renders the matches. */
function startTheSearch(refSearchInput) {
    setTaskTableTemplateByViewport();
    let filter = refSearchInput.value.toUpperCase();
    let searchCount = 0;
    emtyFieldContent();
    safeArray(TASKKEYS[0]).forEach(task => {
        searchCount = addMatchingTaskToSearchResults(task, filter, searchCount);
    });
    if (searchCount == 0) {
        showNoTaskFoundHint();
    }
}

/** Adds a task to the search result view when it matches the current filter. */
function addMatchingTaskToSearchResults(task, filter, searchCount) {
    let taskRef = TASK[0][`${task}`] || {};
    if (!isTaskMatchingSearch(taskRef, filter)) {
        return searchCount;
    }
    loadTaskTamplate(taskRef);
    checkFieldIsEmpty();
    return searchCount + 1;
}

/** Checks whether a task title or description matches the search text. */
function isTaskMatchingSearch(taskRef, filter) {
    let refTaskTitle = safeText(taskRef.title, '');
    let refTaskDescription = safeText(taskRef.description, '');
    return refTaskTitle.toUpperCase().indexOf(filter) > - 1 || refTaskDescription.toUpperCase().indexOf(filter) > - 1;
}

/** Replaces the board columns with a no-results hint after an unsuccessful search. */
function showNoTaskFoundHint() {
    document.getElementById('taskTableContent').innerHTML = `<tr><td class="noTaskFound">No Tasks Found</td></tr>`;
}

/** Updates the animated progress bar width based on completed subtasks. */
function updateSubtaskProgressbar(taskID) {
    let completedPercentage = calculateSubtaskCompletionPercentage(taskID);
    let progressbarElement = document.getElementById(`subtaskProgressbar${taskID}`);
    if (!progressbarElement) {
        return;
    }

    animateProgressbar(progressbarElement, completedPercentage);
}

/** Animates a subtask progress bar up to the computed completion percentage. */
function animateProgressbar(progressbarElement, completedPercentage) {
    let width = 0;
    let intervalId = setInterval(() => {
        width = updateProgressbarFrame(intervalId, width, completedPercentage, progressbarElement);
    }, 2);
    progressbarElement.style.width = width + "%";
}

/** Advances the animated progress bar frame by frame until the target width is reached. */
function updateProgressbarFrame(intervalId, width, completedPercentage, progressbarElement) {
    if (width > completedPercentage) {
        clearInterval(intervalId);
        return width;
    }
    let nextWidth = width + 1;
    progressbarElement.style.width = nextWidth + "%";
    return nextWidth;
}

/** Calculates the completion percentage of all subtasks for a task. */
function calculateSubtaskCompletionPercentage(taskID) {
    let task = getTaskById(taskID);
    let subTasks = safeArray(task.subTasks);
    let subtaskCheckedCountElement = document.getElementById(`subtaskCheckedCount${taskID}`);

    if (subTasks.length === 0) {
        hideSubtaskProgressbar(taskID);
        return 0;
    }

    return calculateAndRenderSubtaskCompletion(task, subTasks, subtaskCheckedCountElement);
}

/** Hides the subtask progress display when a task has no subtasks. */
function hideSubtaskProgressbar(taskID) {
    document.getElementById(`allsubtaskProgressbar${taskID}`).classList.add("displayNone");
}

/** Calculates completed subtasks, updates the counter, and returns the completion percentage. */
function calculateAndRenderSubtaskCompletion(task, subTasks, subtaskCheckedCountElement) {
    let subTaskReviewList = getSubTaskReviewList(task);
    let completedSubtaskCount = countCompletedSubtasks(subTasks, subTaskReviewList);
    renderCompletedSubtaskCount(subtaskCheckedCountElement, completedSubtaskCount);
    return Math.round((completedSubtaskCount / subTasks.length) * 100);
}

/** Writes the number of completed subtasks into the related counter element. */
function renderCompletedSubtaskCount(subtaskCheckedCountElement, completedSubtaskCount) {
    if (subtaskCheckedCountElement) {
        subtaskCheckedCountElement.innerHTML = completedSubtaskCount;
    }
}

/** Reads the saved subtask review states and returns them as an array. */
function getSubTaskReviewList(task) {
    let subTasksReviewString = safeText(task?.subTasksReview?.[0], '');
    return subTasksReviewString.length ? subTasksReviewString.split(',') : [];
}

/** Counts how many subtasks are marked as completed in the review list. */
function countCompletedSubtasks(subTasks, subTaskReviewList) {
    let completedSubtaskCount = 0;
    for (let index = 0; index < subTasks.length; index++) {
        let subTaskStatus = subTaskReviewList[index];
        if (subTaskStatus === 'C') {
            completedSubtaskCount++;
        }
    }
    return completedSubtaskCount;
}

