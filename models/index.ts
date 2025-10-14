import { User } from './User';
import { UserDevice } from './UserDevice';
// import { Product } from './Product';

// Export all entities as an array for TypeORM configuration
export const entities = [
    User,
    UserDevice,

];

// Entities owned by this microservice (managed by migrations here)
export const ownedEntities = [
    User,
    UserDevice,
];

// Export individual entities and types
export { User, type User as UserType } from './User';
export { UserDevice, type UserDevice as UserDeviceType } from './UserDevice';

