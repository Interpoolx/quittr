// Urges State Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UrgeLog, TriggerPattern, TimePattern } from '../../types';

interface UrgesState {
    logs: UrgeLog[];
    triggerPatterns: TriggerPattern[];
    timePatterns: TimePattern[];
    totalResisted: number;
    totalSlips: number;
}

const initialState: UrgesState = {
    logs: [],
    triggerPatterns: [],
    timePatterns: [],
    totalResisted: 0,
    totalSlips: 0,
};

const urgesSlice = createSlice({
    name: 'urges',
    initialState,
    reducers: {
        addUrgeLog: (state, action: PayloadAction<UrgeLog>) => {
            state.logs.unshift(action.payload);
            if (action.payload.outcome === 'resisted') {
                state.totalResisted += 1;
            } else {
                state.totalSlips += 1;
            }
        },
        updateUrgeLog: (state, action: PayloadAction<{ id: string; updates: Partial<UrgeLog> }>) => {
            const index = state.logs.findIndex(log => log.id === action.payload.id);
            if (index !== -1) {
                const oldOutcome = state.logs[index].outcome;
                state.logs[index] = { ...state.logs[index], ...action.payload.updates };

                // Update totals if outcome changed
                const newOutcome = state.logs[index].outcome;
                if (oldOutcome !== newOutcome) {
                    if (newOutcome === 'resisted') {
                        state.totalResisted += 1;
                        state.totalSlips -= 1;
                    } else {
                        state.totalResisted -= 1;
                        state.totalSlips += 1;
                    }
                }
            }
        },
        deleteUrgeLog: (state, action: PayloadAction<string>) => {
            const index = state.logs.findIndex(log => log.id === action.payload);
            if (index !== -1) {
                if (state.logs[index].outcome === 'resisted') {
                    state.totalResisted -= 1;
                } else {
                    state.totalSlips -= 1;
                }
                state.logs.splice(index, 1);
            }
        },
        setTriggerPatterns: (state, action: PayloadAction<TriggerPattern[]>) => {
            state.triggerPatterns = action.payload;
        },
        setTimePatterns: (state, action: PayloadAction<TimePattern[]>) => {
            state.timePatterns = action.payload;
        },
        clearAllUrges: (state) => {
            state.logs = [];
            state.triggerPatterns = [];
            state.timePatterns = [];
            state.totalResisted = 0;
            state.totalSlips = 0;
        },
    },
});

export const {
    addUrgeLog,
    updateUrgeLog,
    deleteUrgeLog,
    setTriggerPatterns,
    setTimePatterns,
    clearAllUrges,
} = urgesSlice.actions;

export default urgesSlice.reducer;
