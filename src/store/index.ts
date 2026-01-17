// Redux Store Configuration with Persist

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import userReducer from './slices/userSlice';
import settingsReducer from './slices/settingsSlice';
import urgesReducer from './slices/urgesSlice';
import journalReducer from './slices/journalSlice';
import achievementsReducer from './slices/achievementsSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    whitelist: ['user', 'settings', 'urges', 'journal', 'achievements'],
};

const rootReducer = combineReducers({
    user: userReducer,
    settings: settingsReducer,
    urges: urgesReducer,
    journal: journalReducer,
    achievements: achievementsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
