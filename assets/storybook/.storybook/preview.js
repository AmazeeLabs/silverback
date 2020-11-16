import { setConsoleOptions } from '@storybook/addon-console';
import Twig from 'twig';
import drupalizeTwig from 'twig-drupal-filters';
import '../scripts';

// Add the filters to Drupal.
drupalizeTwig(Twig);

// Add custom filters stub.
Twig.extendFilter('token_tags', value => value);
Twig.extendFunction('contextual_links', value => value);

setConsoleOptions({
  panelExclude: [],
});

// Add global decorators.
export const parameters = {
  a11y: {
    element: '#root',
    config: {},
    options: {
      restoreScroll: true,
    },
    manual: false,
  },
  docs: {
    inlineStories: false
  }
};

export const decorators = [];
