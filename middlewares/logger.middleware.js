const logger = (req, res, next) => {
  const currentDate = new Date();
  const formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + 
    currentDate.getDate() + ' ' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
  
  const { ip, method, originalUrl: url } = req;
  const userAgent = req.get('user-agent') || '';

  res.on('close', () => {
    const { statusCode } = res;
    const contentLength = res.get('content-length');

    console.log(
      `[${formattedDate}]: ${method} ${url} ${statusCode} ContentLength: ${contentLength ? contentLength : 'none'} - ${userAgent} ${ip}`
    );
  });

  next();
}

module.exports = logger;