/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />



//文本绘制辅助类
flyingon["text-painter"] = function (multiline, readOnly) {



    this.defaultValue("text", "");


    this.defineProperty("readOnly", readOnly || false);


    this.defineProperty("selectionStart", 0, {

        getter: function () {

            return (this.__textMetrics__ && this.__textMetrics__.selectionStart) || 0;
        },

        setter: function (value) {

            if (this.ownerWindow && this.ownerWindow.__focused_control__ === this)
            {
                this.__textMetrics__.moveTo(value);
            }

            return this;
        }
    });


    this.defineProperty("selectionLength", 0, {

        getter: function () {

            var textMetrics = this.__textMetrics__;
            return textMetrics ? textMetrics.selectionEnd - textMetrics.selectionStart : 0;
        },

        setter: function (value) {

            if (this.ownerWindow && this.ownerWindow.__focused_control__ === this)
            {
                var textMetrics = this.__textMetrics__;

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

        return this.__textMetrics__.selectedText;
    });







    this.__fn_focus__ = function (event) {

        if (this.focus())
        {
            var ownerWindow = this.ownerWindow,
                textMetrics = this.__textMetrics__;

            if (event || !this.containsFocused || !textMetrics.end)
            {
                var x = event ? event.controlX : 0,
                    y = event ? event.controlY : 0;

                textMetrics.moveAt(x, y);
            }


            //开启输入助手
            ownerWindow.__fn_open_ime__(this, this.readOnly);
        }
    };

    this.__fn_blur__ = function () {

        if (this.blur())
        {
            this.ownerWindow.__fn_close_ime__();
        }
    };




    this.__event_mousedown__ = function (event) {

        this.ownerWindow.__capture_control__ = this; //捕获鼠标
    };

    this.__event_mousemove__ = function (event) {

        if (event.mousedown && this.ownerWindow.__focused_control__ === this)
        {
            var textMetrics = this.__textMetrics__,
                x = event.targetX;


            if (x >= this.__boxModel__.clientRect.right)
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


            this.ownerWindow.__fn_reset_ime__();
        }
    };

    this.__event_mouseup__ = function (event) {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow.__focused_control__ === this)
        {
            ownerWindow.__fn_reset_ime__();
        }

        ownerWindow.__capture_control__ = null; //释放鼠标
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




