// To do:
// - add an item
// - form validation
// - clear form after adding
// - show total
// - delete an item
// - show alerts
// - save items to localstorage

// global array for items
let items = []

// get the form element from the DOM
addForm = document.getElementById('add-form')

// initialize data on load
window.onload = () => {
    // get items from localstorage
    items = JSON.parse(localStorage.getItem('items'))
    if (items == null)
        items = []

    // add items in the UI
    for (let i = 0; i < items.length; i++) {
        const list = document.getElementById('item-list');

        // create tr element
        const row = document.createElement('tr');
        // insert cols
        row.innerHTML = `
        <td>${items[i].itemNumber}</td>
        <td>${items[i].itemName}</td>
        <td>SRD ${items[i].cost}</td>
        <td>${items[i].quantity}</td>
        <td>SRD ${items[i].total}</td>
        <td><button onclick="deleteItem(${items[i].itemNumber}, this)" id="delete" class="delete">X</button></td>
        `;

        // add item to row
        list.appendChild(row);
    }

    displayTotal()
}

// add submit eventlistener to the form
addForm.addEventListener("submit", (e) => {
    // prevent the page from reloading
    e.preventDefault();

    // get input data
    let itemName = document.getElementById('item').value
    let cost = document.getElementById('cost').value
    let quantity = document.getElementById('quantity').value
    let total = cost * quantity

    // validation
    if (itemName == '' || cost == '' || quantity == '') {
        // show error
        showAlert('Please fill in all the inputs', 'error')

        return
    }

    // generate an item number
    itemNumber = 0
    if (items.length > 0) {
        itemNumber = items[items.length - 1].itemNumber + 1;
    } else {
        itemNumber = 1;
    }

    let item = {
        itemNumber: itemNumber,
        itemName: itemName,
        cost: cost,
        quantity,
        total,
    }

    addItemToList(item)
});

function addItemToList(item) {
    const list = document.getElementById('item-list');

    // create tr element
    const row = document.createElement('tr');
    // insert cols
    row.innerHTML = `
    <td>${item.itemNumber}</td>
    <td>${item.itemName}</td>
    <td>SRD ${item.cost}</td>
    <td>${item.quantity}</td>
    <td>SRD ${item.total}</td>
    <td><button onclick="deleteItem(${item.itemNumber}, this)" id="delete" class="delete">X</button></td>
    `;

    // add item to row
    list.appendChild(row);

    // add item in array for statemanagement
    items.push(item)

    // save to localstorage
    localStorage.setItem('items', JSON.stringify(items))

    // clear the form
    addForm.reset();

    // update total value
    displayTotal()

    // show alert
    showAlert('Item added successfully', 'success')
}

function deleteItem(itemNumber, element) {
    // remove from page
    element.parentElement.parentElement.remove()

    // remove from array
    items = items.filter(item => item.itemNumber !== itemNumber);

    // update localstorage
    localStorage.setItem('items', JSON.stringify(items))

    // update total value
    displayTotal()

    // show alert
    showAlert('Item deleted successfully', 'success')
}

function displayTotal() {
    // calculate total
    let total = 0
    items.forEach((item) => { total += item.total })

    // display value in UI
    const totalUI = document.getElementById('total');
    totalUI.innerHTML = `SRD ${total}`;
}

function showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    // add classes
    div.className = `alert ${className}`;
    // add text
    div.appendChild(document.createTextNode(message));
    // get parent
    const container = document.querySelector('.container');
    // get form
    const form = document.querySelector('#add-form');
    // insert alert
    container.insertBefore(div, form);

    // timeout
    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 3000);
}