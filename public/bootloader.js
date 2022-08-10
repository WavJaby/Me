document.body.removeChild(document.getElementsByTagName('noscript')[0]);

// 初始化
log('#################[BootLoader]#################');
if (ieVersion === null)
    log('不是IE 🎉');
else
    warn('IE版本: ' + ieVersion);
var initEnv = log('準備環境...');
doneTimeText(initEnv, systemTime());

// 加載系統
var logPluginFile = log('載入插件...');
var timePluginFile = timeNow();
loadScript('plugin.js', function () {doneTimeText(logPluginFile, timePass(timePluginFile));});

var logBootFile = log('載入開機檔案...');
var timeBootFile = timeNow();
log('####################[系統]####################');
loadScript('System/boot.js', function () {doneTimeText(logBootFile, timePass(timeBootFile));});
