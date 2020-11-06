export class SignUpController {
    handle(httpeRequest: any): any {
        return {
            statusCode: 400,
            body: new Error('Missing param: name')
        }
    }
}