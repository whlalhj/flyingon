//集合
flyingon.class("Collection", function (Class, flyingon) {


    Class.create = function () {

        this["x:items"] = [];
    };





    flyingon.defineProperty(this, "length", function () {

        return this["x:items"].length;
    });


    this.get = function (index) {

        return this["x:items"][index];
    };

    this.set = function (index, item) {

        var fn = this["y:validate"];

        (!fn || (item = fn.call(this, item)) !== undefined) && (this["x:items"][index] = item);

        return this;
    };

    this.indexOf = function (item) {

        return this["x:items"].indexOf(item);
    };

    this.append = function (item) {

        var fn = this["y:validate"];
        (!fn || (item = fn.call(this, item)) !== undefined) && this["x:items"].push(item);

        return this;
    };

    this.insert = function (index, item) {

        var fn = this["y:validate"];
        (!fn || (item = fn.call(this, item)) !== undefined) && this["x:items"].splice(index, 0, item);

        return this;
    };


    this.remove = function (item) {

        var items = this["x:items"],
            index = items.indexOf(item);

        if (index >= 0)
        {
            var fn = this["y:remove"];
            (!fn || fn.call(this, index) !== false) && items.splice(index, 1);
        }

        return this;
    };

    this.removeAt = function (index) {

        var items = this["x:items"];

        if (items.length > index)
        {
            var fn = this["y:remove"];
            (!fn || fn.call(this, index) !== false) && items.splice(index, 1);
        }

        return this;
    };

    this.clear = function () {

        var items = this["x:items"];

        if (items.length > 0)
        {
            var fn = this["y:clear"];
            (!fn || fn.call(this, items) !== false) && (items.length = 0);
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