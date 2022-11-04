import { Schema, type } from 'dynamoose';

export default new Schema(
  {
    id: { type: String, hashKey: true },
    name: { type: String },
    type: { type: String },
    location: { type: String },
    secretToken: { type: [String, type.NULL] },
    friendIds: { type: Array, schema: [String] },
    sessionIds: { type: Array, schema: [String] },
    groupHashIds: { type: Array, schema: [String] },
    settings: { type: Object, schema: { darkMode: Boolean } },
    email: { type: String, required: true, index: { name: 'email', type: 'global' } },
  },
  { saveUnknown: ['settings:**'], timestamps: true }
);
