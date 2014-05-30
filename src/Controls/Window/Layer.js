﻿
//图层扩展
flyingon.layer_extender = function (host) {


    var div = this.dom_layer = document.createElement("div"),
        canvas = this.dom_canvas = document.createElement("canvas"),

        target = this,
        timer;


    //创建dom
    div.setAttribute("flyingon", "layer");
    div.setAttribute("style", "position:absolute;width:100%;height:100%;overflow:hidden;outline:none;");

    canvas.setAttribute("flyingon", "canvas");
    canvas.setAttribute("style", "position:absolute;outline:none;");

    div.appendChild(canvas);

    if (host)
    {
        host.appendChild(div);
    }


    //重载当前图层
    this.defineProperty("ownerLayer", function () {

        return this;
    });


    //创建绘画环境
    this.painter = new flyingon.Painter(this.context = canvas.getContext("2d"));


    //更新画布
    function update() {

        if (timer)
        {
            clearTimeout(timer);
        }

        var self = target;

        if (self.__current_dirty) //如果需要更新
        {
            self.__fn_render(self.painter);
        }
        else if (self.__children_dirty) //如果子控件需要更新
        {
            self.__fn_render_children(self.painter);
            self.__children_dirty = false;
        }
    };



    //立即执行更新
    this.__execute_update = update();



    //注册更新
    this.__registry_update = function () {

        if (timer)
        {
            clearTimeout(timer);
        }

        timer = setTimeout(update, 5);
    };

    //注销更新
    this.__unregistry_update = function () {

        if (timer)
        {
            clearTimeout(timer);
            timer = 0;
        };
    };

};




/*

*/
flyingon.defineClass("Layer", flyingon.Panel, function (Class, base, flyingon) {



    Class.create = function (host) {

        //执行图层扩展
        flyingon.layer_extender.call(this, host);
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

        this.__unregistry_update();
        this.__fn_render(this.painter);
    };


}, true);


