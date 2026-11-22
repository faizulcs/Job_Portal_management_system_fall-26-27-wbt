/* =====================================================================
   dashboard.js  -  Job Seeker Dashboard (jobseekerdashboard.html)
   ---------------------------------------------------------------------
   1. Checks that a job seeker is logged in (otherwise back to Login).
   2. Makes the navbar links open the right pages.
   3. Writes the job seeker's name and email into the Profile table.
   4. Counts the applications by status with a loop and a switch,
      and writes the numbers into the Application Summary table.

   Frontend only: data comes from localStorage (saved by the Login,
   Signup and Profile pages). The PHP backend will read MySQL instead.
   ===================================================================== */


window.addEventListener("load", function () {
    setupNavbar();

    let user = getLoggedInUser();
    if (user === null) {
        return;                       // not logged in: already sent to the Login page
    }

    showProfile(user);
    showApplicationSummary(user);
});


/* ---------------------------------------------------------------------
   PROFILE TABLE
   The page has 14 <td> cells. In order:
     [0] "Name:"  [1] name   [2] "Email:"  [3] email
     [4] "Total Applications:" [5] total   [6] "Pending:" [7] ...
   --------------------------------------------------------------------- */
function showProfile(user) {
    let cells = document.getElementsByTagName("td");
    cells[1].innerHTML = user.name;
    cells[3].innerHTML = user.email;
}


/* ---------------------------------------------------------------------
   APPLICATION SUMMARY: one loop, one switch
   --------------------------------------------------------------------- */
function showApplicationSummary(user) {
    let applications = loadList("jpApplications");

    let total = 0;
    let pending = 0;
    let shortlisted = 0;
    let rejected = 0;
    let accepted = 0;

    for (const application of applications) {
        // Only this job seeker's applications
        if (application.email !== user.email) {
            continue;
        }

        total++;

        switch (application.status) {
            case "Pending":
                pending++;
                break;
            case "Shortlisted":
                shortlisted++;
                break;
            case "Rejected":
                rejected++;
                break;
            case "Accepted":
                accepted++;
                break;
        }
    }

    let cells = document.getElementsByTagName("td");
    cells[5].innerHTML = total;
    cells[7].innerHTML = pending;
    cells[9].innerHTML = shortlisted;
    cells[11].innerHTML = rejected;
    cells[13].innerHTML = accepted;
}


/* =====================================================================
   HELPER FUNCTIONS (the same in every Job Seeker page)
   ===================================================================== */

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

// The navbar links in the HTML point to pages that do not exist
// (jobs.html, applications.html, seeker-profile.html, login.html).
// This sets the right page for each link, using the link's text.
function setupNavbar() {
    let links = document.querySelectorAll(".navbar a");

    for (let i = 0; i < links.length; i++) {
        let text = links[i].innerHTML.trim();

        switch (text) {
            case "Dashboard":
                links[i].href = "dashboard.html";
                break;
            case "My Applications":
                links[i].href = "application.html";
                break;
            case "Update Profile":
                links[i].href = "profile.html";
                break;
            case "Find Jobs":
                links[i].href = "jobs.html";
                break;
            case "Logout":
                links[i].href = "../Portal/login.html";
                links[i].onclick = function () {
                    localStorage.removeItem("jpLoggedIn");
                    alert("You have logged out.");
                    return true;          // then the browser opens the Login page
                };
                break;
        }
    }
}
