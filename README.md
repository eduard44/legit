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

## Usage example (on the browser):

```js
var userValidator = new legit.Validator();

userValidator.addRule('first_name', new legit.MinMaxLengthRule(1, 20));
userValidator.addRule('last_name', new legit.MinMaxLengthRule(1, 20));
userValidator.addRule('type', new legit.InArrayRule(['admin', 'customer']), 'User must have a valid type');

// This should not fail:
try {
    userValidator.validate({
        'first_name': 'John',
        'last_name': 'Appleseed',
        'type': 'admin'
    });
} catch (error) {
    if (error instanceof legit.ValidationError) {
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
    if (error instanceof legit.ValidationError) {
        console.log(error.getMessages());
    } else {
        console.log('We got some other kind of error :(');
    }
}
```

## Included rules:

Legit.js comes with some built-in rules:

- MinMaxLengthRule(min, max)
- MinMaxRule(min, max)
- InArrayRule(allowedElements)
- RequiredRule()
- EqualsFieldRule(fieldName)
- TypeRule(ensureType)

## Extending:

You can extend the default rule set by creating objects that have `ValidationRule` as their prototype:

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
HelloRule.prototype.execute = function (inputValue, fields) {
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