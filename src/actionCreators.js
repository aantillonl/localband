import { createAction } from '@reduxjs/toolkit';

const search = createAction('SEARCH');
const changeSearchValue = createAction('CHANGE_SEARCH_VALUE');

export { search, changeSearchValue };
