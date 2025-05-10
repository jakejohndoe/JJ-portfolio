const request = require('supertest');
const express = require('express');
const blogRoutes = require('../src/routes/blogRoutes');
const Blog = require('../src/models/Blog');

// Mock the Blog model
jest.mock('../src/models/Blog');

// Create express app for testing
const app = express();
app.use(express.json());
app.use('/api/blogs', blogRoutes);

describe('Blog Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/blogs should return all blogs', async () => {
    const mockBlogs = [
      { _id: '1', title: 'Blog 1', content: 'Content 1' },
      { _id: '2', title: 'Blog 2', content: 'Content 2' }
    ];
    
    Blog.find.mockResolvedValue(mockBlogs);
    
    const res = await request(app).get('/api/blogs');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockBlogs);
    expect(Blog.find).toHaveBeenCalledTimes(1);
  });

  test('POST /api/blogs should create a new blog', async () => {
    const newBlog = { title: 'New Blog', content: 'New Content' };
    const savedBlog = { _id: '3', ...newBlog };
    
    const saveMock = jest.fn().mockResolvedValue(savedBlog);
    Blog.mockImplementation(() => ({
      save: saveMock
    }));
    
    const res = await request(app)
      .post('/api/blogs')
      .send(newBlog);
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(savedBlog);
    expect(Blog).toHaveBeenCalledWith(newBlog);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });
});