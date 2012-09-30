
var fs = require('fs'),
    request = require('request');

// constructor
var TwitDiff = module.exports = function (settings) {
    
    this.settings = settings;
    
};

// load ids from previous scan
TwitDiff.prototype.getCachedIds = function (callback) {
    
    // path to id cache file
    var cacheFilePath = this.settings.username + '.json';
    
    fs.exists(cacheFilePath, function (exists) {
        
        if (!exists)
            return callback(null, new Array);
        
        fs.readFile(cacheFilePath, function (err, data) {
            
            if (err)
                return callback(null, new Array);
            
            return callback(null, JSON.parse(data));
            
        });
        
    });
    
};

// get twitter follower ids
TwitDiff.prototype.getFollowerIds = function (callback) {
    
    // https://dev.twitter.com/docs/api/1/get/followers/ids
    var followersUrl = 'https://api.twitter.com/1/followers/ids.json?screen_name=' + this.settings.username;
    
    // request data from twitter
    request({ json: true, uri: followersUrl }, function (err, res, body) {
        
        if (err || res.statusCode != 200)
            return callback(new Error('could not get followers'));
        
        // path to id cache file
        var cachedFilePath = this.settings.username + '.json';
        
        // store these ids for the next scan
        fs.writeFile(cachedFilePath, JSON.stringify(body.ids), function (err) {
            
            return callback(null, body.ids);
            
        });
        
    }.bind(this));
    
};

// get person info
TwitDiff.prototype.getUserInformations = function (ids, callback) {
    
    // https://api.twitter.com/1/users/lookup.json?screen_name=981101
    var userUrl = 'https://api.twitter.com/1/users/lookup.json?screen_name=' + ids.join();
    
    // request data from twitter
    request({ json: true, uri: userUrl }, function (err, res, body) {
        
        if (err || res.statusCode != 200)
            return callback(new Error('could not get follower'));
        
        return callback(null, body);
        
    });
    
};


if (require.main === module) {
    
    var td = new TwitDiff({ username: '_ryancole' });
    
    // get ids from previous scan
    td.getCachedIds(function (err, cachedIds) {
        
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
                        
                        console.log(unfollower);
                        
                    });
                    
                });
                
            } else {
                
                console.log('Nobody has unfollowed you ... yet.');
                
            }
            
        });
        
    });
    
}
