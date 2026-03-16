let selectedCategory = "";

async function loadContacts() {
  try {
    const response = await fetch(`${BASE_URL}Contacts.json`);
    const data = await response.json();

    if (!data) return;

    contacts = data; // ❗ KEY BEHALTEN

    renderAssignedTo();
  } catch (error) {
    console.error("Fehler beim Laden der Contacts:", error);
  }
}

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

  for (let key in contacts) {
    const contact = contacts[key];

    if (task.assignedTo.includes(key)) {
      html += contactInitialsPreviewTemplate(contact);
    }
  }

  previewContainer.innerHTML = html;
}

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

function closeDropdown(dropdown, arrow, label) {
  const button = document.querySelector(".assignedToInput");
  const preview = document.getElementById("assignedPreviewContainer");

  dropdown.classList.add("hidden");
  arrow.classList.remove("rotate");
  assignedPreviewMode = false;
  label.textContent = "Select contacts to assign";

  preview.style.display = "flex"; // 👈 wieder einblenden
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

function toggleCategoryDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("categoryDropdown");
  dropdown.classList.toggle("hidden");
}

function selectCategory(category) {
  selectedCategory = category;
  document.getElementById("categoryLabel").textContent = category;
  document.getElementById("categoryDropdown").classList.add("hidden");
}

document.addEventListener("click", (event) => {
  const dropdown = document.getElementById("categoryDropdown");
  const wrapper = document.querySelector(".categorySelectWrapper");

  if (!dropdown || !wrapper) return;
  if (!dropdown.contains(event.target) && !wrapper.contains(event.target)) {
    dropdown.classList.add("hidden");
  }
});
