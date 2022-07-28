Matrix = (...arguments) => {

    var array = [];
    var width;
    var height;
    var square;
    var size;

    var ERROR = (msg) => console.log('Matrix error: '+msg);
    var toArray = () => JSON.parse(JSON.stringify(array));
    var toString = () => array.map(e => e.join(' ')).join('\n');
    var copy = () => Matrix(toArray());
    var tex = digits => {
        digits = digits==undefined?3:digits;
        var p = Math.pow(10,digits);
        return '\\begin{pmatrix} '
        +array.map(e => e.map(ee => Math.round(ee*p)/p).join(' & ')).join(' \\\\ ')
        +' \\end{pmatrix}';
    }
    var log = () => {
        console.log(toString());
    }
    var get = (i, j = 1) => {
        if((i<1)||(i>height)||(j<1)||(j>width)) {
            ERROR('cant get element ('+i+', '+j+')');
            return undefined;
        }
        return array[i-1][j-1];
    }
    var set = (i, j, e) => {
        if(e==undefined) {
            if(width==1) {
                e = j;
                j = 1;
            }
            else {
                ERROR('too few arguments in set()');
                return undefined;
            }
        }
        if((i<1)||(i>height)||(j<1)||(j>width)) {
            ERROR('cant set element ('+i+', '+j+')');
            return undefined;
        }
        array[i-1][j-1] = e;
        return undefined;
    }
    var T = () => {
        var arrayT = [];
        for(var i = 0; i<width; i++) {
            var tempArray = [];
            for(var j = 0; j<height; j++) {
                tempArray.push(array[j][i]);
            }
            arrayT.push(tempArray);
        }
        return Matrix(arrayT);
    }
    var add = m => {
        if((width!=m.width)||(height!=m.height)) {
            ERROR('cant add '+m.height+'x'+m.width+' to '+height+'x'+width);
            return undefined;
        }
        var M = m.copy();
        for(var i = 1; i<=height; i++) {
            for(var j = 1; j<=width; j++) {
                M.set(i, j, get(i,j)+M.get(i,j));
            }
        }
        return M;
    }
    var sub = m => {
        if((width!=m.width)||(height!=m.height)) {
            ERROR('cant substract '+m.height+'x'+m.width+' from '+height+'x'+width);
            return undefined;
        }
        var M = m.copy();
        for(var i = 1; i<=height; i++) {
            for(var j = 1; j<=width; j++) {
                M.set(i, j, get(i,j)-M.get(i,j));
            }
        }
        return M;
    }
    var mult = (m) => {
        if(typeof(m)=='number') {
            var M = copy();
            for(var i = 1; i<=height; i++) {
                for(var j = 1; j<=width; j++) {
                    M.set(i, j, get(i, j)*m);
                }
            }
            return M;
        }
        else {
            if(width!=m.height) {
                ERROR('cant multiply '+height+'x'+width+' by '+m.height+'x'+m.width);
                return undefined;
            }
            else {
                var M = Matrix(0,height,m.width);
                for(var i = 1; i<=height; i++) {
                    for(var j = 1; j<=m.width; j++) {
                        var ij = 0;
                        for(var k = 1; k<=width; k++) {
                            ij += get(i,k)*m.get(k,j);
                        }
                        M.set(i, j, ij);
                    }
                }
                return M;
            }
        }
    }
    var cut = (a,b) => {
        for(var i in a) {
            if((a[i]<1)||(a[i]>height)) {
                ERROR('no row '+a[i]);
                return undefined;
            }
        }
        for(var i in b) {
            if((b[i]<1)||(b[i]>width)) {
                ERROR('no column '+b[i]);
                return undefined;
            }
        }
        var newArray = toArray();
        var tempFunc = (arr) => Array.from(new Set(arr.map(e => e-1))).sort().reverse();
        a = tempFunc(a);
        b = tempFunc(b);
        for(var i in a) {
            newArray.splice(a[i],1);
        }
        for(var i in newArray) {
            for(var j in b) {
                newArray[i].splice(b[j],1);
            }
        }
        return Matrix(newArray);
    }
    var det = () => {
        if(!square) {
            ERROR('no det (matrix is not square)');
            return undefined;
        }
        if(size==1) {
            return get(1,1);
        }
        var s = 0;
        for(var i = 1; i<=height; i++) {
            s += get(i,1)*((i%2)?1:-1)*cut([i],[1]).det();
        }
        return s;
    }
    var minor = (a,b) => cut(a,b).det();
    var A = (i,j) => (((i+j)%2)?-1:1)*minor([i],[j]);
    var invert = () => {
        if(!square) {
            ERROR('cant invert not square matrix');
            return undefined;
        }
        var M = copy();
        for(var i = 1; i<=height; i++) {
            for(var j = 1; j<=width; j++) {
                M.set(i,j,A(i,j));
            }
        }
        return M.T().mult(1/det());
    }
    var equal = m => {
        if((height!=m.height)||(width!=m.width)) return false;
        for(var i = 1; i<=height; i++) {
            for(var j = 1; j<=width; j++) {
                if(get(i,j)!=m.get(i,j)) return false;
            }
        }
        return true;
    }
    var LU = () => {
		var n = width;
		if((det()*get(1,1)==0)||(!square)) {
			ERROR('No LU view');
			return undefined;
		}
		var U = Matrix(0,n,n);
		var L = Matrix('I',n);
		for(var i=1; i<=n; i++) {
			for(var j = 1; j<=n; j++) {
				if(i<=j) {
					var s = 0
					for(var k = 1; k<i; k++) {
						s += L.get(i,k)*U.get(k,j);
					}
					U.set(i,j,get(i,j)-s);
				}
				else {
					var s = 0
					for(var k = 1; k<j; k++) {
						s += L.get(i,k)*U.get(k,j);
					}
					L.set(i,j,(get(i,j)-s)/U.get(j,j));
				}
			}
		}
		return {
			L: L,
			U: U
		};
    }
    var QR = () => {
        if((!square)||(det()==0)) {
			ERROR('No QR view');
			return undefined;
		}
        var n = size;
		var p = [];
		var P = [];
		var Q = Matrix('I',n);
		P.length = n;
		p.length = n;
		var A = [];
		A.length = n;
		A[0] = copy();
		for(var k = 1; k<n; k++) {
			A[k] = Matrix(0,n,n);
			p[k] = Matrix(0,n,1);
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
			P[k] = Matrix(0,n,n);
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
    var norm = (index = Infinity) => {
        switch(index) {
            case 1: {
                var n = -Infinity;
                for(var j = 1; j<=width; j++) {
                    var s = 0;
                    for(var i = 1; i<=height; i++) {
                        s += Math.abs(get(i,j));
                    }
                    n = Math.max(n,s);
                }
                return n;
            }
            case 2: {
                if(width>1) {
                    ERROR('own numbers are not developed');
                    return undefined;
                }
                var s = 0;
                for(var i = 1; i<=height; i++) {
                    var temp = get(i);
                    s += temp*temp;
                }
                return Math.sqrt(s);
            }
            case Infinity: {
                var n = -Infinity;
                for(var i = 1; i<=height; i++) {
                    var s = 0;
                    for(var j = 1; j<=width; j++) {
                        s += Math.abs(get(i,j));
                    }
                    n = Math.max(n,s);
                }
                return n;
            }
            default: {
                ERROR('unknown norm '+index);
                return undefined;
            }
        }
    }
    var pop = (index = height) => {
        if(width>1) {
            ERROR('called pop() on matrix');
            return undefined;
        }
        if((index<1)||(index>height)) {
            ERROR('cant pop element '+index);
            return undefined;
        }
        return array.splice(index-1,1)[0][0];
    }
    var push = (e, index = height) => {
        if(width>1) {
            ERROR('called push() on matrix');
            return undefined;
        }
        if((index<0)||(index>height)) {
            ERROR('cant push element '+index);
            return undefined;
        }
        array.splice(index, 0, [e]);
        return undefined;
    }


    var first = arguments[0];
    switch(typeof(first)) {
        case 'number': {
            height = Number(arguments[1]);
            width = arguments.length>2?Number(arguments[2]):1;
            var tempArray = [];
            for(var i = 0; i<width; i++) {
                tempArray.push(first);
            }
            for(var i = 0; i<height; i++) {
                array.push(JSON.parse(JSON.stringify(tempArray)));
            }
            break;
        }
        case 'string': {
            if(first=='I') {
                height = arguments[1];
                width = arguments.length==3?arguments[2]:height;
                for(var j = 0; j<height; j++) {
                    var tempArray = [];
                    for(var i = 0; i<width; i++) {
                        tempArray.push(0);
                    }
                    array.push(tempArray);
                }
                for(var i = 0; i<Math.min(width,height); i++) {
                    array[i][i] = 1;
                }
            }
            else {
                var textarea = document.getElementById(first);
                var string = textarea.value;
                var strings = string.split('\n');
                for(var i in strings) {
                    strings[i] = strings[i].split(/\s/);
                    var tempArray = [];
                    for(var j in strings[i]) {
                        if(strings[i][j]!='') {
                            tempArray.push(strings[i][j]);
                        }
                    }
                    strings[i] = tempArray.map(Number);
                    if(strings[i].length) {
                        array.push(strings[i]);
                    }   
                }
            }
            break;
        }
        case 'object': {
            array = typeof(first[0])=='object'?first:[first];
            break;
        }
        default: {
            ERROR('incorrect input'+(arguments.length>1?' ('+arguments[1]+')':''));
            return undefined;
        }
    }

    for(var i in array) {
        if(array[i].length!=array[0].length) {
            return Matrix(undefined,'diifferent length of rows');
        }
    }

    width = array[0].length;
    height = array.length;
    square = height==width;
    size = square?height:undefined;

    return Object.freeze({
        height,
        width,
        square,
        size,
        toArray,
        toString,
        copy,
        tex,
        log,
        get,
        set,
        T,
        add,
        sub,
        mult,
        cut,
        det,
        minor,
        A,
        invert,
        equal,
        LU,
        QR,
        norm,
        pop,
        push
    });
}
Matrix.random = (height, width, interval, digits, ...args) => {
    if(typeof(digits)!='number') {
        args.unshift(digits);
        digits = 0;
    }
    var p = Math.pow(10,digits);
    var M = Matrix(0,height,width);
    for(var i = 1; i<=height; i++) {
        for(var j = 1; j<=width; j++) {
            M.set(i, j, Math.round(p*(Math.random()*(interval[1]-interval[0])+interval[0]))/p);
        }
    }
    var adds = {
        s: false,
        spd: false,
        dd: false,
        nd: false,
        d: false
    };
    if(!M.square) args = [];
    for(var i in args) {
        adds[args[i]] = true;
    }
    if(adds.dd) {
        adds.nd = false;
        adds.d = false;
    }
    if(adds.spd) {
        adds.d = false;
        adds.s = false;
        adds.nd = false;
    }
    if(adds.s) {
        adds.d = false;
    }
    if(adds.d&&adds.nd) {
        console.log('Matrix.random error: cant generate d and nd');
        return undefined;
    }
    if(adds.s) {
        for(var i = 1; i<=height; i++) {
            for(var j = i+1; j<=width; j++) {
                M.set(j,i,M.get(i,j));
            }
        }
    }
    if(adds.spd) {
        var p1 = Math.pow(10,Math.floor((digits+1)/2));
        for(var i = 1; i<=height; i++) {
            for(var j = 1; j<=width; j++) {
                var Mij = M.get(i,j);
                M.set(i,j,Math.round(Math.sign(Mij)*Math.sqrt(Math.abs(Mij))*p1)/p1);
            }
        }
        M = M.mult(M.T());
        for(var i = 1; i<=height; i++) {
            for(var j = 1; j<=width; j++) {
                M.set(i,j,Math.round(p*M.get(i,j))/p);
            }
        }
    }
    if(adds.nd) {
        if(M.det()==0) M = M.add(Matrix('I',M.size));
    }
    if(adds.d) {
        var line1 = Math.round(Math.random()*(M.size-1)+1);
        var line2 = line1;
        var line3 = line1;
        while(line2==line1) line2 = Math.round(Math.random()*(M.size-1)+1);
        while(line3==line1) line3 = Math.round(Math.random()*(M.size-1)+1);
        for(var i = 1; i<=M.width; i++) {
            M.set(line1,i, M.get(line2,i)+M.get(line3,i));
        }
    }
    if(adds.dd) {
        for(var i = 1; i<=M.height; i++) {
            var s = 0;
            for(var j = 1; j<=M.width; j++) {
                s+=Math.abs(M.get(i,j));
            }
            s += Math.round(Math.random())+(Math.abs(s)<interval[1]?
                Math.round(Math.random()*interval[1]+1):1);
            s *= Math.round(Math.random())?1:-1;
            s = Math.round(s*p)/p;
            M.set(i,i,s);
        }
    }
    return M;
}

Matrix.help = `Статические свойства:

    help = описание класса

    Статические методы:

    random(высота, ширина, [мин, макс], знаков_после_запятой = 0, доп_параметры)

    доп параметры: diagonal_dominance ('dd'), strict_diagonal_dominance ('sdd'),
    symmetric ('s'), simmetric_positive_definite ('spd'), non_degenerate ('nd'),
    degenerate ('d'). 

    Пример:

    Matrix.random(5, 5, [-10, 10], 's', 'nd');

    Матрица 5х5, элементы от -10 до 10, знаков после запятой 0,
    симметричная, невырожденная.

    Конструктор:

    (одномерный массив) = вектор
    (двумерный массив) = матрица
    (число, высота, ширина = 1) = матрица из первого числа размерами далее
    ('I', высота, ширина = высота) = единичная матрица
    (id_textarea) = матрица считанная из поля ввода

    Свойства:

    height = число строк
    width = число столбцов
    square = матрица квадратная
    size = размер квадратной матрицы

    Методы:

    toString() = строка из матрицы
    toArray() = массив из матрицы
    copy() = матрица
    tex() = код Latex для матрицы
    log() = вывод матрицы в консоль
    get(i, j = 1) = элемент строки i и столбца j
    set(i, j, e) установка элемента е на позицию (i,j)
    set(i, e) установка элемента е на позицию i в вектор
    T() = транспонированная матрица
    add(m) = сумма матрицы с m
    sub(m) = разность матрицы с m
    mult(m) = произведение матрицы на m
    cut([a1,a2,...,an],[b1,b2,...,bm]) = матрица с вырезанными
    строками с номерами ai и столбцами с номерами bi
    minor([a1,a2,...,an],[b1,b2,...,bm]) = минор матрицы без строк и столбцов ai,bi
    det() = определитель матрицы
    A(i,j) = алгебраическое дополнение элемента (i,j)
    invert() = обратная матрица
    equal(m) = матрица равна m
    LU() = {L,U} LU разложение матрицы
    QR() = {Q,R} QR разложение матрицы
    norm(номер = -оо) = норма вектора / подчинённая норма матрицы
    pop(индекс = длина вектора) = элемент вектора, из вектора удаляется
    push(елемент, индекс = последний) установка элемента в вектор после индекса`;

/* 
    Статические свойства:

    help = описание класса

    Статические методы:

    random(высота, ширина, [мин, макс], знаков_после_запятой = 0, доп_параметры)

    доп параметры: diagonal_dominance ('dd'), strict_diagonal_dominance ('sdd'),
    symmetric ('s'), simmetric_positive_definite ('spd'), non_degenerate ('nd'),
    degenerate ('d'). 

    Пример:

    Matrix.random(5, 5, [-10, 10], 's', 'nd');

    Матрица 5х5, элементы от -10 до 10, знаков после запятой 0,
    симметричная, невырожденная.

    Конструктор:

    (одномерный массив) = вектор
    (двумерный массив) = матрица
    (число, высота, ширина = 1) = матрица из первого числа размерами далее
    ('I', высота, ширина = высота) = единичная матрица
    (id_textarea) = матрица считанная из поля ввода

    Свойства:

    height = число строк
    width = число столбцов
    square = матрица квадратная
    size = размер квадратной матрицы

    Методы:

    toString() = строка из матрицы
    toArray() = массив из матрицы
    copy() = матрица
    tex() = код Latex для матрицы
    log() = вывод матрицы в консоль
    get(i, j = 1) = элемент строки i и столбца j
    set(i, j, e) установка элемента е на позицию (i,j)
    set(i, e) установка элемента е на позицию i в вектор
    T() = транспонированная матрица
    add(m) = сумма матрицы с m
    sub(m) = разность матрицы с m
    mult(m) = произведение матрицы на m
    cut([a1,a2,...,an],[b1,b2,...,bm]) = матрица с вырезанными
    строками с номерами ai и столбцами с номерами bi
    minor([a1,a2,...,an],[b1,b2,...,bm]) = минор матрицы без строк и столбцов ai,bi
    det() = определитель матрицы
    A(i,j) = алгебраическое дополнение элемента (i,j)
    invert() = обратная матрица
    equal(m) = матрица равна m
    LU() = {L,U} LU разложение матрицы
    QR() = {Q,R} QR разложение матрицы
    norm(номер = -оо) = норма вектора / подчинённая норма матрицы
    pop(индекс = длина вектора) = элемент вектора, из вектора удаляется
    push(елемент, индекс = последний) установка элемента в вектор после индекса
*/