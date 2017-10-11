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
