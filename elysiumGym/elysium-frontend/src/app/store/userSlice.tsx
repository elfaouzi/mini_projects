import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface UserState {
  userInfo: User | null;
  token: string | null;
}

const initialState: UserState = {
  userInfo: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
