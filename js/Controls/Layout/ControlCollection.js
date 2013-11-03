/*

*/
(function ($) {


    //控件集合
    $.ControlCollection = function (ownerControl) {

        this.ownerControl = ownerControl;
    };



    var p = $.ControlCollection.prototype = [],
        push = p.push,
        splice = p.splice,
        global = $.global;


    //隐藏标准属性
    ["push", "concat", "pop", "shift", "splice", "unshift"].forEach(function (item) {

        $.defineVariable(this, item, undefined, true, false);
    }, p);




    p.append = function (item) {

        if (global.initializing)
        {
            item["x:parent"] = this.ownerControl;
        }
        else
        {
            item["fn:parent"](this.ownerControl);
        }

        push.call(this, item);
        return this;
    };

    p.appendRange = function (items) {

        var i = 0,
            length = items.length,
            initializing = global.initializing;

        while (i < length)
        {
            var item = items[i++];

            if (initializing)
            {
                item["x:parent"] = this.ownerControl;
            }
            else
            {
                item["fn:parent"](this.ownerControl);
            }

            push.call(this, item);
        }

        return this;
    };

    p.insert = function (index, item) {

        if (global.initializing)
        {
            item["x:parent"] = this.ownerControl;
        }
        else
        {
            item["fn:parent"](this.ownerControl);
        }

        splice.call(this, index, 0, item);
        return this;
    };

    p.insertRange = function (index, items) {

        var i = 0,
            length = items.length,
            initializing = global.initializing;

        while (i < length)
        {
            var item = items[i++];

            if (initializing)
            {
                item["x:parent"] = this.ownerControl;
            }
            else
            {
                item["fn:parent"](this.ownerControl);
            }

            splice.call(this, index, 0, item);
        }

        return this;
    };




    p.remove = function (item) {

        var index = this.indexOf(item);

        if (index >= 0)
        {
            item["fn:parent"](null);
            splice.call(this, index, 1);
        }

        return this;
    };

    p.removeAt = function (index) {

        if (this.length > index)
        {
            this[index]["fn:parent"](null);
            splice.call(this, index, 1);
        }

        return this;
    };

    p.clear = function () {

        var i = 0,
            length = this.length;

        while (i < length)
        {
            this[index]["fn:parent"](null);
        }

        this.length = 0;
        return this;
    };



})(flyingon);
