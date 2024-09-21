// global style
import '@chotto-chat/shared/global.css';

// code
import { init } from '@chotto-chat/shared';

init({
  config: {
    fetchFns: {
      fetchJsonFn: async (input, init) => {
        return fetch(input, init).then((resp) => resp.json());
      },
      fetchReaderFn(input, init) {
        return fetch(input, init)
          .then((resp) => resp.body)
          .then((body) => {
            const reader = body?.getReader();
            if (!reader) throw new Error('No reader');
            return reader;
          });
      },
    },
  },
});
