var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
	document.cookie = "key=" + $("#token").val() + "; path=/; domain=.localhost; SameSite=Strict; Secure";
    var socket = new WebSocket('ws://localhost:3002/stomp-web-socket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/messages', function (heartbeat) {
            pulseHeart(heartbeat);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    stompClient.send(
    	"/app/send-alert",
    	{},
    	JSON.stringify(
    		{
    			'fileName': "aaa",
    			'bytesRead': 0,
    			body: $("#body").val()
			}
    	)
    );
}

function pulseHeart(heartbeat) {
    $("#messages").append("<tr><td>" + heartbeat + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendMessage(); });
});

