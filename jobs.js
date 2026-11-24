/* =====================================================================
   profile.js - Job Seeker Profile
   1. Fills the form with the current user's information.
   2. Validates and updates the profile.
   ===================================================================== */

const profileFields = ["name", "email", "phone", "education", "skills", "experience", "cv"];

function fillForm() {
    document.getElementById("name").value = currentSeeker.name;
    document.getElementById("email").value = currentSeeker.email;
    document.getElementById("phone").value = currentSeeker.phone;
    document.getElementById("education").value = currentSeeker.education;
    document.getElementById("skills").value = currentSeeker.skills;
    document.getElementById("experience").value = currentSeeker.experience;
    document.getElementById("cv").value = "";
    showCurrentCv();
    clearErrors(profileFields);
}

function showCurrentCv() {
    let text = currentSeeker.cv === "" ? "No CV uploaded yet." : "Current CV: " + currentSeeker.cv;
    document.getElementById("currentCv").innerHTML = text;
}

function saveProfile(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let education = document.getElementById("education").value.trim();
    let skills = document.getElementById("skills").value.trim();
    let experience = document.getElementById("experience").value.trim();
    let cvFile = document.getElementById("cv").value;

    let isValid = true;
    clearErrors(profileFields);

    if (name.length < 3 || name.length > 50) {
        showError("name", "Name must be between 3 and 50 characters.");
        isValid = false;
    } else if (!/^[a-zA-Z.\s]+$/.test(name)) {
        showError("name", "Name can only contain letters, spaces and dots.");
        isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Please enter a valid email address.");
        isValid = false;
    }

    if (!/^01\d{9}$/.test(phone)) {
        showError("phone", "Enter an 11-digit Bangladeshi phone number starting with 01.");
        isValid = false;
    }

    if (education.length < 2) {
        showError("education", "Please enter your education details.");
        isValid = false;
    }

    if (skills.length < 2) {
        showError("skills", "Please enter your skills.");
        isValid = false;
    }

    if (experience.length < 2) {
        showError("experience", "Enter your experience or write Fresher.");
        isValid = false;
    }

    if (cvFile !== "" && !/\.(pdf|doc|docx)$/i.test(cvFile)) {
        showError("cv", "CV must be a PDF, DOC or DOCX file.");
        isValid = false;
    }

    if (isValid === false) {
        return false;
    }

    currentSeeker.name = name;
    currentSeeker.email = email;
    currentSeeker.phone = phone;
    currentSeeker.education = education;
    currentSeeker.skills = skills;
    currentSeeker.experience = experience;

    if (cvFile !== "") {
        let fileParts = cvFile.split("\\");
        currentSeeker.cv = fileParts[fileParts.length - 1];
    }

    for (let i = 0; i < seekerApplications.length; i++) {
        if (seekerApplications[i].email === oldEmail) {
            seekerApplications[i].email = email;
        }
    }

    document.getElementById("profileMessage").innerHTML = "Your profile was updated successfully.";
    showCurrentCv();
    return false;
}

function showError(fieldId, message) {
    document.getElementById(fieldId + "Error").innerHTML = message;
    document.getElementById(fieldId).style.border = "2px solid red";
}

function clearErrors(fields) {
    for (let i = 0; i < fields.length; i++) {
        let field = document.getElementById(fields[i]);
        let error = document.getElementById(fields[i] + "Error");

        if (error !== null) {
            error.innerHTML = "";
        }

        if (field !== null) {
            field.style.border = "";
        }
    }
}

let oldEmail = currentSeeker.email;
document.getElementById("profileForm").addEventListener("submit", saveProfile);
fillForm();
