"use strict";

var root = this;

(function () {
    /**
     * Legit.js
     *
     * A simple input validation JavaScript library
     *
     * @author Eduardo Trujillo <ed@chromabits.com>
     */
    var legit = {};

    // Constructor definitions

    /**
     * Executes validation rules
     *
     * @constructor
     */
    function Validator() {
        this.rules = [];
    }

    /**
     * Base object for a validation rule
     *
     * @constructor
     */
    function ValidationRule() {
        this.message = 'Default validation rule';
    }

    /**
     * Error for failed validations
     *
     * @constructor
     */
    function ValidationError() {
        this.failedRules = [];
    }

    /**
     * Rule for checking that a value is within a certain range
     *
     * @param min
     * @param max
     * @constructor
     */
    function MinMaxRule(min, max) {
        ValidationRule.call(this, arguments);

        ensure(min, Number);
        ensure(max, Number);

        this.min = min;
        this.max = max;
    }

    /**
     * Rule for checking a string is within a certain length
     *
     * @param min
     * @param max
     * @constructor
     */
    function MinMaxLengthRule(min, max) {
        ValidationRule.call(this, arguments);

        ensure(min, Number);
        ensure(max, Number);

        this.min = min;
        this.max = max;
    }

    /**
     * Rule for checking if a value is an array
     *
     * @param validValues
     * @constructor
     */
    function InArrayRule(validValues) {
        ValidationRule.call(this, arguments);

        ensure(validValues, Array);

        this.validValues = validValues;
    }

    /**
     * Rule for making sure that a value is not undefined
     *
     * @constructor
     */
    function RequiredRule() {}

    /**
     * Rule for making sure that a field matches another field
     *
     * @param fieldName
     * @constructor
     */
    function EqualsFieldRule(fieldName) {
        this.fieldName = fieldName;
    }

    // Library core

    /**
     * Add a vlaidation rule to this validator
     *
     * @param field
     * @param rule
     * @param customMessage
     */
    Validator.prototype.addRule = function (field, rule, customMessage) {
        ensure(field, String);
        ensure(rule, ValidationRule);

        if (this.rules[field] === undefined) {
            this.rules[field] = [];
        }

        var ruleInstance = {
            rule: rule,
            customMessage: customMessage
        };

        this.rules[field].push(ruleInstance);
    };

    /**
     * Execute all rules against the input object
     *
     * @param input
     * @returns {boolean}
     */
    Validator.prototype.validate = function (input) {
        var validationError = new ValidationError(),
            errorCount = 0,
            property;

        for (property in input) {
            if (input.hasOwnProperty(property) && this.rules[property] !== undefined) {
                this.rules[property].forEach(function (ruleInstance) {
                    // Check if rule passes
                    if (!ruleInstance.rule.execute(input[property], input)) {
                        // If it fails, add it to the exception
                        validationError.addFailedRule(property, input[property], ruleInstance.rule, ruleInstance.customMessage);
                        errorCount += 1;
                    }
                });
            }
        }

        if (errorCount > 0) {
            throw validationError;
        }

        return true;
    };

    /**
     * Execute the rule againts a value
     *
     * @param value
     * @returns {boolean}
     */
    ValidationRule.prototype.execute = function (value, inputArray) {
        return true;
    };

    /**
     * Get default message for this rule
     *
     * @param field
     * @returns {string}
     */
    ValidationRule.prototype.getMessage = function (field) {
        return this.message;
    };

    ValidationError.prototype = new Error();
    ValidationError.prototype.constructor = ValidationError;

    /**
     * Add information about a failed rule to this exception
     *
     * @param field
     * @param value
     * @param rule
     * @param message
     */
    ValidationError.prototype.addFailedRule = function (field, value, rule, message) {
        ensure(field, String);
        ensure(rule, ValidationRule);

        this.failedRules.push({
            field: field,
            value: value,
            rule: rule,
            message: message || rule.getMessage(field)
        });
    };

    /**
     * Get all messages of failed rules
     *
     * @returns {Array}
     */
    ValidationError.prototype.getMessages = function () {
        var messages = [];

        messages = this.failedRules.map(function (failedRule) {
            return failedRule.message;
        });

        return messages;
    };

    /**
     * Get an object array with information regarding the failed rules
     *
     * @returns {Array}
     */
    ValidationError.prototype.getFailedRules = function () {
        return this.failedRules;
    };

    // Validation rules

    MinMaxRule.prototype = new ValidationRule();

    MinMaxRule.prototype.getMessage = function (field) {
        return field + ' must be a number between ' + this.min + ' to ' + this.max;
    };

    MinMaxRule.prototype.execute = function (value) {
        if (ensure.isNotNumber(value)) {
            return false;
        }

        if (value < this.min || value > this.max) {
            return false;
        }

        return true;
    };

    MinMaxLengthRule.prototype = new ValidationRule();

    MinMaxLengthRule.prototype.getMessage = function (field) {
        return field + ' must be between ' + this.min + ' to ' + this.max + ' characters long';
    };

    MinMaxLengthRule.prototype.execute = function (value) {
        if (ensure.isNotString(value)) {
            return false;
        }

        if (value.length < this.min || value.length > this.max) {
            return false;
        }

        return true;
    };

    InArrayRule.prototype = new ValidationRule();

    InArrayRule.prototype.getMessage = function (field) {
        var valuesString = '';

        this.validValues.forEach(function (validValue) {
            valuesString += validValue + ' ';
        });

        return field + ' must be equal to one of the following values: ' + valuesString;
    };

    InArrayRule.prototype.execute = function (value) {
        return ensure.isIn(value, this.validValues);
    };

    RequiredRule.prototype = new ValidationRule();

    RequiredRule.prototype.getMessage = function (field) {
        return field + ' is required';
    };

    RequiredRule.prototype.execute = function (value) {
        return value !== undefined;
    };

    EqualsFieldRule.prototype = new ValidationRule();

    EqualsFieldRule.prototype.getMessage = function (field) {
        return field + ' must match ' + this.fieldName;
    };

    EqualsFieldRule.prototype.execute = function (value, input) {
        if (input.hasOwnProperty(this.fieldName)) {
            if (input[this.fieldName] === value) {
                return true;
            }
        }

        return false;
    };

    // Export library

    legit.Validator = Validator;
    legit.ValidationRule = ValidationRule;
    legit.ValidationError = ValidationError;

    legit.MinMaxRule = MinMaxRule;
    legit.MinMaxLengthRule = MinMaxLengthRule;
    legit.InArrayRule = InArrayRule;
    legit.RequiredRule = RequiredRule;
    legit.EqualsFieldRule = EqualsFieldRule;

    // Check if it is running in Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = legit;
    }

    root.legit = legit;
}());