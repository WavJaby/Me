'use strict';
const windowHeaderHeight = parseInt(getStyle('.wHeader').height);
const windowHeaderColor = getStyle('.wHeader')['background-color'];

const windowMenuHeight = parseInt(getStyle('.wMenu > .item')['line-height']);
const windowMenuColor = getStyle('.wMenu > .item').color;

const windowBodyColor = getStyle('.wBody')['background-color'];

const windowTitleFont = (function(){
	const style = getStyle('.wHeader > .title');
    return style['font-size'] + ' / ' + style['line-height'] + ' ' + getStyle('*')['font-family'];
})();
const windowTitleLeft = parseInt(getStyle('.wHeader > .title')['margin-left']);
const windowTitleHeight = parseInt(getStyle('.wHeader > .title')['font-size']) * 1.1;
const windowTitleColor = getStyle('.wHeader > .title').color;

const windowCloseIcon = new Image();
windowCloseIcon.src = 'icon/close_icon.svg';
const windowMinimizeIcon = new Image();
windowMinimizeIcon.src = 'icon/minimize_icon.svg';
const windowIconSize = parseInt(getStyle('.wHeader > div > img').width);
const windowIconMargin = parseInt(getStyle('.wHeader > div > img').margin);
const windowIconButtonSize = parseInt(getStyle('.wHeader > .close, .wHeader > .minimize').width);

const menuButtonWidth = parseInt(getStyle('.menuBar > .item').width);

function Window() {
	// 視窗外框
	const windowElement = document.createElement('div');
	windowElement.classList.add('window');
	
	const windowHeader = document.createElement('div');
	windowHeader.classList.add('wHeader');
	windowHeader.classList.add('cantSelect');
	
	const windowMenu = document.createElement('div');
	windowMenu.classList.add('wMenu');
	windowMenu.classList.add('cantSelect');
	
	const windowBody = document.createElement('div');
	windowBody.classList.add('wBody');
	
	windowElement.appendChild(windowHeader);
	windowElement.appendChild(windowMenu);
	windowElement.appendChild(windowBody);
	
	// 元素
	const windowTitle = document.createElement('div');
	windowTitle.classList.add('title');
	
	const closeButton = document.createElement('div');
	closeButton.classList.add('close');
	closeButton.innerHTML = '<img src="icon/close_icon.svg"/>';
	
	const minimizeButton = document.createElement('div');
	minimizeButton.classList.add('minimize');
	minimizeButton.innerHTML = '<img src="icon/minimize_icon.svg"/>';
	
	windowHeader.appendChild(windowTitle);
	windowHeader.appendChild(closeButton);
	windowHeader.appendChild(minimizeButton);
	
	// 程式列
	const menuButton = document.createElement('div');
	let menuButtonPos;
	
	// 視窗設定
	let winWidth;
	let winHeight;
	let winMenuHeight = 0;
	let winX;
	let winY;
	let isMax;
	
	// 視窗大小設定
	this.setWindowSize = function(isMaximize, x, y, width, height) {
		const data = {};
        if (isMaximize) {
            isMax = true;
            winX = 0;
            winY = 0;
            windowElement.style.width = '100%';
        } else {
            isMax = false;
            winWidth = width;
            winHeight = height;
            winX = x;
            winY = y + menuBar.getHeight();
        }
		updateWindowSize();
	}
	
	this.open = function() {
        if (isMax === undefined)
            this.setWindowSize(true);
        minWindow.open(winX, winY, winWidth, winHeight, drawWindow, function() {
            document.body.appendChild(windowElement);
			menuBar.addItem(menuButton);
			menuButtonPos = menuButton.offsetLeft;
			menuButton.classList.add('opened');
        });
	}
	
    // 視窗縮小
    minimizeButton.onclick = function() {
        if (this.onMinimizeButton !== undefined)
            this.onMinimizeButton();
        windowElement.style.display = 'none';
        minWindow.minimize(winX, winY, menuButtonPos + menuButtonWidth / 2, 0, winWidth, winHeight, drawWindow, function() {
			menuButton.classList.remove('opened');
		});
    }
    
    function drawWindow(x, y, canvas) {
        canvas.fillStyle = windowHeaderColor;
        canvas.fillRect(x, y, winWidth, windowHeaderHeight);
        canvas.fillStyle = windowTitleColor;
        canvas.font = windowTitleFont;
        canvas.fillText(windowTitle.innerText, x + windowTitleLeft, y + windowTitleHeight);
        const iconX = x + winWidth - windowIconButtonSize / 2 - windowIconSize / 2;
        canvas.drawImage(windowCloseIcon, iconX , y + windowIconMargin, windowIconSize, windowIconSize);
        canvas.drawImage(windowMinimizeIcon, iconX - windowIconButtonSize , y + windowIconMargin, windowIconSize, windowIconSize);
        
        canvas.fillStyle = windowMenuColor;
        canvas.fillRect(x, y + windowHeaderHeight, winWidth, winMenuHeight);
        canvas.fillStyle = windowBodyColor;
        canvas.fillRect(x, y + windowHeaderHeight + winMenuHeight, winWidth, winHeight - windowHeaderHeight - winMenuHeight);
    }
	
    // chrome視窗大小改變
    this.resize = function() {
        updateWindowSize();
        if (this.onBodySizeChange !== undefined)
            this.onBodySizeChange();
    }
    windowResize.addWindow(this);
	
	// 數值
	this.getBodyHeight = function() {
		return winHeight -
            windowHeaderHeight -
            winMenuHeight;
	}
	
	// 功能
    this.onBodySizeChange;
    this.onMinimizeButton;
    
	this.setTitle = function(text) {
		windowTitle.innerText = text;
		menuButton.innerText = text;
	}
	
	this.addMenuItem = function(item) {
        if (winMenuHeight === 0) {
            winMenuHeight = windowMenuHeight;
        }
		item.classList.add('item');
		windowMenu.appendChild(item);
	}
	
	this.addBody = function(body) {
		windowBody.appendChild(body);
	}
    
	function updateWindowSize() {
        if (isMax) {
            winWidth = window.innerWidth;
            winHeight = window.innerHeight - menuBar.getHeight();
        } else {
            windowElement.style.width = winWidth + 'px';
            windowElement.style.left = winX + 'px';
            windowElement.style.top = winY + 'px';
        }
        windowBody.style.height = (
            winHeight -
            windowHeaderHeight -
            winMenuHeight
        ) + 'px';
	}
}

function MinimizeWindow() {
	const minimizeCanvas = document.createElement('canvas');
	minimizeCanvas.classList.add('windowMinimize');
	minimizeCanvas.style.display = 'none';
	const ctx = minimizeCanvas.getContext("2d");
	
	this.init = function() {
		document.body.appendChild(minimizeCanvas);
	}
	
	this.setFakeText = function(height, eleBound) {
		const fillStyle = 'rgb(200,200,200)';
		const bound = eleBound;
		const gap = 5;
		const itemHeight = 25;
		const width = [];
		for (let i = gap; i < height; i += itemHeight + gap)
			width.push(Math.random() * bound.width / 3 + itemHeight);
		
		const itemData = {};
		itemData.draw = function(canvas) {
			for (let i = 0; i < width.length; i++) 
				canvas.fillRoundRect(bound.left, bound.top + i * (itemHeight + gap) + gap, width[i] , itemHeight, itemHeight / 2);
		}
		itemData.fillStyle = fillStyle;
		eles.push(itemData);
	}
	
	// 縮小
	let scale;
	let scaleStep;
	let winWidth;
	let width;
	let height;
	let winHeight;
    
    let moveX;
    let moveY;
	let x;
	let y;
	function start() {
		if (scale < 0.1 || scale > 1) {
			minimizeCanvas.style.display = 'none';
            if (doneFun !== undefined) doneFun();
			return;
		}
		ctx.setTransform(scale, 0, 0, scale, 
            (x + moveX) * (1 - scale), 
            (y + moveY) * (1 - scale)
        );
        
        ctx.clearRect(x - winWidth / 2, y - winHeight / 2, winWidth * 2, winHeight * 2);
		ctx.globalAlpha = scale;
        drawFun(x, y, ctx);
        
		scale *= scaleStep;
		window.requestAnimationFrame(start);
	}
    
    let drawFun;
    let doneFun;
    this.open = function(fromX, fromY, windowWidth, windowHeight, drawFunction, whenDone) {
		minimizeCanvas.style.display = 'block';
        scale = 0.1;
        scaleStep = 1.2;
        x = fromX;
        y = fromY;
        winWidth = windowWidth;
        winHeight = windowHeight;
        moveX = winWidth / 2;
        moveY = winHeight / 2;
        width = ctx.canvas.width = minimizeCanvas.offsetWidth;
        height = ctx.canvas.height = minimizeCanvas.offsetHeight;
        drawFun = drawFunction;
        doneFun = whenDone;
        start();
    }
	
	this.minimize = function(fromX, fromY, toX, toY, windowWidth, windowHeight, drawFunction, whenDone) {
		minimizeCanvas.style.display = 'block';
        scale = 1;
        scaleStep = 0.8;
        x = fromX;
        y = fromY;
        winWidth = windowWidth;
        winHeight = windowHeight;
        moveX = toX - fromX;
        moveY = toY - fromY;
        width = ctx.canvas.width = minimizeCanvas.offsetWidth;
        height = ctx.canvas.height = minimizeCanvas.offsetHeight;
        drawFun = drawFunction;
        doneFun = whenDone;
        start();
	}
	
	this.maximize = function(fromX, fromY) {
		minimizeCanvas.style.display = 'block';
        scale = 0.05;
        scaleStep = 1.2;
        x = fromX;
        y = fromY;
        width = ctx.canvas.width = minimizeCanvas.offsetWidth;
        height = ctx.canvas.height = minimizeCanvas.offsetHeight;
		start();
	}
}