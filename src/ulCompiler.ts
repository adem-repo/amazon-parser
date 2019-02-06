export default (ulNumber: number = 1): string | Error => {

	if (ulNumber < 1)
		throw new Error('Wrong number of uls');

	let str = 'ul';

	for (let i = 1; i < ulNumber; i++)
		str += ' > ul';

	return str;
};