import React, { Component} from "react";
import IpfsImageDrop from "../../../ipfs-image-drop.js"; //"ipfs-image-drop";
//import IpfsImageDrop from "ipfs-image-drop";
//
import "./app.css";

class App extends Component {
  
    constructor(props) {
      super(props);
      
      this.state = {
        ipfsHost: "threadme.in",
        ipfsPort: 8443
      };
      
    }
  render(){
    var link = "Drop a file into the drop zone above to upload to IPFS";
    if (this.state.ipfsLink) {
      console.log("Output link", this.state.ipfsLink);
      link = <a href={this.state.ipfsLink}>{this.state.ipfsLink}</a>
    }
    return(
      <div className="App">
        <h2>IPFS Image Drop</h2>
        <div className="row">
          <label htmlFor="ipfsHost">IPFS host</label>
          <input name="ipfsHost" value={this.state.ipfsHost} onChange={this.updateIpfsHost.bind(this)} />
        </div>
  
        <div className="row">
          <label htmlFor="ipfsPort">IPFS port</label>
          <input name="ipfsPort" value={this.state.ipfsPort} onChange={this.updateIpfsPort.bind(this)} />
        </div>      

        <IpfsImageDrop ipfsHost={this.state.ipfsHost} ipfsPort={this.state.ipfsPort} onUpload={this.onUpload.bind(this)} />
        <div className="row">
          {link}
        </div>
      </div>
    );
  }
  updateIpfsHost(evt) {
    this.setState({
      ipfsHost: evt.target.value
    });
    
  }
  updateIpfsPort(evt) {
    this.setState({
      ipfsPort: evt.target.value
    });    
  }
  onUpload(data) {
    console.log("app.onUpload()", data);
    this.setState({
      ipfsLink: "https://gateway.ipfs.io/ipfs/" + data.path
    })
    
  }
}

export default App;