/*liangchh:2013-06-21 ���ڿؼ�*/
;TG.define(function() {

var DEFAULT_CONFIG = {
	//Ĭ��������Ϣ
	beginYear           :1990,         //��ѡ����������
	endYear             :2020, 		   //��ѡ����������
	readOnlyFlag        :true,         //�Ƿ���ֻ���ı�־
	otherMonthShow      :true,         //�Ƿ���ʾǰ�������·ݵĵı�־��Ĭ�ϲ���ʾ��true	

    //���ڿؼ���CSS��ʽ
	bg                  :"#efefef",     
    bgHover             :"#4894d5"/*"#ffcc00"*/,
    bgSelect            :"#4894d5",
    bgToday             :"#00cc33",
    colorOtherMonth     :"#ccc",
    colorThisMonth      :"#000",
    colorHover          :"#fff",
    weekHeaderColor     :"#4894d5",


	slideDownTime       :200,           //���ڿؼ����ֶ���ʱ��
	slideUpTime         :200,           //���ڿؼ���ʧ����ʱ��
	patternDelimiter    :"-",		    //�ַ�����ʽ���ָ���
	date2stringPattern  :"yyyy-mm-dd",  //����ת�ַ�����ʽ
	string2datePattern  :"ymd",		    //�ַ���ת���ڸ�ʽ
	selector            :".calendar"   //��Ҫ�����ڿؼ���class����
	
};

//���ڿؼ����캯��
var Calendar = function(config) {
	
	//�������������Ϣ
	config = $.extend({} , DEFAULT_CONFIG , config || {});

	this.config = config;
    
    this.$panel = null;
    this.dateControl = null;
    //this.$iframe = null;
    this.weeks = "��һ����������".split("");
    this.date = new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth() + 1;

};

Calendar.prototype = {
	//�������ڿؼ���ܡ���ʽ����¼�
    "constructor": Calendar,
	"draw"            :    function() {
		var calendar = this;

		var arr = [];

	    arr.push("<iframe name='calendar-iframe' class='calendar-iframe' width='200' height='242' scrolling='no' frameborder='0' style='margin:0px;position:absolute;z-index:-2;opacity:0;'><\/iframe>");
		arr.push('<table class="calendar-table" width="100%" border="0" cellpadding="3" cellspacing="1" align="center">');
		arr.push('<thead><tr class="calendar-head">');
		arr.push('<th><input name="go-prev-month" type="button" class="go-prev-month" value="&lt;" \/><\/th>');
		arr.push('<th colspan="5"><select name="year-select" class="year-select"><\/select><select name="month-select" class="month-select"><option value="1">1��<\/option><option value="2">2��<\/option><option value="3">3��<\/option><option value="4">4��<\/option><option value="5">5��<\/option><option value="6">6��<\/option><option value="7">7��<\/option><option value="8">8��<\/option><option value="9">9��<\/option><option value="10">10��<\/option><option value="11">11��<\/option><option value="12">12��<\/option><\/select><\/th>');
		arr.push('<th><input name="go-next-month" type="button" class="go-next-month" value="&gt;" \/><\/th>');
		arr.push('<\/tr>');
		arr.push('<tr>');

		for(var i = 0; i < 7; i++) {
			arr.push('<th class="week-header">');
			arr.push(calendar.weeks[i]);
			arr.push('<\/th>');	
		}

		arr.push('<\/tr><\/thead><tbody><\/tbody>');
		arr.push('<tfoot class="calendar-foot">');
		/*arr.push('<th><\/th>');*/
		arr.push('<tr><th class="today-show" colspan="7"><\/th><\/tr>');
		arr.push('<tr><th colspan="7"><button class="remove">�������<\/button><\/th><\/tr>');
	    arr.push('<\/tr><\/tfoot><\/table>');

		calendar.$panel = $("<div class='calendar-panel'><\/div>");
	    $(document.body).append(calendar.$panel);
	    calendar.$panel.html(arr.join(""));

	    calendar.$panel.find(".today-show").html("������" + calendar.year + "��" + calendar.month + "��" + calendar.date.getDate() + "�� ����" + this.weeks[calendar.date.getDay()]);


	    if(!$("calendar-style")[0]) {
		    var styles = ".calendar-panel{width:200px;background:#fff;padding:2px;position:absolute;z-index:20001;overflow:hidden;border:1px solid #cccccc;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;-webkit-box-shadow:4px 4px 1em rgba(0,0,0,0.3);-moz-box-shadow:4px 4px 1em rgba(0,0,0,0.3);box-shadow:4px 4px 1em rgba(0,0,0,0.3);}\n" +
	                 ".calendar-panel table{font-size:12px;font-weight:600;text-align:center;background-color:#ffffff;border-collapse:separate;border-spacing:2px;}\n" +
                     ".calendar-panel th{text-align: center;}\n" +
	                 ".calendar-panel td{background-color:#efefef;height:20px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;}\n" +
	                 "th.week-header{background-color:" + this.config.weekHeaderColor + ";color:#ffffff;width:24px;height:20px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;}\n" +
	                 ".calendar-head th{padding:4px 0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;}\n" +
	                 ".calendar-head input{border:1px solid #ccc;background-color:#efefef;width:20px;height:20px;cursor:pointer;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;}\n" + 
	                 ".calendar-head select{font-size:12px;background-color:#efefef;padding:0;}\n" +
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
		    //calendar.dateControl.value = calendar._format(calendar.date,calendar.config.date2stringPattern);
            calendar.setInputDate(calendar.dateControl, calendar.date);
		    /*if(calendar.dateControl.onchange){
				calendar.dateControl.onchange();
			}*/
		    calendar.$panel.slideUp(calendar.config.slideUpTime);
		});
        calendar.$panel.find(".remove").click(function() {
            //calendar.setInputDate(calendar.dateControl, "");
            calendar.dateControl.value = "";
            $(calendar.dateControl).data("date","");
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
    //��ʾ���ڿؼ�
	"show"            :    function(dateControl) {
		var calendar = this;
        var date = calendar.getInputDate(dateControl);

		calendar.dateControl = dateControl;

		if (date){
            if (!(date instanceof Date)) {
                date  = new Date(date);
            }
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
    //���selectѡ��
	"_yearRange"      :    function() {
        var calendar = this;
		var $year =calendar.$panel.find(".year-select");
		for(var i = calendar.config.beginYear; i <= calendar.config.endYear; i++) {
	        $year.append("<option value='" + i + "'>" + i + "��" + "<\/option>");
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
    //�ı�ѡ�е�select option
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
    //Ϊ���ڿؼ����������¼�
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
	    		   .on("mouseover",{backgroundColor:calendar.config.bgHover,color:calendar.config.colorHover},calendar._bindMouseOverOut)
		    	   .on("mouseout",{backgroundColor:calendar.config.bg,color:calendar.config.colorOtherMonth},calendar._bindMouseOverOut);
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
				$td.on("mouseover",{backgroundColor:calendar.config.bgHover, color:calendar.config.colorHover},calendar._bindMouseOverOut)
		    	   .on("mouseout",{backgroundColor:calendar.config.bgToday, color:calendar.config.colorThisMonth},calendar._bindMouseOverOut);
			} else if (calendar.date.getDate() == datesObj.ret[i].getDate()){
			// the date cube on calender whose value == input.value
				$td.css({"backgroundColor":calendar.config.bgSelect});
			} else {//normal
				$td.css("backgroundColor",calendar.config.bg);
				$td.on("mouseover",{backgroundColor:calendar.config.bgHover, color:calendar.config.colorHover},calendar._bindMouseOverOut)
		    	   .on("mouseout",{backgroundColor:calendar.config.bg, color:calendar.config.colorThisMonth},calendar._bindMouseOverOut);
			}
	    }
	    for (var i = curLen; i < nextLen; i++) {
	    	$td = $tds.eq(i);
	        $td.css("color",calendar.config.colorOtherMonth);
		    if(this.config.otherMonthShow) {
		    	$td.css("cursor","pointer");
		    	$td.on("click",calendar._bindClick())
		    	   .on("mouseover",{backgroundColor:calendar.config.bgHover, color:calendar.config.colorHover},calendar._bindMouseOverOut)
		    	   .on("mouseout",{backgroundColor:calendar.config.bg, color: calendar.config.colorOtherMonth},calendar._bindMouseOverOut);
		    } else {
	            $td.css("cursor","default");
	    	}
	    }
    },
    //��ȡ���ڿؼ���ʾ��λ��
    "_getPosition"     :    function(e) {
        var x = e.offsetLeft;
		var y = e.offsetTop;
		while(e = e.offsetParent) {
			x += e.offsetLeft;
			y += e.offsetTop;
		}
		return {"x":x,"y":y};   	
    },
    //�����������ڿؼ���Ҫ��ʾ������
    "_getWeeksObj"     :    function(cur) {
        var year = cur.getFullYear();
		var month = cur.getMonth() + 1;
		var date = cur.getDate();
		var dates = []; 
		//�õ��µ�һ����һ���е�������Ϊ�ϸ���Ҫ��ʾ������
		var prevMonthDay = new Date(year,month-1,1).getDay();
		//�õ������һ����һ�����е�����ֵ��Ϊ���µ�����
		var curMonthDay = new Date(year,month,0).getDate();
		//�õ������һ����һ���е�������6�Ĳ���Ϊ�¸���Ҫ��ʾ������
		//var nextMonthDay = 6 - new Date(year,month,0).getDay();
		var nextMonthDay = 42 - prevMonthDay - curMonthDay;

		

		//���µ�����
		for(var j = 1; j <= curMonthDay; j++) {
		//	cur = new Date(year,month,j);
		//	dates.push(cur.getDate());
		//���������Ķ����к�˼·�ķ���������ķ���
			dates.push(new Date(year,month-1,j));
		}
		if(this.config.otherMonthShow) {
			//�ϸ�����Ҫ��ʾ������
			for(var i = 0; i < prevMonthDay; i++) {
				cur = new Date(year,month - 1,-1 * i);
				dates.unshift(cur);
			} 

			//�¸�����Ҫ��ʾ������
			for(var k = 1; k <= nextMonthDay; k++) {
			//	cur = new Date(year,month,k);
			//	dates.push(cur.getDate());
			//���������Ķ����к�˼·�ķ���������ķ���
				dates.push(new Date(year,month,k));
			}
		}	else {

			//�ϸ�����Ҫ��ʾ������
			for(i = 0; i < prevMonthDay; i++) {
				dates.unshift('&nbsp;');
			} 

			//�¸�����Ҫ��ʾ������
			for(k = 1; k <= nextMonthDay; k++) {
				dates.push('&nbsp;');
			}
		}	

	    //�������ڶ��󣬰�����������ret,�Լ����¡����¡����µ�����
		return {
			"ret":dates,
			"prev":prevMonthDay,
			"cur":curMonthDay,
			"next":nextMonthDay
		};
    },
    //����������Ƴ��¼�
    "_bindMouseOverOut":    function(event) {
    	$(this).css({"backgroundColor":event.data.backgroundColor, "color": event.data.color});

    },
    //�󶨵���¼�
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
    //�������ڿؼ�  
    "_update"          :    function() {
    	var yearSelect = this.$panel.find(".year-select")[0];
		var monthSelect = this.$panel.find(".month-select")[0];
		this.year = yearSelect.options[yearSelect.selectedIndex].value;
		this.month = monthSelect.options[monthSelect.selectedIndex].value;
		this.date = new Date(this.year,this.month - 1,1);
		this._bindData();
	},  
    //�ػ����ڿؼ�
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
            if (!(date instanceof Date)) {
                date  = new Date(date);
            }
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

    //���ڶ���ת�ַ���
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
    //�ַ���ת�������
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


return $.Calendar = function(config) {
    return new Calendar(config);
};

});