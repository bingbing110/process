var title="";
var field="";
$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_YWACTIVE_USER_DAY "));
	search();
	$("#searchBtn").click(function(){
		$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		search();
	});
});
function search(){
	var dealDate=$("#dealDate").val();
		//省，地市
		title=[["组织架构","经营模式","自有厅移动网活跃用户数","","全网移动网活跃用户数","","其中自有厅CBSS套餐活跃用户数","","其中全网CBSS套餐活跃用户数","","其中自有厅3G套餐活跃用户数","","其中全网3G套餐活跃用户数","","其中自有厅2G套餐活跃用户数","","其中全网2G套餐活跃用户数",""],
		       ["","","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比"]
			];
		field=["OPERATE_TYPE","THIS_YMLJ_NUM","HB_YW","THIS_QQD_YWLJNUM","HB_QQD_YW","THIS_4GLJ_NUM","HB_4G","THIS_QQD_4GLJNUM","HB_QQD_4G","THIS_3GLJ_NUM","HB_3G","THID_QQD_3GLJNUM","HB_QQD_3G","THIS_2GLJ_NUM","HB_2G","THIS_QQD_2GLJNUM","HB_QQD_2G"];
		//营业厅
	/*	title=[["组织架构","经营模式","自有厅移动网活跃用户数","","","其中自有厅CBSS套餐活跃用户数","","","其中自有厅3G套餐活跃用户数","","","其中自有厅2G套餐活跃用户数","",""],
		       ["","","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化"]];
		field=["OPERATE_TYPE","THIS_YM_NUM","ZJ_YW_NUM","HB_YW","THIS_4G_NUM","ZJ_4G_NUM","HB_4G","THIS_3G_NUM","ZJ_3G_NUM","HB_3G","THIS_2G_NUM","ZJ_2G_NUM","HB_2G"];*/
	var report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			//$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			
			var groupBy='';
			var code='';
			var orgLevel='';
			var region =$("#region").val();
			var chanlCode = $("#chanlCode").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var where=' WHERE DEAL_DATE='+dealDate;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=' HQ_CHAN_CODE ROW_ID,BUS_HALL_NAME ROW_NAME'+getSumSqlNext();
					groupBy=' GROUP BY HQ_CHAN_CODE, BUS_HALL_NAME, OPERATE_TYPE ';
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME'+getSumSql();
					groupBy='  GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,THIS_2G_ALLNUM,THIS_3G_ALLNUM,THIS_4G_ALLNUM,THIS_2G_ALLNUM,THIS_3G_ALLNUM,THIS_4G_ALLNUM,THIS_2G_ALLNUML,THIS_3G_ALLNUML,THIS_4G_ALLNUML  ';
					orgLevel=2;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=' GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME'+getSumSql();
					groupBy='  GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,THIS_2G_ALLNUM,THIS_3G_ALLNUM,THIS_4G_ALLNUM,THIS_2G_ALLNUM,THIS_3G_ALLNUM,THIS_4G_ALLNUM,THIS_2G_ALLNUML,THIS_3G_ALLNUML,THIS_4G_ALLNUML  ';
					where=' AND GROUP_ID_1=\''+region+'\'';
					orgLevel=2;
				}else{
					return {data:[],extra:{}};
				}
			}
			if(regionCode!=""){
				where+=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(chanlCode!=""){
				where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
			}
			var sql='SELECT'+preField+where+groupBy;
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
    ///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
}
function getSumSql() {
	 var s=
	    	"       ,'--' AS OPERATE_TYPE                                                                                                                                                                           "+      //
	    	"       ,SUM(NVL(THIS_2G_NUM,0))+SUM(NVL(THIS_3G_NUM,0))+SUM(NVL(THIS_4G_NUM,0)) THIS_YMLJ_NUM   																									"+  	//--本月累计
	    	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_2G_NUM,0))+SUM(NVL(LAST_3G_NUM,0))+SUM(NVL(LAST_4G_NUM,0))<>0                                                                                   "+      //
	    	"                                  THEN (SUM(NVL(THIS_2G_NUM,0))+SUM(NVL(THIS_3G_NUM,0))+SUM(NVL(THIS_4G_NUM,0))-SUM(NVL(LAST_2G_NUM,0))-SUM(NVL(LAST_3G_NUM,0))-SUM(NVL(LAST_4G_NUM,0)))*100/    "+      //
	    	"                                       （SUM(NVL(LAST_2G_NUM,0))+SUM(NVL(LAST_3G_NUM,0))+SUM(NVL(LAST_4G_NUM,0))）                                                                                  "+      //
	    	"                                  ELSE 0  END ||'%'                                                                                                                                                    "+      //
	    	"                              ,2)         HB_YW                                               																											"+  	//--累计比                     
	    	"       ,NVL(THIS_2G_ALLNUM,0)+NVL(THIS_3G_ALLNUM,0)+NVL(THIS_4G_ALLNUM,0) THIS_QQD_YWLJNUM 																											"+  	//--本月累计     
	    	"       ,PODS.GET_RADIX_POINT(CASE WHEN  NVL(THIS_2G_ALLNUML,0)+NVL(THIS_3G_ALLNUML,0)+NVL(THIS_4G_ALLNUML,0)<>0                                                                                     "+      //
	    	"                                  THEN (NVL(THIS_2G_ALLNUM,0)+NVL(THIS_3G_ALLNUM,0)+NVL(THIS_4G_ALLNUM,0)-NVL(THIS_2G_ALLNUML,0)-NVL(THIS_3G_ALLNUML,0)-NVL(THIS_4G_ALLNUML,0))*100/             "+      //
	    	"                                      （NVL(THIS_2G_ALLNUML,0)+NVL(THIS_3G_ALLNUML,0)+NVL(THIS_4G_ALLNUML,0))                                                                                       "+      //
	    	"                                  ELSE 0  END ||'%'                                                                                                                                                    "+      //
	    	"                              ,2)         HB_QQD_YW                                           																											"+  	//--环比             
	    	"       ,SUM(NVL(THIS_4G_NUM,0)) THIS_4GLJ_NUM                                                																											"+  	//--本月累计
	    	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_4G_NUM,0))<>0                                                                                                                                     "+      //
	    	"                                  THEN (SUM(NVL(THIS_4G_NUM,0))-SUM(NVL(LAST_4G_NUM,0)))*100/SUM(NVL(LAST_4G_NUM,0))                                                                                "+      //
	    	"                                  ELSE 0  END ||'%'                                                                                                                                                    "+      //
	    	"                              ,2)         HB_4G                                                																										"+  	//--累计环比                    
	    	"       ,NVL(THIS_4G_ALLNUM,0)            THIS_QQD_4GLJNUM                                     																										"+  	//--本月累计
	    	"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(THIS_4G_ALLNUML,0)<>0                                                                                                                                      "+      //
	    	"                                  THEN (NVL(THIS_4G_ALLNUM,0)-NVL(THIS_4G_ALLNUML,0))*100/NVL(THIS_4G_ALLNUML,0)                                                                                    "+      //
	    	"                                  ELSE 0  END ||'%'                                                                                                                                                    "+      //
	    	"                              ,2)         HB_QQD_4G                                            																										"+  	//--累计环比
	    	"       ,SUM(NVL(THIS_3G_NUM,0))          THIS_3GLJ_NUM                                        																										"+  	//--本月累计
	    	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_3G_NUM,0))<>0                                                                                                                                     "+      //
	    	"                                  THEN (SUM(NVL(THIS_3G_NUM,0))-SUM(NVL(LAST_3G_NUM,0)))*100/SUM(NVL(LAST_3G_NUM,0))                                                                                "+      //
	    	"                                  ELSE 0  END ||'%'                                                                                                                                                    "+      //
	    	"                              ,2)         HB_3G                                               																											"+  	//--累计环比                     
	    	"       ,NVL(THIS_3G_ALLNUM,0)            THID_QQD_3GLJNUM                                    																											"+  	//--本月累计
	    	"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(THIS_3G_ALLNUML,0)<>0                                                                                                                                      "+      //
	    	"                                  THEN (NVL(THIS_3G_ALLNUM,0)-NVL(THIS_3G_ALLNUML,0))*100/NVL(THIS_3G_ALLNUML,0)                                                                                    "+      //
	    	"                                  ELSE 0  END ||'%'                                           																											"+  	//--累计环比
	    	"                              ,2)         HB_QQD_3G                      																											                    "+      //
	    	"       ,SUM(NVL(THIS_2G_NUM,0))          THIS_2GLJ_NUM                                        																										"+  	//--本月累计
	    	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_2G_NUM,0))<>0																											                            "+      //
	    	"                                  THEN (SUM(NVL(THIS_2G_NUM,0))-SUM(NVL(LAST_2G_NUM,0)))*100/SUM(NVL(LAST_2G_NUM,0))                                                                                "+      //
	    	"                                  ELSE 0  END ||'%'                                                                                                                                                    "+      //
	    	"                              ,2)         HB_2G                                               																											"+  	//--累计环比                     
	    	"       ,NVL(THIS_2G_ALLNUM,0)            THIS_QQD_2GLJNUM                                    																											"+  	//--较上月同日增减
	    	"       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(THIS_2G_ALLNUML,0)<>0                                                                                                                                      "+      //
	    	"                                  THEN (NVL(THIS_2G_ALLNUM,0)-NVL(THIS_2G_ALLNUML,0))*100/NVL(THIS_2G_ALLNUML,0)                                                                                    "+      //
	    	"                                  ELSE 0  END ||'%'                                                                                                                                                    "+      //
	    	"                              ,2)         HB_QQD_2G                                            																										"+  	//--累计环比
	    	" FROM PMRT.TB_MRT_BUS_YWACTIVE_USER_DAY                                                                                                                                                                ";
		return s;
}

function getSumSqlNext() {
    var s=
    	"	      ,OPERATE_TYPE                                                                                                         "+	//
    	"	      ,SUM(NVL(THIS_2G_NUM,0))+SUM(NVL(THIS_3G_NUM,0))+SUM(NVL(THIS_4G_NUM,0)) THIS_YMLJ_NUM   							"+	//--本月累计
    	"	      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_2G_NUM,0))+SUM(NVL(LAST_3G_NUM,0))+SUM(NVL(LAST_4G_NUM,0))<>0         "+	//
    	"	                                 THEN (SUM(NVL(THIS_2G_NUM,0))+SUM(NVL(THIS_3G_NUM,0))+SUM(NVL(THIS_4G_NUM,0))           "+	//
    	"									 -SUM(NVL(LAST_2G_NUM,0))-SUM(NVL(LAST_3G_NUM,0))-SUM(NVL(LAST_4G_NUM,0)))*100/          "+	//
    	"	                                      （SUM(NVL(LAST_2G_NUM,0))+SUM(NVL(LAST_3G_NUM,0))+SUM(NVL(LAST_4G_NUM,0))）        "+	//
    	"	                                 ELSE 0  END ||'%'                                                                          "+	//                                                                           
    	"	                             ,2)         HB_YW                                               								"+	//--累计环比             
    	"	      ,SUM(NVL(THIS_4G_NUM,0)) THIS_4GLJ_NUM                                                								"+	//--本月累计
    	"	      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_4G_NUM,0))<>0                                                           "+	//
    	"	                                 THEN (SUM(NVL(THIS_4G_NUM,0))-SUM(NVL(LAST_4G_NUM,0)))*100/SUM(NVL(LAST_4G_NUM,0))      "+	//
    	"	                                 ELSE 0  END ||'%'                                                                          "+	//
    	"	                             ,2)         HB_4G                                                								"+	//--累计环比
    	"	      ,SUM(NVL(THIS_3G_NUM,0))          THIS_3GLJ_NUM                                        								"+	//--本月累计
    	"	      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_3G_NUM,0))<>0                                                           "+	//
    	"	                                 THEN (SUM(NVL(THIS_3G_NUM,0))-SUM(NVL(LAST_3G_NUM,0)))*100/SUM(NVL(LAST_3G_NUM,0))      "+	//
    	"	                                 ELSE 0  END ||'%'                                                                          "+	//
    	"	                             ,2)         HB_3G                                               								"+	//--累计环比                     
    	"	      ,SUM(NVL(THIS_2G_NUM,0))          THIS_2GLJ_NUM                                        								"+	//--本月累计
    	"	      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_2G_NUM,0))<>0                                                           "+	//
    	"	                                 THEN (SUM(NVL(THIS_2G_NUM,0))-SUM(NVL(LAST_2G_NUM,0)))*100/SUM(NVL(LAST_2G_NUM,0))      "+	//
    	"	                                 ELSE 0  END ||'%'                                                                          "+	//
    	"	                             ,2)         HB_2G                                              						 		"+	//--累计环比
    	"	FROM PMRT.TB_MRT_BUS_YWACTIVE_USER_DAY                                                                                      ";
	return s;
}

function downsAll() {
	var preField=' SELECT GROUP_ID_1_NAME,HQ_CHAN_CODE ROW_ID,BUS_HALL_NAME ROW_NAME'+getSumSqlNext();
	var groupBy=' GROUP BY GROUP_ID_1,GROUP_ID_1_NAME, HQ_CHAN_CODE, BUS_HALL_NAME, OPERATE_TYPE ';
	var orderBy=" ORDER BY GROUP_ID_1,HQ_CHAN_CODE";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var where=' WHERE DEAL_DATE='+dealDate;
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where = " AND T1.GROUP_ID_1='" + region + "' ";
	} 
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(chanlCode!=""){
		where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	var sql = preField + where+groupBy+orderBy;
	var showtext = '移网活跃用户日通报' + dealDate;
	title=[["分公司","营业厅","渠道编码","经营模式","自有厅移动网活跃用户数","","其中自有厅CBSS套餐活跃用户数","","其中自有厅3G套餐活跃用户数","","其中自有厅2G套餐活跃用户数",""],
	       ["","","","","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比","本月累计","累计环比"]];
	downloadExcel(sql,title,showtext);
}
