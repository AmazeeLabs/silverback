@Workspaces
Feature: Workspaces: Inheritance

  Workspaces can be in a parent-child relationship. A child workspace inherits all content from its parent.
Since every new content will create an initial revision in the "Live" workspace, this means that it will
also appear unpublished in each workspace. If this should not be the case, a combination of permission
settings and listing filters have to be employed.

  Background:
    There are 5 initial workspaces. "Live", which is the default workspace,
    "Stage" and "QA" which declare "Live" as their parent, "Dev" which is a child of "Stage"
    and "Local 1" and "Local 2" which are children of "Dev" and serve as content sandboxes.
    There is also a "Page" content type that can be used for testing workspace features.
    
    The main content listing is configured with the "Current workspace" filter which reduces
    the result list to entries that have a revision related to the current workspace.


  @ORPHAN @Todo
  Scenario: Live content is not accessible in workspaces
    Given there is a page with title "Test Live" in the "Live" workspace
    When an administrator accesses the "Test Live" page in the "Stage" workspace
    Then the user sees a "Page not found" error


  @ORPHAN @Todo
  Scenario: Live content is excluded from the admin listing
    Given there is a page with title "Test Live" in the "Live" workspace
    When an administrator accesses the "content administration" page of the "Stage" workspace
    Then there should be no line for the page "Test Live"


  @ORPHAN @Todo
  Scenario: Content can be overridden in child workspaces
    Given there is a page with title "Test Stage" in the "Stage" workspace
    And the title of "Test Stage" has been changed to "Test Dev" in the "Dev" workspace
    When an administrator accesses the "content administration" page of the "Dev" workspace
    And the user clicks the title of the "Test Dev" row
    Then the page title on the view and edit screen is "Test Dev"


  @ORPHAN @Todo
  Scenario: Overridden content does not affect the parent workspace
    Given there is a page with title "Test Stage" in the "Stage" workspace
    And the title of "Test Stage" has been changed to "Test Dev" in the "Dev" workspace
    When an administrator accesses the "content administration" page of the "Stage" workspace
    And the user clicks the title of the "Test Stage" row
    Then the page title on the view and edit screen is "Test Stage"


  @ORPHAN @Todo
  Scenario: Overridden content does not affect unrelated workspaces
    Given there is a page with title "Test Stage" in the "Stage" workspace
    And the title of "Test Stage" has been changed to "Test Local 1" in the "Local 1" workspace
    When an administrator accesses the "content administration" page of the "Local 2" workspace
    And the user clicks the title of the "Test Stage" row
    Then the page title on the view and edit screen is "Test Stage"
