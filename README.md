<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

---

# NestJS Comprehensive Guide & Reference

Welcome to the comprehensive guide for NestJS! This guide walks you through NestJS architecture, building blocks, and best practices.

## Table Of Contents

- [Chapter 1: What is Backend Development?](#chapter-1-what-is-backend-development)
- [Chapter 2: Why NestJS? (And Why Not Just Express?)](#chapter-2-why-nestjs-and-why-not-just-express)
- [Chapter 3: Setting Up Your First Project](#chapter-3-setting-up-your-first-project)
- [Chapter 4: Modules: Organizing Your App](#chapter-4-modules-organizing-your-app)
- [Chapter 5: Controllers: Handling Requests](#chapter-5-controllers-handling-requests)
- [Chapter 6: Services & Dependency Injection](#chapter-6-services--dependency-injection)
- [Chapter 7: NestJS Reference Cheat Sheet](#chapter-7-nestjs-reference-cheat-sheet)

---

## Chapter 1: What is Backend Development?

A quick, no-fluff primer on what a server actually does, what an API is, and why you need NestJS.

### The Two Sides of Every App
Every application you use (Instagram, weather apps, online stores) is split into two parts:
* **The frontend** — Everything you see and interact with (buttons, forms, images, pages).
* **The backend** — Everything that happens behind the scenes (storing data, running logic, talking to databases, and serving responses).

> [!NOTE]
> **Restaurant Analogy:** The frontend is the dining room, tables, menu, and waitstaff taking your order. The backend is the kitchen, chefs, ingredients, and the actual cooking that the customer never sees.

### What is a Server?
A server is a program that runs continuously and listens for requests. When a client visits your app or calls your API, they send an HTTP request to the server. The server processes it (e.g., reads from a database, runs logic, checks permissions) and returns an HTTP response.

HTTP defines the format of these requests and responses, including:
* **URL** — Where the request is going (e.g., `/api/users`).
* **Method** — What the request wants to do (`GET`, `POST`, `PUT`, `DELETE`).
* **Body** — Data sent along with the request (like form submissions or JSON data).
* **Status code** — The result of the request (`200 OK`, `201 Created`, `404 Not Found`, `500 Server Error`).

### What is an API?
An API (Application Programming Interface) is a set of rules defining how software components talk to each other. In web development, it is a collection of URL endpoints that your backend exposes. 

For example, when a frontend sends a `GET` request to `/api/users`, the backend fetches the users from the database and returns them as a JSON response.

### What Does a Backend Developer Actually Do?
* Designing and building API endpoints.
* Reading and writing data to a database.
* Validating and sanitizing incoming data.
* Handling authentication (who are you?) and authorization (what are you allowed to do?).
* Writing business logic (the core rules of the application).

---

## Chapter 2: Why NestJS? (And Why Not Just Express?)

### Express: The Wild West of Backend Development
Express.js is the most popular Node.js framework. It is small, fast, and highly flexible. However, Express gives you complete, unconstrained freedom. 
```javascript
const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'John Doe' }]);
});

app.listen(3000);
```

#### The Problem with Too Much Freedom
In a growing codebase with multiple developers, this freedom can lead to spaghetti code because there are no rules. You can write 5,000 lines of logic in a single file, query the database directly inside route handlers, and mix authentication logic with business logic.

### NestJS: A Modern City with Zoning Laws
If Express is the Wild West, NestJS is a modern city with strict zoning laws. It is an **opinionated framework** with strong conventions on how code should be structured, ensuring developers can instantly navigate any NestJS project.

#### The Three Core Building Blocks
1. **Modules**: Containers that group related code together. Every feature of your app lives in its own module.
2. **Controllers**: Classes that handle incoming HTTP requests and return responses. They act as receptionists that route requests.
3. **Services**: Classes containing the business logic. The controller delegates the work to a service and returns the result.

#### NestJS Runs on Top of Express
NestJS does not replace Express; it runs on top of it. You get all the speed and reliability of Express, combined with NestJS's structured architecture.

### Three Superpowers of NestJS
1. **TypeScript by Default**: Provides type safety, autocompletion, and clear compile-time error messages.
2. **Dependency Injection**: A design pattern that makes managing dependencies between classes clean and testable.
3. **Decorators**: Special labels attached to classes and methods (e.g., `@Controller()`, `@Get()`) to declaratively configure how they behave.
```typescript
@Controller('users')
export class UserController {
  @Get()
  findAll() {
    return 'This returns all users';
  }
}
```

---

## Chapter 3: Setting Up Your First Project

### Step 1: Check Your Node.js Version
Verify that you have Node.js 20+ installed:
```bash
node -v
npm -v
```

### Step 2: Install the NestJS CLI
Install the CLI globally:
```bash
npm install -g @nestjs/cli
```

### Step 3: Scaffold a New Project
Create a new project using:
```bash
nest new my-nest-app
```
Select `npm` (or your preferred package manager) and hit Enter.

### Step 4: Understanding the File Structure
```text
my-nest-app/
├── src/
│   ├── app.controller.ts      # Sample controller
│   ├── app.module.ts          # Root module
│   ├── app.service.ts         # Sample service
│   └── main.ts                # App entry point
├── package.json
└── tsconfig.json
```

* **[main.ts](file:///Users/muhammadrafiq/Desktop/courses/NestJS/src/main.ts)**: The entry point of your app. Here is the default bootstrap code:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### Step 5: Running the Server
Use watch mode during development so the server restarts automatically when files change:
```bash
npm run start:dev
```
Open `http://localhost:3000` to see the default "Hello World!" message.

---

## Chapter 4: Modules: Organizing Your App

### What is a Module?
A module groups related code together. Each feature (e.g., `UserModule`, `HackathonModule`, `SubmissionModule`) lives in its own module directory with its own controllers and services. 

### The Root Module
Every NestJS app has at least one module, the root module (typically `AppModule`).
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
* `imports`: Other modules whose exported providers this module needs.
* `controllers`: The controllers that belong to this module.
* `providers`: The services (and other injectables) that belong to this module.

### The Module Tree
NestJS builds a tree of modules starting from the root. If a module is not registered in this tree, NestJS will not load it.

### Creating a Module with the CLI
```bash
nest generate module user
# Shorthand: nest g module user
```
This automatically creates `src/user/user.module.ts` and imports `UserModule` into `AppModule`.

```typescript
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule], // <-- added automatically
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Add a controller and a service to the module:
```bash
nest g controller user
nest g service user
```
This updates `user.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

---

## Chapter 5: Controllers: Handling Requests

Controllers listen for incoming requests on specific paths, parse input data, and return responses.

### The @Controller Decorator
The path prefix passed to `@Controller('prefix')` prefix-routes all handlers inside that class:
```typescript
import { Controller } from '@nestjs/common';

@Controller('user')
export class UserController {}
```

### Route Method Decorators
These map methods to specific HTTP verbs and sub-paths:
```typescript
import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('user')
export class UserController {
  // Responds to: GET /user
  @Get()
  findAll() {
    return [];
  }

  // Responds to: GET /user/:id
  @Get(':id')
  findOne() {
    return {};
  }

  // Responds to: POST /user
  @Post()
  create() {
    return {};
  }

  // Responds to: PUT /user/:id
  @Put(':id')
  update() {
    return {};
  }

  // Responds to: DELETE /user/:id
  @Delete(':id')
  remove() {
    return {};
  }
}
```

### Parameter Decorators
NestJS provides decorators to extract values directly from the request object:

#### 1. Reading URL Parameters with `@Param`
```typescript
import { Controller, Get, Param } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id }; // GET /user/42 -> returns { id: '42' }
  }
}
```

#### 2. Reading the Request Body with `@Body`
```typescript
import { Controller, Post, Body } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Post()
  create(@Body() body: { name: string; email: string }) {
    console.log(body.name);
    return body;
  }
}
```

#### 3. Reading Query Strings with `@Query`
```typescript
import { Controller, Get, Query } from '@nestjs/common';

@Controller('user')
export class UserController {
  // Responds to: GET /user?name=John
  @Get()
  findAll(@Query('name') name: string) {
    return `Searching for user: ${name}`;
  }
}
```

#### 4. Combining Decorators
```typescript
@Put(':id')
update(@Param('id') id: string, @Body() body: { name: string }) {
  return { id, updatedName: body.name };
}
```

### Keep Controllers Thin
Controllers should strictly handle incoming requests and outgoing responses. Business logic, DB operations, and calculations belong in a Service class.
```typescript
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query('name') name?: string) {
    return this.userService.findAll(name);
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }
}
```

---

## Chapter 6: Services & Dependency Injection

### What is a Service?
Services contain the reusable business logic. They are decorated with `@Injectable()` so NestJS can manage and inject them.

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

### Dependency Injection Explained

> [!NOTE]
> **Pizza Chef Analogy:** 
> * **Without DI:** A chef pauses cooking, drives to a farm, picks tomatoes, drives back, and resumes. The chef is tightly coupled to that specific farm.
> * **With DI:** The chef stays in the kitchen. A tomato supplier delivers tomatoes. The chef does not care where they came from as long as they arrive.

In code:
```typescript
// WITHOUT DI (Tightly coupled)
class PizzaChef {
  makePizza() {
    const farm = new JoesFarm();
    const tomatoes = farm.getTomatoes();
  }
}

// WITH DI (Loosely coupled)
class PizzaChef {
  constructor(private supplier: TomatoSupplier) {}
  makePizza() {
    const tomatoes = this.supplier.getTomatoes();
  }
}
```

### Injecting a Service into a Controller
Declare the service in the class constructor:
```typescript
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
```
NestJS automatically creates a singleton instance of `UserService` and injects it.

---

## Chapter 7: NestJS Reference Cheat Sheet

### Decorators

#### Module & Class Decorators
* `@Module({})` — Marks a class as a module.
* `@Controller('path')` — Marks a class as a controller.
* `@Injectable()` — Marks a class as a provider.
* `@Global()` — Makes exported providers globally available.
* `@Catch(ExceptionType)` — Marks a class as an exception filter.

#### Route Method Decorators
* `@Get()`, `@Post()`, `@Put()`, `@Patch()`, `@Delete()`, `@Head()`, `@Options()`, `@All()`

#### Parameter Decorators
* `@Param('key')` — Extract route parameters.
* `@Body('key')` — Extract request body properties.
* `@Query('key')` — Extract query parameters.
* `@Headers('key')` — Extract request headers.
* `@Ip()` — Extract client IP.
* `@Req()`, `@Res()`, `@Next()` — Access raw Express request, response, and next handler.

#### Guards, Pipes, Interceptors & Filters
* `@UseGuards()`, `@UseInterceptors()`, `@UsePipes()`, `@UseFilters()`

#### Response & Metadata Decorators
* `@HttpCode(code)` — Customize response status codes.
* `@Header('name', 'value')` — Customize response headers.
* `@Redirect('url', statusCode)` — Redirect responses.
* `@SetMetadata('key', value)` — Attach custom metadata.

#### Custom Decorators
* `@Inject(token)` — Inject provider via a custom token.
* `createParamDecorator()` — Build custom parameter decorators.
* `@Optional()` — Mark injected dependency as optional.

#### Validation Decorators
Requires `class-validator` & `class-transformer`:
`@IsString()`, `@IsNumber()`, `@IsBoolean()`, `@IsEmail()`, `@IsUrl()`, `@IsUUID()`, `@IsOptional()`, `@IsNotEmpty()`, `@IsArray()`, `@IsEnum()`, `@IsInt()`, `@IsPositive()`, `@Min()`, `@Max()`, `@MinLength()`, `@MaxLength()`, `@Matches()`, `@ValidateNested()`

To enable globally in `main.ts`:
```typescript
app.useGlobalPipes(new ValidationPipe());
```

#### Swagger Decorators
`@ApiTags()`, `@ApiOperation()`, `@ApiResponse()`, `@ApiBearerAuth()`, `@ApiProperty()`

---

### The Request Lifecycle

```text
Incoming Request
  │
  ├── 1. Middleware
  ├── 2. Guards
  ├── 3. Interceptors (before handler execution)
  ├── 4. Pipes (validation and transformation)
  ├── 5. Controller (route handler)
  ├── 6. Service (business logic)
  ├── 7. Interceptors (after handler execution)
  └── 8. Exception Filters (only if an exception is thrown)
        │
      Response Out
```

---

### Application Lifecycle Hooks

| Hook | When it runs |
| :--- | :--- |
| `onModuleInit()` | Runs after the host module's dependencies are initialized |
| `onApplicationBootstrap()` | Runs after all modules are fully initialized and the server starts listening |
| `onModuleDestroy()` | Runs before the host module is destroyed |
| `beforeApplicationShutdown()` | Runs before application shutdown (receives a signal) |
| `onApplicationShutdown()` | Runs during application shutdown |

---

### CLI Commands

#### Project Setup & Serve
```bash
nest new <name>                        # Scaffold a new project
nest new <name> --package-manager npm  # Scaffold with npm
nest build                             # Build the application
nest start                             # Start the application
nest start --watch                     # Start in development watch mode
nest start --debug --watch             # Start in debug watch mode
nest info                              # Show environment information
```

#### Generators
```bash
nest g module <name>                   # Generate a Module
nest g controller <name>               # Generate a Controller
nest g service <name>                  # Generate a Service
nest g resource <name>                 # Generate a CRUD resource (module, controller, service, entities)
nest g guard <name>                    # Generate a Guard
nest g interceptor <name>              # Generate an Interceptor
nest g pipe <name>                     # Generate a Pipe
nest g filter <name>                   # Generate an Exception Filter
nest g middleware <name>               # Generate Middleware
```

#### Useful Flags
* `--dry-run` — Runs command without making changes.
* `--flat` — Generates files without creating a subfolder.
* `--no-spec` — Generates files without spec (test) files.

---

# Chapter 8: Hackathon Backend Integration

The application has been upgraded with a complete Hackathon Management API, role-based access control, global request validation/response transformation, and advanced security protections.

## 1. Database Schema

The database is built on PostgreSQL via Prisma. The following models and enums are implemented:

* **UserRole Enum**: `PARTICIPANT`, `ADMIN`
* **User**: Extended to support roles (defaults to `PARTICIPANT`) and relations:
  * `hackathons`: One-to-many relationship mapping hackathons created by the user (as an `ADMIN`).
  * `hackathonParticipants`: Many-to-many junction relationship mapping hackathons the user has joined.
* **Hackathon**: Stores hackathon metadata:
  * `startsAt`, `endsAt`: Date parameters defining registration windows.
  * `isActive`: Boolean flag indicating if registrations are active.
  * `authorId`: Link to the admin user who created it.
* **HackathonParticipant**: Connects users to hackathons with a unique constraint on `(hackathonId, userId)`.

---

## 2. Better Auth Configuration

Better Auth is configured to inject custom user properties. The `role` property has been added to user additional fields:
```typescript
user: {
  additionalFields: {
    role: {
      type: 'string',
      defaultValue: 'PARTICIPANT',
      input: false,
    },
  },
}
```
* Note: `input: false` prevents clients from sending their own role during registration. All signups default to `PARTICIPANT`.

---

## 3. Global Response Format

A global `TransformInterceptor` interceptor formatting all HTTP 2xx responses into a unified structure is active:
```json
{
  "statusCode": 200,
  "message": "Custom response message or Success",
  "data": { ... }
}
```
Use the `@ResponseMessage('custom message')` decorator to override the response message value on specific controllers or endpoints.

---

## 4. Arcjet Security Guard

An `ArcjetGuard` is registered globally. It dynamically analyzes every API request under the following policies:
* **Bot Protection**: Allows verified search engines and previews (Slack, Discord) while rejecting script-based/anonymous clients.
* **WAF Shield**: Flags SQL Injection, XSS, and directory traversal attempts.
* **Rate Limiting**: Sliding window restriction (max 5 requests per 2 seconds, refilling continuously).

---

## 5. API Reference

### User Module (`/user`)

Requires authentication.

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/user` | `ADMIN` | Fetch list of all registered users (ordered by newest). |
| `GET` | `/user/:id` | `Any` | Retrieve profile of a user by ID. |
| `GET` | `/user/profile` | `Any` | Retrieve profile of the logged-in session user. |
| `GET` | `/user/protected-by-guard` | `Any` | Validate request against Arcjet guard policies. |
| `GET` | `/user/protected-by-code` | `Any` | Validate request programmatically against Arcjet client. |

### Hackathon Module (`/hackathon`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/hackathon/create` | `ADMIN` | Create a new hackathon. Dates must be in the future. |
| `GET` | `/hackathon` | `Anonymous` | List all hackathons. |
| `GET` | `/hackathon/:id` | `Anonymous` | Fetch a single hackathon. |
| `GET` | `/hackathon/:id/participants` | `Anonymous` | List participants joined in a hackathon. |
| `PATCH`| `/hackathon/update/:id` | `ADMIN` | Update hackathon fields. |
| `DELETE`| `/hackathon/remove/:id` | `ADMIN` | Remove a hackathon. |
| `POST` | `/hackathon/:id/join` | `PARTICIPANT` | Join an active hackathon before its end date. |

---

## 6. How to Build & Run

### Environment Setup
Make sure the following variables are present in your `.env`:
```bash
DATABASE_URL=postgres://...
ARCJET_KEY=ajkey_...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3000
PORT=5001
```

### Database Initialization
Run the migrations and generate the client:
```bash
npx prisma generate
npx prisma migrate dev
```

### Compile & Run Dev Server
```bash
npm run dev
```

