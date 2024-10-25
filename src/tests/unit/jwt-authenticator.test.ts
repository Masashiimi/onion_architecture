import { JWTAuthenticator } from "../../infrastructure/authenticators/JWTAuthenticator"
import { InMemoryUserRepository } from "../in-memory/in-memory-user-repository"
import { testUsers } from "./seeds/seeds-user"

describe('JWT Authenticator', () => {
    let userRepository: InMemoryUserRepository
    let authenticator: JWTAuthenticator
    let privateString: string = "eW91cl9zdXBlcl9zZWNyZXRfa2V5X2hlcmU"

    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        await userRepository.create(testUsers.johnDoe)
        authenticator = new JWTAuthenticator(userRepository)
    })

    describe('Scenario: Token is valid', () => {
    it('should return a valid user', async () => {

    });
});

    describe('Scenario: Token is not valid', () => {
        it('should throw an error', async () => {

        })
    })

    describe('Scenario: Token expired', () => {
        it('should throw an error', async () => {
        
    })
    })})
