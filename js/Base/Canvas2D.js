/*

Canvas2D绘图扩展


参考:http://www.w3school.com.cn/html5/html5_ref_canvas.asp

*/

(function (flyingon) {




    /*
    转成RGB颜色

    */
    flyingon.toRGBString = function (r, g, b, alpha) {

        if (arguments.length <= 2)
        {
            alpha = g;
            b = r & 0xFF;
            g = r >> 8 & 0xFF;
            r = r >> 16 & 0xFF;
        }

        if (alpha == null)
        {
            return "rgb(" + r + "," + g + "," + b + ")";
        }

        return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
    };

    /*
    转成HSL颜色

    */
    flyingon.toHSLString = function (hue, saturation, lightness, alpha) {

        if (alpha == null)
        {
            return "hsl(" + (hue % 360) + "," + saturation + "%," + lightness + "%)";
        }

        return "hsla(" + (hue % 360) + "," + saturation + "%," + lightness + "%," + alpha + ")";
    };




    /*
    线性渐变

    */
    var LinearGradient = flyingon.LinearGradient = function (x1, y1, x2, y2, colorStops) {

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.colorStops = colorStops;
    };

    LinearGradient.prototype.createBrush = function (context) {

        var r = context.boxModel.clientRect,

            x = r.windowX,
            y = r.windowY,
            width = r.width,
            height = r.height,

            g = context.createLinearGradient(x + this.x1 * width, y + this.y1 * height, x + this.x2 * width, y + this.y2 * height),

            colorStops = this.colorStops;


        for (var i = 0; i < colorStops.length; i++)
        {
            g.addColorStop(colorStops[i][0], colorStops[i][1]);
        }

        return g;
    };



    /*
    径向渐变

    */
    var RadialGradient = flyingon.RadialGradient = function (x1, y1, radius1, x2, y2, radius2, colorStops) {

        this.x1 = x1;
        this.y1 = y1;
        this.radius1 = radius1;
        this.x2 = x2;
        this.y2 = y2;
        this.radius2 = radius2;
        this.colorStops = colorStops;
    };

    RadialGradient.prototype.createBrush = function (context) {

        var r = context.boxModel.clientRect,

            x = r.windowX,
            y = r.windowY,
            width = r.width,
            height = r.height,

            g = context.createRadialGradient(x + this.x1 * width, y + this.y1 * height, this.radius1, x + this.x2 * width, y + this.y2 * height, this.radius2),

            colorStops = this.colorStops;


        for (var i = 0; i < colorStops.length; i++)
        {
            g.addColorStop(colorStops[i][0], colorStops[i][1]);
        }

        return g;
    };


    /*
    图像填充模式

    */
    var ImagePattern = flyingon.ImagePattern = function (image, repetition) {

        this.image = image;
        this.repetition = repetition;
    };

    ImagePattern.prototype.createBrush = function (context) {

        return context.createPattern(this.image, this.repetition);
    };




    var radian = Math.PI / 180, //角度转弧度系数

        prototype = CanvasRenderingContext2D.prototype;



    /****************************以下为属性方法扩展********************************/


    /*    
    set_fillStyle(color) = "#000000"	设置填充色
    set_strokeStyle(color) = "#000000"	设置边框色
    */
    ["fillStyle", "strokeStyle"].forEach(function (name) {

        this["set_" + name] = function (value) {

            var color = value && (flyingon.colors[value] || value);

            this[name] = color && color.createBrush ? color.createBrush(this) : color;
            return this;
        };

    }, prototype);



    /*    
    set_shadowColor(color) = "#000000"	设置或返回用于阴影的颜色 
    */
    prototype.set_shadowColor = function (color) {

        this.shadowColor = color;
        return this;
    };

    /* 
    set_shadowBlur(number) = 0	    设置或返回用于阴影的模糊级别 
    */
    prototype.set_shadowBlur = function (value) {

        this.shadowBlur = value;
        return this;
    };

    /* 
    set_shadowOffsetX(number) = 0	设置或返回阴影距形状的水平距离 
    */
    prototype.set_shadowOffsetX = function (value) {

        this.shadowOffsetX = value;
        return this;
    };

    /* 
    set_shadowOffsetY(number) = 0	设置或返回阴影距形状的垂直距离 
    */
    prototype.set_shadowOffsetY = function (value) {

        this.shadowOffsetY = value;
        return this;
    };

    /* 
    set_lineCap("butt|round|square") = "butt"	    设置或返回线条的结束端点样式 
    */
    prototype.set_lineCap = function (value) {

        this.lineCap = value;
        return this;
    };

    /* 
    set_lineJoin("bevel|round|miter") = "miter"	    设置或返回两条线相交时 所创建的拐角类型 
    */
    prototype.set_lineJoin = function (value) {

        this.lineJoin = value;
        return this;
    };

    /* 
    set_lineWidth(number) = 1	    设置或返回当前的线条宽度 
    */
    prototype.set_lineWidth = function (value) {

        this.lineWidth = value;
        return this;
    };

    /* 
    set_miterLimit(number) = 10	    设置或返回最大斜接长度 
    */
    prototype.set_miterLimit = function (value) {

        this.miterLimit = value;
        return this;
    };

    /* 
    set_font("italic small-caps bold 12px arial") = "10px sans-serif"	设置或返回文本内容的当前字体属性 
    */
    prototype.set_font = function (value) {

        var font = flyingon.fonts[value] || value;

        this.font = font && (font.value || font);
        return this;
    };

    /* 
    set_textAlign("center|end|left|right|start") = "start"	设置或返回文本内容的当前对齐方式 
    */
    prototype.set_textAlign = function (value) {

        this.textAlign = value;
        return this;
    };

    /* 
    set_textBaseline("alphabetic|top|hanging|middle|ideographic|bottom") = "alphabetic"	设置或返回在绘制文本时使用的当前文本基线
    */
    prototype.set_textBaseline = function (value) {

        this.textBaseline = value;
        return this;
    };

    /* 
    set_globalAlpha(number)	透明值 必须介于0.0(完全透明)与1.0(不透明)之间
    */
    prototype.set_globalAlpha = function (value) {

        this.globalAlpha = value;
        return this;
    };

    /* 
    set_globalCompositeOperation("source-over|source-atop|source-in|source-out|destination-over|destination-atop|destination-in|destination-out|lighter|copy|source-over") = "source-over"	设置或返回新图像如何绘制到已有的图像上

    source-over	默认 在目标图像上显示源图像 
    source-atop	在目标图像顶部显示源图像 源图像位于目标图像之外的部分是不可见的 
    source-in	在目标图像中显示源图像 只有目标图像内的源图像部分会显示 目标图像是透明的 
    source-out	在目标图像之外显示源图像 只会显示目标图像之外源图像部分 目标图像是透明的 
    destination-over	在源图像上方显示目标图像 
    destination-atop	在源图像顶部显示目标图像 源图像之外的目标图像部分不会被显示 
    destination-in	在源图像中显示目标图像 只有源图像内的目标图像部分会被显示 源图像是透明的 
    destination-out	在源图像外显示目标图像 只有源图像外的目标图像部分会被显示 源图像是透明的 
    lighter	显示源图像 + 目标图像 
    copy	显示源图像 忽略目标图像 
    source-over	使用异或操作对源图像与目标图像进行组合 
    */
    prototype.set_globalCompositeOperation = function (value) {

        this.globalCompositeOperation = value;
        return this;
    };


    /*****************************************************************************/






    /****************************以下为标准方法说明********************************/

    /*
    rect()	        创建矩形
    fillRect()	    绘制“被填充”的矩形
    strokeRect()	绘制矩形(无填充)
    clearRect()	    在给定的矩形内清除指定的像素

    fill()	    填充当前绘图(路径)
    stroke()	绘制已定义的路径
    beginPath()	起始一条路径 或重置当前路径
    closePath()	创建从当前点回到起始点的路径
    clip()	    从原始画布剪切任意形状和尺寸的区域
    save()	    保存当前环境的状态
    restore()	返回之前保存过的路径状态和属性

    moveTo(x, y)	把路径移动到画布中的指定点 不创建线条
    lineTo(x, y)	添加一个新点 然后在画布中创建从该点到最后指定点的线条
    translate(x, y)	重新映射画布上的 (0,0) 位置
    scale(x, y)	    缩放当前绘图至更大或更小
    isPointInPath(x, y)	如果指定的点位于当前路径中 则返回 true 否则返回 false

    quadraticCurveTo(cpx, cpy, x, y)	创建二次贝塞尔曲线
    cpx	贝塞尔控制点的 x 坐标
    cpy	贝塞尔控制点的 y 坐标
    x	结束点的 x 坐标
    y	结束点的 y 坐标

    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)	创建三次方贝塞尔曲线
    cp1x	第一个贝塞尔控制点的 x 坐标
    cp1y	第一个贝塞尔控制点的 y 坐标
    cp2x	第二个贝塞尔控制点的 x 坐标
    cp2y	第二个贝塞尔控制点的 y 坐标
    x	结束点的 x 坐标
    y	结束点的 y 坐标

    arc(x,y,r,sAngle,eAngle,counterclockwise)	创建弧/曲线(用于创建圆形或部分圆)
    x	圆的中心的 x 坐标 
    y	圆的中心的 y 坐标 
    r	圆的半径 
    sAngle	起始角 以弧度计 (弧的圆形的三点钟位置是 0 度) 
    eAngle	结束角 以弧度计 
    counterclockwise	可选 规定应该逆时针还是顺时针绘图 False = 顺时针 true = 逆时针 

    arcTo(x1, y1, x2, y2, radius)	创建两切线之间的弧/曲线
    x1  
    y1  
    x2  
    y2      
    radius  半径

    rotate(angle)	旋转当前绘图

    transform(a, b, c, d, e, f)	    替换绘图的当前转换矩阵
    setTransform(a, b, c, d, e, f)	将当前转换重置为单位矩阵 然后运行 transform()
    a	水平缩放绘图
    b	水平倾斜绘图
    c	垂直倾斜绘图
    d	垂直缩放绘图
    e	水平移动绘图
    f	垂直移动绘图

    fillText(text, x, y, maxWidth)	在画布上绘制“被填充的”文本
    strokeText(text, x, y, maxWidth)	在画布上绘制文本(无填充)

    text	    规定在画布上输出的文本
    x	        开始绘制文本的x坐标位置(相对于画布)
    y	        开始绘制文本的y坐标位置(相对于画布)
    maxWidth	可选 允许的最大文本宽度,以像素计
 
    measureText(text)	返回包含指定文本宽度

    drawImage(img, sx, sy, swidth, sheight, x, y, width, height)	向画布上绘制图像、画布或视频

    img	    规定要使用的图像、画布或视频
    sx	    可选 开始剪切的x坐标位置
    sy	    可选 开始剪切的y坐标位置
    swidth	可选 被剪切图像的宽度
    sheight	可选 被剪切图像的高度
    x	    可选 在画布上放置图像的x坐标位置
    y	    可选 在画布上放置图像的y坐标位置
    width	可选 要使用的图像的宽度(伸展或缩小图像)
    height	可选 要使用的图像的高度(伸展或缩小图像)
    */


    /*****************************************************************************/




    /****************************以下为方法扩展********************************/


    prototype.paint_border = function (x, y, width, height, border) {

        this.beginPath();

        this.rect(x, y, width - border[1], border[0]);
        this.rect(x + width - border[1], y, border[1], height - border[2]);
        this.rect(x + border[3], y + height - border[2], width - border[3], border[2]);
        this.rect(x, y + border[0], border[3], height - border[0]);

        this.fill();
    };



    prototype.rectTo = function (x, y, width, height, anticlockwise) {

        var right = x + width,
            bottom = y + height;

        if (anticlockwise)
        {
            this.moveTo(x, y);
            this.lineTo(x, bottom);
            this.lineTo(right, bottom);
            this.lineTo(right, y);
            this.lineTo(x, y);
        }
        else
        {
            this.moveTo(x, y);
            this.lineTo(right, y);
            this.lineTo(right, bottom);
            this.lineTo(x, bottom);
            this.lineTo(x, y);
        }
    };


    /*
    * 绘制圆角矩形路径
    * @param {Number} x The top left x coordinate
    * @param {Number} y The top left y coordinate 
    * @param {Number} width The width of the rectangle 
    * @param {Number} height The height of the rectangle
    * @param {Number} radius The corner radius. Defaults to 5;
    */
    prototype.roundRect = function (x, y, width, height, radius, anticlockwise) {

        var right = x + width,
            bottom = y + height;

        if (anticlockwise)
        {
            this.moveTo(x, y + radius);

            this.lineTo(x, bottom - radius);
            this.quadraticCurveTo(x, bottom, x + radius, bottom);

            this.lineTo(right - radius, bottom);
            this.quadraticCurveTo(right, bottom, right, bottom - radius);

            this.lineTo(right, y + radius);
            this.quadraticCurveTo(right, y, right - radius, y);

            this.lineTo(x + radius, y);
            this.quadraticCurveTo(x, y, x, y + radius);
        }
        else
        {
            this.moveTo(x + radius, y);

            this.lineTo(right - radius, y);
            this.quadraticCurveTo(right, y, right, y + radius);

            this.lineTo(right, bottom - radius);
            this.quadraticCurveTo(right, bottom, right - radius, bottom);

            this.lineTo(x + radius, bottom);
            this.quadraticCurveTo(x, bottom, x, bottom - radius);

            this.lineTo(x, y + radius);
            this.quadraticCurveTo(x, y, x + radius, y);
        }
    };

    /*
    * 填充圆角矩形
    * @param {Number} x The top left x coordinate
    * @param {Number} y The top left y coordinate 
    * @param {Number} width The width of the rectangle 
    * @param {Number} height The height of the rectangle
    * @param {Number} radius The corner radius. Defaults to 5;
    */
    prototype.fillRoundRect = function (x, y, width, height, radius) {

        this.beginPath();
        this.roundRect(x, y, width, height, radius);
        this.fill();
    };

    /*
    * 描边圆角矩形
    * @param {Number} x The top left x coordinate
    * @param {Number} y The top left y coordinate 
    * @param {Number} width The width of the rectangle 
    * @param {Number} height The height of the rectangle
    * @param {Number} radius The corner radius. Defaults to 5;
    */
    prototype.strokeRoundRect = function (x, y, width, height, radius) {

        this.beginPath();
        this.roundRect(x, y, width, height, radius);
        this.stroke();
    };


    //多边形
    prototype.polygon = function (sides, x, y, radius, angle, anticlockwise) {

        var delta = (anticlockwise ? -2 : 2) * Math.PI / sides;

        angle = angle ? angle * radian : 0;

        this.moveTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));

        for (var i = 1; i <= sides; i++)
        {
            angle += delta;
            this.lineTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));
        }
    };

    prototype.fillPolygon = function (sides, x, y, radius, angle, anticlockwise) {

        this.beginPath();
        this.polygon(sides, x, y, radius, angle, anticlockwise);
        this.fill();
    };

    prototype.strokePolygon = function (sides, x, y, radius, angle, anticlockwise) {

        this.beginPath();
        this.polygon(sides, x, y, radius, angle, anticlockwise);
        this.stroke();
    };



    prototype.starPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

        var delta = (anticlockwise ? -1 : 1) * Math.PI / vertexes;

        angle = angle ? angle * radian : 0;

        this.moveTo(x + radius1 * Math.sin(angle), y - radius1 * Math.cos(angle));

        for (var i = 1; i <= vertexes; i++)
        {
            angle += delta;
            this.lineTo(x + radius2 * Math.sin(angle), y - radius2 * Math.cos(angle));

            angle += delta;
            this.lineTo(x + radius1 * Math.sin(angle), y - radius1 * Math.cos(angle));
        }
    };

    prototype.fillStarPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

        this.beginPath();
        this.starPolygon(vertexes, x, y, radius1, radius2, angle, anticlockwise);
        this.fill();
    };

    prototype.strokeStarPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

        this.beginPath();
        this.starPolygon(vertexes, x, y, radius1, radius2, angle, anticlockwise);
        this.stroke();
    };



    prototype.ellipse = function (x, y, width, height, anticlockwise) {

        var controlX = width / 1.5,  //控制点x(width / 0.75) / 2
            controlY = height / 2;   //控制点y

        if (anticlockwise)
        {
            this.moveTo(x, y + controlY);
            this.bezierCurveTo(x + controlX, y + controlY, x + controlX, y - controlY, x, y - controlY);
            this.bezierCurveTo(x - controlX, y - controlY, x - controlX, y + controlY, x, y + controlY);
        }
        else
        {
            this.moveTo(x, y - controlY);
            this.bezierCurveTo(x + controlX, y - controlY, x + controlX, y + controlY, x, y + controlY);
            this.bezierCurveTo(x - controlX, y + controlY, x - controlX, y - controlY, x, y - controlY);
        }
    };

    prototype.fillEllipse = function (x, y, width, height) {

        this.beginPath();
        this.ellipse(x, y, width, height);
        this.fill();
    };

    prototype.strokeEllipse = function (x, y, width, height) {

        this.beginPath();
        this.ellipse(x, y, width, height);
        this.stroke();
    };



    //画虚线
    prototype.dashLine = function (x1, y1, x2, y2, dashArray) {


        if (!dashArray)
        {
            dashArray = [10, 5];
        }


        this.moveTo(x1, y1);

        var length = dashArray.length,
            width = (x2 - x1),
            height = (y2 - y1),
            slope = height / width,
            distRemaining = Math.sqrt(width * width + height * height),
            index = 0,
            draw = false;


        while (distRemaining >= 0.1)
        {
            var dashLength = dashArray[index++ % length];

            if (dashLength > distRemaining)
            {
                dashLength = distRemaining;
            }


            var step = Math.sqrt(dashLength * dashLength / (1 + slope * slope));

            if (width < 0)
            {
                step = -step;
            }

            x1 += step;
            y1 += slope * step;

            this[(draw = !draw) ? "lineTo" : "moveTo"](x1, y1);

            distRemaining -= dashLength;
        }
    };



    /*****************************************************************************/




    var cache = document.createElement("canvas");

    //缓冲绘图
    prototype.cache = function (width, height) {

        cache.width = width;
        cache.height = height;

        return cache.getContext("2d");
    };

    //复制至指定目标
    prototype.copyTo = function (target, x, y) {

        var data = this.getImageData(0, 0, this.canvas.width, this.canvas.height);
        target.putImageData(data, x, y);
    };



})(flyingon);
