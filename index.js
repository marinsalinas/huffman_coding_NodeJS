
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
      Metodo: "getLeafs" nos sirve para obtener un Array de 'diccionarios'
              cada elemento del array es un objeto con la estructura {num:num, key:key}
              el cual nos ayuda a tener una estructura mas organizada de cada 'nodo'
              ademas de utilizarlo para obetener funciones básicas de ir array como lenght
              y evitarnos refactorizar.
    */
    function getLeafs(frequencies){
      return _.map(frequencies, function(num, key){
        return {num:num, key:key}
      })
    }
    /**
      Metodo: "getQueue", nos asegura de que este ordenado nuestro Array de elementos o nodos, de mayor a menor
      que nos facilita el procedimiento de huffman.
    */
    function getQueue(leafs){
      return _.sortBy(leafs, function (elem) {
		            return elem.num;
              }).reverse();
    }
    /*Metodo: "getInternalNode" es donde comenzamos a crear la estructura de arbol
      La cual nos va a ayudar a ir encadenando cada nodo.
    */
    function getInternalNode(node0, node1){
      var sum = node0.num + node1.num
      var node = {num: sum, childNode0: node0, childNode1:node1}
      node0.parent = node
      node1.parent = node
      return node
    }

    function addNode(queue, newNode){
      queue.push(newNode)
      tempQ = getQueue(queue)
      queue = tempQ;
    }

    function getCodeFromNode(node code){
      code = code || ""
      
    }



    self.encode = function(text){
      var frequencies = getFrecuencies(text)
      var leafs = getLeafs(frequencies)
      var queue = getQueue(leafs)


      //Este procedimiento se repite hasta que todos los nodos esten unidos
      while(_.size(queue) > 1){
        var node0 = queue.pop()
        var node1 = queue.pop()
        var newNode = getInternalNode(node0, node1);
        addNode(queue, newNode);
      }

      _.each(leafs, function(leaf){


      })


      return leafs;
    }

    return self;
}());

var text = "abracadabra";
console.log("Original Text:"+text)
console.log(huffman.encode(text));
