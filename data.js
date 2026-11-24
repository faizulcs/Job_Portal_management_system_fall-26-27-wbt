/* =====================================================================
   jobseeker-data.js - Shared Job Seeker Data
   The arrays are used by the Job Seeker pages.
   ===================================================================== */

let seekerUsers = [
    {
        name: "Faizul",
        email: "seeker@jobportal.com",
        phone: "01712345678",
        education: "BSc in CSE, American International University-Bangladesh",
        skills: "HTML, CSS, JavaScript, PHP, MySQL",
        experience: "1 year internship at Pixel Lab",
        cv: "fab_cv.pdf",
        role: "job_seeker"
    }
];

let seekerApplications = [
    { id: "A-001", email: "seeker@jobportal.com", jobTitle: "Junior Web Developer", company: "BrightSoft Ltd", appliedDate: "2026-11-12", status: "Shortlisted" },
    { id: "A-002", email: "seeker@jobportal.com", jobTitle: "Digital Marketing Executive", company: "ShopNow Ltd", appliedDate: "2026-11-08", status: "Pending" },
    { id: "A-003", email: "seeker@jobportal.com", jobTitle: "Customer Support Officer", company: "Green Telecom", appliedDate: "2026-11-01", status: "Rejected" },
    { id: "A-004", email: "seeker@jobportal.com", jobTitle: "PHP Backend Developer", company: "CodeCraft BD", appliedDate: "2026-11-15", status: "Pending" },
    { id: "A-005", email: "seeker@jobportal.com", jobTitle: "Graphic Design Intern", company: "Creative Hive", appliedDate: "2026-10-20", status: "Accepted" }
];

let currentSeeker = seekerUsers[0];

let seekerJobs = [
    { id: "J-001", title: "Junior Web Developer", department: "Engineering", location: "Dhaka", type: "Full-Time", salary: "৳25,000 - ৳35,000", deadline: "2026-12-31", description: "HTML, CSS, JavaScript and basic PHP knowledge.", status: "Open", company: "BrightSoft Ltd" },
    { id: "J-002", title: "Frontend Developer Intern", department: "Engineering", location: "Dhaka", type: "Internship", salary: "৳10,000 - ৳15,000", deadline: "2026-12-20", description: "Basic HTML and CSS and JavaScript.", status: "Open", company: "BrightSoft Ltd" },
    { id: "J-003", title: "PHP Backend Developer", department: "Software Development", location: "Remote", type: "Full-Time", salary: "৳40,000 - ৳50,000", deadline: "2026-12-25", description: "PHP, MySQL and server-side development.", status: "Open", company: "CodeCraft BD" }
];
