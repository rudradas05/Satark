import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { initialKeywordRules, mockMessages } from '../data/mockMessages';
import { DashboardStats, KeywordRule, MessageRecord } from '../types/message';

interface MessageStateValue {
  messages: MessageRecord[];
  blocklist: string[];
  keywordRules: KeywordRule[];
  autoBlockEnabled: boolean;
  strictModeEnabled: boolean;
  stats: DashboardStats;

  markMessageSafe: (id: string) => void;
  reportMessageSpam: (id: string) => void;

  toggleSenderBlock: (sender: string) => void;
  toggleKeywordRule: (ruleId: string) => void;

  setAutoBlockEnabled: (enabled: boolean) => void;
  setStrictModeEnabled: (enabled: boolean) => void;

  // handy for dev/testing
  resetDemoData: () => void;
}

const MessageStateContext = createContext<MessageStateValue | undefined>(
  undefined,
);

function updateById(
  messages: MessageRecord[],
  messageId: string,
  updater: (message: MessageRecord) => MessageRecord,
) {
  let changed = false;
  const next = messages.map(message => {
    if (message.id !== messageId) return message;
    changed = true;
    return updater(message);
  });
  return changed ? next : messages;
}

export function MessageStateProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<MessageRecord[]>(mockMessages);
  const [blocklist, setBlocklist] = useState<string[]>(['TX-NETPAY']);
  const [keywordRules, setKeywordRules] =
    useState<KeywordRule[]>(initialKeywordRules);
  const [autoBlockEnabled, setAutoBlockEnabled] = useState(true);
  const [strictModeEnabled, setStrictModeEnabled] = useState(false);

  const toggleSenderBlock = useCallback((sender: string) => {
    setBlocklist(current =>
      current.includes(sender)
        ? current.filter(item => item !== sender)
        : [sender, ...current],
    );
  }, []);

  const toggleKeywordRule = useCallback((ruleId: string) => {
    setKeywordRules(current =>
      current.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    );
  }, []);

  const markMessageSafe = useCallback((id: string) => {
    setMessages(current =>
      updateById(current, id, message => ({
        ...message,
        level: 'safe',
        riskScore: Math.min(message.riskScore, 20),
        reasons: ['Reviewed by analyst and marked safe'],
      })),
    );
  }, []);

  const reportMessageSpam = useCallback(
    (id: string) => {
      let senderToAutoblock: string | null = null;

      setMessages(current =>
        updateById(current, id, message => {
          senderToAutoblock = message.sender;
          return {
            ...message,
            level: 'spam',
            riskScore: Math.max(message.riskScore, 90),
            reasons: Array.from(
              new Set(['User-reported spam', ...message.reasons]),
            ).slice(0, 3),
          };
        }),
      );

      // Auto-block sender if enabled
      if (autoBlockEnabled && senderToAutoblock) {
        setBlocklist(current =>
          current.includes(senderToAutoblock!)
            ? current
            : [senderToAutoblock!, ...current],
        );
      }
    },
    [autoBlockEnabled],
  );

  const stats = useMemo<DashboardStats>(() => {
    let safeCount = 0;
    let suspiciousCount = 0;
    let spamCount = 0;
    let sumRisk = 0;

    for (const m of messages) {
      sumRisk += m.riskScore;
      if (m.level === 'safe') safeCount += 1;
      else if (m.level === 'suspicious') suspiciousCount += 1;
      else spamCount += 1;
    }

    const totalScanned = messages.length;
    const riskIndex = Math.round(sumRisk / Math.max(totalScanned, 1));

    return {
      totalScanned,
      safeCount,
      suspiciousCount,
      spamCount,
      blockedSenders: blocklist.length,
      riskIndex,
    };
  }, [messages, blocklist.length]);

  const resetDemoData = useCallback(() => {
    setMessages(mockMessages);
    setBlocklist(['TX-NETPAY']);
    setKeywordRules(initialKeywordRules);
    setAutoBlockEnabled(true);
    setStrictModeEnabled(false);
  }, []);

  const value = useMemo<MessageStateValue>(
    () => ({
      messages,
      blocklist,
      keywordRules,
      autoBlockEnabled,
      strictModeEnabled,
      stats,
      markMessageSafe,
      reportMessageSpam,
      toggleSenderBlock,
      toggleKeywordRule,
      setAutoBlockEnabled,
      setStrictModeEnabled,
      resetDemoData,
    }),
    [
      messages,
      blocklist,
      keywordRules,
      autoBlockEnabled,
      strictModeEnabled,
      stats,
      markMessageSafe,
      reportMessageSpam,
      toggleSenderBlock,
      toggleKeywordRule,
      resetDemoData,
    ],
  );

  return (
    <MessageStateContext.Provider value={value}>
      {children}
    </MessageStateContext.Provider>
  );
}

export function useMessageState() {
  const context = useContext(MessageStateContext);
  if (!context) {
    throw new Error('useMessageState must be used inside MessageStateProvider');
  }
  return context;
}
