//集合
//注: 此集合不是数组,不能像数组一样手动修改length的值,否则可能会出现无法预知的错误
flyingon.class("Collection", function (Class, flyingon) {


    this.__push__ = Array.prototype.push;

    this.__splice__ = Array.prototype.splice;


    //子项数
    this.length = 0;


    //获取指定项的索引
    this.indexOf = Array.prototype.indexOf;

    //循环执行
    this.forEach = Array.prototype.forEach;


    //添加子项
    this.add = function (item) {

        var fn = this.__fn_validate__;

        if (!fn || (item = fn.call(this, this.length, item)) !== undefined)
        {
            this.__push__(item);
            return true;
        }
    };

    //添加多个子项
    this.addRange = function (items) {

        if (items && items.length > 0)
        {
            var fn = this.__fn_validate__;

            if (fn)
            {
                var item;

                for (var i = 0, length = items.length; i < length; i++)
                {
                    if ((item = fn.call(this, this.length, items[i])) !== undefined)
                    {
                        this.__push__(item);
                    }
                }
            }
            else
            {
                this.__push__.apply(this, items);
            }
        }
    };

    //在指定位置插入子项
    this.insert = function (index, item) {

        if (index >= 0)
        {
            var fn = this.__fn_validate__;

            if (!fn || (item = fn.call(this, index, item)) !== undefined)
            {
                this.__splice__(index, 0, item);
                return true;
            }
        }
    };

    //在指定位置插入多个子项
    this.insertRange = function (index, items) {

        if (index >= 0 && items && items.length > 0)
        {
            var fn = this.__fn_validate__,
                item;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if (!fn || (item = fn.call(this, index, item)) !== undefined)
                {
                    this.__splice__(index++, 0, item);
                }
            }
        }
    };

    //替换指定位置的子项
    this.replace = function (index, item) {

        if (index >= 0)
        {
            var fn;

            if (this.length > index && (fn = this.__fn_remove__) && fn.call(this, index, this[index]) === false)
            {
                return;
            }

            if (!(fn = this.__fn_validate__) || (item = fn.call(this, index, item)) !== undefined)
            {
                this[index] = item;

                if (this.length <= index)
                {
                    this.length = index + 1;
                }

                return true;
            }
        }
    };

    //移除指定子项
    this.remove = function (item) {

        var index = this.indexOf(item),
            fn;

        if (index >= 0 && (!(fn = this.__fn_remove__) || fn.call(this, index, item) !== false))
        {
            this.__splice__(index, 1);
            return true;
        }
    };

    //移除指定位置的子项
    this.removeAt = function (index) {

        var fn;

        if (this.length > index && (!(fn = this.__fn_remove__) || fn.call(this, index, this[index]) !== false))
        {
            this.__splice__(index, 1);
            return true;
        }
    };

    //清除
    this.clear = function () {

        if (this.length > 0)
        {
            var fn = this.__fn_clear__;

            if (!fn || fn.call(this) !== false)
            {
                this.__splice__(0, this.length);
                return true;
            }
        }
    };



    //扩展循环执行(for_XXX)相关方法
    flyingon.for_extend(this);



    //自定义序列化
    this.serialize = function (writer) {

        for (var i = 0; i < this.length; i++)
        {
            writer.value("" + i, this[i]);
        }
    };

    //自定义反序列化
    this.deserialize = function (reader, data, excludes) {

        if (data)
        {
            reader.properties(this, data, excludes);
        }
    };


});