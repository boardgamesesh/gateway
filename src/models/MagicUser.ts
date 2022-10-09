import { Schema } from 'dynamoose';

export default new Schema(
  {
    id: String,
    name: String,
    type: String,
    email: String,
    settings: Object,
    magicToken: String,
  },
  {
    saveUnknown: true,
    timestamps: true,
  }
);
