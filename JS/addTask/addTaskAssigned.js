let selectedCategory = "";

/** Loads contacts from Firebase and renders assignment options. */
async function loadContacts() {
  try {
    const response = await fetch(`${BASE_URL}Contacts.json`);
    const data = await response.json();

    if (!data) return;

    contacts = data; // Keep keys intact

    renderAssignedTo();
  } catch (error) {
    console.error("Fehler beim Laden der Contacts:", error);
  }
}

/** Renders all contacts into the assigned-to dropdown list. */
function renderAssignedTo() {
  const container = document.getElementById("assignedDropdown");
  if (!container) return;

  let html = "";

  for (let key in contacts) {
    const contact = contacts[key];

    html += contactInitialsCircleTemplate(contact, key);
  }

  container.innerHTML = html;
}

/** Toggles a contact's assignment state and updates checkbox visuals. */
function toggleContact(contactKey, element) {
  const index = task.assignedTo.indexOf(contactKey);
  const img = element.querySelector(".checkBox");

  if (index === -1) {
    task.assignedTo.push(contactKey);
    element.classList.add("selected");
    img.src = "./assets/img/checkButton.svg";
  } else {
    task.assignedTo.splice(index, 1);
    element.classList.remove("selected");
    img.src = "./assets/img/Rectangle_5.svg";
  }

  const dropdown = document.getElementById("assignedDropdown");
  if (dropdown.classList.contains("hidden")) {
    renderSelectedContactsBelowInput();
  }
}

/** Toggles the assigned-to dropdown between open, preview, and closed states. */
function toggleAssignedDropdown(event) {
  event.stopPropagation(); // Prevent immediate closing
  const dropdown = document.getElementById("assignedDropdown");
  const arrow = document.getElementById("assignedDropdownArrow");
  const label = document.getElementById("clearContact");
  const button = document.querySelector(".assignedToInput");
  if (dropdown.classList.contains("hidden")) {
    openDropdown(dropdown, arrow, label);
    button.focus();
    return;
  }
  // if (!assignedPreviewMode) {
  //   openPreview(dropdown, arrow, label);
  //   button.focus();
  //   return;
  // }
  closeDropdown(dropdown, arrow, label);
  button.focus();
}

/** Renders only selected contacts inside the assignment dropdown. */
function renderSelectedContactsInDropdown() {
  const container = document.getElementById("assignedDropdown");
  if (!container) return;

  let html = "";
  for (let key in contacts) {
    const contact = contacts[key];

    if (task.assignedTo.includes(key)) {
      html += contactInitialsCircleTemplate(contact, key);
    }
  }

  container.innerHTML = html;

  if (task.assignedTo.length === 0) {
    container.innerHTML = "";
  }
}

/** Renders selected contact initials below the input when dropdown is closed. */
function renderSelectedContactsBelowInput() {
  const previewContainer = document.getElementById("assignedPreviewContainer");
  const dropdown = document.getElementById("assignedDropdown");
  const maxVisibleContacts = 5;

  if (!previewContainer) return;

  if (!dropdown.classList.contains("hidden") || task.assignedTo.length === 0) {
    previewContainer.innerHTML = "";
    return;
  }

  previewContainer.innerHTML = buildAssignedContactsHTML(maxVisibleContacts);
}

function buildAssignedContactsHTML(maxVisibleContacts) {
  let selectedContacts = [];

  for (let i = 0; i < task.assignedTo.length; i++) {
    let key = task.assignedTo[i];
    if (contacts[key]) {
      selectedContacts.push(contacts[key]);
    }
  }

  let html = "";

  for (let i = 0; i < selectedContacts.length && i < maxVisibleContacts; i++) {
    html += contactInitialsPreviewTemplate(selectedContacts[i]);
  }

  let hiddenContactsCount = selectedContacts.length - maxVisibleContacts;

  if (hiddenContactsCount > 0) {
    html += hiddenContactsTemplate(hiddenContactsCount);
  }

  return html;
}

/** Opens the assignment dropdown and prepares the full contact list view. */
function openDropdown(dropdown, arrow, label) {
  const button = document.querySelector(".assignedToInput");
  const preview = document.getElementById("assignedPreviewContainer");

  preview.style.display = "none";

  dropdown.classList.remove("hidden");
  arrow.classList.add("rotate");
  renderAssignedTo();
  label.textContent = "";
  assignedPreviewMode = false;

  button.classList.add("activeFocus");
}

/** Closes the assignment dropdown and restores the selected-contacts preview. */
function closeDropdown(dropdown, arrow, label) {
  const button = document.querySelector(".assignedToInput");
  const preview = document.getElementById("assignedPreviewContainer");

  dropdown.classList.add("hidden");
  arrow.classList.remove("rotate");
  assignedPreviewMode = false;
  label.textContent = "Select contacts to assign";

  preview.style.display = "flex"; // Show preview again
  renderSelectedContactsBelowInput();

  button.classList.remove("activeFocus");
}

/** Switches the dropdown to preview mode for already selected contacts. */
function openPreview(dropdown, arrow, label) {
  if (task.assignedTo.length > 0) {
    renderSelectedContactsInDropdown();
    label.textContent = "An:";
    assignedPreviewMode = true;
  } else {
    dropdown.classList.add("hidden");
    arrow.classList.remove("rotate");
    assignedPreviewMode = false;
  }
}

/** Resets the assigned-to label text to its default prompt. */
function updateAssignedLabel() {
  const label = document.getElementById("clearContact");
  label.textContent = "Select contacts to assign";
}

/** Registers outside-click handling to close the assignment dropdown. */
function setupAssignedDropdownClose() {
  document.addEventListener("click", (event) => {
    const dropdown = document.getElementById("assignedDropdown");
    const button = document.querySelector(".assignedToInput");

    if (!dropdown || !button) return;
    if (dropdown.classList.contains("hidden")) return;

    if (!dropdown.contains(event.target) && !button.contains(event.target)) {
      const arrow = document.getElementById("assignedDropdownArrow");
      const label = document.getElementById("clearContact");
      closeDropdown(dropdown, arrow, label);
    }
  });
}

/** Toggles visibility of the category dropdown menu. */
function toggleCategoryDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("categoryDropdown");
  dropdown.classList.toggle("hidden");
}

function selectCategory(category) {
  selectedCategory = category;
  task.category = category; // Required for validation

  document.getElementById("categoryLabel").textContent = category;

  const error = document.getElementById("categoryError");
  const button = document.querySelector(".TaskCategoryInput");
  const dropdown = document.getElementById("categoryDropdown");
  const arrow = document.getElementById("categoryDropdownArrow");

  if (error) error.classList.remove("visible");
  if (button) button.classList.remove("input-error");

  // Close dropdown
  if (dropdown) dropdown.classList.add("hidden");

  // Reset arrow rotation
  if (arrow) arrow.classList.remove("rotate");
}
