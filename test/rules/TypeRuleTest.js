"use strict";

var legit = require('../../dist/legit'),
    TypeRule = legit.TypeRule;

describe('TypeRule', function () {
    it('should be a constructor', function () {
        var instance = new TypeRule(/[a-zA-Z]+/);

        instance.should.be.instanceOf(TypeRule);
    });

    describe('#getMessage', function () {
        it('should use default message', function () {
            var instance = new TypeRule(String);

            instance.getMessage('myField').should.match(/myField/);
        });
    });

    describe('#execute', function () {
        it('should return true if the type matches', function () {
            var instance = new TypeRule(String);

            instance.execute('abcEFRSdksbvDG').should.be.true;
        });

        it('should return false if the type does not match', function () {
            var instance = new TypeRule(String);

            instance.execute({}).should.be.false;
        });
    });
});