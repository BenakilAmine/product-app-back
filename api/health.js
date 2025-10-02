// Endpoint de santé simple pour diagnostiquer les problèmes
module.exports = (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    prisma: {
      available: !!process.env.DATABASE_URL,
      url: process.env.DATABASE_URL ? 'configured' : 'missing'
    }
  });
};