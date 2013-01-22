$(function() {
    var letterContainer = $('#letters');
    var letters = letterContainer.find('.letter');
	letters.each(function(index, element){
		element = $(element);
		element.attr("data-value",index);
	});

	var replaceWithInput = function(elem,e){
		var $this = $(elem);
		var contents = $this.children();

		if (contents.is("input")){
			return false; 
		}

		var textInput = $("<input/>", {
			type: "text",
			value: $.trim($this.text())
		});

		contents.replaceWith(textInput);

		textInput.focus().select();
	};

	/**
	* Turn p's into input's on div click
	*/
    letterContainer.on('click','.editable', function(e){
		replaceWithInput(this,e);
	});
    letterContainer.on('focus','.editable', function(e){
		replaceWithInput(this,e);
	});

	/**
	* When input's lose focus, turn them back into p's
	*/
    letterContainer.on('blur','.editable', function(e){
		$this = $(this);
		var contents = $this.children().eq(0);

		if (contents.is("p")){
			return false;
		}

		var textDisplay = $("<p>", {
			class: contents.attr("class"),
			id: contents.attr("id")
		});
		
		textDisplay.text(contents.attr("value"));
		contents.replaceWith(textDisplay);

	    return true;
	});

    letterContainer.on('keydown','.editable input', function(e){
		var $this = $(this);

        var index = parseInt($this.closest(".letter").attr("data-value"));
		var nextIndex = (index + 1) % (letters.length);
		
		var nextElem = getElemFromIndex(nextIndex, letters);
		
		// Make left/right/up/down/tab navigate
		switch (e.keyCode){
			// Left and Backspace
			case 37:
			case 8:
				nextIndex = (index - 1) % (letters.length);
				break;
			// Up
			case 38:
				nextIndex = (index - 5) % (letters.length);
				break;
			// Right and Tab
			case 39:
			case 9:
				nextIndex = (index + 1) % (letters.length);
				break;
			// Down
			case 40:
				nextIndex = (index + 5) % (letters.length);
				break;
			// Escape
			case 27:
				$this.blur();
				return false;
				break;
			default:
				// a-z
				if (e.keyCode >= 65 && e.keyCode <= 90){
					$this.attr("value",String.fromCharCode(e.keyCode).toUpperCase());
				} else {
					return false;
				}
		}
		nextElem = getElemFromIndex(nextIndex, letters);
		nextElem.focus();
		$this.blur();
		return false;
	})
});	
var getElemFromIndex = function(index, list){
	return list.eq(index).children("p");
};