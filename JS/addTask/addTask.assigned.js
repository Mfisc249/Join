let selectedCategory = "";

async function loadContacts() {
  try {
    const response = await fetch(`${BASE_URL}Contacts.json`);
    const data = await response.json();

    if (!data) return;

    contacts = Object.values(data);
    renderAssignedTo();
  } catch (error) {
    console.error("Fehler beim Laden der Contacts:", error);
  }
}

async function renderAssignedTo() {
  const container = document.getElementById("assignedDropdown");
  if (!container) return;

  let html = "";

  contacts.forEach((contact) => {
    html += contactInitialsCircleTemplate(contact);
  });

  container.innerHTML = html;
}

function toggleContact(name, element) {
  const index = task.assignedTo.indexOf(name);
  const img = element.querySelector(".checkBox");

  if (index === -1) {
    task.assignedTo.push(name);
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

function toggleAssignedDropdown(event) {
  event.stopPropagation(); // verhindert sofortiges Schließen

  const dropdown = document.getElementById("assignedDropdown");
  const arrow = document.getElementById("assignedDropdownArrow");
  const label = document.getElementById("clearContact");
  const button = document.querySelector(".assignedToInput");

  if (dropdown.classList.contains("hidden")) {
    openDropdown(dropdown, arrow, label);
    button.focus();
    return;
  }

  if (!assignedPreviewMode) {
    openPreview(dropdown, arrow, label);
    button.focus();
    return;
  }

  closeDropdown(dropdown, arrow, label);
  button.focus();
}

function renderSelectedContactsInDropdown() {
  const container = document.getElementById("assignedDropdown");
  if (!container) return;

  let html = "";
  contacts.forEach((contact) => {
    if (task.assignedTo.includes(contact.name)) {
      html += contactInitialsCircleTemplate(contact);
    }
  });

  container.innerHTML = html;

  if (task.assignedTo.length === 0) {
    container.innerHTML = "";
  }
}

function renderSelectedContactsBelowInput() {
  const previewContainer = document.getElementById("assignedPreviewContainer");
  const dropdown = document.getElementById("assignedDropdown");
  if (!previewContainer) return;

  if (!dropdown.classList.contains("hidden")) {
    previewContainer.innerHTML = "";
    return;
  }

  if (task.assignedTo.length === 0) {
    previewContainer.innerHTML = "";
    return;
  }
  let html = "";
  contacts.forEach((contact) => {
    if (task.assignedTo.includes(contact.name)) {
      html += contactInitialsPreviewTemplate(contact);
    }
  });

  previewContainer.innerHTML = html;
}

function openDropdown(dropdown, arrow, label) {
  const button = document.querySelector(".assignedToInput");

  dropdown.classList.remove("hidden");
  arrow.classList.add("rotate");
  renderAssignedTo();
  label.textContent = "";
  assignedPreviewMode = false;

  button.classList.add("activeFocus");
}

function closeDropdown(dropdown, arrow, label) {
  const button = document.querySelector(".assignedToInput");

  dropdown.classList.add("hidden");
  arrow.classList.remove("rotate");
  assignedPreviewMode = false;
  label.textContent = "Select contacts to assign";
  renderSelectedContactsBelowInput();

  button.classList.remove("activeFocus");
}

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

function updateAssignedLabel() {
  const label = document.getElementById("clearContact");
  label.textContent = "Select contacts to assign";
}

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

/////////// Kategorie Dropdown ///////////
function toggleCategoryDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("categoryDropdown");
  dropdown.classList.toggle("hidden");
}

// Kategorie auswählen
function selectCategory(category) {
  selectedCategory = category;
  document.getElementById("categoryLabel").textContent = category;
  document.getElementById("categoryDropdown").classList.add("hidden");
}

// Klick außerhalb schließt das Dropdown
document.addEventListener("click", (event) => {
  const dropdown = document.getElementById("categoryDropdown");
  const wrapper = document.querySelector(".categorySelectWrapper");

  if (!dropdown || !wrapper) return;
  if (!dropdown.contains(event.target) && !wrapper.contains(event.target)) {
    dropdown.classList.add("hidden");
  }
});
