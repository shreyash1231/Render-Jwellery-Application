# 💎 Jwellery Backend - Complete & Secure

A production-ready Node.js/Express backend for e-commerce jewelry platform with enterprise-grade security.

## 📖 Documentation Index

**Start here:** [QUICK_START.md](QUICK_START.md) - 5-minute setup guide

### For Different Audiences:

**Backend Developers:**
1. [QUICK_START.md](QUICK_START.md) - Setup & getting started
2. [SECURITY_IMPLEMENTATION.md](SECURITY_IMPLEMENTATION.md) - Security features & fixes
3. [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Complete API reference

**Frontend Developers:**
1. [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md) - Integration guide with code examples
2. [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
3. [.env.example](.env.example) - Environment setup

**DevOps/Deployment:**
1. [SECURITY_IMPLEMENTATION.md](SECURITY_IMPLEMENTATION.md) - Production checklist
2. [.env.example](.env.example) - Environment variables
3. [Dockerfile](Dockerfile) - Docker configuration

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file from template
cp .env.example .env
# Then edit .env with your credentials

# 3. Start development server
npm run dev

# 4. Access API docs
# Open http://localhost:9757/api-docs
```

---

## ✨ Key Features

### Security ✅
- **Credentials Management**: All secrets in environment variables
- **Security Headers**: Helmet.js with CSP, X-Frame-Options, HSTS
- **CORS Protection**: Whitelist-based origin validation
- **Rate Limiting**: Global + auth-specific rate limits
- **JWT Authentication**: Secure token-based auth with expiration
- **Input Validation**: Request body size limits & parameter pollution protection
- **Password Security**: OTP-based login with expiration
- **Error Handling**: Secure error messages (no data leakage)

### Performance ✅
- **Gzip Compression**: Reduced bandwidth usage
- **Caching**: Redis support for future implementation
- **Database Optimization**: Connection pooling & timeouts
- **Request Limiting**: 100kb body limit to prevent DoS

### Scalability ✅
- **Microservices Ready**: Separated controllers, services, models
- **RESTful API**: Standard HTTP methods & status codes
- **Pagination**: Built-in pagination for list endpoints
- **Error Tracking**: Structured logging for monitoring
- **Load Balancer Support**: Proxy trust configuration

---

## 📋 Project Structure

```
jwellery_backend/
├── config/                 # Configuration files
│   ├── index.js           # Environment variables
│   ├── db.js              # MongoDB connection
│   └── redis.js           # Redis configuration
├── controller/            # Request handlers
│   ├── adminController/   # Admin-specific handlers
│   └── userController/    # User-specific handlers
├── middleware/            # Express middleware
│   ├── authMiddleware.js  # JWT validation
│   ├── globalErrorHandler.js
│   ├── rateLimiters.js
│   └── uploadMiddleware.js
├── models/                # MongoDB schemas
├── routes/                # API routes
│   ├── adminRoutes/
│   └── userRoutes/
├── services/              # Business logic
├── utils/                 # Utility functions
│   ├── sendOtp.js        # Email service
│   ├── razorpay.js       # Payment service
│   └── cache.js          # Caching
├── validation/            # Input validation schemas
├── app.js                 # Express app setup
├── server.js              # Server entry point
├── .env                   # Environment variables (SECRET!)
├── .env.example           # Template
├── docker-compose.yml     # Docker setup
└── package.json           # Dependencies

Documentation:
├── QUICK_START.md                    # 5-minute setup
├── SECURITY_IMPLEMENTATION.md        # Security audit
├── FRONTEND_INTEGRATION_GUIDE.md     # Frontend guide
└── API_DOCUMENTATION.md              # API reference
```

---

## 🔐 Security Summary

### What Was Fixed

| Issue | Severity | Solution |
|-------|----------|----------|
| Hardcoded credentials | CRITICAL | Moved to `.env` file |
| Open CORS policy | HIGH | Whitelist-based validation |
| Weak JWT secret | HIGH | Strong secret from environment |
| Missing security headers | HIGH | Helmet.js implementation |
| No rate limiting | HIGH | Global + auth-specific limits |
| Weak authentication | MEDIUM | Bearer token validation improved |
| No input validation | MEDIUM | Body size limits + HPP |
| Information disclosure | MEDIUM | Generic error messages |

### Security Features Enabled

✅ Helmet.js (CSP, frameguard, referrer policy)
✅ CORS whitelist validation
✅ Rate limiting (100 req/15min general, 20 req/15min auth)
✅ JWT with proper validation
✅ Body size limits (100kb)
✅ Parameter pollution protection
✅ HTTPS ready (production flag)
✅ Secure email with TLS
✅ No sensitive data in logs
✅ Proper error handling

---

## 🔗 API Endpoints (Quick Reference)

### Authentication
```
POST   /api/v1/user/auth/register        Register user
POST   /api/v1/user/auth/send-otp        Send login OTP
POST   /api/v1/user/auth/verify-otp      Verify & login
POST   /api/v1/user/auth/logout          Logout
```

### Products
```
GET    /api/v1/user/products             List products
GET    /api/v1/user/products/:id         Product details
GET    /api/v1/user/categories           List categories
POST   /api/v1/user/products/:id/reviews Create review
```

### Cart (Protected)
```
GET    /api/v1/user/cart                 Get cart
POST   /api/v1/user/cart                 Add to cart
PUT    /api/v1/user/cart/:itemId         Update item
DELETE /api/v1/user/cart/:itemId         Remove item
```

### Orders (Protected)
```
POST   /api/v1/user/orders               Create order
GET    /api/v1/user/orders               Get orders
GET    /api/v1/user/orders/:orderId      Order details
```

### Admin (Admin only)
```
GET    /api/v1/admin/dashboard           Dashboard stats
POST   /api/v1/admin/products            Create product
GET    /api/v1/admin/users               List users
```

**Full docs:** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 📦 Dependencies

### Core
- `express` - Web framework
- `mongoose` - MongoDB driver
- `jsonwebtoken` - JWT authentication
- `nodemailer` - Email service

### Security
- `helmet` - Security headers
- `cors` - Cross-origin protection
- `express-rate-limit` - Rate limiting
- `express-slow-down` - Gradual slowdown
- `hpp` - Parameter pollution protection

### Utilities
- `dotenv` - Environment variables
- `morgan` - Request logging
- `compression` - Gzip compression
- `cookie-parser` - Cookie parsing

### Payment
- `razorpay` - Payment gateway

### Development
- `nodemon` - Auto-reload
- `jest` - Testing framework

---

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### API Testing with cURL
```bash
# Send OTP
curl -X POST http://localhost:9757/api/v1/user/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# With auth token
curl -X GET http://localhost:9757/api/v1/user/profile \
  -H "Authorization: Bearer <token>"
```

### Interactive Testing
```
http://localhost:9757/api-docs  (Swagger UI)
```

---

## 🐳 Docker Setup

```bash
# Build image
docker build -t jwellery-backend .

# Run container
docker run -p 9757:9757 --env-file .env jwellery-backend

# Docker Compose
docker-compose up
```

---

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
NODE_ENV=production npm start
```

### Environment Setup (Production)
Update `.env`:
```env
NODE_ENV=production
ENFORCE_HTTPS=true
ENABLE_HSTS=true
JWT_SECRET=<generate-new-strong-secret>
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

See [SECURITY_IMPLEMENTATION.md](SECURITY_IMPLEMENTATION.md) for complete production checklist.

---

## 🤝 Frontend Integration

Share [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md) with your frontend team.

It includes:
- Setup instructions
- Authentication flow with code examples
- API integration examples
- Error handling patterns
- Security best practices
- Complete code samples

---

## 📧 Email Setup

### Gmail Configuration
1. Go to https://myaccount.google.com/apppasswords
2. Generate app password
3. Add to `.env`:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=<16-char-app-password>
```

---

## 💳 Payment Integration

### Razorpay
1. Get keys from https://dashboard.razorpay.com
2. Add to `.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

---

## 📊 Monitoring & Logging

Current logging via Morgan & console.

For production, consider:
- Winston/Pino for structured logging
- Sentry for error tracking
- LogRocket for session replay
- New Relic/Datadog for monitoring

---

## 🔄 Database

### MongoDB
- Connection: MongoDB Atlas with connection pooling
- Authentication: Username/password in connection string
- Schemas: Mongoose models with validation
- Backups: Configure in MongoDB Atlas dashboard

---

## 🎯 Performance Optimization

✅ Gzip compression enabled
✅ Body size limits (prevent DoS)
✅ Request timeout: 30 seconds
✅ Database connection pooling
✅ Caching support (Redis ready)
✅ Rate limiting (prevent abuse)

---

## 🛠️ Troubleshooting

### Database Connection Error
```
Solution: Check MONGODB_URI in .env
- Verify credentials
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity
```

### CORS Error
```
Solution: Update CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:3000
```

### Rate Limit Error (429)
```
Solution: Wait 15 minutes or implement retry logic
See FRONTEND_INTEGRATION_GUIDE.md for retry example
```

### Email Not Sending
```
Solution: Verify email credentials
- Use app password (not main password)
- Check "Less secure apps" setting in Gmail
- Verify email address is correct
```

---

## 📝 Environment Variables

See [.env.example](.env.example) for all required variables with descriptions.

**Required:**
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Token secret
- `EMAIL_USER` - Email address
- `EMAIL_PASSWORD` - Email password
- `RAZORPAY_KEY_ID` - Payment key
- `RAZORPAY_KEY_SECRET` - Payment secret
- `CORS_ORIGIN` - Allowed frontend URLs

---

## 🔄 API Rate Limits

- **Global:** 100 requests per 15 minutes
- **Auth:** 20 requests per 15 minutes
- **Uploads:** 60 uploads per 15 minutes

Exceeding limits returns `429 Too Many Requests`.

---

## 🆘 Getting Help

### Quick Questions
1. Check [QUICK_START.md](QUICK_START.md)
2. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. Visit Swagger UI: http://localhost:9757/api-docs

### Security Questions
→ [SECURITY_IMPLEMENTATION.md](SECURITY_IMPLEMENTATION.md)

### Frontend Integration
→ [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)

### Environment Setup
→ [.env.example](.env.example)

---

## 📄 License

Copyright © 2024. All rights reserved.

---

## ✅ Verification Checklist

- [x] All credentials moved to environment variables
- [x] Security headers implemented (Helmet.js)
- [x] CORS properly configured
- [x] Rate limiting enabled
- [x] JWT validation improved
- [x] Input validation enforced
- [x] Error messages secured
- [x] Email service configured
- [x] Documentation complete
- [x] Frontend integration guide created
- [x] API documentation created
- [x] Production checklist provided

---

## 🎉 Ready to Use!

Your backend is now:
- ✅ **Secure** - Enterprise-grade security
- ✅ **Documented** - Complete API & integration guides
- ✅ **Production-ready** - Ready for deployment
- ✅ **Developer-friendly** - Clear code & examples

**Next Steps:**
1. Set up `.env` file
2. Share [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md) with frontend team
3. Start frontend development
4. Test authentication flow
5. Deploy to production

---

**Last Updated:** January 2026
**Status:** ✅ Complete & Secure
