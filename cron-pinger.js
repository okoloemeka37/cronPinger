
const axios=require('axios');
const cron=require('node-cron');

async function fecthAndScheduleJobs(){
   try {
    const resp=await axios.get('http://127.0.0.1:8000/api/active-cron-jobs');
    const jobs=resp.data;

    jobs.forEach(job => {
        cron.schedule(job.frequency,async()=>{
            try {
                await axios.get(`http://127.0.0.1:8000${job.url}`);
                console.log(`Job #${job.id} ran at ${new Date()}`);
            } catch (e) {
                console.error(`Job #${job.url} failed: ${e.message}`);
            }
        })
        console.log(`Scheduled job #${job.id} with frequency ${job.frequency}`);
    });

   } catch (e) {
    console.error('Error fetching cron jobs:', e.message);
   } 
}

setInterval(fecthAndScheduleJobs,30*1000 );
fecthAndScheduleJobs()



const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Cron pinger is running'));
app.listen(port, () => console.log(`Listening on port ${port}`));