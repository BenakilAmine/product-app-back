// Version ultra-simple sans Prisma pour tester
module.exports = (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API fonctionne',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};