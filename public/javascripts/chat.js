var socket = io();
var allChatMessages = [];
var chatNotificationCount = [];
var onlineUsers = [];
var myUser;
var myFriend;

$(document).ready(function () {
  // Function call to initilize file uploader
  initializeFileUploader();
  // Function will be called when file is selected
  fileIsSelected(); 
  document.title = user.name;
  initalizeMessages(messages);
  socket.emit('newUser', user);
});

function initalizeMessages(messages) {
  messages.forEach(function(message, index){
    var msg = {};
    msg.sender = message.sender;
    msg.receiver = message.receiver;
    msg.timestamp = message.timestamp;
    msg.text = message.text;
    msg.type = message.type;
    msg.id = message.id;
    
    if(msg.sender == user.name)
    {
      if (allChatMessages[msg.receiver] != undefined) {
        allChatMessages[msg.receiver].push(msg);
      } else {
        allChatMessages[msg.receiver] = new Array(msg);
      }
    }
    else if(msg.receiver == user.name)
    {
      if (allChatMessages[msg.sender] != undefined) {
        allChatMessages[msg.sender].push(msg);
      } else {
        allChatMessages[msg.sender] = new Array(msg);
      }
    }
  });
}
// Function to initialize file uploader
function initializeFileUploader() {
  $("#imgAttachment").click(function () {
    $("#fileAttachment").click();
  });

  $("#imgSend").click(function () {
    $("#btnChatMessage").click();
  });
}

// Function to be called when file is selected in file uploader
function fileIsSelected() {
  $('#fileAttachment').on('change', function () {
    var file = this.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('max upload size is 5 MB');
    } else {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        ajaxFileUpload(file.name, reader.result.split(',')[1]);
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  });
}

function ajaxFileUpload(fileName, fileData) {
  var message = {};
  var formData = new FormData();
  formData.append('fileName', fileName);
  formData.append("fileToUpload", fileData);

  $.ajax({
    url: "/chat-file-upload",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      if (response.filePath) {
        message.type = 'file';
        var sln = response.filePath.length;
        message.text = response.filePath.slice(7, sln);
        message.sender = myUser;
        message.receiver = myFriend;
        message.timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        message.id = Math.random();
        // Function call to send attached file to sender/seceiver in chatbox
        appendSendersChatboxMessage(message);
      } else {
        throw 'File upload failed';
      }
    },
    error: function (jqXHR, textStatus, errorMessage) {
      alert('Error in sending attachment: ' + errorMessage); // Optional
    }
  });
}

// Function to be called when sent a message from chatbox
function submitfunction() {
  var message = {};
  text = $('#txtChatMessage').val();

  if (text != '') {
    message.type = 'text';
    message.text = text;
    message.sender = myUser;
    message.receiver = myFriend;
    message.timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    message.id = Math.random();

    // Function call to send attached file to sender/seceiver in chatbox
    appendSendersChatboxMessage(message);
  }

  $('#txtChatMessage').val('').focus();
}

// Function to append a chat message to the senders chatBox
function appendSendersChatboxMessage(message) {

  appendMessage(message, 'chatMessageRight');

  if (allChatMessages[myFriend] != undefined) {
    allChatMessages[myFriend].push(message);
  } else {
    allChatMessages[myFriend] = new Array(message);
  }
  socket.emit('chatMessage', message);
}

// Append a single chant message to the receivers chatbox
function appendReceiversChatboxMessage(message) {

  if (message.receiver == myUser && message.sender == myFriend) {
    var cssClass = (message.sender == myUser) ? 'chatMessageRight' : 'chatMessageLeft';

    appendMessage(message, cssClass);
    playNewMessageAudio();
  } else {
    playNewMessageNotificationAudio();
    updateChatNotificationCount(message.sender);
  }

  if (allChatMessages[message.sender] != undefined) {
    allChatMessages[message.sender].push(message);
  } else {
    allChatMessages[message.sender] = new Array(message);
  }
}

// Function to update chat notifocation count
function updateChatNotificationCount(name) {
  var count = (chatNotificationCount[name] == undefined) ? 1 : chatNotificationCount[name] + 1;
  chatNotificationCount[name] = count;
 
  $('#' + name + ' label.chatNotificationCount').html(count);
  $('#' + name + ' label.chatNotificationCount').show();
}

// Function to clear chat notifocation count to 0
function clearChatNotificationCount(name) {
  chatNotificationCount[name] = 0;
  $('#' + name + ' label.chatNotificationCount').hide();
}

// Load all messages for the selected user
function loadChatBox(messages) {

  $('#newChatForm').show();
  $('#messages').html('').show();
  $('.ctx-menu-item').remove();
  
  messages.forEach(function (message) {
    var cssClass = (message.sender == myUser) ? 'chatMessageRight' : 'chatMessageLeft';
    // Function call to append receiver's chat message to chatBox
    appendMessage(message, cssClass);
  });
  chatboxScrollBottom();
}

//Function to Edit Message
function editMessage(element)
{
  var inputMsg = $('#txtChatMessage');
  inputMsg.val(element.firstChild.innerHTML);
}

function copyMessage(element)
{
  var clipText = $('#clipText');
  clipText.val(element.firstChild.innerHTML);
  clipText.select();
  document.execCommand("copy");

  var snackbar = $('#snackbar');
  snackbar.attr("class", "show");

  setTimeout(function(){ snackbar.attr("class", ""); }, 2500);
}

function quoteMessage(element)
{
  var inputMsg = $('#txtChatMessage');
  inputMsg.val(element.firstChild.innerHTML);
}


//Function to Delete Message
function deleteMessage(element)
{
  element.style.display = 'none';
  console.log(element.id);
  socket.emit('deleteMessage', element.id);
}

// Function to append chat application to senders/receivers chatBox
function appendMessage(message, cssClass) {

    var htmlMessage = '';
    var contextMenu = '';

    var fileTypeRE = /\.(jpe?g|png|gif|bmp)$/i;

    var messageTimestamp = message.timestamp;
    var chatMessageTimestamp = '<label class="chatMessageTimestamp">' + messageTimestamp + '</label>';
    
    if (message.type === 'text') {
      htmlMessage = '<li id="' + message.id + '"' + 'class="' + cssClass + '">'
        + '<span class="wrapDiv" id="' + '">' + message.text + '</span>' 
        + chatMessageTimestamp + '</li>';
    } else if (message.type === 'file') {
      if (fileTypeRE.test(message.text)) {
          htmlMessage = '<li id="' + message.id + '"' + 'class="' + cssClass + 
          '"><img class="chatImage" src="' + message.text 
          + '" alt="" />' + chatMessageTimestamp + '</li>';
      } else {
          htmlMessage = '<li id="' + message.id + '"' + 'class="' + cssClass + '"><a href="' 
          + message.text + '"><img class="chatImage" src="images/if_Download.png" alt="Download File" height="40px" /></a>' 
          + chatMessageTimestamp + '</li>';
      }
    }
    
    contextMenu = CtxMenu('#' + message.id);
    contextMenu.addItem("Edit", editMessage);
    contextMenu.addItem("Copy", copyMessage);
    contextMenu.addItem("Quote", quoteMessage);
    contextMenu.addItem("Delete", deleteMessage);

    $('#messages').append(htmlMessage);
    chatboxScrollBottom();
}
// Function to be called when a friend is selected from the list of online users
function selectUerChatBox(element, userId, userName) {
  myFriend = userName;
//  socket.emit('selectUser');

  $('#newChatForm').show();
  $('#messages').show();
  $('#onlineUsers li').removeClass('active');
  $(element).addClass('active');
  $('#notifyTyping').text('');
  $('#txtChatMessage').val('').focus();

  // Reset chat message count to 0
  clearChatNotificationCount(userName);
  // load all chat message for selected user 
  if (allChatMessages[userName] != undefined) {
    loadChatBox(allChatMessages[userName]);
  } else {
    $('#messages').html('');
  }
}

// function to emit an even to notify friend that I am typing a message 
function notifyTyping() {
  socket.emit('notifyTyping', myUser, myFriend);
}

function chatboxScrollBottom() {
  $('#messages').animate({ scrollTop: $('#messages').prop('scrollHeight') }, 10);
}

// Function to play a audio when new message arrives on selected chatbox
function playNewMessageAudio() {
  (new Audio('https://notificationsounds.com/soundfiles/8b16ebc056e613024c057be590b542eb/file-sounds-1113-unconvinced.mp3')).play();
}

// Function to play a audio when new message arrives on selected chatbox
function playNewMessageNotificationAudio() {
  (new Audio('https://notificationsounds.com/soundfiles/dd458505749b2941217ddd59394240e8/file-sounds-1111-to-the-point.mp3')).play();
}

function showOnlineUsers(searchName)
{
  var usersList = '';
  var userElement;

  var liContent='', avatar='', user_info='', notifynum='', online_icon='', contact_info='';
  var curTime = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
        
  onlineUsers.forEach(function (user) { 
    if (user.data.name != myUser) {
      if (onlineUsers.length == 2) {
        myFriend = user.data.name;
        $('#newChatForm').show();
        $('#messages').show();
      }
      var str = user.data.name;
      var pos = str.indexOf(searchName);
      if(pos != -1 && user.data.verify === 'allow')
      {
        var activeClass = (user.data.name == myFriend) ? 'active' : '';

        if(user.data.status === 'connect')
        {
          avatar = '<img class="rounded-circle user_img" src="images/avatar/7.jpg" />';
          online_icon = '<span class="online_icon"></span>';
          contact_info = '<p style="font-size: 12px">User is in room.</p>';
        }
    
        else if(user.data.status === 'disconnect')
        {
          avatar = '<img class="rounded-circle user_img" src="images/avatar/5.jpg" />';
          online_icon = '<span class="online_icon offline"></span>';
          contact_info = '<p style="font-size: 12px">' 
                    + timeDiff(user.data.contactTime, curTime) + '</p>';
        }
        user_info = '<span style="color: green;">' + user.data.name + '</span>';
        notifynum = '<label class="chatNotificationCount"></label>';
        liContent = '<div style="display: flex;">' + 
            '<div style="position: relative;">' + avatar + online_icon + '</div>' + 
            '<div style="position: relative; padding-left:12px">' + user_info + contact_info + '</div>' +
            '</div>';

        userElement = '<li style="position: relative" id="' + user.data.name + '" class="' 
          + activeClass + ' '
          + '" onclick="selectUerChatBox(this, \'' + user.id + '\', \'' + user.data.name + '\')">' 
          + liContent + notifynum + '</li>';
        
        usersList += userElement;
      }
    }
  });
//  
        
  $('#onlineUsers').html(usersList);
}

function searchFriend(){
  var searchName = $('#searchFriend').val();

  showOnlineUsers(searchName);
}

function timeDiff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
       hours = hours + 24;

    if(minutes == 0)
       return 'Less than a minute';

    if(hours == 0)
       return (minutes <= 9 ? "0" : "") + minutes + "min ago";

    return (hours <= 9 ? "0" : "") + hours + "hours, " 
      + (minutes <= 9 ? "0" : "") + minutes + "min ago";
}

// ############# Event listeners and emitters ###############
socket.on('newUser', function (newUser) {
  myUser = newUser.data.name;
});

socket.on('notifyTyping', function (sender, recipient) {
  if (myFriend == sender) {
    $('#notifyTyping').text(sender + ' is typing ...');
  } 
  setTimeout(function () { $('#notifyTyping').text(''); }, 3000);
});

// Listen to onlineUsers event to update the list of online users
socket.on('onlineUsers', function (rcvdOnlineUsers) {
  onlineUsers = rcvdOnlineUsers;
  showOnlineUsers('');
});

// Listen to chantMessage event to receive a message sent by my friend 
socket.on('chatMessage', function (message) {
  // Function call to append a single chant message to the receivers chatbox
  appendReceiversChatboxMessage(message);
});

socket.on('deleteMessage', function (messages) {
  allChatMessages = [];
  initalizeMessages(messages);
});