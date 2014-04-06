
//滑块控件
flyingon.defineClass("Slider", flyingon.Control, function (Class, base, flyingon) {



    var timer,      //定时变更定时器
        dragger;    //拖拉者



    Class.create = function () {

        this.__boxModel__.children = [];

        (this.__children__ = new flyingon.ControlCollection(this)).addRange([
            this.__line__ = new flyingon.ScrollSlider(),
            this.__button__ = new flyingon.ScrollButton(true)]);
    };



    this.defaultValue("width", 200);

    this.defaultValue("height", 16);



    //当前值
    this.defineProperty("value", 0, "measure");

    //最大值
    this.defineProperty("maxValue", 100, "measure");

    //最小值
    this.defineProperty("minValue", 0, "measure");


    //是否竖直滑块
    this.defineProperty("vertical", false, {

        attributes: "locate",
        complete: "var width = this.width;\nthis.width = this.height;\nthis.height = width;"
    });





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

        if (this.__button1__.vertical = this.__button2__.vertical = this.vertical)
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

        this.__button1__.__boxModel__.measure(0, 0, thickness, thickness);
        this.__button2__.__boxModel__.measure(x1, y1, thickness, thickness);
        this.__slider0__.__boxModel__.measure(x2, y2, width, height);
    };

});




//滑块线
flyingon.defineClass("SliderLine", flyingon.Control, function (Class, base, flyingon) {

    this.defaultValue("width", "fill");

    this.defaultValue("height", 4);

});


//滑块按钮
flyingon.defineClass("SliderButton", flyingon.Control, function (Class, base, flyingon) {

    this.defaultValue("width", 16);

    this.defaultValue("height", "fill");

});