'use strict';
var out = function(e1,e2,e3,e4,e5) {
	if(!e2&&!e3&&!e4&&!e5) console.log(e1);
	else if(!e3&&!e4&&!e5) console.log(e1,e2);
	else if(!e4&&!e5) console.log(e1,e2,e3);
	else if(!e5) console.log(e1,e2,e3,e4);
	else console.log(e1,e2,e3,e4,e5);
};
var warn = console.warn;
out('準備自訂義插件...');
// 計時器
if (window.performance.now === undefined) {
	warn('沒有函式: performance.now');
	window.performance.now = Date.now;
}
function timer(text) {
	out(text + ((performance.now() - time) * 1000 | 0) / 1000 + 'ms');
	time = performance.now();
}
function timerReset() {
	time = performance.now();
}

// css
Element.prototype.getStyle = function(key) {
    return window.getComputedStyle(this, null).getPropertyValue(key);  
};

function getStyle(selector, style) {
	var styleSheet = document.styleSheets[1];
	var rules = styleSheet.cssRules ? styleSheet.cssRules : styleSheet.rules;

	for (var i = 0; i < rules.length; i++) {
		if (rules[i].selectorText === selector)
			return rules[i].style;
	}
};

// 其他
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

function repeatChar(len, char) {
	if (len <= 0)
		return '';
    return new Array(len + 1).join(char);
};

CanvasRenderingContext2D.prototype.fillRoundRect = function (x, y, width, height, r) {
  if (width < 2 * r) r = width / 2;
  if (height < 2 * r) r = height / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + width, y, x + width, y + height, r);
  this.arcTo(x + width, y + height, x, y + height, r);
  this.arcTo(x, y + height, x, y, r);
  this.arcTo(x, y, x + width, y, r);
  this.closePath();
  this.fill();
}

var saveCookie;
var cookie = new (function() {
	var map = {};
	var cache = document.cookie.split('; ');
	for (var i = 0; i < cache.length; i++) {
		if (cache[i].length === 0) continue;
		var split = cache[i].split('=');
		map[split[0]] = split[1];
	}
	var orignalMap = {};
	for (var key in map)
		orignalMap[key] = map[key];
	
	this.saveCookie = function() {
		var result = '';
		var count = 0;
		for (var key in map) {
			if (count > 0)
				result += '; ';
			result += key + '=' + map[key];
			var org = orignalMap[key];
			if (org !== undefined)
				delete orignalMap[key];
			count++;
		}
		// 刪除cookie
		for (var key in orignalMap) {
			if (count > 0)
				result += '; ';
			result += key + '=; Max-Age=0'
			count++;
		}
		document.cookie = result;
	}
	window.addEventListener("beforeunload", this.saveCookie, false);
	saveCookie = this.saveCookie;
	
	return map;
})();

function getStorage() {
	if (window.localStorage === undefined) {
		return new (function() {
			var map = cookie.localStorage != undefined ? JSON.parse(cookie.localStorage) : {};
			this.getItem = function(key) {
				var result = map[key];
				if (result === undefined)
					return null;
				return result;
			}
			
			this.setItem = function(key, value) {
				map[key] = String(value);
				cookie.localStorage = JSON.stringify(map);
			}
		})();
	}
	return window.localStorage;
}
