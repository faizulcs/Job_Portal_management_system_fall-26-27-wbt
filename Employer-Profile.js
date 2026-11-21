const PROFILE_STORAGE_KEY =
  typeof EMPLOYER_PROFILE_STORAGE_KEY !== "undefined"
    ? EMPLOYER_PROFILE_STORAGE_KEY
    : "jobportal_employer_profile";

const defaultProfileData =
  typeof defaultEmployerData !== "undefined" && defaultEmployerData.profile
    ? Object.assign({}, defaultEmployerData.profile)
    : {
        companyName: "Arnob Tech Solutions",
        industry: "Software & Web Services",
        companySize: "51-200",
        website: "https://arnobtech.example.com",
        contactName: "Arithro Roy Arnob",
        email: "hr@arnobtech.example.com",
        phone: "+8801711000000",
        city: "Dhaka",
        address: "Banani, Dhaka 1213, Bangladesh",
        about: "Building modern web platforms and hiring software engineers and product specialists."
      };

const profileFieldIds = [
  "companyName",
  "industry",
  "companySize",
  "website",
  "contactName",
  "email",
  "phone",
  "city",
  "address",
  "about"
];

const passwordFieldIds = [
  "currentPassword",
  "newPassword",
  "confirmPassword"
];

let rawProfileState = localStorage.getItem(PROFILE_STORAGE_KEY);
let profileState =
  rawProfileState !== null ? JSON.parse(rawProfileState) : Object.assign({}, defaultProfileData);

function showError(fieldId, message) {
  let errorEl = document.getElementById(fieldId + "Error");
  if (errorEl != null) {
    errorEl.innerHTML = message;
  }
  let field = document.getElementById(fieldId);
  if (field != null) {
    field.style.border = "2px solid red";
  }
}

function clearError(fieldId) {
  let errorEl = document.getElementById(fieldId + "Error");
  if (errorEl != null) {
    errorEl.innerHTML = "";
  }
  let field = document.getElementById(fieldId);
  if (field != null) {
    field.style.border = "";
  }
}

function clearErrors(fieldIds) {
  for (let i = 0; i < fieldIds.length; i++) {
    clearError(fieldIds[i]);
  }
}

function showMessage(text, type) {
  let box = document.getElementById("profileMessage");
  if (box != null) {
    box.innerHTML = text;
    box.className = "message " + type;
    box.style.display = "block";
  }
}

function hideMessage() {
  let box = document.getElementById("profileMessage");
  if (box != null) {
    box.style.display = "none";
  }
}

function populateProfile() {
  document.getElementById("companyName").value = profileState.companyName || "";
  document.getElementById("industry").value = profileState.industry || "";
  document.getElementById("companySize").value = profileState.companySize || "1-50";
  document.getElementById("website").value = profileState.website || "";
  document.getElementById("contactName").value = profileState.contactName || "";
  document.getElementById("email").value = profileState.email || "";
  document.getElementById("phone").value = profileState.phone || "";
  document.getElementById("city").value = profileState.city || "";
  document.getElementById("address").value = profileState.address || "";
  document.getElementById("about").value = profileState.about || "";
}

function resetProfileToDefault() {
  clearErrors(profileFieldIds);
  hideMessage();
  profileState = Object.assign({}, defaultProfileData);
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileState));
  populateProfile();
  showMessage("Profile reset to default values.", "info");
}

function saveProfile() {
  let companyName = document.getElementById("companyName").value.trim();
  let industry = document.getElementById("industry").value.trim();
  let companySize = document.getElementById("companySize").value;
  let website = document.getElementById("website").value.trim();
  let contactName = document.getElementById("contactName").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let city = document.getElementById("city").value.trim();
  let address = document.getElementById("address").value.trim();
  let about = document.getElementById("about").value.trim();

  let isValid = true;
  clearErrors(profileFieldIds);
  hideMessage();

  if (companyName.length < 2) {
    showError("companyName", "Company name must be at least 2 characters.");
    isValid = false;
  }
  if (industry.length < 2) {
    showError("industry", "Industry must be at least 2 characters.");
    isValid = false;
  }
  if (website.length < 4) {
    showError("website", "Please enter a valid website.");
    isValid = false;
  }
  if (contactName.length < 2) {
    showError("contactName", "Primary contact must be at least 2 characters.");
    isValid = false;
  }
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  }
  if (phone.length < 6) {
    showError("phone", "Please enter a valid phone number.");
    isValid = false;
  }
  if (city.length < 2) {
    showError("city", "City must be at least 2 characters.");
    isValid = false;
  }
  if (address.length < 4) {
    showError("address", "Address must be at least 4 characters.");
    isValid = false;
  }
  if (about.length < 5) {
    showError("about", "Company description must be at least 5 characters.");
    isValid = false;
  }

  if (!isValid) {
    showMessage("Please fix the fields marked in red.", "error");
    return false;
  }

  profileState = {
    companyName: companyName,
    industry: industry,
    companySize: companySize,
    website: website,
    contactName: contactName,
    email: email,
    phone: phone,
    city: city,
    address: address,
    about: about
  };

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileState));
  showMessage("Employer profile saved successfully.", "success");
  return false;
}

function updatePassword() {
  let currentPassword = document.getElementById("currentPassword").value.trim();
  let newPassword = document.getElementById("newPassword").value.trim();
  let confirmPassword = document.getElementById("confirmPassword").value.trim();

  let isValid = true;
  clearErrors(passwordFieldIds);
  hideMessage();

  if (currentPassword.length < 4) {
    showError("currentPassword", "Please enter your current password.");
    isValid = false;
  }
  if (newPassword.length < 6) {
    showError("newPassword", "New password must be at least 6 characters.");
    isValid = false;
  }
  if (confirmPassword !== newPassword || confirmPassword === "") {
    showError("confirmPassword", "Passwords do not match.");
    isValid = false;
  }

  if (!isValid) {
    showMessage("Please fix the fields marked in red.", "error");
    return false;
  }

  document.getElementById("passwordForm").reset();
  showMessage("Password updated successfully.", "success");
  return false;
}

populateProfile();