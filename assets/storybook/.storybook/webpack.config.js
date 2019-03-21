const path = require('path');

module.exports = ({ config, mode }) => {
	config.module.rules.push({
		test: /\.tsx?$/,
		loader: 'babel-loader',
		options: {
			presets: [
				["@babel/env", {
          targets: {chrome: '63'},
				}],
				["@babel/react"],
				["@babel/typescript"]
			]
		}
	});

	config.module.rules.push({
		test: /\.(jpe?g|svg|png)$/,
		loader: "file-loader",
	});

	config.module.rules.push(      {
		test: /\.twig$/,
		use: [
			{
				loader: 'twig-loader',
				options: {
					twigOptions: {
						namespaces: {
							storybook: path.resolve('stories')
						}
					}
				}
			}
		],
	},);

	config.module.rules.push({
		test: /\.css$/,
    use: [
			'postcss-loader',
    ]
	});

	config.resolve.extensions.push('.ts');
	config.resolve.extensions.push('.tsx');
	return config;
};
