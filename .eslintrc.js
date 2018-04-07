module.exports = {
    "env": {
        "es6": true,
        "node": true
    },

    "extends": "eslint:recommended",

    "rules": {
        "eqeqeq": ["error", "always"],
        "no-console": "off",
        "no-invalid-this": "error",
        "no-return-assign": "error",
        "no-throw-literal": "error",
        "no-unused-expressions": "error",
        "no-unused-vars": "off",
        "no-warning-comments": [ "warn", {
            "terms": [ "TODO", "FIXME" ],
            "location": "anywhere"
        }],
        "semi": "error",
        "strict": ["error", "global"],
        "wrap-iife": ["error", "inside", { "functionPrototypeMethods": true }],
        "yoda": ["error", "never", { "exceptRange": true }]
    }
};