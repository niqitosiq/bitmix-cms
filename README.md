# BitMix CMS

<p align="center">
  <img src="https://via.placeholder.com/200x200?text=BitMix+CMS" alt="BitMix CMS Logo" width="200" height="200">
</p>

<p align="center">
  <strong>A modern, type-safe visual site builder and component composition system</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <strong>⚠️ NOTE: This project is no longer under active development ⚠️</strong>
</p>

<p align="center">
  <a href="technical-review.md"><strong>📄 TECHNICAL DOCUMENTATION 📄</strong></a>
</p>

## Introduction

BitMix CMS is an innovative site-builder/CMS platform for creating complex, strictly-typed websites. It allows developers to create reusable, customizable "frames" (components) in runtime, enabling rapid development of sophisticated web experiences while maintaining full type safety throughout the application.

### Key Innovations

- **Visual Component Composition**: Create complex component structures through a visual node-based editor
- **Full TypeScript Integration**: Runtime type checking with an in-browser TypeScript compiler
- **WebAssembly-Powered Compilation**: High-performance code generation using Rust and SWC
- **Database-Synced Type System**: Automatic synchronization of TypeScript types with database schemas

### Presentations

- [Business Presentation](https://disk.yandex.ru/d/USGebhyCOPQLfQ)

## Features

- **Type-Safe Component System**
  - Create strictly-typed components with fully preserved TypeScript typing
  - Runtime type checking and validation
  - Composition with guaranteed type safety

- **Visual Editor**
  - Node-based editor for component composition
  - Drag-and-drop interface for building pages
  - Real-time preview of components

- **Custom Frame Creation**
  - Build reusable component compositions
  - Expose selected props to create API boundaries
  - Save and reuse custom frames across projects

- **Advanced TypeScript Integration**
  - Full TypeScript compiler in the browser
  - Virtual file system for type definitions
  - Automatic type acquisition for dependencies

- **High-Performance Compilation**
  - WebAssembly-powered code generation
  - AST-based transformation pipeline
  - Optimized rendering of dynamic components

## Demo

[Try the online demo](https://bitmix-cms-demo.example.com) (coming soon)

## Installation

### Prerequisites

- Node.js 18+
- Rust (latest stable version)
- wasm-pack

### Quick Start

```bash
# Clone the repository
git clone https://github.com/niqitosiq/bitmix-cms.git
cd bitmix-cms

# Install dependencies and initialize submodules
npm install
git submodule update --init --recursive

# Start the API server
cd ./packages/api
npm run migrate  # Initialize the database
npm run library  # Generate component library definitions
npm run dev      # Start the API server

# In a new terminal, start the CMS frontend
cd ./packages/cms
npm run dev

# Open your browser at http://localhost:5173
```

### Docker Setup

For containerized development:

```bash
docker-compose -f dev.docker-compose.yml up
```

## Usage

### Creating a Site

1. Navigate to the home page
2. Click "Create Site" and enter a site name
3. Your new site will appear in the sites list

### Creating a Page

1. Select a site from the sites list
2. Click "Add Page"
3. Enter page details (name, URL path)
4. Save to create the page

### Building a Custom Frame

1. Navigate to the Frames section
2. Click "Create Custom Frame"
3. Use the node-based editor to:
   - Add components from the library
   - Connect component properties
   - Configure default values
   - Pin properties to expose them as the frame's API
4. Preview the frame in real-time
5. Save the frame to reuse it in your pages

### Composing a Page

1. Navigate to the page editor
2. Drag frames from the library or custom frames panel
3. Configure frame properties
4. Preview the page in real-time
5. Save changes

## Architecture

BitMix is built using a modern monorepo structure with distinct packages:

```
bitmix-cms/
├── packages/
│   ├── api/            # Backend services
│   ├── cms/            # Frontend application
│   │   └── library/    # Core reusable components
│   ├── builder/        # Rust code transformer
│   └── nginx/          # Web server configuration
└── submodules/         # External dependencies
```

### Key Components

1. **Component Library** (`packages/cms/library/src`)
   - Core building blocks with strict TypeScript typing
   - Implements the Frame concept for component composition

2. **Type Generator** (`packages/api/generator`)
   - Extracts TypeScript types from components
   - Stores component definitions in the database

3. **CMS Editor** (`packages/cms/src`)
   - Visual editor for building pages and custom frames
   - Node-based interface for component composition

4. **Rust Code Transformer** (`packages/builder/src`)
   - Transforms JSON schemas into JSX/React code
   - WebAssembly integration for performance

5. **API Backend** (`packages/api/src`)
   - RESTful API for accessing CMS data
   - Prisma-based data layer with strict typing

### Technology Stack

- **Frontend**: React, TypeScript, Tanstack Router/Query, XY Flow, Mantine UI
- **Backend**: Node.js, Express, Prisma ORM, SQLite
- **Compilation**: Rust, WebAssembly, SWC
- **Build Tools**: Vite, NPM Workspaces, Docker

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (coming soon)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards

- Follow the established code style (TypeScript, Prettier)
- Write descriptive commit messages
- Include appropriate tests
- Update documentation for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Rust](https://www.rust-lang.org/)
- [SWC](https://swc.rs/)
- [React Flow](https://reactflow.dev/)
- [Prisma](https://www.prisma.io/)
- All our contributors and supporters

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/niqitosiq">niqitosiq</a>
</p>
