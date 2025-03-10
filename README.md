# AI-Powered Google Ads Campaign Manager - Backend

A powerful NestJS backend service that enables creation, management, and optimization of Google Ads campaigns with AI-powered features.

## 🚀 Features

- **Authentication**: Secure OAuth 2.0 authentication system
- **Project Management**: Create and manage advertising projects
- **AI-Powered Ad Copy Generation**: Generate compelling ad copies using AI
- **Campaign Management**: Create, run, and monitor Google Ads campaigns
- **Analytics**: Real-time performance tracking of campaign metrics
- **Fraud Detection**: AI-based detection of fraudulent clicks
- **API Documentation**: Interactive Swagger API documentation

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Powerful, open-source relational database
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript
- **Authentication**: OAuth 2.0 for secure API access
- **Documentation**: [Swagger/OpenAPI](https://swagger.io/) for API documentation
- **Integration**: Google Ads API
- **AI**: Integration with OpenAI GPT API or Llama 3

## 📋 Prerequisites

- Node.js (v16+)
- PostgreSQL (v13+)
- Google Ads API credentials
- OpenAI API key (or alternative AI service)

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/google-ads-campaign-manager-backend.git
   cd google-ads-campaign-manager-backend  

Install dependencies:
bashCopynpm install

Set up environment variables:
bashCopycp .env.example .env
Then fill in your environment variables in the .env file.
Run Prisma migrations:
bashCopynpx prisma migrate dev

Start the development server:
bashCopynpm run start:dev


🗄️ Database Schema
The application uses the following main data models:

Users: Authentication and user management
Projects: Container for campaigns and ads
Campaigns: Google Ads campaign configurations
Ads: Ad copies and their performance metrics

🔐 Authentication
The backend uses OAuth 2.0 for authentication:

Register and get client credentials via /auth/register
Authenticate and receive JWT tokens via /auth/login
Use received JWT token for all authenticated requests

📡 API Endpoints
Authentication

POST /auth/register - Register a new user
POST /auth/login - Authenticate and receive JWT token

Project Management

POST /projects/create - Create a new project
GET /projects - List all projects
GET /projects/:id - Get project details
PUT /projects/:id - Update project
DELETE /projects/:id - Delete project

Ad Copy Generation

POST /ads/generate-copy - Generate AI-powered ad copies

Campaign Management

POST /campaigns/create - Create a new campaign
GET /campaigns - List all campaigns
GET /campaigns/:id - Get campaign details
PUT /campaigns/:id - Update campaign
POST /campaigns/run/:id - Launch campaign on Google Ads
POST /campaigns/pause/:id - Pause campaign
GET /campaigns/analytics/:id - Get campaign performance data
POST /campaigns/optimize/:id - Get AI optimization suggestions

Fraud Detection

POST /analytics/detect-fraud/:id - Analyze and detect fraudulent clicks

🔌 Google Ads Integration
This backend integrates with the Google Ads API to:

Create and manage advertising campaigns
Fetch performance metrics (impressions, clicks, conversions)
Update campaign settings
Retrieve targeting options

Google Ads Authentication
The application uses OAuth 2.0 to connect with Google Ads:

Configure your Google Ads Developer Token in .env
Set up OAuth client ID and secret
Implement the authentication flow for users to link their Google Ads accounts

🤖 AI Integration
The backend connects to AI services for:

Ad Copy Generation: Create compelling ad variations
Campaign Optimization: Suggest improvements based on performance data
Fraud Detection: Identify suspicious click patterns

📝 Swagger Documentation
API documentation is available via Swagger UI at:
Copyhttp://localhost:3000/api/docs
🧪 Testing
Run unit tests:
bashCopynpm run test
Run end-to-end tests:
bashCopynpm run test:e2e
📜 Environment Variables
Required environment variables:
Copy# Database
DATABASE_URL="postgresql://username:password@localhost:5432/campaign_manager?schema=public"

# Authentication
JWT_SECRET="your-jwt-secret"
JWT_EXPIRATION="24h"

# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"
GOOGLE_OAUTH_CLIENT_ID="your-client-id"
GOOGLE_OAUTH_CLIENT_SECRET="your-client-secret"
GOOGLE_OAUTH_REDIRECT_URI="http://localhost:3000/auth/google/callback"

# AI Service
OPENAI_API_KEY="your-openai-api-key"
# or
LLAMA_API_ENDPOINT="your-llama-api-endpoint"
🚀 Deployment
The backend can be deployed to:

Railway
AWS (EC2, Lambda, or ECS)
Heroku
Any other Node.js compatible hosting

For production deployment, make sure to:

Set up a production PostgreSQL database
Configure proper environment variables
Set up monitoring and logging

🔄 CI/CD
This project can be set up with CI/CD pipelines using:

GitHub Actions
GitLab CI
Jenkins

Example GitHub Actions workflow is available in .github/workflows/main.yml
🔜 Roadmap

Additional ad platforms (Facebook, LinkedIn)
A/B testing automation
Advanced analytics dashboard data endpoints
AI-powered bidding strategy recommendations

🤝 Contributing

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.