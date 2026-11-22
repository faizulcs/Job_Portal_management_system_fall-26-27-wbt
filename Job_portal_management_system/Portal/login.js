
/* =====================================================================
   login.js - Job Portal Login

   1. defaultUsers stores the three default accounts.
   2. defaultApplications stores sample job applications.
   3. loadList() loads users and applications from localStorage.
   4. collectData() validates the login form.
   5. The email and password are checked against existing users.
   6. Remember Me saves the email in localStorage.
   7. The user is redirected according to their role.

   ===================================================================== */


// Default users of the Job Portal

const defaultUsers = [

    {
        name: "Faizul",
        email: "seeker@jobportal.com",
        password: "seeker123",
        role: "job_seeker",
        phone: "01712345678",
        education: "BSc in CSE, AIUB",
        skills: "HTML, CSS, JavaScript, PHP, MySQL",
        experience: "1 year internship at Pixel Lab",
        cv: "fab_cv.pdf"
    },

    {
        name: "BrightSoft HR",
        email: "hr@brightsoft.com",
        password: "employer123",
        role: "employer"
    },

    {
        name: "Sadia Karim",
        email: "recruiter@talenthub.com",
        password: "recruit123",
        role: "Recruiter"
    }

];


// Sample applications of the sample job seeker

const defaultApplications = [

    {
        id: "A-001",
        email: "seeker@jobportal.com",
        jobTitle: "Junior Web Developer",
        company: "BrightSoft Ltd",
        appliedDate: "2026-11-12",
        status: "Shortlisted"
    },

    {
        id: "A-002",
        email: "seeker@jobportal.com",
        jobTitle: "Digital Marketing Executive",
        company: "ShopNow Ltd",
        appliedDate: "2026-11-08",
        status: "Pending"
    },

    {
        id: "A-003",
        email: "seeker@jobportal.com",
        jobTitle: "Customer Support Officer",
        company: "Green Telecom",
        appliedDate: "2026-11-01",
        status: "Rejected"
    },

    {
        id: "A-004",
        email: "seeker@jobportal.com",
        jobTitle: "PHP Backend Developer",
        company: "CodeCraft BD",
        appliedDate: "2026-11-15",
        status: "Pending"
    },

    {
        id: "A-005",
        email: "seeker@jobportal.com",
        jobTitle: "Graphic Design Intern",
        company: "Creative Hive",
        appliedDate: "2026-10-20",
        status: "Accepted"
    }

];


// Load users and applications from localStorage

let users = loadList("jpUsers", defaultUsers);

loadList("jpApplications", defaultApplications);


/* ---------------------------------------------------------------------
   CONNECT THE FORM WHEN THE PAGE LOADS
   --------------------------------------------------------------------- */

window.addEventListener("load", function () {

    let form = document.querySelector("form");

    // Turn off browser validation

    form.noValidate = true;

    // Run collectData() when the form is submitted

    form.addEventListener("submit", collectData);


    // Clear errors when Reset button is clicked

    document.getElementById("reset").addEventListener("click", function () {

        clearAllErrors();

        hideMessage();

    });


    // Remember Me: fill in the saved email

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

    event.preventDefault();

    let isValid = true;

    clearAllErrors();

    hideMessage();


    // Get values from the form

    let email = document.getElementById("email").value.trim();

    let password = document.getElementById("password").value.trim();

    let remember = document.getElementById("remember").checked;


    // Validate Email

    if (email === "") {

        showError("email", "Email is required.");

        isValid = false;

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        showError("email", "Invalid email format.");

        isValid = false;

    }


    // Validate Password

    if (password === "") {

        showError("password", "Password is required.");

        isValid = false;

    } else if (password.length < 6) {

        showError("password", "Password must be at least 6 characters long.");

        isValid = false;

    }


    // Stop if validation fails

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


    // Check whether the account exists

    if (foundUser === null) {

        showMessage("No account found with this email. Please Signup first.", "red");

        return false;

    }


    // Check Password

    if (foundUser.password !== password) {

        showError("password", "Wrong password. Please try again.");

        return false;

    }


    // Remember Me: save or remove the email

    if (remember) {

        localStorage.setItem("jpRememberEmail", foundUser.email);

    } else {

        localStorage.removeItem("jpRememberEmail");

    }


    // Open the right page according to the role

    switch (foundUser.role.toLowerCase()) {

        case "job_seeker":

            localStorage.setItem("jpLoggedIn", foundUser.email);

            alert("Login successful! Welcome, " + foundUser.name + ".");

            window.location.href = "../Jobseeker/jobseekerdashboard.html";

            break;


        case "employer":

        case "recruiter":

            showMessage(
                "Login correct. The " + foundUser.role +
                " dashboard is a separate part of this project.",
                "blue"
            );

            break;

    }

    return true;

}


/* =====================================================================
   HELPER FUNCTIONS
   ===================================================================== */


// Reads an array from localStorage

function loadList(key, defaultList) {

    let text = localStorage.getItem(key);

    if (text === null) {

        localStorage.setItem(key, JSON.stringify(defaultList));

        return defaultList;

    }

    return JSON.parse(text);

}


/* ---------------------------------------------------------------------
   ERROR HANDLING
   --------------------------------------------------------------------- */


// Shows an error message under a field

function showError(fieldId, message) {

    let field = document.getElementById(fieldId);

    getErrorSpan(fieldId).innerHTML = message;

    field.style.border = "2px solid red";

}


// Clears an error message from one field

function clearError(fieldId) {

    let span = document.getElementById(fieldId + "Error");

    if (span !== null) {

        span.innerHTML = "";

    }

    document.getElementById(fieldId).style.border = "";

}


// Clears all error messages

function clearAllErrors() {

    clearError("email");

    clearError("password");

}


// Creates a span for displaying error messages

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


/* ---------------------------------------------------------------------
   FORM MESSAGE
   --------------------------------------------------------------------- */


// Creates a message above the form

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


// Hides the message above the form

function hideMessage() {

    let box = document.getElementById("formMessage");

    if (box !== null) {

        box.style.display = "none";

    }

}
