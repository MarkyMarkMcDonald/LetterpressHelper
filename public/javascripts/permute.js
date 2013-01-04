function wordChecker(){

    var permutations = [];
    var wordList;
    /**
     * Adds permutations to the permutations array if they are valid words
     * @param items array of items to be permuted
     */
    this.permute = function (items){
        switch (items.length){
            case 1:
                addPotentialWord(items);
                break;
            default:
                var smallerItems = items.slice();
                var removedItem = smallerItems.splice(0,1)[0];
                var permutedItems = permute(smallerItems);
                var permutedItemsWithRemovedItem;
                for (var j = 0; j < permutedItems.length; j++) {
                    for (var k = 0; k <= permutedItems[0].length; k++) {
                        permutedItemsWithRemovedItem = permutedItems[j].slice(); //We're going to slice from 1 deep in order to avoid shallow copy issues
                        permutedItemsWithRemovedItem.splice(k,0,removedItem);
                        addPotentialWord(permutedItemsWithRemovedItem);
                    }
                }
                break;
        }
        return permutations;
    }

    this.addPotentialWord = function (potentialWord){
        if (wordList.isInList(potentialWord)){
            permutations.push(potentialWord)
        }
    }

    this.setWordList = function(wordList){
        this.wordList = wordList;
    }

}