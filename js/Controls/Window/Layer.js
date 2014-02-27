
//图层创造者
flyingon.__fn_create_layer__ = function (host) {


    //创建绘图环境
    var div = this.dom_layer = document.createElement("div"),
        canvas = this.dom_canvas = document.createElement("canvas"),
        boxModel = this.__boxModel__;


    div.setAttribute("flyingon", "layer");
    div.setAttribute("style", "position:absolute;width:100%;height:100%;overflow:hidden;outline:none;");

    canvas.setAttribute("flyingon", "canvas");
    canvas.setAttribute("style", "position:absolute;outline:none;");

    div.appendChild(canvas);

    if (host)
    {
        host.appendChild(div);
    }


    //创建绘画环境
    this.context = boxModel.context = canvas.getContext("2d");

    
    //扩展盒模型更新相关方法
    (function(){


        //更新定时器
        var timer, boxModel = this;


        //更新画布
        function update() {

            boxModel.update(boxModel.context);
        };

        //注册更新
        this.__registry_update__ = function () {

            if (timer)
            {
                clearTimeout(timer);
            };

            timer = setTimeout(update, 5);
        };

        //注销更新
        this.__unregistry_update__ = function () {

            if (timer)
            {
                clearTimeout(timer);
                timer = 0;
            };
        };


    }).call(boxModel);

};




/*

*/
flyingon.class("Layer", flyingon.Panel, function (Class, flyingon) {



    Class.create = function () {

        flyingon.__fn_create_layer__.call(this);
    };



    //修改透明度属性
    this.defineProperty("opacity", 1, {

        complete: "this.dom_layer.style.opacity = value;"
    });

    //修改宽度属性
    this.defineProperty("width", function () {

        return this.dom_canvas.width;
    });

    //修改高度属性
    this.defineProperty("height", function () {

        return this.dom_canvas.height;
    });


    this.update = function () {

        this.__boxModel__.invalidate(false);
        this.__boxModel__.update(this.context);
    };


}, true);


