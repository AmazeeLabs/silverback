<?php
/** @var \Drupal\workspaces\WorkspaceManagerInterface $workspaceManager */

use Drupal\user\Entity\User;
use Drupal\workspaces\Entity\Workspace;

$workspaceManager = \Drupal::service('workspaces.manager');
/** @var \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager */
$entityTypeManager = \Drupal::service('entity_type.manager');
/** @var \Drupal\Core\Entity\ContentEntityStorageInterface $workspaceStorage */
$workspaceStorage = $entityTypeManager->getStorage('workspace');

/** @var \Drupal\Core\Session\AccountSwitcherInterface $accountSwitcher */
$accountSwitcher = \Drupal::service('account_switcher');

$accountSwitcher->switchTo(User::load(1));

Workspace::create([
  'id' => 'ch',
  'label' => 'Switzerland',
  'primary_language' => 'de',
  'secondary_languages' => ['fr', 'it'],
  'path_prefix' => '/ch',
])->save();

Workspace::create([
  'id' => 'at',
  'label' => 'Austria',
  'primary_language' => 'de',
  'path_prefix' => '/at',
])->save();
