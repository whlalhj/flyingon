
//事件类型基类
flyingon.Event = function () { };


(function () {


    //事件类型
    this.type = null;

    //触发事件目标对象
    this.target = null;

    //是否取消冒泡
    this.cancelBubble = false;

    //是否阻止默认动作
    this.defaultPrevented = false;



    //阻止事件冒泡
    this.stopPropagation = function () {

        this.cancelBubble = true;

        if (this.original_event)
        {
            this.original_event.stopPropagation();
        }
    };

    //阻止事件冒泡及禁止默认事件
    this.stopImmediatePropagation = function () {

        this.cancelBubble = true;
        this.defaultPrevented = true;

        if (this.original_event)
        {
            this.original_event.preventDefault();
            this.original_event.stopPropagation();
        }
    };

    //禁止默认事件
    this.preventDefault = function () {

        this.defaultPrevented = true;

        if (this.original_event)
        {
            this.original_event.preventDefault();
        }
    };


}).call(flyingon.Event.prototype);




//鼠标事件类型
flyingon.MouseEvent = function (type, target, original_event) {

    this.type = type;
    this.target = target;
    this.original_event = original_event;
};


(function (flyingon) {


    var target = this;


    function defineProperty(name) {

        flyingon.defineProperty(target, name, function () {

            return this.original_event[name];
        });
    };


    //是否按下ctrl键
    defineProperty("ctrlKey");

    //是否按下shift键
    defineProperty("shiftKey");

    //是否按下alt键
    defineProperty("altKey");

    //是否按下meta键
    defineProperty("metaKey");

    //事件触发时间
    defineProperty("timeStamp");

    //鼠标按键 左:0 中:1 右:2 IE9以上与W3C相同
    defineProperty("button");


    defineProperty = null;




    function canvas_to_window() {

        var event = this.original_event;

        if (!event.windowX)
        {
            var offset = this.target.canvas_to_window(event.canvasX, event.canvasY);

            event.windowX = offset.x;
            event.windowY = offset.y;
        }

        return event;
    };


    function canvas_to_control() {

        var event = this.original_event;

        if (!event.controlX)
        {
            var offset = this.target.canvas_to_control(event.canvasX, event.canvasY);

            event.controlX = offset.x;
            event.controlY = offset.y;
        }

        return event;
    };



    //x画布坐标
    flyingon.defineProperty(this, "canvasX", function () {

        return this.original_event.canvasX;
    });

    //y画布坐标
    flyingon.defineProperty(this, "canvasY", function () {

        return this.original_event.canvasY;
    });


    //x窗口坐标
    flyingon.defineProperty(this, "windowX", function () {

        return this.original_event.windowX || canvas_to_window.call(this).windowX;
    });

    //y窗口坐标
    flyingon.defineProperty(this, "windowY", function () {

        return this.original_event.windowY || canvas_to_window.call(this).windowY;
    });

    //x控件坐标
    flyingon.defineProperty(this, "controlX", function () {

        return this.original_event.controlX || canvas_to_control.call(this).controlX;
    });

    //y控件坐标
    flyingon.defineProperty(this, "controlY", function () {

        return this.original_event.controlY || canvas_to_control.call(this).controlY;
    });


    //鼠标滚轮数据
    flyingon.defineProperty(this, "wheelDelta", function () {

        return this.original_event.wheelDelta || (-this.original_event.detail * 40);
    });


}).call(flyingon.MouseEvent.prototype = new flyingon.Event(), flyingon);



//拖拉事件类型
flyingon.DragEvent = function (type, target, original_event) {

    this.type = type;
    this.target = target;
    this.dragTargets = [target];
    this.original_event = original_event;
};


(function () {

    //拖动目标
    this.dragTargets = null;

    //接收目标
    this.dropTarget = null;


}).call(flyingon.DragEvent.prototype = new flyingon.MouseEvent());




//键盘事件类型
flyingon.KeyEvent = function (type, target, original_event) {

    this.type = type;
    this.target = target;
    this.original_event = original_event;
};


(function (flyingon) {

    //是否按下ctrl键
    flyingon.defineProperty(this, "ctrlKey", function () {

        return this.original_event.ctrlKey;
    });

    //是否按下shift键
    flyingon.defineProperty(this, "shiftKey", function () {

        return this.original_event.shiftKey;
    });

    //是否按下alt键
    flyingon.defineProperty(this, "altKey", function () {

        return this.original_event.altKey;
    });

    //是否按下meta键
    flyingon.defineProperty(this, "metaKey", function () {

        return this.original_event.metaKey;
    });

    //事件触发时间
    flyingon.defineProperty(this, "timeStamp", function () {

        return this.original_event.timeStamp;
    });

    //键码
    flyingon.defineProperty(this, "keyCode", function () {

        return this.original_event.which || this.original_event.keyCode;
    });


}).call(flyingon.KeyEvent.prototype = new flyingon.Event(), flyingon);





//值变更事件类型
flyingon.ChangeEvent = function (type, target, name, value, oldValue) {

    this.type = type;
    this.target = target;
    this.name = name;
    this.value = value;
    this.oldValue = oldValue;
};

flyingon.ChangeEvent.prototype = new flyingon.Event();



//属性值变更事件类型
flyingon.PropertyChangeEvent = function (target, name, value, oldValue) {

    this.target = target;
    this.name = name;
    this.value = value;
    this.oldValue = oldValue;
};

(flyingon.PropertyChangeEvent.prototype = new flyingon.Event()).type = "change";

