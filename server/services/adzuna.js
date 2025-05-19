const axios = require("axios");

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
const ADZUNA_COUNTRY = process.env.ADZUNA_COUNTRY || "us";

async function fetchAdzunaJobs({ what, where, skills = [], maxResults = 10 }) {
    const params = new URLSearchParams({
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        results_per_page: maxResults,
        what: what || skills.join(" ") || "developer",
        where: where || "",
        contentType: "application/json"
    });
    const url = `https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/1?${params.toString()}`;
    try {
        const { data } = await axios.get(url);
        // Normalize Adzuna jobs to your job model
        return (data.results || []).map(job => ({
            title: job.title,
            company: job.company.display_name,
            location: job.location.display_name,
            type: job.contract_time || "any",
            skills: skills.length ? skills : ["N/A"],
            description: job.description,
            applicationUrl: job.redirect_url,
            createdAt: job.created,
        }));
    } catch (error) {
        console.error("Error fetching Adzuna jobs:", error.message);
        return [];
    }
}

module.exports = { fetchAdzunaJobs };