
var items_control = function (flyingon) {



    //定义索引状态(根据不同的索引状态显示不同的值)
    this.defineStates("index-states", 0);

    //最大索引号(小于0则不启用索引状态)
    this.defineProperty("maxIndex", 0, "invalidate");



    //子项默认高度
    this.defineProperty("itemHeight", 16, "invalidate");

    //开始显示索引号
    this.defineProperty("visibleIndex", 0, "invalidate");





    this["y:create:item"] = function () {

    };

    this.clearTemplate = function () {

        var items = this["x:items"],
            length = items && items.length;

        for (var i = 0; i < length; i++)
        {
            var item = items[i],
                control = item["x:control"];

            if (control)
            {
                item["x:control"] = null;
                control.dispose();
            }
        }
    };

    //排列子项
    this.arrange = function (boxModel, usableRect) {

        var items = this["x:items"],
            children = this["x:render:children"] = [],

            storage = this["x:storage"],
            maxIndex = storage.maxIndex,
            itemHeight = storage.itemHeight,
            visibleIndex = storage.visibleIndex,

            y = 0,
            width = usableRect.width,
            height = usableRect.height,

            template;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i];

            if (item.visible)
            {
                var control = item["x:control"];

                if (!control)
                {
                    template === undefined && (template = this.template);

                    if (template)
                    {
                        control = item["x:control"] = this.createTemplateControl(template, item);
                    }
                    else
                    {
                        control = item["x:control"] = this["y:create:item"]();
                    }
                }


                if (control)
                {
                    var box = control["x:boxModel"];
                    box.measure(boxModel, 0, y, width, itemHeight);

                    children.push(control);

                    if ((y += box.height) >= height)
                    {
                        break;
                    }
                }
            }
        }
    };

    //获取当前可渲染的子项
    this["y:render:children"] = function (boxModel) {

        return this["x:render:children"];
    };





    this.serialize = function (writer) {

        flyingon.SerializableObject.prototype.serialize.call(this, writer);

        var items = this[name];
        items && items.length > 0 && writer.object(items_name, items);
    };

    this.deserialize = function (reader, data) {

        if (data)
        {
            flyingon.SerializableObject.prototype.deserialize.call(this, reader, data);

            reader.object(this, name, data[items_name]);
        }
    };

};

