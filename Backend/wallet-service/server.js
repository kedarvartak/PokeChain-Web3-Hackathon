const express = require("express");
const { ethers } = require("ethers"); // Import ethers directly from the ethers library
const { isAddress } = require("web3-validator");
const cookieParser = require('cookie-parser')
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const Validator = require("./methods/validator")
const Cryptography = require('./methods/cryptoAlgo')
const JSON_WEB_TOKEN = require('./methods/jwtValidator')

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(cors());

app.get('/eth', async (req, res) => {
  const userToken = req.query.userToken;
  const validator = new JSON_WEB_TOKEN();

  const validateJTW = validator.validateUserToken(userToken)
  if(!validateJTW['valid']){
    console.log("Invalid JWT");
    return res.status(400).send({error:validateJTW['reason']})
  }

  const decodedToken = validateJTW['decodedToken'];
  console.log(decodedToken)
  const {wallet_address, email} = decodedToken;

  console.log("WALLET ADDRESS : ", wallet_address)

  // Use a JSON-RPC provider (e.g., Infura, Alchemy, or Linea Sepolia RPC URL)
  const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.linea.build");

  // Fetch balance
  const balance = await provider.getBalance(wallet_address);
  
  const queryText = `
    SELECT * 
    FROM nfts 
    LEFT JOIN pokemons 
    ON nfts.pokemon_id = pokemons.pokemon_id
    WHERE wallet_address = $1
    LIMIT 1;
  `;
  const nftsResult = await db.query(queryText, [wallet_address]);
  res.json({
    address: wallet_address,
    balance: ethers.formatEther(balance) + " ETH",
    nfts: nftsResult.rows
  });
});

// API to fetch wallet balance
app.get("/balance/:address", async (req, res) => {
  try {
    const walletAddress = req.params.address;

    // Validate Ethereum address
    if (!isAddress(walletAddress)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    // Use a JSON-RPC provider (e.g., Infura, Alchemy, or Linea Sepolia RPC URL)
    const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.linea.build");

    // Fetch balance
    const balance = await provider.getBalance(walletAddress);
    
    const queryText = `
      SELECT * 
      FROM nfts 
      LEFT JOIN pokemons 
      ON nfts.pokemon_id = pokemons.pokemon_id
      WHERE wallet_address = $1;
    `;
    const nftsResult = await db.query(queryText, [walletAddress]);

    // Respond with the formatted balance
    res.json({
      address: walletAddress,
      balance: ethers.formatEther(balance) + " ETH",
      nfts: nftsResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching balance" });
  }
});

app.post('/signup', async (req,res)=>{
  const wallet_address = req.body['wallet_address'];
  const email = req.body['email'];
  const password = req.body['password'];
  
  if(!wallet_address || !email || !password){
    return res.status(400).json({status:"failed", reason:"Incomplete credentials"})
  }

  const validator = new Validator();
  if(!validator.validateEmail(email)){
    return res.status(400).send({"error":"Invalid Email"});
  }

  if(!validator.validatePassword(password)){
      return res.status(400).send({"error":"Invalid Password"});
  }

  if (!isAddress(wallet_address)) {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  const cryptography = new Cryptography();
  const hashedPassword = cryptography.generateSaltHash(password);

  // store the wallet_address, email and hash in database
  const queryText = `
    INSERT INTO users
    (wallet_address, email, hash)
    VALUES ($1, $2, $3);
  `;

  try{
    const result = await db.query(queryText, [wallet_address, email, hashedPassword]);
  }
  catch(error){
    console.log(`Error ${error}`)
    return res.status(400).json({error: "database error"})
  }
  const jsonWebToken = new JSON_WEB_TOKEN();
  const userToken = jsonWebToken.createToken(jsonWebToken.createPayload(wallet_address,email));

  return res
    .cookie( 'userToken' , userToken ,{ httpOnly:true })
    .setHeader('Content-Type', 'application/json')
    .status(201)
    .json({
        success: "Signup completed",
        user: {
            wallet_address: wallet_address,
            email: email
        },
        userToken: userToken
    });

})

app.post('/login',async (req,res)=>{
  const email = req.body['email'];
  const password = req.body['password'];
  const validator = new Validator();

  if(!validator.validateEmail(email)){
      return res.status(400).send({"error":"Invalid Email"});
  }

  if(!validator.validatePassword(password)){
      return res.status(400).send({"error":"Invalid Password"});
  }

  const queryText = `
    SELECT wallet_address, hash FROM users
    WHERE email = $1;
  `;

  try{
    const result = await db.query(queryText, [email]);

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const cryptography = new Cryptography();
    const { wallet_address, hash } = result.rows[0];
    if(!cryptography.verifyPassword(password,hash)){
      logger.logLoginError({error:"Incorrect Password", data:email})
      return res.status(400).send({"error":"incorrect password"})
    }

    const jsonWebToken = new JSON_WEB_TOKEN();
    const userToken = jsonWebToken.createToken(jsonWebToken.createPayload(wallet_address,email));
    
    return res
    .cookie( 'userToken' , userToken ,{ httpOnly:true })
    .setHeader('Content-Type', 'application/json')
    .status(201)
    .json({
        success: "Login Completed",
        user: {
            wallet_address: wallet_address,
            email: email
        },
        userToken: userToken
    });
  
  }
  catch(error){
    console.log(`Error ${error}`)
  }
})




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
