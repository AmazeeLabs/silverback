<?php

list($machine_name, $label, $path) = $extra;

/** @var \Drupal\workspaces\WorkspaceStorage $workspaceStorage */
$workspaceStorage = \Drupal::entityTypeManager()->getStorage('workspace');

$workspaceStorage->create([
  'id' => $label,
  'label' => $label,
  'path_prefix' => $path,
])->save();

