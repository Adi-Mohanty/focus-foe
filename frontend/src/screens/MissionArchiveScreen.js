import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';

import {
  Search,
  Trophy,
  XCircle,
  Timer,
  ArrowLeft,
} from 'lucide-react-native';

import { S } from '../styles/allStyles';
import { C } from '../constants/colors';
import { F } from '../constants/fonts';
import OverseerAvatar from '../components/OverseerAvatar';
import Pill from '../components/Pill';

export default function MissionArchiveScreen({
  stats,
  themeColor,
  openMission,
  goBack,
  level,
}) {
  const [query,setQuery] = useState('');
  const [filter,setFilter] = useState('all');

  const missions =
    stats.recentSessions || [];

  const filteredMissions =
    useMemo(() => {
      return missions.filter(m => {

        const search =
          m.task?.toLowerCase()
            .includes(
              query?.toLowerCase()
            );

        const result =
          filter === 'all'
            ? true
            : m.result === filter;

        return search && result;
      });
    }, [query, filter, missions]);

  const victories =
    missions.filter(
      m => m.result === 'victory'
    ).length;

  const failures =
    missions.filter(
      m => m.result === 'failure'
    ).length;

//   const perfect =
//     missions.filter(
//       m => m.slips === 0
//     ).length;

  const renderMission = ({ item }) => {

    const accent =
      item.result === 'victory'
        ? '#7B61FF'
        : '#FF5A73';

    return (
      <Pressable
        style={[
          S.missionCard,
          {
            borderLeftColor: accent,
          },
        ]}
        onPress={() =>
          openMission(item)
        }
      >
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={S.missionDate}>
            {new Date(
                item.date
            ).toDateString()}
          </Text>

          <Text
            style={{
                color: accent,
                fontWeight: '800',
            }}
          >
            {item.result.toUpperCase()}
          </Text>
        </View>

        <Text style={S.missionTask}>
          {item.task}
        </Text>

        <View style={S.missionRow}>
          <View>
            <Text style={S.missionLabel}>
              DURATION
            </Text>

            <Text style={S.missionValue}>
              {item.actualDuration}m
            </Text>
          </View>

          <View>
            <Text style={S.missionLabel}>
              SLIPS
            </Text>

            <Text style={S.missionValue}>
              {item.slips}
            </Text>
          </View>

          <View>
            <Text style={S.missionLabel}>
              XP
            </Text>

            <Text
              style={{
                color: accent,
                fontWeight: '900',
              }}
            >
              +{item.xp}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={filteredMissions}
      keyExtractor={item =>
        item.id.toString()
      }
      renderItem={renderMission}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 140,
      }}
      ListHeaderComponent={
        <>
          <View style={S.topBarCompact}>
            <OverseerAvatar
            mood="idle"
            size={38}
            themeColor={themeColor}
            />

            <Text
            style={[
                F.villain,
                {
                color: themeColor,
                fontSize: 18,
                },
            ]}
            >
            FOCUSFOE
            </Text>

            <Pill
            label={`LV ${level}`}
            color={themeColor}
            />
        </View>

        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 24,
                marginBottom: 24,
                gap: 14,
            }}
        >
            <Pressable
                onPress={goBack}
                style={S.archiveBackButton}
            >
                <ArrowLeft
                size={20}
                color={themeColor}
                />
            </Pressable>

            <View
                style={[
                S.archiveSearch,
                {
                    flex: 1,
                    margin: 0,
                },
                ]}
            >
                <Search
                size={18}
                color={C.muted}
                />

                <TextInput
                placeholder="Search missions..."
                placeholderTextColor={C.muted}
                value={query}
                onChangeText={setQuery}
                style={S.archiveInput}
                />
            </View>
        </View>

          <View style={S.archiveFilters}>
            {[
              'all',
              'victory',
              'failure',
            ].map(item => (
              <Pressable
                key={item}
                style={[
                  S.archiveChip,
                  filter === item &&
                    {
                      backgroundColor:
                        themeColor,
                    },
                ]}
                onPress={() =>
                  setFilter(item)
                }
              >
                <Text
                  style={S.archiveChipText}
                >
                  {item.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                marginBottom: 24,
                marginTop: 16,
            }}
          >

            <View style={S.victoryStatTile}>
                <View
                style={[
                    S.victoryStatIconWrap,
                    {
                    backgroundColor:
                        'rgba(67,176,255,0.12)',
                    },
                ]}
                >
                <Timer
                    size={16}
                    color="#43B0FF"
                />
                </View>

                <View style={{ flex: 1 }}>
                <Text style={S.victoryStatTitle}>
                    Missions
                </Text>

                <Text
                    style={[
                    S.victoryStatNumber,
                    { color: '#43B0FF' },
                    ]}
                >
                    {missions.length}
                </Text>
                </View>
            </View>

            <View style={S.victoryStatTile}>
                <View
                style={[
                    S.victoryStatIconWrap,
                    {
                    backgroundColor:
                        'rgba(255,215,50,0.12)',
                    },
                ]}
                >
                <Trophy
                    size={16}
                    color="#FFD84D"
                />
                </View>

                <View style={{ flex: 1 }}>
                <Text style={S.victoryStatTitle}>
                    Victories
                </Text>

                <Text
                    style={[
                    S.victoryStatNumber,
                    { color: '#FFD84D' },
                    ]}
                >
                    {victories}
                </Text>
                </View>
            </View>

            <View style={S.victoryStatTile}>
                <View
                style={[
                    S.victoryStatIconWrap,
                    {
                    backgroundColor:
                        'rgba(255,90,115,0.12)',
                    },
                ]}
                >
                <XCircle
                    size={16}
                    color="#FF5A73"
                />
                </View>

                <View style={{ flex: 1 }}>
                <Text style={S.victoryStatTitle}>
                    Failures
                </Text>

                <Text
                    style={[
                    S.victoryStatNumber,
                    { color: '#FF5A73' },
                    ]}
                >
                    {failures}
                </Text>
                </View>
            </View>

          </View>
        </>
      }
    />
  );
}