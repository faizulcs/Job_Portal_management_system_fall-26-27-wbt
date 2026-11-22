const DASHBOARD_STORAGE_KEY =
  typeof EMPLOYER_DATA_STORAGE_KEY !== "undefined"
    ? EMPLOYER_DATA_STORAGE_KEY
    : "jobportal_employer_dashboard";

const defaultDashboardState =
  typeof defaultEmployerData !== "undefined"
    ? defaultEmployerData
    : {
        overview: {
          lastLogin: "Today, 09:30 AM",
          pendingReviews: "12 Applications",
          activeCampaigns: "3 Active Campaigns"
        },
        metrics: {
          activeJobs: 5,
          totalApplicants: 120,
          shortlisted: 18
        },
        goal: {
          hiredCount: 3,
          targetCount: 7,
          period: "This year"
        },
        hiredCandidates: [
          { name: "Nadia Islam", source: "Portal" },
          { name: "Arnob Roy", source: "Portal" },
          { name: "Tanvir Ahmed", source: "Referral" }
        ],
        announcement: {
          title: "Interview Schedule Update",
          date: "2026-11-20",
          details: "Technical screening slots for frontend candidates open this week."
        }
      };

const metricFields = ["activeJobsCount", "totalApplicantsCount", "shortlistedCount"];
const goalFields = ["hiringTargetCount", "hiringPeriod"];
const hiredFields = ["hiredCandidateName"];
const noticeFields = ["noticeTitle", "noticeDate", "noticeDetails"];

let rawDashboardState = localStorage.getItem(DASHBOARD_STORAGE_KEY);
let dashboardState = rawDashboardState !== null ? JSON.parse(rawDashboardState) : defaultDashboardState;

if (!dashboardState.goal) {
  dashboardState.goal = Object.assign({}, defaultDashboardState.goal);
} else if (dashboardState.goal.period === "This semester") {
  dashboardState.goal.period = "This year";
}

if (!Array.isArray(dashboardState.hiredCandidates)) {
  dashboardState.hiredCandidates = defaultDashboardState.hiredCandidates.slice();
}

function showError(fieldId, message) {
  let errorEl = document.getElementById(fieldId + "Error");
  if (errorEl != null) {
    errorEl.innerHTML = message;
  }

  let field = document.getElementById(fieldId);
  if (field != null) {
    field.style.border = "2px solid red";
  }
}

function clearError(fieldId) {
  let errorEl = document.getElementById(fieldId + "Error");
  if (errorEl != null) {
    errorEl.innerHTML = "";
  }

  let field = document.getElementById(fieldId);
  if (field != null) {
    field.style.border = "";
  }
}

function clearErrors(fieldIds) {
  for (let i = 0; i < fieldIds.length; i++) {
    clearError(fieldIds[i]);
  }
}

function showMessage(boxId, text, type) {
  let box = document.getElementById(boxId);
  if (box != null) {
    box.innerHTML = text;
    box.className = "message " + type;
    box.style.display = "block";
  }
}

function hideMessage(boxId) {
  let box = document.getElementById(boxId);
  if (box != null) {
    box.style.display = "none";
  }
}

function syncHiredCountWithGoal() {
  dashboardState.goal.hiredCount = dashboardState.hiredCandidates.length;
}

function renderHiredCandidates() {
  let listEl = document.getElementById("hiredCandidatesList");
  let items = "";

  for (let i = 0; i < dashboardState.hiredCandidates.length; i++) {
    let entry = dashboardState.hiredCandidates[i];
    let badgeClass = entry.source === "Portal" ? "badge-primary" : "badge-secondary";
    items += "<li>" +
               "<span>" + entry.name + "</span>" +
               "<span class='source-badge " + badgeClass + "'>" + entry.source + "</span>" +
             "</li>";
  }

  if (items === "") {
    items = "<li class='empty-item'>No candidates hired yet.</li>";
  }

  listEl.innerHTML = items;
}

function renderHiringGoal() {
  let goal = dashboardState.goal || defaultDashboardState.goal;
  let hired = Math.max(0, Number(goal.hiredCount) || 0);
  let target = Math.max(1, Number(goal.targetCount) || 1);
  let period = goal.period === "This semester" || !goal.period ? "This year" : goal.period;

  let pct = Math.min(100, Math.round((hired / target) * 100));
  let bar = document.getElementById("hiringProgressBar");
  let textEl = document.getElementById("hiringProgressText");
  let noteEl = document.getElementById("hiringProgressNote");

  textEl.innerHTML = "You have hired <strong>" + hired + "</strong> of <strong>" + target + "</strong> candidates " + period.toLowerCase() + ".";
  bar.style.width = pct + "%";
  bar.innerHTML = pct + "%";

  if (pct >= 100) {
    noteEl.innerHTML = "Goal reached! Great hiring pace.";
  } else if (pct >= 50) {
    noteEl.innerHTML = "Halfway there. Keep screening and scheduling interviews.";
  } else {
    noteEl.innerHTML = "A good start. Stay consistent with candidate reviews.";
  }
}

function populateDashboard() {
  let overview = dashboardState.overview || defaultDashboardState.overview;
  let metrics = dashboardState.metrics || defaultDashboardState.metrics;
  let goal = dashboardState.goal || defaultDashboardState.goal;
  let announcement = dashboardState.announcement || defaultDashboardState.announcement;

  syncHiredCountWithGoal();

  document.getElementById("lastLogin").value = overview.lastLogin;
  document.getElementById("pendingReviews").value = overview.pendingReviews;
  document.getElementById("activeCampaigns").value = overview.activeCampaigns;

  document.getElementById("activeJobsCount").value = metrics.activeJobs;
  document.getElementById("totalApplicantsCount").value = metrics.totalApplicants;
  document.getElementById("shortlistedCount").value = metrics.shortlisted;

  document.getElementById("hiringTargetCount").value = goal.targetCount;
  document.getElementById("hiringPeriod").value = goal.period;

  document.getElementById("noticeTitle").value = announcement.title;
  document.getElementById("noticeDate").value = announcement.date;
  document.getElementById("noticeDetails").value = announcement.details;

  renderHiredCandidates();
  renderHiringGoal();
}

function persistDashboardState() {
  localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(dashboardState));
}

function addHiredCandidate() {
  let nameInput = document.getElementById("hiredCandidateName");
  let name = nameInput.value.trim();

  clearErrors(hiredFields);
  hideMessage("dashboardMessage");

  if (name.length < 2) {
    showError("hiredCandidateName", "Candidate name must be at least 2 characters.");
    showMessage("dashboardMessage", "Please enter a valid candidate name.", "error");
    return false;
  }

  dashboardState.hiredCandidates.push({
    name: name,
    source: "Referral"
  });
  syncHiredCountWithGoal();
  persistDashboardState();

  nameInput.value = "";
  renderHiredCandidates();
  renderHiringGoal();
  showMessage("dashboardMessage", "Added <strong>" + name + "</strong> to hired candidates.", "success");
  return false;
}

function removeLastHiredCandidate() {
  clearErrors(hiredFields);
  hideMessage("dashboardMessage");

  let removableIndex = -1;
  for (let i = dashboardState.hiredCandidates.length - 1; i >= 0; i--) {
    if (dashboardState.hiredCandidates[i].source !== "Portal") {
      removableIndex = i;
      break;
    }
  }

  if (removableIndex === -1) {
    let field = document.getElementById("hiredCandidateName");
    if (field != null) {
      field.style.border = "2px solid red";
    }
    showMessage("dashboardMessage", "There is nothing to remove.", "error");
    return;
  }

  let removed = dashboardState.hiredCandidates.splice(removableIndex, 1)[0];
  syncHiredCountWithGoal();
  persistDashboardState();

  renderHiredCandidates();
  renderHiringGoal();
  showMessage("dashboardMessage", "Removed <strong>" + removed.name + "</strong> from hired candidates.", "info");
}

function saveHiringGoal() {
  let targetRaw = document.getElementById("hiringTargetCount").value.trim();
  let target = Number(targetRaw);
  let period = document.getElementById("hiringPeriod").value;

  let isValid = true;
  clearErrors(goalFields);
  hideMessage("dashboardMessage");

  if (targetRaw === "" || isNaN(target) || target < 1) {
    showError("hiringTargetCount", "Target must be at least 1.");
    isValid = false;
  }

  if (period === "") {
    showError("hiringPeriod", "Please select a time period.");
    isValid = false;
  }

  if (isValid === false) {
    showMessage("dashboardMessage", "Please fix the fields marked in red.", "error");
    return false;
  }

  dashboardState.goal.targetCount = target;
  dashboardState.goal.period = period;
  syncHiredCountWithGoal();

  persistDashboardState();
  renderHiringGoal();
  showMessage("dashboardMessage", "Hiring goal updated (" + period + ").", "success");
  return false;
}

function updateMetrics() {
  let activeJobsRaw = document.getElementById("activeJobsCount").value.trim();
  let totalApplicantsRaw = document.getElementById("totalApplicantsCount").value.trim();
  let shortlistedRaw = document.getElementById("shortlistedCount").value.trim();

  let activeJobs = Number(activeJobsRaw);
  let totalApplicants = Number(totalApplicantsRaw);
  let shortlisted = Number(shortlistedRaw);

  let isValid = true;
  clearErrors(metricFields);
  hideMessage("dashboardMessage");

  if (activeJobsRaw === "" || isNaN(activeJobs) || activeJobs < 0) {
    showError("activeJobsCount", "Active jobs must be 0 or greater.");
    isValid = false;
  }

  if (totalApplicantsRaw === "" || isNaN(totalApplicants) || totalApplicants < 0) {
    showError("totalApplicantsCount", "Total applicants must be 0 or greater.");
    isValid = false;
  }

  if (shortlistedRaw === "" || isNaN(shortlisted) || shortlisted < 0) {
    showError("shortlistedCount", "Shortlisted candidates must be 0 or greater.");
    isValid = false;
  }

  if (isValid === false) {
    showMessage("dashboardMessage", "Please fix the fields marked in red.", "error");
    return false;
  }

  dashboardState.metrics = {
    activeJobs: activeJobs,
    totalApplicants: totalApplicants,
    shortlisted: shortlisted
  };
  dashboardState.overview.pendingReviews = Math.max(0, totalApplicants - shortlisted) + " Applications";
  dashboardState.overview.activeCampaigns = activeJobs + " Active Campaigns";

  persistDashboardState();
  populateDashboard();
  showMessage("dashboardMessage", "Job statistics updated successfully.", "success");
  return false;
}

function saveAnnouncement() {
  let title = document.getElementById("noticeTitle").value.trim();
  let date = document.getElementById("noticeDate").value;
  let details = document.getElementById("noticeDetails").value.trim();

  let isValid = true;
  clearErrors(noticeFields);
  hideMessage("dashboardMessage");

  if (title.length < 3) {
    showError("noticeTitle", "Notice title must be at least 3 characters.");
    isValid = false;
  }

  if (date === "") {
    showError("noticeDate", "Please select a date.");
    isValid = false;
  }

  if (details.length < 5) {
    showError("noticeDetails", "Details must be at least 5 characters.");
    isValid = false;
  }

  if (isValid === false) {
    showMessage("dashboardMessage", "Please fix the fields marked in red.", "error");
    return false;
  }

  dashboardState.announcement = {
    title: title,
    date: date,
    details: details
  };

  persistDashboardState();
  showMessage("dashboardMessage", "Announcement saved: <strong>" + title + "</strong>.", "success");
  return false;
}

populateDashboard();