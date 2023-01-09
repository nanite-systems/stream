export const NSS_SERVICE_CONFIG = Symbol('provide:nss_service_config');

export const NSS_PS2_CLIENT = Symbol('provide:nss_ps2_client');
export const NSS_PS2PS4EU_CLIENT = Symbol('provide:nss_ps2ps4eu_client');
export const NSS_PS2PS4US_CLIENT = Symbol('provide:nss_ps2ps4us_client');

export enum NSS_COMMANDS {
  recentCharacters = 'recent_characters',
  recentCharacterCount = 'recent_character_count',
  serviceStates = 'service_states',
}
