function WebAR(win, res) {
    const body = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.innerText = 'Hello World';
    body.appendChild(h1);
    
    win.addBody(body);
    win.open();
}