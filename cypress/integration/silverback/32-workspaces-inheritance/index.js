/* global Given, When, Then */

import {pages, workspaces} from "../common/mappings";
import {viewPage, createPage, editPage} from "../common/page";

beforeEach(function () {
  cy.drupalScript('silverback:integration/common/00-workspaces.php');
});


Given(/^there is a page with title "([^"]*)" in the "([^"]*)" workspace$/, (title, workspace) => {
  cy.drupalScript(`silverback:integration/32-workspaces-inheritance/testpage-${workspaces[workspace]}.php`);
});

When(/^an administrator accesses the "([^"]*)" page in the "([^"]*)" workspace$/, (title, workspace) => {
  viewPage(workspace, title);
});

Then(/^the user sees a "([^"]*)" error$/, (error) => {
  cy.contains(error);
});


When(/^an administrator accesses the "([^"]*)" page of the "([^"]*)" workspace$/, (page, workspace) => {
  cy.drupalSession({user: "admin", workspace: workspaces[workspace]});
  cy.visitDrupalke
  cy.visit(pages[page]);
});

Then(/^there should be no line for the page "([^"]*)"$/, (title) => {
  cy.contains(title).should('not.exist');
});

Given(/^the title of "([^"]*)" has been changed to "([^"]*)" in the "([^"]*)" workspace$/, (oldTitle, newTitle, workspace) => {
  cy.drupalScript(`silverback:integration/32-workspaces-inheritance/testpage-${workspaces[workspace]}.php`);
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

