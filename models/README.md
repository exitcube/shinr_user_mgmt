# Models Folder

This folder contains all TypeORM entities for the application.

## Structure

- `index.ts` - Central import/export file for all entities
- `User.ts` - User entity example
- `README.md` - This documentation file

## Adding New Entities

1. Create a new entity file (e.g., `Product.ts`)
2. Import the entity in `index.ts`
3. Add it to the `entities` array in `index.ts`

### Example:

```typescript
// models/Product.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
}
```

```typescript
// models/index.ts
import { User } from './User';
import { Product } from './Product';

export const entities = [
    User,
    Product,
];

// Optional: Export individual entities
export { User } from './User';
export { Product } from './Product';
```

## Benefits

- **Centralized management**: All entities are imported in one place
- **Clean imports**: Database config only needs to import from models/index
- **Easy maintenance**: Adding/removing entities is straightforward
- **Better organization**: Clear separation of concerns

