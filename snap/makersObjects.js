'use strict';
/**
* Makers extension for Snap4Arduino
* We create an additional block group - makers - with specific functions for the Makers shield for arduino
*/


/**
* We create areference to the origina Block definition following the same apporach as snap4arduino
*/
StageMorph.prototype.originalBlockTemplates_Makers = StageMorph.prototype.blockTemplates;
SpriteMorph.prototype.originalBlockTemplates_Makers = SpriteMorph.prototype.blockTemplates;


// Definition of a new Makers Category

SpriteMorph.prototype.categories =
    [
        'motion',
        'control',
        'looks',
        'sensing',
        'sound',
        'operators',
        'pen',
        'variables',
        'lists',
        'arduino',
        'makers',
        'other'
    ];

SpriteMorph.prototype.blockColor = {
    motion : new Color(74, 108, 212),
    looks : new Color(143, 86, 227),
    sound : new Color(207, 74, 217),
    pen : new Color(0, 161, 120),
    control : new Color(230, 168, 34),
    sensing : new Color(4, 148, 220),
    operators : new Color(98, 194, 19),
    variables : new Color(243, 118, 29),
    lists : new Color(217, 77, 17),
    arduino: new Color(64, 136, 182),
    makers : new Color(64, 64, 230),
    other: new Color(150, 150, 150)
};


// Definition of our new primitive blocks
function overridenBlockTemplates(category) {
    var  myself = this;

    //var variableWatcherToggle = SpriteMorph.prototype.originalBlockTemplates_Makers.variableWatcherToggle;

    
   function watcherToggle(selector) {
        if (StageMorph.prototype.hiddenPrimitives[selector]) {
            return null;
        }
        var info = SpriteMorph.prototype.blocks[selector];
        return new ToggleMorph(
            'checkbox',
            this,
            function () {
                myself.toggleWatcher(
                    selector,
                    localize(info.spec),
                    myself.blockColor[info.category]
                );
            },
            null,
            function () {
                return myself.showingWatcher(selector);
            },
            null
        );
    }

    // Button definitions
    // Buttons are push buttons displayed in the block group area
    // which can trigger actions but are not used as programming blocks
    

    /**
     * Starts a connection attempt to an Arduino Board
     */
    var arduinoConnectButton = new PushButtonMorph(
            null,
            function () {
                MakerApp.makersStartArduinoAutoConnect();
            },
            "Connect Arduino"
    );

    /**
     * Starts disconnection from an Arduino Board
     */
    var arduinoDisConnectButton = new PushButtonMorph(
            null,
            function () {
                MakerApp.makersStopArduinoAutoConnect();
            },
            "Disconnect Arduino"
    );

    /**
     * Authorize twitter account (requests a PIN through a browser window)
     */
    var tweetButton = new PushButtonMorph(
        null,
        function () {
            MakerApp.twitter.requestPin()
            .then(function() {
                new MakerApp.twitter.TwitterDialogMorph(
                    null,
                    // Function executed after pin is given by the user
                    function(pin) {
                        MakerApp.twitter.processPin(pin)
                        .then(function(res) {
                            var msg = 'Successful authorization for Twitter account "'+res.screen_name+'".\n\n';
                            msg += 'You may now send tweets (on behalf of "'+res.screen_name+'").'
                            MakerApp.inform(msg);
                        })
                        .fail(function(error) {
                            MakerApp.inform("Authorization failed");
                        })
                    }
                ).prompt(
                    "Twitter PIN",
                    'PIN number you get from browser page' ,
                    myself.world()
                );
            })
            .fail(function() {
                MakerApp.inform("Could not connect to Twitter API, check Internet connevctivity");
            });


        },
        "Authorize Twitter Account"
    );


    SpriteMorph.prototype.blocks.makersAutoconnectArduino =
    {
        type: 'command',
        category: 'makers',
        spec: 'auto connect arduino'
    };

    SpriteMorph.prototype.blocks.makersDisConnectArduino =
    {
        type: 'command',
        category: 'makers',
        spec: 'disconnect arduino'
    };

    SpriteMorph.prototype.blocks.makersArduinoState =
    {
        type: 'reporter',
        category: 'makers',
        spec: 'arduino state'
    };


    SpriteMorph.prototype.blocks.makersIsConnectedArduino =
    {
        type: 'predicate',
        category: 'makers',
        spec: 'arduino is connected'
    };

    SpriteMorph.prototype.blocks.makersBuzzer =
    {
        type: 'command',
        category: 'makers',
        spec: 'buzzer at %buzzerval'
    };

    SpriteMorph.prototype.blocks.makersLedOn =
    {
        type: 'command',
        category: 'makers',
        spec: 'led on'
    };


    SpriteMorph.prototype.blocks.makersLedOff =
    {
        type: 'command',
        category: 'makers',
        spec: 'led off'
    };

    SpriteMorph.prototype.blocks.makersPotentiometer =
    {
        type: 'reporter',
        category: 'makers',
        spec: 'potentiometer'
    };
 
    SpriteMorph.prototype.blocks.makersTemperature =
    {
        type: 'reporter',
        category: 'makers',
        spec: 'temperature'
    };

    SpriteMorph.prototype.blocks.makersAudio =
    {
        type: 'reporter',
        category: 'makers',
        spec: 'audio'
    };

    SpriteMorph.prototype.blocks.makersLight =
    {
        type: 'reporter',
        category: 'makers',
        spec: 'light'
    };


 
    SpriteMorph.prototype.blocks.makersSwitch =
    {
        type: 'predicate',
        category: 'makers',
        spec: 'switch'
    };
    
    // Redirects user to a web page (on local brower) for getting a PIN number from Twitter
    SpriteMorph.prototype.blocks.makersGetTwitterPin =
    {
        type: 'reporter',
        category: 'makers',
        spec: 'get Tweeter pin'
    };

    SpriteMorph.prototype.blocks.makersSetTwitterPin =
    {
        type: 'command',
        category: 'makers',
        spec: 'set Tweeter pin %s'
    };

    SpriteMorph.prototype.blocks.makersSendTweet =
    {
        type: 'command',
        category: 'makers',
        spec: 'send Tweet %s'
    };

    // *this* will either be StageMorph or SpriteMorph
    var blocks = this.originalBlockTemplates_Makers(category); 

    function blockBySelector(selector) {
        var newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        return newBlock;
    }

    // SriteMorph.prototype.makersNNN are used for updating information
    // on "Watchers"  (Sprites displayed on stage to monitor values)
    SpriteMorph.prototype.makersArduinoState = function () {
        var state;

        if (MakerApp.connecting) {
            state = "connecting";
        } else if (MakerApp.isBoardConnected()) {
            state = "connected";
        } else {
            state = "disconnected";
        }

        return (state);
    };

    SpriteMorph.prototype.makersTemperature = function () {
        var board = this.arduino.board;
        if (MakerApp.isBoardConnected()) {
            var val;
            var pin = 3;

            if (board.pins[board.analogPins[pin]].mode != board.MODES.ANALOG) {
                board.pinMode(board.analogPins[pin],board.MODES.ANALOG);
            }
            val =  board.pins[board.analogPins[pin]].value;
            return MakerApp.convertAnalogMeasure.temperatureLW35(val);
        } else {
            return null;
        }
    };

    SpriteMorph.prototype.makersLight = function () {
        var board = this.arduino.board;
        if (MakerApp.isBoardConnected()) {

            var val;
            var pin = 2;

            if (board.pins[board.analogPins[pin]].mode != board.MODES.ANALOG) {
                board.pinMode(board.analogPins[pin],board.MODES.ANALOG);
            }
            val =  board.pins[board.analogPins[pin]].value;
            return MakerApp.convertAnalogMeasure.light(val);
        } else {
            return null;
        }

    };

    SpriteMorph.prototype.makersAudio = function () {
        var board = this.arduino.board;
        if (MakerApp.isBoardConnected()) {

            var val;
            var pin = 0;

            if (board.pins[board.analogPins[pin]].mode != board.MODES.ANALOG) {
                board.pinMode(board.analogPins[pin],board.MODES.ANALOG);
            }
            val =  board.pins[board.analogPins[pin]].value;
            return MakerApp.convertAnalogMeasure.audio(val);
        } else {
            return null;
        }

    };

    SpriteMorph.prototype.makersPotentiometer = function () {
        var board = this.arduino.board;
        if (MakerApp.isBoardConnected()) {

            var val;
            var pin = 1;

            if (board.pins[board.analogPins[pin]].mode != board.MODES.ANALOG) {
                board.pinMode(board.analogPins[pin],board.MODES.ANALOG);
            }
            val =  board.pins[board.analogPins[pin]].value;
            return MakerApp.convertAnalogMeasure.potentiometer(val);
        } else {
            return null;
        }

    };

    if (category === 'makers') {
        blocks.push(arduinoConnectButton);
        blocks.push(arduinoDisConnectButton);
        blocks.push(watcherToggle('makersArduinoState'));
        blocks.push(blockBySelector('makersArduinoState'));
        blocks.push(blockBySelector('makersIsConnectedArduino'));
        blocks.push('-');
        blocks.push(blockBySelector('makersLedOn'));
        blocks.push(blockBySelector('makersLedOff'));
        blocks.push(blockBySelector('makersBuzzer'));
        blocks.push('-');
        blocks.push(watcherToggle('makersTemperature'));
        blocks.push(blockBySelector('makersTemperature'));
        blocks.push(watcherToggle('makersLight'));
        blocks.push(blockBySelector('makersLight'));
        blocks.push(watcherToggle('makersAudio'));
        blocks.push(blockBySelector('makersAudio'));
        blocks.push(watcherToggle('makersPotentiometer'));
        blocks.push(blockBySelector('makersPotentiometer'));
        blocks.push('-');
        blocks.push(blockBySelector('makersSwitch'));
        blocks.push('-');
        blocks.push(tweetButton);
        blocks.push(blockBySelector('makersSendTweet'));

        // Toggle (display) ArduinoState watcher
        var arduinoStateInfo = SpriteMorph.prototype.blocks['makersArduinoState'];
        myself.toggleWatcher(
                    'makersArduinoState',
                    localize(arduinoStateInfo.spec),
                    myself.blockColor[arduinoStateInfo.category]
                );
 


    }

    return blocks;
}

StageMorph.prototype.blockTemplates = overridenBlockTemplates;
SpriteMorph.prototype.blockTemplates = overridenBlockTemplates;
