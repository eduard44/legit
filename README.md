![Logo](http://assets.chromabits.com/legit/logo.png)

# Legit.js

A simple input validation JavaScript library

## Requirements:

- Ensure.js (https://github.com/eduard44/ensure)

## On the browser:

On the browser, legit is available as a global object:

1- Install using Bower:

```
bower install legit
```

2- Make sure ensure.js is also included in your project (Bower automatically downloads it as a dependency):

```html
<script src="bower_components/ensure.js/ensure.js"></script>
```

3- Include the JS file on your project:

```html
<script src="bower_components/legit/dist/legit.js"></script>
```

4- Use it!

## On node.js:

On node.js, legit is available as a module:

1- Install using npm:

```
npm install legit.js
```

2.- Include the library in your project:

```js
var legit = require('legit.js');
```

3.- Use it!

## Usage example:

Legit works by definining a rule set using a Validator class and then executing the validator on some input object:

```js
// Aliases for convenience
var Validator = legit.Validator,
	MinMaxLengthRule = legit.MinMaxLengthRule,
	InArrayRule = legit.InArrayRule,
	RequiredRule = legit.RequiredRule,
	ValidationError = legit.ValidationError;

// Create a new validator instance
var userValidator = new Validator();

userValidator.addRule('first_name', new MinMaxLengthRule(1, 20));
userValidator.addRule('last_name', new MinMaxLengthRule(1, 20));
userValidator.addRule('type', new InArrayRule(['admin', 'customer']), 'User must have a valid type');

// This should not fail:
try {
    userValidator.validate({
        'first_name': 'John',
        'last_name': 'Appleseed',
        'type': 'admin'
    });
} catch (error) {
    if (error instanceof ValidationError) {
        console.log(error.getMessages());
    } else {
        console.log('We got some other kind of error :(');
    }
}

// This should fail:
try {
    userValidator.validate({
        'first_name': 'JohnJohnJohnJohnJohnJohn',
        'last_name': '',
        'type': 'lulz'
    });
} catch (error) {
    if (error instanceof ValidationError) {
        console.log(error.getMessages());
    } else {
        console.log('We got some other kind of error :(');
    }
}
```

It is also possible to define rules in the constructor of the validator for a shorter definition block. A field can contain one rule or an array of rules:

```js
var userValidator = new Validator({
	first_name: [new MinMaxLengthRule(1, 20), new RequiredRule()],
	last_name: new MinMaxLengthRule(1, 20),
	type: new InArrayRule(['admin', 'customer'])
});
```

## Included rules:

Legit.js comes with some built-in rules:

- **MinMaxLengthRule(min, max)**: Expects that the length of the field value is within a certain range
- **MinMaxRule(min, max)**: Expects that the field value is within a certain range
- **InArrayRule(allowedElements)**: Expects that the field value is contained in the allowedElements array
- **RequiredRule()**: Requires a field to be defined in the input object
- **EqualsFieldRule(fieldName)**: Expects that one field equals another field
- **TypeRule(ensureType)**: Expects that the field is of a certain [ensure.js](https://github.com/eduard44/ensure) type
- **RegexMatchRule(regex)**: Expects that the field matches a certain JS regular expression

## Extending:

It is possible to extend the default rule set by creating rule objects that have `ValidationRule` as their prototype. The main function to implement is **execute(value, fields, property)**, which returns true if the input is valid or false if its not. 

The example below is a rule that checks if the input is equal to `hello` or `hello world` (if `true` is provided in the constructor):

```js
var HelloRule = function (checkWorld) {
    // Call parent constructor
    legit.ValidationRule.call(this, arguments)

    // Save parameters
    this.checkWorld = checkWorld;
}

HelloRule.prototype = new legit.ValidationRule();

// The execute method performs the validation check.
// It is expected that it returns true if the field is valid. False, otherwise.
HelloRule.prototype.execute = function (inputValue, fields, property) {
    if (this.checkWorld) {
        return inputValue === 'hello world';
    }

    return inputValue === 'hello';
};

// (Optional) Get a custom error message for this rule
HelloRule.prototype.getMessage = function (fieldName) {
    if (this.checkWorld) {
        return fieldName + ' should be equal to "hello world"';
    }

    return fieldName + ' should be equal to "hello"';
};
```