import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.headers.authorization; // Заголовок Authorization
  console.log("Токен:", token);

  if (!token) {
    return res.status(403).json({ message: "Нет доступа (токен отсутствует)" });
  }

  try {
    // Проверяем, начинается ли заголовок с "Bearer "
    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(403).json({ message: "Неверный формат токена" });
    }

    const decoded = jwt.verify(tokenParts[1], 'secret123'); // Декодируем токен
    req.userId = decoded._id; // Добавляем userId в объект запроса

    next(); 
  } catch (error) {
    console.error("Ошибка проверки токена:", error);
    return res.status(403).json({ message: "Неверный или просроченный токен" });
  }
};