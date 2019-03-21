const req = require.context('./stories/editor', true, /\.component\.(ts|js)?$/);
req.keys().forEach(filename => req(filename));
