# Mermaid Flow Editor

A modern flowchart editor that bridges the gap between visual diagram creation and markdown documentation, enabling seamless switching between react-flow's interactive editor and Mermaid's popular markdown syntax.

## Key Features

- **Bidirectional Conversion**: Edit flowcharts visually or in Mermaid markdown - changes sync automatically
- **Full Mermaid Compatibility**: Supports all Mermaid flowchart node shapes and edge types
- **AST-Based Architecture**: Robust parsing and generation through Abstract Syntax Tree intermediary
- **Local Storage Persistence**: Auto-saves work with efficient state management
- **Developer Experience**: Docker-based development environment with hot reloading
- **Production Ready**: Optimized build with security measures and monitoring

## Getting up and running


```bash
npm install # or `pnpm install` or `yarn install`
```

```bash
npm run dev
```

## Technical Stack

- React + TypeScript
- @xyflow/react (React Flow)
- AST-based parser/generator
- Vitest + React Testing Library
- Docker + Nginx
- Local Storage API

## Architecture

The core of the application is an AST-based converter that acts as an intermediary between Mermaid markdown and React Flow's visual representation. This approach provides:

- Clean separation between parsing and rendering
- Robust validation and error handling
- Maintainable codebase through clear data structures
- Efficient bidirectional updates

```mermaid
flowchart TB
    Mermaid["Mermaid Markdown"] --> Parser
    Parser --> AST["Abstract Syntax Tree"]
    AST --> Generator["Mermaid Generator"]
    AST --> Converter["React Flow Converter"]
    Converter --> Editor["Visual Editor"]
    Editor --> Converter
    Generator --> Mermaid