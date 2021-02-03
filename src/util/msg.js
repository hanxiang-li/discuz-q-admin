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
		message: msg,
		type: type || 'success',
		center: center || false,
	})
}

export const boxMsg = (msg, type, callback) => {
	MessageBox.alert(i18n.tc(msg), '温馨提示', {
		type: type || 'success',
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		callback: action => {
			if(callback)
			callback(action)
		}
	})
}

export const confirmMsg = (msg, type, okCallBack, catchBacllBak) => {
	MessageBox.confirm(msg, '温馨提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: type || 'success',
	}).then(() => {
		if (okCallBack){
			okCallBack()
		} else {
			okMsg()
		}
	}).catch(() => {
		if (catchBacllBak){
			catchBacllBak()
		} else {
			m('操作取消', 'info')
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


