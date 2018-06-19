/* =============================================================================
	jQuery Accordion ver3.1.4
	Copyright(c) 2017, ShanaBrian
	Dual licensed under the MIT and GPL licenses.
============================================================================= */
(function($) {

	$.fn.accordion = function(options) {
		if ($(this).length === 0) return this;

		if ($(this).length > 1) {
			$.each(this, function() {
				$(this).accordion(options);
			});
			return this;
		}

		var settings         = {},
			statusData       = {},
			$element         = this,
			$control         = null,
			$contentElem     = null,
			$changeClassElem = null,
			cssAnimateEvent  = 'transitionend webkitTransitionEnd animationend webkitAnimationEnd';

		// �������s
		var init = function() {
			/*
				controlElement  : �A�N�V�������N�����Ώۂ̗v�f [ selector ]
				contentElement  : �W�J������v�f [ selector ]
				addClassElement : �J�����Ƃ���CSS�N���X����K�p����v�f [ 'this' | 'control' | 'control-parent' | 'content' | jQuery Object | Element Name ]
				actionEvent     : �A�N�V�����C�x���g [ 'click' | 'mouseover' ]
				focusAction     : �t�H�[�J�X�ɂŃA�N�V�������邩�ǂ��� [ true | false ]
				startOpenIndex  : �ǂݍ��ݎ��ɍŏ��ɕ\������v�f�̃C���f�b�N�X�ԍ� [ 'all-open' | 'all-close' | number ]
				closedClassName : ���Ă����Ԃ�CSS�N���X��
				openedClassName : �J���Ă����Ԃ�CSS�N���X��
				animationFx     : �A�j���[�V�������� [ 'slide' | 'direct' | 'none' | 'css' ]
				animetionSpeed  : �A�j���[�V�����̑��x
				animetionEasing : �A�j���[�V�����̃C�[�W���O
				autoClose       : �J�����v�f�ȊO�̗v�f�������I�ɕ��邩�ǂ��� [ true | false ]
				openedCloseMode : �A�N�V�������N�������v�f�̊J����v�f���J���Ă���ꍇ�ɕ��邩�ǂ��� [ true | false ]
				openOnly        : �J����p�i���鏈�������j
				cssMode         : CSS�ŊJ���������邩�ۂ� [ true | false ]
				idPrefix        : ID�����t�^����l�̐ړ���
				onChange        : �J�؂�ւ����Ɏ��s����֐�
			*/
			settings = $.extend({
				controlElement  : '',
				contentElement  : '',
				addClassElement : 'this',
				actionEvent     : 'click',
				focusAction     : true,
				startOpenIndex  : 'all-close',
				openedClassName : 'opened',
				closedClassName : 'closed',
				animationFx     : 'slide',
				animetionSpeed  : 300,
				animetionEasing : 'swing',
				autoClose       : true,
				openedCloseMode : true,
				openOnly        : false,
				cssMode         : false,
				idPrefix        : 'acc',
				onChange        : null
			}, options);

			statusData = {
				status : 'wait',
				id     : settings.idPrefix + new Date().getTime() + '_' + Math.floor(Math.random() * 10000)
			};

			if (settings.startOpenIndex === 'all-open') {
				settings.autoClose = false;
			}

			$control     = $element.find(settings.controlElement);
			$contentElem = $element.find(settings.contentElement);

			if ($control.length === 0 || $contentElem.length === 0) return;

			setup();
		};

		/* �Z�b�g�A�b�v */
		var setup = function() {
			// �J�N���X�����蓖�Ă�v�f
			if (settings.addClassElement === 'this') {
				$changeClassElem = $element;
			} else if (settings.addClassElement === 'control') {
				$changeClassElem = $control;
			} else if (settings.addClassElement === 'control-parent') {
				$changeClassElem = $control.parent();
			} else if (settings.addClassElement === 'content') {
				$changeClassElem = $contentElem;
			} else if (settings.addClassElement === 'content-parent') {
				$changeClassElem = $contentElem.parent();
			} else if ($element.find(settings.addClassElement).length > 0) {
				$changeClassElem = $element.find(settings.addClassElement);
			}

			if (settings.actionEvent === 'click') {
				$control.on({
					'mousedown.accordion' : function() {
						$(this).attr('data-action-click', 'true');
					},
					'mouseup.accordion' : function() {
						$(this).removeAttr('data-action-click');
					},
					'click.accordion' : function() {
						var index = $control.index(this);
						$element.accChange(index, settings.onChange);

						return false;
					}
				});
			} else if (settings.actionEvent === 'mouseover') {
				$contentElem.on({
					'mouseenter.accordion' : function() {
						var index = $contentElem.index(this);

						$control.eq(index).attr('data-content-over', 'true');
					},
					'mouseleave.accordion' : function() {
						var index = $contentElem.index(this),
							$self = $(this);

						$control.eq(index).removeAttr('data-content-over');

						setTimeout(function() {
							if (!$self.attr('data-control-over') && settings.autoClose && !settings.openOnly) {
								$element.accClose(index, settings.onChange);
							}
						}, 100);
					}
				});

				$control.on({
					'mouseenter.accordion' : function() {
						var index = $control.index(this);
						$contentElem.eq(index).attr('data-control-over', 'true');
						$element.accOpen(index, settings.onChange);
					},
					'mouseleave.accordion' : function() {
						var index = $control.index(this),
							$self = $(this);

						$contentElem.eq(index).removeAttr('data-control-over');

						setTimeout(function() {
							if (!$self.attr('data-content-over') && settings.autoClose && !settings.openOnly) {
								$element.accClose(index, settings.onChange);
							}
						}, 100);
					}
				});
			}

			// �t�H�[�J�X�ɑ΂���J����
			if (settings.focusAction) {
				$.each($contentElem, function(index) {
					var $self      = $(this),
						focusCount = [];

					$(this).find('*').on({
						'focus.accordion' : function() {
							$control.eq(index).attr('data-content-focus', 'true');
							focusCount.push(true);

							$element.accOpen(index, settings.onChange);
						},
						'blur.accordion' : function() {
							$control.eq(index).removeAttr('data-content-focus');

							focusCount.shift();

							setTimeout(function() {
								if (!$self.attr('data-control-focus') && focusCount.length === 0 && settings.autoClose && !settings.openOnly) {
									$element.accClose(index, settings.onChange);
								}
							}, 100);
						}
					});
				});

				$control.on({
					'focus.accordion' : function() {
						var index = $control.index(this);
						$contentElem.eq(index).attr('data-control-focus', 'true');

						setTimeout(function() {
							console.log($control.eq(index).attr('data-action-click'));
							if (!$control.eq(index).attr('data-action-click')) {
								$element.accOpen(index, settings.onChange);
							}
						}, 100);
					},
					'blur.accordion' : function() {
						var index = $control.index(this),
							$self = $(this);

						$contentElem.eq(index).removeAttr('data-control-focus');

						setTimeout(function() {
							if (!$self.attr('data-content-focus') && settings.autoClose && !settings.openOnly) {
								$element.accClose(index, settings.onChange);
							}
						}, 100);
					}
				});
			}

			$element.addClass('wait');

			var stockAnimationFx = settings.animationFx;

			if (!stockAnimationFx.match(/^(direct|none|css)$/)) {
				settings.animationFx = 'direct';
			}

			$.each($control, function(index) {
				var id      = statusData.id + '_' + index,
					labelId = $(this).attr('id') || 'label_' + id,
					panelId = $contentElem.eq(index).attr('id') || 'panel_' + id;

				$(this).attr({
					'id'            : labelId,
					'aria-controls' : panelId
				});
				$contentElem.eq(index).attr({
					'id'              : panelId,
					'aria-labelledby' : labelId
				});

				if (settings.startOpenIndex === 'all-open' || index === settings.startOpenIndex) {
					$element.accOpen(index);
				} else {
					$element.accClose(index);
					if (stockAnimationFx === 'css') {
						changeAnimationClass(index, 'completed');
					}
				}
			});

			settings.animationFx = stockAnimationFx;

			statusData.status = 'ready';
			$element.removeClass('wait');
		};

		/* �N���X���؂�ւ� */
		var changeClass = function(index) {
			if (!$changeClassElem || $changeClassElem.length === 0) return;

			if (index || index === 0) {
				if ($contentElem.eq(index).attr('aria-expanded') === 'true') {
					$changeClassElem.eq(index).addClass(settings.openedClassName).removeClass(settings.closedClassName);
				} else {
					$changeClassElem.eq(index).removeClass(settings.openedClassName).addClass(settings.closedClassName);
				}
			} else {
				$.each($changeClassElem, function(index) {
					changeClass(index);
				});
			}
		};

		/* �J���E�����N���X���؂�ւ� */
		var changeAnimationClass = function(index, mode) {
			if (!$changeClassElem || $changeClassElem.length === 0) return;

			if (index || index === 0) {
				if (mode === 'animated') {
					$changeClassElem.eq(index).addClass('animated');
				} else {
					$changeClassElem.eq(index).removeClass('animated');
				}
			} else {
				$.each($changeClassElem, function(index) {
					changeAnimationClass(index, mode);
				});
			}
		};

		// �A�C�e���̍������擾
		var getItemHeight = function($item) {
			var heightValue    = 0;
			var tmpHeightValue = $item.height();

			$item.height('auto');
			heightValue = $item.height();
			$item.height(tmpHeightValue);

			return heightValue;
		};

		/* ID�̎擾 */
		$element.getId = function() {
			return statusData.id;
		};

		/* �J�i���\�b�h�j */
		$element.accChange = function(index, callback) {
			if ($contentElem.eq(index).attr('aria-expanded') === 'true') {
				if (settings.openedCloseMode && !settings.openOnly) {
					$element.accClose(index, callback);
				}
			} else {
				$element.accOpen(index, callback);

				if (settings.autoClose && !settings.openOnly) {
					$.each($control, function() {
						var aIndex = $control.index(this);

						if (aIndex === index) return true;
						if ($contentElem.eq(aIndex).attr('aria-expanded') === 'false') return true;

						$element.accClose(aIndex);
					});
				}
			}

			return $element;
		};

		/* �J���i���\�b�h�j */
		$element.accOpen = function(index, callback) {
			var $item = $contentElem;

			if (index || index === 0) {
				$item = $contentElem.eq(index);
			}

			$item.attr({
				'aria-expanded' : 'true',
				'aria-hidden'   : 'false'
			});
			changeClass(index);
			if (settings.animationFx !== 'none') {
				changeAnimationClass(index, 'animated');
			}

			if (settings.animationFx === 'slide') {
				$item.stop(false, true).slideDown(settings.animetionSpeed, settings.animetionEasing, function() {
					changeAnimationClass(index, 'completed');
					if (typeof callback === 'function') {
						callback();
					}
				});
			} else if (settings.animationFx === 'direct') {
				$item.show();
				changeAnimationClass(index, 'completed');
				if (typeof callback === 'function') {
					callback();
				}
			} else if (settings.animationFx === 'css') {
				$.each($item, function() {
					var heightVal = getItemHeight($(this));
					if (statusData.status === 'wait') {
						$(this).hide();
					}
					$(this).height(heightVal);
					if (statusData.status === 'wait') {
						$(this).css('display', '');
					}
				});

				$item.off(cssAnimateEvent);
				$item.on(cssAnimateEvent, function() {
					$(this).off(cssAnimateEvent);
					changeAnimationClass(index, 'completed');
					if (typeof callback === 'function') {
						callback();
					}
				});
			}

			return $element;
		};

		/* ����i���\�b�h�j */
		$element.accClose = function(index, callback) {
			var $item = $contentElem;

			if (index || index === 0) {
				$item = $contentElem.eq(index);
			}

			$item.attr({
				'aria-expanded' : 'false',
				'aria-hidden'   : 'true'
			});
			changeClass(index);
			if (settings.animationFx !== 'none') {
				changeAnimationClass(index, 'animated');
			}

			if (settings.animationFx === 'slide') {
				$item.stop(false, true).slideUp(settings.animetionSpeed, settings.animetionEasing, function() {
					changeAnimationClass(index, 'completed');
					if (typeof callback === 'function') {
						callback();
					}
				});
			} else if (settings.animationFx === 'direct') {
				$item.hide();
				changeAnimationClass(index, 'completed');
				if (typeof callback === 'function') {
					callback();
				}
			} else if (settings.animationFx === 'css') {
				$item.height(0);
				$item.off(cssAnimateEvent);
				$item.on(cssAnimateEvent, function() {
					$(this).off(cssAnimateEvent);
					changeAnimationClass(index, 'completed');
					if (typeof callback === 'function') {
						callback();
					}
				});
			}

			return $element;
		};

		/* �j���i���\�b�h�j */
		$element.destroy = function() {
			$control.off('click.accordion');
			$control.off('mouseover.accordion').off('mouseout.accordion');
			$control.off('focus.accordion').off('blur.accordion');
			$contentElem.find('*').off('focus.accordion').off('blur.accordion');
			$contentElem.off('mouseover.accordion').off('mouseout.accordion');
			$control.removeAttr('aria-controls');
			$contentElem.removeAttr('style').removeAttr('id').removeAttr('aria-expanded').removeAttr('aria-hidden');
			$contentElem.off(cssAnimateEvent);
			$changeClassElem.removeClass(settings.openedClassName).removeClass(settings.closedClassName);
			$changeClassElem.removeClass('animated');
		};

		init();

		return this;
	};
})(jQuery);