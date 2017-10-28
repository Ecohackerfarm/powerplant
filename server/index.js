/**
 * @namespace server
 */

import { ReadWriteScheduler } from 'async-task-schedulers';

export let scheduler = new ReadWriteScheduler();
