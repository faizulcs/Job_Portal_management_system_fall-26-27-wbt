const defaultUsers = [
    { name: "Nusrat Jahan", email: "seeker@jobportal.com", password: "seeker123", role: "job_seeker",
      phone: "01712345678", education: "BSc in CSE, American International University -Bangladesh",
      skills: "HTML, CSS, JavaScript, PHP, MySQL", experience: "1 year internship at Pixel Lab", cv: "nusrat_cv.pdf" },
    { name: "BrightSoft HR", email: "hr@brightsoft.com", password: "employer123", role: "employer" },
    { name: "Sadia Karim", email: "recruiter@talenthub.com", password: "recruit123", role: "Recruiter" }
];

let users = loadList("jpUsers", defaultUsers);

const fieldIds = ["name", "email", "password", "confirmPassword", "recruiter", "condition"];


/* ---------------------------------------------------------------------
   CONNECT THE FORM WHEN THE PAGE LOADS
   --------------------------------------------------------------------- */
window.addEventListener("load", function () {
    let form = document.querySelector("form");

    // Turn off the browser's own "required" pop-ups, so our red messages show instead
    form.noValidate = true;
    form.addEventListener("submit", collectData);

    // The "Recruiter" label pointed to the Employer button (for="employer").
    // Point the second label to the Recruiter radio button instead.
    let labels = document.getElementsByTagName("label");
    for (let i = 0; i < labels.length; i++) {
        if (labels[i].innerHTML.trim() === "Recruiter") {
            labels[i].htmlFor = "recruiter";
        }
    }

    // The Reset button also removes the red messages
    document.getElementById("reset").addEventListener("click", clearAllErrors);
});


/* ---------------------------------------------------------------------
   VALIDATE AND CREATE THE ACCOUNT
   --------------------------------------------------------------------- */
function collectData(event) {
    event.preventDefault();      // stop the form; JavaScript opens the Login page itself

    let isValid = true;
    clearAllErrors();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let role = document.querySelector('input[name="role"]:checked');
    let condition = document.getElementById("condition").checked;

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

    if (password === "") {
        showError("password", "Password is required.");
        isValid = false;
    } else if (password.length < 6) {
        showError("password", "Password must be at least 6 characters.");
        isValid = false;
    }

    if (confirmPassword === "") {
        showError("confirmPassword", "Confirm Password is required.");
        isValid = false;
    } else if (password !== confirmPassword) {
        showError("confirmPassword", "Passwords do not match.");
        isValid = false;
    }

    // The error for the radio group goes after the last radio button (Recruiter)
    if (!role) {
        showError("recruiter", "Please select an account type.");
        isValid = false;
    }

    if (!condition) {
        showError("condition", "You must agree to the Terms and Conditions.");
        isValid = false;
    }

    if (!isValid) {
        return false;
    }

    // Everything is valid: build the new user object
    let newUser = {
        name: name,
        email: email,
        password: password,
        role: role.value,          // "job_seeker", "employer" or "Recruiter"
        phone: "",
        education: "",
        skills: "",
        experience: "",
        cv: ""
    };

    users.push(newUser);
    localStorage.setItem("jpUsers", JSON.stringify(users));
    console.log("New user:", newUser);

    alert("Registration successful! Please login with your email and password.");
    window.location.href = "login.html";
    return true;
}


/* =====================================================================
   HELPER FUNCTIONS
   ===================================================================== */

function emailExists(email) {
    for (const user of users) {
        if (user.email.toLowerCase() === email.toLowerCase()) {
            return true;
        }
    }
    return false;
}

// Reads an array from localStorage. The first time, saves the default array.
function loadList(key, defaultList) {
    let text = localStorage.getItem(key);
    if (text === null) {
        localStorage.setItem(key, JSON.stringify(defaultList));
        return defaultList;
    }
    return JSON.parse(text);
}

function showError(fieldId, message) {
    let field = document.getElementById(fieldId);
    getErrorSpan(fieldId).innerHTML = message;
    // A red border only makes sense on text boxes, not on radio buttons or checkboxes
    if (field.type !== "radio" && field.type !== "checkbox") {
        field.style.border = "2px solid red";
    }
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

// Makes the red <span> the first time it is needed
function getErrorSpan(fieldId) {
    let span = document.getElementById(fieldId + "Error");
    if (span === null) {
        span = document.createElement("span");
        span.id = fieldId + "Error";
        span.style.color = "red";
        span.style.fontSize = "14px";
        span.style.display = "block";

        let field = document.getElementById(fieldId);
        if (field.type === "checkbox") {
            // Put it right after the checkbox's label
            let label = document.querySelector("label[for='" + fieldId + "']");
            label.parentNode.insertBefore(span, label.nextSibling);
        } else {
            // Put it at the end of the <td> that holds the input
            field.parentNode.appendChild(span);
        }
    }
    return span;
}

