class Item {
    constructor(itemNo, item, cost, quantity, itemTotal) {
        this.itemNo = itemNo;
        this.item = item;
        this.cost = cost;
        this.quantity = quantity;
        this.itemTotal = itemTotal;
    }
}

class UI {
    addItemToList(item) {
        const list = document.getElementById('item-list');

        // create tr element
        const row = document.createElement('tr');
        // insert cols
        row.innerHTML = `
      <td>${item.itemNo}</td>
      <td>${item.item}</td>
      <td>$${item.cost / 100}</td>
      <td>${item.quantity}</td>
      <td>$${Math.floor(item.itemTotal) / 100}</td>
      <td><a href="#" class="delete">X</a></td>
    `;

        list.appendChild(row);
    }

    displayTotal(total) {
        const totalUI = document.getElementById('total');
        totalUI.innerHTML = `$${total / 100}`;
    }

    showAlert(message, className) {
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

    deleteItem(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('item').value = '';
        document.getElementById('cost').value = '';
        document.getElementById('quantity').value = '';
    }
}

// local storage class
class Store {
    static getItems() {
        let items;
        if (localStorage.getItem('items') === null) {
            items = [];
        } else {
            items = JSON.parse(localStorage.getItem('items'));
        }

        return items;
    }

    static displayItems() {
        const items = Store.getItems();
        const ui = new UI;
        items.forEach(function (item) {
            // Add book to UI
            ui.addItemToList(item);
        });
        const total = Store.getTotal();
        ui.displayTotal(total);

    }

    static addItem(item) {
        const items = Store.getItems();

        items.push(item);

        localStorage.setItem('items', JSON.stringify(items));
    }

    static removeItem(itemNo) {
        const items = Store.getItems();
        items.forEach(function (item, index) {
            if (item.itemNo === Number.parseInt(itemNo)) {
                items.splice(index, 1);
            }
        });

        localStorage.setItem('items', JSON.stringify(items));
    }

    static getTotal() {
        const items = Store.getItems();
        if (items.length > 0) {
            return items.map(item => item.itemTotal).reduce((total, value) => total + value);
        } else {
            return 0;
        }
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayItems());


// Event Listener for add book
document.getElementById('add-form').addEventListener('submit', function (e) {
    const item = document.getElementById('item').value,
        cost = document.getElementById('cost').value * 100,
        quantity = document.getElementById('quantity').value;

    let itemNo;
    const items = Store.getItems();
    if (items.length > 0) {
        itemNo = items[items.length - 1].itemNo + 1;
    } else {
        itemNo = 1;
    }
    const itemTotal = cost * quantity;

    const itemToAdd = new Item(itemNo, item, cost, quantity, itemTotal);
    const ui = new UI();

    //validate
    if (item === '' || cost === '' || quantity === '') {
        // Error alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        if (isInt(Number(cost)) || isFloat(Number(cost))) {
            // add book to list
            ui.addItemToList(itemToAdd);

            // Store book to local storage
            Store.addItem(itemToAdd);

            // get total
            const total = Store.getTotal();
            ui.displayTotal(total);

            // show success
            ui.showAlert('Item Added!', 'success');

            // clear fields
            ui.clearFields();
        } else {
            ui.showAlert('Cost per item must be a number', 'error');
        }

    }

    e.preventDefault();
});

// Event Listener for delete
document.getElementById('item-list').addEventListener('click', function (e) {
    const ui = new UI();

    //delete book
    ui.deleteItem(e.target);

    // get total
    const total = Store.getTotal();
    ui.displayTotal(total);

    // show message
    ui.showAlert('Item Removed!', 'success');

    e.preventDefault();
});

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}