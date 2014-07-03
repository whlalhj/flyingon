

//主窗口
flyingon.defineClass("Window", flyingon.WindowBase, function (Class, base, flyingon) {




    Class.create_mode = "merge";

    Class.create = function (host) {

        this.__fn_create();

        var self = this,
            div = this.dom_host = document.createElement("div");

        div.setAttribute("flyingon", "window-host");
        div.setAttribute("style", "position:relative;width:100%;height:100%;overflow:hidden;");
        div.appendChild(this.dom_window);

        host && host.appendChild(div);

        //绑定resize事件
        window.addEventListener("resize", function (event) { self.update(); });

        //设为活动窗口
        this.active();
    };




    //修改宽度属性
    this.defineProperty("width", function () {

        return this.dom_canvas.width;
    });

    //修改高度属性
    this.defineProperty("height", function () {

        return this.dom_canvas.height;
    });



    //主窗口
    this.defineProperty("mainWindow", function () {

        return this;
    });


    //活动窗口
    this.defineProperty("activeWindow", function () {

        return this.__activeWindow || this;
    });


    //父窗口
    this.defineProperty("parentWindow", function () {

        return null;
    });


    //显示窗口
    this.show = this.render = function () {

        this.__fn_clientRect(true);
        base.render.call(this);
    };


});



