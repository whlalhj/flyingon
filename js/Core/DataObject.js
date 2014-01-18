/// <reference path="../Base/Core.js" />



//数据对象
flyingon.class("DataObject", flyingon.SerializableObject, function (Class, flyingon) {


    function getter(name, attributes) {

        var body = "var name = \"" + name + "\";\nreturn this['x:data'][name] || this.defaultValue(name);";

        return new Function(body);
    };

    function setter(name, attributes) {

        var body = "var storage = this['x:data'], cache, name = '" + name + "';\n"

            + flyingon["x:define-initialize"]
            + "var oldValue = storage[name];\n"

            + (attributes.valueChangingCode ? attributes.valueChangingCode + "\n" : "") //自定义值变更代码

            + "if (oldValue !== value)\n"
            + "{\n"

            + flyingon["x:define-change"]

            + "var original = storage['x:original'] || (storage['x:original'] = {});\n"
            + "if (!original.hasOwnProperty(name))\n"
            + "{\n"
            + "original[name] = oldValue;\n"
            + "}\n"

            + "storage[name] = value;\n"

            + (attributes.valueChangedCode ? attributes.valueChangedCode + "\n" : "")  //自定义值变更代码

            + flyingon["x:define-binding"]

            + "}\n"

            + "return this;\n";


        return new Function("value", body);
    };




    Class.create = function () {

        this["x:data"] = {};
    };



    this.defineDataProperty = function (name, defaultValue, attributes) {


        if (defaultValue !== undefined)
        {
            this["x:defaults"][name] = defaultValue;
        }

        var schema = this["x:schema"] || (this["x:schema"] = {});

        attributes = schema[name] = flyingon["x:define-attributes"](attributes);
        attributes.defaultValue = defaultValue;

        flyingon.defineProperty(this, name, getter.call(this, name, attributes), setter.call(this, name, attributes));
        return this;
    };

    this.removeDataProperty = function (name) {

        delete this["x:data"][name];

        var schema = this["x:schema"];
        if (schema)
        {
            delete schema[name];
        }
    };



    //值变更事件
    this.defineEvent("change");



    //数据
    this.defineProperty("data",

        function () {

            return this["x:data"];
        },

        function (value) {

            var oldValue = this["x:data"];
            if (oldValue != value)
            {
                this["x:data"] = value;
                this.dispatchEvent("change", "name", value, oldValue);
            }
        });


    //获取或设置存储的值
    this.value = function (name, value) {

        if (value === undefined)
        {
            return this["x:storage"][name];
        }

        this["x:storage"][name] = value;
        return this;
    };

    //获取或设值
    this.value = function (name, value) {

        var data = this["x:data"];

        if (value === undefined)
        {
            return (data && data[name]) || this[name];
        }

        data[name] = value;
        return this;
    };

    //获取原始值
    this.originalValue = function (name) {

        var data = this["x:data"],
            original = data["x:original"];

        return (original && original[name]) || data[name];
    };

    this.hasChanged = function (name) {

        var data = this["x:data"]["x:original"];
        return data && (!name || data.hasOwnProperty(name));
    };

    this.acceptChanges = function () {

        this["x:data"]["x:original"] = null;
    };

    this.rejectChanges = function () {

        var data = this["x:data"],
            original = data["x:original"];

        if (original)
        {
            data["x:original"] = null;
            this["x:data"] = original;
        }
    };



    //自定义序列化
    this.serialize = function (writer) {

        flyingon.DataObject.super.serialize.call(this, writer);
        this["y:serialize-data"](writer);
    };

    this["y:serialize-data"] = function (writer) {

        writer.object("data", this["x:data"]);
    };

    this.deserialize = function (reader, data) {

        flyingon.DataObject.super.deserialize.call(this, reader, data);
        this["y:deserialize-data"](reader, data);
    };

    this["y:deserialize-data"] = function (reader, data) {

        reader.object(this, "x:data", data.data);
    };

}, true);




//
flyingon.class("DataArray", flyingon.DataObject, function (Class, flyingon) {



    this.ondataadd = null;

    this.ondataremove = null;




    //当前位置
    this.defineProperty("position", 0, {

        valueChangingCode: "if (value < 0) value = 0; else if (value >= storage.length) value = storage.length - 1;",
    });




    //数据结构
    this.defineProperty("schema", function () {

        return this["x:schema"];
    });



    this.append = function (item) {


    };

    this.insert = function (index, item) {

    };

    this.remove = function (item) {

    };

    this.removeAt = function (index) {

    };

}, true);

