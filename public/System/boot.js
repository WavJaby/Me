const css = [
    {url: 'system.css', name: '外觀'},
    {url: 'Font/font.css', name: '字體'},
    {url: 'animation.css', name: '動畫'},
    {url: 'dropdownlist.css', name: '下拉選單外觀'},
];
const js = [
    {url: 'window.js', name: '視窗管理員'},
    {url: 'fileSystem.js', name: '檔案管理員'},
    {url: 'notification.js', name: '通知管理員'},
];
log('載入系統檔案...');
let sysInitTime = timeNow();
let mainStyle;
loadSystemStyle(css, function () {
    const mainSheetUrl = css[0].url;
    for (const i of document.styleSheets)
        if (i.href && i.href.endsWith(mainSheetUrl)) {
            mainStyle = i.cssRules ? i.cssRules : i.rules;
            break;
        }

    loadSystemScript(js, function () {
        log('done in ' + timePass(sysInitTime) + 'ms');

        loadScript('System/main.js', hideConsole);
    });

    function hideConsole() {
        consoleArea.style.display = 'none';
    }
});