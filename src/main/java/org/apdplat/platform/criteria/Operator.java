package org.apdplat.platform.criteria;
/**
 * 操作符号定义
 * @author sun
 *
 */
public enum Operator {
	ge(">="),gt(">"),le("<="),lt("<"),eq("="),ne("!="),like("like"),is("is"),in("in");
	private Operator(String symbol){
		this.symbol=symbol;
	}
	
	private String symbol;
	
	public String getSymbol() {
		return symbol;
	}
}