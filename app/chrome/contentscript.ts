/// <reference path='../../typings/chrome/chrome.d.ts'/>
/// <reference path='../../typings/es6-shim/es6-shim.d.ts'/>

'use strict';
chrome.runtime.sendMessage({ 'modulesCount': 'off' });
window.addEventListener('message', function (event) {
    if (event.data.sc_ext_enabled) {
        chrome.runtime.sendMessage({
            newIconPath: 'chrome/images/icon-128.png',
            modulesCount: event.data.sc_ext_modules_count
        });
    }
});

function createScriptElement(src: string): HTMLScriptElement {
    var script = <HTMLScriptElement>document.createElement("script");
    script.src = chrome.extension.getURL(src);
    return script;
}

function injectScripts(scripts: HTMLScriptElement[]) {
    if (scripts.length > 0) {
        var otherScripts = scripts.slice(1);
        var script = scripts[0];
        var onload = function () {
            script.parentNode.removeChild(script);
            injectScripts(otherScripts);
        };
        if (script.src != "") {
            script.onload = onload;
            document.head.appendChild(script);
        } else {
            document.head.appendChild(script);
            onload();
        }
    }
}

injectScripts([
    createScriptElement("/sc_ext/sc_ext.js"),
]);