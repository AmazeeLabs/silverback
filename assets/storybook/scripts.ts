// Globally add web components polyfills.
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@webcomponents/webcomponentsjs/webcomponents-bundle';

import './styles.css';

// @ts-ignore
const components = require.context('./twig', true, /\/index\.(ts|js)$/);

// @ts-ignore
components.keys().forEach(filename => components(filename));
