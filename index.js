
/*Se declara un modulo en JavaScript  basandonos en:
  JavaScript Module Pattern - http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
*/
var huffman = (function(){
    //Es nuestro objeto self hace la funcion de almacenar variables, objetos o funciones publicas
    //Parecido a 'this' en Java.
    var self = {}

    //Llamamos al modulo underscore el cual nos
    var _ = require('underscore');


    /**
      Metodo: getFrecuencies
      Argumentos: text[String] text a obtener las frecuencias.
      return: colección {key:value} con las fecuencias
    */
    function getFrecuencies(text){
      return _.countBy(text, function(char){
        return char;
      })
    }
    /**
      Metodo: getLeafs nos sirve para obtener un arreglo de 'diccionarios' que cada diccionario representa un elemento de caracter referencia;
      Se
    */
    function getLeafs(frequencies){
      return _.map(frequencies, function(num, key){
        return {num:num, key:key}
      })
    }
    function getQueue(leafs){
      return _.sortBy(leafs, function(tuple){
        return tuple.num
      })
    }


    self.encode = function(text){
      var frequencies = getFrecuencies(text)
      var leafs = getLeafs(frequencies)
      var queue = getQueue(leafs)      
      return queue;
    }

    return self;
}());

var text = "abracadabra";
console.log("Original Text:"+text)
console.log(huffman.encode(text));
