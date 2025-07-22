require("dotenv").config();
const { Job } = require("./models/job");
const connection = require("./db");

const sampleJobs = [
    {
        title: "Software Engineer",
        company: "Infosys",
        location: "Bangalore, India",
        type: "onsite",
        skills: ["Java", "Spring Boot", "Microservices", "SQL", "REST APIs"],
        description: "Join Infosys as a Software Engineer to build enterprise solutions for global clients. Experience with Java and microservices required."
    },
    {
        title: "Data Analyst",
        company: "TCS",
        location: "Mumbai, India",
        type: "hybrid",
        skills: ["Python", "SQL", "Power BI", "Data Visualization", "Excel"],
        description: "Analyze business data and generate insights for TCS clients. Hybrid work model with strong data analysis skills needed."
    },
    {
        title: "Frontend Developer",
        company: "Wipro",
        location: "Remote, India",
        type: "remote",
        skills: ["JavaScript", "React", "HTML", "CSS", "Redux"],
        description: "Work remotely with Wipro's frontend team to deliver high-quality web applications. React experience is a must."
    },
    {
        title: "Backend Developer",
        company: "HCL Technologies",
        location: "Noida, India",
        type: "onsite",
        skills: ["Node.js", "Express", "MongoDB", "API Development", "Docker"],
        description: "Develop and maintain backend services for HCL's enterprise clients. Onsite role in Noida."
    },
    {
        title: "AI/ML Engineer",
        company: "Google India",
        location: "Hyderabad, India",
        type: "hybrid",
        skills: ["Python", "TensorFlow", "Machine Learning", "Deep Learning", "Data Science"],
        description: "Join Google India's AI team to build and deploy machine learning models. Hybrid work with cutting-edge projects."
    },
    {
        title: "Cloud DevOps Engineer",
        company: "Amazon India",
        location: "Bangalore, India",
        type: "onsite",
        skills: ["AWS", "DevOps", "CI/CD", "Linux", "Terraform"],
        description: "Manage cloud infrastructure and deployment pipelines for Amazon India. Strong AWS and DevOps skills required."
    },
    {
        title: "Mobile App Developer",
        company: "Flipkart",
        location: "Bangalore, India",
        type: "hybrid",
        skills: ["Kotlin", "Android", "iOS", "React Native", "Mobile UI"],
        description: "Develop and maintain mobile applications for Flipkart's e-commerce platform. Hybrid work model."
    },
    {
        title: "Cybersecurity Analyst",
        company: "WNS Global Services",
        location: "Pune, India",
        type: "onsite",
        skills: ["Cybersecurity", "Network Security", "Python", "SIEM", "Incident Response"],
        description: "Protect WNS's digital assets and respond to security incidents. Onsite role in Pune."
    }
];

const seedJobs = async () => {
    try {
        // Connect to database
        await connection();
        
        // Clear existing jobs
        await Job.deleteMany({});
        
        // Insert sample jobs
        await Job.insertMany(sampleJobs);
        
        console.log("Database seeded successfully with", sampleJobs.length, "jobs");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedJobs();