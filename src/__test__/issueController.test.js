// __tests__/issueController.test.js

const request = require('supertest');
const app = require('../src/index');

describe('IssueController', () => {
  const testIssue = {
    owner: 'testOwner',
    repo: 'testRepo',
    title: 'Test Issue',
    body: 'This is a test issue.',
  };

  let createdIssueId;

  // This test assumes you've set up a mock for GitHub API and Sequelize for testing
  test('should create a new issue', async () => {
    const response = await request(app)
      .post('/api/create-issue')
      .send(testIssue)
      .expect(200);

    createdIssueId = response.body.id;
    expect(response.body.title).toBe(testIssue.title);
  });

  test('should get all issues', async () => {
    const response = await request(app)
      .get('/api/get-issues')
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  test('should update an issue', async () => {
    const updatedTitle = 'Updated Test Issue';

    const response = await request(app)
      .put('/api/update-issue')
      .send({ id: createdIssueId, title: updatedTitle })
      .expect(200);

    expect(response.body.title).toBe(updatedTitle);
  });

  test('should delete an issue', async () => {
    const response = await request(app)
      .delete(`/api/delete-issue/${createdIssueId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
