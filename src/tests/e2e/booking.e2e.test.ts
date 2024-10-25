import { Application } from "express"
import request from "supertest"
import { TestApp } from "./utils/test-app"
import { e2eConferences } from "./seeds/conference-e2e-seed"
import { e2eUsers } from "./seeds/user-e2e-seed"
import { container } from "../../infrastructure/config/dependency-injection"
import { testConferences } from "../unit/seeds/seeds-conference"
import { testUsers } from "../unit/seeds/seeds-user"



describe('Usecase: book a conference', () => {
    const conferenceRepository = container('conferenceRepository')
    const bookingRepository = container('bookingRepository')
    

    let testApp: TestApp
    let app: Application

    beforeEach(async() => {
        testApp = new TestApp()
        await testApp.setup()
        await testApp.loadFixtures([
            e2eConferences.conference,
            e2eUsers.johnDoe,
            e2eUsers.alice,
        ])
        app = testApp.expressApp
    })

    afterAll(async()=> {
        testApp.tearDown()
    })

    it('Should add a new booking', async () => {
        const response = await request(app)
                                .post(`/conference/booking/${testConferences.conference.props.id}`)
                                .set('Authorization', e2eUsers.alice.createAuthorizationToken())
                                .send({
                                    conferenceId: e2eConferences.conference.entity.props.id,
                                    userId:testUsers.alice.props.id
                                })
        expect(response.status).toEqual(201)

        const fetchedBooking = await bookingRepository.findByConferenceId(testConferences.conference.props.id)

        expect(fetchedBooking).toBeDefined()
        expect(fetchedBooking).toHaveLength(1)

    })  
})