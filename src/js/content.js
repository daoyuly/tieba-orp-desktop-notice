(function () {

    var stepStatus = [];
    var menuid = window.location.search.replace('?menuId=','');
    var url =  window.location.href;

    function checkResult() {
        var stepList = document.querySelectorAll('#onlinelist-content tr');

        var i = 0;
        for (var step in stepList) {

            var children = stepList[step].children;

            if (!children) {
               return ;
            }

            var id = parseInt(menuid) * 10 + i;
            var status = children[2].children[0].innerHTML;
            var title = children[0].innerHTML;
            stepStatus[i] = {id: id, title: title, status: status, url:url};
            i++;
        }


    }


    function main () {
         checkResult();
        for (var i = stepStatus.length - 1; i >= 0; i--) {
            console.log('callback');
            var step = stepStatus[i];
            if (step.status === '部署成功') {
                // 通知
                chrome.runtime.sendMessage(step, function (response) {
                    console.log('callback');
                });

                break;
            }
        }


        setTimeout(function () {
       
       main();

    }, 1500);
    }

    setTimeout(function () {
       
       main();

    }, 1000);
    
})();