<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
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
	String time=new SimpleDateFormat("yyyyMM").format(ca.getTime());
	String tablename=request.getParameter("tablename");
	String startDate=request.getParameter("startDate");
	String endDate=request.getParameter("endDate");
	String chanlName=request.getParameter("chanlName");
	String channelAttrs=request.getParameter("channelAttrs");
	String channelLevel=request.getParameter("channelLevel");
	String tbcode=request.getParameter("tbcode");
	String tn=request.getParameter("tn");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>BSS、网格和手工调整佣金差异明细</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/wg_bss_detail.js?v=1"></script>
<script type="text/javascript">
   var tablename="<%=tablename%>";
   var startDate="<%=startDate%>";
   var endDate="<%=endDate%>";
   var chanlName="<%=chanlName%>";
   var channelAttrs="<%=channelAttrs%>";
   var channelLevel="<%=channelLevel%>";
   var tbcode="<%=tbcode%>";
   var tn="<%=tn%>";
</script>
</head>
<body style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="code" value="<%=request.getParameter("code")%>">
	<input type="hidden" id="level" value="<%=request.getParameter("level")%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="orgCode" value="<%=org.getCode()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="5%" style="padding-left: 10px;">开始账期：</td>
					<td width="13%">
						<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=startDate%>" id="startDate">
					</td>
					<td width="5%" style="padding-left: 10px;">结束账期：</td>
					<td width="13%">
						<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=endDate %>" id="endDate">
					</td>
					<td width="7%">发展渠道：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="channel_query" type="text" id="channel_query"/>
					</td>
					
					<td width="7%">科目名称：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="itemname" type="text" id="itemname"/>
					</td>
					
					<td width="7%">佣金规则：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="rule_name" type="text" id="rule_name"/>
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 30px;">查询</a>
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
			</table>
		</form>
		<div id="lchcontent"></div>
		<div class="page_count">
			<div class="page_count_left">
				共有 <span id="totalCount"></span> 条数据
			</div>
			<div class="page_count_right">
				<div id="pagination"></div>
			</div>
		</div>

</body>
</html>