import ajax from '../../ajax'

var ajaxFn={
	async init(m,u,d,cb,a){
		u='bgmgnt/role/'+u;
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
    resourcetreelist(cb) {
        this.init('get','resourcetreelist', {} ,cb ,false )
    },
	add(data,cb) {
		this.init('post','add', data ,cb ,false )
    },
    roleDetail(data,cb) {
        this.init('get','detail', data ,cb ,false )
    },
    update(data,cb) {
		this.init('post','update', data ,cb ,false )
    },
    delete(data,cb) {
        this.init('get','delete', data ,cb ,false )
    },
    bindAccount(data,cb) {
        this.init('post','bindAccount', data ,cb ,false )
    }
}

export default ajaxFn
