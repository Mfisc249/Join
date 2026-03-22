
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
    if (targetField == 'field1') {
        document.getElementById('field1').insertAdjacentHTML('beforeend', taskTamplate(refTask.id));
    }

    if (targetField == 'field2') {
        document.getElementById('field2').insertAdjacentHTML('beforeend', taskTamplate(refTask.id));
    }

    if (targetField == 'field3') {
        document.getElementById('field3').insertAdjacentHTML('beforeend', taskTamplate(refTask.id));
    }

    if (targetField == 'field4') {
        document.getElementById('field4').insertAdjacentHTML('beforeend', taskTamplate(refTask.id));
    }

    if (!['field1', 'field2', 'field3', 'field4'].includes(targetField)) {
        document.getElementById('field1').insertAdjacentHTML('beforeend', taskTamplate(refTask.id));
    }

    taskCatagory(refTask.id, document.getElementById(`boardTaskCatagory${refTask.id}`));
    updateSubtaskProgressbar(refTask.id);
    getTaskDetailsContacts(refTask.id, 0);
    taskCheckPriority(refTask.id, document.getElementById(`taskPriorityContainer${refTask.id}`));
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
    let refMovedTask = document.getElementById(`${task.id}`);
    if (refMovedTask && refMovedTask.parentNode) {
        refMovedTask.parentNode.removeChild(refMovedTask);
    }

    document.getElementById(`${field}`).insertAdjacentHTML('beforeend', taskTamplate(task.id));
    removeHighlightBoardTaskFields();
    taskCatagory(taskID, document.getElementById(`boardTaskCatagory${taskID}`));
    updateSubtaskProgressbar(taskID);
    getTaskDetailsContacts(taskID, 0);
    taskCheckPriority(taskID, document.getElementById(`taskPriorityContainer${taskID}`));
    checkFieldIsEmpty();
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

    task.field = task.field || {};
    task.field.field = `${field}`;

    document.getElementById(`${field}`).classList.remove("highlight");
    renderMovedTask(field);
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
        if (!placeholder) {
            field.innerHTML = `<div id="${placeholderId}" class="noTaskField taskContainer">${placeholderText}</div>`;
        }
    } else {
        if (placeholder) {
            placeholder.remove();
        }
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

/** Searches tasks by title and updates the view. */
async function searchTask() {
    let refSearchInput = document.getElementById('searchInput');
    if (refSearchInput.value.length >= 1) {
        startTheSearch(refSearchInput);
    } else if (refSearchInput.value.length == 0) {
        if (myMediaQuery.matches) {
            document.getElementById('taskTableContent').innerHTML = taskBoardTamplateMobile();
        } else {
            document.getElementById('taskTableContent').innerHTML = taskBoardTamplate();
        }
        TASK = [];
        TASKKEYS = [];
        count = 0;
        await render();
    }
}

/** Filters tasks by title and renders the matches. */
function startTheSearch(refSearchInput) {
    let filter = refSearchInput.value.toUpperCase();
    let searchCount = 0;
    emtyFieldContent();
    TASKKEYS[0].forEach(task => {
        let taskRef = TASK[0][`${task}`] || {};
        let refTaskTitle = safeText(taskRef.title, '');
        let refTaskDescription = safeText(taskRef.description, '');
        if (refTaskTitle.toUpperCase().indexOf(filter) > - 1 || refTaskDescription.toUpperCase().indexOf(filter) > - 1) {
            loadTaskTamplate(taskRef);
            checkFieldIsEmpty();
            searchCount++;
        }
    }
    )
    if (searchCount == 0) {
        document.getElementById('fields').innerHTML = `<div class="noTaskFound">No Tasks Found</div>`;
    }
}

/** Updates the animated progress bar width based on completed subtasks. */
function updateSubtaskProgressbar(taskID) {
    let completedPercentage = calculateSubtaskCompletionPercentage(taskID);
    let progressbarElement = document.getElementById(`subtaskProgressbar${taskID}`);
    if (!progressbarElement) {
        return;
    }

    let width = 0;
    let intervalId = setInterval(frame, 2);
    progressbarElement.style.width = width + "%";
    function frame() {
        if (width > completedPercentage) {
            clearInterval(intervalId);
        } else {
            width++;
            progressbarElement.style.width = width + "%";
        }
    }
}

/** Calculates the completion percentage of all subtasks for a task. */
function calculateSubtaskCompletionPercentage(taskID) {
    let task = getTaskById(taskID);
    let subTasks = safeArray(task.subTasks);
    let subtaskCheckedCountElement = document.getElementById(`subtaskCheckedCount${taskID}`);

    if (subTasks.length === 0) {
        document.getElementById(`allsubtaskProgressbar${taskID}`).classList.add("displayNone");
        return 0;
    }

    let completedSubtaskCount = 0;
    let subTasksReviewString = safeText(task?.subTasksReview?.[0], '');
    let subTaskReviewList = subTasksReviewString.length ? subTasksReviewString.split(',') : [];

    for (let index = 0; index < subTasks.length; index++) {
        let subTaskStatus = subTaskReviewList[index];
        if (subTaskStatus === 'C') {
            completedSubtaskCount++;
        }
    }

    if (subtaskCheckedCountElement) {
        subtaskCheckedCountElement.innerHTML = completedSubtaskCount;
    }

    return Math.round((completedSubtaskCount / subTasks.length) * 100);

}


/** Contacts section logic. */
/** Loads and renders all contacts assigned to the given task. */
function getTaskDetailsContacts(taskID, renderFunctionSelector) {
    let refAssignedTo = safeArray(getTaskById(taskID).assignedTo);
    for (let index = 0; index < refAssignedTo.length; index++) {
        let contact = refAssignedTo[`${index}`];
        let contactDetails = allContactDetails?.[`${contact}`];
        if (!contactDetails) {
            continue;
        }

        if (renderFunctionSelector == 0) {
            renderTaskContacts(contactDetails, taskID);
        } else {
            renderTaskDetailsContacts(contactDetails)
        }
    }
    if (refAssignedTo.length == 0 || refAssignedTo.length == undefined || refAssignedTo.length == null) {
        document.getElementById('taskDetailsATHeadline').classList.add('displayNone');
    }
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

    switch (normalizePriority(getTaskById(taskID).priority)) {
        case 'Low':
            refTaskPriorityContainer.innerHTML = '<img src="./assets/img/low_priority.svg" alt="Low Priority"></img>';
            break;

        case 'Medium':
            refTaskPriorityContainer.innerHTML = '<img src="./assets/img/medium_priority.svg" alt="Medium Priority"></img>';
            break;

        case 'Urgent':
            refTaskPriorityContainer.innerHTML = '<img src="./assets/img/high_priority.svg" alt="High Priority"></img>';
            break;
        default:
            refTaskPriorityContainer.innerHTML = '';
            break;
    }
}

/** Applies the category color style based on the task category. */
function taskCatagory(taskID, refTaskCatagory) {
    if (!refTaskCatagory) {
        return;
    }

    refTaskCatagory.classList.remove("boardTaskCatagoryBlue");
    refTaskCatagory.classList.remove("boardTaskCatagoryGreen");

    switch (normalizeCategory(getTaskById(taskID).category)) {
        case 'User Story':
            refTaskCatagory.classList.add("boardTaskCatagoryBlue");
            break;
        case 'Technical Task':
            refTaskCatagory.classList.add("boardTaskCatagoryGreen");
            break;
        default:
            break;
    }

}

/** Shows valid drop target highlights for the currently dragged task. */
function highlightBoardTaskFields() {
    let currentField = getTaskById(curentTraggedElement)?.field?.field;
    if (currentField == 'field1' && curentTraggedElement != null && curentTraggedElement != undefined) {
        document.getElementById('field2').insertAdjacentHTML('beforeend', highlightTaskTamplate(2));
        document.getElementById('field3').insertAdjacentHTML('beforeend', highlightTaskTamplate(3));
        document.getElementById('field4').insertAdjacentHTML('beforeend', highlightTaskTamplate(4));
    }
    if (currentField == 'field2' && curentTraggedElement != null && curentTraggedElement != undefined) {
        document.getElementById('field1').insertAdjacentHTML('beforeend', highlightTaskTamplate(1));
        document.getElementById('field3').insertAdjacentHTML('beforeend', highlightTaskTamplate(3));
        document.getElementById('field4').insertAdjacentHTML('beforeend', highlightTaskTamplate(4));
    }
    if (currentField == 'field3' && curentTraggedElement != null && curentTraggedElement != undefined) {
        document.getElementById('field1').insertAdjacentHTML('beforeend', highlightTaskTamplate(1));
        document.getElementById('field2').insertAdjacentHTML('beforeend', highlightTaskTamplate(2));
        document.getElementById('field4').insertAdjacentHTML('beforeend', highlightTaskTamplate(4));
    }
    if (currentField == 'field4' && curentTraggedElement != null && curentTraggedElement != undefined) {
        document.getElementById('field1').insertAdjacentHTML('beforeend', highlightTaskTamplate(1));
        document.getElementById('field2').insertAdjacentHTML('beforeend', highlightTaskTamplate(2));
        document.getElementById('field3').insertAdjacentHTML('beforeend', highlightTaskTamplate(3));
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

