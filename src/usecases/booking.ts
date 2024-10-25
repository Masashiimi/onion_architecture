import { User } from "discord.js";
import { Booking } from "../domain/entities/booking.entity";
import { Conference } from "../domain/entities/conference.entity";
import { IBookingRepository } from "../interfaces/booking-repository.interface";
import { IConferenceRepository } from "../interfaces/conference-repository.interface";
import { IExecutable } from "../interfaces/executable.interface";
import { IMailer } from "../interfaces/mailer.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { Email } from "../domain/value_objects/email";

type BookingRequest = {
    conferenceId: string;
    userId: string;
};

type BookingResponse = void;

export class Bookings implements IExecutable<BookingRequest, BookingResponse> {
    constructor(
        private readonly repository: IConferenceRepository,
        private readonly userRepository: IUserRepository,
        private readonly bookingRepository: IBookingRepository,
        private readonly mailer: IMailer
    ) {}

    async execute(payload: BookingRequest): Promise<void> {
        const conference = await this.repository.findById(payload.conferenceId);
        if (!conference) throw new Error("Conference not found");

        if (conference.props.organizerId === payload.userId) {
            throw new Error("You're trying to book your own conference");
        }

        const bookings = await this.bookingRepository.findByConferenceId(payload.conferenceId);
        if (conference.props.seats < bookings.length) {
            throw new Error("No seats available for this conference");
        }

        const booking = new Booking({
            conferenceId: payload.conferenceId,
            userId: payload.userId,
        });
        await this.bookingRepository.create(booking);

    }

}
