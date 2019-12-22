import React, { Component } from 'react';
import { Text, View, ScrollView, RefreshControl } from 'react-native';
import styles from './styles';
import { accessKeyId, secretAccessKey, region, database } from '../../config/settings';
import { List, ListItem } from 'react-native-elements';
import { showConnectivityErrorMessage, isNetworkConnected, lastSync, createDataObjects } from '../../lib/Utils';

// Create the DynamoDB service object
ddb = createDBService();

// params for requesting the database
var params = {
  TableName: database /* required */
};

class Historic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      database: ' ',
      lastUpdate: ' ',
      refreshing: false
    };
  }

  onRefresh() {
    isNetworkConnected().done(isConnected => {
      if (isConnected) {
        this.setState({ refreshing: true });
        this.getDataFromDatabase(params)
          .then(response => {
            let datetime = lastSync();
            this.setState({
              database: response,
              lastUpdate: datetime,
              refreshing: false
            });
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        showConnectivityErrorMessage();
      }
    });
  }

  getDataFromDatabase(params) {
    return new Promise((resolve, reject) => {
      ddb.scan(params, function(err, data) {
        if (err) {
          console.log('Error', err);
          resolve(false);
        } else {
          var data_ = new Array();
          data.Items.forEach(function(element) {
            var entry = {};
            console.log(element);
            entry.payload = element.payload.M;
            entry.id = element.id.S;
            entry.type = element.type.S;
            data_.push(entry);

            // did we finish?
            if (data_.length === data.Items.length) resolve(data_);
          });
        }
      });
    });
  }

  componentDidMount() {
    console.log('Trying to get data from database = ' + database);
    isNetworkConnected().done(isConnected => {
      if (isConnected) {
        this.getDataFromDatabase(params)
          .then(response => {
            let datetime = lastSync();
            this.setState({ database: response, lastUpdate: datetime });
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.lastUpdateContainer}>
            <Text style={styles.lastUpdate}>{this.state.lastUpdate}</Text>
          </View>

          <List containerStyle={styles.listContainer}>
            {createDataObjects(this.state.database).map((item, i) => (
              <ListItem
                titleStyle={styles.titleStyle}
                hideChevron={true}
                subtitleStyle={styles.subtitleStyle}
                key={i}
                title={item.name}
                subtitle={item.datetime}
                leftIcon={{ name: item.icon, color: '#07BEB8' }}
              />
            ))}
          </List>
        </View>
      </ScrollView>
    );
  }
}

function createDBService() {
  var AWS = require('aws-sdk/dist/aws-sdk-react-native');
  AWS.config.update({
    accessKeyId: accessKeyId,
    region: region,
    secretAccessKey: secretAccessKey
  });
  // Create the DynamoDB service object
  return new AWS.DynamoDB({ apiVersion: '2012-10-08' });
}

export default Historic;
