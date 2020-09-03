/* global Given, When, Then */

import {workspaces, languages} from "../common/mappings";

beforeEach(function () {
  cy.drupalScript('silverback:integration/40-workspaces-delivery/background.php');
  cy.drupalSession({user: 'admin'});
});

Given(/^an administrator is using the "([^"]*)" workspace$/, (workspace) => {
  cy.drupalSession({workspace: workspaces[workspace]});
});

When(/^the user attempts to create a new delivery from "([^"]*)"$/, (workspace) => {
  cy.visit(`/admin/delivery/workspace/${workspaces[workspace]}`);
});

Then(/^the suggested delivery items contain "([^"]*)"$/, (item) => {
  cy.contains('Delivery items').closest('fieldset').contains(item);
});

When(/^the user chooses "([^"]*)" as the delivery title$/, (title) => {
  cy.get('#edit-label').type(title);
});

When(/^the user creates the delivery$/, () => {
  cy.get('input[value="Create delivery"]').click()
});

When(/^the user deselects "([^"]*)"$/, (item) => {
  cy.contains('Delivery items')
      .closest('fieldset')
      .contains(item).closest('.form-item')
      .find('input').uncheck();
});

Then(/^the user should see the status page of "([^"]*)"$/, (title) => {
  cy.get('.title > .field').contains(title);
});

Then(/^the status table contains "([^"]*)"$/, (item) => {
  cy.get('.view-delivery-status').contains(item);
});

Then(/^the status table does not contain "([^"]*)"$/, (item) => {
  cy.get('.view-delivery-status').contains(item).should('not.exist');
});

Given(/^a delivery "([^"]*)" has been created including all changes from workspace "([^"]*)"$/, (title, workspace) => {
  cy.visit(`/admin/delivery/workspace/${workspaces[workspace]}`);
  cy.get('#edit-label').type(title);
  cy.get('input[value="Create delivery"]').click();
  cy.get('.title > .field').contains(title);
});

When(/^the user inspects the delivery status of "([^"]*)"$/, (title) => {
  cy.visit(`/cypress/entity/delivery/canonical?label=${encodeURI(title)}`);
});

Then(/^the source workspace is "([^"]*)"$/, (workspace) => {
  cy.contains('Source workspace').closest('.field').contains(workspace);
});

Then(/^the target workspace is "([^"]*)"$/, (workspace) => {
  cy.contains('Target workspace').closest('.field').contains(workspace);
});

Then(/^the status of "([^"]*)" should be "([^"]*)" and link to the "([^"]*)" form$/, (title, status, link) => {
  const links = {
    'Push': 'push',
    'Resolve': 'resolve',
  };
  cy.get('.view-delivery-status')
      .contains(title).closest('tr')
      .contains(status).should('have.attr', 'href').and('include', links[link])
});

When(/^the user clicks the "([^"]*)" button$/, (label) => {
  cy.contains(label).click();
});

When(/^the user confirms the decision to (push|pull) all changes$/, () => {
  cy.contains('Confirm').click();
});

Then(/^the user should see a status message "([^"]*)"$/, (message) => {
  cy.get('.messages').contains(message);
});

Then(/^the status of "([^"]*)" should be "([^"]*)"$/, (title, status, link) => {
  cy.get('.view-delivery-status')
      .contains(title).closest('tr')
      .contains(status)
});

Then(/^the "([^"]*)" button should be disabled$/, (label) => {
  cy.get(`input[value="${label}"]`).should('be.disabled');
});

Given(/^delivery "([^"]*)" has been pulled into the "([^"]*)" workspace$/, (delivery, workspace) => {
  cy.visit(`/cypress/entity/delivery/canonical?label=${encodeURI(delivery)}`);
  cy.contains('Pull all changes').click();
  cy.contains('Confirm').click();
});

When(/^the user selects the "([^"]*)" workspace as a forward target$/, (workspace) => {
  cy.contains('Target workspace')
      .closest('fieldset')
      .contains(workspace).closest('.form-item')
      .find('input').check();
});

When(/^the user forwards the delivery$/, () => {
  cy.get(`input[value="Forward"]`).click();
});


When(/^the user clicks the status label of delivery item "([^"]*)"$/, (item) => {
  cy.get('.view-delivery-status')
      .contains(item).closest('tr')
      .find('a').click();
});

When(/^the user confirms to push this item to the target workspace$/, () => {
  cy.get('#delivery-push-changes > #edit-submit').click();
});

Then(/^the page "([^"]*)" should be available in the "([^"]*)" workspace$/, (title, workspace) => {
  cy.visit(`/${workspaces[workspace]}/admin/content`);
  cy.get('.view-content').contains(title).click();
  cy.get('h1').contains(title);
});

When(/^the user confirms to deliver this item to the target workspace$/, () => {
  cy.get('input[value="Apply changes to Dev"]').click();
});

When(/^the user enters "([^"]*)" as a custom title$/, (title) => {
  cy.get('#edit-en').find('#edit-title').find('.delivery-merge-options').contains('Custom').closest('.form-item').find('input').check();
  cy.get('#edit-en').find('#edit-title').find('.delivery-merge-custom').find('input').clear().type(title);
});

When(/^the user finishes resolution of this conflict$/, () => {
  cy.get('input[value="Resolve conflicts"]').click();
});

Given(/^there is a "([^"]*)" in workspace "([^"]*)" in language "([^"]*)"$/, () => {
  // Nothing to do, it's already there.
});

Given(/^"([^"]*)" is delivered with "([^"]*)" from workspace "([^"]*)" to "([^"]*)"$/, (title, delivery, source, target) => {
  cy.visit(`/admin/delivery/workspace/${workspaces[source]}`);
  cy.get('#edit-label').type(delivery);
  cy.get('input[value="Create delivery"]').click();
  cy.contains('Push all changes').click();
  cy.contains('Confirm').click();
});

When(/^the user adds language "([^"]*)" to "([^"]*)" in the workspace "([^"]*)"$/, (language, title, workspace) => {
  cy.drupalSession({user: "admin", workspace: workspaces[workspace]});
  cy.visit(`/cypress/entity/node/canonical?title=${encodeURI(title)}`);
  cy.get('.tabs').contains('Translate').click();
  cy.get('.region-content table').contains(language).closest('tr').contains('Add').click();
  cy.get('#edit-title-0-value').type(' - ' + language);
  cy.contains('Save').click();
});

When(/^the user forwards "([^"]*)" from the workspace "([^"]*)" to the workspace "([^"]*)"$/, (delivery, source, target) => {
  cy.drupalSession({user: "admin", workspace: workspaces[source]});
  cy.visit(`/cypress/entity/delivery/canonical?label=${encodeURI(delivery)}`);
  cy.contains('Forward delivery').click();
  cy.contains('Target workspace')
      .closest('fieldset')
      .contains(target).closest('.form-item')
      .find('input').check();
  cy.get(`input[value="Forward"]`).click();
  cy.contains('Push all changes').click();
  cy.contains('Confirm').click();
});

Then(/^the translation overview of "([^"]*)" in workspace "([^"]*)" does not contain a "([^"]*)" translation$/, (title, workspace, language) => {
  cy.drupalSession({user: "admin", workspace: workspaces[workspace]});
  cy.visit(`/cypress/entity/node/drupal:content-translation-overview?title=${encodeURI(title)}`);
});

