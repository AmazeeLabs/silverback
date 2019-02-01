<?php

namespace AmazeeLabs\Silverback\Commands;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Finder\Finder;

class Init extends SilverbackCommand {

  protected function configure() {
    $this->setName('init');
    $this->setDescription('Initialise silverback project.');
  }

  protected function execute(InputInterface $input, OutputInterface $output) {
    parent::execute($input, $output);
    $projectName = basename($this->rootDirectory);

    $environment = [
      'SB_PROJECT_NAME' => [
        'value' => $projectName,
        'description' => 'Project name used for docker containers.',
      ],
      'SB_BASE_URL' => [
        'value' => 'http://localhost:8888',
        'description' => 'Web server base url.',
      ],
      'SB_ENVIRONMENT' => [
        'value' => 'development',
        'description' => 'The environment. Controls loading of the proper settings.php file.',
      ],
      'SB_DEVELOPMENT_MODE' => [
        'value' => '',
        'description' => 'Development mode. Settings tailored to specific tasks (e.g. theming).',
      ],
      'SB_ADMIN_USER' => [
        'value' => 'admin',
        'description' => 'Drupal admin username.',
      ],
      'SB_ADMIN_PASS' => [
        'value' => 'admin',
        'description' => 'Drupal admin password.',
      ],
      'SB_TEST_CONTENT' => [
        'value' => '',
        'description' => 'The name of a default content module to install.'
      ],
      'SB_JIRA_HOST' => [
        'value' => '',
        'description' => 'Jira host to download testfiles from.',
      ],
      'SB_JIRA_USER' => [
        'value' => '',
        'description' => 'Jira username.',
      ],
      'SB_JIRA_PASS' => [
        'value' => '',
        'description' => 'Jira password.',
      ],
      'SB_JIRA_PROJECTS' => [
        'value' => '',
        'description' => 'Jira projects, as handle:id pairs. e.g. PRO:12345. May contain multiple space separated values.',
      ],
      'DRUSH_OPTIONS_URI' => [
        'value' => '$SB_BASE_URL',
        'description' => 'Drush base url.'
      ],
      'CYPRESS_BASE_URL' => [
        'value' => '$SB_BASE_URL',
        'description' => 'Cypress base url.'
      ],
      'CYPRESS_TAGS' => [
        'value' => '',
        'description' => '`cypress run` will only execute tests based on tags. Examples: "@assignee:$SB_JIRA_USER and @WIP", "@COMPLETED".'
      ],
    ];

    $finder = new Finder();
    $finder->files()->in($this->rootDirectory . '/vendor/amazeelabs/silverback/assets');
    $finder->ignoreDotFiles(FALSE);

    foreach ($finder as $file) {
      $this->fileSystem->copy(
        $file->getRealPath(),
        $this->rootDirectory . '/' . $file->getRelativePath() . '/' . $file->getFilename(),
        TRUE
      );
    }

    // Perform string replacement for project-specific values on some files.
    $replacements = [
      '${COMPOSE_PROJECT_NAME}' => $projectName,
      '${AMAZEEIO_PROJECT_URL}' => str_replace('_', '.', $projectName) . '.amazee.io',
    ];
    $projectSpecificFiles = [
      'docker-compose.yml',
      '.lagoon.yml',
    ];
    foreach ($projectSpecificFiles as $filename) {
      $filepath = "$this->rootDirectory/$filename";
      $contents = file_get_contents($filepath);
      $toReplace = array_keys($replacements);
      $values = array_values($replacements);
      file_put_contents($filepath, str_replace($toReplace, $values, $contents));
    }

    if (file_exists($this->rootDirectory . '/.lando.yml')) {
      unlink($this->rootDirectory . '/.lando.yml');
    }
    file_put_contents($this->rootDirectory . '/.lando.yml', "name: $projectName\nrecipe: drupal8\nconfig:\n  webroot: web\n");

    if (file_exists($this->rootDirectory . '/.env.example')) {
      unlink($this->rootDirectory . '/.env.example');
    }

    file_put_contents($this->rootDirectory . '/.env.example', implode("\n", array_map(function ($env) use ($environment) {
      return "# {$environment[$env]['description']}\n$env=\"{$environment[$env]['value']}\"\n";
    }, array_keys($environment))));

    $composerJson = json_decode(file_get_contents($this->rootDirectory . '/composer.json'), TRUE);
    $composerJson['scripts']['run-tests'] = [
      "if [[ -d web/modules/custom ]]; then phpunit web/modules/custom; fi",
      "cd tests && npm install && CYPRESS_TAGS=@COMPLETED cypress run",
    ];
    $composerJson['extra']['enable-patching'] = TRUE;
    file_put_contents($this->rootDirectory . '/composer.json', json_encode($composerJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
  }

}
