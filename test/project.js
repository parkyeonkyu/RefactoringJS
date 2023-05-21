import { doUpload } from './tusManager.js'

window.onload = function () {

    test();
};

function test() {
    console.log("test");
    doUpload(callback1);
}

function callback1() {
    console.log("callback1");
}