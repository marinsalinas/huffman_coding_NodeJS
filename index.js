var huffman = (function(){
    var self = {}
    var _ = require('underscore');

    function methodPrivate(){
      console.log("private");
    }

    function getFrecuencies(text){
      return _.countBy(text, function(char){
        return char;
      })
    }

    self.encode = function(text){
      return getFrecuencies(text);
    }

    return self;
}());

console.log(huffman.encode("abracadabra"));
