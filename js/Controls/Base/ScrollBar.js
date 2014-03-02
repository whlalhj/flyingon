
//滚动事件
flyingon.ScrollEvent = function (target, originalEvent) {

    this.target = target;
    this.originalEvent = originalEvent;
};



//复合控件服务
//复合控件的子控件不响应事件,但支持样式及状态
flyingon.__complex_control_service__ = function (base) {


    this.hitTest = function (x, y) {

        if (base.hitTest.call(this, x, y))
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

        base.stateTo.call(this, name, value);
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
flyingon.defineClass("ScrollBar", flyingon.Control, function (Class, base, flyingon) {



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



    //订阅复合控件服务
    flyingon.__complex_control_service__.call(this, base);



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

            if (value < box.offsetX) //slider before
            {
                limit = this.minValue + Math.round((value - box.thickness) * this.maxValue / box.length);
                value = -this.maxChange;
            }
            else  //slider after
            {
                limit = this.minValue + Math.round((value - box.thickness - box.slider) * this.maxValue / box.length);
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


    function slider_length(length) {

        if (length <= 8)
        {
            return 0;
        }

        var result = Math.round(length * this.viewportSize / (this.maxValue - this.minValue));
        return result <= 8 ? 8 : result;
    };

    function slider_start(length, slider) {

        if (length <= 0)
        {
            return 0;
        }

        if (this.value >= this.maxValue - this.viewportSize)
        {
            return length - slider;
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
                slider = boxModel.slider = slider_length.call(this, length),
                offsetX = boxModel.offsetX = thickness + slider_start.call(this, length, slider);

            y1 = Math.max(height - thickness, 0);
            y2 = offsetX;
            height = slider;
        }
        else
        {
            thickness = boxModel.thickness = height;
            length = boxModel.length = width - (thickness << 1);
            slider = boxModel.slider = slider_length.call(this, length);
            offsetX = boxModel.offsetX = thickness + slider_start.call(this, length, slider);

            x1 = Math.max(width - thickness, 0);
            x2 = offsetX;
            width = slider;
        }

        this.__button_1__.__boxModel__.measure(0, 0, thickness, thickness);
        this.__button_2__.__boxModel__.measure(x1, y1, thickness, thickness);
        this.__slider__.__boxModel__.measure(x2, y2, width, height);
    };



});




//滚动条按钮
flyingon.defineClass("ScrollButton", flyingon.Control, function (Class, base, flyingon) {


    Class.create = function (first) {

        this.__first__ = first;
    };


    this.__vertical__ = false;


    //修改默认值为充满
    this.defaultValue("width", "fill");

    //修改默认值为充满
    this.defaultValue("height", "fill");



    //绘制图像
    this.paint = function (context, boxModel) {

        var image = "scroll-" + (this.__vertical__ ? (this.__first__ ? "up" : "down") : (this.__first__ ? "left" : "right"));

        if (image = this.__fn_state_image__(image))
        {
            var r = boxModel.clientRect;
            context.paint_image(image, r.windowX, r.windowY, r.width, r.height, this.textAlign);
        }
    };


});




//滚动条滑块
flyingon.defineClass("ScrollSlider", flyingon.Control, function (Class, base, flyingon) {

    this.defaultValue("width", "fill");

    this.defaultValue("height", "fill");

    this.defaultValue("align", new flyingon.Align("middle,center"));

});




//滚动条拐角控件
flyingon.defineClass("ScrollCorner", flyingon.Control, function (Class, base, flyingon) {

    this.defaultValue("width", "fill");

    this.defaultValue("height", "fill");

});
