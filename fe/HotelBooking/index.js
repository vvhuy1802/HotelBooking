import store from './redux/store';
import {Provider as ReduxProvider} from 'react-redux';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => () => (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
));
