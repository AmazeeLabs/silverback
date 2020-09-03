<?php

use Drupal\ckeditor5_sections\Normalizer\DocumentSectionNormalizer;
use Drupal\media\Entity\Media;
use Drupal\menu_link_content\Entity\MenuLinkContent;
use Drupal\node\NodeInterface;
use Drupal\user\Entity\User;
use Drupal\workspaces\Entity\Workspace;
use Drupal\workspaces\WorkspaceInterface;

/** @var \Drupal\workspaces\WorkspaceManagerInterface $workspaceManager */
$workspaceManager = \Drupal::service('workspaces.manager');
/** @var \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager */
$entityTypeManager = \Drupal::service('entity_type.manager');
/** @var \Drupal\Core\Entity\ContentEntityStorageInterface $workspaceStorage */
$workspaceStorage = $entityTypeManager->getStorage('workspace');

/** @var \Drupal\Core\Session\AccountSwitcherInterface $accountSwitcher */
$accountSwitcher = \Drupal::service('account_switcher');

$accountSwitcher->switchTo(User::load(1));

$live = Workspace::load('live');
if ($stage = Workspace::load('stage')) {
  $stage->delete();
}

$create_workspace = function ($id, $label, $parent) use ($workspaceStorage) : WorkspaceInterface {
  /** @var WorkspaceInterface $workspace */
  $workspace = $workspaceStorage->create([
    'id' => $id,
    'path_prefix' => '/' . $id,
    'label' => $label,
    'parent' => $parent,
  ]);
  $workspace->save();
  return $workspace;
};

$stage = $create_workspace('stage', 'Stage', $live);
$dev = $create_workspace('dev', 'Dev', $stage);
$local_1 = $create_workspace('local_1', 'Local 1', $dev);
$local_2 = $create_workspace('local_2', 'Local 2', $dev);
$qa = $create_workspace('qa', 'QA', $live);
$public = $create_workspace('public', 'Public', $live);
$drafts = $create_workspace('drafts', 'Drafts', $public);
$drafts->auto_push = TRUE;
$drafts->save();

$createEntity = function ($storage, $values, $workspace = NULL) use ($workspaceManager, $stage) {
  return $workspaceManager->executeInWorkspace($workspace ? $workspace->id() : $stage->id(), function () use ($storage, $values) {
    $entity = $storage->create($values);
    $entity->save();
    return $entity;
  });
};

