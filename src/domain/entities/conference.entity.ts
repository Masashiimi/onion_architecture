import { differenceInDays, differenceInHours } from "date-fns"
import { User } from "./user.entity"
import { Booking } from "./booking.entity"

type ConferenceProps = {
    id: string
    organizerId: string
    title: string
    startDate: Date
    endDate: Date
    seats: number
}

export class Conference {
    constructor(
        public props: ConferenceProps,
    ) {}

    isTooClose(now: Date) {
        return differenceInDays(this.props.startDate, now) < 3
    }

    hasNotEnoughSeats() {
        return this.props.seats < 10
    }

    hasTooManySeats() {
        return this.props.seats > 1000
    }

    isTooLong() {
        return differenceInHours(this.props.endDate, this.props.startDate) > 3
    }

    isTheOrganizer(user: User) {
        return this.props.organizerId === user.props.id
    }

    amountSeatsLowerBooking(bookings: Booking[]) {
        return this.props.seats < bookings.length
    }

    update(data: Partial<ConferenceProps>) {
        this.props = {...this.props, ...data}
    }
}