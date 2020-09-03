<?php

use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;

/** @var \Drupal\workspaces\WorkspaceManagerInterface $workspacesManager */
$workspacesManager = \Drupal::service('workspaces.manager');
/** @var \Drupal\Core\Session\AccountSwitcherInterface $accountSwitcher */
$accountSwitcher = \Drupal::service('account_switcher');
$accountSwitcher->switchTo(User::load(1));

$node = Node::create([
  'type' => 'page',
  'title' => 'Test English',
  'status' => 1,
  'moderation_statec' => 'published',
]);
/** @var \Drupal\Core\Entity\ContentEntityStorageInterface $nodeStorage */
$nodeStorage = \Drupal::entityTypeManager()->getStorage('node');

$node = $nodeStorage->createRevision($node);
$node = $node->addTranslation('de');
$node->title = 'Test German';
$node->status = 1;
$node->moderation_state = 'published';
$node->save();

$node = $nodeStorage->createRevision($node);
$node = $node->addTranslation('fr');
$node->title = 'Test French';
$node->status = 1;
$node->moderation_state = 'published';
$node->save();

$node = $nodeStorage->createRevision($node);
$node = $node->addTranslation('it');
$node->title = 'Test Italian';
$node->status = 1;
$node->moderation_state = 'published';
$node->save();

foreach (['at', 'ch'] as $workspace) {
  $workspacesManager->executeInWorkspace($workspace, function () use ($node, $nodeStorage) {
    $local = $nodeStorage->createRevision($node);
    $local->status = 1;
    $node->moderation_state = 'published';
    $local->save();
  });
}

