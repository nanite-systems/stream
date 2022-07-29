import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';

export interface ConnectionContract {
  onConnected?: (client: WebSocket, request: IncomingMessage) => void;
  onDisconnected?: (client: WebSocket) => void;
}
