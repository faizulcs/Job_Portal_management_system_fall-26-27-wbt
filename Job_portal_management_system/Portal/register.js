
/* =====================================================================
   register.js - Job Portal Registration

   1. defaultUsers stores the three default accounts.
   2. loadList() loads users from localStorage.
   3. collectData() validates the registration form.
   4. A new user object is created if everything is valid.
   5. The new user is saved in localStorage.
   6. The user is redirected to the Login page.

   ===================================================================== */


// Default users of the Job Portal

const defaultUsers = [
    {
        name: "Faizul",
        email: "seeker@jobportal.com",
        password: "seeker123",
        role: "job_seeker",
        phone: "01712345678",
        education: "BSc in CSE, American International University -Bangladesh",
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


// Load users from localStorage

let users = loadList("jpUsers", defaultUsers);


// Fields used in the registration form

const fieldIds = [
    "name", "email", "password",
    "confirmPassword", "recruiter", "condition"
];


/* ---------------------------------------------------------------------
   CONNECT THE FORM WHEN THE PAGE LOADS
   --------------------------------------------------------------------- */

window.addEventListener("load", function () {

    let form = document.querySelector("form");

    // Turn off browser validation

    form.noValidate = true;

    // Run collectData() when the form is submitted

    form.addEventListener("submit", collectData);


    // Correct the Recruiter label

    let labels = document.getElementsByTagName("label");

    for (let i = 0; i < labels.length; i++) {

        if (labels[i].innerHTML.trim() === "Recruiter") {

            labels[i].htmlFor = "recruiter";

        }

    }


    // Clear errors when Reset button is clicked

    document.getElementById("reset").addEventListener("click", clearAllErrors);

});


/* ---------------------------------------------------------------------
   VALIDATE AND CREATE THE ACCOUNT
   --------------------------------------------------------------------- */

function collectData(event) {

    event.preventDefault();

    let isValid = true;

    clearAllErrors();


    // Get values from the form

    let name = document.getElementById("name").value.trim();

    let email = document.getElementById("email").value.trim();

    let password = document.getElementById("password").value;

    let confirmPassword = document.getElementById("confirmPassword").value;

    let role = document.querySelector('input[name="role"]:checked');

    let condition = document.getElementById("condition").checked;


    // Validate Name

    if (name === "") {

        showError("name", "Name is required.");

        isValid = false;

    } else if (name.length < 3) {

        showError("name", "Name must be at least 3 characters.");

        isValid = false;

    } else if (!/^[a-zA-Z.\s]+$/.test(name)) {

        showError("name", "Name can only contain letters, spaces and dots.");

        isValid = false;

    }


    // Validate Email

    if (email === "") {

        showError("email", "Email is required.");

        isValid = false;

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        showError("email", "Please enter a valid email address.");

        isValid = false;

    } else if (emailExists(email)) {

        showError("email", "An account with this email already exists. Please login.");

        isValid = false;

    }


    // Validate Password

    if (password === "") {

        showError("password", "Password is required.");

        isValid = false;

    } else if (password.length < 6) {

        showError("password", "Password must be at least 6 characters.");

        isValid = false;

    }


    // Validate Confirm Password

    if (confirmPassword === "") {

        showError("confirmPassword", "Confirm Password is required.");

        isValid = false;

    } else if (password !== confirmPassword) {

        showError("confirmPassword", "Passwords do not match.");

        isValid = false;

    }


    // Validate Account Type

    if (!role) {

        showError("recruiter", "Please select an account type.");

        isValid = false;

    }


    // Validate Terms and Conditions

    if (!condition) {

        showError("condition", "You must agree to the Terms and Conditions.");

        isValid = false;

    }


    // Stop if any validation fails

    if (!isValid) {

        return false;

    }


    // Everything is valid: build the new user object

    let newUser = {

        name: name,

        email: email,

        password: password,

        role: role.value,

        phone: "",

        education: "",

        skills: "",

        experience: "",

        cv: ""

    };


    // Add the new user to the users array

    users.push(newUser);


    // Save users in localStorage

    localStorage.setItem("jpUsers", JSON.stringify(users));

    console.log("New user:", newUser);


    // Show success message

    alert("Registration successful! Please login with your email and password.");


    // Go to Login page

    window.location.href = "login.html";

    return true;

}


/* =====================================================================
   SMALL HELPER FUNCTIONS
   ===================================================================== */


// Checks whether an email already exists

function emailExists(email) {

    for (const user of users) {

        if (user.email.toLowerCase() === email.toLowerCase()) {

            return true;

        }

    }

    return false;

}


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


// Shows an error message below the input field

function showError(fieldId, message) {

    let field = document.getElementById(fieldId);

    getErrorSpan(fieldId).innerHTML = message;


    // Add a red border to text fields

    if (field.type !== "radio" && field.type !== "checkbox") {

        field.style.border = "2px solid red";

    }

}


// Clears an error message from one field

function clearError(fieldId) {

    let span = document.getElementById(fieldId + "Error");

    if (span !== null) {

        span.innerHTML = "";

    }

    let field = document.getElementById(fieldId);

    if (field !== null) {

        field.style.border = "";

    }

}


// Clears all error messages

function clearAllErrors() {

    for (let i = 0; i < fieldIds.length; i++) {

        clearError(fieldIds[i]);

    }

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


        let field = document.getElementById(fieldId);


        // Put error after the checkbox label

        if (field.type === "checkbox") {

            let label = document.querySelector("label[for='" + fieldId + "']");

            label.parentNode.insertBefore(span, label.nextSibling);

        } else {

            // Put error inside the parent element

            field.parentNode.appendChild(span);

        }

    }

    return span;

}
