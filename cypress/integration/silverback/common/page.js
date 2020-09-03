import {workspaces} from "./mappings";

export const viewPage = function (workspace, title) {
  cy.drupalSession({user: 'admin', workspace: workspaces[workspace]});
  cy.visit(`/cypress/entity/node/canonical?title=${encodeURI(title)}`, {
    failOnStatusCode: false
  });
};
