Feature: Workspaces: Bypass default workspace integrity

  To ensure that modifications within a workspace never directly affect the "Live" workspace, Drupal employs a very restrictive
mechanism that blocks all forms that are not marked as "workspace safe" and raises fatal errors when entities that are not
under control of workspaces are being modified or deleted. The delivery module removes these restrictions to be able to
implement it's own constraints based on roles and permissions.


  @ORPHAN
  Scenario: Save the admin account which would result in a blocked form and an entity constraint violation
    Given an administrator is using the "Stage" workspace
    When the user attempts to save the account with name "admin"
    Then there is a status message reading "The changes have been saved."
