import ajax from '../../ajax'

var ajaxFn={
	async init(m,u,d,cb,a){
		u='service/message/'+u;
		if(a){
			let res = await ajax(m,u,d,false,true);
			// console.log(res)
			return res
		}else{
			ajax(m,u,d,res=>{
				if(cb){cb(res);}
			})
		}
	},
	unreadcount(cb) {
		this.init('get','unreadcount', {} ,cb ,false )
	},
	getList(data,cb) {
		this.init('get','list', data ,cb ,false )
	},
	read(data,cb) {
		this.init('post','read', data ,cb ,false )
	},
}

export default ajaxFn
