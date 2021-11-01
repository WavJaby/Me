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
windowCloseIcon.src = 'icon/close.svg';
const windowMinimizeIcon = new Image();
windowMinimizeIcon.src = 'icon/minimize.svg';
const windowIconSize = parseInt(getStyle('.wHeader > div > img').width);
const windowIconMargin = parseInt(getStyle('.wHeader > div > img').margin);
const windowIconButtonSize = parseInt(getStyle('.wHeader > .close, .wHeader > .minimize').width);

const menuButtonWidth = parseInt(getStyle('.menuBar > .item').width);

// 視窗工具
const minWindow = new MinimizeWindow();
const winManager = new WindowManager();

function Window() {
	// 視窗外框
	const windowElement = this.windowElement = document.createElement('div');
	windowElement.classList.add('window');
	
	const windowHeader = this.windowHeader = document.createElement('div');
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
	closeButton.innerHTML = '<img src="icon/close.svg"/>';
	
	const minimizeButton = document.createElement('div');
	minimizeButton.classList.add('minimize');
	minimizeButton.innerHTML = '<img src="icon/minimize.svg"/>';
	
	windowHeader.appendChild(windowTitle);
	windowHeader.appendChild(closeButton);
	windowHeader.appendChild(minimizeButton);
	
	const menuButton = this.menuButton = document.createElement('div');
	let menuButtonPos;
	
//##############################################視窗設定##############################################
	let winTitle;
	let winWidth;
	let winHeight;
	let winMenuHeight = 0;
	let winX; this.getX = function(){return winX;};
	let winY; this.getY = function(){return winY;};
	let isMaxSize; this.isMaxSize = function(){return isMaxSize;};
	let isActivate;
	let isMinimize = true; this.isMinimize = function(){return isMinimize;};
	
    this.onSizeChange; 
    let onActivateStateChange; this.setOnActivateStateChange = function(fun){onActivateStateChange = fun;};
	
	
	// 視窗大小設定
	this.setWindowSize = function(isMaximize, x, y, width, height) {
        if (isMaximize) {
            isMaxSize = true;
            winX = 0;
            winY = 0;
            windowElement.style.width = '100%';
        } else {
			if (x === undefined){
				isMaxSize = false;
				winWidth = this.defaultWidth;
				winHeight = this.defaultHeight;
			} else {
				isMaxSize = false;
				winWidth = width;
				this.defaultWidth = width;
				winHeight = height;
				this.defaultHeight = height;
				winX = x;
				winY = y;
			}
        }
		updateWindowSize();
	}
	
	this.setTitle = function(text) {
		winTitle = text;
		windowTitle.innerText = text;
		winManager.titleChange(this, text);
	}
	this.getTitle = function() {return windowTitle;};
	
	const setActivate = this.setActivate = function(boolean) {
		if (isActivate === boolean) return;
		isActivate = boolean;
		if (onActivateStateChange !== undefined)
			onActivateStateChange(boolean);
	}
	this.isActivate = function(){return isActivate;};
	
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
	
//##############################################視窗縮放##############################################
	const win = this;
	// 打開
	this.open = function(openEvent) {
        if (isMaxSize === undefined)
            this.setWindowSize(true);
		setActivate(true);
		isMinimize = false;
		menuButton.classList.add('activate');
        minWindow.open(winX, winY + menuBar.getHeight(), winWidth, winHeight, drawWindow, function() {
			winManager.openWindow(win);
            if (openEvent !== undefined)
                openEvent();
        });
	}
	
	// 最小化
    minimizeButton.onmousedown = this.minimizeWindow = function() {
		setActivate(false);
		isMinimize = true;
        windowElement.style.display = 'none';
        minWindow.minimize(winX, winY + menuBar.getHeight(), menuButtonPos + menuButtonWidth / 2, 0 , winWidth, winHeight, drawWindow, function() {
			winManager.closeWindow(win);
		});
    }
	
	this.maximizeWindow = function() {
		setActivate(true);
		isMinimize = false;
		minWindow.maximize(menuButtonPos + menuButtonWidth / 2, 0, winX, winY + menuBar.getHeight(), winWidth, winHeight, drawWindow, function() {
			windowElement.style.display = '';
			winManager.openWindow(win);
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
	
//##############################################視窗大小改變##############################################
    this.getBodyHeight = function() {
		return winHeight -
            windowHeaderHeight -
            winMenuHeight;
	}
    
	const updateWindowSize = this.resize = function() {
        if (isMaxSize) {
            winWidth = window.innerWidth;
            winHeight = window.innerHeight - menuBar.getHeight();
            windowElement.style.left = winX + 'px';
            windowElement.style.top = winY + menuBar.getHeight() + 'px';
			if (win.onSizeChange !== undefined)
				win.onSizeChange();
        } else {
            windowElement.style.width = winWidth + 'px';
            windowElement.style.left = winX + 'px';
            windowElement.style.top = winY + menuBar.getHeight() + 'px';
        }
        windowBody.style.height = (
            winHeight -
            windowHeaderHeight -
            winMenuHeight
        ) + 'px';
	}
//##############################################視窗位置改變##############################################
	this.setWindowLocation = function(x, y) {
		((y < 0) && (y = 0));
		winX = x;
		winY = y;
		windowElement.style.left = x + 'px';
        windowElement.style.top = y + menuBar.getHeight() + 'px';
	}
	
	winManager.addWindow(this);
	menuBar.addItem(menuButton);
	menuButtonPos = menuButton.offsetLeft;
}

function MinimizeWindow() {
	const minimizeCanvas = document.createElement('canvas');
	minimizeCanvas.classList.add('windowMinimize');
	minimizeCanvas.classList.add('clickThrough');
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
        
        if(taskCount === 1) 
            window.requestAnimationFrame(start);
    }
    
    this.open = function(fromX, fromY, winWidth, winHeight, drawFun, doneFun) {
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
	
	this.minimize = function(fromX, fromY, goX, goY, winWidth, winHeight, drawFun, doneFun) {
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
	
	this.maximize = function(fromX, fromY, goX, goY, winWidth, winHeight, drawFun, doneFun) {
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
    
	window.onresize = function() {
        if(windows.length === 0) return;
        if(windows.length === 1) {
            windows[0].resize();
            return;
        }
        
        for (let i = 0; i < windows.length; i++)
            windows[i].resize();
	}
	
	let clickedWin = null;
	let startX, startY;
	document.onmouseup = function(e) {
		if (clickedWin === null) return;
		if(e.y + startY < 0)
			clickedWin.setWindowSize(true);
		clickedWin = null;
	}
	
	document.onmousemove = function(e) {
		if (clickedWin === null) return;
		if (clickedWin.isMaxSize()) {
			clickedWin.setWindowSize(false);
			startX = -clickedWin.defaultWidth / 2;
		} else
			clickedWin.setWindowLocation(e.x + startX, e.y + startY);
	}
	
	this.openWindow = function(win) {
		if (windows.length > 0){
			windows[windows.length - 1].setActivate(false);
			windows[windows.length - 1].menuButton.classList.remove('activate');
		}
		win.index = windows.length;
        windows.push(win);
		
		win.menuButton.classList.add('activate');
        document.body.appendChild(win.windowElement);
	}
	
	this.closeWindow = function(win) {
		win.menuButton.classList.remove('activate');
		
		windows.splice(win.index, 1);
		if (windows.length > 0){
			windows[windows.length - 1].setActivate(true);
			windows[windows.length - 1].menuButton.classList.add('activate');
		}
	}
	
    this.addWindow = function(win) {
		win.windowElement.onmousedown = function() {
			moveToTop(win);
		}
		
		win.windowHeader.onmousedown = function(e) {
			clickedWin = win;
			startX = win.getX() - e.x;
			startY = win.getY() - e.y;
		}
		
		// 最大或最小化
		win.menuButton.onclick = function() {
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
	
	this.titleChange = function(win, title) {
		win.menuButton.innerText = title;
	}
	
	function moveToTop(win) {
		windows.splice(win.index, 1);
		for (let i = 0; i < windows.length; i++) {
			windows[i].index = i;
			windows[i].setActivate(false);
			windows[i].menuButton.classList.remove('activate');
		}
		win.index = windows.length;
		windows.push(win);
		
		win.setActivate(true);
		win.menuButton.classList.add('activate');
		
		document.body.appendChild(win.windowElement);
	}
}