import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {
  LogOut,
  Layers,
  Sparkles,
  Trophy,
  RotateCw,
  Check,
} from 'lucide-react-native';
import { CardView, Deck, Timer, JokerDisplay, PlayerChip } from '@/src/components/game';
import { GradientButton, IconButton, Toast } from '@/src/components/ui';
import { WinnerModal, LeaveRoomModal } from '@/src/components/modals';
import { colors, typography, spacing, radius, shadows } from '@/src/theme';
import { useGameStore, useRoomStore, useAuthStore } from '@/src/store';
import { useToast, useHaptics, useCountdown } from '@/src/hooks';
import { TURN_DURATION_SECONDS } from '@/src/constants';
import type { PlayingCard, Player } from '@/src/types';

const { width: screenWidth } = Dimensions.get('window');

export default function GameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { trigger, notify } = useHaptics();

  const game = useGameStore();
  const room = useRoomStore((s) => s.room);
  const user = useAuthStore((s) => s.user);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  const { seconds, start, restart } = useCountdown(TURN_DURATION_SECONDS, () => {
    showToast('Time up! Turn passed.', 'error');
  });

  // Initialize game
  useEffect(() => {
    if (room && room.players.length > 0 && game.players.length === 0) {
      game.initGame(room.players);
      start();
    }
  }, [room]);

  // Timer auto-restart on turn change
  useEffect(() => {
    if (game.currentTurn) {
      restart();
    }
  }, [game.currentTurn, restart]);

  // Simulate other players' turns
  useEffect(() => {
    if (!game.currentTurn || game.status !== 'in-progress') return;
    const currentPlayer = game.players.find((p) => p.id === game.currentTurn);
    if (!currentPlayer || currentPlayer.userId === user?.id) return;

    const timer = setTimeout(() => {
      const nextIndex = (game.players.findIndex((p) => p.id === game.currentTurn) + 1) % game.players.length;
      game.setTurn(game.players[nextIndex]?.id ?? '');
    }, 3000);

    return () => clearTimeout(timer);
  }, [game.currentTurn, game.players, game.status, user?.id]);

  const handleCardPress = useCallback((card: PlayingCard) => {
    trigger('light');
    setSelectedCardIds((prev) =>
      prev.includes(card.id)
        ? prev.filter((id) => id !== card.id)
        : [...prev, card.id]
    );
  }, [trigger]);

  const handleDrawCard = useCallback(() => {
    trigger('medium');
    game.drawCard();
    showToast('Card drawn', 'success');
  }, [trigger, game, showToast]);

  const handleDiscard = useCallback(() => {
    if (selectedCardIds.length === 0) {
      showToast('Select a card to discard', 'error');
      return;
    }
    trigger('medium');
    game.discardCard(selectedCardIds[0]);
    setSelectedCardIds([]);
    const nextIndex = (game.players.findIndex((p) => p.id === game.currentTurn) + 1) % game.players.length;
    game.setTurn(game.players[nextIndex]?.id ?? '');
  }, [selectedCardIds, trigger, game, showToast]);

  const handleSort = useCallback(() => {
    trigger('light');
    game.sortHand();
    showToast('Cards sorted', 'info');
  }, [trigger, game, showToast]);

  const handleDeclare = useCallback(() => {
    trigger('medium');
    notify('success');
    const winner = game.players[0];
    game.setWinner(winner);
    setShowWinner(true);
  }, [trigger, notify, game]);

  const handlePlayAgain = useCallback(() => {
    setShowWinner(false);
    game.reset();
    if (room?.players) {
      game.initGame(room.players);
    }
  }, [game, room]);

  const handleExit = useCallback(() => {
    setShowWinner(false);
    game.reset();
    router.replace('/(app)/home');
  }, [game, router]);

  const isMyTurn = game.currentTurn === game.players.find((p) => p.userId === user?.id)?.id;

  // Calculate fan angles for hand cards
  const handCount = game.hand.length;
  const maxFanAngle = Math.min(20, handCount * 2);
  const angleStep = handCount > 1 ? maxFanAngle / (handCount - 1) : 0;
  const startAngle = -maxFanAngle / 2;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A6B3A', '#14532D', '#0F5132']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1}}
        style={styles.tableBg}
      >
        <View style={styles.tableOverlay}>
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <View style={styles.topBarLeft}>
              <IconButton
                icon={<LogOut size={18} color={colors.textSecondary} />}
                onPress={() => setShowLeaveModal(true)}
                size={40}
              />
              <View style={styles.roundBadge}>
                <Text style={styles.roundLabel}>Round</Text>
                <Text style={styles.roundValue}>{game.round}</Text>
              </View>
            </View>
            <View style={styles.topBarCenter}>
              <Text style={styles.tableTitle}>{room?.name ?? 'Game Table'}</Text>
              <Text style={styles.tableSub}>
                {game.status === 'in-progress' ? 'In Progress' : game.status}
              </Text>
            </View>
            <View style={styles.topBarRight}>
              <Timer seconds={seconds} total={TURN_DURATION_SECONDS} />
            </View>
          </View>

          <View style={styles.opponentsArea}>
            {game.players
              .filter((p) => p.userId !== user?.id)
              .slice(0, 3)
              .map((player, index) => {
                const positions = [
                  { top: 10, left: screenWidth / 2 - 70 },
                  { top: 80, left: 20 },
                  { top: 80, right: 20 },
                ];
                const pos = positions[index] ?? positions[0];
                return (
                  <View
                    key={player.id}
                    style={[styles.opponentChip, { ...pos }]}
                  >
                    <PlayerChip
                      player={player}
                      isCurrentTurn={game.currentTurn === player.id}
                      size="sm"
                    />
                    <View style={styles.opponentCards}>
                      {Array.from({ length: Math.min(player.cardsCount, 5) }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.miniCard,
                            { marginLeft: i === 0 ? 0 : -12 },
                          ]}
                        >
                          <CardView
                            card={{ id: `back_${i}`, rank: 'A', suit: 'spades' }}
                            faceDown
                            size="sm"
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
          </View>

          <View style={styles.centerArea}>
            <View style={styles.centerRow}>
              <Deck count={game.deckCount} onPress={isMyTurn ? handleDrawCard : undefined} />
              <View style={styles.discardArea}>
                <Text style={styles.discardLabel}>Discard</Text>
                <View style={styles.discardPile}>
                  {game.discardPile.slice(-3).map((card, index) => (
                    <View
                      key={card.id}
                      style={{
                        position: 'absolute',
                        top: index * 4,
                        left: index * 4,
                      }}
                    >
                      <CardView card={card} size="sm" />
                    </View>
                  ))}
                </View>
              </View>
              <JokerDisplay joker={game.joker} />
            </View>
          </View>

          <View style={styles.myArea}>
            <View style={styles.myInfoRow}>
              <PlayerChip
                player={game.players.find((p) => p.userId === user?.id) ?? game.players[0]}
                isCurrentTurn={isMyTurn}
                size="md"
              />
              <View style={styles.myActions}>
                <Pressable onPress={handleSort} style={styles.miniAction}>
                  <Layers size={16} color={colors.gold} />
                  <Text style={styles.miniActionText}>Sort</Text>
                </Pressable>
                <Pressable
                  onPress={handleDeclare}
                  style={[styles.miniAction, styles.declareAction]}
                >
                  <Trophy size={16} color="#1A1A1A" />
                  <Text style={[styles.miniActionText, { color: '#1A1A1A' }]}>Declare</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.handContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.handScroll}
              >
                {game.hand.map((card, index) => {
                  const isSelected = selectedCardIds.includes(card.id);
                  const fanAngle = handCount > 1 ? startAngle + angleStep * index : 0;
                  return (
                    <View
                      key={card.id}
                      style={{
                        marginLeft: index === 0 ? 0 : -16,
                        marginTop: isSelected ? -20 : 0,
                      }}
                    >
                      <CardView
                        card={card}
                        size="md"
                        selected={isSelected}
                        onPress={isMyTurn ? handleCardPress : undefined}
                        fanAngle={0}
                      />
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            <View style={[styles.actionBar, { paddingBottom: insets.bottom + 12 }]}>
              <GradientButton
                label="Draw Card"
                onPress={handleDrawCard}
                variant="green"
                disabled={!isMyTurn}
                size="md"
                icon={<Sparkles size={18} color="#FFFFFF" />}
              />
              <GradientButton
                label="Discard"
                onPress={handleDiscard}
                variant="gold"
                disabled={!isMyTurn || selectedCardIds.length === 0}
                size="md"
                icon={<RotateCw size={18} color="#1A1A1A" />}
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      <WinnerModal
        visible={showWinner}
        winner={game.winner}
        onClose={() => setShowWinner(false)}
        onPlayAgain={handlePlayAgain}
        onExit={handleExit}
      />
      <LeaveRoomModal
        visible={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={() => {
          setShowLeaveModal(false);
          game.reset();
          router.replace('/(app)/home');
        }}
        title="Leave Game?"
        message="Leaving mid-game will count as a forfeit. Are you sure?"
      />
      <Toast
        message={toast?.message ?? ''}
        type={toast?.type}
        visible={toast?.visible ?? false}
        onHide={hideToast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableBg: {
    flex: 1,
  },
  tableOverlay: {
    flex: 1,
    position: 'relative',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topBarCenter: {
    alignItems: 'center',
  },
  topBarRight: {},
  tableTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tableSub: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'capitalize',
  },
  roundBadge: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.2)',
  },
  roundLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 9,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  roundValue: {
    fontFamily: 'Sora-Bold',
    fontSize: 14,
    fontWeight: '700',
    color: colors.gold,
  },
  opponentsArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  opponentChip: {
    position: 'absolute',
    alignItems: 'center',
    gap: 6,
  },
  opponentCards: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniCard: {},
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 160,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  discardArea: {
    alignItems: 'center',
    gap: 4,
  },
  discardLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  discardPile: {
    position: 'relative',
    width: 48,
    height: 68,
  },
  myArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(7, 26, 18, 0.85)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  myInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  myActions: {
    flexDirection: 'row',
    gap: 8,
  },
  miniAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  declareAction: {
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
    borderColor: 'rgba(250, 204, 21, 0.2)',
  },
  miniActionText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 13,
    color: colors.gold,
    fontWeight: '700',
  },
  handContainer: {
    paddingVertical: 8,
    minHeight: 80,
  },
  handScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
});
