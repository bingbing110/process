var title=[["州市","营服中心","营服编码","营服状态","毛利","毛利预算完成率","出帐收入(扣减赠费、退费)","","","","","","","","成本合计","佣金","","","","","","","","渠道补贴","终端补贴","卡成本","营业厅房租","装修","水电物业安保费","广告宣传费","业务用品印制及材料费（含配送费、其他）","车辆使用费","招待费","办公费","差旅费","通信费","紧密外包费用"],
           ["","","","","","","2G","3G","4G","专租线","宽带","固话","其他","合计","","2G","3G","4G","专租线","宽带","固网","其他","合计","","","","","","","","","","","","","",""]];
var field=["FACT_UNIT_AMOUNT","COM_UNIT_RATE","INCOME_2G","INCOME_3G","INCOME_4G","INCOME_ZX","INCOME_KD","INCOME_GH","INCOME_OTHER","INCOME_TOTAL","GRIDDING_TOTAL","COMM_2G","COMM_3G","COMM_4G","COMM_ZX","COMM_KD","COMM_HARDLINK","COMM_GY","COMM_TOTAL","CHANNEL","ZDBT_AMOUNT","KVB_AMOUNT","FZF_AMOUNT","ZX_AMOUNT","SDWYF_AMOUNT","ADS_AMOUNT","YWYPCLF_AMOUNT","CLSYF_AMOUNT","ZDF_AMOUNT","BGF_AMOUNT","CLF_AMOUNT","TXF_AMOUNT","FEE_JMWB"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
$(function(){
	var maxDate=getMaxDate("PMRT.TAB_MRT_UNIT_ABILITY_MON");
	$("#dealDate").val(maxDate);
    $("#searchBtn").click(function(){
		//$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		report.showSubRow();
        ///////////////////////////////////////////
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
    var report=new LchReport({
		title:title,
		closeHeader:true,
		field:["ROW_NAME","UNIT_NAME","UNIT_ID","UNIT_TYPE"].concat(field),
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var sql='';
			var code='';
			var orgLevel='';
			var dealDate=$("#dealDate").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var where=" WHERE DEAL_DATE = "+dealDate;
			var level=0;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					level=2;
				}else if(orgLevel==3){//点击市
					where+=" AND GROUP_ID_1='"+code+"'";
					level=3;
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(where,level);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					level=1;
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+code+"'";
					level=2;
				}else if(orgLevel==3){//营服
					level=3;
					where+=" AND UNIT_ID IN("+_unit_relation(code)+")";
				}else {
					return {data:[],extra:{}};
				}
				sql=getSql(where,level);
				orgLevel++;
			}
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
});

function downsAll() {
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var code=$("#code").val();
	var where=" WHERE DEAL_DATE = "+dealDate;
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	
	if (orgLevel == 1) {//省
		
	} else if(orgLevel == 2){//市
		where += " AND GROUP_ID_1='"+code+"'";
	} else if(orgLevel == 3){//营服
		where += " AND UNIT_ID='"+code+"'";
	} else{
		where+=" AND 1=2";
	}
	if(regionCode!=''){
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND UNIT_ID = '"+unitCode+"'";
	}
	var sql=getSql(where,3);
	var showtext = '云南联通营服效能明细表-市场' + dealDate;
	downloadExcel(sql,title,showtext);
}

function getSql(where,level){
  var regionCode=$("#regionCode").val();
  var unitCode=$("#unitCode").val();
  var dealDate=$("#dealDate").val();
  if(regionCode!=''){
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND UNIT_ID = '"+unitCode+"'";
	}
  if(level==1){
	  return "SELECT                                                                                                                                                                                 "+
	  "                       '86000' ROW_ID,                                                                                                                                                 "+
	  "                       '云南省' ROW_NAME,                                                                                                                                              "+
	  "                       '--' UNIT_NAME,                                                                                                                                                 "+
	  "                       '--' UNIT_ID,                                                                                                                                                   "+
	  "                       '--' UNIT_TYPE,                                                                                                                                                 "+
	  "                       SUM(NVL(FACT_UNIT_AMOUNT,0)) FACT_UNIT_AMOUNT,                                                                                                                  "+
	  "                       CASE WHEN SUM(NVL(YS_UNIT_AMOUNT,0))=0 THEN '-' ELSE PODS.GET_RADIX_POINT(SUM(NVL(FACT_UNIT_AMOUNT,0))*100/SUM(NVL(YS_UNIT_AMOUNT,0))||'%',2) END COM_UNIT_RATE,"+
	  "                       SUM(NVL(INCOME_2G,0)) INCOME_2G,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_3G,0)) INCOME_3G,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_4G,0)) INCOME_4G,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_ZX,0)) INCOME_ZX,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_KD,0)) INCOME_KD,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_GH,0)) INCOME_GH,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_OTHER,0)) INCOME_OTHER,                                                                                                                          "+
	  "                       SUM(NVL(INCOME_TOTAL,0)) INCOME_TOTAL,                                                                                                                          "+
	  "                       SUM(NVL(GRIDDING_TOTAL,0)) GRIDDING_TOTAL,                                                                                                                      "+
	  "                       SUM(NVL(COMM_2G,0)) COMM_2G,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_3G,0)) COMM_3G,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_4G,0)) COMM_4G,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_ZX,0)) COMM_ZX,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_KD,0)) COMM_KD,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_HARDLINK,0)) COMM_HARDLINK,                                                                                                                        "+
	  "                       SUM(NVL(COMM_GY,0)) COMM_GY,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_TOTAL,0)) COMM_TOTAL,                                                                                                                              "+
	  "                       SUM(NVL(CHANNEL,0)) CHANNEL,                                                                                                                                    "+
	  "                       SUM(NVL(ZDBT_AMOUNT,0)) ZDBT_AMOUNT,                                                                                                                            "+
	  "                       SUM(NVL(KVB_AMOUNT,0)) KVB_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(FZF_AMOUNT,0)) FZF_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(ZX_AMOUNT,0)) ZX_AMOUNT,                                                                                                                                "+
	  "                       SUM(NVL(SDWYF_AMOUNT,0)) SDWYF_AMOUNT,                                                                                                                          "+
	  "                       SUM(NVL(ADS_AMOUNT,0)) ADS_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(YWYPCLF_AMOUNT,0)) YWYPCLF_AMOUNT,                                                                                                                      "+
	  "                       SUM(NVL(CLSYF_AMOUNT,0)) CLSYF_AMOUNT,                                                                                                                          "+
	  "                       SUM(NVL(ZDF_AMOUNT,0)) ZDF_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(BGF_AMOUNT,0)) BGF_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(CLF_AMOUNT,0)) CLF_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(TXF_AMOUNT,0)) TXF_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(FEE_JMWB,0)) FEE_JMWB                                                                                                                                   "+
	  "                  FROM PMRT.TAB_MRT_UNIT_ABILITY_MON                                                                                                                                   "+
	     where;     
  }else if(level==2){
	  return "SELECT                                                                                                                                                                          "+
	  "                       GROUP_ID_1 ROW_ID,                                                                                                                                              "+
	  "                       GROUP_ID_1_NAME ROW_NAME,                                                                                                                                       "+
	  "                       '--' UNIT_NAME,                                                                                                                                                 "+
	  "                       '--' UNIT_ID,                                                                                                                                                   "+
	  "                       '--' UNIT_TYPE,                                                                                                                                                 "+
	  "                       SUM(NVL(FACT_UNIT_AMOUNT,0)) FACT_UNIT_AMOUNT,                                                                                                                  "+
	  "                       CASE WHEN SUM(NVL(YS_UNIT_AMOUNT,0))=0 THEN '-' ELSE PODS.GET_RADIX_POINT(SUM(NVL(FACT_UNIT_AMOUNT,0))*100/SUM(NVL(YS_UNIT_AMOUNT,0))||'%',2) END COM_UNIT_RATE,"+
	  "                       SUM(NVL(INCOME_2G,0)) INCOME_2G,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_3G,0)) INCOME_3G,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_4G,0)) INCOME_4G,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_ZX,0)) INCOME_ZX,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_KD,0)) INCOME_KD,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_GH,0)) INCOME_GH,                                                                                                                                "+
	  "                       SUM(NVL(INCOME_OTHER,0)) INCOME_OTHER,                                                                                                                          "+
	  "                       SUM(NVL(INCOME_TOTAL,0)) INCOME_TOTAL,                                                                                                                          "+
	  "                       SUM(NVL(GRIDDING_TOTAL,0)) GRIDDING_TOTAL,                                                                                                                      "+
	  "                       SUM(NVL(COMM_2G,0)) COMM_2G,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_3G,0)) COMM_3G,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_4G,0)) COMM_4G,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_ZX,0)) COMM_ZX,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_KD,0)) COMM_KD,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_HARDLINK,0)) COMM_HARDLINK,                                                                                                                        "+
	  "                       SUM(NVL(COMM_GY,0)) COMM_GY,                                                                                                                                    "+
	  "                       SUM(NVL(COMM_TOTAL,0)) COMM_TOTAL,                                                                                                                              "+
	  "                       SUM(NVL(CHANNEL,0)) CHANNEL,                                                                                                                                    "+
	  "                       SUM(NVL(ZDBT_AMOUNT,0)) ZDBT_AMOUNT,                                                                                                                            "+
	  "                       SUM(NVL(KVB_AMOUNT,0)) KVB_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(FZF_AMOUNT,0)) FZF_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(ZX_AMOUNT,0)) ZX_AMOUNT,                                                                                                                                "+
	  "                       SUM(NVL(SDWYF_AMOUNT,0)) SDWYF_AMOUNT,                                                                                                                          "+
	  "                       SUM(NVL(ADS_AMOUNT,0)) ADS_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(YWYPCLF_AMOUNT,0)) YWYPCLF_AMOUNT,                                                                                                                      "+
	  "                       SUM(NVL(CLSYF_AMOUNT,0)) CLSYF_AMOUNT,                                                                                                                          "+
	  "                       SUM(NVL(ZDF_AMOUNT,0)) ZDF_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(BGF_AMOUNT,0)) BGF_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(CLF_AMOUNT,0)) CLF_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(TXF_AMOUNT,0)) TXF_AMOUNT,                                                                                                                              "+
	  "                       SUM(NVL(FEE_JMWB,0)) FEE_JMWB                                                                                                                                   "+
	  "                  FROM PMRT.TAB_MRT_UNIT_ABILITY_MON                                                                                                                                   "+
	                     where+
	  "                 GROUP BY GROUP_ID_1, GROUP_ID_1_NAME                                                                                                                                  "+
	  "                 ORDER BY GROUP_ID_1                                                                                                                                                   ";
  }else if(level==3){
	  return "SELECT          GROUP_ID_1_NAME,                                                                                                                                                 "+
	  "                       UNIT_NAME ROW_NAME,                                                                                                                                                       "+
	  "                       UNIT_ID,                                                                                                                                                         "+
	  "                       UNIT_TYPE,                                                                                                                                                       "+
	  "                       SUM(NVL(FACT_UNIT_AMOUNT,0)) FACT_UNIT_AMOUNT,                                                                                                                   "+
	  "                       CASE WHEN SUM(NVL(YS_UNIT_AMOUNT,0))=0 THEN '-' ELSE PODS.GET_RADIX_POINT(SUM(NVL(FACT_UNIT_AMOUNT,0))*100/SUM(NVL(YS_UNIT_AMOUNT,0))||'%',2) END COM_UNIT_RATE, "+
	  "                       SUM(NVL(INCOME_2G,0)) INCOME_2G,                                                                                                                                 "+
	  "                       SUM(NVL(INCOME_3G,0)) INCOME_3G,                                                                                                                                 "+
	  "                       SUM(NVL(INCOME_4G,0)) INCOME_4G,                                                                                                                                 "+
	  "                       SUM(NVL(INCOME_ZX,0)) INCOME_ZX,                                                                                                                                 "+
	  "                       SUM(NVL(INCOME_KD,0)) INCOME_KD,                                                                                                                                 "+
	  "                       SUM(NVL(INCOME_GH,0)) INCOME_GH,                                                                                                                                 "+
	  "                       SUM(NVL(INCOME_OTHER,0)) INCOME_OTHER,                                                                                                                           "+
	  "                       SUM(NVL(INCOME_TOTAL,0)) INCOME_TOTAL,                                                                                                                           "+
	  "                       SUM(NVL(GRIDDING_TOTAL,0)) GRIDDING_TOTAL,                                                                                                                       "+
	  "                       SUM(NVL(COMM_2G,0)) COMM_2G,                                                                                                                                     "+
	  "                       SUM(NVL(COMM_3G,0)) COMM_3G,                                                                                                                                     "+
	  "                       SUM(NVL(COMM_4G,0)) COMM_4G,                                                                                                                                     "+
	  "                       SUM(NVL(COMM_ZX,0)) COMM_ZX,                                                                                                                                     "+
	  "                       SUM(NVL(COMM_KD,0)) COMM_KD,                                                                                                                                     "+
	  "                       SUM(NVL(COMM_HARDLINK,0)) COMM_HARDLINK,                                                                                                                         "+
	  "                       SUM(NVL(COMM_GY,0)) COMM_GY,                                                                                                                                     "+
	  "                       SUM(NVL(COMM_TOTAL,0)) COMM_TOTAL,                                                                                                                               "+
	  "                       SUM(NVL(CHANNEL,0)) CHANNEL,                                                                                                                                     "+
	  "                       SUM(NVL(ZDBT_AMOUNT,0)) ZDBT_AMOUNT,                                                                                                                             "+
	  "                       SUM(NVL(KVB_AMOUNT,0)) KVB_AMOUNT,                                                                                                                               "+
	  "                       SUM(NVL(FZF_AMOUNT,0)) FZF_AMOUNT,                                                                                                                               "+
	  "                       SUM(NVL(ZX_AMOUNT,0)) ZX_AMOUNT,                                                                                                                                 "+
	  "                       SUM(NVL(SDWYF_AMOUNT,0)) SDWYF_AMOUNT,                                                                                                                           "+
	  "                       SUM(NVL(ADS_AMOUNT,0)) ADS_AMOUNT,                                                                                                                               "+
	  "                       SUM(NVL(YWYPCLF_AMOUNT,0)) YWYPCLF_AMOUNT,                                                                                                                       "+
	  "                       SUM(NVL(CLSYF_AMOUNT,0)) CLSYF_AMOUNT,                                                                                                                           "+
	  "                       SUM(NVL(ZDF_AMOUNT,0)) ZDF_AMOUNT,                                                                                                                               "+
	  "                       SUM(NVL(BGF_AMOUNT,0)) BGF_AMOUNT,                                                                                                                               "+
	  "                       SUM(NVL(CLF_AMOUNT,0)) CLF_AMOUNT,                                                                                                                               "+
	  "                       SUM(NVL(TXF_AMOUNT,0)) TXF_AMOUNT,                                                                                                                               "+
	  "                       SUM(NVL(FEE_JMWB,0)) FEE_JMWB                                                                                                                                    "+
	  "                  FROM PMRT.TAB_MRT_UNIT_ABILITY_MON                                                                                                                                    "+
	                    where+
	  "                 GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,                                                                                                                                   "+
	  "                       UNIT_NAME,                                                                                                                                                       "+
	  "                       UNIT_ID,                                                                                                                                                         "+
	  "                       UNIT_TYPE                                                                                                                                                        "+
	  "ORDER BY GROUP_ID_1,UNIT_ID";                                            
  }
}

function getFristMon(dealDate){
	 return dealDate.substring(0,4)+"01";
}