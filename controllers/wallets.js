// controllers/wallets.js
const Wallets = require('../models/wallet');

const createWallet = async (req, res) => {
    try{
        const {username}= req.body;

        const walletExists = await Wallets.findOne({username});
        if (walletExists){
            return res.status(409).json({
                status: false,
                message: 'Wallet already exists',
            })
        }

        const result = await Wallets.create({username});
        console.log(result)
        return res.status(201).json({
            status: true,
            message: 'Wallets created successfully',
            data: result
        })
    } catch (err) {
        return res.status(500).json({
            status: true,
            message: `Unable to create wallet. Please try again. \n Error: ${err}`
        })
    }
}

module.exports = { createWallet };
