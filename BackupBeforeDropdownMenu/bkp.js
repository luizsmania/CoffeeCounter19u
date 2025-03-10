let selectedCoffee = '';
let selectedMilk = '';
let selectedSyrup = '';
let selectedExtra = '';
let coffeeList = [];

// Load the saved coffee list from localStorage when the page is loaded
window.onload = function() {
    loadCoffeeList();
    updateCoffeeList();
};

function selectOption(option, category, buttonElement) {
    // Toggle the 'selected' class on the clicked button
    if (buttonElement.classList.contains('selected')) {
        buttonElement.classList.remove('selected');
        
        // Unselect the option by setting the category variable to an empty string
        if (category === 'coffee') {
            selectedCoffee = '';
        } else if (category === 'milk') {
            selectedMilk = '';
        } else if (category === 'syrup') {
            selectedSyrup = '';
        } else if (category === 'extra') {
            selectedExtra = '';
        }
            } else {
        // Deselect any previously selected buttons in the same category
        document.querySelectorAll(`.button.${category}`).forEach(btn => btn.classList.remove('selected'));
        
        // Select the clicked button and update the selected option
        buttonElement.classList.add('selected');
        if (category === 'coffee') {
            selectedCoffee = option;
        } else if (category === 'milk') {
            selectedMilk = option;
        } else if (category === 'syrup') {
            selectedSyrup = option;
        } else if (category === 'extra') {
            selectedExtra = option;
        }
    }
}

function addCoffee() {
    const coffeeDetails = {
        coffee: selectedCoffee || 'No Coffee Selected',
        milk: selectedMilk || 'Regular Milk',
        syrup: selectedSyrup || 'No Syrup',
        extra: selectedExtra || 'No Extra',
        time: new Date().toLocaleTimeString(), // Get the current time in HH:MM:SS format
        backgroundColor: 'rgba(255, 202, 111, 0.26)' // Set default color here
    };

    coffeeList.push(coffeeDetails);
    updateCoffeeList();
    saveCoffeeList();
    resetSelections();
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function removeCoffee(index) {
    // Show a confirmation dialog before deleting
    const confirmDelete = confirm("Are you sure you want to delete this coffee?");
    
    if (confirmDelete) {
        // Remove the coffee from the array
        coffeeList.splice(index, 1);

        // Update the coffee list display
        updateCoffeeList();

        // Optionally save the updated coffee list if persistence is needed
        saveCoffeeList();
    }
}


function resetSelections() {
    selectedCoffee = '';
    selectedMilk = '';
    selectedSyrup = '';
    selectedExtra = '';

    // Remove the 'selected' class from all buttons
    document.querySelectorAll('.button').forEach(btn => btn.classList.remove('selected'));
}

function updateCoffeeList() {
    const coffeeListElement = document.getElementById('coffeeList');
    const coffeeCountElement = document.getElementById('coffeeCount');
    coffeeListElement.innerHTML = '';

    // Update the <h2> element with the count of total coffees made
    coffeeCountElement.textContent = `Recent Coffees - Total: ${coffeeList.length}`;

    // Slice the last 10 coffees and reverse them to show the most recent at the top
    const recentCoffees = coffeeList.slice(-999).reverse();
    recentCoffees.forEach((coffee, index) => {
        let listItemText = `${coffee.coffee}`;

        // Check if milk is present and not "Regular Milk"
        if (coffee.milk && coffee.milk !== 'Regular Milk') {
            listItemText += ` with ${coffee.milk}`;
        }

        // Check if syrup is present and not "No Syrup"
        if (coffee.syrup && coffee.syrup !== 'No Syrup') {
            listItemText += ` and ${coffee.syrup}`;
        }

        // Check if extra is present and not "No Extra"
        if (coffee.extra && coffee.extra !== 'No Extra') {
            listItemText += ` and ${coffee.extra}`;
        }

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${listItemText}
            <span style="font-size: 0.7em; display: block; margin-top: 1px;" class="toggle-color">
                at ${coffee.time}
            </span>
            <button onclick="removeCoffee(${coffeeList.length - 1 - index})" style="font-family: Serif; font-size: 0.65em; margin-left: 0px; padding: 4px 8px; background-color: rgba(255, 0, 0, 0.5); color: black; border: 0px solid; border-radius: 3px; cursor: pointer;">Delete</button>
        `;

        // Set the background color based on the coffee object's property
        listItem.style.backgroundColor = coffee.backgroundColor;

        // Add an event listener to the list item
        listItem.addEventListener('click', () => {
            if (coffee.backgroundColor === 'rgba(0, 128, 0, 0.3)') { // Check for rgba green
                coffee.backgroundColor = 'rgba(255, 202, 111, 0.26)'; // Revert to original color
                listItem.style.backgroundColor = coffee.backgroundColor;
            } else {
                coffee.backgroundColor = 'rgba(0, 128, 0, 0.3)'; // Set to rgba green
                listItem.style.backgroundColor = coffee.backgroundColor;
            }
        });

        coffeeListElement.appendChild(listItem);
    });
}



// Save the coffee list to localStorage
function saveCoffeeList() {
    localStorage.setItem('coffeeList', JSON.stringify(coffeeList));
}

// Load the coffee list from localStorage
function loadCoffeeList() {
    const savedCoffeeList = localStorage.getItem('coffeeList');
    if (savedCoffeeList) {
        coffeeList = JSON.parse(savedCoffeeList);
    }
}

function exportData() {
    let coffeeCount = {};
    let milkCount = {};
    let syrupCount = {};
    let extraCount = {};

    coffeeList.forEach(function(row) {
        if (row.coffee !== 'No Coffee Selected') {
            coffeeCount[row.coffee]=(coffeeCount[row.coffee] || 0) + 1;
        }
        if (row.milk !== 'Regular Milk') {
            milkCount[row.milk]=(milkCount[row.milk] || 0) + 1;
        }
        if (row.syrup !== 'No Syrup') {
            syrupCount[row.syrup]=(syrupCount[row.syrup] || 0) + 1;
        }
        if (row.extra !== 'No Extra') {
            extraCount[row.extra]=(extraCount[row.extra] || 0) + 1;
        }
    });

    let csvContent = "data:text/csv;charset=utf-8,Coffee - Count\n";
    for (const coffee in coffeeCount) {
        csvContent += `${coffee}=${coffeeCount[coffee]}\n`;
    }

    csvContent += "\nMilk - Count\n";
    for (const milk in milkCount) {
        csvContent += `${milk}=${milkCount[milk]}\n`;
    }

    csvContent += "\nSyrup - Count\n";
    for (const syrup in syrupCount) {
        csvContent += `${syrup}=${syrupCount[syrup]}\n`;
    }

    csvContent += "\nExtra - Count\n";
    for (const extra in extraCount) {
        csvContent += `${extra}=${extraCount[extra]}\n`
    }

    // Generate the current date in format DD/MM/YYYY
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    // Create the filename with the formatted date
    const filename = `${formattedDate} Coffee Log.csv`;

    // Encode CSV content and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename); // Use the generated filename
    document.body.appendChild(link);
    link.click();
}


// Confirm and reset the day
function confirmResetDay() {
    const confirmation = confirm("Are you sure you want to reset the day? This will clear all records.");
    if (confirmation) {
        resetDay();
    }
}

// Reset the day's data
function resetDay() {
    coffeeList = [];
    updateCoffeeList();
    saveCoffeeList(); // Save the reset state
}

function checkCoffeeTime() {
    const currentTime = new Date();
    const minutes = currentTime.getMinutes();
    const hours = currentTime.getHours();

    // Check if the minutes equal 7
    if (minutes === 7) {
        const coffeeElement = document.querySelector('.coffeetime');
        
        // Set the visibility to visible
        coffeeElement.style.visibility = 'visible';

        // Hide it after 3 seconds
        setTimeout(() => {
            coffeeElement.style.visibility = 'hidden';
        }, 2000); // 3000 milliseconds = 3 seconds
    }
}

// Call the function every minute to check for coffee time
setInterval(checkCoffeeTime, 60000); // 60000 milliseconds = 1 minute