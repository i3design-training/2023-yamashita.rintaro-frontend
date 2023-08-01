import { store } from '../../app/store';
import {
  setToken,
  setUserId,
  setUserName,
} from '../../features/users/usersSlice';

describe('userSlice', () => {
  it('should handle setToken', () => {
    const token = 'test_token';
    store.dispatch(setToken(token));
    const state = store.getState();
    expect(state.users.token).toEqual(token);
  });

  it('should handle setUserId', () => {
    const userId = 'test_user_id';
    store.dispatch(setUserId(userId));
    const state = store.getState();
    expect(state.users.userId).toEqual(userId);
  });

  it('should handle setUserName', () => {
    const userName = 'test_user_name';
    store.dispatch(setUserName(userName));
    const state = store.getState();
    expect(state.users.userName).toEqual(userName);
  });
});
