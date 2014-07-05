# Legit.js

A simple input validation JavaScript library

## Requirements:

- Ensure.js (https://github.com/eduard44/ensure)

---

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
    }

    console.log('We got some other kind of error :(');
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
    }

    console.log('We got some other kind of error :(');
}
```

## Included rules:

Legit.js comes with some built-in rules, but you can expand it with more by extending the `ValidationRule` object:

- MinMaxLengthRule
- MinMaxRule
- InArrayRule
- RequiredRule