// Add imported components here.

const components = require.context('./stories/twig', true, /\.component\.(ts|js)?$/);
components.keys().forEach(filename => components(filename));

const styles = require.context('./stories/twig', true, /\.css?$/);
styles.keys().forEach(filename => styles(filename));
