// @ts-check
/// <reference types="Cypress" />

/**
 * Cypress command to initialize a drupal session.
 *
 * Possible options:
 * * workspace: the workspace machine name
 * * user: a user name to auto log in
 * * language: a language id
 * * toolbar: boolean value if the toolbar should be displayed. hidden by default.
 *
 * @param object options
 *   A list of key value options.
 */

Cypress.Commands.add('drupalSession', function (options) {

  let headers = cy.state('drupalHeaders') || {};

  if (options.user) {
    headers['X-CYPRESS-USER'] = options.user;
  }

  if (options.language) {
    headers['X-CYPRESS-LANGUAGE'] = options.language;
  }

  if (options.workspace) {
    headers['X-CYPRESS-WORKSPACE'] = options.workspace;
  }

  if (options.toolbar) {
    headers['X-CYPRESS-TOOLBAR'] = 'on';
  }

  cy.server({
    onAnyRequest: (route, proxy) => {
      Object.keys(headers).forEach(key => proxy.xhr.setRequestHeader(key, headers[key]));
    }
  });

  cy.state('drupalHeaders', headers);
});

const baseUrl = function() {
  return Cypress.env('DRUPAL_TEST_BASE_URL') || 'http://localhost:8888';
};

const dbUrl = function() {
  return Cypress.env('DRUPAL_TEST_DB_URL') || 'sqlite://localhost/sites/default/files/test.sqlite';
};

Cypress.Commands.add('drush', command => {
  if (Cypress.env('DRUPAL_SITE_PATH')) {
    throw 'Can\'t use drush on a test site installed with `drupalInstall`.';
  }
  return cy.exec(`drush --uri=${baseUrl()} ${command}`);
});

Cypress.Commands.add('drupalScript', (script, args) => {
  cy.request('POST', '/cypress/script', {
    script,
    args,
  });
});

Cypress.Commands.add('drupalInstall', setupFile => {
  setupFile = setupFile ? `--setup-file ".cypress/fixtures/${setupFile}"` : '';
  cy.exec(`php ${Cypress.env('CYPRESS_MODULE_PATH')}/scripts/test-site.php install ${setupFile} --base-url ${baseUrl()} --db-url ${dbUrl()} --json`, {
    env: {
      'DRUPAL_APP_ROOT': Cypress.env('DRUPAL_APP_ROOT')
    },
    timeout: 3000000
  }).then(result => {
    const installData = JSON.parse(result.stdout);
    Cypress.env('DRUPAL_DB_PREFIX', installData.db_prefix);
    Cypress.env('DRUPAL_SITE_PATH', installData.site_path);
    cy.setCookie('SIMPLETEST_USER_AGENT', encodeURIComponent(installData.user_agent));
  });
});

Cypress.Commands.add('drupalUninstall', () => {
  const prefix = Cypress.env('DRUPAL_DB_PREFIX');
  const dbOption = `--db-url ${dbUrl()}`;
  cy.exec(`php ../core/scripts/test-site.php tear-down ${prefix} ${dbOption}`, {
    timeout: 3000000
  });

});

Cypress.Commands.add('drupalVisitEntity', (type, query, link = 'canonical') => {
  const params = Object.keys(query).map(key => `${key}=${encodeURI(query[key])}`).join('&');
  cy.visit(`/cypress/entity/${type}/${link}?${params}`);
});