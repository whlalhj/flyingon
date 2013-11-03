/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
$.class("TextBoxBase", $.Control, function ($) {




    this.create = function () {

        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mousemove", this.handleMouseMove);
        this.addEventListener("mouseup", this.handleMouseUp);
    };



    this.setDefaultValue("width", 100);

    this.setDefaultValue("height", 21);

    this.setDefaultValue("multiline", false);



    TextBase.call(this, false);


});





