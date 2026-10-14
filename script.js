
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const eventSearch = document.getElementById("eventSearch");
  const navSearch = document.getElementById("navSearch");
  const locationFilter = document.getElementById("locationFilter");
  const dateFilter = document.getElementById("dateFilter");
  const eventsGrid = document.getElementById("eventsGrid");
  const emptyState = document.getElementById("emptyState");
  const filterStatus = document.getElementById("filterStatus");
  const categoryCards = document.querySelectorAll(".category-card");
  const cityChips = document.querySelectorAll(".city-chip");
  const eventCards = [...document.querySelectorAll(".event-card")];

  let selectedCategory = "all";
  let selectedCity = "All Cities";
  let searchTerm = "";

  // Mobile navigation
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Event filtering
  function filterEvents() {
    let visibleCount = 0;

    eventCards.forEach((card) => {
      const category = card.dataset.category || "";
      const city = card.dataset.city || "";
      const searchableText = (
        card.dataset.search + " " + card.textContent
      ).toLowerCase();

      const matchesCategory =
        selectedCategory === "all" ||
        category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesCity =
        selectedCity === "All Cities" ||
        city.toLowerCase() === selectedCity.toLowerCase();

      const matchesSearch =
        !searchTerm || searchableText.includes(searchTerm.toLowerCase());

      const matchesLocation =
        locationFilter.value === "all" ||
        city.toLowerCase() === locationFilter.value.toLowerCase();

      // The sample cards use fixed dates. This option is a demo filter
      // until actual event dates are connected to a backend.
      const matchesDate =
        dateFilter.value === "any" || dateFilter.value === "upcoming";

      const visible =
        matchesCategory &&
        matchesCity &&
        matchesSearch &&
        matchesLocation &&
        matchesDate;

      card.classList.toggle("hidden", !visible);
      if (visible) visibleCount++;
    });

    emptyState.classList.toggle("hidden", visibleCount > 0);
    eventsGrid.classList.toggle("hidden", visibleCount === 0);

    const filters = [];
    if (selectedCategory !== "all") filters.push(selectedCategory);
    if (selectedCity !== "All Cities") filters.push(selectedCity);
    if (locationFilter.value !== "all") filters.push(locationFilter.value);
    if (searchTerm) filters.push(`"${searchTerm}"`);

    filterStatus.textContent = filters.length
      ? `${visibleCount} event${visibleCount === 1 ? "" : "s"} found for ${filters.join(" · ")}`
      : "";
  }

  function performSearch(value) {
    searchTerm = value.trim();
    eventSearch.value = value;
    navSearch.value = value;
    filterEvents();

    document.getElementById("events").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  document.getElementById("heroSearchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    performSearch(eventSearch.value);
  });

  document.getElementById("navSearchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    performSearch(navSearch.value);
  });

  // Keep the two search fields in sync as the user types.
  eventSearch.addEventListener("input", () => {
    navSearch.value = eventSearch.value;
    searchTerm = eventSearch.value.trim();
    filterEvents();
  });

  navSearch.addEventListener("input", () => {
    eventSearch.value = navSearch.value;
    searchTerm = navSearch.value.trim();
    filterEvents();
  });

  locationFilter.addEventListener("change", () => {
    // Keep the city selector consistent with the location selector.
    selectedCity =
      locationFilter.value === "all"
        ? "All Cities"
        : locationFilter.value;

    cityChips.forEach((chip) => {
      chip.classList.toggle("selected", chip.dataset.city === selectedCity);
    });

    filterEvents();
  });

  dateFilter.addEventListener("change", filterEvents);

  // Category selection
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.dataset.category;

      selectedCategory =
        selectedCategory === category ? "all" : category;

      categoryCards.forEach((item) => {
        item.classList.toggle(
          "selected",
          item.dataset.category === selectedCategory
        );
        item.setAttribute(
          "aria-pressed",
          String(item.dataset.category === selectedCategory)
        );
      });

      filterEvents();
      document.getElementById("events").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  // City chips
  cityChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      selectedCity = chip.dataset.city;

      cityChips.forEach((item) => {
        item.classList.toggle("selected", item === chip);
      });

      locationFilter.value =
        selectedCity === "All Cities" ? "all" : selectedCity;

      filterEvents();
    });
  });

  // Trending searches
  document.querySelectorAll("[data-search]").forEach((button) => {
    button.addEventListener("click", () => {
      performSearch(button.dataset.search);
    });
  });

  // Footer city links
  document.querySelectorAll("[data-footer-city]").forEach((link) => {
    link.addEventListener("click", () => {
      const city = link.dataset.footerCity;
      selectedCity = city;
      locationFilter.value =
        ["Lagos", "Abuja", "Port Harcourt"].includes(city)
          ? city
          : "all";

      cityChips.forEach((chip) => {
        chip.classList.toggle(
          "selected",
          chip.dataset.city === selectedCity
        );
      });

      filterEvents();
    });
  });

  // Favorite buttons: state is maintained while the page remains open.
  document.querySelectorAll(".favorite-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const isSaved = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!isSaved));
      button.textContent = isSaved ? "♡" : "♥";
      button.setAttribute(
        "aria-label",
        isSaved ? "Save this event" : "Remove event from favorites"
      );
    });
  });

  // Reset filters
  document.getElementById("resetFilters").addEventListener("click", () => {
    selectedCategory = "all";
    selectedCity = "All Cities";
    searchTerm = "";

    eventSearch.value = "";
    navSearch.value = "";
    locationFilter.value = "all";
    dateFilter.value = "any";

    categoryCards.forEach((card) => {
      card.classList.remove("selected");
      card.setAttribute("aria-pressed", "false");
    });

    cityChips.forEach((chip) => {
      chip.classList.toggle(
        "selected",
        chip.dataset.city === "All Cities"
      );
    });

    filterEvents();
  });

  // Modal for destinations that need a backend or real page.
  const noticeDialog = document.getElementById("noticeDialog");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogMessage = document.getElementById("dialogMessage");

  function showNotice(title, message) {
    dialogTitle.textContent = title;
    dialogMessage.textContent = message;

    if (typeof noticeDialog.showModal === "function") {
      noticeDialog.showModal();
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  }

  document.getElementById("closeDialog").addEventListener("click", () => {
    noticeDialog.close();
  });

  document.getElementById("dialogOk").addEventListener("click", () => {
    noticeDialog.close();
  });

  noticeDialog.addEventListener("click", (event) => {
    if (event.target === noticeDialog) noticeDialog.close();
  });

  // All actions below are demo placeholders until real destinations
  // or backend endpoints are configured.
  const actionMessages = {
    signin: [
      "Sign in to Eventra",
      "Connect this button to your real attendee sign-in page or authentication service."
    ],
    "get-started": [
      "Get started with Eventra",
      "Connect this button to your account registration page."
    ],
    "create-event": [
      "Create an event",
      "Connect this action to your organizer registration or create-event page."
    ],
    "organizer-portal": [
      "Eventra Organizer Portal",
      "Connect this action to your deployed organizer dashboard."
    ],
    "ticket-scanner": [
      "Ticket Scanner",
      "Connect this action to your ticket-scanning application."
    ],
    payouts: [
      "Payouts & Analytics",
      "Connect this action to your organizer payouts and analytics page."
    ],
    partner: [
      "Partner Program",
      "Connect this action to your partnership application."
    ],
    "app-store": [
      "Eventra for iOS",
      "Add the official Apple App Store URL when your app is published."
    ],
    "google-play": [
      "Eventra for Android",
      "Add the official Google Play URL when your app is published."
    ],
    privacy: [
      "Privacy Policy",
      "Connect this action to your published privacy policy."
    ],
    terms: [
      "Terms of Service",
      "Connect this action to your published terms of service."
    ],
    cookies: [
      "Cookie Settings",
      "Connect this action to your cookie preferences interface."
    ],
    security: [
      "Security",
      "Connect this action to your security information page."
    ]
  };

  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();

      const action = element.dataset.action;
      const message = actionMessages[action];

      if (message) {
        showNotice(message[0], message[1]);
      }
    });
  });

  // Ticket buttons: no payment is initiated by this demo.
  document.querySelectorAll(".btn-ticket").forEach((button) => {
    button.addEventListener("click", () => {
      const eventName = button.dataset.event;

      showNotice(
        `Get tickets: ${eventName}`,
        "Ticket checkout is not connected yet. Connect this button to your event details and payment flow before accepting real purchases."
      );
    });
  });

  document.querySelectorAll("[data-event-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      showNotice(
        "Secure your event pass",
        "Connect this link to the real ticket details and checkout page before taking payments."
      );
    });
  });

  // Newsletter: validate the address, but don't pretend to subscribe it
  // without an email service or backend endpoint.
  document.getElementById("newsletterForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("newsletterEmail");
    const message = document.getElementById("newsletterMessage");
    const email = emailInput.value.trim();

    message.className = "form-message";

    if (!emailInput.checkValidity() || !email) {
      message.textContent = "Please enter a valid email address.";
      message.classList.add("error");
      emailInput.focus();
      return;
    }

    message.textContent =
      "Your email is valid. Connect a newsletter service to complete your subscription.";
    message.classList.add("success");
  });

  // The reference shows 18 categories, but the supplied assets and
  // category data define only these six. Avoid inventing extra categories.
  document.getElementById("viewAllCategories").addEventListener("click", () => {
    showNotice(
      "Explore event categories",
      "Six categories are currently displayed. Add the remaining categories and event counts when their data is available."
    );
  });

  // Keyboard shortcut: Ctrl+K / Cmd+K focuses the desktop search.
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      navSearch.focus();
    }

    if (event.key === "Escape" && mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Initial render
  filterEvents();


  // Navigation active state: move the purple pill to the selected section.
  const navLinks = [...document.querySelectorAll(".main-nav .nav-link")];
  const sectionByLink = new Map();

  navLinks.forEach((link) => {
    const targetId = (link.getAttribute("href") || "").replace(/^#/, "");
    const target = targetId ? document.getElementById(targetId) : null;
    if (target) sectionByLink.set(link, target);

    link.addEventListener("click", () => {
      navLinks.forEach((item) => {
        item.classList.toggle("active", item === link);
        if (item === link) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });
      if (mainNav) mainNav.classList.remove("open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  if ("IntersectionObserver" in window && sectionByLink.size) {
    const navObserver = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visibleEntries.length) return;

      const currentId = visibleEntries[0].target.id;
      const currentLink = navLinks.find(
        (link) => link.getAttribute("href") === `#${currentId}`
      );
      if (currentLink) {
        navLinks.forEach((item) => {
          item.classList.toggle("active", item === currentLink);
          if (item === currentLink) item.setAttribute("aria-current", "page");
          else item.removeAttribute("aria-current");
        });
      }
    }, { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.1, 0.25, 0.5] });

    sectionByLink.forEach((section) => navObserver.observe(section));
  }

});
