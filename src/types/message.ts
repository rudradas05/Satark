export type ThreatLevel = 'safe' | 'suspicious' | 'spam';

export interface MessageRecord {
  id: string;
  sender: string;
  preview: string;
  body: string;
  receivedAt: string;
  level: ThreatLevel;
  riskScore: number;
  confidence: number;
  reasons: string[];
  hasLink: boolean;
}

export type RuleSeverity = 'low' | 'medium' | 'high';

export interface KeywordRule {
  id: string;
  keyword: string;
  severity: RuleSeverity;
  enabled: boolean;
}

export interface DashboardStats {
  totalScanned: number;
  safeCount: number;
  suspiciousCount: number;
  spamCount: number;
  blockedSenders: number;
  riskIndex: number;
}
