<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.MONTH, -1);
	String month=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>出帐收入净增用户统计月报表</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/bus_income_increase_mon.js"></script>
</head>
<body style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getRegionCode()%>">
	<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" /> <input type="hidden"
				name="resultMap.rows" />
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="8%" style="padding-left: 10px;">开始账期：</td>
					<td width="24%">
						<input type="text"  class="Wdate default-text-input wper40" readonly="readonly"
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false})" value="<%=month%>" id="startDate">
					</td>
					<td width="8%" style="padding-left: 10px;">结束账期：</td>
					<td width="24%">
						<input type="text"  class="Wdate default-text-input wper40" readonly="true"
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',minDate:'#F{$dp.$D(\'startDate\')}',isShowClear:false})" value="<%=month%>" id="endDate">
					</td>
					<td width="8%">经营模式：</td>
					<td width="15%">
						<select name="operateType" id="operateType" class="default-text-input wper80">
								<option value=''>请选择</option>
								<option value='自营'>自营</option>
								<option value='他营'>他营</option>
								<option value='柜台外包'>柜台外包</option>
						</select>
					</td>
					<td width="5%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 48px;">查询</a>
					</td>
					<td width="5%">
						<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
			</table>
	</form>
	<div id="content">
	</div>
</html>