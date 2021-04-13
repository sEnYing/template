import ajax from '../../ajax'

var ajaxFn={
	async init(m,u,d,cb,a){
		u='service/customer/'+u;
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
	getList(data,cb) {
		this.init('get','list', data ,cb ,false )
	},
	add(data,cb) {
		this.init('post','add', data ,cb ,false )
	},
	update(data,cb) {
		this.init('post','update', data ,cb ,false )
	},
	detail(data,cb) {
		this.init('get','detail', data ,cb ,false )
	},
	delete(data,cb) {
		this.init('get','delete', data ,cb ,false )
	},
	uploadFile(data,cb) {
		var formData=new FormData()
		for(var key in data){
			formData.append(key,data[key])
		}
		this.init('post','import', formData ,cb ,false )
  },
  transfers(data,cb) {
    this.init('post','transfer',data,cb ,false)
  },
  share(data,cb) {
    this.init('post','share',data,cb ,false)
  },

}

export default ajaxFn
