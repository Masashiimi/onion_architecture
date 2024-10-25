import { User } from "discord.js"
import { ChangeSeats } from "../../usecases/change-seats"
import { InMemoryConferenceRepository } from "../in-memory/in-memory-conference-repository"
import { testConferences } from "./seeds/seeds-conference"
import { testUsers } from "./seeds/seeds-user"
import { InMemoryBookingRepository } from "../in-memory/in-memory-booking-repository"
import { Booking } from "../../domain/entities/booking.entity"

describe('Usecase: Change seats', () => {
    let usecase: ChangeSeats
    let repository: InMemoryConferenceRepository
    let bookingRepository: InMemoryBookingRepository

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository()
        await repository.create(testConferences.conference)
        bookingRepository = new InMemoryBookingRepository()

        usecase = new ChangeSeats(repository, bookingRepository)
    })

    describe('Scenario: Happy path', () => {
        const payload = {
            seats: 100,
            conferenceId: testConferences.conference.props.id,
            user: testUsers.johnDoe
        }

        it('should change the number of seats', async () => {
            await usecase.execute(payload)

            const fetchedConference = await repository.findById(testConferences.conference.props.id)

            expect(fetchedConference).toBeDefined()
            expect(fetchedConference!.props.seats).toEqual(100)
        })
    })
    
    describe('Scenario: Conference does not exist', () => {
        const payload = {
            seats: 100,
            conferenceId: 'non-existing-id',
            user: testUsers.johnDoe
        }

        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow("Conference not found")
        })
    })

    describe('Scenario: Conference has too many seats', () => {
        const payload = {
            seats: 1001,
            conferenceId: testConferences.conference.props.id,
            user: testUsers.johnDoe
        }

        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow("Conference has too many seats")
        })
    })

    describe('Scenario: Conference has not enough seats', () => {
        const payload = {
            seats: 9,
            conferenceId: testConferences.conference.props.id,
            user: testUsers.johnDoe
        }

        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow("Conference has not enough seats")
        })
    })

    describe('Scenario: Change conference seats of someone else', () => {
        const payload = {
            seats: 100,
            conferenceId: testConferences.conference.props.id,
            user: testUsers.bob
        }

        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow("You are not allowed to change this conference")
        })
    })

    describe('Scenario: Change number of seats, under booking amount', () => {
        
        
        const payload = {
            seats: 11,
            conferenceId: testConferences.conference.props.id,
            user: testUsers.johnDoe
        }
        
        it('should throw an error', async() => {
            for(let i:number = 0; i < 12; i++ ){
                const booking =  new Booking({
                    conferenceId: testConferences.conference.props.id,
                    userId: testUsers.alice.props.id
                })
                await bookingRepository.create(booking)
            }
            await expect(usecase.execute(payload)).rejects.toThrow("You can't put a number of seats lower than the booking amount")
        })
    })
})