(function () {
    "use strict";

    var RegexMatchRule;

    /**
     * Rule for checking if a strict matches a regex
     *
     * @param type
     * @constructor
     */
    RegexMatchRule = function (regex, message) {
        // Call parent constructor
        legit.ValidationRule.call(this, arguments);

        this.regex = regex;
        this.customMessage = message;
    };

    RegexMatchRule.prototype = new legit.ValidationRule();

    /**
     * Execute rule
     *
     * @param value
     * @returns {Boolean}
     */
    RegexMatchRule.prototype.execute = function (value) {
        if (!ensure.isString(value)) {
            return false;
        }

        console.log(value.match(this.regex));

        return (value.match(this.regex) !== null);
    };

    /**
     * Get error message
     *
     * @param field
     * @returns {string}
     */
    RegexMatchRule.prototype.getMessage = function (field) {
        if (this.customMessage) {
            return this.customMessage;
        }

        return field + ' does not match the expected value';
    };

    legit.RegexMatchRule = RegexMatchRule;
})();