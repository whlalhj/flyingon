
//事件类型基类
flyingon.Event = function () { };


(function () {


    //事件类型
    this.type = null;

    //事件目标
    this.target = null;

    //是否取消冒泡
    this.cancelBubble = false;

    //是否阻止默认动作
    this.defaultPrevented = false;



    this.stopPropagation = function () {

        this.cancelBubble = true;
    };

    this.preventDefault = function () {

        this.defaultPrevented = true;
    };


}).call(flyingon.Event.prototype);




//鼠标事件类型
flyingon.MouseEvent = function (type, target, originalEvent) {

    this.type = type;
    this.target = target;
    this.originalEvent = originalEvent;
};


(function (flyingon) {


    var target = this;

    //定义属性
    (function () {


        var defineProperty = function (name) {

            flyingon.defineProperty(target, name, function () {

                return this.originalEvent[name];
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

        //相对屏幕的x坐标
        defineProperty("screenX");

        //相对屏幕的y坐标
        defineProperty("screenY");

        //相对窗口客户区的x坐标
        defineProperty("clientX");

        //相对窗口客户区的y坐标
        defineProperty("clientY");

    })();




    function canvas_to_window() {

        var event = this.originalEvent;

        if (!event.windowX)
        {
            var offset = this.target.canvas_to_window(event.canvasX, event.canvasY);

            event.windowX = offset.x;
            event.windowY = offset.y;
        }

        return event;
    };


    function canvas_to_control() {

        var event = this.originalEvent;

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

        return this.originalEvent.canvasX;
    });

    //y画布坐标
    flyingon.defineProperty(this, "canvasY", function () {

        return this.originalEvent.canvasY;
    });

    
    //x窗口坐标
    flyingon.defineProperty(this, "windowX", function () {

        return this.originalEvent.windowX || canvas_to_window.call(this).windowX;
    });

    //y窗口坐标
    flyingon.defineProperty(this, "windowY", function () {

        return this.originalEvent.windowY || canvas_to_window.call(this).windowY;
    });

    //x控件坐标
    flyingon.defineProperty(this, "controlX", function () {

        return this.originalEvent.controlX || canvas_to_control.call(this).controlX;
    });

    //y控件坐标
    flyingon.defineProperty(this, "controlY", function () {

        return this.originalEvent.controlY || canvas_to_control.call(this).controlY;
    });


    //鼠标滚轮数据
    flyingon.defineProperty(this, "wheelDelta", function () {

        return this.originalEvent.wheelDelta || (-this.originalEvent.detail * 40);
    });


}).call(flyingon.MouseEvent.prototype = new flyingon.Event(), flyingon);



//拖拉事件类型
flyingon.DragEvent = function (type, target, originalEvent) {

    this.type = type;
    this.dragTargets = [target];
    this.target = target;
    this.originalEvent = originalEvent;
};


(function () {

    //拖动目标
    this.dragTargets = null;

    //接收目标
    this.dropTarget = null;


}).call(flyingon.DragEvent.prototype = new flyingon.MouseEvent());




//键盘事件类型
flyingon.KeyEvent = function (type, target, originalEvent) {

    this.type = type;
    this.target = target;
    this.originalEvent = originalEvent;
};


(function (flyingon) {

    //是否按下ctrl键
    flyingon.defineProperty(this, "ctrlKey", function () {

        return this.originalEvent.ctrlKey;
    });

    //是否按下shift键
    flyingon.defineProperty(this, "shiftKey", function () {

        return this.originalEvent.shiftKey;
    });

    //是否按下alt键
    flyingon.defineProperty(this, "altKey", function () {

        return this.originalEvent.altKey;
    });

    //是否按下meta键
    flyingon.defineProperty(this, "metaKey", function () {

        return this.originalEvent.metaKey;
    });

    //事件触发时间
    flyingon.defineProperty(this, "timeStamp", function () {

        return this.originalEvent.timeStamp;
    });

    //键码
    flyingon.defineProperty(this, "keyCode", function () {

        return this.originalEvent.which || this.originalEvent.keyCode;
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

