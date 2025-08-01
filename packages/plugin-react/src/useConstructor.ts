import {useRef} from 'react';

export const useConstructor = (cb: () => void) => {
  const isMounted = useRef(false);
  if (isMounted.current) return;

  cb();
  isMounted.current = true;
};
