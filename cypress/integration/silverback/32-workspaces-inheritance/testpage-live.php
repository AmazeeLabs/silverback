<?php
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;

/** @var \Drupal\workspaces\WorkspaceManagerInterface $workspacesManager */
$workspacesManager = \Drupal::service('workspaces.manager');
/** @var \Drupal\Core\Session\AccountSwitcherInterface $accountSwitcher */
$accountSwitcher = \Drupal::service('account_switcher');
$accountSwitcher->switchTo(User::load(1));

$workspacesManager->executeInWorkspace('live', function () {
  $node = Node::create([
    'type' => 'page',
    'title' => 'Test Live'
  ]);
  $node->save();
});
