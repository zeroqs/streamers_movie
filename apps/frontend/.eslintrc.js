const { configure, presets } = require('eslint-kit')

module.exports = configure({
	extends: ['../../.eslintrc.js'],
	allowDebug: process.env.NODE_ENV !== 'production',

	presets: [
		presets.imports({
			sort: {
				newline: true,
			},
			alias: {
				paths: {
					'@': './src',
				},
			},
		}),
		presets.node(),
		presets.prettier(),
		presets.typescript(),
		presets.react(),
	],
})
