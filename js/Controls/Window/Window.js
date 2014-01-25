//主窗口
flyingon.class("Window", flyingon.WindowBase, function (Class, flyingon) {



    Class.create = function (parentNode) {


        //自动初始化系统
        flyingon.initialize();


        var div = this["dom-host"] = document.createElement("div");

        div.setAttribute("flyingon", "window-host");
        div.setAttribute("style", "position:relative;width:100%;height:100%;overflow:hidden;");

        //添加窗口
        div.appendChild(this["dom-window"]);

        //添加至指定dom
        (parentNode || flyingon["x:window-host"] || document.body).appendChild(div);



        //定义主窗口变更
        flyingon.defineVariable(this, "mainWindow", this, false, true);

        //设为活动窗口
        this.activate();



        //绑定resize事件
        var self = this;
        window.addEventListener("resize", function (event) {

            self.update();

        }, true);
    };



    //刷新窗口
    this.update = function () {

        var r = this["y:getBoundingClientRect"](true);
        this["y:resize"](0, 0, r.width, r.height);
    };


}, true);

