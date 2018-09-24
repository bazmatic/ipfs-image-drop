/*global Image*/
import React,
{
	Component
}
from 'react';
require('babel-polyfill')
//import './ipfs-image-drop.css';
const IpfsAPI = require('ipfs-api'); //Needs a 'require' instead of import

export default class IpfsImageDrop extends Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			status: "ready"
		};
		this.onUpload = this.props.onUpload || console;
		this.ipfsApi = IpfsAPI(this.props.ipfsHost, this.props.ipfsPort || 5001, {protocol: 'https'});
	}

	componentWillReceiveProps(props)
	{
		//Update the connection settings if props are altered
		this.ipfsApi = IpfsAPI(props.ipfsHost, props.ipfsPort || 5001, {protocol: 'https'});

	}

	render()
	{
		let classList = "iid-dropZone " + this.state.status;
		return (
			<div className="IpfsImageDrop">
				<div className={classList} onDrop={this.onDrop.bind(this)} onDragOver={this.onDragOver.bind(this)} onDragLeave={this.onDragLeave.bind(this)}>
					<div className="iid-prompt">{this.props.prompt || ""}</div>
				</div>
			</div>
		)
	}

	onDrop(event)
	{
		if (event && event.preventDefault)
		{
			this.setState({status: "uploading"});
			event.preventDefault(); //Prevent file from being opened in the browser

			//Note that we can't make the event handler itself asynchronous or everything will break.
			(async () =>
			{
				//If there are one or more dragged files,
				if (event.dataTransfer.files && event.dataTransfer.files.length)
				{
					//Get the first file and upload it to IPFS
					let file = event.dataTransfer.files[0];
					let ipfsData = await this.uploadImage(file);

					//Call back with the response from IPFS
					this.onUpload(ipfsData);

					//Show the drop zone as available again
					this.setState(
					{
						status: "ready",
						ipfsData: ipfsData
					});
				}
			})()
		}
	}


	onDragOver(event)
	{
		if (event && event.preventDefault)
		{
			event.preventDefault(); //Turn off default drag-over behaviour
			this.setState(
			{
				status: "draggingOver"
			});
		}
	}

	onDragLeave(event)
	{
		event.preventDefault(); //Turn off default drag-leave behaviour
		this.setState(
		{
			status: "ready"
		});
	}

	uploadImage(file)
	{
		let self = this;
		return new Promise((resolve, reject) =>
		{

			//Convert the file to a data URL
			let ipfsData;
			var fileReader = new FileReader();
			fileReader.onloadend = (async () =>
			{
				let dataUrl = fileReader.result;

				//If required, resize the file
				if (this.props.resizeWidth || this.props.resizeHeight)
				{
					dataUrl = await resizeDataUrl(dataUrl, this.props.resizeHeight, this.props.resizeWidth);
				}

				//Convert the data URL to a buffer
				const buffer = Buffer.from(dataUrl);

				//Upload the buffer
				//TODO: Make the progress callback a prop
				self.ipfsApi.add(buffer,
					{
						progress: (prog) => console.log(`received: ${prog}`)
					})
					.then((response) =>
					{
						ipfsData = response[0]
						resolve(
						{
							ipfsData,
							dataUrl
						});
					}).catch((err) =>
					{
						console.error(err);
						reject(err);
					})
			});
			fileReader.readAsDataURL(file);

		})

	}
}


//Given a data URL, physically shrink it based on a target height OR width, preserving the aspect ratio.
function resizeDataUrl(dataUrl, height, width)
{
	return new Promise((resolve, reject) =>
	{
		var img = new Image();
		img.onload = () =>
		{
			console.log(img);
			let aspectRatio;
			if (width)
			{
				aspectRatio = img.height / img.width;
				height = width * aspectRatio;
			}
			else if (height)
			{
				aspectRatio = img.width / img.height;
				width = height * aspectRatio;
			}
			else
			{
				throw "resizeDataUrl(): You must specify a target height or width"
			}

			// create an off-screen canvas
			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d');

			// set its dimension to target size
			canvas.width = width;
			canvas.height = height;

			// draw source image into the off-screen canvas:
			ctx.drawImage(img, 0, 0, width, height);

			// encode image to data-uri with base64 version of compressed image
			resolve(canvas.toDataURL());
		}
		img.src = dataUrl;
	})
}