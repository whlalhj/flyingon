/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.defineClass("Memo", flyingon.ScrollableControl, function (Class, base, flyingon) {



    this.defaultValue("width", 200);

    this.defaultValue("height", 40);

    this.defaultValue("multiline", true);



    this.defineProperty("textWrap", false, "measure");




    //flyingon["text-painter"].call(this, true);




});

