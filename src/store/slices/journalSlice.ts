// Journal State Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { JournalEntry, DailyCheckIn } from '../../types';

interface JournalState {
    entries: JournalEntry[];
    checkIns: DailyCheckIn[];
    currentPromptId: string | null;
}

const initialState: JournalState = {
    entries: [],
    checkIns: [],
    currentPromptId: null,
};

const journalSlice = createSlice({
    name: 'journal',
    initialState,
    reducers: {
        addEntry: (state, action: PayloadAction<JournalEntry>) => {
            state.entries.unshift(action.payload);
        },
        updateEntry: (state, action: PayloadAction<{ id: string; updates: Partial<JournalEntry> }>) => {
            const index = state.entries.findIndex(e => e.id === action.payload.id);
            if (index !== -1) {
                state.entries[index] = {
                    ...state.entries[index],
                    ...action.payload.updates,
                    updatedAt: new Date().toISOString(),
                };
            }
        },
        deleteEntry: (state, action: PayloadAction<string>) => {
            state.entries = state.entries.filter(e => e.id !== action.payload);
        },
        addCheckIn: (state, action: PayloadAction<DailyCheckIn>) => {
            // Remove existing check-in for the same date if exists
            state.checkIns = state.checkIns.filter(c => c.date !== action.payload.date);
            state.checkIns.unshift(action.payload);
        },
        setCurrentPromptId: (state, action: PayloadAction<string | null>) => {
            state.currentPromptId = action.payload;
        },
        clearJournal: (state) => {
            state.entries = [];
            state.checkIns = [];
            state.currentPromptId = null;
        },
    },
});

export const {
    addEntry,
    updateEntry,
    deleteEntry,
    addCheckIn,
    setCurrentPromptId,
    clearJournal,
} = journalSlice.actions;

export default journalSlice.reducer;
