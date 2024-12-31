// const HoloPlayCore = require('holoplay-core');

const { BridgeClient, QuiltHologram } = require('@lookingglass/bridge');

const errors = require('./errors.js');
const workerCode = require('./workerCode.js');

const blob = new Blob([workerCode], { type: 'text/javascript' });

const worker = new Worker(window.URL.createObjectURL(blob));

const getClient = async () => {
  const Bridge = BridgeClient.getInstance();
  const status = await Bridge.status();
  if (!status) throw Error('Could not initialize');
  await Bridge.connect();
  if (!Bridge.isConnected) throw Error('Could not connect');
  return Bridge;
  // if (typeof device.defaultQuilt === 'string') {
  //   device.defaultQuilt = JSON.parse(device.defaultQuilt);
  // }
  // worker.postMessage({
  //   action: 'setSize',
  //   payload: {
  //     size: [device.defaultQuilt.quiltX, device.defaultQuilt.quiltY]
  //   }
  // });
  // return [client, device]
};

const showQuilt = async input => {
  const { quilt, Bridge, specs, updateViewerFrame, status } = input;
  // if (status.updated) {
  status.updated = false;
  console.log(await Bridge.getDisplays());
  const uri = quilt.elt.toDataURL('image/webp', 0.1);

  const { vx: columns, vy: rows, vtotal: viewCount, aspect } = specs;
  const hologram = new QuiltHologram({
    uri,
    settings: { rows, columns, aspect, viewCount }
  });
  // const hologram = new QuiltHologram({
  //   uri: 'https://i.imgur.com/Pwviblt.png',
  //   settings: { rows, columns, aspect, viewCount }
  // });

  console.log(hologram);
  const cast = await Bridge.cast(hologram);
  updateViewerFrame();
  if (cast.success) {
    console.log('🥳 yay we did it!');
  } else {
    console.log(cast);
    console.log('😭');
  }
  // }
  // setTimeout(() => showQuilt(input), 500);

  // worker.onmessage = ({ data }) => {
  //   showQuilt(input);
  //   client
  //     .sendMessage(
  //       new HoloPlayCore.ShowMessage(specs, new Uint8Array(data.payload))
  //     )
  //     .catch(e =>
  //       console.error(`HoloPlayCore Error code ${e.error}: ${errors[e.error]}`)
  //     );
  // };
  // if (status.updated) {
  //   const bitmap = await createImageBitmap(quilt.elt);
  //   status.updated = false;
  //   worker.postMessage({ action: 'saveFrame', payload: { bitmap } }, [bitmap]);
  // } else setTimeout(() => showQuilt(input), 1);
};

module.exports = { getClient, showQuilt };
