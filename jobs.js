/* =====================================================================
   jobs.js - Find Jobs
   1. Displays available jobs.
   2. Searches by keyword and filters by job type and status.
   3. A job seeker can apply once for each open job.
   ===================================================================== */

function containsText(value, keyword) {
    return String(value).toLowerCase().includes(keyword.toLowerCase());
}

function getJobStatus(job) {
    if (job.status === "Closed") {
        return "Closed";
    }

    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let deadline = new Date(job.deadline + "T00:00:00");

    if (deadline < today) {
        return "Closed";
    }

    return "Open";
}

function alreadyApplied(job) {
    for (let i = 0; i < seekerApplications.length; i++) {
        let application = seekerApplications[i];

        if (application.email === currentSeeker.email && application.jobId === job.id) {
            return true;
        }
    }
    return false;
}

function renderJobs() {
    let keyword = document.getElementById("searchInput").value.trim();
    let jobType = document.getElementById("typeFilter").value;
    let statusFilter = document.getElementById("statusFilter").value;

    let rows = "";
    let shown = 0;

    for (let i = 0; i < seekerJobs.length; i++) {
        let job = seekerJobs[i];
        let status = getJobStatus(job);

        let matchesKeyword = containsText(job.title, keyword) ||
                             containsText(job.company, keyword) ||
                             containsText(job.department, keyword) ||
                             containsText(job.location, keyword);

        let matchesType = (jobType === "All" || job.type === jobType);
        let matchesStatus = (statusFilter === "All" || status === statusFilter);

        if (matchesKeyword && matchesType && matchesStatus) {
            let action;

            if (alreadyApplied(job)) {
                action = "<span style='color:green; font-weight:bold;'>Applied</span>";
            } else if (status === "Closed") {
                action = "<span style='color:grey;'>Closed</span>";
            } else {
                action = "<button type='button' class='btn' onclick='applyJob(" + i + ")'>Apply</button>";
            }

            let statusColor = status === "Open" ? "green" : "red";

            rows += "<tr>" +
                    "<td>" + job.title + "</td>" +
                    "<td>" + job.company + "</td>" +
                    "<td>" + job.department + "</td>" +
                    "<td>" + job.location + "</td>" +
                    "<td>" + job.type + "</td>" +
                    "<td>" + job.salary + "</td>" +
                    "<td>" + job.deadline + "</td>" +
                    "<td style='color:" + statusColor + "; font-weight:bold;'>" + status + "</td>" +
                    "<td>" + action + "</td>" +
                    "</tr>";
            shown++;
        }
    }

    if (shown === 0) {
        rows = "<tr><td colspan='9' class='empty-row'>No jobs match your search.</td></tr>";
    }

    document.getElementById("jobsListBody").innerHTML = rows;
    document.getElementById("jobCount").innerHTML = shown + " job(s) found.";
}

function clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("typeFilter").value = "All";
    document.getElementById("statusFilter").value = "Open";
    document.getElementById("jobMessage").innerHTML = "";
    renderJobs();
}

function applyJob(index) {
    let job = seekerJobs[index];

    if (job === undefined || getJobStatus(job) !== "Open") {
        document.getElementById("jobMessage").innerHTML = "This job is not available.";
        renderJobs();
        return;
    }

    if (alreadyApplied(job)) {
        document.getElementById("jobMessage").innerHTML = "You have already applied for this job.";
        return;
    }

    if (currentSeeker.cv === "") {
        document.getElementById("jobMessage").innerHTML = "Please upload your CV in Update Profile before applying.";
        return;
    }

    let newApplication = {
        id: "A-" + String(seekerApplications.length + 1).padStart(3, "0"),
        jobId: job.id,
        email: currentSeeker.email,
        jobTitle: job.title,
        company: job.company,
        appliedDate: todayString(),
        status: "Pending"
    };

    seekerApplications.push(newApplication);
    document.getElementById("jobMessage").innerHTML = "Your application for " + job.title + " was submitted.";
    renderJobs();
}

function todayString() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
}

renderJobs();
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
