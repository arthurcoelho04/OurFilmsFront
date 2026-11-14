import { Routes, Route, Link } from 'react-router-dom';
import { CollectionProvider } from './hooks/useCollection';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Pesquisar from './pages/Pesquisar';
import MinhasListas from './pages/MinhasListas';
import FilmeDetalhes from './pages/FilmeDetalhes';
import { Empty } from './components/ui/Feedback';
export default function App() { return <CollectionProvider><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="pesquisar" element={<Pesquisar/>}/><Route path="listas" element={<MinhasListas/>}/><Route path="favoritos" element={<MinhasListas favorites/>}/><Route path="filmes/:tmdbId" element={<FilmeDetalhes/>}/><Route path="*" element={<Empty title="Essa cena não existe" text="A página que você procura não foi encontrada."><Link className="button" to="/">Voltar ao início</Link></Empty>}/></Route></Routes></CollectionProvider>; }
