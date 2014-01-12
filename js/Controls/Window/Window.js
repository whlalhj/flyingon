//主窗口
flyingon.class("Window", flyingon.WindowBase, function (Class, flyingon) {



    Class.create = function (parentNode) {


        var domHost = this.domHost = document.createElement("div");

        domHost.setAttribute("flyingon", "window.host");
        domHost.setAttribute("style", "position:relative;width:100%;height:100%;overflow:hidden;");

        //添加窗口
        domHost.appendChild(this.domWindow);

        //添加至指定dom
        (parentNode || flyingon["x:window:host"] || document.body).appendChild(domHost);



        //定义主窗口变更
        flyingon.defineVariable(this, "mainWindow", this, false, true);

        //设为活动窗口
        this.activate();


        //绑定resize事件
        var self = this;
        window.addEventListener("resize", function (e) { self.update(); }, true);
    };





    //重新绘制
    this.update = function () {


        this["y:fill"](true);


        var storage = this["x:storage"],
            width = storage.width,
            height = storage.height,

            layers = this.layers;

        for (var i = 0, length = layers.length; i < length; i++)
        {
            var layer = layers[i],
                box = layer["x:boxModel"];

            layer.unregistryUpdate();
            layer.domCanvas.width = width; //清空画布
            layer.domCanvas.height = height;

            box.measure(null, 0, 0, width, height);
            box.render(layer.context);
        }

    };



}, true);

