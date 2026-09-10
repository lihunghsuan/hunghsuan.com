const contentSecurityPolicy = [
	"default-src 'self'",
	"base-uri 'self'",
	"connect-src 'self'",
	"font-src 'self' data:",
	"form-action 'self'",
	"frame-ancestors 'none'",
	"img-src 'self' data: https://i.ytimg.com https://*.mzstatic.com https://*.nflximg.net https://i0.hdslb.com https://m.media-amazon.com",
	"media-src 'self'",
	"object-src 'none'",
	"script-src 'self' 'unsafe-inline'",
	"style-src 'self' 'unsafe-inline'",
	'upgrade-insecure-requests',
].join('; ');

const securityHeaders = {
	'Content-Security-Policy': contentSecurityPolicy,
	'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
};

function addSecurityHeaders(response, pathname) {
	const headers = new Headers(response.headers);

	for (const [name, value] of Object.entries(securityHeaders)) {
		headers.set(name, value);
	}

	if (pathname.startsWith('/_astro/')) {
		headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

function getCookie(request, name) {
	const cookies = request.headers.get('Cookie') ?? '';
	const prefix = `${name}=`;
	const cookie = cookies
		.split(';')
		.map((value) => value.trim())
		.find((value) => value.startsWith(prefix));
	return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined;
}

function getPreferredLanguage(request) {
	const savedLanguage = getCookie(request, 'language-preference');
	if (savedLanguage === 'zh' || savedLanguage === 'en') return savedLanguage;

	const languages = (request.headers.get('Accept-Language') ?? '')
		.split(',')
		.map((item, index) => {
			const [tag = '', qualityValue] = item.trim().split(';q=');
			const quality = qualityValue === undefined ? 1 : Number.parseFloat(qualityValue);
			return { tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 0, index };
		})
		.filter(({ tag, quality }) => tag && quality > 0)
		.sort((a, b) => b.quality - a.quality || a.index - b.index);

	return languages[0]?.tag.startsWith('zh') ? 'zh' : 'en';
}

function createRedirect(url, status, extraHeaders = {}) {
	const headers = new Headers({ Location: url.toString(), ...extraHeaders });
	for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
	return new Response(null, { status, headers });
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const legacyReview = url.pathname.match(/^\/(zh|en)\/reviews(?:\/(re-zero-season-4))?\/?$/);
		if (legacyReview) {
			url.pathname = `/${legacyReview[1]}/articles/${legacyReview[2] ? `${legacyReview[2]}/` : ''}`;
			return createRedirect(url, 301);
		}

		if (url.hostname === 'www.hunghsuan.com') {
			url.hostname = 'hunghsuan.com';
			url.protocol = 'https:';
			return createRedirect(url, 301);
		}

		if (url.pathname === '/') {
			url.pathname = `/${getPreferredLanguage(request)}/`;
			return createRedirect(url, 302, {
				'Cache-Control': 'private, no-store',
				Vary: 'Accept-Language, Cookie',
			});
		}

		const response = await env.ASSETS.fetch(request);
		return addSecurityHeaders(response, url.pathname);
	},
};
