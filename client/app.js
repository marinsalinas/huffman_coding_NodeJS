var huffman = require('./huffman.js')
var Firebase = require('client-firebase')

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

myDataRef.on('child_added', function(snapshot) {
          var message = snapshot.val()
		        //displayChatMessage(huffman.decode(message.huffman.encodedText, message.huffman.huffmanTable, message.huffman.fill), message.huffman.encodedText);
        displayChat(message)

      });

function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      };


      function displayChat(message){

        var div = '<li class="left clearfix"><span class="chat-img pull-left"><img src="http://placehold.it/50/55C1E7/fff&text='+message.name.charAt(0)+'" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">'+message.name+'</strong> <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>12 mins ago</small></div><p><strong>"'+message.huffman.encodedText+'"</strong></p><p>'+huffman.decode(message.huffman.encodedText, message.huffman.huffmanTable, message.huffman.fill)+'</p></div></li>'
      $("ul.chat").append(div)
      }
