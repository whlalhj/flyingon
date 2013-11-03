(function ($) {

    $.TTS = function () {

        var tts;

        if (window.chrome) {
            Chrome.permissions.request({
                permissions: ['tts'], origins: ['http://www.google.com/']
            }, function (granted) {
                alert(granted);
            });
            tts = chrome.tts;
        };

        this.options = {

            rate: 1.0,

            lang: "en-US",

            gender: "female",

            enqueue: false,

            voiceName: null,

            extensionId: null,

            pitch: 1.0,

            volume: 1.0,

            onEvent: null
        };

        this.callback = null;

        this.speak = function (text) {
            tts.speak(text);
            tts.speak(text, this.options, this.callback);
        };

        this.stop = function () {
            tts.stop();
        };

        this.speaking = function () {
            return tts.speaking;
        };

        this.getVoices = function () {
            tts.getVoices(callback);
        };

    };


})(flyingon);


