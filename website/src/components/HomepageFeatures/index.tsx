import React from 'react';
import clsx from 'clsx';
import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: React.JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Strongly typed and adaptable',
    Svg: () => null,
    description: (
      <span className={styles.feature}>
        We built an adaptable tool to such popular libraries like <a target="_blank" href="https://redux.js.org">Redux</a> and <a target="_blank" href="https://zustand-demo.pmnd.rs">Zustand</a>,
        while encouraging <a target="_blank" href="https://www.typescriptlang.org">Typescript</a> as much as we could
      </span>
    ),
  },
  {
    title: 'In-component saga control',
    Svg: () => null,
    description: (
      <span className={styles.feature}>
        Keeping in mind <a target="_blank" href="https://react.dev">React</a> components have their own lifecycle,
        sagas run on component mount and automatically cancelled upon its unmount
      </span>
    ),
  },
  {
    title: 'Cancellable network requests',
    Svg: () => null,
    description: (
      <span className={styles.feature}>
        We provide adapters for <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch">fetch</a> and <a target="_blank" href="https://axios-http.com">Axios</a> that support cancellable network requests with the help of <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController">AbortController</a> out of the box
      </span>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        <div className={styles.tabsContainer}>
          <h2>Example usage</h2>
          <Tabs>
            <TabItem value="sagas" label="1. Dispatch an action" default>
              <p>Suppose we have a UI to fetch some user data from a remote server when a button is clicked. For brevity, we'll just show the action triggering code.</p>
              <CodeBlock language="tsx">
                {`import {useDispatch} from 'react-redux';

function Todos(props: Props) {
  const dispatch = useDispatch();
  
  const onSomeButtonClicked = () => {
    const {userId} = props;
    dispatch({type: 'USER_FETCH_REQUESTED', payload: {userId}});
  };
  
  ...
}`}
              </CodeBlock>
            </TabItem>
            <TabItem value="component" label="2. Initiate a side effect">
              <p>The component dispatches a plain object action to the store. We'll create a Saga that watches for all USER_FETCH_REQUESTED actions and triggers an API call to fetch the user data.</p>
              <CodeBlock language="ts">
                {`import {createSaga} from 'promise-saga';
import Api from '...';

// Worker saga will be fired on USER_FETCH_REQUESTED actions
const fetchUser = createSaga(async function (action) {
   try {
      const user = await this.call(Api.fetchUser, action.payload.userId);
      this.put({type: "USER_FETCH_SUCCEEDED", user});
   } catch (err) {
      this.put({type: "USER_FETCH_FAILED", message: err.message});
   }
});

// Starts fetchUser on each dispatched USER_FETCH_REQUESTED action
// Allows concurrent fetches of user
const mySaga = createSaga(async function () {
  this.takeEvery("USER_FETCH_REQUESTED", fetchUser);
});`}
              </CodeBlock>
            </TabItem>
            <TabItem value="store" label="3. Connect to the store">
              <p>To run our Saga, we have to connect it to the Redux store using the Promise Saga middleware.</p>
              <CodeBlock language="ts">
                {`import {configureStore} from '@reduxjs/toolkit';
import {createSagaMiddleware} from 'promise-saga/adapters/redux';

import reducer from './reducers';
import mySaga from './sagas';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Mount it to the Store
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(sagaMiddleware),
});

// Then run the saga
mySaga();

// Render the application`}
              </CodeBlock>
            </TabItem>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
