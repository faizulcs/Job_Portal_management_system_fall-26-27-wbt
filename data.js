const JOBSEEKER_USERS_STORAGE_KEY = "jpUsers";
const JOBSEEKER_APPLICATIONS_STORAGE_KEY = "jpApplications";
const JOBSEEKER_LOGGED_IN_KEY = "jpLoggedIn";
const EMPLOYER_MANAGEMENT_STORAGE_KEY = "jobportal_employer_management";

const defaultJobSeekerData = {
  users: [
    {
      name: "Faizul",
      email: "seeker@jobportal.com",
      password: "seeker123",
      role: "job_seeker",
      phone: "01712345678",
      education: "BSc in CSE, American International University -Bangladesh",
      skills: "HTML, CSS, JavaScript, PHP, MySQL",
      experience: "1 year internship at Pixel Lab",
      cv: "fab_cv.pdf"
    }
  ],
  applications: [
    {
      id: "A-001",
      email: "seeker@jobportal.com",
      jobTitle: "Junior Web Developer",
      company: "BrightSoft Ltd",
      appliedDate: "2026-11-12",
      status: "Shortlisted"
    },
    {
      id: "A-002",
      email: "seeker@jobportal.com",
      jobTitle: "Digital Marketing Executive",
      company: "ShopNow Ltd",
      appliedDate: "2026-11-08",
      status: "Pending"
    },
    {
      id: "A-003",
      email: "seeker@jobportal.com",
      jobTitle: "Customer Support Officer",
      company: "Green Telecom",
      appliedDate: "2026-11-01",
      status: "Rejected"
    },
    {
      id: "A-004",
      email: "seeker@jobportal.com",
      jobTitle: "PHP Backend Developer",
      company: "CodeCraft BD",
      appliedDate: "2026-11-15",
      status: "Pending"
    },
    {
      id: "A-005",
      email: "seeker@jobportal.com",
      jobTitle: "Graphic Design Intern",
      company: "Creative Hive",
      appliedDate: "2026-10-20",
      status: "Accepted"
    }
  ],
  employerJobs: [
    {
      title: "Junior Web Developer",
      department: "Engineering",
      location: "Dhaka",
      type: "Full-Time",
      salary: "35,000 BDT",
      deadline: "2026-12-15",
      status: "Open",
      description: "Build and maintain frontend web pages using HTML, CSS, and JavaScript."
    },
    {
      title: "PHP Backend Developer",
      department: "Software Development",
      location: "Remote",
      type: "Full-Time",
      salary: "45,000 BDT",
      deadline: "2026-12-20",
      status: "Open",
      description: "Develop REST APIs and MySQL database queries for web applications."
    }
  ]
};
