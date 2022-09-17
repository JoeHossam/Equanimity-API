require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connect');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRouter = require('./routes/auth');
const insuranceRouter = require('./routes/insurance');
const companyRouter = require('./routes/company');
const categoryRouter = require('./routes/category');
const userRouter = require('./routes/user');
const reviewRouter = require('./routes/review');
const frontendRouter = require('./routes/frontend');
const paymentRouter = require('./routes/payment');
const contactRouter = require('./routes/contact');
const errorHandlerMiddleware = require('./middlwares/error-handler');
const notFound = require('./middlwares/not-found');
const {
    adminAuthenticated,
    companyAuthenticated,
} = require('./middlwares/authentication');
const morgan = require('morgan');

require('./config/passport')(passport);
const app = express();

//middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.disable('etag');
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
        // cookie: { maxAge: 1000 },
    })
);
app.use(express.static('./public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan());

//routes
app.use('/auth', authRouter);
app.use('/insurance', insuranceRouter);
app.use('/review', reviewRouter);
app.use('/company', companyRouter);
app.use('/category', categoryRouter);
app.use('/user', userRouter);
app.use('/front', frontendRouter);
app.use('/payment', paymentRouter);
app.use('/contact', contactRouter);
app.get('/islogged', (req, res) => {
    res.send({ islogged: req.isAuthenticated(), user: req.user });
});

app.get('/request', (req, res) =>
    res.json({ session: req.session, user: req.user })
);
app.get('/protected', adminAuthenticated, (req, res) =>
    res.send('hidden data2')
);
app.get('/', (req, res) => {
    res.status(200).json({ success: true });
});

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = 3001;
const start = async () => {
    try {
        const conn = await connectDB(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        app.listen(port, console.log(`Listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();
