# JobMatch AI - MERN Stack Job Board

A modern job board application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring AI-powered job matching.

## Quick Setup

1. **Clone and Configure**
    ```bash
    # Clone the repository
    git clone https://github.com/yourusername/ai-powered-job-match-platform.git
    cd ai-powered-job-match-platform

    # Create environment files
    cp server/.env.example server/.env
    cp client/.env.example client/.env
    ```

2. **Environment Setup**
    ```env
    # Server (.env)
    DB=mongodb://localhost:27017/jobboard
    JWTPRIVATEKEY=your_jwt_key
    SALT=10
    OPENAI_API_KEY=your_openai_api_key
    ALLOWED_ORIGINS=http://localhost:3000

    # Client (.env)
    REACT_APP_API_URL=http://localhost:8080
    ```

3. **Install Dependencies**
    ```bash
    # Server setup
    cd server
    npm install

    # Client setup
    cd ../client
    npm install
    ```

4. **Initialize Database**
    ```bash
    # Create admin user
    cd server
    node initAdmin.js

    # Seed sample jobs (optional)
    node seedJobs.js
    ```

5. **Start Development Servers**
    ```bash
    # Start server (from server directory)
    npm start

    # Start client (in another terminal, from client directory)
    npm start
    ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Default Admin Credentials
After running initAdmin.js, you can log in with these default admin credentials:
```
Email: admin@jobmatch.com
Password: Admin@123
```
⚠️ For security reasons, please change these credentials after your first login.

## AI Integration and Prompt Design

### OpenAI GPT Integration

The application leverages OpenAI's GPT API for intelligent job matching through carefully designed prompts and context management:

1. **Profile Analysis Prompt Structure**
    ```javascript
    The system analyzes user profiles with this context structure:
    {
      skills: string[],          // Technical and soft skills
      yearsOfExperience: number, // Total years of experience
      location: string,          // Preferred location
      preferredJobType: string   // "remote", "onsite", or "hybrid"
    }
    ```

2. **Job Matching Prompt Design**
    ```javascript
    The system constructs prompts with:
    - User profile data
    - Available job listings
    - Specific matching criteria
    - Required output format
    ```

3. **Response Processing**
    - Confidence scoring (0-100%)
    - Match reasoning generation
    - Top 3 recommendations selection

### AI Configuration Best Practices

1. **Rate Limiting**
   - Maximum 10 requests per minute per user
   - Cached recommendations for 24 hours

2. **Error Handling**
   - Fallback to conventional matching if AI service is unavailable
   - Graceful degradation of features

3. **Prompt Engineering Guidelines**
   - Use consistent formatting
   - Include explicit instructions
   - Maintain context window limits

## API Documentation

### Authentication Endpoints

#### POST /api/auth
Login endpoint that returns a JWT token.
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "data": "jwt_token_here",
  "isAdmin": false,
  "message": "logged in successfully"
}
```

### User Endpoints

#### POST /api/users
Register a new user.
```json
Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User created successfully"
}
```

#### GET /api/users/profile
Get authenticated user's profile (requires auth token).

#### POST /api/users/profile
Update user profile (requires auth token).
```json
Request:
{
  "location": "New York, NY",
  "yearsOfExperience": 5,
  "skills": ["JavaScript", "React", "Node.js"],
  "preferredJobType": "remote"
}
```

### Job Endpoints

#### GET /api/jobs
Get all jobs (requires auth token).

#### GET /api/jobs/recommendations/me
Get AI-powered job recommendations (requires auth token).

#### POST /api/jobs (Admin only)
Create a new job listing.
```json
Request:
{
  "title": "Senior Developer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "type": "remote",
  "skills": ["JavaScript", "React", "Node.js"],
  "description": "We are looking for..."
}
```

#### PUT /api/jobs/:id (Admin only)
Update an existing job.

#### DELETE /api/jobs/:id (Admin only)
Delete a job listing.

## Code Architecture

### Project Structure

```
client/                 # React frontend
├── src/
│   ├── components/    # React components
│   ├── contexts/      # React contexts
│   └── styles/        # CSS modules
│
server/                # Node.js backend
├── middleware/        # Express middlewares
├── models/           # Mongoose models
├── routes/           # API routes
└── services/         # Business logic
```

### Key Technologies

#### Frontend
- React 17+ with Hooks
- React Router v6
- CSS Modules
- JWT Authentication
- Context API for state management

#### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- OpenAI GPT API
- Input validation with Joi

### Security Measures

1. **Authentication**
   - JWT-based auth flow
   - Token expiration
   - Secure password hashing
   - CORS protection

2. **Authorization**
   - Role-based access control
   - Protected admin routes
   - Resource ownership validation

3. **Data Protection**
   - Input sanitization
   - Request rate limiting
   - Environment variable encryption

### Deployment Architecture

```
Client (Netlify) → API (Railway) → MongoDB Atlas
                                → OpenAI API
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.