/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />



//文本绘制辅助类
flyingon["text-painter"] = function (multiline, readOnly) {



    this.defaultValue("text", "");


    this.defineProperty("readOnly", readOnly || false);


    this.defineProperty("selectionStart", 0, {

        getter: function () {

            return (this["x:textMetrics"] && this["x:textMetrics"].selectionStart) || 0;
        },

        setter: function (value) {

            if (this.ownerWindow && this.ownerWindow["x:focused-control"] == this)
            {
                this["x:textMetrics"].moveTo(value);
            }

            return this;
        }
    });


    this.defineProperty("selectionLength", 0, {

        getter: function () {

            var textMetrics = this["x:textMetrics"];
            return textMetrics ? textMetrics.selectionEnd - textMetrics.selectionStart : 0;
        },

        setter: function (value) {

            if (this.ownerWindow && this.ownerWindow["x:focused-control"] == this)
            {
                var textMetrics = this["x:textMetrics"];

                if (value < 0)
                {
                    value = 0;
                }

                textMetrics.selectionTo(textMetrics.selectionStart + value);
            }

            return this;
        }
    });


    this.defineProperty("selectedText", function () {

        return this["x:textMetrics"].selectedText;
    });







    this["y:focus"] = function (event) {

        if (this.focus())
        {
            var ownerWindow = this.ownerWindow,
                textMetrics = this["x:textMetrics"];

            if (event || !this.containsFocused || !textMetrics.end)
            {
                var x = event ? event.controlX : 0,
                    y = event ? event.controlY : 0;

                textMetrics.moveAt(x, y);
            }


            //开启输入助手
            ownerWindow["y:open-ime"](this, this["x:storage"].readOnly);
        }
    };

    this["y:blur"] = function () {

        if (this.blur())
        {
            this.ownerWindow["y:close-ime"]();
        }
    };




    this["event-mousedown"] = function (event) {

        this.ownerWindow["x:capture-control"] = this; //捕获鼠标
    };

    this["event-mousemove"] = function (event) {

        if (event.mousedown && this.ownerWindow["x:focused-control"] == this)
        {
            var textMetrics = this["x:textMetrics"],
                x = event.targetX;


            if (x >= this["x:boxModel"].clientRect.right)
            {
                textMetrics.selectionTo(textMetrics.selectionEnd + 1, true);
            }
            else if (x <= 0)
            {
                textMetrics.selectionTo(textMetrics.selectionStart - 1, true);
            }
            else
            {
                textMetrics.selectionAt(event.controlX, event.controlY, true);
            }


            this.ownerWindow["y:reset-ime"]();
        }
    };

    this["event-mouseup"] = function (event) {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow["x:focused-control"] == this)
        {
            ownerWindow["y:reset-ime"]();
        }

        ownerWindow["x:capture-control"] = null; //释放鼠标
    };




    this.defineEvent("textchanging");

    this.defineEvent("textchanged");





    this["paint-text-back"] = function (context, clientRect, textMetrics) {

        if (textMetrics.selectionEnd > textMetrics.selectionStart)
        {
            var start = textMetrics.start,
                end = textMetrics.end;

            context.fillStyle = "#A9E2F3";// "#E6E6E6";
            context.fillRect(clientRect.windowX + start.x, clientRect.windowY, end.x - start.x, textMetrics.font.lineHeight + 4);
        }
    };

};




