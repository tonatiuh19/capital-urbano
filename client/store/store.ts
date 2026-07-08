import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "@/store/slices/adminSlice";
import adminContactsReducer from "@/store/slices/adminContactsSlice";
import adminDevelopmentsReducer from "@/store/slices/adminDevelopmentsSlice";
import adminAdminsReducer from "@/store/slices/adminAdminsSlice";
import siteConfigReducer from "@/store/slices/siteConfigSlice";

export const store = configureStore({
  reducer: {
    siteConfig: siteConfigReducer,
    admin: adminReducer,
    adminContacts: adminContactsReducer,
    adminDevelopments: adminDevelopmentsReducer,
    adminAdmins: adminAdminsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
