import { NextFunction, Request, Response } from "express";
import { container } from "../../infrastructure/config/dependency-injection";
import { BookingInputs, ChangeDatesInputs, ChangeSeatsInputs, CreateConferenceInputs } from "../dto/conference.dto";
import { RequestValidator } from "../utils/validate-request";

export const organizeConference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {input, errors} = await RequestValidator(CreateConferenceInputs, req.body)

        if(errors) return res.jsonError(errors, 400)

        const result = await container('organizeConferenceUsecase').execute({
            user: req.user,
            title: input.title,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            seats: input.seats
        })

        return res.jsonSuccess({id: result.id}, 201)
    } catch (error) {
        next(error)
    }
}

export const changeSeats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { conferenceId } = req.params

        const {input, errors} = await RequestValidator(ChangeSeatsInputs, req.body)

        if(errors) return res.jsonError(errors, 400)
        
        await container('changeSeatsUsecase').execute({
            seats: input.seats,
            conferenceId,
            user: req.user
        })

        return res.jsonSuccess({message: `Conference with id: ${conferenceId} was updated`}, 200)
    } catch (error) {
        next(error)
    }
}

export const changeDates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {conferenceId} = req.params
        const {input, errors} = await RequestValidator(ChangeDatesInputs, req.body)

        if(errors) return res.jsonError(errors, 400)

        await container('changeDatesUsecase').execute({
            user: req.user,
            conferenceId,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate)
        })

        return res.jsonSuccess({message: `The conference with id ${conferenceId} was updated`}, 200)

    } catch (error) {
        next(error);
    }
};

export const addBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { conferenceId } = req.params;

        const { input, errors } = await RequestValidator(BookingInputs, req.body);

        if(errors) return res.status(400).json({ errors });
        

        await container('bookingUsecase').execute({
            conferenceId,
            userId: input.userId
        });

        return res.status(201).json({ message: `You got booked on the conference: ${conferenceId}` });
    } catch (error) {
        console.error("Caught an error in addBooking:", error);
        next(error);
    }
};