$(function () {

    var class_closed = 'closed';
    $('.accordion').each(function() {
        var dl = $(this);
        var allDt = dl.find('dt');
        var allDd = dl.find('dd');
        // 全てのdt,ddを閉じる関数
        function closeAll() {
            allDt.addClass(class_closed);
            allDd.slideUp().addClass(class_closed);
        }
        // 開じているdtを開く関数
        function open(dt, dd, span) {
            dt.removeClass(class_closed);
            dd.slideDown().removeClass(class_closed);
        }
        // 開いているdtを閉じる関数
        function close(dt, dd, span) {
            dt.addClass(class_closed);
            dd.slideUp().addClass(class_closed);
        }
        allDt.click(function() {
            dt = $(this);
            var class_currentDt = $(this).attr('class');
            dd = dt.next();
            span = dt.find('span');
            if(class_currentDt===class_closed){
                open(dt, dd, span);
            }
            if(class_currentDt===''){
                close(dt, dd, span);
            }
        });
        closeAll();
    });
});
