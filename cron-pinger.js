const axios = require('axios');
const cron = require('node-cron');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const scheduledJobs = new Set(); // 🔐 To keep track of scheduled jobs
//http://127.0.0.1:8000/api/
const BaseUrl=`https://taskman-tusq.onrender.com/api/`;

async function fetchAndScheduleJobs() {
  try {
    const resp = await axios.get(BaseUrl+'active-cron-jobs');
    const jobs = resp.data;

    jobs.forEach(job => {
      if (!scheduledJobs.has(job.id)) {
        cron.schedule(job.frequency, async () => {
          try {
            await axios.get(`${BaseUrl}cron/${job.type}/${job.item_id}/${job.id}`);
            console.log(`Job ${job.title} ran at ${new Date()}`);
          } catch (e) {
            console.error(`Job ${job.title} failed: ${e.message}`);
          }
        });

        scheduledJobs.add(job.title); // Mark job as scheduled
        console.log(`Scheduled job ${job.title}`);
      }
    });
  } catch (e) {
    console.error('Error fetching cron jobs:', e.message);
  }
}

// Initial call
fetchAndScheduleJobs();

// Optional: Poll periodically for *new* jobs only (e.g., every 10 minutes)
setInterval(fetchAndScheduleJobs, 10  * 1000); // Every 10 secs

app.get('/', (req, res) => res.send('Cron pinger is running'));
app.listen(port, () => console.log(`Listening on port ${port}`));
