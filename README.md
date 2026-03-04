# GramaRaksha AI 🏥
## Rural Healthcare Intelligence & Smart Triage System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)

**Built for Bharat. Powered by AI.**

GramaRaksha AI is a comprehensive full-stack healthcare platform designed specifically for rural India, combining artificial intelligence with mobile-first design to bridge the healthcare gap in underserved communities.

---

## 🌟 Key Features

### 🩺 Smart Symptom Checker
- **AI-Powered Risk Assessment**: Advanced risk scoring algorithm (0-100)
- **Explainable Breakdown**: Age, gender, symptom, and condition-based risk factors
- **Emergency Detection**: Automatic identification of critical conditions
- **Real-time Recommendations**: Personalized health guidance

### 🤖 Multilingual AI Chatbot
- **3-Language Support**: English, Hindi, Telugu
- **Voice Input/Output**: Speak naturally in your preferred language
- **Context-Aware Responses**: Understands village-specific information
- **Government Schemes**: Instant access to health benefit information
- **Emergency Keyword Detection**: Automatic alert for urgent situations

### 📸 AI Image Analysis
- **Medical Image Processing**: Analyze rashes, wounds, swellings
- **Confidence Scoring**: AI-driven diagnostic suggestions
- **Urgency Classification**: Low, medium, high, emergency
- **Actionable Advice**: Step-by-step care instructions

### 📊 Public Health Dashboard
- **Village-wise Analytics**: Track health trends by location
- **Risk Distribution**: Visual representation of community health
- **ASHA Worker Integration**: Tools for community health workers
- **High-Risk Alerts**: Real-time notifications for critical cases

### 🎨 Modern UI/UX
- **Neumorphic Design**: Soft, natural aesthetic
- **Gradient Accents**: Forest green, terracotta, teal palette
- **Responsive**: Mobile-first, works on all devices
- **Accessibility**: High contrast, keyboard navigation, screen reader support

---

## 🚀 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Logging**: Winston
- **Validation**: Express Validator

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Chart.js, React-Chartjs-2
- **Icons**: React Icons
- **Notifications**: React Hot Toast
- **Voice**: React Speech Recognition

### AI/ML Services
- **Risk Engine**: Custom algorithm with weighted scoring
- **Chatbot**: Rule-based NLP with multilingual support
- **Image Analysis**: Simulated AI (ready for ML model integration)

---

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** 5.x or higher
- **npm** or **yarn**
- **Git**

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/gramaraksha-ai.git
cd gramaraksha-ai
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

**Backend .env Configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gramaraksha
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Make sure MongoDB is running
# Seed the database with sample data
npm run seed
```

### 4. Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### 5. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file
nano .env
```

**Frontend .env Configuration:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=GramaRaksha AI
```

### 6. Start Frontend Development Server

```bash
npm start
```

Frontend will run on `http://localhost:3000`

---

## 🔐 Default Login Credentials

After running the seed script, use these credentials:

### Admin Login
- **Email**: admin@gramaraksha.gov.in
- **Password**: Admin@123

### Sample User Phones (for phone-based login)
- **Ramesh Kumar**: 9999999901
- **Sita Devi**: 9999999902 (ASHA Worker)
- **Venkatesh Rao**: 9999999903

---

## 📁 Project Structure

```
gramaraksha-ai/
├── backend/
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Screening.js
│   │   ├── ChatLog.js
│   │   ├── UploadedImage.js
│   │   ├── Village.js
│   │   └── Admin.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── screening.routes.js
│   │   ├── chatbot.routes.js
│   │   ├── upload.routes.js
│   │   ├── village.routes.js
│   │   └── admin.routes.js
│   ├── services/            # Business logic
│   │   └── ai/
│   │       ├── riskEngine.js
│   │       └── chatbotService.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── utils/               # Utilities
│   │   ├── logger.js
│   │   └── seedData.js
│   ├── uploads/             # File uploads directory
│   ├── logs/                # Application logs
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # React components
│   │   │   └── Layout/
│   │   │       ├── Navbar.js
│   │   │       └── Footer.js
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js
│   │   │   ├── SymptomChecker.js
│   │   │   ├── Chatbot.js
│   │   │   ├── Dashboard.js
│   │   │   ├── HealthSchemes.js
│   │   │   ├── ImageUpload.js
│   │   │   ├── Emergency.js
│   │   │   └── AdminPanel.js
│   │   ├── context/         # React Context
│   │   │   └── AppContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
├── README.md
└── deployment-guide.md
```

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login (phone-based)
- `POST /api/auth/admin/login` - Admin login

### Health Screening
- `POST /api/screenings` - Create new screening
- `GET /api/screenings/user/:userId` - Get user's screening history
- `GET /api/screenings/:id` - Get specific screening

### Chatbot
- `POST /api/chatbot/message` - Send chat message
- `GET /api/chatbot/history/:sessionId` - Get chat history
- `GET /api/chatbot/user/:userId` - Get user's chat sessions

### Image Upload
- `POST /api/upload` - Upload and analyze image
- `GET /api/upload/user/:userId` - Get user's uploaded images
- `GET /api/upload/:id` - Get specific image analysis

### Villages
- `GET /api/villages` - Get all villages
- `GET /api/villages/:id` - Get specific village
- `POST /api/villages` - Create new village
- `PUT /api/villages/:id` - Update village

### Admin (Protected)
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/reports/public-health` - Generate health report
- `GET /api/admin/export/:type` - Export data (CSV/JSON)

---

## 🎨 Color Palette

- **Forest Green**: `#2C4A3E` - Primary brand color
- **Electric Teal**: `#1D7A7A` - Interactive elements
- **Muted Terracotta**: `#C17B5C` - Warm accents
- **Sand Beige**: `#F5E6D3` - Background tones
- **Soft Charcoal**: `#4A4A4A` - Text color

---

## 🌐 Supported Languages

1. **English** (en)
2. **Hindi** (hi) - हिंदी
3. **Telugu** (te) - తెలుగు

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- CORS protection
- Input validation and sanitization
- File type and size restrictions
- SQL injection prevention (NoSQL)
- XSS protection

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 🚢 Deployment

See [deployment-guide.md](deployment-guide.md) for detailed deployment instructions for:
- Heroku
- AWS EC2
- DigitalOcean
- Vercel (Frontend)
- MongoDB Atlas

---

## 📈 Future Enhancements

- [ ] Real ML model integration for image analysis
- [ ] WhatsApp integration for rural reach
- [ ] SMS-based symptom checker
- [ ] Offline mode with service workers
- [ ] Advanced analytics dashboard
- [ ] Telemedicine video consultations
- [ ] Integration with National Health Stack
- [ ] Prescription management
- [ ] Appointment scheduling
- [ ] Medicine reminder system

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Developed with ❤️ for rural India

---

## 📞 Support

For support, email support@gramaraksha.gov.in or join our Slack channel.

---

## ⚠️ Disclaimer

GramaRaksha AI is an assistive healthcare tool and should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.

---

## 🙏 Acknowledgments

- National Health Mission
- Ayushman Bharat Program
- ASHA Workers across India
- Open source community

---

**Built for Bharat 🇮🇳 | Powered by AI 🤖**
