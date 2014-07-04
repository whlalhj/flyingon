/*

Canvas2D绘图
参考:http://www.w3school.com.cn/html5/html5_ref_canvas.asp

*/

(function (flyingon) {




    //2d图形绘制器
    flyingon.Painter = flyingon.function_extend(function (canvas) {

        this.context = (this.canvas = canvas).getContext("2d");

    }, function (flyingon) {

        

        var self = this,

            radian = Math.PI / 180,     //角度转弧度系数

            regex_transparent = /rgba|hsla/, //透明颜色判断规则

            regex_color = /#|rgb|hsl|rgba|hsla|linear|radial|pattern|[\w-.]+/g, //颜色解析规则

            color_cache = {};




        //当前目标控件
        this.target = null;




        //颜色可选值如下
        //#rrggbb                                                                           rgb颜色 与css规则相同
        //name                                                                              颜色名称 与css规则相同
        // rgb(0-255 | x%, 0-255 | x%, 0-255 | x%)                                          rgb颜色 与css规则相同
        //rgba(0-255 | x%, 0-255 | x%, 0-255 | x%, 0-1)                                     rgba颜色 与css规则相同
        // hsl(0-360, x%, x%)                                                               hsl颜色 与css规则相同
        //hsla(0-360, x%, x%, 0-1)                                                          hsla颜色 与css规则相同
        //linear(x1, y2, x2, y2, step1, color1, step2, color2[, ...])                       线性渐变颜色 x1,y1,x2,y2: 取值范围:0->1 "0, 0"表示控件左上角 "1, 1"表示控件右下角
        //radial(x1, y1, radius1, x2, y2, radius2, step1, color1, step2, color2[, ...])     径向渐变颜色 x1,y1,x2,y2: 取值范围:0->1 "0, 0"表示控件左上角 "1, 1"表示控件右下角
        //pattern(image, repeat|repeat-x|repeat-y|no-repeat)                                图像填充



        //解析颜色
        function parse_color(value) {

            var tokens = ("" + value).match(regex_color),
                token = tokens[0];

            switch (token)
            {
                case "#":
                    return { color: "#" + tokens[1] };

                case "rgb":
                case "hsl":
                    return { color: token + "(" + tokens[1] + ", " + tokens[2] + ", " + tokens[3] + ")" };

                case "rgba":
                case "hsla":
                    return { color: token + "(" + tokens[1] + ", " + tokens[2] + ", " + tokens[3] + ", " + tokens[4] + ")", transparet: true };

                case "linear":
                    return translate_color({

                        x1: +tokens[1] || 0,
                        y1: +tokens[2] || 0,
                        x2: +tokens[3] || 0,
                        y2: +tokens[4] || 0,
                        fn: linear

                    }, tokens, 5);

                case "radial":
                    return translate_color({

                        x1: +tokens[1] || 0,
                        y1: +tokens[2] || 0,
                        r1: +tokens[3] || 0,
                        x2: +tokens[4] || 0,
                        y2: +tokens[5] || 0,
                        r2: +tokens[6] || 0,
                        fn: radial

                    }, tokens, 7);

                case "pattern":
                    return {

                        image: tokens[1],
                        repeat: tokens[2],
                        fn: pattern,
                        transparent: true //图片都按透明方式处理
                    };

                default:
                    return { color: token };
            }
        };


        //转换渐变颜色
        function translate_color(target, tokens, index) {

            var colors = target.colors = [],
                flag = true,
                color;

            for (var i = index, _ = tokens.length; i < _; i++)
            {
                colors.push(+tokens[i++] || 0);
                colors.push(color = tokens[i] || "white");

                if (flag && (color === "transparent" || color.match(regex_transparent)))
                {
                    target.transparet = true;
                    flag = false;
                }
            }

            return target;
        };


        //线性渐变颜色设置方法
        function linear(painter) {

            var target = painter.target,
                width = target.controlWidth,
                height = target.controlHeight,
                result = painter.context.createLinearGradient(this.x1 * width, this.y1 * height, this.x2 * width, this.y2 * height),
                colors = this.colors;

            for (var i = 0, _ = colors.length; i < _; i++)
            {
                result.addColorStop(colors[i++], colors[i]);
            }

            return result;
        };



        //径向渐变颜色设置方法
        function radial(painter) {

            var target = painter.target,
                width = target.controlWidth,
                height = target.controlHeight,
                result = painter.context.createRadialGradient(this.x1 * width, this.y1 * height, this.r1, this.x2 * width, this.y2 * height, this.r2),
                colors = this.colors;

            for (var i = 0, _ = colors.length; i < _; i++)
            {
                result.addColorStop(colors[i++], colors[i]);
            }

            return result;
        };


        //图像填充模式设置方法
        function pattern(context) {

            return context.createPattern(flyingon.get_image(this.image), this.repeat);
        };




        function defineProperty(name, setter) {

            var getter = new Function("return this.context." + name + ";"),
                setter;

            if (setter == null)
            {
                setter = new Function("value", "this.context." + name + " = value;");
            }
            else if (setter === "color")
            {
                setter = function (value) {

                    if (value)
                    {
                        var style = color_cache[value] || (color_cache[value] = parse_color(value));
                        this.context[name] = style.color || style.fn(this);
                    }
                    else
                    {
                        this.context[name] = "";
                    }
                };
            }

            flyingon.defineProperty(self, name, getter, setter);
        };




        /*    
        设置填充色

        color "#000000"	
        */
        defineProperty("fillStyle", "color");

        /*    
        设置边框色

        color "#000000"	
        */
        defineProperty("strokeStyle", "color");


        /*    
        设置或返回用于阴影的颜色

        color "#000000"	 
        */
        defineProperty("shadowColor", "color");



        /* 
        设置或返回用于阴影的模糊级别

        number 0	     
        */
        defineProperty("shadowBlur");

        /* 
        设置或返回阴影距形状的水平距离

        number 0	
        */
        defineProperty("shadowOffsetX");

        /* 
        设置或返回阴影距形状的垂直距离

        number 0	 
        */
        defineProperty("shadowOffsetY");


        /* 
        设置或返回线条的结束端点样式

        butt
        round
        square        
        */
        defineProperty("lineCap");

        /* 
        设置或返回两条线相交时 所创建的拐角类型

        bevel
        round
        miter   
        */
        defineProperty("lineJoin");

        /* 
        设置或返回当前的线条宽度

        number 1	  
        */
        defineProperty("lineWidth");

        /* 
        设置或返回最大斜接长度

        number 10	     
        */
        defineProperty("miterLimit");

        /* 
        设置或返回虚线偏移(ie11, safari7以上才支持)

        number 10	     
        */
        defineProperty("lineDashOffset");


        /* 
        设置或返回文本内容的当前字体属性

        string "10px sans-serif"	 
        */
        defineProperty("font");

        /* 
        设置或返回文本内容的当前对齐方式

        start     文本在指定的位置开始
        end       文本在指定的位置结束
        center    文本的中心被放置在指定的位置
        left      文本左对齐
        right     文本右对齐
        */
        defineProperty("textAlign");

        /* 
        设置或返回在绘制文本时使用的当前文本基线

        alphabetic    文本基线是普通的字母基线
        top           文本基线是 em 方框的顶端
        hanging       文本基线是悬挂基线
        middle        文本基线是 em 方框的正中
        ideographic   文本基线是表意基线
        bottom        文本基线是 em 方框的底端
        */
        defineProperty("textBaseline");


        /* 
        透明值 

        number	必须介于0.0(完全透明)与1.0(不透明)之间
        */
        defineProperty("globalAlpha");

        /* 
        设置或返回新图像如何绘制到已有的图像上

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
        defineProperty("globalCompositeOperation");



        //设置虚线样式(ie11, safari7以上才支持)
        this.getLineDash = function () {

            var context = this.context;
            return context.getLineDash && context.getLineDash();
        };


        //设置虚线样式(ie11, safari7以上才支持)
        this.setLineDash = function (dashArray) {

            var context = this.context;

            if (context.setLineDash)
            {
                context.setLineDash(dashArray);
            }
        };



        //创建矩形
        this.rect = function (x, y, width, height) {

            this.context.rect(x, y, width, height);
        };

        //绘制填充的矩形
        this.fillRect = function (x, y, width, height) {

            this.context.fillRect(x, y, width, height);
        };

        //绘制无填充矩形
        this.strokeRect = function (x, y, width, height) {

            this.context.strokeRect(x, y, width, height);
        };

        //在给定的矩形内清除指定的像素
        this.clearRect = function (x, y, width, height) {

            this.context.clearRect(x, y, width, height);
        };



        //填充当前绘图(路径)
        this.fill = function () {

            this.context.fill();
        };

        //绘制已定义的路径
        this.stroke = function () {

            this.context.stroke();
        };

        //起始一条路径 或重置当前路径
        this.beginPath = function () {

            this.context.beginPath();
        };

        //创建从当前点回到起始点的路径
        this.closePath = function () {

            this.context.closePath();
        };

        //把路径移动到画布中的指定点 不创建线条
        this.moveTo = function (x, y) {

            this.context.moveTo(x, y);
        };

        //添加一个新点 然后在画布中创建从该点到最后指定点的线条
        this.lineTo = function (x, y) {

            this.context.lineTo(x, y);
        };

        //画虚线
        this.lineTo_dash = function (x1, y1, x2, y2, dashArray) {

            dashArray = dashArray || [10, 5];

            var context = this.context,
                length = dashArray.length,
                width = (x2 - x1),
                height = (y2 - y1),
                slope = height / width,
                distance = Math.sqrt(width * width + height * height),
                index = 0,
                flag = false;

            context.moveTo(x1, y1);

            while (distance >= 0.1)
            {
                var dashLength = dashArray[index++ % length];

                if (dashLength > distance)
                {
                    dashLength = distance;
                }

                var step = Math.sqrt(dashLength * dashLength / (1 + slope * slope));

                if (width < 0)
                {
                    step = -step;
                }

                x1 += step;
                y1 += slope * step;

                context[(flag = !flag) ? "lineTo" : "moveTo"](x1, y1);

                distance -= dashLength;
            }
        };

        //如果指定的点位于当前路径中 则返回 true 否则返回 false
        this.isPointInPath = function (x, y) {

            this.context.isPointInPath(x, y);
        };


        /*
        创建二次贝塞尔曲线

        control_x	贝塞尔控制点的 x 坐标
        control_y	贝塞尔控制点的 y 坐标
        end_x	结束点的 x 坐标
        end_y	结束点的 y 坐标
        */
        this.quadraticCurveTo = function (control_x, control_y, end_x, end_y) {

            this.context.quadraticCurveTo(control_x, control_y, end_x, end_y);
        };

        /*
        创建三次方贝塞尔曲线
        control_x1	第一个贝塞尔控制点的 x 坐标
        control_y1	第一个贝塞尔控制点的 y 坐标
        control_x2	第二个贝塞尔控制点的 x 坐标
        control_y2	第二个贝塞尔控制点的 y 坐标
        end_x	结束点的 x 坐标
        end_y	结束点的 y 坐标
        */
        this.bezierCurveTo = function (control_x1, control_y1, control_x2, control_y2, end_x, end_y) {

            var context = this.context;
            context.bezierCurveTo.apply(context, arguments);
        };

        /*
        创建弧/曲线(用于创建圆形或部分圆)

        x	圆的中心的 x 坐标 
        y	圆的中心的 y 坐标 
        radius	圆的半径 
        angle1	起始角 以弧度计 (弧的圆形的三点钟位置是 0 度) 
        angle2	结束角 以弧度计 
        anticlockwise	可选 规定应该逆时针还是顺时针绘图 False = 顺时针 true = 逆时针 
        */
        this.arc = function (x, y, radius, angle1, angle2, anticlockwise) {

            var context = this.context;
            context.arc.apply(context, arguments);
        };

        /*
        创建两切线之间的弧/曲线

        x1  
        y1  
        x2  
        y2      
        radius  半径
        */
        this.arcTo = function (x1, y1, x2, y2, radius) {

            this.context.arcTo(x1, y1, x2, y2, radius);
        };


        //重新映射画布上的 (0,0) 位置
        this.translate = function (x, y) {

            this.context.translate(x, y);
        };

        //缩放当前绘图至更大或更小
        this.scale = function (x, y) {

            this.context.scale(x, y);
        };

        //旋转当前绘图
        this.rotate = function (angle) {

            this.context.rotate(angle);
        };

        /*
        替换绘图的当前转换矩阵
        
        scale_x	水平缩放绘图
        skew_x	水平倾斜绘图
        skew_y	垂直倾斜绘图
        scale_y	垂直缩放绘图
        move_x	水平移动绘图
        move_y	垂直移动绘图
        */
        this.transform = function (scale_x, skew_x, skew_y, scale_y, move_x, move_y) {

            var context = this.context;
            context.transform.apply(context, arguments);
        };

        /*
        将当前转换重置为单位矩阵 然后运行 transform()
        
        scale_x	水平缩放绘图
        skew_x	水平倾斜绘图
        skew_y	垂直倾斜绘图
        scale_y	垂直缩放绘图
        move_x	水平移动绘图
        move_y	垂直移动绘图
        */
        this.setTransform = function (scale_x, skew_x, skew_y, scale_y, move_x, move_y) {

            var context = this.context;
            context.setTransform.apply(context, arguments);
        };


        //从原始画布剪切任意形状和尺寸的区域
        this.clip = function () {

            this.context.clip();
        };

        //保存当前环境的状态
        this.save = function () {

            this.context.save();
        };

        //返回之前保存过的路径状态和属性
        this.restore = function () {

            this.context.restore();
        };



        /*
        在画布上绘制“被填充的”文本
        
        text	    规定在画布上输出的文本
        x	        开始绘制文本的x坐标位置(相对于画布)
        y	        开始绘制文本的y坐标位置(相对于画布)
        maxWidth	可选 允许的最大文本宽度,以像素计
        */
        this.fillText = function (text, x, y, maxWidth) {

            var context = this.context;
            context.fillText.apply(context, arguments);
        };

        /*
        在画布上绘制文本(无填充)

        text	    规定在画布上输出的文本
        x	        开始绘制文本的x坐标位置(相对于画布)
        y	        开始绘制文本的y坐标位置(相对于画布)
        maxWidth	可选 允许的最大文本宽度,以像素计
        */
        this.strokeText = function (text, x, y, maxWidth) {

            var context = this.context;
            context.strokeText.apply(context, arguments);
        };

        //返回包含指定文本宽度
        this.measureText = function (text) {

            return this.context.measureText(text);
        };


        /*
        向画布上绘制图像、画布或视频
    
        image   规定要使用的图像、画布或视频
        source_x	    可选 开始剪切的x坐标位置
        source_y	    可选 开始剪切的y坐标位置
        source_width	可选 被剪切图像的宽度
        source_height	可选 被剪切图像的高度
        x	    可选 在画布上放置图像的x坐标位置
        y	    可选 在画布上放置图像的y坐标位置
        width	可选 要使用的图像的宽度(伸展或缩小图像)
        height	可选 要使用的图像的高度(伸展或缩小图像)
        */
        this.drawImage = function (image, source_x, source_y, source_width, source_height, x, y, width, height) {

            var context = this.context;
            context.drawImage.apply(context, arguments);
        };

        //绘制图像
        this.paint_image = function (image, x, y, width, height, alignX, alignY, stretch) {

            var context = this.context,
                _width = image.width,
                _height = image.height,
                cache;

            if (stretch)
            {
                switch (stretch)
                {
                    case "clip":
                        if (_width > width)
                        {
                            _width = width;
                        }

                        if (_height > height)
                        {
                            _height = height;
                        }
                        break;

                    case "zoom":
                        cache = Math.min(_width / width, _height / height);
                        _width *= cache;
                        _height *= cache;
                        break;

                    case "stretch":
                        context.drawImage(image, x, y, width, height);
                        return;
                }
            }

            if ((cache = width - _width) && alignX !== "left")
            {
                x += (alignX === "right") ? cache : (cache >> 1); //right|center
            }

            if ((cache = height - _height) && alignY !== "top")
            {
                y += alignY === "bottom" ? cache : (cache >> 1); //bottom|middle
            }

            if (stretch)
            {
                context.drawImage(image, 0, 0, _width, _height, x, y, width, height);
            }
            else
            {
                context.drawImage(image, x, y);
            }
        };



        this.rectTo = function (x, y, width, height, anticlockwise) {

            var context = this.context,
                right = x + width,
                bottom = y + height;

            if (anticlockwise)
            {
                context.moveTo(x, y);
                context.lineTo(x, bottom);
                context.lineTo(right, bottom);
                context.lineTo(right, y);
                context.lineTo(x, y);
            }
            else
            {
                context.moveTo(x, y);
                context.lineTo(right, y);
                context.lineTo(right, bottom);
                context.lineTo(x, bottom);
                context.lineTo(x, y);
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
        this.roundRect = function (x, y, width, height, radius, anticlockwise) {

            var context = this.context,
                right = x + width,
                bottom = y + height;

            if (anticlockwise)
            {
                context.moveTo(x, y + radius);

                context.lineTo(x, bottom - radius);
                context.quadraticCurveTo(x, bottom, x + radius, bottom);

                context.lineTo(right - radius, bottom);
                context.quadraticCurveTo(right, bottom, right, bottom - radius);

                context.lineTo(right, y + radius);
                context.quadraticCurveTo(right, y, right - radius, y);

                context.lineTo(x + radius, y);
                context.quadraticCurveTo(x, y, x, y + radius);
            }
            else
            {
                context.moveTo(x + radius, y);

                context.lineTo(right - radius, y);
                context.quadraticCurveTo(right, y, right, y + radius);

                context.lineTo(right, bottom - radius);
                context.quadraticCurveTo(right, bottom, right - radius, bottom);

                context.lineTo(x + radius, bottom);
                context.quadraticCurveTo(x, bottom, x, bottom - radius);

                context.lineTo(x, y + radius);
                context.quadraticCurveTo(x, y, x + radius, y);
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
        this.fillRoundRect = function (x, y, width, height, radius) {

            var context = this.context;

            context.beginPath();
            this.roundRect(x, y, width, height, radius);
            context.fill();
        };

        /*
        * 描边圆角矩形
        * @param {Number} x The top left x coordinate
        * @param {Number} y The top left y coordinate 
        * @param {Number} width The width of the rectangle 
        * @param {Number} height The height of the rectangle
        * @param {Number} radius The corner radius. Defaults to 5;
        */
        this.strokeRoundRect = function (x, y, width, height, radius) {

            var context = this.context;

            context.beginPath();
            this.roundRect(x, y, width, height, radius);
            context.stroke();
        };


        //多边形
        this.polygon = function (sides, x, y, radius, angle, anticlockwise) {

            var context = this.context,
                delta = (anticlockwise ? -2 : 2) * Math.PI / sides;

            angle = angle ? angle * radian : 0;

            context.moveTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));

            for (var i = 1; i <= sides; i++)
            {
                angle += delta;
                context.lineTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));
            }
        };

        this.fillPolygon = function (sides, x, y, radius, angle, anticlockwise) {

            var context = this.context;

            context.beginPath();
            this.polygon(sides, x, y, radius, angle, anticlockwise);
            context.fill();
        };

        this.strokePolygon = function (sides, x, y, radius, angle, anticlockwise) {

            var context = this.context;

            context.beginPath();
            this.polygon(sides, x, y, radius, angle, anticlockwise);
            context.stroke();
        };



        this.starPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

            var context = this.context,
                delta = (anticlockwise ? -1 : 1) * Math.PI / vertexes;

            angle = angle ? angle * radian : 0;

            context.moveTo(x + radius1 * Math.sin(angle), y - radius1 * Math.cos(angle));

            for (var i = 1; i <= vertexes; i++)
            {
                angle += delta;
                context.lineTo(x + radius2 * Math.sin(angle), y - radius2 * Math.cos(angle));

                angle += delta;
                context.lineTo(x + radius1 * Math.sin(angle), y - radius1 * Math.cos(angle));
            }
        };

        this.fillStarPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

            var context = this.context;

            context.beginPath();
            this.starPolygon(vertexes, x, y, radius1, radius2, angle, anticlockwise);
            context.fill();
        };

        this.strokeStarPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

            var context = this.context;

            context.beginPath();
            this.starPolygon(vertexes, x, y, radius1, radius2, angle, anticlockwise);
            context.stroke();
        };



        this.ellipse = function (x, y, width, height, anticlockwise) {

            var context = this.context,
                controlX = width / 1.5,  //控制点x(width / 0.75) / 2
                controlY = height / 2;   //控制点y

            if (anticlockwise)
            {
                context.moveTo(x, y + controlY);
                context.bezierCurveTo(x + controlX, y + controlY, x + controlX, y - controlY, x, y - controlY);
                context.bezierCurveTo(x - controlX, y - controlY, x - controlX, y + controlY, x, y + controlY);
            }
            else
            {
                context.moveTo(x, y - controlY);
                context.bezierCurveTo(x + controlX, y - controlY, x + controlX, y + controlY, x, y + controlY);
                context.bezierCurveTo(x - controlX, y + controlY, x - controlX, y - controlY, x, y - controlY);
            }
        };

        this.fillEllipse = function (x, y, width, height) {

            var context = this.context;

            context.beginPath();
            this.ellipse(x, y, width, height);
            context.fill();
        };

        this.strokeEllipse = function (x, y, width, height) {

            var context = this.context;

            context.beginPath();
            this.ellipse(x, y, width, height);
            context.stroke();
        };


    });



})(flyingon);
