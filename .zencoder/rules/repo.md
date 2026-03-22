# AppsicalBackend Testing Rules

## Framework Detection
- **Target Framework**: Jest + Supertest (API Testing)
- **Backend Framework**: Express.js with Node.js
- **Database**: MongoDB with Mongoose

## Testing Guidelines
- Use Jest as the testing framework for API endpoints
- Use Supertest for HTTP assertions
- Test all endpoints systematically
- Include authentication tests for admin routes
- Test both success and error scenarios
- Use proper test data and mocking where necessary

## Directory Structure
- Tests located in: `tests/api/`
- Test files follow pattern: `*.test.js`
- Separate test files by entity/module

## Key Features to Test
1. Authentication endpoints (register, login, OTP verification)
2. CRUD operations for all entities
3. Admin-only route protection
4. File upload functionality
5. Validation scenarios
6. Rate limiting
7. Error handling

## Test Categories
- **Admin Routes**: Authentication required, CRUD operations
- **User Routes**: Public access, mostly read operations
- **Entities**: auth, contact, content, domain, faq, getInTouch, newsletter, project, team, testimonial