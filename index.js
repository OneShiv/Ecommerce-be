const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');

const app = express();

// database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected");
});
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressValidator());
// // routes
app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', categoryRoute);
app.use('/api', productRoute);

app.get('/', (req, res) => {
    res.send({ express: 'Hello From Express' });
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server started on" + port);
});