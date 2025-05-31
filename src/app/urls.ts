export const urls = {
	picker: '/picker',
	imports: '/import',
	export: '/export',
	download: '/download',
	import(id = ':id') {
		return `${this.imports}/${id}`;
	},
	settings: '/settings',
	index: '/',
	rest: '*',
};
