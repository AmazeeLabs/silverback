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

The `text` component that is documented below comes installed in your storybook
upon installing silverback. Feel free to delete its folder!

In order to create a new story in storybook you need:

- A story file ending in `.stories.ts` which registers the story in storybook.
- The `.twig` file.
- Your style file(s), for the sake of simplicity we'll use one plain `.css` file
  in our example.

We'll create a simple `text` component, with two variations: `plain` and
`formatted`.

- Your `text.twig` file can be as simple as that:

```
{{ text }}
```

- In order for storybook to load it and display some demo content we need to
  create a `text.stories.ts` file with the following contents:

```
import { storiesOf } from '@storybook/html';

import Text from './text.twig';
import './text.css';

export const plain = `
  Don't eat the yellow snow!
`;
export const text = `
  There isn't a <em>rule</em>. You just practice and find out which way works best for <strong>you</strong>.
  The only thing worse than <a href="https://en.wikipedia.org/wiki/Don%27t_Eat_the_Yellow_Snow">yellow snow</a> is
  green snow. I get carried away with this brush cleaning. We have a fantastic little sky! Let's get crazy.
  This is probably the greatest thing to happen in my life - to be able to share this with you.
`;

storiesOf('Base/Text', module)
  .add('Plain', () => Text({ text: plain }))
  .add('Formatted', () => Text({ text }));
```

- Last step is to add our styling. As you can see in the story above we named
  the file `text.css` (line 4). Create it and add this demo styling in it:

```
a {
  color: rgb(30, 167, 253);
}

em {
  font-style: italic;
}
```

**You have succesfully created your first storybook twig component!**
Now go to your storybook and see it in action. Do some edits to see how they are
automatically reflected in the browser.

[components]: https://drupal.org/project/components

[Storybook]: https://storybook.js.org/
