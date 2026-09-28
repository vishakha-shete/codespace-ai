import express from 'express';
import agentRouter from './routes/agent.routes.js';
import morgan from  'morgan';

const app = express();


//middleware
app.use(morgan('dev'));
app.use(express.json());


app.get('/api/healthz', (req,res)=>{
    res.status(200).json({status: 'ok'});
});

//Routes
app.use('/api/ai', agentRouter);


export default app;
