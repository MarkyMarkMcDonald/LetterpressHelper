function Node(letter){
	this.letter = letter;
	var validContinuations = [];


	/**
     * Gets the Node containing the next character as it's letter. Returns null if there isn't a node for that letter yet.
     * @return the next Node, or null if no Node with that character yet.
     */
	this.getContinuation = function(letter){
	    for (var i = 0; i < validContinuations.length; i++) {
    		if (validContinuations[i].letter == letter){
	            return validContinuations[i];
	        }
	    }
	    return null;
	}

	/**
     * Add the character as a valid continuation and return the new Node. If a node with that character already exists, just return the current one.
     * @return
     */
    this.addContinuation = function(letter){
        var existingContinuation = this.getContinuation(letter);
        if (existingContinuation == null){
            var newNode = new Node(letter);
            validContinuations.push(newNode);
            return newNode;
        } else {
            return existingContinuation;
        }
    }
}

function DAGWordList(){
	var root = new Node(null);

	this.addWord = function(word){
		var rootPlaceholder = root;
		for (var i = 0; i < word.length; i++){
			rootPlaceholder = rootPlaceholder.addContinuation(word.charAt(i));
		}
		rootPlaceholder.addContinuation(null);
	}

	this.isInList = function(word){
		var rootPlaceholder = root;
		for (var i = 0; i < word.length; i++){
			var nextNode = rootPlaceholder.getContinuation(word.charAt(i));
			if (nextNode == null){
				return false;
			} else {
				rootPlaceholder = nextNode;
			}
		}
        // Take care of false validation for partial chain ("rea" shouldn't return true if only "reads" is in the list)
		return rootPlaceholder.getContinuation(null) != null;
	}
}

function simpleTest(){
    var dagWordList = new DAGWordList();
    dagWordList.addWord("read");
    dagWordList.addWord("reading");
    dagWordList.addWord("reader");
    dagWordList.addWord("reads");
    alert("read: " +  dagWordList.isInList("read") + " reading: " +  dagWordList.isInList("reading") + " reader: " +  dagWordList.isInList("reader") + " reads: " +  dagWordList.isInList("reads") + " reades: " +  dagWordList.isInList("reades") + " readings: " +  dagWordList.isInList("readings"));
}


