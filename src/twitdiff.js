
var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    request = require('request'),
    underscore = require('underscore');

// constructor
var TwitDiff = module.exports = function (settings) {
    
    this.settings = underscore.defaults(settings || {}, {
        
        username: 'richardbranson',
        cache: path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.twitdiff'),
        
    });
    
};

// load ids from previous scan
TwitDiff.prototype.getCachedIds = function (callback) {
    
    // path to id cache file
    var cacheFilePath = path.join(this.settings.cache, this.settings.username + '.json');
    
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
        
        this.saveFollowerIds(body.ids, function (err, path) {
            
            if (err)
                return callback(err);
            
            return callback(null, body.ids);
            
        });
        
    }.bind(this));
    
};

// write follower ids to disk
TwitDiff.prototype.saveFollowerIds = function (followers, callback) {
    
    // path to id cache file
    var cacheFilePath = path.join(this.settings.cache, this.settings.username + '.json');
    
    // create directory if needed
    mkdirp(this.settings.cache, function (err) {
        
        if (err)
            return callback(err);
        
        // store these ids for the next scan
        fs.writeFile(cacheFilePath, JSON.stringify(followers), function (err) {
            
            if (err)
                return callback(err);
            
            return callback(null, cacheFilePath);
            
        });
        
    });
    
};

// get person info
TwitDiff.prototype.getUserInformations = function (ids, callback) {
    
    // https://api.twitter.com/1/users/lookup.json?screen_name=981101
    var userUrl = 'https://api.twitter.com/1/users/lookup.json?user_id=' + ids.join();
    
    // request data from twitter
    request({ json: true, uri: userUrl }, function (err, res, body) {
        
        if (err || res.statusCode != 200)
            return callback(new Error('could not get followers'));
        
        return callback(null, body);
        
    });
    
};
