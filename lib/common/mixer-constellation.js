'use strict';

const Carina = require('carina').Carina;
const ws = require('ws');
Carina.WebSocket = ws;

function liveEventRouter (eventType, data) {
    console.log('Event: ' + eventType);
    console.log(data);

    switch (eventType) {
    case "Update": {
        // Update
        // Note that this provides pretty much all changes to the channel including things like profile changes.
        // Main thing that could be useful would be channel online/offline status and viewer/follow stats.
        let numFollowers = data.numFollowers,
            viewersCurrent = data.viewersCurrent,
            viewersTotal = data.viewersTotal;

        if (numFollowers != null) {
            console.log('Num Followers: ' + numFollowers);
        }
        if (viewersCurrent != null) {
            console.log('Viewers Current: ' + viewersCurrent);
        }
        if (viewersTotal != null) {
            console.log('Viewers Total: ' + viewersTotal);
        }
        break;
    }
    case "followed": {
        // Follow
        // This returns the entire user object with additional parameter of follow = true or false.
        // Note we could pull sparks, creation date, levels, etc...
        if (data.following === true) {
            console.log(data.username + ' followed the channel!');
        }
        break;
    }
    case "hosted": {
        // Hosted
        // This returns a channel object (not user).
        // We could get things like partner status here.
        console.log(data.userId + ' hosted the channel!');
        break;
    }
    case "subscribed": {
        // Subscribed
        // Returns user object.
        console.log(data.username + ' subscribed to the channel!');
        break;
    }
    case "resubscribed": {
        // Resubscribe
        // This is fired when payment goes through, but does not meant the person is in chat. Returns user object.
        console.log(data.username + ' resubscribed to the channel for ' + data.totalMonths + ' months!');
        break;
    }
    case "resubShared": {
        // Resub Shared
        // This is when a user clicks the share button. Returns user object.
        console.log(data.username + ' shared a resub to the channel for ' + data.totalMonths + ' months!');
        break;
    }
    default: {
        console.log(data);
    }
    }
}

// Constellation Connect
// This will connect to constellation and subscribe to all constellation events we need.
function constellationConnect(channelId) {

    // Testing - Switch out with a live channel id.
    // (34083 - Lagby)
    channelId = 34083;

    console.log('Attempting to connect to Constellation.', channelId);
    const ca = new Carina({ isBot: true }).open();

    // Channel Status
    // This gets general channel data such as online status, num followers, current viewers.
    ca.subscribe('channel:' + channelId + ':update', data => {
        liveEventRouter('Update', data);
    });

    // Resub Shared
    // This is a resub event in which the user manually triggered the celebration.
    ca.subscribe('channel:' + channelId + ':resubShared', data => {
        liveEventRouter('resubShared', data);
    });

    // Resub
    // This is a resub event in which the users payment went through, but they might not be in the channel.
    ca.subscribe('channel:' + channelId + ':resubscribed', data => {
        liveEventRouter('resubscribed', data);
    });

    // Sub
    // This is an initial sub to the channel.
    ca.subscribe('channel:' + channelId + ':subscribed', data => {
        liveEventRouter('subscribed', data);
    });

    // Host
    // This is a channel host.
    ca.subscribe('channel:' + channelId + ':hosted', data => {
        liveEventRouter('hosted', data);
    });

    // Follow
    // This is a follow event. Can be true or false for follow or unfollow.
    ca.subscribe('channel:' + channelId + ':followed', data => {
        liveEventRouter('followed', data);
    });

    ca.on('error', data => {
        console.log('Constellation Error');
        console.log(data);
    });

}

// Export Functions
exports.connect = constellationConnect;