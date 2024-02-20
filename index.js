import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-vk-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const input = document.getElementById("user-input");
const addBtn = document.getElementById("addCart");
const listOfItems = document.getElementById("items-list");

addBtn.addEventListener("click", () => {
  let inputValue = input.value;
  push(shoppingListInDB, inputValue);
  clearInputElement();
});

onValue(shoppingListInDB, function (snapshot) {
  let itemsExist = snapshot.exists();
  
  if (itemsExist) {
    let itemsArray = Object.entries(snapshot.val());
    clearListSection();
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      appendItemsToList(currentItem);
    }
  } else {
    listOfItems.innerHTML = 'No items exists here!!...'
  }
});

function clearListSection() {
  listOfItems.innerHTML = " ";
}

function clearInputElement() {
  input.value = " ";
}

function appendItemsToList(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let itemEl = document.createElement("li");
  itemEl.id = "items";
  itemEl.textContent = itemValue;

  //remove item from the list
  itemEl.addEventListener("click", () => {
    let exectLocationOfItemInDatabase = ref(database, `shoppingList/${itemID}`);
    remove(exectLocationOfItemInDatabase);
  });

  listOfItems.append(itemEl);
}
