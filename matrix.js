class Matrix {
	constructor() {
		switch(arguments[0]) {
			case 'array': {
				if(arguments.length>=2) {
					var arr = arguments[1];
					for(var i = 0; i<arr.length; i++) {
						if((arr[0].length!=arr[i].length)&&(arr[i].length==0)) {
							console.log('ERROR: Incorrect matrix size');
							return new Matrix('NaN');
						}
					}
					this.array = arguments[1];
				}
				else {
					console.log('ERROR: No array for matrix');
					return new Matrix('NaN');
				}
				break;
			}
			case '0': {
				if(arguments.length>=3) {
					var m = arguments[1];
					var n = arguments[2];
					var arr = [];
					for(var i = 0; i<n; i++) {
						var temp = []
						for(var j = 0; j<m; j++) {
							temp.push(0);
						}
						arr.push(temp);
					}
					return new Matrix('array',arr);
				}
				console.log('ERROR: No size of null-matrix');
				return new Matrix('NaN');
			}
			case '1': {
				if(arguments.length>=2) {
					var n = arguments[1];
					var arr = [];
					for(var i = 0; i<n; i++) {
						var temp = []
						for(var j = 0; j<n; j++) {
							temp.push(i==j?1:0);
						}
						arr.push(temp);
					}
					return new Matrix('array',arr);
				}
				console.log('ERROR: No size of I matrix');
				return new Matrix('NaN');
			}
			case 'vectors': {
				if(arguments.length>=2) {
					for(var i = 1; i<arguments.length; i++) {
						if((arguments[i].size.n!=1)||
							(arguments[i].size.m!=arguments[1].size.m)) {
								console.log('ERROR: Incorrect vectors for matrix');
								return new Matrix('NaN');
						}
					}
					var arr = []
					for(var i = 1; i<arguments.length; i++) {
						arr.push(arguments[i].array[0]);
					}
					return new Matrix('array',arr);
				}
				console.log('ERROR: No vectors for matrix');
				return new Matrix('NaN');
			}
			case 'vector': {
				if(arguments.length>1) {
					return new Matrix('array',[arguments[1]]);
				}
				console.log('ERROR: No vector for matrix');
				return new Matrix('NaN');
			}
			case 'NaN': {
				return new Matrix('array',[[NaN]]);
			}
			default: {
				return new Matrix('NaN');
			}
		}
		this.size = {
			m : (this.array[0][0]!=NaN)?this.array[0].length:0,
			n: (this.array[0][0]!=NaN)?this.array.length:0,
			sqr: (this.array.length==this.array[0].length)&&(this.array[0][0]!=NaN)
		};
		this.isVector = this.size.n==1;
	}
	static input(id) {
		var rows_raw = document.getElementById(id).value.split('\n');
		if(rows_raw[0].length==0) {
			return new Matrix('0',1,1);
		}
		var rows = [];
		for(var i = 0; i<rows_raw.length;i++) {
			if(rows_raw[i].replace(/\s+/,"")!="") {
				rows.push(rows_raw[i]);
			}
		}
		for(var i =0; i<rows.length; i++) {
			rows[i] = rows[i].split(/\s+/);
			if(rows[i][0]=="") {
				rows[i].shift();
			}
			if(rows[i].length!=undefined) {
				for(var j = 0; j<rows[0].length; j++) {
					rows[i][j] = Number(rows[i][j]);
				}
			}
		}
		return new Matrix('array',rows).T();
	}
	static random() {
		switch(arguments.length) {
			case 0: {
				return new Matrix('vector',[Math.random(),Math.random()]);
				break;
			}
			case 5: {
				var m = arguments[0];
				var n = arguments[1];
				var a = arguments[2];
				var b = arguments[3];
				var p = Math.pow(10,arguments[4]);
				var M = new Matrix('0',m,n);
				for(var i = 1; i<=m; i++) {
					for(var j = 1; j<=n; j++) {
						M.set(i,j,Math.round(p*(Math.random()*(b-a)+a))/p);
					}
				}
				return M;
				break;
			}
			default: {
				console.log('Invalid arguments in \'random()\'');
				return new Matrix('NaN');
				break;
			}
		}
	}
	toStr() {
		var M = this.T();
		var str = [];
		for(var i = 0;i<this.size.n; i++) {
			str.push(this.array[i].join(' '));
		}
		str = str.join('\n');
		return str;
	}
	arr() {
		return JSON.parse(JSON.stringify(this.array));
	}
	copy() {
		return new Matrix('array',JSON.parse(JSON.stringify(this.array)));
	}
	vector(i) {
		var t = this.copy();
		if((i<1)||(i>t.size.n)) {
			console.log('ERROR: Vector\'s index out of range');
			return new Matrix('NaN');
		}
		return new Matrix('vector',t.arr()[i-1]);
	}
	_raw_tex() {
		var temp = [];
		var eps = (arguments.length>0)?arguments[0]:3;
		var out = new Matrix('array',JSON.parse(JSON.stringify(this.array)));
		var p = Math.pow(10,eps);
		for(var i = 0; i<this.size.n; i++) {
			for(var j = 0; j<this.size.m;j++) {
				out.array[i][j] = Math.round(out.array[i][j]*p)/p;
			}
		}
		for(var i = 0; i<out.size.n; i++) {
			temp.push(out.array[i].join(' & '));
		}
		return '\\begin{pmatrix} '+temp.join(' \\\\ ')+'\\end{pmatrix}';
	}
	_raw_log() {
		var log = [];
		for(var i = 0; i<this.size.n; i++) {
			log.push(JSON.stringify(this.array[i]));
		}
		console.log(log.join('\n'));
	}
	tex() {
		if(arguments.length>0) {
			return this.T()._raw_tex(arguments[0]);
		}
		return this.T()._raw_tex();
	}
	Ctex() {
		var cpy = this.copy().T();
		var temp = [];
		var p = Math.pow(10,arguments.length>0?arguments[0]:3);
		for(var i = 0; i<cpy.array.length; i++) {
			for(var j = 0; j<cpy.array[0].length; j++) {
				cpy.array[i][j] = Complex.to(cpy.array[i][j]);
				cpy.array[i][j].Re = Math.round(cpy.array[i][j].Re*p)/p;
				cpy.array[i][j].Im = Math.round(cpy.array[i][j].Im*p)/p;
			}
		}
		for(var i = 0; i<cpy.array.length; i++) {
			for(var j = 0; j<cpy.array[0].length; j++) {
				cpy.array[i][j] = Complex.to(cpy.array[i][j]).toStr();
			}
			temp.push(cpy.array[i].join(' & '));
		}
		temp = temp.join(' \\\\ ');
		return '\\begin{pmatrix} '+temp+'\\end{pmatrix}';
	}
	Clog() {
		var cpy = this.copy();
		for(var i = 0; i<cpy.array.length; i++) {
			for(var j = 0; j<cpy.array[0].length; j++) {
				cpy.array[i][j] = Complex.to(cpy.array[i][j]).toStr();
			}
		}
		cpy.log();
	}
	log() {
		this.T()._raw_log();
	}
	get(i,j) {
		switch(arguments.length) {
			case 1: {
				if(!this.isVector) {
					console.log('get: Not a vector');
					return undefined;
				}
				if((i<1)||(i>this.size.m)) {
					console.log('get: Index '+i+' out of range m = '+this.size.m);
				}
				return this.arr()[0][0];
				break;
			}
			case 2: {
				if((i<1)||(j<1)||(i>this.size.m)||(j>this.size.n)) {
					console.log('ERROR: matrix-get element ('+i+','+j+')');
					return undefined;
				}
				else {
					return this.array[j-1][i-1];
				}
				break;
			}
			default: {
				console.log('ERROR: invalid arguments in \'get()\'');
				return undefined;
			}
		}
	}
	set(i,j,e) {
		switch(arguments.length) {
			case 2: {
				if(!this.isVector) {
					console.log('set: Not a vector');
					return undefined;
				}
				if((i<1)||(i>this.size.m)) {
					console.log('set: Vector index '+i+' out of range m = '+this.size.m);
					return undefined;
				}
				this.array[0][i-1] = j;
				break;
			}
			case 3: {
				if((i<1)||(j<1)||(i>this.size.m)||(j>this.size.n)) {
					console.log('ERROR: matrix-set element ('+i+','+j+')');
				}
				else {
					this.array[j-1][i-1] = e;
				}
				break;
			}
			default: {
				console.log('ERROR: invalid arguments in \'set()\'');
			}
		}
		return undefined;
	}
	T() {
		var arr = [];
		for(var i = 0; i<this.size.m; i++) {
			var temp = [];
			for(var j = 0; j<this.size.n; j++) {
				temp.push(this.array[j][i]);
			}
			arr.push(temp);
		}
		return new Matrix('array',arr);
	}
	mult(m_) {
		if(typeof(m_)=='number') {
			var arr = JSON.parse(JSON.stringify(this.array));
			for(var i = 0; i<arr.length; i++) {
				for(var j = 0; j<arr[0].length; j++) {
					arr[i][j] *= m_;
				}
			}
			return new Matrix('array',arr);
		}
		else {
			if(m_.constructor.name=='Matrix') {
				var _m_ = this.size.m;
				var _n_ = this.size.n;
				var _k_ = m_.size.n;
				if((_n_==_k_)&&(_n_==1)) {
					return this.T().mult(m_).get(1,1);
				}
				if(_n_!=m_.size.m) {
					console.log('ERROR: Inconsistent matrixes');
					return new Matrix('NaN');
				}
				else {
					var res = new Matrix('0',_m_,_k_);
					for(var i = 1; i<=_m_; i++) {
						for(var j = 1; j<=_k_; j++) {
							var ij = 0;
							for(var k = 1; k<=_n_; k++) {
								ij += this.get(i,k)*m_.get(k,j);
							}
							res.set(i,j,ij);
						}
					}
					return res;
				}
			}
			else {
				console.log('Try to mult by '+m_.constructor.name);
				return undefined;
			}
		}
	}
	toComplex() {
		var t = this.copy();
		for(var i = 0; i<t.array.length; i++) {
			for(var j = 0; j<t.array[0].length; j++) {
				t.array[i][j] = Complex.to(t.array[i][j]);
			}
		}
		return t;
	}
	Cmult(m_) {
			var _m_ = this.size.m;
			var _n_ = this.size.n;
			var _k_ = m_.size.n;
			if(_n_!=m_.size.m) {
				console.log('ERROR: Inconsistent matrixes');
				return new Matrix('NaN');
			}
			else {
				var A = this.copy();
				for(var i = 1; i<=_m_; i++) {
					for(var j = 1; j<=_n_; j++) {
						A.set(i,j,Complex.to(A.get(i,j)));
					}
				}
				for(var i = 1; i<=_n_; i++) {
					for(var j = 1; j<=_k_; j++) {
						m_.set(i,j,Complex.to(m_.get(i,j)));
					}
				}
				var res = new Matrix('0',_m_,_k_);
				for(var i = 1; i<=_m_; i++) {
					for(var j = 1; j<=_k_; j++) {
						var ij = new Complex();
						for(var k = 1; k<=_n_; k++) {
							ij = ij.sum(A.get(i,k).mult(m_.get(k,j)));
						}
						res.set(i,j,ij);
					}
				}
				return res;
			}
	}
	minor_matrix(_j,_i) {
		var arr = [];
		for(var i=0; i<this.size.n; i++) {
			if(i!=_i-1) {
				var temp = [];
				for(var j = 0; j<this.size.m; j++) {
					if(j!=_j-1) {
						temp.push(this.array[i][j]);
					}
				}
				arr.push(temp);
			}
		}
		return new Matrix('array',arr);
	}
	det() {
		if(!this.size.sqr) {
			console.log('ERROR: Not square matrix');
			return NaN;
		}
		if(this.size.m*this.size.n==1) {
			return this.array[0][0];
		}
		var s = 0;
		for(var i = 0; i<this.size.m; i++) {
			s+=this.array[0][i]*((i%2)*(-2)+1)*this.minor_matrix(i+1,1).det();
		}
		return s;
	}
	minor(i,j) {
		return this.minor_matrix(i,j).det();
	}
	A(i,j) {
		return (((i+j)%2)*(-2)+1)*this.minor(i,j);
	}
	invert() {
		var res = new Matrix('0',this.size.m,this.size.n);
		if(this.size.n!=this.size.m) {
			console.log('ERROR: Not square matrix');
			return new Matrix('NaN');
		}
		var n = this.size.n;
		for(var i = 1; i<=n; i++) {
			for(var j = 1; j<=n; j++) {
				res.set(j,i,this.A(i,j));
			}
		}
		res = res.mult(1/this.det());
		return res;
	}
	sum(s) {
		var m = this.size.m;
		var n = this.size.n;
		if(JSON.stringify(s.size)!=JSON.stringify(this.size)) {
			console.log('ERROR: Different size matrices');
			return new Matrix('NaN');
		}
		var res = this.copy();
		for(var i = 0; i<n; i++) {
			for(var j = 0; j<m; j++) {
				res.array[i][j] += s.array[i][j];
			}
		}
		return res;
	}
	dif(s) {
		var m = this.size.m;
		var n = this.size.n;
		if(JSON.stringify(s.size)!=JSON.stringify(this.size)) {
			console.log('ERROR: Different size matrices');
			return new Matrix('NaN');
		}
		var res = this.copy();
		for(var i = 0; i<n; i++) {
			for(var j = 0; j<m; j++) {
				res.array[i][j] -= s.array[i][j];
			}
		}
		return res;
	}
	minus() {
		var m = this.size.m;
		var n = this.size.n;
		var res = this.copy();
		for(var i = 0; i<n; i++) {
			for(var j = 0; j<m; j++) {
				res.array[i][j] *=(-1);
			}
		}
		return res;
	}
	eq(M) {
		if(JSON.stringify(this.size)!=JSON.stringify(M.size)) {
			return false;
		}
		for(var i = 0; i<this.array.length; i++) {
			for(var j = 0; j<this.array[0].length; j++) {
				if(this.array[i][j]!=M.array[i][j]) {
					return false;
				}
			}
		}
		return true;
	}
	Ceq(M) {
		M = M.toComplex();
		var t = this.toComplex();
		if(JSON.stringify(t.size)!=JSON.stringify(M.size)) {
			return false;
		}
		for(var i = 0; i<t.array.length; i++) {
			for(var j = 0; j<t.array[0].length; j++) {
				if(!t.array[i][j].eq(M.array[i][j])) {
					return false;
				}
			}
		}
		return true;
	}
	LU() {
		var A = this.copy();
		var n = A.size.n;
		if((A.det()*A.get(1,1)==0)||(!A.size.sqr)) {
			console.log('No LU view');
			return {
				L: new Matrix('NaN'),
				U: new Matrix('NaN')
			};
		}
		var L = new Matrix('0',n,n);
		var U = L.copy();
		for(var i = 1; i<=n; i++) {
			for(var j = 1; j<=n; j++) {
				U.set(i,j,0);
				L.set(i,j,0);
			}
			L.set(i,i,1);
		}
		for(var i=1; i<=n; i++) {
			for(var j = 1; j<=n; j++) {
				if(i<=j) {
					var s = 0
					for(var k = 1; k<i; k++) {
						s += L.get(i,k)*U.get(k,j);
					}
					U.set(i,j,A.get(i,j)-s);
				}
				else {
					var s = 0
					for(var k = 1; k<j; k++) {
						s += L.get(i,k)*U.get(k,j);
					}
					L.set(i,j,(A.get(i,j)-s)/U.get(j,j));
				}
			}
		}
		return {
			L: L,
			U: U
		};
	}
	QR() {
		var n = this.size.n;
		var p = [];
		var P = [];
		var Q = new Matrix('1',n,n);
		P.length = n;
		p.length = n;
		var A = [];
		A.length = n;
		A[0] = this.copy();
		var n = this.size.n;
		if((!this.size.sqr)||(this.det()==0)) {
			console.log('No QR view');
			return {
				Q: new Matrix('NaN'),
				R: new Matrix('NaN')
			};
		}
		for(var k = 1; k<n; k++) {
			A[k] = new Matrix('0',n,n);
			p[k] = new Matrix('0',n,1);
			var s = 0;
			for(var l = k; l<=n; l++) {
				s += A[k-1].get(l,k)*A[k-1].get(l,k);
			}
			s = Math.sqrt(s);
			p[k].set(k,A[k-1].get(k,k)+(A[k-1].get(k,k)<0?-1:1)*s);
			for(var l = k+1; l<=n; l++) {
				p[k].set(l,A[k-1].get(l,k));
			}
			var normp = 0;
			for(var l = k; l<=n; l++) {
				normp += p[k].get(l)*p[k].get(l);
			}
			A[k].set(k,k, (A[k-1].get(k,k)<0?1:-1)*s);
			for(var j = k+1; j<=n; j++) {
				var sum = 0;
				for(var l = k; l<=n; l++) {
					sum += p[k].get(l)*A[k-1].get(l,j)
				}
				for(var i = k; i<=n; i++) {
					A[k].set(i,j,A[k-1].get(i,j)-2*p[k].get(i)*sum/normp);
				}
			}
			for(var i = 1; i<k; i++) {
				for(var j = 1; j<=n; j++) {
					A[k].set(i,j,A[k-1].get(i,j));
				}
			}
			P[k] = new Matrix('0',n,n);
			for(var i = 1; i<=n; i++) {
				for(var j = 1; j<=n; j++) {
					P[k].set(i,j,(i!=j?0:1)-2*p[k].get(i)*p[k].get(j)/normp);
				}
			}
			Q = P[k].mult(Q);
		}
		return {
			Q: Q.T(),
			R: A[A.length-1]
		};
	}
	norm() {
		var m = 0;
		for(var i = 1; i<=this.size.m; i++) {
			var s = 0
			for(var j = 1; j<= this.size.n; j++) {
				s += Math.abs(this.get(i,j));
			}
			m = s>m?s:m;
		}
		return m;
	}
	vector_norm() {
		if(!this.isVector) {
			console.log('vector_norm: Not a vector');
			return undefined;
		}
		var m = Math.abs(this.get(1));
		for(var i = 2; i<=this.size.m; i++) {
			var vi = Math.abs(this.get(i));
			m = m>vi?m:vi;
		}
		return m;
	}
	vector_push(e) {
		if(!this.isVector) {
			console.log('vector_push: Not a vector');
			return undefined;
		}
		this.array[0].push(e);
		this.size.m++;
		return undefined;
	}
	vector_pop(i) {
		if(!this.isVector) {
			console.log('vector_pop: Not a vector');
			return undefined;
		}
		if(this.size.m==1) {
			return this.get(1);
		}
		var e;
		if(arguments.length==0) {
			e = this.array[0].pop();			
		}
		else {
			if((i<1)||(i>this.size.m)) {
				console.log('vector_pop: index '+i+' out of range m = '+this.size.m);
				return undefined;
			}
			e = this.array[0].splice(i-1,1);
		}
		this.size.m--;
		return e;
	}
}