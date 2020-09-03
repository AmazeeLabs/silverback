/* global Given, When, Then */
beforeEach(function () {
  cy.drupalScript('silverback:integration/common/00-workspaces.php');
});

import { workspaces } from "../common/mappings";

Given(/^an administrator attempts to create a new workspace$/, () => {
  cy.drupalSession({user: 'admin'});
  cy.visit('/admin/config/workflow/workspaces/add')
});

Then(/^there is a checkbox with label "([^"]*)"$/, (label) => {
  cy.get('#edit-auto-push-wrapper').contains(label);
});

Given(/^there is a workspace "([^"]*)"$/, () => {
});

When(/^the administrator edits the workspace "([^"]*)" and checks the "([^"]*)" checkbox$/, (workspace, label) => {
  cy.drupalSession({user: 'admin'});
  cy.visit(`/cypress/entity/workspace/edit-form?label=${workspace}`);
  cy.contains(label).closest('.form-item').find('input').check();
  cy.get('#edit-submit').click();
});

Then(/^workspace "([^"]*)" is configured to automatically push content$/, (workspace) => {
  cy.visit(`/cypress/entity/workspace/edit-form?label=${workspace}`);
  cy.drupalSession({user: 'admin'});
  cy.visit(`/cypress/entity/workspace/edit-form?label=${workspace}`);
  cy.contains('Auto push').closest('.form-item').find('input').should('be.checked');
});

Given(/^there is a page "([^"]*)" in the "([^"]*)" workspace$/, () => {
  cy.drupalScript('silverback:integration/49-workspaces-automatic-push/testpage.php');
});

When(/^an editor creates an? "([^"]*)" revision of the page "([^"]*)" called "([^"]*)" in the "([^"]*)" workspace$/, (state, oldTitle, newTitle, workspace) => {
  cy.drupalSession({user: 'admin', workspace: workspaces[workspace]});
  cy.visit(`/cypress/entity/node/edit-form?title=${oldTitle}`);
  cy.get('#edit-title-0-value').clear().type(newTitle);
  cy.get('#edit-moderation-state-0-state').select(state);
  cy.get('#edit-submit').click();
});

Then(/^the title of page "([^"]*)" in the "([^"]*)" workspace is (still )?"([^"]*)"$/, (oldTitle, workspace, _, newTitle) => {
  cy.drupalSession({user: 'admin', workspace: workspaces[workspace], toolbar: "on"});
  cy.visit(`/test`);
  cy.get('h1').should(($h1) => {
    expect($h1.text().trim()).to.equal(newTitle);
  });
});

Then(/^the page "([^"]*)" is (not )?accessible to anonymous users$/, ($title, $invert) => {
  cy.drupalSession({user: 'anonymous', workspace: 'public', toolbar: "on"});
  if ($invert) {
    cy.visit(`/test`, {failOnStatusCode: false});
    cy.contains('Access denied');
  }
  else {
    cy.visit(`/test`);
  }
});
