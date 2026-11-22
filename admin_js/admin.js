function findTable(sectionId, legendText) {
    var section = document.getElementById(sectionId);
    if (section == null) return null;
    var fieldsets = section.getElementsByTagName("fieldset");
    for (var i = 0; i < fieldsets.length; i++) {
        var legend = fieldsets[i].getElementsByTagName("legend")[0];
        if (legend != null && legend.textContent.trim() == legendText) {
            return fieldsets[i].getElementsByTagName("table")[0];
        }
    }
    return null;
}

function showRows(table, rows) {
    if (table == null) return;
    var body = table.getElementsByTagName("tbody")[0];
    if (body == null) body = table;
    var header = "";
    if (table.rows.length > 0) header = table.rows[0].outerHTML;
    body.innerHTML = header + rows;
}

function renderUsers() {
    var table = findTable("users", "Users Details (Read)");
    var rows = "";
    for (var i = 0; i < users.length; i++) {
        rows += "<tr><td>" + users[i].id + "</td><td>" + users[i].name + "</td><td>" + users[i].email +
            "</td><td>" + users[i].type + "</td><td>" + users[i].status + "</td><td>" +
            "<button type='button' onclick='fillUser(" + users[i].id + ")'>Edit</button> " +
            "<button type='button' onclick='deleteUser(" + users[i].id + ")'>Delete</button></td></tr>";
    }
    if (rows == "") rows = "<tr><td colspan='6'>No users found.</td></tr>";
    showRows(table, rows);
}

function fillUser(id) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            document.getElementById("editUserId").value = users[i].id;
            document.getElementById("editUserName").value = users[i].name;
            document.getElementById("editUserEmail").value = users[i].email;
            document.getElementById("editUserPhone").value = users[i].phone;
            document.getElementById("editUserType").value = users[i].type.toLowerCase().replace(" ", "_");
        }
    }
}

function deleteUser(id) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) { users.splice(i, 1); break; }
    }
    saveAllData();
    renderUsers();
}

function renderJobs() {
    var table = findTable("jobs", "Job Details (Read)");
    var rows = "";
    for (var i = 0; i < jobs.length; i++) {
        rows += "<tr><td>" + jobs[i].id + "</td><td>" + jobs[i].title + "</td><td>" + jobs[i].employer +
            "</td><td>" + jobs[i].posted + "</td><td>" + jobs[i].status + "</td><td>" +
            "<button type='button' onclick='fillJob(" + jobs[i].id + ")'>Edit</button> " +
            "<button type='button' onclick='deleteJob(" + jobs[i].id + ")'>Delete</button></td></tr>";
    }
    if (rows == "") rows = "<tr><td colspan='6'>No jobs found.</td></tr>";
    showRows(table, rows);
}

function fillJob(id) {
    for (var i = 0; i < jobs.length; i++) {
        if (jobs[i].id == id) {
            document.getElementById("editJobId").value = jobs[i].id;
            document.getElementById("editJobTitle").value = jobs[i].title;
            document.getElementById("editJobDescription").value = jobs[i].description;
            document.getElementById("editJobStatus").value = jobs[i].status.toLowerCase();
        }
    }
}

function deleteJob(id) {
    for (var i = 0; i < jobs.length; i++) {
        if (jobs[i].id == id) { jobs.splice(i, 1); break; }
    }
    saveAllData();
    renderJobs();
}

function renderApplications() {
    var table = findTable("applications", "All Job Applications");
    var rows = "";
    for (var i = 0; i < applications.length; i++) {
        rows += "<tr><td>" + applications[i].id + "</td><td>" + applications[i].job + "</td><td>" +
            applications[i].seeker + "</td><td>" + applications[i].employer + "</td><td>" +
            applications[i].date + "</td><td>" + applications[i].status + "</td></tr>";
    }
    if (rows == "") rows = "<tr><td colspan='6'>No applications found.</td></tr>";
    showRows(table, rows);
}

function renderCategories() {
    var table = findTable("categories", "Available Categories (Read)");
    var rows = "";
    for (var i = 0; i < categories.length; i++) {
        rows += "<tr><td>" + categories[i].id + "</td><td>" + categories[i].name + "</td><td>" +
            "<button type='button' onclick='fillCategory(" + categories[i].id + ")'>Edit</button></td></tr>";
    }
    if (rows == "") rows = "<tr><td colspan='3'>No categories found.</td></tr>";
    showRows(table, rows);
}

function fillCategory(id) {
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].id == id) {
            document.getElementById("manageCategoryId").value = categories[i].id;
            document.getElementById("manageCategoryName").value = categories[i].name;
        }
    }
}

function renderVerifications() {
    var table = findTable("verification", "Verify Employer Accounts");
    var rows = "";
    for (var i = 0; i < verifications.length; i++) {
        rows += "<tr><td>" + verifications[i].id + "</td><td>" + verifications[i].company + "</td><td>" +
            verifications[i].email + "</td><td>" + verifications[i].status + "</td></tr>";
    }
    showRows(table, rows || "<tr><td colspan='4'>No verification requests.</td></tr>");
}

function renderSuspiciousJobs() {
    var table = findTable("fraud-review", "Review Flagged Job Posts");
    var rows = "";
    for (var i = 0; i < suspiciousJobs.length; i++) {
        rows += "<tr><td>" + suspiciousJobs[i].id + "</td><td>" + suspiciousJobs[i].title + "</td><td>" +
            suspiciousJobs[i].employer + "</td><td>" + suspiciousJobs[i].reason + "</td><td>" + suspiciousJobs[i].status + "</td></tr>";
    }
    showRows(table, rows || "<tr><td colspan='5'>No flagged jobs.</td></tr>");
}

function renderDuplicates() {
    var table = findTable("duplicate-jobs", "Check Duplicate Job Posts");
    var rows = "";
    for (var i = 0; i < duplicateJobs.length; i++) {
        rows += "<tr><td>" + duplicateJobs[i].id + "</td><td>" + duplicateJobs[i].matchedWith + "</td><td>" +
            duplicateJobs[i].title + "</td><td>" + duplicateJobs[i].employer + "</td><td>" + duplicateJobs[i].status + "</td></tr>";
    }
    showRows(table, rows || "<tr><td colspan='5'>No possible duplicate jobs.</td></tr>");
}

function renderAnnouncements() {
    var section = document.getElementById("announcements");
    if (section == null) return;
    var oldTable = section.querySelector("table.announcement-list");
    if (oldTable == null) {
        oldTable = document.createElement("table");
        oldTable.className = "announcement-list";
        oldTable.innerHTML = "<tr><th>Title</th><th>Message</th><th>Audience</th><th>Date</th></tr>";
        section.appendChild(oldTable);
    }
    var rows = "";
    for (var i = 0; i < announcements.length; i++) {
        rows += "<tr><td>" + announcements[i].title + "</td><td>" + announcements[i].message + "</td><td>" +
            announcements[i].audience + "</td><td>" + announcements[i].date + "</td></tr>";
    }
    showRows(oldTable, rows || "<tr><td colspan='4'>No announcements.</td></tr>");
}

function updateDashboard() {
    var section = document.getElementById("dashboard");
    if (section == null) return;
    var cells = section.querySelectorAll("table td:nth-child(2)");
    var seekers = 0, employers = 0, active = 0, pendingEmployers = 0, pendingJobs = 0;
    for (var i = 0; i < users.length; i++) {
        if (users[i].type == "Job Seeker") seekers++;
        if (users[i].type == "Employer") employers++;
        if (users[i].status == "Pending" && users[i].type == "Employer") pendingEmployers++;
    }
    for (var j = 0; j < jobs.length; j++) {
        if (jobs[j].status == "Active") active++;
        if (jobs[j].status == "Pending") pendingJobs++;
    }
    var values = [users.length, seekers, employers, jobs.length, active, applications.length, pendingEmployers, pendingJobs];
    for (var k = 0; k < cells.length && k < values.length; k++) cells[k].textContent = values[k];
}

function nextNumber(list) {
    var biggest = 0;
    for (var i = 0; i < list.length; i++) if (Number(list[i].id) > biggest) biggest = Number(list[i].id);
    return biggest + 1;
}

function showError(fieldId, message) {
    document.getElementById(fieldId + "Error").innerHTML = message;

    var field = document.getElementById(fieldId);
    if (field != null) field.style.border = "2px solid red";
}

function clearError(fieldId) {
    var error = document.getElementById(fieldId + "Error");
    if (error != null) error.innerHTML = "";

    var field = document.getElementById(fieldId);
    if (field != null) field.style.border = "";
}

function clearErrors(fieldIds) {
    for (var i = 0; i < fieldIds.length; i++) {
        clearError(fieldIds[i]);
    }
}

function getFieldLabel(field) {
    if (field.labels != null && field.labels.length > 0) {
        return field.labels[0].textContent.replace(":", "").trim();
    }
    return field.name || field.id || "This field";
}

function clearFieldValidation(event) {
    var field = event.target;
    if (field == null || field.id == "") return;
    clearError(field.id);
}

function getFormValue(form, id) {
    var field = document.getElementById(id);
    if (field == null && form.elements[id] != null) field = form.elements[id];
    if (field == null) return "";
    return field.value.trim();
}

function hasRecordWithId(list, id) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) return true;
    }
    return false;
}

function validateAdminForm(form, action) {
    var isValid = true;
    var fieldIds = [];
    for (var i = 0; i < form.elements.length; i++) {
        if (form.elements[i].id != "") fieldIds.push(form.elements[i].id);
    }
    clearErrors(fieldIds);

    for (var i = 0; i < form.elements.length; i++) {
        var field = form.elements[i];
        if (field.type == "submit" || field.type == "reset" || field.type == "button") continue;

        var fieldValue = field.value == null ? "" : field.value.trim();
        var fieldLabel = getFieldLabel(field);

        if (field.required && fieldValue == "") {
            showError(field.id, fieldLabel + " is required.");
            isValid = false;
            continue;
        }
        if (fieldValue != "" && field.validity != null && field.validity.valid == false) {
            if (field.type == "email") showError(field.id, "Enter a valid email address.");
            else showError(field.id, "Enter a valid " + fieldLabel + ".");
            isValid = false;
        }
    }

    if (isValid == false) return false;

    if (action == "addUser") {
        var email = getFormValue(form, "newUserEmail").toLowerCase();
        for (var u = 0; u < users.length; u++) {
            if (users[u].email.toLowerCase() == email) {
                showError("newUserEmail", "A user with this email already exists.");
                return false;
            }
        }
    } else if (action == "updateUser") {
        var userId = getFormValue(form, "editUserId");
        if (!hasRecordWithId(users, userId)) {
            showError("editUserId", "Enter a valid user ID before updating.");
            return false;
        }
        var updatedEmail = getFormValue(form, "editUserEmail").toLowerCase();
        for (var e = 0; e < users.length; e++) {
            if (users[e].id != userId && users[e].email.toLowerCase() == updatedEmail) {
                showError("editUserEmail", "Another user already uses this email.");
                return false;
            }
        }
    } else if (action == "deleteUser" && !hasRecordWithId(users, getFormValue(form, "deleteUserId"))) {
        showError("deleteUserId", "No user was found with that ID.");
        return false;
    } else if (action == "updateUserStatus" && !hasRecordWithId(users, getFormValue(form, "statusUserId"))) {
        showError("statusUserId", "No user was found with that ID.");
        return false;
    } else if (action == "updateJob" && !hasRecordWithId(jobs, getFormValue(form, "editJobId"))) {
        showError("editJobId", "Enter a valid job ID before updating.");
        return false;
    } else if (action == "deleteJob" && !hasRecordWithId(jobs, getFormValue(form, "deleteJobId"))) {
        showError("deleteJobId", "No job was found with that ID.");
        return false;
    } else if (action == "reviewJob" && !hasRecordWithId(jobs, getFormValue(form, "approvalJobId"))) {
        showError("approvalJobId", "No job was found with that ID.");
        return false;
    } else if (action == "addJob") {
        var employerId = getFormValue(form, "jobEmployer");
        var employerFound = false;
        for (var em = 0; em < users.length; em++) {
            if (users[em].id == employerId && users[em].type == "Employer") employerFound = true;
        }
        if (!employerFound) {
            showError("jobEmployer", "Enter the ID of an existing employer.");
            return false;
        }
    } else if (action == "addCategory") {
        var categoryName = getFormValue(form, "categoryName").toLowerCase();
        for (var c = 0; c < categories.length; c++) {
            if (categories[c].name.toLowerCase() == categoryName) {
                showError("categoryName", "That category already exists.");
                return false;
            }
        }
    } else if ((action == "updateCategory" || action == "deleteCategory") &&
        !hasRecordWithId(categories, getFormValue(form, "manageCategoryId"))) {
        showError("manageCategoryId", "Enter a valid category ID.");
        return false;
    } else if (action == "updateCategory" && getFormValue(form, "manageCategoryName") == "") {
        showError("manageCategoryName", "Enter the new category name.");
        return false;
    } else if (action == "verifyEmployer" && !hasRecordWithId(verifications, getFormValue(form, "verifyEmployerId"))) {
        showError("verifyEmployerId", "No employer verification record was found with that ID.");
        return false;
    } else if (action == "reviewFlaggedJob" && !hasRecordWithId(suspiciousJobs, getFormValue(form, "flaggedJobId"))) {
        showError("flaggedJobId", "No flagged job was found with that ID.");
        return false;
    } else if (action == "reviewDuplicate" && !hasRecordWithId(duplicateJobs, getFormValue(form, "duplicateJobId"))) {
        showError("duplicateJobId", "No duplicate-job record was found with that ID.");
        return false;
    }

    if (action == "updateProfile") {
        var password = getFormValue(form, "password");
        var confirmPassword = getFormValue(form, "confirmPassword");
        if (password != "" && password != confirmPassword) {
            showError("confirmPassword", "The new password and confirmation do not match.");
            return false;
        }
    }

    if (action == "generateReport") {
        var fromDate = getFormValue(form, "reportFrom");
        var toDate = getFormValue(form, "reportTo");
        if (fromDate != "" && toDate != "" && fromDate > toDate) {
            showError("reportTo", "The end date must be on or after the start date.");
            return false;
        }
    }

    return true;
}

function handleForm(form, action) {
    var value = function (id) {
        var field = document.getElementById(id);
        if (field == null && form.elements[id] != null) field = form.elements[id];
        return field == null ? "" : field.value.trim();
    };

    if (action == "addUser") {
        users.push({ id: nextNumber(users), name: value("newUserName"), email: value("newUserEmail"), phone: value("newUserPhone"), type: value("newUserType").replace("_", " ").replace(/\b\w/g, function (letter) { return letter.toUpperCase(); }), status: "Active" });
        renderUsers();
    } else if (action == "updateUser") {
        for (var u = 0; u < users.length; u++) if (users[u].id == value("editUserId")) {
            users[u].name = value("editUserName") || users[u].name; users[u].email = value("editUserEmail") || users[u].email;
            users[u].phone = value("editUserPhone") || users[u].phone;
            if (value("editUserType")) users[u].type = value("editUserType").replace("_", " ").replace(/\b\w/g, function (letter) { return letter.toUpperCase(); });
        }
        renderUsers();
    } else if (action == "deleteUser") { deleteUser(value("deleteUserId"));
    } else if (action == "updateUserStatus") {
        for (var s = 0; s < users.length; s++) if (users[s].id == value("statusUserId")) users[s].status = value("userStatus");
        renderUsers();
    } else if (action == "addJob") {
        jobs.push({ id: nextNumber(jobs), title: value("jobTitle"), employer: "Employer " + value("jobEmployer"), category: value("jobCategory"), location: value("jobLocation"), description: value("jobDescription"), posted: new Date().toISOString().slice(0, 10), status: "Pending" });
        renderJobs();
    } else if (action == "updateJob") {
        for (var j = 0; j < jobs.length; j++) if (jobs[j].id == value("editJobId")) {
            jobs[j].title = value("editJobTitle") || jobs[j].title; jobs[j].description = value("editJobDescription") || jobs[j].description;
            jobs[j].status = value("editJobStatus");
        }
        renderJobs();
    } else if (action == "deleteJob") { deleteJob(value("deleteJobId"));
    } else if (action == "reviewJob") {
        for (var a = 0; a < jobs.length; a++) if (jobs[a].id == value("approvalJobId")) jobs[a].status = value("approvalStatus").replace(/^\w/, function (letter) { return letter.toUpperCase(); });
        renderJobs();
    } else if (action == "addCategory") {
        categories.push({ id: nextNumber(categories), name: value("categoryName") }); renderCategories();
    } else if (action == "updateCategory" || action == "deleteCategory") {
        for (var c = 0; c < categories.length; c++) if (categories[c].id == value("manageCategoryId")) {
            if (action == "deleteCategory") categories.splice(c, 1);
            else categories[c].name = value("manageCategoryName") || categories[c].name;
            break;
        }
        renderCategories();
    } else if (action == "verifyEmployer") {
        for (var v = 0; v < verifications.length; v++) if (verifications[v].id == value("verifyEmployerId")) verifications[v].status = value("verificationStatus");
        renderVerifications();
    } else if (action == "reviewFlaggedJob") {
        for (var f = 0; f < suspiciousJobs.length; f++) if (suspiciousJobs[f].id == value("flaggedJobId")) {
            if (value("fraudDecision") == "remove") suspiciousJobs.splice(f, 1);
            else suspiciousJobs[f].status = value("fraudDecision");
            break;
        }
        renderSuspiciousJobs();
    } else if (action == "reviewDuplicate") {
        for (var d = 0; d < duplicateJobs.length; d++) if (duplicateJobs[d].id == value("duplicateJobId")) {
            if (value("duplicateDecision") == "remove") duplicateJobs.splice(d, 1);
            else duplicateJobs[d].status = "Kept";
            break;
        }
        renderDuplicates();
    } else if (action == "publishAnnouncement") {
        announcements.push({ title: value("announcementTitle"), message: value("announcementMessage"), audience: value("announcementAudience"), date: new Date().toISOString().slice(0, 10) });
        renderAnnouncements();
    } else if (action == "updateProfile") {
        alert("Profile information updated for this demonstration.");
    } else if (action == "generateReport") {
        alert("Report generated for the selected dates. Sample totals: " + users.length + " users, " + jobs.length + " jobs, " + applications.length + " applications.");
    }
    saveAllData();
    form.reset();
}

function logoutAdmin(event) {
    event.preventDefault();
    localStorage.removeItem("jpLoggedIn");
    window.location.href = "login.html";
}

function startAdminPage() {
    var logoutLink = document.querySelector("a[href='admin_logout.html']");

if (logoutLink != null) {
    logoutLink.addEventListener("click", logoutAdmin);
}

    renderUsers(); renderJobs(); renderApplications(); renderCategories(); renderVerifications();
    renderSuspiciousJobs(); renderDuplicates(); renderAnnouncements(); updateDashboard();
    var forms = document.getElementsByTagName("form");
    for (var i = 0; i < forms.length; i++) {
        // Let our JavaScript show the validation messages before a form is handled.
        forms[i].noValidate = true;
        forms[i].addEventListener("submit", function (event) {
            event.preventDefault();
            var action = event.submitter == null ? "" : event.submitter.name;
            if (validateAdminForm(this, action) == false) return;
            handleForm(this, action);
            updateDashboard();
        });
        forms[i].addEventListener("input", clearFieldValidation);
        forms[i].addEventListener("change", clearFieldValidation);
    }
}

if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", startAdminPage);
else startAdminPage();
