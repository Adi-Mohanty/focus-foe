import {
  Flame,
  Shield,
  Moon,
  Star,
  Zap,
  Crown,
  Timer,
  TriangleAlert,
  Gem,
  Swords,
} from 'lucide-react-native';

export const ACHIEVEMENT_CONFIG = {
    first_blood: {
      title: 'First Blood',
      description:
        'Complete your first mission.',
      icon: Flame,
      permanent: true,
    },
  
    iron_will: {
      title: 'Iron Will',
      description:
        '3 zero-slip sessions.',
      icon: Shield,
      permanent: true,
    },
  
    night_owl: {
      title: 'Night Owl',
      description:
        'Win after 11 PM.',
      icon: Moon,
      permanent: true,
    },
  
    dawn_warrior: {
      title: 'Dawn Warrior',
      description:
        'Win before 6 AM.',
      icon: Star,
      permanent: true,
    },
  
    grinder: {
      title: 'Grinder',
      description:
        '10 completed sessions.',
      icon: Zap,
      permanent: true,
    },
  
    centurion: {
      title: 'Centurion',
      description:
        '100 victories.',
      icon: Crown,
      permanent: true,
    },
  
    marathon: {
      title: 'Marathon',
      description:
        '2+ hour session.',
      icon: Timer,
      permanent: true,
    },
  
    monk: {
      title: 'Focus Monk',
      description:
        '10 zero-slip wins.',
      icon: Shield,
      permanent: true,
    },
  
    phoenix: {
      title: 'Phoenix',
      description:
        'Win after surrender.',
      icon: Flame,
      permanent: true,
    },
  
    slip_survivor: {
      title:
        'Slip Survivor',
      description:
        'Win despite 5 slips.',
      icon:
        TriangleAlert,
      permanent: true,
    },
  
    deep_diver: {
      title:
        'Deep Diver',
      description:
        '3 sessions over 90m.',
      icon: Gem,
      permanent: true,
    },
  
    xp_hunter: {
      title:
        'XP Hunter',
      description:
        '1000 lifetime XP.',
      icon: Gem,
      permanent: true,
    },
  
    consistency_king:
      {
        title:
          'Consistency King',
        description:
          'Maintain 5 streak.',
        icon:
          Crown,
        permanent:
          false,
      },

    unbreakable: {
      title: 'Unbreakable',
      description: 'Complete 10 missions in a row',
      icon: Swords,
      permanent: false,
    },
  
    discipline_guardian:
      {
        title:
          'Discipline Guardian',
        description:
          'Average ≤1 slip.',
        icon:
          Shield,
        permanent:
          false,
      },
  
    firekeeper: {
      title:
        'Firekeeper',
      description:
        '30m/day for 5 days.',
      icon:
        Flame,
        permanent:
        false,
    },
  
    diamond_mind:
      {
        title:
          'Diamond Mind',
        description:
          '90%+ win rate.',
        icon:
          Gem,
        permanent:
          false,
      },
  };