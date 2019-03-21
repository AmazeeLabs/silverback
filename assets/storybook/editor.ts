const req = require.context('./editor', true, /\.component\.(ts|js)$/);
req.keys().forEach(filename => req(filename));
