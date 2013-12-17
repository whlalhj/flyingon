﻿$.class("ScrollEvent", $.Event, function (Class, $) {


});


//滚动条控件
$.class("ScrollBase", $.Control, function (Class, $) {



    
    var timer,      //定时变更定时器
        dragger;    //拖拉者



    Class.create = function () {

        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mousemove", this.handleMouseMove);
        this.addEventListener("mouseup", this.handleMouseUp);
    };



    //是否竖直滚动条
    this.defineProperty("isVertical", false, {

        attributes: "measure|layout",
        valueChangedCode: "var width = storage.width;\nstorage.width = storage.height;\nstorage.height = width;"
    });



    this.setDefaultValue("focusable", false);

    this.setDefaultValue("width", 200);

    this.setDefaultValue("height", 16);



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



    this.handleMouseDown = function (event) {


        if (timer)
        {
            clearTimeout(timer);
        }

        var storage = this["x:storage"],
            step,
            limit,
            type = this.getScrollTypeAt(event.windowX, event.windowY);


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
                this.ownerWindow["x:captureControl"] = this;
                dragger = { x: event.offsetX, y: event.offsetY, value: storage.value };
                return;
        }


        if (this.changeValue(step, limit))
        {
            this.changeValueTime(step, limit);
        }
    };


    this.handleMouseMove = function (event) {

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

    this.handleMouseUp = function (event) {

        if (timer)
        {
            clearTimeout(timer);
            timer = null;
        }

        this.ownerWindow["x:captureControl"] = null;
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


        var event = new $.ScrollEvent("scroll", this);

        if (storage.isVertical)
        {
            event.verticalScrollBar = this;
            event.changedX = 0;
            event.changedY = step;
        }
        else
        {
            event.horizontalScrollBar = this;
            event.changedX = step;
            event.changedY = 0;
        }

        this.dispatchEvent(event);


        this["x:boxModel"]["x:measure"] = true;
        this.invalidate();

        return value != limit;
    };


    //定时变更值
    this.changeValueTime = function (step, limit) {

        var self = this;

        timer = setTimeout(function () {

            clearTimeout(timer);

            if (timer && self.changeValue(step, limit))
            {
                timer = setTimeout(fn, 200);
            }

        }, 200);
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




