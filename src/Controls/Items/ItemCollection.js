

//
flyingon.defineClass("ItemCollection", flyingon.Collection, function (Class, base, flyingon) {



    Class.create = function (target) {

        this.__visible_list = [];
        this.target = target;
    };



    this.__fn_validate = function (index, item) {

        if (!flyingon.__initializing)
        {
            this.target.invalidate(false);
        }

        return item;
    };

    this.__fn_remove = function (index, item) {

        var items = this.__visible_list;
        if (items.length > index)
        {
            items.splice(index, 1);
        }

        if (!flyingon.__initializing)
        {
            this.target.invalidate(false);
        }
    };

    this.__fn_clear = function () {

        this.__visible_list.length = 0;

        if (!flyingon.__initializing)
        {
            this.target.invalidate(false);
        }
    };


}, true);


