
# OurMovies — Frontend

Interface web desenvolvida em **React e Vite** para organizar os filmes assistidos por um casal, criar uma lista de filmes para assistir, registrar avaliações individuais e visualizar a média das notas.

## 🎬 Demonstração do projeto

Uploading OurMovies — Nosso próximo filme - Google Chrome 2026-11-17 20-10-32 (1).mp4…


---

## Arquitetura do Sistema

O frontend é uma aplicação React que consome a API REST do **OurMovies Backend**. A integração com o catálogo TMDB e o acesso ao PostgreSQL são realizados pelo backend, sem expor credenciais ao navegador.

```mermaid
flowchart TD
    USER["Usuários"] -->|Navegador| REACT["Frontend — React + Vite"]
    REACT --> ROUTER["React Router — Páginas"]
    ROUTER --> COMPONENTS["Componentes, Hooks e Serviços"]
    COMPONENTS -->|Axios / HTTP / JSON| API["Backend — Spring Boot"]
    API --> DB[("PostgreSQL")]
    API -->|RestClient| TMDB["API TMDB"]
```

### Organização do Frontend

| Diretório | Responsabilidade |
|---|---|
| `src/pages` | Telas da aplicação |
| `src/components` | Elementos reutilizáveis da interface |
| `src/hooks` | Lógica compartilhada de componentes React |
| `src/services` | Comunicação HTTP com o backend |
| `src/utils` | Funções auxiliares |
| `src/styles` | Estilos globais e visuais |
| `src/App.jsx` | Composição principal da aplicação e navegação |
| `src/main.jsx` | Inicialização do React |

---

## Tecnologias Utilizadas

| Tecnologia | Aplicação |
|---|---|
| React | Construção da interface |
| JavaScript / JSX | Componentes e lógica da aplicação |
| Vite | Ambiente de desenvolvimento e build |
| React Router DOM | Navegação entre páginas |
| Axios | Comunicação com o backend |
| Lucide React | Ícones |
| CSS | Estilização e responsividade |

---

## Comunicação com o Backend

O frontend utiliza os endpoints REST da aplicação Spring Boot.

| Recurso | Operações |
|---|---|
| `/api/filmes` | Pesquisa e detalhes dos filmes |
| `/api/lista` | Listagem, inclusão, edição e exclusão da coleção |
| `/api/avaliacoes` | Registro, consulta e atualização das avaliações |
| `/api/usuarios` | Consulta dos perfis; personalização disponível na API |

---

## Como Executar

### Pré-requisitos

- Node.js e npm compatíveis com a versão do Vite instalada
- Backend OurMovies em execução em `http://localhost:8080`
- PostgreSQL configurado para o backend

### 1. Clone o repositório do frontend

Clone seu repositório de frontend no GitHub ou abra a pasta local do projeto no VS Code.

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o backend

Certifique-se de que a API responde em:

```text
http://localhost:8080/api/usuarios
```

### 4. Inicie o frontend

```bash
npm run dev
```

Acesse:

```text
http://localhost:5173
```

No desenvolvimento, o proxy do Vite encaminha requisições `/api` ao backend na porta 8080. Se necessário, utilize `http://127.0.0.1:8080` como destino para evitar problemas de resolução IPv6 do `localhost`.

### Build de produção

```bash
npm run build
```

### Testes

Execute o comando de testes definido no `package.json` da versão instalada do projeto.

---

## Projeto Relacionado

**Backend OurMovies:** [OurFilms — GitHub](https://github.com/arthurcoelho04/OurFilms)

O frontend depende da API Spring Boot para consultar e persistir informações. O banco PostgreSQL e a chave TMDB são configurados **somente no backend**.

---

## Autor

**Arthur Coelho**

[GitHub](https://github.com/arthurcoelho04)
