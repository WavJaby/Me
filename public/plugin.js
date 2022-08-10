// css
Element.prototype.getStyle = function (key) {
    return window.getComputedStyle(this, null).getPropertyValue(key);
};

var systemStyleIndex = (ieVersion !== null && ieVersion < 9) ? 2 : 1;

function getStyle(selector) {
    var rules = mainStyle;

    for (var i = 0; i < rules.length; i++) {
        if (systemStyleIndex === 1 && rules[i].selectorText === selector)
            return rules[i].style;
        else if (systemStyleIndex === 2) {
            var a = rules[i].selectorText.split(' ');
            for (var j = 0; j < a.length; j++) {
                if (a[j] === '>') continue;
                var startC = a[j].charAt(0);
                if (startC !== '.' && startC !== '#')
                    a[j] = a[j].toLowerCase();
            }
            if (a.join(' ') === selector.split(',')[0])
                return rules[i].style;
        }
    }
}

// 其他
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

function repeatChar(len, char) {
    if (len <= 0)
        return '';
    return new Array(len + 1).join(char);
}

function fullScreen() {
    var body = document.body;
    if (body.requestFullscreen)
        body.requestFullscreen();
    else if (body.msRequestFullscreen)
        body.msRequestFullscreen();
    else if (body.mozRequestFullScreen)
        body.mozRequestFullScreen();
    else if (body.webkitRequestFullscreen)
        body.webkitRequestFullscreen();
}

// IE 9 以下
function initCanvas(canvas) {
    if (ieVersion !== null && ieVersion < 9)
        G_vmlCanvasManager.initElement(canvas);
}

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
var cookie = new (function () {
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

    this.saveCookie = function () {
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
        return new (function () {
            var map = cookie.localStorage != undefined ? JSON.parse(cookie.localStorage) : {};
            this.getItem = function (key) {
                var result = map[key];
                if (result === undefined)
                    return null;
                return result;
            }

            this.setItem = function (key, value) {
                map[key] = String(value);
                cookie.localStorage = JSON.stringify(map);
            }
        })();
    }
    return window.localStorage;
}

function isIE10() {return ieVersion !== null && ieVersion < 11}