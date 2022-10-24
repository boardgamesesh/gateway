import { Schema, type } from 'dynamoose';

export default new Schema(
  {
    id: { type: String, hashKey: true },
    email: { type: String, required: true },
    secretToken: { type: [String, type.NULL] },
    settings: { type: Object }, // TODO: diagnose failure to save settings properly
    name: { type: String },
    type: { type: String },
  },
  { saveUnknown: ['settings:**'], timestamps: true }
);
