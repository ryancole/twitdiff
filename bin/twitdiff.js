#!/usr/bin/env node

var util = require('util'),
    TwitDiff = require('../src/twitdiff');

// init
var td = new TwitDiff({
    
    username: 'richardbranson'
    
});

// get ids from previous scan
td.getCachedIds(function (err, cachedIds) {
    
    console.log('Checking to see who has unfollowed: ' + td.settings.username);
    
    // get current follower ids
    td.getFollowerIds(function (err, currentIds) {
        
        // get ids of people who unfollowed
        var unfollowedBy = cachedIds.filter(function (element) {
            
            return currentIds.indexOf(element) == -1;
            
        });
        
        if (unfollowedBy.length > 0) {
            
            // get information about unfollowers
            td.getUserInformations(unfollowedBy, function (err, unfollowers) {
                
                unfollowers.forEach(function (unfollower) {
                    
                    console.log(util.format('Unfollowed by: %s (%s)', unfollower.name, unfollower.screen_name));
                    
                });
                
            });
            
        } else {
            
            console.log('Nobody has unfollowed you ... yet.');
            
        }
        
    });
    
});
