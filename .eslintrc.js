module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "es6": true
    },
    "extends":[ "airbnb", "plugin:prettier/recommended"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "import/prefer-default-export": 0,
        "react/jsx-filename-extension": 0,
        "react/prefer-stateless-function": 0,
        "react/state-in-constructor": 0,
        "react/destructuring-assignment": 0,
        "react/no-access-state-in-setstate": 0,
        "react/prop-types": 0,
        "no-unused-expressions": 0,
        "react/jsx-props-no-spreading": 0,
        "react/static-property-placement": 0,
        "react/sort-comp": 0,
        "react/no-array-index-key": 0,
        "no-param-reassign": 0,
        "no-return-assign": 0,
        "max-classes-per-file": 0
    }
};
