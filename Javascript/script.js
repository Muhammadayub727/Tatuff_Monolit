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
  const cardList = document.getElementById("cardList");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Barcha cardlarni yashirish
      cards.forEach(c => c.style.display = "none");

      // Breadcrumb va boshqa blocklarni ko‘rsatish
      breadcrumbBox.style.display = "flex";
      cardList.style.display = "block";

      // Breadcrumb matnlarini yangilash
      const title = card.querySelector(".content_title").innerText;
      breadcrumbMain.innerText = title;
      breadcrumbSub.innerText = `/ ${title}`;
    });
  });
});

  
  


const cardList = document.getElementById('cardList');
    const searchInput = document.getElementById('search');

    const data = [
      "2024-2025 o‘quv yili",
      "2024-2025 o‘quv yili",
      "2024-2025 o‘quv yili",
      "2024-2025 o‘quv yili"
    ];

    function createCard(text) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-left">
          <img src="./images/Bookmark.png" alt="icon">
          <span>${text}</span>
        </div>
        <div class="card-right">
          <label class="switch">
            <input type="checkbox" checked>
            <span class="slider"></span>
          </label>
          <span class="icon-btn edit">&#9998;</span>
          <span class="icon-btn delete">&#128465;</span>
        </div>
      `;
      return card;
    }

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