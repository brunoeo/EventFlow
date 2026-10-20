import UsersDataAccess from '../dataAccess/users.js'
import { ok, serverError, notFound } from '../helpers/httpResponse.js'

export default class UsersController {
    constructor() {
        this.dataAccess = new UsersDataAccess()
    }

    async getUser() {
        try {
            const users = await this.dataAccess.getUser()

            return ok(users)
        }catch (error) {
            return serverError(error)
        }
    }

    async deleteUser(userId) {
        try{
            const result = await this.dataAccess.deleteUser(userId)
            if(!result){
                return notFound()
            }

            return ok(result)
        }catch (error) {
            return serverError(error)
        }
    }

    async updateUser(userId, userData){
        try{
            const result = await this.dataAccess.updateUser(userId, userData)                          
            console.log('Result:' , result)

            if(!result){
                return notFound()
            }
            return ok(result)
        }catch (error) {
            return serverError(error)
        }
    }
}