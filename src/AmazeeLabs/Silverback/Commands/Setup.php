<?php

namespace AmazeeLabs\Silverback\Commands;

use Alchemy\Zippy\Zippy;
use Drupal\Core\Archiver\Zip;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Process\Exception\ProcessFailedException;

class Setup extends SilverbackCommand {

  protected function configure() {
    $this->setName('setup');
    $this->setDescription('Install a new test site.');
    $this->addOption('backup', 'b', InputOption::VALUE_NONE, 'Create a backup of the current site.');
    $this->addOption('force', 'f', InputOption::VALUE_NONE, 'Force installation.');
    $this->addOption('cypress', 'c', InputOption::VALUE_NONE, 'Use cypress subdir.');
  }

  protected function execute(InputInterface $input, OutputInterface $output) {
    parent::execute($input, $output);

    $siteDir = $input->getOption('cypress') ? 'cypress' : 'default';
    if ($input->getOption('cypress') && !$this->fileSystem->exists('web/sites/' . $siteDir))  {
      $this->copyDir('web/sites/default', 'web/sites/' . $siteDir);
      $this->fileSystem->remove('web/sites/' . $siteDir . '/files');
    }

    $configDir = 'config/sync';
    $hash = $this->getConfigHash($this->rootDirectory . '/' . $configDir);

    if ($input->getOption('force')) {
      $this->fileSystem->remove($this->cacheDir . '/' . $hash);
    }

    if ($input->getOption('backup') && $this->fileSystem->exists('web/sites/' . $siteDir . '/files')) {
      $this->copyDir('web/sites/' . $siteDir . '/files', $this->cacheDir . '/backup');
    }

    if (!$this->fileSystem->exists('config/sync/core.extension.yml')) {
      $this->copyDir('vendor/amazeelabs/silverback/config', 'config/sync');
    }

    $this->fileSystem->remove('web/sites/' . $siteDir . '/files');

    // Remove the installation cache if a forced reinstall is requested.
    if ($this->fileSystem->exists('install-cache.zip') && $input->getOption('force')) {
      $this->fileSystem->remove('install-cache.zip');
    }

    if (!$this->fileSystem->exists($this->cacheDir . '/' . $hash) || $input->getOption('force')) {
      $zippy = Zippy::load();
      if ($this->fileSystem->exists('install-cache.zip')) {
        $cache = $zippy->open('install-cache.zip');
        $cache->extract('web/sites/' . $siteDir);
        $baseCommand = ['./vendor/bin/drush'];
        if ($input->getOption('cypress')) {
          $baseCommand[] = '--uri=http://localhost:8889';
        }
        $this->executeProcess(array_merge($baseCommand, ['updb', '-y']), $output);
        $this->executeProcess(array_merge($baseCommand, ['entup', '-y']), $output);
        $this->executeProcess(array_merge($baseCommand, ['cim', '-y']), $output);
      }
      else {
        $this->executeProcess([
          './vendor/bin/drush', 'si', '-y', 'minimal',
          '--sites-subdir', $siteDir,
          '--existing-config',
          '--account-name', getenv('SB_ADMIN_USER'),
          '--account-pass', getenv('SB_ADMIN_PASS'),
        ], $output);
        $this->executeProcess(['./vendor/bin/drush', 'cim', '-y'], $output);

        $zippy->create('install-cache.zip', [
          'files' => 'web/sites/' . $siteDir . '/files',
        ], TRUE);
      }

      $this->copyDir('web/sites/' . $siteDir . '/files', $this->cacheDir . '/' . $hash);
    }
    else {
      $this->copyDir($this->cacheDir . '/' . $hash, 'web/sites/' . $siteDir . '/files');
    }

    $private = 'web/sites/' . $siteDir . '/files/private';
    if (!$this->fileSystem->exists($private)) {
      $this->fileSystem->mkdir($private);
    }
  }

}
