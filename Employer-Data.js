const EMPLOYER_DATA_STORAGE_KEY = "jobportal_employer_dashboard";
const EMPLOYER_MANAGEMENT_STORAGE_KEY = "jobportal_employer_management";
const EMPLOYER_PROFILE_STORAGE_KEY = "jobportal_employer_profile";

const defaultEmployerData = {
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
  },
  jobs: [
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Dhaka",
      type: "Full-Time",
      salary: "$1200",
      deadline: "2026-12-15",
      status: "Open",
      description: "Build and maintain responsive web interfaces using HTML, CSS, and JavaScript."
    },
    {
      title: "QA & Test Engineer",
      department: "Quality Assurance",
      location: "Remote",
      type: "Full-Time",
      salary: "$950",
      deadline: "2026-12-20",
      status: "Open",
      description: "Test web workflows, verify form validations, and track release issues."
    }
  ],
  interviews: [
    {
      candidateName: "Nadia Islam",
      jobTitle: "Frontend Developer",
      date: "2026-11-24",
      time: "11:00",
      mode: "Online",
      interviewer: "Tariq Mahmud",
      status: "Scheduled",
      notes: "Focus on DOM manipulation and responsive layout implementation."
    }
  ],
  feedbacks: [
    {
      candidateName: "Arnob Roy",
      stage: "Technical Round",
      rating: "4",
      decision: "Selected",
      comments: "Strong problem-solving skills and clear explanation of project structure."
    }
  ],
  profile: {
    companyName: "Arnob Tech Solutions",
    industry: "Software & Web Services",
    companySize: "51-200",
    website: "https://arnobtech.example.com",
    contactName: "Arithro Roy Arnob",
    email: "hr@arnobtech.example.com",
    phone: "+8801711000000",
    city: "Dhaka",
    address: "Banani, Dhaka 1213, Bangladesh",
    about: "Building modern web platforms and hiring software engineers and product specialists."
  }
};