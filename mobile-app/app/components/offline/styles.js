import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../config/settings';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: WINDOW_HEIGHT / 2.5,
    width: WINDOW_WIDTH
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: WINDOW_WIDTH / 1.5,
    width: WINDOW_WIDTH / 2,
    borderColor: '#000',
    borderBottomWidth: 1
  },
  receivedLetters: {
    fontSize: 50,
    color: '#000'
  },
  text: {
    color: '#000'
  }
});

export default styles;
