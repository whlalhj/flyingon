﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.defineClass("TextBoxBase", flyingon.Control, function (Class, base, flyingon) {




    this.defaultValue("width", 100);

    this.defaultValue("height", 21);

    this.defaultValue("multiline", false);



    flyingon["text-painter"].call(this, false);


});





