//主窗口
flyingon.defineClass("Window", flyingon.WindowBase, function (Class, base, flyingon) {



    Class.create = function (parentNode) {


        var div = this.dom_host = document.createElement("div");

        div.setAttribute("flyingon", "window-host");
        div.setAttribute("style", "position:relative;width:100%;height:100%;overflow:hidden;");

        //添加窗口
        div.appendChild(this.dom_window);

        //添加至指定dom
        if (parentNode)
        {
            parentNode.appendChild(div);
        }


        //定义主窗口变量
        flyingon.defineVariable(this, "mainWindow", this);

        //设为活动窗口
        this.activate();



        //绑定resize事件
        var self = this;
        window.addEventListener("resize", function (event) {

            self.update();

        }, true);
    };




    //父dom节点
    flyingon.defineProperty(this, "parentNode",

        function () {

            return this.dom_host.parentNode;
        },

        function (value) {

            if (value)
            {
                value.appendChild(this.dom_host);
            }
        });




    //刷新窗口
    this.update = function () {

        var r = this.__fn_getBoundingClientRect__(true);
        this.__fn_resize__(0, 0, r.width, r.height);
    };


}, true);

