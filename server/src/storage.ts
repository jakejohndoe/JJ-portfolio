interface IUser {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export const storage = {
  users: new Map<string, IUser>(),
  
  async getUser(id: string): Promise<IUser | undefined> {
    return this.users.get(id);
  },

  async getUserByUsername(username: string): Promise<IUser | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  },

  async createUser(user: Omit<IUser, 'id'>): Promise<IUser> {
    const newUser = { ...user, id: Math.random().toString(36).substring(2, 9) };
    this.users.set(newUser.id, newUser);
    return newUser;
  }
};