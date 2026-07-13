import { API_BASE, APP_KEY } from '../constants/appConstants';

export const fetchVillainVoiceApi =
  async payload => {
    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () =>
          controller.abort(),
        30000
      );

    try {
      console.log(
        'Calling:',
        `${API_BASE}/api/villain-voice`
      );
    
      // console.log(payload);

      const response =
        await fetch(
          `${API_BASE}/api/villain-voice`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
              'X-FocusFoe-Key':
                APP_KEY,
            },

            body:
              JSON.stringify(
                payload
              ),

            signal:
              controller.signal,
          }
        );

      console.log(
        'Status:',
        response.status
      );

      const data =
        await response.json();

      // console.log(data);

      return data;
    } catch (err) {
      console.log(
        'FETCH ERROR:',
        err
      );
    
      throw err;
    } finally {
      clearTimeout(
        timeout
      );
    }
  };