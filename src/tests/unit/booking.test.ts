import { Bookings } from "../../usecases/booking"
import { InMemoryBookingRepository } from "../in-memory/in-memory-booking-repository"
import { InMemoryConferenceRepository } from "../in-memory/in-memory-conference-repository"
import { InMemoryMailer } from "../in-memory/in-memory-mailer"
import { InMemoryUserRepository } from "../in-memory/in-memory-user-repository"
import { testConferences } from "./seeds/seeds-conference"
import { testUsers } from "./seeds/seeds-user"


describe('Scenario: Booking a conference', () => {
    let conferenceRepository: InMemoryConferenceRepository
    let userRepository: InMemoryUserRepository
    let bookingRepository: InMemoryBookingRepository
    let mailer: InMemoryMailer
    
    let usecase: Bookings




    beforeEach(async () => {
        conferenceRepository = new InMemoryConferenceRepository()
        await conferenceRepository.create(testConferences.conference)
        await conferenceRepository.create(testConferences.conference2)

        userRepository = new InMemoryUserRepository()
        await userRepository.create(testUsers.alice)

        bookingRepository = new InMemoryBookingRepository();


        mailer = new InMemoryMailer()


        usecase = new Bookings(conferenceRepository, userRepository,bookingRepository, mailer)
    })




    describe('Happy path', () => {
        const payload = {
            conferenceId: testConferences.conference.props.id,
            userId: testUsers.alice.props.id
        }   

        it('should book the conference for the user', async () => {
            await usecase.execute(payload)
            const fetchedBooking = await bookingRepository.findByConferenceId(testConferences.conference.props.id)

            expect(fetchedBooking).toHaveLength(1)
            expect(fetchedBooking[0].props).toEqual({
                conferenceId: testConferences.conference.props.id,
                userId: testUsers.alice.props.id
            })
        })


    })
    describe('Scenario: Conference not existing', () => {
        const payload = {
            conferenceId: "non-existing-id",
            userId: testUsers.alice.props.id
        }
        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow("Conference not found")
        })
    })
    describe('Scenario: Trying to book your own conference', () => {
        const payload = {
            conferenceId: testConferences.conference.props.id,
            userId: testUsers.johnDoe.props.id
        }
        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow("You're trying to book your own conference")
        })
    })
    // describe('Scenario: Trying to book to a full conference', () => {
        
    //     const payload = {
    //         conferenceId: testConferences.conference2.props.id,
    //         userId: testUsers.alice.props.id
    //     }
    //     it('should throw an error', async () => {
    //         await expect(usecase.execute(payload)).rejects.toThrow('No seats available for this conference')
    //     })
    // })
})