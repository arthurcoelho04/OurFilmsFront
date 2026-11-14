import test from 'node:test';
import assert from 'node:assert/strict';
import { statistics, recent, poster, score } from '../src/utils/movies.js';
test('média usa todas as avaliações existentes, incluindo nota zero', () => {
  const result = statistics([{ status: 'ASSISTIDO', mediaAvaliacoes: 9, totalAvaliacoes: 2, favorito: true }, { status: 'ASSISTIDO', mediaAvaliacoes: 0, totalAvaliacoes: 1 }, { status: 'ASSISTIDO', mediaAvaliacoes: null, totalAvaliacoes: 0 }, { status: 'QUERO_ASSISTIR' }]);
  assert.deepEqual(result, { watched: 3, waiting: 1, favorites: 1, average: 6 });
});
test('sem avaliações, não inventa uma média', () => { assert.equal(statistics([]).average, null); assert.equal(score(null), '—'); assert.equal(score(0), '0'); });
test('sessões recentes respeitam data e não alteram a coleção original', () => { const input = [{ id: 3, dataAssistido: '2026-10-01' }, { id: 2, dataAssistido: '2026-11-01' }]; assert.equal(recent(input)[0].id, 2); assert.equal(input[0].id, 3); });
test('pôsteres relativos usam TMDB e endereços não confiáveis viram placeholder', () => { assert.equal(poster('/filme.jpg'), 'https://image.tmdb.org/t/p/w500/filme.jpg'); assert.equal(poster(null), null); assert.equal(poster('javascript:alert(1)'), null); assert.equal(poster('https://example.com/random.jpg'), null); });
