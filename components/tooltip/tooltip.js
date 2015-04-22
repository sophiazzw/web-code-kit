var $ = Zepto = require('zepto');

+ function() {
    function Tooltip(opt) {
        this.options = $.extend({
            dom: null,
            content: null,
            contentAttr: 'data-tooltip',
            hover: true,
            theme: 'orange',
            pos: '',
            offset: 0,
            className: ''
        }, opt || {});

        this.init();
    }

    Tooltip.prototype.init = function() {
        var _this = this;

        _this.dom = $(this.options.dom);
        _this.tip = null;
        _this.isHide = true;

        _this.bindEvent();
        _this.createTip();
    };

    Tooltip.prototype.bindEvent = function() {
        var _this = this,
            opt = _this.options;

        if(opt.hover){
            _this.dom.bind('mouseenter',function(){
              _this.realdom = $(this);
              _this.show();
            }).bind('mouseleave',$.proxy(_this.hide, _this));
        }
        //ensures that the value of this in the original function refers to the context object
        $(window).resize($.proxy(_this.hide, _this));
    };

    Tooltip.prototype.createTip = function() {
        var _this = this,
            opts = _this.options;

        _this.tip = $('<div class="ui-tooltip-wrap"><div class="ui-tooltip-content"></div><i class="ui-tooltip-arrow"></i></div>').addClass('ui-tooltip-theme-' + opts.theme);
        opts.className && _this.tip.addClass(opts.className); 
        
    };

    Tooltip.prototype.setContent = function(content) {
        var _this = this,
            $dom = _this.realdom,
            opts = _this.options;
        if (content === undefined) {
            var attr = opts.contentAttr || 'title';
            attr == 'title' && $dom.removeAttr('title');
            content = $dom.attr(attr) || '';
        }
        _this.tip.appendTo(document.body).find('.ui-tooltip-content').html(content); //put $tip into dom to calculate width and height
        _this.setPos(); //the width or height of content will change the tip's pos
    };

    Tooltip.prototype.show = function() {
        var _this = this;
        _this.isHide = false;
        _this.setContent();
        _this.tip.show();
    };

    Tooltip.prototype.hide = function() {
        var _this = this;

        _this.isHide = true;
        _this.tip.hide().remove();
    };

    Tooltip.prototype.setPos = function(pos) {
        var _this = this;
        var pos = (pos || _this.options.pos).split(/\s+|-/),
            pos1 = pos[0],
            pos2 = pos[1],
            result, className;

        if (!pos2 || pos1 && pos2 == 'center') {
            /*
            left -> left center
            top -> top center
            left center -> left center
            center-center -> top center
            */
            result = _this.getPos(className = Tooltip.getPosName(pos1), true);
        } else if (pos1 == 'center') {
            /*
            center right -> right center
            center -> top center
            */
            result = _this.getPos(className = Tooltip.getPosName(pos2), true);
        } else {
            pos1 = Tooltip.getPosName(pos1);
            pos2 = Tooltip.getPosName(pos2);
            className = pos1 + '-' + pos2;

            result = $.extend(_this.getPos(pos1), _this.getPos(pos2));
        }

        _this.tip.css(result).addClass('ui-tooltip-' + className);
    };

    Tooltip.prototype.getPos = function(pos, center) {
        var _this = this,
            opts = _this.options,
            offset = opts.offset,
            result = {},
            $tip = _this.tip,
            $dom = _this.realdom;
        var dOffset = $dom.offset(),
            dTop = dOffset.top,
            dLeft = dOffset.left,
            dWidth = dOffset.width,
            dHeight = dOffset.height,
            tWidth = $tip.width(),
            tHeight = $tip.height();
        switch (pos) {
            case 'left':
                result.left = dLeft - tWidth - offset + (center ? -Tooltip.ARROW_WIDTH : Tooltip.NOT_CENTER_OFFSET);
                break;

            case 'right':
                result.left = dLeft + dWidth + offset + (center ? Tooltip.ARROW_WIDTH : -Tooltip.NOT_CENTER_OFFSET);
                break;

            case 'bottom':
                result.top = dTop + dHeight + offset + Tooltip.ARROW_WIDTH;
                break;

            default:
                result.top = dTop - tHeight - offset - Tooltip.ARROW_WIDTH;
        };

        if (center) {
            if (pos == 'left' || pos == 'right') {
                result.top = dTop + dHeight / 2 - tHeight / 2;
            } else {
                result.left = dLeft + dWidth / 2 - tWidth / 2;
            }
        }

        return result;
    };

    Tooltip.ARROW_WIDTH = 7;
    Tooltip.NOT_CENTER_OFFSET = Tooltip.ARROW_WIDTH;

    Tooltip.getPosName = function(pos) {
        return /^(?:left|bottom|right)$/.test(pos) ? pos : 'top';
    };

    module.exports = Tooltip;

}(Zepto);
