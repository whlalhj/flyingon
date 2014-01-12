//子项集合
flyingon.class("ItemCollection", flyingon.Collection, function (Class, flyingon) {


    this.value = function (index) {

        var item = this["x:items"][index];
        return item && item.value;
    };


 
    this["y:validate"] = function (item, index) {

        if (item instanceof flyingon.Item)
        {
            return true;
        }

        throw new Error("item not a Item!");
    };

    this["y:remove"] = function (index) {

        return true;
    };

    this["y:clear"] = function () {

        return true;
    };


});

