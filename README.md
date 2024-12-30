This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# GDREPS - E-commerce Store with Admin Panel

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Current App Architecture

flowchart TD
    %% Database Layer
    subgraph Database
        SQLite[SQLite Database]
        subgraph Tables
            Users[Users Table]
            Products[Products Table]
            Categories[Categories Table]
            Brands[Brands Table]
            Colors[Colors Table]
            Sizes[Sizes Table]
            Orders[Orders Table]
            OrderItems[OrderItems Table]
        end
    end

    %% Client-Side Storage
    subgraph ClientStorage
        LocalStorage[Local Storage]
        subgraph StoredData
            CartData[Cart Data]
            UserPrefs[User Preferences]
        end
    end

    %% Authentication
    subgraph Auth
        KindeAuth[Kinde Auth]
        AuthMiddleware[Auth Middleware]
    end

    %% Pages
    subgraph Pages
        Home[/Home/]
        AdminPanel[/Admin Panel/]
        Products[/Products/]
        Categories[/Categories/]
        Brands[/Brands/]
        Cart[/Cart/]
        Profile[/Profile/]
        Checkout[/Checkout/]
    end

    %% API Routes
    subgraph APIRoutes
        subgraph AdminAPI
            direction TB
            AdminProducts[/api/admin/products/]
            AdminBrands[/api/admin/brands/]
            AdminCategories[/api/admin/categories/]
            AdminColors[/api/admin/colors/]
            AdminSizes[/api/admin/sizes/]
        end
        subgraph PublicAPI
            direction TB
            ProductsAPI[/api/products/]
            BrandsAPI[/api/brands/]
            CategoriesAPI[/api/categories/]
            UserAPI[/api/user/]
            SyncAPI[/api/sync/]
        end
    end

    %% State Management
    subgraph StateManagement
        Zustand[Zustand Store]
        ReactQuery[React Query]
    end

    %% Components
    subgraph Components
        UIComponents[UI Components]
        AdminComponents[Admin Components]
        ProductComponents[Product Components]
        CartComponents[Cart Components]
    end

    %% Relationships
    KindeAuth --> AuthMiddleware
    AuthMiddleware --> AdminPanel
    AuthMiddleware --> Profile
    AuthMiddleware --> Cart

    Pages --> APIRoutes
    APIRoutes --> SQLite
    
    CartComponents --> LocalStorage
    CartData --> Zustand
    
    Products --> ProductsAPI
    Categories --> CategoriesAPI
    Brands --> BrandsAPI
    
    AdminPanel --> AdminAPI
    AdminAPI --> SQLite

    Products --> ReactQuery
    Categories --> ReactQuery
    Brands --> ReactQuery

    KindeAuth --> SyncAPI
    SyncAPI --> Users

classDef page fill:#f9f,stroke:#333,stroke-width:2px
classDef db fill:#66f,stroke:#333,stroke-width:2px
classDef api fill:#6f6,stroke:#333,stroke-width:2px
classDef auth fill:#ff6,stroke:#333,stroke-width:2px
classDef storage fill:#f66,stroke:#333,stroke-width:2px

class Home,AdminPanel,Products,Categories,Brands,Cart,Profile,Checkout page
class SQLite db
class AdminProducts,AdminBrands,AdminCategories,AdminColors,AdminSizes,ProductsAPI,BrandsAPI,CategoriesAPI,UserAPI,SyncAPI api
class KindeAuth,AuthMiddleware auth
class LocalStorage,CartData,UserPrefs storage

## Checkout

sequenceDiagram
    participant User
    participant Cart
    participant Checkout
    participant StripeAPI
    participant ServerAPI
    participant Database

    User->>Cart: Add Products
    Cart->>Cart: Calculate Total
    User->>Checkout: Click "Proceed to Checkout"
    Checkout->>ServerAPI: Create Payment Intent
    ServerAPI->>StripeAPI: Initialize Payment
    StripeAPI-->>Checkout: Return Client Secret
    Checkout->>StripeAPI: Submit Payment
    
    alt Payment Successful
        StripeAPI-->>ServerAPI: Payment Success Webhook
        ServerAPI->>Database: Create Order
        ServerAPI-->>User: Redirect to Profile
        User->>ServerAPI: Fetch Order History
        ServerAPI-->>User: Display Orders in Table
    else Payment Failed
        StripeAPI-->>Checkout: Error Response
        Checkout-->>User: Show Error Message
    end

### gdreps-store
