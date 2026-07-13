import { StyleSheet, Platform, Dimensions } from "react-native";
import { C } from '../constants/colors';

const { width, height } = Dimensions.get('window');

// ─── Styles ───────────────────────────────────────────────────────────────────
export const S = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: C.bg,
    },
  
    // ── Navigation ──
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 44 : 20,
      paddingBottom: 8,
    },
  
    topBarCompact: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 42 : 18,
      paddingBottom: 4,
      marginBottom: 20,
    },
  
    bottomNav: {
      position: 'absolute',
      bottom: 18,
      left: 18,
      right: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(18,20,38,0.96)',
      borderRadius: 26,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
      paddingVertical: 8,
      paddingHorizontal: 10,
      shadowColor: '#000',
      shadowOpacity: 0.22,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      elevation: 20,
    },
    
    bottomNavItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    bottomIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 7 ,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    bottomNavLabel: {
      marginTop: 3,
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: C.mutedDim,
    },
  
  
    // ── Cards ──
    card: {
      backgroundColor: C.bgCard,
      borderWidth: 1,
      borderColor: C.borderSub,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 20,
    },
  
    cardGlow: {
      backgroundColor: C.bgCard,
      borderWidth: 1,
      borderColor: 'rgba(123,97,255,0.22)',
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 20,
      shadowColor: C.primary,
      shadowOpacity: 0.12,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 0 },
    },
  
    cardRed: {
      backgroundColor: '#1a0e1e',
      borderWidth: 1,
      borderColor: 'rgba(224,62,62,0.35)',
      borderRadius: 16,
      padding: 18,
      shadowColor: C.red,
      shadowOpacity: 0.2,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 0 },
    },
  
    // ── Dialogue bubble ──
    bubble: {
      borderLeftWidth: 3,
      borderWidth: 1,
      borderRadius: 16,
      borderTopLeftRadius: 4,
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
  
    speechTail: {
      width: 0,
      height: 0,
      borderLeftWidth: 12,
      borderRightWidth: 12,
      borderBottomWidth: 14,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      marginBottom: -1,
      marginTop: 8,
    },
  
  
    // ── Inputs ──
    input: {
      backgroundColor: C.bgLow,
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 15,
      color: C.onSurface,
      fontSize: 16,
      marginHorizontal: 20,
    },
  
  
    // ── Setup Screen Cards ──
    durationCard: {
      flex: 1,
      height: 62,
      borderRadius: 16,
      backgroundColor: C.bgCard,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.borderSub,
    },
  
    personalityCard: {
      width: '47%',
      padding: 18,
      borderRadius: 24,
      backgroundColor: C.bgCard,
      borderWidth: 1,
      borderColor: C.borderSub,
    },
  

    // ── Loading Overlay Styles ──
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(8,10,20,0.96)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
  
    loadingGlow: {
      position: 'absolute',
      width: 380,
      height: 380,
      borderRadius: 999,
    },
  
    loadingCard: {
      width: '86%',
      borderRadius: 34,
      paddingVertical: 34,
      paddingHorizontal: 26,
      alignItems: 'center',
      backgroundColor: '#171D2B',
      borderWidth: 1,
      shadowOpacity: 0.22,
      shadowRadius: 30,
      shadowOffset: {
        width: 0,
        height: 14,
      },
      elevation: 20,
    },

    loadingCardGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 34,
      opacity: 1,
    },
  
    loadingPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginBottom: 24,
      borderRadius: 999,
      borderWidth: 1,
    },
  
    loadingPillText: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.5,
    },
  
    loadingTitle: {
      color: C.white,
      fontSize: 18,
      fontWeight: '900',
      textAlign: 'center',
      marginTop: 18,
      letterSpacing: 0.5,
    },
  
    loadingSubtitle: {
      color: C.muted,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 22,
      marginTop: 12,
      paddingHorizontal: 16,
    },
  
    loadingDotsWrap: {
      marginTop: 28,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
  
    loadingDotsText: {
      fontWeight: '700',
      letterSpacing: 1,
    },
  
  
    // ── Buttons ──
    primaryBtn: {
      height: 58,
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginHorizontal: 20,
      marginTop: 20,
      shadowOpacity: 0.45,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
    },
  
    surrenderBtn: {
      width: '100%',
      height: 72,
      borderRadius: 28,
      borderWidth: 2,
      borderColor: '#FF5A73',
      backgroundColor: 'rgba(255,60,90,0.08)',
      marginTop: 16,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
  
    focusQuitBtn: {
      height: 58,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: 'rgba(255,90,115,0.25)',
      backgroundColor: 'rgba(255,60,90,0.08)',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    ghostBtn: {
      paddingHorizontal: 28,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: C.border,
    },
  
  
    // ── Weakness Screen Styles ──
    weaknessBanner: {
      width: '100%',
      backgroundColor: '#B10016',
      borderBottomWidth: 2,
      borderBottomColor: '#6B000E',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop:
        Platform.OS === 'ios'
          ? 56
          : 42,
      paddingBottom: 18,
      shadowColor: '#ff0026',
      shadowOpacity: 0.4,
      shadowRadius: 30,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 20,
    },
  
    warningPill: {
      backgroundColor: '#34161B',
      borderWidth: 2,
      borderColor: '#FF506B',
      borderRadius: 18,
      paddingVertical: 6,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      shadowColor: '#ff3355',
      shadowOpacity: 0.35,
      shadowRadius: 18,
      elevation: 14,
      position: 'relative',
    },
    
    warningText: {
      color: C.red,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1,
    },
    
    resumeBtn: {
      height: 58,
      borderRadius: 24,
      backgroundColor: C.primary,
      width: '100%',
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
  
    // ── Victory Screen Styles ──
    // victoryTopBanner: {
    //   width: '100%',
    //   backgroundColor: '#00D97E',
    //   borderBottomWidth: 2,
    //   borderBottomColor: '#00A962',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   paddingTop: Platform.OS === 'ios' ? 58 : 44,
    //   paddingBottom: 22,
    //   shadowColor: '#00FF88',
    //   shadowOpacity: 0.35,
    //   shadowRadius: 30,
    //   shadowOffset: {
    //     width: 0,
    //     height: 8,
    //   },
    //   elevation: 20,
    // },
  
    bannerBase: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop:
        Platform.OS === 'ios'
          ? 58
          : 44,
      paddingBottom: 22,
      borderBottomWidth: 2,
      elevation: 20,
      shadowOpacity: 0.35,
      shadowRadius: 30,
      shadowOffset: {
        width: 0,
        height: 8,
      },
    },
  
    victoryBanner: {
      backgroundColor: '#00D97E',
      borderBottomColor: '#00A962',
      shadowColor: '#00FF88',
    },
    
    defeatBanner: {
      backgroundColor: '#A72837',
      borderBottomColor: '#7A1F2C',
      shadowColor: '#FF506B',
    },
    
    victoryCard: {
      backgroundColor: '#18262B',
      borderWidth: 1,
      borderColor: 'rgba(0,255,136,0.22)',
      borderRadius: 24,
      padding: 22,
      shadowColor: '#00FF88',
      shadowOpacity: 0.15,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
    
    victoryStatTile: {
      width: '31.5%',
      // minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#171D2B',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
      paddingHorizontal: 8,
      paddingVertical: 10,
      shadowColor: '#000',
      shadowOpacity: 0.14,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      elevation: 5,
    },
    
    victoryStatIconWrap: {
      width: 30,
      height: 30,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(123,97,255,0.12)',
      marginRight: 8,
    },
    
    victoryStatTitle: {
      color: 'rgba(255,255,255,0.58)',
      fontSize: 10,
      fontWeight: '700',
      // letterSpacing: 0.3,
    },
    
    victoryStatNumber: {
      color: '#fff',
      fontWeight: '900',
      fontSize: 15,
      marginTop: 2,
    },
  
    // ── Stats Screen Styles ──
    statsSection: {
      width: '90%',
      alignSelf: 'center',
      marginTop: 24,
    },
  
    statsCard: {
      width: '90%',
      alignSelf: 'center',
      backgroundColor: '#171D2B',
      borderRadius: 28,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      padding: 22,
      marginTop: 18,
    },
  
    statsHeroCard: {
      width: '90%',
      alignSelf: 'center',
      marginTop: 18,
      backgroundColor: '#171D2B',
      borderRadius: 32,
      padding: 24,
      borderWidth: 1,
      // shadowColor: '#7B61FF',
      shadowOpacity: 0.18,
      shadowRadius: 22,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      elevation: 10,
    },
  
    rankOrb: {
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    heroMetricLabel: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.6,
    },
  
    heroMetricValue: {
      color: C.white,
      fontSize: 20,
      fontWeight: '900',
      marginTop: 6,
    },
  
    sectionTitle: {
      color: C.white,
      fontSize: 18,
      fontWeight: '800',
    },
  
    bigMetric: {
      color: C.white,
      fontSize: 34,
      fontWeight: '900',
      marginTop: 4,
    },
  
    /* analytics */
    analyticsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 16,
    },
  
    analyticsTile: {
      width: '48%',
      backgroundColor: '#171D2B',
      borderRadius: 22,
      paddingVertical: 20,
      alignItems: 'center',
      marginBottom: 14,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
    },
  
    analyticsIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    analyticsValue: {
      color: C.white,
      fontSize: 22,
      fontWeight: '900',
      marginTop: 12,
    },
  
    analyticsLabel: {
      color: C.muted,
      fontSize: 12,
      marginTop: 4,
    },
  
    /* graphs */
    graphRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginTop: 24,
    },
  
    graphBar: {
      width: 20,
      borderRadius: 999,
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
    
    graphBarFocus: {
      width: 10,
      borderRadius: 5,
    },
    
    graphBarSlip: {
      width: 10,
      borderRadius: 999,
      backgroundColor: '#FF6B7A',
    },
    
    graphCol: {
      alignItems: 'center',
      flex: 1,
      minHeight: 110,
      justifyContent: 'flex-end',
    },
  
    graphDay: {
      color: C.muted,
      fontSize: 11,
      marginTop: 10,
    },
  
    /* achievements */
    achievementGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
  
    achievementCard: {
      width: width < 380 ? '48%' : '31%',
      aspectRatio: 1,
      borderRadius: 24,
      backgroundColor: '#171D2B',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
      overflow: 'hidden',
    },
  
    achievementIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
  
    achievementTitle: {
      color: '#6A6E92',
      fontSize: 11,
      fontWeight: '700',
      textAlign: 'center',
      marginTop: 10,
      paddingHorizontal: 8,
    },
  
    achievementDesc: {
      color: 'rgba(255,255,255,0.42)',
      fontSize: 9,
      textAlign: 'center',
      marginTop: 4,
      lineHeight: 12,
    },
  
    lockedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10,10,25,0.35)',
    },
  
    defendBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(255,184,77,0.1)',
      borderRadius: 999,
      paddingHorizontal: 6,
      paddingVertical: 4,
    },

    // Settings Screen
    dangerButton: {
      height: 56,
      borderRadius: 28,
      backgroundColor: '#2A0710',
    
      borderWidth: 1,
    
      borderColor:
        'rgba(255,60,90,0.35)',
    
      justifyContent: 'center',
    
      alignItems: 'center',
    
      shadowColor: '#FF3355',
    
      shadowOpacity: 0.25,
    
      shadowRadius: 20,
    },

    settingsHero: {
      alignItems: 'center',
      marginBottom: 24,
    },
    
    settingsHeroTitle: {
      color: C.white,
      fontSize: 32,
      fontWeight: '900',
      letterSpacing: 3,
    },
    
    settingsCard: {
      width: '90%',
      alignSelf: 'center',
      marginTop: 18,
    
      backgroundColor: '#171D2B',
    
      borderRadius: 30,
    
      borderWidth: 1,
    
      borderColor:
        'rgba(255,255,255,0.05)',
    
      padding: 22,    
      shadowOpacity: 0.08,
    
      shadowRadius: 20,
    
      shadowOffset: {
        width: 0,
        height: 10,
      },
    
      elevation: 8,
    },
    
    settingsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    
    settingsHeaderText: {
      color: C.white,
      marginLeft: 10,
      fontWeight: '800',
      letterSpacing: 1,
    },
    
    settingLabel: {
      color: C.muted,
      fontSize: 11,
      marginTop: 8,
      marginBottom: 5,
    },
    
    colorRow: {
      flexDirection: 'row',
      marginTop: 20,
    },
    
    colorCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 14,
    },
    
    archiveNumber: {
      color: C.white,
      fontSize: 52,
      fontWeight: '900',
      textAlign: 'center',
      marginTop: 8,
    },
    
    archiveTitle: {
      color: C.muted,
      fontSize: 12,
      letterSpacing: 2,
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 24,
    },
    
    lastMissionCard: {
      backgroundColor: '#1D2333',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      padding: 18,
    },
    
    lastMissionLabel: {
      color: C.muted,
      fontSize: 11,
      letterSpacing: 1.2,
      marginBottom: 8,
    },
    
    lastMissionTask: {
      color: C.white,
      fontSize: 18,
      fontWeight: '800',
    },
    
    lastMissionMeta: {
      color: C.muted,
      fontSize: 12,
      marginTop: 10,
    },

    archiveButton: {
      marginTop: 18,
      height: 50,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
    },
    
    archiveButtonText: {
      fontWeight: '800',
      letterSpacing: 1,
    },

    // syncCard: {
    //   width: '90%',
    //   alignSelf: 'center',
    //   marginTop: 18,
    
    //   backgroundColor: '#171D2B',
    
    //   borderRadius: 30,
    
    //   borderWidth: 1,
    
    //   borderColor:
    //     'rgba(123,97,255,0.12)',
    
    //   paddingVertical: 28,
    
    //   alignItems: 'center',
    
    //   shadowColor: '#7B61FF',
    
    //   shadowOpacity: 0.12,
    
    //   shadowRadius: 18,
    
    //   elevation: 8,
    // },
    
    // syncTitle: {
    //   color: C.white,
    //   fontWeight: '800',
    //   letterSpacing: 1,
    // },

    // syncLeft: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   gap: 14,
    // },
    
    // syncDescription: {
    //   color: C.muted,
    //   fontSize: 11,
    //   marginTop: 4,
    // },

    quickActionCard: {
      width: '48%',
    
      height: 120,
    
      backgroundColor: '#171D2B',
    
      borderRadius: 26,
    
      borderWidth: 1,
    
      borderColor: 'rgba(255,255,255,0.05)',
    
      justifyContent: 'center',
    
      alignItems: 'center',
    
      shadowOpacity: 0.12,
    
      shadowRadius: 18,
    
      elevation: 8,
    },
    
    quickActionTitle: {
      color: C.white,
      fontWeight: '800',
      marginTop: 12,
    },
    
    quickActionSubtitle: {
      color: C.muted,
      fontSize: 11,
      marginTop: 4,
    },
    
    comingSoonBadge: {
      position: 'absolute',
    
      top: 12,
    
      right: 12,
    
      borderRadius: 999,
    
      paddingHorizontal: 8,
    
      paddingVertical: 4,
    },
    
    comingSoonText: {
      color: '#fff',
      fontSize: 9,
      fontWeight: '800',
    },

    overseerFile: {
      width: '90%',
      alignSelf: 'center',
      marginTop: 18,
      backgroundColor: '#171D2B',
      borderRadius: 30,
      padding: 26,
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,0.05)',
      shadowOpacity: 0.12,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      elevation: 8,
    },
    
    fileLabel: {
      fontSize: 11,
      letterSpacing: 2,
      fontWeight: '700',
    },
    
    fileTitle: {
      color: C.white,
      fontSize: 24,
      fontWeight: '900',
      marginTop: 8,
    },
    
    fileDescription: {
      color: C.muted,
      lineHeight: 22,
      marginTop: 16,
      marginBottom: 24,
      fontStyle: 'italic',
    },
    
    overseerStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    
    fileMetric: {
      color: C.white,
      fontSize: 24,
      fontWeight: '900',
      textAlign: 'center',
    },
    
    fileMetricLabel: {
      color: C.muted,
      fontSize: 10,
      letterSpacing: 1,
      textAlign: 'center',
      marginTop: 6,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    modalCard: {
      width: '84%',
    
      backgroundColor: '#171D2B',
    
      borderRadius: 28,
    
      padding: 28,
    
      borderWidth: 1,
    
      borderColor:
        'rgba(255,255,255,0.06)',
    },
    
    modalTitle: {
      color: '#FF7070',
      fontSize: 22,
      fontWeight: '900',
      textAlign: 'center',
    },
    
    modalText: {
      color: C.muted,
      textAlign: 'center',
      lineHeight: 22,
      marginTop: 18,
    },
    
    modalButton: {
      flex: 1,
      height: 50,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1D2333',
    },

    personalityChip: {
      width: '48%',
      paddingVertical: 16,
      paddingHorizontal: 14,
      borderRadius: 18,
      borderWidth: 1,
    },
    
    personalityChipText: {
      color: C.white,
      fontWeight: '700',
      fontSize: 13,
    },


    // Mission Archive 
    archiveHero: {
      paddingHorizontal: 24,
      marginTop: 20,
    },
    
    archiveHeroTitle: {
      color: C.white,
      fontSize: 44,
      fontWeight: '900',
    },
    
    archiveCount: {
      color: C.muted,
      letterSpacing: 2,
      marginTop: 8,
    },
    
    archiveSearch: {
      flexDirection: 'row',
      alignItems: 'center',
    
      backgroundColor: '#171D2B',
    
      borderRadius: 22,
    
      borderWidth: 1,
    
      borderColor:
        'rgba(255,255,255,0.05)',
    
      paddingHorizontal: 20,
    
      height: 58,
    
      shadowColor: '#000',
    
      shadowOpacity: 0.1,
    
      shadowRadius: 10,
    
      elevation: 5,
    },
    
    archiveInput: {
      flex: 1,
      color: C.white,
      marginLeft: 10,
    },

    archiveBackButton: {
      width: 58,
      height: 58,
    
      borderRadius: 20,
    
      backgroundColor: '#171D2B',
    
      borderWidth: 1,
    
      borderColor:
        'rgba(255,255,255,0.05)',
    
      justifyContent: 'center',
    
      alignItems: 'center',
    
      shadowColor: '#000',
    
      shadowOpacity: 0.15,
    
      shadowRadius: 10,
    
      elevation: 6,
    },
    
    archiveFilters: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 24,
    },
    
    archiveChip: {
      flex: 1,
      height: 32,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#171D2B',
    },
    
    archiveChipText: {
      color: C.white,
      fontSize: 12,
      fontWeight: '700',
    },
    
    archiveStatsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      marginVertical: 24,
    },
    
    archiveStat: {
      width: '31%',
      height: 90,
      borderRadius: 24,
      backgroundColor: '#171D2B',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    archiveStatNumber: {
      color: C.white,
      fontSize: 24,
      fontWeight: '900',
      marginTop: 10,
    },
    
    missionCard: {
      marginHorizontal: 24,
      marginBottom: 20,
      padding: 24,
      backgroundColor: '#171D2B',
      borderRadius: 32,
      borderLeftWidth: 5,
      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.05)',
    },
    
    missionDate: {
      color: C.muted,
      fontSize: 12,
    },
    
    missionTask: {
      color: C.white,
      fontSize: 22,
      fontWeight: '900',
      // marginTop: 10,
      marginBottom: 20,
    },
    
    missionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    
    missionLabel: {
      color: C.muted,
      fontSize: 11,
    },
    
    missionValue: {
      color: C.white,
      fontWeight: '800',
      marginTop: 6,
    },
    
    detailHero: {
      flexDirection: 'row',
      alignItems: 'center',
    
      marginHorizontal: 24,    
      paddingVertical: 18,
      paddingHorizontal: 18,
    
      backgroundColor: '#171D2B',
    
      borderRadius: 26,
    
      borderWidth: 1,
    
      borderColor:
        'rgba(255,255,255,0.05)',
    },
    
    detailResult: {
      color: C.white,
      fontSize: 18,
      fontWeight: '900',
      marginTop: 14,
      letterSpacing: 1.5,
    },
    
    detailTask: {
      color: C.white,
      fontSize: 18,
      fontWeight: '700',
      marginTop: 8,
    
      flexShrink: 1,
      lineHeight: 24,
    },
    
    detailCard: {
      margin: 24,
      padding: 24,
      backgroundColor: '#171D2B',
      borderRadius: 28,
    },
    
    detailRow: {
      color: C.white,
      fontSize: 18,
      marginBottom: 14,
    },
    
    detailMessageCard: {
      marginHorizontal: 24,
      padding: 24,
      borderRadius: 28,
      borderWidth: 1,
    },
    
    detailMessage: {
      color: C.white,
      marginTop: 8,
      lineHeight: 24,
      fontSize: 15,
      fontStyle: 'italic',
    },
    
    detailConditions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 24,
    },
    
    // conditionCard: {
    //   flex: 1,
    //   flexDirection: 'row',
    //   marginHorizontal: 5,
    //   backgroundColor: '#1B1F34',
    //   borderRadius: 14,
    //   borderWidth: 1,
    //   borderColor:
    //     'rgba(255,255,255,0.05)',
    //   padding: 14,
    //   alignItems: 'center',
    //   gap: 8,
    // },

    conditionCard: {
      backgroundColor: '#1B1F34',
    
      borderRadius: 18,
    
      borderWidth: 1,
    
      borderColor:
        'rgba(255,255,255,0.05)',
    
      paddingVertical: 16,
    
      paddingHorizontal: 18,
    },

    detailResultCircle: {
      width: 72,
      height: 72,
    
      borderRadius: 36,
    
      borderWidth: 2,
    
      justifyContent: 'center',
    
      alignItems: 'center',
    
      backgroundColor: '#1A1D33',
    
      marginRight: 16,
    },
    
    detailDate: {
      color: C.muted,
      marginTop: 4,
      fontSize: 11,
      letterSpacing: 1,
    },
    
    detailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    
    detailHeaderText: {
      color: C.white,
      marginLeft: 10,
      fontWeight: '800',
      letterSpacing: 1,
    },
    
    detailMetric: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    detailMetricLabel: {
      color: C.muted,
      fontSize: 14,
      letterSpacing: 1.5,
      fontWeight: '700',
    },
    
    detailMetricValue: {
      color: C.white,
      fontSize: 18,
      fontWeight: '900',
    },
    
    detailDivider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.05)',
      marginVertical: 14,
    },
    
    assessmentLabel: {
      color: C.muted,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1,
    },
    
    conditionRow: {
      // flexDirection: 'row',
      // justifyContent: 'space-between',
      // marginTop: 6,
      gap: 12,
    },
    
    conditionLabel: {
      color: C.muted,
      fontSize: 10,
      letterSpacing: 1.5,
      // fontWeight: '700',
    },
    
    conditionValue: {
      color: C.white,
      fontSize: 15,
      fontWeight: '800',
      marginTop: 6,
      textTransform: 'capitalize',
    },
  });