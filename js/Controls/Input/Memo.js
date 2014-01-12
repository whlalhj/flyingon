/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.class("Memo", flyingon.ScrollableControl, function (Class, flyingon) {



    this.defaultValue("width", 200);

    this.defaultValue("height", 40);

    this.defaultValue("multiline", true);



    this.defineProperty("textWrap", false, "measure");




    TextBase.call(this, true);




});

