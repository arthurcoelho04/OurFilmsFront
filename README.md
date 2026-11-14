# OurMovies — frontend

Aplicação React em português para a coleção de filmes de um casal. Interface escura, responsiva, com destaque da coleção, pesquisa paginada, favoritos, avaliações individuais e média real. Sem dados fictícios, autenticação ou chave TMDB no frontend.

## Iniciar

Requer Node.js 22.12+ e npm.

```powershell
npm install
npm run dev
```

Abra http://localhost:5173. A porta é fixa para respeitar o CORS documentado no backend.

## Conectar ao Spring Boot

Inicie o backend OurMovies separadamente em http://localhost:8080 com PostgreSQL e TMDB configurados conforme o README dele. O frontend não altera nem inicia o backend. O Vite encaminha `/api` para `http://localhost:8080`, evitando problemas de CORS durante desenvolvimento.

Opcionalmente copie `.env.example` para `.env.local` e defina `VITE_API_URL=http://localhost:8080/api` para acessar diretamente. Nesse caso o backend precisa permitir a origem do frontend via CORS. Reinicie o Vite após alterar variáveis. Não coloque credenciais nesse arquivo: variáveis `VITE_` são públicas.

Em produção, configure o servidor para servir `dist`, retornar `index.html` nas rotas da aplicação e encaminhar `/api` ao Spring Boot. Alternativamente defina `VITE_API_URL` para a URL pública da API **antes** do build e configure CORS nela. O proxy Vite existe apenas no desenvolvimento; `vite preview` apenas serve a compilação.

## Comandos

```powershell
npm run build
npm test
npm run preview
```

## Estrutura

```text
src/
  components/
    layout/Layout.jsx       # Navegação, cabeçalho e feedback global
    movies/MovieCard.jsx    # Card, pôster, favorito e ações de lista
    ratings/Ratings.jsx     # Notas, comentários e seleção de usuário
    ui/Feedback.jsx         # Skeleton, estados e confirmação acessível
  hooks/useCollection.jsx   # Estado compartilhado, leituras e mutações
  pages/
    Home.jsx
    Pesquisar.jsx
    MinhasListas.jsx
    FilmeDetalhes.jsx
  services/api.js           # Axios e contratos do backend
  styles/global.css        # Tema, responsividade e movimento reduzido
  utils/movies.js           # Imagens, datas e estatísticas
  App.jsx
  main.jsx
tests/movies.test.js
```

Dependências: React, React DOM, React Router DOM, Axios e Lucide React. Desenvolvimento: Vite e plugin React. Testes utilizam o runner nativo do Node.

## Integração implementada

Contratos conferidos no README, controllers e DTOs de `../OurMovies`, sem modificá-los:

- Pesquisa: `GET /api/filmes/pesquisar?nome=...&pagina=...`, debounce de 400 ms, cancelamento de buscas antigas e paginação (até 500).
- Detalhes: `GET /api/filmes/{tmdbId}/detalhes`. O DTO atual não fornece backdrop; o destaque usa o pôster real com composição cinematográfica. Falhas de imagem exibem placeholder.
- Lista: GET, POST com `{status, favorito}`, PATCH parcial com `{status}` ou `{favorito}` e DELETE com confirmação que informa a remoção das avaliações.
- Avaliações: GET por `filme.id`, POST com `{usuarioId, filmeId, nota, comentario}`, PUT com `{nota, comentario}` e DELETE com confirmação.
- Usuários: GET dos usuários reais. Nenhum nome ou ID é simulado.
- IDs de lista, catálogo local e TMDB são tratados separadamente. A API permite avaliar somente assistidos e impede retornar para quero assistir enquanto existirem avaliações; mensagens do backend são apresentadas ao usuário.
- Notas de 0 a 10 com uma casa decimal; comentários até 2000 caracteres. Média do dashboard ponderada pelo total de avaliações, sem excluir nota zero.

## Validação e limites

Verificação nesta entrega: `npm run build` concluído sem erros e `npm test` com 4 testes aprovados. O servidor Vite respondeu HTTP 200. Não havia backend disponível em `localhost:8080`; as operações reais de pesquisa e gravação ainda precisam ser verificadas com ele ativo. Não foi realizada inspeção visual automatizada em navegador.

Os testes cobrem média ponderada, notas zero, ausência de avaliações, ordenação das sessões e caminhos de imagem. A validação ponta a ponta depende do backend disponível e dos dois usuários cadastrados. Quando a API está offline, a aplicação apresenta erro com nova tentativa; não substitui os dados por exemplos.

O carregamento da fonte Google Fonts é opcional, com fallback local sans-serif. Imagens são requisitadas à CDN pública TMDB; pesquisas e detalhes passam exclusivamente pelo backend.

Roteiro manual com backend ativo: pesquisar e paginar; adicionar nos dois status; alternar favorito e categoria; marcar assistido; avaliar com cada usuário, editar e excluir nota; conferir média; testar conflito ao alterar um filme avaliado para quero assistir; remover filme com confirmação; testar teclado, tela de 360 px e modo de movimento reduzido.
