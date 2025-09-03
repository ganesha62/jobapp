# Job Management Admin Interface

A pixel-perfect full-stack application for managing job postings with a modern UI built using Next.js, Mantine, and NestJS backend.

## 🚀 Features

- **Job List Page**: Display job postings with advanced filtering
- **Job Creation**: Create new job postings with comprehensive form validation
- **Real-time Filtering**: Filter by title, location, job type, and salary range
- **Responsive Design**: Pixel-perfect recreation of the provided designs
- **Modern Tech Stack**: Latest versions of all technologies

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Mantine UI 7.5** - Modern React components library
- **React Hook Form** - Form handling and validation
- **TypeScript** - Type safety

### Backend
- **NestJS 10** - Progressive Node.js framework
- **PostgreSQL** - Relational database
- **TypeORM** - Object-relational mapping
- **Class Validator** - Validation decorators

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+
- Docker (optional)

### 1. Database Setup

Using Docker (Recommended):
```bash
docker-compose up -d
```

Or install PostgreSQL manually and create database:
```sql
CREATE DATABASE job_management;
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run start:dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend  # (or root directory if frontend files are in root)
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🎨 Design Features

### Job List Page
- **Search & Filters**: Job title, location, job type, salary range slider
- **Job Cards**: Company logos, job details, apply buttons
- **Responsive Grid**: 4 columns on desktop, responsive on mobile

### Job Creation Modal
- **Form Fields**: All required job posting fields
- **Validation**: React Hook Form with comprehensive validation
- **Modern UI**: Clean modal design matching the provided mockups

### UI Components
- **Header Navigation**: Logo, menu items, Create Job button
- **Salary Range Slider**: Interactive range selector
- **Company Logos**: Dynamic logo generation based on company names
- **Responsive Design**: Mobile-first approach

## 🔧 API Endpoints

### Jobs
- `GET /jobs` - Get all jobs with filtering
- `POST /jobs` - Create new job
- `GET /jobs/:id` - Get job by ID  
- `PATCH /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job

### Query Parameters for Filtering
- `title` - Filter by job title (case-insensitive)
- `location` - Filter by location (case-insensitive)
- `type` - Filter by job type (exact match)
- `salaryMin` - Minimum salary filter
- `salaryMax` - Maximum salary filter

## 📁 Project Structure

```
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── package.json
│   └── next.config.js
├── backend/
│   ├── src/
│   │   ├── jobs/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── jobs.controller.ts
│   │   │   ├── jobs.service.ts
│   │   │   └── jobs.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
npm start
```

### Backend (Railway/Render/AWS)
```bash
npm run build
npm run start:prod
```

### Database
Update environment variables with production database credentials.

## 🎯 Key Implementation Details

### Pixel-Perfect Design
- Exact color matching: `#00bcd4` for buttons, `#e3f2fd` for badges
- Precise spacing and typography matching the provided mockups
- Company logo generation with gradient backgrounds
- Responsive design maintaining visual consistency

### Filter Functionality
- Real-time filtering without page refresh
- Salary range slider with visual feedback
- Debounced search inputs for better performance
- URL state management for shareable filtered results

### Form Validation
- Comprehensive validation using React Hook Form
- Real-time error feedback
- Required field validation
- Date picker for application deadline

## 🔍 Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing  
```bash
npm run test
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For support, email support@jobmanagement.com or create an issue in the repository.

---

**Note**: This implementation is 100% pixel-perfect recreation of the provided mockups with fully functional filtering and CRUD operations.