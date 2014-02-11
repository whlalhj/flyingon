//集合
flyingon.class("Collection", function (Class, flyingon) {


    Class.create = function () {

        this.__items__ = [];
    };





    flyingon.defineProperty(this, "length", function () {

        return this.__items__.length;
    });



    this.item = function (index) {

        return this.__items__[index];
    };

    this.indexOf = function (item) {

        return this.__items__.indexOf(item);
    };

    this.append = function (item) {

        var fn = this.__fn_validate__,
            items = this.__items__;

        if (!fn || (item = fn.call(this, items.length, item)) !== false)
        {
            items.push(item);
        }

        return this;
    };

    this.insert = function (index, item) {

        var fn = this.__fn_validate__;

        if (!fn || (item = fn.call(this, index, item)) !== false)
        {
            this.__items__.splice(index, 0, item);
        }

        return this;
    };

    this.replace = function (index, item) {

        var fn = this.__fn_validate__;

        if (!fn || (item = fn.call(this, index, item)) !== false)
        {
            this.__items__[index] = item;
        }

        return this;
    };

    this.remove = function (item) {

        var items = this.__items__,
            index = items.indexOf(item),
            fn;

        if (index >= 0 && (!(fn = this.__fn_remove__) || fn.call(this, index, item) !== false))
        {
            items.splice(index, 1);
        }

        return this;
    };

    this.removeAt = function (index) {

        var items = this.__items__,
            fn;

        if (items.length > index && (!(fn = this.__fn_remove__) || fn.call(this, index, items[index]) !== false))
        {
            items.splice(index, 1);
        }

        return this;
    };

    this.clear = function () {

        var items = this.__items__,
            fn;

        if (items.length > 0)
        {
            if (!(fn = this.__fn_clear__) || fn.call(this, items) !== false)
            {
                items.length = 0;
            }
        }

        return this;
    };



    //自定义序列化
    this.serialize = function (writer) {

        writer.array("items", this.__items__);
    };

    //自定义反序列化
    this.deserialize = function (reader, data, except) {

        reader.array(this, "__items__", data.items);
    };


});