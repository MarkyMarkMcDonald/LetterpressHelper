$(function(){

	var letterElements = $('#letterElements .letter');

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
     * Represents a letter tile on the board
     *
     * @param value "A", "B", "C"
     * @param claim "mine", "theirs", "none"
     * @param index
     * @param locked boolean for surrounded by same type
     */
    function letter(value, index, claim, locked){
        this.value = value;
        this.index = index;
        this.claim = claim;
        this.locked = locked;
    }

    function board(letters){

        this.letters = letters;

        function getPointsValue(letter){
            var value;
            switch (letter.claim){
                case Claim.NONE:
                    value = 1;
                    break;
                case Claim.MINE:
                    value = 0;
                    break;
                case Claim.THEIRS:



            }

        }
    }


	$('.getResult').on('click',function(){
        var lettersGiven = "";
        var filledOut = true;

        letterElements.each(function(index,element){
            element = $(element);
            var letter = element.children('p').text();
            if (letter === ""){
                filledOut = false;
            }
            lettersGiven += letter;
            if (element.hasClass("selected-mine")){
                lettersGiven += "m";
            } else if (element.hasClass("selected-theirs")){
                lettersGiven += "t";
            }
            lettersGiven += " ";

        });
        if (filledOut){
            alert("String to send to backend: " + lettersGiven);
        } else {
            // TODO: Turn this into an error message box
            alert("Please fill out every letter")
        }


    });




});
