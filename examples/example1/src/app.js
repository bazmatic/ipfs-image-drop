import React,
{
	Component
}
from "react";
//import IpfsImageDrop from "../../../ipfs-image-drop.js"; //"ipfs-image-drop";
import IpfsImageDrop from "ipfs-image-drop";

import "./app.css";

class App extends Component
{

	constructor(props)
	{
		super(props);

		this.state = {
			ipfsHost: "ipfs.infura.io",
			ipfsPort: 5001,
			resizeWidth: ""
		};

	}
	render()
	{
		var link = "Drop a file into the drop zone above to upload to IPFS";
		if (this.state.ipfsLink)
		{
			link = <a href={this.state.ipfsLink}>{this.state.ipfsLink}</a>
		}
		return (
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

				<div className="row">
					<label htmlFor="ipfsPort">Resize to width before upload</label>
					<input name="targetWidth" value={this.state.resizeWidth} onChange={this.updateResizeWidth.bind(this)} />
				</div> 

				<IpfsImageDrop ipfsHost={this.state.ipfsHost} ipfsPort={this.state.ipfsPort} resizeWidth={this.state.resizeWidth} onUpload={this.onUpload.bind(this)} />
				<div className="row">
					{link}
				</div>
				<div className="row">
					<img src={this.state.dataUrl} />
				</div>
			  </div>
		);
	}
	updateIpfsHost(evt)
	{
		this.setState(
		{
			ipfsHost: evt.target.value
		});

	}
	updateIpfsPort(evt)
	{
		this.setState(
		{
			ipfsPort: evt.target.value
		});
	}
	updateResizeWidth(evt)
	{
		try {
			let num = parseInt(evt.target.value, 10);
			this.setState(
			{
				resizeWidth: num
			});
		}
		catch (e) {
			console.error("Invalid number entered")
		}

	}
	onUpload(data)
	{
		console.log("app.onUpload()", data);
		this.setState(
		{
			ipfsLink: "https://gateway.ipfs.io/ipfs/" + data.ipfsData.path,
			dataUrl: data.dataUrl
		})

	}
}

export default App;