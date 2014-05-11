(function (flyingon) {


    flyingon.WritingMode = (function (value) {

        if (value)
        {

        }

    }).extend(function () {


        //转换为字符串
        this.toString = this.toLocaleString = this.serializeTo = function () {

            return this.horizontal + "," + this.vertical;
        };

    });


})(flyingon);