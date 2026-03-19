import { createSlice } from '@reduxjs/toolkit';
import TicketData from 'src/_mockApis/ticket/TicketData';

const initialState = {
  tickets: TicketData,
  currentFilter: 'total_tickets',
  ticketSearch: '',
};

export const TicketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    getTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    SearchTicket: (state, action) => {
      state.ticketSearch = action.payload;
    },
    DeleteTicket: (state, action) => {
      const index = state.tickets.findIndex((ticket) => ticket.Id === action.payload);
      state.tickets.splice(index, 1);
    },
  },
});

export const { getTickets, setVisibilityFilter, SearchTicket, DeleteTicket } = TicketSlice.actions;

export const fetchTickets = () => async (dispatch) => {
  try {
    dispatch(getTickets(TicketData));
  } catch (err) {
    throw new Error(err);
  }
};

export default TicketSlice.reducer;
