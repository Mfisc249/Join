
const BOARDURLBASE = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/Tasks/';
const TASK = [];
const TASKKEYS = [];
let count = 0;
let refField1 = document.getElementById('field1');
let refField2 = document.getElementById('field2');
let refField3 = document.getElementById('field3');
let refField4 = document.getElementById('field4');
let curentTraggedElement;

/**
 * Fetch tasks from Firebase and append to `TASK`.
 * @param {string} [path=""] Optional subpath under Tasks.
 * @returns {Promise<void>}
 */
async function DataGET(path = "") {
    let response = await fetch(BOARDURLBASE + path + '.json');
    let responseASJson = await response.json();
    TASK.push(responseASJson);
}

/**
 * Write task data to the given path.
 * @param {string} [path=""] Task path (e.g., "Task3").
 * @param {Object} [data={}] Payload to store.
 * @returns {Promise<void>}
 */
async function DataPUT(path = "", data = {}) {
    let response = await fetch(BOARDURLBASE + path + '.json', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

/**
 * Load tasks and render board columns by `category`.
 * @returns {Promise<void>}
 */
async function render() {
    await DataGET();
    refField1.innerHTML = "";
    refField2.innerHTML = "";
    refField3.innerHTML = "";
    refField4.innerHTML = "";
    TASKKEYS.push(Object.keys(TASK[0]));
    TASKKEYS[0].forEach(task => {
        if (TASK[0][`${task}`].category == 'field1') {
            refField1.innerHTML += taskTamplate(TASK[0][`${task}`].id);
        }

        if (TASK[0][`${task}`].category == 'field2') {
            refField2.innerHTML += taskTamplate(TASK[0][`${task}`].id);
        }

        if (TASK[0][`${task}`].category == 'field3') {
            refField3.innerHTML += taskTamplate(TASK[0][`${task}`].id);
        }

        if (TASK[0][`${task}`].category == 'field4') {
            refField4.innerHTML += taskTamplate(TASK[0][`${task}`].id);
        }
    });
    checkFieldIsEmpty();
}

/**
 * Save new task to `field1` and render it.
 * @param {number} taskID Task ID.
 * @param {HTMLInputElement|HTMLTextAreaElement} refTitel Title input.
 * @param {HTMLInputElement|HTMLTextAreaElement} refContent Content input.
 * @returns {Promise<void>}
 */
async function renderaddedTask(taskID, refTitel, refContent) {
    await DataPUT(`Task${taskID}`, {
        'title': `${refTitel.value}`,
        'id': taskID,
        'category': 'field1',
        'content': `${refContent.value}`
    });
    document.getElementById('field1').innerHTML += taskTamplate(taskID);
    checkFieldIsEmpty();
}

/**
 * Re-render moved task in target column; remove old.
 * @param {string} field Target column ID.
 */
function renderMovedTask(field) {
    let refMovedTask = document.getElementById(`${TASK[0][`Task${curentTraggedElement}`].id}`);
    refMovedTask.parentNode.removeChild(refMovedTask);
    document.getElementById(`${field}`).innerHTML += taskTamplate(TASK[0][`Task${curentTraggedElement}`].id);
    checkFieldIsEmpty();
}

/**
 * Return HTML for a task.
 * @param {number} taskID Task ID.
 * @returns {string}
 */
function taskTamplate(taskID) {
    return `<div id="${taskID}" draggable="true" ondragstart="draggedTask(${taskID})">
            ${TASK[0][`Task${taskID}`].title}
            </div>`
}

/**
 * Set current dragged task ID.
 * @param {number} taskID
 */
function draggedTask(taskID) {
    curentTraggedElement = taskID;
    transormTask();
}

/**
 * Enable drop on dragover.
 * @param {DragEvent} ev
 */
function dragoverHandler(ev) {
    ev.preventDefault();
}

/**
 * Move dragged task to column and persist.
 * @param {string} field Target column ID.
 * @returns {Promise<void>}
 */
async function moveTo(field) {
    TASK[0][`Task${curentTraggedElement}`].category = `${field}`;
    document.getElementById(`${field}`).classList.remove("highlight");
    await DataPUT(`Task${curentTraggedElement}`, {
        'title': `${TASK[0][`Task${curentTraggedElement}`].title}`,
        'id': curentTraggedElement,
        'category': `${field}`,
        'content': `${TASK[0][`Task${curentTraggedElement}`].content}`
    })
    renderMovedTask(field);
}

/**
 * Add drop highlight to a column.
 * @param {string} ID Column ID.
 */
function highlightField(ID) {
    document.getElementById(`${ID}`).classList.add("highlight");
}

/**
 * Remove drop highlight from a column.
 * @param {string} ID Column ID.
 */
function removeHighlightField(ID) {
    document.getElementById(`${ID}`).classList.remove("highlight");
}

/**
 * Create and save a new task from form.
 * @returns {Promise<void>}
 */
async function formIsSubmittet() {
    let taskID = TASKKEYS[0].length + count;
    let taskVar = "Task" + taskID;
    let refTitel = document.getElementById('titleId');
    let refContent = document.getElementById('contentId');
    TASK[0][taskVar] = {
        'id': taskID,
        'title': `${refTitel.value}`,
        'category': 'field1',
        'content': `${refContent.value}`
    }
    count++;
    await renderaddedTask(taskID, refTitel, refContent);

}

function checkFieldIsEmpty() {
    refField1.hasChildNodes() == false ? refField1.innerHTML = `<div id="noTaskField1" class="noTaskField">No Tasks to do</div>`: null;
    (refField1.childElementCount>= 2) && (document.getElementById('noTaskField1')!= null) ? document.getElementById('noTaskField1').remove() : null;
    refField2.hasChildNodes() == false ? refField2.innerHTML = `<div id="noTaskField2" class="noTaskField">No Tasks in progress</div>`: null;
    (refField2.childElementCount>= 2) && (document.getElementById('noTaskField2')!= null) ? document.getElementById('noTaskField2').remove() : null;
    refField3.hasChildNodes() == false ? refField3.innerHTML = `<div id="noTaskField3" class="noTaskField">No Tasks await feedback</div>`: null;
    (refField3.childElementCount>= 2) && (document.getElementById('noTaskField3')!= null) ? document.getElementById('noTaskField3').remove() : null;
    refField4.hasChildNodes() == false ? refField4.innerHTML = `<div id="noTaskField4" class="noTaskField">No Tasks done</div>`: null;
    (refField4.childElementCount>= 2) && (document.getElementById('noTaskField4')!= null) ? document.getElementById('noTaskField4').remove() : null;
}

function transormTask() {
    document.getElementById(`${curentTraggedElement}`).style.transform = "rotate(5deg)";
    
}