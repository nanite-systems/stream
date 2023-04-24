import { REQUEST } from '@nestjs/core';

export const BASE_STREAM = Symbol('provider:base_stream');
export const CENSUS_STREAM = Symbol('provide:census_stream');

export const WS_REQUEST = REQUEST;

export const SESSION_ID = Symbol('provide:session_id');
