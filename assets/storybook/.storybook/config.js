import { addDecorator, configure } from '@storybook/html';
import { withA11y } from '@storybook/addon-a11y';
import '../scripts';

// Automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.(ts|js)?$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

// Helps make UI components more accessible.
addDecorator(withA11y)

configure(loadStories, module);
