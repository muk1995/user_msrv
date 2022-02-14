const mute = require('immutable');

//let logger = require('./logger');
//let genlog = logger.getLogger('server-logs');

class ResponseStruct {
	responseStruct = mute.Map({
		signature: null,
		success: null,
		message: '',
		type: null,
		action: null,
		id: null,
		data: null,
		metadata: null,
		status: null
	});

	constructor(type, location, file, status) {
		//set type

		this.type = type;

		this.log = mute.Map({
			location: location,
			file: file
		});

		this.status = status || 500;
	}

	errMessage = (funcName, data, message, err) => {
			this.log.merge({
				error: err ? err.error || err.message || err : null,
				message: err ? err.message || message : 'Something went wrong',
				signature: data.req.signature,
				route: data.req.path,
				function: funcName
			})
		return this.responseStruct
			.merge({
				signature: data.req.signature,
				action: funcName,
				status: this.status,
				success: false,
				type: this.type,
				message: message || 'Something went wrong'
			})
			.toJS();
	};

	successMessage = (action, message, data, resData, userId, metadata) => {
		return this.responseStruct
			.merge({
				signature: data.req.signature,
				action: action,
				status: 200,
				success: true,
				message: message,
				type: this.type,
				data: resData || null,
				metadata: metadata || null,
				id: userId || null
			})
			.toJS();
	};
}

module.exports = ResponseStruct;
