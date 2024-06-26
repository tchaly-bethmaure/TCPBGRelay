import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/js/bootstrap.bundle';
import './index.css';

import { Serial } from './serial.js';
import { GBWebsocket } from './gbwebsocket.js';
global.jQuery = require('jquery');
require('bootstrap');

const MAXCONNECTION = 2;
const HOSTSTATIC = "192.168.144.4"; 
var PLAYERNUMBER = 0;

class OnlineGBGame extends React.Component {
  handleConnectCreateClick() {
    if(PLAYERNUMBER < MAXCONNECTION){
      PLAYERNUMBER += 1;
      this.ws = GBWebsocket("ws://"+HOSTSTATIC+"/create");
      this.serial = new Serial();
      this.serial.getDevice().then(() => {
        console.log("Usb connected, updating status.");
        this.initiateConnection();
      }).catch(c => {
        console.log("CATTTCH");
      });
    }
  }

  handleConnectJoinClick() {
    if(PLAYERNUMBER < MAXCONNECTION){
      PLAYERNUMBER += 1;
      this.ws = GBWebsocket("ws://"+HOSTSTATIC+"/join");
      this.serial = new Serial();
      this.serial.getDevice().then(() => {
        console.log("Usb connected, updating status.");
        this.connection();
      }).catch(c => {
        console.log("CATTTCH");
      });
    }
  }

  connection() {
    console.log("Attempt connection...");
    this.serial.receiveFromOtherGB(this.ws.read());
    this.serial.sendToMyGB();
    this.serial.receiveFromMyGB(this.serial.read());
    this.serial.sendToOtherGB();
  }

  initiateConnection() {
    console.log("Trying to initiate connection...");
    this.serial.receiveFromMyGB(this.serial.read());
    this.serial.sendToOtherGB();
    this.serial.receiveFromOtherGB(this.ws.read());
    this.serial.sendToMyGB();
    
  }

  render() {
    if (navigator.usb) {
      if (true) {
        return (

          <div className="connect">
            <img src={process.env.PUBLIC_URL + '/images/animation.gif'} className="gameboy" />
            <h2 className="cover-heading">GameBoylinki</h2>
            <p className="lead">Connect your Game Boy, boot Games, and start playing with your friends!</p>
            <hr />
            <h4>Connect your Game Boy</h4>
            <p>Connect your Game Boy with the USB to Game Link adapter and click "connect".</p>
            <button onClick={(e) => this.handleConnectJoinClick()} className="btn btn-lg btn-secondary">Connect</button>
            <button onClick={(e) => this.handleConnectCreateClick()} className="btn btn-lg btn-secondary">Create</button>
            <br/>
            <small>Version: 0.1</small>
          </div>
        )
      }
    }
    else 
    {
        return (

            <span>Not supported by browser... try to have a more recent browser or system.</span>
          )
    }
   }
}

// ========================================

ReactDOM.render(
  <OnlineGBGame />,
  document.getElementById('root')
);
