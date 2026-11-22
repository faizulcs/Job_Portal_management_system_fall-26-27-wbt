/* =====================================================================
   jobs.js  -  Find Jobs Page (jobs.html)
   ---------------------------------------------------------------------
   1. Checks that a job seeker is logged in (otherwise back to Login).
   2. Sets up the navbar links.
   3. Loads jobs saved by Employer-Management.js from localStorage.
   4. Filters jobs and saves new applications to "jpApplications"
      with status "Pending" so jobseekerdashboard.html counts them.
   ===================================================================== */

const EMPLOYER_STORAGE_KEY = "jobportal_employer_management";
const APPLICATIONS_KEY = "jpApplications";

let currentSeeker = null;

window.addEventListener("load", function () {
    setupNavbar();

    currentSeeker = getLoggedInUser();
    if (currentSeeker === null) {
        return;
    }

    document.getElementById("filterBtn").addEventListener("click", renderJobs);
    document.getElementById("clearFilterBtn").addEventListener("click", clearFilters);
    document.getElementById("searchInput").addEventListener("input", renderJobs);
    document.getElementById("typeFilter").addEventListener("change", renderJobs);
    document.getElementById("statusFilter").addEventListener("change", renderJobs);

    renderJobs();
});


/* ---------------------------------------------------------------------
   LOAD EMPLOYER JOBS
   Employer-Management.js saves { jobs, interviews, feedbacks } under
   "jobportal_employer_management".
   --------------------------------------------------------------------- */
function getEmployerJobs() {
    let text = localStorage.getItem(EMPLOYER_STORAGE_KEY);
    if (text === null) {
        if (typeof defaultEmployerData !== "undefined" && Array.isArray(defaultEmployerData.jobs)) {
            localStorage.setItem(EMPLOYER_STORAGE_KEY, JSON.stringify(defaultEmployerData));
            return defaultEmployerData.jobs;
        }
        return [];
    }

    let data = JSON.parse(text);
    if (!data || !Array.isArray(data.jobs)) {
        return [];
    }

    return data.jobs;
}


/* ---------------------------------------------------------------------
   CHECK IF ALREADY APPLIED
   --------------------------------------------------------------------- */
function alreadyApplied(job, applications) {
    for (const app of applications) {
        if (
            app.email === currentSeeker.email &&
            app.jobTitle === job.title &&
            app.department === job.department
        ) {
            return true;
        }
    }
    return false;
}


/* ---------------------------------------------------------------------
   CLEAR FILTERS
   --------------------------------------------------------------------- */
function clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("typeFilter").value = "All";
    document.getElementById("statusFilter").value = "Open";
    renderJobs();
}


/* ---------------------------------------------------------------------
   RENDER JOBS TABLE
   --------------------------------------------------------------------- */
function renderJobs() {
    let tbody = document.getElementById("jobsListBody");
    let jobs = getEmployerJobs();
    let applications = loadList(APPLICATIONS_KEY);

    let keyword = document.getElementById("searchInput").value.trim().toLowerCase();
    let jobType = document.getElementById("typeFilter").value;
    let statusFilter = document.getElementById("statusFilter").value;

    let rows = "";

    for (let i = 0; i < jobs.length; i++) {
        let job = jobs[i];
        if (!job || job.status === "Draft") {
            continue;
        }

        if (statusFilter !== "All" && job.status !== statusFilter) {
            continue;
        }

        if (jobType !== "All" && job.type !== jobType) {
            continue;
        }

        let text = (
            (job.title || "") + " " +
            (job.department || "") + " " +
            (job.location || "") + " " +
            (job.description || "")
        ).toLowerCase();

        if (keyword !== "" && !text.includes(keyword)) {
            continue;
        }

        let actionHtml = "";
        if (alreadyApplied(job, applications)) {
            actionHtml = "Applied";
        } else if (job.status !== "Open") {
            actionHtml = "Closed";
        } else {
            actionHtml = "<button type='button' onclick='applyJob(" + i + ")'>Apply</button>";
        }

        rows += "<tr>" +
                    "<td>" + job.title + "</td>" +
                    "<td>" + job.department + "</td>" +
                    "<td>" + job.location + "</td>" +
                    "<td>" + job.type + "</td>" +
                    "<td>" + job.salary + "</td>" +
                    "<td>" + job.deadline + "</td>" +
                    "<td>" + job.status + "</td>" +
                    "<td>" + job.description + "</td>" +
                    "<td>" + actionHtml + "</td>" +
                "</tr>";
    }

    if (rows === "") {
        rows = "<tr><td colspan='9'>No jobs found.</td></tr>";
    }

    tbody.innerHTML = rows;
}


/* ---------------------------------------------------------------------
   APPLY FOR A JOB
   Saves to "jpApplications" with status "Pending".
   --------------------------------------------------------------------- */
function applyJob(index) {
    let jobs = getEmployerJobs();
    let job = jobs[index];

    if (!job || job.status !== "Open") {
        alert("This job is not open.");
        return;
    }

    let applications = loadList(APPLICATIONS_KEY);
    if (alreadyApplied(job, applications)) {
        alert("You already applied for this job.");
        return;
    }

    let employerDataText = localStorage.getItem(EMPLOYER_STORAGE_KEY);
    let employerData = employerDataText ? JSON.parse(employerDataText) : null;
    let companyName = (employerData && employerData.companyName) ? employerData.companyName : job.department;
    let today = new Date().toISOString().slice(0, 10);

    let newApp = {
        id: "A-" + Date.now(),
        email: currentSeeker.email,
        name: currentSeeker.name,
        jobTitle: job.title,
        company: companyName,
        department: job.department,
        location: job.location,
        type: job.type,
        salary: job.salary,
        status: "Pending",
        appliedDate: today,
        date: today
    };

    applications.push(newApp);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));

    alert("Application submitted for " + job.title + ".");
    renderJobs();
}


/* =====================================================================
   HELPER FUNCTIONS (same as dashboard.js)
   ===================================================================== */

function loadList(key) {
    let text = localStorage.getItem(key);
    if (text === null) {
        return [];
    }
    return JSON.parse(text);
}

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

function setupNavbar() {
    let links = document.querySelectorAll(".navbar a");

    for (let i = 0; i < links.length; i++) {
        let text = links[i].innerHTML.trim();

        switch (text) {
            case "Dashboard":
                links[i].href = "jobseekerdashboard.html";
                break;
            case "Find Jobs":
                links[i].href = "jobs.html";
                break;
            case "My Applications":
                links[i].href = "jobseekrapplication.html";
                break;
            case "Update Profile":
                links[i].href = "jobseekerprofile.html";
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
