
//滑块控件
flyingon.defineClass("Slider", flyingon.Control, function (Class, base, flyingon) {


    Class.create = function () {

        this.__boxModel.children = [];

        (this.__children = new flyingon.ControlCollection(this)).addRange([
            this.__line = new flyingon.ScrollBar_Slider(),
            this.__button = new flyingon.ScrollBar_Button(true)]);
    };



    this.defaultValue("width", 200);

    this.defaultValue("height", 16);


});