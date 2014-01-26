flyingon.class("ScrollEvent", flyingon.Event, function (Class, flyingon) {


    Class.create = function (target) {

        this.target = target;
    };


    this.type = "scroll";

    //水平滚动条
    this.horizontalScrollBar = null;

    //竖起滚动条
    this.verticalScrollBar = null;

    //水平变化距离
    this.changedX = 0;

    //竖直变化距离
    this.changedY = 0;

});


//滚动条控件
flyingon.class("ScrollBase", flyingon.Control, function (Class, flyingon) {


    var timer,      //定时变更定时器
        dragger;    //拖拉者



    //是否竖直滚动条
    this.defineProperty("isVertical", false, {

        attributes: "locate",
        valueChangedCode: "var width = this.width;\nthis.width = this.height;\nthis.height = width;"
    });



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

    //最大步进
    this.defineProperty("maxStep", 10);

    //最小步进
    this.defineProperty("minStep", 1);



    //滑块背景
    this.defineProperty("sliderBackground", undefined, "style");

    //滑块图片
    this.defineProperty("slider", undefined, "style");



    this.defineEvent("scroll");



    this.supportPartialUpdate = function () {

        return true;
    };



    this.__event_mousedown__ = function (event) {


        if (timer)
        {
            clearTimeout(timer);
        }


        var step,
            limit,
            type = this.scrollType(event.windowX, event.windowY);


        switch (type)
        {
            case "decreaseMin":
                step = -this.min_step;
                break;

            case "increaseMin":
                step = this.min_step;
                break;

            case "decreaseMax":
                step = -this.max_step;
                limit = this.getValueAt(event.controlX, event.controlY, false);
                break;

            case "increaseMax":
                step = this.max_step;
                limit = this.getValueAt(event.controlX, event.controlY, true);
                break;

            default: //slider
                this.ownerWindow.__capture_control__ = this;
                dragger = { x: event.offsetX, y: event.offsetY, value: this.value };
                return;
        }


        this.changeValue(step, limit) && this.changeValueTime(step, limit);
    };


    this.__event_mousemove__ = function (event) {

        if (dragger)
        {
            var offset = this.isVertical ? (event.offsetY - dragger.y) : (event.offsetX - dragger.x),
                value = Math.round(offset * (this.maxValue - this.minValue) / this.__boxModel__.length);

            if (value)
            {
                this.changeValue(0, dragger.value + value);
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



    //变更值
    this.changeValue = function (step, limit) {

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


        step = value - this.value;

        if (step == 0)
        {
            return false;
        }


        this.value = value;


        var event = new flyingon.ScrollEvent(this);

        if (this.isVertical)
        {
            event.verticalScrollBar = this;
            event.changedY = step;
        }
        else
        {
            event.horizontalScrollBar = this;
            event.changedX = step;
        }

        this.dispatchEvent(event);


        this.__boxModel__.__measure__ = true;
        this.invalidate();

        return value != limit;
    };


    //定时变更值
    this.changeValueTime = function (step, limit) {

        var self = this;

        var fn = function () {

            clearTimeout(timer);

            if (self.changeValue(step, limit))
            {
                timer = setTimeout(fn, 200);
            }
        };

        timer = setTimeout(fn, 200);
    };


    //根据位置获取当前值
    this.getValueAt = function (x, y, exclueSlider) {

        var boxModel = this.__boxModel__,
            value = this.isVertical ? y : x;

        if (exclueSlider)
        {
            value -= boxModel.slider;
        }

        if (boxModel.thickness)
        {
            value -= boxModel.thickness;
        }

        return this.minValue + Math.round(value * this.maxValue / boxModel.length);
    };


});




