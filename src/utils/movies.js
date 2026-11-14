export const score = value => value == null ? '—' : Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
export const year = movie => movie.dataLancamento?.slice(0, 4) || 'Ano não informado';
export const poster = (path, size = 'w500') => !path ? null : path.startsWith('/') ? `https://image.tmdb.org/t/p/${size}${path}` : /^https:\/\/image\.tmdb\.org\//.test(path) ? path : null;
export const recent = items => [...items].sort((a, b) => (b.dataAssistido || '').localeCompare(a.dataAssistido || '') || b.id - a.id);
export function statistics(items) {
  const watched = items.filter(i => i.status === 'ASSISTIDO');
  const rated = watched.filter(i => i.mediaAvaliacoes != null && i.totalAvaliacoes > 0);
  const total = rated.reduce((sum, i) => sum + i.totalAvaliacoes, 0);
  return { watched: watched.length, waiting: items.filter(i => i.status === 'QUERO_ASSISTIR').length, favorites: items.filter(i => i.favorito).length, average: total ? rated.reduce((sum, i) => sum + i.mediaAvaliacoes * i.totalAvaliacoes, 0) / total : null };
}
