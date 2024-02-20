// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration settings
const appSettings = {
  databaseURL:
    "https://playground-vk-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase app
const app = initializeApp(appSettings);
const database = getDatabase(app);

// Reference to the "shoppingList" location in the database
const shoppingListInDB = ref(database, "shoppingList");

// DOM elements
const input = document.getElementById("user-input");
const addBtn = document.getElementById("addCart");
const listOfItems = document.getElementById("items-list");

// Event listener for the "Add to Cart" button
addBtn.addEventListener("click", () => {
  if (input.value !== "") {
    // Get user input value
    let inputValue = input.value;
    // Push the input value to the "shoppingList" in the database
    push(shoppingListInDB, inputValue);
    // Clear the input element
    clearInputElement();
  }else{
    input.placeholder =  "Please enter an item."
  }
});

// Firebase event listener for changes in the "shoppingList" data
onValue(shoppingListInDB, function (snapshot) {
  // Check if items exist in the snapshot
  let itemsExist = snapshot.exists();

  if (itemsExist) {
    // Convert the snapshot values to an array of key-value pairs
    let itemsArray = Object.entries(snapshot.val());
    // Clear the list section in the UI
    clearListSection();
    // Iterate through the items and append them to the list in the UI
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      appendItemsToList(currentItem);
    }
  } else {
    // Display a message if no items exist
    listOfItems.innerHTML = "No items exist here!!...";
  }
});

// Function to clear the list section in the UI
function clearListSection() {
  listOfItems.innerHTML = " "
}

// Function to clear the input element in the UI
function clearInputElement() {
  input.value = " "
}

// Function to append items to the list in the UI
function appendItemsToList(item) {
  let itemID = item[0];
  let itemValue = item[1];
  // Create a new list item element
  let itemEl = document.createElement("li");
  itemEl.id = "items";
  itemEl.textContent = itemValue;

  // Add a click event listener to remove the item from the list and database
  itemEl.addEventListener("click", () => {
    let exactLocationOfItemInDatabase = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDatabase);
  });

  // Append the list item to the UI
  listOfItems.append(itemEl);
}