/// <reference path="../Base/Core.js" />


/*

数据对象


*/
(function ($) {


    //
    $.class("DataObject", $.SerializableObject, function (Class, $) {


        function getter(name, attributes) {

            var body = "var name = \"" + name + "\";\n"

                + "return this['x:storage']['data'][name] || this.getDefaultValue(name);";

            return this["get_" + name] = new Function(body);
        };

        function setter(name, attributes) {

            var body = "var storage = this['x:storage']['data'], cache, name = '" + name + "';\n"

                + this["y:define:setter:initialize"]
                + "var oldValue = storage[name];\n"

                + (attributes.valueChangingCode ? attributes.valueChangingCode + "\n" : "") //自定义值变更代码

                + "if (oldValue !== value)\n"
                + "{\n"

                + this["y:define:setter:change"]

                + "var original = storage['x:original'] || (storage['x:original'] = {});\n"
                + "if (!original.hasOwnProperty(name))\n"
                + "{\n"
                + "original[name] = oldValue;\n"
                + "}\n"

                + "storage[name] = value;\n"

                + (attributes.valueChangedCode ? attributes.valueChangedCode + "\n" : "")  //自定义值变更代码

                + this["y:define:setter:bindingTo"]

                + "}\n"

                + "return this;\n";


            return this["set_" + name] = new Function("value", body);
        };


        this.defineDataProperty = function (name, defaultValue, attributes) {

            if (defaultValue !== undefined)
            {
                this["x:class"]["x:defaults"][name] = defaultValue;
            }

            var storage = this["x:storage"];

            attributes = (storage.schema || (storage.schema = {}))[name] = this["y:parse:attributes"](attributes);
            attributes.defaultValue = defaultValue;

            $.defineProperty(this, name, getter.call(this, name, attributes), setter.call(this, name, attributes));
            return this;
        };

        this.removeDataProperty = function (name) {

            delete this[name];
            delete this["x:storage"].schema[name];
        };



        //数据结构
        this.defineProperty("schema", null);

        //数据
        this.defineProperty("data", null);

        //获取数据
        this.getData = function (name) {

            return (this["get_" + name] || this.defineDataProperty(name)["get_" + name]).call(this);
        };

        //修改数据
        this.setData = function (name, value) {

            return (this["set_" + name] || this.defineDataProperty(name)["set_" + name]).call(this, value);
        };

        //获取原始数据
        this.getOriginalData = function (name) {

            var data = this["x:storage"]["data"],
                original = data["x:original"];

            return (original && original.hasOwnProperty(name) ? original[name] : data[name]) || null;
        };

        this.hasChanged = function (name) {

            var data = this["x:storage"]["data"]["x:original"];
            return data && (!name || data.hasOwnProperty(name));
        };

        this.acceptChanges = function () {

            this["x:storage"]["data"]["x:original"] = null;
        };

        this.rejectChanges = function () {

            var storage = this["x:storage"],
                data = storage["data"],
                original = data["x:original"];

            if (original)
            {
                data["x:original"] = null;
                storage["data"] = original;
            }
        };

    });





    //
    $.class("DataArray", $.DataObject, function (Class, $) {



        this.ondataadd = null;

        this.ondataremove = null;




        //当前位置
        this.defineProperty("position", 0, {

            valueChangingCode: "if (value < 0) { value = 0; } else if (value >= storage.length) { value = storage.length - 1; }",
        });


        this.append = function (item) {


        };

        this.insert = function (index, item) {

        };

        this.remove = function (item) {

        };

        this.removeAt = function (index) {

        };

    });



})(flyingon);