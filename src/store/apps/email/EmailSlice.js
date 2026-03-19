import { createSlice } from '@reduxjs/toolkit';
import EmailData from 'src/_mockApis/email/EmailData';

const initialState = {
  emails: EmailData,
  emailContent: 1,
  emailSearch: '',
  currentFilter: 'inbox',
};

export const EmailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    getEmails: (state, action) => {
      state.emails = action.payload;
    },
    SearchEmail: (state, action) => {
      state.emailSearch = action.payload;
    },
    SelectEmail: (state, action) => {
      state.emailContent = action.payload;
    },
    starEmail: (state, action) => {
      state.emails = state.emails.map((email) =>
        email.id === action.payload ? { ...email, starred: !email.starred } : email,
      );
    },
    importantEmail: (state, action) => {
      state.emails = state.emails.map((email) =>
        email.id === action.payload ? { ...email, important: !email.important } : email,
      );
    },
    checkEmail: (state, action) => {
      state.emails = state.emails.map((email) =>
        email.id === action.payload ? { ...email, checked: !email.checked } : email,
      );
    },
    deleteEmail: (state, action) => {
      state.emails = state.emails.map((email) =>
        email.id === action.payload ? { ...email, trash: !email.trash } : email,
      );
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
  },
});

export const {
  SearchEmail,
  SelectEmail,
  getEmails,
  starEmail,
  importantEmail,
  setVisibilityFilter,
  deleteEmail,
  checkEmail,
} = EmailSlice.actions;

export const fetchEmails = () => async (dispatch) => {
  try {
    dispatch(getEmails(EmailData));
  } catch (err) {
    throw new Error(err);
  }
};

export default EmailSlice.reducer;
