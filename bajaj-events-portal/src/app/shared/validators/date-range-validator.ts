import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * A FormGroup-level validator that ensures the end date
 * is greater than or equal to the start date.
 *
 * @param startKey - name of the control for the start date
 * @param endKey - name of the control for the end date
 */
export function dateRangeValidator(startKey: string, endKey: string) {
    return (group: AbstractControl): ValidationErrors | null => {
        const startCtrl = group.get(startKey);
        const endCtrl = group.get(endKey);

        if (!startCtrl || !endCtrl) return null; // controls not found

        const startValue = startCtrl.value;
        const endValue = endCtrl.value;

        // if either value is missing, don't validate yet
        if (!startValue || !endValue) return null;

        const startDate = new Date(startValue);
        const endDate = new Date(endValue);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

        // ✅ Return error if End < Start
        return endDate >= startDate ? null : { dateRangeInvalid: true };
    };
}
