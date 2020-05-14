var TableManaged = function () {

    return {

        //main function to initiate the module
        init: function () {

            if (!jQuery().dataTable) {
                return;
            }
 
            // begin first table
            $('#sample_1').dataTable({
                "aoColumns": [
                    { "bSortable": false },
                    null,
                    { "bSortable": false },
                    null,
                    { "bSortable": false },
                    { "bSortable": false },
                    { "bSortable": false }
                ],
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_  条一页",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页"
                    }
                },
                "aoColumnDefs": [{
                    'bSortable': false,
                    'aTargets': [0]
                }
                ]
            });

            jQuery('#sample_1 .group-checkable').change(function () {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function () {
                    if (checked) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });
                jQuery.uniform.update(set);
            });

            jQuery('#sample_1_wrapper .dataTables_filter input').addClass("m-wrap medium"); // modify table search input
            jQuery('#sample_1_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            //jQuery('#sample_1_wrapper .dataTables_length select').select2(); // initialzie select2 dropdown

            //购物车表
            $('#sample_editable_1').dataTable({
                "aoColumns": [
                    { "bSortable": false },
                    { "bSortable": false },
                    { "bSortable": false },
                    { "bSortable": false },
                    { "bSortable": false },
                    { "bSortable": false },
                    { "bSortable": false }
                ],
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_  条一页",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页"
                    }
                },
                "aoColumnDefs": [{
                    'bSortable': false,
                    'aTargets': [0]
                }
                ]
            });

            jQuery('#sample_editable_1 .group-checkable').change(function () {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function () {
                    if (checked) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });    
                jQuery.uniform.update(set);
            });
 
            jQuery('#sample_editable_1_wrapper .dataTables_filter input').addClass("m-wrap medium"); // modify table search input
            jQuery('#sample_editable_1_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown


            //购物车价格联动
            // window.onload = function () {
            //     var listC = document.getElementById('listC');
            //     var atr = listC.getElementsByTagName('tr');
            //     var atotal = document.getElementById('totalNum')
            //     var total2 = 0
            //     var total3 = 0
            //     for (var i = 0; i < atr.length; i++) {
            //         fn1(atr[i]);

            //         // 选择将观察突变的节点
            //         ar = atr[i].getElementsByClassName('sum')[0];
            //         // console.log(ar.innerHTML,1111111);
            //         // 观察者的选项(要观察哪些突变)
            //         var config = { childList: true };

            //         // 当观察到突变时执行的回调函数
            //         var callback = function (mutationsList) {
            //             mutationsList.forEach(function (item, index) {
            //                 if (item.type == 'childList') {
            //                     // console.log('有节点发生改变，当前节点的内容是：');
            //                     for (var i = 0; i < atr.length; i++) {
            //                         total2 = Number(atr[i].getElementsByClassName('sum')[0].innerHTML)
            //                         total3+=total2
            //                     }
            //                     // console.log(total3,1111111111111111);
            //                     atotal.innerHTML=total3.toFixed(2)
            //                     total3= 0   
            //                 };
            //             });
            //         };
            //         // 创建一个链接到回调函数的观察者实例
            //         var observer = new MutationObserver(callback);

            //         // 开始观察已配置突变的目标节点
            //         observer.observe(ar, config);
            //     }
                 

            //     function fn1(atr) {
            //         var aBtn = atr.getElementsByClassName('jiajian');
            //         var aCount = atr.getElementsByClassName('count')[0];
            //         var aPrice = atr.getElementsByClassName('price')[0];
            //         var sum = atr.getElementsByClassName('sum')[0];
            //         var num = Number(aCount.innerHTML); //aCount.innerHTML='0'
            //         var price = parseFloat(aPrice.innerHTML);//aPrice.innerHTML='12.9元'

            //         aBtn[0].onclick = function () {
            //             if (num > 0) {
            //                 num--;
            //                 aCount.innerHTML = num;
            //                 sum.innerHTML = (num * price).toFixed(1)
            //                 // sumVal = Number(sum.innerHTML);

            //             }
            //         }
            //         aBtn[1].onclick = function () {
            //             num++;
            //             aCount.innerHTML = num;
            //             sum.innerHTML = (num * price).toFixed(1)
            //             // sumVal = Number(sum.innerHTML);
            //         }
            //     }

            // }

            // begin second table
            $('#sample_2').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ per page",
                    "oPaginate": {
                        "sPrevious": "Prev",
                        "sNext": "Next"
                    }
                },
                "aoColumnDefs": [{
                    'bSortable': false,
                    'aTargets': [0]
                }
                ]
            });

            jQuery('#sample_2 .group-checkable').change(function () {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function () {
                    if (checked) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });
                jQuery.uniform.update(set);
            });

            jQuery('#sample_2_wrapper .dataTables_filter input').addClass("m-wrap small"); // modify table search input
            jQuery('#sample_2_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            jQuery('#sample_2_wrapper .dataTables_length select').select2(); // initialzie select2 dropdown

            // begin: third table
            $('#sample_3').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ per page",
                    "oPaginate": {
                        "sPrevious": "Prev",
                        "sNext": "Next"
                    }
                },
                "aoColumnDefs": [{
                    'bSortable': false,
                    'aTargets': [0]
                }
                ]
            });

            jQuery('#sample_3 .group-checkable').change(function () {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function () {
                    if (checked) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });
                jQuery.uniform.update(set);
            });

            jQuery('#sample_3_wrapper .dataTables_filter input').addClass("m-wrap small"); // modify table search input
            jQuery('#sample_3_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            jQuery('#sample_3_wrapper .dataTables_length select').select2(); // initialzie select2 dropdown

        }

    };

}();