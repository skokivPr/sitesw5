// Data constants are now imported from constants.js

// Authentication Manager
class AuthManager {
    constructor() {
        this.users = window.authSystem.users;
        this.sessionKey = window.authSystem.sessionKey;
        this.isLoggedIn = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkExistingSession();
    }

    checkExistingSession() {
        const session = localStorage.getItem(this.sessionKey);
        if (session) {
            try {
                const userData = JSON.parse(session);
                if (userData && userData.username) {
                    this.currentUser = userData;
                    this.isLoggedIn = true;
                    return true;
                }
            } catch (e) {
                localStorage.removeItem(this.sessionKey);
            }
        }
        return false;
    }

    login(password) {
        const user = this.users.find(u => u.password === password);
        if (user) {
            this.currentUser = { username: user.username, role: user.role };
            this.isLoggedIn = true;
            localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
            return { success: true, user: this.currentUser };
        }
        return { success: false, error: "Nieprawidłowe hasło" };
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem(this.sessionKey);
    }

    getUserInfo() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.isLoggedIn;
    }
}

// Removed Login Modal Component - now using only console login

// DateTime component
class DateTime {
    constructor() {
        this.dateTimeElement = null;
        this.timeElement = null;
        this.dateElement = null;
        this.intervalId = null;
        this.themeToggle = null;
        this.authManager = null;
        this.init();
    }

    init() {
        this.themeToggle = new ThemeToggle();
        this.authManager = new AuthManager();
        this.render();
        this.startClock();
    }

    formatTime(date) {
        return date.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    }

    formatDate(date) {
        return date.toLocaleDateString("pl-PL", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    updateDateTime() {
        if (!this.timeElement || !this.dateElement) return;

        const now = new Date();
        this.timeElement.textContent = this.formatTime(now);
        this.dateElement.textContent = this.formatDate(now);
    }

    startClock() {
        this.updateDateTime();
        this.intervalId = setInterval(() => this.updateDateTime(), 1000);
    }

    stopClock() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    render() {
        const now = new Date();

        const container = document.createElement("div");
        container.className = "datetime-container";

        // Always show theme toggle and navigation - no authentication required
        const controlsInfo = `<div class="user-info">
            <button class="datetime-nav-button " onclick="toggleUserTheme()" id="userThemeToggle" title="Theme">
                <span class="theme-toggle-icon">
                    ${this.themeToggle.isDark
                ? '<img src="https://api.iconify.design/line-md:sunny-twotone-loop.svg" alt="Light Mode">'
                : '<img src="https://api.iconify.design/line-md:sunny-outline-to-moon-loop-transition.svg" alt="Dark Mode">'}
                </span>
            </button>
            <button class="datetime-nav-button" onclick="navigateToSubpage()" title="Narzędzia">
                <img src="https://api.iconify.design/openmoji:puzzle-piece.svg" alt="Tools">
            </button>
            <button class="datetime-nav-button" onclick="showLoginConsole()" title="Open Login Console (Ctrl+L)">
                <img src="https://api.iconify.design/streamline-ultimate-color:browser-page-layout.svg" alt="Console">
            </button>
            <div class="vertical-separator orange"></div>
            <button class="datetime-nav-button" onclick="window.open('https://playliveos.carrd.co/', '_blank')" title="Visit PlayLiveOS">
                <img src="https://api.iconify.design/streamline-ultimate-color:playlist-songs.svg" alt="Music">
            </button>
            <div class="vertical-separator orange"></div>
            <button class="datetime-nav-button" onclick="window.open('https://quip.com/mlWpALvnGSt5/Pliki', '_blank')" title="Linki Print">
                <img src="https://api.iconify.design/streamline-ultimate-color:print-text.svg" alt="Linki Print">
            </button>
            <div class="vertical-separator orange"></div>
            <button class="datetime-nav-button e" onclick="window.open('https://exd9.carrd.co/', '_blank')" title="Lista Ewakuacji">
                <img src="https://api.iconify.design/streamline-ultimate-color:multiple-users-1.svg" alt="Users">
            </button>
        </div>
        `;

        container.innerHTML = `
           ${controlsInfo}
            <div class="datetime-content">
                <div class="datetime-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="datetime-info">
                    <div class="datetime-time">${this.formatTime(now)}</div>
                    <div class="datetime-date">${this.formatDate(now)}</div>
                </div>
            </div>
        `;

        this.dateTimeElement = container;
        this.timeElement = container.querySelector(".datetime-time");
        this.dateElement = container.querySelector(".datetime-date");

        return container;
    }

    destroy() {
        this.stopClock();
        if (this.dateTimeElement) {
            this.dateTimeElement.remove();
        }
    }
}

// Footer component
class Footer {
    constructor() {
        this.currentYear = new Date().getFullYear();
    }

    render() {
        const footer = document.createElement("footer");
        footer.className = "app-footer";

        footer.innerHTML = `
           
            
            <div class="footer-content">
                <div class="footer-section">
                    <span class="footer-title">DEV LABS R&S</span>
                    <span class="footer-version">v1.1.0 Dev</span>
                </div>
                <div class="footer-section">
                    <a href="#" class="footer-info" onclick="openPrivacyModal()">
                        PRIVACY POLICY
                        <i class="fas fa-info-circle ml-2"></i>
                    </a>
                </div>
                
                <div class="footer-section">
                    <span class=" footer-info-copyright">© ${this.currentYear} All rights reserved</span>
                </div>
                <div class="footer-section">
                    <span class="footer-status">
                        <i class="fas fa-circle status-indicator"></i>
                        SYSTEM ONLINE
                    </span>
                </div>
            </div>
        `;

        return footer;
    }
}

// Modal component
class Modal {
    constructor(title, content, isNavModal = false) {
        this.title = title;
        this.content = content;
        this.isNavModal = isNavModal;
        this.overlay = null;
        this.modalContent = null;
    }

    create() {
        // Create modal overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Create modal content
        this.modalContent = document.createElement('div');
        this.modalContent.className = 'modal-content';

        // Create header
        const header = document.createElement('div');
        header.className = 'modal-header';

        const titleElement = document.createElement('h2');
        titleElement.className = 'modal-title';
        titleElement.textContent = this.title;

        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', () => this.close());

        header.appendChild(titleElement);
        header.appendChild(closeButton);

        // Create body
        const body = document.createElement('div');
        body.className = 'modal-body';

        if (this.isNavModal) {
            body.innerHTML = this.content;
        } else {
            body.innerHTML = this.content;
        }

        // Assemble modal
        this.modalContent.appendChild(header);
        this.modalContent.appendChild(body);
        this.overlay.appendChild(this.modalContent);

        return this.overlay;
    }

    open() {
        if (!this.overlay) {
            this.create();
        }

        document.body.appendChild(this.overlay);

        // Use requestAnimationFrame for smoother transitions
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.overlay.classList.add('active');
            });
        });

        // Add escape key listener
        document.addEventListener('keydown', this.handleEscKey.bind(this));
    }

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('active');

            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
            }, 250);
        }

        // Remove escape key listener
        document.removeEventListener('keydown', this.handleEscKey.bind(this));
    }

    handleEscKey(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }
}

// Theme Toggle functionality
class ThemeToggle {
    constructor() {
        this.isDark = false;
        this.init();
    }

    init() {
        // Check localStorage first, then fallback to current attribute
        const savedTheme = localStorage.getItem("theme");
        let isDarkMode = false;

        if (savedTheme) {
            isDarkMode = savedTheme === "dark";
        } else {
            isDarkMode = document.body.getAttribute("data-theme") === "dark" ||
                document.documentElement.hasAttribute("dark-theme");
        }

        this.isDark = isDarkMode;

        // Apply the theme using new system
        this.applyTheme(isDarkMode);

        // Update theme color for mobile
        this.updateThemeColor(isDarkMode);
    }

    toggle() {
        this.isDark = !this.isDark;

        // Save to localStorage
        localStorage.setItem("theme", this.isDark ? "dark" : "light");

        // Apply the theme using new system
        this.applyTheme(this.isDark);

        // Update theme color for mobile
        this.updateThemeColor(this.isDark);

        // Update button content
        this.updateButton();
    }

    applyTheme(isDarkMode) {
        // Apply new theme system
        if (isDarkMode) {
            document.body.setAttribute("data-theme", "dark");
            // Keep compatibility with old system
            document.documentElement.setAttribute("dark-theme", "");
        } else {
            document.body.removeAttribute("data-theme");
            // Keep compatibility with old system
            document.documentElement.removeAttribute("dark-theme");
        }
    }

    updateThemeColor(isDarkMode) {
        // Update theme-color meta tag for mobile browsers
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }

        // Set theme color based on current theme
        const themeColor = isDarkMode ? '#1a1d23' : '#f0f2f5';
        themeColorMeta.content = themeColor;

        // Also update msapplication-TileColor if it exists
        const tileColorMeta = document.querySelector('meta[name="msapplication-TileColor"]');
        if (tileColorMeta) {
            tileColorMeta.content = themeColor;
        }
    }

    updateButton() {
        const iconElement = document.querySelector(".theme-toggle-icon i");
        const textElement = document.querySelector(".theme-toggle-text");

        if (iconElement && textElement) {
            iconElement.className = `fas ${this.isDark ? "fa-sun" : "fa-moon"}`;
            textElement.textContent = this.isDark ? "Light" : "Dark";
        }
    }

    render() {
        const button = document.createElement("button");
        button.className = "theme-toggle";
        button.setAttribute(
            "aria-label",
            this.isDark ? "Switch to light theme" : "Switch to dark theme"
        );

        button.innerHTML = `
      
      <span class="theme-toggle-icon">
        <i class="fas ${this.isDark ? "fa-sun" : "fa-moon"}"></i>
      </span>
      <span class="theme-toggle-text">
        ${this.isDark ? "Light" : "Dark"}
      </span>
    `;

        button.addEventListener("click", () => this.toggle());

        return button;
    }
}

// LinkButton component
function createLinkButton(title, markerColor, icon, url) {
    const div = document.createElement("div");
    div.className = "link-button";

    // Add fmc-button class for FMC buttons
    if (title.includes("FMC")) {
        div.classList.add("fmc-button");
    }

    // Add event-history-button class for EVENT HISTORY button
    if (title.includes("EVENT HISTORY")) {
        div.classList.add("event-history-button");
    }

    // Add fmc-track-button class for FMC TRACK button
    if (title.includes("FMC TRACK")) {
        div.classList.add("fmc-track-button");
    }

    // Add excel-in-button class for EXCEL IN button
    if (title.includes("EXCEL IN")) {
        div.classList.add("excel-in-button");
    }

    // Add specific classes for other buttons
    if (title.includes("CONSOLE HARMONY")) {
        div.classList.add("console-harmony-button");
    }

    if (title.includes("YARD 360")) {
        div.classList.add("yard-360-button");
    }

    if (title.includes("PANORAMA")) {
        div.classList.add("panorama-button");
    }

    if (title.includes("FCLM PORTAL")) {
        div.classList.add("fclm-portal-button");
    }

    if (title.includes("AAP")) {
        div.classList.add("aap-button");
    }

    const markerClasses = markerColor ? `marker marker-${markerColor}` : "";

    // Special icon handling for custom SVG icons
    let iconHTML = "";
    if (icon) {
        if (title.includes("CHAT OPS")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-sharp-color:desktop-chat-flat.svg" alt="Chat Ops"></span>`;
        } else if (title.includes("QUIP")) {
            iconHTML = `<span class="link-button-icon"><img src="https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://quip.com&size=32" alt="Quip"></span>`;
        } else if (title.includes("EXCEL IN")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/vscode-icons:file-type-excel.svg" alt="Excel"></span>`;
        } else if (title.includes("OUTBOUND")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:shipment-tracking.svg" alt="Outbound"></span>`;
        } else if (title.includes("GTDR")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/emojione:mobile-phone.svg" alt="GTDR"></span>`;
        } else if (title.includes("DEVICE ACTIVATION")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/openmoji:mobile-info.svg" alt="Device Activation"></span>`;
        } else if (title.includes("PASSWORD RESET")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:laptop-user.svg" alt="Password Reset"></span>`;
        } else if (title.includes("PANORAMA")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/noto:bar-chart.svg" alt="Panorama"></span>`;
        } else if (title.includes("YARD 360")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:delivery-truck-clock.svg" alt="Yard 360"></span>`;
        } else if (title.includes("SEZAM")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:truck-empty-1.svg" alt="Sezam"></span>`;
        } else if (title.includes("YARD MANAGEMENT")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:network-pin.svg" alt="Yard Management"></span>`;
        } else if (title.includes("EVENT HISTORY")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:calendar-date.svg" alt="Event History"></span>`;
        } else if (title.includes("DOCKMASTER SEARCH")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:shipment-search.svg" alt="Dockmaster Search"></span>`;
        } else if (title.includes("DOCKMASTER")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:shipment-clock.svg" alt="Dockmaster"></span>`;
        } else if (title.includes("ISSUES")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:professions-man-construction-2.svg" alt="Issues"></span>`;
        } else if (title.includes("PERMISSIONS")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:multiple-neutral-2.svg" alt="Permissions"></span>`;
        } else if (title.includes("CONSOLE HARMONY")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/vscode-icons:file-type-ai2.svg" alt="Console Harmony"></span>`;
        } else if (title.includes("FMC TRACK")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:delivery-truck-cargo.svg" alt="FMC Track"></span>`;
        } else if (title.includes("FMC")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:antenna.svg" alt="FMC"></span>`;
        } else if (title.includes("FCLM PORTAL")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/vscode-icons:file-type-befunge.svg" alt="FCLM Portal"></span>`;
        } else if (title.includes("AAP")) {
            iconHTML = `<span class="link-button-icon"><img src="https://api.iconify.design/streamline-ultimate-color:app-window-code.svg" alt="AAP"></span>`;
        } else {
            iconHTML = `<span class="link-button-icon"><i class="fas ${icon}"></i></span>`;
        }
    }

    div.innerHTML = `
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
    <div class="link-button-left">
      ${markerColor ? `<div class="${markerClasses}"></div>` : ""}
      <span class="link-button-title">${title}</span>
    </div>
    ${iconHTML}
  `;

    // Check if it's a placeholder button
    if (title.includes("PLACEHOLDER")) {
        div.classList.add("placeholder-button");
        div.style.cursor = "default";
        div.style.opacity = "0.3";
    }

    // Add click handler if URL is provided
    if (url && url !== "#") {
        div.style.cursor = "pointer";

        // Left click - open in new tab
        div.addEventListener("click", () => {
            window.open(url, "_blank");
        });

        // Right click - show context menu
        div.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            showLinkContextMenu(e, url, title);
        });
    }

    return div;
}

// GroupCard component
function createGroupCard(data) {
    const { columns, markerColor } = data;

    const div = document.createElement("div");
    div.className = "group-card";

    const gridClasses = ["group-card-grid"];
    if (columns.length > 1) {
        gridClasses.push("two-columns");
    }

    div.innerHTML = `
    <div class="${gridClasses.join(" ")}">
      ${columns
            .map(
                (column) => `
        <div class="group-column">
        </div>
      `
            )
            .join("")}
    </div>
  `;

    // Add buttons with event listeners
    const columnElements = div.querySelectorAll('.group-column');
    columns.forEach((column, columnIndex) => {
        let fmcButtons = [];
        let otherButtons = [];

        // Separate FMC buttons from others
        column.forEach((item) => {
            if (item.title.includes("FMC")) {
                fmcButtons.push(item);
            } else {
                otherButtons.push(item);
            }
        });

        // Add non-FMC buttons first
        otherButtons.forEach((item) => {
            const button = createLinkButton(item.title, markerColor, item.icon, item.url);
            columnElements[columnIndex].appendChild(button);
        });

        // Add FMC buttons in a horizontal container if there are any
        if (fmcButtons.length > 0) {
            const fmcContainer = document.createElement('div');
            fmcContainer.className = 'fmc-buttons-container';

            fmcButtons.forEach((item) => {
                const button = createLinkButton(item.title, markerColor, item.icon, item.url);
                fmcContainer.appendChild(button);
            });

            columnElements[columnIndex].appendChild(fmcContainer);
        }
    });

    return div;
}

// Main App initialization
function initializeApp() {
    const root = document.getElementById("root");
    if (!root) return;

    // Initialize theme first (before anything else)
    initializeTheme();

    // Always create dashboard - authentication through console only
    createDashboard();

    // Initialize auto-change system
    autoChangeManager = new AutoChangeManager();
}

// Initialize theme system
function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    let isDarkMode = false;

    if (savedTheme) {
        isDarkMode = savedTheme === "dark";
    } else {
        isDarkMode = document.body.getAttribute("data-theme") === "dark" ||
            document.documentElement.hasAttribute("dark-theme");
    }

    // Apply the theme using new system
    if (isDarkMode) {
        document.body.setAttribute("data-theme", "dark");
        document.documentElement.setAttribute("dark-theme", "");
    } else {
        document.body.removeAttribute("data-theme");
        document.documentElement.removeAttribute("dark-theme");
    }

    // Update theme color for mobile
    updateThemeColor(isDarkMode);
}

// Removed showLoginModal function - now using only console login

function createDashboard() {
    const root = document.getElementById("root");
    if (!root) return;

    // Create datetime component (includes theme toggle)
    const dateTime = new DateTime();

    // Create footer component
    const footer = new Footer();

    // Create app container
    const appContainer = document.createElement("div");
    appContainer.className = "app-container";

    // Create content wrapper
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "content-wrapper";

    // Add decorative corners
    contentWrapper.innerHTML = `
    <div class="decorative-corner decorative-corner-tl" aria-hidden="true"></div>
    <div class="decorative-corner decorative-corner-br" aria-hidden="true"></div>
  `;

    // Add datetime component to content wrapper
    contentWrapper.appendChild(dateTime.render());

    // Create main grid
    const mainGrid = document.createElement("main");
    mainGrid.className = "main-grid";

    // Create left section
    const leftSection = document.createElement("div");
    leftSection.className = "left-section";

    leftGroups.forEach((group, index) => {
        leftSection.appendChild(createGroupCard(group));
    });

    // Create right section
    const rightSection = document.createElement("div");
    rightSection.className = "right-section";

    rightGroups.forEach((group, index) => {
        rightSection.appendChild(createGroupCard(group));
    });

    // Add additional groups to right section
    if (window.additionalGroups) {
        window.additionalGroups.forEach((group, index) => {
            rightSection.appendChild(createGroupCard(group));
        });
    }

    // Assemble the app
    mainGrid.appendChild(leftSection);
    mainGrid.appendChild(rightSection);
    contentWrapper.appendChild(mainGrid);

    // Add footer to content wrapper
    contentWrapper.appendChild(footer.render());

    appContainer.appendChild(contentWrapper);

    // Add to root
    root.appendChild(appContainer);
}

// Global logout function
function handleLogout() {
    const authManager = new AuthManager();
    authManager.logout();
    location.reload();
}

// Removed toggleLoginTheme function - no longer needed

// Global theme toggle function for user info
function toggleUserTheme() {
    const currentTheme = localStorage.getItem("theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    const isDarkMode = newTheme === "dark";

    // Save to localStorage
    localStorage.setItem("theme", newTheme);

    // Apply the theme using new system
    if (isDarkMode) {
        document.body.setAttribute("data-theme", "dark");
        document.documentElement.setAttribute("dark-theme", "");
    } else {
        document.body.removeAttribute("data-theme");
        document.documentElement.removeAttribute("dark-theme");
    }

    // Update theme color for mobile
    updateThemeColor(isDarkMode);

    // Update all theme toggle buttons
    updateAllThemeButtons(newTheme);

    // Notify auto-change manager about theme change
    if (autoChangeManager) {
        autoChangeManager.onThemeChange();
    }
}

// Update theme color helper function
function updateThemeColor(isDarkMode) {
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.name = 'theme-color';
        document.head.appendChild(themeColorMeta);
    }

    const themeColor = isDarkMode ? '#1a1d23' : '#f0f2f5';
    themeColorMeta.content = themeColor;

    const tileColorMeta = document.querySelector('meta[name="msapplication-TileColor"]');
    if (tileColorMeta) {
        tileColorMeta.content = themeColor;
    }
}

// Update all theme toggle buttons
function updateAllThemeButtons(theme) {
    const isDark = theme === "dark";

    // Update login theme button
    const loginButton = document.getElementById("loginThemeToggle");
    if (loginButton) {
        const icon = loginButton.querySelector("i");
        if (icon) {
            icon.className = `fas ${isDark ? 'fa-sun' : 'fa-moon'}`;
        }
    }

    // Update user theme button with SVG icons
    const userButton = document.getElementById("userThemeToggle");
    if (userButton) {
        const iconContainer = userButton.querySelector(".theme-toggle-icon");
        if (iconContainer) {
            iconContainer.innerHTML = isDark
                ? '<img src="https://api.iconify.design/line-md:sunny-twotone-loop.svg" alt="Light Mode">'
                : '<img src="https://api.iconify.design/line-md:sunny-outline-to-moon-loop-transition.svg" alt="Dark Mode">';
        }
    }
}

// Function to navigate to subpage
function navigateToSubpage() {
    // Get addons from addons.js
    const addons = window.addonsUtils.getRecommendations();

    // Generate browser icons mapping
    const browserIcons = {
        firefox: 'https://api.iconify.design/devicon:firefox.svg',
        edge: 'https://api.iconify.design/logos:microsoft-edge.svg',
        chrome: 'https://api.iconify.design/devicon:chrome.svg'
    };

    // Generate addon items HTML
    let addonsHTML = '';
    addons.forEach(addon => {
        // Generate browser badges
        let browserBadgesHTML = '';
        if (addon.browsers) {
            for (const [browser, url] of Object.entries(addon.browsers)) {
                const browserIcon = browserIcons[browser] || '';
                const browserName = browser.charAt(0).toUpperCase() + browser.slice(1);
                browserBadgesHTML += `
                    <a href="${url}" class="browser-badge ${browser}" target="_blank" title="${browserName}">
                        <img src="${browserIcon}" alt="${browserName}" width="24" height="24">
                    </a>`;
            }
        }

        // Generate complete addon item
        addonsHTML += `
            <div class="modal-nav-item addon-item">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                <div class="modal-nav-item-title">
                    <img src="${addon.icon}" alt="${addon.name}" width="20" height="20" style="margin-right: 8px;">
                    ${addon.name}
                </div>
                <div class="modal-nav-item-description">
                    ${addon.description}
                </div>
                <div class="browser-selection">
                    ${browserBadgesHTML}
                </div>
            </div>`;
    });

    const modalContent = `
        <h3>Polecane Dodatki</h3>
        <p>Przydatne rozszerzenia do przeglądarek:</p>
        
        <div class="info-section">
            <h3>Jak zainstalować dodatek:</h3>
            <ul>
                <li>Kliknij na ikonę przeglądarki przy wybranym dodatku</li>
                <li>Zostaniesz przekierowany do sklepu z rozszerzeniami</li>
                <li>Kliknij przycisk <span class="highlight">"Dodaj do przeglądarki"</span></li>
                <li>Potwierdź instalację w oknie dialogowym</li>
            </ul>
        </div>

        <div class="warning-section">
            <p>Instaluj tylko dodatki z oficjalnych sklepów przeglądarek dla swojego bezpieczeństwa.</p>
        </div>
        
        <div class="modal-nav-grid">
            ${addonsHTML}
        </div>

        <div class="info-section">
            <h3>Przydatne informacje:</h3>
            <ul>
                <li><span class="highlight">uBlock Origin</span> - Najlepszy bloker reklam, redukuje zużycie danych i przyspiesza przeglądanie</li>
                <li><span class="highlight">Dark Reader</span> - Automatycznie zmienia jasne strony na ciemne, oszczędza baterie</li>
                <li><span class="highlight">Stylus</span> - Pozwala na personalizację wyglądu stron internetowych</li>
                <li><span class="highlight">Tampermonkey</span> - Umożliwia uruchamianie skryptów modyfikujących strony</li>
            </ul>
        </div>
        
    `;

    const modal = new Modal("Navigation Options", modalContent, true);
    modal.open();

    // Add click handlers for addon items after modal opens
    setTimeout(() => {
        const addonItems = document.querySelectorAll('.addon-item');
        const modalBody = document.querySelector('.modal-body');

        addonItems.forEach(item => {
            item.addEventListener('click', function (e) {
                // Don't trigger if clicking on browser badge
                if (e.target.closest('.browser-badge')) {
                    return;
                }

                // Prevent event from bubbling to modal body
                e.stopPropagation();

                // Toggle active class
                const isActive = this.classList.contains('active');

                // Close all other addon items
                addonItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    this.classList.add('active');
                }
            });
        });

        // Close all browser selections when clicking outside
        if (modalBody) {
            modalBody.addEventListener('click', function (e) {
                if (!e.target.closest('.addon-item')) {
                    addonItems.forEach(item => {
                        item.classList.remove('active');
                    });
                }
            });
        }
    }, 100);
}

// Function to open service in new tab
function openService(url, serviceName) {
    console.log(`Opening ${serviceName} at ${url}`);
    window.open(url, "_blank");
}

// Function to open privacy modal
function openPrivacyModal() {
    const modalContent = `
        <h3>Polityka Prywatności</h3>
        <p>Niniejsza polityka prywatności określa zasady funkcjonowania korporacyjnej aplikacji pulpitu nawigacyjnego.</p>
        
        <div class="info-section">
            <h3>Informacje ogólne:</h3>
            <p>Serwis nie zbiera ani nie przetwarza żadnych danych osobowych użytkowników, co zapewnia pełną ochronę prywatności.</p>
        </div>
        
        <div class="info-section">
            <h3>Pliki cookies:</h3>
            <p>Serwis wykorzystuje wyłącznie niezbędne pliki cookies techniczne, które są wymagane do prawidłowego działania strony. Te pliki cookies nie służą do zbierania żadnych danych osobowych ani do śledzenia użytkowników.</p>
        </div>
        
        <div class="info-section">
            <h3>Brak zbierania danych:</h3>
            <p>Serwis:</p>
            <ul>
                <li><span class="highlight">Nie zbiera</span> danych osobowych</li>
                <li><span class="highlight">Nie wymaga</span> rejestracji</li>
                <li><span class="highlight">Nie prowadzi</span> newslettera</li>
                <li><span class="highlight">Nie śledzi</span> zachowań użytkowników</li>
                <li><span class="highlight">Nie wykorzystuje</span> narzędzi analitycznych</li>
            </ul>
        </div>

        <div class="warning-section">
            <p>Wszystkie dane są przechowywane lokalnie w przeglądarce i nie są przekazywane do żadnych zewnętrznych serwisów.</p>
        </div>
        
        <div class="info-section">
            <h3>Zmiany w polityce prywatności:</h3>
            <p>Administrator zastrzega sobie prawo do zmiany niniejszej polityki prywatności w dowolnym czasie. O wszelkich zmianach użytkownicy będą informowani z odpowiednim wyprzedzeniem.</p>
        </div>
        
        <p><strong>Data:</strong> ${new Date().toLocaleDateString('pl-PL')}</p>
    `;
    const modal = new Modal("Privacy Policy", modalContent, true);
    modal.open();
}

// Function to open help modal
function openHelpModal() {
    const modalContent = `
        <h3>Pomoc - Logowanie</h3>
        <p>Witamy w sekcji pomocy Corporate App Dashboard. Znajdziesz tutaj informacje dotyczące logowania do systemu.</p>
        
        <div class="info-section">
            <h3>Jak się zalogować:</h3>
            <ul>
                <li><strong>Nazwa użytkownika:</strong> Wprowadź swoją nazwę użytkownika w pierwszym polu</li>
                <li><strong>Hasło:</strong> Wprowadź hasło w drugim polu</li>
                <li><strong>Logowanie:</strong> Kliknij przycisk <span class="highlight">"Zaloguj się"</span> lub naciśnij Enter</li>
                <li><strong>Motyw:</strong> Użyj przycisku <i class="fas fa-moon"></i>/<i class="fas fa-sun"></i> aby zmienić motyw</li>
            </ul>
        </div>

        <div class="info-section">
            <h3>Problemy z logowaniem:</h3>
            <ul>
                <li>Sprawdź czy <span class="highlight">caps lock</span> nie jest włączony</li>
                <li>Upewnij się, że używasz prawidłowych danych logowania</li>
                <li>Odśwież stronę (F5 lub Ctrl+R) i spróbuj ponownie</li>
                <li>Wyczyść pamięć podręczną przeglądarki</li>
                <li>Skontaktuj się z administratorem systemu</li>
            </ul>
        </div>

        <div class="warning-section">
            <p>Dane logowania są przechowywane lokalnie w przeglądarce i nie są wysyłane do żadnych stron trzecich.</p>
        </div>
        
        <div class="info-section">
            <h3>Bezpieczeństwo:</h3>
            <ul>
                <li>Nie udostępniaj swoich danych logowania innym osobom</li>
                <li>Wyloguj się po zakończeniu pracy</li>
                <li>Zgłoś podejrzane aktywności administratorowi</li>
            </ul>
        </div>
        
        <p><strong>Wersja systemu:</strong> 1.0.0</p>
        <p><strong>Data:</strong> ${new Date().toLocaleDateString('pl-PL')}</p>
    `;
    const modal = new Modal("Pomoc - Logowanie", modalContent, true);
    modal.open();
}

// Console Login System
let loginConsole = null;

function createLoginConsole() {
    if (loginConsole) return;

    loginConsole = document.createElement('div');
    loginConsole.className = 'login-console hidden';
    loginConsole.innerHTML = `
        <div class="console-header">
            <span class="console-title">
                <i class="fas fa-terminal"></i>
                Login Console - Corporate Dashboard
            </span>
            <button class="console-close" onclick="hideLoginConsole()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="console-body">
            <div class="console-prompt">
                <span class="prompt-symbol">$</span>
                <span class="prompt-text">Please enter password to access AI Link Hub</span>
            </div>
            <form class="console-form" id="consoleLoginForm">
                <div class="console-input-group">
                    <span class="input-label">password:</span>
                    <input type="password" id="consolePassword" name="password" required autocomplete="current-password" autofocus>
                </div>
                <div class="console-actions">
                    <button type="submit" class="console-btn">
                        <i class="fas fa-arrow-right"></i>
                         Login
                    </button>
                </div>
            </form>
            <div class="console-output" id="consoleOutput"></div>
            <div class="console-help">
                <div class="help-line">Available commands:</div>
                <div class="help-line">• login - authenticate user</div>
                <div class="help-line">• clear - clear console output</div>
                <div class="help-line">• exit - close console (Esc)</div>
            </div>
        </div>
    `;

    document.body.appendChild(loginConsole);

    // Setup form handler
    const form = loginConsole.querySelector('#consoleLoginForm');
    form.addEventListener('submit', handleConsoleLogin);

    // Setup keyboard shortcuts
    setupConsoleKeyboardShortcuts();
}

function showLoginConsole() {
    if (!loginConsole) createLoginConsole();

    loginConsole.classList.remove('hidden');
    loginConsole.classList.add('active');

    // Focus on password input
    const passwordInput = loginConsole.querySelector('#consolePassword');
    if (passwordInput) {
        setTimeout(() => passwordInput.focus(), 100);
    }

    // Clear previous output
    const output = loginConsole.querySelector('#consoleOutput');
    if (output) {
        output.innerHTML = '';
    }
}

function hideLoginConsole() {
    if (loginConsole) {
        loginConsole.classList.remove('active');
        loginConsole.classList.add('hidden');
    }
}

function handleConsoleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const password = formData.get('password');
    const output = document.getElementById('consoleOutput');

    // Simulate authentication
    const authManager = new AuthManager();
    const result = authManager.login(password);

    if (result.success) {
        // Show success in console
        output.innerHTML = `
            <div class="output-line success">✓ Authentication successful</div>
            <div class="output-line">User: ${result.user.username}</div>
            <div class="output-line">Role: ${result.user.role}</div>
            <div class="output-line">Redirecting to AI Link Hub...</div>
            <div class="output-line loading">Opening new tab in 3 seconds...</div>
        `;

        // Open AI Link Hub in new tab after delay
        setTimeout(() => {
            window.open('https://devospanel.carrd.co/', '_blank');
            hideLoginConsole();
        }, 3000);

    } else {
        // Show error in console
        output.innerHTML = `
            <div class="output-line error">✗ Authentication failed</div>
            <div class="output-line error">${result.error}</div>
            <div class="output-line">Please try again...</div>
        `;
    }
}

function setupConsoleKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+L to open login console
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            showLoginConsole();
        }

        // Escape to close console
        if (e.key === 'Escape' && loginConsole && loginConsole.classList.contains('active')) {
            hideLoginConsole();
        }
    });
}

// Link Context Menu System
let linkContextMenu = null;

function createLinkContextMenu() {
    if (linkContextMenu) return;

    linkContextMenu = document.createElement('div');
    linkContextMenu.className = 'link-context-menu hidden';
    linkContextMenu.innerHTML = `
        <div class="context-menu-item" data-action="open-foreground">
            <i class="fas fa-external-link-alt"></i>
            Otwórz w nowej karcie
        </div>
        <div class="context-menu-item" data-action="open-background">
            <i class="fas fa-clone"></i>
            Otwórz w tle
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" data-action="copy-link">
            <i class="fas fa-copy"></i>
            Kopiuj link
        </div>
    `;

    document.body.appendChild(linkContextMenu);

    // Hide menu when clicking outside
    document.addEventListener('click', hideLinkContextMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideLinkContextMenu();
    });
}

function showLinkContextMenu(event, url, title) {
    if (!linkContextMenu) createLinkContextMenu();

    // Store current URL and title for actions
    linkContextMenu.dataset.url = url;
    linkContextMenu.dataset.title = title;

    // Position menu at cursor
    const x = event.clientX;
    const y = event.clientY;

    linkContextMenu.style.left = x + 'px';
    linkContextMenu.style.top = y + 'px';

    // Show menu
    linkContextMenu.classList.remove('hidden');

    // Add click handlers for menu items
    const menuItems = linkContextMenu.querySelectorAll('.context-menu-item[data-action]');
    menuItems.forEach(item => {
        item.onclick = (e) => {
            e.stopPropagation();
            handleContextMenuAction(item.dataset.action, url, title);
            hideLinkContextMenu();
        };
    });

    // Adjust position if menu goes off screen
    setTimeout(() => {
        const rect = linkContextMenu.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (rect.right > windowWidth) {
            linkContextMenu.style.left = (windowWidth - rect.width - 10) + 'px';
        }
        if (rect.bottom > windowHeight) {
            linkContextMenu.style.top = (windowHeight - rect.height - 10) + 'px';
        }
    }, 0);
}

function hideLinkContextMenu() {
    if (linkContextMenu) {
        linkContextMenu.classList.add('hidden');
    }
}

function handleContextMenuAction(action, url, title) {
    switch (action) {
        case 'open-foreground':
            window.open(url, '_blank');
            break;

        case 'open-background':
            // Create temporary link for background opening
            const tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.target = '_blank';
            tempLink.rel = 'noopener noreferrer';

            // Add to DOM temporarily
            document.body.appendChild(tempLink);

            // Simulate Ctrl+Click for background opening
            const clickEvent = new MouseEvent('click', {
                ctrlKey: true,
                metaKey: true, // For Mac
                bubbles: true,
                cancelable: true
            });

            tempLink.dispatchEvent(clickEvent);
            document.body.removeChild(tempLink);
            break;

        case 'copy-link':
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link skopiowany do schowka');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Link skopiowany do schowka');
            });
            break;
    }
}

function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Auto-Change Background System
class AutoChangeManager {
    constructor() {
        this.isActive = false;
        this.currentIndex = 0;
        this.intervalId = null;
        this.speed = 10000; // 10 seconds
        this.images = {
            light: [
                'https://picsum.photos/2500/1400?random=1&blur=1',
                'https://picsum.photos/2500/1400?random=2&blur=1',
                'https://picsum.photos/2500/1400?random=3&blur=1',
                'https://picsum.photos/2500/1400?random=4&blur=1',
                'https://picsum.photos/2500/1400?random=5&blur=1',
                'https://picsum.photos/2500/1400?random=6&blur=1',
                'https://picsum.photos/2500/1400?random=7&blur=1',
                'https://picsum.photos/2500/1400?random=8&blur=1'
            ],
            dark: [
                'https://picsum.photos/2500/1400?random=10&blur=2&grayscale',
                'https://picsum.photos/2500/1400?random=11&blur=2&grayscale',
                'https://picsum.photos/2500/1400?random=12&blur=2&grayscale',
                'https://picsum.photos/2500/1400?random=13&blur=2&grayscale',
                'https://picsum.photos/2500/1400?random=14&blur=2&grayscale',
                'https://picsum.photos/2500/1400?random=15&blur=2&grayscale',
                'https://picsum.photos/2500/1400?random=16&blur=2&grayscale',
                'https://picsum.photos/2500/1400?random=17&blur=2&grayscale'
            ]
        };
        this.init();
    }

    init() {
        this.createIndicator();
        this.loadSettings();
        // Start automatically
        this.start();
        // Preload images for better performance
        setTimeout(() => {
            this.preloadImages();
        }, 1000);
    }



    createIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'auto-change-indicator';
        indicator.id = 'autoChangeIndicator';
        indicator.innerHTML = `
            <span class="status-dot paused"></span>
            <span class="status-text">AUTO-CHANGE: PAUSED</span>
        `;
        document.body.appendChild(indicator);
    }



    loadSettings() {
        const savedSettings = localStorage.getItem('autoChangeSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.currentIndex = settings.currentIndex || 0;
        }
    }

    saveSettings() {
        const settings = {
            currentIndex: this.currentIndex
        };
        localStorage.setItem('autoChangeSettings', JSON.stringify(settings));
    }

    getCurrentImages() {
        const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
        return isDarkTheme ? this.images.dark : this.images.light;
    }

    changeBackground() {
        const images = this.getCurrentImages();
        const appContainer = document.querySelector('.app-container');

        if (appContainer && images.length > 0) {
            const currentImageUrl = images[this.currentIndex];

            // Show loading state
            appContainer.classList.add('loading-bg');

            // Preload image before setting it
            const img = new Image();
            img.onload = () => {
                appContainer.classList.remove('loading-bg');
                appContainer.classList.add('auto-changing');
                appContainer.style.backgroundImage = `url('${currentImageUrl}')`;

                // Preload next image
                const nextIndex = (this.currentIndex + 1) % images.length;
                const nextImg = new Image();
                nextImg.src = images[nextIndex];
            };

            img.onerror = () => {
                appContainer.classList.remove('loading-bg');
                console.warn('Failed to load background image:', currentImageUrl);
            };

            img.src = currentImageUrl;
            this.currentIndex = (this.currentIndex + 1) % images.length;
            this.saveSettings();
        }
    }

    start() {
        if (this.isActive) return;

        this.isActive = true;
        this.changeBackground(); // Change immediately
        this.intervalId = setInterval(() => {
            this.changeBackground();
        }, this.speed);

        this.updateUI();
        this.showIndicator();
    }

    stop() {
        if (!this.isActive) return;

        this.isActive = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.updateUI();
        this.hideIndicator();
    }

    togglePlayPause() {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
    }



    updateUI() {
        this.updateIndicator();
    }

    updateIndicator() {
        const indicator = document.getElementById('autoChangeIndicator');
        const dot = indicator.querySelector('.status-dot');
        const text = indicator.querySelector('.status-text');

        if (this.isActive) {
            dot.className = 'status-dot playing';
            text.textContent = `AUTO-CHANGE: ACTIVE (${this.speed / 1000}s)`;
        } else {
            dot.className = 'status-dot paused';
            text.textContent = 'AUTO-CHANGE: PAUSED';
        }
    }

    showIndicator() {
        const indicator = document.getElementById('autoChangeIndicator');
        indicator.classList.add('active');

        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (this.isActive) {
                this.hideIndicator();
            }
        }, 3000);
    }

    hideIndicator() {
        const indicator = document.getElementById('autoChangeIndicator');
        indicator.classList.remove('active');
    }

    // Method to handle theme changes
    onThemeChange() {
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.classList.add('theme-changing');

            // Remove theme-changing class after transition
            setTimeout(() => {
                appContainer.classList.remove('theme-changing');
            }, 500);
        }

        // Reset to first image of new theme
        this.currentIndex = 0;
        if (this.isActive) {
            // Delay background change to allow theme transition
            setTimeout(() => {
                this.changeBackground();
            }, 250);
        }
    }

    // Method to preload all images for current theme
    preloadImages() {
        const images = this.getCurrentImages();
        images.forEach(imageUrl => {
            const img = new Image();
            img.src = imageUrl;
        });
    }

    // Method to get optimized image URL based on device
    getOptimizedImageUrl(baseUrl) {
        const isMobile = window.innerWidth <= 768;
        const pixelRatio = window.devicePixelRatio || 1;

        if (isMobile) {
            // Use smaller dimensions for mobile
            return baseUrl.replace('2500/1400', '1500/900');
        } else if (pixelRatio > 1) {
            // Use higher quality for retina displays
            return baseUrl.replace('blur=1', 'blur=1').replace('blur=2', 'blur=2');
        }

        return baseUrl;
    }
}

// Global auto-change manager instance
let autoChangeManager = null;

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);
