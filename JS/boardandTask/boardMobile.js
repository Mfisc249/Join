
async function widthChangeCallback(myMediaQuery) {
    if (myMediaQuery.matches) {
        document.getElementById('taskTableContent').innerHTML = taskBoardTamplateMobile();
        startLoadingScreenMobile();
        TASK = [];
        TASKKEYS = [];
        count = 0;
        await render();
    } else {
        document.getElementById('taskTableContent').innerHTML = taskBoardTamplate();
        startLoadingScreen();
        TASK = [];
        TASKKEYS = [];
        count = 0;
        await render();
    }
}
myMediaQuery.addEventListener('change', widthChangeCallback);

function addMobileMoveTask(mobileArrowsMoveTaskID, taskID) {
    let refMobileArrowsMoveTaskID = document.getElementById(mobileArrowsMoveTaskID);
    let mobileArrowsMoveTaskPosition = refMobileArrowsMoveTaskID.getBoundingClientRect();
    let refDiv = document.createElement("div");
    refDiv.id = "taskMobileMove";
    checkFieldTaskMobile(taskID, refDiv, mobileArrowsMoveTaskPosition);
    document.getElementById('app-canvas').appendChild(refDiv);
}

function checkFieldTaskMobile(taskID, refDiv, mobileArrowsMoveTaskPosition) {
    switch (TASK[0][`Task${taskID}`].field.field) {
        case 'field1':
            refDiv.innerHTML = moveTamplateTaskMobileField1(taskID, mobileArrowsMoveTaskPosition);
            break;

        case 'field4':
            refDiv.innerHTML =  moveTamplateTaskMobileField4(taskID, mobileArrowsMoveTaskPosition);
            break;

        default:
            refDiv.innerHTML = moveTamplateTaskMobileField2_3(taskID, mobileArrowsMoveTaskPosition);
            break;
    }
}

function removeMobileMoveTask() {
    document.getElementById("taskMobileMove").remove();
}

function taskMoveUpMobile(taskID) {
    let refField = TASK[0][`Task${taskID}`].field.field.slice(-1) * 1;
    if (refField > 1) {
        moveToMobile(`field${refField - 1}`, taskID);
    }
}

function taskMoveDownMobile(taskID) {
    let refField = TASK[0][`Task${taskID}`].field.field.slice(-1) * 1;
    if (refField < 4) {
        moveToMobile(`field${refField + 1}`, taskID);
    }
}

async function moveToMobile(field, taskID) {
    TASK[0][`Task${taskID}`].field.field = `${field}`;
    renderMovedTask(field, taskID);
    await DataPUT(`Tasks/Task${taskID}/field`, {
        'field': `${field}`,
    });
}
