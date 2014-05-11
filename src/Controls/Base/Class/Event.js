
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




    function offsetToTarget() {

        var event = this.originalEvent;

        if (!event.__targetX)
        {
            var offset = this.target.__boxModel.offsetToTarget(event.__offsetX, event.__offsetY);

            event.__targetX = offset.x;
            event.__targetY = offset.y;
        }

        return event;
    };


    function offsetToWindow() {

        var event = this.originalEvent;

        if (!event.__windowX)
        {
            var offset = this.target.__boxModel.offsetToWindow(event.__offsetX, event.__offsetY);

            event.__windowX = offset.x;
            event.__windowY = offset.y;
        }

        return event;
    };


    function offsetToControl() {

        var event = this.originalEvent;

        if (!event.__controlX)
        {
            var offset = this.target.__boxModel.offsetToControl(event.__offsetX, event.__offsetY);

            event.__controlX = offset.x;
            event.__controlY = offset.y;
        }

        return event;
    };



    //x偏移坐标
    flyingon.defineProperty(this, "offsetX", function () {

        return this.originalEvent.__offsetX;
    });

    //y偏移坐标
    flyingon.defineProperty(this, "offsetY", function () {

        return this.originalEvent.__offsetY;
    });


    //x目标坐标
    flyingon.defineProperty(this, "targetX", function () {

        return this.originalEvent.__targetX || offsetToTarget.call(this).__targetX;
    });

    //y目标坐标
    flyingon.defineProperty(this, "targetY", function () {

        return this.originalEvent.__targetY || offsetToTarget.call(this).__targetY;
    });


    //x窗口坐标
    flyingon.defineProperty(this, "windowX", function () {

        return this.originalEvent.__windowX || offsetToWindow.call(this).__windowX;
    });

    //y窗口坐标
    flyingon.defineProperty(this, "windowY", function () {

        return this.originalEvent.__windowY || offsetToWindow.call(this).__windowY;
    });

    //x相对坐标
    flyingon.defineProperty(this, "controlX", function () {

        return this.originalEvent.__controlX || offsetToControl.call(this).__controlX;
    });

    //y相对坐标
    flyingon.defineProperty(this, "controlY", function () {

        return this.originalEvent.__controlY || offsetToControl.call(this).__controlY;
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

