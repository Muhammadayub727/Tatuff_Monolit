document.addEventListener("DOMContentLoaded", function () {
  // ==== DROPDOWN FUNCTIONALITY ====
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const arrow = document.getElementById("arrow");

  dropdownToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle("show-menu");
    arrow.classList.toggle("rotate");
  });

  document.addEventListener("click", function (e) {
    if (!dropdownToggle.contains(e.target)) {
      dropdownMenu.classList.remove("show-menu");
      arrow.classList.remove("rotate");
    }
  });

  // ==== NAVIGATION ACTIVE CLASS ====
  const navItems = document.querySelectorAll("[data-nav]");
  navItems.forEach(item => {
    item.addEventListener("click", function () {
      navItems.forEach(el => el.classList.remove("active-nav"));
      this.classList.add("active-nav");
    });
  });

  // ==== CARD CLICK FUNCTIONALITY ====
  const cards = document.querySelectorAll(".content_cards");
  const breadcrumbBox = document.getElementById("breadcrumbBox");
  const breadcrumbSub = document.getElementById("breadcrumbSub");
  const breadcrumbMain = document.getElementById("breadcrumbMain");
  const teachersYears = document.getElementById("teachersYears");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Barcha cardlarni yashirish
      cards.forEach(c => c.style.display = "none");

      // Breadcrumb va boshqa blocklarni ko‘rsatish
      breadcrumbBox.style.display = "flex";
      teachersYears.style.display = "block";

      // Breadcrumb matnlarini yangilash
      const title = card.querySelector(".content_title").innerText;
      breadcrumbMain.innerText = title;
      breadcrumbSub.innerText = `/ ${title}`;
    });
  });
});

 const data = [
  "2024-2025 o‘quv yili",
  "2023-2024 o‘quv yili",
  "2022-2023 o‘quv yili",
  "2021-2022 o‘quv yili"
];

const cardList = document.getElementById('cardList');
const searchInput = document.getElementById('search');

const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const closeBtn = document.querySelector('.close-btn');

let currentEditingSpan = null; // global saqlanadi

function createCard(text) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <div class="card-left">
      <img src="./images/Bookmark.png" alt="icon" />
      <span class="card-text">${text}</span>
    </div>
    <div class="card-right">
      <label class="switch">
        <input type="checkbox" checked>
        <span class="slider"></span>
      </label>
      <span class="icon-btn edit" title="Edit">&#9998;</span>
      <span class="icon-btn delete" title="Delete">&#128465;</span>
    </div>
  `;

  const deleteBtn = card.querySelector('.delete');
  const editBtn = card.querySelector('.edit');
  const textSpan = card.querySelector('.card-text');

  deleteBtn.addEventListener('click', () => card.remove());

  editBtn.addEventListener('click', () => {
    currentEditingSpan = textSpan;
    editInput.value = textSpan.textContent;
    editModal.style.display = 'flex';
  });

  return card;
}

saveEditBtn.addEventListener('click', () => {
  if (currentEditingSpan) {
    currentEditingSpan.textContent = editInput.value;
    editModal.style.display = 'none';
  }
});

closeBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    editModal.style.display = 'none';
  }
});

function loadCards(filter = "") {
  cardList.innerHTML = '';
  data.forEach(item => {
    if (item.toLowerCase().includes(filter.toLowerCase())) {
      cardList.appendChild(createCard(item));
    }
  });
}

searchInput.addEventListener('input', () => {
  loadCards(searchInput.value);
});

loadCards();


document.addEventListener('DOMContentLoaded', function() {
  const addCardButton = document.getElementById('addCardButton');
  const addCardModal = document.getElementById('addCardModal');
  const closeButton = document.querySelector('.close-button');
  const saveCardButton = document.getElementById('saveCard');
  const cardList = document.getElementById('cardList');
  const newContentInput = document.getElementById('newContent');

  // Function to open the modal
  addCardButton.addEventListener('click', function() {
      addCardModal.style.display = 'block';
  });

  // Function to close the modal when the close button is clicked
  closeButton.addEventListener('click', function() {
      addCardModal.style.display = 'none';
  });

  // Function to close the modal if the user clicks outside of it
  window.addEventListener('click', function(event) {
      if (event.target == addCardModal) {
          addCardModal.style.display = 'none';
      }
  });

  // Function to create a new card element with actions
  function createNewCard(text) {
      const newCard = document.createElement('div');
      newCard.classList.add('card');

      const textSpan = document.createElement('span');
      textSpan.classList.add('card-text');
      textSpan.textContent = text;

      const actionsDiv = document.createElement('div');
      actionsDiv.classList.add('card-actions');

      const toggleIcon = document.createElement('img');
      toggleIcon.src = 'path/to/toggle-icon.png'; // Replace with your image path
      toggleIcon.alt = 'Toggle';
      toggleIcon.addEventListener('click', function() {
          alert('Toggle functionality for: ' + text); // Implement your toggle logic
      });

      const editIcon = document.createElement('img');
      editIcon.src = 'path/to/edit-icon.png'; // Replace with your image path
      editIcon.alt = 'Edit';
      editIcon.addEventListener('click', function() {
          const currentText = textSpan.textContent;
          const newText = prompt('Edit card text:', currentText);
          if (newText !== null) {
              textSpan.textContent = newText;
          }
      });

      const deleteIcon = document.createElement('img');
      deleteIcon.src = 'path/to/delete-icon.png'; // Replace with your image path
      deleteIcon.alt = 'Delete';
      deleteIcon.addEventListener('click', function() {
          newCard.remove(); // Remove the card
      });

      actionsDiv.appendChild(toggleIcon);
      actionsDiv.appendChild(editIcon);
      actionsDiv.appendChild(deleteIcon);

      newCard.appendChild(textSpan);
      newCard.appendChild(actionsDiv);

      return newCard;
  }

  // Function to handle saving the new card from the modal
  saveCardButton.addEventListener('click', function() {
      const newText = newContentInput.value.trim();
      if (newText !== '') {
          const newCard = createNewCard(newText); // Create the card with icons
          cardList.appendChild(newCard);
          newContentInput.value = ''; // Clear the input
          addCardModal.style.display = 'none'; // Close the modal
      } else {
          alert('Please enter some text for the new item.');
      }
  });
});