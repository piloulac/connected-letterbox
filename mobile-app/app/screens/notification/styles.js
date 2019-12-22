import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from '../../config/settings';

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: 'rgba(13, 52, 90, 0.9)',
    padding: 16,
    margin: 10,
    borderRadius: 5,
    width: WINDOW_WIDTH * 0.95
  },
  containerError: {
    height: 100,
    backgroundColor: '#ff322a',
    padding: 16,
    margin: 10
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFF'
  },
  content: {
    textAlign: 'center',
    marginTop: 10,
    padding: 10,
    color: '#FFF'
  }
});

export default styles;
