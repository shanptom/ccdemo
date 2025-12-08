/**
 * Coffee Shop Menu - Dynamic Menu Loading
 * Mobile-first menu with category navigation
 */

document.addEventListener('DOMContentLoaded', function () {
    // Load menu data and initialize menu
    fetch('../data/menu.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Initialize mobile menu
            initializeMobileMenu();

            // Render category tabs
            renderCategoryTabs(data.categories);

            // Render menu sections
            renderMenuSections(data.categories);

            // Render business info
            renderBusinessInfo(data.businessInfo);

            // Set up scroll navigation
            setupScrollNavigation();
        })
        .catch(error => {
            console.error('Error loading menu data:', error);
            showErrorMessage('Menu currently unavailable. Please try again later.');
        });
});

function initializeMobileMenu() {
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    if (mobileMenuToggle && mobileNav && mobileOverlay) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNav.setAttribute('aria-hidden', isExpanded);
            mobileOverlay.classList.toggle('active');

            if (!isExpanded) {
                mobileOverlay.addEventListener('click', closeMobileMenu);
            }
        });
    }

    function closeMobileMenu() {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileOverlay.classList.remove('active');
        mobileOverlay.removeEventListener('click', closeMobileMenu);
    }
}

function renderCategoryTabs(categories) {
    const seasonalTerrain = document.querySelector('.seasonal-terrain');
    const terrainFramework = seasonalTerrain.querySelector('.terrain-framework');

    // Create tabs container
    const tabsContainer = document.createElement('nav');
    tabsContainer.className = 'category-tabs';
    tabsContainer.setAttribute('aria-label', 'Menu Categories');

    // Create tab list
    const tabList = document.createElement('ul');
    tabList.className = 'tab-list';
    tabList.role = 'tablist';

    categories.forEach((category, index) => {
        const tabItem = document.createElement('li');
        tabItem.className = 'tab-item';
        tabItem.role = 'presentation';

        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button';
        if (index === 0) tabButton.classList.add('active');
        tabButton.id = `tab-${category.id}`;
        tabButton.setAttribute('role', 'tab');
        tabButton.setAttribute('aria-controls', `section-${category.id}`);
        tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        tabButton.textContent = category.name;

        tabButton.addEventListener('click', () => {
            // Update active tab
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabButton.classList.add('active');
            tabButton.setAttribute('aria-selected', 'true');

            // Smooth scroll to section
            const targetSection = document.getElementById(`section-${category.id}`);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        tabItem.appendChild(tabButton);
        tabList.appendChild(tabItem);
    });

    tabsContainer.appendChild(tabList);

    // Insert tabs at the top of terrain-framework
    terrainFramework.insertBefore(tabsContainer, terrainFramework.firstChild);
}

function renderMenuSections(categories) {
    const seasonalTerrain = document.querySelector('.seasonal-terrain');
    const terrainFramework = seasonalTerrain.querySelector('.terrain-framework');

    // Remove existing parcel elements
    const existingParcels = terrainFramework.querySelectorAll('.culinary-parcel');
    existingParcels.forEach(parcel => parcel.remove());

    categories.forEach(category => {
        const section = document.createElement('section');
        section.className = 'menu-section';
        section.id = `section-${category.id}`;

        // Category header
        const header = document.createElement('div');
        header.className = 'menu-section-header';

        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = category.name;

        const divider = document.createElement('hr');
        divider.className = 'section-divider';

        header.appendChild(title);
        header.appendChild(divider);

        // Items container
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'menu-items';

        category.items.forEach(item => {
            const itemElement = document.createElement('article');
            itemElement.className = 'menu-item';

            const itemContent = document.createElement('div');
            itemContent.className = 'item-content';

            // Item image (if available)
            if (item.image) {
                const imageWrapper = document.createElement('div');
                imageWrapper.className = 'item-image-wrapper';

                const image = document.createElement('img');
                // Normalize image path for menu page (in pages/ directory)
                const imagePath = item.image.replace(/\.\.\/images\/|images\//, '').replace(/^/, '../images/');
                image.src = imagePath;
                image.alt = `Photo of ${item.name}`;
                image.loading = 'lazy';

                imageWrapper.appendChild(image);
                itemContent.appendChild(imageWrapper);
            }

            // Item details
            const itemDetails = document.createElement('div');
            itemDetails.className = 'item-details';

            const itemName = document.createElement('h3');
            itemName.className = 'item-name';
            itemName.textContent = item.name;

            const itemDescription = document.createElement('p');
            itemDescription.className = 'item-description';
            itemDescription.textContent = item.description;

            const itemPrice = document.createElement('span');
            itemPrice.className = 'item-price';
            itemPrice.textContent = `$${item.price.toFixed(2)}`;

            itemDetails.appendChild(itemName);
            itemDetails.appendChild(itemDescription);
            itemDetails.appendChild(itemPrice);

            itemContent.appendChild(itemDetails);
            itemElement.appendChild(itemContent);
            itemsContainer.appendChild(itemElement);
        });

        section.appendChild(header);
        section.appendChild(itemsContainer);
        terrainFramework.appendChild(section);
    });
}

function renderBusinessInfo(businessInfo) {
    const seasonalTerrain = document.querySelector('.seasonal-terrain');
    const terrainFramework = seasonalTerrain.querySelector('.terrain-framework');

    // Create business info section
    const businessSection = document.createElement('section');
    businessSection.className = 'business-info-section';

    const businessContainer = document.createElement('div');
    businessContainer.className = 'business-info-container';

    // Hours section
    const hoursSection = document.createElement('div');
    hoursSection.className = 'business-hours';

    const hoursTitle = document.createElement('h2');
    hoursTitle.className = 'hours-title';
    hoursTitle.textContent = 'Hours of Operation';

    const hoursTable = document.createElement('table');
    hoursTable.className = 'hours-table';

    // Days of the week in order (starting with Monday)
    const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    daysOrder.forEach(day => {
        if (businessInfo.hours[day]) {
            const row = document.createElement('tr');

            const dayCell = document.createElement('td');
            dayCell.className = 'day-name';
            dayCell.textContent = day.charAt(0).toUpperCase() + day.slice(1);

            const hoursCell = document.createElement('td');
            hoursCell.className = 'day-hours';
            hoursCell.textContent = businessInfo.hours[day];

            row.appendChild(dayCell);
            row.appendChild(hoursCell);
            hoursTable.appendChild(row);
        }
    });

    hoursSection.appendChild(hoursTitle);
    hoursSection.appendChild(hoursTable);

    // Contact section
    const contactSection = document.createElement('div');
    contactSection.className = 'business-contact';

    const contactTitle = document.createElement('h2');
    contactTitle.className = 'contact-title';
    contactTitle.textContent = 'Contact Us';

    const contactDetails = document.createElement('div');
    contactDetails.className = 'contact-details';

    const phoneLink = document.createElement('a');
    phoneLink.href = `tel:${businessInfo.phone}`;
    phoneLink.className = 'contact-link phone-link';
    phoneLink.textContent = businessInfo.phone;

    const addressElement = document.createElement('address');
    addressElement.className = 'contact-link address-link';
    addressElement.textContent = businessInfo.address;

    const mapElement = document.createElement('div');
    mapElement.className = 'business-map';

    const mapIframe = document.createElement('iframe');
    mapIframe.src = businessInfo.mapUrl;
    mapIframe.className = 'map-iframe';
    mapIframe.setAttribute('allowfullscreen', '');
    mapIframe.setAttribute('loading', 'lazy');
    mapIframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

    mapElement.appendChild(mapIframe);

    contactDetails.appendChild(phoneLink);
    contactDetails.appendChild(addressElement);
    contactSection.appendChild(contactTitle);
    contactSection.appendChild(contactDetails);
    contactSection.appendChild(mapElement);

    businessContainer.appendChild(hoursSection);
    businessContainer.appendChild(contactSection);
    businessSection.appendChild(businessContainer);

    terrainFramework.appendChild(businessSection);
}

function setupScrollNavigation() {
    const menuSections = document.querySelectorAll('.menu-section');

    // Intersection Observer to highlight active tab based on scroll position
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeSectionId = entry.target.id;
                const categoryId = activeSectionId.replace('section-', '');

                // Update active tab
                document.querySelectorAll('.tab-button').forEach(tab => {
                    tab.classList.remove('active');
                    tab.setAttribute('aria-selected', 'false');
                });

                const activeTab = document.getElementById(`tab-${categoryId}`);
                if (activeTab) {
                    activeTab.classList.add('active');
                    activeTab.setAttribute('aria-selected', 'true');
                }
            }
        });
    }, {
        root: null,
        rootMargin: '-50px 0px -50% 0px',
        threshold: 0
    });

    menuSections.forEach(section => {
        observer.observe(section);
    });
}

function showErrorMessage(message) {
    const seasonalTerrain = document.querySelector('.seasonal-terrain');
    const terrainFramework = seasonalTerrain.querySelector('.terrain-framework');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'menu-error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `<p>${message}</p>`;

    terrainFramework.appendChild(errorDiv);
}
