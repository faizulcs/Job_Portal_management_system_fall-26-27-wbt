/* =====================================================================
   application.js  -  My Applications (jobseekrapplication.html)
   ---------------------------------------------------------------------
   1. Checks that a job seeker is logged in (otherwise back to Login).
   2. Draws the job seeker's applications into the table inside the
      "Application History" fieldset, with a for loop.
   3. A Pending application can be withdrawn (removed from the array).

   Frontend only: the applications are kept in localStorage.
   The PHP backend will SELECT / DELETE them in MySQL.
   ===================================================================== */


let loggedInUser = null;


window.addEventListener("load", function () {
    setupNavbar();

    loggedInUser = getLoggedInUser();
    if (loggedInUser === null) {
        return;
    }

    // The table has no form button, so stop Enter from sending the form
    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault();
    });

    renderApplications();
});


/* ---------------------------------------------------------------------
   READ: build the table rows
   --------------------------------------------------------------------- */
function renderApplications() {
    let applications = loadList("jpApplications");
    let table = document.querySelector("fieldset table");

    // Header row
    let rows = "<tr>" +
                   headerCell("ID") + headerCell("Job") + headerCell("Company") +
                   headerCell("Applied On") + headerCell("Status") + headerCell("Action") +
               "</tr>";

    let count = 0;

    for (let i = 0; i < applications.length; i++) {
        let app = applications[i];

        if (app.email !== loggedInUser.email) {
            continue;              // someone else's application
        }

        // Colour of the status text
        let color;
        switch (app.status) {
            case "Accepted":
                color = "green";
                break;
            case "Shortlisted":
                color = "blue";
                break;
            case "Rejected":
                color = "red";
                break;
            default:
                color = "darkorange";
        }

        // Only a Pending application can be withdrawn
        let action = "-";
        if (app.status === "Pending") {
            action = "<button type='button' onclick='withdrawApplication(" + i + ")' " +
                     "style='background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;'>" +
                     "Withdraw</button>";
        }

        rows += "<tr style='border-bottom: 1px solid #ccc;'>" +
                    "<td style='white-space: nowrap;'>" + app.id + "</td>" +
                    "<td>" + app.jobTitle + "</td>" +
                    "<td>" + app.company + "</td>" +
                    "<td style='white-space: nowrap;'>" + app.appliedDate + "</td>" +
                    "<td style='color: " + color + "; font-weight: bold;'>" + app.status + "</td>" +
                    "<td>" + action + "</td>" +
                "</tr>";
        count++;
    }

    if (count === 0) {
        rows += "<tr><td colspan='6' style='text-align: center; color: grey;'>You have not applied for any job yet.</td></tr>";
    }

    table.innerHTML = rows;
}

// One blue header cell
function headerCell(text) {
    return "<th style='background-color: blue; color: white; text-align: left; padding: 10px; white-space: nowrap;'>" + text + "</th>";
}


/* ---------------------------------------------------------------------
   DELETE: withdraw a Pending application
   --------------------------------------------------------------------- */
function withdrawApplication(index) {
    let applications = loadList("jpApplications");
    let app = applications[index];

    if (!confirm("Withdraw your application for " + app.jobTitle + " at " + app.company + "?")) {
        return;
    }

    // A new array without this application (slice + concat)
    applications = applications.slice(0, index).concat(applications.slice(index + 1));
    localStorage.setItem("jpApplications", JSON.stringify(applications));

    alert("Application " + app.id + " was withdrawn.");
    renderApplications();
}


/* =====================================================================
   HELPER FUNCTIONS
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

// The navbar links in this page are empty (href="").
// This sets the right page for each link, using the link's text.
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
