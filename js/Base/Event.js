/*

*/
(function ($) {


    //事件类型基类
    $.class("Event", function ($) {


        this.create = function (type, target) {

            this.type = type;
            this.target = target;
        };




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
    $.class("MouseEvent", $.Event, function ($) {


        this.create = function (type, target, originalEvent) {

            this.originalEvent = originalEvent;
        };


        var target = this,

            defineProperty = function (name) {

                $.defineProperty(target, name, function () {

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
                var p = this.target["x:boxModel"].offsetToTarget(event["x:offsetX"], event["x:offsetY"]);

                event["x:targetX"] = p.x;
                event["x:targetY"] = p.y;
            }

            return event;
        };


        function offsetToWindow() {

            var event = this.originalEvent;

            if (!event["x:windowX"])
            {
                var p = this.target["x:boxModel"].offsetToWindow(event["x:offsetX"], event["x:offsetY"]);

                event["x:windowX"] = p.x;
                event["x:windowY"] = p.y;
            }

            return event;
        };


        function offsetToControl() {

            var event = this.originalEvent;

            if (!event["x:controlX"])
            {
                var p = this.target["x:boxModel"].offsetToControl(event["x:offsetX"], event["x:offsetY"]);

                event["x:controlX"] = p.x;
                event["x:controlY"] = p.y;
            }

            return event;
        };




        //x偏移坐标
        $.defineProperty(this, "offsetX", function () {

            return this.originalEvent["x:offsetX"];
        });

        //y偏移坐标
        $.defineProperty(this, "offsetY", function () {

            return this.originalEvent["x:offsetY"];
        });


        //x目标坐标
        $.defineProperty(this, "targetX", function () {

            return this.originalEvent["x:targetX"] || offsetToTarget.call(this)["x:targetX"];
        });

        //y目标坐标
        $.defineProperty(this, "targetY", function () {

            return this.originalEvent["x:targetY"] || offsetToTarget.call(this)["x:targetY"];
        });


        //x窗口坐标
        $.defineProperty(this, "windowX", function () {

            return this.originalEvent["x:windowX"] || offsetToWindow.call(this)["x:windowX"];
        });

        //y窗口坐标
        $.defineProperty(this, "windowY", function () {

            return this.originalEvent["x:windowY"] || offsetToWindow.call(this)["x:windowY"];
        });

        //x相对坐标
        $.defineProperty(this, "controlX", function () {

            return this.originalEvent["x:controlX"] || offsetToControl.call(this)["x:controlX"];
        });

        //y相对坐标
        $.defineProperty(this, "controlY", function () {

            return this.originalEvent["x:controlY"] || offsetToControl.call(this)["x:controlY"];
        });




        //鼠标滚轮数据
        $.defineProperty(this, "wheelDelta", function () {

            return this.originalEvent.wheelDelta || (-this.originalEvent.detail * 40);
        });


    });





    //拖拉事件类型
    $.class("DragEvent", $.MouseEvent, function ($) {


        this.create = function (type, target, originalEvent) {

            //拖动目标
            this.dragTargets = [target];

            //接收目标
            this.dropTarget = null;

        };

    });





    //键盘事件类型
    $.class("KeyEvent", $.Event, function ($) {


        this.create = function (type, target, originalEvent) {

            this.originalEvent = originalEvent || {};
        };



        //是否按下ctrl键
        $.defineProperty(this, "ctrlKey", function () {

            return this.originalEvent["ctrlKey"];
        });

        //是否按下shift键
        $.defineProperty(this, "shiftKey", function () {

            return this.originalEvent["shiftKey"];
        });

        //是否按下alt键
        $.defineProperty(this, "altKey", function () {

            return this.originalEvent["altKey"];
        });

        //是否按下meta键
        $.defineProperty(this, "metaKey", function () {

            return this.originalEvent["metaKey"];
        });

        //事件触发时间
        $.defineProperty(this, "timeStamp", function () {

            return this.originalEvent["timeStamp"];
        });

        //键码
        $.defineProperty(this, "keyCode", function () {

            return this.originalEvent.which || this.originalEvent.keyCode;
        });

    });






    //属性值变更事件类型
    $.class("PropertyChangedEvent", $.Event, function ($) {

        this.create = function (type, target, name, value, oldValue) {

            this.name = name;
            this.value = value;
            this.oldValue = oldValue;
        };

    });



})(flyingon);
