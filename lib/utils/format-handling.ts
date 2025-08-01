import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const toTimestamp = (value: Date) => {
	return Math.floor(value.getTime() / 1000);
};

export enum FormatType {
	'us',
	'tiny',
}

export const formatCurrency = (value: string | number, minimumFractionDigits = 0, maximumFractionDigits = 2, format = FormatType.tiny) => {
	const amount = typeof value === 'string' ? parseFloat(value) : value;

	// exceptions
	if (amount === null || !!isNaN(amount)) return null;
	if (amount < 0.01 && amount > 0 && maximumFractionDigits <= 2) {
		return '< 0.01';
	}

	// us
	if (format === FormatType.us) {
		const formatter = new Intl.NumberFormat('en-US', {
			maximumFractionDigits,
			minimumFractionDigits,
		});
		return formatter.format(amount);
	}

	// tiny
	if (format === FormatType.tiny) {
		const formatter = new Intl.NumberFormat('en-US', {
			maximumFractionDigits: amount < 1000 ? 2 : 0,
			minimumFractionDigits: amount < 1000 ? 2 : 0,
		});
		return formatter.format(amount);
	}
};

export const formatCompactNumber = (value: string | number, decimals = 2): string => {
	const amount = typeof value === 'string' ? parseFloat(value) : value;

	// Handle edge cases
	if (amount === null || isNaN(amount)) return '0';
	if (amount === 0) return '0';
	
	// Handle very small numbers
	if (amount > 0 && amount < 0.0001) {
		return '< 0.0001';
	}

	// Handle different ranges
	if (amount >= 1000000) {
		return (amount / 1000000).toFixed(decimals).replace(/\.?0+$/, '') + 'M';
	} else if (amount >= 1000) {
		return (amount / 1000).toFixed(decimals).replace(/\.?0+$/, '') + 'k';
	} else {
		// For numbers < 1000, show up to 4 decimal places for precision
		const precision = amount < 1 ? 4 : 2;
		return amount.toFixed(precision).replace(/\.?0+$/, '');
	}
};