
//var prototype = (flyingon.Item = function () {


//}).prototype;


////
//prototype.y = 0;

//prototype.height = 0;

//prototype.text = null;

//prototype.image = null;

//prototype.selected = false;




//
flyingon.class("ItemCollection", flyingon.Collection, function (Class, flyingon) {


    Class.create = function (OwnerControl) {

        this.__items_x__ = [];
        this.OwnerControl = OwnerControl;
    };



    this.__fn_validate__ = function (index, item) {

        if (!flyingon.__initializing__)
        {
            this.ownerControl.invalidate();
        }

        return item;
    };

    this.__fn_remove__ = function (index) {

        var items = this.__items_x__;
        if (items.length > index)
        {
            items.splice(index, 1);
        }

        if (!flyingon.__initializing__)
        {
            this.ownerControl.invalidate();
        }
    };

    this.__fn_clear__ = function (items) {

        this.__items_x__.length = 0;

        if (!flyingon.__initializing__)
        {
            this.ownerControl.invalidate();
        }
    };

}, true);


