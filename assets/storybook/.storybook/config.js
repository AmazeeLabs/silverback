import { addDecorator, configure } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import '../scripts';
import twig from './twig';

// Automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.tsx?$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

// Helps make UI components more accessible.
addDecorator(withA11y)

// Inject a decorator that wraps all string elements into a div and set
// the result as its inner html value to be compatible to @storybook/react.
addDecorator((story) => {
  const result = story();
  if (typeof result !== "string") {
    return result;
  }
  return twig(result);
});

configure(loadStories, module);
