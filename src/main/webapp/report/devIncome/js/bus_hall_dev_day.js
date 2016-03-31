var field=["THIS_2G_NUM","LAST_2G_NUM","THIS_2G_NUM1","LAST_2G_NUM1","THIS_3G_NUM","LAST_3G_NUM","THIS_3G_NUM1","LAST_3G_NUM1","THIS_4G_NUM","LAST_4G_NUM","THIS_4G_NUM1","LAST_4G_NUM1","THIS_NET_NUM","LAST_NET_NUM","THIS_NET_NUM1","LAST_NET_NUM1","THIS_WX_NUM","LAST_WX_NUM","THIS_WX_NUM1","LAST_WX_NUM1","ALL_NUM","LAST_ALL","ALL_NUM1","LAST_ALL_NUM1"];
var title="";
var deal_date="";
var regionName="";
$(function(){
	listRegions();
	title=[["组织架构","2G发展","","","","3G发展","","","","4G发展","","","","固网发展","","","","维系","","","","合计(含维系)","","",""],
	       ["","当日","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比"]];
	var report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var where='';
			var groupBy='';
			var code='';
			var orgLevel='';
			deal_date = $("#time").val();
			regionName=$("#regionName").val();
			
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=' T1.GROUP_ID_1 ROW_ID,T1.GROUP_ID_1_NAME ROW_NAME,';
					groupBy=' GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME ';
				}else if(orgLevel==3){//点击市
					preField=' T1.BUS_HALL_NAME ROW_NAME,';
					groupBy=' GROUP BY T1.BUS_HALL_NAME ';
					where=' AND T1.GROUP_ID_1=\''+code+'\'';
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' \'云南省 \' ROW_NAME,\'86000\' ROW_ID,';
					groupBy=' GROUP BY T1.GROUP_ID_0';
					orgLevel=2;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=' T1.GROUP_ID_1 ROW_ID,T1.GROUP_ID_1_NAME ROW_NAME,';
					groupBy=' GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME ';
					where=' AND T1.GROUP_ID_1=\''+code+'\'';
					orgLevel=3;
				}else{
					return {data:[],extra:{}};
				}
			}
			if(regionName!=""){
				where+=" AND T1.GROUP_ID_1_NAME='"+regionName+"'";
			}
			var sql='SELECT'+preField+getSumSql()+where+groupBy;
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$("#searchBtn").click(function(){
		report.showSubRow();
///////////////////////////////////////////
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
});
function getSumSql() {
	var s="ROUND(SUM(NVL(T1.THIS_2G_NUM,0)),2) THIS_2G_NUM                                                                                                                 "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_2G_NUM,0)) <> 0                                                                                 "+
	"                                                    THEN (SUM(NVL(T1.THIS_2G_NUM,0))-SUM(NVL(T1.LAST_2G_NUM,0)))*100 / SUM(NVL(T1.LAST_2G_NUM,0))      "+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_2G_NUM                                              "+
	"      ,ROUND(SUM(NVL(T1.THIS_2G_NUM1,0)),2) THIS_2G_NUM1                                                                                                        "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_2G_NUM1,0)) <> 0                                                                                "+
	"                                                    THEN (SUM(NVL(T1.THIS_2G_NUM1,0))-SUM(NVL(T1.LAST_2G_NUM1,0)))*100 / SUM(NVL(T1.LAST_2G_NUM1,0))   "+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_2G_NUM1                                             "+
	"      ,ROUND(SUM(NVL(T1.THIS_3G_NUM,0)),2) THIS_3G_NUM                                                                                                          "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_3G_NUM,0)) <> 0                                                                                 "+
	"                                                    THEN (SUM(NVL(T1.THIS_3G_NUM,0))-SUM(NVL(T1.LAST_3G_NUM,0)))*100  / SUM(NVL(T1.LAST_3G_NUM,0))     "+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_3G_NUM                                              "+
	"      ,ROUND(SUM(NVL(T1.THIS_3G_NUM1,0)),2) THIS_3G_NUM1                                                                                                        "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_3G_NUM1,0)) <> 0                                                                                "+
	"                                                    THEN (SUM(NVL(T1.THIS_3G_NUM1,0))-SUM(NVL(T1.LAST_3G_NUM1,0)))*100 / SUM(NVL(T1.LAST_3G_NUM1,0))   "+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_3G_NUM1                                             "+
	"      ,ROUND(SUM(NVL(T1.THIS_4G_NUM,0)),2) THIS_4G_NUM                                                                                                          "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_4G_NUM,0)) <> 0                                                                                 "+
	"                                                    THEN (SUM(NVL(T1.THIS_4G_NUM,0))-SUM(NVL(T1.LAST_4G_NUM,0)))*100  / SUM(NVL(T1.LAST_4G_NUM,0))     "+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_4G_NUM                                              "+
	"      ,ROUND(SUM(NVL(T1.THIS_4G_NUM1,0)),2) THIS_4G_NUM1                                                                                                        "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_4G_NUM1,0)) <> 0                                                                                "+
	"                                                    THEN (SUM(NVL(T1.THIS_4G_NUM1,0))-SUM(NVL(T1.LAST_4G_NUM1,0)))*100 / SUM(NVL(T1.LAST_4G_NUM1,0))   "+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_4G_NUM1                                             "+
	"      ,ROUND(SUM(NVL(T1.THIS_NET_NUM,0)),2) THIS_NET_NUM                                                                                                        "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_NET_NUM,0)) <> 0                                                                                "+
	"                                                    THEN (SUM(NVL(T1.THIS_NET_NUM,0))-SUM(NVL(T1.LAST_NET_NUM,0)))*100  / SUM(NVL(T1.LAST_NET_NUM,0))  "+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_NET_NUM                                             "+
	"      ,ROUND(SUM(NVL(T1.THIS_NET_NUM1,0)),2) THIS_NET_NUM1                                                                                                      "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_NET_NUM1,0)) <> 0                                                                               "+
	"                                                    THEN (SUM(NVL(T1.THIS_NET_NUM1,0))-SUM(NVL(T1.LAST_NET_NUM1,0)))*100 / SUM(NVL(T1.LAST_NET_NUM1,0))"+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_NET_NUM1                                            "+
	"      ,ROUND(SUM(NVL(T1.THIS_WX_NUM,0)),2) THIS_WX_NUM                                                                                                          "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_WX_NUM,0)) <> 0                                                                                 "+
	"                                                    THEN (SUM(NVL(T1.THIS_WX_NUM,0))-SUM(NVL(T1.LAST_WX_NUM,0)))*100  / SUM(NVL(T1.LAST_WX_NUM,0))     "+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_WX_NUM                                              "+
	"      ,ROUND(SUM(NVL(T1.THIS_WX_NUM1,0)),2) THIS_WX_NUM1                                                                                                        "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_WX_NUM1,0)) <> 0                                                                                "+
	"                                                    THEN (SUM(NVL(T1.THIS_WX_NUM1,0))-SUM(NVL(T1.LAST_WX_NUM1,0)))*100 / SUM(NVL(T1.LAST_WX_NUM1,0))   "+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_WX_NUM1                                             "+
	"      ,ROUND(SUM(NVL(T1.ALL_NUM,0)),2) ALL_NUM                                                                                                                  "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_ALL,0)) <> 0                                                                                    "+
	"                                                    THEN (SUM(NVL(T1.ALL_NUM,0))-SUM(NVL(T1.LAST_ALL,0)))*100 / SUM(NVL(T1.LAST_ALL,0))                "+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_ALL                                                 "+
	"      ,ROUND(SUM(NVL(T1.ALL_NUM1,0)),2) ALL_NUM1                                                                                                                "+
	"      ,ROUND(TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T1.LAST_ALL_NUM1,0)) <> 0                                                                               "+
	"                                                    THEN (SUM(NVL(T1.ALL_NUM1,0))-SUM(NVL(T1.LAST_ALL_NUM1,0)))*100 / SUM(NVL(T1.LAST_ALL_NUM1,0))     "+
	"                                                    ELSE 0 END ,'FM99999999990.9999')),2) || '%' LAST_ALL_NUM1                                            "+
	"FROM PMRT.TB_MRT_BUS_HALL_DEV_DAY T1 WHERE T1.DEAL_DATE='"+deal_date+"'";
	
	return s;
}

function listRegions(){
	//条件
	var sql = "select distinct t.GROUP_ID_1,t.GROUP_ID_1_NAME from PMRT.TB_MRT_BUS_HALL_DEV_DAY t where 1=1";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"'";
	}
	sql+=" order by t.group_id_1";
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1_NAME
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1_NAME + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
	} else {
		alert("获取地市信息失败");
	}
}
function downsAll() {
	var preField=' T1.GROUP_ID_1_NAME,T1.BUS_HALL_NAME,T1.OPERATE_TYPE,';
	var where='';
	var orderBy=" ORDER BY T1.GROUP_ID_1,T1.BUS_HALL_NAME";
	var groupBy=" GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,T1.BUS_HALL_NAME,T1.OPERATE_TYPE";
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		where = " AND T1.GROUP_ID_0='" + code + "' ";
	} else {//市
		where = " AND T1.GROUP_ID_1='" + code + "' ";
	} 
	if(regionName!=""){
		where+=" AND T1.GROUP_ID_1_NAME='"+regionName+"'";
	}
	var sql = 'SELECT' + preField + getSumSql()+where+groupBy+orderBy;
	var showtext = '营业厅发展报表' + deal_date;
	title=[["组织架构","渠道","经营模式","2G发展","","","","3G发展","","","","4G发展","","","","固网发展","","","","维系","","","","合计(含维系)","","",""],
		       ["","","","当日","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比","当月","当日环比","累计","累计环比"]];
	downloadExcel(sql,title,showtext);
}
