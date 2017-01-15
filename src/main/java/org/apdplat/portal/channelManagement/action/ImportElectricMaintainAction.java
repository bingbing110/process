package org.apdplat.portal.channelManagement.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/electricMaintain")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/import_electric1_list.jsp"),
	@Result(name="error", location="/portal/channelManagement/jsp/import_electric1.jsp")
})
public class ImportElectricMaintainAction extends BaseAction {
	private File uploadFile;
	private String time;
	private String regionCode;
	private String userId;

	@Resource
	DataSource dataSource;

	public void importToResult() {
		boolean r = false;
		try {
			String time = request.getParameter("time");
			String regionCode = request.getParameter("regionCode");
			String delRepeat = "DELETE PMRT.TAB_MRT_ELECTRIC_CHARGE_MON1 WHERE DEAL_DATE='"	+ time+ "' AND GROUP_ID_1="+ regionCode;

			SpringManager.getUpdateDao().update(delRepeat);
			String importToResult = "INSERT INTO PMRT.TAB_MRT_ELECTRIC_CHARGE_MON1 SELECT * FROM PMRT.TAB_ELECTRIC_CHARGE_MON1_TEMP WHERE DEAL_DATE='"+time+"' AND GROUP_ID_1="+ regionCode;
			SpringManager.getUpdateDao().update(importToResult);
			r = true;
		} catch (Exception e) {
			e.printStackTrace();
			r = false;
		}
		Struts2Utils.renderJson("{\"ok\":" + r + "}", "no-cache");
	}
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String regionName=org.getRegionName();
		List<String> err = new ArrayList<String>();
		String resultTableName = "PMRT.TAB_ELECTRIC_CHARGE_MON1_TEMP";
		if (uploadFile == null) {
			err.add("上传文件为空！");
		} else {
			try {
				// 上传时覆盖
				String delSql = "delete from " + resultTableName
						+ " where deal_date='" + time + "' and group_id_1='"
						+ regionCode + "'";
				SpringManager.getUpdateDao().update(delSql);
				FileInputStream in = new FileInputStream(uploadFile);
				HSSFWorkbook wb = new HSSFWorkbook(in);
				int sheetNum = wb.getNumberOfSheets();// 得到sheet数量
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					HSSFSheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum() + 1;// 去前两行标题
					int end = sheet.getLastRowNum();
					for (int y = start; y <= end; y++) {
						String sql = "INSERT INTO PMRT.TAB_ELECTRIC_CHARGE_MON1_TEMP";
						String values = " values('" + time + "','" + regionCode	+ "','" + regionName + "'";
						HSSFRow row = sheet.getRow(y);
						if (row == null)
							continue;
						int cstart = row.getFirstCellNum();
						int cend = row.getLastCellNum();
						System.out.println(cstart + "：" + cend);
						for (int i = cstart; i < cend; i++) {
								values += "," + getCellValue(row.getCell(i));
						}
						values += ")";
						int n = SpringManager.getUpdateDao().update(sql + values);
						if (n <= 0) {
							err.add("导入第" + (y + 1) + "条记录失败");
						}
					}
				}
				wb.close();
			} catch (Exception e) {
				e.printStackTrace();
				err.add(e.getMessage());
			}
		}

		request.setAttribute("time", time);
		request.setAttribute("regionCode", regionCode);
		if(err.size()>0){
		   Struts2Utils.getRequest().setAttribute("err", err);
		   return "error";
		}
		return "success";
	}

	public void downfile() {
		File f=new File(this.request.getRealPath("/portal/channelManagement/down/import_electricMaintain.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_electricMaintain.xls");
			byte[] b=new byte[1024];
			int size=is.read(b);
			while(size>0){
				os.write(b,0,size);
				size=is.read(b);
			}
		}catch(IOException e){
			e.printStackTrace();
			if(null==os){
				try {
					os=resp.getOutputStream();
				} catch (IOException e1) {}
			}
		}finally{
			if(is!=null){
				try{ is.close();}catch(Exception e1){}
			}
			if(os!=null){
				try{ os.close();}catch(Exception e2){}
			}
		}
	}
	
	public File getUploadFile() {
		return uploadFile;
	}

	public void setUploadFile(File uploadFile) {
		this.uploadFile = uploadFile;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getRegionCode() {
		return regionCode;
	}

	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	private String getCellValue(HSSFCell cell){
		String value="''";
		if(cell==null){
			return value;
		}
		int cellType=cell.getCellType();
		if(cellType==HSSFCell.CELL_TYPE_STRING){//HSSFCell.CELL_TYPE_BLANK HSSFCell.CELL_TYPE_BOOLEAN HSSFCell.CELL_TYPE_ERROR HSSFCell.CELL_TYPE_FORMULA HSSFCell.CELL_TYPE_NUMERIC HSSFCell.CELL_TYPE_STRING
			value="'"+cell.getStringCellValue()+"'";
		}else if(cellType==HSSFCell.CELL_TYPE_NUMERIC){
			if(HSSFDateUtil.isCellDateFormatted(cell)){
				value="'"+new SimpleDateFormat("yyyy年MM月dd日").format(cell.getDateCellValue())+"'";
			}else{
				value=cell.getNumericCellValue()+"";
			}
		}else if(cellType==HSSFCell.CELL_TYPE_BLANK){
			
		}else if(HSSFCell.CELL_TYPE_FORMULA==cellType){
			try {
				value = String.valueOf(cell.getNumericCellValue());
			} catch (IllegalStateException e) {
				value = String.valueOf(cell.getRichStringCellValue());
			}
			System.out.print("\t" + value);
		}
		return value;
	}
	
}
