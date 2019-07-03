<?php

use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;

list($title, $workspace) = $extra;

/** @var \Drupal\workspaces\WorkspaceManagerInterface $workspacesManager */
$workspacesManager = \Drupal::service('workspaces.manager');
/** @var \Drupal\Core\Session\AccountSwitcherInterface $accountSwitcher */
$accountSwitcher = \Drupal::service('account_switcher');
$accountSwitcher->switchTo(User::load(1));

$workspacesManager->executeInWorkspace($workspace, function () use ($title) {
  $node = Node::create([
    'type' => 'page',
    'title' => $title
  ]);
  $node->save();
});
