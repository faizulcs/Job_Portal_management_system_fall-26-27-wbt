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
        name: "Arithro Roy Arnob",
        email: "hr@brightsoft.com",
        password: "employer123",
        role: "employer"
    },
    {
        name: "Shek Armanul",
        email: "recruiter@talenthub.com",
        password: "recruit123",
        role: "recruiter"
    },

    {
        name: "Md. Golam Abid",
        email: "admin@jobportal.com",
        password: "admin123",
        role: "admin"
    }
];


let users = loadList("jpUsers", defaultUsers);

for (const defaultUser of defaultUsers) {
    if (!users.some(user => user.email.toLowerCase() === defaultUser.email.toLowerCase())) {
        users.push(defaultUser);
    }
}
localStorage.setItem("jpUsers", JSON.stringify(users));

if (localStorage.getItem("jpJobs") === null) {
    localStorage.setItem("jpJobs", JSON.stringify([
        {id:"J-001",owner:"hr@brightsoft.com",company:"BrightSoft Ltd",title:"Junior Web Developer",category:"IT",location:"Dhaka",salary:"৳25,000 - ৳35,000",type:"Full-time",deadline:"2026-12-31",description:"HTML, CSS, JavaScript and basic PHP knowledge.",status:"Open"},
        {id:"J-002",owner:"hr@brightsoft.com",company:"BrightSoft Ltd",title:"Frontend Developer Intern",category:"IT",location:"Dhaka",salary:"৳10,000 - ৳15,000",type:"Internship",deadline:"2026-12-20",description:"Basic HTML, CSS and JavaScript.",status:"Open"}
    ]));
}


const fieldIds = [
    "name", "email", "password",
    "confirmPassword", "recruiter", "condition"
];


window.addEventListener("load", function () {

    let form = document.querySelector("form");


    form.noValidate = true;

    form.addEventListener("submit", collectData);

    let labels = document.getElementsByTagName("label");

    for (let i = 0; i < labels.length; i++) {

        if (labels[i].innerHTML.trim() === "Recruiter") {

            labels[i].htmlFor = "recruiter";

        }

    }


    document.getElementById("reset").addEventListener("click", clearAllErrors);

});


function collectData(event) {

    event.preventDefault();

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


    let newUser = {

        name: name,

        email: email,

        password: password,

        role: role.value,

        phone: "",

        education: "",

        skills: "",

        experience: "",

        cv: "",
        company: "",
        designation: "",
        location: "",
        website: ""

    };


    users.push(newUser);

    localStorage.setItem("jpUsers", JSON.stringify(users));

    console.log("New user:", newUser);

    alert("Registration successful! Please login with your email and password.");

    window.location.href = "login.html";

    return true;

}


function emailExists(email) {

    for (const user of users) {

        if (user.email.toLowerCase() === email.toLowerCase()) {

            return true;

        }

    }

    return false;

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


    // Add a red border to text fields

    if (field.type !== "radio" && field.type !== "checkbox") {

        field.style.border = "2px solid red";

    }

}


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


function clearAllErrors() {

    for (let i = 0; i < fieldIds.length; i++) {

        clearError(fieldIds[i]);

    }

}


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

            let label = document.querySelector("label[for='" + fieldId + "']");

            label.parentNode.insertBefore(span, label.nextSibling);

        } else {

            field.parentNode.appendChild(span);

        }

    }

    return span;

}
