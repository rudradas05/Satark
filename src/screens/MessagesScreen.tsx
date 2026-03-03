import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { AppBackground } from '../components/AppBackground';
import { FilterChips, MessageFilter } from '../components/FilterChips';
import { MessageCard } from '../components/MessageCard';
import { SecurityHeader } from '../components/SecurityHeader';
import { MessagesStackParamList } from '../navigation/types';
import { useMessageState } from '../state/MessageState';
import { useTheme } from '../state/ThemeState';
import {
  radii,
  shadow,
  spacing,
  themedBorder,
  typography,
} from '../theme/tokens';
import { MessageRecord } from '../types/message';

type Props = NativeStackScreenProps<MessagesStackParamList, 'MessageList'>;

function filterTone(
  filter: MessageFilter,
): 'safe' | 'suspicious' | 'spam' | 'neutral' {
  if (filter === 'spam') return 'spam';
  if (filter === 'suspicious') return 'suspicious';
  if (filter === 'safe') return 'safe';
  return 'neutral';
}

export function MessagesScreen({ navigation }: Props) {
  const { messages } = useMessageState();
  const { palette, mode } = useTheme();
  const isDark = mode === 'dark';
  const border = themedBorder(isDark);
  const [filter, setFilter] = useState<MessageFilter>('all');
  const insets = useSafeAreaInsets();

  const filteredMessages = useMemo(() => {
    const sorted = [...messages].sort(
      (a, b) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
    );

    if (filter === 'all') return sorted;
    return sorted.filter(message => message.level === filter);
  }, [filter, messages]);

  const filterCounts = useMemo(
    () => ({
      all: messages.length,
      spam: messages.filter(m => m.level === 'spam').length,
      suspicious: messages.filter(m => m.level === 'suspicious').length,
      safe: messages.filter(m => m.level === 'safe').length,
    }),
    [messages],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: MessageRecord; index: number }) => (
      <MessageCard
        message={item}
        delay={0}
        onPress={() =>
          navigation.navigate('MessageDetail', { messageId: item.id })
        }
      />
    ),
    [navigation],
  );

  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      <AppBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <FlatList
          data={filteredMessages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + spacing['2xl'] },
          ]}
          // Perf optimizations
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
          updateCellsBatchingPeriod={50}
          ListHeaderComponent={
            <View style={styles.headerWrap}>
              <SecurityHeader
                subtitle="SMS Intelligence Feed"
                title="Scanned Messages"
                statusTone={filterTone(filter)}
                statusLabel={
                  filter === 'all'
                    ? 'All levels'
                    : filter === 'safe'
                    ? 'Safe only'
                    : filter === 'suspicious'
                    ? 'Suspicious only'
                    : 'Spam only'
                }
              />
              <FilterChips
                selected={filter}
                onSelect={setFilter}
                counts={filterCounts}
              />
            </View>
          }
          ListEmptyComponent={
            <View
              style={[
                styles.emptyCard,
                {
                  borderColor: border,
                  backgroundColor: palette.surface,
                },
              ]}
            >
              <Text style={[styles.emptyTitle, { color: palette.textPrimary }]}>
                No messages found
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: palette.textSecondary }]}
              >
                New messages will appear as soon as the scanner ingests data.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // IMPORTANT: list padding should match FilterChips horizontal padding
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  headerWrap: {
    paddingHorizontal: spacing.md,
  },

  emptyCard: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    ...shadow.card,
  },
  emptyTitle: {
    fontFamily: typography.headingFamily,
    fontSize: typography.h3,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontFamily: typography.bodyFamily,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: Math.round(typography.body * typography.lhRelaxed),
  },
});
