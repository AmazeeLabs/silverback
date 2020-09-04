@Delivery
Feature: Workspaces: Automatic push

  A workspace can be configured to automatically push default revisions to its parent.
This way the workspace hierarchy can be set up to separate "live" and "sandbox" workspaces
that operate automatically.

  Background:
    There is a "Public" workspace which is a direct descendant from "Live" and a "Drafts" workspace that
    is configured to automatically push default revisions.
    There is a simple workflow configuration containing "Draft", "Published" and "Unpublished" states.
    "Published" sets a default revision and marks content as published.
    "Draft" does not create default revisions and marks content as unpublished.
    "Unpublished" creates a default revision and marks content as unpublished.


  @SLB-99 @WIP
  Scenario: Create new workspace with auto push
    When an administrator attempts to create a new workspace
    Then there is a checkbox with label "Auto push"


  @SLB-99 @WIP
  Scenario: Configure existing workspace to use auto push
    Given there is a workspace "Stage"
    When the administrator edits the workspace "Stage" and checks the "Auto push" checkbox
    Then workspace "Stage" is configured to automatically push content


  @SLB-99 @WIP
  Scenario: Draft revisions are not pushed automatically
    Given there is a page "Test" in the "Public" workspace
    When an editor creates a "Draft" revision of the page "Test" called "Test Draft" in the "Drafts" workspace
    Then the title of page "Test" in the "Public" workspace is still "Test"


  @SLB-99 @WIP
  Scenario: Published revisions are pushed automatically
    Given there is a page "Test" in the "Public" workspace
    When an editor creates a "Published" revision of the page "Test" called "Test Published" in the "Drafts" workspace
    Then the title of page "Test" in the "Public" workspace is "Test Published"
    And the page "Test Published" is accessible to anonymous users


  @SLB-99 @WIP
  Scenario: Unpublished revisions are pushed automatically
    Given there is a page "Test" in the "Public" workspace
    When an editor creates an "Unpublished" revision of the page "Test" called "Test Unpublished" in the "Drafts" workspace
    Then the title of page "Test" in the "Public" workspace is "Test Unpublished"
    And the page "Test Unpublished" is not accessible to anonymous users
