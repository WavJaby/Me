Element.prototype.getStyle = function(key) {
    return window.getComputedStyle(this, null).getPropertyValue(key);  
};

CanvasRenderingContext2D.prototype.fillRoundRect = function (x, y, width, height, r) {
  if (width < 2 * r) r = width / 2;
  if (height < 2 * r) r = height / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x + width, y, x + width, y + height, r);
  this.arcTo(x + width, y + height, x, y + height, r);
  this.arcTo(x, y + height, x, y, r);
  this.arcTo(x, y, x + width, y, r);
  this.closePath();
  this.fill();
}

let saveCookie;
const cookie = new (function() {
	const map = {};
	const cache = document.cookie.split('; ');
	for (let i = 0; i < cache.length; i++) {
		if (cache[i].length == 0) continue;
		const split = cache[i].split('=');
		map[split[0]] = split[1];
	}
	const orignalMap = {};
	for (let key in map)
		orignalMap[key] = map[key];
	
	this.saveCookie = function() {
		let result = '';
		let count = 0;
		for (let key in map) {
			if (count > 0)
				result += '; ';
			result += key + '=' + map[key];
			let org = orignalMap[key];
			if (org !== undefined)
				delete orignalMap[key];
			count++;
		}
		// 刪除cookie
		for (let key in orignalMap) {
			if (count > 0)
				result += '; ';
			result += key + '=; Max-Age=0'
			count++;
		}
		document.cookie = result;
		console.log(result);
		orignalKeys = Object.keys(map);
	}
	window.addEventListener("beforeunload", this.saveCookie, false);
	saveCookie = this.saveCookie;
	
	return map;
})();

const getStorage = function() {
	if (window.localStorage === undefined) {
		return new (function() {
			const map = cookie.localStorage != undefined ? JSON.parse(cookie.localStorage) : {};
			this.getItem = function(key) {
				const result = map[key];
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

