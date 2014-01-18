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




    function children(context, storage, insideRect) {

        var items = storage.children;

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                offset = (storage = item["x:storage"]).offset;

            item.buildPath(context,
                insideRect.windowX + offset[3],
                insideRect.windowY + offset[0],
                storage.width <= 0 ? insideRect.width * storage.scaleX - offset[3] - offset[1] : storage.width,
                storage.height <= 0 ? insideRect.height * storage.scaleY - offset[0] - offset[2] : storage.height);

            if (storage.children)
            {
                children(context, storage, insideRect);
            }
        }
    };


    this.paint = function (context, boxModel) {


        var insideRect = boxModel.insideRect,
            storage = this["x:storage"],
            offset = storage.offset;


        context.beginPath();

        this.buildPath(context,
            insideRect.windowX + offset[3],
            insideRect.windowY + offset[0],
            storage.width <= 0 ? insideRect.width * storage.scaleX - offset[3] - offset[1] : storage.width,
            storage.height <= 0 ? insideRect.height * storage.scaleY - offset[0] - offset[2] : storage.height);


        if (storage.children)
        {
            children(context, storage, insideRect);
        }

        if (storage.fillStyle)
        {
            context.set_fillStyle(storage.fillStyle);
            context.fill();
        }

        if (storage.strokeStyle)
        {
            context.lineWidth = storage.lineWidth;
            context.set_strokeStyle(storage.strokeStyle);
            context.stroke();
        }
    };

    this.buildPath = function (context, x, y, width, height) {

    };




    //自定义序列化
    this.serialize = function (writer) {

        var storage = this["x:storage"],
            names = Object.getOwnPropertyNames(storage),
            name;

        for (var i = 0, length = names.length; i < length; i++)
        {
            writer.object(name = names[i], storage[name]);
        }
    };

    //自定义反序列化
    this.deserialize = function (reader, data) {

        reader.object(this, "x:storage", data);
    };


});

