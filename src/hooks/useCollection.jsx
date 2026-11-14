import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as api from '../services/api';
const Context = createContext(null);
export const useCollection = () => useContext(Context);
export function CollectionProvider({ children }) {
  const [items, setItems] = useState([]), [users, setUsers] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState(''), [toast, setToast] = useState(null), [busy, setBusy] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true), [usersError, setUsersError] = useState('');
  const lock = useRef(false), timer = useRef();
  function notify(text, type = 'success') { setToast({ text, type }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 5000); }
  async function refresh() { setLoading(true); setError(''); try { const data = await api.getList(); setItems(data); } catch(e) { setError(api.message(e)); } finally { setLoading(false); } }
  useEffect(() => { refresh(); loadUsers(); return () => clearTimeout(timer.current); }, []);
  async function mutate(operation, success) { if (lock.current) return false; lock.current = true; setBusy(true); try { await operation(); notify(success); return true; } catch(e) { notify(api.message(e), 'error'); return false; } finally { lock.current = false; setBusy(false); } }
  const add = (id, status) => mutate(async () => { const item = await api.addMovie(id, status); setItems(old => [...old, item]); }, 'Filme adicionado à nossa coleção.');
  const update = (id, data) => mutate(async () => { const item = await api.updateMovie(id, data); setItems(old => old.map(i => i.id === id ? item : i)); }, 'Lista atualizada.');
  const remove = id => mutate(async () => { await api.deleteMovie(id); setItems(old => old.filter(i => i.id !== id)); }, 'Filme removido da lista.');
  async function loadUsers() {
    setUsersLoading(true); setUsersError('');
    try { setUsers(await api.getUsers()); }
    catch(e) { setUsersError(api.message(e)); }
    finally { setUsersLoading(false); }
  }
  function applyUser(user) {
    setUsers(old => old.map(u => u.id === user.id ? { ...u, ...user, photoVersion: Date.now() } : u));
  }
  return <Context.Provider value={{ items, users, usersLoading, usersError, applyUser, loading, error, toast, busy, notify, refresh, add, update, remove, mutate, loadUsers }}>{children}</Context.Provider>;
}
