# Biblioteca

Sistema de gerenciamento de biblioteca, com frontend em React/TypeScript (Material UI) e backend em Java Spring Boot (JPA/Hibernate + PostgreSQL).

## Tecnologias

- **Frontend:** React, TypeScript, Material UI
- **Backend:** Java, Spring Boot, JPA/Hibernate
- **Banco de dados:** PostgreSQL
- **Build/Execução do backend:** Maven

## Pré-requisitos

- [Docker](https://www.docker.com/) instalado e em execução (necessário para subir o banco de dados PostgreSQL)
- [Java JDK](https://adoptium.net/) (21 ou superior)
- [Maven](https://maven.apache.org/) instalado (ou utilize o Maven Wrapper `./mvnw` incluído no projeto, se disponível)
- [Node.js](https://nodejs.org/) e npm/yarn (para rodar o frontend)

### React + TypeScript + Vite

Este template fornece uma configuração mínima para fazer o React funcionar no Vite com HMR (Hot Module Replacement) e algumas regras de ESLint.
Atualmente, dois plugins oficiais estão disponíveis:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)  usa [Babel](https://babeljs.io/)  (ou [oxc](https://oxc.rs)  quando usado no [rolldown-vite](https://vite.dev/guide/rolldown)) para o Fast Refresh 
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para o Fast Refresh React

### React Compiler

O React Compiler está habilitado neste template. [Veja esta documentação](https://react.dev/learn/react-compiler) para mais informações.
Nota: isso vai impactar o desempenho de desenvolvimento e build do Vite.

### Informações adicionais

Caso tenha necessidade faça as alterações abaixo.

Expandindo a configuração do ESLint
Se você está desenvolvendo uma aplicação em produção, recomendamos atualizar a configuração para habilitar regras de lint que levam em conta os tipos:

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
Você também pode instalar [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) e [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) para regras de lint do React-specific :

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


