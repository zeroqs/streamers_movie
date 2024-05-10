const { configure, presets } = require('eslint-kit')

module.exports = configure({
  allowDebug: process.env.NODE_ENV !== 'production',
  root: __dirname,

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
	

	extend: {
		rules: {
			"import/no-unresolved": "off",
			"import/extensions": "off",
		}
	}
})