# BitMix CMS 

<p align="center">
  <strong>Accelerate Web Development with Type-Safe Visual Component Composition</strong>
</p>

<p align="center">
  <a href="#value-proposition">Value Proposition</a> •
  <a href="#business-benefits">Business Benefits</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#architecture">Architecture</a>
</p>

<p align="center">
  <strong>⚠️ NOTE: This project is no longer under active development ⚠️</strong>
</p>

<p align="center">
  <a href="technical-review.md"><strong>📄 TECHNICAL DOCUMENTATION 📄</strong></a>
</p>

## Value Proposition

BitMix CMS bridges the gap between developer productivity and content creator autonomy. It solves the fundamental challenge facing modern web development teams: balancing the need for strict type safety with the flexibility of visual composition.

### For Business Leaders

- **Reduce Time-to-Market**: Accelerate development cycles through visual component composition
- **Lower Development Costs**: Minimize expensive developer hours spent on repetitive UI implementation
- **Improve Quality**: Eliminate common runtime errors through guaranteed type safety
- **Enhance Team Collaboration**: Enable designers, developers, and content creators to work in parallel

### For Development Teams

- **Eliminate Type Errors**: Catch composition errors at design time instead of runtime
- **Standardize Component Usage**: Ensure consistent implementation across the organization
- **Accelerate UI Development**: Focus on creating core components while enabling rapid composition
- **Reduce Technical Debt**: Maintain strict typing throughout the system, even with complex compositions

## Business Benefits

### ROI Factors

1. **Development Efficiency**
   - Reduction in UI implementation time
   - Parallel workflows between developers and content creators
   - Reduced QA cycles for type-related issues

2. **Error Reduction**
   - Elimination of prop-type related runtime errors
   - Early detection of incompatible component compositions
   - Real-time validation during the design process

3. **Operational Advantages**
   - Reduced dependency on specialized developers for content updates
   - Faster time-to-market for new pages and features
   - More efficient use of developer resources for complex tasks

4. **Scalability**
   - Component reusability across multiple projects
   - Consistent interface across all digital properties
   - Streamlined onboarding for new team members

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/niqitosiq">niqitosiq</a>
</p>
