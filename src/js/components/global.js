/**  TWP MAN SCRIPT */
var TWP_MAIN_SCRIPT = (function (Module, $) {
	'use strict'

	Module.initParams = function () {
		this.themeSettings =
			typeof sabayParams !== 'undefined' ? sabayParams : {}
		this.ajaxData = {}
		this.siteAccessFlag = false
		this._document = $(document)
		this._body = $('body')
		this._window = $(window)
		this.html = $('html, body')
		this.outerHTML = $('html')
		this.iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
		this.wPoint = {}
		this.sticky = {}
		this.eSticky = {}
		this.YTPlayers = {}
		this.articleData = []
		this.readIndicatorPercent = 0
		this.isProgress = false
		this.readIndicator = $('#reading-progress')
		this.ajaxURL =
			typeof sabayCoreParams !== 'undefined'
				? sabayCoreParams.ajaxurl || ''
				: ''
		if (typeof SABAY_CORE_SCRIPT !== 'undefined') {
			this.personailizeUID = SABAY_CORE_SCRIPT.personailizeUID
		}
	}

	Module.init = function () {
		this.initParams()
		this.headerDropdown()
		this.mobileCollapse()
		this.initSubMenuPos()
		this.documentClick()
		this.backTop()
		this.readIndicatorInit()
		this.sliders()
		this.fontResizer()
		this.personalizeBlocks()
		this.personalizeCategories()
		this.singleInfiniteLoadNext()
		this.loginPopup()
		this.delayLoad()
		this.paginationNextPrev()
		this.paginationLoadMore()
		this.paginationInfinite()
		this.readingCollect()
		this.neededReloadFuncs()
	}

	Module.neededReloadFuncs = function () {
		this.hoverTipsy()
		this.videoPreview()
		this.singleScrollRefresh()
	}

	Module.reInitAll = function () {
		this._window.trigger('load')
		this.syncLayoutLike()
		if (typeof SABAY_PERSONALIZE !== 'undefined') {
			SABAY_PERSONALIZE.syncPersonalizeLayout()
		}
		if (typeof TWP_REACTION !== 'undefined') {
			TWP_REACTION.syncReactLayout()
		}
		this.neededReloadFuncs()
		Waypoint.refreshAll()
	}

	/** sync layout & reload features */
	Module.reloadBlockFunc = function () {
		this._window.trigger('load')

		if (typeof SABAY_PERSONALIZE !== 'undefined') {
			SABAY_PERSONALIZE.syncLayoutBookmarks()
		}
		this.syncLayoutLike()
		this.videoPreview()
		this.hoverTipsy()
		Waypoint.refreshAll()
	}

	/** Header JS functions */
	Module.headerDropdown = function () {
		const self = this
		$('.more-trigger').on('click', function (e) {
			e.preventDefault()
			e.stopPropagation()

			/** re calc menu  */
			self.calcSubMenuPos()

			const target = $(this)
			const holder = target
				.parents('.header-wrap')
				.find('.more-section-outer')

			if (!holder.hasClass('dropdown-activated')) {
				self._body
					.find('.dropdown-activated')
					.removeClass('dropdown-activated')
				holder.addClass('dropdown-activated')
			} else {
				holder.removeClass('dropdown-activated')
			}

			if (target.hasClass('search-btn')) {
				setTimeout(function () {
					holder.find('input[type="text"]').focus()
				}, 1)
			}

			return false
		})

		/** search trigger */
		$('.search-trigger').on('click', function (e) {
			e.preventDefault()
			e.stopPropagation()
			const holder = $(this).parent('.header-dropdown-outer')
			if (!holder.hasClass('dropdown-activated')) {
				self._body
					.find('.dropdown-activated')
					.removeClass('dropdown-activated')
				holder.addClass('dropdown-activated')
				setTimeout(function () {
					holder.find('input[type="text"]').focus()
				}, 1)
			} else {
				holder.removeClass('dropdown-activated')
			}
			return false
		})

		/** header dropdown */
		$('.dropdown-trigger').on('click', function (e) {
			e.preventDefault()
			e.stopPropagation()
			const holder = $(this).parent('.header-dropdown-outer')
			if (!holder.hasClass('dropdown-activated')) {
				self._body
					.find('.dropdown-activated')
					.removeClass('dropdown-activated')
				holder.addClass('dropdown-activated')
			} else {
				holder.removeClass('dropdown-activated')
			}
		})
	}

	/** calc mega menu position */
	Module.initSubMenuPos = function () {
		const self = this
		let trigger = false

		/** add delay to ensure image loaded */
		setTimeout(function () {
			self.calcSubMenuPos()
		}, 1000)

		/** re calc when hovering */
		$('.menu-has-child-mega').on('mouseenter', function () {
			if (!trigger) {
				self.calcSubMenuPos()
			}
			trigger = true
		})
	}

	Module.calcSubMenuPos = function () {
		if (window.outerWidth < 1024) {
			return false
		}

		const self = this
		const megaParents = $('.menu-has-child-mega')
		const headerWrapper = $('#site-header')

		/** for mega wide */
		if (megaParents.length > 0) {
			megaParents.each(function () {
				const item = $(this)
				item.find('.mega-dropdown').css({
					width: self._body.width(),
					left: -item.offset().left,
				})
				item.addClass('mega-menu-loaded')
			})
		}

		/** sub-menu left right direction */
		if (headerWrapper.length > 0) {
			let headerLeftOffset = headerWrapper.offset().left
			let headerWidth = headerWrapper.width()
			let headerRightOffset = headerLeftOffset + headerWidth

			const flexDropdown = $('.flex-dropdown')

			/** sub menu direction */
			const subElements = $('ul.sub-menu')
			if (subElements.length > 0) {
				subElements.each(function () {
					const item = $(this)
					let itemLeftOffset = item.offset().left
					let itemRightOffset = itemLeftOffset + item.width() + 100
					if (itemRightOffset > headerRightOffset) {
						item.addClass('left-direction')
					}
				})
			}

			/** calc dropdown flex width */
			if (flexDropdown.length > 0) {
				flexDropdown.each(function () {
					const item = $(this)
					const parentItem = item.parent()
					if (
						parentItem.hasClass('is-child-wide') ||
						item.hasClass('mega-has-left')
					) {
						return
					}
					const itemWidth = item.width()
					const itemHalfWidth = itemWidth / 2
					const parentItemOffset = parentItem.offset().left
					const parentHalfWidth = parentItem.width() / 2
					const parentItemCenterOffset =
						parentItemOffset + parentHalfWidth
					const rightSpacing =
						headerRightOffset - parentItemCenterOffset
					const leftSpacing =
						parentItemCenterOffset - headerLeftOffset

					if (itemWidth >= headerWidth) {
						item.css({
							width: headerWidth - 2,
							left: -parentItemOffset,
						})
					} else if (itemHalfWidth > rightSpacing) {
						item.css({
							right: -rightSpacing + parentHalfWidth + 1,
							left: 'auto',
						})
					} else if (itemHalfWidth > leftSpacing) {
						item.css({
							left: -leftSpacing + parentHalfWidth + 1,
							right: 'auto',
						})
					} else {
						item.css({
							right: 'auto',
							left: -itemHalfWidth + parentHalfWidth,
						})
					}
				})
			}
		}
	}

	/** outside click */
	Module.documentClick = function () {
		const self = this
		const wrapper = $(
			'.more-section-outer, .header-dropdown-outer, .mobile-collapse, .mfp-wrap',
		)
		const inlineSearchForm = $('.is-form-layout')

		document.addEventListener('click', function (e) {
			if (!wrapper.is(e.target) && wrapper.has(e.target).length === 0) {
				wrapper.removeClass('dropdown-activated')
				self.outerHTML.removeClass('collapse-activated')
			}

			if (
				!inlineSearchForm.is(e.target) &&
				inlineSearchForm.has(e.target).length === 0
			) {
				inlineSearchForm.find('.live-search-response').fadeOut(500)
			}
		})
	}

	/** mobileCollapse */
	Module.mobileCollapse = function () {
		const self = this
		const $mobileMenuTrigger = $('.mobile-menu-trigger')
		const $outerHTML = self.outerHTML
		const $mobileSearchForm = $outerHTML.find(
			'.mobile-search-form input[type="text"]',
		)

		$mobileMenuTrigger.on('click', function (e) {
			e.preventDefault()
			e.stopPropagation()
			const target = $(this)

			if (target.hasClass('mobile-search-icon')) {
				setTimeout(function () {
					$mobileSearchForm.focus()
				}, 1)
			}

			const isCollapseActivated =
				$outerHTML.hasClass('collapse-activated')
			$outerHTML.toggleClass('collapse-activated', !isCollapseActivated)
		})
	}

	/** back top */
	Module.backTop = function () {
		if (this._body.hasClass('is-backtop')) {
			$().UItoTop({
				text: '<i class="rbi rbi-darrow-top"></i>',
			})
		}
	}

	/** login popup */
	Module.loginPopup = function () {
		const form = $('#twp-user-popup-form')
		if (form.length < 1) {
			return false
		}
		this._document.on('click', '.login-toggle', (e) => {
			e.preventDefault()
			e.stopPropagation()
			$.magnificPopup.open({
				type: 'inline',
				preloader: false,
				removalDelay: 400,
				showCloseBtn: true,
				closeBtnInside: true,
				closeOnBgClick: false,
				items: {
					src: form,
					type: 'inline',
				},
				mainClass: 'twp-popup-center',
				closeMarkup:
					'<span class="close-popup-btn mfp-close"><span class="close-icon"></span></span>',
				fixedBgPos: true,
				fixedContentPos: true,
			})
		})
	}

	/**
	 *
	 * @returns {boolean}
	 */
	Module.readIndicatorInit = function () {
		const self = this
		if (!self._body.hasClass('single') || self.readIndicator.length < 1) {
			return false
		}

		let content = $('.entry-content').first()
		if (!content.length) return false

		self.indicatorTop = content.offset().top
		self.indicatorHeight = content.outerHeight(true) - self._window.height()
		/** delay for load images */
		setTimeout(function () {
			self.indicatorTop = content.offset().top
			self.indicatorHeight =
				content.outerHeight(true) - self._window.height()
		}, 1000)

		if (window.addEventListener) {
			window.addEventListener(
				'scroll',
				function () {
					self.animationFrame(self.readIndicatorCalc.bind(self))
				},
				false,
			)
		}
	}

	Module.animationFrame = function (callback) {
		const func =
			window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			this.animationFrameFallback
		func.call(window, callback)
	}

	Module.animationFrameFallback = function (callback) {
		window.setTimeout(callback, 1000 / 60)
	}

	Module.readIndicatorCalc = function () {
		const self = this
		const scroll = self._window.scrollTop()
		self.readIndicatorPercent = Math.min(
			((scroll - self.indicatorTop) / self.indicatorHeight) * 100,
			100,
		)
		if (self.readIndicatorPercent <= 100) {
			self.readIndicator.css('width', self.readIndicatorPercent + '%')
		}
	}

	Module.singleScrollRefresh = function () {
		const infiniteWrapper = $('#single-post-infinite')
		if (!infiniteWrapper.length) {
			return
		}
		const self = this
		self.articleData = []
		const articleOuter = infiniteWrapper.find('.single-post-outer')

		if (articleOuter.length > 0) {
			self.inviewPostID = articleOuter.eq(0).data('postid')

			articleOuter.each(function () {
				const article = $(this)
				const itemData = {
					postID: article.data('postid'),
					postURL: article.data('postlink'),
					postTitle: article.find('h1.s-title').text(),
					shareList: article.find('.sticky-share-list-buffer').html(),
					top: article.offset().top,
					bottom: article.offset().top + article.outerHeight(true),
				}

				if (self.readIndicator.length > 0) {
					const content = article.find('.rbct').eq(0)
					itemData.indicatorTop = content.offset().top
					itemData.indicatorHeight =
						content.outerHeight(true) - self._window.height()
				}
				self.articleData.push(itemData)
			})

			const onScroll = () => {
				self.animationFrame(self.scrollToUpdateArticle.bind(self))
			}
			if (window.addEventListener) {
				window.addEventListener('scroll', onScroll, false)
			}
		}
	}

	/** scrollToUpdateArticle */
	Module.scrollToUpdateArticle = function () {
		const self = this
		const scroll = self._window.scrollTop()

		self.articleData.every((article) => {
			if (scroll > article.top + 5 && scroll < article.bottom - 5) {
				if (article.indicatorTop) {
					self.readIndicatorPercent = Math.min(
						((scroll - article.indicatorTop) /
							article.indicatorHeight) *
							100,
						100,
					)
					if (self.readIndicatorPercent <= 100) {
						self.readIndicator.css(
							'width',
							`${self.readIndicatorPercent}%`,
						)
					}
				}

				if (article.postID !== self.inviewPostID) {
					self.inviewPostID = article.postID
					if (article.postURL) {
						history.replaceState(null, null, article.postURL)
					}
					document.title = article.postTitle
					$('.single-post-outer').removeClass('activated')
					$('[data-postid="' + article.postID + '"]').addClass(
						'activated',
					)
					$('#s-title-sticky .sticky-title')
						.hide()
						.html(article.postTitle)
						.fadeIn(300)
					$('#s-title-sticky .sticky-share-list').html(
						article.shareList,
					)
					self._body
						.find('.floating-video')
						.removeClass('floating-activated')

					if (typeof SABAY_CORE_SCRIPT !== 'undefined') {
						SABAY_CORE_SCRIPT.updateGA(article)
					}
				}
				return false
			}

			return true
		})
	}

	/**
	 * @returns {boolean}
	 */
	Module.crwDetect = function () {
		const botPatterns = [
			/alexa|altavista|ask jeeves|attentio|baiduspider|bingbot|chtml generic|crawler|fastmobilecrawl|feedfetcher-google|firefly|froogle|gigabot|googlebot|googlebot-mobile|heritrix|httrack|ia_archiver|irlbot|iescholar|infoseek|jumpbot|linkcheck|lycos|mediapartners|mediobot|motionbot|msnbot|mshots|openbot|pss-webkit-request|pythumbnail|scooter|slurp|snapbot|spider|taptubot|technoratisnoop|teoma|twiceler|yahooseeker|yahooysmcm|yammybot|ahrefsbot|pingdom.com_bot|kraken|yandexbot|twitterbot|tweetmemebot|openhosebot|queryseekerspider|linkdexbot|grokkit-crawler|livelapbot|germcrawler|domaintunocrawler|grapeshotcrawler|cloudflare-alwaysonline/i,
		]

		const userAgent = navigator.userAgent
		return botPatterns.some((pattern) => pattern.test(userAgent))
	}

	/**
	 *
	 * @returns {boolean}
	 */
	Module.disabledLoadNext = function () {
		if (this.themeSettings.crwLoadNext) {
			return false
		}

		return this.crwDetect()
	}

	/** overlay slider */
	Module.sliders = function () {
		const self = this
		const sliders = $('.post-slider')
		if (sliders.length < 1) {
			return false
		}

		sliders.each(function () {
			const slider = $(this)
			let params = {
				grabCursor: true,
				allowTouchMove: true,
				effect: self.themeSettings.sliderEffect,
				loop: true,
			}
			if (slider.data('play')) {
				params.autoplay = {
					delay: self.themeSettings.sliderSpeed,
					pauseOnMouseEnter: true,
					stopOnLastSlide: true,
					disableOnInteraction: true,
				}
				if (slider.data('speed')) {
					params.autoplay.delay = slider.data('speed')
				}
			}
			if ('undefined' !== typeof self.isElementorEditor) {
				delete params.autoplay
			}
			params.pagination = {
				el: slider.find('.slider-pagination')[0],
				clickable: true,
			}

			params.navigation = {
				nextEl: slider.find('.slider-next')[0],
				prevEl: slider.find('.slider-prev')[0],
			}
			new RBSwiper(this, params)
		})
	}

	/** font resizer */
	Module.fontResizer = function () {
		const self = this
		let size = self.yesStorage
			? sessionStorage.getItem('tagtwpResizerStep')
			: 1

		self._body.on('click', '.font-resizer-trigger', function (e) {
			e.preventDefault()
			e.stopPropagation()
			size++
			if (3 < size) {
				size = 1
				self._body.removeClass('medium-entry-size big-entry-size')
			} else {
				if (2 == size) {
					self._body
						.addClass('medium-entry-size')
						.removeClass('big-entry-size')
				} else {
					self._body
						.addClass('big-entry-size')
						.removeClass('medium-entry-size')
				}
			}

			self.yesStorage && sessionStorage.setItem('tagtwpResizerStep', size)
		})
	}

	/* SINGLE INFINITE */
	Module.singleInfiniteLoadNext = function () {
		const infiniteWrapper = $('#single-post-infinite')
		const self = this

		if (!infiniteWrapper.length || self.disabledLoadNext()) {
			return
		}

		self.singleLoadNextCounter = 1
		self.singleLoadNextLimit = self.themeSettings?.singleLoadNextLimit
			? parseInt(self.themeSettings.singleLoadNextLimit, 10)
			: 20

		const infiniteLoadPoint = $('#single-infinite-point')
		const animationIcon = infiniteLoadPoint.find('.twp-loader')
		const rootURL = new URL(window.location.href)
		const rootGetParams = rootURL.searchParams

		const loadNextParams = {
			element: infiniteLoadPoint,
			offset: 'bottom-in-view',
			handler: function (direction) {
				if (
					self.ajaxData.singleProcessing ||
					direction === 'up' ||
					self.singleLoadNextCounter > self.singleLoadNextLimit
				) {
					return
				}
				const nextPostURL = new URL(infiniteWrapper.data('nextposturl'))
				nextPostURL.searchParams.set('twpsnp', '1')
				if (rootGetParams) {
					rootGetParams.forEach((value, key) => {
						if (key !== 'twpsnp' && 'p' !== key) {
							nextPostURL.searchParams.set(key, value)
						}
					})
				}
				self.ajaxData.singleProcessing = true
				animationIcon
					.css('display', 'block')
					.animate({ opacity: 1 }, 200)

				$.ajax({
					type: 'GET',
					url: nextPostURL.toString(),
					dataType: 'html',
					success: function (response) {
						response = $('<div id="temp-dom"></div>')
							.append($.parseHTML(response))
							.find('.single-post-outer')
						const nextPostURL = response.data('nextposturl')

						if (nextPostURL) {
							infiniteWrapper.data('nextposturl', nextPostURL)
						} else {
							infiniteWrapper.removeAttr('id')
							infiniteLoadPoint.remove()
						}

						animationIcon
							.animate({ opacity: 0 }, 200)
							.delay(200)
							.css('display', 'none')
						infiniteWrapper.append(response)
						self.ajaxData.singleProcessing = false
						self.singleLoadNextCounter++

						setTimeout(function () {
							self.reInitAll()
							if (typeof SABAY_CORE_SCRIPT !== 'undefined') {
								SABAY_CORE_SCRIPT.loadGoogleAds(response)
								SABAY_CORE_SCRIPT.loadInstagram(response)
								SABAY_CORE_SCRIPT.loadTwttr()
							}
						}, 1)
					},
				})
			},
		}

		self.wPoint.ajaxSingleNextPosts = new Waypoint(loadNextParams)
	}

	/** on load */
	Module.delayLoad = function () {
		const self = this

		setTimeout(function () {
			self.stickyNavBar()
			self.stickyHeaderBuilder()
		}, 50)
	}

	/**
	 *
	 * @returns {boolean}
	 */
	Module.stickyNavBar = function () {
		const self = this

		/** turn off sticky on editor mode */
		if (self._body.hasClass('elementor-editor-active')) {
			return false
		}

		self.sticky.section = $('#sticky-holder')
		self.sticky.outer = $('#navbar-outer')

		if (
			(!self._body.hasClass('is-mstick') &&
				!self._body.hasClass('yes-tstick')) ||
			self.sticky.outer.length < 1 ||
			self.sticky.section.length < 1
		) {
			return false
		}

		self.sticky.smartSticky = !!self._body.hasClass('is-smart-sticky')
		self.sticky.isSticky = false
		self.sticky.lastScroll = 0

		if (self._body.hasClass('yes-tstick')) {
			self.sticky.isTitleSticky = true
		} else {
			self.sticky.isTitleSticky = 0
		}

		self.sticky.additionalOffset = 200
		if (window.innerWidth > 1024) {
			if (self.sticky.isTitleSticky) {
				self.sticky.additionalOffset = 450
			} else {
				self.sticky.additionalOffset = 0
			}
		}

		if (self._body.hasClass('admin-bar')) {
			self.sticky.adminBarSpacing = 32
		} else {
			self.sticky.adminBarSpacing = 0
		}

		self.sticky.topOffset = self.sticky.section.offset().top
		self.sticky.stickySectionHeight = self.sticky.section.outerHeight()

		self.sticky.outer.css('min-height', self.sticky.outer.outerHeight())
		self.sticky.activatePos =
			self.sticky.topOffset +
			1 +
			self.sticky.stickySectionHeight +
			self.sticky.additionalOffset
		self.sticky.deactivePos =
			self.sticky.topOffset -
			self.sticky.adminBarSpacing +
			self.sticky.additionalOffset

		if (window.addEventListener) {
			if (self.sticky.smartSticky) {
				window.addEventListener(
					'scroll',
					function () {
						self.animationFrame(
							self.initSmartStickyNavBar.bind(self),
						)
					},
					false,
				)
			} else {
				window.addEventListener(
					'scroll',
					function () {
						self.animationFrame(self.initStickyNavBar.bind(self))
					},
					false,
				)
			}
		}

		self._window.on('unstickMenu', function () {
			self.sticky.outer.css('min-height', self.sticky.outer.outerHeight())
			self.sticky.stickySectionHeight = self.sticky.section.outerHeight()
			self.sticky.topOffset = self.sticky.section.offset().top
			self.sticky.activatePos =
				self.sticky.topOffset +
				1 +
				self.sticky.stickySectionHeight +
				self.sticky.additionalOffset
			self.sticky.deactivePos =
				self.sticky.topOffset -
				self.sticky.adminBarSpacing +
				self.sticky.additionalOffset
		})
	}

	Module.initStickyNavBar = function () {
		const self = this
		const scroll = self._window.scrollTop()

		if (!self.sticky.isSticky && scroll > self.sticky.activatePos) {
			self.sticky.isSticky = true
			self._body.addClass('stick-animated sticky-on')
			self.sticky.stickAnimatedTimeout = setTimeout(function () {
				self._body.removeClass('stick-animated')
			}, 200)
		} else if (self.sticky.isSticky && scroll <= self.sticky.deactivePos) {
			self.sticky.isSticky = false
			self._body.removeClass('sticky-on stick-animated')
			self._window.trigger('unstickMenu')
		}
	}

	Module.initSmartStickyNavBar = function () {
		const self = this
		const scroll = self._window.scrollTop()

		if (
			!self.sticky.isSticky &&
			scroll > self.sticky.activatePos &&
			scroll < self.sticky.lastScroll
		) {
			self.sticky.isSticky = true
			self._body.addClass('stick-animated sticky-on')
			self.sticky.stickAnimatedTimeout = setTimeout(function () {
				self._body.removeClass('stick-animated')
			}, 200)
		} else if (
			self.sticky.isSticky &&
			(scroll <= self.sticky.deactivePos ||
				scroll > self.sticky.lastScroll)
		) {
			self.sticky.isSticky = false
			self._body.removeClass('sticky-on stick-animated')
			if (scroll <= self.sticky.deactivePos) {
				self._window.trigger('unstickESection')
			}
		}
		self.sticky.lastScroll = scroll
	}

	/** header sticky template */
	Module.stickyHeaderBuilder = function () {
		const self = this

		/** turn off sticky on editor mode */
		if (self._body.hasClass('elementor-editor-active')) {
			return false
		}

		let stickySection = $('.header-template .e-section-sticky').first()
		const hasTitleSticky = $('body.single-post #s-title-sticky').first()

		if (stickySection.length < 1) {
			return false
		}

		if (hasTitleSticky.length > 0) {
			self._body.addClass('yes-tstick')
			self.eSticky.isTitleSticky = true
		} else {
			self.eSticky.isTitleSticky = 0
		}

		self.eSticky.additionalOffset = 200
		if (window.innerWidth > 1024) {
			if (self.eSticky.isTitleSticky) {
				self.eSticky.additionalOffset = 450
			} else {
				self.eSticky.additionalOffset = 0
			}
		}

		self.eSticky.smartSticky = !!stickySection.hasClass('is-smart-sticky')

		/** mobile sticky for header template */
		if (window.innerWidth <= 1024) {
			stickySection.removeClass('e-section-sticky')
			stickySection = $('#header-template-holder').addClass(
				'e-section-sticky',
			)
		}

		self.eSticky.section = stickySection
		self.eSticky.outer = stickySection.parent()

		self.eSticky.adminBarSpacing = 0
		self.eSticky.isSticky = false
		self.eSticky.lastScroll = 0
		self.eSticky.stickySectionHeight = stickySection.outerHeight()
		self.eSticky.topOffset = stickySection.offset().top

		/** set min height */
		if (self._body.hasClass('admin-bar')) {
			self.eSticky.adminBarSpacing = 32
		}
		self.eSticky.outer.css('min-height', self.eSticky.outer.outerHeight())
		self.eSticky.activatePos =
			self.eSticky.topOffset +
			1 +
			self.eSticky.stickySectionHeight +
			self.eSticky.additionalOffset
		self.eSticky.deactivePos =
			self.eSticky.topOffset -
			self.eSticky.adminBarSpacing +
			self.eSticky.additionalOffset

		if (window.addEventListener) {
			if (self.eSticky.smartSticky) {
				window.addEventListener(
					'scroll',
					function () {
						self.animationFrame(
							self.initSmartStickyESection.bind(self),
						)
					},
					false,
				)
			} else {
				window.addEventListener(
					'scroll',
					function () {
						self.animationFrame(self.initStickyESection.bind(self))
					},
					false,
				)
			}
		}

		/** re-calc height values */
		self._window.on('unstickESection', function () {
			self.eSticky.outer.css(
				'min-height',
				self.eSticky.outer.outerHeight(),
			)
			self.eSticky.stickySectionHeight =
				self.eSticky.section.outerHeight()
			self.eSticky.topOffset = self.eSticky.section.offset().top
			self.eSticky.activatePos =
				self.eSticky.topOffset +
				1 +
				self.eSticky.stickySectionHeight +
				self.eSticky.additionalOffset
			self.eSticky.deactivePos =
				self.eSticky.topOffset -
				self.eSticky.adminBarSpacing +
				self.eSticky.additionalOffset
		})
	}

	Module.initStickyESection = function () {
		const self = this
		const scroll = self._window.scrollTop()
		if (!self.eSticky.isSticky && scroll > self.eSticky.activatePos) {
			self.eSticky.isSticky = true
			self._body.addClass('stick-animated sticky-on')
			self.eSticky.stickAnimatedTimeout = setTimeout(function () {
				self._body.removeClass('stick-animated')
			}, 200)
		} else if (
			self.eSticky.isSticky &&
			scroll <= self.eSticky.deactivePos
		) {
			self.eSticky.isSticky = false
			self._body.removeClass('sticky-on stick-animated')
			self._window.trigger('unstickESection')
		}
	}

	Module.initSmartStickyESection = function () {
		const self = this
		const scroll = self._window.scrollTop()

		if (
			!self.eSticky.isSticky &&
			scroll > self.eSticky.activatePos &&
			scroll < self.eSticky.lastScroll
		) {
			self.eSticky.isSticky = true
			self._body.addClass('stick-animated sticky-on')
			self.eSticky.stickAnimatedTimeout = setTimeout(function () {
				self._body.removeClass('stick-animated')
			}, 200)
		} else if (
			self.eSticky.isSticky &&
			(scroll <= self.eSticky.deactivePos ||
				scroll > self.eSticky.lastScroll)
		) {
			self.eSticky.isSticky = false
			self._body.removeClass('sticky-on stick-animated')
			if (scroll <= self.eSticky.deactivePos) {
				self._window.trigger('unstickESection')
			}
		}

		self.eSticky.lastScroll = scroll
	}

	/** Ajax pagination */
	Module.paginationNextPrev = function () {
		const self = this
		self._body.on('click', '.pagination-trigger', function (e) {
			e.preventDefault()
			e.stopPropagation()
			const paginationTrigger = $(this)
			if (paginationTrigger.hasClass('is-disable')) {
				return
			}

			const block = paginationTrigger.parents('.block-wrap')
			const uuid = block.attr('id')

			if (!self.ajaxData[uuid]) {
				self.ajaxData[uuid] = self.getBlockSettings(uuid)
			}
			if (self.ajaxData[uuid] && self.ajaxData[uuid].processing) {
				return
			}
			self.ajaxData[uuid].processing = true
			const type = paginationTrigger.data('type')
			self.ajaxStartAnimation(block, 'replace')
			self.ajaxReplaceLoad(block, uuid, type)
		})
	}

	/**
	 * ajax start animation
	 * @param block
	 * @param action
	 */
	Module.ajaxStartAnimation = function (block, action) {
		const inner = block.find('.block-inner')
		block.find('.pagination-trigger').addClass('is-disable')
		inner.stop()

		if ('replace' === action) {
			inner.css('min-height', inner.outerHeight())
			inner.fadeTo('200', 0.05)
			inner.after('<i class="twp-loader loader-absolute"></i>')
		} else {
			block.find('.loadmore-trigger').addClass('loading')
			block
				.find('.twp-loader')
				.css({ display: 'block' })
				.delay(200)
				.animate({ opacity: 1 }, 200)
		}
	}

	Module.ajaxReplaceLoad = function (block, uuid, type) {
		const self = this

		if (!self.ajaxData[uuid].paged) {
			self.ajaxData[uuid].paged = 1
		}
		if ('prev' === type) {
			self.ajaxData[uuid].page_next =
				parseInt(self.ajaxData[uuid].paged) - 1
		} else {
			self.ajaxData[uuid].page_next =
				parseInt(self.ajaxData[uuid].paged) + 1
		}

		const cacheID = self.cacheData.getCacheID(
			uuid,
			self.ajaxData[uuid].page_next,
		)

		/** use cache */
		if (self.cacheData.exist(cacheID)) {
			const cache = self.cacheData.get(cacheID)
			if ('undefined' !== typeof cache.paged) {
				self.ajaxData[uuid].paged = cache.paged
			}
			setTimeout(function () {
				self.ajaxRenderHTML(block, uuid, cache, 'replace')
			}, 200)
		} else {
			/** POST AJAX */
			$.ajax({
				type: 'GET',
				url: self.ajaxURL,
				data: {
					action: 'twplivep',
					data: self.ajaxData[uuid],
				},
				success: function (response) {
					response = JSON.parse(JSON.stringify(response))
					if ('undefined' !== typeof response.paged) {
						self.ajaxData[uuid].paged = response.paged
					}
					self.cacheData.set(cacheID, response)
					self.ajaxRenderHTML(block, uuid, response, 'replace')
				},
			})
		}
	}

	/** register cache object */
	Module.cacheData = {
		data: {},
		get: function (id) {
			return this.data[id]
		},

		set: function (id, data) {
			this.remove(id)
			this.data[id] = data
		},

		remove: function (id) {
			delete this.data[id]
		},

		getCacheID: function (blockID, currentPage) {
			return JSON.stringify('TWP_' + blockID + '_' + currentPage)
		},

		exist: function (id) {
			return this.data.hasOwnProperty(id) && this.data[id] !== null
		},
	}

	Module.paginationLoadMore = function () {
		const self = this
		self._body.on('click', '.loadmore-trigger', function (e) {
			e.preventDefault()
			e.stopPropagation()

			const paginationTrigger = $(this)
			if (paginationTrigger.hasClass('is-disable')) {
				return
			}

			const block = paginationTrigger.parents('.block-wrap')
			const uuid = block.attr('id')

			if (!self.ajaxData[uuid]) {
				self.ajaxData[uuid] = self.getBlockSettings(uuid)
			}
			if (self.ajaxData[uuid] && self.ajaxData[uuid].processing) {
				return
			}
			self.ajaxData[uuid].processing = true
			self.ajaxStartAnimation(block, 'append')
			self.ajaxAppendLoad(block, uuid)
		})
	}

	Module.paginationInfinite = function () {
		const self = this

		const infiniteElements = $('.pagination-infinite')
		if (infiniteElements.length > 0) {
			infiniteElements.each(function () {
				const paginationTrigger = $(this)
				if (!paginationTrigger.hasClass('is-disable')) {
					const block = paginationTrigger.parents('.block-wrap')
					if (
						(block.hasClass('is-hoz-scroll') ||
							block.hasClass('is-mhoz-scroll') ||
							block.hasClass('is-thoz-scroll')) &&
						window.outerWidth < 1024
					) {
						paginationTrigger.addClass('is-disable')
						return
					}
					const uuid = block.attr('id')
					const wPointID = 'infinite' + uuid
					if (!self.ajaxData[uuid]) {
						self.ajaxData[uuid] = self.getBlockSettings(uuid)
					}
					const params = {
						element: paginationTrigger,
						offset: 'bottom-in-view',
						handler: function (direction) {
							if (
								self.ajaxData[uuid] &&
								self.ajaxData[uuid].processing
							) {
								return
							}
							if ('down' == direction) {
								self.ajaxData[uuid].processing = true
								self.ajaxStartAnimation(block, 'append')
								self.ajaxAppendLoad(block, uuid)
							}
						},
					}
					self.wPoint[wPointID] = new Waypoint(params)
				}
			})
		}
	}

	Module.ajaxAppendLoad = function (block, uuid) {
		const self = this
		if (!self.ajaxData[uuid].paged) {
			self.ajaxData[uuid].paged = 1
		}
		if (self.ajaxData[uuid].paged >= self.ajaxData[uuid].page_max) {
			return
		}
		self.ajaxData[uuid].page_next = parseInt(self.ajaxData[uuid].paged) + 1
		$.ajax({
			type: 'GET',
			url: self.ajaxURL,
			data: {
				action: 'twplivep',
				data: self.ajaxData[uuid],
			},
			success: function (response) {
				response = JSON.parse(JSON.stringify(response))
				if ('undefined' !== typeof response.paged) {
					self.ajaxData[uuid].paged = response.paged
				}
				if ('undefined' !== typeof response.notice) {
					response.content = response.content + response.notice
				}
				self.ajaxRenderHTML(block, uuid, response, 'append')
			},
		})
	}

	/**
	 * render ajax
	 * @param block
	 * @param uuid
	 * @param response
	 * @param action
	 */
	Module.ajaxRenderHTML = function (block, uuid, response, action) {
		const self = this

		block.delay(50).queue(function () {
			const uuid = block.attr('id')
			const inner = block.find('.block-inner')
			block.find('.pagination-trigger').removeClass('is-disable')
			inner.stop()

			if ('replace' === action) {
				inner.html(response.content)
				block
					.find('.twp-loader')
					.animate({ opacity: 0 }, 200, function () {
						$(this).remove()
					})
				inner.css('min-height', '')
				inner.fadeTo(200, 1)
			} else {
				const content = $(response.content)
				inner.append(content)
				content.addClass('is-invisible')
				content.addClass('opacity-animate')

				block
					.find('.twp-loader')
					.animate({ opacity: 0 }, 200, function () {
						$(this).css({ display: 'none' })
					})
				setTimeout(function () {
					content.removeClass('is-invisible')
				}, 200)
				block.find('.loadmore-trigger').removeClass('loading')
			}

			/** reload */
			self.ajaxTriggerState(block, uuid)
			self.ajaxData[uuid].processing = false
			block.dequeue()
			self.reloadBlockFunc()
		})
	}

	/**
	 * set
	 * @param block
	 * @param uuid
	 */
	Module.ajaxTriggerState = function (block, uuid) {
		const self = this
		block.find('.pagination-trigger').removeClass('is-disable')
		if (self.ajaxData[uuid].paged < 2) {
			block.find('[data-type="prev"]').addClass('is-disable')
		} else if (self.ajaxData[uuid].paged >= self.ajaxData[uuid].page_max) {
			block.find('[data-type="next"]').addClass('is-disable')
			block.find('.loadmore-trigger').addClass('is-disable').hide()
			block.find('.pagination-infinite').addClass('is-disable').hide()
		}
	}

	Module.getBlockSettings = function (uuid) {
		const settings =
			typeof window[uuid] !== 'undefined' ? window[uuid] : undefined
		return this.cleanNull(settings)
	}

	Module.cleanNull = function (data) {
		if (typeof data === 'string') {
			return data
		}

		if (data && typeof data === 'object') {
			Object.keys(data).forEach((key) => {
				if (data[key] === '' || data[key] === null) {
					delete data[key]
				}
			})
		}

		return data
	}

	/** sync layout */
	Module.syncLayoutLike = function () {
		this.isProgress = true
		const likeElements = document.querySelectorAll(
			'[data-like]:not(.loaded)',
		)
		const jsCount = this._body.hasClass('is-jscount')
		let count, countEl

		for (const el of likeElements) {
			el.classList.add('loaded')
			const key = this.getLikeKey(el.getAttribute('data-like'))
			const triggered = this.getStorage(key)

			if (!triggered) continue

			const likeEl = el.querySelector('.el-like')
			const dislikeEl = el.querySelector('.el-dislike')

			if (!likeEl || !dislikeEl) continue

			if (triggered === 'like') {
				likeEl.classList.add('triggered')
				countEl = jsCount ? likeEl.querySelector('.like-count') : null
				if (countEl) {
					count = parseInt(countEl.textContent.trim()) || 0
					countEl.textContent = count + 1
				}
			} else if (triggered === 'dislike') {
				dislikeEl.classList.add('triggered')
				countEl = jsCount
					? dislikeEl.querySelector('.dislike-count')
					: null
				if (countEl) {
					count = parseInt(countEl.textContent.trim()) || 0
					countEl.textContent = count + 1
				}
			}
		}

		this.isProgress = false
	}

	/** like key */
	Module.getLikeKey = function (id) {
		return this.personailizeUID + '-like-' + id
	}

	Module.videoPreview = function () {
		let playPromise

		$('.preview-trigger')
			.on('mouseenter', function () {
				const target = $(this)
				const wrap = target.find('.preview-video')
				if (!wrap.hasClass('video-added')) {
					const video =
						'<video preload="auto" muted loop><source src="' +
						wrap.data('source') +
						'" type="' +
						wrap.data('type') +
						'"></video>'
					wrap.append(video).addClass('video-added')
				}
				target.addClass('show-preview')
				wrap.css('z-index', 3)
				const el = target.find('video')[0]
				if (el) {
					playPromise = el.play()
				}
			})
			.on('mouseleave', function () {
				const target = $(this)
				target.find('.preview-video').css('z-index', 1)
				const el = target.find('video')[0]
				if (el && playPromise !== undefined) {
					playPromise
						.then((_) => {
							el.pause()
						})
						.catch()
				}
			})
	}

	/* ================================ HEADERS ================================ */
	Module.hoverTipsy = function () {
		if (!$.fn.rbTipsy) {
			return false
		}

		this._body.find('[data-copy]').rbTipsy({
			title: 'data-copy',
			fade: true,
			opacity: 1,
			trigger: 'hover',
			gravity: 's',
		})

		if (window.innerWidth > 1024) {
			this._body.find('#site-header [data-title]').rbTipsy({
				title: 'data-title',
				fade: true,
				opacity: 1,
				trigger: 'hover',
				gravity: 'n',
			})

			this._body.find('.site-wrap [data-title]').rbTipsy({
				title: 'data-title',
				fade: true,
				opacity: 1,
				trigger: 'hover',
				gravity: 's',
			})
		}
	}

	/** personalized block */
	Module.personalizeBlocks = function () {
		const self = this
		const elements = $('.is-ajax-block')
		if (elements.length > 0) {
			const blockRequests = elements.map(function () {
				const block = $(this)
				const uuid = block.attr('id')
				if (!self.ajaxData[uuid]) {
					self.ajaxData[uuid] = self.getBlockSettings(uuid)
				}

				if (
					self.ajaxData[uuid].content_source &&
					self.ajaxData[uuid].content_source === 'recommended' &&
					typeof twpQueriedIDs !== 'undefined' &&
					twpQueriedIDs.data
				) {
					self.ajaxData[uuid].post_not_in = twpQueriedIDs.data
				}

				self.ajaxData[uuid].uID = self.getStorage('TWPUUID', '0')

				return $.ajax({
					type: 'GET',
					url: self.ajaxURL,
					data: {
						action: 'twppersonalizeb',
						data: self.ajaxData[uuid],
					},
				})
			})

			Promise.all(blockRequests).then((responses) => {
				responses.forEach((response, index) => {
					const block = $(elements[index])
					block.html(response).fadeIn(200)
					block.dequeue()
				})
				self.reloadBlockFunc()
			})
		}
	}

	/** personalized categories */
	Module.personalizeCategories = function () {
		const self = this
		const elements = $('.is-ajax-categories')
		if (elements.length > 0) {
			const categoryRequests = elements.map(function () {
				const block = $(this)
				const uuid = block.attr('id')
				if (!self.ajaxData[uuid]) {
					self.ajaxData[uuid] = self.getBlockSettings(uuid)
				}
				return $.ajax({
					type: 'GET',
					url: self.ajaxURL,
					data: {
						action: 'twppersonalizecat',
						data: self.ajaxData[uuid],
					},
				})
			})

			Promise.all(categoryRequests).then((responses) => {
				responses.forEach((response, index) => {
					const block = $(elements[index])
					block.html(response).fadeIn(200)
					block.dequeue()
				})

				if (typeof SABAY_PERSONALIZE !== 'undefined') {
					SABAY_PERSONALIZE.syncLayoutCategories()
				}
				self.reloadBlockFunc()
			})
		}
	}

	Module.readingCollect = function () {
		const self = this
		if (self.themeSettings.yesReadingHis === undefined) {
			return
		}
		$.ajax({
			type: 'GET',
			url: self.ajaxURL,
			data: {
				action: 'twpcollect',
				id: self.themeSettings.yesReadingHis,
			},
		})
	}

	return Module
})(TWP_MAIN_SCRIPT || {}, jQuery)

/** init */
jQuery(document).ready(function ($) {
	TWP_MAIN_SCRIPT.init()
})
