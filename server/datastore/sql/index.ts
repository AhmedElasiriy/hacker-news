import path from 'path';
import { Database, open as sqliteOpen } from 'sqlite';
import sqlite3 from 'sqlite3';

import { Datastore } from '..';
import { Comment, Like, Post, User } from '../../types';

export class SqlDatastore implements Datastore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  public async openDb() {
    // open the database
    this.db = await sqliteOpen({
      filename: path.join(__dirname, 'hackerNews.sqlite'),
      driver: sqlite3.Database,
    });

    this.db.run('PRAGMA foreign_keys = ON;');

    await this.db.migrate({
      migrationsPath: path.join(__dirname, 'migrations'),
    });

    return this;
  }

  async createUser(user: User): Promise<void> {
    await this.db.run(
      'INSERT INTO users (id, email, password, firstName, lastName, username, createdAT) VALUES (?,?,?,?,?,?,?)',
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.username,
      user.createdAt
    );
  }

  getUserById(id: string): Promise<User | undefined> {
    return this.db.get<User>('SELECT * FROM users WHERE id = ?', id);
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return this.db.get<User>(`SELECT * FROM users WHERE email = ?`, email);
  }
  getUserByUsername(username: string): Promise<User | undefined> {
    // console.log(username);
    let xz = this.db.get<User>(`SELECT * FROM users WHERE username = ?`, username);
    return xz;
  }

  listPosts(): Promise<Post[]> {
    return this.db.all<Post[]>('SELECT * FROM posts');
  }

  async createPost(post: Post): Promise<void> {
    await this.db.run(
      'INSERT INTO posts (id, title, url, postedAt, userId) VALUES (?,?,?,?,?)',
      post.id,
      post.title,
      post.url,
      post.postedAt,
      post.userId
    );
  }

  getPost(id: string): Promise<Post | undefined> {
    return this.db.get<Post>(`SELECT * FROM posts WHERE id = ?`, id);
  }

  async deletePost(id: string): Promise<void> {
    this.db.run(`DELETE FROM posts WHERE id = ?`, id);
  }
  async createLike(like: Like): Promise<void> {
    this.db.run('INSERT INTO likes (postId, userId) VALUES (?,?)', like.postId, like.userId);
  }

  async deleteLike(like: Like): Promise<void> {
    this.db.run('DELETE FROM likes WHERE postId = ? AND userId = ?', like.postId, like.userId);
  }

  async createComment(comment: Comment): Promise<void> {
    this.db.run(
      'INSERT INTO comments (id, userId, postId, content, createdAt, parent_comment_id) VALUES (?,?,?,?,?,?)',
      comment.id,
      comment.userId,
      comment.postId,
      comment.comment,
      comment.createdAt,
      comment.parentId
    );
  }
  listComments(postId: string): Promise<Comment[]> {
    return this.db.all<Comment[]>('SELECT * FROM comments WHERE postId = ?', postId);
  }
  async deleteComment(id: string): Promise<void> {
    this.db.run('DELETE FROM comments WHERE id = ?', id);
  }

  getComment(id: string): Promise<Comment | undefined> {
    return this.db.get<Comment>('SELECT * FROM comments WHERE id = ?', id);
  }
}
