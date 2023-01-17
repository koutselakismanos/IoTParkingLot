import express from 'express';
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();
const port = 5000;

app.use(cors());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/meow', (req, res) => {
  res.json({
    cat: 'meowing',
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
