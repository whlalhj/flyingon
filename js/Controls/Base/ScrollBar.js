
//滚动条控件
flyingon.class("ScrollBar", flyingon.ScrollBase, function (Class, flyingon) {



    //箭头背景
    this.defineProperty("arrowBackground", "black", "style");

    //向左箭头图片
    this.defineProperty("arrowLeft", null, "style");

    //向上箭头图片
    this.defineProperty("arrowUp", null, "style");

    //向右箭头图片
    this.defineProperty("arrowRight", null, "style");

    //向下箭头图片
    this.defineProperty("arrowDown", null, "style");


    //最大步长
    this.defaultValue("max_step", 200);

    //最小步长
    this.defaultValue("min_step", 20);




    this.defineEvent("scroll");




    //根据坐标获取当前滚动类型
    this.scrollType = function (x, y) {

        var segments = this.__boxModel__.segments,
            value = this.isVertical ? y : x;


        if (value <= segments[0])
        {
            return "decreaseMin";
        }

        if (value >= segments[3])
        {
            return "increaseMin";
        }

        if (value < segments[1])
        {
            return "decreaseMax";
        }

        if (value > segments[2])
        {
            return "increaseMax";
        }

        return "slider";
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

        return Math.round((this.value - this.minValue) * length / this.maxValue, 0);
    };



    this.measure = function (boxModel) {


        boxModel.compute();


        var x = boxModel.x,
            y = boxModel.y,
            width = boxModel.width,
            height = boxModel.height;


        if (this.isVertical)
        {
            var thickness = boxModel.thickness = width,
                length = boxModel.length = height - (thickness << 1),
                slider = boxModel.slider = slider_length.call(this, length),

                r_1 = boxModel.arrow1Rect = [x, y, thickness, thickness],
                r_2 = boxModel.sliderRect = [x, y + thickness + slider_start.call(this, length, slider), thickness, slider],
                r_3 = boxModel.arrow2Rect = [x, y + Math.max(height - thickness, 0), thickness, thickness];

            boxModel.segments = [r_1[1] + thickness, r_2[1], r_2[1] + slider, r_3[1]]; //位置段坐标
        }
        else
        {
            var thickness = boxModel.thickness = height,
                length = boxModel.length = width - (thickness << 1),
                slider = boxModel.slider = slider_length.call(this, length),

                r_1 = boxModel.arrow1Rect = [x, y, thickness, thickness],
                r_2 = boxModel.sliderRect = [x + thickness + slider_start.call(this, length, slider), y, slider, thickness],
                r_3 = boxModel.arrow2Rect = [x + Math.max(width - thickness, 0), y, thickness, thickness];

            boxModel.segments = [r_1[0] + thickness, r_2[0], r_2[0] + slider, r_3[0]]; //位置段坐标
        }
    };



    this.paint = function (context, boxModel) {


        context.save();

        context.fillStyle = "blue";
        context.fillRect.apply(context, boxModel.sliderRect);

        context.fillStyle = "red";

        context.fillRect.apply(context, boxModel.arrow1Rect);
        context.fillRect.apply(context, boxModel.arrow2Rect);

        context.restore();
    };



});



flyingon.class("ScrollCorner", flyingon.Control, function (Class, flyingon) {



});
