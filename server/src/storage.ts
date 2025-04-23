import { type IUser } from "@shared/schema.js"; // Use your Drizzle types

export interface IStorage {
  getUser(id: number): Promise<IUser | undefined>;
  getUserByUsername(username: string): Promise<IUser | undefined>;
  createUser(user: InsertUser): Promise<IUser>;
}

export class MemStorage implements IStorage {
  private users: Map<number, IUser>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<IUser | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<IUser | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    const id = this.currentId++;
    const user: IUser = { 
      ...insertUser, 
      id,
      isAdmin: false // Default value
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();