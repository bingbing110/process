<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>编辑营服中心系数</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/performanceAppraisal/payment/js/unit_ratio_config_update.js"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<div id="container" style="min-height: 130px;">
	<div class="default-dt" style="width: 620px;">
		<div class="sticky-wrap" style="height: 155px;">
			<form id="updateUnitRatioForm" method="POST">
				<input type="hidden" name="unit_id" id="unit_id">
				<table class="default-table sticky-enabled">
				<tr>
					<td style="width: 75px;">地市名称:</td>
					<td style="width: 175px;">
						<span id="group_id_1_name"></span>
					</td>
					<td>营服中心:</td>
					<td>
						<span id="unit_name"></span>
					</td>
				</tr>
				<tr>
					<td style="width: 65px;">营服中心系数:</td>
					<td>
						<input type="text" required="true" class="easyui-numberbox" missingMessage="营服中心系数不能为空" precision="4" name="unit_ratio" id="unit_ratio">
					</td>
					<td style="width: 65px;">营服中心责任人系数:</td>
					<td>
						<input type="text" required="true" class="easyui-numberbox" missingMessage="营服中心系数不能为空" precision="4" name="unit_manager_ratio" id="unit_manager_ratio">
					</td>
				</tr>	
				<tr>	
					<td style="width: 65px;">营业厅店长系数:</td>
					<td>
						<input type="text" required="true" class="easyui-numberbox" missingMessage="营服中心系数不能为空" precision="4" name="unit_head_ratio" id="unit_head_ratio">
					</td>
				</tr>
				<tr>
	                <td colspan="4" style="padding-left: 240px;">
		                <a href="#" class="default-btn fLeft mr10" id="saveBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn">取消</a>
	                </td>
				</tr>
			</table>
		</form>
		</div>
	</div>
</div>
</body>
</html>