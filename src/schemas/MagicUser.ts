import { Schema, type } from 'dynamoose';

export default new Schema(
  {
    id: { type: String, hashKey: true },
    email: { type: String, required: true },
    magicToken: { type: [String, type.NULL] },
    settings: { type: Object },
    name: { type: String },
    type: { type: String },
  },
  { saveUnknown: ['settings:**'], timestamps: true }
);
