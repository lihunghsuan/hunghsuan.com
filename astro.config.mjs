// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://hunghsuan.com',
	trailingSlash: 'always',
	i18n: {
		defaultLocale: 'zh',
		locales: ['zh', 'en'],
		routing: {
			prefixDefaultLocale: true,
			redirectToDefaultLocale: false,
		},
	},
	integrations: [
		sitemap({
			filter: (page) => page !== 'https://hunghsuan.com/',
			i18n: {
				defaultLocale: 'zh',
				locales: {
					zh: 'zh-Hant',
					en: 'en',
				},
			},
		}),
	],
});
