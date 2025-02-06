;(function ($) {
	$.fn.UItoTop = function (options) {
		var defaults = false,
			settings = $.extend(
				{
					text: 'Back to Top',
					min: 300,
					containerID: 'back-top',
				},
				options,
			),
			containerIDhash = '#' + settings.containerID
		!(window.innerWidth < 1024 && $('body').hasClass('none-m-backtop')) &&
			($('body').append(
				'<a href="#top" id="' +
					settings.containerID +
					'" aria-label="back to top">' +
					settings.text +
					'</a>',
			),
			$(containerIDhash).on('click.UItoTop', function () {
				return (
					window.scrollTo({
						top: 0,
						behavior: 'smooth',
					}),
					$(containerIDhash).removeClass('scroll-btn-visible'),
					false
				)
			}),
			$(window).on('scroll', function () {
				var sd = $(window).scrollTop()
				sd > settings.min && !defaults
					? ($(containerIDhash).addClass('scroll-btn-visible'),
						(defaults = true))
					: sd <= settings.min &&
						($(containerIDhash).removeClass('scroll-btn-visible'),
						(defaults = false))
			}))
	}
})(jQuery)
