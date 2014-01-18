
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

        this["x:items-x"] = [];
        this.OwnerControl = OwnerControl;
    };



    this["y:validate"] = function (index, item) {

        if (!flyingon['x:initializing'])
        {
            this.ownerControl.invalidate();
        }

        return item;
    };

    this["y:remove"] = function (index) {

        var items = this["x:items-x"];
        if (items.length > index)
        {
            items.splice(index, 1);
        }

        if (!flyingon['x:initializing'])
        {
            this.ownerControl.invalidate();
        }
    };

    this["y:clear"] = function (items) {

        this["x:items-x"].length = 0;

        if (!flyingon['x:initializing'])
        {
            this.ownerControl.invalidate();
        }
    };

}, true);


