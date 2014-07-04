
//事件类型基类
flyingon.defineClass("Event", function (Class, base, flyingon) {



    Class.create = function (type, source) {

        this.type = type;
        this.source = source;
    };



    //是否取消冒泡
    this.cancelBubble = false;

    //是否阻止默认动作
    this.defaultPrevented = false;



    //定义属性
    this.defineProperty = function (name, getter) {

        if (typeof getter !== "function")
        {
            getter = new Function("return " + (getter ? getter + "." : "this.__") + name + ";");
        }

        flyingon.defineProperty(this, name, getter);
    };



    //事件类型
    this.type = null;


    //触发事件的源对象
    this.source = null


    //触发事件目标对象
    this.defineProperty("target", function () {

        return this.__target || (this.__target = this.source.__fn_event_target());
    });



    //阻止事件冒泡
    this.stopPropagation = function () {

        var event = this.dom_event;

        this.cancelBubble = true;

        if (event)
        {
            event.stopPropagation();
        }
    };


    //阻止事件冒泡及禁止默认事件
    this.stopImmediatePropagation = function () {

        var event = this.dom_event;

        this.cancelBubble = true;
        this.defaultPrevented = true;

        if (event)
        {
            event.preventDefault();
            event.stopPropagation();
        }
    };


    //禁止默认事件
    this.preventDefault = function () {

        var event = this.dom_event;

        this.defaultPrevented = true;

        if (event)
        {
            event.preventDefault();
        }
    };


});




//鼠标事件类型
flyingon.defineClass("MouseEvent", flyingon.Event, function (Class, base, flyingon) {



    Class.create_mode = "merge";

    Class.create = function (type, source, dom_event, mousedown) {

        this.dom_event = dom_event;     //关联的原始dom事件
        this.mousedown = mousedown;     //关联的鼠标按下时dom事件
    };



    //是否按下ctrl键
    this.defineProperty("ctrlKey", "this.dom_event");


    //是否按下shift键
    this.defineProperty("shiftKey", "this.dom_event");


    //是否按下alt键
    this.defineProperty("altKey", "this.dom_event");


    //是否按下meta键
    this.defineProperty("metaKey", "this.dom_event");


    //事件触发时间
    this.defineProperty("timeStamp", "this.dom_event");



    //鼠标按键 左:0 中:1 右:2 IE9以上与W3C相同
    //如果关联了鼠标按下时dom事件则取鼠标按下时dom事件的值
    this.defineProperty("button", "(this.mousedown || this.dom_event)");


    //鼠标按键 左:1 中:2 右:3
    //如果关联了鼠标按下时dom事件则取鼠标按下时dom事件的值
    this.defineProperty("which", "(this.mousedown || this.dom_event)");



    //扩展dom鼠标事件增加画布坐标(canvasX,canvasY)
    (function () {



        //计算鼠标事件画布坐标
        function dom_event_canvas(event) {

            var x = 0,
                y = 0,
                target = event.target;

            if (target.__ownerWindow)
            {
                target = target.__ownerWindow.dom_window;
            }

            while (target)
            {
                x += target.offsetLeft;
                y += target.offsetTop;

                target = target.offsetParent;
            }

            event.__canvasX = event.pageX - x;
            event.__canvasY = event.pageY - y;

            return event;
        };



        flyingon.defineProperty(this, "canvasX", function () {

            return this.__canvasX || dom_event_canvas(this).__canvasX;
        });


        flyingon.defineProperty(this, "canvasY", function () {

            return this.__canvasY || dom_event_canvas(this).__canvasY;
        });



    }).call(MouseEvent.prototype);




    function canvas_to_window() {

        var event = this.dom_event,
            offset = this.target.canvas_to_window(event.canvasX, event.__canvasY);

        event.windowX = offset.x;
        event.windowY = offset.y;

        return event;
    };


    function canvas_to_control() {

        var event = this.dom_event,
            offset = this.target.canvas_to_control(event.canvasX, event.__canvasY);

        event.controlX = offset.x;
        event.controlY = offset.y;

        return event;
    };


    //x画布坐标
    this.defineProperty("canvasX", function () {

        var event = this.dom_event;
        return event.__canvasX || event.canvasX;
    });

    //y画布坐标
    this.defineProperty("canvasY", function () {

        var event = this.dom_event;
        return event.__canvasY || event.canvasY;
    });


    //x窗口坐标
    this.defineProperty("windowX", function () {

        return this.dom_event.windowX || canvas_to_window.call(this).windowX;
    });

    //y窗口坐标
    this.defineProperty("windowY", function () {

        return this.dom_event.windowY || canvas_to_window.call(this).windowY;
    });

    //x控件坐标
    this.defineProperty("controlX", function () {

        return this.dom_event.controlX || canvas_to_control.call(this).controlX;
    });

    //y控件坐标
    this.defineProperty("controlY", function () {

        return this.dom_event.controlY || canvas_to_control.call(this).controlY;
    });


    //从鼠标按下时起的x轴移动距离
    this.defineProperty("distanceX", function () {

        var start = this.mousedown;
        return start ? this.dom_event.clientX - start.clientX : 0;
    });


    //从鼠标按下时起的y轴移动距离
    this.defineProperty("distanceY", function () {

        var start = this.mousedown;
        return start ? this.dom_event.clientY - start.clientY : 0;
    });


    //鼠标滚轮数据
    this.defineProperty("wheelDelta", function () {

        return this.dom_event.wheelDelta || (-this.dom_event.detail * 40);
    });



    //禁止或开启单击事件
    this.disable_click = function (disable) {

        flyingon.__disable_click = disable !== false;
    };

    //禁止或开启双击事件
    this.disable_dbclick = function (disable) {

        flyingon.__disable_dbclick = disable !== false;
    };


});



//拖拉事件类型
flyingon.defineClass("DragEvent", flyingon.MouseEvent, function (Class, base, flyingon) {


    Class.create_mode = "merge";

    Class.create = function (type, source, dom_event, mousedown) {

        this.dragTargets = [this.target];
    };


    //拖动目标
    this.dragTargets = null;

    //接收目标
    this.dropTarget = null;


    //拖动时鼠标样式
    this.cursor = null;

    //不可放下时鼠标样式
    this.no_drop_cursor = null;


    //拖动图层透明度(仅dragstart事件有效)
    this.opacity = null;

    //x轴是否可拖动(仅dragstart事件有效)
    this.drag_axisX = true;

    //y轴是否可拖动(仅dragstart事件有效)
    this.drag_axisY = true;



    //执行放下动作
    this.drop = function (copy) {

        var target = this.dropTarget,
            items1 = this.dragTargets,
            items2,
            length;

        if (target && items1 && (length = items1.length) > 0)
        {
            items2 = target.children;

            for (var i = 0; i < length; i++)
            {
                items2.append(copy ? items1[i].copy() : items1[i]);
            }
        }
    };


});




//键盘事件类型
flyingon.defineClass("KeyEvent", flyingon.Event, function (Class, base, flyingon) {


    Class.create_mode = "merge";

    Class.create = function (type, source, dom_event) {

        this.dom_event = dom_event;
    };



    //是否按下ctrl键
    this.defineProperty("ctrlKey", "this.dom_event");


    //是否按下shift键
    this.defineProperty("shiftKey", "this.dom_event");


    //是否按下alt键
    this.defineProperty("altKey", "this.dom_event");


    //是否按下meta键
    this.defineProperty("metaKey", "this.dom_event");


    //事件触发时间
    this.defineProperty("timeStamp", "this.dom_event");


    //键码
    this.defineProperty("keyCode", function () {

        return this.dom_event.which || this.dom_event.keyCode;
    });


});





//值变更事件类型
flyingon.defineClass("ChangeEvent", flyingon.Event, function (Class, base, flyingon) {


    Class.create_mode = "merge";

    Class.create = function (type, source, name, value, oldValue) {

        this.name = name;
        this.oldValue = oldValue;

        this.value = value;
    };



    //变更名
    this.name = null;

    //当前值
    this.value = null;

    //原值
    this.oldValue = null;


});



//属性值变更事件类型
flyingon.defineClass("PropertyChangeEvent", flyingon.Event, function (Class, base, flyingon) {


    Class.create_mode = "replace";

    Class.create = function (source, name, value, oldValue) {

        this.source = source;
        this.name = name;
        this.value = value;
        this.oldValue = oldValue;
    };


    //事件类型
    this.type = "change";

    //当前属性值
    this.value = null;

    //属性名
    this.name = null;

    //原属性值
    this.oldValue = null;


});



//滚动事件
flyingon.defineClass("ScrollEvent", flyingon.Event, function (Class, base, flyingon) {


    Class.create_mode = "replace";

    Class.create = function (source, distanceX, distanceY) {

        this.source = source;
        this.distanceX = distanceX || 0;
        this.distanceY = distanceY || 0;
    };



    //事件类型
    this.type = "scroll";

    //x方向滚动距离
    this.distanceX = 0;

    //y方向滚动距离
    this.distanceY = 0;


});




