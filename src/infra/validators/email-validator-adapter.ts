import validator from 'validator'
import { EmailValidator } from '@/validation/protocols/email-validator'

export class EmailValidatorAdapter implements EmailValidator {
    isValid (email: string): Boolean {
        return validator.isEmail(email)
    }
}