
//事件类型基类
flyingon.class("Event", function (Class, flyingon) {


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


});




//鼠标事件类型
flyingon.class("MouseEvent", flyingon.Event, function (Class, flyingon) {


    Class.create = function (type, target, originalEvent) {

        this.type = type;
        this.target = target;
        this.originalEvent = originalEvent;
    };


    var target = this,

        defineProperty = function (name) {

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





    function offsetToTarget() {

        var event = this.originalEvent;

        if (!event["x:targetX"])
        {
            var offset = this.target["x:boxModel"].offsetToTarget(event["x:offsetX"], event["x:offsetY"]);

            event["x:targetX"] = offset.x;
            event["x:targetY"] = offset.y;
        }

        return event;
    };


    function offsetToWindow() {

        var event = this.originalEvent;

        if (!event["x:windowX"])
        {
            var offset = this.target["x:boxModel"].offsetToWindow(event["x:offsetX"], event["x:offsetY"]);

            event["x:windowX"] = offset.x;
            event["x:windowY"] = offset.y;
        }

        return event;
    };


    function offsetToControl() {

        var event = this.originalEvent;

        if (!event["x:controlX"])
        {
            var offset = this.target["x:boxModel"].offsetToControl(event["x:offsetX"], event["x:offsetY"]);

            event["x:controlX"] = offset.x;
            event["x:controlY"] = offset.y;
        }

        return event;
    };




    //x偏移坐标
    flyingon.defineProperty(this, "offsetX", function () {

        return this.originalEvent["x:offsetX"];
    });

    //y偏移坐标
    flyingon.defineProperty(this, "offsetY", function () {

        return this.originalEvent["x:offsetY"];
    });


    //x目标坐标
    flyingon.defineProperty(this, "targetX", function () {

        return this.originalEvent["x:targetX"] || offsetToTarget.call(this)["x:targetX"];
    });

    //y目标坐标
    flyingon.defineProperty(this, "targetY", function () {

        return this.originalEvent["x:targetY"] || offsetToTarget.call(this)["x:targetY"];
    });


    //x窗口坐标
    flyingon.defineProperty(this, "windowX", function () {

        return this.originalEvent["x:windowX"] || offsetToWindow.call(this)["x:windowX"];
    });

    //y窗口坐标
    flyingon.defineProperty(this, "windowY", function () {

        return this.originalEvent["x:windowY"] || offsetToWindow.call(this)["x:windowY"];
    });

    //x相对坐标
    flyingon.defineProperty(this, "controlX", function () {

        return this.originalEvent["x:controlX"] || offsetToControl.call(this)["x:controlX"];
    });

    //y相对坐标
    flyingon.defineProperty(this, "controlY", function () {

        return this.originalEvent["x:controlY"] || offsetToControl.call(this)["x:controlY"];
    });




    //鼠标滚轮数据
    flyingon.defineProperty(this, "wheelDelta", function () {

        return this.originalEvent.wheelDelta || (-this.originalEvent.detail * 40);
    });


}, true);




//拖拉事件类型
flyingon.class("DragEvent", flyingon.MouseEvent, function (Class, flyingon) {


    Class.create = function (type, target, originalEvent) {

        this.dragTargets = [target];
    };


    //拖动目标
    this.dragTargets = null;

    //接收目标
    this.dropTarget = null;


}, true);




//键盘事件类型
flyingon.class("KeyEvent", flyingon.Event, function (Class, flyingon) {


    Class.create = function (type, target, originalEvent) {

        this.type = type;
        this.target = target;
        this.originalEvent = originalEvent || {};
    };



    //是否按下ctrl键
    flyingon.defineProperty(this, "ctrlKey", function () {

        return this.originalEvent["ctrlKey"];
    });

    //是否按下shift键
    flyingon.defineProperty(this, "shiftKey", function () {

        return this.originalEvent["shiftKey"];
    });

    //是否按下alt键
    flyingon.defineProperty(this, "altKey", function () {

        return this.originalEvent["altKey"];
    });

    //是否按下meta键
    flyingon.defineProperty(this, "metaKey", function () {

        return this.originalEvent["metaKey"];
    });

    //事件触发时间
    flyingon.defineProperty(this, "timeStamp", function () {

        return this.originalEvent["timeStamp"];
    });

    //键码
    flyingon.defineProperty(this, "keyCode", function () {

        return this.originalEvent.which || this.originalEvent.keyCode;
    });

});





//属性值变更事件类型
flyingon.class("ChangeEvent", flyingon.Event, function (Class, flyingon) {


    Class.create = function (target, name, value, oldValue) {

        this.target = target;
        this.name = name;
        this.value = value;
        this.oldValue = oldValue;
    };


    this.type = "change";

});


