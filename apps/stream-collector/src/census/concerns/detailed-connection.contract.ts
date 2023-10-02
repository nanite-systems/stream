import { ConnectionDetails } from '../utils/connection-details';
import { ConnectionContract } from './connection.contract';

export interface DetailedConnectionContract {
  details: ConnectionDetails;
  connection: ConnectionContract;
}
