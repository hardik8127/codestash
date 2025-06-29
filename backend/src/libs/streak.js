import { db } from "./db.js";

export async function updateUserStreak(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day
  
  try {
    // Check if user already has streak for today
    const existingStreak = await db.userStreak.findUnique({
      where: {
        userId_date: {
          userId,
          date: today
        }
      }
    });
    
    if (existingStreak) {
      // Increment existing streak
      await db.userStreak.update({
        where: { id: existingStreak.id },
        data: { count: existingStreak.count + 1 }
      });
    } else {
      // Create new streak entry
      await db.userStreak.create({
        data: {
          userId,
          date: today,
          count: 1
        }
      });
    }
  } catch (error) {
    console.error("Error updating streak:", error);
    // Don't throw - we don't want to affect the main submission flow
  }
}