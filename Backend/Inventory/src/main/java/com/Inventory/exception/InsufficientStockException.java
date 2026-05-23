package com.Inventory.exception;

public class InsufficientStockException extends RuntimeException {
	
	private static final long serialVersionUID = 1L;
	
    public InsufficientStockException(String productName, int current, int requested) {
        super(String.format(
            "Stock insuficiente para '%s'. Stock actual: %d, solicitado: %d",
            productName, current, requested));
    }
}