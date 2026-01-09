
const BOARDURLBASE = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/Tasks/';
const TASK = [];
const TASKKEYS=[];
let count = 0;

let curentTraggedElement;

/**
 * Fetches task data from the Firebase Realtime Database and appends it to `TASK`.
 * @async
 * @param {string} [path=""] - Optional path under the Tasks collection.
 * @returns {Promise<void>} Resolves once the data is loaded and stored.
 */
async function DataGET(path = "") {
    let response = await fetch(BOARDURLBASE + path + '.json');
    let responseASJson = await response.json();
    TASK.push(responseASJson);
}

/**
 * Writes/overwrites task data at a specific path in the database.
 * @async
 * @param {string} [path=""] - Task path, e.g., "Task3".
 * @param {Object} [data={}] - Data object to store, with fields like `title`, `id`, `category`, `content`.
 * @returns {Promise<void>} Resolves when the write operation completes.
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
 * Renders all tasks into the four board columns based on their `category`.
 * First loads the data, then updates the DOM contents of the fields.
 * @async
 * @returns {Promise<void>} Resolves after the columns are populated.
 */
async function render() {
    await DataGET();
    document.getElementById('field1').innerHTML = "";
    document.getElementById('field2').innerHTML = "";
    document.getElementById('field3').innerHTML = "";
    TASKKEYS.push(Object.keys(TASK[0]));
    TASKKEYS[0].forEach(task => {
        if (TASK[0][`${task}`].category == 'field1') {
            document.getElementById('field1').innerHTML += taskTamplate(TASK[0][`${task}`].id);
        }

        if (TASK[0][`${task}`].category == 'field2') {
            document.getElementById('field2').innerHTML += taskTamplate(TASK[0][`${task}`].id);
        }

        if (TASK[0][`${task}`].category == 'field3') {
            document.getElementById('field3').innerHTML += taskTamplate(TASK[0][`${task}`].id);
        }

        if (TASK[0][`${task}`].category == 'field4') {
            document.getElementById('field4').innerHTML += taskTamplate(TASK[0][`${task}`].id);
        }
    });
}

/**
 * Saves a newly created task under `field1` and renders it directly into the first column.
 * @async
 * @param {number} taskID - Sequential ID of the new task.
 * @param {HTMLInputElement|HTMLTextAreaElement} refTitel - Reference to the input field for the title.
 * @param {HTMLInputElement|HTMLTextAreaElement} refContent - Reference to the input field for the content.
 * @returns {Promise<void>} Resolves when the task is saved and rendered.
 */
async function renderaddedTask(taskID, refTitel, refContent) {
    await DataPUT(`Task${taskID}`, {
        'title': `${refTitel.value}`,
        'id': taskID,
        'category': 'field1',
        'content': `${refContent.value}`
    });
    document.getElementById('field1').innerHTML += taskTamplate(taskID);
}

/**
 * Re-renders a moved task in the specified column and removes its previous instance.
 * @param {string} field - Target column ID, e.g., "field2".
 * @returns {void}
 */
function renderMovedTask(field) {
    let refMovedTask = document.getElementById(`${TASK[0][`Task${curentTraggedElement}`].id}`);
    refMovedTask.parentNode.removeChild(refMovedTask);
    document.getElementById(`${field}`).innerHTML += taskTamplate(TASK[0][`Task${curentTraggedElement}`].id);

}

/**
 * Creates the HTML template string for rendering a task in the board.
 * @param {number} taskID - ID of the task to render.
 * @returns {string} HTML string for the task entry.
 */
function taskTamplate(taskID) {
    return `<div id="${taskID}" draggable="true" ondragstart="draggedTask(${taskID})">
            ${TASK[0][`Task${taskID}`].title}
            </div>`
}

/**
 * Sets the currently dragged task ID so it can be processed on drop.
 * @param {number} taskID - ID of the dragged task.
 * @returns {void}
 */
function draggedTask(taskID) {
    curentTraggedElement = taskID;
}

/**
 * Prevents default behavior on dragover so a drop is possible.
 * @param {DragEvent} ev - Dragover event.
 * @returns {void}
 */
function dragoverHandler(ev) {
    ev.preventDefault();
}

/**
 * Moves the currently dragged task to the specified column and persists the change.
 * @async
 * @param {string} field - Target column ID, e.g., "field3".
 * @returns {Promise<void>} Resolves when the database is updated and the task is re-rendered.
 */
async function moveTo(field) {
    TASK[0][`Task${curentTraggedElement}`].category = `${field}`;
    document.getElementById(`${field}`).classList.remove("highlight");
    await DataPUT(`Task${curentTraggedElement}`, {
        'title': `${TASK[0][`Task${curentTraggedElement}`].title}`,
        'id': curentTraggedElement,
        'category': `${field}`,
        'content':`${TASK[0][`Task${curentTraggedElement}`].content}`
    })
    renderMovedTask(field);
}

/**
 * Visually highlights a column to indicate a potential drop target.
 * @param {string} ID - Column ID.
 * @returns {void}
 */
function highlightField(ID) {
    document.getElementById(`${ID}`).classList.add("highlight");
}

/**
 * Removes the visual highlight from a column.
 * @param {string} ID - Column ID.
 * @returns {void}
 */
function removeHighlightField(ID) {
    document.getElementById(`${ID}`).classList.remove("highlight");
}

/**
 * Processes the form to create a new task, updates the local structure, and stores the task.
 * @async
 * @returns {Promise<void>} Resolves after the new task is saved and rendered.
 */
async function formIsSubmittet() {
    let taskID = TASKKEYS[0].length + count;
    let taskVar = "Task"+ taskID ;
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
