import crypto from 'crypto';

import { ListPostsRequest, ListPostsResponse, createPostRequest, createPostResponse } from '../api';
import { db } from '../datastore';
import { ExpressHandler, Post } from '../types';

export const listPostsHandler: ExpressHandler<ListPostsRequest, ListPostsResponse> = async (
  _req,
  res
) => {
  // TODO: add pagination and filtering
  res.send({ posts: await db.listPosts() });
};

export const createPostHandler: ExpressHandler<createPostRequest, createPostResponse> = async (
  req,
  res
) => {
  // TODO: better error message
  if (!req.body.title || !req.body.url) {
    res.sendStatus(400);
    return;
  }

  // TODO: validate url is new, otherwise add +1 to existing post
  const post: Post = {
    id: crypto.randomUUID(),
    title: req.body.title,
    url: req.body.url,
    userId: res.locals.userId,
    postedAt: Date.now(),
  };
  await db.createPost(post);
  res.sendStatus(200);
};
