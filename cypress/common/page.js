import {workspaces} from "./mappings";

export const viewPage = function (workspace, title) {
  cy.drupalSession({user: 'admin', workspace: workspaces[workspace]});
  cy.visit(`/cypress/entity/node/canonical?title=${encodeURI(title)}`, {
    failOnStatusCode: false
  });
};

export const createPage = function (workspace, title) {
  cy.drush(`scr cypress/integration/jira/SLB/common/helpers/create-page.php -- "${title}" ${workspaces[workspace]} `);
};

export const editPage = function (workspace, oldTitle, newTitle) {
  cy.drush(`scr cypress/integration/jira/SLB/common/helpers/edit-page.php -- "${oldTitle}" ${workspaces[workspace]} "${newTitle}"`);
};

