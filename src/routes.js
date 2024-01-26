const { Router } = require('express');
const { createIssue, getIssues, updateIssue, deleteIssue } = require('./controllers/issueController');
const logger = require('./logger');

const routes = Router();
// Add authentication middleware
const ensureAuthenticated = (req, res, next) => {
  logger.info('Middleware called');
  if (req.isAuthenticated()) {
    logger.info('User is authenticated');
    return next();
  }
  logger.error('User is not authenticated');
  res.redirect('/');
};
routes.post('/create-issue', ensureAuthenticated, createIssue);
routes.get('/get-issues', ensureAuthenticated, getIssues);
routes.put('/update-issue', ensureAuthenticated, updateIssue);
routes.delete('/delete-issue/:id', ensureAuthenticated, deleteIssue);

module.exports = { routes: routes };
