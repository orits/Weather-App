module.exports = {
	env: {
		browser: true,
		es6: true,
	},

	extends: ["eslint:recommended", "plugin:react/recommended"],
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly",
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: "module",
	},
	plugins: ["react"],
	ignorePatterns: ["temp.js", "**/vendor.js"],
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
	},
};
