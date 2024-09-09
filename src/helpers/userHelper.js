const path = require('node:path');
const fs = require('node:fs/promises');

// Путь к файлу users.js
const usersFilePath = path.join(__dirname, '..', 'db', 'users.js');

// Функция для получения всех пользователей
const getUsers = async () => {
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw error;
    }
};

// Функция для получения пользователя по ID
const getUserById = async (userId) => {
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(data);
        return users.find(user => user.id === userId);
    } catch (error) {
        throw error;
    }
};

// Функция для создания нового пользователя
const createUser = async (newUser) => {
    try {

        // Читаем существующих пользователей из файла
        const data = await fs.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(data);

        // Добавляем нового пользователя
        users.push(newUser);

        // Сохраняем обновленный список пользователей обратно в файл
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser
};
