import { addDecorator, configure } from '@storybook/html';
import { withA11y } from '@storybook/addon-a11y';
import { setConsoleOptions } from '@storybook/addon-console';
import '../scripts';

import Twig from 'twig';
import twigDrupal from 'twig-drupal-filters';

// Add the filters to Drupal.
twigDrupal(Twig);

// Automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.(ts|js)?$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

// Helps make UI components more accessible.
addDecorator(withA11y);
setConsoleOptions({
  panelExclude: [],
});

configure(loadStories, module);
