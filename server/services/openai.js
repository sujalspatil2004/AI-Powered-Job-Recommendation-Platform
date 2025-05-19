const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateJobMatches(user, jobs) {
    const userProfile = `Skills: ${user.skills && user.skills.length ? user.skills.join(', ') : 'Not specified'}\nExperience: ${user.yearsOfExperience || 'Not specified'}\nPreferred Job Type: ${user.preferredJobType || 'Not specified'}`;

    const jobMatches = [];

    for (const job of jobs) {
        try {
            const prompt = `As a job matching AI, analyze the compatibility between this job and candidate:\n\nJob Details:\nTitle: ${job.title}\nCompany: ${job.company}\nRequired Skills: ${job.skills.join(', ')}\nDescription: ${job.description}\n\nCandidate Profile:\n${userProfile}\n\nProvide ONLY a JSON object with two keys: percentage (number, 0-100) and reason (string). Do not include any other text.`;

            // Log the prompt for debugging
            console.log('AI Prompt:', prompt);

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 200,
                temperature: 0.7,
            });

            // Extract the response text
            const responseText = completion.choices[0].message.content.trim();
            console.log('AI Raw Response:', responseText);
            let response;
            try {
                response = JSON.parse(responseText);
            } catch (parseErr) {
                // Try to extract JSON from the response if extra text is present
                const match = responseText.match(/\{[\s\S]*\}/);
                if (match) {
                    response = JSON.parse(match[0]);
                } else {
                    throw new Error('AI did not return valid JSON');
                }
            }
            
            if (typeof response.percentage === 'number' && response.percentage >= 50) {  // Lowered threshold for more results
                jobMatches.push({
                    job,
                    matchPercentage: response.percentage,
                    reason: response.reason
                });
            } else {
                console.log('AI response did not meet threshold or was invalid:', response);
            }
        } catch (error) {
            console.error('Error generating match for job:', job._id, error);
            continue;
        }
    }

    // Sort by match percentage descending
    return jobMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

module.exports = {
    generateJobMatches
};