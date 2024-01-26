const { Router } = require('express');
const { createIssue, getIssues, updateIssue, deleteIssue } = require('./controllers/issueController');

const routes = Router();
console.log('asasa')
// Add authentication middleware
const ensureAuthenticated = (req, res, next) => {
  console.log('Middleware called');
  if (req.isAuthenticated()) {
    console.log('User is authenticated');
    return next();
  }
  console.log('User is not authenticated');
  res.redirect('/');
};
console.log('as3332')
routes.post('/create-issue', ensureAuthenticated, createIssue);
routes.get('/get-issues', ensureAuthenticated, getIssues);
routes.put('/update-issue', ensureAuthenticated, updateIssue);
routes.delete('/delete-issue/:id', ensureAuthenticated, deleteIssue);

module.exports = { routes: routes };
