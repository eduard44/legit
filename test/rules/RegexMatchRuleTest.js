"use strict";

var legit = require('../../dist/legit'),
    RegexMatchRule = legit.RegexMatchRule;

describe('RegexMatchRule', function () {
    it('should be a constructor', function () {
        var instance = new RegexMatchRule(/[a-zA-Z]+/);

        instance.should.be.instanceOf(RegexMatchRule);
    });

    describe('#getMessage', function () {
        it('should use default message', function () {
            var instance = new RegexMatchRule(/[a-zA-Z]+/);

            instance.getMessage('myField').should.match(/myField/);
        });

        it('should use a custom message when provided', function () {
            var instance = new RegexMatchRule(/[a-zA-Z]+/, 'testing');

            instance.getMessage('myField').should.be.equal('testing');
        });
    });

    describe('#execute', function () {
        it('should return true if the regex matches', function () {
            var instance = new RegexMatchRule(/^[a-zA-Z]+$/);

            instance.execute('abcEFRSdksbvDG').should.be.true;
        });

        it('should return false if the regex does not match', function () {
            var instance = new RegexMatchRule(/^[a-zA-Z]+$/);

            instance.execute('abcEFRS...//???dksbvDG').should.be.false;
        });

        it('should return false if the input is not a string', function () {
            var instance = new RegexMatchRule(/^[a-zA-Z]+$/);

            instance.execute({}).should.be.false;
        });
    });
});