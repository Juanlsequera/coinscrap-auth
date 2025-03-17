import { UserDocument } from "src/users/entities/users.schema";
import { Types } from 'mongoose';

export class UserProfileDTO {
    id: string;
    identifier: string;
    roles: string[];
    permissions: string[];

    constructor(user: UserDocument) {
        const userId = user._id as unknown as Types.ObjectId;
        this.identifier = user.identifier;
        this.roles = user.roles;
        this.permissions = user.permissions || [];
    }
}