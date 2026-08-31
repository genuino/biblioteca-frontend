# Biblioteca

Sistema de gerenciamento de biblioteca, com frontend em React/TypeScript (Material UI) e backend em Java Spring Boot (JPA/Hibernate + PostgreSQL).

## Tecnologias

- **Frontend:** React, TypeScript, Material UI e REST
- **Backend:** Java, Spring Boot, JPA/Hibernate, JUnit 5, Mockito e REST
- **Banco de dados:** PostgreSQL
- **Build/Execução do backend:** Maven
  
## Pré-requisitos

- [Docker](https://www.docker.com/) instalado e em execução (necessário para subir o banco de dados PostgreSQL)
- [Java JDK](https://adoptium.net/) (21 ou superior)
- [Maven](https://maven.apache.org/) 
- [Node.js](https://nodejs.org/) e npm/yarn (para rodar o frontend)

### React + TypeScript + Vite

Este template fornece uma configuração mínima para fazer o React funcionar no Vite com HMR (Hot Module Replacement) e algumas regras de ESLint.
Atualmente, dois plugins oficiais estão disponíveis:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)  usa [Babel](https://babeljs.io/)  (ou [oxc](https://oxc.rs)  quando usado no [rolldown-vite](https://vite.dev/guide/rolldown)) para o Fast Refresh 
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para o Fast Refresh React

### React Compiler

O React Compiler está habilitado neste template. [Veja esta documentação](https://react.dev/learn/react-compiler) para mais informações.
Nota: isso vai impactar o desempenho de desenvolvimento e build do Vite.

## Como executar

### 1. Executar o frontend

Dentro da pasta do frontend, execute:

```bash
npm install
npm install eslint-plugin-react-hooks@next --save-dev (Caso acontecer erro no npm install)
npm run dev
```
Bibliotecas podem ser requeridas:

```bash
npm install react-number-format --legacy-peer-deps
npm install date-fns --legacy-peer-deps
```
Depois de instaladas as bibliotecas reinicie o servidor:

```bash
npm run dev
```
O frontend estará disponível em `http://localhost:5173` (ou na porta indicada no terminal, caso esteja usando Vite).

### 3. Backend 

Link: https://github.com/genuino/biblioteca-backend

## Estrutura do projeto

```
biblioteca/
├── backend/       # API Spring Boot
├── frontend/       # Aplicação React
└── docker-compose.yml
```

## Licença

Este projeto está sob a licença [MIT](LICENSE).


