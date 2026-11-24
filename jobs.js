/* =====================================================================
   jobs.js  -  Find Jobs (jobs.html)
   ---------------------------------------------------------------------
   1. The jobs are the ones the EMPLOYER added in Employer-Management
      (getEmployerJobs() in data.js). Draft jobs are not shown.
   2. renderJobs() loops over the jobs and builds the table rows. Rows
      that do not match the keyword / job type / status are skipped.
   3. The Search, Clear buttons and the filters call renderJobs().
   4. applyJob() checks the rules, then push()es a new object into the
      applications array with the status "Pending" and saves it.

   The PHP backend will use SELECT ... LIKE ? and INSERT instead.
   ===================================================================== */


// A job is really open only when its status is Open AND the deadline has not passed
function getJobStatus(job) {
  if (job.status === "Closed") {
    return "Closed";
  }
  if (daysBetween(todayString(), job.deadline) < 0) {
    return "Closed";
  }
  return "Open";
}

// true when this job seeker already has an application for this job
function alreadyApplied(job) {
  for (const app of applications) {
    if (app.jobTitle === job.title && app.department === job.department) {
      return true;
    }
  }
  return false;
}


/* ---------------------------------------------------------------------
   READ + SEARCH: build the table rows
   --------------------------------------------------------------------- */
function renderJobs() {
  let jobs = getEmployerJobs();
  let keyword = document.getElementById("searchInput").value.trim();
  let jobType = document.getElementById("typeFilter").value;
  let statusFilter = document.getElementById("statusFilter").value;

  let rows = "";
  let shown = 0;

  for (let i = 0; i < jobs.length; i++) {
    let job = jobs[i];

    // The Employer's drafts are not published yet
    if (job.status === "Draft") {
      continue;
    }

    let status = getJobStatus(job);

    let matchesKeyword = containsText(job.title, keyword) || containsText(job.department, keyword) ||
                         containsText(job.location, keyword) || containsText(job.description, keyword);
    let matchesType = (jobType === "All" || job.type === jobType);
    let matchesStatus = (statusFilter === "All" || status === statusFilter);

    if (matchesKeyword && matchesType && matchesStatus) {
      // What the Action column shows
      let action;
      if (alreadyApplied(job)) {
        action = "<span style='color: green; font-weight: bold;'>Applied</span>";
      } else if (status === "Closed") {
        action = "<span style='color: grey;'>Closed</span>";
      } else {
        action = "<button type='button' onclick='applyJob(" + i + ")'>Apply</button>";
      }

      let statusColor = (status === "Open") ? "green" : "red";

      rows += "<tr>" +
                "<td><strong>" + safe(job.title) + "</strong></td>" +
                "<td>" + safe(job.department) + "</td>" +
                "<td>" + safe(job.location) + "</td>" +
                "<td>" + safe(job.type) + "</td>" +
                "<td>" + safe(job.salary) + "</td>" +
                "<td>" + safe(job.deadline) + "</td>" +
                "<td style='color: " + statusColor + "; font-weight: bold;'>" + status + "</td>" +
                "<td>" + safe(job.description) + "</td>" +
                "<td>" + action + "</td>" +
              "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='9' style='text-align: center; color: grey;'>No jobs match your search.</td></tr>";
  }

  document.getElementById("jobsListBody").innerHTML = rows;
  document.getElementById("jobCount").innerHTML = shown + " job(s) found";
}


// The Clear button: back to the starting filters
function clearFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("typeFilter").value = "All";
  document.getElementById("statusFilter").value = "Open";
  hideMessage("jobMessage");
  renderJobs();
}


/* ---------------------------------------------------------------------
   CREATE: apply for a job
   --------------------------------------------------------------------- */
function applyJob(index) {
  let jobs = getEmployerJobs();
  let job = jobs[index];

  if (job === undefined || job.status === "Draft") {
    showMessage("jobMessage", "This job is not available any more.", "error");
    renderJobs();
    return;
  }

  if (getJobStatus(job) !== "Open") {
    showMessage("jobMessage", "This job is closed. You cannot apply.", "error");
    return;
  }

  if (alreadyApplied(job)) {
    showMessage("jobMessage", "You already applied for this job.", "error");
    return;
  }

  // A job seeker must have a CV in the profile before applying
  if (currentSeeker.cv === "") {
    showMessage("jobMessage", "Please upload your CV in Update Profile before you apply.", "error");
    return;
  }

  let newApplication = {
    id: nextId("A", loadList(APPLICATIONS_KEY, [])),
    email: currentSeeker.email,
    name: currentSeeker.name,
    jobTitle: job.title,
    department: job.department,
    company: getCompanyName(),
    appliedDate: todayString(),
    status: "Pending"
  };

  applications.push(newApplication);
  saveApplications();                  // keep it for the other pages
  console.log("New application:", newApplication);

  showMessage("jobMessage", "Application " + newApplication.id + " for <strong>" + safe(job.title) + "</strong> was sent.", "success");
  renderJobs();
}


/* =====================================================================
   START
   ===================================================================== */
renderJobs();
