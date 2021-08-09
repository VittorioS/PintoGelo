/* global Camera, FileUploadOptions, FileTransfer */
/* eslint-disable sap-no-navigator */
sap.ui.define([], function() {
	"use strict";

	return {
		isEqual: function(aProperty, aObject) {
			var bEqual = true;
			var iLength = aObject.length;
			var iLengthProperty = aProperty.length;
			var i = 0;
			var y = 0;

			if (aObject.length < 2) {
				return bEqual;
			}

			while (bEqual === true && i + 1 < iLength) {
				y = 0;
				while (bEqual === true && y < iLengthProperty) {
					if (aObject[i][aProperty[y]] !== aObject[i + 1][aProperty[y]]) {
						bEqual = false;
					}
					y++;
				}
				i++;
			}

			return bEqual;
		},

		getPicture: function(fnSuccess, fnError) {
			var oOptions = {
				quality: 50, // Some common settings are 20, 50, and 100
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM, // In this app, dynamically set the picture source, Camera or photo gallery
				encodingType: Camera.EncodingType.JPEG,
				mediaType: Camera.MediaType.PICTURE,
				allowEdit: true,
				correctOrientation: true //Corrects Android orientation quirks
			};

			navigator.camera.getPicture(fnSuccess, fnError, oOptions);
		},

		/*
			oConfig: {
				filename: "",
				uploadUrl: "",
				fileKey: "myFileUpload",
				mimeType: "image/jpeg",
			}
		*/

		uploadFile: function(fnSuccess, fnCallback, oConfig) {
			var sUri = encodeURI(oConfig.uploadUrl);

			var options = new FileUploadOptions();
			options.fileKey = oConfig.fileKey;
			options.fileName = oConfig.filename.substr(oConfig.filename.lastIndexOf('/') + 1);
			options.mimeType = oConfig.mimeType;

			// var win = function(r) {
			// 	console.log("Code = " + r.responseCode);
			// 	console.log("Response = " + r.response);
			// 	console.log("Sent = " + r.bytesSent);
			// 	MessageBox.success("Immagine modificata");
			// }

			// var fail = function(error) {
			// 	alert("An error has occurred: Code = " + error.code);
			// 	console.log("upload error source " + error.source);
			// 	console.log("upload error target " + error.target);
			// 	MessageBox.success("Immagine non modificata");
			// }

			var ft = new FileTransfer();
			// ft.onprogress = function(progressEvent) {
			// if (progressEvent.lengthComputable) {
			// loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
			// } else {
			// loadingStatus.increment();
			// }
			// };
			ft.upload(oConfig.filename, sUri, fnSuccess, fnCallback, options);
		}
	};
});