// Add imported components here.

const components = require.context('./twig', true, /\.component\.(ts|js)$/);
components.keys().forEach(filename => components(filename));

const styles = require.context('./twig', true, /\.css$/);
styles.keys().forEach(filename => styles(filename));
