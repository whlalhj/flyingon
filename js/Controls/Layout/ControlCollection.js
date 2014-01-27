/*

*/
flyingon.class("ControlCollection", flyingon.Collection, function (Class, flyingon) {


    Class.create = function (ownerControl) {

        this.__ownerControl__ = ownerControl;
    };




    this.__fn_validate__ = function (index, item) {

        if (item instanceof flyingon.Control)
        {
            item.__boxModel__.initialize(this.__ownerControl__.__boxModel__);

            if (flyingon.__initializing__)
            {
                item.__parent__ = this.__ownerControl__;
            }
            else
            {
                item.__fn_parent__(this.__ownerControl__);
            }

            return item;
        }

        throw new Error("item not a Control!");
    };

    this.__fn_remove__ = function (index, item) {

        var box = item.__boxModel__;

        box.parent = box.offsetParent = null;

        box = this.__ownerControl__.__boxModel__;
        box.children.splice(index, 1);

        if (!flyingon.__initializing__)
        {
            item.__fn_parent__(null);
            this.__ownerControl__.invalidate();
        }
    };

    this.__fn_clear__ = function (items) {

        var box = this.__ownerControl__,
            reset = !flyingon.__initializing__;

        box.children.length = 0;

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            box.parent = box.offsetParent = null;

            if (reset)
            {
                item.__fn_parent__(null);
            }
        }

        if (reset)
        {
            this.__ownerControl__.invalidate();
        }
    };


}, true);

