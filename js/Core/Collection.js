//集合
flyingon.class("Collection", function (Class, flyingon) {


    Class.create = function () {

        this["x:items"] = [];
    };





    flyingon.defineProperty(this, "length", function () {

        return this["x:items"].length;
    });



    this.item = function (index) {

        return this["x:items"][index];
    };

    this.indexOf = function (item) {

        return this["x:items"].indexOf(item);
    };

    this.append = function (item) {

        var fn = this["y:validate"],
            items = this["x:items"];

        if (!fn || (item = fn.call(this, items.length, item)) !== false)
        {
            items.push(item);
        }

        return this;
    };

    this.insert = function (index, item) {

        var fn = this["y:validate"];

        if (!fn || (item = fn.call(this, index, item)) !== false)
        {
            this["x:items"].splice(index, 0, item);
        }

        return this;
    };

    this.replace = function (index, item) {

        var fn = this["y:validate"];

        if (!fn || (item = fn.call(this, index, item)) !== false)
        {
            this["x:items"][index] = item;
        }

        return this;
    };

    this.remove = function (item) {

        var items = this["x:items"],
            index = items.indexOf(item),
            fn;

        if (index >= 0 && (!(fn = this["y:remove"]) || fn.call(this, index, item) !== false))
        {
            items.splice(index, 1);
        }

        return this;
    };

    this.removeAt = function (index) {

        var items = this["x:items"],
            fn;

        if (items.length > index && (!(fn = this["y:remove"]) || fn.call(this, index) !== false))
        {
            items.splice(index, 1);
        }

        return this;
    };

    this.clear = function () {

        var items = this["x:items"],
            fn;

        if (items.length > 0)
        {
            if (!(fn = this["y:clear"]) || fn.call(this, items) !== false)
            {
                items.length = 0;
            }
        }

        return this;
    };



    //自定义序列化
    this.serialize = function (writer) {

        writer.array("items", this["x:items"]);
    };

    //自定义反序列化
    this.deserialize = function (reader, data) {

        reader.array(this, "x:items", data["items"]);
    };


});