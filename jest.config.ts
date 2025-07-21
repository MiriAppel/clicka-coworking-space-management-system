// jest.config.js
module.exports = {
  preset: 'ts-jest', // אם אתה משתמש ב-TypeScript
  testEnvironment: 'node', // בגלל שזה קוד צד שרת
  roots: ['/src'], // נניח שהקוד שלך נמצא בתיקיית src
  testMatch: ['**/__tests__\pricing.service.test.ts'], // דפוסי שמות לקבצי בדיקה
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: true, // הפעלת איסוף כיסוי קוד
  coverageDirectory: 'coverage', // תיקיית הפלט לכיסוי
  collectCoverageFrom: ['src/**/*.ts', '!src/db/**/*.ts', '!src/models/**/*.ts'], // קבצים שאתה רוצה לכלול בכיסוי (אולי תרצה להתאים)
};