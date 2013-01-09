function WordChecker(){

    var possibleWordsToPlay = [];
    var validWords;
    var board;

    this.getPotentialWord = function(indexes){
        return board.getWord(indexes);
    };

    this.addPotentialWord = function (indexes){
        var potentialWord = this.getPotentialWord(indexes);
        if (validWords.isInList(potentialWord)){
            possibleWordsToPlay.push(potentialWord);
            return true;
        } else {
            return false;
        }
    };

    this.setWordList = function(wordList){
        validWords = wordList;
    };

    this.setInitialBoard = function(initialBoard){
        board = initialBoard;
    };

    this.nonRecursivePermute = function (indexes){
        var numberOfPermutations = 1;
        var numberOfItems = indexes.length;
        for (var i = 1; i <= numberOfItems; numberOfPermutations *= i++ ){
            //TODO: better way? sum formula? 25 operations is child's play though
        }
        for (var j = 0; j < numberOfPermutations; j++){
            var itemsCopy = indexes.slice();
            var permutation = [];
            for (var k = numberOfItems, div = numberOfPermutations; k > 0; k--){
                div/=k;
                var index = Math.floor(j/div)%k;
                permutation.push(itemsCopy[index]);
                itemsCopy[index] = itemsCopy[k-1];
            }
            this.addPotentialWord(permutation);
        }
    };

    this.getPossibleWordsToPlay = function(){
        return possibleWordsToPlay;
    };


    this.ithPermutation = function(items, permutationIndex){
        var numberOfEntries = items.length;
        var k = 0;
        var fact = [];
        var perm = [];
        fact[k] = 1;
        while (++k < numberOfEntries){
            fact[k] = fact[k-1]*k;
        }

        for (k = 0; k < numberOfEntries; k++){
            perm[k] = Math.floor(permutationIndex / fact[numberOfEntries - 1 - k]);
            permutationIndex = permutationIndex % fact[numberOfEntries - 1 - k];
        }

        for (k = numberOfEntries - 1; k > 0; --k){
            for (var j = k - 1; j >= 0; --j){
                if (perm[j] <= perm[k]){
                    perm[k]++;
                }
            }
        }

        var result = [];
        for (var i = 0; i < items.length;i++){
            result.push(items[perm[i]]);
        }
        return result;
    };

    this.findCombinations = function(items, start, end){
        var result = [];

        for (var i = start; i <= end; i++){
            result.concat(this.loop(items,0,i,[]));
        }

        return result;
    };


    this.loop = function(items,start, depth, prefix){
        var result = [];
        for (var i = start; i < items.length; i++){
            var next = prefix.concat(items[i]);
            if (depth > 0){
                loop(items,i+1, depth-1, next);
            } else {
                result.concat(this.nonRecursivePermute(next));
            }
        }
        return result;
    }

}




