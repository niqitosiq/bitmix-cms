# Backend

This is the backend of the project.

## Project Structure

```
backend
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── siteController.ts
│   │   ├── pageController.ts
│   │   ├── categoryController.ts
│   │   ├── schemaController.ts
│   │   └── frameController.ts
│   ├── models
│   │   ├── site.ts
│   │   ├── page.ts
│   │   ├── category.ts
│   │   ├── schema.ts
│   │   └── frame.ts
│   ├── prisma
│   │   └── schema.prisma
│   └── routes
│       ├── siteRoutes.ts
│       ├── pageRoutes.ts
│       ├── categoryRoutes.ts
│       ├── schemaRoutes.ts
│       └── frameRoutes.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Files

- `src/app.ts`: This file is the entry point of the application. It creates an instance of the Express app, sets up middleware, and connects to the SQLite database using Prisma ORM.

- `src/controllers/siteController.ts`: This file exports a class `SiteController` which contains methods for handling CRUD operations related to the `Site` entity.

- `src/controllers/pageController.ts`: This file exports a class `PageController` which contains methods for handling CRUD operations related to the `Page` entity.

- `src/controllers/categoryController.ts`: This file exports a class `CategoryController` which contains methods for handling CRUD operations related to the `Category` entity.

- `src/controllers/schemaController.ts`: This file exports a class `SchemaController` which contains methods for handling CRUD operations related to the `Schema` entity.

- `src/controllers/frameController.ts`: This file exports a class `FrameController` which contains methods for handling CRUD operations related to the `Frame` entity.

- `src/models/site.ts`: This file exports a TypeScript interface `Site` which represents the fields of the `Site` entity.

- `src/models/page.ts`: This file exports a TypeScript interface `Page` which represents the fields of the `Page` entity.

- `src/models/category.ts`: This file exports a TypeScript interface `Category` which represents the fields of the `Category` entity.

- `src/models/schema.ts`: This file exports a TypeScript interface `Schema` which represents the fields of the `Schema` entity.

- `src/models/frame.ts`: This file exports a TypeScript interface `Frame` which represents the fields of the `Frame` entity.

- `src/prisma/schema.prisma`: This file is the Prisma schema file which defines the database schema and models for the SQLite database.

- `src/routes/siteRoutes.ts`: This file exports a function `setSiteRoutes` which sets up the routes for the `Site` entity. It uses the `SiteController` to handle the CRUD operations.

- `src/routes/pageRoutes.ts`: This file exports a function `setPageRoutes` which sets up the routes for the `Page` entity. It uses the `PageController` to handle the CRUD operations.

- `src/routes/categoryRoutes.ts`: This file exports a function `setCategoryRoutes` which sets up the routes for the `Category` entity. It uses the `CategoryController` to handle the CRUD operations.

- `src/routes/schemaRoutes.ts`: This file exports a function `setSchemaRoutes` which sets up the routes for the `Schema` entity. It uses the `SchemaController` to handle the CRUD operations.

- `src/routes/frameRoutes.ts`: This file exports a function `setFrameRoutes` which sets up the routes for the `Frame` entity. It uses the `FrameController` to handle the CRUD operations.

- `.env`: This file is used to store environment variables. It may contain the configuration for the SQLite database connection.

- `package.json`: This file is the configuration file for npm. It lists the dependencies and scripts for the project.

- `tsconfig.json`: This file is the configuration file for TypeScript. It specifies the compiler options and the files to include in the compilation.

- `README.md`: This file contains the documentation for the project.
```

Please note that this file is intentionally left blank. You can update it with the relevant information about your project.
```