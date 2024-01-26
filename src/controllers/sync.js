const axios = require('axios');
const cron = require('node-cron');
const { Issue } = require('./models/issue');

// Function to fetch GitHub issues and synchronize with the local database
const synchronizeIssues = async () => {
  try {
    // Fetch GitHub issues from a specific repository
    const owner = 'your_github_username';
    const repo = 'your_github_repository';
    const githubToken = 'your_github_token';
    const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
          },
        }
      );

    // Process each fetched issue
    for (const issueData of response.data) {
      const { id, title, body, html_url: githubIssueUrl } = issueData;

      // Check if the issue already exists in the local database
      const existingIssue = await Issue.findOne({ where: { githubIssueId: id } });

      if (!existingIssue) {
        // If the issue doesn't exist, create a new record in the local database
        await Issue.create({ githubIssueId: id, title, body, githubIssueUrl });
      } else {
        // If the issue exists, update the record in the local database if necessary
        if (existingIssue.title !== title || existingIssue.body !== body || existingIssue.githubIssueUrl !== githubIssueUrl) {
          await existingIssue.update({ title, body, githubIssueUrl });
        }
      }
    }

    console.log('GitHub issues synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing GitHub issues:', error.message);
  }
};

// Schedule the synchronization job to run every hour (adjust the cron expression as needed)
cron.schedule('0 * * * *', synchronizeIssues);

// Optionally, run the synchronization job immediately upon application startup
synchronizeIssues();
