# JobMatch AI - MERN Stack Job Board

A modern job board application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring AI-powered job matching.

## Key Features

- **AI-Powered Job Matching**: Uses OpenAI's GPT API to analyze user profiles and job requirements for intelligent recommendations
- **Responsive Design**: Mobile-first approach ensuring seamless experience across all devices
- **Profile Management**: Rich user profiles with skills, experience, and job preferences
- **Admin Dashboard**: Comprehensive admin controls including user management and job posting
- **Smart Job Search**: Advanced filtering and search capabilities

## AI Job Matching System

The application uses OpenAI's GPT API to provide intelligent job recommendations:

1. **Profile Analysis**:
   - User profiles are analyzed based on:
     - Skills (technical skills, soft skills)
     - Years of experience
     - Location preferences
     - Job type preferences (remote/onsite/hybrid)

2. **Job Matching Process**:
   - The system sends a carefully crafted prompt to OpenAI containing:
     - User's complete profile information
     - Available job listings with requirements
   - GPT analyzes the data considering:
     - Skills overlap
     - Experience level match
     - Location compatibility
     - Work type preferences
   - Returns top 3 most suitable job matches

3. **Recommendation Delivery**:
   - Matches are processed and ranked
   - Only high-confidence matches are shown
   - Users can see why each job was recommended

## Getting Started

1. Clone the repository
2. Set up environment variables:

```env
# Server (.env)
DB=mongodb://localhost:27017/jobboard
JWTPRIVATEKEY=your_jwt_key
SALT=10
OPENAI_API_KEY=your_openai_api_key
```

3. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

4. Start the application:
```bash
# Start server (from server directory)
npm start

# Start client (from client directory)
npm start
```

## Technical Architecture

### Frontend
- React.js with modular components
- CSS Modules for styled components
- Responsive design using modern CSS features
- Protected routes with JWT authentication

### Backend
- Node.js with Express
- MongoDB for data persistence
- OpenAI GPT API integration
- JWT for authentication

### API Endpoints

#### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/recommendations/me` - Get AI-powered job recommendations
- `POST /api/jobs` (Admin) - Create new job
- `PUT /api/jobs/:id` (Admin) - Update job
- `DELETE /api/jobs/:id` (Admin) - Delete job

#### Users
- `POST /api/users` - Register new user
- `GET /api/users/profile` - Get user profile
- `POST /api/users/profile` - Update user profile
- `GET /api/users` (Admin) - Get all users
- `GET /api/users/:id` (Admin) - Get specific user

#### Authentication
- `POST /api/auth` - User login
- `GET /api/auth/verify` - Verify JWT token

## Admin Features

Administrators have access to:
- Complete user profile management
- Job posting and management
- User activity monitoring
- System analytics

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected admin routes
- Input validation and sanitization
- Environment variable protection

## Responsive Design

The application follows a mobile-first approach with:
- Fluid layouts using CSS Grid and Flexbox
- Responsive typography
- Optimized images
- Touch-friendly interfaces
- Breakpoints for all device sizes

## Future Enhancements

- Enhanced AI matching with more parameters
- Real-time notifications
- Interview scheduling
- Application tracking
- Analytics dashboard