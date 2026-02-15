
const BOARDURLBASE = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/';
let TASK = [];
let TASKKEYS = [];
let count = 0;
let highlightTaskCount = 0;
let curentTraggedElement;
let allContactDetails = [];

/** Initializes the board and renders tasks. */
async function init() {
    document.getElementById('fields').innerHTML = taskBoardTamplate();
    await render();
}

/** Fetches tasks from Firebase and stores them in TASK. */
async function DataGET(path = "") {
    let response = await fetch(BOARDURLBASE + path + '.json');
    let responseASJson = await response.json();
    return responseASJson;
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
    TASK.push(await DataGET('Tasks'));
    allContactDetails = await DataGET(`Contacts`);
    emtyFieldContent();
    TASKKEYS = [];
    TASKKEYS.push(Object.keys(TASK[0]));
    TASKKEYS[0].forEach(task => {
        loadTaskTamplate(TASK[0][`${task}`])
    });
    checkFieldIsEmpty();

}

/** Appends the task template to the appropriate column. */
async function loadTaskTamplate(refTask) {
    if (refTask.field.field == 'field1') {
        document.getElementById('field1').innerHTML += taskTamplate(refTask.id);
    }

    if (refTask.field.field == 'field2') {
        document.getElementById('field2').innerHTML += taskTamplate(refTask.id);
    }

    if (refTask.field.field == 'field3') {
        document.getElementById('field3').innerHTML += taskTamplate(refTask.id);
    }

    if (refTask.field.field == 'field4') {
        document.getElementById('field4').innerHTML += taskTamplate(refTask.id);
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

/** Saves a new task and renders it in 'field1'. */
// async function renderaddedTask(taskID, refTitel, refContent) {
//     await DataPUT(`Tasks/Task${taskID}`, {
//         'title': `${refTitel.value}`,
//         'id': taskID,
//         'field': 'field1',
//         'content': `${refContent.value}`,
//         'assignedTo': "c1,c5",
//         'priority': "Medium",
//         'category': "User Story",
//         'dueDate': "27/01/2026",
//         'subTasks': "Implement Recipe Recommendation,Start Page Layout"
//     });
//     document.getElementById('field1').innerHTML += taskTamplate(taskID);
//     checkFieldIsEmpty();
// }

/** Renders the moved task in the target column and removes the old one. */
function renderMovedTask(field) {
    let refMovedTask = document.getElementById(`${TASK[0][`Task${curentTraggedElement}`].id}`);
    refMovedTask.parentNode.removeChild(refMovedTask);
    document.getElementById(`${field}`).innerHTML += taskTamplate(TASK[0][`Task${curentTraggedElement}`].id);
    checkFieldIsEmpty();
    taskCatagory(curentTraggedElement, document.getElementById(`boardTaskCatagory${curentTraggedElement}`));
    updateSubtaskProgressbar(curentTraggedElement);
    getTaskDetailsContacts(curentTraggedElement, 0);
    taskCheckPriority(curentTraggedElement, document.getElementById(`taskPriorityContainer${curentTraggedElement}`));
    removeHighlightBoardTaskFields();
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
    TASK[0][`Task${curentTraggedElement}`].field.field = `${field}`;
    document.getElementById(`${field}`).classList.remove("highlight");
    renderMovedTask(field);
    await DataPUT(`Tasks/Task${curentTraggedElement}/field`, {
        'field': `${field}`,
    });

}

/** Creates a new task from the form and renders it. */
// async function formIsSubmittet() {
//     let taskID = TASKKEYS[0].length + count;
//     let taskVar = "Task" + taskID;
//     let refTitel = document.getElementById('titleId');
//     let refContent = document.getElementById('contentId');
//     TASK[0][taskVar] = {
//         'id': taskID,
//         'title': `${refTitel.value}`,
//         'field': 'field1',
//         'content': `${refContent.value}`,
//         'assignedTo': "c1,c5",
//         'priority': "Medium",
//         'category': "User Story",
//         'dueDate': "27/01/2026",
//         'subTasks': "Implement Recipe Recommendation,Start Page Layout"
//     }
//     count++;
//     await renderaddedTask(taskID, refTitel, refContent);

// }

/** Shows hints when columns are empty. */
function checkFieldIsEmpty() {
    document.getElementById('field1').hasChildNodes() == false ? document.getElementById('field1').innerHTML = `<div id="noTaskField1" class="noTaskField taskContainer">No Tasks to do</div>` : null;
    (document.getElementById('field1').childElementCount >= 2) && (document.getElementById('noTaskField1') != null) ? document.getElementById('noTaskField1').remove() : null;
    document.getElementById('field2').hasChildNodes() == false ? document.getElementById('field2').innerHTML = `<div id="noTaskField2" class="noTaskField taskContainer">No Tasks in progress</div>` : null;
    (document.getElementById('field2').childElementCount >= 2) && (document.getElementById('noTaskField2') != null) ? document.getElementById('noTaskField2').remove() : null;
    document.getElementById('field3').hasChildNodes() == false ? document.getElementById('field3').innerHTML = `<div id="noTaskField3" class="noTaskField taskContainer">No Tasks await feedback</div>` : null;
    (document.getElementById('field3').childElementCount >= 2) && (document.getElementById('noTaskField3') != null) ? document.getElementById('noTaskField3').remove() : null;
    document.getElementById('field4').hasChildNodes() == false ? document.getElementById('field4').innerHTML = `<div id="noTaskField4" class="noTaskField taskContainer">No Tasks done</div>` : null;
    (document.getElementById('field4').childElementCount >= 2) && (document.getElementById('noTaskField4') != null) ? document.getElementById('noTaskField4').remove() : null;
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
        document.getElementById('fields').innerHTML = taskBoardTamplate();
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
        let refTaskTitle = TASK[0][`${task}`].title;
        let refTskContent = TASK[0][`${task}`].content;
        if (refTaskTitle.toUpperCase().indexOf(filter) > - 1 || refTskContent.toUpperCase().indexOf(filter) > - 1) {
            loadTaskTamplate(TASK[0][`${task}`]);
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
    let completedSubtaskCount = 0;
    let subTasksReview = TASK[0][`Task${taskID}`].subTasksReview;
    let subTasksString = TASK[0][`Task${taskID}`].subTasks;
    let subTaskCount = (subTasksString.match(/,/g) || []).length + 1;
    for (let index = 0; index < subTaskCount; index++) {
        let subTaskStatus = subTasksReview[0].split(',')[index];
        if (subTaskStatus === 'C') {
            completedSubtaskCount++;
        }
    }

    return Math.round((completedSubtaskCount / subTaskCount) * 100);

}

/** Contacts section logic. */
/** Loads and renders all contacts assigned to the given task. */
function getTaskDetailsContacts(taskID, renderFunctionSelector) {
    let refAssignedTo = TASK[0][`Task${taskID}`].assignedTo;//await DataGET(`Tasks/Task${taskID}/assignedTo`);
    let assignedToCount = (refAssignedTo.match(/,/g) || []).length + 1;
    for (let index = 0; index <= assignedToCount; index++) {
        if (refAssignedTo.split(',')[index] != undefined || null) {
            let contact = refAssignedTo.split(',')[index];
            if (renderFunctionSelector == 0) {
                renderTaskContacts(allContactDetails[`${contact}`], taskID);
            } else {
                renderTaskDetailsContacts(allContactDetails[`${contact}`])
            }

        }
    }
}

function renderTaskContacts(contactDetails, taskID) {
    let refContactsContainer = document.getElementById(`taskContactsContainer${taskID}`);
    refContactsContainer.innerHTML += taskContactsTamplate(contactDetails.initials, contactDetails.color);
}

function taskCheckPriority(taskID, refTaskPriorityContainer) {
    switch (TASK[0][`Task${taskID}`].priority) {
        case 'Low':
            refTaskPriorityContainer.innerHTML = '<img src="./assets/img/low_priority.svg" alt="Low Priority"></img>';
            break;

        case 'Medium':
            refTaskPriorityContainer.innerHTML = '<img src="./assets/img/medium_priority.svg" alt="Medium Priority"></img>';
            break;

        case 'High':
            refTaskPriorityContainer.innerHTML = '<img src="./assets/img/high_priority.svg" alt="High Priority"></img>';
            break;
        default:
            break;
    }
}

function taskCatagory(taskID, refTaskCatagory) {
    switch (TASK[0][`Task${taskID}`].category) {
        case 'User Story':
            refTaskCatagory.classList.remove("boardTaskCatagoryGreen");
            refTaskCatagory.classList.add("boardTaskCatagoryBlue");
            break;
        case 'Technical Task':
            refTaskCatagory.classList.remove("boardTaskCatagoryBlue");
            refTaskCatagory.classList.add("boardTaskCatagoryGreen");
            break;
        default:
            break;
    }

}

function highlightBoardTaskFields() {
    if (TASK[0][`Task${curentTraggedElement}`].field.field == 'field1' && curentTraggedElement != null && curentTraggedElement != undefined) {
        document.getElementById('field2').innerHTML += highlightTaskTamplate(2);
        document.getElementById('field3').innerHTML += highlightTaskTamplate(3);
        document.getElementById('field4').innerHTML += highlightTaskTamplate(4);
    }
    if (TASK[0][`Task${curentTraggedElement}`].field.field == 'field2' && curentTraggedElement != null && curentTraggedElement != undefined) {
        document.getElementById('field1').innerHTML += highlightTaskTamplate(1);
        document.getElementById('field3').innerHTML += highlightTaskTamplate(3);
        document.getElementById('field4').innerHTML += highlightTaskTamplate(4);
    }
    if (TASK[0][`Task${curentTraggedElement}`].field.field == 'field3' && curentTraggedElement != null && curentTraggedElement != undefined) {
        document.getElementById('field1').innerHTML += highlightTaskTamplate(1);
        document.getElementById('field2').innerHTML += highlightTaskTamplate(2);
        document.getElementById('field4').innerHTML += highlightTaskTamplate(4);
    }
    if (TASK[0][`Task${curentTraggedElement}`].field.field == 'field4' && curentTraggedElement != null && curentTraggedElement != undefined) {
        document.getElementById('field1').innerHTML += highlightTaskTamplate(1);
        document.getElementById('field2').innerHTML += highlightTaskTamplate(2);
        document.getElementById('field3').innerHTML += highlightTaskTamplate(3);
    }

}

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

