class Middle {
	constructor() {
		this.iframeWin = window.parent;
		this.map = {
			/**
			 * 设置数据
			 * @param {Object} key
			 * @param {Object} value
			 */
			setStore(sys, key, value) {
				if (!key) return;
				if (!key instanceof Object) return localStorage.setItem(key, value);
				// Object.keys(key).forEach(dataKey => {
				// 	let dataValue = typeof key[dataKey] === 'object' ? JSON.stringify(key[dataKey]) : key[dataKey];
				// 	localStorage.setItem(dataKey, dataValue);
				// });
				let json=localStorage.getItem('authentication')?JSON.parse(localStorage.getItem('authentication')):{};
				json[sys]=key;
				localStorage.setItem('authentication', JSON.stringify(json));
			},

			/**
			 * 获取数据
			 * @param {Object} key
			 */
			getStore(sys, key) {
				let json=localStorage.getItem('authentication')?JSON.parse(localStorage.getItem('authentication')):{};
				let result = json&&json[sys]?
					json[sys]:{};
				if(!key) return result;
				if (typeof key === 'string') return result[key];
				let dataRes = {};
				key.forEach(dataKey => {
					dataRes[dataKey] = result[dataKey] || null;
				});
				return dataRes;
			},

			/**
			 * 删除数据
			 * @param {Object} key
			 */
			deleteStore(sys, key) {
				let json=localStorage.getItem('authentication')?JSON.parse(localStorage.getItem('authentication')):{};
				let result = json&&json[sys]?
					json[sys]:{};
				let removeKeys = [...key];
				removeKeys.forEach(dataKey => {
					delete result[dataKey];
				});
				json[sys]=result
				localStorage.setItem('authentication', JSON.stringify(json));
			},

			/**
			 * 清空
			 */
			clearStore(sys) {
				let json=localStorage.getItem('authentication')?JSON.parse(localStorage.getItem('authentication')):{};
				if(json[sys]!==undefined) delete json[sys];
				localStorage.setItem('authentication', JSON.stringify(json));
				// localStorage.clear();
			}
		};

		this._initListener(); //监听消息
	}

	/**
	 * 监听
	 */
	_initListener() {
		window.addEventListener('message', (e) => {
			// console.log(e.data,this.iframeWin)
			if(e.data){
				let {
					method,
					key,
					value,
					sys,
					id = "default",
					...res
				} = e.data;

				//取出本地的数据
				let mapFun = this.map[`${method}Store`];

				if (!mapFun) {
					return this.iframeWin.postMessage({
						id,
						request: e.data,
						reponse: 'Request mode error!'
					}, '*');
				}

				//取出本地的数据
				let storeData = mapFun(sys, key, value);
				//发送给父亲
				this.iframeWin.postMessage({
					id,
					request: e.data,
					reponse: storeData
				}, '*');
			}
		})
		window.addEventListener("storage", (e) => {
			//发送给父亲
			this.iframeWin.postMessage({
				id:'changeStorage',
				request: null,
				reponse: null
			}, '*');
		});
	}
}
const corssMiddle = new Middle();