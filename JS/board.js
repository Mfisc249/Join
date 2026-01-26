
const BOARDURLBASE = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/Tasks/';
let TASK = [];
let TASKKEYS = [];
let count = 0;
let highlightTaskCount = 0;
let curentTraggedElement;

/** Initializes the board and renders tasks. */
async function init2() {
    document.getElementById('fields').innerHTML = taskBoardTamplate();
    await render();
}

/** Fetches tasks from Firebase and stores them in TASK. */
async function DataGET(path = "") {
    let response = await fetch(BOARDURLBASE + path + '.json');
    let responseASJson = await response.json();
    TASK = [];
    TASK.push(responseASJson);
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
    await DataGET();
    emtyFieldContent();
    TASKKEYS = [];
    TASKKEYS.push(Object.keys(TASK[0]));
    TASKKEYS[0].forEach(task => {
        loadTaskTamplate(TASK[0][`${task}`])
    });
    checkFieldIsEmpty();
}

/** Appends the task template to the appropriate column. */
function loadTaskTamplate(refTask) {
    if (refTask.category == 'field1') {
        document.getElementById('field1').innerHTML += taskTamplate(refTask.id);
    }

    if (refTask.category == 'field2') {
        document.getElementById('field2').innerHTML += taskTamplate(refTask.id);
    }

    if (refTask.category == 'field3') {
        document.getElementById('field3').innerHTML += taskTamplate(refTask.id);
    }

    if (refTask.category == 'field4') {
        document.getElementById('field4').innerHTML += taskTamplate(refTask.id);
    }
}

/** Clears the content of all board columns. */
function emtyFieldContent() {
    document.getElementById('field1').innerHTML = "";
    document.getElementById('field2').innerHTML = "";
    document.getElementById('field3').innerHTML = "";
    document.getElementById('field4').innerHTML = "";
}

/** Saves a new task and renders it in 'field1'. */
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

/** Renders the moved task in the target column and removes the old one. */
function renderMovedTask(field) {
    let refMovedTask = document.getElementById(`${TASK[0][`Task${curentTraggedElement}`].id}`);
    refMovedTask.parentNode.removeChild(refMovedTask);
    document.getElementById(`${field}`).innerHTML += taskTamplate(TASK[0][`Task${curentTraggedElement}`].id);
    checkFieldIsEmpty();
}

/** Sets the currently dragged task and starts the animation. */
function draggedTask(taskID) {
    curentTraggedElement = taskID;
    transormTask();
}

/** Enables dropping by preventing default behavior. */
function dragoverHandler(ev) {
    ev.preventDefault();
}

/** Moves the dragged task to the column and persists it. */
async function moveTo(field) {
    TASK[0][`Task${curentTraggedElement}`].category = `${field}`;
    document.getElementById(`${field}`).classList.remove("highlight");
    renderMovedTask(field);
    await DataPUT(`Task${curentTraggedElement}`, {
        'title': `${TASK[0][`Task${curentTraggedElement}`].title}`,
        'id': curentTraggedElement,
        'category': `${field}`,
        'content': `${TASK[0][`Task${curentTraggedElement}`].content}`
    })

}

/** Displays a highlight area (currently disabled). */
function highlightField(ID) {
    // let refHighlightTask = document.getElementById('highlightTask');
    // if (highlightTaskCount == 0 && refHighlightTask==null) {
    //     document.getElementById(`${ID}`).innerHTML += highlightTaskTamplate();
    // }
    // highlightTaskCount++;
}

/** Removes the highlight area (currently disabled). */
function removeHighlightField(ID) {
    // let refHighlightTask = document.getElementById('highlightTask');
    // if (refHighlightTask!=null) {
    //     refHighlightTask.remove();
    // }
    // highlightTaskCount = 0;
}

/** Creates a new task from the form and renders it. */
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

/** Shows hints when columns are empty. */
function checkFieldIsEmpty() {
    document.getElementById('field1').hasChildNodes() == false ? document.getElementById('field1').innerHTML = `<div id="noTaskField1" class="noTaskField">No Tasks to do</div>` : null;
    (document.getElementById('field1').childElementCount >= 2) && (document.getElementById('noTaskField1') != null) ? document.getElementById('noTaskField1').remove() : null;
    document.getElementById('field2').hasChildNodes() == false ? document.getElementById('field2').innerHTML = `<div id="noTaskField2" class="noTaskField">No Tasks in progress</div>` : null;
    (document.getElementById('field2').childElementCount >= 2) && (document.getElementById('noTaskField2') != null) ? document.getElementById('noTaskField2').remove() : null;
    document.getElementById('field3').hasChildNodes() == false ? document.getElementById('field3').innerHTML = `<div id="noTaskField3" class="noTaskField">No Tasks await feedback</div>` : null;
    (document.getElementById('field3').childElementCount >= 2) && (document.getElementById('noTaskField3') != null) ? document.getElementById('noTaskField3').remove() : null;
    document.getElementById('field4').hasChildNodes() == false ? document.getElementById('field4').innerHTML = `<div id="noTaskField4" class="noTaskField">No Tasks done</div>` : null;
    (document.getElementById('field4').childElementCount >= 2) && (document.getElementById('noTaskField4') != null) ? document.getElementById('noTaskField4').remove() : null;
}

/** Starts the rotation animation for the dragged task. */
function transormTask() {
    document.getElementById(`${curentTraggedElement}`).classList.add('rotate5deg');
}

/** Stops the rotation animation after a short delay. */
function endTransformTask() {
    setTimeout(() => {
        document.getElementById(`${curentTraggedElement}`).classList.remove('rotate5deg')
        // let refHighlightTask = document.getElementById('highlightTask');
        // if (refHighlightTask!=null) {
        //     refHighlightTask.remove();
        // }
        // highlightTaskCount = 0;
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
        if (refTaskTitle.toUpperCase().indexOf(filter) > - 1) {
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


