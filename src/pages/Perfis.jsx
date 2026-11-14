import { useEffect, useRef, useState } from 'react';
import { Camera, Pencil, Save, Trash2, X } from 'lucide-react';
import { useCollection } from '../hooks/useCollection';
import { message, removeUserPhoto, updateUser, uploadUserPhoto, userPhotoUrl } from '../services/api';
import Avatar from '../components/ui/Avatar';

function ProfileCard({ user, index }) {
  const { busy, mutate, applyUser } = useCollection();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.nome);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const input = useRef(null), nameInput = useRef(null), editButton = useRef(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => { if (editing) nameInput.current?.focus(); }, [editing]);

  function startEditing() {
    setName(user.nome); setFile(null); setRemovePhoto(false); setError(''); setEditing(true);
  }
  function cancel() { setEditing(false); setFile(null); setRemovePhoto(false); setError(''); editButton.current?.focus(); }
  function choosePhoto(event) {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
      setError('Escolha uma imagem JPG, PNG ou WebP.'); return;
    }
    if (!selected.size || selected.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter conteúdo e no máximo 5 MiB.'); return;
    }
    setFile(selected); setRemovePhoto(false); setError('');
  }
  async function submit(event) {
    event.preventDefault();
    if (busy || saving) return;
    if (!name.trim()) { setError('Informe um nome para o perfil.'); nameInput.current?.focus(); return; }
    setError(''); setSaving(true);
    let nameSaved = false;
    const ok = await mutate(async () => {
      try {
        if (name.trim() !== user.nome) {
          applyUser(await updateUser(user.id, name.trim())); nameSaved = true;
        }
        if (file) applyUser(await uploadUserPhoto(user.id, file));
        else if (removePhoto) {
          await removeUserPhoto(user.id);
          applyUser({ ...user, nome: name.trim() });
        }
      } catch(e) {
        setError(`${nameSaved ? 'O nome foi salvo, mas a foto não foi atualizada. ' : ''}${message(e)}`);
        throw e;
      }
    }, 'Perfil atualizado. Pronto para a próxima sessão!');
    setSaving(false);
    if (ok) cancel();
  }
  const changed = name.trim() !== user.nome || !!file || removePhoto;
  return <article className={`profile-card ${editing ? 'is-editing' : ''}`}>
    <div className="profile-card-top"><span className="eyebrow">NOSSA MELHOR COMPANHIA</span><button ref={editButton} className="icon-button profile-edit" aria-label={`Editar perfil de ${user.nome}`} aria-expanded={editing} disabled={busy || editing} onClick={startEditing}><Pencil size={17}/></button></div>
    <div className="profile-identity">
      {editing && (preview || removePhoto) ? <span className={`avatar avatar-${index} profile-avatar`}>
        {preview ? <img src={preview} alt="Prévia da nova foto de perfil" onError={() => { setFile(null); setError('Não foi possível abrir esta imagem. Escolha outro arquivo.'); }}/>: name.trim().slice(0, 1).toUpperCase() || '?'}
      </span> : <Avatar user={user} index={index} className="profile-avatar"/>}
      <h2>{user.nome}</h2><p>Um olhar único para as nossas histórias.</p>
    </div>
    {editing && <form className="profile-form" onSubmit={submit} aria-label={`Editar perfil de ${user.nome}`}>
      <fieldset disabled={busy || saving}>
        <legend className="sr-only">Nome e foto do perfil</legend>
        <label htmlFor={`profile-name-${user.id}`}>Como você quer aparecer?</label>
        <input ref={nameInput} id={`profile-name-${user.id}`} value={name} maxLength={100} required autoComplete="nickname" onChange={e => setName(e.target.value)} aria-describedby={`profile-error-${user.id}`}/>
        <input ref={input} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" aria-label={`Escolher foto para ${user.nome}`} onChange={choosePhoto} tabIndex={-1}/>
        <div className="profile-photo-actions"><button type="button" className="button secondary" onClick={() => input.current?.click()}><Camera size={16}/>{file || userPhotoUrl(user) ? 'Substituir foto' : 'Escolher foto'}</button><button type="button" className="text-button muted" disabled={removePhoto} onClick={() => { setFile(null); setRemovePhoto(true); setError(''); }}><Trash2 size={14}/>Remover foto</button></div>
        <p className="profile-hint">JPG, PNG ou WebP · Até 5 MiB e 25 megapixels.</p>
        <p className="profile-preview-note" role="status">{file ? 'Prévia da nova foto. Salve para aplicar.' : removePhoto ? 'A foto será removida ao salvar.' : 'As alterações serão aplicadas ao salvar.'}</p>
        <div id={`profile-error-${user.id}`} role="alert" className="profile-error">{error}</div>
        <div className="actions profile-form-actions"><button type="button" className="button secondary" onClick={cancel}><X size={15}/>Cancelar</button><button className="button" disabled={!changed || saving || busy}><Save size={15}/>{saving ? 'Salvando…' : 'Salvar perfil'}</button></div>
      </fieldset>
    </form>}
  </article>;
}

export default function Perfis() {
  const { users, usersLoading, usersError, loadUsers } = useCollection();
  return <><div className="page-intro"><div><span className="eyebrow">DUAS PESSOAS. INFINITAS HISTÓRIAS.</span><h1>Nossos perfis<span className="purple">.</span></h1><p>O nosso cinema fica ainda mais nosso com o toque de cada um.</p></div></div>
    {usersLoading ? <div className="profile-grid" aria-busy="true" aria-label="Carregando perfis"><div className="skeleton profile-skeleton"/><div className="skeleton profile-skeleton"/></div>
      : usersError ? <div className="error-state" role="alert"><div><strong>Não conseguimos carregar os perfis</strong><p>{usersError}</p></div><button className="button secondary" onClick={loadUsers}>Tentar novamente</button></div>
      : users.length ? <div className="profile-grid">{users.map((user, index) => <ProfileCard key={user.id} user={user} index={index}/>)}</div>
      : <div className="shelf-empty">Nenhum usuário foi encontrado no backend. <button className="text-button" onClick={loadUsers}>Atualizar perfis</button></div>}
  </>;
}
