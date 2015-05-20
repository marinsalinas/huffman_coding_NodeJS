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
