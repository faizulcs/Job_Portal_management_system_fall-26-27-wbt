const MANAGEMENT_STORAGE_KEY =
  typeof EMPLOYER_MANAGEMENT_STORAGE_KEY !== "undefined"
    ? EMPLOYER_MANAGEMENT_STORAGE_KEY
    : "jobportal_employer_management";

const fallbackManagementData =
  typeof defaultEmployerData !== "undefined"
    ? {
        jobs: defaultEmployerData.jobs.slice(),
        interviews: defaultEmployerData.interviews.slice(),
        feedbacks: defaultEmployerData.feedbacks.slice()
      }
    : {
        jobs: [],
        interviews: [],
        feedbacks: []
      };

const jobFieldIds = [
  "jobTitle",
  "jobDepartment",
  "jobLocation",
  "jobType",
  "jobSalary",
  "jobDeadline",
  "jobStatus",
  "jobDescription"
];

const interviewFieldIds = [
  "interviewCandidate",
  "interviewJob",
  "interviewDate",
  "interviewTime",
  "interviewMode",
  "interviewInterviewer",
  "interviewStatus",
  "interviewNotes"
];

const feedbackFieldIds = [
  "feedbackCandidate",
  "feedbackStage",
  "feedbackRating",
  "feedbackDecision",
  "feedbackComments"
];

let rawManagementState = localStorage.getItem(MANAGEMENT_STORAGE_KEY);
let managementState =
  rawManagementState !== null ? JSON.parse(rawManagementState) : fallbackManagementData;

if (!Array.isArray(managementState.jobs)) {
  managementState.jobs = fallbackManagementData.jobs.slice();
}
if (!Array.isArray(managementState.interviews)) {
  managementState.interviews = fallbackManagementData.interviews.slice();
}
if (!Array.isArray(managementState.feedbacks)) {
  managementState.feedbacks = fallbackManagementData.feedbacks.slice();
}

let editingJobIndex = -1;
let editingInterviewIndex = -1;
let editingFeedbackIndex = -1;

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

function showMessage(text, type) {
  let box = document.getElementById("managementMessage");
  if (box != null) {
    box.innerHTML = text;
    box.className = "message " + type;
    box.style.display = "block";
  }
}

function hideMessage() {
  let box = document.getElementById("managementMessage");
  if (box != null) {
    box.style.display = "none";
  }
}

function persistManagementState() {
  localStorage.setItem(MANAGEMENT_STORAGE_KEY, JSON.stringify(managementState));
}

function renderJobs() {
  let tbody = document.getElementById("jobsTableBody");
  let rows = "";

  for (let i = 0; i < managementState.jobs.length; i++) {
    let job = managementState.jobs[i];
    rows += "<tr>" +
              "<td>" + job.title + "</td>" +
              "<td>" + job.department + "</td>" +
              "<td>" + job.location + "</td>" +
              "<td>" + job.type + "</td>" +
              "<td>" + job.salary + "</td>" +
              "<td>" + job.deadline + "</td>" +
              "<td>" + job.status + "</td>" +
              "<td class='action-cell'>" +
                "<button type='button' class='action-btn' onclick='editJob(" + i + ")'>Edit</button>" +
                "<button type='button' class='action-btn delete-btn' onclick='deleteJob(" + i + ")'>Remove</button>" +
              "</td>" +
            "</tr>";
  }

  if (rows === "") {
    rows = "<tr><td colspan='8'>No job postings available.</td></tr>";
  }

  tbody.innerHTML = rows;
}

function resetJobForm() {
  document.getElementById("jobForm").reset();
  clearErrors(jobFieldIds);
  editingJobIndex = -1;
  document.getElementById("jobSubmitBtn").value = "Save Job";
}

function editJob(index) {
  let job = managementState.jobs[index];
  if (!job) {
    return;
  }
  clearErrors(jobFieldIds);
  document.getElementById("jobTitle").value = job.title;
  document.getElementById("jobDepartment").value = job.department;
  document.getElementById("jobLocation").value = job.location;
  document.getElementById("jobType").value = job.type;
  document.getElementById("jobSalary").value = job.salary;
  document.getElementById("jobDeadline").value = job.deadline;
  document.getElementById("jobStatus").value = job.status;
  document.getElementById("jobDescription").value = job.description;
  editingJobIndex = index;
  document.getElementById("jobSubmitBtn").value = "Update Job";
}

function deleteJob(index) {
  managementState.jobs.splice(index, 1);
  if (editingJobIndex === index) {
    resetJobForm();
  }
  persistManagementState();
  renderJobs();
  showMessage("Job posting removed.", "info");
}

function saveJob() {
  let title = document.getElementById("jobTitle").value.trim();
  let department = document.getElementById("jobDepartment").value.trim();
  let location = document.getElementById("jobLocation").value.trim();
  let type = document.getElementById("jobType").value;
  let salary = document.getElementById("jobSalary").value.trim();
  let deadline = document.getElementById("jobDeadline").value;
  let status = document.getElementById("jobStatus").value;
  let description = document.getElementById("jobDescription").value.trim();

  let isValid = true;
  clearErrors(jobFieldIds);
  hideMessage();

  if (title.length < 2) {
    showError("jobTitle", "Job title must be at least 2 characters.");
    isValid = false;
  }
  if (department.length < 2) {
    showError("jobDepartment", "Department must be at least 2 characters.");
    isValid = false;
  }
  if (location.length < 2) {
    showError("jobLocation", "Location must be at least 2 characters.");
    isValid = false;
  }
  if (salary === "") {
    showError("jobSalary", "Please enter salary or stipend.");
    isValid = false;
  }
  if (deadline === "") {
    showError("jobDeadline", "Please select a deadline.");
    isValid = false;
  }
  if (description.length < 5) {
    showError("jobDescription", "Description must be at least 5 characters.");
    isValid = false;
  }

  if (!isValid) {
    showMessage("Please fix the fields marked in red.", "error");
    return false;
  }

  let entry = {
    title: title,
    department: department,
    location: location,
    type: type,
    salary: salary,
    deadline: deadline,
    status: status,
    description: description
  };

  if (editingJobIndex >= 0) {
    managementState.jobs[editingJobIndex] = entry;
    showMessage("Job posting updated.", "success");
  } else {
    managementState.jobs.push(entry);
    showMessage("New job posting added.", "success");
  }

  persistManagementState();
  renderJobs();
  resetJobForm();
  return false;
}

function renderInterviews() {
  let tbody = document.getElementById("interviewsTableBody");
  let rows = "";

  for (let i = 0; i < managementState.interviews.length; i++) {
    let item = managementState.interviews[i];
    rows += "<tr>" +
              "<td>" + item.candidateName + "</td>" +
              "<td>" + item.jobTitle + "</td>" +
              "<td>" + item.date + "</td>" +
              "<td>" + item.time + "</td>" +
              "<td>" + item.mode + "</td>" +
              "<td>" + item.interviewer + "</td>" +
              "<td>" + item.status + "</td>" +
              "<td class='action-cell'>" +
                "<button type='button' class='action-btn' onclick='editInterview(" + i + ")'>Edit</button>" +
                "<button type='button' class='action-btn delete-btn' onclick='deleteInterview(" + i + ")'>Remove</button>" +
              "</td>" +
            "</tr>";
  }

  if (rows === "") {
    rows = "<tr><td colspan='8'>No interviews scheduled.</td></tr>";
  }

  tbody.innerHTML = rows;
}

function resetInterviewForm() {
  document.getElementById("interviewForm").reset();
  clearErrors(interviewFieldIds);
  editingInterviewIndex = -1;
  document.getElementById("interviewSubmitBtn").value = "Save Interview";
}

function editInterview(index) {
  let item = managementState.interviews[index];
  if (!item) {
    return;
  }
  clearErrors(interviewFieldIds);
  document.getElementById("interviewCandidate").value = item.candidateName;
  document.getElementById("interviewJob").value = item.jobTitle;
  document.getElementById("interviewDate").value = item.date;
  document.getElementById("interviewTime").value = item.time;
  document.getElementById("interviewMode").value = item.mode;
  document.getElementById("interviewInterviewer").value = item.interviewer;
  document.getElementById("interviewStatus").value = item.status;
  document.getElementById("interviewNotes").value = item.notes;
  editingInterviewIndex = index;
  document.getElementById("interviewSubmitBtn").value = "Update Interview";
}

function deleteInterview(index) {
  managementState.interviews.splice(index, 1);
  if (editingInterviewIndex === index) {
    resetInterviewForm();
  }
  persistManagementState();
  renderInterviews();
  showMessage("Interview schedule removed.", "info");
}

function saveInterview() {
  let candidateName = document.getElementById("interviewCandidate").value.trim();
  let jobTitle = document.getElementById("interviewJob").value.trim();
  let date = document.getElementById("interviewDate").value;
  let time = document.getElementById("interviewTime").value;
  let mode = document.getElementById("interviewMode").value;
  let interviewer = document.getElementById("interviewInterviewer").value.trim();
  let status = document.getElementById("interviewStatus").value;
  let notes = document.getElementById("interviewNotes").value.trim();

  let isValid = true;
  clearErrors(interviewFieldIds);
  hideMessage();

  if (candidateName.length < 2) {
    showError("interviewCandidate", "Candidate name must be at least 2 characters.");
    isValid = false;
  }
  if (jobTitle.length < 2) {
    showError("interviewJob", "Job role must be at least 2 characters.");
    isValid = false;
  }
  if (date === "") {
    showError("interviewDate", "Please select an interview date.");
    isValid = false;
  }
  if (time === "") {
    showError("interviewTime", "Please select an interview time.");
    isValid = false;
  }
  if (interviewer.length < 2) {
    showError("interviewInterviewer", "Interviewer name must be at least 2 characters.");
    isValid = false;
  }

  if (!isValid) {
    showMessage("Please fix the fields marked in red.", "error");
    return false;
  }

  let entry = {
    candidateName: candidateName,
    jobTitle: jobTitle,
    date: date,
    time: time,
    mode: mode,
    interviewer: interviewer,
    status: status,
    notes: notes
  };

  if (editingInterviewIndex >= 0) {
    managementState.interviews[editingInterviewIndex] = entry;
    showMessage("Interview schedule updated.", "success");
  } else {
    managementState.interviews.push(entry);
    showMessage("Interview scheduled.", "success");
  }

  persistManagementState();
  renderInterviews();
  resetInterviewForm();
  return false;
}

function renderFeedbacks() {
  let tbody = document.getElementById("feedbacksTableBody");
  let rows = "";

  for (let i = 0; i < managementState.feedbacks.length; i++) {
    let item = managementState.feedbacks[i];
    rows += "<tr>" +
              "<td>" + item.candidateName + "</td>" +
              "<td>" + item.stage + "</td>" +
              "<td>" + item.rating + " / 5</td>" +
              "<td>" + item.decision + "</td>" +
              "<td>" + item.comments + "</td>" +
              "<td class='action-cell'>" +
                "<button type='button' class='action-btn' onclick='editFeedback(" + i + ")'>Edit</button>" +
                "<button type='button' class='action-btn delete-btn' onclick='deleteFeedback(" + i + ")'>Remove</button>" +
              "</td>" +
            "</tr>";
  }

  if (rows === "") {
    rows = "<tr><td colspan='6'>No candidate feedback recorded.</td></tr>";
  }

  tbody.innerHTML = rows;
}

function resetFeedbackForm() {
  document.getElementById("feedbackForm").reset();
  clearErrors(feedbackFieldIds);
  editingFeedbackIndex = -1;
  document.getElementById("feedbackSubmitBtn").value = "Save Feedback";
}

function editFeedback(index) {
  let item = managementState.feedbacks[index];
  if (!item) {
    return;
  }
  clearErrors(feedbackFieldIds);
  document.getElementById("feedbackCandidate").value = item.candidateName;
  document.getElementById("feedbackStage").value = item.stage;
  document.getElementById("feedbackRating").value = item.rating;
  document.getElementById("feedbackDecision").value = item.decision;
  document.getElementById("feedbackComments").value = item.comments;
  editingFeedbackIndex = index;
  document.getElementById("feedbackSubmitBtn").value = "Update Feedback";
}

function deleteFeedback(index) {
  managementState.feedbacks.splice(index, 1);
  if (editingFeedbackIndex === index) {
    resetFeedbackForm();
  }
  persistManagementState();
  renderFeedbacks();
  showMessage("Candidate feedback removed.", "info");
}

function saveFeedback() {
  let candidateName = document.getElementById("feedbackCandidate").value.trim();
  let stage = document.getElementById("feedbackStage").value;
  let rating = document.getElementById("feedbackRating").value;
  let decision = document.getElementById("feedbackDecision").value;
  let comments = document.getElementById("feedbackComments").value.trim();

  let isValid = true;
  clearErrors(feedbackFieldIds);
  hideMessage();

  if (candidateName.length < 2) {
    showError("feedbackCandidate", "Candidate name must be at least 2 characters.");
    isValid = false;
  }
  if (comments.length < 3) {
    showError("feedbackComments", "Comments must be at least 3 characters.");
    isValid = false;
  }

  if (!isValid) {
    showMessage("Please fix the fields marked in red.", "error");
    return false;
  }

  let entry = {
    candidateName: candidateName,
    stage: stage,
    rating: rating,
    decision: decision,
    comments: comments
  };

  if (editingFeedbackIndex >= 0) {
    managementState.feedbacks[editingFeedbackIndex] = entry;
    showMessage("Candidate feedback updated.", "success");
  } else {
    managementState.feedbacks.push(entry);
    showMessage("Candidate feedback saved.", "success");
  }

  persistManagementState();
  renderFeedbacks();
  resetFeedbackForm();
  return false;
}

renderJobs();
renderInterviews();
renderFeedbacks();