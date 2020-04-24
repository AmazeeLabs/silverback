---
menu: Development
name: Setup
route: setup
---

# Installation

## Prerequisites

To create or work on a Silverback project the following tools have to be available on your system:

* A [PHP 7](http://php.net/manual/en/install.php) interpreter meeting [Drupal requirements](https://www.drupal.org/docs/8/system-requirements/php-requirements)
* Installed and configured [direnv](https://direnv.net/) (don't forget about the [setup](https://direnv.net/index.html#setup) for your shell)
* Globally installed [composer](https://getcomposer.org/)
* *Optional:* A bitcoin miner to give the other three processor cores a purpose, since they are not consumed by docker any more.

## Project initialisation

Given you already created a composer based Drupal project like this:
```bash
composer create-project drupal-composer/drupal-project:8.x-dev my-project --no-interaction
```

You just have to require the `amazeelabs/silverback` composer package and initialise it:

```bash
cd my-project
composer require amazeelabs/silverback
./vendor/bin/silverback init
composer install
yarn
```

Note that the seemingly unnecessary extra `composer install` is to allow patches to be applied.

If you've set up `direnv` correctly, it will complain at this point that there is an unknown `.envrc` file. Just execute `direnv allow` to enable it. From now on environment variables and executable search paths will be set automatically whenever you enter this directory. Here is how it should look in case of a correct installation:
```bash
me@local:~/Projects $ cd my-project/
direnv: error .envrc is blocked. Run `direnv allow` to approve its content.
me@local:~/Projects/my-project $ direnv allow
direnv: loading .envrc
direnv: export +CYPRESS_BASE_URL ... +SB_TEST_CONTENT ~PATH
me@local:~/Projects/my-project $ cd ..
direnv: unloading
me@local:~/Projects $ cd my-project/
direnv: loading .envrc
direnv: export +CYPRESS_BASE_URL ... +SB_TEST_CONTENT ~PATH
```

Requiring and initiating the package did a couple of things:

* A list of common project dependencies have been installed.
* Configuration files for Travis, Lando and amazee.io have been created.
* Your composer.json has been slightly modified.
* An environment-based `settings.php` has been placed in `web/sites/default`.
* A `tests` directory with a fully operational [Cypress](https://www.cypress.io/) setup appeared.
* A `.env` file was initialised that you can use to configure your local environment.

## Updating

To update Silverback along with its dependencies simply update the composer package:

```bash
composer upgrade amazeelabs/silverback --with-dependencies
```

This will also trigger an update hook that re-runs `silverback init`. If you removed the update hook, you'll have to do that yourself. This will overwrite all the scaffolded files to get in any updates. You can just use git to select which updates you want and which not.

## Running the website locally

To run the project locally, just execute the setup procedure and start a local development server:

```bash
silverback setup
drush serve
```

Now your Drupal installation should be accessible at http://localhost:8888. Admin account credentials can be configured in your `.env` file.

Another invocation of `silverback setup` will scratch the current install and and create a new one. `silverback teardown` will just do the *scratch* part. Running `silverback setup --backup` will create a backup before removing the current install, and `silverback teardown --restore` will bring the latest backup back. These two commands are mainly used by the end to end testing processes to spin up test sites (*TODO: Move test sites to simpletest subsites*).

**Danger:** Currently, there can be only ***one*** backup.
