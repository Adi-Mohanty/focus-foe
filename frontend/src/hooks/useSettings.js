import {
    useEffect,
    useState,
  } from 'react';
  
  import {
    DEFAULT_SETTINGS,
  } from '../constants/defaultSettings';
  
  import {
    loadSettings,
    saveSettings,
  } from '../services/settingsStorage';
  
  export default function useSettings() {
    const [settings, setSettings] =
      useState(DEFAULT_SETTINGS);
  
    const [loaded, setLoaded] =
      useState(false);
  
    useEffect(() => {
      async function init() {
        const saved =
          await loadSettings(
            DEFAULT_SETTINGS
          );
  
        setSettings(saved);
        setLoaded(true);
      }
  
      init();
    }, []);
  
    useEffect(() => {
      if (!loaded) return;
  
      saveSettings(settings);
    }, [settings]);
  
    return {
      settings,
      setSettings,
      loaded,
    };
  }