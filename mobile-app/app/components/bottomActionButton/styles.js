import { StyleSheet } from 'react-native';
import { WINDOW_HEIGHT } from '../../config/settings';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: WINDOW_HEIGHT / 4
  }
});

export default styles;
