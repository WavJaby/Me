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
	
	
	windowHeader.appendChild(windowTitle);
	windowHeader.appendChild(closeButton);
	windowHeader.appendChild(minimizeButton);
	
	function setWindowBodyHeight() {
		windowBody.style.height = (
			window.innerHeight - 
			windowMenu.offsetHeight - 
			windowHeader.offsetHeight
		) + 'px';
	}
	
	// 數值
	this.getBodyHeight = function() {
		return windowBody.offsetHeight;
	}
	
	// 功能
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
	}
	
}

function MinimizeWindow(canvasElement) {
	let ctx = canvasElement.getContext("2d");
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	canvasElement.style.display = 'none';
	
	const eles = [];
	this.addElement = function(ele) {
		const itemData = {};
		itemData.bound = ele.getBoundingClientRect();
		if (ele.tagName == 'IMG') {
			itemData.tagName = 'img';
			itemData.image = ele; 
		} else if (ele.tagName == 'P') {
			itemData.tagName = 'p';
			itemData.fillStyle = ele.getStyle('color');
			itemData.font = ele.getStyle('font');
			itemData.text = ele.innerText;
			itemData.height = parseInt(ele.getStyle('font-size')) * 1.1;
		} else if (ele.tagName == 'DIV') {
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
			if (ele.tagName == 'img') {
				canvas.drawImage(ele.image, bound.left, bound.top, bound.width, bound.height);
			} else if (ele.tagName == 'p') {
				canvas.fillStyle = ele.fillStyle;
				canvas.font = ele.font;
				canvas.fillText(ele.text, bound.left, bound.top + ele.height);
			} else if (ele.tagName == 'div') {
				canvas.fillStyle = ele.fillStyle;
				canvas.fillRect(bound.left, bound.top, bound.width, bound.height);
			} else {
				canvas.fillStyle = ele.fillStyle;
				ele.draw(canvas);
			}
		}
	}
	
	// 縮小
	let scale = 1;
	let x = 0;
	function minimize(toX) {
		if (scale < 0.05) {
			canvasElement.style.display = 'none';
			return;
		}
		ctx.clearRect(0 - x * 2, 0, ctx.canvas.width * (2 - scale), ctx.canvas.height * (2 - scale));
		ctx.globalAlpha = scale;
		drawElements(ctx);
		
		x = toX * (1 - scale);
		ctx.setTransform (scale, 0, 0, scale, x, 0);
		scale *= 0.8;
		window.requestAnimationFrame(minimize);
	}
	// 放大
	
	
	this.minimize = function(toX) {
		canvasElement.style.display = 'block';
		minimize(toX);
	}
}