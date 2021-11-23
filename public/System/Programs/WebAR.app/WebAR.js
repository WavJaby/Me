function WebAR(win, res) {
    // const body = document.createElement('div');
    // const h1 = document.createElement('h1');
    // h1.innerText = 'Hello World';
    // body.appendChild(h1);
    
    // win.addBody(body);
    
    win.setOnOpen(function(){
        out('open');
        // const script = document.createElement('script');
        // script.src = 'https://cdn.rawgit.com/jeromeetienne/AR.js/1.7.5/aframe/build/aframe-ar.js';
        // win.body.insertBefore(script, win.body.firstChild);
        
        // getText('https://cdn.rawgit.com/jeromeetienne/AR.js/1.7.5/aframe/build/aframe-ar.js', 
            // function(text) {eval(text);});
        
        // setTimeout(function(){
            // loadScriptToElement('https://cdn.rawgit.com/jeromeetienne/AR.js/1.7.5/aframe/build/aframe-ar.js', document.head);
        // },1000);
    });
    loadScript('https://aframe.io/releases/0.9.2/aframe.min.js');
    loadScript('System/Programs/WebAR.app/aframe-ar.js');
    window.mountPoint = win.body;
    win.body.classList.add('webAR');
    win.setTitle('WebAR');
    win.open();
}