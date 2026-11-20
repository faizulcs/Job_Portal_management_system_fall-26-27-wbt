const fieldIds = ["name", "email", "phone", "education", "skills", "experience", "cv"];

let loggedInUser = null;


window.addEventListener("load", function () {
    setupNavbar();

    loggedInUser = getLoggedInUser();
    if (loggedInUser === null) {
        return;
    }

    fillForm(loggedInUser);

    let form = document.querySelector("form");
    form.noValidate = true;
    form.addEventListener("submit", collectData);
});


// Copies the saved profile into the form
function fillForm(user) {
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone;
    document.getElementById("education").value = user.education;
    document.getElementById("skills").value = user.skills;
    document.getElementById("experience").value = user.experience;
    showCurrentCv(user.cv);
}


/* ---------------------------------------------------------------------
   VALIDATE AND SAVE
   --------------------------------------------------------------------- */
function collectData(event) {
    event.preventDefault();      // stay on this page

    let isValid = true;
    clearAllErrors();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let education = document.getElementById("education").value.trim();
    let skills = document.getElementById("skills").value.trim();
    let experience = document.getElementById("experience").value.trim();
    let cvPath = document.getElementById("cv").value;     // "" if no file chosen

    if (name === "") {
        showError("name", "Name is required.");
        isValid = false;
    } else if (name.length < 3) {
        showError("name", "Name must be at least 3 characters.");
        isValid = false;
    } else if (name.length > 50) {
        showError("name", "Name cannot exceed 50 characters.");
        isValid = false;
    } else if (!/^[a-zA-Z.\s]+$/.test(name)) {
        showError("name", "Name can only contain letters, spaces and dots.");
        isValid = false;
    }

    if (email === "") {
        showError("email", "Email is required.");
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Invalid email format.");
        isValid = false;
    } else if (emailUsedByOther(email)) {
        showError("email", "Another account already uses this email.");
        isValid = false;
    }

    if (phone === "") {
        showError("phone", "Phone is required.");
        isValid = false;
    } else if (!/^\d{11}$/.test(phone)) {
        showError("phone", "Please enter an 11-digit phone number.");
        isValid = false;
    } else if (phone.slice(0, 2) !== "01") {
        showError("phone", "A Bangladeshi mobile number starts with 01.");
        isValid = false;
    }

    if (education === "") {
        showError("education", "Education is required.");
        isValid = false;
    }

    if (skills === "") {
        showError("skills", "Skills are required.");
        isValid = false;
    }

    if (experience === "") {
        showError("experience", "Experience is required (write Fresher if you have none).");
        isValid = false;
    }

    // The CV is optional when one is already saved; a new file must be .pdf, .doc or .docx
    if (cvPath === "" && loggedInUser.cv === "") {
        showError("cv", "Please upload your CV.");
        isValid = false;
    } else if (cvPath !== "" && !isAllowedCv(cvPath)) {
        showError("cv", "The CV must be a .pdf, .doc or .docx file.");
        isValid = false;
    }

    if (!isValid) {
        return false;
    }

    // ----- Everything is valid: save the changes -----
    let oldEmail = loggedInUser.email;
    let users = loadList("jpUsers");

    for (const user of users) {
        if (user.email === oldEmail) {
            user.name = name;
            user.email = email;
            user.phone = phone;
            user.education = education;
            user.skills = skills;
            user.experience = experience;
            if (cvPath !== "") {
                user.cv = getFileName(cvPath);
            }
            loggedInUser = user;
        }
    }
    localStorage.setItem("jpUsers", JSON.stringify(users));

    // If the email changed, the login and the applications must use the new email too
    if (email !== oldEmail) {
        localStorage.setItem("jpLoggedIn", email);

        let applications = loadList("jpApplications");
        for (const application of applications) {
            if (application.email === oldEmail) {
                application.email = email;
            }
        }
        localStorage.setItem("jpApplications", JSON.stringify(applications));
    }

    document.getElementById("cv").value = "";
    showCurrentCv(loggedInUser.cv);
    console.log("Profile saved:", loggedInUser);

    alert("Profile updated successfully!");
    return true;
}


/* =====================================================================
   HELPER FUNCTIONS
   ===================================================================== */

function emailUsedByOther(email) {
    let users = loadList("jpUsers");
    for (const user of users) {
        if (user.email.toLowerCase() === email.toLowerCase() && user.email !== loggedInUser.email) {
            return true;
        }
    }
    return false;
}

// true when the file name ends with .pdf, .doc or .docx
function isAllowedCv(fileName) {
    let dot = fileName.lastIndexOf(".");
    let extension = fileName.slice(dot + 1).toLowerCase();
    return dot !== -1 && (extension === "pdf" || extension === "doc" || extension === "docx");
}

// The browser gives "C:\fakepath\my_cv.pdf"; keep only "my_cv.pdf"
function getFileName(path) {
    return path.slice(path.lastIndexOf("\\") + 1);
}

// Writes "Current CV: ..." under the file input (the <p> is made once)
function showCurrentCv(cvName) {
    let note = document.getElementById("currentCv");
    if (note === null) {
        note = document.createElement("p");
        note.id = "currentCv";
        note.style.fontSize = "14px";
        note.style.color = "grey";
        document.getElementById("cv").parentNode.appendChild(note);
    }
    note.innerHTML = (cvName === "") ? "No CV uploaded yet." : "Current CV: " + cvName;
}

function showError(fieldId, message) {
    getErrorSpan(fieldId).innerHTML = message;
    document.getElementById(fieldId).style.border = "2px solid red";
}

function clearError(fieldId) {
    let span = document.getElementById(fieldId + "Error");
    if (span !== null) {
        span.innerHTML = "";
    }
    document.getElementById(fieldId).style.border = "";
}

function clearAllErrors() {
    for (let i = 0; i < fieldIds.length; i++) {
        clearError(fieldIds[i]);
    }
}

// Makes the red <span> right after the input, inside the same <td>
function getErrorSpan(fieldId) {
    let span = document.getElementById(fieldId + "Error");
    if (span === null) {
        span = document.createElement("span");
        span.id = fieldId + "Error";
        span.style.color = "red";
        span.style.fontSize = "14px";
        span.style.display = "block";
        let field = document.getElementById(fieldId);
        field.parentNode.insertBefore(span, field.nextSibling);
    }
    return span;
}

// Reads an array from localStorage ([] if nothing is saved yet)
function loadList(key) {
    let text = localStorage.getItem(key);
    if (text === null) {
        return [];
    }
    return JSON.parse(text);
}

// Returns the logged-in job seeker object, or sends the user to Login
function getLoggedInUser() {
    let email = localStorage.getItem("jpLoggedIn");
    let users = loadList("jpUsers");

    for (const user of users) {
        if (email !== null && user.email === email && user.role === "job_seeker") {
            return user;
        }
    }

    alert("Please login first.");
    window.location.href = "../Portal/login.html";
    return null;
}

// Sets the right page for each navbar link, using the link's text
function setupNavbar() {
    let links = document.querySelectorAll(".navbar a");

    for (let i = 0; i < links.length; i++) {
        let text = links[i].innerHTML.trim();

        switch (text) {
            case "Dashboard":
                links[i].href = "jobseekerdashboard.html";
                break;
            case "My Applications":
                links[i].href = "jobseekrapplication.html";
                break;
            case "Update Profile":
                links[i].href = "jobseekerprofile.html";
                break;
            case "Find Jobs":
                links[i].href = "#";
                links[i].onclick = function () {
                    alert("The Find Jobs page is not added to the project yet.");
                    return false;
                };
                break;
            case "Logout":
                links[i].href = "../Portal/login.html";
                links[i].onclick = function () {
                    localStorage.removeItem("jpLoggedIn");
                    alert("You have logged out.");
                    return true;
                };
                break;
        }
    }
}
