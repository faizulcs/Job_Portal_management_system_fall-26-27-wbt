/* =====================================================================
   application.js - My Applications
   1. Displays only the current job seeker's applications.
   2. A Pending application can be withdrawn.
   ===================================================================== */

function renderApplications() {
    let rows = "";
    let count = 0;

    for (let i = 0; i < seekerApplications.length; i++) {
        let application = seekerApplications[i];

        if (application.email === currentSeeker.email) {
            let statusColor;

            switch (application.status) {
                case "Accepted":
                    statusColor = "green";
                    break;
                case "Shortlisted":
                    statusColor = "blue";
                    break;
                case "Rejected":
                    statusColor = "red";
                    break;
                default:
                    statusColor = "orange";
            }

            let action = "-";
            if (application.status === "Pending") {
                action = "<button type='button' class='btn btn-danger' onclick='withdrawApplication(" + i + ")'>Withdraw</button>";
            }

            rows += "<tr>" +
                    "<td>" + application.id + "</td>" +
                    "<td>" + application.jobTitle + "</td>" +
                    "<td>" + application.company + "</td>" +
                    "<td>" + application.appliedDate + "</td>" +
                    "<td style='color:" + statusColor + "; font-weight:bold;'>" + application.status + "</td>" +
                    "<td>" + action + "</td>" +
                    "</tr>";
            count++;
        }
    }

    if (count === 0) {
        rows = "<tr><td colspan='6' class='empty-row'>You have not applied for any job yet.</td></tr>";
    }

    document.getElementById("applicationTableBody").innerHTML = rows;
    document.getElementById("applicationCount").innerHTML = "You have " + count + " application(s).";
}

function withdrawApplication(index) {
    let application = seekerApplications[index];

    if (application === undefined || application.email !== currentSeeker.email || application.status !== "Pending") {
        return;
    }

    if (confirm("Withdraw your application for " + application.jobTitle + "?")) {
        seekerApplications = seekerApplications.slice(0, index).concat(seekerApplications.slice(index + 1));
        document.getElementById("applicationMessage").innerHTML = "Application " + application.id + " was withdrawn.";
        renderApplications();
    }
}

renderApplications();
