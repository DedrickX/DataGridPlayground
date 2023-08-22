import { createActionGroup, props } from '@ngrx/store';
import { RecalculationRow } from '../recalculate-api-service/recalculate-api.service';

export const recalculateActions = createActionGroup({
    source: 'Recalculate',
    events: {
        SetRecalculationProgress: props<{ inProgress: boolean }>(),
        RecalculateRows: props<{ rowsToRecalculate: RecalculationRow[] }>(),
        RecalculateRowsResult: props<{ recalculatedRows: RecalculationRow[] }>(),
    }
});
