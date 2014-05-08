//集合
//注: 此集合不是数组,不能像数组一样手动修改length的值,否则可能会出现无法预知的错误
flyingon.defineClass("Collection", function (Class, base, flyingon) {



    //引入数组的方法
    (function (target) {

        this.__indexOf__ = target.indexOf;
        this.__push__ = target.push;
        this.__splice__ = target.splice;

    }).call(this, Array.prototype);



    //子项数
    this.length = 0;



    //获取指定项的索引
    this.indexOf = function indexOf(item) {

        if (item && typeof item === "object") //缓存索引以加快检索速度
        {
            var cache = this.__index_cache__ || (this.__index_cache__ = {}),
                id = item.__uniqueId__ || (item.__uniqueId__ = ++flyingon.__uniqueId__);

            return cache[id] || (cache[id] = this.__indexOf__(item));
        }

        return this.__indexOf__(item);
    };

    //循环执行
    this.forEach = Array.prototype.forEach;


    //添加子项
    this.append = function (item) {

        var fn = this.__fn_validate__;

        if (!fn || (item = fn.call(this, this.length, item)) !== undefined)
        {
            this.__push__(item);
            return true;
        }
    };

    //添加多个子项
    this.appendRange = function (items) {

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
            var fn,
                length = this.length,
                cache = this[index];

            if (length > index && (cache = this[index]))
            {
                if ((fn = this.__fn_remove__) && fn.call(this, index, cache) === false)
                {
                    return;
                }

                if (cache = cache.__uniqueId__ && this.__index_cache__)
                {
                    delete this.__index_cache__[cache];
                }
            }

            if (!(fn = this.__fn_validate__) || (item = fn.call(this, index, item)) !== undefined)
            {
                this[index] = item;

                if (length <= index)
                {
                    this.length = index + 1;
                }

                this.__index_cache__ = null; //清空索引缓存
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

            if (item.__uniqueId__ && this.__index_cache__)
            {
                delete this.__index_cache__[item.__uniqueId__];
            }

            return true;
        }
    };

    //移除指定位置的子项
    this.removeAt = function (index) {

        var fn, item;

        if (this.length > index && (!(fn = this.__fn_remove__) || fn.call(this, index, item = this[index]) !== false))
        {
            this.__splice__(index, 1);

            if (item.__uniqueId__ && this.__index_cache__)
            {
                delete this.__index_cache__[item.__uniqueId__];
            }

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
                this.__index_cache__ = null; //清空索引缓存

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