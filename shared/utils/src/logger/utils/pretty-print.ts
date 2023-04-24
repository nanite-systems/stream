import { format } from 'winston';
import stringify from 'safe-stable-stringify';
import { Format } from 'logform';

export function prettyPrint(): Format {
  return format.printf((log) => {
    let msg = `${log.timestamp} ${log.level}\t`;

    if (log.context) msg += `[${log.context}] `;

    msg += `${log.message}`;

    if (log.metadata) msg += ` ${stringify(log.metadata)}`;

    return msg;
  });
}
