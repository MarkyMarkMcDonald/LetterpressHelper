$(function(){
    var edgeWeight = 2;
    var cornerWeight = 3;
	var lockedWeight = 2;
    var letterElements = $('#letterElements').find('.letter');

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
    }

    /**
     * Pseudo Enum describing where the tile is generally on the board
     * @type {Object}
     */
    var GeneralType = {
        MIDDLE: 0,
        EDGE: 1,
        CORNER: 2
    }

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

        this.isClaimed = function(){
            return this.claim != Claim.NONE;
        }

        this.getGeneralType = function(){
            if (this.type == Type.MIDDLE){
                return GeneralType.MIDDLE;
            } else if (this.type > 0 && this.type < 5){
                return GeneralType.EDGE;
            } else if (this.type > 4 && this.type < 9){
                return GeneralType.CORNER;
            }
        }
    }

    function Board(letters){

        this.letters = letters;

        this.setLocked = function (){
            for (var i = 0; i < this.letters.length; i++){

                var letter = this.letters[i];

                var left = letters[(i-1)%letters.length];
                var right = letters[(i+1)%letters.length];
                var down = letters[(i+5)%letters.length];
                var up = letters[(i-5)%letters.length];

                switch (letter.type){
                    case Type.MIDDLE:
                        if (left.isClaimed() && right.isClaimed() && down.isClaimed() && up.isClaimed()){
                            letter.locked = true;
                        }
                        break;
                    case Type.LEFT_EDGE:
                        if (right.isClaimed() && down.isClaimed() && up.isClaimed()){
                            letter.locked = true;
                        }
                        break;
                    case Type.RIGHT_EDGE:
                        if (left.isClaimed() && down.isClaimed() && up.isClaimed()){
                            letter.locked = true;
                        }
                        break;
                    case Type.BOTTOM_EDGE:
                        if (left.isClaimed() && right.isClaimed() && up.isClaimed()){
                            letter.locked = true;
                        }
                        break;
                    case Type.TOP_EDGE:
                        if (left.isClaimed() && right.isClaimed() && down.isClaimed()){
                            letter.locked = true;
                        }
                        break;
                    case Type.TOP_LEFT_CORNER:
                        if (right.isClaimed() && down.isClaimed()){
                            letter.locked = true;
                        }
                        break;
                    case Type.TOP_RIGHT_CORNER:
                        if (left.isClaimed() && down.isClaimed()){
                            letter.locked = true;
                        }
                        break;

                    case Type.BOTTOM_LEFT_CORNER:
                        if (right.isClaimed() && up.isClaimed()){
                            letter.locked = true;
                        }
                        break;

                    case Type.BOTTOM_RIGHT_CORNER:
                        if (left.isClaimed() && up.isClaimed()){
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
         * Returns a new board representing what would happen if a word was played
         * @param indexes
         */
        this.playWord = function (indexes){
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
    }


	$('.getResult').on('click',function(){
        var lettersGiven = [];
        var filledOut = true;

        letterElements.each(function(index,element){
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
                letter.claim = Claim.THEIRS;
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
            initialBoard.setLocked();


        }
    });




});
