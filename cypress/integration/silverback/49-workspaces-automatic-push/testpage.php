<?php

use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;

/** @var \Drupal\workspaces\WorkspaceManagerInterface $workspacesManager */
$workspacesManager = \Drupal::service('workspaces.manager');
/** @var \Drupal\Core\Session\AccountSwitcherInterface $accountSwitcher */
$accountSwitcher = \Drupal::service('account_switcher');
$accountSwitcher->switchTo(User::load(1));

/** @var \Drupal\Core\Path\AliasStorageInterface $aliasStorage */
$aliasStorage = \Drupal::service("path.alias_storage");

$workspacesManager->executeInWorkspace('public', function () use ($node, $nodeStorage, $aliasStorage) {
  $node = Node::create([
    'type' => 'page',
    'title' => 'Test',
    'status' => 1,
    'moderation_state' => 'published',
  ]);
  $node->status = 1;
  $node->moderation_state = 'published';
  $node->save();
  $aliasStorage->save("/node/" . $node->id(), "/test");
});
