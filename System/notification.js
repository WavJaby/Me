'use strict';
function Notification() {
	const notificationWindow = document.createElement('div');
    notificationWindow.classList.add('notificationWindow');
    notificationWindow.classList.add('clickThrough');
	this.init = function() {
		document.body.appendChild(notificationWindow);
	}
	
	this.sendNotification = function(title, description, time) {
		if(time === undefined) time = 2000;
		
		let notification = document.createElement('div');
		notification.classList.add('notification');
		let titleEle = document.createElement('h1');
		let descriptionEle = document.createElement('p');
		notification.appendChild(titleEle);
		notification.appendChild(descriptionEle);
		
		// 設定文字內容
		titleEle.innerText = title;
		descriptionEle.innerText = description;
		
		let windowWidth = notificationWindow.offsetWidth;
		let left = notificationWindow.offsetWidth;
		
		// 加入至視窗
		notificationWindow.appendChild(notification);
		
		let count = 0;
		// 滑入
		function slideIn() {
			if(left <= 1 || count > 100) {
				notification.style.left = '';
				count = 0;
				left = 1;
				setTimeout(slideOut, time);
			} else {
				notification.style.left = left + 'px';
				left = (left / 1.2) | 0;
				count++;
				window.requestAnimationFrame(slideIn);
			}
		}
		// 滑出
		function slideOut() {
			if(left > windowWidth || count > 100) {
				notificationWindow.removeChild(notification);
			} else {
				notification.style.left = left + 'px';
				left = left * 1.2;
				count++;
				window.requestAnimationFrame(slideOut);
			}
		}
		
		slideIn();
	}
}