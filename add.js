// ===== Shared Logic for Both Pages =====

// Save Contact (First Page)
if (document.getElementById("saveContactBtn")) {
  const saveButton = document.getElementById("saveContactBtn");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const phoneInput = document.getElementById("phoneNumber");
  const emailInput = document.getElementById("email");
  const citySelect = document.getElementById("city");
  const genderSelect = document.getElementById("gender");
  const profileImgPreview = document.getElementById("profileImgPreview");
  const profileImgContainer = document.getElementById("profileImgContainer");
  const imageInput = document.getElementById("imageInput");

  // Error message containers
  const phoneError = document.createElement("div");
  phoneError.className = "text-danger small";
  phoneInput.parentNode.insertBefore(phoneError, phoneInput.nextSibling);

  const emailError = document.createElement("div");
  emailError.className = "text-danger small";
  emailInput.parentNode.insertBefore(emailError, emailInput.nextSibling);

  // Regex for validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^(05|06|07)\d{8}$/; // Starts with 05, 06, or 07, and is followed by 8 digits

  profileImgContainer.addEventListener("click", () => {
      imageInput.click();
  });

  imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              profileImgPreview.src = e.target.result;
          };
          reader.readAsDataURL(file);
      }
  });

  saveButton.addEventListener("click", function (event) {
      event.preventDefault();

      // Clear previous errors
      phoneError.textContent = "";
      emailError.textContent = "";

      const contact = {
          id: Date.now(),
          name: `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`,
          phone: phoneInput.value.trim(),
          email: emailInput.value.trim(),
          city: citySelect.value,
          gender: genderSelect.value,
          img: profileImgPreview.src,
      };

      // Validate form fields
      if (!contact.name || !contact.phone || !contact.email || !contact.city || !contact.gender) {
          alert("Please fill out all fields!");
          return;
      }

      let hasError = false;

      // Validate phone number
      if (!phoneRegex.test(contact.phone)) {
          phoneError.textContent = "Phone number must start with 05, 06, or 07 and be followed by 8 digits.";
          hasError = true;
      }

      // Validate email format
      if (!emailRegex.test(contact.email)) {
          emailError.textContent = "Please enter a valid email address.";
          hasError = true;
      }

      if (hasError) {
          return; // Stop submission if there are errors
      }

      const savedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
      savedContacts.push(contact);
      localStorage.setItem("contacts", JSON.stringify(savedContacts));

      alert("Contact saved!");
      document.querySelector("form").reset();
      profileImgPreview.src = "https://cdn-icons-png.flaticon.com/512/747/747376.png";
  });
}

// Render Contacts (Second Page)
if (document.getElementById("contactList")) {
  function renderContacts() {
      const contactListDiv = document.getElementById("contactList");
      contactListDiv.innerHTML = ""; // Clear previous list

      const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

      if (contacts.length === 0) {
          contactListDiv.innerHTML = '<p class="text-muted">No contacts available. Please add a contact.</p>';
          return;
      }

      contacts.forEach((contact) => {
          const contactDiv = document.createElement("div");
          contactDiv.classList.add("d-flex", "align-items-center", "mb-3");
          contactDiv.innerHTML = `
              <img src="${contact.img}" alt="${contact.name}" class="rounded-circle" width="50">
              <span class="ms-3">${contact.name}</span>
          `;
          contactDiv.style.cursor = "pointer";
          contactDiv.onclick = () => showDetails(contact); // Show contact info when clicked
          contactListDiv.appendChild(contactDiv);
      });
  }

  function showDetails(contact) {
      document.getElementById("profileImage").src = contact.img || "https://cdn-icons-png.flaticon.com/512/747/747376.png";
      document.getElementById("profileName").textContent = contact.name || "No Name";
      document.getElementById("contactPhone").textContent = `📞 ${contact.phone || "No Phone"}`;
      document.getElementById("contactEmail").textContent = `📧 ${contact.email || "No Email"}`;
      document.getElementById("contactGender").textContent = `♂️ | ♀️ ${contact.gender || "No Gender"}`;
      document.getElementById("contactville").textContent = `🏛️ ${contact.city || "No City"}`;
  }

  // Render contacts on page load
  window.onload = renderContacts;
}
