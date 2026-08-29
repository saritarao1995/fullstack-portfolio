export const digits = (value) => String(value ?? '').replace(/\D/g, '');

export const isIndianPhone = (value) => digits(value).length >= 10;

export const isIndianPin = (value) => /^\d{6}$/.test(String(value ?? '').trim());
