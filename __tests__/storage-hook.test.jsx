import {act, renderHook, waitFor} from '@testing-library/react';
import useDeckStorage from '@/hooks/useDeckStorage';
import {loadCloudDecks,saveCloudDecks} from '@/library/database_functions';
jest.mock('@/library/database_functions',()=>({loadCloudDecks:jest.fn(),saveCloudDecks:jest.fn()}));
beforeEach(()=>{localStorage.clear();loadCloudDecks.mockImplementation(async user=>({decks:[{id:1,name:user,cards:[]}],version:'1:0'}));});
test('switching accounts never renders the previous account decks',async()=>{
  const {result,rerender}=renderHook(({user})=>useDeckStorage(user,true),{initialProps:{user:'user_A'}});
  await waitFor(()=>expect(result.current.decks[0]?.name).toBe('user_A'));
  rerender({user:'user_B'});
  expect(result.current.decks).toEqual([]);
  await waitFor(()=>expect(result.current.decks[0]?.name).toBe('user_B'));
});
test('all save requests carry the captured account guard',async()=>{
  saveCloudDecks.mockImplementation(async decks=>({decks,version:'2:0'}));
  const {result}=renderHook(()=>useDeckStorage('user_A',true));
  await waitFor(()=>expect(result.current.status).toBe('Saved to cloud'));
  act(()=>result.current.setDecks([{id:2,name:'Changed',cards:[]}]));
  await waitFor(()=>expect(saveCloudDecks).toHaveBeenCalledWith([{id:2,name:'Changed',cards:[]}],'1:0','user_A'));
});
