//分隔条控件
flyingon.defineClass("Splitter", flyingon.ContentControl, function (Class, base, flyingon) {



    Class.combine_create = true;

    Class.create = function () {

        this.cursor = "col-resize";
        this.draggable = true;
    };



    this.defaultValue("draggable", true);



    //拖动时鼠标样式
    this.drag_cursor = "col-Resize";

    //自定义拖动方法
    this.__fn_drag_move = function (event, offsetX, offsetY) {

        switch (this.dock)
        {
            case "left":
            case "right":
                return { x: offsetX, y: 0 };

            case "top":
            case "bottom":
                return { x: 0, y: offsetY };
        }
    };

    //自定义拖动结束方法
    this.__fn_drag_stop = function (event, offsetX, offsetY) {

    };



});

