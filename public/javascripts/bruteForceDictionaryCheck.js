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

function getTopBoards(initialBoard){
    var topBoards = new PriorityQueue();
    var words = ["READ","AA","READS"];
    for (var i = 0; i < words.length; i++){
        if (wordCanBePlayed(words[i],board)){
            var board = initialBoard.playWord()
        }
    }
}

function basicDictionaryAndLettersTest(){
    var indexes = [];
    var letters = [];
    var letter;

    for (var i = 'A', j = 0; j<25; i = String.fromCharCode(i.charCodeAt(0) + 1),j++){
        letter = new Letter(i,j);
        letters.push(letter);
        indexes.push(j);
    }
    var board = new Board(letters);

    console.log(wordCanBePlayed("READ",board));
    console.log(wordCanBePlayed("AA",board));
    console.log(wordCanBePlayed("READS",board));
}
