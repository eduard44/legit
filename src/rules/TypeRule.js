(function () {
    "use strict";

    var TypeRule;

    /**
     * Rule for checking if the type of a field matches
     *
     * @param type
     * @constructor
     */
    TypeRule = function (type) {
        // Call parent constructor
        legit.ValidationRule.call(this, arguments);

        this.typeCheck = type;
    };

    TypeRule.prototype = new legit.ValidationRule();

    /**
     * Execute rule
     *
     * @param value
     * @returns {*}
     */
    TypeRule.prototype.execute = function (value) {
        return ensure(value, this.typeCheck, true);
    };

    /**
     * Get error message
     *
     * @param field
     * @returns {string}
     */
    TypeRule.prototype.getMessage = function (field) {
        return field + ' should be of type ' + this.typeCheck.name;
    };

    legit.TypeRule = TypeRule;
})();