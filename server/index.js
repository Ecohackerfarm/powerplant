/**
 * @namespace server
 */

import { ReadWriteScheduler } from 'async-task-schedulers';

export const scheduler = new ReadWriteScheduler();
