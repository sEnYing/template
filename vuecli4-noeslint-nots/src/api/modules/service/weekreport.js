import ajax from '../../ajax'

var ajaxFn={
	async init(m,u,d,cb,a){
		u='service/weekreport/'+u;
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
	mylist(data,cb) {
		this.init('get','mylist', data ,cb ,false )
	},
	list(data,cb) {
		this.init('get','list', data ,cb ,false )
	},
	generate(data,cb) {
		this.init('get','generate', data ,cb ,false )
	},
	save(data,cb) {
		this.init('post','save', data ,cb ,false )
	},
	submit(data,cb) {
		this.init('post','submit', data ,cb ,false )
	},
	detail(data,cb) {
		this.init('get','detail', data ,cb ,false )
	},
}

export default ajaxFn
