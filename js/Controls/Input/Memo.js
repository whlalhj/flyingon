/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
$.class("Memo", $.ScrollableControl, function ($) {



    this.create = function () {

        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mousemove", this.handleMouseMove);
        this.addEventListener("mouseup", this.handleMouseUp);
    };




    this.setDefaultValue("width", 200);

    this.setDefaultValue("height", 40);

    this.setDefaultValue("multiline", true);



    this.defineProperty("textWrap", false, "measure");




    TextBase.call(this, true);




});

