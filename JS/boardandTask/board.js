
const BOARDURLBASE = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/';
let TASK = [];
let TASKKEYS = [];
let count = 0;
let highlightTaskCount = 0;
let curentTraggedElement;
let allContactDetails = [];
let myMediaQuery = window.matchMedia('(max-width: 1535px)');

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

function appendTaskToField(targetField, taskID) {
    let allFields = ['field1', 'field2', 'field3', 'field4'];
    if (allFields.includes(targetField)) {
        insertTaskIntoField(targetField, taskID);
        return;
    }
    insertTaskIntoField('field1', taskID);
}

function insertTaskIntoField(fieldID, taskID) {
    document.getElementById(fieldID).insertAdjacentHTML('beforeend', taskTamplate(taskID));
}

function renderTaskCardDetails(taskID) {
    taskCatagory(taskID, document.getElementById(`boardTaskCatagory${taskID}`));
    updateSubtaskProgressbar(taskID);
    getTaskDetailsContacts(taskID, 0);
    taskCheckPriority(taskID, document.getElementById(`taskPriorityContainer${taskID}`));
}

/** Clears the content of all board columns. */
function emtyFieldContent() {
    document.getElementById('field1').innerHTML = "";
    document.getElementById('field2').innerHTML = "";
    document.getElementById('field3').innerHTML = "";
    document.getElementById('field4').innerHTML = "";
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

function updateTaskFieldForMove(task, field) {
    task.field = task.field || {};
    task.field.field = `${field}`;
}

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

function addEmptyFieldPlaceholder(field, placeholder, placeholderId, placeholderText) {
    if (!placeholder) {
        field.innerHTML = `<div id="${placeholderId}" class="noTaskField taskContainer">${placeholderText}</div>`;
    }
}

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
async function searchTask() {
    let refSearchInput = document.getElementById('searchInput');
    if (refSearchInput.value.length >= 1) {
        startTheSearch(refSearchInput);
        return;
    }

    if (refSearchInput.value.length == 0) {
        setTaskTableTemplateByViewport();
        await resetTaskDataAndRender();
    }
}

function setTaskTableTemplateByViewport() {
    if (myMediaQuery.matches) {
        document.getElementById('taskTableContent').innerHTML = taskBoardTamplateMobile();
        return;
    }
    document.getElementById('taskTableContent').innerHTML = taskBoardTamplate();
}

async function resetTaskDataAndRender() {
    TASK = [];
    TASKKEYS = [];
    count = 0;
    await render();
}

/** Filters tasks by title and renders the matches. */
function startTheSearch(refSearchInput) {
    let filter = refSearchInput.value.toUpperCase();
    let searchCount = 0;
    emtyFieldContent();
    TASKKEYS[0].forEach(task => {
        searchCount = addMatchingTaskToSearchResults(task, filter, searchCount);
    });
    if (searchCount == 0) {
        showNoTaskFoundHint();
    }
}

function addMatchingTaskToSearchResults(task, filter, searchCount) {
    let taskRef = TASK[0][`${task}`] || {};
    if (!isTaskMatchingSearch(taskRef, filter)) {
        return searchCount;
    }
    loadTaskTamplate(taskRef);
    checkFieldIsEmpty();
    return searchCount + 1;
}

function isTaskMatchingSearch(taskRef, filter) {
    let refTaskTitle = safeText(taskRef.title, '');
    let refTaskDescription = safeText(taskRef.description, '');
    return refTaskTitle.toUpperCase().indexOf(filter) > - 1 || refTaskDescription.toUpperCase().indexOf(filter) > - 1;
}

function showNoTaskFoundHint() {
    document.getElementById('fields').innerHTML = `<div class="noTaskFound">No Tasks Found</div>`;
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

function animateProgressbar(progressbarElement, completedPercentage) {
    let width = 0;
    let intervalId = setInterval(() => {
        width = updateProgressbarFrame(intervalId, width, completedPercentage, progressbarElement);
    }, 2);
    progressbarElement.style.width = width + "%";
}

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

function hideSubtaskProgressbar(taskID) {
    document.getElementById(`allsubtaskProgressbar${taskID}`).classList.add("displayNone");
}

function calculateAndRenderSubtaskCompletion(task, subTasks, subtaskCheckedCountElement) {
    let subTaskReviewList = getSubTaskReviewList(task);
    let completedSubtaskCount = countCompletedSubtasks(subTasks, subTaskReviewList);
    renderCompletedSubtaskCount(subtaskCheckedCountElement, completedSubtaskCount);
    return Math.round((completedSubtaskCount / subTasks.length) * 100);
}

function renderCompletedSubtaskCount(subtaskCheckedCountElement, completedSubtaskCount) {
    if (subtaskCheckedCountElement) {
        subtaskCheckedCountElement.innerHTML = completedSubtaskCount;
    }
}

function getSubTaskReviewList(task) {
    let subTasksReviewString = safeText(task?.subTasksReview?.[0], '');
    return subTasksReviewString.length ? subTasksReviewString.split(',') : [];
}

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


/** Contacts section logic. */
/** Loads and renders all contacts assigned to the given task. */
function getTaskDetailsContacts(taskID, renderFunctionSelector) {
    let refAssignedTo = safeArray(getTaskById(taskID).assignedTo);
    renderAssignedContacts(refAssignedTo, taskID, renderFunctionSelector);
    if (shouldHideAssignedHeadline(refAssignedTo)) {
        document.getElementById('taskDetailsATHeadline').classList.add('displayNone');
    }
}

function renderAssignedContacts(refAssignedTo, taskID, renderFunctionSelector) {
    for (let index = 0; index < refAssignedTo.length; index++) {
        let contact = refAssignedTo[`${index}`];
        let contactDetails = getContactDetailsByKey(contact);
        if (!contactDetails) {
            continue;
        }
        renderSingleAssignedContact(contactDetails, taskID, renderFunctionSelector);
    }
}

function renderSingleAssignedContact(contactDetails, taskID, renderFunctionSelector) {
    if (renderFunctionSelector == 0) {
        renderTaskContacts(contactDetails, taskID);
        return;
    }
    renderTaskDetailsContacts(contactDetails);
}

function getContactDetailsByKey(contactKey) {
    return allContactDetails?.[`${contactKey}`];
}

function shouldHideAssignedHeadline(refAssignedTo) {
    return (refAssignedTo.length == 0 || refAssignedTo.length == undefined || refAssignedTo.length == null) && document.getElementById('taskDetailsATHeadline') != undefined;
}

/** Renders assigned contact badges on a board task card. */
function renderTaskContacts(contactDetails, taskID) {
    let refContactsContainer = document.getElementById(`taskContactsContainer${taskID}`);
    if (!refContactsContainer || !contactDetails) {
        return;
    }
    refContactsContainer.insertAdjacentHTML('beforeend', taskContactsTamplate(contactDetails.initials, contactDetails.color));
}

/** Renders the matching priority icon for a task. */
function taskCheckPriority(taskID, refTaskPriorityContainer) {
    if (!refTaskPriorityContainer) {
        return;
    }

    let priority = normalizePriority(getTaskById(taskID).priority);
    refTaskPriorityContainer.innerHTML = getPriorityIcon(priority);
}

function getPriorityIcon(priority) {
    switch (priority) {
        case 'Low':
            return '<img src="./assets/img/low_priority.svg" alt="Low Priority"></img>';
        case 'Medium':
            return '<img src="./assets/img/medium_priority.svg" alt="Medium Priority"></img>';
        case 'Urgent':
            return '<img src="./assets/img/high_priority.svg" alt="High Priority"></img>';
        default:
            return '';
    }
}

/** Applies the category color style based on the task category. */
function taskCatagory(taskID, refTaskCatagory) {
    if (!refTaskCatagory) {
        return;
    }

    clearCategoryClasses(refTaskCatagory);
    applyCategoryClass(taskID, refTaskCatagory);
}

function clearCategoryClasses(refTaskCatagory) {
    refTaskCatagory.classList.remove("boardTaskCatagoryBlue");
    refTaskCatagory.classList.remove("boardTaskCatagoryGreen");
}

function applyCategoryClass(taskID, refTaskCatagory) {
    switch (normalizeCategory(getTaskById(taskID).category)) {
        case 'User Story':
            refTaskCatagory.classList.add("boardTaskCatagoryBlue");
            return;
        case 'Technical Task':
            refTaskCatagory.classList.add("boardTaskCatagoryGreen");
            return;
    }
}

/** Shows valid drop target highlights for the currently dragged task. */
function highlightBoardTaskFields() {
    let currentField = getTaskById(curentTraggedElement)?.field?.field;
    if (curentTraggedElement == null || curentTraggedElement == undefined) {
        return;
    }

    appendHighlightToFields(getTargetHighlightFields(currentField));

}

function getTargetHighlightFields(currentField) {
    let fieldMap = {
        field1: [2, 3, 4],
        field2: [1, 3, 4],
        field3: [1, 2, 4],
        field4: [1, 2, 3],
    };
    return fieldMap[currentField] || [];
}

function appendHighlightToFields(targetFields) {
    for (let index = 0; index < targetFields.length; index++) {
        let fieldNumber = targetFields[index];
        document.getElementById(`field${fieldNumber}`).insertAdjacentHTML('beforeend', highlightTaskTamplate(fieldNumber));
    }
}

/** Removes all drag-and-drop highlight placeholders from the board. */
function removeHighlightBoardTaskFields() {
    if (document.getElementById('highlightTask1') != null) {
        document.getElementById('highlightTask1').remove();
    }
    if (document.getElementById('highlightTask2') != null) {
        document.getElementById('highlightTask2').remove();
    }
    if (document.getElementById('highlightTask3') != null) {
        document.getElementById('highlightTask3').remove();
    }
    if (document.getElementById('highlightTask4') != null) {
        document.getElementById('highlightTask4').remove();
    }
}

function shortenDescription(description) {
    if (description.length >= 40) {
        let refdescription = description.slice(0, 40);
        return refdescription + "..."
    }
    return description;
}

