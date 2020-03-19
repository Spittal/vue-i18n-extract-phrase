import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { getLocale, getProject } from '../../src/phrase';
import { setupAxios } from '../../src/phrase/setup';
const corsHandler = cors({ origin: '*' });

const app = express();
app.use(corsHandler);

app.get('/getLocaleFromPhrase', async (req, res) => {
  if (process.env.PHRASE_ACCESS_TOKEN) {
    setupAxios(process.env.PHRASE_ACCESS_TOKEN);
  } else {
    throw new Error('No PHRASE_ACCESS_TOKEN environment variable defined.');
  }

  const selectedProject = await getProject(process.env.PHRASE_PROJECT_ID);
  const locale = await getLocale(selectedProject, req.query.locale);

  const { data, headers } = await axios.get(`https://api.phraseapp.com/api/v2/projects/${selectedProject.id}/locales/${locale.id}/download`, {
    params: {
      file_format: 'simple_json', // eslint-disable-line @typescript-eslint/camelcase
      tags: req.query.tags
    }
  });

  res
    .set('Content-Type', 'application/json')
    .set('Link', headers.link)
    .set('Cache-Control', 'public, max-age=3600, s-maxage=7200')
    .send(JSON.stringify(data));
});

app.listen(process.env.PORT || 8080, () => console.log('Phrase Locale Server Started'));