/* =====================================================================
   dashboard.js  -  Job Seeker Dashboard (jobseekerdashboard.html)
   ---------------------------------------------------------------------
   1. Writes the job seeker's name and email into the Profile table.
   2. Counts the applications by status with a loop and a switch,
      and writes the numbers into the Application Summary table.

   The data comes from data.js (saved applications are read from localStorage).
   The PHP backend will read MySQL instead.
   ===================================================================== */


// ---------- Profile table ----------
function showProfile() {
  document.getElementById("seekerName").innerHTML = currentSeeker.name;
  document.getElementById("seekerEmail").innerHTML = currentSeeker.email;
}


// ---------- Application summary: one loop, one switch ----------
function showApplicationSummary() {
  let total = 0;
  let pending = 0;
  let shortlisted = 0;
  let rejected = 0;
  let accepted = 0;

  for (const application of applications) {
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

  document.getElementById("totalApps").innerHTML = total;
  document.getElementById("pendingApps").innerHTML = pending;
  document.getElementById("shortlistedApps").innerHTML = shortlisted;
  document.getElementById("rejectedApps").innerHTML = rejected;
  document.getElementById("acceptedApps").innerHTML = accepted;

  console.log("Summary:", total, pending, shortlisted, rejected, accepted);
}


/* =====================================================================
   START
   ===================================================================== */
showProfile();
showApplicationSummary();
