import express from "express"
import { Mongo } from "../database/mongo.js"
import crypto from 'crypto'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import jwt from 'jsonwebtoken'
import {ObjectId} from 'mongodb'
import { error } from "console"

const collectionName = 'users'

passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, callback) => {
    const user = await Mongo.db.collection(collectionName).findOne({email: email})
    if(!user) return callback(null, false, {message: 'User not found'})

    const saltBuffer = Buffer.from(user.salt.buffer) // Binary → Buffer
    crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (err, hashedPassword) => {
        if(err) return callback(null, false, {message: 'Error validating password'})
        
        const userPasswordBuffer = Buffer.from(user.password.buffer) // Binary → Buffer
        if(!crypto.timingSafeEqual(hashedPassword, userPasswordBuffer)){
            return callback(null, false, {message: 'Invalid password'})
        }

        const {password, salt, ...rest} = user
        return callback(null, rest)
    })
}))


const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
    const checkUser = await Mongo.db.collection(collectionName).findOne({email: req.body.email})
    if(checkUser) return res.status(500).send({success: false, statusCode: 500, body: 'User already exists'}) 

    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(req.body.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
        if(err) return res.status(500).send({success: false, statusCode: 500, body: 'Error hashing password', error: err})

        const result = await Mongo.db.collection(collectionName).insertOne({
            email: req.body.email,
            password: hashedPassword, // salva direto
            salt: salt                // salva direto
        })

        if(result.insertedId){
            const payload = {
                id: result.insertedId.toString(),
                email: req.body.email
            }

            const token = jwt.sign(payload, 'secret', { expiresIn: '1h' })
            
            return res.send({
                success: true,
                statusCode: 201,
                body: {
                    text: 'User created successfully',
                    user: payload,
                    token: token,
                    logged: true
                }
            })
        }
    })
})


authRouter.post('/login', (req, res) => {
    passport.authenticate('local', (error, user) => {
        if(error) return res.status(500).send({
            success: false, 
            statusCode: 500, 
            body: {
                text: 'Error authenticating user', 
                error: error
            }
        })
        
        if(!user){
            return res.status(401).send({
                success: false,
                statusCode: 401,
                body: {
                    text: 'User not found or invalid password'
                }
            })
        }
            
        const token = jwt.sign(user, 'secret')

        return res.status(200).send({
                success: true,
                statusCode: 200,
                body: {
                    text: 'User authenticated successfully',
                    user: user,
                    token: token,
                    logged: true
                }
            })
    })(req, res)
})

export default authRouter