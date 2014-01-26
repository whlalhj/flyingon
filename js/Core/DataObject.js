/// <reference path="../Base/Core.js" />



//数据对象
flyingon.class("DataObject", flyingon.SerializableObject, function (Class, flyingon) {


    function getter(name, attributes) {

        var body = "var name = \"" + name + "\";\nreturn this.__data__[name] || this.defaultValue(name);";

        return new Function(body);
    };

    function setter(name, attributes) {

        var body = "var storage = this.__data__, cache, name = '" + name + "';\n"

            + flyingon.__define_initialize__
            + "var oldValue = storage[name];\n"

            + (attributes.valueChangingCode ? attributes.valueChangingCode + "\n" : "") //自定义值变更代码

            + "if (oldValue !== value)\n"
            + "{\n"

            + flyingon.__define_change__

            + "var original = storage.__original__ || (storage.__original__ = {});\n"
            + "if (!original.hasOwnProperty(name))\n"
            + "{\n"
            + "original[name] = oldValue;\n"
            + "}\n"

            + "storage[name] = value;\n"

            + (attributes.valueChangedCode ? attributes.valueChangedCode + "\n" : "")  //自定义值变更代码

            + flyingon.__define_binding__

            + "}\n"

            + "return this;\n";


        return new Function("value", body);
    };




    Class.create = function () {

        this.__data__ = {};
    };



    this.defineDataProperty = function (name, defaultValue, attributes) {


        if (defaultValue !== undefined)
        {
            this.__defaults__[name] = defaultValue;
        }

        var schema = this.__schema__ || (this.__schema__ = {});

        attributes = schema[name] = flyingon.__define_attributes__(attributes);
        attributes.defaultValue = defaultValue;

        flyingon.defineProperty(this, name, getter.call(this, name, attributes), setter.call(this, name, attributes));
        return this;
    };

    this.removeDataProperty = function (name) {

        delete this.__data__[name];

        var schema = this.__schema__;
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

            return this.__data__;
        },

        function (value) {

            var oldValue = this.__data__;
            if (oldValue != value)
            {
                this.__data__ = value;
                this.dispatchEvent("change", "name", value, oldValue);
            }
        });


    //获取或设置存储的值
    this.value = function (name, value) {

        if (value === undefined)
        {
            return this.__storage__[name];
        }

        this.__storage__[name] = value;
        return this;
    };

    //获取或设值
    this.value = function (name, value) {

        var data = this.__data__;

        if (value === undefined)
        {
            return (data && data[name]) || this[name];
        }

        data[name] = value;
        return this;
    };

    //获取原始值
    this.originalValue = function (name) {

        var data = this.__data__,
            original = data.__original__;

        return (original && original[name]) || data[name];
    };

    this.hasChanged = function (name) {

        var data = this.__data__.__original__;
        return data && (!name || data.hasOwnProperty(name));
    };

    this.acceptChanges = function () {

        this.__data__.__original__ = null;
    };

    this.rejectChanges = function () {

        var data = this.__data__,
            original = data.__original__;

        if (original)
        {
            data.__original__ = null;
            this.__data__ = original;
        }
    };



    //自定义序列化
    this.serialize = function (writer) {

        flyingon.DataObject.super.serialize.call(this, writer);
        this.__fn_serialize_data__(writer);
    };

    this.__fn_serialize_data__ = function (writer) {

        writer.object("data", this.__data__);
    };

    this.deserialize = function (reader, data) {

        flyingon.DataObject.super.deserialize.call(this, reader, data);
        this.__fn_deserialize_data__(reader, data);
    };

    this.__fn_deserialize_data__ = function (reader, data) {

        reader.object(this, "__data__", data.data);
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

        return this.__schema__;
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

