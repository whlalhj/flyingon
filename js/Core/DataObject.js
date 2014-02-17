/// <reference path="../Base/Core.js" />



//数据对象
flyingon.class("DataObject", flyingon.SerializableObject, function (Class, flyingon) {


    function getter(name, attributes) {

        var body = "return this.__data__." + name + " || this.defaultValue(\"" + name + "\");";
        return new Function(body);
    };

    function setter(name, attributes) {

        var body = [];


        body.push("var fields = this.__data__, cache;\n");

        body.push(this.__define_initializing__(name, attributes));

        body.push("var oldValue = fields." + name + ";\n");

        if (attributes.changing) //自定义值变更代码
        {
            body.push(attributes.changing);
            body.push("\n");
        }

        body.push("if (oldValue !== value)\n");
        body.push("{\n");

        body.push(this.__define_change__(name));

        body.push("var original = fields.__original__ || (fields.__original__ = {});\n");
        body.push("if (!original.hasOwnProperty(\"" + name + "\"))\n");
        body.push("{\n");
        body.push("original." + name + " = oldValue;\n");
        body.push("}\n");

        body.push("fields." + name + " = value;\n");

        if (attributes.changed) //自定义值变更代码
        {
            body.push(attributes.changed);
            body.push("\n");
        }

        if (attributes.complete) //自定义值变更结束代码
        {
            body.push(attributes.complete);
            body.push("\n");
        }


        body.push("if (cache = this.__bindings__)\n");
        body.push("{\n");
        body.push("this.__fn_bindings__(\"" + name + "\", cache);\n");
        body.push("}\n");


        body.push("}\n");

        body.push("return this;\n");


        return new Function("value", body.join(""));
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

        attributes = schema[name] = this.__define_attributes__(attributes);
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
            return this.__fields__[name];
        }

        this.__fields__[name] = value;
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
        writer.object("data", this.__data__);
    };

    this.deserialize = function (reader, data, excludes) {

        flyingon.DataObject.super.deserialize.call(this, reader, data, excludes);
        reader.object(this, "__data__", data.data);
    };


}, true);




//
flyingon.class("DataArray", flyingon.DataObject, function (Class, flyingon) {



    this.ondataadd = null;

    this.ondataremove = null;




    //当前位置
    this.defineProperty("position", 0, {

        changing: "if (value < 0) value = 0; else if (value >= fields.length) value = fields.length - 1;",
    });




    //数据结构
    this.defineProperty("schema", function () {

        return this.__schema__;
    });



    this.add = function (item) {


    };

    this.insert = function (index, item) {

    };

    this.remove = function (item) {

    };

    this.removeAt = function (index) {

    };

}, true);

