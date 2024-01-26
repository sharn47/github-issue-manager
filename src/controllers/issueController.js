const { Issue } = require('../models/issue');
const axios = require('axios');
const logger = require('../logger');

exports.createIssue = async (req, res) => {
  try {
    const { owner, repo, title, body } = req.body;
    const githubToken = req.user.accessToken;
    console.log(githubToken,"githubToken")
    // Create GitHub issue
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        title,
        body,
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      }
    );

    // Save issue details to PostgreSQL using Sequelize
    const issue = await Issue.create({
      title,
      body,
      githubIssueUrl: response.data.html_url,
    });

    res.json(issue);
  } catch (error) {
    logger.error(`Error updating issue: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getIssues = async (_req, res) => {
  try {
    // Retrieve all issues from PostgreSQL using Sequelize
    const issues = await Issue.findAll();
    res.json(issues);
  } catch (error) {
    logger.error(`Error updating issue: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const { owner, repo, title, body, id } = req.body;
    const githubToken = req.user.accessToken;

    // Update GitHub issue
    await axios.patch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${id}`,
      {
        title,
        body,
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      }
    );

    // Update issue details in PostgreSQL using Sequelize
    const [updatedCount] = await Issue.update(
      { title, body },
      { where: { id } }
    );

    if (updatedCount > 0) {
      const updatedIssue = await Issue.findByPk(id);
      res.json(updatedIssue);
    } else {
      res.status(404).json({ error: 'Issue not found' });
    }
  } catch (error) {
    logger.error(`Error creating issue: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const { owner, repo, id } = req.body;

    // Check if req.user is defined and has accessToken property
    if (!req.user || !req.user.accessToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const githubToken = req.user.accessToken;

    // Delete GitHub issue
    await axios.delete(`https://api.github.com/repos/${owner}/${repo}/issues/${id}`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    // Delete issue from PostgreSQL using Sequelize
    const deletedCount = await Issue.destroy({ where: { id } });

    if (deletedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Issue not found' });
    }
  } catch (error) {
    logger.error(`Error updating issue: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
