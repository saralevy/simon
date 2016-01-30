angular.module('myApp', [])

.controller('MainCtrl', function($timeout) {
    var self = this;
    window.simon = this;

    self.simonGameArray = [];
    self.userGameArray = [];
    self.numKeysInSimonGame = 0;
    self.numKeysInUserGame = 0;
    self.activeGame = false;
    self.result = "Welcome to Simon";
    self.simonsTurn = true;

    self.boxes = [{
        color: 'red',
        active: false
    },{
        color: 'blue',       
        active: false
    },{
        color: 'green',
        active: false
    },{
        color: 'yellow',
        active: false
    }];

    self.createSimonEntry = function() {
        self.activeGame = true;

        //disable keys
        self.simonsTurn = true;

        //create a new key
        createNewSimonKey();

        //display Simon's keys
        self.showSimonSequence();

        //enable keys
        self.simonsTurn = false;

        //wait 5 seconds for user to respond or end game
        self.fiveSecondsPassed = false; 
        $timeout(function() { 
            self.fiveSecondsPassed = true; 
        }, 5000);
    }

    self.showSimonSequence = function() {
        self.simonGameArray.forEach(function (sequence, index) {
            $timeout(function() {
                self.boxes.forEach(function(box) {
                    box.active = false;
                });
                self.boxes[sequence].active = true;
            }, 1500 * index)
            .then(function() {
                //handle multiples of same color in a row by including
                //a .5 second pause with inactive opacity of .6
                $timeout(function() {
                    self.boxes[sequence].active = false;
                }, 500 * index);
            });
        });
    }

    self.keyPressed = function(color) {
        //record which key was pressed and increment counter
        self.userGameArray.push(color);
        self.numKeysInUserGame++;
        self.fiveSecondsPassed = false; 

        if ( self.numKeysInUserGame == self.numKeysInSimonGame ) {
            //user has pressed the correct number of keys 
            checkKeysPressed();
        };
    };

    function createNewSimonKey() {
        //generate a random number between 0 and 3
        var newColor = Math.floor(Math.random() * 4); 

        //record which key was pressed
        self.simonGameArray.push(newColor);

        //increment numKeysInGame
        self.numKeysInSimonGame++;
    };

    function checkKeysPressed() {
        for(i=0; i<self.numKeysInSimonGame; i++) {
            if( self.userGameArray[i] != self.simonGameArray[i] ) {
                $timeout(function() { self.result = "You Lost, Try Again!"; }, 2000);
                self.endGame();
            }
        }
        //max 15 keys
        if (self.numKeysInSimonGame == 15) {
            $timeout(function() { self.result = "You Won, Good Game!"; }, 2000);
            self.endGame();
        } else {
            $timeout(function() { self.userGameArray = []; }, 2000);
            self.numKeysInUserGame = 0;
            self.createSimonEntry();
        }        
    };

    self.endGame = function() {
        self.result = "Would you like to play again (Y/N)?";
        if( self.result == 'Y' || self.result == 'y') {
            self.simonGameArray = [];
            self.userGameArray = [];
            self.numKeysInSimonGame = 0;
            self.numKeysInUserGame = 0;
            self.activeGame = true;
            self.result = "Welcome to Simon";
            self.fiveSecondsPassed = false;
            createSimonEntry();
        }
    };
});