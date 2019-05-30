# Testing

## Test content

Silverback assumes that production databases are somewhat confidential and copying them all over the place might be a major security risk. So, no database syncing. Every new feature should provide illustrative test content by including a *test content module*, that contains [`default_content`](https://www.drupal.org/project/default_content) exports or install hooks to create reproducible and testable content.

> After `silverback setup` a project has to be fully operational and testable.

***TODO:** More detailed instructions for providing default content.*

## Running tests

There are two levels of testing which will be executed by the [Travis] configuration added by `silverback init`.

Custom modules are tested with [Drupal's standard testing frameworks](https://www.drupal.org/docs/8/testing). [Travis] will execute all Drupal tests in `web/modules/custom`.

For end to end testing, a [Cypress] configuration is provided in the `tests` folder. `silverback init` should have added some basic tests that you can run immediately.

```bash
drush serve :8889
cd tests
npm install
cypress run
```

This should run the tests in a headless browser. To run them interactively and automatically, execute `cypress open`, which will bring up the cypress interface. For more information on cypress options, please have a look at the [Cypress CLI documentation].

## Writing tests

### Simple javascript tests

You can learn how to write standard javascript tests from the [Cypress documentation](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file).

### Behavioral testing

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

### Jira integration

You can use the [Behave Pro] extension for Jira to maintain and discuss your specifications right alongside your tickets, which is a great way to make them more visible to all the stakeholders that understand *git* as an insult.

Silverback comes with a `silverback download-tests` command that will pull all feature specifications for a project. To enable it, you just have to add some variables to the `.env` file at the root of the project:

* `SB_JIRA_HOST`: The domain name of the Jira instance.
* `SB_JIRA_USER`: The Jira user account.
* `SB_JIRA_PASS`: The Jira account password.
* `SB_JIRA_PROJECTS`: A space separated list of Jira projects as `[shortcut]:[project id]` pairs. For example: `PROJ:12345`. To get your Jira project ID you might have to consult the instance' administrator.

Tests are downloaded to project specific subfolders of `tests/cypress/integration`, (e.g. `tests/cypress/integration/PROJ`) and *should not be added to the git repsitory*, since they may change outside of the development workflow.

Scenarios downloaded from Jira will automatically be tagged based on their ticket, assignee and workflow state. Scenarios of tickets that are in progress are marked as `@WIP` while everything that is considered *done* has the tag `@COMPLETED`. Thats how the [Travis] configuration will only execute tests that are actually worth executing. For local development it might make sense to set the `CYPRESS_TAGS` environment variable to `@assignee:my-jira-name and @WIP` to only run tests for tickets that are assigned to oneself and currently in progress. It is also possible to add custom tags to scenarios in Jira.

**Note:** The cucumber implementation currently only takes tags on scenarios into account. [Behave Pro] also allows to tag whole features, but these are ignored by the test runner (TODO: fix it in https://github.com/TheBrainFamily/cypress-cucumber-preprocessor).
