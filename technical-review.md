# BitMix CMS: Technical Review

## Project Overview

BitMix CMS is an innovative site-builder/CMS platform enabling the creation of complex, strictly-typed websites. The platform allows developers to create reusable, customizable "frames" (components) in runtime, enabling rapid development of sophisticated web experiences while maintaining type safety throughout the application.

## The Business Challenge

Traditional content management systems face a fundamental conflict: they either provide flexibility at the cost of type safety (like WordPress), or they enforce strict typing at the cost of flexibility (like many headless CMS platforms). This creates a technical debt burden when building complex websites that need both:

1. The ability to compose components visually in a user-friendly interface
2. The guarantee that these compositions remain type-safe across the entire system
3. The flexibility to create custom, reusable component compositions on the fly

BitMix CMS was designed to solve this paradox by providing a system where:
- Developers can create strictly-typed components
- Content creators can visually compose these components
- The system maintains type safety throughout the entire process
- Custom components can be created dynamically while preserving their type definitions

## System Architecture and Implementation Flow

The architecture directly addresses these business requirements through a multi-stage pipeline that preserves type safety while enabling visual composition:

```
┌─────────────────┐     ┌────────────────┐     ┌─────────────────┐     ┌──────────────┐
│ 1. Type-Safe    │     │ 2. Visual      │     │ 3. Rust-Based   │     │ 4. Runtime   │
│    Component    │────▶│    Composition │────▶│    Transpilation│────▶│    Rendering │
│    Library      │     │    Editor      │     │    Engine       │     │    Engine    │
└─────────────────┘     └────────────────┘     └─────────────────┘     └──────────────┘
```

### 1. Type-Safe Component Library

**Business Need**: Developers need to create reusable, type-safe building blocks that form the foundation of the CMS.

**Implementation**: The [`Frame`](packages/cms/library/src/Frame/Frame.tsx) component provides a minimal yet powerful abstraction that maintains TypeScript typing throughout the composition process:

```tsx
type Props<T extends Record<string, any>> = {
    children: (args: Omit<T, 'children'>) => React.ReactNode
} & T

export const Frame = <T extends Record<string, any>>({
    children,
    ...props
}: Props<T>) => {
    return children(props)
}
```

This deceptively simple component is the cornerstone of the entire system. It enables:

- **Type Preservation**: Generic type `T` ensures component props maintain their types
- **Render Props Pattern**: The `children` function receives typed props, enabling flexible rendering
- **Composition Safety**: The TypeScript compiler enforces correct prop usage

In the business context, this means that developers can create typed components that remain type-safe even when composed by non-technical users through the visual editor.

### 2. Type Extraction and Database Synchronization

**Business Need**: Component type definitions need to be available to the CMS system, not just at development time but also at runtime.

**Implementation**: The [type generator](packages/api/generator/index.ts) extracts TypeScript types and synchronizes them with the database:

```typescript
// Analyze component types and extract them
const types = type.getProperties().map((subType) => ({
    name: subType.getName(),
    type: getType(subType.getTypeAtLocation(subType.getValueDeclarationOrThrow()), 0),
}))

// Store in database for runtime use
types.forEach(({ name, type }) => {
    prisma.frame.upsert({
        where: { name },
        update: { type, isBase: true, code: `() => library.${name}` },
        create: { name, type, isBase: true, code: `() => library.${name}` },
    })
})
```

The type extraction process uses sophisticated recursive analysis in [`getType`](packages/api/generator/getType.ts):

```typescript
export const getType = (type: Type, currentLevel = 0) => {
    // Depth protection to avoid infinite recursion
    if (currentLevel > 10) {
        return 'any'
    }

    if (type.isUnion()) {
        return type
            .getUnionTypes()
            .map((unionType) => getType(unionType, currentLevel + 1))
            .join(' | ')
    }
    // Additional type handling...
}
```

This creates a crucial bridge between development-time TypeScript and runtime type information, enabling:

- **Database Storage of Types**: Component types become available to the CMS
- **Runtime Type Checking**: The system can validate compositions against these types
- **Type-Safe API Boundaries**: Components expose only their intended props

From a business perspective, this solves the crucial problem of making TypeScript's development-time type safety available at runtime when users are creating compositions.

### 3. Visual Editor with Type-Safe Node Connections

**Business Need**: Content creators need an intuitive visual interface to compose components while ensuring they connect them in type-safe ways.

**Implementation**: The [ConfigureSchema](packages/cms/src/widgets/ConfigureSchema/ConfigureSchema.tsx) component provides a node-based editor that enforces type compatibility during composition:

```tsx
<TypescriptProvider>
    <TranspileSchema schema={data!}>
        {({ transpiled }) => (
            <UpdateTSExecutable code={transpiled?.jsx} map={transpiled?.map} schema={data!}>
                <SchemaTreeFlow schema={data!} hideCustom={hideCustom}>
                    {({ nodes, edges }) => (
                        <ConnectSchemaNodes nodes={nodes} edges={edges}>
                            {({ onConnect }) => (
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onConnect={onConnect}
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                />
                            )}
                        </ConnectSchemaNodes>
                    )}
                </SchemaTreeFlow>
            </UpdateTSExecutable>
        )}
    </TranspileSchema>
</TypescriptProvider>
```

This composition creates a visual editing experience where:

- **Nodes represent components**: Each component becomes a node in the flow
- **Edges represent prop connections**: Property connections are visualized as edges
- **Type safety is enforced**: Only compatible props can be connected

The [`SchemaNode`](packages/cms/src/widgets/ConfigureSchema/ConfigureSchema.tsx) component handles the connections with type validation:

```tsx
const SchemaNode = ({ data }: NodeProps<SchemaNodeType>) => {
    const { mutate } = useUpdatePropInSchema(data.id)
    const onConnect = (params: Connection, type?: TsProp['type']) => {
        mutate({
            schemaAlias: params.targetHandle!.split('-')[0],
            body: {
                name: params.targetHandle!.split('-')[1],
                type,
                reference: {
                    schemaAlias: params.sourceHandle!.split('-')[0],
                    fieldName: params.sourceHandle!.split('-')[1],
                },
            },
        })
    }
    // Rendering logic...
}
```

The [`SchemaTreeFlow`](packages/cms/src/entities/Schema/ui/SchemaTreeFlow.tsx) component provides automatic layout of the nodes for better visualization:

```typescript
const getLayoutedElements = (nodes: SchemaNodeType[], edges: Edge[], direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph()
    // Set up graph for layout
    dagreGraph.setGraph({ rankdir: direction })
    
    // Add nodes and edges to graph
    nodes.forEach((node) => dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }))
    edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target))
    
    // Apply automatic layout algorithm
    dagre.layout(dagreGraph)
    
    // Update node positions based on layout
    const newNodes = nodes.map((node) => ({
        ...node,
        position: {
            x: dagreGraph.node(node.id).x - nodeWidth / 2,
            y: dagreGraph.node(node.id).y - nodeHeight / 2,
        },
    }))
    
    return { nodes: newNodes, edges }
}
```

From a business perspective, this visual editor provides:
- An intuitive interface that abstracts away the complexity of type checking
- Real-time feedback on valid connections
- Automatic layout for better visualization of component relationships
- The ability for non-technical users to create type-safe compositions

### 4. In-Browser TypeScript Validation Engine

**Business Need**: The system needs to validate component compositions in real-time within the browser, without requiring server roundtrips.

**Implementation**: BitMix implements a full TypeScript compiler and virtual file system in the browser using the [TypescriptContext](packages/cms/src/shared/ui/TypescriptContext/utils.ts):

```typescript
export const createTypeScriptSandbox = async (partialConfig: Partial<SandboxConfig>, ts: typeof import('typescript')) => {
    // Create a virtual file system in the browser
    const fsMap = await createDefaultMapFromCDN(compilerOptions, ts.version, true, ts, lzstring)

    // Set up type acquisition for dependencies
    const pullDependencies = setupTypeAcquisition({
        projectName: 'TypeScript Playground',
        typescript: ts,
        delegate: {
            receivedFile: (code, path) => {
                // Add received type definition files to the virtual file system
                if (created) env.createFile(path, code)
                else fsMap.set(path, code)
            },
            // ...
        },
    })

    // Load React types for component validation
    await pullDependencies('import React from "@types/react";')
}
```

The [`UpdateTSExecutable`](packages/cms/src/features/UpdateTSExecutable/UpdateTSExecutable.tsx) component then uses this TypeScript environment to validate compositions:

```typescript
const handler = async () => {
    // Create type definitions for all frames in the composition
    const framesTypeDefenition = `
        type Library = {
            ${Array.from(uniqueTypes.entries()).map(([name, type]) => `${name}: ${type}`)}
        }
    `

    // Build the full TypeScript code for validation
    const fullDefenition = `${allBefore}${code}}`

    // Update the TypeScript file in the virtual file system
    manipulatorRef?.current.updateFile('input.tsx', fullDefenition)
}
```

This in-browser TypeScript integration enables:
- **Real-time validation**: Compositions are validated as they're created
- **Instant feedback**: Users see type errors immediately
- **No server roundtrips**: The entire validation happens in the browser

This solves a critical business need: providing immediate feedback to users about the validity of their compositions without waiting for server validation.

### 5. Rust-Powered Code Generation

**Business Need**: Once a composition is created, it needs to be efficiently transformed into executable React code.

**Implementation**: BitMix uses a Rust-based code generator compiled to WebAssembly in [`transpile`](packages/builder/src/lib.rs):

```rust
#[wasm_bindgen]
pub fn transpile(json_schema: &str) -> String {
    // Parse the JSON schema into Component structs
    let components: Vec<pack::Component> = serde_json::from_str(json_schema).unwrap_or_else(|err| {
        // Error handling...
    });

    // Build a component tree from the schema
    let component_tree = pack::create_component(
        "",
        HashMap::new(),
        components
            .clone()
            .into_iter()
            .map(|child| pack::create_component_with_children(child, true))
            .map(|child| JSXElementChild::JSXElement(Box::new(child)))
            .collect(),
    );

    // Generate JSX code, component map, and executable code
    let jsx = pack::emit_component_tree(component_tree);
    let map = Some(subchildren::create_component_map(&jsx, &components));
    let code = Some(create_compiled_code(&jsx));

    // Return a JSON result with the generated code
    serde_json::to_string(&Result {
        jsx: Some(jsx),
        errors: vec![],
        map,
        code,
    })
    .unwrap()
}
```

The code generation process in [`pack.rs`](packages/builder/src/pack.rs) builds a complete AST for the component tree:

```rust
pub fn create_component_with_children(component: Component, is_debug: bool) -> JSXElement {
    // Create the component with its children
    let created = create_component(
        &component.type_,
        component.props,
        match component.children {
            Some(children) => vec![
                // Create arrow functions for child components
                JSXElementChild::JSXExprContainer(JSXExprContainer {
                    expr: JSXExpr::Expr(Box::new(Expr::Arrow(ArrowExpr {
                        // Arrow function parameters
                        params: vec![Ident::new(component.id.clone().into(), DUMMY_SP).into()],
                        // Function body with nested components
                        body: Box::new(
                            Expr::Paren(ParenExpr {
                                expr: Box::new(Expr::JSXFragment(JSXFragment {
                                    // Recursively build child components
                                    children: children
                                        .into_iter()
                                        .map(|child| create_component_with_children(child, is_debug))
                                        .map(|child| JSXElementChild::JSXElement(Box::new(child)))
                                        .collect(),
                                    // ...
                                })),
                            })
                            .into(),
                        ),
                        // ...
                    }))),
                    // ...
                })
            ],
            None => vec![],
        },
    );

    // Optionally wrap in debug component
    if is_debug {
        // ...
    }
    
    created
}
```

This Rust-based transformation enables:
- **High-performance code generation**: Rust provides near-native performance
- **Memory efficiency**: Rust's ownership model prevents memory leaks
- **Consistent output**: The generated code follows consistent patterns
- **WebAssembly integration**: The code generator runs directly in the browser

From a business perspective, this means the CMS can handle complex compositions efficiently, generating optimized code even for large component trees.

### 6. Component Rendering and Preview

**Business Need**: Users need to see a real-time preview of their compositions as they build them.

**Implementation**: The [`TranspileSchema`](packages/cms/src/features/TranspileSchema/TranspileSchema.tsx) component bridges the gap between the visual editor and the runtime rendering:

```typescript
export const transpile = (schema: Schema): Transpiled => {
    // Convert schema to a format suitable for transpilation
    const transpileReady = convertSchemaToTranspileReady(schema)
    // Stringify for processing by the Rust transpiler
    const stringified = JSON.stringify([transpileReady], null, 2)
    // Call the WebAssembly transpile function
    return JSON.parse(originalTranspile(stringified))
}

export const TranspileSchema = ({ schema, children }: Props) => {
    const [transpiled, setTranspiled] = useState<Transpiled | null>(null)
    
    useEffect(() => {
        // Generate code from the schema
        const result = transpile(schema)
        // Store the result if there are no errors
        if (!result.erorrs?.length) setTranspiled(result)
    }, [schema])

    // Provide the transpiled code to children
    return <>{children({ transpiled })}</>
}
```

This enables:
- **Real-time preview**: Users see their compositions as they build them
- **Immediate feedback**: Changes are reflected instantly
- **Visual validation**: Users can confirm the visual appearance matches their intent

From a business perspective, this completes the loop: users can visually compose components, see the result immediately, and iterate quickly without writing code.

## Core Technologies

BitMix strategically combines cutting-edge technologies to achieve its business goals:

### Frontend
- **React** (v18+): Core UI library for component-based architecture
- **TypeScript** (v5+): Static typing and type safety throughout the application
- **Tanstack Router**: Type-safe routing with automatic code splitting
- **Tanstack Query**: Data fetching, caching, and state management
- **XY Flow/React Flow**: Interactive node-based visual editor
- **Mantine UI**: Component library and theming system
- **Monaco Editor**: In-browser code editor with TypeScript support
- **dagre**: Automatic graph layout algorithm for node positioning
- **SWR**: React hooks for data fetching and caching

### Backend
- **Node.js**: JavaScript runtime for server-side code
- **Express**: Web framework for API endpoints
- **Prisma ORM**: Type-safe database access with migrations
- **SQLite** (dev), **PostgreSQL** (prod): Database options
- **TypeScript**: Type-safe backend development
- **zod**: Runtime type validation for API requests/responses

### Build System & Tooling
- **Vite**: Modern build tooling and dev server
- **WebAssembly**: Runtime for Rust code in browser
- **Rust/SWC**: Code generation and transformation
- **ts-morph**: TypeScript compiler API for type extraction
- **esbuild**: Fast JavaScript bundling
- **NPM Workspaces**: Monorepo package management
- **Docker**: Containerization for development and deployment

### Code Generation & Transformation
- **Rust**: High-performance code transformation
- **SWC (Speedy Web Compiler)**: JavaScript/TypeScript transformer
- **AST Manipulation**: Abstract Syntax Tree processing
- **In-Browser TypeScript Compiler**: Runtime type checking
- **Virtual File System**: In-memory file system for browser

### Developer Experience
- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting
- **Vitest**: Unit and integration testing
- **Storybook**: Component development and documentation
- **TypeDoc**: API documentation generation
- **GitHub Actions**: CI/CD workflows

### Integration & Deployment
- **Docker Compose**: Multi-container application orchestration
- **Nginx**: Web server and reverse proxy
- **GitHub Packages**: Container registry
- **Digital Ocean** (example): Cloud hosting platform

## Complete Technology Stack

### Frontend
- **React** (v18+): Core UI library for component-based architecture
- **TypeScript** (v5+): Static typing and type safety throughout the application
- **Tanstack Router**: Type-safe routing with automatic code splitting
- **Tanstack Query**: Data fetching, caching, and state management
- **XY Flow/React Flow**: Interactive node-based visual editor
- **Mantine UI**: Component library and theming system
- **Monaco Editor**: In-browser code editor with TypeScript support
- **dagre**: Automatic graph layout algorithm for node positioning
- **SWR**: React hooks for data fetching and caching

### Backend
- **Node.js**: JavaScript runtime for server-side code
- **Express**: Web framework for API endpoints
- **Prisma ORM**: Type-safe database access with migrations
- **SQLite** (dev), **PostgreSQL** (prod): Database options
- **TypeScript**: Type-safe backend development
- **zod**: Runtime type validation for API requests/responses

### Build System & Tooling
- **Vite**: Modern build tooling and dev server
- **WebAssembly**: Runtime for Rust code in browser
- **Rust/SWC**: Code generation and transformation
- **ts-morph**: TypeScript compiler API for type extraction
- **esbuild**: Fast JavaScript bundling
- **NPM Workspaces**: Monorepo package management
- **Docker**: Containerization for development and deployment

### Code Generation & Transformation
- **Rust**: High-performance code transformation
- **SWC (Speedy Web Compiler)**: JavaScript/TypeScript transformer
- **AST Manipulation**: Abstract Syntax Tree processing
- **In-Browser TypeScript Compiler**: Runtime type checking
- **Virtual File System**: In-memory file system for browser

### Developer Experience
- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting
- **Vitest**: Unit and integration testing
- **Storybook**: Component development and documentation
- **TypeDoc**: API documentation generation
- **GitHub Actions**: CI/CD workflows

### Integration & Deployment
- **Docker Compose**: Multi-container application orchestration
- **Nginx**: Web server and reverse proxy
- **GitHub Packages**: Container registry
- **Digital Ocean** (example): Cloud hosting platform

## Technical Challenges Solved

### Type Safety Across System Boundaries

**Business Problem**: Ensuring type safety between development-time component creation and runtime component composition.

**Solution**: The combination of TypeScript type extraction, database storage, and in-browser TypeScript validation creates a continuous type safety chain from development to runtime.

### Visual Programming with Type Guarantees

**Business Problem**: Making component composition accessible to non-developers while maintaining type safety.

**Solution**: The node-based editor with typed connections and real-time validation provides an intuitive interface that enforces type correctness without requiring coding knowledge.

### Performance for Complex Compositions

**Business Problem**: Handling large component trees efficiently in the browser.

**Solution**: The Rust-based transpiler compiled to WebAssembly provides near-native performance for code generation, enabling complex compositions to be processed quickly.

## Architectural Patterns

### 1. Feature-Sliced Design

The frontend follows a Feature-Sliced Design architecture:

```
packages/cms/src/
├── app/        # Application initialization 
├── entities/   # Business entities (Frame, Schema, etc.)
├── features/   # User interactions (AddSchemaChildren, etc.)
├── pages/      # Page components
├── shared/     # Shared UI elements and utilities
└── widgets/    # Complex UI blocks (ConfigureSchema, etc.)
```

### 2. Render Props Pattern

Extensive use of the render props pattern for flexible component composition:

```tsx
<GetAvailablePropsForFrame schema={data}>
    {({ props }) => (
        <ManageSchemaVisibleProps schema={data} args={props}>
            {({ selectedArgs }) => (
                // component rendering
            )}
        </ManageSchemaVisibleProps>
    )}
</GetAvailablePropsForFrame>
```

### 3. Microservices Architecture

The project uses a microservices approach with separate packages for different concerns:

- **API**: Backend services
- **CMS**: Frontend application
- **Builder**: Code generation service
- **Library**: Core component definitions

## Conclusion

BitMix CMS represents a sophisticated solution to the fundamental business challenge of combining flexible component composition with strict type safety. By integrating advanced technologies—from in-browser TypeScript compilation to Rust-based code generation—it creates a seamless workflow from development to runtime.

The system enables:
- Developers to create type-safe components
- Content creators to visually compose these components
- The system to maintain type safety throughout
- Real-time preview and validation

This technical architecture demonstrates how sophisticated engineering can solve real business problems, creating a content management system that combines the best of both worlds: the flexibility of visual composition with the reliability of strict typing. 