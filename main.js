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
  searchItem: false,
  editableItemID: '',

};


function generateItemElement(item) {
  let itemLine = '';
  let disabledStatus = '';
  console.log('generateItemElement');
  if (item.id === STORE.editableItemID) {
    itemLine = `
    <input type="text" name="edit-name-entry" class="js-edit-form"">
    `;
    disabledStatus = 'disabled';
  } else {
    itemLine = `
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">`;
  }

  return `
        <li data-item-id="${item.id}">
        ${itemLine}
        <div class="shopping-item-controls">
            <button class="shopping-item-toggle js-item-toggle" ${disabledStatus}>
                <span class="button-label">check</span>
            </button>
            <button class="shopping-item-delete js-item-delete" ${disabledStatus}>
                <span class="button-label">delete</span>
            </button>
            <button class="shopping-item-edit js-item-edit" ${disabledStatus}>
                <span class="button-label">edit</span>
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

  // filter items.name includes() search filter
  if(STORE.searchItem) {
    filteredItems = filteredItems.filter(item => item.name.includes(STORE.searchItem));
  }

  let shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert html to DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

// create new object and push into STORE.items
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

// delete list item
function deleteListItem(id) {
  const itemToDelete = STORE.items.findIndex(item => item.id === id);
  console.log(itemToDelete);
  STORE.items.splice(itemToDelete,1);
}

// delete item click event
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

// search for item on submit event
// function handleSearchSubmit() {
//   $('#js-search-form').submit(function(e) {
//     e.preventDefault();
//     STORE.searchItem = $('.js-search-filter-entry').val();
    
//     renderShoppingList();
//   });
// }

// search on input event
function handleSearchSubmit() {
  $('.js-search-filter-entry').on('input', function(e) {
    $('#js-search-form').submit(false);
    STORE.searchItem = $('.js-search-filter-entry').val();
    renderShoppingList();
  });
}

// change name
function editItem(id, newName) {
  const itemToChange = STORE.items.findIndex(item => item.id === id);
  console.log(itemToChange);
  STORE.items[itemToChange].name = newName;
}

// handle click on button to edit name
function handleEditItemButton() {
  $('.js-shopping-list').on('click', '.js-item-edit', e => {
    const id = getItemIdFromElement(e.currentTarget);

    // prompt user for new item
    var newItem = prompt('enter new item');
    editItem(id, newItem);
    renderShoppingList();
  });
}

function handleEditItemForm() {
  $('.js-shopping-list').on('change', '.js-edit-form', e => {
    const id = getItemIdFromElement(e.currentTarget);
    const newItem = $('.js-edit-form').val();
    editItem(id, newItem);
    STORE.editableItemID = undefined;
    renderShoppingList();
  });
}

// handle click on name to edit name
function handleEditItem() {
  $('.js-shopping-list').on('click', '.js-shopping-item', e=> {
    console.log('shopping item clicked');
    const id = getItemIdFromElement(e.currentTarget);

    // set editableItemID to id of item clicked on
    STORE.editableItemID = id;
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
  handleSearchSubmit();
  handleEditItemButton();
  handleEditItem();
  handleEditItemForm();
}

$(handleShoppingList);