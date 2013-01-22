/*
 * 1. Convert available letters to array of frequencies
 * 2. Test Each word in the dictionary to see if it can be made
 *      i) If it can, see if it can be made multiple ways
 *      ii) Figure out which word is higher rated
 * 3. Add word to Priority Queue containing top X words
 */
function wordCanBePlayed(word, board){
    var availableLetterFrequencies = board.frequencies;
    var letterFrequencies = {};

    for (var key in availableLetterFrequencies){
        if (availableLetterFrequencies.hasOwnProperty(key)) {
            letterFrequencies[key] = availableLetterFrequencies[key];
        }
    }

    for (var i = 0; i < word.length; i++){
        var letterFrequency = letterFrequencies[word.charAt(i)];
        if (letterFrequency == undefined || letterFrequency == 0){
            return false;
        } else {
            letterFrequencies[word.charAt(i)]--;
        }
    }
    return true;
}

function getTopBoards(initialBoard, dictionary){
    options = {low:true};
    var topBoards = new PriorityQueue(options);
    for (var i = 0; i < dictionary.length; i++){
        if (wordCanBePlayed(dictionary[i],initialBoard)){
            var indexes = initialBoard.findWayToPlayWord(dictionary[i]);
            var board = initialBoard.playWord(indexes);
            board.setLocked();
            var boardValue = board.getBoardValue();
            // TODO: only keep top 10
            if (topBoards.size() > 4){
                if (boardValue > topBoards.topPriority()){
                    topBoards.pop();
                    topBoards.push(board,boardValue);
                }
            } else {
                topBoards.push(board,boardValue);
            }
        }
    }
    return topBoards.getContents();
}

function basicDictionaryAndLettersTest(){
    var indexes = [];
    var letters = [];
    var letter;

    for (var i = 'A', j = 0; j < 25; i = String.fromCharCode(i.charCodeAt(0) + 1),j++){
        letter = new Letter(i,j);
        letter.setType();
        letters.push(letter);
        indexes.push(j);
    }
    var board = new Board(letters);

    var dictionary = [];
    dictionary.push("ABF");
    dictionary.push("ABC");
    dictionary.push("AFGK");
    dictionary.push("ABCDEFGHIJKLMNOPQRSTUV");

    topBoards = getTopBoards(board,dictionary);

    return topBoards;
}
