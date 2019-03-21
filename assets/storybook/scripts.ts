// Add imported components here.

const components = require.context('./stories/twig', true, /\.component\.(ts|js)?$/);
components.keys().forEach(filename => components(filename));

const styles = require.context('./stories/twig', true, /\.css?$/);
styles.keys().forEach(filename => styles(filename));

import Twig from 'twig';

// Fake translation filter, to mock Drupal's behavior.
Twig.extendFilter("t", function(value) {
    return value;
});

