document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

let allData = [];

async function fetchData() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
 
        if (!Array.isArray(data)) {
            console.error('Error: JSON data is not an array:', data);
            return;
        }

        allData = data;
        populateOrganizationFilter();
        displayData(allData);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}


function populateOrganizationFilter() {
    const filterSelect = document.getElementById('organizationFilter');
    if (!filterSelect || !Array.isArray(allData)) return;

    const organizations = [...new Set(allData.map(item => item.tashkilot))];

    filterSelect.innerHTML = '<option value="all">Барча ташкилотлар</option>';
    organizations.forEach(org => {
        const option = document.createElement('option');
        option.value = org;
        option.textContent = org;
        filterSelect.appendChild(option);
    });
}


function displayData(data) {
    const container = document.getElementById('dataContainer');
    if (!container) return;
    container.innerHTML = '';

    const groupedData = groupUsersByOrganizationAndDepartment(data);

    Object.entries(groupedData).forEach(([organization, departments]) => {
        const orgDiv = document.createElement('div');
        orgDiv.classList.add('organization', 'mb-8');

        const orgTitleContainer = document.createElement('div');
        orgTitleContainer.className = 'w-full bg-teal-700 text-white py-2 px-4 text-center text-2xl font-bold sticky top-0 z-10 rounded-[20px]';
        
        const orgTitle = document.createElement('h2');
        orgTitle.textContent = organization;
        orgTitleContainer.appendChild(orgTitle);
        
        orgDiv.appendChild(orgTitleContainer);

        Object.entries(departments).forEach(([department, employees]) => {
            const deptTitle = document.createElement('h3');
            if(department=== "undefined"){
                deptTitle.textContent = "";
            }else{
                deptTitle.textContent = department;
            }
            deptTitle.className = 'text-xl font-bold text-center mt-8 mb-2 text-teal-900';
            orgDiv.appendChild(deptTitle);

            const table = createTable(employees);
            orgDiv.appendChild(table);
        });

        container.appendChild(orgDiv);
    });
}


function groupUsersByOrganizationAndDepartment(users) {
    return users.reduce((acc, user) => {
        if (!acc[user.tashkilot]) {
            acc[user.tashkilot] = {};
        }
        if (!acc[user.tashkilot][user.bolim]) {
            acc[user.tashkilot][user.bolim] = [];
        }
        acc[user.tashkilot][user.bolim].push(user);
        return acc;
    }, {});
}

function createTable(employees) {
    const table = document.createElement('table');
    table.className = 'w-full bg-white rounded-[20px] shadow overflow-hidden mb-4 border border-gray-200';
    
    const thead = document.createElement('thead');
    thead.className = 'bg-gray-100';
    thead.innerHTML = `
        <tr class="flex flex-wrap bg-gray-300 text-sm font-semibold text-gray-1000 text-left">
            <th class="px-4 py-2 w-1/4">Ф.И.Ш</th>
            <th class="px-4 py-2 w-1/4">Лавозим</th>
            <th class="px-4 py-2 w-1/4">Телефон</th>
            <th class="px-4 py-2 w-1/4">Хона</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.className = 'divide-y divide-gray-300';

    if (employees.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4">Маълумот топилмади</td></tr>`;
    } else {
        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.className = 'border-t hover:bg-gray-50 flex flex-wrap';
            row.innerHTML = `
                <td class="px-4 py-3 w-1/4">${employee.FISH || '-'}</td>
                <td class="px-4 py-3 w-1/4">${employee.lavozim || '-'}</td>
                <td class="px-4 py-3 w-1/4">${employee.tel ? employee.tel.toString() : '-'}</td>
                <td class="px-4 py-3 w-1/4">${employee.xona ? employee.xona.toString() : '-'}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    table.appendChild(tbody);
    return table;
}



// Filter ishlashi
const filterSelect = document.getElementById('organizationFilter');
if (filterSelect) {
    filterSelect.addEventListener('change', () => {
        const selectedOrg = filterSelect.value;
        const searchTerm = document.getElementById('searchInput').value;
        let filteredData = allData;
        
        if (selectedOrg !== 'all') {
            filteredData = filteredData.filter(item => item.tashkilot === selectedOrg);
        }
        
        displayData(filteredData.filter(user => matchesSearch(user, searchTerm)));
    });
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    const filterOrganization = document.getElementById('organizationFilter').value;
    const searchTerm = e.target.value;
    let filteredData = allData;
    
    if (filterOrganization !== 'all') {
        filteredData = filteredData.filter(user => user.tashkilot === filterOrganization);
    }
    
    displayData(filteredData.filter(user => matchesSearch(user, searchTerm)));
});

function matchesSearch(employee, searchTerm) {
    if (!searchTerm) return true;
    searchTerm = searchTerm.toLowerCase();
    return (
        (employee.FISH && employee.FISH.toLowerCase().includes(searchTerm)) ||
        (employee.lavozim && employee.lavozim.toLowerCase().includes(searchTerm)) ||
        (employee.tel && employee.tel.toString().includes(searchTerm)) ||
        (employee.xona && employee.xona.toString().includes(searchTerm))
    );
}
