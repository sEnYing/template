import ajax from '../ajax'

var ajaxFn={
	async init(m,u,d,cb){
		u='account/'+u;
		ajax(m,u,d,res=>{
			if(cb){cb(res);}
		})
	},
	login(data,cb) {
		this.init('post','login', data ,cb )
	},
	logout(cb) {
		this.init('post','loginOut', {} ,cb )
	},
}

export default ajaxFn
