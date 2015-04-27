var $ = Zepto = require('zepto');

+ function() {
    function Tooltip(opt) {
        this.options = $.extend({
            dom: null,
            content: null,
            contentAttr: 'data-tooltip',
            hover: true,
            theme: 'gray',
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
        var pos = pos || _this.options.pos,
            result, className;
        if(_this.checkArg(pos)){
            
        }
        if(pos.length == 1){
          result = _this.getPos(pos,true);
        }else if(pos.length == 2){

        }    
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
            tHeight = $tip.height(),
            doffset = offset + Tooltip.ARROW_WIDTH;
        switch (pos) {
            case 'w':
                result.left = dLeft - tWidth - doffset;
                result.top = dTop + dHeight / 2 - tHeight / 2;
                break;

            case 'e':
                result.left = dLeft + dWidth + doffset;
                result.top = dTop + dHeight / 2 - tHeight / 2;
                break;

            case 'n':
                result.top = dTop + dHeight + doffset;
                result.left = dLeft + dWidth / 2 - tWidth / 2;
                break;

            default:
                result.top = dTop - tHeight - doffset;
                result.left = dLeft + dWidth / 2 - tWidth / 2;
        };
        return result;
    };

    Tooltip.ARROW_WIDTH = 5;

    Tooltip.checkArg = function(pos) {
        return /^((n|s)?(w|e)?)|((w|e)?(n|s)?)$/.test(pos);
    };

    module.exports = Tooltip;

}(Zepto);
