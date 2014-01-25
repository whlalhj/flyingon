//绘制型多子项控件基础服务
flyingon["items-painter"] = function (Class, flyingon, items_name) {



    Class.create = function () {

        this["x:storage"]["items"] = new flyingon.ItemCollection(this);
    };




    this.defaultValue("width", 200);

    this.defaultValue("height", 200);




    flyingon.defineProperty(this, items_name || "items",

        function () {

            return this["x:storage"]["x:items"];
        },

        function (value) {

            var oldValue = this["x:storage"]["x:items"];
            if (oldValue != value)
            {
                this["x:storage"]["x:items"] = value;

                //
            }
        });


    //this["x:selected-list"] = 


    //定义索引状态(根据不同的索引状态显示不同的值)
    this.defineStates("index-states", 0);

    //最大索引号(小于0则不启用索引状态)
    this.defineProperty("maxIndex", 0, "invalidate");



    //是否固定高度
    this["fixed-height"] = true;


    //子项默认高度
    this.defineProperty("item-height", 16, "invalidate");

    //开始显示索引号
    this.defineProperty("visibleIndex", 0, "invalidate");



    //移动开始显示索引至指定坐标
    this["y:visible-to"] = function (y) {

        if (this["fixed-height"]) //固定高度直接算出
        {
            var item_height = this["x:storage"]["item-height"] || 16;
            return Math.floor(y / item_height);
        }

        return this["y:visibli-items"](y, 0);
    };

    //获取可视项集合
    this["y:visible-items"] = function (height, visibleIndex) {

        var result = [],

            items = this["x:items"],
            items_1 = items["x:items"],
            items_2 = items["x:items-x"],

            storage = this["x:storage"],
            item_height = storage.item - height || 16,

            top = 0;

        if (visibleIndex == null)
        {
            visibleIndex = storage.visibleIndex || 0;
        }

        for (var i = visibleIndex, length = items_1.length; i < length; i++)
        {
            var item = items_2[i] || (items_2[i] = new flyingon.Rect());

            if ((top += item.height || item_height) >= height)
            {
                break;
            }

            result.push(item);
        }

        return result;
    };



    this.measureText = function (boxModel) {


    };




    this.serialize = function (writer) {

        flyingon.SerializableObject.prototype.serialize.call(this, writer);

        var items = this["x:items"]["x:items"];
        if (items && items.length > 0)
        {
            writer.array(items_name, items);
        }
    };

    this.deserialize = function (reader, data) {

        flyingon.SerializableObject.prototype.deserialize.call(this, reader, data);
        reader.array(this["x:items"] || (this["x:items"] = new flyingon.ItemCollection()), "x:items", data[items_name]);
    };

};

