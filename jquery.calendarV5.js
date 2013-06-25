
;(function(window,$){

var DEFAULT_CONFIG = {
	//默认配置信息
	beginYear           :1990,         //可选的最早的年份
	endYear             :2020, 		   //可选的最晚的年份
	readOnlyFlag        :true,         //是否是只读的标志
	otherMonthShow      :true,         //是否显示前后两个月份的的标志，默认不显示：true	

    //日期控件的CSS样式
	bg                  :"#efefef",     
    bgHover             :"#ffcc00",
    bgSelect            :"#ffcc00",
    bgToday             :"#00cc33",
    colorOtherMonth     :"#ccc",
    colorThisMonth      :"#000",


	slideDownTime       :200,           //日期控件出现动画时间
	slideUpTime         :200,           //日期控件消失动画时间
	patternDelimiter    :"-",		    //字符串格式化分隔符
	date2stringPattern  :"yyyy-mm-dd",  //日期转字符串格式
	string2datePattern  :"ymd",		    //字符串转日期格式
	selector            :".calendar"   //需要绑定日期控件的class数组
	
};

//日期控件构造函数
var Calendar = function(config) {
	
	//加载你的配置信息
	config = $.extend({} , DEFAULT_CONFIG , config || {});

	this.config = config;
    
    this.$panel = null;
    this.dateControl = null;
    //this.$iframe = null;
    this.weeks = "日一二三四五六".split("");
    this.date = new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth() + 1;

};

Calendar.prototype = {
	//创建日期控件框架、样式与绑定事件
	"draw"            :    function() {
		var calendar = this;

		var arr = [];

	    arr.push("<iframe name='calendar-iframe' class='calendar-iframe' width='200' height='242' scrolling='no' frameborder='0' style='margin:0px;position:absolute;z-index:-2;opacity:0;'><\/iframe>");
		arr.push('<table class="calendar-table" width="100%" border="0" cellpadding="3" cellspacing="1" align="center">');
		arr.push('<thead><tr class="calendar-head">');
		arr.push('<th><input name="go-prev-month" type="button" class="go-prev-month" value="&lt;" \/><\/th>');
		arr.push('<th colspan="5"><select name="year-select" class="year-select"><\/select><select name="month-select" class="month-select"><option value="1">1月<\/option><option value="2">2月<\/option><option value="3">3月<\/option><option value="4">4月<\/option><option value="5">5月<\/option><option value="6">6月<\/option><option value="7">7月<\/option><option value="8">8月<\/option><option value="9">9月<\/option><option value="10">10月<\/option><option value="11">11月<\/option><option value="12">12月<\/option><\/select><\/th>');
		arr.push('<th><input name="go-next-month" type="button" class="go-next-month" value="&gt;" \/><\/th>');
		arr.push('<\/tr>');
		arr.push('<tr>');

		for(var i = 0; i < 7; i++) {
			arr.push('<th class="week-header">');
			arr.push(calendar.weeks[i]);
			arr.push('<\/th>');	
		}

		arr.push('<\/tr><\/thead><tbody><\/tbody>');
		arr.push('<tfoot><tr class="calendar-foot">');
		arr.push('<th><\/th>');
		arr.push('<th class="today-show" colspan="5"><\/th>');
	    arr.push('<\/tr><\/tfoot><\/table>');

		calendar.$panel = $("<div class='calendar-panel'><\/div>");
	    $(document.body).append(calendar.$panel);
	    calendar.$panel.html(arr.join(""));

	    calendar.$panel.find(".today-show").html("今天是" + calendar.year + "年" + calendar.month + "月" + calendar.date.getDate() + "日 星期" + this.weeks[calendar.date.getDay()]);


	    if(!$("calendar-style")[0]) {
		    var styles = ".calendar-panel{width:200px;padding:2px;position:absolute;overflow:hidden;border:1px solid #cccccc;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;-webkit-box-shadow:4px 4px 1em rgba(0,0,0,0.3);-moz-box-shadow:4px 4px 1em rgba(0,0,0,0.3);box-shadow:4px 4px 1em rgba(0,0,0,0.3);}\n" +
	                 ".calendar-panel table{font-size:12px;font-weight:600;text-align:center;background-color:#ffffff;}\n" + 
	                 ".calendar-panel td{background-color:#efefef;height:24px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;}\n" +
	                 "th.week-header{background-color:#666666;color:#ffffff;width:24px;height:24px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;}\n" +
	                 ".calendar-head th{padding:4px 0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;}\n" +
	                 ".calendar-head input{border:1px solid #ccc;background-color:#efefef;width:20px;height:20px;cursor:pointer;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;}\n" + 
	                 ".calendar-head select{font-size:12px;background-color:#efefef;}\n" + 
	                 ".year-select{width:66px;border:1px solid #ccc;margin-right:1px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;}\n" + 
	                 ".month-select{width:60px;border:1px solid #ccc;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;}\n" +
	                 ".calendar-foot th{padding:4px 0;}" + 
	                 ".today-show{font-size:12px;cursor:pointer;-webkit-border-radius:8px;-moz-border-radius:8px;border-radius:8px;-moz-transition:background-color 0.3s ease-in;-webkit-transition:background-color 0.3s ease-in;transition:background-color 0.3s ease-in;}" + 
	                 ".today-show:hover{background-color:#efefef;}";
		    $('<style type="text/css" id="calendar-style">' + styles + '<\/style>').appendTo('head');
		}

	    calendar._yearRange();

	    calendar.$panel.find(".go-next-month").click(function() {
	    	calendar._goNextMonth();
	    });

	    calendar.$panel.find(".go-prev-month").click(function() {
			calendar._goPrevMonth();
		})

		calendar.$panel.find(".go-prev-month,.go-next-month").hover(function() {
			$(this).css("backgroundColor","#ffcc00");
		}, function() {
			$(this).css("backgroundColor","#efefef");
		});
		calendar.$panel.find(".year-select,.month-select").change(function() {
	        calendar._update();
		});
		calendar.$panel.find(".today-show").click(function() {
			calendar.date = new Date();
			calendar.year = calendar.date.getFullYear();
			calendar.month = calendar.date.getMonth() + 1;
			calendar._changeSelect();
		    calendar._bindData();
		    calendar.dateControl.value = calendar._format(calendar.date,calendar.config.date2stringPattern);
		    if(calendar.dateControl.onchange){
				calendar.dateControl.onchange();
			}
		    calendar.$panel.slideUp(calendar.config.slideUpTime);
		});

	    var $input = $(calendar.config.selector);
	    $input.click(function(){
	        calendar.show(this);
	    });
	    if(calendar.config.readOnlyFlag) {
	        $input.attr("readonly","readonly");
	    };

	    $(document).on('click.mycalendar', function(){
	    	if(window.event.srcElement != calendar.dateControl && window.event.srcElement != calendar.$panel[0] && !jQuery.contains(calendar.$panel[0], window.event.srcElement)) {
	    		calendar.$panel.slideUp(calendar.config.slideUpTime);
	    	} 
		});

	    calendar.$panel.hide();
	},	
    //显示日期控件
	"show"            :    function(dateControl) {
		var calendar = this;
        var date = calendar.getInputDate(dateControl);

		calendar.dateControl = dateControl;

		if (date){
			calendar.date = date;
			//calendar.date  = new Date(calendar._toDate(dateControl.value,calendar.config.patternDelimiter, calendar.config.string2datePattern));
			calendar.year  = calendar.date.getFullYear();
			calendar.month = calendar.date.getMonth() + 1;
		} else {
			calendar.date = new Date();
			calendar.year = calendar.date.getFullYear();
			calendar.month = calendar.date.getMonth() + 1;
		}

		calendar._changeSelect();

		calendar._bindData();
		var xy = calendar._getPosition(dateControl);
		calendar.$panel.css({
			left    :    xy.x + "px",
			top     :    (xy.y + dateControl.offsetHeight) + "px"
		});
		calendar.$panel.slideDown(calendar.config.slideDownTime);
	},
    //添加select选项
	"_yearRange"      :    function() {
        var calendar = this;
		var $year =calendar.$panel.find(".year-select");
		for(var i = calendar.config.beginYear; i <= calendar.config.endYear; i++) {
	        $year.append("<option value='" + i + "'>" + i + "年" + "<\/option>");
		}
	},

	"_goPrevMonth"     :    function() {
		var calendar = this;
	    if(calendar.year == calendar.config.beginYear && calendar.month == 1) {return;}
	    calendar.month--;
	    if(calendar.month == 0) {
	    	calendar.year--;
	    	calendar.month = 12;
	    }
	    calendar.date = new Date(calendar.year,calendar.month-1,1);
	    calendar._changeSelect();
	    calendar._bindData();
	},

	"_goNextMonth"     :    function() {
		var calendar = this;
	    if(calendar.year == calendar.config.endYear && calendar.month == 12) {return;}
	    calendar.month++;
	    if(calendar.month == 13) {
	    	calendar.year++;
	    	calendar.month = 1;
	    }
	    calendar.date = new Date(calendar.year,calendar.month-1,1);
	    calendar._changeSelect();
	    calendar._bindData();
	},
    //改变选中的select option
	"_changeSelect"   :    function() {
		var $year = this.$panel.find(".year-select")[0];
		var $month = this.$panel.find(".month-select")[0];
		//var $yearSelectLast = $(".year-select option:last").attr("index");
		var year = this.date.getFullYear();
		var month = this.date.getMonth() + 1;
		for (var i= 0; i < $year.options.length + 1; i++){
			if ($year.options[i].value == year){
				$year[i].selected = true;
				break;
			}
		}
		for (i= 0; i < 12; i++){
			if ($month.options[i].value == month){
				$month[i].selected = true;
				break;
			}
		}
	},
    //为日期控件绑定数据与事件
    "_bindData"        :    function() {
    	var calendar = this;    
	    var datesObj = calendar._getWeeksObj(this.date);
	    var ret = [].slice.call(datesObj.ret);
	    var prevLen = datesObj.prev;
	    var curLen = datesObj.cur + prevLen;
	    var nextLen = datesObj.next + curLen;
	    var dateBody;
	    var dateArr = [];
	    var arr = [];
	    var $td;

	    while(ret.length) {
			dateArr.push(ret.splice(0,7));
		}

		calendar._reDrawDate(dateArr);

	    var $tds = calendar.$panel.find(".calendar-table td");
	    for (i = 0; i < prevLen; i++) {
	    	$td = $tds.eq(i);
	    	$td.css({"color":calendar.config.colorOtherMonth,"backgroundColor":calendar.config.bg});
	    	if(this.config.otherMonthShow) {
	    		$td.css("cursor","pointer");
	    		$td.on("click",calendar._bindClick())
	    		   .on("mouseover",{backgroundColor:calendar.config.bgHover},calendar._bindMouseOverOut)
		    	   .on("mouseout",{backgroundColor:calendar.config.bg},calendar._bindMouseOverOut);
	    	} else {
	            $td.css("cursor","default");
	    	}
	    }
	    for (i = prevLen; i < curLen; i++) {
	    	$td = $tds.eq(i);
	    	$td.css({"cursor":"pointer","color":calendar.config.colorThisMonth});
	        $td.on("click",calendar._bindClick());
	        var today = new Date();
			//today
			if (today.getFullYear() == calendar.date.getFullYear() && today.getMonth() == calendar.date.getMonth() && today.getDate() == datesObj.ret[i].getDate()) {
				$td.css("backgroundColor",calendar.config.bgToday);
				$td.on("mouseover",{backgroundColor:calendar.config.bgHover},calendar._bindMouseOverOut)
		    	   .on("mouseout",{backgroundColor:calendar.config.bgToday},calendar._bindMouseOverOut);
			} else if (calendar.date.getDate() == datesObj.ret[i].getDate()){
			// the date cube on calender whose value == input.value
				$td.css("backgroundColor",calendar.config.bgSelect);
			} else {//normal
				$td.css("backgroundColor",calendar.config.bg);
				$td.on("mouseover",{backgroundColor:calendar.config.bgHover},calendar._bindMouseOverOut)
		    	   .on("mouseout",{backgroundColor:calendar.config.bg},calendar._bindMouseOverOut);
			}
	    }
	    for (var i = curLen; i < nextLen; i++) {
	    	$td = $tds.eq(i);
	        $td.css("color",calendar.config.colorOtherMonth);
		    if(this.config.otherMonthShow) {
		    	$td.css("cursor","pointer");
		    	$td.on("click",calendar._bindClick())
		    	   .on("mouseover",{backgroundColor:calendar.config.bgHover},calendar._bindMouseOverOut)
		    	   .on("mouseout",{backgroundColor:calendar.config.bg},calendar._bindMouseOverOut);
		    } else {
	            $td.css("cursor","default");
	    	}
	    }
    },
    //获取日期控件显示的位置
    "_getPosition"     :    function(e) {
        var x = e.offsetLeft;
		var y = e.offsetTop;
		while(e = e.offsetParent) {
			x += e.offsetLeft;
			y += e.offsetTop;
		}
		return {"x":x,"y":y};   	
    },
    //用来计算日期控件需要显示的日期
    "_getWeeksObj"     :    function(cur) {
        var year = cur.getFullYear();
		var month = cur.getMonth() + 1;
		var date = cur.getDate();
		var dates = []; 
		//用当月第一天在一周中的日期作为上个月要显示的天数
		var prevMonthDay = new Date(year,month-1,1).getDay();
		//用当月最后一天在一个月中的日期值作为当月的天数
		var curMonthDay = new Date(year,month,0).getDate();
		//用当月最后一天在一周中的日期与6的差作为下个月要显示的天数
		//var nextMonthDay = 6 - new Date(year,month,0).getDay();
		var nextMonthDay = 42 - prevMonthDay - curMonthDay;

		

		//当月的天数
		for(var j = 1; j <= curMonthDay; j++) {
		//	cur = new Date(year,month,j);
		//	dates.push(cur.getDate());
		//更加利于阅读、切合思路的方法与更简便的方法
			dates.push(new Date(year,month-1,j));
		}
		if(this.config.otherMonthShow) {
			//上个月需要显示的天数
			for(var i = 0; i < prevMonthDay; i++) {
				cur = new Date(year,month - 1,-1 * i);
				dates.unshift(cur);
			} 

			//下个月需要显示的天数
			for(var k = 1; k <= nextMonthDay; k++) {
			//	cur = new Date(year,month,k);
			//	dates.push(cur.getDate());
			//更加利于阅读、切合思路的方法与更简便的方法
				dates.push(new Date(year,month,k));
			}
		}	else {

			//上个月需要显示的天数
			for(i = 0; i < prevMonthDay; i++) {
				dates.unshift('&nbsp;');
			} 

			//下个月需要显示的天数
			for(k = 1; k <= nextMonthDay; k++) {
				dates.push('&nbsp;');
			}
		}	

	    //返回日期对象，包括日期数组ret,以及上月、本月、下月的天数
		return {
			"ret":dates,
			"prev":prevMonthDay,
			"cur":curMonthDay,
			"next":nextMonthDay
		};
    },
    //绑定鼠标移入移出事件
    "_bindMouseOverOut":    function(event) {
    	$(this).css("backgroundColor",event.data.backgroundColor);
    },
    //绑定点击事件
    "_bindClick"       :    function() {
		var calendar = this;
		return function() {
			var td = this;
			var date = calendar.getInputDate(td);
			/*if(calendar.dateControl) {
	            calendar.dateControl.value = calendar._format(date,calendar.config.date2stringPattern);
	            $(calendar.dateControl).data("date",date);
			}			
			if(oldVal != calendar.dateControl.value){
				if(calendar.dateControl.onchange){
					calendar.dateControl.onchange();
				}
			}*/
			calendar.setInputDate(calendar.dateControl,date);
			calendar.$panel.slideUp(calendar.config.slideUpTime);
		}	    		
    },
    //更新日期控件  
    "_update"          :    function() {
    	var yearSelect = this.$panel.find(".year-select")[0];
		var monthSelect = this.$panel.find(".month-select")[0];
		this.year = yearSelect.options[yearSelect.selectedIndex].value;
		this.month = monthSelect.options[monthSelect.selectedIndex].value;
		this.date = new Date(this.year,this.month - 1,1);
		this._bindData();
	},  
    //重绘日期控件
	"_reDrawDate"      :    function(dateArr) {
		var calendar = this;
		var $td;
		var $tr;
		var $tb = $('<tbody/>');
	    for(var i = 0; i < 6; i++) {
	    	$tr = $('<tr/>').appendTo($tb);
			for(var j = 0; j < 7; j++) {
				$td = $('<td>' + dateArr[i][j].getDate() + '<\/td>');
                $td.data("date",dateArr[i][j]);
                $td.appendTo($tr);
			}
		}
		calendar.$panel.find(".calendar-table tbody").replaceWith($tb);		
	},

    "setInputDate"          :    function(input,date) {
    	var calendar = this;
    	var oldVal = input.value;
        if(input) {
            input.value = calendar._format(date,calendar.config.date2stringPattern);
            $(input).data("date",date);
		}			
		if(oldVal != input.value){
			if(input.onchange){
				input.onchange();
			}
		}
    },

    "getInputDate"          :    function(input) {
    	var calendar = this;
        return $(input).data("date");
    },

    //日期对象转字符串
	"_format"          :    function(date,style) {
		var o = {
			"m+" : date.getMonth() + 1, //month
			"d+" : date.getDate(),      //day
			"h+" : date.getHours(),     //hour
			"M+" : date.getMinutes(),   //minute
			"s+" : date.getSeconds(),   //second
			"w+" : "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(date.getDay()),   //week
			"q+" : Math.floor((date.getMonth() + 3) / 3),  //quarter
			"S"  : date.getMilliseconds() //millisecond
		};
		if (/(y+)/.test(style)) {
			style = style.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for(var k in o){
			if (new RegExp("("+ k +")").test(style)){
				style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return style;
	},
    //字符串转日起对象
	"_toDate"          :    function(str, delimiter, pattern) {
		delimiter = delimiter || "-";
		pattern = pattern || "ymd";
		var a = str.split(delimiter);
		var y = parseInt(a[pattern.indexOf("y")], 10);
		//remember to change this next century ;)
		if(y.toString().length <= 2) y += 2000;
		if(isNaN(y)) y = new Date().getFullYear();
		var m = parseInt(a[pattern.indexOf("m")], 10) - 1;
		var d = parseInt(a[pattern.indexOf("d")], 10);
		if(isNaN(d)) d = 1;
		return new Date(y, m, d);
	}

};

window.Calendar = Calendar;

})(window,jQuery);