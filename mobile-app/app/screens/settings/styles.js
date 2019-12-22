import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
    justifyContent: 'flex-start'
  },
  rowContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    color: 'black'
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffcc00'
  },
  buttonContainer: {
    marginTop: 30
  }
});

export default styles;
