import { useEffect, useRef } from 'react';
import { AlertCircle, Film, X } from 'lucide-react';
export function Empty({ title = 'O próximo capítulo começa aqui', text = 'Encontre um filme e adicione à coleção de vocês.', children }) { return <div className="empty"><span className="empty-icon"><Film size={30}/></span><h2>{title}</h2><p>{text}</p>{children}</div>; }
export function ErrorState({ text, retry }) { return <div className="error-state" role="alert"><AlertCircle/><div><strong>Não conseguimos carregar os filmes</strong><p>{text}</p></div><button className="button secondary" onClick={retry}>Tentar novamente</button></div>; }
export function Skeletons() { return <div className="movie-grid" aria-label="Carregando filmes" aria-busy="true">{Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton-card"><div className="skeleton poster"/><div className="skeleton line"/><div className="skeleton line short"/></div>)}</div>; }
export function Confirm({ title, text, onClose, onConfirm, busy }) {
  const ref = useRef(null);
  useEffect(() => { const previous = document.activeElement; const dialog = ref.current; dialog.showModal(); return () => { dialog.close(); previous?.focus(); }; }, []);
  return <dialog ref={ref} onCancel={e => { e.preventDefault(); if (!busy) onClose(); }} onClick={e => { if (e.target === ref.current && !busy) onClose(); }}><div className="modal-content"><button className="icon-button modal-close" aria-label="Fechar confirmação" disabled={busy} onClick={onClose}><X/></button><span className="eyebrow">NOSSA COLEÇÃO</span><h2>{title}</h2><p>{text}</p><div className="actions"><button className="button secondary" disabled={busy} onClick={onClose}>Cancelar</button><button className="button danger" disabled={busy} onClick={onConfirm}>{busy ? 'Removendo…' : 'Sim, remover'}</button></div></div></dialog>;
}
