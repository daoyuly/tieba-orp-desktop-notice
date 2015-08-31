function getNotificationId() {
    var id = Math.floor(Math.random() * 9007199254740992) + 1;
    return id.toString();
}



var notID = 0;
var currentTab = null;
var currentMessage = null;


function updateTab() {

     if (!currentMessage) {
     	return;
     }
	 chrome.tabs.query({url: currentMessage['url']}, function(tabs){
       // console.log(tabs);
       chrome.tabs.update(tabs[0].id,{active:true,selected:true});
    });
}

// Create the notification with the given parameters as they are set in the UI
function doNotify(message) {

    var options = {
        type: "basic",
        title: "ORP 上线步骤提醒",
        message: message['title'] + '---' + message['status'] ,
        expandedMessage: "Longer part of the message",
    };
    var sBtn1 = '进行下一步';
    var sBtn2 = '关闭';
    var path = chrome.runtime.getURL("/images/icon128.png");
    options.iconUrl = path;
    // priority is from -2 to 2. The API makes no guarantee about how notifications are
    // visually handled by the OS - they simply represent hints that the OS can use to
    // order or display them however it wishes.
    options.priority = 2;

    options.buttons = [];
    if (sBtn1.length)
        options.buttons.push({title: sBtn1});
    if (sBtn2.length)
        options.buttons.push({title: sBtn2});

    chrome.notifications.create("id" + notID, options, creationCallback);
}

function creationCallback(notID) {
    console.log("Succesfully created " + notID + " notification");

    setTimeout(function () {
        chrome.notifications.clear(notID, function (wasCleared) {
        	notID = 0;
            console.log("Notification " + notID + " cleared: " + wasCleared);
        });
    }, 20*60*1000);

}

// Window initialization code. Set up the various event handlers
window.addEventListener("load", function () {
    // set up the event listeners
    chrome.notifications.onClosed.addListener(notificationClosed);
    chrome.notifications.onClicked.addListener(notificationClicked);
    chrome.notifications.onButtonClicked.addListener(notificationBtnClick);
});
// Event handlers for the various notification events
function notificationClosed(notID, bByUser) {
	notID = 0;
    console.log("The notification '" + notID + "' was closed" + (bByUser ? " by the user" : ""));

}

function notificationClicked(notID) {
	notID = 0;
    console.log("The notification '" + notID + "' was clicked");
    updateTab();
}

function notificationBtnClick(notID, iBtn) {
	notID = 0;
    console.log("The notification '" + notID + "' had button " + iBtn + " clicked");
    updateTab();
}




chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (notID != message['id']){
    	currentMessage = message;

        chrome.tabs.getCurrent(function(tab){
        	currentTab = tab;
        	notID = message['id'];
    	    doNotify(message);
        });

    	   

    }


});

