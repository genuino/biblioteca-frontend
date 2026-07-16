# Biblioteca

Sistema de gerenciamento de biblioteca, com frontend em React/TypeScript (Material UI) e backend em Java Spring Boot (JPA/Hibernate + PostgreSQL).

## Tecnologias

- **Frontend:** React, TypeScript, Material UI
- **Backend:** Java, Spring Boot, JPA/Hibernate
- **Banco de dados:** PostgreSQL
- **Build/Execução do backend:** Maven

## Pré-requisitos

- [Docker](https://www.docker.com/) instalado e em execução (necessário para subir o banco de dados PostgreSQL)
- [Java JDK](https://adoptium.net/) (17 ou superior)
- [Maven](https://maven.apache.org/) instalado (ou utilize o Maven Wrapper `./mvnw` incluído no projeto, se disponível)
- [Node.js](https://nodejs.org/) e npm/yarn (para rodar o frontend)

## Como executar

### 1. Executar o frontend

Dentro da pasta do frontend, execute:

```bash
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (ou na porta indicada no terminal, caso esteja usando Vite).


### 3. Backend 

Link: 

## Estrutura do projeto

```
biblioteca/
├── backend/       # API Spring Boot
├── frontend/       # Aplicação React
└── docker-compose.yml
```

## Licença

Este projeto está sob a licença [MIT](LICENSE).

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
