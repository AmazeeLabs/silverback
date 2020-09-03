@Workspaces @Multilingual
Feature: Workspaces: Languages

  Since workspaces are in use for different region websites, there is an option to control the languages that are available.
The assigned languages control in which languages content can be created in or translated to. The system also makes
sure that users are redirected to the correct language version if they access a language that is not available in a workspace.

  Background:
    The "workspaces_allowed_languages" module is enabled. The system has four available languages: "German", "English", "French" and "Italian".
    There is a page that has been translated into all languages. "Test German", "Test English", "Test French" and "Test Italian". The "Workspace prefix and URL"
    is configured and the "Page" content type is configured to show a language switcher in the create form.


  @ORPHAN
  Scenario: Configure workspace languages
    Given there is a workspace "Switzerland" with the primary language "German" and the secondary languages "French" and "English"
    When the administrator attempts to edit the "Switzerland" workspace
    Then there is an option to select the primary language with "German" preselected
    And there is an option to select multiple secondary languages with "French" and "Italian" preselected


  @ORPHAN
  Scenario: Content can be created in assigned languages only
    Given there is a workspace "Switzerland" with the primary language "German" and the secondary languages "French" and "English"
    When the administrator attempts to create a new "Page" in the "Switzerland" workspace
    Then the language choice has the three options "German", "French" and "Italian"


  @ORPHAN
  Scenario: Content can be translated to assigned languages only
    Given there is a workspace "Switzerland" with the primary language "German" and the secondary languages "French" and "English"
    When an administrator accesses the "Translations" tab of page "Test English"
    Then there should be a row for "German"
    And there should be a row for "French"
    And there should be a row for "Italian"
    And there should not be a row for "English"


  @ORPHAN
  Scenario: No creation language options if workspace has no secondary languages
    Given there is a workspace "Austria" with the primary language "German" and no secondary languages
    When the administrator attempts to create a new "Page" in the "Austria" workspace
    Then there is no option to select a language


  @ORPHAN
  Scenario: No translations tab for workspaces without secondary languages
    Given there is a workspace "Austria" with the primary language "German" and no secondary languages
    When a visitor accesses the page "Test English" in the "Austria" workspace
    Then the "Translations" tab is not available


  @ORPHAN
  Scenario: Pages can be accessed in the primary language
    Given there is a workspace "Switzerland" with the primary language "German" and the secondary languages "French" and "English"
    When a visitor accesses the page "Test English" in "German" in the "Switzerland" workspace
    Then the displayed page title is "Test German"


  @ORPHAN
  Scenario: Pages can be accessed in secondary languages
    Given there is a workspace "Switzerland" with the primary language "German" and the secondary languages "French" and "English"
    When a visitor accesses the page "Test English" in "French" in the "Switzerland" workspace
    Then the displayed page title is "Test French"


  @ORPHAN
  Scenario: Unavailable languages result in a page not found error
    Given there is a workspace "Switzerland" with the primary language "German" and the secondary languages "French" and "English"
    When a visitor accesses the page "Test English" in "English" in the "Switzerland" workspace
    Then a "Page not found" error is displayed
