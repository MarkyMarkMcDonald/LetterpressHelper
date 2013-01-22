var middleWeight = 1;
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

    this.setType = function(){
        // Set the Type (middle/edge/corner)
        this.type = Type.MIDDLE;

        if (index < 5 ){
            this.type = Type.TOP_EDGE;
        } else if (index % 5 == 0){
            this.type = Type.LEFT_EDGE;
        } else if (index % 5 == 4){
            this.type = Type.RIGHT_EDGE;
        } else if (index > 19){
            this.type = Type.BOTTOM_EDGE;
        }

        if (index == 0 ){
            this.type = Type.TOP_LEFT_CORNER;
        } else if (index == 4){
            this.type = Type.TOP_RIGHT_CORNER;
        } else if (index == 20){
            this.type = Type.BOTTOM_LEFT_CORNER;
        } else if (index == 24){
            this.type = Type.BOTTOM_RIGHT_CORNER;
        }
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
    this.lastPlayedWord = [];
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

            var left = this.letters[(i-1)%this.letters.length];
            var right = this.letters[(i+1)%this.letters.length];
            var down = this.letters[(i+5)%this.letters.length];
            var up = this.letters[(i-5)%this.letters.length];

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
    };

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
            case GeneralType.MIDDLE:
                value += direction * middleWeight;
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

    };

    /**
     * Finds a single possible way to play a word.
     * Returns indexes
     * @param word
     */
    this.findWayToPlayWord = function(word){
        var indexes = [];
        // Loop over each letter in the word being checked
        for (var i = 0; i < word.length; i++){
            var j = 0;
            var foundValidIndex = false;
            // Loop over the board to find the letter we're currently looking for
            while (j < letters.length && !foundValidIndex){
                if (letters[j].value == word.charAt(i)){
                    // On a match, make sure we haven't used this index yet, and then add it to the indexes;
                    var index = letters[j].index;
                    if (indexes.indexOf(index) == -1){
                        foundValidIndex = true;
                        indexes.push(index);
                    }
                }
                j += 1;
            }
        }
        return indexes;
    };

    /**
     * Returns a new board representing what would happen if a word was played
     * @param indexes
     */
    this.playWord = function(indexes){
        // Create a copy of the board
        var placeholderBoard = clone(this);

        // "Play" the indexes given
        for (var i = 0; i < indexes.length; i++){
            var index = indexes[i];
            // If the letter isn't locked, set it to Mine
            if (!placeholderBoard.letters[index].locked){
                placeholderBoard.letters[index].claim = Claim.MINE;
            }
        }
        this.lastPlayedWord = indexes;
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
    };
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
    var chosenLetters;

    var wordSuggestions = $('#wordSuggestions');
    var topBoards = [];
    $('#getResult').on('click',function(){
        var lettersGiven = [];
        var indexes = [];
        var filledOut = true;

        // determine which letters were given
        letterElements.each(function(index,element){
            indexes.push(index);
            element = $(element);
            //noinspection JSValidateTypes
            var character = element.children('p').text();
            if (character === ""){
                filledOut = false;
            }

            // Create a letter
            var letter = new Letter(character,index);

            // Set the type
            letter.setType();

            // Set the claim
            if (element.hasClass("selected-mine")){
                letter.claim = Claim.MINE;
            } else if (element.hasClass("selected-theirs")){
                letter.claim = Claim.THEIRS;
            } else {
                letter.claim = Claim.NONE;
            }

            // Add the letter to the array that the board will be based off of
            lettersGiven.push(letter);
        });

        if (!filledOut){
            // TODO: Turn this into an error message box
            alert("Please fill out every letter")
        } else {
            var initialBoard = new Board(lettersGiven);
            initialBoard.setLocked();
            topBoards = getTopBoards(initialBoard,dictionary);
            wordSuggestions.find('div').remove();
            for (var i = 0; i < topBoards.length; i++){
                var board = topBoards[i].object;
                var wordSuggestion = $("<div></div>")
                    .addClass("wordSuggestion")
                    .attr("priority",topBoards[i].priority)
                    .attr("index",i);
                wordSuggestion.html("<li></li>").text(board.getWord(board.lastPlayedWord));
                bindHoverEmphasis(wordSuggestion);
                wordSuggestions.prepend(wordSuggestion);
            }
        }
    });

    // Create hover that uses topBoards[index attr] to add emphasis to indexes
    function bindHoverEmphasis(elementToBind){
        elementToBind.hover(function(){
            $this = $(this);
            var hoveredWordIndex = $this.attr("index");
            // Indexes of letters to be emphasized
            var chosenLetterIndexes = topBoards[hoveredWordIndex].object.lastPlayedWord;
            // Elements to be emphasized
            chosenLetters = $.grep(letterElements, function(arrayItem,index){
                return $.inArray(index,chosenLetterIndexes) != -1;
            });
            // Emphasize!

            $(chosenLetters).removeClass("unclaimed").addClass("chosen-letter");
        }, function(){
            // Remove Emphasis!
            $(chosenLetters).addClass("unclaimed").removeClass("chosen-letter");
        })
    }
});
