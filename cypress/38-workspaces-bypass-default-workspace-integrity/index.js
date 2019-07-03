/* global Given, When, Then */

import { workspaces } from "../common/mappings";

beforeEach(function () {
  cy.prepareSnapshot('workspaces', function () {
    cy.drush('scr cypress/integration/jira/SLB/common/00-workspaces.php');
  });
  cy.drush('cr');
});

Given(/^an administrator is using the "([^"]*)" workspace$/, (workspace) => {
  cy.drupalSession({user: "admin", toolbar: 'on', workspace: workspaces[workspace]});
});

When(/^the user attempts to save the account with name "([^"]*)"$/, (name) => {
  cy.visit(`/cypress/entity/user/edit-form?name=${encodeURI(name)}`);
  cy.contains('Save').click();
});

Then(/^there is a status message reading "([^"]*)"/, (message) => {
  cy.get('.messages').contains(message);
});
