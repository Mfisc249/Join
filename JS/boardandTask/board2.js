
/** Contacts section logic. */
/** Loads and renders all contacts assigned to the given task. */
function getTaskDetailsContacts(taskID, renderFunctionSelector) {
    let refAssignedTo = safeArray(getTaskById(taskID).assignedTo);
    renderAssignedContacts(refAssignedTo, taskID, renderFunctionSelector);
    if (shouldHideAssignedHeadline(refAssignedTo)) {
        document.getElementById('taskDetailsATHeadline').classList.add('displayNone');
    }
}

/** Iterates over assigned contacts and renders each available contact entry. */
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

/** Routes contact rendering either to the board card or the task details dialog. */
function renderSingleAssignedContact(contactDetails, taskID, renderFunctionSelector) {
    if (renderFunctionSelector == 0) {
        renderTaskContacts(contactDetails, taskID);
        return;
    }
    renderTaskDetailsContacts(contactDetails);
}

/** Returns the full contact object for a stored contact key. */
function getContactDetailsByKey(contactKey) {
    return allContactDetails?.[`${contactKey}`];
}

/** Decides whether the assigned-to headline should be hidden in task details. */
function shouldHideAssignedHeadline(refAssignedTo) {
    return (refAssignedTo.length == 0 || refAssignedTo.length == undefined || refAssignedTo.length == null) && document.getElementById('taskDetailsATHeadline') != undefined;
}

/** Renders assigned contact badges on a board task card. */
function renderTaskContacts(contactDetails, taskID) {
    let refContactsContainer = document.getElementById(`taskContactsContainer${taskID}`);
    if (!refContactsContainer || !contactDetails) {
        return;
    }
    if (refContactsContainer.childElementCount <=3) {
        refContactsContainer.insertAdjacentHTML('beforeend', taskContactsTamplate(contactDetails.initials, contactDetails.color));
    }else if(refContactsContainer.childElementCount <=4){
         refContactsContainer.insertAdjacentHTML('beforeend', taskContactsFillerTamplate());
    }
}

/** Renders the matching priority icon for a task. */
function taskCheckPriority(taskID, refTaskPriorityContainer) {
    if (!refTaskPriorityContainer) {
        return;
    }

    let priority = normalizePriority(getTaskById(taskID).priority);
    refTaskPriorityContainer.innerHTML = getPriorityIcon(priority);
}

/** Returns the matching priority icon markup for a normalized priority label. */
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

/** Removes all category-specific color classes from a task category badge. */
function clearCategoryClasses(refTaskCatagory) {
    refTaskCatagory.classList.remove("boardTaskCatagoryBlue");
    refTaskCatagory.classList.remove("boardTaskCatagoryGreen");
}

/** Applies the correct category color class to a task category badge. */
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

/** Returns the board columns that should be highlighted as valid drop targets. */
function getTargetHighlightFields(currentField) {
    let fieldMap = {
        field1: [2, 3, 4],
        field2: [1, 3, 4],
        field3: [1, 2, 4],
        field4: [1, 2, 3],
    };
    return fieldMap[currentField] || [];
}

/** Inserts highlight placeholders into every allowed drop target column. */
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

/** Truncates long task descriptions for compact display on board cards. */
function shortenDescription(description) {
    if (description.length >= 40) {
        let refdescription = description.slice(0, 40);
        return refdescription + "..."
    }
    return description;
}

