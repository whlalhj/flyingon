/*

*/
flyingon.class("Layer", flyingon.Panel, function (Class, flyingon) {



    Class.create = function () {

        var div = this.dom_layer = document.createElement("div"),
            canvas = this.dom_canvas = document.createElement("canvas");


        div.setAttribute("flyingon", "layer");
        div.setAttribute("style", "position:absolute;width:100%;height:100%;overflow:hidden;outline:none;");

        canvas.setAttribute("flyingon", "canvas");
        canvas.setAttribute("style", "position:absolute;outline:none;");

        div.appendChild(canvas);

        this.context = canvas.getContext("2d");
        this.context.layer = this;


        //注册延时更新
        this.__fn_initialize_update__(this);
    };



    this.defineProperty("opacity", 1, {

        changed: "this.dom_layer.style.opacity = value;"
    });


    this.defineProperty("width", function () {

        return this.dom_canvas.width;
    });

    this.defineProperty("height", function () {

        return this.dom_canvas.height;
    });



    this.defineProperty("ownerLayer", function () {

        return this;
    });



    //初始化延时更新器
    this.__fn_initialize_update__ = function (layer) {


        var timer,
            boxModel = layer.__boxModel__;


        boxModel.layer = true;


        function execute() {

            boxModel.update(layer.context);
        };

        layer.registryUpdate = function () {

            if (timer)
            {
                clearTimeout(timer);
            };

            timer = setTimeout(execute, 5);
        };

        layer.unregistryUpdate = function () {

            if (timer)
            {
                clearTimeout(timer);
                timer = 0;
            };
        };
    };




    this.update = function () {

        this.unregistryUpdate();

        this.__boxModel__.invalidate();
        this.__boxModel__.update(this.context);
    };



}, true);


