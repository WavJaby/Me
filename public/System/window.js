'use strict';
const windowHeaderHeight = parseInt(getStyle('.wHeader').height);
const windowHeaderColor = getStyle('.wHeader').backgroundColor;

const windowMenuHeight = parseInt(getStyle('.wMenu > .item').lineHeight);
const windowMenuColor = getStyle('.wMenu > .item').color;

const windowBodyColor = getStyle('.wBody').backgroundColor;

// text
const windowTitleFont = (function () {
	const style = getStyle('.wHeader > .title');
	return style['font-size'] + ' / ' + style.lineHeight + ' ' + getStyle('*').fontFamily;
})();
const windowTitleLeft = parseInt(getStyle('.wHeader > .title').marginLeft);
const windowTitleHeight = parseInt(getStyle('.wHeader > .title').fontSize) * 1.1;
const windowTitleColor = getStyle('.wHeader > .title').color;

// icon
const windowIconMargin = parseInt(getStyle('.wHeader > .icon').marginTop);
const windowIconSize = parseInt(getStyle('.wHeader > .icon').width);

const windowFunctionIconSize = parseInt(getStyle('.wHeader > div > img').width);
const windowCloseIcon = new Image();
windowCloseIcon.src = 'System/Icon/close.svg';
const windowMinimizeIcon = new Image();
windowMinimizeIcon.src = 'System/Icon/minimize.svg';
if (ieVersion != null && ieVersion < 11) {
	windowCloseIcon.height = windowFunctionIconSize;
	windowMinimizeIcon.height = windowFunctionIconSize;
}
const windowFunctionIconMargin = parseInt(getStyle('.wHeader > div > img').marginTop);
const windowFunctionButtonSize = parseInt(getStyle('.wHeader > .close, .wHeader > .minimize').width);

// menu
const menuBarHeight = parseInt(getStyle('.menuBar').height);

// 視窗工具
const winManager = new WindowManager();
const minWindow = new MinimizeWindow();

function Window(resource) {
	// 視窗外框
	const windowElement = this.windowElement = document.createElement('div');
	windowElement.classList.add('window');

	const windowHeader = this.windowHeader = document.createElement('div');
	windowHeader.classList.add('fade');
	windowHeader.classList.add('wHeader');
	windowHeader.classList.add('cantSelect');

	const windowMenu = document.createElement('div');
	windowMenu.classList.add('wMenu');
	windowMenu.classList.add('cantSelect');

	const windowBody = document.createElement('div');
	windowBody.classList.add('wBody');
	this.addBody = function (body) {
		this.body = body;
		windowBody.appendChild(body);
	};

	// 用於移至最上層
	const windowTop = this.windowTop = document.createElement('div');
	windowTop.classList.add('wTop');
	windowBody.appendChild(windowTop);

	// 用於縮放視窗
	const windowResizeN = this.windowResizeN = document.createElement('div');
	windowResizeN.classList.add('wResizeN');// 北
	const windowResizeS = this.windowResizeS = document.createElement('div');
	windowResizeS.classList.add('wResizeS');// 南
	const windowResizeW = this.windowResizeW = document.createElement('div');
	windowResizeW.classList.add('wResizeW');// 西
	const windowResizeE = this.windowResizeE = document.createElement('div');
	windowResizeE.classList.add('wResizeE');// 東

	const windowResizeNE = this.windowResizeNE = document.createElement('div');
	windowResizeNE.classList.add('wResizeNE');// 東北
	const windowResizeNW = this.windowResizeNW = document.createElement('div');
	windowResizeNW.classList.add('wResizeNW');// 西北
	const windowResizeSE = this.windowResizeSE = document.createElement('div');
	windowResizeSE.classList.add('wResizeSE');// 東南
	const windowResizeSW = this.windowResizeSW = document.createElement('div');
	windowResizeSW.classList.add('wResizeSW');// 西南

	let canResize;
	this.canResize = function () {return canResize;};
	const setCanResize = this.setCanResize = function (boolean) {
		if (canResize === boolean) return;
		if (boolean) {
			windowElement.appendChild(windowResizeN);
			windowElement.appendChild(windowResizeS);
			windowElement.appendChild(windowResizeW);
			windowElement.appendChild(windowResizeE);
			windowElement.appendChild(windowResizeNE);
			windowElement.appendChild(windowResizeNW);
			windowElement.appendChild(windowResizeSE);
			windowElement.appendChild(windowResizeSW);
		} else if (canResize !== undefined) {
			windowElement.removeChild(windowResizeN);
			windowElement.removeChild(windowResizeS);
			windowElement.removeChild(windowResizeW);
			windowElement.removeChild(windowResizeE);
			windowElement.removeChild(windowResizeNE);
			windowElement.removeChild(windowResizeNW);
			windowElement.removeChild(windowResizeSE);
			windowElement.removeChild(windowResizeSW);
		}
		canResize = boolean;
	}

	windowElement.appendChild(windowHeader);
	windowElement.appendChild(windowMenu);
	windowElement.appendChild(windowBody);

	// 元素
	const windowTitle = document.createElement('div');
	windowTitle.classList.add('title');

	const closeButton = document.createElement('div');
	closeButton.classList.add('close');
	closeButton.appendChild(windowCloseIcon.cloneNode());

	const minimizeButton = document.createElement('div');
	minimizeButton.classList.add('minimize');
	minimizeButton.appendChild(windowMinimizeIcon.cloneNode());

	windowHeader.appendChild(windowTitle);
	windowHeader.appendChild(closeButton);
	windowHeader.appendChild(minimizeButton);

	let windowIcon = resource.icon;
	if (windowIcon !== undefined) {
		windowIcon = windowIcon.cloneNode();
		windowIcon.classList.add('icon');
		windowHeader.insertBefore(windowIcon, windowTitle);
	}
	this.setIcon = function (url) {
		windowIcon = document.createElement('img');
		windowIcon.classList.add('icon');
		windowIcon.src = url;
		windowHeader.insertBefore(windowIcon, windowTitle);
	}

	const menuButton = this.menuButton = document.createElement('div');
	let menuButtonPos;

//##############################################視窗設定##############################################
	let winTitle;
	let winWidth, winHeight;
	this.getWinWidth = function () {return winWidth;};
	let winMinWidth = this.defaultWidth = 600, winMinHeight = this.defaultHeight = 350;
	let originalWinWidth = winMinWidth, originalWinHeight = winMinHeight;
	this.setMinSize = function (w, h) {
		winMinWidth = w;
		winMinHeight = h;
	};
	let winMenuHeight = 0, winHederHeight = windowHeaderHeight;
	let winX;
	this.getX = function () {return winX;};
	let winY;
	this.getY = function () {return winY;};
	let isMaxSize;
	this.isMaxSize = function () {return isMaxSize;};
	let isActivate;
	let isMinimize = true;
	this.isMinimize = function () {return isMinimize;};

	let onOpen;
	this.setOnOpen = function (fun) {onOpen = fun;};
	let onSizeChange;
	this.setOnSizeChange = function (fun) {onSizeChange = fun;};
	let onActivateStateChange;
	this.setOnActivateStateChange = function (fun) {onActivateStateChange = fun;};
	this.onmouseup;

	this.setDefaultSize = function (width, height) {
		originalWinWidth = width;
		originalWinHeight = height;
		this.defaultWidth = width;
		this.defaultHeight = height;
	}
	// 視窗大小設定
	this.setSize = function (isMax, width, height) {
		isMaxSize = isMax;
		if (isMax) {
			winWidth = winManager.body.offsetWidth;
			winHeight = winManager.body.offsetHeight;
			winX = winY = 0;
			setCanResize(false);
			updateWindowLocation();
		} else {
			if (width !== undefined && height !== undefined) {
				winWidth = width;
				winHeight = height;
			} else {
				winWidth = originalWinWidth;
				winHeight = originalWinHeight;
			}
			setCanResize(true);
		}
		resetChangeSize();
		updateWindowSize();
	}

	let inWinWidth, inWinHeight;
	const resetChangeSize = this.resetChangeSize = function () {
		inWinWidth = winWidth;
		inWinHeight = winHeight;
	};
	this.addSize = function (width, height, bodyWidth, bodyHeight, left, top) {
		if (!isMaxSize) {
			inWinWidth += width;
			if (inWinWidth < winMinWidth) {
				if (left) winX -= winMinWidth - winWidth;
				winWidth = winMinWidth;
			} else {
				if (left) winX -= inWinWidth - winWidth;
				winWidth = inWinWidth;
			}
			inWinHeight += height;
			if (inWinHeight < winMinHeight) {
				if (top) winY -= winMinHeight - winHeight;
				winHeight = winMinHeight;
			} else {
				if (top) winY -= inWinHeight - winHeight;
				winHeight = inWinHeight;
			}
			if (left || top)
				updateWindowLocation();
			updateWindowSize();
		}
	}
	// 視窗位置設定
	this.setLocation = function (x, y) {
		if (y < 0) y = 0;
		winX = x;
		winY = y;
		updateWindowLocation();
	}

	// 視窗名稱設定
	this.setTitle = function (text) {
		winTitle = text;
		windowTitle.innerText = text;
		winManager.titleChange(this, text);
	}
	this.getTitle = function () {return windowTitle;};

	const setActivate = this.setActivate = function (boolean) {
		if (isActivate === boolean) return false;
		isActivate = boolean;
		if (isActivate) {
			windowBody.removeChild(windowTop);
			menuButton.classList.add('activate');
			windowElement.classList.add('activate');
		} else {
			windowBody.appendChild(windowTop);
			menuButton.classList.remove('activate');
			windowElement.classList.remove('activate');
		}
		if (onActivateStateChange !== undefined)
			onActivateStateChange(isActivate);
		return true;
	}
	this.isActivate = function () {return isActivate;};

	this.addMenuItem = function (item) {
		if (winMenuHeight === 0) {
			winMenuHeight = windowMenuHeight;
		}
		item.classList.add('item');
		windowMenu.appendChild(item);
	}

//##############################################視窗縮放##############################################
	const win = this;
	// 打開
	this.open = function () {
		if (winWidth === undefined || winHeight === undefined) {
			this.setSize(false, this.defaultWidth, this.defaultHeight);
		}
		if (winX === undefined || winY === undefined)
			winManager.setDefaultLocation(this);
		if (canResize === undefined)
			setCanResize(true);
		isMinimize = false;
		minWindow.open(winX, winY + menuBarHeight, winWidth, winHeight, drawWindow, function () {
			winManager.openWindow(win);
			setActivate(true);
			if (onSizeChange !== undefined)
				onSizeChange(winWidth, winHeight - winHederHeight - winMenuHeight);
			if (onOpen !== undefined)
				onOpen();
		});
	}

	// 最小化
	minimizeButton.onclick = this.minimizeWindow = function () {
		setActivate(false);
		isMinimize = true;
		windowElement.style.display = 'none';
		minWindow.minimize(winX, winY + menuBarHeight, menuButtonPos + menuButton.offsetWidth / 2, 0, winWidth, winHeight, drawWindow, function () {
			winManager.closeWindow(win);
		});
	}

	// 關閉
	closeButton.onclick = function () {
		winManager.closeWindow(win, true);
	}

	this.maximizeWindow = function () {
		isMinimize = false;
		minWindow.maximize(menuButtonPos + menuButton.offsetWidth / 2, 0, winX, winY + menuBarHeight, winWidth, winHeight, drawWindow, function () {
			windowElement.style.display = '';
			winManager.openWindow(win);
			setActivate(true);
		});
	}

	function drawWindow(x, y, canvas) {
		canvas.fillStyle = windowHeaderColor;
		canvas.fillRect(x, y, winWidth, winHederHeight);
		canvas.fillStyle = windowTitleColor;
		canvas.font = windowTitleFont;
		if (windowIcon !== undefined) {
			canvas.drawImage(windowIcon, x + windowIconMargin, y, windowIconSize, windowIconSize);
			canvas.fillText(windowTitle.innerText, x + windowTitleLeft + windowIconMargin + windowIconSize, y + windowTitleHeight);
		} else
			canvas.fillText(windowTitle.innerText, x + windowTitleLeft, y + windowTitleHeight);
		const iconX = x + winWidth - windowFunctionButtonSize / 2 - windowFunctionIconSize / 2;
		canvas.drawImage(windowCloseIcon, iconX, y + windowFunctionIconMargin, windowFunctionIconSize, windowFunctionIconSize);
		canvas.drawImage(windowMinimizeIcon, iconX - windowFunctionButtonSize, y + windowFunctionIconMargin, windowFunctionIconSize, windowFunctionIconSize);

		canvas.fillStyle = windowMenuColor;
		canvas.fillRect(x, y + winHederHeight, winWidth, winMenuHeight);
		canvas.fillStyle = windowBodyColor;
		canvas.fillRect(x, y + winHederHeight + winMenuHeight, winWidth, winHeight - winHederHeight - winMenuHeight);
	}

//##############################################視窗大小改變##############################################
	const style = this.style = windowElement.style;
	const bodyStyle = windowBody.style;

	this.resize = function () {
		if (!isMinimize && isMaxSize) {
			winWidth = winManager.body.offsetWidth;
			winHeight = winManager.body.offsetHeight;
			updateWindowSize();
		}
	}

	const updateWindowSize = function () {
		if (!isMinimize && onSizeChange !== undefined)
			onSizeChange(winWidth, winHeight - winHederHeight - winMenuHeight);
		if (!isMaxSize) {
			originalWinWidth = winWidth;
			originalWinHeight = winHeight;
		}
		bodyStyle.width = winWidth + 'px';
		bodyStyle.height = (
			winHeight -
			winHederHeight -
			winMenuHeight
		) + 'px';
	}

	const updateWindowLocation = function () {
		style.left = winX + 'px';
		style.top = winY + 'px';
	}
//##############################################視窗初始化##############################################

	winManager.addWindow(this);
	menuBar.addItem(menuButton);
	menuButtonPos = menuButton.offsetLeft;
}

function MinimizeWindow() {
	const minimizeCanvas = document.createElement('canvas');
	minimizeCanvas.classList.add('windowMinimize');
	minimizeCanvas.classList.add('clickThrough');
	minimizeCanvas.style.display = 'none';
	initCanvas(minimizeCanvas);
	const ctx = minimizeCanvas.getContext("2d");

	this.init = function () {
		document.body.appendChild(minimizeCanvas);
	}

	this.setFakeText = function (height, eleBound) {
		const fillStyle = 'rgb(200,200,200)';
		const bound = eleBound;
		const gap = 5;
		const itemHeight = 25;
		const width = [];
		for (let i = gap; i < height; i += itemHeight + gap)
			width.push(Math.random() * bound.width / 3 + itemHeight);

		const itemData = {};
		itemData.draw = function (canvas) {
			for (let i = 0; i < width.length; i++)
				canvas.fillRoundRect(bound.left, bound.top + i * (itemHeight + gap) + gap, width[i], itemHeight, itemHeight / 2);
		}
		itemData.fillStyle = fillStyle;
		eles.push(itemData);
	}

	// 視窗變化
	function start() {
		for (let i in tasks) {
			const win = tasks[i];
			let scale = win.scale;
			let newX = win.newX, newY = win.newY;
			let winWidth = win.winWidth, winHeight = win.winHeight;
			let offsetX = win.offsetX, offsetY = win.offsetY;

			// 清除這個視窗
			if (newX !== undefined) {
				const lastScale = win.lastScale;
				ctx.setTransform(lastScale, 0, 0, lastScale, 0, 0);
				ctx.clearRect(newX - 5, newY - 5, winWidth + 10, winHeight + 10);
			}
			// 停止縮放
			if (scale < 0.1 || scale > 1) {
				if (win.doneFun !== undefined) win.doneFun();
				delete tasks[i];
				taskCount--;
				if (taskCount <= 0) {
					minimizeCanvas.style.display = 'none';
					return;
				}
				continue;
			}

			ctx.setTransform(scale, 0, 0, scale, 0, 0);
			ctx.globalAlpha = scale;

			newX = (win.x * scale + win.toX * (1 - scale) + winWidth * offsetX) * (1 / scale) - winWidth * offsetX;
			newY = (win.y * scale + win.toY * (1 - scale) + winHeight * offsetY) * (1 / scale) - winHeight * offsetY;
			win.drawFun(newX, newY, ctx);

			win.lastScale = scale;
			win.scale = scale * win.step;
			win.newX = newX;
			win.newY = newY;

		}
		window.requestAnimationFrame(start);
	}


	const tasks = {};
	let taskCount = 0;
	let taskID = 0;

	function addTask(setting) {
		minimizeCanvas.style.display = 'block';
		ctx.canvas.width = minimizeCanvas.offsetWidth;
		ctx.canvas.height = minimizeCanvas.offsetHeight;
		setting.id = taskID;
		tasks[taskID] = setting;
		taskID++;
		taskCount++;

		if (taskCount === 1)
			window.requestAnimationFrame(start);
	}

	this.open = function (fromX, fromY, winWidth, winHeight, drawFun, doneFun) {
		addTask({
			x: fromX,
			y: fromY,
			toX: fromX,
			toY: fromY,
			scale: 0.1,
			step: 1.2,
			offsetX: 0.5,
			offsetY: 0.5,
			winWidth: winWidth,
			winHeight: winHeight,
			drawFun: drawFun,
			doneFun: doneFun,
		});
	}

	this.minimize = function (fromX, fromY, goX, goY, winWidth, winHeight, drawFun, doneFun) {
		addTask({
			x: fromX,
			y: fromY,
			toX: goX,
			toY: goY,
			scale: 1,
			step: 0.8,
			offsetX: 0,
			offsetY: 0,
			winWidth: winWidth,
			winHeight: winHeight,
			drawFun: drawFun,
			doneFun: doneFun,
		});
	}

	this.maximize = function (fromX, fromY, goX, goY, winWidth, winHeight, drawFun, doneFun) {
		addTask({
			x: goX,
			y: goY,
			toX: fromX,
			toY: fromY,
			scale: 0.1,
			step: 1.2,
			offsetX: 0,
			offsetY: 0,
			winWidth: winWidth,
			winHeight: winHeight,
			drawFun: drawFun,
			doneFun: doneFun,
		});
	}
}

function WindowManager() {
	const windows = [];
	const body = document.createElement('div');
	this.body = body;
	body.classList.add('body');

	this.init = function () {
		body.style.height = window.innerHeight - menuBarHeight + 'px';
		document.body.appendChild(body);
		minWindow.init();
	}

	let defaultX = 100, defaultY = 100;
	this.setDefaultLocation = function (win) {
		win.setLocation(defaultX, defaultY);
		defaultX += windowHeaderHeight;
		defaultY += windowHeaderHeight;
	}

	window.onresize = function () {
		body.style.height = window.innerHeight - menuBarHeight + 'px';
		if (windows.length === 0) return;
		if (windows.length === 1) {
			windows[0].resize();
			return;
		}

		for (let i = 0; i < windows.length; i++)
			windows[i].resize();
	}

	// 滑鼠拖曳
	let moveWin = null;
	let resizeWin = null;
	let startX, startY;
	let resizeX, resizeY;
	let lastX, lastY;
	document.onmouseup = function (e) {
		if (moveWin !== null) {
			if (moveWin.canResize()) {
				if (e.pageY < menuBarHeight)
					moveWin.setSize(true);
				else if (e.pageX <= 0) {
					moveWin.setSize(false, body.offsetWidth / 2, body.offsetHeight);
					moveWin.setLocation(0, 0);
				}
			}
			moveWin = null;
		} else if (resizeWin !== null) {
			resizeWin.resetChangeSize();
			resizeWin = null;
		} else if (windows.length > 0 && windows[windows.length - 1].onmouseup !== undefined)
			windows[windows.length - 1].onmouseup();
	}

	function touchEnd(e) {
		getTouchPoint(e);
		document.onmouseup(e);
	}

	document.addEventListener("touchend", touchEnd, false);
	document.addEventListener("touchcancel", touchEnd, false);

	document.onmousemove = function (e) {
		// if (moveWin === null && resizeWin === null) return;
		// let mouseX = e.pageX;
		// if (mouseX > window.innerWidth) mouseX = window.innerWidth;
		// if (mouseX < 0) mouseX = 0;
		// let mouseY = e.pageY;
		// if (mouseY > window.innerHeight) mouseY = window.innerHeight - menuBarHeight;
		// if (mouseY < menuBarHeight) mouseY = menuBarHeight;
		if (moveWin !== null) {
			let mouseX = e.pageX;
			let mouseY = e.pageY;
			if (moveWin.isMaxSize()) {
				moveWin.setSize(false);
				startX = -moveWin.getWinWidth() / 2;
			} else {
				if (mouseX > 0 && mouseY > 0 && mouseX < body.offsetWidth && mouseY < body.offsetHeight + menuBarHeight)
					moveWin.setLocation(mouseX + startX, mouseY + startY);
			}
		} else if (resizeWin !== null) {
			let mouseX = e.pageX;
			let mouseY = e.pageY;
			const moveX = mouseX - lastX;
			const moveY = mouseY - lastY;
			lastX = mouseX;
			lastY = mouseY;
			resizeWin.addSize(moveX * resizeX, moveY * resizeY, body.offsetWidth, body.offsetHeight, resizeX < 0, resizeY < 0);
		}
	}

	document.addEventListener("touchmove", function (e) {
		getTouchPoint(e);
		document.onmousemove(e);
	}, false);

	// 開啟視窗
	this.openWindow = function (win) {
		if (windows.length > 0)
			windows[windows.length - 1].setActivate(false);
		win.index = windows.length;
		win.style.zIndex = windows.length;
		windows.push(win);

		body.appendChild(win.windowElement);
	}
	// 關閉視窗
	this.closeWindow = function (win, close) {
		windows.splice(win.index, 1);
		if (close === true) {
			menuBar.removeItem(win.menuButton);
			body.removeChild(win.windowElement);
		}

		if (windows.length > 0)
			windows[windows.length - 1].setActivate(true);
	}
	// 新增視窗
	this.addWindow = function (win) {
		// 移至最上層
		win.windowTop.onmousedown = function () {
			moveToTop(win);
		}
		// 移動視窗
		win.windowHeader.onmousedown = function (e) {
			if (!win.isActivate())
				moveToTop(win);
			moveWin = win;
			startX = win.getX() - e.pageX;
			startY = win.getY() - e.pageY;
		}
		win.windowHeader.addEventListener("touchstart", function (e) {
			getTouchPoint(e);
			win.windowHeader.onmousedown(e);
		}, false);
		// 更動視窗大小
		win.windowResizeN.onmousedown = function (e) {
			resizeSetUp(win, e);
			resizeX = 0;
			resizeY = -1;
		};
		win.windowResizeS.onmousedown = function (e) {
			resizeSetUp(win, e);
			resizeX = 0;
			resizeY = 1;
		};
		win.windowResizeW.onmousedown = function (e) {
			resizeSetUp(win, e);
			resizeX = -1;
			resizeY = 0;
		};
		win.windowResizeE.onmousedown = function (e) {
			resizeSetUp(win, e);
			resizeX = 1;
			resizeY = 0;
		};
		win.windowResizeNE.onmousedown = function (e) {
			resizeSetUp(win, e);
			resizeX = 1;
			resizeY = -1;
		};
		win.windowResizeNW.onmousedown = function (e) {
			resizeSetUp(win, e);
			resizeX = -1;
			resizeY = -1;
		};
		win.windowResizeSE.onmousedown = function (e) {
			resizeSetUp(win, e);
			resizeX = 1;
			resizeY = 1;
		};
		win.windowResizeSW.onmousedown = function (e) {
			resizeSetUp(win, e);
			resizeX = -1;
			resizeY = 1;
		};

		// 最大或最小化
		win.menuButton.onclick = function () {
			if (win.isMinimize())
				win.maximizeWindow();
			else {
				if (!win.isActivate())
					moveToTop(win);
				else
					win.minimizeWindow();
			}
		}
	}

	this.titleChange = function (win, title) {
		win.menuButton.innerText = title;
	}

	function moveToTop(win) {
		windows.splice(win.index, 1);
		for (let i = 0; i < windows.length; i++) {
			const window = windows[i]
			window.index = i;
			window.style.zIndex = i;
			window.setActivate(false);
		}
		win.index = windows.length;
		win.style.zIndex = win.index;

		windows.push(win);
		win.setActivate(true);
	}

	function resizeSetUp(win, e) {
		if (!win.isActivate())
			moveToTop(win);
		resizeWin = win;
		e.preventDefault();
		lastX = e.pageX;
		lastY = e.pageY;
	}

	function getTouchPoint(e) {
		const changeTouch = e.changedTouches[0];
		e.pageX = changeTouch.pageX;
		e.pageY = changeTouch.pageY;
	}
}