'use strict';
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
    minimizeButton.onclick = function() {
        if (this.onMinimizeButton !== undefined)
            this.onMinimizeButton();
        windowElement.style.display = 'none';
        minWin.minimize(100, 0);
    }
	
	windowHeader.appendChild(windowTitle);
	windowHeader.appendChild(closeButton);
	windowHeader.appendChild(minimizeButton);
    
    // 視窗縮小放大
    const minWin = new MinimizeWindow();
	
    // chrome視窗大小改變
    this.resize = function() {
        setWindowBodyHeight();
        if (this.onSizeChange !== undefined)
            this.onSizeChange();
    }
    windowResize.addWindow(this);
	
	// 數值
	this.getBodyHeight = function() {
		return windowBody.offsetHeight;
	}
	
	// 功能
    this.onSizeChange;
    this.onMinimizeButton;
    
	this.setTitle = function(text) {
		windowTitle.innerText = text;
	}
	
	this.addMenuItem = function(item) {
		item.classList.add('item');
		windowMenu.appendChild(item);
	}
	
	this.addBody = function(body) {
		windowBody.appendChild(body);
	}
	
	this.show = function() {
		document.body.appendChild(windowElement);
		setWindowBodyHeight();
        out();
        // 最小化視窗設定
		minWin.addElement(windowHeader);
		minWin.addElement(windowMenu);
		minWin.addElement(windowBody);
		minWin.addElement(windowTitle, 'text');
		const btns = windowHeader.getElementsByTagName('img');
        btns[0].onload = btns[1].onload = function() {
            minWin.addElement(this);
        }
	}
    
	function setWindowBodyHeight() {
		windowBody.style.height = (
			window.innerHeight - 
			windowMenu.offsetHeight - 
			windowHeader.offsetHeight
		) + 'px';
	}
}

function MinimizeWindow() {
	const ctx = canvasElementForMinimize.getContext("2d");
	
	const eles = [];
	this.addElement = function(ele, type) {
		const itemData = {};
		itemData.bound = ele.getBoundingClientRect();
        if (type === undefined) type = ele.tagName;
		if (type === 'IMG') {
			itemData.tagName = 'img';
			itemData.image = ele;
		} else if (type === 'text') {
			itemData.tagName = 'text';
			itemData.fillStyle = ele.getStyle('color');
			itemData.font = ele.getStyle('font');
			itemData.text = ele.innerText;
			itemData.height = parseInt(ele.getStyle('font-size')) * 1.1;
		} else if (type === 'DIV') {
			itemData.tagName = 'div';
			itemData.fillStyle = ele.getStyle('background-color');
		}
		eles.push(itemData);
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
	
	function drawElements(canvas) {
		for (let i = 0; i < eles.length; i++){
			const ele = eles[i];
			const bound = ele.bound;
            const type = ele.tagName;
			if (type === 'img') {
				canvas.drawImage(ele.image, bound.left, bound.top, bound.width, bound.height);
			} else if (type === 'text') {
				canvas.fillStyle = ele.fillStyle;
				canvas.font = ele.font;
				canvas.fillText(ele.text, bound.left, bound.top + ele.height);
			} else if (type ==='div') {
				canvas.fillStyle = ele.fillStyle;
				canvas.fillRect(bound.left, bound.top, bound.width, bound.height);
			} else {
				canvas.fillStyle = ele.fillStyle;
				ele.draw(canvas);
			}
		}
	}
	
	// 縮小
	let scale;
	let scaleStep;
	let width;
	let height;
	let x = 0;
	function start() {
		if (scale < 0.05 || scale > 1) {
			canvasElementForMinimize.style.display = 'none';
			return;
		}
		const sc = 1.2 / scaleStep;
        ctx.clearRect(-x, 0, width * sc, height * sc);
		ctx.globalAlpha = scale;
        drawElements(ctx);
        
		ctx.setTransform(scale, 0, 0, scale, x * (1 - scale), 0);
		scale *= scaleStep;
		window.requestAnimationFrame(start);
	}
	
	this.minimize = function(toX, toY) {
		canvasElementForMinimize.style.display = 'block';
        scale = 1;
        scaleStep = 0.8;
        x = toX;
        y = toY;
        width = ctx.canvas.width = canvasElementForMinimize.offsetWidth;
        height = ctx.canvas.height = canvasElementForMinimize.offsetHeight;
		start();
	}
    
	
	this.maximize = function(fromX, fromY) {
		canvasElementForMinimize.style.display = 'block';
        scale = 0.05;
        scaleStep = 1.2;
        x = fromX;
        y = fromY;
        width = ctx.canvas.width = canvasElementForMinimize.offsetWidth;
        height = ctx.canvas.height = canvasElementForMinimize.offsetHeight;
		start();
	}
}