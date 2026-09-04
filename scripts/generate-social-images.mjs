import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const width = 1200;
const height = 630;
const outputDirectory = new URL('../public/og/', import.meta.url);
const outputDirectoryPath = fileURLToPath(outputDirectory);

const escapeXml = (value) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

const designs = [
	{
		file: 'articles-en.jpg',
		index: '04',
		eyebrow: 'FIELD NOTES',
		lines: ['ARTICLES', '& GUIDES'],
		footer: 'GAMEPLAY · SETTINGS · CREATOR NOTES',
		motif: 'article',
	},
	{
		file: 'articles-zh.jpg',
		index: '04',
		eyebrow: '文章資料庫',
		lines: ['文章', '與攻略'],
		footer: '遊戲心得 · 設定教學 · 創作筆記',
		motif: 'article',
	},
	{
		file: 'reviews-en.jpg',
		index: '05',
		eyebrow: 'SCREEN NOTES',
		lines: ['REVIEWS'],
		footer: 'FILMS · SERIES · ANIME',
		motif: 'review',
	},
	{
		file: 'reviews-zh.jpg',
		index: '05',
		eyebrow: '觀影筆記',
		lines: ['影評'],
		footer: '電影 · 電視劇 · 動畫',
		motif: 'review',
	},
	{
		file: 'library-en.jpg',
		index: '06',
		eyebrow: 'PERSONAL ARCHIVE',
		lines: ['LIBRARY'],
		footer: 'MUSIC · MOVIES · SERIES / ANIME',
		motif: 'library',
	},
	{
		file: 'library-zh.jpg',
		index: '06',
		eyebrow: '個人收藏',
		lines: ['收藏庫'],
		footer: '音樂 · 電影 · 電視劇／動畫',
		motif: 'library',
	},
];

const motifs = {
	article: `
		<g transform="translate(875 105)" fill="none" stroke="#c8ee68">
			<rect x="0" y="0" width="245" height="310" stroke-width="2"/>
			<path d="M0 88h245M0 206h245M72 0v310M174 0v310" opacity=".45"/>
			<circle cx="123" cy="150" r="54" stroke-width="2"/>
			<path d="M123 75v150M48 150h150" stroke-width="2"/>
			<circle cx="123" cy="150" r="7" fill="#c8ee68" stroke="none"/>
		</g>`,
	review: `
		<g transform="translate(892 96)" fill="none" stroke="#c8ee68">
			<circle cx="112" cy="145" r="112" stroke-width="2"/>
			<circle cx="112" cy="145" r="72" opacity=".55"/>
			<circle cx="112" cy="145" r="28" fill="#c8ee68" stroke="none"/>
			<path d="M112 0v290M-33 145h290" opacity=".45"/>
			<path d="M33 66l158 158M191 66L33 224" opacity=".28"/>
		</g>`,
	library: `
		<g transform="translate(850 100)" fill="none" stroke="#c8ee68" stroke-width="2">
			<rect x="0" y="0" width="92" height="300"/>
			<rect x="112" y="44" width="92" height="256"/>
			<rect x="224" y="88" width="92" height="212"/>
			<circle cx="46" cy="150" r="25"/>
			<path d="M158 82v180M134 172h48" opacity=".55"/>
			<path d="M244 118h52M244 146h52M244 174h52" opacity=".55"/>
		</g>`,
};

function createSvg(design) {
	const isChinese = design.file.includes('-zh');
	const fontFamily = isChinese
		? "'PingFang TC','Noto Sans TC','Microsoft JhengHei',sans-serif"
		: "Inter,'Arial Narrow','Helvetica Neue',Arial,sans-serif";
	const titleSize = isChinese ? 142 : 122;
	const titleY = design.lines.length === 1 ? 310 : 265;
	const lineGap = isChinese ? 150 : 118;
	const title = design.lines
		.map(
			(line, index) =>
				`<text x="70" y="${titleY + index * lineGap}" class="title">${escapeXml(line)}</text>`,
		)
		.join('');

	return `
		<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
			<rect width="1200" height="630" fill="#10281f"/>
			<path d="M0 0H1200V630H0z" fill="url(#grid)" opacity=".8"/>
			<defs>
				<pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
					<path d="M44 0H0V44" fill="none" stroke="#f1eee5" stroke-opacity=".045"/>
				</pattern>
			</defs>
			<rect x="28" y="28" width="1144" height="574" fill="none" stroke="#f1eee5" stroke-opacity=".68"/>
			<path d="M28 486H1172M820 28V602" stroke="#f1eee5" stroke-opacity=".42"/>
			<style>
				text { font-family: ${fontFamily}; }
				.meta { fill:#c8ee68; font-size:20px; font-weight:800; letter-spacing:5px; }
				.title { fill:#f1eee5; font-size:${titleSize}px; font-weight:900; letter-spacing:-4px; }
				.footer { fill:#f1eee5; font-size:22px; font-weight:700; letter-spacing:4px; }
			</style>
			<circle cx="72" cy="76" r="25" fill="none" stroke="#c8ee68"/>
			<text x="72" y="83" text-anchor="middle" class="meta" style="font-size:14px;letter-spacing:0">${escapeXml(design.index)}</text>
			<text x="112" y="83" class="meta">${escapeXml(design.eyebrow)}</text>
			${title}
			${motifs[design.motif]}
			<rect x="820" y="486" width="352" height="116" fill="#c8ee68"/>
			<text x="70" y="558" class="footer">${escapeXml(design.footer)}</text>
			<text x="846" y="556" fill="#10281f" font-family="${fontFamily}" font-size="20" font-weight="900" letter-spacing="4">HUNGHSUAN.COM</text>
		</svg>`;
}

await mkdir(outputDirectoryPath, { recursive: true });

for (const design of designs) {
	await sharp(Buffer.from(createSvg(design)))
		.jpeg({ quality: 84, progressive: true, chromaSubsampling: '4:4:4' })
		.toFile(fileURLToPath(new URL(design.file, outputDirectory)));
}

console.log(`Generated ${designs.length} social images in public/og/.`);
