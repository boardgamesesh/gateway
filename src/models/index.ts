import { model } from 'dynamoose';

import MagicUser from './MagicUser';

export const User = model('User', MagicUser);
