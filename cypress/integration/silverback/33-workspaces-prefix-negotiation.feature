Feature: Workspaces: Prefix negotiation

  The "workspace_negiator_path" module allows every workspace to have a registered path.
If the current url is prefixed with this path, the workspace will be negotiated accordingly.

  Background:
    The "workspace_negotiator_path" module is enabled.


  @ORPHAN
  Scenario: Access the frontpage without a prefix
    Given there is a workspace "Test" that has the configured path "/test"
    When the user accesses the frontpage without a prefix
    Then the "Live" workspace is active


  @ORPHAN
  Scenario: Access the frontpage with a prefix
    Given there is a workspace "Test" that has the configured path "/test"
    When the user accesses the frontpage with the "/test" prefix
    Then the "Test" workspace is active
