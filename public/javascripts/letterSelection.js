$(function(){
    // Handle checking if control is down
    var deselectModifierOn = false;
    // Alt will deselect
    var deselectKeyCode = 18;
    $('body').on('keydown',function(e){
        if (e.keyCode == deselectKeyCode){
            deselectModifierOn = true;
        }
    })
    $('body').on('keyup',function(e){
        if (e.keyCode == deselectKeyCode){
            deselectModifierOn = false;
        }
    })

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
		var $this = $(this);
		letters.removeClass("editable");
		displaySelectionText();
		mode = $this.attr("id");
		selector.selectable({
            selected: function() {
				$this = $(this).find('.ui-selected');
                if (!deselectModifierOn){
                    $this.removeClass("unclaimed");
                    $this.removeClass("selected-theirs");
                    $this.removeClass("selected-mine");
                    $this.addClass("selected-" + mode);
                } else {
                    $this.removeClass("selected-theirs");
                    $this.removeClass("selected-mine");
                    $this.addClass("unclaimed");
                }
            }
		});
		selector.selectable("enable");
	});

	
});