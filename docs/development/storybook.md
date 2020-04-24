---
menu: Development
route: storybook
---

# Storybook

CSS development happens (also for non-decoupled projects) in [Storybook]. After
`silverback init` the project should contain a `/storybook` folder and a
`storybook` custom theme.

## Using the theme

The `storybook` theme that is created automatically is supposed to act as a link
between Drupal's theming layer and the pattern library in storybook. It attaches
the assets created by storybook and loads Twig templates using the [components]
module.
The theme is not supposed to be used directly, but as a base theme for a project
specific one, since we might inject new configuration or base templates in the
future.

## Working with storybook

All components should be added in the `storybook/twig` folder along with
their example stories.

To work with storybook, you first should run `yarn` in the root directory to
install the dependencies. To run storybook in development mode execute
`yarn run storybook`. This will bring up the storybook UI with hot reloading.

To compile the stylesheets for use with Drupal, run `yarn run build-library`.
This will compile the javascript and css components and expose them to the theme
automatically.


## An example component

> **TODO:** Create a full example component.


[components]: https://drupal.org/project/components

[Storybook]: https://storybook.js.org/
