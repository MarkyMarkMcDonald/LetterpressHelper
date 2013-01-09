
    var edgeWeight = 2;
    var cornerWeight = 3;
	var lockedWeight = 2;
    var letterElements = $('#letters').find('.letter');

    /**
     * Pseudo Enum describing which player controls a letter
     * @type {Object}
     */
    var Claim = {
        NONE: 0,
        MINE: 1,
        THEIRS: 2
    };

    /**
     * Pseudo Enum describing where the tile is on the board
     * @type {Object}
     */
    var Type = {
        MIDDLE: 0,
        TOP_EDGE: 1,
        BOTTOM_EDGE: 2,
        LEFT_EDGE: 3,
        RIGHT_EDGE: 4,
        TOP_LEFT_CORNER: 5,
        TOP_RIGHT_CORNER: 6,
        BOTTOM_LEFT_CORNER: 7,
        BOTTOM_RIGHT_CORNER: 8
    };

    /**
     * Pseudo Enum describing where the tile is generally on the board
     * @type {Object}
     */
    var GeneralType = {
        MIDDLE: 0,
        EDGE: 1,
        CORNER: 2
    };

    /**
     * Represents a letter tile on the board
     *
     * @param value "A", "B", "C"
     * @param index
     */
    function Letter(value, index){
        this.value = value;
        this.index = index;
        // Default to Not Locked
        this.locked = false;
        // Default to Not Claimed
        this.claim = Claim.NONE;

        /**
         * Checks to see if another claim is there and matches this one
         * @param claim
         * @return {boolean}
         */
        this.claimMatches = function(claim){
            return this.claim != Claim.NONE && this.claim == claim;
        };

        this.getGeneralType = function(){
            if (this.type == Type.MIDDLE){
                return GeneralType.MIDDLE;
            } else if (this.type > 0 && this.type < 5){
                return GeneralType.EDGE;
            } else if (this.type > 4 && this.type < 9){
                return GeneralType.CORNER;
            } else {
                // throw exception?
                throw {
                    name: "Type Error",
                    message: "base type (lower left corner, right side, etc) is not found"
                };
            }
        }
    }

    function Board(letters){

        this.letters = letters;
        this.computeFrequencies = function(boardLetters){
            // TODO: store list of indexes along with frequency
            var letters = {};
            for (var i = 0; i < boardLetters.length; i++){
                var charCode = boardLetters[i].value;
                if (letters[charCode] == undefined){
                    letters[charCode] = 1;
                } else {
                    letters[charCode]++;
                }
            }
            return letters;
        };

        this.frequencies = this.computeFrequencies(this.letters);

        this.setLocked = function (){
            for (var i = 0; i < this.letters.length; i++){

                var letter = this.letters[i];

                var left = letters[(i-1)%letters.length];
                var right = letters[(i+1)%letters.length];
                var down = letters[(i+5)%letters.length];
                var up = letters[(i-5)%letters.length];

                switch (letter.type){
                    //TODO: Change this to see if claim type matches (but not none matching none)
                    case Type.MIDDLE:
                        if (left.claimMatches(letter.claim) && right.claimMatches(letter.claim) && down.claimMatches(letter.claim) && up.claimMatches(letter.claim)){
                            letter.locked = true;
                        }
                        break;
                    case Type.LEFT_EDGE:
                        if (right.claimMatches(letter.claim) && down.claimMatches(letter.claim) && up.claimMatches(letter.claim)){
                            letter.locked = true;
                        }
                        break;
                    case Type.RIGHT_EDGE:
                        if (left.claimMatches(letter.claim) && down.claimMatches(letter.claim) && up.claimMatches(letter.claim)){
                            letter.locked = true;
                        }
                        break;
                    case Type.BOTTOM_EDGE:
                        if (left.claimMatches(letter.claim) && right.claimMatches(letter.claim) && up.claimMatches(letter.claim)){
                            letter.locked = true;
                        }
                        break;
                    case Type.TOP_EDGE:
                        if (left.claimMatches(letter.claim) && right.claimMatches(letter.claim) && down.claimMatches(letter.claim)){
                            letter.locked = true;
                        }
                        break;
                    case Type.TOP_LEFT_CORNER:
                        if (right.claimMatches(letter.claim) && down.claimMatches(letter.claim)){
                            letter.locked = true;
                        }
                        break;
                    case Type.TOP_RIGHT_CORNER:
                        if (left.claimMatches(letter.claim) && down.claimMatches(letter.claim)){
                            letter.locked = true;
                        }
                        break;

                    case Type.BOTTOM_LEFT_CORNER:
                        if (right.claimMatches(letter.claim) && up.claimMatches(letter.claim)){
                            letter.locked = true;
                        }
                        break;

                    case Type.BOTTOM_RIGHT_CORNER:
                        if (left.claimMatches(letter.claim) && up.claimMatches(letter.claim)){
                            letter.locked = true;
                        }
                        break;
                }
            }
        }

        /**
         * Calculate the value of a single tile based on:
         * 1. Who owns it
         * 2. If it's an edge or corner piece
         * 3. If it's locked in
         *  TODO: The number of tiles surrounding it of the same type instead of locked in
         * @param index
         */
        this.getPointsValue = function (index) {
            var value = 0;
            var letter = this.letters[index];
            var direction;

            // Determine if this letter should count towards or against the player (1)
            switch (letter.claim) {
                case Claim.NONE:
                    direction = 0;
                    break;
                case Claim.MINE:
                    direction = 1;
                    break;
                case Claim.THEIRS:
                    direction = -1;
                    break;
            }

            // (2)
            switch (letter.getGeneralType()) {
                case GeneralType.EDGE:
                    value += direction * edgeWeight;
                    break;
                case GeneralType.CORNER:
                    value += direction * cornerWeight;
                    break;
            }

            // (3)
            if (letter.locked) {
                value += direction * lockedWeight;
            }

            return value;
        };

        /**
         * Calculate the total value of a board by adding up all the points values
         * @return {number}
         */
        this.getBoardValue = function(){
            var sum = 0;
            for (var i=0;i< this.letters.length; i++){
                sum += this.getPointsValue(i);
            }
            return sum;
        };

        /**
         * Finds possible ways to play a word
         * @param word
         */
        this.findWaysToPlayWord = function (word){
            var ways = []; // filled with arrays containing index choices

            /*
            Compare Word Frequencies to find possible pivots
             */
            var letters = [];
            for (var i = 0; i < word.length; i++){
                letters.push(new Letter(word.charAt(i),i));
            }
            var wordFrequencies = this.computeFrequencies(letters);

            for (var key in wordFrequencies){
                if (wordFrequencies.hasOwnProperty(key)){

                }
            }

        }

        /**
         * Returns a new board representing what would happen if a word was played
         * @param indexes
         */
        this.playWord = function(indexes){
            var placeholderBoard = this;
            for (var i = 0; i < indexes.length; i++){
                var index = indexes[i];
                // If the letter isn't locked, set it to Mine
                if (!placeholderBoard.letters[index].locked){
                    placeholderBoard.letters[index].claim = Claim.MINE;
                }
            }
            return placeholderBoard;
        };

        /**
         * returns a string formed from letters at at the indexes
         * @param indexes which letters to form the word from
         */
        this.getWord = function(indexes){
            var result = "";
            for(var i = 0; i < indexes.length; i++){
                result += letters[indexes[i]].value;
            }
            return result;
        }
    }

    function testPermutations(){
        var wordList = new DAGWordList(); // Set up Word List
        wordList.addWord("AED");
        wordList.addWord("CED");
        wordList.addWord("BE");
        wordList.addWord("ABCDEFG");
        wordList.addWord("ABCDEF");
        wordList.addWord("ABCDEFGH");
        var wordChecker = new WordChecker();
        wordChecker.setWordList(wordList);

        var indexes = [];
        var letters = [];
        var letter;
        for (var i = 'A', j = 0; j<25; i = String.fromCharCode(i.charCodeAt(0) + 1),j++){
            letter = new Letter(i,j);
            letters.push(letter);
            indexes.push(j);
        }

        var initialBoard = new Board(letters);
        wordChecker.setInitialBoard(initialBoard);
        wordChecker.findCombinations(indexes,2,2);
        console.log(wordChecker.getPossibleWordsToPlay());
    }


$(function(){
    $('#getResult').on('click',function(){
        var lettersGiven = [];
        var indexes = [];
        var filledOut = true;

        letterElements.each(function(index,element){
            indexes.push(index);
            element = $(element);
            //noinspection JSValidateTypes
            var character = element.children('p').text();
            // Create a letter
            var letter = new Letter(character,index);
            if (character === ""){
                filledOut = false;
            }

            // Set the claim
            if (element.hasClass("selected-mine")){
                letter.claim = Claim.MINE;
            } else if (element.hasClass("selected-theirs")){
                letter.claim = Claim.THEIRS;
            } else {
                letter.claim = Claim.NONE;
            }

            // Set the Type (middle/edge/corner)
            letter.type = Type.MIDDLE;

            if (index < 5 ){
                letter.type = Type.TOP_EDGE;
            } else if (index % 5 == 0){
                letter.type = Type.LEFT_EDGE;
            } else if (index % 5 == 4){
                letter.type = Type.RIGHT_EDGE;
            } else if (index > 19){
                letter.type = Type.BOTTOM_EDGE;
            }

            if (index == 0 ){
                letter.type = Type.TOP_LEFT_CORNER;
            } else if (index == 4){
                letter.type = Type.TOP_RIGHT_CORNER;
            } else if (index == 20){
                letter.type = Type.BOTTOM_LEFT_CORNER;
            } else if (index == 24){
                letter.type = Type.BOTTOM_RIGHT_CORNER;
            }

            // Add the letter to the array that the board will be based off of
            lettersGiven.push(letter);
        });
        if (!filledOut){
            // TODO: Turn this into an error message box
            alert("Please fill out every letter")
        } else {
            var initialBoard = new Board(lettersGiven);

            initialBoard.setLocked(); // Set up initial board
            console.log(initialBoard);

            var wordList = new DAGWordList(); // Set up Word List
            var wordChecker = new WordChecker();
            wordChecker.setWordList(wordList);
            wordChecker.setInitialBoard(initialBoard);

            wordList.addWord("READ"); // generate word bank
            wordList.addWord("READER"); //TODO: Make this load from dictionary + start during page load
            wordList.addWord("READS");
            wordList.addWord("RE");
            wordList.addWord("R");
            wordList.addWord("READING");

            console.log("permuted items");
            wordChecker.findCombinations(indexes,4,4);
            console.log("Possible 4 Letter Words Found:");
            console.log(wordChecker.getPossibleWordsToPlay());
        }
    });

    $('#testPermutations').on('click',function(){

//        var wordList = new DAGWordList(); // Set up Word List
        var wordChecker = new WordChecker();
//        wordChecker.setWordList(wordList);
//
//        wordList.addWord("read"); // generate word bank
//        wordList.addWord("reader"); //TODO: Make this load from dictionary + start during page load
//        wordList.addWord("reading");
//        wordList.addWord("reads");
//        wordList.addWord("beds");
//        wordList.addWord("boring");
//        wordList.addWord("unfortunate");

        var items = $('#testCase').val().split(',');
        console.log("permuted items");
//        wordChecker.permute(items);
        console.log("Possible 4 Letter Words Found:");
        console.log(wordChecker.getPossibleWordsToPlay());

    });


});
