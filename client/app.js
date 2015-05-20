var huffman = require('./huffman.js')
var Firebase = require('client-firebase')

var myDataRef = new Firebase('https://huffmanchat.firebaseio.com/')


$('#messageInput').keypress(function(e){
  if (e.keyCode == 13) {
        var name = $('#nameInput').val();
        var text = $('#messageInput').val();
        var huffmanEncode = huffman.encode(text)
         myDataRef.set({huf:huffmanEncode});
        $('#messageInput').val('');
      }
})

myDataRef.on('child_added', function(snapshot) {
          var message = snapshot.val()
          console.log(message)
		displayChatMessage(huffman.decode(message.encodedText, message.huffmanTable, message.fill), message.encodedText);
      });

function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      };
