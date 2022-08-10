function getText(url, onload) {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200)
            onload(request.responseText);
    }
    request.send();
}

function getData(url, onload) {
    if (ieVersion === null || ieVersion > 10)
        getText(url, onload);
    else {
        var request = new XDomainRequest();
        request.onload = onload;
        request.open('GET', url.replace('https', 'http'));
    }
}

function loadCSS(url, onload) {
    var css = document.createElement('link');
    css.id = url;
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = url;
    css.onload = onload;
    document.head.appendChild(css);
    return css;
}

function loadSystemStyle(css, onload) {
    var fileCount = css.length;

    function fileLoaded() {
        if (--fileCount === 0) onload();
    }

    for (var i = 0; i < css.length; i++) {
        log('-> 加載' + css[i].name);
        loadCSS('System/' + css[i].url, fileLoaded);
    }
}

function loadSystemScript(js, onload) {
    var fileCount = js.length;

    function fileLoaded() {
        if (--fileCount === 0) onload();
    }

    for (var i = 0; i < js.length; i++) {
        log('-> 加載' + js[i].name);
        loadScript('System/' + js[i].url, fileLoaded);
    }
}

// Script加載器
function loadScript(url, onload) {
    if (ieVersion === null || ieVersion > 10) {
        var script = document.createElement('script');
        script.onload = onload;
        script.src = url;
        document.head.appendChild(script);
    } else
        loadScriptIE(url, document.body, onload);
}

function loadScriptToElement(url, element, onload) {
    if (ieVersion === null || ieVersion > 10) {
        var script = document.createElement('script');
        script.onload = onload;
        script.src = url;
        element.appendChild(script);
    } else
        loadScriptIE(url, element, onload);
}


// 給IE11以下Script加載器
function loadScriptIE(url, element, onload) {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            var script = document.createElement('script');
            script.text = toES5(request.responseText);
            if (ieVersion !== null && ieVersion < 9) {
                if (onload !== undefined) setTimeout(onload, 10);
            } else
                script.onload = onload;
            document.head.appendChild(script);
        }
    }
    request.send();
}

function toES5(input) {
    input = input
        .replace(/'use strict';/g, '')
        .replace(/const /g, 'var ')
        .replace(/let /g, 'var ')
        .replace(/.classList.add\('/g, '.className+=(\' ')
    ;
    var regex = /(.*)\.classList\.remove\( *'([\d\w]+)' *\)/g;
    var find;
    while ((find = regex.exec(input)) != null) {
        input = input.replace(
            new RegExp(find[1].replace('[', '\\[').replace(']', '\\]') + '\\.classList\\.remove\\( *\'' + find[2] + '\' *\\)'),
            find[1] + '.className=' + find[1] + '.className.replace(/' + find[2] + '/g,\'\'\)'
        );
    }

    return input;
}

// 初始化 console
var consoleArea = document.createElement('console');
document.body.appendChild(consoleArea);

function log(message) {
    var log = document.createElement('log');
    log.innerText = message;
    consoleArea.appendChild(log);
    return log;
}

function warn(message) {
    var log = document.createElement('warn');
    log.innerText = message;
    consoleArea.appendChild(log);
    return log;
}

// timer
function systemTime() {
    return ((performance.now() - SystemStartTime) * 1000 | 0) / 1000;
}

function timePass(start) {
    return ((performance.now() - start) * 1000 | 0) / 1000;
}

function doneTimeText(ele, time) {
    ele.innerText += 'done [' + time + 'ms]';
}

function timeNow() {
    return performance.now();
}

// 計時器
if (window.performance.now === undefined) {
    warn('沒有函式: performance.now');
    window.performance.now = Date.now;
}

// 必要函式確認
if (typeof (CanvasRenderingContext2D) === 'undefined') {
    warn('沒有物件: CanvasRenderingContext2D');
    loadScript('excanvas.js');
}

if (document.head === undefined) {
    warn('沒有數值: document.head');
    document.head = document.getElementsByTagName('head')[0];
}

if (XMLHttpRequest.DONE === undefined) {
    warn('沒有數值: XMLHttpRequest.DONE');
    XMLHttpRequest.DONE = 4;
}

if (Element.prototype.addEventListener === undefined) {
    warn('沒有函式: addEventListener');
    Element.prototype.addEventListener = window.attachEvent;
    window.addEventListener = window.attachEvent;
    document.addEventListener = window.attachEvent;
}

if (String.prototype.startsWith === undefined) {
    warn('沒有函式: String.startsWith');
    String.prototype.startsWith = function (input) {
        if (this.length < input.length) return false;
        for (var i = 0; i < input.length; i++)
            if (this.charAt(i) !== input.charAt(i))
                return false;
        return true;
    }
}

if (String.prototype.endsWith === undefined) {
    warn('沒有函式: String.endsWith');
    String.prototype.endsWith = function (input) {
        if (this.length < input.length) return false;
        for (var i = input.length - 1, j = this.length - 1; i > -1; i--, j--)
            if (this.charAt(j) !== input.charAt(i))
                return false;
        return true;
    }
}

// String.prototype.delete = function(input) {
// this.replace(new RegExp(input, 'gi'), '');
// }

// AnimationFrame
if (typeof requestAnimationFrame === 'undefined') {
    warn('沒有函式: requestAnimationFrame');
    var delay = 1000 / 60;
    var callBacks = [];
    var idleCount = 0;
    var interval = null;

    window.requestAnimationFrame = function (callBack) {
        if (callBack.animationFrameID === undefined) {
            callBack.animationFrameID = callBacks.length;
            callBack.animationStart = true;
            callBacks[callBack.animationFrameID] = callBack;
            start();
        } else {
            callBack.animationStart = true;
            callBacks[callBack.animationFrameID] = callBack;
        }
    }

    function start() {
        if (interval !== null) return;
        interval = setInterval(function () {
            for (var i = 0; i < callBacks.length; i++)
                if (callBacks[i].animationStart) {
                    callBacks[i].animationStart = false;
                    callBacks[i]();
                    idleCount = 0;
                }
            if (idleCount > 100) {
                for (var i = 0; i < callBacks.length; i++)
                    callBacks[i].animationFrameID = undefined;
                callBacks.length = 0;
                clearInterval(interval);
                interval = null;
            }
            idleCount++;
        }, delay);
    }
}