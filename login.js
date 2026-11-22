const defaultUsers = [
    { name: "Nusrat Jahan", email: "seeker@jobportal.com", password: "seeker123", role: "job_seeker",
      phone: "01712345678", education: "BSc in CSE, Green University of Bangladesh",
      skills: "HTML, CSS, JavaScript, PHP, MySQL", experience: "1 year internship at Pixel Lab", cv: "nusrat_cv.pdf" },
    { name: "BrightSoft HR", email: "hr@brightsoft.com", password: "employer123", role: "employer" },
    { name: "Sadia Karim", email: "recruiter@talenthub.com", password: "recruit123", role: "Recruiter" }
];

// ---------- Sample applications of the sample job seeker ----------
const defaultApplications = [
    { id: "A-001", email: "seeker@jobportal.com", jobTitle: "Junior Web Developer",        company: "BrightSoft Ltd", appliedDate: "2026-11-12", status: "Shortlisted" },
    { id: "A-002", email: "seeker@jobportal.com", jobTitle: "Digital Marketing Executive", company: "ShopNow Ltd",    appliedDate: "2026-11-08", status: "Pending" },
    { id: "A-003", email: "seeker@jobportal.com", jobTitle: "Customer Support Officer",    company: "Green Telecom",  appliedDate: "2026-11-01", status: "Rejected" },
    { id: "A-004", email: "seeker@jobportal.com", jobTitle: "PHP Backend Developer",       company: "CodeCraft BD",   appliedDate: "2026-11-15", status: "Pending" },
    { id: "A-005", email: "seeker@jobportal.com", jobTitle: "Graphic Design Intern",       company: "Creative Hive",  appliedDate: "2026-10-20", status: "Accepted" }
];

let users = loadList("jpUsers", defaultUsers);
loadList("jpApplications", defaultApplications);    // makes sure the sample applications exist


/* ---------------------------------------------------------------------
   CONNECT THE FORM WHEN THE PAGE LOADS
   --------------------------------------------------------------------- */
window.addEventListener("load", function () {
    let form = document.querySelector("form");

    // Turn off the browser's own "required" pop-ups, so our red messages show instead
    form.noValidate = true;
    form.addEventListener("submit", collectData);

    // The Reset button also removes the red messages
    document.getElementById("reset").addEventListener("click", function () {
        clearAllErrors();
        hideMessage();
    });

    // "Remember Me": fill in the email saved last time
    let rememberedEmail = localStorage.getItem("jpRememberEmail");
    if (rememberedEmail !== null) {
        document.getElementById("email").value = rememberedEmail;
        document.getElementById("remember").checked = true;
    }
});


/* ---------------------------------------------------------------------
   VALIDATE AND LOG IN
   --------------------------------------------------------------------- */
function collectData(event) {
    event.preventDefault();      // stop the form; JavaScript opens the next page itself

    let isValid = true;
    clearAllErrors();
    hideMessage();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let remember = document.getElementById("remember").checked;

    if (email === "") {
        showError("email", "Email is required.");
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Invalid email format.");
        isValid = false;
    }

    if (password === "") {
        showError("password", "Password is required.");
        isValid = false;
    } else if (password.length < 6) {
        showError("password", "Password must be at least 6 characters long.");
        isValid = false;
    }

    if (!isValid) {
        return false;
    }

    // Find the account with this email
    let foundUser = null;
    for (const user of users) {
        if (user.email.toLowerCase() === email.toLowerCase()) {
            foundUser = user;
        }
    }

    if (foundUser === null) {
        showMessage("No account found with this email. Please Signup first.", "red");
        return false;
    }

    if (foundUser.password !== password) {
        showError("password", "Wrong password. Please try again.");
        return false;
    }

    // Remember Me: save or forget the email
    if (remember) {
        localStorage.setItem("jpRememberEmail", foundUser.email);
    } else {
        localStorage.removeItem("jpRememberEmail");
    }

    // Open the right page for the role
    switch (foundUser.role.toLowerCase()) {
        case "job_seeker":
            localStorage.setItem("jpLoggedIn", foundUser.email);
            alert("Login successful! Welcome, " + foundUser.name + ".");
            window.location.href = "../Jobseeker/jobseekerdashboard.html";
            break;
        case "employer":
        case "recruiter":
            // These dashboards are made in the Employer / Recruiter part of the project
            showMessage("Login correct. The " + foundUser.role + " dashboard is a separate part of this project.", "blue");
            break;
    }

    return true;
}


/* =====================================================================
   HELPER FUNCTIONS
   ===================================================================== */

// Reads an array from localStorage. The first time, saves the default array.
function loadList(key, defaultList) {
    let text = localStorage.getItem(key);
    if (text === null) {
        localStorage.setItem(key, JSON.stringify(defaultList));
        return defaultList;
    }
    return JSON.parse(text);          // text -> array of objects
}

// Shows a red message under a field. The <span> is created the first time.
function showError(fieldId, message) {
    let field = document.getElementById(fieldId);
    getErrorSpan(fieldId).innerHTML = message;
    field.style.border = "2px solid red";
}

function clearError(fieldId) {
    let span = document.getElementById(fieldId + "Error");
    if (span !== null) {
        span.innerHTML = "";
    }
    document.getElementById(fieldId).style.border = "";   // back to the CSS border
}

function clearAllErrors() {
    clearError("email");
    clearError("password");
}

// Makes <span id="emailError"> inside the same <td> as the input
function getErrorSpan(fieldId) {
    let span = document.getElementById(fieldId + "Error");
    if (span === null) {
        span = document.createElement("span");
        span.id = fieldId + "Error";
        span.style.color = "red";
        span.style.fontSize = "14px";
        span.style.display = "block";
        document.getElementById(fieldId).parentNode.appendChild(span);
    }
    return span;
}

// A message above the form (created the first time it is needed)
function showMessage(text, color) {
    let box = document.getElementById("formMessage");
    if (box === null) {
        box = document.createElement("p");
        box.id = "formMessage";
        box.style.padding = "10px";
        box.style.marginBottom = "15px";
        box.style.fontWeight = "bold";
        let form = document.querySelector("form");
        form.parentNode.insertBefore(box, form);
    }
    box.innerHTML = text;
    box.style.color = color;
    box.style.border = "1px solid " + color;
    box.style.display = "block";
}

function hideMessage() {
    let box = document.getElementById("formMessage");
    if (box !== null) {
        box.style.display = "none";
    }
}