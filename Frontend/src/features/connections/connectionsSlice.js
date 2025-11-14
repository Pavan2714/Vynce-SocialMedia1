import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  connections: [],
  pendingConnections: [],
  sentRequests: [], // Add this line
  followers: [],
  following: [],
  loading: false, // Add loading state
  error: null, // Add error state
};

export const fetchConnections = createAsyncThunk(
  "connections/fetchConnections",
  async (token) => {
    const { data } = await api.get("/api/user/connections", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.success ? data : null;
  }
);

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    // You can add manual state updates here if needed
    clearConnections: (state) => {
      state.connections = [];
      state.pendingConnections = [];
      state.sentRequests = [];
      state.followers = [];
      state.following = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.connections = action.payload.connections || [];
          state.pendingConnections = action.payload.pendingConnections || [];
          state.sentRequests = action.payload.sentRequests || []; // Add this line
          state.followers = action.payload.followers || [];
          state.following = action.payload.following || [];
        }
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer;
