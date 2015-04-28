var $ = require('zepto');

function InputNumber(opt){
	this.options = $.extend({
		dom : null,
		max : '',
		min : '',
		step : '',
		val : '',
		className : ''
	}, opt || {});

	this.init();
}

InputNumber.prototype = {
	init: function(){
		var self = this, opt = self.options || {}, $dom = self.dom = $(opt.dom);
		self.max = self.clearComma(opt.max || $dom.attr('max')),
		self.step = self.clearComma(opt.step || $dom.attr('step')),
		self.min = self.clearComma(opt.min || $dom.attr('min')),
		self.val = self.clearComma(opt.val || $dom.val()),
		self.generate();
		self.detect(self.val);
	},
	bindEvent:function(){
		var self = this;
		var exp = /^[1-9](\d)*(,\d{3})*(.\d)*$/;
		$(self.minus).add(self.add).bind('click',function() {
			var operator = $(this).val();
			self.operate(operator);
		});
	},

	generate:function(){
		var self = this, $dom = self.dom = $(self.options.dom),className = self.options.className;
		$dom.addClass('ui-input-number').addClass(className ? (' ' + className) : '');
		self.minus = $('<input type="button"/>')
			.val('-')
			.addClass('input-number-button')
			.insertBefore(self.options.dom);
		self.add = $('<input type="button"/>')
			.val('+')
			.addClass('input-number-button')
			.insertAfter(self.options.dom);
		self.bindEvent();
	},

	operate:function(operator){
		var $dom = this.dom,
			offset = parseInt(operator+this.step),
			val = this.clearComma($dom.val()),
			total = offset+val,
			change = this.addComma(total);
		if(total>=this.min && total<=this.max) {
			$dom.val(change);
			this.val = total;
		} 
		$dom.change();
		this.detect(total);
	},

	clearComma:function(num){
		num+='';
		return parseInt(num.replace(/,/g,''));
	},

	addComma:function(num){
        num += '';  
        var ints = num.split('.');  
        var x1 = ints[0];  
        var x2 = ints.length > 1 ? '.' + ints[1] : '';  
        var reg = /(\d+)(\d{3})/;  
        while (reg.test(x1)) {  
            x1 = x1.replace(reg, '$1' + ',' + '$2');  
        }  
        return x1 + x2;  
	},

	detect:function(total){
		(total>=this.max) && this.disable(this.add);
		(total<=this.min) && this.disable(this.minus);
		(total>this.min) && this.enable(this.minus);
		(total<this.max) && this.enable(this.add);
	},

	disable: function(dom){
		dom.attr('disable','disable')
			.addClass('input-number-disable');
	},

	enable:function(dom){
		dom.removeAttr('disable')
			.removeClass('input-number-disable');
	},

	getSteps:function(){
		var self = this;
		return (self.val - self.min)/self.step;
	}
};

module.exports = InputNumber;
