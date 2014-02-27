
//滚动事件
flyingon.ScrollEvent = function (target, originalEvent) {

    this.target = target;
    this.originalEvent = originalEvent;
};



//扩展复合控件方法
//复合控件的子控件不响应事件,但支持样式及状态
flyingon.__fn_complex_control__ = function () {


    this.hitTest = function (x, y) {

        if (flyingon.ScrollBar.super.hitTest.call(this, x, y))
        {
            var r = this.__boxModel__.clientRect,
                items = this.__children__,
                source = this.__target__,
                target = null;

            x -= r.x;
            y -= r.y;

            for (var i = items.length - 1; i >= 0 ; i--)
            {
                if (items[i].hitTest(x, y))
                {
                    target = items[i];
                    break;
                }
            }

            if (source && source != target)
            {
                source.stateTo("hover", false);
            }

            if (this.__target__ = target)
            {
                target.stateTo("hover", true);
            }

            return true;
        }

        return false;
    };

    this.stateTo = function (name, value) {

        if (this.__target__ && (name != "hover" || !value))
        {
            this.__target__.stateTo(name, value);
        }

        flyingon.ScrollBar.super.stateTo.call(this, name, value);
    };

};


(function () {

    //事件类型
    this.type = "scroll";

    //水平滚动条
    this.horizontalScrollBar = null;

    //竖起滚动条
    this.verticalScrollBar = null;

    //水平变化距离
    this.changeX = 0;

    //竖直变化距离
    this.changeY = 0;

}).call(flyingon.ScrollEvent.prototype = new flyingon.Event());




//滚动条控件
flyingon.class("ScrollBar", flyingon.Control, function (Class, flyingon) {



    var timer,      //定时变更定时器
        dragger;    //拖拉者



    Class.create = function () {

        this.__boxModel__.children = [];

        (this.__children__ = new flyingon.ControlCollection(this)).addRange([
            this.__button_1__ = new flyingon.ScrollButton(true),
            this.__slider__ = new flyingon.ScrollSlider(),
            this.__button_2__ = new flyingon.ScrollButton(false)]);
    };



    this.defaultValue("focusable", false);

    this.defaultValue("width", 200);

    this.defaultValue("height", 16);



    //当前值
    this.defineProperty("value", 0, "measure");

    //最大值
    this.defineProperty("maxValue", 100, "measure");

    //最小值
    this.defineProperty("minValue", 0, "measure");

    //显示值大小
    this.defineProperty("viewportSize", 10, "measure");

    //最大变更值
    this.defineProperty("maxChange", 200);

    //最小变更值
    this.defineProperty("minChange", 20);


    //是否竖直滚动条
    this.defineProperty("vertical", false, {

        attributes: "locate",
        complete: "var width = this.width;\nthis.width = this.height;\nthis.height = width;"
    });



    //滚动事件
    this.defineEvent("scroll");



    //扩展复合控件方法
    flyingon.__fn_complex_control__.call(this);



    this.__event_mousedown__ = function (event) {

        if (timer)
        {
            clearTimeout(timer);
        }

        var value = this.__target__, limit, box;

        if (value)
        {
            if (value == this.__button_1__)
            {
                value = -this.minChange;
            }
            else if (value == this.__button_2__)
            {
                value = this.minChange;
            }
            else //slider
            {
                this.ownerWindow.__capture_control__ = this;

                dragger = {

                    x: event.windowX,
                    y: event.windowY,
                    value: this.value
                };

                event.stopPropagation();
                event.preventDefault();
                return;
            }
        }
        else
        {
            box = this.__boxModel__;
            value = this.vertical ? event.windowY - box.clientRect.windowY : event.windowX - box.clientRect.windowX;

            if (value < box.slider_start) //slider before
            {
                limit = this.minValue + Math.round((value - box.thickness) * this.maxValue / box.length);
                value = -this.maxChange;
            }
            else  //slider after
            {
                limit = this.minValue + Math.round((value - box.thickness - box.slider_length) * this.maxValue / box.length);
                value = this.maxChange;
            }
        }

        if (this.step_to(value, limit, event))
        {
            step_to_delay.call(this, value, limit, event);
        }
    };


    this.__event_mousemove__ = function (event) {

        if (dragger)
        {
            var offset = this.vertical ? (event.offsetY - dragger.y) : (event.offsetX - dragger.x),
                value = Math.round(offset * (this.maxValue - this.minValue) / this.__boxModel__.length);

            if (value)
            {
                this.step_to(0, dragger.value + value, event);
            }
        }
    };


    this.__event_mouseup__ = function (event) {

        if (timer)
        {
            clearTimeout(timer);
            timer = null;
        }

        this.ownerWindow.__capture_control__ = null;
        dragger = null;
    };



    //移动指定距离
    this.step_to = function (step, limit, originalEvent) {

        var value = this.value + step,
            minValue = this.minValue,
            maxValue = this.maxValue - this.viewportSize;


        if (limit == null)
        {
            limit = step < 0 ? minValue : maxValue;
        }
        else if (limit < minValue)
        {
            limit = minValue;
        }
        else if (limit > maxValue)
        {
            limit = maxValue;
        }


        if (!step || (step > 0 && value > limit) || (step < 0 && value < limit))
        {
            value = limit;
        }


        if ((step = value - this.value) == 0)
        {
            return false;
        }


        this.value = value;


        var event = new flyingon.ScrollEvent(this, originalEvent);

        if (this.vertical)
        {
            event.verticalScrollBar = this;
            event.changeY = step;
        }
        else
        {
            event.horizontalScrollBar = this;
            event.changeX = step;
        }

        this.dispatchEvent(event);


        this.__boxModel__.invalidate(true);

        return value != limit;
    };


    //定时移动指定的距离
    function step_to_delay(step, limit, originalEvent) {

        var self = this,

            fn = function () {

                clearTimeout(timer);

                if (self.step_to(step, limit, originalEvent))
                {
                    timer = setTimeout(fn, 200);
                }
            };

        timer = setTimeout(fn, 200);
    };


    function fn_slider_length(length) {

        if (length <= 8)
        {
            return 0;
        }

        var result = Math.round(length * this.viewportSize / (this.maxValue - this.minValue));
        return result <= 8 ? 8 : result;
    };

    function fn_slider_start(length, slider_length) {

        if (length <= 0)
        {
            return 0;
        }

        if (this.value >= this.maxValue - this.viewportSize)
        {
            return length - slider_length;
        }

        return Math.round((this.value - this.minValue) * length / this.maxValue);
    };



    this.measure = function (boxModel) {

        boxModel.compute();

        var r = boxModel.clientRect,
            x1 = 0,
            x2 = 0,
            y1 = 0,
            y2 = 0,
            width = r.width,
            height = r.height;

        if (this.__button_1__.vertical = this.__button_2__.vertical = this.vertical)
        {
            var thickness = boxModel.thickness = width,
                length = boxModel.length = height - (thickness << 1),
                slider_length = boxModel.slider_length = fn_slider_length.call(this, length),
                slider_start = boxModel.slider_start = thickness + fn_slider_start.call(this, length, slider_length);

            y1 = Math.max(height - thickness, 0);
            y2 = slider_start;
            height = slider_length;
        }
        else
        {
            thickness = boxModel.thickness = height;
            length = boxModel.length = width - (thickness << 1);
            slider_length = boxModel.slider_length = fn_slider_length.call(this, length);
            slider_start = boxModel.slider_start = thickness + fn_slider_start.call(this, length, slider_length);

            x1 = Math.max(width - thickness, 0);
            x2 = slider_start;
            width = slider_length;
        }

        this.__button_1__.__boxModel__.measure(0, 0, thickness, thickness);
        this.__button_2__.__boxModel__.measure(x1, y1, thickness, thickness);
        this.__slider__.__boxModel__.measure(x2, y2, width, height);
    };



});




//滚动条按钮
flyingon.class("ScrollButton", flyingon.ImageButton, function (Class, flyingon) {


    Class.create = function (first) {

        this.__first__ = first;
    };


    this.__vertical__ = false;

    this.__fn_image__ = function () {

        return "scroll-" + (this.__vertical__ ? (this.__first__ ? "up" : "down") : (this.__first__ ? "left" : "right"));
    };

});




//滚动条滑块
flyingon.class("ScrollSlider", flyingon.Control, function (Class, flyingon) {

    this.defaultValue("width", "fill");

    this.defaultValue("height", "fill");

});




//滚动条拐角控件
flyingon.class("ScrollCorner", flyingon.Control, function (Class, flyingon) {

    this.defaultValue("width", "fill");

    this.defaultValue("height", "fill");

});
