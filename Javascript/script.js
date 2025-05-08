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

  
  