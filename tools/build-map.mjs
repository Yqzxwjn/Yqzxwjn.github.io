/*
 * 生成旅行地图。
 *
 *   cd tools
 *   npm install d3-geo @mapbox/geojson-rewind
 *   node build-map.mjs
 *
 * 需要把中国行政区划 GeoJSON 存成 tools/china.json：
 *   https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
 *
 * 输出：
 *   ../assets/img/map-preview.svg   首页用的静态地图
 *   ./map-inline.svg                贴进 travel.html 的内联地图
 */
import fs from 'node:fs';
import * as d3 from 'd3-geo';
import rewind from '@mapbox/geojson-rewind';

const DATA = new URL('./china.json', import.meta.url);
const raw = JSON.parse(fs.readFileSync(DATA, 'utf8'));

const features = raw.features
  .filter((f) => String(f.properties.adcode) !== '100000_JD')
  .map((f) => rewind(f, true))
  .map((f) => {
    if (String(f.properties.adcode) !== '460000') return f;
    const polys = f.geometry.coordinates.filter((poly) => Math.max(...poly[0].map((p) => p[1])) > 17.5);
    return { ...f, geometry: { type: 'MultiPolygon', coordinates: polys } };
  });

const collection = { type: 'FeatureCollection', features };
const W = 1000;
const H = 720;

const projection = d3
  .geoConicEqualArea()
  .parallels([25, 47])
  .rotate([-105, 0])
  .fitExtent(
    [
      [30, 40],
      [W - 30, H - 40],
    ],
    collection
  );

const round = (n) => Math.round(n * 10) / 10;

function simplify(points, tol) {
  if (points.length < 4) return points;
  const sqTol = tol * tol;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxSq = 0;
    let index = -1;
    const [x1, y1] = points[first];
    const [x2, y2] = points[last];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    for (let i = first + 1; i < last; i++) {
      const [px, py] = points[i];
      let sq;
      if (lenSq === 0) {
        sq = (px - x1) ** 2 + (py - y1) ** 2;
      } else {
        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
        const ex = x1 + t * dx;
        const ey = y1 + t * dy;
        sq = (px - ex) ** 2 + (py - ey) ** 2;
      }
      if (sq > maxSq) {
        maxSq = sq;
        index = i;
      }
    }
    if (maxSq > sqTol && index !== -1) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function ringPath(ring, tol) {
  const pts = ring.map((p) => projection(p)).filter(Boolean);
  const s = simplify(pts, tol);
  if (s.length < 3) return '';
  return s.map((p, i) => `${i === 0 ? 'M' : 'L'}${round(p[0])} ${round(p[1])}`).join('') + 'Z';
}

function provincePath(f, tol) {
  const g = f.geometry;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  return polys.map((poly) => poly.map((ring) => ringPath(ring, tol)).join('')).join('');
}

const provinces = features.map((f) => ({ name: f.properties.name, d: provincePath(f, 0.6) }));

const cities = [
  { id: 'taiyuan', name: '太原', lon: 112.549, lat: 37.87, label: { dx: -12, dy: 4, anchor: 'end' } },
  { id: 'yinchuan', name: '银川', lon: 106.232, lat: 38.487, label: { dx: -2, dy: -14, anchor: 'middle' } },
  { id: 'beijing', name: '北京', lon: 116.407, lat: 39.904, label: { dx: 2, dy: -15, anchor: 'middle' } },
  { id: 'xian', name: '西安', lon: 108.94, lat: 34.341, label: { dx: -13, dy: 12, anchor: 'end' } },
  { id: 'tianjin', name: '天津', lon: 117.2, lat: 39.133, label: { dx: 14, dy: 6, anchor: 'start' } },
  { id: 'chengdu', name: '成都', lon: 104.066, lat: 30.572, label: { dx: -13, dy: 8, anchor: 'end' } },
  { id: 'chongqing', name: '重庆', lon: 106.551, lat: 29.563, label: { dx: 12, dy: 14, anchor: 'start' } },
  { id: 'harbin', name: '哈尔滨', lon: 126.535, lat: 45.803, label: { dx: 2, dy: -14, anchor: 'middle' } },
  { id: 'nanjing', name: '南京', lon: 118.797, lat: 32.06, label: { dx: -13, dy: 2, anchor: 'end' } },
  { id: 'hangzhou', name: '杭州', lon: 120.155, lat: 30.274, label: { dx: 13, dy: 14, anchor: 'start' } },
  { id: 'shanghai', name: '上海', lon: 121.474, lat: 31.23, label: { dx: 15, dy: -3, anchor: 'start' } },
  { id: 'guangzhou', name: '广州', lon: 113.264, lat: 23.129, label: { dx: 12, dy: 14, anchor: 'start' } },
  { id: 'qingdao', name: '青岛', lon: 120.383, lat: 36.067, label: { dx: 14, dy: -5, anchor: 'start' } },
  { id: 'xiamen', name: '厦门', lon: 118.089, lat: 24.479, label: { dx: 12, dy: 14, anchor: 'start' } },
];

const pts = cities.map((c) => {
  const p = projection([c.lon, c.lat]);
  return { ...c, x: round(p[0]), y: round(p[1]) };
});

const routes = pts
  .map((p, i) => {
    if (i === 0) return null;
    const a = pts[i - 1];
    const mx = (a.x + p.x) / 2;
    const my = (a.y + p.y) / 2;
    const dx = p.x - a.x;
    const dy = p.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const bend = Math.min(26, len * 0.18);
    return {
      from: a.id,
      to: p.id,
      d: `M${a.x} ${a.y}Q${round(mx - (dy / len) * bend)} ${round(my + (dx / len) * bend)} ${p.x} ${p.y}`,
    };
  })
  .filter(Boolean);

const gratPath = d3.geoPath(projection)(d3.geoGraticule().step([10, 10])());

const land = provinces.map((p) => `<path d="${p.d}" class="province" data-province="${p.name}"/>`).join('\n      ');

const svgInline = `<svg class="map-svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="mapTitle mapDesc" preserveAspectRatio="xMidYMid meet">
  <title id="mapTitle">旅行轨迹地图</title>
  <desc id="mapDesc">中国地图，标注了 ${cities.length} 座去过的城市，并按时间顺序连线。</desc>
  <defs>
    <pattern id="mapGrid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="rgba(244,241,234,0.035)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#mapGrid)"/>
  <g class="map-graticule" aria-hidden="true"><path d="${gratPath}"/></g>
  <g class="map-provinces">
      ${land}
  </g>
  <g class="map-routes" aria-hidden="true">
    ${routes.map((r) => `<path d="${r.d}" class="route" data-from="${r.from}" data-to="${r.to}"/>`).join('\n    ')}
  </g>
  <g class="map-cities">
    ${pts
      .map(
        (c) => `<g class="city${c.id === 'taiyuan' ? ' is-home' : ''}" data-city="${c.id}" role="button" tabindex="0" aria-label="${c.name}">
      <circle class="city-hit" cx="${c.x}" cy="${c.y}" r="18"/>
      <circle class="city-dot" cx="${c.x}" cy="${c.y}" r="${c.id === 'taiyuan' ? 5 : 3.6}"/>
      <text class="city-label" x="${c.x + c.label.dx}" y="${c.y + c.label.dy}" text-anchor="${c.label.anchor}">${c.name}</text>
    </g>`
      )
      .join('\n    ')}
  </g>
  <g class="map-annot" aria-hidden="true">
    <text x="30" y="28" class="annot">CHINA / 35°N 105°E</text>
    <text x="${W - 30}" y="28" text-anchor="end" class="annot">ALBERS EQUAL AREA</text>
    <g class="scale-bar" transform="translate(30, ${H - 24})">
      <line x1="0" y1="0" x2="90" y2="0"/>
      <line x1="0" y1="-4" x2="0" y2="4"/>
      <line x1="90" y1="-4" x2="90" y2="4"/>
      <text x="0" y="-9">0</text>
      <text x="90" y="-9" text-anchor="end">1000 km</text>
    </g>
  </g>
</svg>`;

const previewLand = provinces
  .map((p) => `<path d="${p.d}" fill="#202016" stroke="rgba(244,241,234,0.26)" stroke-width="0.6"/>`)
  .join('');
const previewDots = pts
  .map(
    (c) =>
      `<circle cx="${c.x}" cy="${c.y}" r="${c.id === 'taiyuan' ? 4 : 3}" fill="#0A0A07" stroke="#E6B36A" stroke-width="1.6"/>`
  )
  .join('');
const preview = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <g>${previewLand}</g>
  ${routes.map((r) => `<path d="${r.d}" fill="none" stroke="#E6B36A" stroke-opacity="0.5" stroke-width="1.2"/>`).join('')}
  ${previewDots}
</svg>`;

fs.writeFileSync(new URL('./map-inline.svg', import.meta.url), svgInline, 'utf8');
fs.writeFileSync(new URL('../assets/img/map-preview.svg', import.meta.url), preview, 'utf8');

console.log(`地图已生成：${cities.length} 座城市，${Math.round(svgInline.length / 1024)} KB`);
