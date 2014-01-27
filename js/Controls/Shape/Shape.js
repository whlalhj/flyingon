/*
形状基类

*/
flyingon.class("Shape", flyingon.SerializableObject, function (Class, flyingon) {



    //填充色
    this.defineProperty("fillStyle", null);

    //边框色
    this.defineProperty("strokeStyle", "control-border");

    //线宽
    this.defineProperty("lineWidth", 1);



    //固定宽度
    this.defineProperty("width", 0);

    //固定高度
    this.defineProperty("height", 0);

    //x轴缩放比例
    this.defineProperty("scaleX", 1);

    //y轴缩放比例
    this.defineProperty("scaleY", 1);

    //偏移距离 上->右->底->左
    this.defineProperty("offset", [0, 0, 0, 0]);

    //是否逆时针绘制
    this.defineProperty("anticlockwise", false);

    //重绘模式 0:重绘自身  1:重绘父级  2:重绘图层
    this.defineProperty("updateMode", 0);

    //子形状
    this.defineProperty("children", null);




    function children(context, items, insideRect) {

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                offset = item.offset;

            item.buildPath(context,
                insideRect.windowX + offset[3],
                insideRect.windowY + offset[0],
                item.width <= 0 ? insideRect.width * item.scaleX - offset[3] - offset[1] : item.width,
                item.height <= 0 ? insideRect.height * item.scaleY - offset[0] - offset[2] : item.height);

            if (item = item.children)
            {
                children(context, item, insideRect);
            }
        }
    };


    this.paint = function (context, boxModel) {


        var insideRect = boxModel.insideRect,
            width = this.width,
            height = this.height,
            offset = this.offset,
            cache;


        context.beginPath();

        this.buildPath(context,
            insideRect.windowX + offset[3],
            insideRect.windowY + offset[0],
            width <= 0 ? insideRect.width * this.scaleX - offset[3] - offset[1] : width,
            height <= 0 ? insideRect.height * this.scaleY - offset[0] - offset[2] : height);


        if (cache = this.children)
        {
            children(context, cache, insideRect);
        }

        if (cache = this.fillStyle)
        {
            context.set_fillStyle(cache);
            context.fill();
        }

        if (cache = this.strokeStyle)
        {
            context.lineWidth = this.lineWidth;
            context.set_strokeStyle(cache);
            context.stroke();
        }
    };

    this.buildPath = function (context, x, y, width, height) {

    };




    //自定义序列化
    this.serialize = function (writer) {

        var fields = this.__fields__,
            keys = Object.keys(fields),
            key;

        for (var i = 0, length = keys.length; i < length; i++)
        {
            writer.object(key = keys[i], fields[key]);
        }
    };

    //自定义反序列化
    this.deserialize = function (reader, data) {

        reader.object(this, "__fields__", data);
    };


});

