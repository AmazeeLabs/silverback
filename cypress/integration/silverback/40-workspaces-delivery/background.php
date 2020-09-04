<?php

use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\user\Entity\User;
use Drupal\workspaces\Entity\Workspace;
use Drupal\workspaces\WorkspaceInterface;

include __DIR__ . '/../common/00-workspaces.php';

/** @var \Drupal\workspaces\WorkspaceManagerInterface $workspaceManager */
$workspaceManager = \Drupal::service('workspaces.manager');

/** @var \Drupal\workspaces\WorkspaceInterface $stage */
$stage = Workspace::load('stage');
/** @var \Drupal\workspaces\WorkspaceInterface $dev */
$dev = Workspace::load('dev');
/** @var \Drupal\workspaces\WorkspaceInterface $local_1 */
$local_1 = Workspace::load('local_1');
/** @var \Drupal\workspaces\WorkspaceInterface $local_2 */
$local_2 = Workspace::load('local_2');

/** @var \Drupal\Core\Session\AccountSwitcherInterface $accountSwitcher */
$accountSwitcher = \Drupal::service('account_switcher');
$accountSwitcher->switchTo(User::load(1));

$entityTypeManager = Drupal::entityTypeManager();
/** @var \Drupal\node\NodeStorageInterface $nodeStorage */
$nodeStorage = $entityTypeManager->getStorage('node');

$create = function (WorkspaceInterface $workspace, $title) use ($nodeStorage, $workspaceManager) : NodeInterface {
  return $workspaceManager->executeInWorkspace($workspace->id(), function () use ($workspace, $title, $nodeStorage){
    $page =  Node::create(['type' => 'page', 'title' => $title]);
    $page->save();
    return $page;
  });
};

$modify =  function (WorkspaceInterface $workspace, NodeInterface $page) use ($nodeStorage, $workspaceManager) {
  $workspaceManager->executeInWorkspace($workspace->id(), function () use ($workspace, $page, $nodeStorage){
    /** @var \Drupal\node\NodeInterface $page */
    $page = $nodeStorage->load($page->id());
    $page->setTitle($page->getTitle() . ' - ' . $workspace->label());
    $page->save();
  });
};

$pageA = $create($dev, 'Page A');

$pageB = $create($local_1, 'Page B');

$pageC = $create($stage, 'Page C');
$modify($local_1, $pageC);
$modify($dev, $pageC);

$pageD = $create($dev, 'Page D');
$modify($local_1, $pageD);
