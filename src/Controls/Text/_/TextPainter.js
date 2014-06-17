/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />



//文本绘制辅助类
flyingon["text-painter"] = function (multiline, readOnly) {



    this.defaultValue("text", "");


    this.defineProperty("readOnly", readOnly || false);


    this.defineProperty("selectionStart", 0, {

        getter: function () {

            return (this.__textMetrics && this.__textMetrics.selectionStart) || 0;
        },

        setter: function (value) {

            if (this.ownerWindow && this.ownerWindow.__focused_control === this)
            {
                this.__textMetrics.moveTo(value);
            }

            return this;
        }
    });


    this.defineProperty("selectionLength", 0, {

        getter: function () {

            var textMetrics = this.__textMetrics;
            return textMetrics ? textMetrics.selectionEnd - textMetrics.selectionStart : 0;
        },

        setter: function (value) {

            if (this.ownerWindow && this.ownerWindow.__focused_control === this)
            {
                var textMetrics = this.__textMetrics;

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

        return this.__textMetrics.selectedText;
    });







    this.__fn_focus = function (event) {

        if (this.focus())
        {
            var ownerWindow = this.ownerWindow,
                textMetrics = this.__textMetrics;

            if (event || !this.containsFocused || !textMetrics.end)
            {
                var x = event ? event.controlX : 0,
                    y = event ? event.controlY : 0;

                textMetrics.moveAt(x, y);
            }


            //开启输入助手
            ownerWindow.__fn_open_ime(this, this.readOnly);
        }
    };

    this.__fn_blur = function () {

        if (this.blur())
        {
            this.ownerWindow.__fn_close_ime();
        }
    };




    this.__event_bubble_mousedown = function (event) {

        flyingon.__capture_control = this; //捕获鼠标
        event.stopImmediatePropagation();
    };

    this.__event_bubble_mousemove = function (event) {

        if (event.mousedown && this.ownerWindow.__focused_control === this)
        {
            var textMetrics = this.__textMetrics,
                x = event.targetX;


            if (x >= this.__boxModel.clientRect.right)
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


            this.ownerWindow.__fn_reset_ime();
            event.stopImmediatePropagation();
        }
    };

    this.__event_bubble_mouseup = function (event) {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow.__focused_control === this)
        {
            ownerWindow.__fn_reset_ime();
        }

        flyingon.__capture_control = null; //释放鼠标
        event.stopImmediatePropagation();
    };




    this.defineEvent("textchanging");

    this.defineEvent("textchanged");





    this.paint_text_back = function (context, clientRect, textMetrics) {

        if (textMetrics.selectionEnd > textMetrics.selectionStart)
        {
            var start = textMetrics.start,
                end = textMetrics.end;

            context.fillStyle = "#A9E2F3";// "#E6E6E6";
            context.fillRect(clientRect.windowX + start.x, clientRect.windowY, end.x - start.x, textMetrics.font.height + 4);
        }
    };

};




