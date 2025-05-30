export const urls = {
	picker: '/picker',
	imports: '/import',
	import(id = ':id') {
		return `${this.imports}/${id}`;
	},
	settings: '/settings',
	index: '/',
	rest: '*',
};
