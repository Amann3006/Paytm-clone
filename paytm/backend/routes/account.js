// backend/routes/account.js
const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.json({ 
            balance: account.balance
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching balance"
        });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const rawAmount = req.body.amount;
    const amount = Number(rawAmount);
    const { to } = req.body;

    if (!amount || isNaN(amount) || amount <= 0 || !Number.isFinite(amount)) {
        return res.status(400).json({
            message: "Invalid transfer amount. Please enter an amount greater than 0."
        });
    }

    if (!to) {
        return res.status(400).json({
            message: "Recipient ID is required"
        });
    }

    if (to.toString() === req.userId.toString()) {
        return res.status(400).json({
            message: "Cannot transfer money to yourself"
        });
    }

    if (!mongoose.Types.ObjectId.isValid(to)) {
        return res.status(400).json({
            message: "Invalid recipient account identifier"
        });
    }

    let session = null;
    let transactionStarted = false;

    try {
        session = await mongoose.startSession();
        session.startTransaction();
        transactionStarted = true;

        // Fetch the accounts within the transaction
        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Recipient account not found"
            });
        }

        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();

        const updatedAccount = await Account.findOne({ userId: req.userId });

        return res.json({
            message: "Transfer successful",
            newBalance: updatedAccount ? updatedAccount.balance : undefined
        });
    } catch (err) {
        if (transactionStarted && session) {
            try {
                await session.abortTransaction();
            } catch (abortErr) {
                // Ignore abort error
            }
        }

        // Fallback for standalone MongoDB instances without replica sets
        const isReplicaSetError = err.message && (
            err.message.includes("replica set") ||
            err.message.includes("Transaction numbers") ||
            err.message.includes("transactions are not supported")
        );

        if (isReplicaSetError) {
            const fromUpdate = await Account.updateOne(
                { userId: req.userId, balance: { $gte: amount } },
                { $inc: { balance: -amount } }
            );

            if (fromUpdate.modifiedCount === 0) {
                return res.status(400).json({
                    message: "Insufficient balance or sender account not found"
                });
            }

            const toUpdate = await Account.updateOne(
                { userId: to },
                { $inc: { balance: amount } }
            );

            if (toUpdate.modifiedCount === 0) {
                // Rollback deduction if recipient not found
                await Account.updateOne({ userId: req.userId }, { $inc: { balance: amount } });
                return res.status(400).json({
                    message: "Recipient account not found"
                });
            }

            const updatedAccount = await Account.findOne({ userId: req.userId });

            return res.json({
                message: "Transfer successful",
                newBalance: updatedAccount ? updatedAccount.balance : undefined
            });
        }

        console.error("Transfer error:", err);
        return res.status(500).json({
            message: "An error occurred during transfer. Please try again."
        });
    } finally {
        if (session) {
            session.endSession();
        }
    }
});

module.exports = router;