import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidation } from "../../../shared/validation/custom-validation";

export class EventRegistration {
    eventForm: FormGroup = new FormGroup({
        eventId: new FormControl('', [Validators.required, CustomValidation.eventIdValidator()]),
        eventCode: new FormControl('', [
            Validators.required, 
            Validators.minLength(6), 
            Validators.maxLength(6),
            CustomValidation.eventCodeValidator()
        ]),
        eventName: new FormControl('', [
            Validators.required,
            CustomValidation.eventNameValidator()
        ]),
        description: new FormControl(''),
        startDate: new FormControl('', [
            Validators.required,
            CustomValidation.eventStartDateValidator()
        ]),
        endDate: new FormControl('', [
            Validators.required,
            CustomValidation.eventEndDateValidator('startDate')
        ]),
        fees: new FormControl('', [
            Validators.required,
            CustomValidation.feesValidator()
        ]),
        seatsFilled: new FormControl('', [
            Validators.required,
            CustomValidation.seatsValidator()
        ]),
    });
}
