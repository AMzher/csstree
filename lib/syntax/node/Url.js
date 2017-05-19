var TYPE = require('../../tokenizer').TYPE;

var RAW = TYPE.Raw;
var STRING = TYPE.String;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;
var NONBALANCED = false;

// url '(' S* (string | raw) S* ')'
module.exports = {
    name: 'Url',
    structure: {
        value: ['String', 'Raw']
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var value;

        this.scanner.expectIdentifier('url');
        this.scanner.eat(LEFTPARENTHESIS);
        this.scanner.skipSC();

        if (this.scanner.tokenType === STRING) {
            value = this.String();
        } else {
            value = this.Raw(NONBALANCED, LEFTPARENTHESIS, RIGHTPARENTHESIS);
        }

        this.scanner.skipSC();
        this.scanner.eat(RIGHTPARENTHESIS);

        return {
            type: 'Url',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: value
        };
    },
    generate: function(processChunk, node) {
        processChunk('url', RAW);
        processChunk('(', RAW);
        this.generate(processChunk, node.value);
        processChunk(')', RAW);
    }
};
