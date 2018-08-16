window.log = console.log.bind()
jQuery(document).ready(function($){

	// var getBaseInfo= function(){
	// 	$.ajax(
	// 		{url:'/api/resume/daba4698-d33a-41d4-b1c8-1f166a92df84',success:function(d){
	// 			log(d)
	// 		}}
	// 	)
	// }
	// getBaseInfo();
	var gallery = $('.second-screen .box'),
		foldingPanel = $('.folding-panel'),
		mainContent = $('.main-info');
	/* open folding content */
	gallery.on('click', 'a', function(event){
		event.preventDefault();
		openItemInfo($(this).attr('href'));
	});

	/* close folding content */
	foldingPanel.on('click', '.close', function(event){
		event.preventDefault();
		toggleContent('', false);
	});
	gallery.on('click', function(event){
		/* detect click on .cd-gallery::before when the .cd-folding-panel is open */
		if($(event.target).is('.cd-gallery') && $('.fold-is-open').length > 0 ) toggleContent('', false);
	})

	function openItemInfo(url) {
		// var mq = viewportSize();
		// if( gallery.offset().top > $(window).scrollTop() && mq != 'mobile') {
		// 	/* if content is visible above the .cd-gallery - scroll before opening the folding panel */
		// 	$('body,html').animate({
		// 		'scrollTop': gallery.offset().top
		// 	}, 100, function(){ 
	    //        	toggleContent(url, true);
	    //     }); 
	    // } else if( gallery.offset().top + gallery.height() < $(window).scrollTop() + $(window).height()  && mq != 'mobile' ) {
		// 	/* if content is visible below the .cd-gallery - scroll before opening the folding panel */
		// 	$('body,html').animate({
		// 		'scrollTop': gallery.offset().top + gallery.height() - $(window).height()
		// 	}, 100, function(){ 
	    //        	toggleContent(url, true);
	    //     });
		// } else {
		// 	toggleContent(url, true);
		// }
		$('body,html').animate({
			'scrollTop': gallery.offset().top
		}, 100, function(){ 
			toggleContent(url, true);
		}); 

	}

	function toggleContent(url, bool) {
		if( bool ) {
			/* load and show new content */
			var foldingContent = foldingPanel.find('.folding-content');
            
            foldingContent.html(
				'   <h2>项目经验</h2>'+
				'<p>2018-2019 英超联赛冠军 红军利物浦</p>');
                setTimeout(function(){
                    $('body').addClass('overflow-hidden');
                    foldingPanel.addClass('is-open');
                    mainContent.addClass('fold-is-open');
                }, 100);
            
		} else {
			/* close the folding panel */
			var mq = viewportSize();
			foldingPanel.removeClass('is-open');
			mainContent.removeClass('fold-is-open');
			
			(mq == 'mobile' || $('.no-csstransitions').length > 0 ) 
				/* according to the mq, immediately remove the .overflow-hidden or wait for the end of the animation */
				? $('body').removeClass('overflow-hidden')
				
				: mainContent.find('.box').eq(0).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					$('body').removeClass('overflow-hidden');
					mainContent.find('.box').eq(0).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
				});
		}
		
	}

	function viewportSize() {
		/* retrieve the content value of .cd-main::before to check the actua mq */
		return window.getComputedStyle(document.querySelector('.main-info'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
	}
});