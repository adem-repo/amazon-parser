const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });
const dbName = 'amazon_books';
const collectionName = `category_books_ranks_${new Date()}`;

let clientDescriptor, collection;

export function dbConnect() {
  mongoClient.connect( async (err, client) => {
    const db = await client.db(dbName);
    await db.createCollection(collectionName);
    collection = await db.collection(collectionName);
    clientDescriptor = client;
  });
}

export function dbDisconnect() {
  clientDescriptor.close();
}

export function addDocument(data) {
  collection.insertOne(data, function(err, result){
    if (err)
      return console.log(err);
  });
}

