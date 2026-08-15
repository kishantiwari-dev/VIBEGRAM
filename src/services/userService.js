import { request } from './api';

export const searchUsers = (token, query) =>
  request(`/users/search?q=${encodeURIComponent(query)}`, { token });

export const getProfile = (token, username) =>
  request(`/users/${encodeURIComponent(username)}`, { token });

export const getProfilePosts = (token, username) =>
  request(`/users/${encodeURIComponent(username)}/posts`, { token });

export const updateProfile = (token, data) => {
  const formData = new FormData();

  formData.append('name', data.name || '');
  formData.append('username', data.username || '');
  formData.append('bio', data.bio || '');

  if (data.profileImage instanceof File) {
    formData.append('profileImage', data.profileImage);
  }

  return request('/users/me', {
    method: 'PUT',
    token,
    body: formData,
  });
};

export const changePassword = (token, data) =>
  request('/auth/change-password', {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });