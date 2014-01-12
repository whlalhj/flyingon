
flyingon.class("ListBoxItem", flyingon.SerializableObject, function (Class, flyingon) {


    this.defineProperty("text", null);

    this.defineProperty("value", null);

    this.defineProperty("image", null);

    this.defineProperty("selected", false);

});



//
flyingon.class("ListBoxItemCollection", flyingon.Collection, function (Class, flyingon) {


    Class.create = function (OwnerControl) {

        this.OwnerControl = OwnerControl;
    };



    this["y:validate"] = function (item) {

        if (!(item instanceof flyingon.ListBoxItem))
        {
            var result = new flyingon.ListBoxItem();

            result.value = item;
            result.text = item ? "" + item : "";
            item = result;
        }

        !flyingon['x:initializing'] && this.ownerControl.invalidate();

        return item;
    };

    this["y:remove"] = function (index) {

        !flyingon['x:initializing'] && this.ownerControl.invalidate();
    };

    this["y:clear"] = function (items) {

        !flyingon['x:initializing'] && this.ownerControl.invalidate();
    };

}, true);




//多子项面板
flyingon.class("ListBox", flyingon.TemplateControl, function (Class, flyingon) {




    items_control.call(this, "items", flyingon.ListBoxItemCollection, flyingon);


});

