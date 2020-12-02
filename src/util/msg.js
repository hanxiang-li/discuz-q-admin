import {Message, MessageBox, Notification} from "element-ui";
import i18n from "@/lang";

export const resOK = (res) => {
	return res.status === 200
}

export const okMsg = (msg, center) => {
	if (msg){
		Message({
			message: i18n.tc(msg),
			type: 'success',
			center: center,
		})
	} else {
		Message({
			message: i18n.tc('msg.success'),
			type: 'success',
			center: center,
		})
	}
}

export const errorMsg = (msg, center) => {
	if (msg){
		Message({
			message: i18n.tc(msg),
			type: 'error',
			center: center,
		})
	} else {
		Message({
			message: i18n.tc('msg.error'),
			type: 'error',
			center: center,
		})
	}
}

export const m = (msg, type, center) => {
	Message({
		message: i18n.tc(msg),
		type: type || 'success',
		center: center || false,
	})
}

export const boxMsg = (msg, type, callback) => {
	MessageBox.alert(i18n.tc(msg), i18n.tc('msg.tips'), {
		type: type || 'success',
		confirmButtonText: '确定',
		callback: action => {
			if(callback)
			callback(action)
		}
	})
}

export const confirmMsg = (msg, type, okCallBack, catchBacllBak) => {
	MessageBox.confirm(i18n.tc(msg), i18n.tc('msg.tips'), {
		confirmButtonText: i18n.tc('button.ok'),
		cancelButtonText: i18n.tc('button.cancel'),
		type: type || 'success',
	}).then(() => {
		if (okCallBack){
			okCallBack()
		} else {
			okMsg(i18n.tc('msg.success'))
		}
	}).catch(() => {
		if (catchBacllBak){
			catchBacllBak()
		} else {
			m(i18n.tc('msg.cancel'), 'info')
		}
	});
}

export const notificationMsg = (msg, type) => {
	Notification({
		title: i18n.tc('msg.tips'),
		message: i18n.tc(msg),
		type: type || 'success',
	})
}

export const promptValidator = (val, msg) => {
	let validator = (val) => {
		if(!val){
			return msg
		}
		return true
	}
	return validator(val)
}


