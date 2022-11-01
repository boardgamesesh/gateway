import { Schema, type } from 'dynamoose';

export default new Schema(
  {
    id: { type: String, hashKey: true },
    email: { type: String, required: true, index: { name: 'email', type: 'global' } },
    secretToken: { type: [String, type.NULL] },
    settings: { type: Object, schema: { darkMode: Boolean } },
    name: { type: String },
    type: { type: String },
    groupHashIds: { type: Array, schema: [String] },
  },
  { saveUnknown: ['settings:**'], timestamps: true }
);
