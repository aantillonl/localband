import { createSlice } from '@reduxjs/toolkit';

const searchBoxSlice = createSlice({
  name: 'searchBox',
  initialState: { searchString: '' },
  reducers: {
    changeSearchString: (state, action) => {
      return { searchString: action.payload };
    },
  },
});

export default searchBoxSlice;
