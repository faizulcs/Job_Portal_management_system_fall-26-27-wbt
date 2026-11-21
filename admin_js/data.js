var users = [
    { id: 101, name: "Rahim Ahmed", email: "rahim@gmail.com", phone: "01710000001", type: "Job Seeker", status: "Active" },
    { id: 102, name: "Karim Hasan", email: "karim@gmail.com", phone: "01710000002", type: "Employer", status: "Active" },
    { id: 103, name: "Nusrat Jahan", email: "nusrat@gmail.com", phone: "01710000003", type: "Job Seeker", status: "Inactive" },
    { id: 104, name: "ABC Technologies", email: "hr@abctech.com", phone: "01710000004", type: "Employer", status: "Pending" },
    { id: 105, name: "Sadia Islam", email: "sadia@gmail.com", phone: "01710000005", type: "Job Seeker", status: "Active" }
];

var jobs = [
    { id: 201, title: "Junior Web Developer", employer: "ABC Technologies", posted: "2026-10-25", status: "Active", category: "IT", location: "Dhaka", description: "Develop and maintain websites." },
    { id: 202, title: "UI/UX Designer", employer: "Creative Studio", posted: "2026-10-27", status: "Pending", category: "Design", location: "Dhaka", description: "Design user-friendly interfaces." },
    { id: 203, title: "Data Entry Operator", employer: "Global Services", posted: "2026-10-29", status: "Active", category: "Administration", location: "Remote", description: "Manage and update data." },
    { id: 204, title: "Software Engineer", employer: "ABC Technologies", posted: "2026-11-01", status: "Rejected", category: "IT", location: "Chattogram", description: "Work on software development." }
];

var applications = [
    { id: 301, job: "Junior Web Developer", seeker: "Rahim Ahmed", employer: "ABC Technologies", date: "2026-10-28", status: "Pending" },
    { id: 302, job: "UI/UX Designer", seeker: "Nusrat Jahan", employer: "Creative Studio", date: "2026-10-30", status: "Shortlisted" },
    { id: 303, job: "Data Entry Operator", seeker: "Sadia Islam", employer: "Global Services", date: "2026-11-02", status: "Rejected" }
];

var categories = [
    { id: 1, name: "Information Technology" }, { id: 2, name: "Design" },
    { id: 3, name: "Marketing" }, { id: 4, name: "Administration" }
];

var verifications = [
    { id: 102, name: "Karim Hasan", company: "Karim IT Solutions", email: "karim@gmail.com", status: "Verified" },
    { id: 104, name: "ABC Technologies", company: "ABC Technologies Ltd.", email: "hr@abctech.com", status: "Pending" }
];

var suspiciousJobs = [
    { id: 204, title: "Software Engineer", employer: "ABC Technologies", reason: "Unusual salary information", status: "Under Review" }
];

var duplicateJobs = [
    { id: 205, title: "Junior Web Developer", employer: "ABC Technologies", matchedWith: 201, status: "Possible Duplicate" }
];

var announcements = [
    { title: "Welcome to Job Portal", message: "The job portal is now open for users.", audience: "Everyone", date: "2026-11-01" }
];

// Read saved values for this tab. sessionStorage keeps data after refresh
// and page changes, then clears it when this tab is closed.
function loadData(key, defaultData) {
    var savedData = sessionStorage.getItem("jobPortal_" + key);
    if (savedData != null) return JSON.parse(savedData);
    return defaultData;
}

function saveData(key, data) {
    sessionStorage.setItem("jobPortal_" + key, JSON.stringify(data));
}

function saveAllData() {
    saveData("users", users);
    saveData("jobs", jobs);
    saveData("applications", applications);
    saveData("categories", categories);
    saveData("verifications", verifications);
    saveData("suspiciousJobs", suspiciousJobs);
    saveData("duplicateJobs", duplicateJobs);
    saveData("announcements", announcements);
}

users = loadData("users", users);
jobs = loadData("jobs", jobs);
applications = loadData("applications", applications);
categories = loadData("categories", categories);
verifications = loadData("verifications", verifications);
suspiciousJobs = loadData("suspiciousJobs", suspiciousJobs);
duplicateJobs = loadData("duplicateJobs", duplicateJobs);
announcements = loadData("announcements", announcements);

