import slowDown from 'express-slow-down'

export const speedLimiter = slowDown({
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 2, // allow 2 requests per 1 minutes, then...
  delayMs: (hits) => hits * 500, // begin adding 500ms of delay per request above 100:
  maxDelayMs: 2 * 1000, // Will not increase delay beyond 2 seconds.
})
