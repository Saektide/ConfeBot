import { Listener } from 'discord-akairo';
import { CronJob } from 'cron';
import KickNonVerifiedMembers from '../tasks/KickNonVerifiedMembers';

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
  }

  exec() {
    this.client.logger.success('[Discord] Ready!');
    this.client.rollbar.debug('[Discord] Received ready event');
    this.client.user.setPresence({
      activity: {
        name: `${this.client.users.cache.size} usuarios | version ${this.client.version}`
      },
      status: 'online'
    }).catch(this.client.rollbar.error);
    const sched = new CronJob('0 * * * *', () => KickNonVerifiedMembers(this.client), null, true);
    sched.start();
    sched.fireOnTick();
  }
}

export default ReadyListener;
