/*
形状基类

*/
flyingon.class("Shape", flyingon.SerializableObject, function (Class, flyingon) {



    //背景色
    this.defineProperty("backColor", null);

    //前景色
    this.defineProperty("foreColor", "control-text");

    //线宽
    this.defineProperty("lineWidth", 1);


    //固定宽度
    this.defineProperty("width", "fill");

    //固定高度
    this.defineProperty("height", "fill");

    //外边距
    this.defineProperty("margin", null);

    //内边距
    this.defineProperty("padding", null);

    //是否逆时针绘制
    this.defineProperty("anticlockwise", false);

    //子形状
    this.defineProperty("children", null);



    this.paint = function (context, boxModel) {

        var r = measure.call(this, boxModel.usableRect),
            cache;

        context.beginPath();

        this.draw(context, r.windowX, r.windowY, r.width, r.height);

        if (cache = this.children && cache.length > 0)
        {
            paint_children(context, cache, r);
        }

        if (cache = this.backColor)
        {
            context.set_fillStyle(cache);
            context.fill();
        }

        if (cache = this.foreColor)
        {
            context.lineWidth = this.lineWidth;
            context.set_strokeStyle(cache);
            context.stroke();
        }
    };


    function measure(usableRect) {

        var result = usableRect.copy(),
            margin = this.margin,
            width = this.width,
            height = this.height;

        if (margin)
        {
            result.x -= margin.left;
            result.y -= margin.top;
            result.width -= margin.spaceX;
            result.height -= margin.spaceY;
        }

        switch (typeof width)
        {
            case "number":
                result.width = width;
                break;

            case "string":
                if (width.length > 1 && width[width.length - 1] == "%")
                {
                    result.width = Math.round(parseFloat(width) * result.width / 100);
                }
                break;
        }

        switch (typeof height)
        {
            case "number":
                result.height = height;
                break;

            case "string":
                if (height.length > 1 && height[height.length - 1] == "%")
                {
                    result.height = Math.round(parseFloat(height) * result.height / 100);
                }
                break;
        }

        return result;
    };

    function paint_children(context, items, clientRect) {

        var padding = this.padding;
        if (padding)
        {
            clientRect.x -= padding.left;
            clientRect.y -= padding.top;
            clientRect.width -= padding.spaceX;
            clientRect.height -= padding.spaceY;
        }

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                r = measure.call(item, clientRect);

            item.draw(context, r.windowX, r.windowY, r.width, r.height);

            if (item = item.children && item.length > 0)
            {
                paint_children(context, item, r);
            }
        }
    };



    this.draw = function (context, x, y, width, height) {

    };



});

