const express = require('express');
const app = express();
const mongoose = require('mongoose');
const password = require('./secure');
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect(`mongodb+srv://october03:${password}@cluster0.px3zzvw.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("데이터베이스 연결 성공"));

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(3001, () => {
  console.log('Server started on port 3001');
});