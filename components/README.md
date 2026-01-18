# Sidebar Component

Eine wiederverwendbare Sidebar-Komponente für die Join Kanban Application.

## Dateien

- `templates/sidebar.html` - HTML-Template für die Sidebar
- `style/sidebar.css` - Styling für die Sidebar  
- `JS/sidebar.js` - JavaScript-Funktionalität für die Sidebar

## Verwendung

### 1. CSS und JavaScript einbinden

```html
<head>
  <!-- Standard Styles -->
  <link rel="stylesheet" href="./style/standard.css" />
  
  <!-- Sidebar Component -->
  <link rel="stylesheet" href="./style/sidebar.css" />
  
  <!-- Page-specific styles -->
  <link rel="stylesheet" href="./style/page-name.css" />
</head>
```

```html
<body>
  <!-- ... Page content ... -->
  
  <!-- Scripts -->
  <script src="./JS/sidebar.js"></script>
  <script src="./JS/page-name.js"></script>
</body>
```

### 2. HTML-Struktur

```html
<div class="app">
  <!-- Sidebar wird automatisch hier eingefügt -->
  
  <!-- Main area -->
  <div class="main">
    <!-- Page content -->
  </div>
</div>
```

## Features

### ✅ Automatische Integration
- Sidebar wird automatisch beim Seitenladen eingefügt
- Keine manuelle HTML-Duplikation mehr

### ✅ Aktiver Navigationszustand
- Automatische Erkennung der aktuellen Seite
- Hervorhebung des aktiven Menüpunkts

### ✅ Mobile Responsive
- Ausklappbare Sidebar auf mobilen Geräten
- Touch-freundliche Bedienung
- Overlay für bessere UX

### ✅ Keyboard Navigation
- ESC-Taste schließt mobile Sidebar
- Fokus-Management für Accessibility

## API

### JavaScript Funktionen

```javascript
// Sidebar-Instanz abrufen
const sidebar = window.sidebarComponent;

// Aktive Seite programmatisch setzen
sidebar.setActivePage('contacts');

// Mobile Sidebar öffnen/schließen
sidebar.openMobileSidebar();
sidebar.closeMobileSidebar();
sidebar.toggleMobileSidebar();
```

## Anpassung

### Neue Menüpunkte hinzufügen

In `templates/sidebar.html`:

```html
<a class="nav-item" href="./neue-seite.html" data-page="neue_seite">
  <span class="nav-icon">
    <img src="./assets/img/icon.svg" alt="Icon">
  </span>
  <span>Neue Seite</span>
</a>
```

In `JS/sidebar.js` die `pageMap` erweitern:

```javascript
const pageMap = {
  'summary.html': 'summary',
  'add_task.html': 'add_task',
  'board.html': 'board',
  'contacts.html': 'contacts',
  'neue-seite.html': 'neue_seite',  // <- Hinzufügen
  'index.html': 'summary'
};
```

### Styling anpassen

Die Sidebar-Styles befinden sich in `style/sidebar.css` und können nach Bedarf angepasst werden:

- Farben: Variablen am Anfang der Datei
- Größen: Layout-Properties
- Animationen: Transition-Properties

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Migration von bestehenden Seiten

1. Bestehende Sidebar-HTML entfernen
2. CSS-Links anpassen
3. Script-Tag hinzufügen
4. Seitenspezifische Sidebar-Styles entfernen

Siehe `templates/page-template.html` für ein vollständiges Beispiel.