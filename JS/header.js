/**
 * Header Template Integration
 * Lädt automatisch das Header-Template beim Seitenladen
 */

// Automatisches Laden des Headers beim DOM-Ready
document.addEventListener('DOMContentLoaded', async function() {
  await loadHeaderTemplate();
});

/**
 * Lädt das Header-Template und fügt es in die Seite ein
 */
async function loadHeaderTemplate() {
  try {
    const response = await fetch('./templates/header.html');
    if (!response.ok) {
      console.error('Header template konnte nicht geladen werden:', response.status);
      return;
    }
    
    const headerHTML = await response.text();
    
    // Finde den Container für den Header
    const headerContainer = document.querySelector('.header-container');
    if (headerContainer) {
      headerContainer.innerHTML = headerHTML;
    } else {
      // Fallback: Füge Header am Anfang des .app Containers ein, VOR dem .main Element
      const appContainer = document.querySelector('.app');
      const mainElement = document.querySelector('.main');
      
      if (appContainer && mainElement) {
        // Header vor .main einfügen
        mainElement.insertAdjacentHTML('beforebegin', headerHTML);
      } else if (appContainer) {
        // Fallback wenn kein .main gefunden wird
        appContainer.insertAdjacentHTML('afterbegin', headerHTML);
      }
    }
    
    console.log('Header template erfolgreich geladen');
  } catch (error) {
    console.error('Fehler beim Laden des Header templates:', error);
  }
}

/**
 * Initialisiert Header-Event-Listener (für zukünftige Funktionen)
 */
function initializeHeaderEvents() {
  const helpBtn = document.querySelector('.header-help-btn');
  const profileBtn = document.querySelector('.header-profile-btn');
  
  if (helpBtn) {
    helpBtn.addEventListener('click', function() {
      // TODO: Hilfe-Dialog öffnen
      console.log('Hilfe angeklickt');
    });
  }
  
  if (profileBtn) {
    profileBtn.addEventListener('click', function() {
      // TODO: Profil-Menü öffnen
      console.log('Profil angeklickt');
    });
  }
}

// Event-Listener nach dem Laden des Headers initialisieren
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeHeaderEvents, 100); // Kurz warten bis Header geladen ist
});