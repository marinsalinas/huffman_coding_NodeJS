(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// ABC - a generic, native JS (A)scii(B)inary(C)onverter.
// (c) 2013 Stephan Schmitz <eyecatchup@gmail.com>
// License: MIT, http://eyecatchup.mit-license.org
// URL: https://gist.github.com/eyecatchup/6742657
module.exports =(function(){


        var self = {}
        self.toAscii = function(bin) {
          return bin.replace(/\s*[01]{8}\s*/g, function(bin) {
            return String.fromCharCode(parseInt(bin, 2))
          })
        }
        self.toBinary = function(str, spaceSeparatedOctets) {
          return str.replace(/[\s\S]/g, function(str) {
            str = self.zeroPad(str.charCodeAt().toString(2));

            return !1 == spaceSeparatedOctets ? str : str + " "
          })
        },
        self.zeroPad = function(num) {
          return "00000000".slice(String(num).length) + num
        }
       return self
    }());

},{}],2:[function(require,module,exports){

/*Se declara un modulo en JavaScript  basandonos en:
  JavaScript Module Pattern - http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
*/
module.exports = (function(){
    //Es nuestro objeto self hace la funcion de almacenar variables, objetos o funciones publicas
    //Parecido a 'this' en Java.
    var self = {}

    //Llamamos al modulo underscore el cual nos
    var _ = require('underscore');
    var ABC =  require('./ABC.js')


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
              });
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

    function peek(queue){
      return queue.splice(0, 1)[0]
    }

    function addNode(queue, newNode){
      var index = _.sortedIndex(queue, newNode, "num")
      queue.splice(index, 0, newNode)
    }

    function getCodeFromNode(node, code){
      code = code || ""

      if(node.parent){
        code += getCodeFromNode(node.parent, code)
        if(node === node.parent.childNode0){
          code += 0
        }else{
          code += 1
        }
      }

      return code
    }

    function getTextFromBinaryS(binText, huffmanTable){
         var text = ''
         var cur = ''
         binText.split("").forEach(function(val){
           cur = cur + val
          for(key in huffmanTable){
            if(cur == huffmanTable[key]){
                text += key
                cur = ''
            }
          }
        })
        return text
    }

    self.encode = function(text){
      var frequencies = getFrecuencies(text)
      var leafs = getLeafs(frequencies)
      var queue = getQueue(leafs)

      //Este procedimiento se repite hasta que todos los nodos esten unidos
      while(_.size(queue) > 1){
        var node0 = peek(queue)
        var node1 = peek(queue)
        var newNode = getInternalNode(node0, node1);
        addNode(queue, newNode);
      }

      var huffmanTable = _.map(leafs, function(leaf){
          var key = leaf.key
          var code = getCodeFromNode(leaf)
          return [key, code]
      })

      hTable = _.object(huffmanTable)
      var encodedText = text.split("").map(function(val){
          return hTable[val]
      }).join("")

      //Normalize String
      var fill = 8 - (encodedText.length % 8)
      if(fill == 8)
        fill = 0

      fill += encodedText.length
      var originalLen = encodedText.length
      while(encodedText.length < fill){
        encodedText = "0" + encodedText
      }

      return {'huffmanTable':hTable,  'encodedText':ABC.toAscii(encodedText), fill:originalLen}
    }


    self.decode = function(bytecode, huffmanTable, fill){
      var encodedText = ABC.toBinary(bytecode,0)
      var subfill = encodedText.length - fill
      encodedText = encodedText.substring(subfill)
      console.log(encodedText)
      return {text:getTextFromBinaryS(encodedText, huffmanTable), binText:encodedText}
    }


    return self;
}());

},{"./ABC.js":1,"underscore":5}],3:[function(require,module,exports){
(function() {var h,aa=this;function n(a){return void 0!==a}function ba(){}function ca(a){a.rb=function(){return a.ld?a.ld:a.ld=new a}}
function da(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ea(a){var b=da(a);return"array"==b||"object"==b&&"number"==typeof a.length}function q(a){return"string"==typeof a}function fa(a){return"number"==typeof a}function ga(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ha(a,b,c){return a.call.apply(a.bind,arguments)}
function ia(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function r(a,b,c){r=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ha:ia;return r.apply(null,arguments)}
function ja(a,b){function c(){}c.prototype=b.prototype;a.ke=b.prototype;a.prototype=new c;a.ie=function(a,c,f){return b.prototype[c].apply(a,Array.prototype.slice.call(arguments,2))}};function ka(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function la(){this.mc=void 0}
function ma(a,b,c){switch(typeof b){case "string":na(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if("array"==da(b)){var d=b.length;c.push("[");for(var e="",f=0;f<d;f++)c.push(e),e=b[f],ma(a,a.mc?a.mc.call(b,String(f),e):e,c),e=",";c.push("]");break}c.push("{");d="";for(f in b)Object.prototype.hasOwnProperty.call(b,f)&&(e=b[f],"function"!=typeof e&&(c.push(d),
na(f,c),c.push(":"),ma(a,a.mc?a.mc.call(b,f,e):e,c),d=","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}}var oa={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},pa=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function na(a,b){b.push('"',a.replace(pa,function(a){if(a in oa)return oa[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return oa[a]=e+b.toString(16)}),'"')};function qa(a){return"undefined"!==typeof JSON&&n(JSON.parse)?JSON.parse(a):ka(a)}function u(a){if("undefined"!==typeof JSON&&n(JSON.stringify))a=JSON.stringify(a);else{var b=[];ma(new la,a,b);a=b.join("")}return a};function ra(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);55296<=e&&56319>=e&&(e-=55296,d++,v(d<a.length,"Surrogate pair missing trail surrogate."),e=65536+(e<<10)+(a.charCodeAt(d)-56320));128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(65536>e?b[c++]=e>>12|224:(b[c++]=e>>18|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b};var sa={};function x(a,b,c,d){var e;d<b?e="at least "+b:d>c&&(e=0===c?"none":"no more than "+c);if(e)throw Error(a+" failed: Was called with "+d+(1===d?" argument.":" arguments.")+" Expects "+e+".");}
function y(a,b,c){var d="";switch(b){case 1:d=c?"first":"First";break;case 2:d=c?"second":"Second";break;case 3:d=c?"third":"Third";break;case 4:d=c?"fourth":"Fourth";break;default:ta.assert(!1,"errorPrefix_ called with argumentNumber > 4.  Need to update it?")}return a=a+" failed: "+(d+" argument ")}function z(a,b,c,d){if((!d||n(c))&&"function"!=da(c))throw Error(y(a,b,d)+"must be a valid function.");}
function ua(a,b,c){if(n(c)&&(!ga(c)||null===c))throw Error(y(a,b,!0)+"must be a valid context object.");};function A(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function va(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]};var ta={},wa=/[\[\].#$\/]/,xa=/[\[\].#$]/;function ya(a){return q(a)&&0!==a.length&&!wa.test(a)}function za(a,b,c){c&&!n(b)||Aa(y(a,1,c),b)}
function Aa(a,b,c,d){c||(c=0);d=d||[];if(!n(b))throw Error(a+"contains undefined"+Ba(d));if("function"==da(b))throw Error(a+"contains a function"+Ba(d)+" with contents: "+b.toString());if(Ca(b))throw Error(a+"contains "+b.toString()+Ba(d));if(1E3<c)throw new TypeError(a+"contains a cyclic object value ("+d.slice(0,100).join(".")+"...)");if(q(b)&&b.length>10485760/3&&10485760<ra(b).length)throw Error(a+"contains a string greater than 10485760 utf8 bytes"+Ba(d)+" ('"+b.substring(0,50)+"...')");if(ga(b))for(var e in b)if(A(b,
e)){var f=b[e];if(".priority"!==e&&".value"!==e&&".sv"!==e&&!ya(e))throw Error(a+" contains an invalid key ("+e+")"+Ba(d)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');d.push(e);Aa(a,f,c+1,d);d.pop()}}function Ba(a){return 0==a.length?"":" in property '"+a.join(".")+"'"}function Da(a,b){if(!ga(b))throw Error(y(a,1,!1)+" must be an object containing the children to replace.");za(a,b,!1)}
function Ea(a,b,c,d){if(!(d&&!n(c)||null===c||fa(c)||q(c)||ga(c)&&A(c,".sv")))throw Error(y(a,b,d)+"must be a valid firebase priority (a string, number, or null).");}function Fa(a,b,c){if(!c||n(b))switch(b){case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":break;default:throw Error(y(a,1,c)+'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');}}
function Ga(a,b){if(n(b)&&!ya(b))throw Error(y(a,2,!0)+'was an invalid key: "'+b+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');}function Ha(a,b){if(!q(b)||0===b.length||xa.test(b))throw Error(y(a,1,!1)+'was an invalid path: "'+b+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');}function B(a,b){if(".info"===C(b))throw Error(a+" failed: Can't modify data under /.info/");};function D(a,b,c,d,e,f,g){this.m=a;this.path=b;this.Ea=c;this.fa=d;this.ya=e;this.Ca=f;this.Wa=g;if(n(this.fa)&&n(this.Ca)&&n(this.Ea))throw"Query: Can't combine startAt(), endAt(), and limit().";}D.prototype.Uc=function(){x("Query.ref",0,0,arguments.length);return new E(this.m,this.path)};D.prototype.ref=D.prototype.Uc;
D.prototype.fb=function(a,b){x("Query.on",2,4,arguments.length);Fa("Query.on",a,!1);z("Query.on",2,b,!1);var c=Ia("Query.on",arguments[2],arguments[3]);this.m.Rb(this,a,b,c.cancel,c.Y);return b};D.prototype.on=D.prototype.fb;D.prototype.yb=function(a,b,c){x("Query.off",0,3,arguments.length);Fa("Query.off",a,!0);z("Query.off",2,b,!0);ua("Query.off",3,c);this.m.lc(this,a,b,c)};D.prototype.off=D.prototype.yb;
D.prototype.Wd=function(a,b){function c(g){f&&(f=!1,e.yb(a,c),b.call(d.Y,g))}x("Query.once",2,4,arguments.length);Fa("Query.once",a,!1);z("Query.once",2,b,!1);var d=Ia("Query.once",arguments[2],arguments[3]),e=this,f=!0;this.fb(a,c,function(b){e.yb(a,c);d.cancel&&d.cancel.call(d.Y,b)})};D.prototype.once=D.prototype.Wd;
D.prototype.Pd=function(a){x("Query.limit",1,1,arguments.length);if(!fa(a)||Math.floor(a)!==a||0>=a)throw"Query.limit: First argument must be a positive integer.";return new D(this.m,this.path,a,this.fa,this.ya,this.Ca,this.Wa)};D.prototype.limit=D.prototype.Pd;D.prototype.ee=function(a,b){x("Query.startAt",0,2,arguments.length);Ea("Query.startAt",1,a,!0);Ga("Query.startAt",b);n(a)||(b=a=null);return new D(this.m,this.path,this.Ea,a,b,this.Ca,this.Wa)};D.prototype.startAt=D.prototype.ee;
D.prototype.Jd=function(a,b){x("Query.endAt",0,2,arguments.length);Ea("Query.endAt",1,a,!0);Ga("Query.endAt",b);return new D(this.m,this.path,this.Ea,this.fa,this.ya,a,b)};D.prototype.endAt=D.prototype.Jd;function Ja(a){var b={};n(a.fa)&&(b.sp=a.fa);n(a.ya)&&(b.sn=a.ya);n(a.Ca)&&(b.ep=a.Ca);n(a.Wa)&&(b.en=a.Wa);n(a.Ea)&&(b.l=a.Ea);n(a.fa)&&n(a.ya)&&null===a.fa&&null===a.ya&&(b.vf="l");return b}D.prototype.Pa=function(){var a=Ka(Ja(this));return"{}"===a?"default":a};
function Ia(a,b,c){var d={};if(b&&c)d.cancel=b,z(a,3,d.cancel,!0),d.Y=c,ua(a,4,d.Y);else if(b)if("object"===typeof b&&null!==b)d.Y=b;else if("function"===typeof b)d.cancel=b;else throw Error(sa.je(a,3,!0)+"must either be a cancel callback or a context object.");return d};function F(a,b){if(1==arguments.length){this.n=a.split("/");for(var c=0,d=0;d<this.n.length;d++)0<this.n[d].length&&(this.n[c]=this.n[d],c++);this.n.length=c;this.da=0}else this.n=a,this.da=b}function C(a){return a.da>=a.n.length?null:a.n[a.da]}function La(a){var b=a.da;b<a.n.length&&b++;return new F(a.n,b)}function Ma(a){return a.da<a.n.length?a.n[a.n.length-1]:null}h=F.prototype;h.toString=function(){for(var a="",b=this.da;b<this.n.length;b++)""!==this.n[b]&&(a+="/"+this.n[b]);return a||"/"};
h.parent=function(){if(this.da>=this.n.length)return null;for(var a=[],b=this.da;b<this.n.length-1;b++)a.push(this.n[b]);return new F(a,0)};h.G=function(a){for(var b=[],c=this.da;c<this.n.length;c++)b.push(this.n[c]);if(a instanceof F)for(c=a.da;c<a.n.length;c++)b.push(a.n[c]);else for(a=a.split("/"),c=0;c<a.length;c++)0<a[c].length&&b.push(a[c]);return new F(b,0)};h.f=function(){return this.da>=this.n.length};
function Na(a,b){var c=C(a);if(null===c)return b;if(c===C(b))return Na(La(a),La(b));throw"INTERNAL ERROR: innerPath ("+b+") is not within outerPath ("+a+")";}h.contains=function(a){var b=0;if(this.n.length>a.n.length)return!1;for(;b<this.n.length;){if(this.n[b]!==a.n[b])return!1;++b}return!0};function Oa(){this.children={};this.yc=0;this.value=null}function Pa(a,b,c){this.Fa=a?a:"";this.Eb=b?b:null;this.B=c?c:new Oa}function I(a,b){for(var c=b instanceof F?b:new F(b),d=a,e;null!==(e=C(c));)d=new Pa(e,d,va(d.B.children,e)||new Oa),c=La(c);return d}h=Pa.prototype;h.j=function(){return this.B.value};function J(a,b){v("undefined"!==typeof b,"Cannot set value to undefined");a.B.value=b;Qa(a)}h.sb=function(){return 0<this.B.yc};h.f=function(){return null===this.j()&&!this.sb()};
h.A=function(a){for(var b in this.B.children)a(new Pa(b,this,this.B.children[b]))};function Ra(a,b,c,d){c&&!d&&b(a);a.A(function(a){Ra(a,b,!0,d)});c&&d&&b(a)}function Sa(a,b,c){for(a=c?a:a.parent();null!==a;){if(b(a))return!0;a=a.parent()}return!1}h.path=function(){return new F(null===this.Eb?this.Fa:this.Eb.path()+"/"+this.Fa)};h.name=function(){return this.Fa};h.parent=function(){return this.Eb};
function Qa(a){if(null!==a.Eb){var b=a.Eb,c=a.Fa,d=a.f(),e=A(b.B.children,c);d&&e?(delete b.B.children[c],b.B.yc--,Qa(b)):d||e||(b.B.children[c]=a.B,b.B.yc++,Qa(b))}};function Ta(a,b){this.Ta=a?a:Ua;this.ea=b?b:Va}function Ua(a,b){return a<b?-1:a>b?1:0}h=Ta.prototype;h.sa=function(a,b){return new Ta(this.Ta,this.ea.sa(a,b,this.Ta).J(null,null,!1,null,null))};h.remove=function(a){return new Ta(this.Ta,this.ea.remove(a,this.Ta).J(null,null,!1,null,null))};h.get=function(a){for(var b,c=this.ea;!c.f();){b=this.Ta(a,c.key);if(0===b)return c.value;0>b?c=c.left:0<b&&(c=c.right)}return null};
function Wa(a,b){for(var c,d=a.ea,e=null;!d.f();){c=a.Ta(b,d.key);if(0===c){if(d.left.f())return e?e.key:null;for(d=d.left;!d.right.f();)d=d.right;return d.key}0>c?d=d.left:0<c&&(e=d,d=d.right)}throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");}h.f=function(){return this.ea.f()};h.count=function(){return this.ea.count()};h.xb=function(){return this.ea.xb()};h.bb=function(){return this.ea.bb()};h.Da=function(a){return this.ea.Da(a)};h.Qa=function(a){return this.ea.Qa(a)};
h.Za=function(a){return new Xa(this.ea,a)};function Xa(a,b){this.ud=b;for(this.Zb=[];!a.f();)this.Zb.push(a),a=a.left}function Ya(a){if(0===a.Zb.length)return null;var b=a.Zb.pop(),c;c=a.ud?a.ud(b.key,b.value):{key:b.key,value:b.value};for(b=b.right;!b.f();)a.Zb.push(b),b=b.left;return c}function Za(a,b,c,d,e){this.key=a;this.value=b;this.color=null!=c?c:!0;this.left=null!=d?d:Va;this.right=null!=e?e:Va}h=Za.prototype;
h.J=function(a,b,c,d,e){return new Za(null!=a?a:this.key,null!=b?b:this.value,null!=c?c:this.color,null!=d?d:this.left,null!=e?e:this.right)};h.count=function(){return this.left.count()+1+this.right.count()};h.f=function(){return!1};h.Da=function(a){return this.left.Da(a)||a(this.key,this.value)||this.right.Da(a)};h.Qa=function(a){return this.right.Qa(a)||a(this.key,this.value)||this.left.Qa(a)};function bb(a){return a.left.f()?a:bb(a.left)}h.xb=function(){return bb(this).key};
h.bb=function(){return this.right.f()?this.key:this.right.bb()};h.sa=function(a,b,c){var d,e;e=this;d=c(a,e.key);e=0>d?e.J(null,null,null,e.left.sa(a,b,c),null):0===d?e.J(null,b,null,null,null):e.J(null,null,null,null,e.right.sa(a,b,c));return cb(e)};function db(a){if(a.left.f())return Va;a.left.Q()||a.left.left.Q()||(a=eb(a));a=a.J(null,null,null,db(a.left),null);return cb(a)}
h.remove=function(a,b){var c,d;c=this;if(0>b(a,c.key))c.left.f()||c.left.Q()||c.left.left.Q()||(c=eb(c)),c=c.J(null,null,null,c.left.remove(a,b),null);else{c.left.Q()&&(c=fb(c));c.right.f()||c.right.Q()||c.right.left.Q()||(c=gb(c),c.left.left.Q()&&(c=fb(c),c=gb(c)));if(0===b(a,c.key)){if(c.right.f())return Va;d=bb(c.right);c=c.J(d.key,d.value,null,null,db(c.right))}c=c.J(null,null,null,null,c.right.remove(a,b))}return cb(c)};h.Q=function(){return this.color};
function cb(a){a.right.Q()&&!a.left.Q()&&(a=hb(a));a.left.Q()&&a.left.left.Q()&&(a=fb(a));a.left.Q()&&a.right.Q()&&(a=gb(a));return a}function eb(a){a=gb(a);a.right.left.Q()&&(a=a.J(null,null,null,null,fb(a.right)),a=hb(a),a=gb(a));return a}function hb(a){return a.right.J(null,null,a.color,a.J(null,null,!0,null,a.right.left),null)}function fb(a){return a.left.J(null,null,a.color,null,a.J(null,null,!0,a.left.right,null))}
function gb(a){return a.J(null,null,!a.color,a.left.J(null,null,!a.left.color,null,null),a.right.J(null,null,!a.right.color,null,null))}function ib(){}h=ib.prototype;h.J=function(){return this};h.sa=function(a,b){return new Za(a,b,null)};h.remove=function(){return this};h.count=function(){return 0};h.f=function(){return!0};h.Da=function(){return!1};h.Qa=function(){return!1};h.xb=function(){return null};h.bb=function(){return null};h.Q=function(){return!1};var Va=new ib;function jb(a){this.Ub=a;this.hc="firebase:"}jb.prototype.set=function(a,b){null==b?this.Ub.removeItem(this.hc+a):this.Ub.setItem(this.hc+a,u(b))};jb.prototype.get=function(a){a=this.Ub.getItem(this.hc+a);return null==a?null:qa(a)};jb.prototype.remove=function(a){this.Ub.removeItem(this.hc+a)};jb.prototype.nd=!1;function kb(){this.nb={}}kb.prototype.set=function(a,b){null==b?delete this.nb[a]:this.nb[a]=b};kb.prototype.get=function(a){return A(this.nb,a)?this.nb[a]:null};kb.prototype.remove=function(a){delete this.nb[a]};kb.prototype.nd=!0;function lb(a){try{if("undefined"!==typeof window&&"undefined"!==typeof window[a]){var b=window[a];b.setItem("firebase:sentinel","cache");b.removeItem("firebase:sentinel");return new jb(b)}}catch(c){}return new kb}var mb=lb("localStorage"),nb=lb("sessionStorage");function ob(a,b,c,d){this.host=a.toLowerCase();this.domain=this.host.substr(this.host.indexOf(".")+1);this.nc=b;this.Yb=c;this.ge=d;this.ha=mb.get("host:"+a)||this.host}function pb(a,b){b!==a.ha&&(a.ha=b,"s-"===a.ha.substr(0,2)&&mb.set("host:"+a.host,a.ha))}ob.prototype.toString=function(){return(this.nc?"https://":"http://")+this.host};function qb(){this.qa=-1};function rb(){this.qa=-1;this.qa=64;this.C=[];this.xc=[];this.Ed=[];this.ec=[];this.ec[0]=128;for(var a=1;a<this.qa;++a)this.ec[a]=0;this.rc=this.$a=0;this.reset()}ja(rb,qb);rb.prototype.reset=function(){this.C[0]=1732584193;this.C[1]=4023233417;this.C[2]=2562383102;this.C[3]=271733878;this.C[4]=3285377520;this.rc=this.$a=0};
function sb(a,b,c){c||(c=0);var d=a.Ed;if(q(b))for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.C[0];c=a.C[1];for(var g=a.C[2],k=a.C[3],l=a.C[4],m,e=0;80>e;e++)40>e?20>e?(f=k^c&(g^k),m=1518500249):(f=c^g^k,m=1859775393):60>e?(f=c&g|k&(c|g),m=2400959708):(f=c^g^k,m=3395469782),f=(b<<
5|b>>>27)+f+l+m+d[e]&4294967295,l=k,k=g,g=(c<<30|c>>>2)&4294967295,c=b,b=f;a.C[0]=a.C[0]+b&4294967295;a.C[1]=a.C[1]+c&4294967295;a.C[2]=a.C[2]+g&4294967295;a.C[3]=a.C[3]+k&4294967295;a.C[4]=a.C[4]+l&4294967295}
rb.prototype.update=function(a,b){n(b)||(b=a.length);for(var c=b-this.qa,d=0,e=this.xc,f=this.$a;d<b;){if(0==f)for(;d<=c;)sb(this,a,d),d+=this.qa;if(q(a))for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.qa){sb(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.qa){sb(this,e);f=0;break}}this.$a=f;this.rc+=b};var tb=Array.prototype,ub=tb.forEach?function(a,b,c){tb.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},vb=tb.map?function(a,b,c){return tb.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=q(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},wb=tb.reduce?function(a,b,c,d){d&&(b=r(b,d));return tb.reduce.call(a,b,c)}:function(a,b,c,d){var e=c;ub(a,function(c,g){e=b.call(d,e,c,g,a)});return e},
xb=tb.every?function(a,b,c){return tb.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};function yb(a,b){var c;a:{c=a.length;for(var d=q(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){c=e;break a}c=-1}return 0>c?null:q(a)?a.charAt(c):a[c]};var zb;a:{var Ab=aa.navigator;if(Ab){var Bb=Ab.userAgent;if(Bb){zb=Bb;break a}}zb=""}function Cb(a){return-1!=zb.indexOf(a)};var Db=Cb("Opera")||Cb("OPR"),Eb=Cb("Trident")||Cb("MSIE"),Fb=Cb("Gecko")&&-1==zb.toLowerCase().indexOf("webkit")&&!(Cb("Trident")||Cb("MSIE")),Gb=-1!=zb.toLowerCase().indexOf("webkit");(function(){var a="",b;if(Db&&aa.opera)return a=aa.opera.version,"function"==da(a)?a():a;Fb?b=/rv\:([^\);]+)(\)|;)/:Eb?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:Gb&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(zb))?a[1]:"");return Eb&&(b=(b=aa.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var Hb=null,Ib=null;
function Jb(a,b){if(!ea(a))throw Error("encodeByteArray takes an array as a parameter");if(!Hb){Hb={};Ib={};for(var c=0;65>c;c++)Hb[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(c),Ib[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(c)}for(var c=b?Ib:Hb,d=[],e=0;e<a.length;e+=3){var f=a[e],g=e+1<a.length,k=g?a[e+1]:0,l=e+2<a.length,m=l?a[e+2]:0,p=f>>2,f=(f&3)<<4|k>>4,k=(k&15)<<2|m>>6,m=m&63;l||(m=64,g||(k=64));d.push(c[p],c[f],c[k],c[m])}return d.join("")}
;var Kb=function(){var a=1;return function(){return a++}}();function v(a,b){if(!a)throw Error("Firebase INTERNAL ASSERT FAILED:"+b);}function Lb(a){var b=ra(a);a=new rb;a.update(b);var b=[],c=8*a.rc;56>a.$a?a.update(a.ec,56-a.$a):a.update(a.ec,a.qa-(a.$a-56));for(var d=a.qa-1;56<=d;d--)a.xc[d]=c&255,c/=256;sb(a,a.xc);for(d=c=0;5>d;d++)for(var e=24;0<=e;e-=8)b[c]=a.C[d]>>e&255,++c;return Jb(b)}
function Mb(a){for(var b="",c=0;c<arguments.length;c++)b=ea(arguments[c])?b+Mb.apply(null,arguments[c]):"object"===typeof arguments[c]?b+u(arguments[c]):b+arguments[c],b+=" ";return b}var Nb=null,Ob=!0;function K(a){!0===Ob&&(Ob=!1,null===Nb&&!0===nb.get("logging_enabled")&&Pb(!0));if(Nb){var b=Mb.apply(null,arguments);Nb(b)}}function Qb(a){return function(){K(a,arguments)}}
function Rb(a){if("undefined"!==typeof console){var b="FIREBASE INTERNAL ERROR: "+Mb.apply(null,arguments);"undefined"!==typeof console.error?console.error(b):console.log(b)}}function Sb(a){var b=Mb.apply(null,arguments);throw Error("FIREBASE FATAL ERROR: "+b);}function L(a){if("undefined"!==typeof console){var b="FIREBASE WARNING: "+Mb.apply(null,arguments);"undefined"!==typeof console.warn?console.warn(b):console.log(b)}}
function Ca(a){return fa(a)&&(a!=a||a==Number.POSITIVE_INFINITY||a==Number.NEGATIVE_INFINITY)}function Tb(a){if("complete"===document.readyState)a();else{var b=!1,c=function(){document.body?b||(b=!0,a()):setTimeout(c,10)};document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&c()}),window.attachEvent("onload",c))}}
function Ub(a,b){return a!==b?null===a?-1:null===b?1:typeof a!==typeof b?"number"===typeof a?-1:1:a>b?1:-1:0}function Vb(a,b){if(a===b)return 0;var c=Wb(a),d=Wb(b);return null!==c?null!==d?0==c-d?a.length-b.length:c-d:-1:null!==d?1:a<b?-1:1}function Xb(a,b){if(b&&a in b)return b[a];throw Error("Missing required key ("+a+") in object: "+u(b));}
function Ka(a){if("object"!==typeof a||null===a)return u(a);var b=[],c;for(c in a)b.push(c);b.sort();c="{";for(var d=0;d<b.length;d++)0!==d&&(c+=","),c+=u(b[d]),c+=":",c+=Ka(a[b[d]]);return c+"}"}function Yb(a,b){if(a.length<=b)return[a];for(var c=[],d=0;d<a.length;d+=b)d+b>a?c.push(a.substring(d,a.length)):c.push(a.substring(d,d+b));return c}function Zb(a,b){if("array"==da(a))for(var c=0;c<a.length;++c)b(c,a[c]);else $b(a,b)}function ac(a,b){return b?r(a,b):a}
function bc(a){v(!Ca(a),"Invalid JSON number");var b,c,d,e;0===a?(d=c=0,b=-Infinity===1/a?1:0):(b=0>a,a=Math.abs(a),a>=Math.pow(2,-1022)?(d=Math.min(Math.floor(Math.log(a)/Math.LN2),1023),c=d+1023,d=Math.round(a*Math.pow(2,52-d)-Math.pow(2,52))):(c=0,d=Math.round(a/Math.pow(2,-1074))));e=[];for(a=52;a;a-=1)e.push(d%2?1:0),d=Math.floor(d/2);for(a=11;a;a-=1)e.push(c%2?1:0),c=Math.floor(c/2);e.push(b?1:0);e.reverse();b=e.join("");c="";for(a=0;64>a;a+=8)d=parseInt(b.substr(a,8),2).toString(16),1===d.length&&
(d="0"+d),c+=d;return c.toLowerCase()}function cc(a){var b="Unknown Error";"too_big"===a?b="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"==a?b="Client doesn't have permission to access the desired data.":"unavailable"==a&&(b="The service is unavailable");b=Error(a+": "+b);b.code=a.toUpperCase();return b}var dc=/^-?\d{1,10}$/;function Wb(a){return dc.test(a)&&(a=Number(a),-2147483648<=a&&2147483647>=a)?a:null}
function ec(a){try{a()}catch(b){setTimeout(function(){throw b;},0)}};function fc(a,b){this.F=a;v(null!==this.F,"LeafNode shouldn't be created with null value.");this.gb="undefined"!==typeof b?b:null}h=fc.prototype;h.P=function(){return!0};h.k=function(){return this.gb};h.Ia=function(a){return new fc(this.F,a)};h.O=function(){return M};h.L=function(a){return null===C(a)?this:M};h.ga=function(){return null};h.H=function(a,b){return(new N).H(a,b).Ia(this.gb)};h.Aa=function(a,b){var c=C(a);return null===c?b:this.H(c,M.Aa(La(a),b))};h.f=function(){return!1};h.$b=function(){return 0};
h.V=function(a){return a&&null!==this.k()?{".value":this.j(),".priority":this.k()}:this.j()};h.hash=function(){var a="";null!==this.k()&&(a+="priority:"+gc(this.k())+":");var b=typeof this.F,a=a+(b+":"),a="number"===b?a+bc(this.F):a+this.F;return Lb(a)};h.j=function(){return this.F};h.toString=function(){return"string"===typeof this.F?this.F:'"'+this.F+'"'};function ic(a,b){return Ub(a.ka,b.ka)||Vb(a.name,b.name)}function jc(a,b){return Vb(a.name,b.name)}function kc(a,b){return Vb(a,b)};function N(a,b){this.o=a||new Ta(kc);this.gb="undefined"!==typeof b?b:null}h=N.prototype;h.P=function(){return!1};h.k=function(){return this.gb};h.Ia=function(a){return new N(this.o,a)};h.H=function(a,b){var c=this.o.remove(a);b&&b.f()&&(b=null);null!==b&&(c=c.sa(a,b));return b&&null!==b.k()?new lc(c,null,this.gb):new N(c,this.gb)};h.Aa=function(a,b){var c=C(a);if(null===c)return b;var d=this.O(c).Aa(La(a),b);return this.H(c,d)};h.f=function(){return this.o.f()};h.$b=function(){return this.o.count()};
var mc=/^\d+$/;h=N.prototype;h.V=function(a){if(this.f())return null;var b={},c=0,d=0,e=!0;this.A(function(f,g){b[f]=g.V(a);c++;e&&mc.test(f)?d=Math.max(d,Number(f)):e=!1});if(!a&&e&&d<2*c){var f=[],g;for(g in b)f[g]=b[g];return f}a&&null!==this.k()&&(b[".priority"]=this.k());return b};h.hash=function(){var a="";null!==this.k()&&(a+="priority:"+gc(this.k())+":");this.A(function(b,c){var d=c.hash();""!==d&&(a+=":"+b+":"+d)});return""===a?"":Lb(a)};
h.O=function(a){a=this.o.get(a);return null===a?M:a};h.L=function(a){var b=C(a);return null===b?this:this.O(b).L(La(a))};h.ga=function(a){return Wa(this.o,a)};h.hd=function(){return this.o.xb()};h.kd=function(){return this.o.bb()};h.A=function(a){return this.o.Da(a)};h.Ec=function(a){return this.o.Qa(a)};h.Za=function(){return this.o.Za()};h.toString=function(){var a="{",b=!0;this.A(function(c,d){b?b=!1:a+=", ";a+='"'+c+'" : '+d.toString()});return a+="}"};var M=new N;function lc(a,b,c){N.call(this,a,c);null===b&&(b=new Ta(ic),a.Da(function(a,c){b=b.sa({name:a,ka:c.k()},c)}));this.xa=b}ja(lc,N);h=lc.prototype;h.H=function(a,b){var c=this.O(a),d=this.o,e=this.xa;null!==c&&(d=d.remove(a),e=e.remove({name:a,ka:c.k()}));b&&b.f()&&(b=null);null!==b&&(d=d.sa(a,b),e=e.sa({name:a,ka:b.k()},b));return new lc(d,e,this.k())};h.ga=function(a,b){var c=Wa(this.xa,{name:a,ka:b.k()});return c?c.name:null};h.A=function(a){return this.xa.Da(function(b,c){return a(b.name,c)})};
h.Ec=function(a){return this.xa.Qa(function(b,c){return a(b.name,c)})};h.Za=function(){return this.xa.Za(function(a,b){return{key:a.name,value:b}})};h.hd=function(){return this.xa.f()?null:this.xa.xb().name};h.kd=function(){return this.xa.f()?null:this.xa.bb().name};function O(a,b){if(null===a)return M;var c=null;"object"===typeof a&&".priority"in a?c=a[".priority"]:"undefined"!==typeof b&&(c=b);v(null===c||"string"===typeof c||"number"===typeof c||"object"===typeof c&&".sv"in c,"Invalid priority type found: "+typeof c);"object"===typeof a&&".value"in a&&null!==a[".value"]&&(a=a[".value"]);if("object"!==typeof a||".sv"in a)return new fc(a,c);if(a instanceof Array){var d=M,e=a;$b(e,function(a,b){if(A(e,b)&&"."!==b.substring(0,1)){var c=O(a);if(c.P()||!c.f())d=
d.H(b,c)}});return d.Ia(c)}var f=[],g={},k=!1,l=a;Zb(l,function(a,b){if("string"!==typeof b||"."!==b.substring(0,1)){var c=O(l[b]);c.f()||(k=k||null!==c.k(),f.push({name:b,ka:c.k()}),g[b]=c)}});var m=nc(f,g,!1);if(k){var p=nc(f,g,!0);return new lc(m,p,c)}return new N(m,c)}var oc=Math.log(2);function pc(a){this.count=parseInt(Math.log(a+1)/oc,10);this.ed=this.count-1;this.Gd=a+1&parseInt(Array(this.count+1).join("1"),2)}function qc(a){var b=!(a.Gd&1<<a.ed);a.ed--;return b}
function nc(a,b,c){function d(e,f){var l=f-e;if(0==l)return null;if(1==l){var l=a[e].name,m=c?a[e]:l;return new Za(m,b[l],!1,null,null)}var m=parseInt(l/2,10)+e,p=d(e,m),t=d(m+1,f),l=a[m].name,m=c?a[m]:l;return new Za(m,b[l],!1,p,t)}var e=c?ic:jc;a.sort(e);var f=function(e){function f(e,g){var k=p-e,t=p;p-=e;var s=a[k].name,k=new Za(c?a[k]:s,b[s],g,null,d(k+1,t));l?l.left=k:m=k;l=k}for(var l=null,m=null,p=a.length,t=0;t<e.count;++t){var s=qc(e),w=Math.pow(2,e.count-(t+1));s?f(w,!1):(f(w,!1),f(w,!0))}return m}(new pc(a.length)),
e=c?ic:kc;return null!==f?new Ta(e,f):new Ta(e)}function gc(a){return"number"===typeof a?"number:"+bc(a):"string:"+a};function P(a,b){this.B=a;this.kc=b}P.prototype.V=function(){x("Firebase.DataSnapshot.val",0,0,arguments.length);return this.B.V()};P.prototype.val=P.prototype.V;P.prototype.Kd=function(){x("Firebase.DataSnapshot.exportVal",0,0,arguments.length);return this.B.V(!0)};P.prototype.exportVal=P.prototype.Kd;P.prototype.G=function(a){x("Firebase.DataSnapshot.child",0,1,arguments.length);fa(a)&&(a=String(a));Ha("Firebase.DataSnapshot.child",a);var b=new F(a),c=this.kc.G(b);return new P(this.B.L(b),c)};
P.prototype.child=P.prototype.G;P.prototype.Hc=function(a){x("Firebase.DataSnapshot.hasChild",1,1,arguments.length);Ha("Firebase.DataSnapshot.hasChild",a);var b=new F(a);return!this.B.L(b).f()};P.prototype.hasChild=P.prototype.Hc;P.prototype.k=function(){x("Firebase.DataSnapshot.getPriority",0,0,arguments.length);return this.B.k()};P.prototype.getPriority=P.prototype.k;
P.prototype.forEach=function(a){x("Firebase.DataSnapshot.forEach",1,1,arguments.length);z("Firebase.DataSnapshot.forEach",1,a,!1);if(this.B.P())return!1;var b=this;return this.B.A(function(c,d){return a(new P(d,b.kc.G(c)))})};P.prototype.forEach=P.prototype.forEach;P.prototype.sb=function(){x("Firebase.DataSnapshot.hasChildren",0,0,arguments.length);return this.B.P()?!1:!this.B.f()};P.prototype.hasChildren=P.prototype.sb;
P.prototype.name=function(){x("Firebase.DataSnapshot.name",0,0,arguments.length);return this.kc.name()};P.prototype.name=P.prototype.name;P.prototype.$b=function(){x("Firebase.DataSnapshot.numChildren",0,0,arguments.length);return this.B.$b()};P.prototype.numChildren=P.prototype.$b;P.prototype.Uc=function(){x("Firebase.DataSnapshot.ref",0,0,arguments.length);return this.kc};P.prototype.ref=P.prototype.Uc;function rc(a){v("array"==da(a)&&0<a.length,"Requires a non-empty array");this.Fd=a;this.wb={}}rc.prototype.bd=function(a,b){for(var c=this.wb[a]||[],d=0;d<c.length;d++)c[d].ba.apply(c[d].Y,Array.prototype.slice.call(arguments,1))};rc.prototype.fb=function(a,b,c){sc(this,a);this.wb[a]=this.wb[a]||[];this.wb[a].push({ba:b,Y:c});(a=this.jd(a))&&b.apply(c,a)};rc.prototype.yb=function(a,b,c){sc(this,a);a=this.wb[a]||[];for(var d=0;d<a.length;d++)if(a[d].ba===b&&(!c||c===a[d].Y)){a.splice(d,1);break}};
function sc(a,b){v(yb(a.Fd,function(a){return a===b}),"Unknown event: "+b)};function tc(){rc.call(this,["visible"]);var a,b;"undefined"!==typeof document&&"undefined"!==typeof document.addEventListener&&("undefined"!==typeof document.hidden?(b="visibilitychange",a="hidden"):"undefined"!==typeof document.mozHidden?(b="mozvisibilitychange",a="mozHidden"):"undefined"!==typeof document.msHidden?(b="msvisibilitychange",a="msHidden"):"undefined"!==typeof document.webkitHidden&&(b="webkitvisibilitychange",a="webkitHidden"));this.lb=!0;if(b){var c=this;document.addEventListener(b,
function(){var b=!document[a];b!==c.lb&&(c.lb=b,c.bd("visible",b))},!1)}}ja(tc,rc);ca(tc);tc.prototype.jd=function(a){v("visible"===a,"Unknown event type: "+a);return[this.lb]};function uc(){rc.call(this,["online"]);this.Cb=!0;if("undefined"!==typeof window&&"undefined"!==typeof window.addEventListener){var a=this;window.addEventListener("online",function(){a.Cb||a.bd("online",!0);a.Cb=!0},!1);window.addEventListener("offline",function(){a.Cb&&a.bd("online",!1);a.Cb=!1},!1)}}ja(uc,rc);ca(uc);uc.prototype.jd=function(a){v("online"===a,"Unknown event type: "+a);return[this.Cb]};function $b(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function vc(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}function wc(a){var b={},c;for(c in a)b[c]=a[c];return b};function xc(){this.ob={}}function yc(a,b,c){n(c)||(c=1);A(a.ob,b)||(a.ob[b]=0);a.ob[b]+=c}xc.prototype.get=function(){return wc(this.ob)};function zc(a){this.Hd=a;this.Wb=null}zc.prototype.get=function(){var a=this.Hd.get(),b=wc(a);if(this.Wb)for(var c in this.Wb)b[c]-=this.Wb[c];this.Wb=a;return b};function Ac(a,b){this.Zc={};this.qc=new zc(a);this.u=b;setTimeout(r(this.sd,this),10+6E4*Math.random())}Ac.prototype.sd=function(){var a=this.qc.get(),b={},c=!1,d;for(d in a)0<a[d]&&A(this.Zc,d)&&(b[d]=a[d],c=!0);c&&(a=this.u,a.S&&(b={c:b},a.e("reportStats",b),a.Ga("s",b)));setTimeout(r(this.sd,this),6E5*Math.random())};var Bc={},Cc={};function Dc(a){a=a.toString();Bc[a]||(Bc[a]=new xc);return Bc[a]}function Ec(a,b){var c=a.toString();Cc[c]||(Cc[c]=b());return Cc[c]};var Fc=null;"undefined"!==typeof MozWebSocket?Fc=MozWebSocket:"undefined"!==typeof WebSocket&&(Fc=WebSocket);function Q(a,b,c){this.Ac=a;this.e=Qb(this.Ac);this.frames=this.ub=null;this.ad=0;this.aa=Dc(b);this.Ua=(b.nc?"wss://":"ws://")+b.ha+"/.ws?v=5";b.host!==b.ha&&(this.Ua=this.Ua+"&ns="+b.Yb);c&&(this.Ua=this.Ua+"&s="+c)}var Gc;
Q.prototype.open=function(a,b){this.ja=b;this.Td=a;this.e("Websocket connecting to "+this.Ua);this.W=new Fc(this.Ua);this.pb=!1;mb.set("previous_websocket_failure",!0);var c=this;this.W.onopen=function(){c.e("Websocket connected.");c.pb=!0};this.W.onclose=function(){c.e("Websocket connection was disconnected.");c.W=null;c.Oa()};this.W.onmessage=function(a){if(null!==c.W)if(a=a.data,yc(c.aa,"bytes_received",a.length),Hc(c),null!==c.frames)Ic(c,a);else{a:{v(null===c.frames,"We already have a frame buffer");
if(6>=a.length){var b=Number(a);if(!isNaN(b)){c.ad=b;c.frames=[];a=null;break a}}c.ad=1;c.frames=[]}null!==a&&Ic(c,a)}};this.W.onerror=function(a){c.e("WebSocket error.  Closing connection.");(a=a.message||a.data)&&c.e(a);c.Oa()}};Q.prototype.start=function(){};Q.isAvailable=function(){var a=!1;if("undefined"!==typeof navigator&&navigator.userAgent){var b=navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);b&&1<b.length&&4.4>parseFloat(b[1])&&(a=!0)}return!a&&null!==Fc&&!Gc};
Q.responsesRequiredToBeHealthy=2;Q.healthyTimeout=3E4;h=Q.prototype;h.Lc=function(){mb.remove("previous_websocket_failure")};function Ic(a,b){a.frames.push(b);if(a.frames.length==a.ad){var c=a.frames.join("");a.frames=null;c=qa(c);a.Td(c)}}h.send=function(a){Hc(this);a=u(a);yc(this.aa,"bytes_sent",a.length);a=Yb(a,16384);1<a.length&&this.W.send(String(a.length));for(var b=0;b<a.length;b++)this.W.send(a[b])};
h.Mb=function(){this.Ma=!0;this.ub&&(clearInterval(this.ub),this.ub=null);this.W&&(this.W.close(),this.W=null)};h.Oa=function(){this.Ma||(this.e("WebSocket is closing itself"),this.Mb(),this.ja&&(this.ja(this.pb),this.ja=null))};h.close=function(){this.Ma||(this.e("WebSocket is being closed"),this.Mb())};function Hc(a){clearInterval(a.ub);a.ub=setInterval(function(){a.W&&a.W.send("0");Hc(a)},45E3)};function Jc(a){this.Pc=a;this.gc=[];this.Va=0;this.zc=-1;this.Na=null}function Kc(a,b,c){a.zc=b;a.Na=c;a.zc<a.Va&&(a.Na(),a.Na=null)}function Lc(a,b,c){for(a.gc[b]=c;a.gc[a.Va];){var d=a.gc[a.Va];delete a.gc[a.Va];for(var e=0;e<d.length;++e)if(d[e]){var f=a;ec(function(){f.Pc(d[e])})}if(a.Va===a.zc){a.Na&&(clearTimeout(a.Na),a.Na(),a.Na=null);break}a.Va++}};function Mc(){this.set={}}h=Mc.prototype;h.add=function(a,b){this.set[a]=null!==b?b:!0};h.contains=function(a){return A(this.set,a)};h.get=function(a){return this.contains(a)?this.set[a]:void 0};h.remove=function(a){delete this.set[a]};h.f=function(){var a;a:{a=this.set;for(var b in a){a=!1;break a}a=!0}return a};h.count=function(){var a=this.set,b=0,c;for(c in a)b++;return b};function R(a,b){$b(a.set,function(a,d){b(d,a)})}h.keys=function(){var a=[];$b(this.set,function(b,c){a.push(c)});return a};function Nc(a,b,c){this.Ac=a;this.e=Qb(a);this.aa=Dc(b);this.pc=c;this.pb=!1;this.Qb=function(a){b.host!==b.ha&&(a.ns=b.Yb);var c=[],f;for(f in a)a.hasOwnProperty(f)&&c.push(f+"="+a[f]);return(b.nc?"https://":"http://")+b.ha+"/.lp?"+c.join("&")}}var Oc,Pc;
Nc.prototype.open=function(a,b){this.dd=0;this.T=b;this.od=new Jc(a);this.Ma=!1;var c=this;this.Ja=setTimeout(function(){c.e("Timed out trying to connect.");c.Oa();c.Ja=null},3E4);Tb(function(){if(!c.Ma){c.ma=new Qc(function(a,b,d,k,l){yc(c.aa,"bytes_received",u(arguments).length);if(c.ma)if(c.Ja&&(clearTimeout(c.Ja),c.Ja=null),c.pb=!0,"start"==a)c.id=b,c.rd=d;else if("close"===a)b?(c.ma.oc=!1,Kc(c.od,b,function(){c.Oa()})):c.Oa();else throw Error("Unrecognized command received: "+a);},function(a,
b){yc(c.aa,"bytes_received",u(arguments).length);Lc(c.od,a,b)},function(){c.Oa()},c.Qb);var a={start:"t"};a.ser=Math.floor(1E8*Math.random());c.ma.sc&&(a.cb=c.ma.sc);a.v="5";c.pc&&(a.s=c.pc);a=c.Qb(a);c.e("Connecting via long-poll to "+a);Rc(c.ma,a,function(){})}})};
Nc.prototype.start=function(){var a=this.ma,b=this.rd;a.Rd=this.id;a.Sd=b;for(a.vc=!0;Sc(a););a=this.id;b=this.rd;this.eb=document.createElement("iframe");var c={dframe:"t"};c.id=a;c.pw=b;this.eb.src=this.Qb(c);this.eb.style.display="none";document.body.appendChild(this.eb)};Nc.isAvailable=function(){return!Pc&&!("object"===typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))&&!("object"===typeof Windows&&"object"===typeof Windows.he)&&(Oc||!0)};h=Nc.prototype;
h.Lc=function(){};h.Mb=function(){this.Ma=!0;this.ma&&(this.ma.close(),this.ma=null);this.eb&&(document.body.removeChild(this.eb),this.eb=null);this.Ja&&(clearTimeout(this.Ja),this.Ja=null)};h.Oa=function(){this.Ma||(this.e("Longpoll is closing itself"),this.Mb(),this.T&&(this.T(this.pb),this.T=null))};h.close=function(){this.Ma||(this.e("Longpoll is being closed."),this.Mb())};
h.send=function(a){a=u(a);yc(this.aa,"bytes_sent",a.length);a=ra(a);a=Jb(a,!0);a=Yb(a,1840);for(var b=0;b<a.length;b++){var c=this.ma;c.Gb.push({ae:this.dd,fe:a.length,fd:a[b]});c.vc&&Sc(c);this.dd++}};
function Qc(a,b,c,d){this.Qb=d;this.ja=c;this.Rc=new Mc;this.Gb=[];this.Bc=Math.floor(1E8*Math.random());this.oc=!0;this.sc=Kb();window["pLPCommand"+this.sc]=a;window["pRTLPCB"+this.sc]=b;a=document.createElement("iframe");a.style.display="none";if(document.body){document.body.appendChild(a);try{a.contentWindow.document||K("No IE domain setting required")}catch(e){a.src="javascript:void((function(){document.open();document.domain='"+document.domain+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
a.contentDocument?a.Ba=a.contentDocument:a.contentWindow?a.Ba=a.contentWindow.document:a.document&&(a.Ba=a.document);this.Z=a;a="";this.Z.src&&"javascript:"===this.Z.src.substr(0,11)&&(a='<script>document.domain="'+document.domain+'";\x3c/script>');a="<html><body>"+a+"</body></html>";try{this.Z.Ba.open(),this.Z.Ba.write(a),this.Z.Ba.close()}catch(f){K("frame writing exception"),f.stack&&K(f.stack),K(f)}}
Qc.prototype.close=function(){this.vc=!1;if(this.Z){this.Z.Ba.body.innerHTML="";var a=this;setTimeout(function(){null!==a.Z&&(document.body.removeChild(a.Z),a.Z=null)},0)}var b=this.ja;b&&(this.ja=null,b())};
function Sc(a){if(a.vc&&a.oc&&a.Rc.count()<(0<a.Gb.length?2:1)){a.Bc++;var b={};b.id=a.Rd;b.pw=a.Sd;b.ser=a.Bc;for(var b=a.Qb(b),c="",d=0;0<a.Gb.length;)if(1870>=a.Gb[0].fd.length+30+c.length){var e=a.Gb.shift(),c=c+"&seg"+d+"="+e.ae+"&ts"+d+"="+e.fe+"&d"+d+"="+e.fd;d++}else break;Vc(a,b+c,a.Bc);return!0}return!1}function Vc(a,b,c){function d(){a.Rc.remove(c);Sc(a)}a.Rc.add(c);var e=setTimeout(d,25E3);Rc(a,b,function(){clearTimeout(e);d()})}
function Rc(a,b,c){setTimeout(function(){try{if(a.oc){var d=a.Z.Ba.createElement("script");d.type="text/javascript";d.async=!0;d.src=b;d.onload=d.onreadystatechange=function(){var a=d.readyState;a&&"loaded"!==a&&"complete"!==a||(d.onload=d.onreadystatechange=null,d.parentNode&&d.parentNode.removeChild(d),c())};d.onerror=function(){K("Long-poll script failed to load: "+b);a.oc=!1;a.close()};a.Z.Ba.body.appendChild(d)}}catch(e){}},1)};function Wc(a){Xc(this,a)}var Yc=[Nc,Q];function Xc(a,b){var c=Q&&Q.isAvailable(),d=c&&!(mb.nd||!0===mb.get("previous_websocket_failure"));b.ge&&(c||L("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),d=!0);if(d)a.Nb=[Q];else{var e=a.Nb=[];Zb(Yc,function(a,b){b&&b.isAvailable()&&e.push(b)})}}function Zc(a){if(0<a.Nb.length)return a.Nb[0];throw Error("No transports available");};function $c(a,b,c,d,e,f){this.id=a;this.e=Qb("c:"+this.id+":");this.Pc=c;this.Bb=d;this.T=e;this.Oc=f;this.N=b;this.fc=[];this.cd=0;this.Ad=new Wc(b);this.na=0;this.e("Connection created");ad(this)}
function ad(a){var b=Zc(a.Ad);a.K=new b("c:"+a.id+":"+a.cd++,a.N);a.Tc=b.responsesRequiredToBeHealthy||0;var c=bd(a,a.K),d=cd(a,a.K);a.Ob=a.K;a.Lb=a.K;a.w=null;a.ab=!1;setTimeout(function(){a.K&&a.K.open(c,d)},0);b=b.healthyTimeout||0;0<b&&(a.Vb=setTimeout(function(){a.Vb=null;a.ab||(a.e("Closing unhealthy connection after timeout."),a.close())},b))}
function cd(a,b){return function(c){b===a.K?(a.K=null,c||0!==a.na?1===a.na&&a.e("Realtime connection lost."):(a.e("Realtime connection failed."),"s-"===a.N.ha.substr(0,2)&&(mb.remove("host:"+a.N.host),a.N.ha=a.N.host)),a.close()):b===a.w?(a.e("Secondary connection lost."),c=a.w,a.w=null,a.Ob!==c&&a.Lb!==c||a.close()):a.e("closing an old connection")}}
function bd(a,b){return function(c){if(2!=a.na)if(b===a.Lb){var d=Xb("t",c);c=Xb("d",c);if("c"==d){if(d=Xb("t",c),"d"in c)if(c=c.d,"h"===d){var d=c.ts,e=c.v,f=c.h;a.pc=c.s;pb(a.N,f);0==a.na&&(a.K.start(),dd(a,a.K,d),"5"!==e&&L("Protocol version mismatch detected"),c=a.Ad,(c=1<c.Nb.length?c.Nb[1]:null)&&ed(a,c))}else if("n"===d){a.e("recvd end transmission on primary");a.Lb=a.w;for(c=0;c<a.fc.length;++c)a.cc(a.fc[c]);a.fc=[];fd(a)}else"s"===d?(a.e("Connection shutdown command received. Shutting down..."),
a.Oc&&(a.Oc(c),a.Oc=null),a.T=null,a.close()):"r"===d?(a.e("Reset packet received.  New host: "+c),pb(a.N,c),1===a.na?a.close():(gd(a),ad(a))):"e"===d?Rb("Server Error: "+c):"o"===d?(a.e("got pong on primary."),hd(a),id(a)):Rb("Unknown control packet command: "+d)}else"d"==d&&a.cc(c)}else if(b===a.w)if(d=Xb("t",c),c=Xb("d",c),"c"==d)"t"in c&&(c=c.t,"a"===c?jd(a):"r"===c?(a.e("Got a reset on secondary, closing it"),a.w.close(),a.Ob!==a.w&&a.Lb!==a.w||a.close()):"o"===c&&(a.e("got pong on secondary."),
a.wd--,jd(a)));else if("d"==d)a.fc.push(c);else throw Error("Unknown protocol layer: "+d);else a.e("message on old connection")}}$c.prototype.xd=function(a){kd(this,{t:"d",d:a})};function fd(a){a.Ob===a.w&&a.Lb===a.w&&(a.e("cleaning up and promoting a connection: "+a.w.Ac),a.K=a.w,a.w=null)}
function jd(a){0>=a.wd?(a.e("Secondary connection is healthy."),a.ab=!0,a.w.Lc(),a.w.start(),a.e("sending client ack on secondary"),a.w.send({t:"c",d:{t:"a",d:{}}}),a.e("Ending transmission on primary"),a.K.send({t:"c",d:{t:"n",d:{}}}),a.Ob=a.w,fd(a)):(a.e("sending ping on secondary."),a.w.send({t:"c",d:{t:"p",d:{}}}))}$c.prototype.cc=function(a){hd(this);this.Pc(a)};function hd(a){a.ab||(a.Tc--,0>=a.Tc&&(a.e("Primary connection is healthy."),a.ab=!0,a.K.Lc()))}
function ed(a,b){a.w=new b("c:"+a.id+":"+a.cd++,a.N,a.pc);a.wd=b.responsesRequiredToBeHealthy||0;a.w.open(bd(a,a.w),cd(a,a.w));setTimeout(function(){a.w&&(a.e("Timed out trying to upgrade."),a.w.close())},6E4)}function dd(a,b,c){a.e("Realtime connection established.");a.K=b;a.na=1;a.Bb&&(a.Bb(c),a.Bb=null);0===a.Tc?(a.e("Primary connection is healthy."),a.ab=!0):setTimeout(function(){id(a)},5E3)}function id(a){a.ab||1!==a.na||(a.e("sending ping on primary."),kd(a,{t:"c",d:{t:"p",d:{}}}))}
function kd(a,b){if(1!==a.na)throw"Connection is not connected";a.Ob.send(b)}$c.prototype.close=function(){2!==this.na&&(this.e("Closing realtime connection."),this.na=2,gd(this),this.T&&(this.T(),this.T=null))};function gd(a){a.e("Shutting down all connections");a.K&&(a.K.close(),a.K=null);a.w&&(a.w.close(),a.w=null);a.Vb&&(clearTimeout(a.Vb),a.Vb=null)};function ld(a,b,c,d,e,f){this.id=md++;this.e=Qb("p:"+this.id+":");this.Ra=!0;this.ia={};this.U=[];this.Db=0;this.Ab=[];this.S=!1;this.ua=1E3;this.Xb=3E5;this.dc=b||ba;this.bc=c||ba;this.zb=d||ba;this.Qc=e||ba;this.Gc=f||ba;this.N=a;this.Vc=null;this.Kb={};this.$d=0;this.vb=this.Kc=null;nd(this,0);tc.rb().fb("visible",this.Vd,this);-1===a.host.indexOf("fblocal")&&uc.rb().fb("online",this.Ud,this)}var md=0,od=0;h=ld.prototype;
h.Ga=function(a,b,c){var d=++this.$d;a={r:d,a:a,b:b};this.e(u(a));v(this.S,"sendRequest_ call when we're not connected not allowed.");this.la.xd(a);c&&(this.Kb[d]=c)};function pd(a,b,c){var d=b.toString(),e=b.path().toString();a.ia[e]=a.ia[e]||{};v(!a.ia[e][d],"listen() called twice for same path/queryId.");a.ia[e][d]={hb:b.hb(),D:c};a.S&&qd(a,e,d,b.hb(),c)}
function qd(a,b,c,d,e){a.e("Listen on "+b+" for "+c);var f={p:b};d=vb(d,function(a){return Ja(a)});"{}"!==c&&(f.q=d);f.h=a.Gc(b);a.Ga("l",f,function(d){a.e("listen response",d);d=d.s;"ok"!==d&&rd(a,b,c);e&&e(d)})}
h.mb=function(a,b,c){this.Ka={Id:a,gd:!1,ba:b,Sb:c};this.e("Authenticating using credential: "+this.Ka);sd(this);if(!(b=40==a.length))a:{var d;try{var e=a.split(".");if(3!==e.length){b=!1;break a}var f;b:{try{if("undefined"!==typeof atob){f=atob(e[1]);break b}}catch(g){K("base64DecodeIfNativeSupport failed: ",g)}f=null}null!==f&&(d=qa(f))}catch(k){K("isAdminAuthToken_ failed",k)}b="object"===typeof d&&!0===va(d,"admin")}b&&(this.e("Admin auth credential detected.  Reducing max reconnect time."),this.Xb=
3E4)};h.Pb=function(a){delete this.Ka;this.zb(!1);this.S&&this.Ga("unauth",{},function(b){a(b.s,b.d)})};function sd(a){var b=a.Ka;a.S&&b&&a.Ga("auth",{cred:b.Id},function(c){var d=c.s;c=c.d||"error";"ok"!==d&&a.Ka===b&&delete a.Ka;a.zb("ok"===d);b.gd?"ok"!==d&&b.Sb&&b.Sb(d,c):(b.gd=!0,b.ba&&b.ba(d,c))})}function td(a,b,c,d){b=b.toString();rd(a,b,c)&&a.S&&ud(a,b,c,d)}function ud(a,b,c,d){a.e("Unlisten on "+b+" for "+c);b={p:b};d=vb(d,function(a){return Ja(a)});"{}"!==c&&(b.q=d);a.Ga("u",b)}
function vd(a,b,c,d){a.S?wd(a,"o",b,c,d):a.Ab.push({Sc:b,action:"o",data:c,D:d})}function xd(a,b,c,d){a.S?wd(a,"om",b,c,d):a.Ab.push({Sc:b,action:"om",data:c,D:d})}h.Nc=function(a,b){this.S?wd(this,"oc",a,null,b):this.Ab.push({Sc:a,action:"oc",data:null,D:b})};function wd(a,b,c,d,e){c={p:c,d:d};a.e("onDisconnect "+b,c);a.Ga(b,c,function(a){e&&setTimeout(function(){e(a.s,a.d)},0)})}h.put=function(a,b,c,d){yd(this,"p",a,b,c,d)};function zd(a,b,c,d){yd(a,"m",b,c,d,void 0)}
function yd(a,b,c,d,e,f){c={p:c,d:d};n(f)&&(c.h=f);a.U.push({action:b,td:c,D:e});a.Db++;b=a.U.length-1;a.S&&Ad(a,b)}function Ad(a,b){var c=a.U[b].action,d=a.U[b].td,e=a.U[b].D;a.U[b].Xd=a.S;a.Ga(c,d,function(d){a.e(c+" response",d);delete a.U[b];a.Db--;0===a.Db&&(a.U=[]);e&&e(d.s,d.d)})}
h.cc=function(a){if("r"in a){this.e("from server: "+u(a));var b=a.r,c=this.Kb[b];c&&(delete this.Kb[b],c(a.b))}else{if("error"in a)throw"A server-side error has occurred: "+a.error;"a"in a&&(b=a.a,c=a.b,this.e("handleServerMessage",b,c),"d"===b?this.dc(c.p,c.d,!1):"m"===b?this.dc(c.p,c.d,!0):"c"===b?Bd(this,c.p,c.q):"ac"===b?(a=c.s,b=c.d,c=this.Ka,delete this.Ka,c&&c.Sb&&c.Sb(a,b),this.zb(!1)):"sd"===b?this.Vc?this.Vc(c):"msg"in c&&"undefined"!==typeof console&&console.log("FIREBASE: "+c.msg.replace("\n",
"\nFIREBASE: ")):Rb("Unrecognized action received from server: "+u(b)+"\nAre you using the latest client?"))}};h.Bb=function(a){this.e("connection ready");this.S=!0;this.vb=(new Date).getTime();this.Qc({serverTimeOffset:a-(new Date).getTime()});sd(this);for(var b in this.ia)for(var c in this.ia[b])a=this.ia[b][c],qd(this,b,c,a.hb,a.D);for(b=0;b<this.U.length;b++)this.U[b]&&Ad(this,b);for(;this.Ab.length;)b=this.Ab.shift(),wd(this,b.action,b.Sc,b.data,b.D);this.bc(!0)};
function nd(a,b){v(!a.la,"Scheduling a connect when we're already connected/ing?");a.Xa&&clearTimeout(a.Xa);a.Xa=setTimeout(function(){a.Xa=null;Cd(a)},b)}h.Vd=function(a){a&&!this.lb&&this.ua===this.Xb&&(this.e("Window became visible.  Reducing delay."),this.ua=1E3,this.la||nd(this,0));this.lb=a};h.Ud=function(a){a?(this.e("Browser went online.  Reconnecting."),this.ua=1E3,this.Ra=!0,this.la||nd(this,0)):(this.e("Browser went offline.  Killing connection; don't reconnect."),this.Ra=!1,this.la&&this.la.close())};
h.pd=function(){this.e("data client disconnected");this.S=!1;this.la=null;for(var a=0;a<this.U.length;a++){var b=this.U[a];b&&"h"in b.td&&b.Xd&&(b.D&&b.D("disconnect"),delete this.U[a],this.Db--)}0===this.Db&&(this.U=[]);if(this.Ra)this.lb?this.vb&&(3E4<(new Date).getTime()-this.vb&&(this.ua=1E3),this.vb=null):(this.e("Window isn't visible.  Delaying reconnect."),this.ua=this.Xb,this.Kc=(new Date).getTime()),a=Math.max(0,this.ua-((new Date).getTime()-this.Kc)),a*=Math.random(),this.e("Trying to reconnect in "+
a+"ms"),nd(this,a),this.ua=Math.min(this.Xb,1.3*this.ua);else for(var c in this.Kb)delete this.Kb[c];this.bc(!1)};function Cd(a){if(a.Ra){a.e("Making a connection attempt");a.Kc=(new Date).getTime();a.vb=null;var b=r(a.cc,a),c=r(a.Bb,a),d=r(a.pd,a),e=a.id+":"+od++;a.la=new $c(e,a.N,b,c,d,function(b){L(b+" ("+a.N.toString()+")");a.Ra=!1})}}h.La=function(){this.Ra=!1;this.la?this.la.close():(this.Xa&&(clearTimeout(this.Xa),this.Xa=null),this.S&&this.pd())};
h.jb=function(){this.Ra=!0;this.ua=1E3;this.S||nd(this,0)};function Bd(a,b,c){c=c?vb(c,function(a){return Ka(a)}).join("$"):"{}";(a=rd(a,b,c))&&a.D&&a.D("permission_denied")}function rd(a,b,c){b=(new F(b)).toString();c||(c="{}");var d=a.ia[b][c];delete a.ia[b][c];return d};function Dd(){this.o=this.F=null}function Ed(a,b,c){if(b.f())a.F=c,a.o=null;else if(null!==a.F)a.F=a.F.Aa(b,c);else{null==a.o&&(a.o=new Mc);var d=C(b);a.o.contains(d)||a.o.add(d,new Dd);a=a.o.get(d);b=La(b);Ed(a,b,c)}}function Fd(a,b){if(b.f())return a.F=null,a.o=null,!0;if(null!==a.F){if(a.F.P())return!1;var c=a.F;a.F=null;c.A(function(b,c){Ed(a,new F(b),c)});return Fd(a,b)}return null!==a.o?(c=C(b),b=La(b),a.o.contains(c)&&Fd(a.o.get(c),b)&&a.o.remove(c),a.o.f()?(a.o=null,!0):!1):!0}
function Gd(a,b,c){null!==a.F?c(b,a.F):a.A(function(a,e){var f=new F(b.toString()+"/"+a);Gd(e,f,c)})}Dd.prototype.A=function(a){null!==this.o&&R(this.o,function(b,c){a(b,c)})};function Hd(){this.$=M}function S(a,b){return a.$.L(b)}function T(a,b,c){a.$=a.$.Aa(b,c)}Hd.prototype.toString=function(){return this.$.toString()};function Id(){this.va=new Hd;this.M=new Hd;this.pa=new Hd;this.Fb=new Pa}function Jd(a,b,c){T(a.va,b,c);return Kd(a,b)}function Kd(a,b){for(var c=S(a.va,b),d=S(a.M,b),e=I(a.Fb,b),f=!1,g=e;null!==g;){if(null!==g.j()){f=!0;break}g=g.parent()}if(f)return!1;c=Ld(c,d,e);return c!==d?(T(a.M,b,c),!0):!1}function Ld(a,b,c){if(c.f())return a;if(null!==c.j())return b;a=a||M;c.A(function(d){d=d.name();var e=a.O(d),f=b.O(d),g=I(c,d),e=Ld(e,f,g);a=a.H(d,e)});return a}
Id.prototype.set=function(a,b){var c=this,d=[];ub(b,function(a){var b=a.path;a=a.ta;var g=Kb();J(I(c.Fb,b),g);T(c.M,b,a);d.push({path:b,be:g})});return d};function Md(a,b){ub(b,function(b){var d=b.be;b=I(a.Fb,b.path);var e=b.j();v(null!==e,"pendingPut should not be null.");e===d&&J(b,null)})};function Nd(a,b){return a&&"object"===typeof a?(v(".sv"in a,"Unexpected leaf node or priority contents"),b[a[".sv"]]):a}function Od(a,b){var c=new Dd;Gd(a,new F(""),function(a,e){Ed(c,a,Pd(e,b))});return c}function Pd(a,b){var c=Nd(a.k(),b),d;if(a.P()){var e=Nd(a.j(),b);return e!==a.j()||c!==a.k()?new fc(e,c):a}d=a;c!==a.k()&&(d=d.Ia(c));a.A(function(a,c){var e=Pd(c,b);e!==c&&(d=d.H(a,e))});return d};function Qd(){this.Ya=[]}function Rd(a,b){if(0!==b.length)for(var c=0;c<b.length;c++)a.Ya.push(b[c])}Qd.prototype.Ib=function(){for(var a=0;a<this.Ya.length;a++)if(this.Ya[a]){var b=this.Ya[a];this.Ya[a]=null;Sd(b)}this.Ya=[]};function Sd(a){var b=a.ba,c=a.yd,d=a.Hb;ec(function(){b(c,d)})};function U(a,b,c,d){this.type=a;this.wa=b;this.ca=c;this.Hb=d};function Td(a){this.R=a;this.ra=[];this.Dc=new Qd}function Ud(a,b,c,d,e){a.ra.push({type:b,ba:c,cancel:d,Y:e});d=[];var f=Vd(a.i);a.tb&&f.push(new U("value",a.i));for(var g=0;g<f.length;g++)if(f[g].type===b){var k=new E(a.R.m,a.R.path);f[g].ca&&(k=k.G(f[g].ca));d.push({ba:ac(c,e),yd:new P(f[g].wa,k),Hb:f[g].Hb})}Rd(a.Dc,d)}Td.prototype.ic=function(a,b){b=this.jc(a,b);null!=b&&Wd(this,b)};
function Wd(a,b){for(var c=[],d=0;d<b.length;d++){var e=b[d],f=e.type,g=new E(a.R.m,a.R.path);b[d].ca&&(g=g.G(b[d].ca));g=new P(b[d].wa,g);"value"!==e.type||g.sb()?"value"!==e.type&&(f+=" "+g.name()):f+="("+g.V()+")";K(a.R.m.u.id+": event:"+a.R.path+":"+a.R.Pa()+":"+f);for(f=0;f<a.ra.length;f++){var k=a.ra[f];b[d].type===k.type&&c.push({ba:ac(k.ba,k.Y),yd:g,Hb:e.Hb})}}Rd(a.Dc,c)}Td.prototype.Ib=function(){this.Dc.Ib()};
function Vd(a){var b=[];if(!a.P()){var c=null;a.A(function(a,e){b.push(new U("child_added",e,a,c));c=a})}return b}function Xd(a){a.tb||(a.tb=!0,Wd(a,[new U("value",a.i)]))};function Yd(a,b){Td.call(this,a);this.i=b}ja(Yd,Td);Yd.prototype.jc=function(a,b){this.i=a;this.tb&&null!=b&&b.push(new U("value",this.i));return b};Yd.prototype.qb=function(){return{}};function Zd(a,b){this.Tb=a;this.Mc=b}function $d(a,b,c,d,e){var f=a.L(c),g=b.L(c);d=new Zd(d,e);e=ae(d,c,f,g);g=!f.f()&&!g.f()&&f.k()!==g.k();if(e||g)for(f=c,c=e;null!==f.parent();){var k=a.L(f);e=b.L(f);var l=f.parent();if(!d.Tb||I(d.Tb,l).j()){var m=b.L(l),p=[],f=Ma(f);k.f()?(k=m.ga(f,e),p.push(new U("child_added",e,f,k))):e.f()?p.push(new U("child_removed",k,f)):(k=m.ga(f,e),g&&p.push(new U("child_moved",e,f,k)),c&&p.push(new U("child_changed",e,f,k)));d.Mc(l,m,p)}g&&(g=!1,c=!0);f=l}}
function ae(a,b,c,d){var e,f=[];c===d?e=!1:c.P()&&d.P()?e=c.j()!==d.j():c.P()?(be(a,b,M,d,f),e=!0):d.P()?(be(a,b,c,M,f),e=!0):e=be(a,b,c,d,f);e?a.Mc(b,d,f):c.k()!==d.k()&&a.Mc(b,d,null);return e}
function be(a,b,c,d,e){var f=!1,g=!a.Tb||!I(a.Tb,b).f(),k=[],l=[],m=[],p=[],t={},s={},w,V,G,H;w=c.Za();G=Ya(w);V=d.Za();for(H=Ya(V);null!==G||null!==H;){c=H;c=null===G?1:null===c?-1:G.key===c.key?0:ic({name:G.key,ka:G.value.k()},{name:c.key,ka:c.value.k()});if(0>c)f=va(t,G.key),n(f)?(m.push({Fc:G,$c:k[f]}),k[f]=null):(s[G.key]=l.length,l.push(G)),f=!0,G=Ya(w);else{if(0<c)f=va(s,H.key),n(f)?(m.push({Fc:l[f],$c:H}),l[f]=null):(t[H.key]=k.length,k.push(H)),f=!0;else{c=b.G(H.key);if(c=ae(a,c,G.value,
H.value))p.push(H),f=!0;G.value.k()!==H.value.k()&&(m.push({Fc:G,$c:H}),f=!0);G=Ya(w)}H=Ya(V)}if(!g&&f)return!0}for(g=0;g<l.length;g++)if(t=l[g])c=b.G(t.key),ae(a,c,t.value,M),e.push(new U("child_removed",t.value,t.key));for(g=0;g<k.length;g++)if(t=k[g])c=b.G(t.key),l=d.ga(t.key,t.value),ae(a,c,M,t.value),e.push(new U("child_added",t.value,t.key,l));for(g=0;g<m.length;g++)t=m[g].Fc,k=m[g].$c,c=b.G(k.key),l=d.ga(k.key,k.value),e.push(new U("child_moved",k.value,k.key,l)),(c=ae(a,c,t.value,k.value))&&
p.push(k);for(g=0;g<p.length;g++)a=p[g],l=d.ga(a.key,a.value),e.push(new U("child_changed",a.value,a.key,l));return f};function ce(){this.X=this.za=null;this.set={}}ja(ce,Mc);h=ce.prototype;h.setActive=function(a){this.za=a};function de(a,b,c){a.add(b,c);a.X||(a.X=c.R.path)}function ee(a){var b=a.za;a.za=null;return b}function fe(a){return a.contains("default")}function ge(a){return null!=a.za&&fe(a)}h.defaultView=function(){return fe(this)?this.get("default"):null};h.path=function(){return this.X};h.toString=function(){return vb(this.keys(),function(a){return"default"===a?"{}":a}).join("$")};
h.hb=function(){var a=[];R(this,function(b,c){a.push(c.R)});return a};function he(a,b){Td.call(this,a);this.i=M;this.jc(b,Vd(b))}ja(he,Td);
he.prototype.jc=function(a,b){if(null===b)return b;var c=[],d=this.R;n(d.fa)&&(n(d.ya)&&null!=d.ya?c.push(function(a,b){var c=Ub(b,d.fa);return 0<c||0===c&&0<=Vb(a,d.ya)}):c.push(function(a,b){return 0<=Ub(b,d.fa)}));n(d.Ca)&&(n(d.Wa)?c.push(function(a,b){var c=Ub(b,d.Ca);return 0>c||0===c&&0>=Vb(a,d.Wa)}):c.push(function(a,b){return 0>=Ub(b,d.Ca)}));var e=null,f=null;if(n(this.R.Ea))if(n(this.R.fa)){if(e=ie(a,c,this.R.Ea,!1)){var g=a.O(e).k();c.push(function(a,b){var c=Ub(b,g);return 0>c||0===c&&
0>=Vb(a,e)})}}else if(f=ie(a,c,this.R.Ea,!0)){var k=a.O(f).k();c.push(function(a,b){var c=Ub(b,k);return 0<c||0===c&&0<=Vb(a,f)})}for(var l=[],m=[],p=[],t=[],s=0;s<b.length;s++){var w=b[s].ca,V=b[s].wa;switch(b[s].type){case "child_added":je(c,w,V)&&(this.i=this.i.H(w,V),m.push(b[s]));break;case "child_removed":this.i.O(w).f()||(this.i=this.i.H(w,null),l.push(b[s]));break;case "child_changed":!this.i.O(w).f()&&je(c,w,V)&&(this.i=this.i.H(w,V),t.push(b[s]));break;case "child_moved":var G=!this.i.O(w).f(),
H=je(c,w,V);G?H?(this.i=this.i.H(w,V),p.push(b[s])):(l.push(new U("child_removed",this.i.O(w),w)),this.i=this.i.H(w,null)):H&&(this.i=this.i.H(w,V),m.push(b[s]))}}var Tc=e||f;if(Tc){var Uc=(s=null!==f)?this.i.hd():this.i.kd(),hc=!1,$a=!1,ab=this;(s?a.Ec:a.A).call(a,function(a,b){$a||null!==Uc||($a=!0);if($a&&hc)return!0;hc?(l.push(new U("child_removed",ab.i.O(a),a)),ab.i=ab.i.H(a,null)):$a&&(m.push(new U("child_added",b,a)),ab.i=ab.i.H(a,b));Uc===a&&($a=!0);a===Tc&&(hc=!0)})}for(s=0;s<m.length;s++)c=
m[s],w=this.i.ga(c.ca,c.wa),l.push(new U("child_added",c.wa,c.ca,w));for(s=0;s<p.length;s++)c=p[s],w=this.i.ga(c.ca,c.wa),l.push(new U("child_moved",c.wa,c.ca,w));for(s=0;s<t.length;s++)c=t[s],w=this.i.ga(c.ca,c.wa),l.push(new U("child_changed",c.wa,c.ca,w));this.tb&&0<l.length&&l.push(new U("value",this.i));return l};function ie(a,b,c,d){if(a.P())return null;var e=null;(d?a.Ec:a.A).call(a,function(a,d){if(je(b,a,d)&&(e=a,c--,0===c))return!0});return e}
function je(a,b,c){for(var d=0;d<a.length;d++)if(!a[d](b,c.k()))return!1;return!0}he.prototype.Hc=function(a){return this.i.O(a)!==M};
he.prototype.qb=function(a,b,c){var d={};this.i.P()||this.i.A(function(a){d[a]=3});var e=this.i;c=S(c,new F(""));var f=new Pa;J(I(f,this.R.path),!0);b=M.Aa(a,b);var g=this;$d(c,b,a,f,function(a,b,c){null!==c&&a.toString()===g.R.path.toString()&&g.jc(b,c)});this.i.P()?$b(d,function(a,b){d[b]=2}):(this.i.A(function(a){A(d,a)||(d[a]=1)}),$b(d,function(a,b){g.i.O(b).f()&&(d[b]=2)}));this.i=e;return d};function ke(a,b){this.u=a;this.g=b;this.ac=b.$;this.oa=new Pa}ke.prototype.Rb=function(a,b,c,d,e){var f=a.path,g=I(this.oa,f),k=g.j();null===k?(k=new ce,J(g,k)):v(!k.f(),"We shouldn't be storing empty QueryMaps");var l=a.Pa();if(k.contains(l))a=k.get(l),Ud(a,b,c,d,e);else{var m=this.g.$.L(f);a=le(a,m);me(this,g,k,l,a);Ud(a,b,c,d,e);(b=(b=Sa(I(this.oa,f),function(a){var b;if(b=a.j()&&a.j().defaultView())b=a.j().defaultView().tb;if(b)return!0},!0))||null===this.u&&!S(this.g,f).f())&&Xd(a)}a.Ib()};
function ne(a,b,c,d,e){var f=a.get(b),g;if(g=f){g=!1;for(var k=f.ra.length-1;0<=k;k--){var l=f.ra[k];if(!(c&&l.type!==c||d&&l.ba!==d||e&&l.Y!==e)&&(f.ra.splice(k,1),g=!0,c&&d))break}}(c=g&&!(0<f.ra.length))&&a.remove(b);return c}function oe(a,b,c,d,e){b=b?b.Pa():null;var f=[];b&&"default"!==b?ne(a,b,c,d,e)&&f.push(b):ub(a.keys(),function(b){ne(a,b,c,d,e)&&f.push(b)});return f}ke.prototype.lc=function(a,b,c,d){var e=I(this.oa,a.path).j();return null===e?null:pe(this,e,a,b,c,d)};
function pe(a,b,c,d,e,f){var g=b.path(),g=I(a.oa,g);c=oe(b,c,d,e,f);b.f()&&J(g,null);d=qe(g);if(0<c.length&&!d){d=g;e=g.parent();for(c=!1;!c&&e;){if(f=e.j()){v(!ge(f));var k=d.name(),l=!1;R(f,function(a,b){l=b.Hc(k)||l});l&&(c=!0)}d=e;e=e.parent()}d=null;ge(b)||(b=ee(b),d=re(a,g),b&&b());return c?null:d}return null}function se(a,b,c){Ra(I(a.oa,b),function(a){(a=a.j())&&R(a,function(a,b){Xd(b)})},c,!0)}
function W(a,b,c){function d(a){do{if(g[a.toString()])return!0;a=a.parent()}while(null!==a);return!1}var e=a.ac,f=a.g.$;a.ac=f;for(var g={},k=0;k<c.length;k++)g[c[k].toString()]=!0;$d(e,f,b,a.oa,function(c,e,f){if(b.contains(c)){var g=d(c);g&&se(a,c,!1);a.ic(c,e,f);g&&se(a,c,!0)}else a.ic(c,e,f)});d(b)&&se(a,b,!0);te(a,b)}function te(a,b){var c=I(a.oa,b);Ra(c,function(a){(a=a.j())&&R(a,function(a,b){b.Ib()})},!0,!0);Sa(c,function(a){(a=a.j())&&R(a,function(a,b){b.Ib()})},!1)}
ke.prototype.ic=function(a,b,c){a=I(this.oa,a).j();null!==a&&R(a,function(a,e){e.ic(b,c)})};function qe(a){return Sa(a,function(a){return a.j()&&ge(a.j())})}function me(a,b,c,d,e){if(ge(c)||qe(b))de(c,d,e);else{var f,g;c.f()||(f=c.toString(),g=c.hb());de(c,d,e);c.setActive(ue(a,c));f&&g&&td(a.u,c.path(),f,g)}ge(c)&&Ra(b,function(a){if(a=a.j())a.za&&a.za(),a.za=null})}
function re(a,b){function c(b){var f=b.j();if(f&&fe(f))d.push(f.path()),null==f.za&&f.setActive(ue(a,f));else{if(f){null!=f.za||f.setActive(ue(a,f));var g={};R(f,function(a,b){b.i.A(function(a){A(g,a)||(g[a]=!0,a=f.path().G(a),d.push(a))})})}b.A(c)}}var d=[];c(b);return d}
function ue(a,b){if(a.u){var c=a.u,d=b.path(),e=b.toString(),f=b.hb(),g,k=b.keys(),l=fe(b);pd(a.u,b,function(c){"ok"!==c?(c=cc(c),L("on() or once() for "+b.path().toString()+" failed: "+c.toString()),ve(a,b,c)):g||(l?se(a,b.path(),!0):ub(k,function(a){(a=b.get(a))&&Xd(a)}),te(a,b.path()))});return function(){g=!0;td(c,d,e,f)}}return ba}function ve(a,b,c){b&&(R(b,function(a,b){for(var f=0;f<b.ra.length;f++){var g=b.ra[f];g.cancel&&ac(g.cancel,g.Y)(c)}}),pe(a,b))}
function le(a,b){return"default"===a.Pa()?new Yd(a,b):new he(a,b)}ke.prototype.qb=function(a,b,c,d){function e(a){$b(a,function(a,b){f[b]=3===a?3:(va(f,b)||a)===a?a:3})}var f={};R(b,function(b,f){e(f.qb(a,c,d))});c.P()||c.A(function(a){A(f,a)||(f[a]=4)});return f};function we(a,b,c,d,e){var f=b.path();b=a.qb(f,b,d,e);var g=M,k=[];$b(b,function(b,m){var p=new F(m);3===b||1===b?g=g.H(m,d.L(p)):(2===b&&k.push({path:f.G(m),ta:M}),k=k.concat(xe(a,d.L(p),I(c,p),e)))});return[{path:f,ta:g}].concat(k)}
function ye(a,b,c,d){var e;a:{var f=I(a.oa,b);e=f.parent();for(var g=[];null!==e;){var k=e.j();if(null!==k){if(fe(k)){e=[{path:b,ta:c}];break a}k=a.qb(b,k,c,d);f=va(k,f.name());if(3===f||1===f){e=[{path:b,ta:c}];break a}2===f&&g.push({path:b,ta:M})}f=e;e=e.parent()}e=g}if(1==e.length&&(!e[0].ta.f()||c.f()))return e;g=I(a.oa,b);f=g.j();null!==f?fe(f)?e.push({path:b,ta:c}):e=e.concat(we(a,f,g,c,d)):e=e.concat(xe(a,c,g,d));return e}
function xe(a,b,c,d){var e=c.j();if(null!==e)return fe(e)?[{path:c.path(),ta:b}]:we(a,e,c,b,d);var f=[];c.A(function(c){var e=b.P()?M:b.O(c.name());c=xe(a,e,c,d);f=f.concat(c)});return f};function ze(a){this.N=a;this.aa=Dc(a);this.u=new ld(this.N,r(this.dc,this),r(this.bc,this),r(this.zb,this),r(this.Qc,this),r(this.Gc,this));this.zd=Ec(a,r(function(){return new Ac(this.aa,this.u)},this));this.Sa=new Pa;this.Ha=new Hd;this.g=new Id;this.I=new ke(this.u,this.g.pa);this.Ic=new Hd;this.Jc=new ke(null,this.Ic);Ae(this,"connected",!1);Ae(this,"authenticated",!1);this.T=new Dd;this.Cc=0}h=ze.prototype;h.toString=function(){return(this.N.nc?"https://":"http://")+this.N.host};h.name=function(){return this.N.Yb};
function Be(a){a=S(a.Ic,new F(".info/serverTimeOffset")).V()||0;return(new Date).getTime()+a}function Ce(a){a=a={timestamp:Be(a)};a.timestamp=a.timestamp||(new Date).getTime();return a}
h.dc=function(a,b,c){this.Cc++;this.md&&(b=this.md(a,b));var d,e,f=[];9<=a.length&&a.lastIndexOf(".priority")===a.length-9?(d=new F(a.substring(0,a.length-9)),e=S(this.g.va,d).Ia(b),f.push(d)):c?(d=new F(a),e=S(this.g.va,d),$b(b,function(a,b){var c=new F(b);".priority"===b?e=e.Ia(a):(e=e.Aa(c,O(a)),f.push(d.G(b)))})):(d=new F(a),e=O(b),f.push(d));a=ye(this.I,d,e,this.g.M);b=!1;for(c=0;c<a.length;++c){var g=a[c];b=Jd(this.g,g.path,g.ta)||b}b&&(d=De(this,d));W(this.I,d,f)};
h.bc=function(a){Ae(this,"connected",a);!1===a&&Ee(this)};h.Qc=function(a){var b=this;Zb(a,function(a,d){Ae(b,d,a)})};h.Gc=function(a){a=new F(a);return S(this.g.va,a).hash()};h.zb=function(a){Ae(this,"authenticated",a)};function Ae(a,b,c){b=new F("/.info/"+b);T(a.Ic,b,O(c));W(a.Jc,b,[b])}
h.mb=function(a,b,c){"firebaseio-demo.com"===this.N.domain&&L("FirebaseRef.auth() not supported on demo (*.firebaseio-demo.com) Firebases. Please use on production (*.firebaseio.com) Firebases only.");this.u.mb(a,function(a,c){X(b,a,c)},function(a,b){L("auth() was canceled: "+b);if(c){var f=Error(b);f.code=a.toUpperCase();c(f)}})};h.Pb=function(a){this.u.Pb(function(b,c){X(a,b,c)})};
h.kb=function(a,b,c,d){this.e("set",{path:a.toString(),value:b,ka:c});var e=Ce(this);b=O(b,c);var e=Pd(b,e),e=ye(this.I,a,e,this.g.M),f=this.g.set(a,e),g=this;this.u.put(a.toString(),b.V(!0),function(b,c){"ok"!==b&&L("set at "+a+" failed: "+b);Md(g.g,f);Kd(g.g,a);var e=De(g,a);W(g.I,e,[]);X(d,b,c)});e=Fe(this,a);De(this,e);W(this.I,e,[a])};
h.update=function(a,b,c){this.e("update",{path:a.toString(),value:b});var d=S(this.g.pa,a),e=!0,f=[],g=Ce(this),k=[],l;for(l in b){var e=!1,m=O(b[l]),m=Pd(m,g),d=d.H(l,m),p=a.G(l);f.push(p);m=ye(this.I,p,m,this.g.M);k=k.concat(this.g.set(a,m))}if(e)K("update() called with empty data.  Don't do anything."),X(c,"ok");else{var t=this;zd(this.u,a.toString(),b,function(b,d){v("ok"===b||"permission_denied"===b,"merge at "+a+" failed.");"ok"!==b&&L("update at "+a+" failed: "+b);Md(t.g,k);Kd(t.g,a);var e=
De(t,a);W(t.I,e,[]);X(c,b,d)});b=Fe(this,a);De(this,b);W(t.I,b,f)}};h.Wc=function(a,b,c){this.e("setPriority",{path:a.toString(),ka:b});var d=Ce(this),d=Nd(b,d),d=S(this.g.M,a).Ia(d),d=ye(this.I,a,d,this.g.M),e=this.g.set(a,d),f=this;this.u.put(a.toString()+"/.priority",b,function(b,d){"permission_denied"===b&&L("setPriority at "+a+" failed: "+b);Md(f.g,e);Kd(f.g,a);var l=De(f,a);W(f.I,l,[]);X(c,b,d)});b=De(this,a);W(f.I,b,[])};
function Ee(a){a.e("onDisconnectEvents");var b=[],c=Ce(a);Gd(Od(a.T,c),new F(""),function(c,e){var f=ye(a.I,c,e,a.g.M);b.push.apply(b,a.g.set(c,f));f=Fe(a,c);De(a,f);W(a.I,f,[c])});Md(a.g,b);a.T=new Dd}h.Nc=function(a,b){var c=this;this.u.Nc(a.toString(),function(d,e){"ok"===d&&Fd(c.T,a);X(b,d,e)})};function Ge(a,b,c,d){var e=O(c);vd(a.u,b.toString(),e.V(!0),function(c,g){"ok"===c&&Ed(a.T,b,e);X(d,c,g)})}
function He(a,b,c,d,e){var f=O(c,d);vd(a.u,b.toString(),f.V(!0),function(c,d){"ok"===c&&Ed(a.T,b,f);X(e,c,d)})}function Ie(a,b,c,d){var e=!0,f;for(f in c)e=!1;e?(K("onDisconnect().update() called with empty data.  Don't do anything."),X(d,"ok")):xd(a.u,b.toString(),c,function(e,f){if("ok"===e)for(var l in c){var m=O(c[l]);Ed(a.T,b.G(l),m)}X(d,e,f)})}function Je(a){yc(a.aa,"deprecated_on_disconnect");a.zd.Zc.deprecated_on_disconnect=!0}
h.Rb=function(a,b,c,d,e){".info"===C(a.path)?this.Jc.Rb(a,b,c,d,e):this.I.Rb(a,b,c,d,e)};h.lc=function(a,b,c,d){if(".info"===C(a.path))this.Jc.lc(a,b,c,d);else{b=this.I.lc(a,b,c,d);if(c=null!==b){c=this.g;d=a.path;for(var e=[],f=0;f<b.length;++f)e[f]=S(c.va,b[f]);T(c.va,d,M);for(f=0;f<b.length;++f)T(c.va,b[f],e[f]);c=Kd(c,d)}c&&(v(this.g.pa.$===this.I.ac,"We should have raised any outstanding events by now.  Else, we'll blow them away."),T(this.g.pa,a.path,S(this.g.M,a.path)),this.I.ac=this.g.pa.$)}};
h.La=function(){this.u.La()};h.jb=function(){this.u.jb()};h.Xc=function(a){if("undefined"!==typeof console){a?(this.qc||(this.qc=new zc(this.aa)),a=this.qc.get()):a=this.aa.get();var b=wb(vc(a),function(a,b){return Math.max(b.length,a)},0),c;for(c in a){for(var d=a[c],e=c.length;e<b+2;e++)c+=" ";console.log(c+d)}}};h.Yc=function(a){yc(this.aa,a);this.zd.Zc[a]=!0};h.e=function(){K("r:"+this.u.id+":",arguments)};
function X(a,b,c){a&&ec(function(){if("ok"==b)a(null,c);else{var d=(b||"error").toUpperCase(),e=d;c&&(e+=": "+c);e=Error(e);e.code=d;a(e)}})};function Ke(a,b,c,d,e){function f(){}a.e("transaction on "+b);var g=new E(a,b);g.fb("value",f);c={path:b,update:c,D:d,status:null,qd:Kb(),wc:e,vd:0,tc:function(){g.yb("value",f)},uc:null};a.Ha.$=Le(a,a.Ha.$,a.g.M.$,a.Sa);d=c.update(S(a.Ha,b).V());if(n(d)){Aa("transaction failed: Data returned ",d);c.status=1;e=I(a.Sa,b);var k=e.j()||[];k.push(c);J(e,k);k="object"===typeof d&&null!==d&&A(d,".priority")?d[".priority"]:S(a.g.M,b).k();e=Ce(a);d=O(d,k);d=Pd(d,e);T(a.Ha,b,d);c.wc&&(T(a.g.pa,b,d),W(a.I,
b,[b]));Me(a)}else c.tc(),c.D&&(a=Ne(a,b),c.D(null,!1,a))}function Me(a,b){var c=b||a.Sa;b||Oe(a,c);if(null!==c.j()){var d=Pe(a,c);v(0<d.length);xb(d,function(a){return 1===a.status})&&Qe(a,c.path(),d)}else c.sb()&&c.A(function(b){Me(a,b)})}
function Qe(a,b,c){for(var d=0;d<c.length;d++)v(1===c[d].status,"tryToSendTransactionQueue_: items in queue should all be run."),c[d].status=2,c[d].vd++;var e=S(a.g.M,b).hash();T(a.g.M,b,S(a.g.pa,b));for(var f=S(a.Ha,b).V(!0),g=Kb(),k=Re(c),d=0;d<k.length;d++)J(I(a.g.Fb,k[d]),g);a.u.put(b.toString(),f,function(e){a.e("transaction put response",{path:b.toString(),status:e});for(d=0;d<k.length;d++){var f=I(a.g.Fb,k[d]),p=f.j();v(null!==p,"sendTransactionQueue_: pendingPut should not be null.");p===
g&&(J(f,null),T(a.g.M,k[d],S(a.g.va,k[d])))}if("ok"===e){e=[];for(d=0;d<c.length;d++)c[d].status=3,c[d].D&&(f=Ne(a,c[d].path),e.push(r(c[d].D,null,null,!0,f))),c[d].tc();Oe(a,I(a.Sa,b));Me(a);for(d=0;d<e.length;d++)ec(e[d])}else{if("datastale"===e)for(d=0;d<c.length;d++)c[d].status=4===c[d].status?5:1;else for(L("transaction at "+b+" failed: "+e),d=0;d<c.length;d++)c[d].status=5,c[d].uc=e;e=De(a,b);W(a.I,e,[b])}},e)}
function Re(a){for(var b={},c=0;c<a.length;c++)a[c].wc&&(b[a[c].path.toString()]=a[c].path);a=[];for(var d in b)a.push(b[d]);return a}
function De(a,b){var c=Se(a,b),d=c.path(),c=Pe(a,c);T(a.g.pa,d,S(a.g.M,d));T(a.Ha,d,S(a.g.M,d));if(0!==c.length){for(var e=S(a.g.pa,d),f=e,g=[],k=0;k<c.length;k++){var l=Na(d,c[k].path),m=!1,p;v(null!==l,"rerunTransactionsUnderNode_: relativePath should not be null.");if(5===c[k].status)m=!0,p=c[k].uc;else if(1===c[k].status)if(25<=c[k].vd)m=!0,p="maxretry";else{var t=e.L(l),s=c[k].update(t.V());if(n(s)){Aa("transaction failed: Data returned ",s);var w=O(s);"object"===typeof s&&null!=s&&A(s,".priority")||
(w=w.Ia(t.k()));e=e.Aa(l,w);c[k].wc&&(f=f.Aa(l,w))}else m=!0,p="nodata"}m&&(c[k].status=3,setTimeout(c[k].tc,0),c[k].D&&(m=new E(a,c[k].path),l=new P(e.L(l),m),"nodata"===p?g.push(r(c[k].D,null,null,!1,l)):g.push(r(c[k].D,null,Error(p),!1,l))))}T(a.Ha,d,e);T(a.g.pa,d,f);Oe(a,a.Sa);for(k=0;k<g.length;k++)ec(g[k]);Me(a)}return d}function Se(a,b){for(var c,d=a.Sa;null!==(c=C(b))&&null===d.j();)d=I(d,c),b=La(b);return d}
function Pe(a,b){var c=[];Te(a,b,c);c.sort(function(a,b){return a.qd-b.qd});return c}function Te(a,b,c){var d=b.j();if(null!==d)for(var e=0;e<d.length;e++)c.push(d[e]);b.A(function(b){Te(a,b,c)})}function Oe(a,b){var c=b.j();if(c){for(var d=0,e=0;e<c.length;e++)3!==c[e].status&&(c[d]=c[e],d++);c.length=d;J(b,0<c.length?c:null)}b.A(function(b){Oe(a,b)})}function Fe(a,b){var c=Se(a,b).path(),d=I(a.Sa,b);Sa(d,function(a){Ue(a)});Ue(d);Ra(d,function(a){Ue(a)});return c}
function Ue(a){var b=a.j();if(null!==b){for(var c=[],d=-1,e=0;e<b.length;e++)4!==b[e].status&&(2===b[e].status?(v(d===e-1,"All SENT items should be at beginning of queue."),d=e,b[e].status=4,b[e].uc="set"):(v(1===b[e].status),b[e].tc(),b[e].D&&c.push(r(b[e].D,null,Error("set"),!1,null))));-1===d?J(a,null):b.length=d+1;for(e=0;e<c.length;e++)ec(c[e])}}function Ne(a,b){var c=new E(a,b);return new P(S(a.Ha,b),c)}
function Le(a,b,c,d){if(d.f())return c;if(null!=d.j())return b;var e=c;d.A(function(d){var g=d.name(),k=new F(g);d=Le(a,b.L(k),c.L(k),d);e=e.H(g,d)});return e};function Y(){this.ib={}}ca(Y);Y.prototype.La=function(){for(var a in this.ib)this.ib[a].La()};Y.prototype.interrupt=Y.prototype.La;Y.prototype.jb=function(){for(var a in this.ib)this.ib[a].jb()};Y.prototype.resume=Y.prototype.jb;var Z={Nd:function(a){var b=N.prototype.hash;N.prototype.hash=a;var c=fc.prototype.hash;fc.prototype.hash=a;return function(){N.prototype.hash=b;fc.prototype.hash=c}}};Z.hijackHash=Z.Nd;Z.Pa=function(a){return a.Pa()};Z.queryIdentifier=Z.Pa;Z.Qd=function(a){return a.m.u.ia};Z.listens=Z.Qd;Z.Yd=function(a){return a.m.u.la};Z.refConnection=Z.Yd;Z.Cd=ld;Z.DataConnection=Z.Cd;ld.prototype.sendRequest=ld.prototype.Ga;ld.prototype.interrupt=ld.prototype.La;Z.Dd=$c;Z.RealTimeConnection=Z.Dd;
$c.prototype.sendRequest=$c.prototype.xd;$c.prototype.close=$c.prototype.close;Z.Bd=ob;Z.ConnectionTarget=Z.Bd;Z.Ld=function(){Oc=Gc=!0};Z.forceLongPolling=Z.Ld;Z.Md=function(){Pc=!0};Z.forceWebSockets=Z.Md;Z.de=function(a,b){a.m.u.Vc=b};Z.setSecurityDebugCallback=Z.de;Z.Xc=function(a,b){a.m.Xc(b)};Z.stats=Z.Xc;Z.Yc=function(a,b){a.m.Yc(b)};Z.statsIncrementCounter=Z.Yc;Z.Cc=function(a){return a.m.Cc};Z.Od=function(a,b){a.m.md=b};Z.interceptServerData=Z.Od;function $(a,b,c){this.Jb=a;this.X=b;this.Fa=c}$.prototype.cancel=function(a){x("Firebase.onDisconnect().cancel",0,1,arguments.length);z("Firebase.onDisconnect().cancel",1,a,!0);this.Jb.Nc(this.X,a)};$.prototype.cancel=$.prototype.cancel;$.prototype.remove=function(a){x("Firebase.onDisconnect().remove",0,1,arguments.length);B("Firebase.onDisconnect().remove",this.X);z("Firebase.onDisconnect().remove",1,a,!0);Ge(this.Jb,this.X,null,a)};$.prototype.remove=$.prototype.remove;
$.prototype.set=function(a,b){x("Firebase.onDisconnect().set",1,2,arguments.length);B("Firebase.onDisconnect().set",this.X);za("Firebase.onDisconnect().set",a,!1);z("Firebase.onDisconnect().set",2,b,!0);Ge(this.Jb,this.X,a,b)};$.prototype.set=$.prototype.set;
$.prototype.kb=function(a,b,c){x("Firebase.onDisconnect().setWithPriority",2,3,arguments.length);B("Firebase.onDisconnect().setWithPriority",this.X);za("Firebase.onDisconnect().setWithPriority",a,!1);Ea("Firebase.onDisconnect().setWithPriority",2,b,!1);z("Firebase.onDisconnect().setWithPriority",3,c,!0);if(".length"===this.Fa||".keys"===this.Fa)throw"Firebase.onDisconnect().setWithPriority failed: "+this.Fa+" is a read-only object.";He(this.Jb,this.X,a,b,c)};$.prototype.setWithPriority=$.prototype.kb;
$.prototype.update=function(a,b){x("Firebase.onDisconnect().update",1,2,arguments.length);B("Firebase.onDisconnect().update",this.X);Da("Firebase.onDisconnect().update",a);z("Firebase.onDisconnect().update",2,b,!0);Ie(this.Jb,this.X,a,b)};$.prototype.update=$.prototype.update;var Ve=function(){var a=0,b=[];return function(c){var d=c===a;a=c;for(var e=Array(8),f=7;0<=f;f--)e[f]="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c%64),c=Math.floor(c/64);v(0===c,"Cannot push at time == 0");c=e.join("");if(d){for(f=11;0<=f&&63===b[f];f--)b[f]=0;b[f]++}else for(f=0;12>f;f++)b[f]=Math.floor(64*Math.random());for(f=0;12>f;f++)c+="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);v(20===c.length,"NextPushId: Length should be 20.");
return c}}();function E(a,b){var c,d;if(a instanceof ze)c=a,d=b;else{x("new Firebase",1,2,arguments.length);var e=arguments[0];d=c="";var f=!0,g="";if(q(e)){var k=e.indexOf("//");if(0<=k)var l=e.substring(0,k-1),e=e.substring(k+2);k=e.indexOf("/");-1===k&&(k=e.length);c=e.substring(0,k);var e=e.substring(k+1),m=c.split(".");if(3==m.length){k=m[2].indexOf(":");f=0<=k?"https"===l||"wss"===l:!0;if("firebase"===m[1])Sb(c+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");else for(d=m[0],
g="",e=("/"+e).split("/"),k=0;k<e.length;k++)if(0<e[k].length){m=e[k];try{m=decodeURIComponent(m.replace(/\+/g," "))}catch(p){}g+="/"+m}d=d.toLowerCase()}else Sb("Cannot parse Firebase url. Please use https:<YOUR FIREBASE>.firebaseio.com")}f||"undefined"!==typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&L("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");c=new ob(c,f,d,"ws"===l||"wss"===l);d=new F(g);
f=d.toString();!(l=!q(c.host)||0===c.host.length||!ya(c.Yb))&&(l=0!==f.length)&&(f&&(f=f.replace(/^\/*\.info(\/|$)/,"/")),l=!(q(f)&&0!==f.length&&!xa.test(f)));if(l)throw Error(y("new Firebase",1,!1)+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');if(b)if(b instanceof Y)f=b;else throw Error("Expected a valid Firebase.Context for second argument to new Firebase()");else f=Y.rb();l=c.toString();e=va(f.ib,l);e||(e=new ze(c),f.ib[l]=e);c=e}D.call(this,c,d)}
ja(E,D);var We=E,Xe=["Firebase"],Ye=aa;Xe[0]in Ye||!Ye.execScript||Ye.execScript("var "+Xe[0]);for(var Ze;Xe.length&&(Ze=Xe.shift());)!Xe.length&&n(We)?Ye[Ze]=We:Ye=Ye[Ze]?Ye[Ze]:Ye[Ze]={};E.prototype.name=function(){x("Firebase.name",0,0,arguments.length);return this.path.f()?null:Ma(this.path)};E.prototype.name=E.prototype.name;
E.prototype.G=function(a){x("Firebase.child",1,1,arguments.length);if(fa(a))a=String(a);else if(!(a instanceof F))if(null===C(this.path)){var b=a;b&&(b=b.replace(/^\/*\.info(\/|$)/,"/"));Ha("Firebase.child",b)}else Ha("Firebase.child",a);return new E(this.m,this.path.G(a))};E.prototype.child=E.prototype.G;E.prototype.parent=function(){x("Firebase.parent",0,0,arguments.length);var a=this.path.parent();return null===a?null:new E(this.m,a)};E.prototype.parent=E.prototype.parent;
E.prototype.root=function(){x("Firebase.ref",0,0,arguments.length);for(var a=this;null!==a.parent();)a=a.parent();return a};E.prototype.root=E.prototype.root;E.prototype.toString=function(){x("Firebase.toString",0,0,arguments.length);var a;if(null===this.parent())a=this.m.toString();else{a=this.parent().toString()+"/";var b=this.name();a+=encodeURIComponent(String(b))}return a};E.prototype.toString=E.prototype.toString;
E.prototype.set=function(a,b){x("Firebase.set",1,2,arguments.length);B("Firebase.set",this.path);za("Firebase.set",a,!1);z("Firebase.set",2,b,!0);this.m.kb(this.path,a,null,b)};E.prototype.set=E.prototype.set;E.prototype.update=function(a,b){x("Firebase.update",1,2,arguments.length);B("Firebase.update",this.path);Da("Firebase.update",a);z("Firebase.update",2,b,!0);if(A(a,".priority"))throw Error("update() does not currently support updating .priority.");this.m.update(this.path,a,b)};
E.prototype.update=E.prototype.update;E.prototype.kb=function(a,b,c){x("Firebase.setWithPriority",2,3,arguments.length);B("Firebase.setWithPriority",this.path);za("Firebase.setWithPriority",a,!1);Ea("Firebase.setWithPriority",2,b,!1);z("Firebase.setWithPriority",3,c,!0);if(".length"===this.name()||".keys"===this.name())throw"Firebase.setWithPriority failed: "+this.name()+" is a read-only object.";this.m.kb(this.path,a,b,c)};E.prototype.setWithPriority=E.prototype.kb;
E.prototype.remove=function(a){x("Firebase.remove",0,1,arguments.length);B("Firebase.remove",this.path);z("Firebase.remove",1,a,!0);this.set(null,a)};E.prototype.remove=E.prototype.remove;
E.prototype.transaction=function(a,b,c){x("Firebase.transaction",1,3,arguments.length);B("Firebase.transaction",this.path);z("Firebase.transaction",1,a,!1);z("Firebase.transaction",2,b,!0);if(n(c)&&"boolean"!=typeof c)throw Error(y("Firebase.transaction",3,!0)+"must be a boolean.");if(".length"===this.name()||".keys"===this.name())throw"Firebase.transaction failed: "+this.name()+" is a read-only object.";"undefined"===typeof c&&(c=!0);Ke(this.m,this.path,a,b,c)};E.prototype.transaction=E.prototype.transaction;
E.prototype.Wc=function(a,b){x("Firebase.setPriority",1,2,arguments.length);B("Firebase.setPriority",this.path);Ea("Firebase.setPriority",1,a,!1);z("Firebase.setPriority",2,b,!0);this.m.Wc(this.path,a,b)};E.prototype.setPriority=E.prototype.Wc;E.prototype.push=function(a,b){x("Firebase.push",0,2,arguments.length);B("Firebase.push",this.path);za("Firebase.push",a,!0);z("Firebase.push",2,b,!0);var c=Be(this.m),c=Ve(c),c=this.G(c);"undefined"!==typeof a&&null!==a&&c.set(a,b);return c};
E.prototype.push=E.prototype.push;E.prototype.ja=function(){return new $(this.m,this.path,this.name())};E.prototype.onDisconnect=E.prototype.ja;E.prototype.Zd=function(){L("FirebaseRef.removeOnDisconnect() being deprecated. Please use FirebaseRef.onDisconnect().remove() instead.");this.ja().remove();Je(this.m)};E.prototype.removeOnDisconnect=E.prototype.Zd;
E.prototype.ce=function(a){L("FirebaseRef.setOnDisconnect(value) being deprecated. Please use FirebaseRef.onDisconnect().set(value) instead.");this.ja().set(a);Je(this.m)};E.prototype.setOnDisconnect=E.prototype.ce;E.prototype.mb=function(a,b,c){x("Firebase.auth",1,3,arguments.length);if(!q(a))throw Error(y("Firebase.auth",1,!1)+"must be a valid credential (a string).");z("Firebase.auth",2,b,!0);z("Firebase.auth",3,b,!0);this.m.mb(a,b,c)};E.prototype.auth=E.prototype.mb;
E.prototype.Pb=function(a){x("Firebase.unauth",0,1,arguments.length);z("Firebase.unauth",1,a,!0);this.m.Pb(a)};E.prototype.unauth=E.prototype.Pb;E.goOffline=function(){x("Firebase.goOffline",0,0,arguments.length);Y.rb().La()};E.goOnline=function(){x("Firebase.goOnline",0,0,arguments.length);Y.rb().jb()};
function Pb(a,b){v(!b||!0===a||!1===a,"Can't turn on custom loggers persistently.");!0===a?("undefined"!==typeof console&&("function"===typeof console.log?Nb=r(console.log,console):"object"===typeof console.log&&(Nb=function(a){console.log(a)})),b&&nb.set("logging_enabled",!0)):a?Nb=a:(Nb=null,nb.remove("logging_enabled"))}E.enableLogging=Pb;E.ServerValue={TIMESTAMP:{".sv":"timestamp"}};E.INTERNAL=Z;E.Context=Y;})();
module.exports = Firebase;

},{}],4:[function(require,module,exports){
//! moment.js
//! version : 2.10.3
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(+config._d);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = typeof regex === 'function' ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true,
            msgWithStack = msg + '\n' + (new Error()).stack;

        return extend(function () {
            if (firstTime) {
                warn(msgWithStack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYY', 'YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = createUTCDate(year, 0, 1).getUTCDay();
        var daysToAdd;
        var dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year      : dayOfYear > 0 ? year      : year - 1,
            dayOfYear : dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        res = new Moment(checkOverflow(config));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
        return model._isUTC ? local__createLocal(input).zone(model._offset || 0) : local__createLocal(input).local();
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!input) {
            input = 0;
        }
        else {
            input = local__createLocal(input).utcOffset();
        }

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (this._a) {
            var other = this._isUTC ? create_utc__createUTC(this._a) : local__createLocal(this._a);
            return this.isValid() && compareArrays(this._a, other.toArray()) > 0;
        }

        return false;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    function millisecond__milliseconds (token) {
        addFormatToken(0, [token, 3], 0, 'millisecond');
    }

    millisecond__milliseconds('SSS');
    millisecond__milliseconds('SSSS');

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);
    addRegexToken('SSSS', matchUnsigned);
    addParseToken(['S', 'SS', 'SSS', 'SSSS'], function (input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    });

    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY LT',
        LLLL : 'dddd, MMMM D, YYYY LT'
    };

    function longDateFormat (key) {
        var output = this._longDateFormat[key];
        if (!output && this._longDateFormat[key.toUpperCase()]) {
            output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                return val.slice(1);
            });
            this._longDateFormat[key] = output;
        }
        return output;
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years = 0;

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // Accurately convert days to years, assume start from year 0.
        years = absFloor(daysToYears(days));
        days -= absFloor(yearsToDays(years));

        // 30 days to a month
        // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
        months += absFloor(days / 30);
        days   %= 30;

        // 12 months -> 1 year
        years  += absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToYears (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays (years) {
        // years * 365 + absFloor(years / 4) -
        //     absFloor(years / 100) + absFloor(years / 400);
        return years * 146097 / 400;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToYears(days) * 12;
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(yearsToDays(this._months / 12));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var duration_get__milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = iso_string__abs(this.years());
        var M = iso_string__abs(this.months());
        var D = iso_string__abs(this.days());
        var h = iso_string__abs(this.hours());
        var m = iso_string__abs(this.minutes());
        var s = iso_string__abs(this.seconds() + this.milliseconds() / 1000);
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = duration_get__milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.3';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],5:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],6:[function(require,module,exports){
var huffman = require('./huffman.js')
var Firebase = require('client-firebase')
var moment = require('moment')

var myDataRef = new Firebase('https://huffmanchat.firebaseio.com/')


$('#messageInput').keypress(function(e){
  if (e.keyCode == 13) {
        var name = $('#nameInput').val();
        if(name == "" || name == null) return
        var text = $('#messageInput').val();
        var huffmanEncode = huffman.encode(text)
        var timestamp = new Date().toString()
         myDataRef.push({name:name, time:timestamp, huffman:huffmanEncode});
        $('#messageInput').val('');
      }
})

$('#btn-chat').click(function(e){
  var name = $('#nameInput').val();
  if(name == "" || name == null) return
  var text = $('#messageInput').val();
  var huffmanEncode = huffman.encode(text)
  var timestamp = new Date().toString()
   myDataRef.push({name:name, time:timestamp, huffman:huffmanEncode});
  $('#messageInput').val('');
})

myDataRef.on('child_added', function(snapshot) {
        var message = snapshot.val()
        displayChat(message)
      });

function displayChat(message){
  var decode = huffman.decode(message.huffman.encodedText, message.huffman.huffmanTable, message.huffman.fill)
  var div = '<li class="left clearfix"><span class="chat-img pull-left"><img src="http://placehold.it/50/55C1E7/fff&text='+message.name.charAt(0)+'" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">'+message.name+'</strong> <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>'+moment(message.time).fromNow()+'</small></div><p><strong>"'+message.huffman.encodedText+'"</strong></p><p>'+decode.binText+'</p><p>'+decode.text+'</p></div></li>'
  $("ul.chat").append(div)
  $('div.panel-body')[0].scrollTop = $('div.panel-body')[0].scrollHeight
}

},{"./huffman.js":2,"client-firebase":3,"moment":4}]},{},[6]);
