import ajax from '../../ajax'

var ajaxFn={
	async init(m,u,d,cb,a){
		u='service/salestarget/'+u;
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
	save(data,cb) {
		this.init('post','save', data ,cb ,false )
	},
	template(data,cb) {
		var formData=new FormData()
		for(var key in data){
			formData.append(key,data[key])
		}
		this.init('post','import', formData , cb , false )
	},
}

export default ajaxFn
