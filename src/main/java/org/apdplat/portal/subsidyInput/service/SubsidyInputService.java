package org.apdplat.portal.subsidyInput.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.runtime.ProcessInstance;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.common.service.CommonParamService;
import org.apdplat.portal.subsidyInput.dao.SubsidyInputDao;
import org.apdplat.workflow.service.WorkOrderService;
import org.apdplat.workflow.vo.WorkOrderVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.miemiedev.mybatis.paginator.domain.PageList;


@Service
public class SubsidyInputService {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private SubsidyInputDao subsidyInputDao;
	@Autowired
	private CommonParamService commonParamService;
	@Autowired
	private WorkOrderService workOrderService;
	
	
	public Object list(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = subsidyInputDao.list(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
		
	
	@Transactional
	public void importData(Map<String, String> params) throws Exception {
		subsidyInputDao.importData(params);
	}
	
	
	@Transactional
	public void update(Map<String, String> params) throws Exception {
		subsidyInputDao.update(params);
	}
	
	/**
	 * 提交工单审批
	 * @param map
	 * @throws BusiException 
	 */
	@Transactional
	public void doSendOrder(Map<String, String> map) throws BusiException {
		try {
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			//业务主键，先保存自己的业务数据生成此主键，然后传给activiti，用于和业务数据关联。
			String seqId = commonParamService.getId();
			SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
			String time = format.format(new Date());
			String businessKey = "YN-"+time+seqId; //工单编号
			map.put("workNo", businessKey);
			map.put("userId", String.valueOf(user.getId()));
			map.put("username", user.getUsername());
			map.put("code", org.getCode());
			map.put("initId",businessKey);
			int count = subsidyInputDao.getDataListCount(map);
			if(count <= 0) {
				throw new BusiException("审核数据为空！");
			}
			subsidyInputDao.updateDataWorkNo(map);
			//activity流程key，在activity的bpmn文件中定义
			String processKey = PropertyHolder.getProperty("subsidyInputKey");
			//流程审批中的可编辑页面，类似之前的拟稿人的编辑修改界面
			String subsidyInputEditUrl = PropertyHolder.getProperty("subsidyInputEditUrl");
			//流程审批中的查看界面
			String subsidyInputReadUrl = PropertyHolder.getProperty("subsidyInputReadUrl");
			WorkOrderVo workOrderVo = new WorkOrderVo();
			workOrderVo.setBusinessKey(businessKey);
			workOrderVo.setProcessKey(processKey);
			workOrderVo.setTitle(map.get("title").toString());
			workOrderVo.setEditUrl(subsidyInputEditUrl);
			workOrderVo.setNoEditUrl(subsidyInputReadUrl);
			workOrderVo.setNextDealer(map.get("nextDealer").toString());
			workOrderVo.setDesc(map.get("title").toString());
			workOrderVo.setStartMan(user.getId().toString());
			workOrderVo.setRegionName(org.getRegionName());
			
			ProcessInstance processInstance = workOrderService.startProcessInstanceByKey(workOrderVo);
			//发起人发起有附件的工单，update附件临时表的init_id，带上条件操作人
			if(map.get("isHavingFile").equals("withFile")){
				subsidyInputDao.updateTempInitId(map);
				subsidyInputDao.insertToResult(map);
			}
			if(null == processInstance) {
				throw new BusiException("发送失败！");
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new BusiException("工单发送失败，请刷新页面重试！");
		}
	}
	
	public Object listByWorkNo(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = subsidyInputDao.listByWorkNo(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	@Transactional
	public void delete(Map<String, String> params) {
		subsidyInputDao.delete(params);
	}

	@Transactional
	public void deleteTemp(Map<String, String> params) {
		subsidyInputDao.deleteTemp(params);
	}
	
	@Transactional
	public void deleteResult(Map<String, String> params) {
		subsidyInputDao.deleteResult(params);
	}
	
	@Transactional
	public void updateInitId(Map<String, String> params) {
		subsidyInputDao.updateInitId(params);
	}

	@Transactional
	public void deleteResultByEdit(Map<String, String> params) {
		subsidyInputDao.deleteResultByEdit(params);
	}

	public List<Map<String, Object>> queryFiles(String initId) {
		return subsidyInputDao.queryFiles(initId);
	}
}
