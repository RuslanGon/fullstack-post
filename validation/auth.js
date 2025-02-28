import {body} from 'express-validator'

export const registerValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    body('fullName').isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),
    body('avatarUrl').optional().isURL().withMessage('Invalid avatar URL'),
];

export const loginValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
];