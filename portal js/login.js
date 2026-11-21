const defaultUsers = [
    { name: "Faizul", email: "seeker@jobportal.com", password: "seeker123", role: "job_seeker",
      phone: "01712345678", education: "BSc in CSE" },
    { name: "Arithro Roy Arnob", email: "hr@brightsoft.com", password: "employer123", role: "employer" },
    { name: "Armanul Haque", email: "recruiter@talenthub.com", password: "recruit123", role: "Recruiter" }
];

const defaultAdmin = {
    name: "Md. Golam Abid",
    email: "admin@jobportal.com",
    password: "admin123",
    role: "admin"
};

const defaultApplications = [
    { id: "A-001", email: "seeker@jobportal.com", jobTitle: "Junior Web Developer",        company: "BrightSoft Ltd", appliedDate: "2026-11-12", status: "Shortlisted" },
    { id: "A-002", email: "seeker@jobportal.com", jobTitle: "Digital Marketing Executive", company: "ShopNow Ltd",    appliedDate: "2026-11-08", status: "Pending" },
    { id: "A-003", email: "seeker@jobportal.com", jobTitle: "Customer Support Officer",    company: "Green Telecom",  appliedDate: "2026-11-01", status: "Rejected" },
    { id: "A-004", email: "seeker@jobportal.com", jobTitle: "PHP Backend Developer",       company: "CodeCraft BD",   appliedDate: "2026-11-15", status: "Pending" },
    { id: "A-005", email: "seeker@jobportal.com", jobTitle: "Graphic Design Intern",       company: "Creative Hive",  appliedDate: "2026-10-20", status: "Accepted" }
];

let users = loadList("jpUsers", defaultUsers);
let adminAlreadyExists = false;
for (const user of users) {
    if (user.email.toLowerCase() === defaultAdmin.email) {
        adminAlreadyExists = true;
    }
}
if (!adminAlreadyExists) {
    users.push(defaultAdmin);
}

let recruiterAccountFound = false;
for (const user of users) {
    if (user.email.toLowerCase() === "recruiter@talenthub.com") {
        user.name = "Armanul Haque";
        recruiterAccountFound = true;
    }
}
if (!recruiterAccountFound) {
    users.push(defaultUsers[2]);
}

localStorage.setItem("jpUsers", JSON.stringify(users));
loadList("jpApplications", defaultApplications);  


window.addEventListener("load", function () {
    let form = document.querySelector("form");

    form.noValidate = true;
    form.addEventListener("submit", collectData);

    document.getElementById("reset").addEventListener("click", function () {
        clearAllErrors();
        hideMessage();
    });


    let rememberedEmail = localStorage.getItem("jpRememberEmail");
    if (rememberedEmail !== null) {
        document.getElementById("email").value = rememberedEmail;
        document.getElementById("remember").checked = true;
    }
});


function collectData(event) {
    event.preventDefault();     

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

    if (remember) {
        localStorage.setItem("jpRememberEmail", foundUser.email);
    } else {
        localStorage.removeItem("jpRememberEmail");
    }

    let userRole = foundUser.role.toLowerCase().replace(/[\s_-]/g, "");

    switch (userRole) {
        case "jobseeker":
            localStorage.setItem("jpLoggedIn", foundUser.email);
            alert("Login successful! Welcome, " + foundUser.name + ".");
            window.location.href = "jobseekerdashboard.html";
            break;
        case "employer":
            localStorage.setItem("jpLoggedIn", foundUser.email);
            alert("Login successful! Welcome, " + foundUser.name + ".");
            window.location.href = "Employer-Dashboard.html";
            break;
        case "recruiter":
        case "recruitmentmanager":
            localStorage.setItem("jpLoggedIn", foundUser.email);
            alert("Login successful! Welcome, " + foundUser.name + ".");
            window.location.href = "Recruitmentmanager/Dashboard.html";
            break;
        case "admin":
            localStorage.setItem("jpLoggedIn", foundUser.email);
            alert("Login successful! Welcome, " + foundUser.name + ".");
            window.location.href = "admin_dashboard.html";
            break;
        default:
            showMessage("This account type does not have a dashboard yet. Please contact the administrator.", "red");
            return false;
    }

    return true;
}

function fillDemo(email, password) {
    document.getElementById("email").value = email;
    document.getElementById("password").value = password;
    clearAllErrors();
    hideMessage();
}


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
    field.style.border = "2px solid red";
}

function clearError(fieldId) {
    let span = document.getElementById(fieldId + "Error");
    if (span !== null) {
        span.innerHTML = "";
    }
    document.getElementById(fieldId).style.border = "";  
}

function clearAllErrors() {
    clearError("email");
    clearError("password");
}

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
