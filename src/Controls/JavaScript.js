function anonymous() {
    return this.__fields.name;
}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.name = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("name", cache);
        }

        return this;
    }


    var oldValue = fields.name;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "name", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.name = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("name", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.backgroundColor;
}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.backgroundColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundColor", cache);
        }

        return this;
    }


    var oldValue = fields.backgroundColor;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "backgroundColor", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.backgroundColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundColor", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.color;
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.color = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("color", cache);
        }

        return this;
    }


    var oldValue = fields.color;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "color", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.color = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("color", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.lineWidth;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.lineWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("lineWidth", cache);
        }

        return this;
    }


    var oldValue = fields.lineWidth;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "lineWidth", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.lineWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("lineWidth", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.width;
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.width = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("width", cache);
        }

        return this;
    }


    var oldValue = fields.width;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "width", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.width = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("width", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.height;
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.height = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("height", cache);
        }

        return this;
    }


    var oldValue = fields.height;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "height", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.height = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("height", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.margin;
}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.margin = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("margin", cache);
        }

        return this;
    }


    var oldValue = fields.margin;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "margin", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.margin = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("margin", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.padding;
}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.padding = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("padding", cache);
        }

        return this;
    }


    var oldValue = fields.padding;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "padding", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.padding = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("padding", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.anticlockwise;
}

function anonymous(value) {
    value = !!value;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.anticlockwise = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("anticlockwise", cache);
        }

        return this;
    }


    var oldValue = fields.anticlockwise;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "anticlockwise", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.anticlockwise = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("anticlockwise", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.children;
}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.children = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("children", cache);
        }

        return this;
    }


    var oldValue = fields.children;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "children", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.children = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("children", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.dashArray;
}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.dashArray = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("dashArray", cache);
        }

        return this;
    }


    var oldValue = fields.dashArray;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "dashArray", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.dashArray = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("dashArray", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.radius;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.radius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("radius", cache);
        }

        return this;
    }


    var oldValue = fields.radius;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "radius", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.radius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("radius", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.sides;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.sides = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("sides", cache);
        }

        return this;
    }


    var oldValue = fields.sides;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "sides", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.sides = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("sides", cache);
        }

    }

    return this;

}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.radius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("radius", cache);
        }

        return this;
    }


    var oldValue = fields.radius;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "radius", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.radius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("radius", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.angle;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.angle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("angle", cache);
        }

        return this;
    }


    var oldValue = fields.angle;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "angle", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.angle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("angle", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.vertexes;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.vertexes = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("vertexes", cache);
        }

        return this;
    }


    var oldValue = fields.vertexes;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "vertexes", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.vertexes = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("vertexes", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.radius1;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.radius1 = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("radius1", cache);
        }

        return this;
    }


    var oldValue = fields.radius1;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "radius1", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.radius1 = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("radius1", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.radius2;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.radius2 = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("radius2", cache);
        }

        return this;
    }


    var oldValue = fields.radius2;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "radius2", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.radius2 = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("radius2", cache);
        }

    }

    return this;

}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.angle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("angle", cache);
        }

        return this;
    }


    var oldValue = fields.angle;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "angle", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.angle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("angle", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.context.fillStyle;
}

function anonymous(value) {
    this.context.fillStyle = value instanceof Function ? value.style(this) : value;
    return this
}

function anonymous() {
    return this.context.strokeStyle;
}

function anonymous(value) {
    this.context.strokeStyle = value instanceof Function ? value.style(this) : value;
    return this
}

function anonymous() {
    return this.context.shadowColor;
}

function anonymous(value) {
    this.context.shadowColor = value;
    return this
}

function anonymous() {
    return this.context.shadowBlur;
}

function anonymous(value) {
    this.context.shadowBlur = value;
    return this
}

function anonymous() {
    return this.context.shadowOffsetX;
}

function anonymous(value) {
    this.context.shadowOffsetX = value;
    return this
}

function anonymous() {
    return this.context.shadowOffsetY;
}

function anonymous(value) {
    this.context.shadowOffsetY = value;
    return this
}

function anonymous() {
    return this.context.lineCap;
}

function anonymous(value) {
    this.context.lineCap = value;
    return this
}

function anonymous() {
    return this.context.lineJoin;
}

function anonymous(value) {
    this.context.lineJoin = value;
    return this
}

function anonymous() {
    return this.context.lineWidth;
}

function anonymous(value) {
    this.context.lineWidth = value;
    return this
}

function anonymous() {
    return this.context.miterLimit;
}

function anonymous(value) {
    this.context.miterLimit = value;
    return this
}

function anonymous() {
    return this.context.font;
}

function anonymous(value) {
    this.context.font = value;
    return this
}

function anonymous() {
    return this.context.textAlign;
}

function anonymous(value) {
    this.context.textAlign = value;
    return this
}

function anonymous() {
    return this.context.textBaseline;
}

function anonymous(value) {
    this.context.textBaseline = value;
    return this
}

function anonymous() {
    return this.context.globalAlpha;
}

function anonymous(value) {
    this.context.globalAlpha = value;
    return this
}

function anonymous() {
    return this.context.globalCompositeOperation;
}

function anonymous(value) {
    this.context.globalCompositeOperation = value;
    return this
}

function anonymous() {
    return this.__fields.id;
}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.id = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("id", cache);
        }

        return this;
    }


    var oldValue = fields.id;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "id", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.id = value;

        this.__fn_reset_style();

        if (cache = this.__bindings)
        {
            this.__fn_bindings("id", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.className;
}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.className = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("className", cache);
        }

        this.__fn_className(value); return this;
    }


    var oldValue = fields.className;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "className", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.className = value;

        this.__fn_className(value);

        if (cache = this.__bindings)
        {
            this.__fn_bindings("className", cache);
        }

    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.width) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.width) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.width = this.__fn_style_value("width")) !== undefined)
    {
        return value;
    }

    return "auto";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.width = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("width", cache);
        }

        return this;
    }


    var oldValue = this.width;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "width", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.width = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("width", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.height) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.height) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.height = this.__fn_style_value("height")) !== undefined)
    {
        return value;
    }

    return "auto";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.height = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("height", cache);
        }

        return this;
    }


    var oldValue = this.height;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "height", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.height = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("height", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.top) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.top) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.top = this.__fn_style_value("top")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.top = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("top", cache);
        }

        return this;
    }


    var oldValue = this.top;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "top", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.top = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("top", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.left) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.left) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.left = this.__fn_style_value("left")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.left = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("left", cache);
        }

        return this;
    }


    var oldValue = this.left;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "left", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.left = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("left", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.offsetX) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.offsetX) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.offsetX = this.__fn_style_value("offsetX")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.offsetX = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("offsetX", cache);
        }

        return this;
    }


    var oldValue = this.offsetX;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "offsetX", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.offsetX = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("offsetX", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.offsetY) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.offsetY) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.offsetY = this.__fn_style_value("offsetY")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.offsetY = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("offsetY", cache);
        }

        return this;
    }


    var oldValue = this.offsetY;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "offsetY", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.offsetY = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("offsetY", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.minWidth) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.minWidth) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.minWidth = this.__fn_style_value("minWidth")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.minWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("minWidth", cache);
        }

        return this;
    }


    var oldValue = this.minWidth;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "minWidth", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.minWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("minWidth", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.minHeight) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.minHeight) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.minHeight = this.__fn_style_value("minHeight")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.minHeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("minHeight", cache);
        }

        return this;
    }


    var oldValue = this.minHeight;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "minHeight", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.minHeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("minHeight", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.maxWidth) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.maxWidth) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.maxWidth = this.__fn_style_value("maxWidth")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.maxWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("maxWidth", cache);
        }

        return this;
    }


    var oldValue = this.maxWidth;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "maxWidth", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.maxWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("maxWidth", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.maxHeight) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.maxHeight) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.maxHeight = this.__fn_style_value("maxHeight")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.maxHeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("maxHeight", cache);
        }

        return this;
    }


    var oldValue = this.maxHeight;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "maxHeight", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.maxHeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("maxHeight", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.zIndex) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.zIndex) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.zIndex = this.__fn_style_value("zIndex")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.zIndex = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("zIndex", cache);
        }

        return this;
    }


    var oldValue = this.zIndex;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "zIndex", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.zIndex = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("zIndex", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.newline) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.newline) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.newline = this.__fn_style_value("newline")) !== undefined)
    {
        return value;
    }

    return false;
}

function anonymous(value) {
    value = !!value;
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.newline = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("newline", cache);
        }

        return this;
    }


    var oldValue = this.newline;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "newline", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.newline = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("newline", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.dock) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.dock) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.dock = this.__fn_style_value("dock")) !== undefined)
    {
        return value;
    }

    return "left";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.dock = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("dock", cache);
        }

        return this;
    }


    var oldValue = this.dock;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "dock", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.dock = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("dock", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.layoutType) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.layoutType) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.layoutType = this.__fn_style_value("layoutType")) !== undefined)
    {
        return value;
    }

    return "flow";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.layoutType = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutType", cache);
        }

        return this;
    }


    var oldValue = this.layoutType;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "layoutType", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.layoutType = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutType", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.layoutSpaceX) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.layoutSpaceX) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.layoutSpaceX = this.__fn_style_value("layoutSpaceX")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.layoutSpaceX = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutSpaceX", cache);
        }

        return this;
    }


    var oldValue = this.layoutSpaceX;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "layoutSpaceX", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.layoutSpaceX = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutSpaceX", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.layoutSpaceY) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.layoutSpaceY) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.layoutSpaceY = this.__fn_style_value("layoutSpaceY")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.layoutSpaceY = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutSpaceY", cache);
        }

        return this;
    }


    var oldValue = this.layoutSpaceY;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "layoutSpaceY", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.layoutSpaceY = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutSpaceY", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.layoutPage) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.layoutPage) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.layoutPage = this.__fn_style_value("layoutPage")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.layoutPage = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutPage", cache);
        }

        return this;
    }


    var oldValue = this.layoutPage;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "layoutPage", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.layoutPage = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutPage", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.layoutColumns) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.layoutColumns) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.layoutColumns = this.__fn_style_value("layoutColumns")) !== undefined)
    {
        return value;
    }

    return 3;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.layoutColumns = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutColumns", cache);
        }

        return this;
    }


    var oldValue = this.layoutColumns;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "layoutColumns", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.layoutColumns = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutColumns", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.layoutRows) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.layoutRows) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.layoutRows = this.__fn_style_value("layoutRows")) !== undefined)
    {
        return value;
    }

    return 3;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.layoutRows = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutRows", cache);
        }

        return this;
    }


    var oldValue = this.layoutRows;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "layoutRows", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.layoutRows = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutRows", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.layoutGrid) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.layoutGrid) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.layoutGrid = this.__fn_style_value("layoutGrid")) !== undefined)
    {
        return value;
    }

    return "T R* C* C* C* R* C* C* C* R* C* C* C* END";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.layoutGrid = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutGrid", cache);
        }

        return this;
    }


    var oldValue = this.layoutGrid;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "layoutGrid", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.layoutGrid = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("layoutGrid", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.alignWidth) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.alignWidth) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.alignWidth = this.__fn_style_value("alignWidth")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.alignWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("alignWidth", cache);
        }

        return this;
    }


    var oldValue = this.alignWidth;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "alignWidth", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.alignWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("alignWidth", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.alignHeight) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.alignHeight) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.alignHeight = this.__fn_style_value("alignHeight")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.alignHeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("alignHeight", cache);
        }

        return this;
    }


    var oldValue = this.alignHeight;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "alignHeight", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.alignHeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("alignHeight", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    return [this.alignX, this.alignY].join(" ");
}

function anonymous() {
    var value;
    if ((value = this.__style.alignX) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.alignX) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.alignX = this.__fn_style_value("alignX")) !== undefined)
    {
        return value;
    }

    return "left";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.alignX = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("alignX", cache);
        }

        return this;
    }


    var oldValue = this.alignX;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "alignX", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.alignX = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("alignX", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.alignY) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.alignY) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.alignY = this.__fn_style_value("alignY")) !== undefined)
    {
        return value;
    }

    return "top";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.alignY = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("alignY", cache);
        }

        return this;
    }


    var oldValue = this.alignY;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "alignY", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.alignY = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("alignY", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    return [this.overflowX, this.overflowY].join(" ");
}

function anonymous() {
    var value;
    if ((value = this.__style.overflowX) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.overflowX) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.overflowX = this.__fn_style_value("overflowX")) !== undefined)
    {
        return value;
    }

    return "hidden";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.overflowX = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("overflowX", cache);
        }

        return this;
    }


    var oldValue = this.overflowX;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "overflowX", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.overflowX = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("overflowX", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.overflowY) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.overflowY) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.overflowY = this.__fn_style_value("overflowY")) !== undefined)
    {
        return value;
    }

    return "hidden";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.overflowY = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("overflowY", cache);
        }

        return this;
    }


    var oldValue = this.overflowY;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "overflowY", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.overflowY = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("overflowY", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.visibility) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.visibility) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.visibility = this.__fn_style_value("visibility")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.visibility : "visible";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.visibility = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("visibility", cache);
        }

        return this;
    }


    var oldValue = this.visibility;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "visibility", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.visibility = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("visibility", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.opacity) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.opacity) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.opacity = this.__fn_style_value("opacity")) !== undefined)
    {
        return value;
    }

    return 1;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.opacity = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("opacity", cache);
        }

        return this;
    }


    var oldValue = this.opacity;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "opacity", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.opacity = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("opacity", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.cursor) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.cursor) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.cursor = this.__fn_style_value("cursor")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.cursor : "auto";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.cursor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("cursor", cache);
        }

        return this;
    }


    var oldValue = this.cursor;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "cursor", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.cursor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("cursor", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.direction) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.direction) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.direction = this.__fn_style_value("direction")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.direction : "ltr";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.direction = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("direction", cache);
        }

        return this;
    }


    var oldValue = this.direction;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "direction", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.direction = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("direction", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.vertical) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.vertical) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.vertical = this.__fn_style_value("vertical")) !== undefined)
    {
        return value;
    }

    return false;
}

function anonymous(value) {
    value = !!value;
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.vertical = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("vertical", cache);
        }

        return this;
    }


    var oldValue = this.vertical;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "vertical", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.vertical = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("vertical", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    return [this.marginTop, this.marginRight, this.marginBottom, this.marginLeft].join(" ");
}

function anonymous(value) {


    var values = value != null && ("" + value).match(/[\w-_%]+/g);

    if (values)
    {
        if (values.length < 4)
        {
            switch (values.length)
            {
                case 1:
                    values[1] = values[2] = values[3] = values[0];
                    break;

                case 2:
                    values[2] = values[0];
                    values[3] = values[1];
                    break;

                default:
                    values[3] = values[1];
                    break;
            }
        }
    }
    else
    {
        values = [];
    }


    this.marginTop = values[0];
    this.marginRight = values[1];
    this.marginBottom = values[2];
    this.marginLeft = values[3];

}

function anonymous() {
    var value;
    if ((value = this.__style.marginTop) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.marginTop) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.marginTop = this.__fn_style_value("marginTop")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.marginTop = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("marginTop", cache);
        }

        return this;
    }


    var oldValue = this.marginTop;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "marginTop", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.marginTop = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("marginTop", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.marginRight) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.marginRight) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.marginRight = this.__fn_style_value("marginRight")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.marginRight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("marginRight", cache);
        }

        return this;
    }


    var oldValue = this.marginRight;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "marginRight", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.marginRight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("marginRight", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.marginBottom) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.marginBottom) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.marginBottom = this.__fn_style_value("marginBottom")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.marginBottom = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("marginBottom", cache);
        }

        return this;
    }


    var oldValue = this.marginBottom;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "marginBottom", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.marginBottom = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("marginBottom", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.marginLeft) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.marginLeft) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.marginLeft = this.__fn_style_value("marginLeft")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.marginLeft = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("marginLeft", cache);
        }

        return this;
    }


    var oldValue = this.marginLeft;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "marginLeft", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.marginLeft = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("marginLeft", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    return [this.borderTopWidth, this.borderTopStyle, this.borderTopColor].join(" ");
}

function anonymous() {
    return [this.borderRightWidth, this.borderRightStyle, this.borderRightColor].join(" ");
}

function anonymous() {
    return [this.borderBottomWidth, this.borderBottomStyle, this.borderBottomColor].join(" ");
}

function anonymous() {
    return [this.borderLeftWidth, this.borderLeftStyle, this.borderLeftColor].join(" ");
}

function anonymous() {
    return [this.borderTopStyle, this.borderRightStyle, this.borderBottomStyle, this.borderLeftStyle].join(" ");
}

function anonymous(value) {


    var values = value != null && ("" + value).match(/[\w-_%]+/g);

    if (values)
    {
        if (values.length < 4)
        {
            switch (values.length)
            {
                case 1:
                    values[1] = values[2] = values[3] = values[0];
                    break;

                case 2:
                    values[2] = values[0];
                    values[3] = values[1];
                    break;

                default:
                    values[3] = values[1];
                    break;
            }
        }
    }
    else
    {
        values = [];
    }


    this.borderTopStyle = values[0];
    this.borderRightStyle = values[1];
    this.borderBottomStyle = values[2];
    this.borderLeftStyle = values[3];

}

function anonymous() {
    var value;
    if ((value = this.__style.borderTopStyle) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderTopStyle) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderTopStyle = this.__fn_style_value("borderTopStyle")) !== undefined)
    {
        return value;
    }

    return "none";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderTopStyle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderTopStyle", cache);
        }

        return this;
    }


    var oldValue = this.borderTopStyle;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderTopStyle", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderTopStyle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderTopStyle", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderRightStyle) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderRightStyle) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderRightStyle = this.__fn_style_value("borderRightStyle")) !== undefined)
    {
        return value;
    }

    return "none";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderRightStyle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderRightStyle", cache);
        }

        return this;
    }


    var oldValue = this.borderRightStyle;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderRightStyle", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderRightStyle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderRightStyle", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderBottomStyle) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderBottomStyle) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderBottomStyle = this.__fn_style_value("borderBottomStyle")) !== undefined)
    {
        return value;
    }

    return "none";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderBottomStyle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderBottomStyle", cache);
        }

        return this;
    }


    var oldValue = this.borderBottomStyle;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderBottomStyle", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderBottomStyle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderBottomStyle", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderLeftStyle) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderLeftStyle) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderLeftStyle = this.__fn_style_value("borderLeftStyle")) !== undefined)
    {
        return value;
    }

    return "none";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderLeftStyle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderLeftStyle", cache);
        }

        return this;
    }


    var oldValue = this.borderLeftStyle;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderLeftStyle", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderLeftStyle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderLeftStyle", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    return [this.borderTopWidth, this.borderRightWidth, this.borderBottomWidth, this.borderLeftWidth].join(" ");
}

function anonymous(value) {


    var values = value != null && ("" + value).match(/[\w-_%]+/g);

    if (values)
    {
        if (values.length < 4)
        {
            switch (values.length)
            {
                case 1:
                    values[1] = values[2] = values[3] = values[0];
                    break;

                case 2:
                    values[2] = values[0];
                    values[3] = values[1];
                    break;

                default:
                    values[3] = values[1];
                    break;
            }
        }
    }
    else
    {
        values = [];
    }


    this.borderTopWidth = values[0];
    this.borderRightWidth = values[1];
    this.borderBottomWidth = values[2];
    this.borderLeftWidth = values[3];

}

function anonymous() {
    var value;
    if ((value = this.__style.borderTopWidth) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderTopWidth) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderTopWidth = this.__fn_style_value("borderTopWidth")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderTopWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderTopWidth", cache);
        }

        return this;
    }


    var oldValue = this.borderTopWidth;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderTopWidth", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderTopWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderTopWidth", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderRightWidth) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderRightWidth) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderRightWidth = this.__fn_style_value("borderRightWidth")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderRightWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderRightWidth", cache);
        }

        return this;
    }


    var oldValue = this.borderRightWidth;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderRightWidth", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderRightWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderRightWidth", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderBottomWidth) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderBottomWidth) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderBottomWidth = this.__fn_style_value("borderBottomWidth")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderBottomWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderBottomWidth", cache);
        }

        return this;
    }


    var oldValue = this.borderBottomWidth;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderBottomWidth", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderBottomWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderBottomWidth", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderLeftWidth) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderLeftWidth) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderLeftWidth = this.__fn_style_value("borderLeftWidth")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderLeftWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderLeftWidth", cache);
        }

        return this;
    }


    var oldValue = this.borderLeftWidth;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderLeftWidth", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderLeftWidth = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderLeftWidth", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    return [this.borderTopColor, this.borderRightColor, this.borderBottomColor, this.borderLeftColor].join(" ");
}

function anonymous(value) {


    var values = value != null && ("" + value).match(/[\w-_%]+/g);

    if (values)
    {
        if (values.length < 4)
        {
            switch (values.length)
            {
                case 1:
                    values[1] = values[2] = values[3] = values[0];
                    break;

                case 2:
                    values[2] = values[0];
                    values[3] = values[1];
                    break;

                default:
                    values[3] = values[1];
                    break;
            }
        }
    }
    else
    {
        values = [];
    }


    this.borderTopColor = values[0];
    this.borderRightColor = values[1];
    this.borderBottomColor = values[2];
    this.borderLeftColor = values[3];

}

function anonymous() {
    var value;
    if ((value = this.__style.borderTopColor) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderTopColor) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderTopColor = this.__fn_style_value("borderTopColor")) !== undefined)
    {
        return value;
    }

    return "transparent";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderTopColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderTopColor", cache);
        }

        return this;
    }


    var oldValue = this.borderTopColor;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderTopColor", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderTopColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderTopColor", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderRightColor) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderRightColor) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderRightColor = this.__fn_style_value("borderRightColor")) !== undefined)
    {
        return value;
    }

    return "transparent";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderRightColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderRightColor", cache);
        }

        return this;
    }


    var oldValue = this.borderRightColor;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderRightColor", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderRightColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderRightColor", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderBottomColor) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderBottomColor) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderBottomColor = this.__fn_style_value("borderBottomColor")) !== undefined)
    {
        return value;
    }

    return "transparent";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderBottomColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderBottomColor", cache);
        }

        return this;
    }


    var oldValue = this.borderBottomColor;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderBottomColor", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderBottomColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderBottomColor", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderLeftColor) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderLeftColor) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderLeftColor = this.__fn_style_value("borderLeftColor")) !== undefined)
    {
        return value;
    }

    return "transparent";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderLeftColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderLeftColor", cache);
        }

        return this;
    }


    var oldValue = this.borderLeftColor;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderLeftColor", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderLeftColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderLeftColor", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    return [this.borderTopLeftRadius, this.borderTopRightRadius, this.borderBottomLeftRadius, this.borderBottomRightRadius].join(" ");
}

function anonymous(value) {


    var values = value != null && ("" + value).match(/[\w-_%]+/g);

    if (values)
    {
        if (values.length < 4)
        {
            switch (values.length)
            {
                case 1:
                    values[1] = values[2] = values[3] = values[0];
                    break;

                case 2:
                    values[2] = values[0];
                    values[3] = values[1];
                    break;

                default:
                    values[3] = values[1];
                    break;
            }
        }
    }
    else
    {
        values = [];
    }


    this.borderTopLeftRadius = values[0];
    this.borderTopRightRadius = values[1];
    this.borderBottomLeftRadius = values[2];
    this.borderBottomRightRadius = values[3];

}

function anonymous() {
    var value;
    if ((value = this.__style.borderTopLeftRadius) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderTopLeftRadius) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderTopLeftRadius = this.__fn_style_value("borderTopLeftRadius")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderTopLeftRadius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderTopLeftRadius", cache);
        }

        return this;
    }


    var oldValue = this.borderTopLeftRadius;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderTopLeftRadius", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderTopLeftRadius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderTopLeftRadius", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderTopRightRadius) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderTopRightRadius) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderTopRightRadius = this.__fn_style_value("borderTopRightRadius")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderTopRightRadius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderTopRightRadius", cache);
        }

        return this;
    }


    var oldValue = this.borderTopRightRadius;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderTopRightRadius", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderTopRightRadius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderTopRightRadius", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderBottomLeftRadius) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderBottomLeftRadius) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderBottomLeftRadius = this.__fn_style_value("borderBottomLeftRadius")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderBottomLeftRadius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderBottomLeftRadius", cache);
        }

        return this;
    }


    var oldValue = this.borderBottomLeftRadius;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderBottomLeftRadius", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderBottomLeftRadius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderBottomLeftRadius", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.borderBottomRightRadius) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.borderBottomRightRadius) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.borderBottomRightRadius = this.__fn_style_value("borderBottomRightRadius")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.borderBottomRightRadius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderBottomRightRadius", cache);
        }

        return this;
    }


    var oldValue = this.borderBottomRightRadius;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "borderBottomRightRadius", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.borderBottomRightRadius = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("borderBottomRightRadius", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    return [this.paddingTop, this.paddingRight, this.paddingBottom, this.paddingLeft].join(" ");
}

function anonymous(value) {


    var values = value != null && ("" + value).match(/[\w-_%]+/g);

    if (values)
    {
        if (values.length < 4)
        {
            switch (values.length)
            {
                case 1:
                    values[1] = values[2] = values[3] = values[0];
                    break;

                case 2:
                    values[2] = values[0];
                    values[3] = values[1];
                    break;

                default:
                    values[3] = values[1];
                    break;
            }
        }
    }
    else
    {
        values = [];
    }


    this.paddingTop = values[0];
    this.paddingRight = values[1];
    this.paddingBottom = values[2];
    this.paddingLeft = values[3];

}

function anonymous() {
    var value;
    if ((value = this.__style.paddingTop) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.paddingTop) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.paddingTop = this.__fn_style_value("paddingTop")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.paddingTop = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("paddingTop", cache);
        }

        return this;
    }


    var oldValue = this.paddingTop;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "paddingTop", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.paddingTop = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("paddingTop", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.paddingRight) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.paddingRight) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.paddingRight = this.__fn_style_value("paddingRight")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.paddingRight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("paddingRight", cache);
        }

        return this;
    }


    var oldValue = this.paddingRight;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "paddingRight", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.paddingRight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("paddingRight", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.paddingBottom) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.paddingBottom) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.paddingBottom = this.__fn_style_value("paddingBottom")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.paddingBottom = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("paddingBottom", cache);
        }

        return this;
    }


    var oldValue = this.paddingBottom;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "paddingBottom", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.paddingBottom = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("paddingBottom", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.paddingLeft) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.paddingLeft) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.paddingLeft = this.__fn_style_value("paddingLeft")) !== undefined)
    {
        return value;
    }

    return 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.paddingLeft = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("paddingLeft", cache);
        }

        return this;
    }


    var oldValue = this.paddingLeft;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "paddingLeft", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.paddingLeft = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("paddingLeft", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    return [this.backgroundColor, this.backgroundImage, this.backgroundRepeat, this.backgroundAttachment, this.backgroundPosition].join(" ");
}

function anonymous() {
    var value;
    if ((value = this.__style.backgroundColor) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.backgroundColor) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.backgroundColor = this.__fn_style_value("backgroundColor")) !== undefined)
    {
        return value;
    }

    return "transparent";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.backgroundColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundColor", cache);
        }

        return this;
    }


    var oldValue = this.backgroundColor;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "backgroundColor", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.backgroundColor = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundColor", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.backgroundImage) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.backgroundImage) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.backgroundImage = this.__fn_style_value("backgroundImage")) !== undefined)
    {
        return value;
    }

    return "none";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.backgroundImage = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundImage", cache);
        }

        return this;
    }


    var oldValue = this.backgroundImage;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "backgroundImage", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.backgroundImage = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundImage", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.backgroundRepeat) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.backgroundRepeat) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.backgroundRepeat = this.__fn_style_value("backgroundRepeat")) !== undefined)
    {
        return value;
    }

    return "repeat";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.backgroundRepeat = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundRepeat", cache);
        }

        return this;
    }


    var oldValue = this.backgroundRepeat;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "backgroundRepeat", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.backgroundRepeat = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundRepeat", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.backgroundAttachment) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.backgroundAttachment) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.backgroundAttachment = this.__fn_style_value("backgroundAttachment")) !== undefined)
    {
        return value;
    }

    return "scroll";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.backgroundAttachment = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundAttachment", cache);
        }

        return this;
    }


    var oldValue = this.backgroundAttachment;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "backgroundAttachment", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.backgroundAttachment = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundAttachment", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.backgroundPosition) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.backgroundPosition) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.backgroundPosition = this.__fn_style_value("backgroundPosition")) !== undefined)
    {
        return value;
    }

    return "0% 0%";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.backgroundPosition = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundPosition", cache);
        }

        return this;
    }


    var oldValue = this.backgroundPosition;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "backgroundPosition", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.backgroundPosition = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundPosition", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.backgroundOrigin) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.backgroundOrigin) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.backgroundOrigin = this.__fn_style_value("backgroundOrigin")) !== undefined)
    {
        return value;
    }

    return "padding-box";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.backgroundOrigin = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundOrigin", cache);
        }

        return this;
    }


    var oldValue = this.backgroundOrigin;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "backgroundOrigin", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.backgroundOrigin = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundOrigin", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.backgroundSize) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.backgroundSize) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.backgroundSize = this.__fn_style_value("backgroundSize")) !== undefined)
    {
        return value;
    }

    return "auto";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.backgroundSize = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundSize", cache);
        }

        return this;
    }


    var oldValue = this.backgroundSize;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "backgroundSize", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.backgroundSize = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("backgroundSize", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.color) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.color) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.color = this.__fn_style_value("color")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.color : "black";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.color = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("color", cache);
        }

        return this;
    }


    var oldValue = this.color;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "color", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.color = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("color", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.fontStyle) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.fontStyle) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.fontStyle = this.__fn_style_value("fontStyle")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.fontStyle : "normal";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.fontStyle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fontStyle", cache);
        }

        return this;
    }


    var oldValue = this.fontStyle;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "fontStyle", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.fontStyle = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fontStyle", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.fontVariant) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.fontVariant) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.fontVariant = this.__fn_style_value("fontVariant")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.fontVariant : "normal";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.fontVariant = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fontVariant", cache);
        }

        return this;
    }


    var oldValue = this.fontVariant;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "fontVariant", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.fontVariant = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fontVariant", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.fontWeight) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.fontWeight) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.fontWeight = this.__fn_style_value("fontWeight")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.fontWeight : "normal";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.fontWeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fontWeight", cache);
        }

        return this;
    }


    var oldValue = this.fontWeight;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "fontWeight", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.fontWeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fontWeight", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.fontSize) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.fontSize) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.fontSize = this.__fn_style_value("fontSize")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.fontSize : 12;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.fontSize = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fontSize", cache);
        }

        return this;
    }


    var oldValue = this.fontSize;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "fontSize", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.fontSize = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fontSize", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.fontFamily) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.fontFamily) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.fontFamily = this.__fn_style_value("fontFamily")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.fontFamily : "arial,宋体,sans-serif";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.fontFamily = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fontFamily", cache);
        }

        return this;
    }


    var oldValue = this.fontFamily;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "fontFamily", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.fontFamily = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fontFamily", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.lineHeight) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.lineHeight) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.lineHeight = this.__fn_style_value("lineHeight")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.lineHeight : 12;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.lineHeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("lineHeight", cache);
        }

        return this;
    }


    var oldValue = this.lineHeight;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "lineHeight", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.lineHeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("lineHeight", cache);
        }

        (this.__parent || this).invalidate(true);
    }

    return this;

}

function anonymous() {
    return [this.textAlignX, this.textAlignY].join(" ");
}

function anonymous() {
    var value;
    if ((value = this.__style.textAlignX) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.textAlignX) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.textAlignX = this.__fn_style_value("textAlignX")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.textAlignX : "left";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.textAlignX = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("textAlignX", cache);
        }

        return this;
    }


    var oldValue = this.textAlignX;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "textAlignX", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.textAlignX = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("textAlignX", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.textAlignY) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.textAlignY) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.textAlignY = this.__fn_style_value("textAlignY")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.textAlignY : "top";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.textAlignY = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("textAlignY", cache);
        }

        return this;
    }


    var oldValue = this.textAlignY;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "textAlignY", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.textAlignY = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("textAlignY", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.letterSpacing) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.letterSpacing) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.letterSpacing = this.__fn_style_value("letterSpacing")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.letterSpacing : 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.letterSpacing = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("letterSpacing", cache);
        }

        return this;
    }


    var oldValue = this.letterSpacing;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "letterSpacing", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.letterSpacing = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("letterSpacing", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.wordSpacing) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.wordSpacing) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.wordSpacing = this.__fn_style_value("wordSpacing")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.wordSpacing : 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.wordSpacing = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("wordSpacing", cache);
        }

        return this;
    }


    var oldValue = this.wordSpacing;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "wordSpacing", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.wordSpacing = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("wordSpacing", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.textIndent) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.textIndent) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.textIndent = this.__fn_style_value("textIndent")) !== undefined)
    {
        return value;
    }

    return this.__parent ? this.__parent.textIndent : 0;
}

function anonymous(value) {
    value = parseInt(value);
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.textIndent = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("textIndent", cache);
        }

        return this;
    }


    var oldValue = this.textIndent;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "textIndent", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.textIndent = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("textIndent", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.textDecoration) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.textDecoration) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.textDecoration = this.__fn_style_value("textDecoration")) !== undefined)
    {
        return value;
    }

    return "none";
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.textDecoration = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("textDecoration", cache);
        }

        return this;
    }


    var oldValue = this.textDecoration;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "textDecoration", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.textDecoration = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("textDecoration", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    var value;
    if ((value = this.__style.textWrap) !== undefined)
    {
        return value;
    }

    if (this.__style_version === flyingon.__style_version)
    {
        if ((value = this.__styleSheets.textWrap) !== undefined)
        {
            return value;
        }
    }
    else
    {
        this.__style_types = null;
    }

    if ((value = this.__styleSheets.textWrap = this.__fn_style_value("textWrap")) !== undefined)
    {
        return value;
    }

    return false;
}

function anonymous(value) {
    value = !!value;
    var fields = this.__style, cache;

    if (flyingon.__initializing)
    {
        fields.textWrap = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("textWrap", cache);
        }

        return this;
    }


    var oldValue = this.textWrap;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "textWrap", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.textWrap = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("textWrap", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    return this.__fields.draggable;
}

function anonymous(value) {
    value = !!value;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.draggable = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("draggable", cache);
        }

        return this;
    }


    var oldValue = fields.draggable;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "draggable", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.draggable = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("draggable", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.droppable;
}

function anonymous(value) {
    value = !!value;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.droppable = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("droppable", cache);
        }

        return this;
    }


    var oldValue = fields.droppable;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "droppable", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.droppable = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("droppable", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.accesskey;
}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.accesskey = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("accesskey", cache);
        }

        return this;
    }


    var oldValue = fields.accesskey;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "accesskey", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.accesskey = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("accesskey", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.enabled;
}

function anonymous(value) {
    value = !!value;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.enabled = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("enabled", cache);
        }

        return this;
    }


    var oldValue = fields.enabled;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "enabled", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.enabled = value;

        this.stateTo('disabled', !value);

        if (cache = this.__bindings)
        {
            this.__fn_bindings("enabled", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.focusable;
}

function anonymous(value) {
    value = !!value;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.focusable = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("focusable", cache);
        }

        return this;
    }


    var oldValue = fields.focusable;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "focusable", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.focusable = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("focusable", cache);
        }

    }

    return this;

}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.template = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("template", cache);
        }

        return this;
    }


    var oldValue = fields.template;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "template", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.template = value;

        this.clearTemplate();

        if (cache = this.__bindings)
        {
            this.__fn_bindings("template", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {



    //变量管理器
    this.__fields = Object.create(this.__defaults);



    //唯一id
    this.__uniqueId = ++flyingon.__uniqueId;

    //自定义样式数据
    this.__style = Object.create(null);

    //样式表缓存数据
    this.__styleSheets = Object.create(null);

}

function anonymous() {
    return this.__fields.value;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.value = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("value", cache);
        }

        return this;
    }


    var oldValue = fields.value;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "value", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.value = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("value", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    return this.__fields.length;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.length = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("length", cache);
        }

        return this;
    }


    var oldValue = fields.length;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "length", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.length = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("length", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    return this.__fields.viewportSize;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.viewportSize = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("viewportSize", cache);
        }

        return this;
    }


    var oldValue = fields.viewportSize;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "viewportSize", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.viewportSize = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("viewportSize", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    return this.__fields.max_change;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.max_change = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("max_change", cache);
        }

        return this;
    }


    var oldValue = fields.max_change;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "max_change", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.max_change = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("max_change", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.min_change;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.min_change = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("min_change", cache);
        }

        return this;
    }


    var oldValue = fields.min_change;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "min_change", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.min_change = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("min_change", cache);
        }

    }

    return this;

}

function anonymous() {




    //变量管理器
    this.__fields = Object.create(this.__defaults);



    //唯一id
    this.__uniqueId = ++flyingon.__uniqueId;

    //自定义样式数据
    this.__style = Object.create(null);

    //样式表缓存数据
    this.__styleSheets = Object.create(null);



    this.dom = $(this.render.apply(this, arguments));

}

function anonymous() {




    //变量管理器
    this.__fields = Object.create(this.__defaults);



    //唯一id
    this.__uniqueId = ++flyingon.__uniqueId;

    //自定义样式数据
    this.__style = Object.create(null);

    //样式表缓存数据
    this.__styleSheets = Object.create(null);



    var fields = this.__fields;
    fields.cursor = "col-resize";
    fields.dock = "left";
    fields.draggable = true;

}

function anonymous() {
    return this.__fields.maxIndex;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.maxIndex = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("maxIndex", cache);
        }

        return this;
    }


    var oldValue = fields.maxIndex;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "maxIndex", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.maxIndex = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("maxIndex", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    return this.__fields.lineHeight;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.lineHeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("lineHeight", cache);
        }

        return this;
    }


    var oldValue = fields.lineHeight;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "lineHeight", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.lineHeight = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("lineHeight", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    return this.__fields.visibleIndex;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.visibleIndex = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("visibleIndex", cache);
        }

        return this;
    }


    var oldValue = fields.visibleIndex;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "visibleIndex", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.visibleIndex = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("visibleIndex", cache);
        }

        this.invalidate(false);
    }

    return this;

}

function anonymous() {
    return this.__fields.opacity;
}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.opacity = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("opacity", cache);
        }

        this.dom_layer.style.opacity = value; return this;
    }


    var oldValue = fields.opacity;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "opacity", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.opacity = value;

        this.dom_layer.style.opacity = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("opacity", cache);
        }

    }

    return this;

}

function anonymous(host) {




    //变量管理器
    this.__fields = Object.create(this.__defaults);



    //唯一id
    this.__uniqueId = ++flyingon.__uniqueId;

    //自定义样式数据
    this.__style = Object.create(null);

    //样式表缓存数据
    this.__styleSheets = Object.create(null);



    //执行图层扩展
    flyingon.layer_extender.call(this, host);

}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.opacity = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("opacity", cache);
        }

        this.dom_layer.style.opacity = value; return this;
    }


    var oldValue = fields.opacity;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "opacity", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.opacity = value;

        this.dom_layer.style.opacity = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("opacity", cache);
        }

    }

    return this;

}

function anonymous(host) {




    //变量管理器
    this.__fields = Object.create(this.__defaults);



    //唯一id
    this.__uniqueId = ++flyingon.__uniqueId;

    //自定义样式数据
    this.__style = Object.create(null);

    //样式表缓存数据
    this.__styleSheets = Object.create(null);



    this.__fn_create();

    var div = this.dom_host = document.createElement("div");

    div.setAttribute("flyingon", "window-host");
    div.setAttribute("style", "position:relative;width:100%;height:100%;overflow:hidden;");
    div.appendChild(this.dom_window);

    host && host.appendChild(div);

    //设为活动窗口
    this.setActive();

    //绑定resize事件
    var self = this;
    window.addEventListener("resize", function (event) {

        self.update();

    }, true);

}

function anonymous() {
    return this.__fields.image;
}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.image = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("image", cache);
        }

        return this;
    }


    var oldValue = fields.image;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "image", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.image = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("image", cache);
        }

    }

    return this;

}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.opacity = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("opacity", cache);
        }

        this.dom_layer.style.opacity = value; return this;
    }


    var oldValue = fields.opacity;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "opacity", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.opacity = value;

        this.dom_layer.style.opacity = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("opacity", cache);
        }

    }

    return this;

}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.width = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("width", cache);
        }

        return this;
    }


    var oldValue = fields.width;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "width", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.width = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("width", cache);
        }

    }

    return this;

}

function anonymous(value) {
    value = +value || 0;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.height = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("height", cache);
        }

        return this;
    }


    var oldValue = fields.height;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "height", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.height = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("height", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.fill;
}

function anonymous(value) {
    value = !!value;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.fill = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fill", cache);
        }

        return this;
    }


    var oldValue = fields.fill;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "fill", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.fill = value;

        this.update();

        if (cache = this.__bindings)
        {
            this.__fn_bindings("fill", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.start;
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.start = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("start", cache);
        }

        return this;
    }


    var oldValue = fields.start;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "start", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.start = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("start", cache);
        }

    }

    return this;

}

function anonymous() {




    //变量管理器
    this.__fields = Object.create(this.__defaults);



    //唯一id
    this.__uniqueId = ++flyingon.__uniqueId;

    //自定义样式数据
    this.__style = Object.create(null);

    //样式表缓存数据
    this.__styleSheets = Object.create(null);



    this.__fn_create();
    this.toolbar = new flyingon.ChildWindow_ToolBar(this);

}

function anonymous() {
    return this.__fields.items;
}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.items = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("items", cache);
        }

        return this;
    }


    var oldValue = fields.items;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "items", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.items = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("items", cache);
        }

    }

    return this;

}

function anonymous() {
    return this.__fields.showButton;
}

function anonymous(value) {
    value = !!value;
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.showButton = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("showButton", cache);
        }

        return this;
    }


    var oldValue = fields.showButton;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "showButton", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.showButton = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("showButton", cache);
        }

        this.invalidate(true);
    }

    return this;

}

function anonymous() {
    return this.__fields.stretch;
}

function anonymous(value) {
    value = value ? "" + value : "";
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.stretch = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("stretch", cache);
        }

        return this;
    }


    var oldValue = fields.stretch;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "stretch", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.stretch = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("stretch", cache);
        }

    }

    return this;

}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.image = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("image", cache);
        }

        return this;
    }


    var oldValue = fields.image;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "image", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.image = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("image", cache);
        }

    }

    return this;

}

function anonymous(value) {
    var fields = this.__fields, cache;

    if (flyingon.__initializing)
    {
        fields.items = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("items", cache);
        }

        return this;
    }


    var oldValue = fields.items;

    if (oldValue !== value)
    {

        if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)
        {
            var event = new flyingon.PropertyChangeEvent(this, "items", value, oldValue);
            if (this.dispatchEvent(event) === false)
            {
                return this;
            }

            value = event.value;
        }

        fields.items = value;

        if (cache = this.__bindings)
        {
            this.__fn_bindings("items", cache);
        }

    }

    return this;

}
