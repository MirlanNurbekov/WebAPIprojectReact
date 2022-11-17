const express = require('express');
const app = express(); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 
const User = require('./models/user.model');
const DATA = require('./models/safedWeather')
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs'); 

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://Mirlan:mirlan776408@cluster0.kwigytp.mongodb.net/weatherData?retryWrites=true&w=majority ')

app.post('/api/safedWeather', async (req, res) => {
    console.log(req.body)
    try {
        const data = await DATA.create({
            userFrom: req.body.getEmail,
            cityName: req.body.city,
            countryName: req.body.country,
            temperatureValue: req.body.temperature,
            humidityValue: req.body.humidity,
        })
        res.json({ status: 'ok' })
    } catch (err) {
        res.json({ status: 'error', error: 'Failed' })
    }
})
// Used by MonsterThumbnail.js remove button
app.post('/api/removeWeather', async (req, res) => {
    console.log(req.body)
    try {
        const data = await DATA.deleteOne({
            userFrom: req.body.getEmail,
            cityName: req.body.city,
            countryName: req.body.country,
            temperatureValue: req.body.temperature,
            humidityValue: req.body.humidity,
        })
        res.json({ status: 'ok' })
    } catch (err) {
        res.json({ status: 'error', error: 'Failed to remove' })
    }
})

// Load stored data based on user email 
app.get('/api/data', async (req, res) => {
    const userEmail = req.headers['x-email']

    DATA.find({ 'userFrom': userEmail })
        .exec((err, data) => {
            if(err) return res.json({ status: 'error', error: 'Failed to load data'});
            return res.json({ status: 'ok', data })
        })    
})



app.post('/api/register', async (req, res) => {
    console.log(req.body)
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10) 
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,

            password: newPassword
        })
        res.json({ status: 'ok' })
    } catch (err) {
        res.json({ status: 'Error', error: 'Email already exist' })
    }
})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })

    if(!user) { return { status: 'Error', error: 'Invalid login' } }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

    if (isPasswordValid){
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email
            },
            'secret123'
        )
        return res.json({ status: 'ok', user: token })
    } else {
        res.json({ status: 'error', user: false })
    }
})

app.listen(1337, () => {
    console.log('Server started on 1337'); 
})