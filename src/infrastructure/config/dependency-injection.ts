import { asClass, asFunction, createContainer } from "awilix";
import { IAuthenticator } from "../../interfaces/authenticator.interface";
import { IBookingRepository } from "../../interfaces/booking-repository.interface";
import { IConferenceRepository } from "../../interfaces/conference-repository.interface";
import { IDateGenerator } from "../../interfaces/date-generator.interface";
import { IIDGenerator } from "../../interfaces/id-generator.interface";
import { IUserRepository } from "../../interfaces/user-repository.interface";
import { CurrentDateGenerator } from "../../shared/utils/current-date-generator";
import { RandomIDGenerator } from "../../shared/utils/random-id-generator";
import { InMemoryBookingRepository } from "../../tests/in-memory/in-memory-booking-repository";
import { InMemoryMailer } from "../../tests/in-memory/in-memory-mailer";
import { ChangeDates } from "../../usecases/change-dates";
import { ChangeSeats } from "../../usecases/change-seats";
import { OrganizeConference } from "../../usecases/organize-conference";
import { BasicAuthenticator } from "../authenticators/basic-authenticator";
import { MongoUser } from "../database/mongo/mongo-user";
import { MongoUserRepository } from "../database/mongo/mongo-user-repository";
import { MongoConferenceRepository } from "../database/mongo/mongo-conference-repository";
import { MongoConference } from "../database/mongo/mongo-conference";
import { RabbitMQPublisher } from "../publisher/rabbitmq-publisher";
import { Bookings } from "../../usecases/booking";

export interface Dependencies {
    conferenceRepository: IConferenceRepository
    userRepository: IUserRepository
    idGenerator: IIDGenerator
    dateGenerator: IDateGenerator
    authenticator: IAuthenticator
    organizeConferenceUsecase: OrganizeConference
    changeSeatsUsecase: ChangeSeats
    mailer: InMemoryMailer
    changeDatesUsecase: ChangeDates
    bookingRepository: IBookingRepository
    messageBroker: RabbitMQPublisher
    bookingUsecase: Bookings
}

const container = createContainer<Dependencies>()

container.register({
    idGenerator: asClass(RandomIDGenerator).singleton(),
    dateGenerator: asClass(CurrentDateGenerator).singleton(),
    mailer: asClass(InMemoryMailer).singleton(),
    bookingRepository: asClass(InMemoryBookingRepository).singleton(),
    messageBroker: asFunction(()=> new RabbitMQPublisher('amqp://localhost')).singleton(),
    
    conferenceRepository: asFunction(() => new MongoConferenceRepository(MongoConference.ConferenceModel)).singleton(),
    userRepository: asFunction(() => new MongoUserRepository(MongoUser.UserModel)).singleton(),
    authenticator: asFunction(
        ({userRepository}) => new BasicAuthenticator(userRepository)
    ).singleton(),

    organizeConferenceUsecase: asFunction(
        ({conferenceRepository, idGenerator, dateGenerator, messageBroker}) => new OrganizeConference(conferenceRepository, idGenerator, dateGenerator, messageBroker)
    ).singleton(),
    changeSeatsUsecase: asFunction(
        ({conferenceRepository, bookingRepository}) => new ChangeSeats(conferenceRepository, bookingRepository)
    ).singleton(),
    changeDatesUsecase: asFunction(
        ({conferenceRepository, mailer, bookingRepository, userRepository, dateGenerator}) => new ChangeDates(conferenceRepository, mailer, bookingRepository, userRepository, dateGenerator)
    ).singleton(),
    bookingUsecase: asFunction(({conferenceRepository, userRepository, bookingRepository, mailer })=> new Bookings(conferenceRepository, userRepository, bookingRepository, mailer))
    
})

export type ResolveDependency = <K extends keyof Dependencies>(key: K) => Dependencies[K]

const resolveDependency = <K extends keyof Dependencies>(key: K) : Dependencies[K] => {
    return container.resolve<K>(key)
}

export { resolveDependency as container };
