/* global Given, When, Then */
import {viewPage} from "../common/page";
import {workspaces, languages} from "../common/mappings";

beforeEach(function () {
  cy.drupalScript('silverback:integration/34-workspaces-languages/workspaces.php');
  cy.drupalScript('silverback:integration/34-workspaces-languages/testpage.php');
  cy.drupalSession({ user: "admin", toolbar: 'on' });
});

Given(/^there is a workspace "Switzerland" with the primary language "German" and the secondary languages "French" and "English"$/, () => {
  // Nothing to do, done in beforeEach
});

Given(/^there is a workspace "Austria" with the primary language "German" and no secondary languages$/, () => {
  // Nothing to do, done in beforeEach
});

When(/^the administrator attempts to edit the "Switzerland" workspace$/, () => {
  cy.visit('/admin/config/workflow/workspaces/manage/ch/edit');
});

Then(/^there is an option to select the primary language with "German" preselected$/, () => {
  cy.get('[name="primary_language[0][value]"]').should('have.value','de');
});

Then(/^there is an option to select multiple secondary languages with "French" and "Italian" preselected$/, () => {
  cy.get('[name="secondary_languages[0][value]"]').should('have.value', 'fr');
  cy.get('[name="secondary_languages[1][value]"]').should('have.value', 'it');
});


When(/^the administrator attempts to create a new "Page" in the "([^"]*)" workspace$/, (workspace) => {
  cy.drupalSession({workspace: workspaces[workspace]});
  cy.visit('/node/add/page');
});

Then(/^the language choice has the three options "German", "French" and "Italian"$/, () => {
  cy.get('#edit-langcode-wrapper option[value="de"]');
  cy.get('#edit-langcode-wrapper option[value="fr"]');
  cy.get('#edit-langcode-wrapper option[value="it"]');
});

Then(/^the "Translations" tab is not available$/, () => {
  cy.get('.tabs').contains('Translate').should('not.exist');
});

When(/^an administrator accesses the "Translations" tab of page "([^"]*)"$/, (page) => {
  cy.drupalSession({workspace: 'ch'});
  viewPage('ch', page);
  cy.get('.tabs').contains('Translate').click();
});

Then(/^there should be a row for "([^"]*)"$/, (language) => {
  cy.get('.page-content').contains(language);
});

Then(/^there should not be a row for "([^"]*)"$/, (language) => {
  cy.get('.page-content').contains(language).should('not.exist');
});


Then(/^there is no option to select a language$/, () => {
  cy.get('select[name="langcode[0][value]"]').should('not.exist');
});

When(/^a visitor accesses the page "([^"]*)" in the "([^"]*)" workspace$/, (title, workspace) => {
  cy.visit(`/${workspaces[workspace]}/node/1`);
});

When(/^a visitor accesses the page "([^"]*)" in "([^"]*)" in the "([^"]*)" workspace$/, (title, language, workspace) => {
  cy.drupalSession({user: 'anonymous'});
  cy.drush('cr');
  cy.visit(`/${workspaces[workspace]}/${languages[language]}/node/1`, {failOnStatusCode: false});
});

Then(/^the displayed page title is "([^"]*)"$/, (title) => {
  cy.get('h1').contains(title);
});

Then(/^a "([^"]*)" error is displayed$/, (error) => {
  cy.get('h1').contains(error);
});
