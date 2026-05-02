
/** Rebuilds the board layout when the viewport changes between desktop and mobile. */
async function widthChangeCallback(myMediaQuery) {
    if (myMediaQuery.matches) {
        document.getElementById('taskTableContent').innerHTML = taskBoardTamplateMobile();
        startLoadingScreenMobile();
        resetArrays();
        await render();
    } else {
        document.getElementById('taskTableContent').innerHTML = taskBoardTamplate();
        startLoadingScreen();
        resetArrays();
        await render();
    }
}
myMediaQuery.addEventListener('change', widthChangeCallback);

function resetArrays() {
    TASK = [];
    TASKKEYS = [];
    count = 0;
}

/** Opens the mobile move menu next to the selected task card. */
function addMobileMoveTask(mobileArrowsMoveTaskID, taskID) {
    let refMobileArrowsMoveTaskID = document.getElementById(mobileArrowsMoveTaskID);
    let mobileArrowsMoveTaskPosition = refMobileArrowsMoveTaskID.getBoundingClientRect();
    let refDiv = document.createElement("div");
    refDiv.id = "taskMobileMove";
    checkFieldTaskMobile(taskID, refDiv, mobileArrowsMoveTaskPosition);
    document.getElementById('app-canvas').appendChild(refDiv);
}

function chanchePositionMoveTaskMobile() {
    let moveTaskPositionOffset = 0;
    let mediaQuerymoveTaskMobile = window.matchMedia('(max-width: 670px)')
    if (mediaQuerymoveTaskMobile.matches) {
        return moveTaskPositionOffset = 100;
    } else {
        return moveTaskPositionOffset = 0;
    }
}

/** Chooses the correct mobile move menu template for the task's current column. */
function checkFieldTaskMobile(taskID, refDiv, mobileArrowsMoveTaskPosition) {
    let moveTaskPositionCheckedOffset = chanchePositionMoveTaskMobile();
    switch (TASK[0][`Task${taskID}`].field.field) {
        case 'field1':
            refDiv.innerHTML = moveTamplateTaskMobileField1(taskID, mobileArrowsMoveTaskPosition, moveTaskPositionCheckedOffset);
            break;
        case 'field4':
            refDiv.innerHTML = moveTamplateTaskMobileField4(taskID, mobileArrowsMoveTaskPosition, moveTaskPositionCheckedOffset);
            break;
        default:
            refDiv.innerHTML = moveTamplateTaskMobileField2_3(taskID, mobileArrowsMoveTaskPosition, moveTaskPositionCheckedOffset);
            break; }
}

/** Removes the temporary mobile move menu from the DOM. */
function removeMobileMoveTask() {
    document.getElementById("taskMobileMove").remove();
}

/** Moves a task one column upward in the mobile board flow when possible. */
function taskMoveUpMobile(taskID) {
    let refField = TASK[0][`Task${taskID}`].field.field.slice(-1) * 1;
    if (refField > 1) {
        moveToMobile(`field${refField - 1}`, taskID);
    }
}

/** Moves a task one column downward in the mobile board flow when possible. */
function taskMoveDownMobile(taskID) {
    let refField = TASK[0][`Task${taskID}`].field.field.slice(-1) * 1;
    if (refField < 4) {
        moveToMobile(`field${refField + 1}`, taskID);
    }
}

/** Updates a task's column from the mobile menu and persists the change. */
async function moveToMobile(field, taskID) {
    TASK[0][`Task${taskID}`].field.field = `${field}`;
    renderMovedTask(field, taskID);
    await DataPUT(`Tasks/Task${taskID}/field`, {
        'field': `${field}`,
    });
}
