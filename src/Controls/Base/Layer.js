
//图层扩展
flyingon.layer_extender = function (host) {


    var div = this.dom_layer = document.createElement("div"),
        canvas = this.dom_canvas = document.createElement("canvas"),

        self = this,
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
    this.context = (this.painter = new flyingon.Painter(canvas)).context;


    //更新画布
    function update() {

        if (timer)
        {
            clearTimeout(timer);
            timer = 0;
        }

        if (self.__current_dirty) //如果需要更新
        {
            self.render(self.painter);
        }
        else if (self.__children_dirty) //如果子控件需要更新
        {
            self.__fn_update(self.painter);
            self.__children_dirty = false;
        }
    };


    //注册更新
    this.__registry_update = function (update_now) {

        if (update_now)
        {
            update();
        }
        else
        {
            if (timer)
            {
                clearTimeout(timer);
            }

            timer = setTimeout(update, 5);
        }
    };

    //注销更新
    this.__unregistry_update = function () {

        if (timer)
        {
            clearTimeout(timer);
            timer = 0;
        }
    };



};




/*

*/
flyingon.defineClass("Layer", flyingon.Panel, function (Class, base, flyingon) {



    Class.create_mode = "merge";

    Class.create = function (host) {

        //执行图层扩展
        flyingon.layer_extender.call(this, host);
    };



    //修改透明度属性
    this.defineProperty("opacity", 1, {

        minValue: 0,
        maxValue: 1,
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



    //更新
    this.update = function () {

        if (timer)
        {
            clearTimeout(timer);
            timer = 0;
        }

        this.render(this.painter);
    };

});


