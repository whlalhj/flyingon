/*

*/
flyingon.class("ControlCollection", flyingon.Collection, function (Class, flyingon) {


    Class.create = function (ownerControl) {

        this.ownerControl = ownerControl;
    };




    this.__fn_validate__ = function (index, item) {

        if (item instanceof flyingon.Control)
        {
            if (flyingon.__initializing__)
            {
                item.__parent__ = this.ownerControl;
            }
            else
            {
                item.__fn_parent__(this.ownerControl);
            }

            return item;
        }

        throw new Error("item not a Control!");
    };

    this.__fn_remove__ = function (index) {

        this.__items__[index].__fn_parent__(null);
    };

    this.__fn_clear__ = function (items) {

        for (var i = 0, length = items.length; i < length; i++)
        {
            items[i].__fn_parent__(null);
        }
    };


}, true);

