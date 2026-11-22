const sections = ["dashboardSection", "applicationSection", "shortlistSection", "interviewSection", "jobSection"];

const MIN_SHORTLIST_RATING = 3;     // an application needs a rating of 3+ to be shortlisted
const statusList = ["Pending", "Under Review", "Shortlisted", "Rejected", "Hired"];

let editAppId = "";                 // "" = adding, otherwise the id being edited
let editInterviewId = "";
let editJobId = "";
let reviewAppId = "";               // the application open in the Review Panel

const appFields = ["appName", "appEmail", "appPhone", "appJob", "appExperience", "appEducation", "appSalary", "appSkills", "appDate"];
const interviewFields = ["interviewApp", "interviewDate", "interviewTime", "interviewMode", "interviewer", "interviewPlace"];
const jobFields = ["jobTitle", "jobDepartment", "jobLocation", "jobType", "jobVacancies", "jobDeadline"];
const reviewFields = ["reviewStatus", "reviewRating", "reviewNotes"];


/* =====================================================================
   2. HELPER FUNCTIONS (same ones as common.js)
   ===================================================================== */
function showSection(sectionId) {
  for (let i = 0; i < sections.length; i++) {
    let section = document.getElementById(sections[i]);
    if (section == null) { continue; }      // this page does not have that section
    section.style.display = (sections[i] === sectionId) ? "block" : "none";
  }
  window.scrollTo(0, 0);
}

function showError(fieldId, message) {
  let errorBox = document.getElementById(fieldId + "Error");
  if (errorBox !== null) { errorBox.innerHTML = message; }
  let field = document.getElementById(fieldId);
  if (field != null) {
    field.style.border = "2px solid red";
  }
}

function clearError(fieldId) {
  let errorBox = document.getElementById(fieldId + "Error");
  if (errorBox !== null) { errorBox.innerHTML = ""; }
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

// Red banner at the top of the page for unexpected JavaScript problems
function showPageError(text) {
  let box = document.getElementById("pageError");
  if (box === null) { return; }
  box.innerHTML = "<strong>Error:</strong> " + safe(text);
  box.className = "message error";
  box.style.display = "block";
}

window.addEventListener("error", function (event) {
  showPageError(event.message);
});

function showMessage(boxId, text, type) {
  let box = document.getElementById(boxId);
  box.innerHTML = text;
  box.className = "message " + type;
  box.style.display = "block";
}

function hideMessage(boxId) {
  document.getElementById(boxId).style.display = "none";
}

function isEmpty(value) {
  return value.trim() === "";
}

function isValidEmail(email) {
  let atPosition = email.indexOf("@");
  let dotPosition = email.indexOf(".", atPosition);
  if (atPosition < 1) { return false; }
  if (dotPosition < atPosition + 2) { return false; }
  if (dotPosition === email.length - 1) { return false; }
  return true;
}

function isDigitsOnly(text) {
  if (text.length === 0) { return false; }
  let digits = "0123456789";
  for (let i = 0; i < text.length; i++) {
    if (digits.indexOf(text[i]) === -1) { return false; }
  }
  return true;
}

function getRadioValue(groupName) {
  let radios = document.getElementsByName(groupName);
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) { return radios[i].value; }
  }
  return "";
}

function setRadioValue(groupName, value) {
  let radios = document.getElementsByName(groupName);
  for (let i = 0; i < radios.length; i++) {
    radios[i].checked = (radios[i].value === value);
  }
}

function containsText(text, keyword) {
  return String(text).toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
}

function findIndexById(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) { return i; }
  }
  return -1;
}

function removeAt(list, index) {
  return list.slice(0, index).concat(list.slice(index + 1));
}

function nextId(prefix, list) {
  let biggest = 0;
  let digits = 3;
  for (let i = 0; i < list.length; i++) {
    let numberText = list[i].id.slice(prefix.length + 1);
    digits = numberText.length;
    if (Number(numberText) > biggest) { biggest = Number(numberText); }
  }
  let newNumber = String(biggest + 1);
  while (newNumber.length < digits) { newNumber = "0" + newNumber; }
  return prefix + "-" + newNumber;
}

function pad(number) {
  return number < 10 ? "0" + number : "" + number;
}

function todayString() {
  let now = new Date();
  return now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
}

function addDays(dateText, days) {
  let date = new Date(dateText + "T00:00");
  date.setDate(date.getDate() + days);
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}

function daysBetween(firstDate, secondDate) {
  let oneDay = 1000 * 60 * 60 * 24;
  let difference = new Date(secondDate + "T00:00") - new Date(firstDate + "T00:00");
  return Math.round(difference / oneDay);
}

function nowString() {
  let now = new Date();
  return todayString() + " " + pad(now.getHours()) + ":" + pad(now.getMinutes());
}

// Makes user text safe to put inside innerHTML
function safe(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Adds one <option> to a <select> (createElement + appendChild)
function addOption(select, value, text) {
  let option = document.createElement("option");
  option.value = value;
  option.innerHTML = safe(text);
  select.appendChild(option);
}

function statusColor(status) {
  if (status === "Pending") { return "orange"; }
  if (status === "Under Review") { return "blue"; }
  if (status === "Shortlisted") { return "green"; }
  if (status === "Rejected") { return "red"; }
  if (status === "Hired") { return "purple"; }
  if (status === "Scheduled") { return "blue"; }
  if (status === "Completed") { return "green"; }
  if (status === "Cancelled") { return "grey"; }
  if (status === "Open") { return "green"; }
  return "grey";
}

function statusBadge(status) {
  return "<span class='badge " + statusColor(status) + "'>" + status + "</span>";
}

function starsText(rating) {
  if (rating === 0) { return "<span class='hint'>Not rated</span>"; }
  let html = "<span class='stars'>";
  for (let i = 1; i <= 5; i++) {
    html += (i <= rating) ? "&#9733;" : "<span class='off'>&#9733;</span>";
  }
  return html + "</span>";
}

function skillTags(skills) {
  let parts = skills.split(",");
  let html = "";
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].trim() !== "") {
      html += "<span class='skill-tag'>" + safe(parts[i].trim()) + "</span>";
    }
  }
  return html;
}

function logActivity(type, message) {
  activityLog.unshift({ time: nowString(), user: "recruiter", type: type, message: message });
}


/* =====================================================================
   1. SAMPLE DATA (dates are relative to today so the demo always works)
   ===================================================================== */
let today = todayString();

let jobs = [
  { id: "J-101", title: "Frontend Developer",   department: "Engineering",      location: "Dhaka",      type: "Full Time",  vacancies: 2, deadline: addDays(today, 20), status: "Open" },
  { id: "J-102", title: "UI/UX Designer",       department: "Design",           location: "Dhaka",      type: "Full Time",  vacancies: 1, deadline: addDays(today, 12), status: "Open" },
  { id: "J-103", title: "Digital Marketer",     department: "Marketing",        location: "Chattogram", type: "Part Time",  vacancies: 3, deadline: addDays(today, 30), status: "Open" },
  { id: "J-104", title: "Accounts Executive",   department: "Finance",          location: "Dhaka",      type: "Full Time",  vacancies: 1, deadline: addDays(today, -5), status: "Closed" },
  { id: "J-105", title: "Backend Intern",       department: "Engineering",      location: "Remote",     type: "Internship", vacancies: 4, deadline: addDays(today, 15), status: "Open" }
];

let applications = [
  { id: "A-001", jobId: "J-101", name: "Rahim Uddin",     email: "rahim@mail.com",   phone: "01711000101", experience: 3, education: "Bachelor", salary: 55000, skills: "HTML, CSS, JavaScript, React", appliedDate: addDays(today, -9), status: "Shortlisted", rating: 5, notes: "Strong portfolio and clean code." },
  { id: "A-002", jobId: "J-101", name: "Nadia Rahman",    email: "nadia@mail.com",   phone: "01711000102", experience: 2, education: "Bachelor", salary: 45000, skills: "HTML, CSS, Vue",              appliedDate: addDays(today, -8), status: "Shortlisted", rating: 4, notes: "Good fundamentals." },
  { id: "A-003", jobId: "J-101", name: "Tanvir Ahmed",    email: "tanvir@mail.com",  phone: "01711000103", experience: 1, education: "Diploma",  salary: 30000, skills: "HTML, CSS",                   appliedDate: addDays(today, -6), status: "Under Review", rating: 2, notes: "Needs more JavaScript." },
  { id: "A-004", jobId: "J-102", name: "Sadia Islam",     email: "sadia@mail.com",   phone: "01711000104", experience: 4, education: "Master",   salary: 60000, skills: "Figma, Adobe XD, Research",   appliedDate: addDays(today, -7), status: "Shortlisted", rating: 5, notes: "Excellent case studies." },
  { id: "A-005", jobId: "J-102", name: "Imran Hossain",   email: "imran@mail.com",   phone: "01711000105", experience: 0, education: "Bachelor", salary: 25000, skills: "Photoshop, Figma",            appliedDate: addDays(today, -3), status: "Pending", rating: 0, notes: "" },
  { id: "A-006", jobId: "J-103", name: "Farhana Kabir",   email: "farhana@mail.com", phone: "01711000106", experience: 2, education: "Bachelor", salary: 28000, skills: "SEO, Social Media, Ads",      appliedDate: addDays(today, -5), status: "Under Review", rating: 3, notes: "Decent campaign results." },
  { id: "A-007", jobId: "J-103", name: "Jamal Uddin",     email: "jamal@mail.com",   phone: "01711000107", experience: 1, education: "HSC",      salary: 18000, skills: "Facebook Ads",                appliedDate: addDays(today, -2), status: "Rejected", rating: 1, notes: "Does not meet minimum requirements." },
  { id: "A-008", jobId: "J-104", name: "Mitu Sarker",     email: "mitu@mail.com",    phone: "01711000108", experience: 5, education: "Master",   salary: 50000, skills: "Tally, Excel, Auditing",      appliedDate: addDays(today, -25), status: "Hired", rating: 5, notes: "Hired after final round." },
  { id: "A-009", jobId: "J-105", name: "Arif Chowdhury",  email: "arif@mail.com",    phone: "01711000109", experience: 0, education: "Bachelor", salary: 15000, skills: "Node.js, SQL, Git",           appliedDate: addDays(today, -4), status: "Shortlisted", rating: 4, notes: "Good projects for a fresher." },
  { id: "A-010", jobId: "J-105", name: "Lamia Akter",     email: "lamia@mail.com",   phone: "01711000110", experience: 0, education: "Bachelor", salary: 15000, skills: "PHP, MySQL",                  appliedDate: addDays(today, -1), status: "Pending", rating: 0, notes: "" },
  { id: "A-011", jobId: "J-101", name: "Sabbir Khan",     email: "sabbir@mail.com",  phone: "01711000111", experience: 6, education: "Master",   salary: 90000, skills: "React, TypeScript, Node.js",  appliedDate: addDays(today, -1), status: "Pending", rating: 0, notes: "" }
];

let interviews = [
  { id: "I-001", appId: "A-001", date: addDays(today, 1), time: "10:00", mode: "Onsite", interviewer: "Mr. Kabir Hasan",   place: "Room 204",                    status: "Scheduled", feedback: "" },
  { id: "I-002", appId: "A-004", date: addDays(today, 2), time: "11:30", mode: "Online", interviewer: "Ms. Shirin Akter",  place: "https://meet.example.com/x1", status: "Scheduled", feedback: "" },
  { id: "I-003", appId: "A-002", date: today,             time: "15:00", mode: "Phone",  interviewer: "Mr. Kabir Hasan",   place: "01711000102",                 status: "Scheduled", feedback: "" },
  { id: "I-004", appId: "A-008", date: addDays(today, -10), time: "14:00", mode: "Onsite", interviewer: "Ms. Shirin Akter", place: "Room 101",                   status: "Completed", feedback: "Very strong. Recommended to hire." }
];

let activityLog = [
  { time: addDays(today, -2) + " 09:10", user: "recruiter", type: "Job",       message: "Opened job: Backend Intern (J-105)" },
  { time: addDays(today, -1) + " 11:25", user: "recruiter", type: "Review",    message: "Rated Rahim Uddin 5 stars and shortlisted" },
  { time: addDays(today, -1) + " 16:40", user: "recruiter", type: "Interview", message: "Scheduled interview I-001 for Rahim Uddin" }
];


/* ---------- keep the data between pages (localStorage) ---------- */
const STORAGE_KEY = "rmData";

function loadData() {
  try {
    let text = localStorage.getItem(STORAGE_KEY);
    if (text === null) { return; }
    let saved = JSON.parse(text);
    if (Array.isArray(saved.jobs) && Array.isArray(saved.applications) &&
        Array.isArray(saved.interviews) && Array.isArray(saved.activityLog)) {
      jobs = saved.jobs;
      applications = saved.applications;
      interviews = saved.interviews;
      activityLog = saved.activityLog;
    }
  } catch (error) {
    showPageError("Saved data could not be read, so the sample data is shown. (" + error.message + ")");
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ jobs: jobs, applications: applications, interviews: interviews, activityLog: activityLog }));
  } catch (error) {
    showPageError("Changes could not be saved in this browser. (" + error.message + ")");
  }
}

loadData();


/* =====================================================================
   LOOK-UP HELPERS
   ===================================================================== */
function findApp(id) {
  let index = findIndexById(applications, id);
  return index === -1 ? null : applications[index];
}

function findJob(id) {
  let index = findIndexById(jobs, id);
  return index === -1 ? null : jobs[index];
}

function jobTitleOf(jobId) {
  let job = findJob(jobId);
  return job === null ? "(deleted job)" : job.title;
}

function nameOf(appId) {
  let app = findApp(appId);
  return app === null ? "(deleted)" : app.name;
}

function countApplicationsOfJob(jobId) {
  let count = 0;
  for (const app of applications) {
    if (app.jobId === jobId) { count++; }
  }
  return count;
}

// Changes a status. Interviews that are still "Scheduled" are cancelled
// when the candidate leaves the shortlist. Returns how many were cancelled.
function setStatus(app, newStatus) {
  let cancelled = 0;
  if (app.status === "Shortlisted" && newStatus !== "Shortlisted" && newStatus !== "Hired") {
    for (const interview of interviews) {
      if (interview.appId === app.id && interview.status === "Scheduled") {
        interview.status = "Cancelled";
        cancelled++;
      }
    }
  }
  app.status = newStatus;
  return cancelled;
}

function onPage(id) {
  return document.getElementById(id) !== null;
}

function refreshAll() {
  if (onPage("appJob")) { fillJobSelects(); }
  if (onPage("appTableBody")) { renderApplications(); }
  if (onPage("shortlistBody")) { renderShortlist(); fillShortlistSelect(); }
  if (onPage("interviewBody")) { fillInterviewSelect(""); renderInterviews(); }
  if (onPage("jobBody")) { renderJobs(); }
  if (onPage("statTotal")) { renderDashboard(); }
  saveData();
}


/* =====================================================================
   3. DASHBOARD
   ===================================================================== */
function upcomingInterviews() {
  let list = [];
  for (const interview of interviews) {
    if (interview.status === "Scheduled" && interview.date >= todayString()) {
      list.push(interview);
    }
  }
  list.sort(function (a, b) {
    return (a.date + a.time) < (b.date + b.time) ? -1 : 1;
  });
  return list;
}

function renderDashboard() {
  let counts = { "Pending": 0, "Under Review": 0, "Shortlisted": 0, "Rejected": 0, "Hired": 0 };
  for (const app of applications) {
    counts[app.status]++;
  }

  let openJobs = 0;
  for (const job of jobs) {
    if (job.status === "Open") { openJobs++; }
  }

  let upcoming = upcomingInterviews();

  document.getElementById("statTotal").innerHTML = applications.length;
  document.getElementById("statPending").innerHTML = counts["Pending"] + counts["Under Review"];
  document.getElementById("statShortlisted").innerHTML = counts["Shortlisted"];
  document.getElementById("statUpcoming").innerHTML = upcoming.length;
  document.getElementById("statOpenJobs").innerHTML = openJobs;

  // Pipeline bars
  let barColors = { "Pending": "#EF6C00", "Under Review": "#1565C0", "Shortlisted": "#2E7D32", "Rejected": "#C62828", "Hired": "#663399" };
  let bars = "";
  for (let i = 0; i < statusList.length; i++) {
    let status = statusList[i];
    let percent = applications.length === 0 ? 0 : Math.round(counts[status] * 100 / applications.length);
    bars += "<div class='bar-row'>" +
              "<div class='bar-label'>" + status + "</div>" +
              "<div class='bar-track'><div class='bar-fill' style='width:" + percent + "%; background-color:" + barColors[status] + "'></div></div>" +
              "<div class='bar-value'>" + counts[status] + "</div>" +
            "</div>";
  }
  document.getElementById("pipelineBars").innerHTML = bars;

  // Upcoming interviews (max 5)
  let html = "";
  for (let i = 0; i < upcoming.length && i < 5; i++) {
    let interview = upcoming[i];
    let isToday = interview.date === todayString();
    html += "<div class='upcoming-item" + (isToday ? " today" : "") + "'>" +
              "<div><strong>" + safe(nameOf(interview.appId)) + "</strong>" +
              "<small>" + safe(jobTitleOf(findApp(interview.appId).jobId)) + " &middot; " + interview.mode + "</small></div>" +
              "<div style='text-align:right'><strong>" + (isToday ? "Today" : interview.date) + "</strong><small>" + interview.time + "</small></div>" +
            "</div>";
  }
  if (html === "") {
    html = "<p class='hint'>No upcoming interviews.</p>";
  }
  document.getElementById("upcomingList").innerHTML = html;

  // Activity log (createElement + appendChild)
  let box = document.getElementById("activityBox");
  box.innerHTML = "";
  for (const entry of activityLog) {
    let item = document.createElement("div");
    item.className = "log-item";
    item.innerHTML = "<span class='log-time'>" + entry.time + " &middot; " + entry.type + "</span><br>" + safe(entry.message);
    box.appendChild(item);
  }
}


/* =====================================================================
   4. APPLICATIONS: CREATE, READ, UPDATE, DELETE, SEARCH + REVIEW
   ===================================================================== */

// Fills every job drop-down on the page
function fillJobSelects() {
  let formSelect = document.getElementById("appJob");
  if (formSelect !== null) {
    let keepForm = formSelect.value;
    formSelect.innerHTML = "";
    addOption(formSelect, "", "-- Select Job --");
    for (const job of jobs) {
      // closed jobs are hidden, except when editing an application of that job
      let currentJob = (editAppId !== "" && findApp(editAppId) !== null) ? findApp(editAppId).jobId : "";
      if (job.status === "Open" || job.id === currentJob) {
        addOption(formSelect, job.id, job.title + " (" + job.id + ")");
      }
    }
    formSelect.value = keepForm;
  }

  let filterIds = ["appJobFilter", "shortlistJobFilter"];
  for (let i = 0; i < filterIds.length; i++) {
    let select = document.getElementById(filterIds[i]);
    if (select === null) { continue; }
    let keep = select.value === "" ? "All" : select.value;
    select.innerHTML = "";
    addOption(select, "All", "All jobs");
    for (const job of jobs) {
      addOption(select, job.id, job.title);
    }
    select.value = keep;
    if (select.value === "") { select.value = "All"; }
  }
}

// READ + SEARCH
function renderApplications() {
  let keyword = document.getElementById("appSearch").value;
  let statusFilter = document.getElementById("appStatusFilter").value;
  let jobFilter = document.getElementById("appJobFilter").value;

  let rows = "";
  let shown = 0;

  for (const app of applications) {
    let matchesKeyword = containsText(app.name, keyword) || containsText(app.email, keyword) ||
                         containsText(app.skills, keyword) || containsText(app.id, keyword);
    let matchesStatus = (statusFilter === "All" || app.status === statusFilter);
    let matchesJob = (jobFilter === "All" || app.jobId === jobFilter);

    if (matchesKeyword && matchesStatus && matchesJob) {
      rows += "<tr>" +
                "<td>" + app.id + "</td>" +
                "<td><strong>" + safe(app.name) + "</strong><br><span class='hint'>" + safe(app.email) + "<br>" + app.phone + "</span></td>" +
                "<td>" + safe(jobTitleOf(app.jobId)) + "<br><span class='hint'>Applied " + app.appliedDate + "</span></td>" +
                "<td>" + app.experience + " yr<br><span class='hint'>" + app.education + "</span></td>" +
                "<td>" + starsText(app.rating) + "</td>" +
                "<td>" + statusBadge(app.status) + "</td>" +
                "<td>" +
                  "<button type='button' class='btn btn-small btn-info' onclick=\"reviewApplication('" + app.id + "')\">Review</button>" +
                  "<button type='button' class='btn btn-small' onclick=\"editApplication('" + app.id + "')\">Edit</button>" +
                  "<button type='button' class='btn btn-small btn-danger' onclick=\"deleteApplication('" + app.id + "')\">Delete</button>" +
                "</td>" +
              "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='7' class='empty-row'>No applications match your search.</td></tr>";
  }

  document.getElementById("appTableBody").innerHTML = rows;
  document.getElementById("appCount").innerHTML = "Showing " + shown + " of " + applications.length + " applications";
}

// CREATE or UPDATE
function saveApplication() {
  let name = document.getElementById("appName").value.trim();
  let email = document.getElementById("appEmail").value.trim().toLowerCase();
  let phone = document.getElementById("appPhone").value.trim();
  let jobId = document.getElementById("appJob").value;
  let experienceText = document.getElementById("appExperience").value;
  let education = document.getElementById("appEducation").value;
  let salaryText = document.getElementById("appSalary").value;
  let skills = document.getElementById("appSkills").value.trim();
  let appliedDate = document.getElementById("appDate").value;

  let experience = Number(experienceText);
  let salary = Number(salaryText);

  let isValid = true;
  clearErrors(appFields);

  if (name.length < 3) {
    showError("appName", "Name must be at least 3 characters.");
    isValid = false;
  }

  if (isValidEmail(email) === false) {
    showError("appEmail", "Enter a valid email address.");
    isValid = false;
  }

  if (isDigitsOnly(phone) === false || phone.length !== 11 || phone.slice(0, 2) !== "01") {
    showError("appPhone", "Phone must be 11 digits and start with 01.");
    isValid = false;
  }

  if (jobId === "") {
    showError("appJob", "Please choose a job.");
    isValid = false;
  } else if (isValidEmail(email) && applicationExists(email, jobId)) {
    showError("appEmail", "This person has already applied for this job.");
    isValid = false;
  }

  if (experienceText === "" || experience < 0 || experience > 40) {
    showError("appExperience", "Experience must be between 0 and 40 years.");
    isValid = false;
  }

  if (education === "") {
    showError("appEducation", "Please choose the education level.");
    isValid = false;
  }

  if (salaryText === "" || salary < 1000 || salary > 1000000) {
    showError("appSalary", "Salary must be between 1000 and 1000000 Tk.");
    isValid = false;
  }

  if (skills.length < 2) {
    showError("appSkills", "Enter at least one skill.");
    isValid = false;
  }

  if (appliedDate === "") {
    showError("appDate", "Please choose the applied date.");
    isValid = false;
  } else if (appliedDate > todayString()) {
    showError("appDate", "Applied date cannot be in the future.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  if (editAppId === "") {
    // CREATE
    let newApp = { id: nextId("A", applications), jobId: jobId, name: name, email: email, phone: phone, experience: experience,
                   education: education, salary: salary, skills: skills, appliedDate: appliedDate, status: "Pending", rating: 0, notes: "" };
    applications.push(newApp);
    logActivity("Application", "Added application " + newApp.id + " from " + name);
    showMessage("appMessage", "<strong>" + safe(name) + "</strong> was added with id " + newApp.id + ".", "success");
  } else {
    // UPDATE
    let app = findApp(editAppId);
    app.name = name;
    app.email = email;
    app.phone = phone;
    app.jobId = jobId;
    app.experience = experience;
    app.education = education;
    app.salary = salary;
    app.skills = skills;
    app.appliedDate = appliedDate;
    logActivity("Application", "Updated application " + app.id + " (" + name + ")");
    showMessage("appMessage", "<strong>" + safe(name) + "</strong> was updated.", "success");
    if (reviewAppId === app.id) { reviewApplication(app.id, true); }
  }

  resetAppForm();
  refreshAll();
  return false;
}

function applicationExists(email, jobId) {
  for (const app of applications) {
    if (app.id !== editAppId && app.email === email && app.jobId === jobId) {
      return true;
    }
  }
  return false;
}

// UPDATE step 1: put the values into the form
function editApplication(id) {
  let app = findApp(id);
  editAppId = id;
  fillJobSelects();

  document.getElementById("appName").value = app.name;
  document.getElementById("appEmail").value = app.email;
  document.getElementById("appPhone").value = app.phone;
  document.getElementById("appJob").value = app.jobId;
  document.getElementById("appExperience").value = app.experience;
  document.getElementById("appEducation").value = app.education;
  document.getElementById("appSalary").value = app.salary;
  document.getElementById("appSkills").value = app.skills;
  document.getElementById("appDate").value = app.appliedDate;

  clearErrors(appFields);
  document.getElementById("appFormTitle").innerHTML = "Edit Application " + id;
  document.getElementById("appSaveButton").value = "Update Application";
  hideMessage("appMessage");
  document.getElementById("appForm").scrollIntoView({ behavior: "smooth", block: "center" });
}

// DELETE: also removes the interviews of this application
function deleteApplication(id) {
  let app = findApp(id);
  if (confirm("Delete the application of " + app.name + "? Its interviews will be deleted too.") === false) {
    return;
  }

  let remaining = [];
  for (const interview of interviews) {
    if (interview.appId !== id) { remaining.push(interview); }
  }
  interviews = remaining;
  applications = removeAt(applications, findIndexById(applications, id));

  if (reviewAppId === id) { closeReview(); }
  if (editAppId === id) { resetAppForm(); }
  logActivity("Application", "Deleted application " + id + " (" + app.name + ")");
  showMessage("appMessage", "<strong>" + safe(app.name) + "</strong> was deleted.", "info");
  refreshAll();
}

function resetAppForm() {
  editAppId = "";
  document.getElementById("appForm").reset();
  document.getElementById("appDate").value = todayString();
  clearErrors(appFields);
  document.getElementById("appFormTitle").innerHTML = "Add New Application";
  document.getElementById("appSaveButton").value = "Add Application";
  fillJobSelects();
}


/* ---------- REVIEW PANEL ---------- */
function reviewApplication(id, stayInPlace) {
  let app = findApp(id);
  reviewAppId = id;

  document.getElementById("reviewDetails").innerHTML =
    "<div class='detail-grid'>" +
      "<div><b>Application:</b> " + app.id + "</div>" +
      "<div><b>Candidate:</b> " + safe(app.name) + "</div>" +
      "<div><b>Job:</b> " + safe(jobTitleOf(app.jobId)) + "</div>" +
      "<div><b>Email:</b> " + safe(app.email) + "</div>" +
      "<div><b>Phone:</b> " + app.phone + "</div>" +
      "<div><b>Applied on:</b> " + app.appliedDate + "</div>" +
      "<div><b>Experience:</b> " + app.experience + " year(s)</div>" +
      "<div><b>Education:</b> " + app.education + "</div>" +
      "<div><b>Expected salary:</b> " + app.salary + " Tk</div>" +
      "<div><b>Current status:</b> " + statusBadge(app.status) + "</div>" +
    "</div>" +
    "<p style='margin-top:10px'><b>Skills:</b> " + skillTags(app.skills) + "</p>";

  document.getElementById("reviewStatus").value = app.status;
  document.getElementById("reviewRating").value = app.rating;
  document.getElementById("reviewNotes").value = app.notes;
  document.getElementById("reviewRuleHint").innerHTML = "Rating " + MIN_SHORTLIST_RATING + "+ is needed to shortlist.";
  clearErrors(reviewFields);

  document.getElementById("reviewForm").style.display = "block";
  if (stayInPlace !== true) {
    document.getElementById("reviewCard").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function closeReview() {
  reviewAppId = "";
  document.getElementById("reviewForm").style.display = "none";
  document.getElementById("reviewDetails").innerHTML = "Click <strong>Review</strong> on an application to see the details here.";
}

// Saves status + rating + notes from the review form
function saveReview() {
  let app = findApp(reviewAppId);
  let status = document.getElementById("reviewStatus").value;
  let rating = Number(document.getElementById("reviewRating").value);
  let notes = document.getElementById("reviewNotes").value.trim();

  clearErrors(reviewFields);
  let isValid = true;

  if ((status === "Shortlisted" || status === "Hired") && rating < MIN_SHORTLIST_RATING) {
    showError("reviewRating", "Rate " + MIN_SHORTLIST_RATING + " or more to " + (status === "Hired" ? "hire" : "shortlist") + ".");
    isValid = false;
  }

  if (status === "Rejected" && notes.length < 5) {
    showError("reviewNotes", "Write a short reason (at least 5 characters) when rejecting.");
    isValid = false;
  }

  if (notes.length > 300) {
    showError("reviewNotes", "Notes can be at most 300 characters.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  let cancelled = setStatus(app, status);
  app.rating = rating;
  app.notes = notes;

  logActivity("Review", "Reviewed " + app.name + ": " + status + ", rating " + rating);
  let text = "Review of <strong>" + safe(app.name) + "</strong> saved. Status: " + status + ".";
  if (cancelled > 0) { text += " " + cancelled + " scheduled interview(s) cancelled."; }
  showMessage("appMessage", text, "success");

  reviewApplication(app.id, true);
  refreshAll();
  return false;
}

// Shortlist / Reject buttons inside the review form
function quickShortlist() {
  document.getElementById("reviewStatus").value = "Shortlisted";
  saveReview();
}

function quickReject() {
  document.getElementById("reviewStatus").value = "Rejected";
  saveReview();
}


/* =====================================================================
   5. SHORTLIST
   ===================================================================== */
function fillShortlistSelect() {
  let select = document.getElementById("shortlistSelect");
  select.innerHTML = "";
  addOption(select, "", "-- Select candidate --");
  for (const app of applications) {
    if (app.status === "Pending" || app.status === "Under Review") {
      addOption(select, app.id, app.name + " - " + jobTitleOf(app.jobId) + " (rating " + app.rating + ")");
    }
  }
  document.getElementById("shortlistRuleHint").innerHTML = "Only candidates rated " + MIN_SHORTLIST_RATING + "+ can be shortlisted.";
}

function addToShortlist() {
  let id = document.getElementById("shortlistSelect").value;
  clearError("shortlistSelect");

  if (id === "") {
    showError("shortlistSelect", "Please choose a candidate.");
    return false;
  }

  let app = findApp(id);
  if (app.rating < MIN_SHORTLIST_RATING) {
    showError("shortlistSelect", app.name + " is rated " + app.rating + ". Review and rate " + MIN_SHORTLIST_RATING + "+ first.");
    return false;
  }

  setStatus(app, "Shortlisted");
  logActivity("Shortlist", "Shortlisted " + app.name + " for " + jobTitleOf(app.jobId));
  showMessage("shortlistMessage", "<strong>" + safe(app.name) + "</strong> was added to the shortlist.", "success");
  refreshAll();
  return false;
}

function shortlistedList(jobFilter) {
  let list = [];
  for (const app of applications) {
    if (app.status === "Shortlisted" && (jobFilter === "All" || app.jobId === jobFilter)) {
      list.push(app);
    }
  }
  list.sort(function (a, b) { return b.rating - a.rating; });
  return list;
}

function renderShortlist() {
  let jobFilter = document.getElementById("shortlistJobFilter").value;
  if (jobFilter === "") { jobFilter = "All"; }
  let list = shortlistedList(jobFilter);
  let rows = "";

  for (let i = 0; i < list.length; i++) {
    let app = list[i];
    let next = null;
    for (const interview of upcomingInterviews()) {
      if (interview.appId === app.id) { next = interview; break; }
    }
    let interviewText = next === null ? "<span class='badge orange'>Not scheduled</span>"
                                      : "<span class='badge blue'>" + next.date + " " + next.time + "</span>";

    rows += "<tr>" +
              "<td>" + (i + 1) + "</td>" +
              "<td>" + app.id + "</td>" +
              "<td><strong>" + safe(app.name) + "</strong><br><span class='hint'>" + safe(app.email) + "</span></td>" +
              "<td>" + safe(jobTitleOf(app.jobId)) + "</td>" +
              "<td>" + app.experience + " yr<br><span class='hint'>" + app.education + "</span></td>" +
              "<td>" + starsText(app.rating) + "</td>" +
              "<td>" + interviewText + "</td>" +
              "<td>" +
                "<button type='button' class='btn btn-small btn-info' onclick=\"scheduleFor('" + app.id + "')\">Schedule</button>" +
                "<button type='button' class='btn btn-small btn-success' onclick=\"hireCandidate('" + app.id + "')\">Hire</button>" +
                "<button type='button' class='btn btn-small btn-warning' onclick=\"removeFromShortlist('" + app.id + "')\">Remove</button>" +
              "</td>" +
            "</tr>";
  }

  if (rows === "") {
    rows = "<tr><td colspan='8' class='empty-row'>No shortlisted candidates.</td></tr>";
  }

  document.getElementById("shortlistBody").innerHTML = rows;
  document.getElementById("shortlistCount").innerHTML = list.length + " shortlisted candidate(s)";
}

function removeFromShortlist(id) {
  let app = findApp(id);
  if (confirm("Remove " + app.name + " from the shortlist? Scheduled interviews will be cancelled.") === false) {
    return;
  }
  let cancelled = setStatus(app, "Under Review");
  logActivity("Shortlist", "Removed " + app.name + " from the shortlist");
  let text = "<strong>" + safe(app.name) + "</strong> was moved back to Under Review.";
  if (cancelled > 0) { text += " " + cancelled + " interview(s) cancelled."; }
  showMessage("shortlistMessage", text, "info");
  refreshAll();
}

function hireCandidate(id) {
  let app = findApp(id);
  if (confirm("Mark " + app.name + " as hired?") === false) {
    return;
  }
  setStatus(app, "Hired");
  logActivity("Hire", "Hired " + app.name + " for " + jobTitleOf(app.jobId));
  showMessage("shortlistMessage", "<strong>" + safe(app.name) + "</strong> is now marked as hired.", "success");
  refreshAll();
}

// "Schedule" button: open the Interviews page with the candidate selected
function scheduleFor(id) {
  window.location.href = "interviews.html?app=" + encodeURIComponent(id);
}


/* =====================================================================
   6. INTERVIEWS: CREATE, READ, UPDATE, DELETE + SCHEDULE RULES
   ===================================================================== */

// Only shortlisted candidates can be interviewed (plus the current one when editing)
function fillInterviewSelect(keepId) {
  let select = document.getElementById("interviewApp");
  let keep = keepId !== "" ? keepId : select.value;
  select.innerHTML = "";
  addOption(select, "", "-- Select shortlisted candidate --");
  for (const app of applications) {
    if (app.status === "Shortlisted" || (editInterviewId !== "" && interviews[findIndexById(interviews, editInterviewId)].appId === app.id)) {
      addOption(select, app.id, app.name + " - " + jobTitleOf(app.jobId));
    }
  }
  select.value = keep;
}

function renderInterviews() {
  let keyword = document.getElementById("interviewSearch").value;
  let statusFilter = document.getElementById("interviewStatusFilter").value;

  let list = interviews.slice();
  list.sort(function (a, b) { return (a.date + a.time) < (b.date + b.time) ? -1 : 1; });

  let rows = "";
  let shown = 0;

  for (const interview of list) {
    let matchesKeyword = containsText(nameOf(interview.appId), keyword) || containsText(interview.interviewer, keyword) ||
                         containsText(interview.id, keyword);
    let matchesStatus = (statusFilter === "All" || interview.status === statusFilter);

    if (matchesKeyword && matchesStatus) {
      let buttons = "";
      if (interview.status === "Scheduled") {
        buttons += "<button type='button' class='btn btn-small btn-success' onclick=\"completeInterview('" + interview.id + "')\">Complete</button>" +
                   "<button type='button' class='btn btn-small' onclick=\"editInterview('" + interview.id + "')\">Edit</button>" +
                   "<button type='button' class='btn btn-small btn-warning' onclick=\"cancelInterview('" + interview.id + "')\">Cancel</button>";
      }
      buttons += "<button type='button' class='btn btn-small btn-danger' onclick=\"deleteInterview('" + interview.id + "')\">Delete</button>";

      let when = interview.date === todayString() && interview.status === "Scheduled" ? "<strong>Today</strong>" : interview.date;
      let feedback = interview.feedback === "" ? "" : "<br><span class='hint'>Feedback: " + safe(interview.feedback) + "</span>";

      rows += "<tr>" +
                "<td>" + interview.id + "</td>" +
                "<td><strong>" + safe(nameOf(interview.appId)) + "</strong><br><span class='hint'>" + safe(jobTitleOf(findApp(interview.appId) === null ? "" : findApp(interview.appId).jobId)) + "</span></td>" +
                "<td>" + when + "<br><span class='hint'>" + interview.time + "</span></td>" +
                "<td>" + interview.mode + "<br><span class='hint'>" + safe(interview.place) + "</span></td>" +
                "<td>" + safe(interview.interviewer) + "</td>" +
                "<td>" + statusBadge(interview.status) + feedback + "</td>" +
                "<td>" + buttons + "</td>" +
              "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='7' class='empty-row'>No interviews found.</td></tr>";
  }

  document.getElementById("interviewBody").innerHTML = rows;
  document.getElementById("interviewCount").innerHTML = "Showing " + shown + " of " + interviews.length + " interviews";
}

// Returns a message if the new time clashes with another scheduled interview, otherwise ""
function findClash(date, time, interviewer, appId) {
  for (const interview of interviews) {
    if (interview.id !== editInterviewId && interview.status === "Scheduled" && interview.date === date && interview.time === time) {
      if (interview.interviewer.toLowerCase() === interviewer.toLowerCase()) {
        return interviewer + " already has interview " + interview.id + " at this time.";
      }
      if (interview.appId === appId) {
        return "This candidate already has interview " + interview.id + " at this time.";
      }
    }
  }
  return "";
}

// CREATE or UPDATE
function saveInterview() {
  let appId = document.getElementById("interviewApp").value;
  let date = document.getElementById("interviewDate").value;
  let time = document.getElementById("interviewTime").value;
  let mode = document.getElementById("interviewMode").value;
  let interviewer = document.getElementById("interviewer").value.trim();
  let place = document.getElementById("interviewPlace").value.trim();

  let isValid = true;
  clearErrors(interviewFields);

  if (appId === "") {
    showError("interviewApp", "Please choose a shortlisted candidate.");
    isValid = false;
  }

  if (date === "") {
    showError("interviewDate", "Please choose a date.");
    isValid = false;
  } else if (date < todayString()) {
    showError("interviewDate", "The date cannot be in the past.");
    isValid = false;
  }

  if (time === "") {
    showError("interviewTime", "Please choose a time.");
    isValid = false;
  } else if (time < "09:00" || time > "18:00") {
    showError("interviewTime", "Time must be between 09:00 and 18:00.");
    isValid = false;
  } else if (date === todayString() && time < nowString().slice(11)) {
    showError("interviewTime", "This time has already passed today.");
    isValid = false;
  }

  if (mode === "") {
    showError("interviewMode", "Please choose the interview mode.");
    isValid = false;
  }

  if (interviewer.length < 3) {
    showError("interviewer", "Interviewer name must be at least 3 characters.");
    isValid = false;
  }

  if (place.length < 3) {
    showError("interviewPlace", "Enter a room, phone number or meeting link.");
    isValid = false;
  }

  if (isValid) {
    let clash = findClash(date, time, interviewer, appId);
    if (clash !== "") {
      showError("interviewTime", clash);
      isValid = false;
    }
  }

  if (isValid === false) {
    return false;
  }

  if (editInterviewId === "") {
    // CREATE
    let newInterview = { id: nextId("I", interviews), appId: appId, date: date, time: time, mode: mode,
                         interviewer: interviewer, place: place, status: "Scheduled", feedback: "" };
    interviews.push(newInterview);
    logActivity("Interview", "Scheduled interview " + newInterview.id + " for " + nameOf(appId));
    showMessage("interviewMessage", "Interview <strong>" + newInterview.id + "</strong> scheduled for " + safe(nameOf(appId)) + " on " + date + " at " + time + ".", "success");
  } else {
    // UPDATE
    let interview = interviews[findIndexById(interviews, editInterviewId)];
    interview.appId = appId;
    interview.date = date;
    interview.time = time;
    interview.mode = mode;
    interview.interviewer = interviewer;
    interview.place = place;
    logActivity("Interview", "Rescheduled interview " + interview.id);
    showMessage("interviewMessage", "Interview <strong>" + interview.id + "</strong> was updated.", "success");
  }

  resetInterviewForm();
  refreshAll();
  return false;
}

// UPDATE step 1
function editInterview(id) {
  let interview = interviews[findIndexById(interviews, id)];
  editInterviewId = id;
  fillInterviewSelect(interview.appId);

  document.getElementById("interviewDate").value = interview.date;
  document.getElementById("interviewTime").value = interview.time;
  document.getElementById("interviewMode").value = interview.mode;
  document.getElementById("interviewer").value = interview.interviewer;
  document.getElementById("interviewPlace").value = interview.place;

  clearErrors(interviewFields);
  document.getElementById("interviewFormTitle").innerHTML = "Edit Interview " + id;
  document.getElementById("interviewSaveButton").value = "Update Interview";
  hideMessage("interviewMessage");
  document.getElementById("interviewForm").scrollIntoView({ behavior: "smooth", block: "center" });
}

function completeInterview(id) {
  let interview = interviews[findIndexById(interviews, id)];
  let feedback = prompt("Interview feedback for " + nameOf(interview.appId) + " (optional):", "");
  if (feedback === null) {
    return;
  }
  interview.status = "Completed";
  interview.feedback = feedback.trim();
  logActivity("Interview", "Completed interview " + id + " with " + nameOf(interview.appId));
  showMessage("interviewMessage", "Interview <strong>" + id + "</strong> marked as completed.", "success");
  refreshAll();
}

function cancelInterview(id) {
  let interview = interviews[findIndexById(interviews, id)];
  if (confirm("Cancel interview " + id + " with " + nameOf(interview.appId) + "?") === false) {
    return;
  }
  interview.status = "Cancelled";
  logActivity("Interview", "Cancelled interview " + id);
  showMessage("interviewMessage", "Interview <strong>" + id + "</strong> was cancelled.", "info");
  refreshAll();
}

// DELETE
function deleteInterview(id) {
  if (confirm("Delete interview " + id + " permanently?") === false) {
    return;
  }
  interviews = removeAt(interviews, findIndexById(interviews, id));
  if (editInterviewId === id) { resetInterviewForm(); }
  logActivity("Interview", "Deleted interview " + id);
  showMessage("interviewMessage", "Interview <strong>" + id + "</strong> was deleted.", "info");
  refreshAll();
}

function resetInterviewForm() {
  editInterviewId = "";
  document.getElementById("interviewForm").reset();
  clearErrors(interviewFields);
  document.getElementById("interviewDate").value = addDays(todayString(), 1);
  document.getElementById("interviewFormTitle").innerHTML = "Schedule Interview";
  document.getElementById("interviewSaveButton").value = "Schedule Interview";
  fillInterviewSelect("");
}


/* =====================================================================
   7. MANAGE JOBS: CREATE, READ, UPDATE, DELETE, SEARCH
   ===================================================================== */
function renderJobs() {
  let keyword = document.getElementById("jobSearch").value;
  let statusFilter = document.getElementById("jobStatusFilter").value;

  let rows = "";
  let shown = 0;

  for (const job of jobs) {
    let matchesKeyword = containsText(job.title, keyword) || containsText(job.department, keyword) || containsText(job.id, keyword);
    let matchesStatus = (statusFilter === "All" || job.status === statusFilter);

    if (matchesKeyword && matchesStatus) {
      let toggleText = job.status === "Open" ? "Close" : "Reopen";
      let expired = (job.deadline < todayString()) ? " <span class='badge red'>Expired</span>" : "";

      rows += "<tr>" +
                "<td>" + job.id + "</td>" +
                "<td><strong>" + safe(job.title) + "</strong><br><span class='hint'>" + job.department + "</span></td>" +
                "<td>" + job.type + "<br><span class='hint'>" + safe(job.location) + "</span></td>" +
                "<td>" + job.vacancies + "</td>" +
                "<td>" + job.deadline + expired + "</td>" +
                "<td>" + countApplicationsOfJob(job.id) + "</td>" +
                "<td>" + statusBadge(job.status) + "</td>" +
                "<td>" +
                  "<button type='button' class='btn btn-small' onclick=\"editJob('" + job.id + "')\">Edit</button>" +
                  "<button type='button' class='btn btn-small btn-warning' onclick=\"toggleJob('" + job.id + "')\">" + toggleText + "</button>" +
                  "<button type='button' class='btn btn-small btn-danger' onclick=\"deleteJob('" + job.id + "')\">Delete</button>" +
                "</td>" +
              "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='8' class='empty-row'>No jobs match your search.</td></tr>";
  }

  document.getElementById("jobBody").innerHTML = rows;
  document.getElementById("jobCount").innerHTML = "Showing " + shown + " of " + jobs.length + " jobs";
}

// CREATE or UPDATE
function saveJob() {
  let title = document.getElementById("jobTitle").value.trim();
  let department = document.getElementById("jobDepartment").value;
  let location = document.getElementById("jobLocation").value.trim();
  let type = document.getElementById("jobType").value;
  let vacanciesText = document.getElementById("jobVacancies").value;
  let deadline = document.getElementById("jobDeadline").value;
  let status = getRadioValue("jobStatus");
  let vacancies = Number(vacanciesText);

  let isValid = true;
  clearErrors(jobFields);

  if (title.length < 3) {
    showError("jobTitle", "Title must be at least 3 characters.");
    isValid = false;
  } else if (jobTitleUsed(title)) {
    showError("jobTitle", "A job with this title already exists.");
    isValid = false;
  }

  if (department === "") {
    showError("jobDepartment", "Please choose a department.");
    isValid = false;
  }

  if (location.length < 2) {
    showError("jobLocation", "Location must be at least 2 characters.");
    isValid = false;
  }

  if (type === "") {
    showError("jobType", "Please choose a job type.");
    isValid = false;
  }

  if (vacanciesText === "" || vacancies < 1 || vacancies > 50) {
    showError("jobVacancies", "Vacancies must be between 1 and 50.");
    isValid = false;
  }

  if (deadline === "") {
    showError("jobDeadline", "Please choose a deadline.");
    isValid = false;
  } else if (editJobId === "" && deadline < todayString()) {
    showError("jobDeadline", "The deadline cannot be in the past.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  if (editJobId === "") {
    // CREATE
    let newJob = { id: nextId("J", jobs), title: title, department: department, location: location, type: type,
                   vacancies: vacancies, deadline: deadline, status: status };
    jobs.push(newJob);
    logActivity("Job", "Created job " + newJob.id + ": " + title);
    showMessage("jobMessage", "<strong>" + safe(title) + "</strong> was added with id " + newJob.id + ".", "success");
  } else {
    // UPDATE
    let job = findJob(editJobId);
    job.title = title;
    job.department = department;
    job.location = location;
    job.type = type;
    job.vacancies = vacancies;
    job.deadline = deadline;
    job.status = status;
    logActivity("Job", "Updated job " + job.id + ": " + title);
    showMessage("jobMessage", "<strong>" + safe(title) + "</strong> was updated.", "success");
  }

  resetJobForm();
  refreshAll();
  return false;
}

function jobTitleUsed(title) {
  for (const job of jobs) {
    if (job.id !== editJobId && job.title.toLowerCase() === title.toLowerCase()) {
      return true;
    }
  }
  return false;
}

function editJob(id) {
  let job = findJob(id);
  editJobId = id;

  document.getElementById("jobTitle").value = job.title;
  document.getElementById("jobDepartment").value = job.department;
  document.getElementById("jobLocation").value = job.location;
  document.getElementById("jobType").value = job.type;
  document.getElementById("jobVacancies").value = job.vacancies;
  document.getElementById("jobDeadline").value = job.deadline;
  setRadioValue("jobStatus", job.status);

  clearErrors(jobFields);
  document.getElementById("jobFormTitle").innerHTML = "Edit Job " + id;
  document.getElementById("jobSaveButton").value = "Update Job";
  hideMessage("jobMessage");
  document.getElementById("jobForm").scrollIntoView({ behavior: "smooth", block: "center" });
}

function toggleJob(id) {
  let job = findJob(id);
  job.status = job.status === "Open" ? "Closed" : "Open";
  logActivity("Job", (job.status === "Open" ? "Reopened " : "Closed ") + "job " + id);
  showMessage("jobMessage", "<strong>" + safe(job.title) + "</strong> is now " + job.status + ".", "info");
  refreshAll();
}

// DELETE: only allowed when nobody applied
function deleteJob(id) {
  let job = findJob(id);
  if (countApplicationsOfJob(id) > 0) {
    showMessage("jobMessage", "<strong>" + safe(job.title) + "</strong> cannot be deleted: it has " + countApplicationsOfJob(id) + " application(s). Close it instead.", "error");
    return;
  }
  if (confirm("Delete the job " + job.title + "?") === false) {
    return;
  }
  jobs = removeAt(jobs, findIndexById(jobs, id));
  if (editJobId === id) { resetJobForm(); }
  logActivity("Job", "Deleted job " + id + ": " + job.title);
  showMessage("jobMessage", "<strong>" + safe(job.title) + "</strong> was deleted.", "info");
  refreshAll();
}

function resetJobForm() {
  editJobId = "";
  document.getElementById("jobForm").reset();
  setRadioValue("jobStatus", "Open");
  document.getElementById("jobDeadline").value = addDays(todayString(), 14);
  clearErrors(jobFields);
  document.getElementById("jobFormTitle").innerHTML = "Add New Job";
  document.getElementById("jobSaveButton").value = "Add Job";
}


/* =====================================================================
   8. START (each page only sets up what it contains)
   ===================================================================== */
function showManagerName() {
  let nameBox = document.getElementById("managerName");
  if (nameBox === null) { return; }
  let name = "Shek Armanul Haque";
  try {
    let email = localStorage.getItem("jpLoggedIn");
    let users = JSON.parse(localStorage.getItem("jpUsers") || "[]");
    for (const user of users) {
      if (user.email === email && user.role.toLowerCase().indexOf("recruit") !== -1) { name = user.name; }
    }
  } catch (error) { /* keep the default name */ }
  nameBox.innerHTML = safe(name);
}

function startPage() {
  showManagerName();

  let logout = document.getElementById("logoutLink");
  if (logout !== null) {
    logout.addEventListener("click", function () { localStorage.removeItem("jpLoggedIn"); });
  }

  if (onPage("appForm")) { resetAppForm(); }
  if (onPage("interviewForm")) {
    resetInterviewForm();
    let wanted = new URLSearchParams(window.location.search).get("app");   // coming from Shortlist
    if (wanted !== null && findApp(wanted) !== null && findApp(wanted).status === "Shortlisted") {
      document.getElementById("interviewApp").value = wanted;
    }
  }
  if (onPage("jobForm")) { resetJobForm(); }
  refreshAll();
  if (onPage("interviewForm") && new URLSearchParams(window.location.search).get("app") !== null) {
    let wanted = new URLSearchParams(window.location.search).get("app");
    if (findApp(wanted) !== null && findApp(wanted).status === "Shortlisted") {
      document.getElementById("interviewApp").value = wanted;
    }
  }
}

startPage();