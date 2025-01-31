// Region names mapping
const regionNames = {
    'toshkent': 'Тошкент шаҳри',
    'viloyat2': 'Андижон',
    'viloyat3': 'Бухоро',
    'viloyat4': 'Фарғона',
    'viloyat5': 'Жиззах',
    'viloyat6': 'Наманган',
    'viloyat7': 'Навоий',
    'viloyat8': 'Қашқадарё',
    'viloyat9': 'Самарқанд',
    'viloyat10': 'Сирдарё',
    'viloyat11': 'Сурхондарё',
    'viloyat12': 'Хоразм'
};

let allData = {};

// Fetch data from db.json
async function fetchData() {
    try {
        const response = await fetch('db.json');
        allData = await response.json();
        renderAllData();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render all data or filtered data
function renderAllData(filterRegion = 'all', searchTerm = '') {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    Object.entries(allData).forEach(([region, employees]) => {
        if (filterRegion === 'all' || filterRegion === region) {
            const filteredEmployees = employees.filter(employee => matchesSearch(employee, searchTerm));
            
            if (filteredEmployees.length > 0) {
                const regionSection = document.createElement('section');
                regionSection.className = 'mb-8';
                
                const regionTitle = document.createElement('h2');
                regionTitle.className = 'text-2xl font-bold mb-4 text-teal-700';
                regionTitle.textContent = regionNames[region] || region;
                regionSection.appendChild(regionTitle);

                const table = createTable(filteredEmployees);
                regionSection.appendChild(table);

                mainContent.appendChild(regionSection);
            }
        }
    });
}

// Create table for a region
function createTable(employees) {
    const table = document.createElement('table');
    table.className = 'min-w-full bg-white rounded-lg shadow overflow-hidden';
    
    const thead = document.createElement('thead');
    thead.className = 'bg-gray-100';
    thead.innerHTML = `
        <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold">Ф.И.Ш</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Лавозим</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Рақам</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Ишчи рақам</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Хона</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Ўзгартириш</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.className = 'border-t hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4">${employee.FISH}</td>
            <td class="px-6 py-4">${employee.Lavozim}</td>
            <td class="px-6 py-4">${employee.raqam}</td>
            <td class="px-6 py-4">${formatPhoneNumber(employee.iRaqam)}</td>
            <td class="px-6 py-4">${employee.xonasi}</td>
            <td class="px-6 py-4">
                <div class="flex gap-2">
                    <button class="text-blue-600 hover:text-blue-800" onclick="editEmployee('${employee.raqam}')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-800" onclick="deleteEmployee('${employee.raqam}')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    return table;
}

// Format phone number
function formatPhoneNumber(number) {
    const str = number.toString();
    return `(${str.slice(0,2)}) ${str.slice(2,5)}-${str.slice(5,7)}-${str.slice(7)}`;
}

// Search functionality
function matchesSearch(employee, searchTerm) {
    if (!searchTerm) return true;
    searchTerm = searchTerm.toLowerCase();
    return (
        employee.FISH.toLowerCase().includes(searchTerm) ||
        employee.Lavozim.toLowerCase().includes(searchTerm) ||
        employee.raqam.toString().includes(searchTerm) ||
        employee.iRaqam.toString().includes(searchTerm) ||
        employee.xonasi.toString().includes(searchTerm)
    );
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    // Region filter
    document.getElementById('regionFilter').addEventListener('change', (e) => {
        const searchTerm = document.getElementById('searchInput').value;
        renderAllData(e.target.value, searchTerm);
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const filterRegion = document.getElementById('regionFilter').value;
        renderAllData(filterRegion, e.target.value);
    });

    document.getElementById('searchButton').addEventListener('click', () => {
        const filterRegion = document.getElementById('regionFilter').value;
        const searchTerm = document.getElementById('searchInput').value;
        renderAllData(filterRegion, searchTerm);
    });
});

// Edit employee function (placeholder)
function editEmployee(employeeId) {
    console.log(`Editing employee ${employeeId}`);
    // Implement edit functionality
}

// Delete employee function (placeholder)
function deleteEmployee(employeeId) {
    console.log(`Deleting employee ${employeeId}`);
    // Implement delete functionality
}