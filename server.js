import express from 'express';
import mongoose from 'mongoose';
//
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
//
import usersRouter from './routes/usersRouter.js';

const app = express();

app.use(express.json());

app.get('/api', (req, res) => res.send('Api home page'));

app.use('/api/users', usersRouter);

//
app.use(notFound);
app.use(errorHandler);
//
const mongoUri = 'mongodb://localhost:27017/myUsers';
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MongoDb connected ${conn.connection.host}`);
    app.listen(5000, () => console.log('app is running on port 5000'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectDB();
