'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*global Image*/


require('babel-polyfill');
//import './ipfs-image-drop.css';
var IpfsAPI = require('ipfs-api'); //Needs a 'require' instead of import

var IpfsImageDrop = function (_Component) {
	_inherits(IpfsImageDrop, _Component);

	function IpfsImageDrop(props) {
		_classCallCheck(this, IpfsImageDrop);

		var _this = _possibleConstructorReturn(this, (IpfsImageDrop.__proto__ || Object.getPrototypeOf(IpfsImageDrop)).call(this, props));

		_this.state = {
			status: "ready"
		};
		_this.onUpload = _this.props.onUpload || console;
		_this.ipfsApi = IpfsAPI(_this.props.ipfsHost, _this.props.ipfsPort || 5001, { protocol: 'https' });
		return _this;
	}

	_createClass(IpfsImageDrop, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(props) {
			//Update the connection settings if props are altered
			this.ipfsApi = IpfsAPI(props.ipfsHost, props.ipfsPort || 5001, { protocol: 'https' });
		}
	}, {
		key: 'render',
		value: function render() {
			var classList = "iid-dropZone " + this.state.status;
			return _react2.default.createElement(
				'div',
				{ className: 'IpfsImageDrop' },
				_react2.default.createElement(
					'div',
					{ className: classList, onDrop: this.onDrop.bind(this), onDragOver: this.onDragOver.bind(this), onDragLeave: this.onDragLeave.bind(this) },
					_react2.default.createElement(
						'div',
						{ className: 'iid-prompt' },
						this.props.prompt || ""
					)
				)
			);
		}
	}, {
		key: 'onDrop',
		value: function onDrop(event) {
			var _this2 = this;

			if (event && event.preventDefault) {
				this.setState({ status: "uploading" });
				event.preventDefault(); //Prevent file from being opened in the browser

				//Note that we can't make the event handler itself asynchronous or everything will break.
				_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
					var file, ipfsData;
					return regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									if (!(event.dataTransfer.files && event.dataTransfer.files.length)) {
										_context.next = 7;
										break;
									}

									//Get the first file and upload it to IPFS
									file = event.dataTransfer.files[0];
									_context.next = 4;
									return _this2.uploadImage(file);

								case 4:
									ipfsData = _context.sent;


									//Call back with the response from IPFS
									_this2.onUpload(ipfsData);

									//Show the drop zone as available again
									_this2.setState({
										status: "ready",
										ipfsData: ipfsData
									});

								case 7:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, _this2);
				}))();
			}
		}
	}, {
		key: 'onDragOver',
		value: function onDragOver(event) {
			if (event && event.preventDefault) {
				event.preventDefault(); //Turn off default drag-over behaviour
				this.setState({
					status: "draggingOver"
				});
			}
		}
	}, {
		key: 'onDragLeave',
		value: function onDragLeave(event) {
			event.preventDefault(); //Turn off default drag-leave behaviour
			this.setState({
				status: "ready"
			});
		}
	}, {
		key: 'uploadImage',
		value: function uploadImage(file) {
			var _this3 = this;

			var self = this;
			return new Promise(function (resolve, reject) {

				//Convert the file to a data URL
				var ipfsData = void 0;
				var fileReader = new FileReader();
				fileReader.onloadend = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
					var dataUrl, buffer;
					return regeneratorRuntime.wrap(function _callee2$(_context2) {
						while (1) {
							switch (_context2.prev = _context2.next) {
								case 0:
									dataUrl = fileReader.result;

									//If required, resize the file

									if (!(_this3.props.resizeWidth || _this3.props.resizeHeight)) {
										_context2.next = 5;
										break;
									}

									_context2.next = 4;
									return resizeDataUrl(dataUrl, _this3.props.resizeHeight, _this3.props.resizeWidth);

								case 4:
									dataUrl = _context2.sent;

								case 5:

									//Convert the data URL to a buffer
									buffer = Buffer.from(dataUrl);

									//Upload the buffer
									//TODO: Make the progress callback a prop

									self.ipfsApi.add(buffer, {
										progress: function progress(prog) {
											return console.log('received: ' + prog);
										},
										mode: 'no-cors'
									}).then(function (response) {
										ipfsData = response[0];
										resolve({
											ipfsData: ipfsData,
											dataUrl: dataUrl
										});
									}).catch(function (err) {
										console.error(err);
										reject(err);
									});

								case 7:
								case 'end':
									return _context2.stop();
							}
						}
					}, _callee2, _this3);
				}));
				fileReader.readAsDataURL(file);
			});
		}
	}]);

	return IpfsImageDrop;
}(_react.Component);

//Given a data URL, physically shrink it based on a target height OR width, preserving the aspect ratio.


exports.default = IpfsImageDrop;
function resizeDataUrl(dataUrl, height, width) {
	return new Promise(function (resolve, reject) {
		var img = new Image();
		img.onload = function () {
			console.log(img);
			var aspectRatio = void 0;
			if (width) {
				aspectRatio = img.height / img.width;
				height = width * aspectRatio;
			} else if (height) {
				aspectRatio = img.width / img.height;
				width = height * aspectRatio;
			} else {
				throw "resizeDataUrl(): You must specify a target height or width";
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
		};
		img.src = dataUrl;
	});
}