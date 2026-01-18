/**
 * Sidebar Component JavaScript
 * Handles sidebar functionality, navigation highlighting, and mobile behavior
 */

class SidebarComponent {
  constructor() {
    this.sidebar = null;
    this.overlay = null;
    this.toggleButton = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the sidebar component
   */
  async init() {
    if (this.isInitialized) return;

    try {
      await this.loadSidebar();
      this.setupElements();
      this.setupEventListeners();
      this.setActiveNavItem();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing sidebar:', error);
    }
  }

  /**
   * Load sidebar HTML into the page
   */
  async loadSidebar() {
    try {
      const response = await fetch('./templates/sidebar.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const sidebarHTML = await response.text();
      
      // Insert sidebar at the beginning of body or app container
      const appContainer = document.querySelector('.app') || document.body;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sidebarHTML;
      
      // Insert sidebar as first child
      appContainer.insertBefore(tempDiv.firstElementChild, appContainer.firstChild);
      
      // Add mobile toggle button and overlay
      this.addMobileElements();
      
    } catch (error) {
      console.error('Error loading sidebar:', error);
      throw error;
    }
  }

  /**
   * Add mobile toggle button and overlay
   */
  addMobileElements() {
    // Add toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'sidebar-toggle';
    toggleButton.innerHTML = '☰';
    toggleButton.setAttribute('aria-label', 'Toggle navigation');
    document.body.appendChild(toggleButton);

    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  /**
   * Setup element references
   */
  setupElements() {
    this.sidebar = document.getElementById('sidebar');
    this.overlay = document.querySelector('.sidebar-overlay');
    this.toggleButton = document.querySelector('.sidebar-toggle');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Mobile toggle
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => this.toggleMobileSidebar());
    }

    // Overlay click to close
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeMobileSidebar());
    }

    // Close sidebar when clicking nav links on mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          this.closeMobileSidebar();
        }
      });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        this.closeMobileSidebar();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileSidebar();
      }
    });
  }

  /**
   * Set active navigation item based on current page
   */
  setActiveNavItem() {
    const currentPage = this.getCurrentPage();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === currentPage) {
        item.classList.add('active');
      }
    });
  }

  /**
   * Get current page name from URL
   */
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'summary.html';
    
    // Map filenames to page identifiers
    const pageMap = {
      'summary.html': 'summary',
      'add_task.html': 'add_task',
      'board.html': 'board',
      'contacts.html': 'contacts',
      'index.html': 'summary'
    };
    
    return pageMap[filename] || 'summary';
  }

  /**
   * Toggle mobile sidebar
   */
  toggleMobileSidebar() {
    if (this.sidebar && this.overlay) {
      const isOpen = this.sidebar.classList.contains('mobile-open');
      
      if (isOpen) {
        this.closeMobileSidebar();
      } else {
        this.openMobileSidebar();
      }
    }
  }

  /**
   * Open mobile sidebar
   */
  openMobileSidebar() {
    if (this.sidebar && this.overlay) {
      this.sidebar.classList.add('mobile-open');
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Close mobile sidebar
   */
  closeMobileSidebar() {
    if (this.sidebar && this.overlay) {
      this.sidebar.classList.remove('mobile-open');
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /**
   * Update active nav item programmatically
   */
  setActivePage(pageName) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === pageName) {
        item.classList.add('active');
      }
    });
  }
}

// Global sidebar instance
window.sidebarComponent = new SidebarComponent();

/**
 * Inline SVG replacement function
 * Replaces img tags with data-inline-svg attribute with actual SVG elements
 */
async function inlineAllSvgs() {
  const imgs = document.querySelectorAll('.nav-icon img[data-inline-svg]');

  await Promise.all([...imgs].map(async (img) => {
    try {
      const res = await fetch(img.src);
      const svgText = await res.text();

      const wrapper = document.createElement('div');
      wrapper.innerHTML = svgText.trim();
      const svg = wrapper.querySelector('svg');
      if (!svg) return;

      svg.style.width = '30px';
      svg.style.height = '30px';

      img.replaceWith(svg);
    } catch (e) {
      console.warn('SVG inline failed:', img.src);
    }
  }));
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.sidebarComponent.init();
  inlineAllSvgs();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SidebarComponent;
}