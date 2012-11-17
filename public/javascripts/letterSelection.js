$(function(){
	var mode;
	var selector = $('#letters');
	var letters = $('#letters .letter');
	var modeEntry = $('.mode-entry');
	var modeSelection = $('.mode-selection');
	
	var displayEntryText = function(){
		modeEntry.removeClass("hidden");
		modeSelection.addClass("hidden")
	};

	var displaySelectionText = function(){
		modeEntry.addClass("hidden");
		modeSelection.removeClass("hidden")
	};

	$('.letter').bind('selecting', function(e){
		alert("selected letter");
	});

	$('#letters p').bind('selecting', function(e){
		alert("selected p");
	});

	$('.text-entry').on('click', function(){
		letters.addClass("editable");
		displayEntryText();
		selector.selectable("disable");
	});

	$('.claim').on('click', function(){
		$this = $(this);
		letters.removeClass("editable");
		displaySelectionText();
		mode = $this.attr("id");
		selector.selectable({
			selecting: function(e){
				$this = $(this).find('.ui-selecting');
				$this.addClass("selecting-" + mode);
			},
			selected: function(e) {
				$this = $(this).find('.selecting-' + mode);
				$this.removeClass("selected-theirs");
				$this.removeClass("selected-mine");
				$this.addClass("selected-" + mode);
				$this.removeClass('selecting-' + mode);
				$this.removeClass("ui-selected");
				$this.removeClass("unclaimed");
			}
		});
		selector.selectable("enable");
	});

	$('.getResult').on('click',function(){
		lettersGiven = letters.children("p").text();
		if (lettersGiven.length < 25){
			//TODO: YOU KNOW WHAT TO DO
			alert("Please fill in all letters");
			return false;
		}
		var colors = "";
		letters.each(function(index,element){
			if (element.hasClass("selected-mine"){
				colors = colors +  index.toString() + "m";
			}) else if (element.hasClass("selected-theirs"){
				colors = colors + index.toString() + "t";
			})
		});	
		alert(lettersGiven + " " + colors);

	});



})