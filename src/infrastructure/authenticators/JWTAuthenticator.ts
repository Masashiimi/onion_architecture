import { User } from "../../domain/entities/user.entity";
import { IAuthenticator } from "../../interfaces/authenticator.interface";
import { IUserRepository } from "../../interfaces/user-repository.interface";

export class JWTAuthenticator implements IAuthenticator {

    constructor(
        private userRepository: IUserRepository
    ) {
    }
    authenticate(token: string): Promise<User> {
        
        
    }
    
}
