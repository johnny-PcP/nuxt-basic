// users.get.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  return {
    success: true,
    data: [
      {
        id: 1,
        name: '張三',
        email: 'zhang@example.com',
        age: 25,
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        id: 2,
        name: '李四',
        email: 'li@example.com',
        age: 30,
        isActive: false,
        createdAt: '2024-01-14T09:20:00Z',
      },
      {
        id: 3,
        name: '王五',
        email: 'wang@example.com',
        age: 28,
        isActive: true,
        createdAt: '2024-01-13T15:45:00Z',
      },
    ],
  }
})
