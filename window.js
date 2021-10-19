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
	
	// 數值
	this.getBodyHeight = function() {
		return windowBody.offsetHeight;
	}
}