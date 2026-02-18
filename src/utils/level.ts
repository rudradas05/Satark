import { palette } from '../theme/tokens';
import { ThreatLevel } from '../types/message';

export interface LevelMeta {
  label: string;
  color: string;
  tint: string;
}

export const levelMap: Record<ThreatLevel, LevelMeta> = {
  safe: {
    label: 'Safe',
    color: palette.safe,
    tint: 'rgba(46, 216, 161, 0.16)',
  },
  suspicious: {
    label: 'Suspicious',
    color: palette.suspicious,
    tint: 'rgba(246, 178, 78, 0.16)',
  },
  spam: {
    label: 'Spam',
    color: palette.spam,
    tint: 'rgba(255, 99, 99, 0.16)',
  },
};
