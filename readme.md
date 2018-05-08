
A React component that allows dropping image files into the browser for automatic upload to IPFS.


## Installation

```
npm install ipfs-image-drop
```

## Usage

```
import React, {	Component } from "react";
import IpfsImageDrop from "ipfs-image-drop";

ReactDOM.render(
    <IpfsImageDrop
        ipfsHost="ipfs.infura.io"
        ipfsPort="5001"
        resizeWidth="100"
        onUpload={console.log} 
    />,
  document.getElementById("root")
);

```

The following props are available:
### ipfsHost
The host name of the IPFS node
### ipfsPort
The port number of the IPFS node
### resizeWidth/resizeHeight
If specified, the image will be resized to have this width/height, retaining the original aspect ratio. Note that only one resize attribute may be specified; resizeHeight or resizeWidth. If both are specified, one will be ignored.
### onUpload
Function to call when the file has been uploaded to IPFS. The function will be called with an object of the following structure as the parameter:
```
{
    ipfsData: {
        hash: String, //IPFS hash of stored file
        path: String, //IPFS path of stored file
    },
    dataURL: String //Data URL of stored file
}
```

Please see the `examples` folder for a more detailed example.

## Styling

The component contains no styling. However, the drop zone element changes its class to reflect the current state. The following style selectors may be used:

```

.IpfsImageDrop .iid-dropZone {
    / *Base style for the drop zone. */
}

.IpfsImageDrop .iid-dropZone.ready {
    /* The drop zone is ready for a file to be dropped, or a dropped file has been successfully uploaded. */
}

.IpfsImageDrop .iid-dropZone.draggingOver {
    /* A file has been dragged over the drop zone. */
}

.IpfsImageDrop .iid-dropZone.uploading {
    /* A file has been dropped into the drop zone and is being uploaded. */
}

```