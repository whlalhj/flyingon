
//可视组件扩展
flyingon.visual_extender = function () {


    //左上角x坐标
    this.x = 0;

    //左上角y坐标
    this.y = 0;


    //实际宽度
    this.width = 0;

    //实际高度
    this.height = 0;



    //测量
    this.measure = function (usable_width, usable_height) {

        this.width = usable_width || 0;
        this.height = usable_height || 0;
    };

    //定位
    this.locate = function (x, y) {

        this.x = x || 0;
        this.y = y || 0;
    };


};

