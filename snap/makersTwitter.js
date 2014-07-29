'use strict';

/**
 * MakerApp.twitter
 * Functionality & variables for Twitter interaction from Makers blocks
 *
 * Defined in this file:
 * MakerApp.twitter.APIKey
 * MakerApp.twitter.APISecret
 * MakerApp.twitter.TwitterDialogMorph
 * MakerApp.twitter.requestPin
 * MakerApp.twitter.processPin
 */

// Make sure that global MakerApp object  exists
if (typeof MakerApp === "undefined") {
  var MakerApp = {};  
}

// Encapsulate all twitter functionality in MakerApp.twitter object 
MakerApp.twitter = {}

// APIKey & API Secret from Twitter Application associated to the Twitter API calls (by default it is FirstMakers APP that belongs to the firstmakers twitter account)
MakerApp.twitter.APIKey = 'Y7nczrrpIbyCYbk8BXjOiFfjM',
MakerApp.twitter.APISecret = 'FF35z7tBBJRo5ap8LBqSZcbGaQOMxdKd2ldHGc1PNY5PPNlbeK'

/**
 * MakerApp.twitter.TwitterDialogMorph
 * DialogBox that informs the user of Browser authentication and requires
 * PIN generated for the Twitter Authetication process.
 */
MakerApp.twitter.TwitterDialogMorph = function(target, action, environment) {
    this.init(target, action, environment);
}

MakerApp.twitter.TwitterDialogMorph.prototype = new DialogBoxMorph();
MakerApp.twitter.TwitterDialogMorph.prototype.constructor = MakerApp.twitter.TwitterDialogMorph;
MakerApp.twitter.TwitterDialogMorph.uber = DialogBoxMorph.prototype;

// TwitterDialogMorph instance creation:

MakerApp.twitter.TwitterDialogMorph.prototype.init = function (target, action, environment) {
     // initialize inherited properties:
    BlockDialogMorph.uber.init.call(
        this,
        target,
        action,
        environment
    );

    // override inherited properites:
    this.message = new AlignmentMorph('row', this.padding);

    var msgText = 'Your local browser will be directed to\n' 
        + 'a Twitter Web page that will request\n'
        + 'authorization for this App to send\n'
        + 'Tweets and will give you a PIN number\n\n'
        + 'Type the PIN number here\n';

    this.myString = new TextMorph(msgText);

    this.message.add(this.myString);
    this.add(this.message);
    this.fixLayout();
};


MakerApp.twitter.TwitterDialogMorph.prototype.fixLayout = function () {
    var th = fontHeight(this.titleFontSize) + this.titlePadding * 2;

    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            th + this.padding
        )));
        this.silentSetWidth(this.body.width() + this.padding * 2);
        this.silentSetHeight(
            this.body.height()
                + this.padding * 2
                + th
        );
    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(this.top() + (th - this.label.height()) / 2);
    }

    if (this.message) {
        this.message.fixLayout();
        this.silentSetHeight(
            this.height()
                    + this.message.height()
                    + this.padding
        );
        this.silentSetWidth(Math.max(
            this.width(),
            this.message.width() + this.padding * 2
        ));
        this.message.setCenter(this.center());
        if (this.body) {
            this.message.setTop(this.body.bottom() + this.padding);
        } 
    }

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.fixLayout();
        this.silentSetHeight(
            this.height()
                    + this.buttons.height()
                    + this.padding
        );
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }
};

/**
 * MakerApp.twitter.requestPinrequestPin
 * Uses twitter api to obtain a Request Token using oob (Out of Band) flow.
 * 
 * We will obtain a requestToken & requestSecret and then redirect the user 
 * to an external (local browser) web page for Twitter authentication/authorization
 * if successful, the page will provide the user a PIN number which can be used
 * later (in MakerApp.twitter.processPin) to obtain the accessToken that is 
 * required for using the Twitter API on behalf of the user.
 */
MakerApp.twitter.requestPin = function() {
	var gui = require('nw.gui');
    
    // Using deferred for managing promises with async API calls
    var deferred = MakerApp.Q.defer();

	if (MakerApp.twitter.twitterAPI === undefined) {
		var twitterAPI = require('node-twitter-api');
		MakerApp.twitter.twitterAPI = new twitterAPI({
		    consumerKey: MakerApp.twitter.APIKey,
		    consumerSecret: MakerApp.twitter.APISecret,
		    callback: 'oob'
		});
	}

	MakerApp.twitter.twitterAPI.getRequestToken(function(error, requestToken, requestTokenSecret, results){
	    if (error) {
            console.log('Error getting OAuth request token : ' + error);
            deferred.reject(new Error(error));
	    } else {
	    	console.log('Got request token from Twitter');
            // Records requestToken & requestTokenSecret for later use
	    	MakerApp.twitter.requestToken = requestToken;
	    	MakerApp.twitter.requestTokenSecret = requestTokenSecret;
	    	
            gui.Shell.openExternal('https://twitter.com/oauth/authenticate?oauth_token='+requestToken);
            deferred.resolve(results);
	    }
	});

    return deferred.promise;
}

/**
 * MakerApp.twitter.processPin
 * Given an appropiate Twitter PIN (obtained through MakerApp.twitter.requestPin)
 * we request an accessToken & accessTokenSecret which is required for calls to the twitter API
 */
MakerApp.twitter.processPin = function(pin) {

    // Using deferred for managing promises with async API calls
    var deferred = MakerApp.Q.defer();

	if (MakerApp.twitter.requestToken === undefined) {
		alert('You need to request a twitter PIN before connecting');
	} else
	{
		MakerApp.twitter.twitterAPI.getAccessToken(MakerApp.twitter.requestToken, MakerApp.twitter.requestTokenSecret, pin, function(error, accessToken, accessTokenSecret, results) {
		    if (error) {
		        console.log(error);
                deferred.reject(error);
		    } else {
                // Records requestToken & requestTokenSecret for later use
		    	MakerApp.twitter.accessToken = accessToken;
		    	MakerApp.twitter.accessTokenSecret = accessTokenSecret;
		    	console.log('Got access token for Twritter account',results);
		        //store accessToken and accessTokenSecret somewhere (associated to the user)
		        //Step 4: Verify Credentials belongs here
                deferred.resolve(results);
		    }
		});
	}

    return deferred.promise;
}

