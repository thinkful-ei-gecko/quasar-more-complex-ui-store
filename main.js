/* global strftime, cuid */
'use strict';

const STORE = {
  items: [
    {id: cuid(), name: "apples", checked: false},
    {id: cuid(), name: "oranges", checked: false},
    {id: cuid(), name: "milk", checked: true},
    {id: cuid(), name: "bread", checked: false}
  ],
  hideCompleted: false,

};


function generateItemElement(item) {
  return `
        <li data-item-id="${item.id}">
        <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
        <div class="shopping-item-controls">
            <button class="shopping-item-toggle js-item-toggle">
                <span class="button-label">check</span>
            </button>
            <button class="shopping-item-delete js-item-delete">
                <span class="button-label">delete</span>
            </button>
        </div>
        </li>`;
}

/**
 * 
 * @param {*} shoppinglist array of objects 
 * @returns {string} html string of list items
 */
function generateShoppingItemsString(shoppinglist) {
  console.log('generateShoppingItemsString');

  const items = shoppinglist.map((item) => generateItemElement(item));

  return items.join('');
}

// render to DOM
function renderShoppingList() {
  // copy all items into filteredItems
  let filteredItems = STORE.items;

  // filter un-checked
  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter(item => !item.checked);
  }

  let shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert html to DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}


function handleNewItemSubmit() {
  // this function will be responsible for when users add a new shopping list item
  $('#js-shopping-list-form').submit(function(e) {
    e.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
  console.log("Toggling checked property for item with id " + itemId);
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}

function getItemIdFromElement(item) {
  return $(item).closest('li').data('item-id');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}

function deleteListItem(id) {
  const itemToDelete = STORE.items.findIndex(item=> item.id === id);
  STORE.items.splice(itemToDelete,1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', `.js-item-delete`, event => {
    //get index of the item
    const id = getItemIdFromElement(event.currentTarget);

    deleteListItem(id);
    renderShoppingList();
  });
}

// Toggles the STORE.hideCompleted property
function toggleHideFilter() {
  STORE.hideCompleted = !STORE.hideCompleted;
}

// Places an event listener on the checkbox for hiding completed items
function handleToggleHideFilter() {
  $('.js-hide-completed-toggle').on('click', () => {
    toggleHideFilter();
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
}

$(handleShoppingList);