import { User } from './User';
// import { Product } from './Product';

// Export all entities as an array for TypeORM configuration
export const entities = [
    User,

];

// Export individual entities and types
export { User, type User as UserType } from './User';

