/*

*/
flyingon.class("ControlCollection", flyingon.Collection, function (Class, flyingon) {


    Class.create = function (ownerControl) {

        this.ownerControl = ownerControl;
    };




    this["y:validate"] = function (item, index) {

        if (item instanceof flyingon.Control)
        {
            if (flyingon["x:initializing"])
            {
                item["x:parent"] = this.ownerControl;
            }
            else
            {
                item["y:parent"](this.ownerControl);
            }

            return item;
        }

        throw new Error("item not a Control!");
    };

    this["y:remove"] = function (index) {

        this["x:items"][index]["y:parent"](null);
    };

    this["y:clear"] = function (items) {

        for (var i = 0, length = items.length; i < length; i++)
        {
            items[i]["y:parent"](null);
        }
    };


}, true);

