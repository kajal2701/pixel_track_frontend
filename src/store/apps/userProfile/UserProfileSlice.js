import { createSlice } from '@reduxjs/toolkit';
import { map } from 'lodash';
import posts from 'src/_mockApis/userprofile/PostData';
import { users, gallery } from 'src/_mockApis/userprofile/UsersData';

const initialState = {
  posts: posts,
  followers: users,
  gallery: gallery,
};

export const UserProfileSlice = createSlice({
  name: 'UserPost',
  initialState,
  reducers: {
    getPosts: (state, action) => {
      state.posts = action.payload;
    },
    getFollowers: (state, action) => {
      state.followers = action.payload;
    },
    getPhotos: (state, action) => {
      state.gallery = action.payload;
    },
    onToggleFollow(state, action) {
      const followerId = action.payload;

      const handleToggle = map(state.followers, (follower) => {
        if (follower.id === followerId) {
          return {
            ...follower,
            isFollowed: !follower.isFollowed,
          };
        }
        return follower;
      });

      state.followers = handleToggle;
    },
  },
});

export const { getPosts, getFollowers, onToggleFollow, getPhotos } = UserProfileSlice.actions;

export const fetchPosts = () => async (dispatch) => {
  try {
    dispatch(getPosts(posts));
  } catch (err) {
    throw new Error(err);
  }
};
export const likePosts = (postId) => async (dispatch) => {
  try {
    const postIndex = posts.findIndex((x) => x.id === postId);
    const post = { ...posts[postIndex] };
    post.data = { ...post.data };
    post.data.likes = { ...post.data.likes };
    post.data.likes.like = !post.data.likes.like;
    post.data.likes.value = post.data.likes.like
      ? post.data.likes.value + 1
      : post.data.likes.value - 1;
    posts[postIndex] = post;
    dispatch(getPosts([...posts]));
  } catch (err) {
    throw new Error(err);
  }
};
export const addComment = (postId, comment) => async (dispatch) => {
  try {
    const postIndex = posts.findIndex((x) => x.id === postId);
    const post = posts[postIndex];
    const cComments = post.data.comments || [];
    post.data.comments = [...cComments, comment];
    dispatch(getPosts([...posts]));
  } catch (err) {
    throw new Error(err);
  }
};

export const addReply = (postId, commentId, reply) => async (dispatch) => {
  try {
    const postIndex = posts.findIndex((x) => x.id === postId);
    const post = posts[postIndex];
    const cComments = post.data.comments || [];
    const commentIndex = cComments.findIndex((x) => x.id === commentId);
    const comment = cComments[commentIndex];
    if (comment && comment.data && comment.data.replies)
      comment.data.replies = [...comment.data.replies, reply];
    dispatch(getPosts([...posts]));
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchFollwores = () => async (dispatch) => {
  try {
    dispatch(getFollowers(users));
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchPhotos = () => async (dispatch) => {
  try {
    dispatch(getPhotos(gallery));
  } catch (err) {
    throw new Error(err);
  }
};

export default UserProfileSlice.reducer;
