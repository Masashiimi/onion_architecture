import { Model } from "mongoose";
import { IBookingRepository } from "../../../interfaces/booking-repository.interface";
import { MongoBooking } from "./mongo-booking";
import { Booking } from "../../../domain/entities/booking.entity";


class BookingMapper {
    static toCore(document: MongoBooking.BookingDocument): Booking {
        return new Booking({
            conferenceId: document.conferenceId,
            userId: document.userId
        })
    }


    static toPersistence(booking: Booking): MongoBooking.BookingDocument {
        return new MongoBooking.BookingModel({
            _id: Math.random(),
            conferenceId: booking.props.conferenceId,
            userId: booking.props.userId
        })
    }
}


export class MongoBookingRepository implements IBookingRepository {
    constructor(
        private readonly model: Model<MongoBooking.BookingDocument>
    ){}

    async create(booking: Booking): Promise<void> {
        const document = BookingMapper.toPersistence(booking)
        await document.save()
    }

    async findByConferenceId(id: string): Promise<Booking[]> {

    }
}