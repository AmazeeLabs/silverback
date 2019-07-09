/* global Given, When, Then */

import {pages, workspaces} from "../common/mappings";
import {viewPage, createPage, editPage} from "../common/page";

beforeEach(function () {
  cy.prepareSnapshot('workspaces', function () {
    cy.drush('scr cypress/integration/jira/SLB/common/00-workspaces.php');
    cy.drush('cr');
  });
  cy.drush('cr');
});


Given(/^there is a page with title "([^"]*)" in the "([^"]*)" workspace$/, (title, workspace) => {
  createPage(workspace, title);
});

When(/^an administrator accesses the "([^"]*)" page in the "([^"]*)" workspace$/, (title, workspace) => {
  viewPage(workspace, title);
});

Then(/^the user sees a "([^"]*)" error$/, (error) => {
  cy.contains(error);
});


When(/^an administrator accesses the "([^"]*)" page of the "([^"]*)" workspace$/, (page, workspace) => {
  cy.drupalSession({user: "admin", workspace: workspaces[workspace]});
  cy.visit(pages[page]);
});

Then(/^there should be no line for the page "([^"]*)"$/, (title) => {
  cy.contains(title).should('not.exist');
});

Given(/^the title of "([^"]*)" has been changed to "([^"]*)" in the "([^"]*)" workspace$/, (oldTitle, newTitle, workspace) => {
  editPage(workspace, oldTitle, newTitle)
});

When(/^the user clicks the title of the "([^"]*)" row$/, (title) => {
  cy.contains(title).click();
});

Then(/^the page title on the view and edit screen is "([^"]*)"$/, (title) => {
  cy.drupalSession({user: "admin"});
  cy.get('h1').contains(title);
  cy.get('.tabs').contains('Edit').click();
  cy.get('#edit-title-0-value').should('have.value', title);
});

