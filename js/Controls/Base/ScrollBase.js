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
        valueChangedCode: "var width = storage.width;\nstorage.width = storage.height;\nstorage.height = width;"
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



    this["event-mousedown"] = function (event) {


        if (timer)
        {
            clearTimeout(timer);
        }


        var storage = this["x:storage"],
            step,
            limit,
            type = this.scrollType(event.windowX, event.windowY);


        switch (type)
        {
            case "decreaseMin":
                step = -storage.minStep;
                break;

            case "increaseMin":
                step = storage.minStep;
                break;

            case "decreaseMax":
                step = -storage.maxStep;
                limit = this.getValueAt(event.controlX, event.controlY, false);
                break;

            case "increaseMax":
                step = storage.maxStep;
                limit = this.getValueAt(event.controlX, event.controlY, true);
                break;

            default: //slider
                this.ownerWindow["x:capture-control"] = this;
                dragger = { x: event.offsetX, y: event.offsetY, value: storage.value };
                return;
        }


        this.changeValue(step, limit) && this.changeValueTime(step, limit);
    };


    this["event-mousemove"] = function (event) {

        if (dragger)
        {
            var storage = this["x:storage"],
                offset = storage.isVertical ? (event.offsetY - dragger.y) : (event.offsetX - dragger.x),
                value = Math.round(offset * (storage.maxValue - storage.minValue) / this["x:boxModel"].length);

            if (value)
            {
                this.changeValue(0, dragger.value + value);
            }
        }
    };

    this["event-mouseup"] = function (event) {

        if (timer)
        {
            clearTimeout(timer);
            timer = null;
        }

        this.ownerWindow["x:capture-control"] = null;
        dragger = null;
    };



    //变更值
    this.changeValue = function (step, limit) {

        var storage = this["x:storage"],
            value = storage.value + step,
            maxValue = storage.maxValue - storage.viewportSize;


        if (limit == null)
        {
            limit = step < 0 ? storage.minValue : maxValue;
        }
        else if (limit < storage.minValue)
        {
            limit = storage.minValue;
        }
        else if (limit > maxValue)
        {
            limit = maxValue;
        }


        if (!step || (step > 0 && value > limit) || (step < 0 && value < limit))
        {
            value = limit;
        }


        step = value - storage.value;

        if (step == 0)
        {
            return false;
        }


        storage.value = value;


        var event = new flyingon.ScrollEvent(this);

        if (storage.isVertical)
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


        this["x:boxModel"]["x:measure"] = true;
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

        var storage = this["x:storage"],
            boxModel = this["x:boxModel"],
            value = storage.isVertical ? y : x;

        if (exclueSlider)
        {
            value -= boxModel.slider;
        }

        if (boxModel.thickness)
        {
            value -= boxModel.thickness;
        }

        return storage.minValue + Math.round(value * storage.maxValue / boxModel.length);
    };


});




