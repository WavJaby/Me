function WebRTC(win, res) {
	// 初始化視窗
	win.setTitle('Web RTC');
	win.setDefaultSize(650, 500);
	
	const body = document.createElement('div');
	body.classList.add('webRTC');
	win.addBody(body);
	
	// loadScript('https://cdn.jsdelivr.net/npm/socket.io-client@2/dist/socket.io.js');
	
	win.open();
	
	// 顯示
	const view = document.createElement('div');
	view.classList.add('viewWindow');
	const local = document.createElement('div');
	const title = document.createElement('h1');
	title.innerText = '本機端';
	const video = document.createElement('video');
	video.autoplay = true;
	local.appendChild(title);
	local.appendChild(video);
	local.classList.add('video');
	local.classList.add('padding');
	
	const remote = document.createElement('div');
	const rTitle = document.createElement('h1');
	rTitle.innerText = '遠端';
	const rVideo = document.createElement('video');
	rVideo.autoplay = true;
	remote.appendChild(rTitle);
	remote.appendChild(rVideo);
	remote.classList.add('video');
	remote.classList.add('padding');
	
	view.appendChild(local);
	view.appendChild(remote);
	body.appendChild(view);
	
	// 控制
	const startButton = document.createElement('div');
	startButton.innerText = '開始';
	const callButton = document.createElement('div');
	callButton.innerText = '撥通';
	const hangupButton = document.createElement('div');
	hangupButton.innerText = '掛斷';
	
	startButton.classList.add('button');
	startButton.classList.add('cantSelect');
	callButton.classList.add('button');
	callButton.classList.add('cantSelect');
	hangupButton.classList.add('cantSelect');
	hangupButton.classList.add('button');
	
	body.appendChild(startButton);
	body.appendChild(callButton);
	body.appendChild(hangupButton);
	
	//Javascript variables holding stream and connection information
	var localStream, localPeerConnection, remotePeerConnection;

	//Allow the user to clicl on the call button at start-up
	startButton.disable = false;
	callButton.disable = true;
	hangupButton.disable = true; 

	//Associate Javascript handlers with click events on the buttons 
	startButton.onclick = start;
	callButton.onclick = call;
	hangupButton.onclick = hangup;
	
	// Utility function for logging information to the JavaScript console 
	function log(text) {
		console.log("At time: " + (performance.now() / 1000).toFixed(3) + " --> " 
		+ text); 
	}
	
	// server
	const socket = io('http://localhost:3000');
	var servers = {
		iceServers: [{
			url: 'stun:stun.l.google.com:19302' // Google's public STUN server
		}]
	};

	// Function associated with clicking on the Start button 
	// This is the event triggering all other actions 
	function start() {
		log("Requesting local stream");
		// First of all, disable the Start button on the page
		startButton.disabled = true;
		// Get ready to deal with diffnavigatorerent browser vendors...
		navigator.getUserMedia = navigator.getUserMedia ||
		navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


		// Now, call getUserMedia()
		navigator.getUserMedia({audio:true, video:true}, successCallback, function(error) {
			log("navigator.getUserMedia error: ", error);  
		}); 
	}

	// Function associated with clicking on the Call button 
	// This is enabled upon successful completion of the Start button handler 
	function call() {
		// First of all, disable the Call button on the page...
		callButton.disabled = true;
		// ...and enable the Hangup button
		hangupButton.disabled = false;
		log("Starting call");
		// Note that getVideoTracks() and getAudioTracks() are not currently
		// supported in Firefox...
		// ...just use them with Chrome
		if (navigator.webkitGetUserMedia) {  
		  // Log info about video and audio device in use  
			if (localStream.getVideoTracks().length > 0) { 
				log('Using video device: ' + localStream.getVideoTracks()[0].label);  
			} 
			if (localStream.getAudioTracks().length > 0) { 
				log('Using audio device: ' + localStream.getAudioTracks()[0].label);  
			}  
		}

		
		// Chrome
		if (navigator.webkitGetUserMedia) {  
			RTCPeerConnection = webkitRTCPeerConnection;
		 // Firefox
		} else if(navigator.mozGetUserMedia){  
			TCPeerConnection = mozRTCPeerConnection;  
			RTCSessionDescription = mozRTCSessionDescription;  
			RTCIceCandidate = mozRTCIceCandidate;  
		}

		log("RTCPeerConnection object: " + RTCPeerConnection);

		// Create the local PeerConnection object
		localPeerConnection = new RTCPeerConnection(servers);
		log("Created local peer connection object localPeerConnection");
		// Add a handler associated with ICE protocol events
		localPeerConnection.onicecandidate = ({candidate}) => {
			if (!candidate) return;
			console.log('onIceCandidate => ', candidate);
			socket.emit("peerconnectSignaling", {candidate});
		};
		// Add the local stream (as returned by getUserMedia())
		// to the local PeerConnection.
		log("Added localStream to localPeerConnection");
		localPeerConnection.oniceconnectionstatechange = (evt) => {
			console.log('ICE 伺服器狀態變更 => ', evt.target.iceConnectionState);
		};
		localPeerConnection.onaddstream = gotRemoteStream;
		
		
		setTimeout(()=>{
			// join
			socket.emit('joinRoom', 'room');
		},1000);
		
		createSignal(true);
	}
	
	socket.on('peerconnectSignaling', async ({ desc, candidate }) => {
		// desc 指的是 Offer 與 Answer
		// currentRemoteDescription 代表的是最近一次連線成功的相關訊息
		if (desc && !localPeerConnection.currentRemoteDescription) {
			console.log('desc => ', desc);

			await localPeerConnection.setRemoteDescription(new RTCSessionDescription(desc));
			createSignal(desc.type === 'answer' ? true : false);
		} else if (candidate) {
		// 新增對方 IP 候選位置
			console.log('candidate =>', candidate);
			localPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
		}
	});

	socket.on('roomBroadcast', message => {
		console.log('房間廣播 => ', message);
	});
	
	let offer;

	const signalOption = {
	  offerToReceiveAudio: 1, // 是否傳送聲音流給對方
	  offerToReceiveVideo: 1, // 是否傳送影像流給對方
	};

	async function createSignal(isOffer) {
		try {
		if (!localPeerConnection) {
			console.log('尚未開啟視訊');
			return;
		}
		// 呼叫 peerConnect 內的 createOffer / createAnswer
		offer = await localPeerConnection[`create${isOffer ? 'Offer' : 'Answer'}`](signalOption);

		// 設定本地流配置
		await localPeerConnection.setLocalDescription(offer);
			sendSignalingMessage(localPeerConnection.localDescription, isOffer ? true : false)
		} catch(err) {
			console.log(err);
		}
	};

	function sendSignalingMessage(desc, offer) {
		const isOffer = offer ? "offer" : "answer";
		console.log(`寄出 ${isOffer}`);
		socket.emit("peerconnectSignaling", { desc });
	};

	// Handler to be called when hanging up the call 
	function hangup() {
		log("Ending call");
		// Close PeerConnection(s)
		localPeerConnection.close();
		// Reset local variables
		localPeerConnection = null;
		// Disable Hangup button
		hangupButton.disabled = true;
		// Enable Call button to allow for new calls to be established
		callButton.disabled = false; 
	}

	// Callback in case of success of the getUserMedia() call 
	function successCallback(stream){
		log("Received local stream");
		
		// Associate the local video element with the retrieved stream
		if (window.URL) {  
			video.srcObject = stream;//URL.createObjectURL(stream)
		} 
		else {  
			video.srcObject = stream;  
		}

	  localStream = stream;
	  // We can now enable the Call button
	  callButton.disabled = false; 
	}


	// Handler to be called as soon as the remote stream becomes available 
	function gotRemoteStream(event){
		// Associate the remote video element with the retrieved stream
		if (window.URL) {  
			// Chrome 
			rVideo.srcObject = event.stream;
			out(event.stream)
		} else {
			// Firefox  
			rVideo.srcObject = event.stream;
		}
		log("Received remote stream"); 
	}
}