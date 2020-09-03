<?php

/** @var \Drupal\workspaces\WorkspaceStorage $workspaceStorage */
$workspaceStorage = \Drupal::entityTypeManager()->getStorage('workspace');

$workspaceStorage->create([
  'id' => 'machine_name',
  'label' => 'Test',
  'path_prefix' => '/test',
])->save();
