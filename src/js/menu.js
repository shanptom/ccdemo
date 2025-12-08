/**
 * Coffee Shop Menu - Dynamic Menu Loading
 * Loads menu items from JSON data
 */

document.addEventListener('DOMContentLoaded', function () {
    // Load menu data from JSON
    fetch('../data/menu.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Load coffee items
            loadMenuItems(data.categories.find(cat => cat.id === 'coffee'), 'coffee-items');

            // Load pastries items
            loadMenuItems(data.categories.find(cat => cat.id === 'pastries'), 'pastries-items');

            // Load lunch items
            loadMenuItems(data.categories.find(cat => cat.id === 'lunch'), 'lunch-items');
        })
        .catch(error => {
            console.error('Error loading menu data:', error);
            // Show fallback content
            document.getElementById('coffee-items').innerHTML = '<p>Menu loading error. Please refresh the page.</p>';
            document.getElementById('pastries-items').innerHTML = '<p>Menu loading error. Please refresh the page.</p>';
            document.getElementById('lunch-items').innerHTML = '<p>Menu loading error. Please refresh the page.</p>';
        });

    function loadMenuItems(category, containerId) {
        const container = document.getElementById(containerId);

        if (!category || !container) {
            return;
        }

        // Create menu grid
        const menuGrid = document.createElement('div');
        menuGrid.className = 'menu-grid';

        category.items.forEach((item, index) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item product-card'; // Added product-card class

            // Cycle through organic shapes
            const shapeClass = `shape-${(index % 4) + 1}`;

            menuItem.innerHTML = `
                <div class="image-wrapper ${shapeClass}">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p class="menu-description">${item.description}</p>
                    <p class="menu-price">$${item.price.toFixed(2)}</p>
                </div>
            `;
            menuGrid.appendChild(menuItem);
        });

        container.appendChild(menuGrid);
    }

    // Add collapsible functionality to menu categories
    const categoryHeaders = document.querySelectorAll('.menu-category h2');
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const category = this.parentElement;
            category.classList.toggle('collapsed');

            // Toggle arrow indicator
            if (category.classList.contains('collapsed')) {
                this.innerHTML = this.innerHTML.replace('▼', '▶');
            } else {
                this.innerHTML = this.innerHTML.replace('▶', '▼');
            }
        });

        // Add arrow indicator
        header.innerHTML += ' ▼';
    });
});
