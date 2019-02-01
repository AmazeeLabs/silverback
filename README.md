[![Build Status](https://travis-ci.com/AmazeeLabs/silverback.svg?branch=master)](https://travis-ci.com/AmazeeLabs/silverback)

# Amazee Silverback

`amazee/silverback` is a composer package adding common project dependencies, tooling and configuration scaffolding to Amazee Drupal projects. It aims to improve product quality and reduce maintenance costs by encouraging three simple principles:

1. **Maximize open source:** Lower initial costs, technical debt and maintenance costs by using and contributing to open source code as much as possible. For every feature required by a project that is not solvable by configuration or theming, try to find a generic solution that can be contributed and added as a dependency to `amazeelabs/silverback`.
2. **Minimize requirements:** It has to be as easy as possible to work on a project. If you need the production database and a local elasticsearch cluster to edit CSS files, you are doing microservices terribly wrong. *Example:* By default silverback development sites run on SQLite. MySQL is considered a performance optimization, and it's not in the projects scope to test Drupal's database abstraction layer.
3. **Testability first:** A project has to be fully testable with only the git repository at any time. All required assets (test content, media, configuration) have to be set up during the installation process. It **must not** rely on production data. Every feature and bug fix has to bring a test case that can be reproduced. It might take more time initially, but it will pay off.

## Installation

### Prerequisites

To create or work on a Silverback project the following tools have to be available on your system:

* A [PHP 7](http://php.net/manual/en/install.php) interpreter meeting [Drupal requirements](https://www.drupal.org/docs/8/system-requirements/php-requirements)
* Installed and configured [direnv](https://direnv.net/) (don't forget about the [setup](https://direnv.net/index.html#setup) for your shell)
* Globally installed [composer](https://getcomposer.org/)
* *Optional:* A bitcoin miner to give the other three processor cores a purpose, since they are not consumed by docker any more.

### Project initialisation

Given you already created a composer based Drupal project like this:
```bash
composer create-project drupal-composer/drupal-project:8.x-dev my-project --no-interaction
```

You just have to require the `amazeelabs/silverback` composer package and initialise it:

```bash
cd my-project
composer remove drupal/core
composer require amazeelabs/silverback
./vendor/bin/silverback init
yarn
```

If you've set up `direnv` correctly, it will complain at this point that there is an unknown `.envrc` file. Just execute `direnv allow` to enable it. From now own environment variables and executable search paths will be set automatically whenever you enter this directory. Here is how it should look in case of a correct installation:  
```
me@local:~/Projects $ cd my-project/
direnv: error .envrc is blocked. Run `direnv allow` to approve its content.
me@local:~/Projects/my-project $ direnv allow
direnv: loading .envrc
direnv: export +CYPRESS_BASE_URL ... +SB_TEST_CONTENT ~PATH
me@local:~/Projects/my-project $ cd ..
direnv: unloading
me@local:~/Projects $ cd my-project/
direnv: loading .envrc
direnv: export +CYPRESS_BASE_URL ... +SB_TEST_CONTENT ~PATH
```

Requiring and initating the package did a couple of things:

* A list of common project dependencies have been installed.
* Configuration files for Travis, Lando and amazee.io have been created.
* Your composer.json has been slightly modified.
* An environment-based `settings.php` has been placed in `web/sites/default`.
* A `tests` directory with a fully operational [Cypress] setup appeared.
* A `.env` file was initialised that you can use to configure your local environment.

### Updating

To update Silverback along with its dependencies simply update the composer package:

```bash
composer upgrade amazeelabs/silverback --with-dependencies
```

This will also trigger an update hook that re-runs `silverback init`. If you removed the update hook, you'll have to do that yourself. This will overwrite all the scaffolded files to get in any updates. You can just use git to select which updates you want and which not.

### Running the website locally

To run the project locally, just execute the setup procedure and start a local development server:

```bash
silverback setup
drush serve
```

Now your Drupal installation should be accessible at http://localhost:8888. Admin account credentials can be configured in your `.env` file.

Another invocation of `silverback setup` will scratch the current install and and create a new one. `silverback teardown` will just do the *scratch* part. Running `silverback setup --backup` will create a backup before removing the current install, and `silverback teardown --restore` will bring the latest backup back. These two commands are mainly used by the end to end testing processes to spin up test sites (*TODO: Move test sites to simpletest subsites*).

**Danger:** Currently, there can be only ***one*** backup.

## Testing

### Test content

Silverback assumes that production databases are somewhat confidential and copying them all over the place might be a major security risk. So, no database syncing. Every new feature should provide illustrative test content by including a *test content module*, that contains [`default_content`](https://www.drupal.org/project/default_content) exports or install hooks to create reproducible and testable content.

> After `silverback setup` a project has to be fully operational and testable.

***TODO:** More detailed instructions for providing default content.*

### Running tests

There are two levels of testing which will be executed by the [Travis] configuration added by `silverback init`.

Custom modules are tested with [Drupal's standard testing frameworks](https://www.drupal.org/docs/8/testing). [Travis] will execute all Drupal tests in `web/modules/custom`.

For end to end testing, a [Cypress] configuration is provided in the `tests` folder. `silverback init` should have added some basic tests that you can run immediately.

```bash
cd tests
npm install
cypress run
```

This should run the tests in a headless browser. To run them interactively and automatically, execute `cypress open`, which will bring up the cypress interface. For more information on cypress options, please have a look at the [Cypress CLI documentation].

### Writing tests

#### Simple javascript tests

You can learn how to write standard javascript tests from the [Cypress documentation](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file).

#### Behavioral testing

The preferred way for writing tests is to use [Gherkin] to provide a specification of your feature ***before*** implementing it, and then adding step definitions to actually test your application.

One general misconception about behavior testing is to think it is there so you don't have to write test code but just *"plain English"*. *But that's not true!* As a side effect, you *might* be able to reuse some step definitions here and there, but the main goal is to create digestable feature definitions that all stakeholders can understand and participate on.

There is a lot of literature on writing good test specifications:

- [How the training wheels came off](http://aslakhellesoy.com/post/11055981222/the-training-wheels-came-off) by Aslak Hellesøy
- [The cucumber.io blog](https://cucumber.io/blog)
- [The cucumber podcast](https://soundcloud.com/cucumber-podcast)

Silverback comes with a simple example that tests the administration login:

```gherkin
Feature: Login

  Basic Drupal site setup and administration login.

  Background:
    Initial site setup with working administration login.

  @Silverback @COMPLETED
  Scenario: Valid Login
    Given I am on the login screen
    And I use the administration credentials to log in
    Then I should see the administration toolbar
```

This feature specification lives in any subfolder of `tests/cypress/integration`, where you can also find the full example of the login feature.
The tags the scenarios are annotated with allow to control *which* tests are executed. The travis configuration will by default only execute tests that are tagged with `@COMPLETED`, So feature definitions can be added and worked on without breaking tests.

The corresponding step definitions look like this:

```javascript
/* global Given, When, Then */

const login = (user, pass) => () => {
  cy.visit('/user/login');
  cy.get('#edit-name').type(user);
  cy.get('#edit-pass').type(pass);
  cy.get('#edit-submit').contains('Log in').click();
};

Given(/^I am on the login screen$/, () => {
  cy.visit('/user/login');
});

When(/^I use the administration credentials to log in$/, login("admin", "admin"));

Then(/^I should see the administration toolbar$/, () => {
  cy.get('#toolbar-bar');
});
```

We use [cucumber.js](https://cucumber.io/) and regular expressions to map readable step definitions to actual step implementations in javascript. Within these steps, you can use all [cypress commands and extensions](http://docs.cypress.io).

> Every scenario has to be isolated, and must not depend on execution of a previous scenario. Silverback contains hooks that will run `silverback setup` and `silverback teardown` at the beginning and end of every scenario to enforce that.

#### Jira integration

You can use the [Behave Pro] extension for Jira to maintain and discuss your specifications right alongside your tickets, which is a great way to make them more visible to all the stakeholders that understand *git* as an insult.

Silverback comes with a `silverback download-tests` command that will pull all feature specifications for a project. To enable it, you just have to add some variables to the `.env` file at the root of the project:

* `SB_JIRA_HOST`: The domain name of the Jira instance.
* `SB_JIRA_USER`: The Jira user account.
* `SB_JIRA_PASS`: The Jira account password.
* `SB_JIRA_PROJECTS`: A space separated list of Jira projects as `[shortcut]:[project id]` pairs. For example: `PROJ:12345`. To get your Jira project ID you might have to consult the instance' administrator.

Tests are downloaded to project specific subfolders of `tests/cypress/integration`, (e.g. `tests/cypress/integration/PROJ`) and *should not be added to the git repsitory*, since they may change outside of the development workflow.

Scenarios downloaded from Jira will automatically be tagged based on their ticket, assignee and workflow state. Scenarios of tickets that are in progress are marked as `@WIP` while everything that is considered *done* has the tag `@COMPLETED`. Thats how the [Travis] configuration will only execute tests that are actually worth executing. For local development it might make sense to set the `CYPRESS_TAGS` environment variable to `@assignee:my-jira-name and @WIP` to only run tests for tickets that are assigned to oneself and currently in progress. It is also possible to add custom tags to scenarios in Jira.

**Note:** The cucumber implementation currently only takes tags on scenarios into account. [Behave Pro] also allows to tag whole features, but these are ignored by the test runner (TODO: fix it in https://github.com/TheBrainFamily/cypress-cucumber-preprocessor).


## Development workflow

To get the most out of (and in to) `amazeelabs/silverback`, the development process should follow a common pattern:

1. Review feature/bug request
2. Create the project level feature specification
3. Investigate which parts are not doable by just configuring and/or theming existing components.
4. Try to find a reusable, generic solution (e.g. Views/Rules/Block/GraphQL plugins).
5. Create a pull request against `amazeelabs/silverback` with the proposed changes/additions. It should contain:
    * The code/dependency changes themselves.
    * New or modified feature specifications in `assets/tests/cypress/integration/silverback`.
    * New or modified documentation pages in `docs` (**TODO:** use https://docusaurus.io/?).
    * Example configuration in `config`.
6. Apply the pull request as a patch in your projects `composer.json`.
7. If there are dependency changes, you have to add them temporarily to your project's
`composer.json`. Composer patches can't affect dependencies since they are collecteded before patches are applied.


## Lagoon

The project is ready to be used with amazeeio local development flow. Just install [Pygmy], run `docker-compose up -d` and the site is ready to be installed.

### Drush aliases

Lagoon doesn't yet support just-in-time fetching of site aliases for drush 9. Please refer to [the docs](https://lagoon.readthedocs.io/en/latest/using_lagoon/drupal/drush9/) for a work-around.

[Travis]: http://travis-ci.org
[Cypress]: https://www.cypress.io
[Cypress CLI documentation]: https://docs.cypress.io/guides/guides/command-line.html
[Gherkin]: https://docs.cucumber.io/gherkin/reference/
[Behave Pro]: https://marketplace.atlassian.com/apps/1211664/behave-pro-for-bdd-jira-git-cucumber?hosting=cloud&tab=overview
[Pygmy]: https://docs.amazee.io/local_docker_development/pygmy.html

## Webpack

The project is set up to use webpack to bundle drupal libraries, so they can be written in modern javascript and import packages from npm. Setup:

- `drush en -y webpack_babel` (there's webpack_react too if you need react)
- `yarn webpack-dev` - starts the local webpack dev server. This needs to be on all the time during development, so the libraries are built. If you don't want to change anything, but have the libraries working, run `drush webpack:build`.

### Known issues

- In case of javascript errors, first try disabling the aggregation at _/admin/config/development/performance_.
- Only one `yarn webpack-dev` can be running at any given point in time.
