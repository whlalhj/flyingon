
//滚动事件
flyingon.ScrollEvent = function (target, originalEvent) {

    this.target = target;
    this.originalEvent = originalEvent;
};


(function () {

    //事件类型
    this.type = "scroll";

    //水平变化距离
    this.changeX = 0;

    //竖直变化距离
    this.changeY = 0;

}).call(flyingon.ScrollEvent.prototype = new flyingon.Event());





//复合控件扩展
//复合控件的子控件不响应事件,但支持样式及状态
flyingon.complex_extender = function (base) {


    this.hitTest = function (x, y) {

        if (base.hitTest.call(this, x, y))
        {
            var r = this.__boxModel.clientRect,
                items = this.__children,
                source = this.__target,
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

            if (source && source !== target)
            {
                source.stateTo("hover", false);
            }

            if (this.__target = target)
            {
                target.stateTo("hover", true);
            }

            return true;
        }

        return false;
    };

    this.stateTo = function (name, value) {

        if (this.__target && (name !== "hover" || !value))
        {
            this.__target.stateTo(name, value);
        }

        base.stateTo.call(this, name, value);
    };

};




//滚动条控件
flyingon.defineClass("ScrollBar", flyingon.Control, function (Class, base, flyingon) {



    var timer,      //定时变更定时器
        dragger;    //拖拉者



    Class.create = function () {

        this.__boxModel.children = [];

        this.__visual_items = [
            this.__button1 = new flyingon.ScrollButton(true),
            this.__slider0 = new flyingon.ScrollSlider(),
            this.__button2 = new flyingon.ScrollButton(false)];
    };



    //禁止滚动条
    this.overflowX = this.overflowY = null;
    


    this.defaultValue("focusable", false);

    //当前值
    this.defineProperty("value", 0, "measure");

    //滚动条长度
    this.defineProperty("length", 100, "measure");

    //显示值大小
    this.defineProperty("viewportSize", 10, "measure");

    //最大变更值
    this.defineProperty("max_change", 200);

    //最小变更值
    this.defineProperty("min_change", 20);




    //滚动事件
    this.defineEvent("scroll");



    //执行复合控件扩展
    flyingon.complex_extender.call(this, base);



    this.__event_mousedown = function (event) {

        if (timer)
        {
            clearTimeout(timer);
        }

        var value = this.__target, limit;

        if (value)
        {
            if (value === this.__button1)
            {
                value = -this.min_change;
            }
            else if (value === this.__button2)
            {
                value = this.min_change;
            }
            else //slider
            {
                this.ownerWindow.__capture_control = this;

                dragger = {

                    x: event.offsetX,
                    y: event.offsetY,
                    value: this.value
                };

                event.stopPropagation();
                event.preventDefault();
                return;
            }
        }
        else
        {
            var r = this.__boxModel.clientRect;
            value = this.vertical ? event.windowY - r.windowY : event.windowX - r.windowX;

            if (value < this.__offset_value) //slider before
            {
                limit = Math.round((value - this.thickness) * this.length / this.__length_value);
                value = -this.max_change;
            }
            else  //slider after
            {
                limit = Math.round((value - this.thickness - this.__slider_value) * this.length / this.__length_value);
                value = this.max_change;
            }
        }

        if (this.step_to(value, limit, event))
        {
            step_to_delay.call(this, value, limit, event);
        }
    };


    this.__event_mousemove = function (event) {

        if (dragger)
        {
            var offset = this.vertical ? (event.offsetY - dragger.y) : (event.offsetX - dragger.x),
                value = Math.round(offset * this.length / this.__length_value);

            if (value)
            {
                this.step_to(0, dragger.value + value, event);
            }
        }
    };


    this.__event_mouseup = function (event) {

        if (timer)
        {
            clearTimeout(timer);
            timer = null;
        }

        this.ownerWindow.__capture_control = null;
        dragger = null;
    };



    //移动指定距离
    this.step_to = function (step, limit, originalEvent) {

        var value = this.value + step,
            length = this.length - this.viewportSize;


        if (limit == null)
        {
            limit = step < 0 ? 0 : length;
        }
        else if (limit < 0)
        {
            limit = 0;
        }
        else if (limit > length)
        {
            limit = length;
        }


        if (!step || (step > 0 && value > limit) || (step < 0 && value < limit))
        {
            value = limit;
        }


        if ((step = value - this.value) === 0)
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


        this.__boxModel.invalidate(true);

        return value !== limit;
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

        var result = Math.round(length * this.viewportSize / this.length);
        return result <= 8 ? 8 : result;
    };

    function slider_start(length, slider) {

        if (length <= 0)
        {
            return 0;
        }

        if (this.value >= this.length - this.viewportSize)
        {
            return length - slider;
        }

        return Math.round(this.value * length / this.length);
    };



    this.measure = function (boxModel) {

        boxModel.compute();

        var r = boxModel.clientRect,
            x = 0,
            y = 0,
            value,
            button1 = this.__button1,
            button2 = this.__button2,
            slider0 = this.__slider0.__boxModel,
            thickness = this.thickness;

        button1.__boxModel.measure(0, 0, thickness, thickness);

        if (button1.vertical = button2.vertical = this.vertical)
        {
            var length = this.__length_value = (value = boxModel.clientRect.height) - (thickness << 1),
                slider = this.__slider_value = slider_length.call(this, length),
                offset = this.__offset_value = thickness + slider_start.call(this, length, slider);

            y = Math.max(value - thickness, 0);

            slider0.measure(0, offset, thickness, slider);
        }
        else
        {
            length = this.__length_value = (value = boxModel.clientRect.width) - (thickness << 1);
            slider = this.__slider_value = slider_length.call(this, length);
            offset = this.__offset_value = thickness + slider_start.call(this, length, slider);

            x = Math.max(value - thickness, 0);

            slider0.measure(offset, 0, slider, thickness);
        }

        button2.__boxModel.measure(x, y, thickness, thickness);
    };



});




//滚动条按钮
flyingon.defineClass("ScrollButton", flyingon.Control, function (Class, base, flyingon) {


    Class.create = function (first) {

        this.__first = first;
    };
    


    //禁止滚动条
    this.overflowX = this.overflowY = null;



    this.__vertical = false;


    //修改默认值为充满
    this.defaultValue("width", "fill");

    //修改默认值为充满
    this.defaultValue("height", "fill");



    //绘制图像
    this.paint = function (context, boxModel) {

        var image = "scroll-" + (this.__vertical ? (this.__first ? "up" : "down") : (this.__first ? "left" : "right"));

        if (image = this.__fn_state_image(image))
        {
            var r = boxModel.clientRect;
            context.paint_image(image, r.windowX, r.windowY, r.width, r.height, this.textAlign);
        }
    };


});




//滚动条滑块
flyingon.defineClass("ScrollSlider", flyingon.Control, function (Class, base, flyingon) {
    

    //禁止滚动条
    this.overflowX = this.overflowY = null;


    this.defaultValue("width", "fill");

    this.defaultValue("height", "fill");

});




//滚动条拐角控件
flyingon.defineClass("ScrollCorner", flyingon.Control, function (Class, base, flyingon) {
    

    //禁止滚动条
    this.overflowX = this.overflowY = null;


    this.defaultValue("width", "fill");

    this.defaultValue("height", "fill");

});
