/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />



//文本框代码实现
var TextBase = function (multiline) {



    this.defaultValue("text", "");


    this.defineProperty("readOnly", false);




    this.defineProperty("selectionStart", 0, {

        getter: function () {

            return (this["x:textMetrics"] && this["x:textMetrics"].selectionStart) || 0;
        },

        setter: function (value) {

            this.ownerWindow && this.ownerWindow["x:focusControl"] == this && this["x:textMetrics"].moveTo(value);
            return this;
        }
    });


    this.defineProperty("selectionLength", 0, {

        getter: function () {

            var textMetrics = this["x:textMetrics"];
            return textMetrics ? textMetrics.selectionEnd - textMetrics.selectionStart : 0;
        },

        setter: function (value) {

            if (this.ownerWindow && this.ownerWindow["x:focusControl"] == this)
            {
                var textMetrics = this["x:textMetrics"];

                value < 0 && (value = 0);
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

            if (event || !this.containsFocused || !textMetrics.caretEnd)
            {
                var x = event ? event.controlX : 0,
                    y = event ? event.controlY : 0;

                textMetrics.moveAt(x, y);
            }


            //开启输入助手
            ownerWindow["y:open:input"](this, this["x:storage"].readOnly);
        }
    };

    this["y:blur"] = function () {

        this.blur() && this.ownerWindow["y:close:input"]();
    };




    this["event:mousedown"] = function (event) {

        this.ownerWindow["x:captureControl"] = this; //捕获鼠标
    };

    this["event:mousemove"] = function (event) {

        if (event.mouseDown && this.ownerWindow["x:focusControl"] == this)
        {
            var textMetrics = this["x:textMetrics"],
                x = event.targetX;


            if (x >= this["x:boxModel"].innerRect.right)
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


            this.ownerWindow["y:input"]();
        }
    };

    this["event:mouseup"] = function (event) {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            ownerWindow["x:focusControl"] == this && ownerWindow["y:input"]();

            //释放鼠标
            ownerWindow["x:captureControl"] = null;
        }
    };




    this.defineEvent("textchanging");

    this.defineEvent("textchanged");





    this.paintTextBackground = function (context) {

        var textMetrics = this["x:textMetrics"];

        if (textMetrics.selectionEnd > textMetrics.selectionStart)
        {
            var boxModel = context.boxModel,
                r = boxModel.innerRect,
                start = textMetrics.caretMin,
                end = textMetrics.caretMax;

            context.fillStyle = "#A9E2F3";// "#E6E6E6";
            context.fillRect(r.windowX + start.x - boxModel.offsetX, r.windowY, end.x - start.x, 16);
        }
    };

};




