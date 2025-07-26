# Arquitetura do Projeto

Este projeto utiliza **React** com **Redux Toolkit** para gerenciamento de estado global, **React Router** para navegação entre páginas, e **Styled Components** para estilização. Abaixo estão os principais componentes da arquitetura:

## Estrutura de Pastas

- **src/**
  - **api.ts**: Configuração dos clientes Axios para comunicação com a API backend, incluindo interceptadores para autenticação.
  - **App.tsx**: Componente principal que inicializa o roteamento.
  - **routes.tsx**: Define as rotas da aplicação utilizando `react-router-dom`.
  - **Authenticated.tsx**: Componente de rota protegida, verifica se o usuário está autenticado antes de permitir acesso.
  - **pages/**: Contém as páginas principais (`HomePage.tsx`, `LoginPage.tsx`).
  - **store/**: Gerenciamento de estado global com Redux Toolkit.
    - **reducers/**: Slices para autenticação (`auth.ts`) e tarefas (`task.ts`).
    - **hooksTipados.ts**: Hooks customizados tipados para uso do Redux.
    - **index.ts**: Configuração da store Redux.
  - **types/**: Tipos TypeScript utilizados em todo o projeto (`task.ts`).

## Fluxo de Autenticação

- O token JWT é armazenado no `localStorage` após login.
- O slice de autenticação (`auth.ts`) gerencia o estado do usuário e token.
- O componente [`Authenticated`](src/Authenticated.tsx) protege rotas privadas, redirecionando para `/login` se não houver token.

## Gerenciamento de Tarefas

- O slice [`task`](src/store/reducers/task.ts) utiliza `createAsyncThunk` para requisições assíncronas à API.
- As tarefas são carregadas, criadas, atualizadas e removidas via chamadas à API, com atualização automática do estado global.

## Navegação

- As rotas são definidas em [`routes.tsx`](src/routes.tsx), utilizando o componente `Routes` do React Router.
- Páginas principais: Home (`HomePage.tsx`) e Login (`LoginPage.tsx`).

## Estilização

- Utiliza [`styled-components`](https://styled-components.com/) para componentes customizados.
- Integração com [`react-bootstrap`](https://react-bootstrap.github.io/) para componentes visuais.

## Testes

- Configuração de testes com [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/) e [`jest`](https://jestjs.io/).
- Testes de componentes em [`App.test.tsx`](src/App.test.tsx).

## Como funciona o ciclo de dados

1. Usuário faz login, token é salvo no localStorage e no estado global.
2. Requisições à API utilizam o token para autenticação.
3. Tarefas são carregadas e manipuladas via Redux, refletindo automaticamente na interface.
4. Navegação entre páginas é controlada pelo React Router, com proteção de rotas.

---

Para mais detalhes sobre cada componente, consulte os arquivos correspondentes:

- [src/api.ts](src/api.ts)
- [src/store/reducers/auth.ts](src/store/reducers/auth.ts)
- [src/store/reducers/task.ts](src/store/reducers/task.ts)
- [src/pages/HomePage.tsx](src/pages/HomePage.tsx)
- [src/pages/LoginPage.tsx](src/pages/LoginPage.tsx)