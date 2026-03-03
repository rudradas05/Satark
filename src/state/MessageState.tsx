import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { initialKeywordRules } from '../data/mockMessages';
import {
  DashboardStats,
  KeywordRule,
  MessageRecord,
  ThreatLevel,
} from '../types/message';
import { RawSmsEvent } from '../utils/smsInterceptor';

/** Convert an intercepted SMS into a MessageRecord with "pending" classification. */
function smsToRecord(event: RawSmsEvent): MessageRecord {
  const hasLink = /https?:\/\/|www\./i.test(event.body);
  return {
    id: `sms-${event.timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    sender: event.sender,
    preview:
      event.body.length > 80 ? event.body.slice(0, 77) + '...' : event.body,
    body: event.body,
    receivedAt: new Date(event.timestamp).toISOString(),
    level: 'suspicious', // default until model classifies it
    riskScore: 50,
    confidence: 0,
    reasons: ['Pending analysis'],
    hasLink,
  };
}

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

  /** Ingest a real intercepted SMS into the message list. Returns the record id. */
  addInterceptedSms: (event: RawSmsEvent) => string;

  /** Update a message with model classification results. */
  classifyMessage: (
    id: string,
    level: ThreatLevel,
    riskScore: number,
    confidence: number,
    reasons: string[],
  ) => void;

  /** Load previously saved messages from the backend database. */
  loadMessages: (savedMessages: MessageRecord[]) => void;

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
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [blocklist, setBlocklist] = useState<string[]>([]);
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

  const addInterceptedSms = useCallback((event: RawSmsEvent): string => {
    const record = smsToRecord(event);
    setMessages(current => [record, ...current]);
    return record.id;
  }, []);

  const classifyMessage = useCallback(
    (
      id: string,
      level: ThreatLevel,
      riskScore: number,
      confidence: number,
      reasons: string[],
    ) => {
      setMessages(current =>
        updateById(current, id, msg => ({
          ...msg,
          level,
          riskScore,
          confidence,
          reasons,
        })),
      );

      // Auto-block spam senders if enabled
      if (level === 'spam' && autoBlockEnabled) {
        setMessages(current => {
          const msg = current.find(m => m.id === id);
          if (msg) {
            setBlocklist(bl =>
              bl.includes(msg.sender) ? bl : [msg.sender, ...bl],
            );
          }
          return current;
        });
      }
    },
    [autoBlockEnabled],
  );

  const loadMessages = useCallback((savedMessages: MessageRecord[]) => {
    setMessages(current => {
      // Merge: keep any real-time intercepted messages, add DB messages that aren't already shown
      const existingIds = new Set(current.map(m => m.id));
      const newFromDb = savedMessages.filter(m => !existingIds.has(m.id));
      return [...current, ...newFromDb];
    });
  }, []);

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
    setMessages([]);
    setBlocklist([]);
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
      addInterceptedSms,
      classifyMessage,
      loadMessages,
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
      addInterceptedSms,
      classifyMessage,
      loadMessages,
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
