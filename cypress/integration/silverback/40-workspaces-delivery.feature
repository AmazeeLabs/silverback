@Workspaces @Delivery
Feature: Workspaces: Delivery

  

  Background:
    There are six initial workspaces. "Live", which is the default workspace,
    "Stage" and "QA" which declare "Live" as their parent, "Dev" which is a child of "Stage"
    and "Local 1" and "Local 2" which are children of "Dev" and serve as content sandboxes.
    There is also a "Page" content type that can be used for testing workspace features.
    
    Initially there are four pages: A, B, C and D.
    Page A has been created in the Dev workspace.
    Page B has been created in the Local 1 workspace.
    Page C has been created in Stage and overridden in Dev and Local 1 simultaneously
    Page D has been created in Dev and overridden in Local 1


  @ORPHAN
  Scenario: Delivery suggests to include all content that does not exist in the parent workspace
    Given an administrator is using the "Local 1" workspace
    When the user attempts to create a new delivery from "Local 1"
    Then the suggested delivery items contain "Page B"
    And the suggested delivery items contain "Page C - Local 1"
    And the suggested delivery items contain "Page D - Local 1"


  @ORPHAN
  Scenario: All suggested delivery items are preselected
    Given an administrator is using the "Local 1" workspace
    When the user attempts to create a new delivery from "Local 1"
    And the user chooses "Delivery A" as the delivery title
    And the user creates the delivery
    Then the user should see the status page of "Delivery A"
    And the status table contains "Page B"
    And the status table contains "Page C - Local 1"
    And the status table contains "Page D - Local 1"


  @ORPHAN
  Scenario: Delivery is created with selected items only
    Given an administrator is using the "Local 1" workspace
    When the user attempts to create a new delivery from "Local 1"
    And the user chooses "Delivery A" as the delivery title
    And the user deselects "Page D - Local 1"
    And the user creates the delivery
    Then the user should see the status page of "Delivery A"
    And the status table contains "Page B"
    And the status table contains "Page C - Local 1"
    And the status table does not contain "Page D - Local 1"


  @ORPHAN
  Scenario: Deliveries automatically target the parent workspace
    Given an administrator is using the "Local 1" workspace
    And a delivery "Delivery A" has been created including all changes from workspace "Local 1"
    When the user inspects the delivery status of "Delivery A"
    Then the source workspace is "Local 1"
    And the target workspace is "Dev"


  @ORPHAN
  Scenario: Delivery items show their correct status
    Given an administrator is using the "Local 1" workspace
    And a delivery "Delivery A" has been created including all changes from workspace "Local 1"
    When the user inspects the delivery status of "Delivery A"
    Then the status of "Page B" should be "Added by Local 1" and link to the "Resolve" form
    Then the status of "Page C - Local 1" should be "Conflict" and link to the "Resolve" form
    Then the status of "Page D - Local 1" should be "Modified by Local 1" and link to the "Resolve" form


  @ORPHAN
  Scenario Outline: Force push a delivery from <workspace>
    Given an administrator is using the "<label>" workspace
    And a delivery "Delivery A" has been created including all changes from workspace "Local 1"
    When the user inspects the delivery status of "Delivery A"
    And the user clicks the "Push all changes" button
    And the user confirms the decision to push all changes
    Then the user should see the status page of "Delivery A"
    And the user should see a status message "The changes have been pushed."
    And the status of "Page B" should be "Identical"
    And the status of "Page C - Local 1" should be "Identical"
    And the status of "Page D - Local 1" should be "Identical"
    Examples:
      | workspace | label   |
      | source    | Local 1 |
      | target    | Dev     |


  @ORPHAN
  Scenario: Pull delivery without conflicts
    Given an administrator is using the "Stage" workspace
    And a delivery "Delivery A" has been created including all changes from workspace "Dev"
    And the user inspects the delivery status of "Delivery A"
    And the user clicks the "Pull all changes" button
    And the user confirms the decision to pull all changes
    Then the user should see the status page of "Delivery A"
    And the user should see a status message "Delivery updates pulled successfully."
    And the status of "Page A" should be "Identical"
    And the status of "Page C - Dev" should be "Identical"
    And the status of "Page D" should be "Identical"


  @ORPHAN
  Scenario: Pull delivery with conflicts
    Given an administrator is using the "Dev" workspace
    And a delivery "Delivery A" has been created including all changes from workspace "Local 1"
    And the user inspects the delivery status of "Delivery A"
    And the user clicks the "Pull all changes" button
    And the user confirms the decision to pull all changes
    Then the user should see the status page of "Delivery A"
    And the user should see a status message "1 items have been skipped due to conflicts. Please resolve them manually."
    And the status of "Page B" should be "Identical"
    And the status of "Page C - Local 1" should be "Conflict"
    And the status of "Page D - Local 1" should be "Identical"


  @ORPHAN
  Scenario: Can not forward an unresolved delivery
    Given an administrator is using the "Stage" workspace
    And a delivery "Delivery A" has been created including all changes from workspace "Dev"
    When the user clicks the "Forward delivery" button
    Then the "Forward" button should be disabled
    And the user should see a status message "This delivery has conflicts or pending changes and cannot be forwarded."


  @ORPHAN
  Scenario: Forward a resolved delivery
    Given an administrator is using the "Stage" workspace
    And a delivery "Delivery A" has been created including all changes from workspace "Dev"
    And delivery "Delivery A" has been pulled into the "Stage" workspace
    When the user clicks the "Forward delivery" button
    And the user selects the "QA" workspace as a forward target
    And the user forwards the delivery
    Then the user should see the status page of "FWD: Delivery A"
    And the user should see a status message "Delivery  Delivery A forwarded."
    And the status of "Page A" should be "Added by Stage"
    And the status of "Page C - Dev" should be "Added by Stage"
    And the status of "Page D" should be "Added by Stage"


  @ORPHAN
  Scenario: Push a single new delivery item
    Given an administrator is using the "Local 1" workspace
    And a delivery "Delivery A" has been created including all changes from workspace "Local 1"
    When the user inspects the delivery status of "Delivery A"
    And the user clicks the status label of delivery item "Page B"
    And the user confirms to push this item to the target workspace
    Then the user should see a status message "The changes have been imported."
    And the status of "Page B" should be "Modified by Dev"
    And the page "Page B" should be available in the "Dev" workspace


  @ORPHAN
  Scenario: Resolve an delivery item without conflicts
    Given an administrator is using the "Local 1" workspace
    And a delivery "Delivery A" has been created including all changes from workspace "Local 1"
    When the user inspects the delivery status of "Delivery A"
    And the user clicks the status label of delivery item "Page D - Local 1"
    And the user confirms to deliver this item to the target workspace
    Then the user should see a status message "The changes have been imported."
    And the status of "Page D - Local 1" should be "Modified by Dev"
    And the page "Page D - Local 1" should be available in the "Dev" workspace


  @ORPHAN
  Scenario: Manually resolve conflicts in a delivery item
    Given an administrator is using the "Local 1" workspace
    And a delivery "Delivery A" has been created including all changes from workspace "Local 1"
    When the user inspects the delivery status of "Delivery A"
    And the user clicks the status label of delivery item "Page C - Local 1"
    And the user enters "Page C - Merged" as a custom title
    And the user finishes resolution of this conflict
    Then the user should see a status message "The changes have been imported."
    And the status of "Page C - Local 1" should be "Modified by Dev"
    And the page "Page C - Merged" should be available in the "Dev" workspace
    And the page "Page C - Merged" should be available in the "Local 1" workspace


  @ORPHAN
  Scenario: Forwarded entity consists only of initial language version
    Given an administrator is using the "Dev" workspace
    And there is a "Page A" in workspace "Dev" in language "English"
    And "Page A" is delivered with "Delivery A" from workspace "Dev" to "Stage" 
    When the user adds language "German" to "Page A" in the workspace "Dev"
    And the user forwards "Delivery A" from the workspace "Stage" to the workspace "QA" 
    Then the translation overview of "Page A" in workspace "QA" does not contain a "German" translation
