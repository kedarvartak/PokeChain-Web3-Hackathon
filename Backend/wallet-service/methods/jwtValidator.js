const jwt = require('jsonwebtoken')
require('dotenv').config();

const SECRET_KEY = process.env.JWT_KEY;


class JSON_WEB_TOKEN{

    // Init payload of the jwt token

    createPayload(wallet_address,email){
        return {
            wallet_address: wallet_address,
            email: email
        }
    }

    createToken(payload){
        // return the signed jwt token
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' })
    }

    validateUserToken(userToken){
        try {
            const decodedToken = jwt.verify(userToken, SECRET_KEY);     // fetch the decoded token using the secrete key and userToken
            // console.log(decodedToken);
            
            // If token is not verified, then it will throw an error

            if (decodedToken.exp < Math.floor(Date.now() / 1000)) {     // check if the token has expired
                return { valid: false, reason: 'Token has expired' };   
            }

            // return valid token

            return { valid: true, decodedToken: decodedToken };
        } catch (error) {
            return { valid: false, reason: 'Invalid token: ' + error.message };
        }
    }

}

module.exports = JSON_WEB_TOKEN;