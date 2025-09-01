import { User } from './User';
import { UserOtp } from './UserOtp';
// import { Product } from './Product';

// Export all entities as an array for TypeORM configuration
export const entities = [
    User,
    UserOtp,
];

// Export individual entities and types
export { User, type User as UserType } from './User';
export { UserOtp, type UserOtp as UserOtpType } from './UserOtp';

