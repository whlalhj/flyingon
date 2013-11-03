/*

*/
$.class("Layer", $.Panel, function ($) {



    function DelayUpdater(layer) {


        var timer;


        function execute() {

            layer["x:boxModel"].update(layer.context);
        };

        layer.registryUpdate = function () {

            if (timer)
            {
                //clearTimeout(timer);
            };

            timer = setTimeout(execute, 5);
        };

        layer.unregistryUpdate = function () {

            if (timer)
            {
                //clearTimeout(timer);
                timer = 0;
            };
        };
    };




    this.create = function () {

        var div = this.domLayer = document.createElement("div"),
            canvas = this.domCanvas = document.createElement("canvas");


        div.setAttribute("flyingon", "layer");
        div.setAttribute("style", "position:absolute;width:100%;height:100%;overflow:hidden;outline:none;");

        canvas.setAttribute("flyingon", "canvas");
        canvas.setAttribute("style", "position:absolute;outline:none;");

        div.appendChild(canvas);

        this.context = canvas.getContext("2d");
        this.context.layer = this;

        this["x:boxModel"]["x:layer"] = true;

        //注册延时更新
        new DelayUpdater(this);
    };



    this.defineProperty("opacity", 1, {

        valueChangedCode: "this.domLayer.style.opacity = value;"
    });


    this.defineProperty("width", undefined, {

        readOnly: true,
        getter: function () {

            return this.domCanvas.width;
        }
    });

    this.defineProperty("height", undefined, {

        readOnly: true,
        getter: function () {

            return this.domCanvas.height;
        }
    });



    this.defineProperty("ownerLayer", undefined, {

        readOnly: true,
        getter: function () {

            return this;
        }
    });





    this.update = function () {

        this.unregistryUpdate();

        this["x:boxModel"].invalidate();
        this["x:boxModel"].update(this.context);
    };



});


