<?php

namespace AmazeeLabs\Silverback\Commands;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class Setup extends SilverbackCommand {

  protected function configure() {
    $this->setName('setup');
    $this->setDescription('Install a new test site.');
    $this->addOption('backup', 'b', InputOption::VALUE_NONE, 'Create a backup of the current site.');
    $this->addOption('force', 'f', InputOption::VALUE_NONE, 'Force installation.');
  }

  protected function execute(InputInterface $input, OutputInterface $output) {
    parent::execute($input, $output);

    $configDir = 'config/sync';
    $hash = $this->getConfigHash($this->rootDirectory . '/' . $configDir);

    if ($input->getOption('force')) {
      $this->fileSystem->remove($this->cacheDir . '/' . $hash);
    }

    if ($input->getOption('backup') && $this->fileSystem->exists('web/sites/default/files')) {
      $this->copyDir('web/sites/default/files', $this->cacheDir . '/backup');
    }

    if (!$this->fileSystem->exists('config/sync/core.extension.yml')) {
      $this->copyDir('vendor/amazeelabs/silverback/config', 'config/sync');
    }

    $this->fileSystem->remove('web/sites/default/files');

    if (!$this->fileSystem->exists($this->cacheDir . '/' . $hash) || $input->getOption('force')) {
      $process = new Process([
        './vendor/bin/drush', 'si', '-y', 'minimal',
        '--sites-subdir', 'default',
        '--config-dir', '../' . $configDir,
        '--account-name', getenv('SB_ADMIN_USER'),
        '--account-pass', getenv('SB_ADMIN_PASS'),
      ], getcwd(), NULL, NULL, NULL);
      $process->start();
      foreach ($process as $type => $line) {
        $output->writeln($line);
      }
      if (!$process->isSuccessful()) {
        throw new ProcessFailedException($process);
      }

      if ($testContent = getenv('SB_TEST_CONTENT')) {
        $process = new Process([
          './vendor/bin/drush', 'en', '-y', $testContent,
        ], getcwd(), NULL, NULL, NULL);
        $process->start();
        foreach ($process as $type => $line) {
          $output->writeln($line);
        }
        if (!$process->isSuccessful()) {
          throw new ProcessFailedException($process);
        }
      }

      $this->copyDir('web/sites/default/files', $this->cacheDir . '/' . $hash);
    }
    else {
      $this->copyDir($this->cacheDir . '/' . $hash, 'web/sites/default/files');
    }
  }

}
