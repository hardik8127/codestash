import { db } from "../libs/db.js";

// Get current streak for the authenticated user
export const getCurrentStreak = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's streak data sorted by date in descending order
    const streakData = await db.userStreak.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    
    if (streakData.length === 0) {
      return res.status(200).json({ currentStreak: 0 });
    }
    
    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let currentStreak = 0;
    let checkDate = today;
    
    // Check if user has a streak today
    const hasTodayStreak = streakData.some(
      streak => new Date(streak.date).setHours(0, 0, 0, 0).valueOf() === today.valueOf()
    );
    
    // If no streak today, start checking from yesterday
    if (!hasTodayStreak) {
      checkDate = yesterday;
    }
    
    // Count consecutive days
    for (let i = 0; i < streakData.length; i++) {
      const streakDate = new Date(streakData[i].date);
      streakDate.setHours(0, 0, 0, 0);
      
      if (streakDate.valueOf() === checkDate.valueOf()) {
        currentStreak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return res.status(200).json({ currentStreak });
  } catch (error) {
    console.error("Error getting current streak:", error);
    return res.status(500).json({ error: "Failed to get current streak" });
  }
};

// Get longest streak for the authenticated user
export const getLongestStreak = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's streak data sorted by date
    const streakData = await db.userStreak.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
    
    if (streakData.length === 0) {
      return res.status(200).json({ longestStreak: 0 });
    }
    
    let longestStreak = 1;
    let currentStreak = 1;
    
    // Calculate longest consecutive streak
    for (let i = 1; i < streakData.length; i++) {
      const prevDate = new Date(streakData[i-1].date);
      const currDate = new Date(streakData[i].date);
      
      // Check if dates are consecutive
      const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        // Consecutive day
        currentStreak += 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (dayDiff > 1) {
        // Streak broken
        currentStreak = 1;
      }
    }
    
    return res.status(200).json({ longestStreak });
  } catch (error) {
    console.error("Error getting longest streak:", error);
    return res.status(500).json({ error: "Failed to get longest streak" });
  }
};

// Get streak history for the authenticated user
