---
menu: Development
route: development-workflow
---

# Development workflow

To get the most out of (and in to) `amazeelabs/silverback`, the development process should follow a common pattern:

1. Review feature/bug request
2. Create the project level feature specification
3. Investigate which parts are not doable by just configuring and/or theming existing components.
4. Try to find a reusable, generic solution (e.g. Views/Rules/Block/GraphQL plugins).
5. Create a pull request against `amazeelabs/silverback` with the proposed changes/additions. It should contain:
    * The code/dependency changes themselves.
    * New or modified feature specifications in `assets/tests/cypress/integration/silverback`.
    * New or modified documentation pages in `docs`.
    * Example configuration in `config`.
6. Apply the pull request as a patch in your projects `composer.json`.
7. If there are dependency changes, you have to add them temporarily to your project's
`composer.json`. Composer patches can't affect dependencies since they are collected before patches are applied.

## Working on dependencies

Sometimes it's necessary to work on one of the dependencies of a project. Instead
of creating a separate project or messing with composers checkout of the module,
the `path`  repository can be used to achieve this a little more easily. As an
example, lets create a local checkout of the GraphQL module:


1. Create a new directory called `packages/drupal` within the project directory
and clone the GraphQL module:
```bash
mkdir packages && cd packages
mkdir drupal && cd drupal
git clone git@github.com:drupal-graphql/graphql.git
```

2. Add this directory as a local repository to `composer.json`:
```json
{
  "repositories": [
    {
        "type": "path",
        "url": "./packages/drupal/graphql"
    }
  ]
}
```

3. Require the dev version of the GraphQL module:

```bash
composer require drupal/graphql:"8.x-3.x-dev as 3.0"
```

Now the package in Drupal should be symlinked to the local checkout.

`amazeelabs/silverback` includes the `wikimedia/composer-merge-plugin` and will
look for a `composer.json` in the `packages` directory. It should not be committed
but used to persist the mentioned local overrides. Simply add the repositories and
the dependency aliases to this file ...

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "./packages/drupal/ckeditor5_sections"
    },
    {
      "type": "path",
      "url": "./packages/drupal/graphql"
    },
    {
      "type": "path",
      "url": "./packages/amazeelabs/silverback"
    }
  ],
  "require": {
    "drupal/graphql": "8.x-3.x-dev as 3.0",
    "drupal/ckeditor5_sections": "8.x-1.x-dev as 1.0"
  }
}
```

...and run `composer update` to include the local packages.
