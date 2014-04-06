﻿
//var prototype = (flyingon.Item = function () {


//}).prototype;


////
//prototype.y = 0;

//prototype.height = 0;

//prototype.text = null;

//prototype.image = null;

//prototype.selected = false;




//
flyingon.defineClass("ItemCollection", flyingon.Collection, function (Class, base, flyingon) {


    Class.create = function (OwnerControl) {

        this.__visible_list__ = [];
        this.OwnerControl = OwnerControl;
    };



    this.__fn_validate__ = function (index, item) {

        if (!flyingon.__initializing__)
        {
            this.ownerControl.invalidate(false);
        }

        return item;
    };

    this.__fn_remove__ = function (index, item) {

        var items = this.__visible_list__;
        if (items.length > index)
        {
            items.splice(index, 1);
        }

        if (!flyingon.__initializing__)
        {
            this.ownerControl.invalidate(false);
        }
    };

    this.__fn_clear__ = function () {

        this.__visible_list__.length = 0;

        if (!flyingon.__initializing__)
        {
            this.ownerControl.invalidate(false);
        }
    };

}, true);


