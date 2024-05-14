const { configure } = require('eslint-kit')
const path = require('path')

module.exports = configure({
	extends: require(path.resolve(__dirname, '../../base.eslintrc.js')),
	
	extend: {
		rules: {
			'jsx-a11y/media-has-caption': 'off',
		},
	},
})