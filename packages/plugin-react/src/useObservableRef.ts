import {useLayoutEffect, useRef} from 'react';

export const useObservableRef = <T>(data: T) => {
  const dataRef = useRef(data);

  useLayoutEffect(() => {
    dataRef.current = data;
  }, [data]);

  return dataRef;
};
