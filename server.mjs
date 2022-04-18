import express from 'express';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config()

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());

// Route Handlers
import activities from './routes/api/activities.js';
import user_session from './routes/api/user-session.js'
import users_token from './routes/api/users-token.js'
import idletime from './routes/api/idle-time.js'
import snaps from './routes/api/snaps.js'
import uploads from './routes/api/uploads.js'
import login from './routes/api/login.js'
import projectstatus from './routes/api/project-status.js'
import time_edits from './routes/api/time-edits.js'
import top_users from './routes/api/top-users.js'
import timesheets from './routes/api/timesheet.js'
import users from './routes/api/users.js'
import profile from './routes/api/profile.js'
import timecard from './routes/api/timecard.js'
import top_apps from './routes/api/top-apps.js'
import app_rating from './routes/api/app-rating.js'
import work_hours from './routes/api/workhours.js'
import app_usage from './routes/api/app-usage.js'
import projects from './routes/api/projects.js'
import rating_summary from './routes/api/rate-summary.js'

// API EndPoints
app.use('/api/activities', activities);
app.use('/api/user-session', user_session) // Testing
app.use('/api/users-token', users_token) // Testing
app.use('/api/idletime',idletime)
app.use('/api/snaps',snaps)
app.use('/api/upload',uploads) // Testing
app.use('/api/login', login) // Testing
app.use('/api/project-status', projectstatus) // Testing
app.use('/api/edits',time_edits) // Testing
app.use('/api/top-users', top_users)
app.use('/api/timesheets', timesheets)
app.use('/api/users', users) // Testing
app.use('/api/profiles', profile) // Functional
app.use('/api/timecard',timecard) // Functional
app.use('/api/top-apps',top_apps) // Funtional
app.use('/api/app-rating',app_rating) // Funtional
app.use('/api/work-hours',work_hours) // Functional
app.use('/api/app-usage',app_usage) // Functional
app.use('/api/projects',projects) // Testing
app.use('/api/rating-summary',rating_summary) // Testing




app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        //res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

mongoose.connect(process.env.MONGODB_URI_2,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(()=>{console.log('Mongodb connected')})
.catch((err)=>{console.log(err)})

const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`Server running on port ${port}`);
  });