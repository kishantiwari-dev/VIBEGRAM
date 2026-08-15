import { request } from './api';
export const getReels = (token) => request('/reels', { token });
export const createReel = (token, reel) => request('/reels', { method: 'POST', token, body: JSON.stringify(reel) });
