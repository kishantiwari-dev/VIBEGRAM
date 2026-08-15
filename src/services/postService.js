import { request } from './api';

export const getPosts = (token) =>
  request('/posts', {
    token,
  });

export const createPost = (token, { caption, imageFile }) => {
  const formData = new FormData();

  formData.append('caption', caption);

  if (imageFile) {
    formData.append('image', imageFile);
  }

  return request('/posts', {
    method: 'POST',
    token,
    body: formData,
  });
};

export const toggleLike = (token, postId) =>
  request(`/posts/${postId}/like`, {
    method: 'POST',
    token,
  });

export const addComment = (token, postId, text) =>
  request(`/posts/${postId}/comments`, {
    method: 'POST',
    token,
    body: JSON.stringify({ text }),
  });