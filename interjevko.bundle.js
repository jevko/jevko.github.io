let extend = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((s)=>s ? parseInt(s, 36) : 1
);
for(let i = 1; i < extend.length; i++)extend[i] += extend[i - 1];
function isExtendingChar(code1) {
    for(let i2 = 1; i2 < extend.length; i2 += 2)if (extend[i2] > code1) return extend[i2 - 1] <= code1;
    return false;
}
function isRegionalIndicator(code2) {
    return code2 >= 127462 && code2 <= 127487;
}
function findClusterBreak(str, pos, forward = true, includeExtending = true) {
    return (forward ? nextClusterBreak : prevClusterBreak)(str, pos, includeExtending);
}
function nextClusterBreak(str, pos, includeExtending) {
    if (pos == str.length) return pos;
    if (pos && surrogateLow(str.charCodeAt(pos)) && surrogateHigh(str.charCodeAt(pos - 1))) pos--;
    let prev = codePointAt(str, pos);
    pos += codePointSize(prev);
    while(pos < str.length){
        let next = codePointAt(str, pos);
        if (prev == 8205 || next == 8205 || includeExtending && isExtendingChar(next)) {
            pos += codePointSize(next);
            prev = next;
        } else if (isRegionalIndicator(next)) {
            let countBefore = 0, i3 = pos - 2;
            while(i3 >= 0 && isRegionalIndicator(codePointAt(str, i3))){
                countBefore++;
                i3 -= 2;
            }
            if (countBefore % 2 == 0) break;
            else pos += 2;
        } else {
            break;
        }
    }
    return pos;
}
function prevClusterBreak(str, pos, includeExtending) {
    while(pos > 0){
        let found = nextClusterBreak(str, pos - 2, includeExtending);
        if (found < pos) return found;
        pos--;
    }
    return 0;
}
function surrogateLow(ch) {
    return ch >= 56320 && ch < 57344;
}
function surrogateHigh(ch) {
    return ch >= 55296 && ch < 56320;
}
function codePointAt(str, pos) {
    let code0 = str.charCodeAt(pos);
    if (!surrogateHigh(code0) || pos + 1 == str.length) return code0;
    let code1 = str.charCodeAt(pos + 1);
    if (!surrogateLow(code1)) return code0;
    return (code0 - 55296 << 10) + (code1 - 56320) + 65536;
}
function fromCodePoint(code3) {
    if (code3 <= 65535) return String.fromCharCode(code3);
    code3 -= 65536;
    return String.fromCharCode((code3 >> 10) + 55296, (code3 & 1023) + 56320);
}
function codePointSize(code4) {
    return code4 < 65536 ? 1 : 2;
}
function countColumn(string1, tabSize, to = string1.length) {
    let n = 0;
    for(let i4 = 0; i4 < to;){
        if (string1.charCodeAt(i4) == 9) {
            n += tabSize - n % tabSize;
            i4++;
        } else {
            n++;
            i4 = findClusterBreak(string1, i4);
        }
    }
    return n;
}
function findColumn(string2, col, tabSize, strict) {
    for(let i5 = 0, n = 0;;){
        if (n >= col) return i5;
        if (i5 == string2.length) break;
        n += string2.charCodeAt(i5) == 9 ? tabSize - n % tabSize : 1;
        i5 = findClusterBreak(string2, i5);
    }
    return strict === true ? -1 : string2.length;
}
class Text {
    constructor(){
    }
    lineAt(pos) {
        if (pos < 0 || pos > this.length) throw new RangeError(`Invalid position ${pos} in document of length ${this.length}`);
        return this.lineInner(pos, false, 1, 0);
    }
    line(n) {
        if (n < 1 || n > this.lines) throw new RangeError(`Invalid line number ${n} in ${this.lines}-line document`);
        return this.lineInner(n, true, 1, 0);
    }
    replace(from, to, text) {
        let parts = [];
        this.decompose(0, from, parts, 2);
        if (text.length) text.decompose(0, text.length, parts, 1 | 2);
        this.decompose(to, this.length, parts, 1);
        return TextNode.from(parts, this.length - (to - from) + text.length);
    }
    append(other) {
        return this.replace(this.length, this.length, other);
    }
    slice(from, to = this.length) {
        let parts = [];
        this.decompose(from, to, parts, 0);
        return TextNode.from(parts, to - from);
    }
    eq(other) {
        if (other == this) return true;
        if (other.length != this.length || other.lines != this.lines) return false;
        let start = this.scanIdentical(other, 1), end = this.length - this.scanIdentical(other, -1);
        let a = new RawTextCursor(this), b = new RawTextCursor(other);
        for(let skip = start, pos = start;;){
            a.next(skip);
            b.next(skip);
            skip = 0;
            if (a.lineBreak != b.lineBreak || a.done != b.done || a.value != b.value) return false;
            pos += a.value.length;
            if (a.done || pos >= end) return true;
        }
    }
    iter(dir = 1) {
        return new RawTextCursor(this, dir);
    }
    iterRange(from, to = this.length) {
        return new PartialTextCursor(this, from, to);
    }
    iterLines(from, to) {
        let inner;
        if (from == null) {
            inner = this.iter();
        } else {
            if (to == null) to = this.lines + 1;
            let start = this.line(from).from;
            inner = this.iterRange(start, Math.max(start, to == this.lines + 1 ? this.length : to <= 1 ? 0 : this.line(to - 1).to));
        }
        return new LineCursor(inner);
    }
    toString() {
        return this.sliceString(0);
    }
    toJSON() {
        let lines = [];
        this.flatten(lines);
        return lines;
    }
    static of(text) {
        if (text.length == 0) throw new RangeError("A document must have at least one line");
        if (text.length == 1 && !text[0]) return Text.empty;
        return text.length <= 32 ? new TextLeaf(text) : TextNode.from(TextLeaf.split(text, []));
    }
}
class TextLeaf extends Text {
    constructor(text, length = textLength(text)){
        super();
        this.text = text;
        this.length = length;
    }
    get lines() {
        return this.text.length;
    }
    get children() {
        return null;
    }
    lineInner(target, isLine, line, offset) {
        for(let i6 = 0;; i6++){
            let string3 = this.text[i6], end = offset + string3.length;
            if ((isLine ? line : end) >= target) return new Line(offset, end, line, string3);
            offset = end + 1;
            line++;
        }
    }
    decompose(from, to, target, open) {
        let text = from <= 0 && to >= this.length ? this : new TextLeaf(sliceText(this.text, from, to), Math.min(to, this.length) - Math.max(0, from));
        if (open & 1) {
            let prev = target.pop();
            let joined = appendText(text.text, prev.text.slice(), 0, text.length);
            if (joined.length <= 32) {
                target.push(new TextLeaf(joined, prev.length + text.length));
            } else {
                let mid = joined.length >> 1;
                target.push(new TextLeaf(joined.slice(0, mid)), new TextLeaf(joined.slice(mid)));
            }
        } else {
            target.push(text);
        }
    }
    replace(from, to, text) {
        if (!(text instanceof TextLeaf)) return super.replace(from, to, text);
        let lines = appendText(this.text, appendText(text.text, sliceText(this.text, 0, from)), to);
        let newLen = this.length + text.length - (to - from);
        if (lines.length <= 32) return new TextLeaf(lines, newLen);
        return TextNode.from(TextLeaf.split(lines, []), newLen);
    }
    sliceString(from, to = this.length, lineSep = "\n") {
        let result = "";
        for(let pos = 0, i7 = 0; pos <= to && i7 < this.text.length; i7++){
            let line = this.text[i7], end = pos + line.length;
            if (pos > from && i7) result += lineSep;
            if (from < end && to > pos) result += line.slice(Math.max(0, from - pos), to - pos);
            pos = end + 1;
        }
        return result;
    }
    flatten(target) {
        for (let line of this.text)target.push(line);
    }
    scanIdentical() {
        return 0;
    }
    static split(text, target) {
        let part = [], len = -1;
        for (let line of text){
            part.push(line);
            len += line.length + 1;
            if (part.length == 32) {
                target.push(new TextLeaf(part, len));
                part = [];
                len = -1;
            }
        }
        if (len > -1) target.push(new TextLeaf(part, len));
        return target;
    }
}
class TextNode extends Text {
    constructor(children, length){
        super();
        this.children = children;
        this.length = length;
        this.lines = 0;
        for (let child of children)this.lines += child.lines;
    }
    lineInner(target, isLine, line, offset) {
        for(let i8 = 0;; i8++){
            let child = this.children[i8], end = offset + child.length, endLine = line + child.lines - 1;
            if ((isLine ? endLine : end) >= target) return child.lineInner(target, isLine, line, offset);
            offset = end + 1;
            line = endLine + 1;
        }
    }
    decompose(from, to, target, open) {
        for(let i9 = 0, pos = 0; pos <= to && i9 < this.children.length; i9++){
            let child = this.children[i9], end = pos + child.length;
            if (from <= end && to >= pos) {
                let childOpen = open & ((pos <= from ? 1 : 0) | (end >= to ? 2 : 0));
                if (pos >= from && end <= to && !childOpen) target.push(child);
                else child.decompose(from - pos, to - pos, target, childOpen);
            }
            pos = end + 1;
        }
    }
    replace(from, to, text) {
        if (text.lines < this.lines) for(let i10 = 0, pos = 0; i10 < this.children.length; i10++){
            let child = this.children[i10], end = pos + child.length;
            if (from >= pos && to <= end) {
                let updated = child.replace(from - pos, to - pos, text);
                let totalLines = this.lines - child.lines + updated.lines;
                if (updated.lines < totalLines >> 5 - 1 && updated.lines > totalLines >> 5 + 1) {
                    let copy = this.children.slice();
                    copy[i10] = updated;
                    return new TextNode(copy, this.length - (to - from) + text.length);
                }
                return super.replace(pos, end, updated);
            }
            pos = end + 1;
        }
        return super.replace(from, to, text);
    }
    sliceString(from, to = this.length, lineSep = "\n") {
        let result = "";
        for(let i11 = 0, pos = 0; i11 < this.children.length && pos <= to; i11++){
            let child = this.children[i11], end = pos + child.length;
            if (pos > from && i11) result += lineSep;
            if (from < end && to > pos) result += child.sliceString(from - pos, to - pos, lineSep);
            pos = end + 1;
        }
        return result;
    }
    flatten(target) {
        for (let child of this.children)child.flatten(target);
    }
    scanIdentical(other, dir) {
        if (!(other instanceof TextNode)) return 0;
        let length = 0;
        let [iA, iB, eA, eB] = dir > 0 ? [
            0,
            0,
            this.children.length,
            other.children.length
        ] : [
            this.children.length - 1,
            other.children.length - 1,
            -1,
            -1
        ];
        for(;; iA += dir, iB += dir){
            if (iA == eA || iB == eB) return length;
            let chA = this.children[iA], chB = other.children[iB];
            if (chA != chB) return length + chA.scanIdentical(chB, dir);
            length += chA.length + 1;
        }
    }
    static from(children, length = children.reduce((l, ch)=>l + ch.length + 1
    , -1)) {
        let lines = 0;
        for (let ch of children)lines += ch.lines;
        if (lines < 32) {
            let flat = [];
            for (let ch of children)ch.flatten(flat);
            return new TextLeaf(flat, length);
        }
        let chunk = Math.max(32, lines >> 5), maxChunk = chunk << 1, minChunk = chunk >> 1;
        let chunked = [], currentLines = 0, currentLen = -1, currentChunk = [];
        function add1(child) {
            let last;
            if (child.lines > maxChunk && child instanceof TextNode) {
                for (let node of child.children)add1(node);
            } else if (child.lines > minChunk && (currentLines > minChunk || !currentLines)) {
                flush();
                chunked.push(child);
            } else if (child instanceof TextLeaf && currentLines && (last = currentChunk[currentChunk.length - 1]) instanceof TextLeaf && child.lines + last.lines <= 32) {
                currentLines += child.lines;
                currentLen += child.length + 1;
                currentChunk[currentChunk.length - 1] = new TextLeaf(last.text.concat(child.text), last.length + 1 + child.length);
            } else {
                if (currentLines + child.lines > chunk) flush();
                currentLines += child.lines;
                currentLen += child.length + 1;
                currentChunk.push(child);
            }
        }
        function flush() {
            if (currentLines == 0) return;
            chunked.push(currentChunk.length == 1 ? currentChunk[0] : TextNode.from(currentChunk, currentLen));
            currentLen = -1;
            currentLines = currentChunk.length = 0;
        }
        for (let child1 of children)add1(child1);
        flush();
        return chunked.length == 1 ? chunked[0] : new TextNode(chunked, length);
    }
}
Text.empty = new TextLeaf([
    ""
], 0);
function textLength(text) {
    let length = -1;
    for (let line of text)length += line.length + 1;
    return length;
}
function appendText(text, target, from = 0, to = 1000000000) {
    for(let pos = 0, i12 = 0, first = true; i12 < text.length && pos <= to; i12++){
        let line = text[i12], end = pos + line.length;
        if (end >= from) {
            if (end > to) line = line.slice(0, to - pos);
            if (pos < from) line = line.slice(from - pos);
            if (first) {
                target[target.length - 1] += line;
                first = false;
            } else target.push(line);
        }
        pos = end + 1;
    }
    return target;
}
function sliceText(text, from, to) {
    return appendText(text, [
        ""
    ], from, to);
}
class RawTextCursor {
    constructor(text, dir = 1){
        this.dir = dir;
        this.done = false;
        this.lineBreak = false;
        this.value = "";
        this.nodes = [
            text
        ];
        this.offsets = [
            dir > 0 ? 1 : (text instanceof TextLeaf ? text.text.length : text.children.length) << 1
        ];
    }
    nextInner(skip, dir) {
        this.done = this.lineBreak = false;
        for(;;){
            let last = this.nodes.length - 1;
            let top1 = this.nodes[last], offsetValue = this.offsets[last], offset = offsetValue >> 1;
            let size = top1 instanceof TextLeaf ? top1.text.length : top1.children.length;
            if (offset == (dir > 0 ? size : 0)) {
                if (last == 0) {
                    this.done = true;
                    this.value = "";
                    return this;
                }
                if (dir > 0) this.offsets[last - 1]++;
                this.nodes.pop();
                this.offsets.pop();
            } else if ((offsetValue & 1) == (dir > 0 ? 0 : 1)) {
                this.offsets[last] += dir;
                if (skip == 0) {
                    this.lineBreak = true;
                    this.value = "\n";
                    return this;
                }
                skip--;
            } else if (top1 instanceof TextLeaf) {
                let next = top1.text[offset + (dir < 0 ? -1 : 0)];
                this.offsets[last] += dir;
                if (next.length > Math.max(0, skip)) {
                    this.value = skip == 0 ? next : dir > 0 ? next.slice(skip) : next.slice(0, next.length - skip);
                    return this;
                }
                skip -= next.length;
            } else {
                let next = top1.children[offset + (dir < 0 ? -1 : 0)];
                if (skip > next.length) {
                    skip -= next.length;
                    this.offsets[last] += dir;
                } else {
                    if (dir < 0) this.offsets[last]--;
                    this.nodes.push(next);
                    this.offsets.push(dir > 0 ? 1 : (next instanceof TextLeaf ? next.text.length : next.children.length) << 1);
                }
            }
        }
    }
    next(skip = 0) {
        if (skip < 0) {
            this.nextInner(-skip, -this.dir);
            skip = this.value.length;
        }
        return this.nextInner(skip, this.dir);
    }
}
class PartialTextCursor {
    constructor(text, start, end){
        this.value = "";
        this.done = false;
        this.cursor = new RawTextCursor(text, start > end ? -1 : 1);
        this.pos = start > end ? text.length : 0;
        this.from = Math.min(start, end);
        this.to = Math.max(start, end);
    }
    nextInner(skip, dir) {
        if (dir < 0 ? this.pos <= this.from : this.pos >= this.to) {
            this.value = "";
            this.done = true;
            return this;
        }
        skip += Math.max(0, dir < 0 ? this.pos - this.to : this.from - this.pos);
        let limit = dir < 0 ? this.pos - this.from : this.to - this.pos;
        if (skip > limit) skip = limit;
        limit -= skip;
        let { value  } = this.cursor.next(skip);
        this.pos += (value.length + skip) * dir;
        this.value = value.length <= limit ? value : dir < 0 ? value.slice(value.length - limit) : value.slice(0, limit);
        this.done = !this.value;
        return this;
    }
    next(skip = 0) {
        if (skip < 0) skip = Math.max(skip, this.from - this.pos);
        else if (skip > 0) skip = Math.min(skip, this.to - this.pos);
        return this.nextInner(skip, this.cursor.dir);
    }
    get lineBreak() {
        return this.cursor.lineBreak && this.value != "";
    }
}
class LineCursor {
    constructor(inner){
        this.inner = inner;
        this.afterBreak = true;
        this.value = "";
        this.done = false;
    }
    next(skip = 0) {
        let { done , lineBreak , value  } = this.inner.next(skip);
        if (done) {
            this.done = true;
            this.value = "";
        } else if (lineBreak) {
            if (this.afterBreak) {
                this.value = "";
            } else {
                this.afterBreak = true;
                this.next();
            }
        } else {
            this.value = value;
            this.afterBreak = false;
        }
        return this;
    }
    get lineBreak() {
        return false;
    }
}
if (typeof Symbol != "undefined") {
    Text.prototype[Symbol.iterator] = function() {
        return this.iter();
    };
    RawTextCursor.prototype[Symbol.iterator] = PartialTextCursor.prototype[Symbol.iterator] = LineCursor.prototype[Symbol.iterator] = function() {
        return this;
    };
}
class Line {
    constructor(from, to, number1, text){
        this.from = from;
        this.to = to;
        this.number = number1;
        this.text = text;
    }
    get length() {
        return this.to - this.from;
    }
}
const DefaultSplit = /\r\n?|\n/;
var MapMode = function(MapMode1) {
    MapMode1[MapMode1["Simple"] = 0] = "Simple";
    MapMode1[MapMode1["TrackDel"] = 1] = "TrackDel";
    MapMode1[MapMode1["TrackBefore"] = 2] = "TrackBefore";
    MapMode1[MapMode1["TrackAfter"] = 3] = "TrackAfter";
    return MapMode1;
}(MapMode || (MapMode = {
}));
class ChangeDesc {
    constructor(sections){
        this.sections = sections;
    }
    get length() {
        let result = 0;
        for(let i13 = 0; i13 < this.sections.length; i13 += 2)result += this.sections[i13];
        return result;
    }
    get newLength() {
        let result = 0;
        for(let i14 = 0; i14 < this.sections.length; i14 += 2){
            let ins = this.sections[i14 + 1];
            result += ins < 0 ? this.sections[i14] : ins;
        }
        return result;
    }
    get empty() {
        return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
    }
    iterGaps(f) {
        for(let i15 = 0, posA = 0, posB = 0; i15 < this.sections.length;){
            let len = this.sections[i15++], ins = this.sections[i15++];
            if (ins < 0) {
                f(posA, posB, len);
                posB += len;
            } else {
                posB += ins;
            }
            posA += len;
        }
    }
    iterChangedRanges(f, individual = false) {
        iterChanges(this, f, individual);
    }
    get invertedDesc() {
        let sections = [];
        for(let i16 = 0; i16 < this.sections.length;){
            let len = this.sections[i16++], ins = this.sections[i16++];
            if (ins < 0) sections.push(len, ins);
            else sections.push(ins, len);
        }
        return new ChangeDesc(sections);
    }
    composeDesc(other) {
        return this.empty ? other : other.empty ? this : composeSets(this, other);
    }
    mapDesc(other, before = false) {
        return other.empty ? this : mapSet(this, other, before);
    }
    mapPos(pos, assoc = -1, mode = MapMode.Simple) {
        let posA = 0, posB = 0;
        for(let i17 = 0; i17 < this.sections.length;){
            let len = this.sections[i17++], ins = this.sections[i17++], endA = posA + len;
            if (ins < 0) {
                if (endA > pos) return posB + (pos - posA);
                posB += len;
            } else {
                if (mode != MapMode.Simple && endA >= pos && (mode == MapMode.TrackDel && posA < pos && endA > pos || mode == MapMode.TrackBefore && posA < pos || mode == MapMode.TrackAfter && endA > pos)) return null;
                if (endA > pos || endA == pos && assoc < 0 && !len) return pos == posA || assoc < 0 ? posB : posB + ins;
                posB += ins;
            }
            posA = endA;
        }
        if (pos > posA) throw new RangeError(`Position ${pos} is out of range for changeset of length ${posA}`);
        return posB;
    }
    touchesRange(from, to = from) {
        for(let i18 = 0, pos = 0; i18 < this.sections.length && pos <= to;){
            let len = this.sections[i18++], ins = this.sections[i18++], end = pos + len;
            if (ins >= 0 && pos <= to && end >= from) return pos < from && end > to ? "cover" : true;
            pos = end;
        }
        return false;
    }
    toString() {
        let result = "";
        for(let i19 = 0; i19 < this.sections.length;){
            let len = this.sections[i19++], ins = this.sections[i19++];
            result += (result ? " " : "") + len + (ins >= 0 ? ":" + ins : "");
        }
        return result;
    }
    toJSON() {
        return this.sections;
    }
    static fromJSON(json1) {
        if (!Array.isArray(json1) || json1.length % 2 || json1.some((a)=>typeof a != "number"
        )) throw new RangeError("Invalid JSON representation of ChangeDesc");
        return new ChangeDesc(json1);
    }
}
class ChangeSet extends ChangeDesc {
    constructor(sections, inserted){
        super(sections);
        this.inserted = inserted;
    }
    apply(doc1) {
        if (this.length != doc1.length) throw new RangeError("Applying change set to a document with the wrong length");
        iterChanges(this, (fromA, toA, fromB, _toB, text)=>doc1 = doc1.replace(fromB, fromB + (toA - fromA), text)
        , false);
        return doc1;
    }
    mapDesc(other, before = false) {
        return mapSet(this, other, before, true);
    }
    invert(doc2) {
        let sections = this.sections.slice(), inserted = [];
        for(let i20 = 0, pos = 0; i20 < sections.length; i20 += 2){
            let len = sections[i20], ins = sections[i20 + 1];
            if (ins >= 0) {
                sections[i20] = ins;
                sections[i20 + 1] = len;
                let index = i20 >> 1;
                while(inserted.length < index)inserted.push(Text.empty);
                inserted.push(len ? doc2.slice(pos, pos + len) : Text.empty);
            }
            pos += len;
        }
        return new ChangeSet(sections, inserted);
    }
    compose(other) {
        return this.empty ? other : other.empty ? this : composeSets(this, other, true);
    }
    map(other, before = false) {
        return other.empty ? this : mapSet(this, other, before, true);
    }
    iterChanges(f, individual = false) {
        iterChanges(this, f, individual);
    }
    get desc() {
        return new ChangeDesc(this.sections);
    }
    filter(ranges) {
        let resultSections = [], resultInserted = [], filteredSections = [];
        let iter = new SectionIter(this);
        done: for(let i21 = 0, pos = 0;;){
            let next = i21 == ranges.length ? 1000000000 : ranges[i21++];
            while(pos < next || pos == next && iter.len == 0){
                if (iter.done) break done;
                let len = Math.min(iter.len, next - pos);
                addSection(filteredSections, len, -1);
                let ins = iter.ins == -1 ? -1 : iter.off == 0 ? iter.ins : 0;
                addSection(resultSections, len, ins);
                if (ins > 0) addInsert(resultInserted, resultSections, iter.text);
                iter.forward(len);
                pos += len;
            }
            let end = ranges[i21++];
            while(pos < end){
                if (iter.done) break done;
                let len = Math.min(iter.len, end - pos);
                addSection(resultSections, len, -1);
                addSection(filteredSections, len, iter.ins == -1 ? -1 : iter.off == 0 ? iter.ins : 0);
                iter.forward(len);
                pos += len;
            }
        }
        return {
            changes: new ChangeSet(resultSections, resultInserted),
            filtered: new ChangeDesc(filteredSections)
        };
    }
    toJSON() {
        let parts = [];
        for(let i22 = 0; i22 < this.sections.length; i22 += 2){
            let len = this.sections[i22], ins = this.sections[i22 + 1];
            if (ins < 0) parts.push(len);
            else if (ins == 0) parts.push([
                len
            ]);
            else parts.push([
                len
            ].concat(this.inserted[i22 >> 1].toJSON()));
        }
        return parts;
    }
    static of(changes, length, lineSep) {
        let sections = [], inserted = [], pos = 0;
        let total = null;
        function flush(force = false) {
            if (!force && !sections.length) return;
            if (pos < length) addSection(sections, length - pos, -1);
            let set = new ChangeSet(sections, inserted);
            total = total ? total.compose(set.map(total)) : set;
            sections = [];
            inserted = [];
            pos = 0;
        }
        function process(spec) {
            if (Array.isArray(spec)) {
                for (let sub of spec)process(sub);
            } else if (spec instanceof ChangeSet) {
                if (spec.length != length) throw new RangeError(`Mismatched change set length (got ${spec.length}, expected ${length})`);
                flush();
                total = total ? total.compose(spec.map(total)) : spec;
            } else {
                let { from , to =from , insert: insert1  } = spec;
                if (from > to || from < 0 || to > length) throw new RangeError(`Invalid change range ${from} to ${to} (in doc of length ${length})`);
                let insText = !insert1 ? Text.empty : typeof insert1 == "string" ? Text.of(insert1.split(lineSep || DefaultSplit)) : insert1;
                let insLen = insText.length;
                if (from == to && insLen == 0) return;
                if (from < pos) flush();
                if (from > pos) addSection(sections, from - pos, -1);
                addSection(sections, to - from, insLen);
                addInsert(inserted, sections, insText);
                pos = to;
            }
        }
        process(changes);
        flush(!total);
        return total;
    }
    static empty(length) {
        return new ChangeSet(length ? [
            length,
            -1
        ] : [], []);
    }
    static fromJSON(json2) {
        if (!Array.isArray(json2)) throw new RangeError("Invalid JSON representation of ChangeSet");
        let sections = [], inserted = [];
        for(let i23 = 0; i23 < json2.length; i23++){
            let part = json2[i23];
            if (typeof part == "number") {
                sections.push(part, -1);
            } else if (!Array.isArray(part) || typeof part[0] != "number" || part.some((e, i24)=>i24 && typeof e != "string"
            )) {
                throw new RangeError("Invalid JSON representation of ChangeSet");
            } else if (part.length == 1) {
                sections.push(part[0], 0);
            } else {
                while(inserted.length < i23)inserted.push(Text.empty);
                inserted[i23] = Text.of(part.slice(1));
                sections.push(part[0], inserted[i23].length);
            }
        }
        return new ChangeSet(sections, inserted);
    }
}
function addSection(sections, len, ins, forceJoin = false) {
    if (len == 0 && ins <= 0) return;
    let last = sections.length - 2;
    if (last >= 0 && ins <= 0 && ins == sections[last + 1]) sections[last] += len;
    else if (len == 0 && sections[last] == 0) sections[last + 1] += ins;
    else if (forceJoin) {
        sections[last] += len;
        sections[last + 1] += ins;
    } else sections.push(len, ins);
}
function addInsert(values, sections, value) {
    if (value.length == 0) return;
    let index = sections.length - 2 >> 1;
    if (index < values.length) {
        values[values.length - 1] = values[values.length - 1].append(value);
    } else {
        while(values.length < index)values.push(Text.empty);
        values.push(value);
    }
}
function iterChanges(desc, f, individual) {
    let inserted = desc.inserted;
    for(let posA = 0, posB = 0, i25 = 0; i25 < desc.sections.length;){
        let len = desc.sections[i25++], ins = desc.sections[i25++];
        if (ins < 0) {
            posA += len;
            posB += len;
        } else {
            let endA = posA, endB = posB, text = Text.empty;
            for(;;){
                endA += len;
                endB += ins;
                if (ins && inserted) text = text.append(inserted[i25 - 2 >> 1]);
                if (individual || i25 == desc.sections.length || desc.sections[i25 + 1] < 0) break;
                len = desc.sections[i25++];
                ins = desc.sections[i25++];
            }
            f(posA, endA, posB, endB, text);
            posA = endA;
            posB = endB;
        }
    }
}
function mapSet(setA, setB, before, mkSet = false) {
    let sections = [], insert2 = mkSet ? [] : null;
    let a = new SectionIter(setA), b = new SectionIter(setB);
    for(let posA = 0, posB = 0;;){
        if (a.ins == -1) {
            posA += a.len;
            a.next();
        } else if (b.ins == -1 && posB < posA) {
            let skip = Math.min(b.len, posA - posB);
            b.forward(skip);
            addSection(sections, skip, -1);
            posB += skip;
        } else if (b.ins >= 0 && (a.done || posB < posA || posB == posA && (b.len < a.len || b.len == a.len && !before))) {
            addSection(sections, b.ins, -1);
            while(posA > posB && !a.done && posA + a.len < posB + b.len){
                posA += a.len;
                a.next();
            }
            posB += b.len;
            b.next();
        } else if (a.ins >= 0) {
            let len = 0, end = posA + a.len;
            for(;;){
                if (b.ins >= 0 && posB > posA && posB + b.len < end) {
                    len += b.ins;
                    posB += b.len;
                    b.next();
                } else if (b.ins == -1 && posB < end) {
                    let skip = Math.min(b.len, end - posB);
                    len += skip;
                    b.forward(skip);
                    posB += skip;
                } else {
                    break;
                }
            }
            addSection(sections, len, a.ins);
            if (insert2) addInsert(insert2, sections, a.text);
            posA = end;
            a.next();
        } else if (a.done && b.done) {
            return insert2 ? new ChangeSet(sections, insert2) : new ChangeDesc(sections);
        } else {
            throw new Error("Mismatched change set lengths");
        }
    }
}
function composeSets(setA, setB, mkSet = false) {
    let sections = [];
    let insert3 = mkSet ? [] : null;
    let a = new SectionIter(setA), b = new SectionIter(setB);
    for(let open = false;;){
        if (a.done && b.done) {
            return insert3 ? new ChangeSet(sections, insert3) : new ChangeDesc(sections);
        } else if (a.ins == 0) {
            addSection(sections, a.len, 0, open);
            a.next();
        } else if (b.len == 0 && !b.done) {
            addSection(sections, 0, b.ins, open);
            if (insert3) addInsert(insert3, sections, b.text);
            b.next();
        } else if (a.done || b.done) {
            throw new Error("Mismatched change set lengths");
        } else {
            let len = Math.min(a.len2, b.len), sectionLen = sections.length;
            if (a.ins == -1) {
                let insB = b.ins == -1 ? -1 : b.off ? 0 : b.ins;
                addSection(sections, len, insB, open);
                if (insert3 && insB) addInsert(insert3, sections, b.text);
            } else if (b.ins == -1) {
                addSection(sections, a.off ? 0 : a.len, len, open);
                if (insert3) addInsert(insert3, sections, a.textBit(len));
            } else {
                addSection(sections, a.off ? 0 : a.len, b.off ? 0 : b.ins, open);
                if (insert3 && !b.off) addInsert(insert3, sections, b.text);
            }
            open = (a.ins > len || b.ins >= 0 && b.len > len) && (open || sections.length > sectionLen);
            a.forward2(len);
            b.forward(len);
        }
    }
}
class SectionIter {
    constructor(set){
        this.set = set;
        this.i = 0;
        this.next();
    }
    next() {
        let { sections  } = this.set;
        if (this.i < sections.length) {
            this.len = sections[this.i++];
            this.ins = sections[this.i++];
        } else {
            this.len = 0;
            this.ins = -2;
        }
        this.off = 0;
    }
    get done() {
        return this.ins == -2;
    }
    get len2() {
        return this.ins < 0 ? this.len : this.ins;
    }
    get text() {
        let { inserted  } = this.set, index = this.i - 2 >> 1;
        return index >= inserted.length ? Text.empty : inserted[index];
    }
    textBit(len) {
        let { inserted  } = this.set, index = this.i - 2 >> 1;
        return index >= inserted.length && !len ? Text.empty : inserted[index].slice(this.off, len == null ? undefined : this.off + len);
    }
    forward(len) {
        if (len == this.len) this.next();
        else {
            this.len -= len;
            this.off += len;
        }
    }
    forward2(len) {
        if (this.ins == -1) this.forward(len);
        else if (len == this.ins) this.next();
        else {
            this.ins -= len;
            this.off += len;
        }
    }
}
class SelectionRange {
    constructor(from, to, flags){
        this.from = from;
        this.to = to;
        this.flags = flags;
    }
    get anchor() {
        return this.flags & 16 ? this.to : this.from;
    }
    get head() {
        return this.flags & 16 ? this.from : this.to;
    }
    get empty() {
        return this.from == this.to;
    }
    get assoc() {
        return this.flags & 4 ? -1 : this.flags & 8 ? 1 : 0;
    }
    get bidiLevel() {
        let level = this.flags & 3;
        return level == 3 ? null : level;
    }
    get goalColumn() {
        let value = this.flags >> 5;
        return value == 33554431 ? undefined : value;
    }
    map(change, assoc = -1) {
        let from = change.mapPos(this.from, assoc), to = change.mapPos(this.to, assoc);
        return from == this.from && to == this.to ? this : new SelectionRange(from, to, this.flags);
    }
    extend(from, to = from) {
        if (from <= this.anchor && to >= this.anchor) return EditorSelection.range(from, to);
        let head = Math.abs(from - this.anchor) > Math.abs(to - this.anchor) ? from : to;
        return EditorSelection.range(this.anchor, head);
    }
    eq(other) {
        return this.anchor == other.anchor && this.head == other.head;
    }
    toJSON() {
        return {
            anchor: this.anchor,
            head: this.head
        };
    }
    static fromJSON(json3) {
        if (!json3 || typeof json3.anchor != "number" || typeof json3.head != "number") throw new RangeError("Invalid JSON representation for SelectionRange");
        return EditorSelection.range(json3.anchor, json3.head);
    }
}
class EditorSelection {
    constructor(ranges, mainIndex = 0){
        this.ranges = ranges;
        this.mainIndex = mainIndex;
    }
    map(change, assoc = -1) {
        if (change.empty) return this;
        return EditorSelection.create(this.ranges.map((r)=>r.map(change, assoc)
        ), this.mainIndex);
    }
    eq(other) {
        if (this.ranges.length != other.ranges.length || this.mainIndex != other.mainIndex) return false;
        for(let i26 = 0; i26 < this.ranges.length; i26++)if (!this.ranges[i26].eq(other.ranges[i26])) return false;
        return true;
    }
    get main() {
        return this.ranges[this.mainIndex];
    }
    asSingle() {
        return this.ranges.length == 1 ? this : new EditorSelection([
            this.main
        ]);
    }
    addRange(range, main = true) {
        return EditorSelection.create([
            range
        ].concat(this.ranges), main ? 0 : this.mainIndex + 1);
    }
    replaceRange(range, which = this.mainIndex) {
        let ranges = this.ranges.slice();
        ranges[which] = range;
        return EditorSelection.create(ranges, this.mainIndex);
    }
    toJSON() {
        return {
            ranges: this.ranges.map((r)=>r.toJSON()
            ),
            main: this.mainIndex
        };
    }
    static fromJSON(json4) {
        if (!json4 || !Array.isArray(json4.ranges) || typeof json4.main != "number" || json4.main >= json4.ranges.length) throw new RangeError("Invalid JSON representation for EditorSelection");
        return new EditorSelection(json4.ranges.map((r)=>SelectionRange.fromJSON(r)
        ), json4.main);
    }
    static single(anchor, head = anchor) {
        return new EditorSelection([
            EditorSelection.range(anchor, head)
        ], 0);
    }
    static create(ranges, mainIndex = 0) {
        if (ranges.length == 0) throw new RangeError("A selection needs at least one range");
        for(let pos = 0, i27 = 0; i27 < ranges.length; i27++){
            let range = ranges[i27];
            if (range.empty ? range.from <= pos : range.from < pos) return normalized(ranges.slice(), mainIndex);
            pos = range.to;
        }
        return new EditorSelection(ranges, mainIndex);
    }
    static cursor(pos, assoc = 0, bidiLevel, goalColumn) {
        return new SelectionRange(pos, pos, (assoc == 0 ? 0 : assoc < 0 ? 4 : 8) | (bidiLevel == null ? 3 : Math.min(2, bidiLevel)) | (goalColumn !== null && goalColumn !== void 0 ? goalColumn : 33554431) << 5);
    }
    static range(anchor, head, goalColumn) {
        let goal = (goalColumn !== null && goalColumn !== void 0 ? goalColumn : 33554431) << 5;
        return head < anchor ? new SelectionRange(head, anchor, 16 | goal) : new SelectionRange(anchor, head, goal);
    }
}
function normalized(ranges, mainIndex = 0) {
    let main = ranges[mainIndex];
    ranges.sort((a, b)=>a.from - b.from
    );
    mainIndex = ranges.indexOf(main);
    for(let i28 = 1; i28 < ranges.length; i28++){
        let range = ranges[i28], prev = ranges[i28 - 1];
        if (range.empty ? range.from <= prev.to : range.from < prev.to) {
            let from = prev.from, to = Math.max(range.to, prev.to);
            if (i28 <= mainIndex) mainIndex--;
            ranges.splice(--i28, 2, range.anchor > range.head ? EditorSelection.range(to, from) : EditorSelection.range(from, to));
        }
    }
    return new EditorSelection(ranges, mainIndex);
}
function checkSelection(selection1, docLength) {
    for (let range of selection1.ranges)if (range.to > docLength) throw new RangeError("Selection points outside of document");
}
let nextID = 0;
class Facet {
    constructor(combine, compareInput, compare1, isStatic, extensions){
        this.combine = combine;
        this.compareInput = compareInput;
        this.compare = compare1;
        this.isStatic = isStatic;
        this.extensions = extensions;
        this.id = nextID++;
        this.default = combine([]);
    }
    static define(config1 = {
    }) {
        return new Facet(config1.combine || ((a)=>a
        ), config1.compareInput || ((a, b)=>a === b
        ), config1.compare || (!config1.combine ? sameArray$1 : (a, b)=>a === b
        ), !!config1.static, config1.enables);
    }
    of(value) {
        return new FacetProvider([], this, 0, value);
    }
    compute(deps, get) {
        if (this.isStatic) throw new Error("Can't compute a static facet");
        return new FacetProvider(deps, this, 1, get);
    }
    computeN(deps, get) {
        if (this.isStatic) throw new Error("Can't compute a static facet");
        return new FacetProvider(deps, this, 2, get);
    }
    from(field, get) {
        if (!get) get = (x)=>x
        ;
        return this.compute([
            field
        ], (state)=>get(state.field(field))
        );
    }
}
function sameArray$1(a, b) {
    return a == b || a.length == b.length && a.every((e, i)=>e === b[i]
    );
}
class FacetProvider {
    constructor(dependencies, facet, type, value){
        this.dependencies = dependencies;
        this.facet = facet;
        this.type = type;
        this.value = value;
        this.id = nextID++;
    }
    dynamicSlot(addresses) {
        var _a;
        let getter = this.value;
        let compare2 = this.facet.compareInput;
        let idx = addresses[this.id] >> 1, multi = this.type == 2;
        let depDoc = false, depSel = false, depAddrs = [];
        for (let dep of this.dependencies){
            if (dep == "doc") depDoc = true;
            else if (dep == "selection") depSel = true;
            else if ((((_a = addresses[dep.id]) !== null && _a !== void 0 ? _a : 1) & 1) == 0) depAddrs.push(addresses[dep.id]);
        }
        return (state, tr)=>{
            let oldVal = state.values[idx];
            if (oldVal === Uninitialized) {
                state.values[idx] = getter(state);
                return 1;
            }
            if (tr) {
                let depChanged = depDoc && tr.docChanged || depSel && (tr.docChanged || tr.selection) || depAddrs.some((addr)=>(ensureAddr(state, addr) & 1) > 0
                );
                if (depChanged) {
                    let newVal = getter(state);
                    if (multi ? !compareArray(newVal, oldVal, compare2) : !compare2(newVal, oldVal)) {
                        state.values[idx] = newVal;
                        return 1;
                    }
                }
            }
            return 0;
        };
    }
}
function compareArray(a, b, compare3) {
    if (a.length != b.length) return false;
    for(let i29 = 0; i29 < a.length; i29++)if (!compare3(a[i29], b[i29])) return false;
    return true;
}
function dynamicFacetSlot(addresses, facet, providers) {
    let providerAddrs = providers.map((p)=>addresses[p.id]
    );
    let providerTypes = providers.map((p1)=>p1.type
    );
    let dynamic = providerAddrs.filter((p2)=>!(p2 & 1)
    );
    let idx = addresses[facet.id] >> 1;
    return (state, tr)=>{
        let oldVal = state.values[idx], changed = oldVal === Uninitialized || !tr;
        for (let dynAddr of dynamic){
            if (ensureAddr(state, dynAddr) & 1) changed = true;
        }
        if (!changed) return 0;
        let values = [];
        for(let i30 = 0; i30 < providerAddrs.length; i30++){
            let value = getAddr(state, providerAddrs[i30]);
            if (providerTypes[i30] == 2) for (let val of value)values.push(val);
            else values.push(value);
        }
        let value = facet.combine(values);
        if (oldVal !== Uninitialized && facet.compare(value, oldVal)) return 0;
        state.values[idx] = value;
        return 1;
    };
}
const initField = Facet.define({
    static: true
});
class StateField {
    constructor(id, createF, updateF, compareF, spec){
        this.id = id;
        this.createF = createF;
        this.updateF = updateF;
        this.compareF = compareF;
        this.spec = spec;
        this.provides = undefined;
    }
    static define(config2) {
        let field = new StateField(nextID++, config2.create, config2.update, config2.compare || ((a, b)=>a === b
        ), config2);
        if (config2.provide) field.provides = config2.provide(field);
        return field;
    }
    create(state) {
        let init = state.facet(initField).find((i31)=>i31.field == this
        );
        return ((init === null || init === void 0 ? void 0 : init.create) || this.createF)(state);
    }
    slot(addresses) {
        let idx = addresses[this.id] >> 1;
        return (state, tr)=>{
            let oldVal = state.values[idx];
            if (oldVal === Uninitialized) {
                state.values[idx] = this.create(state);
                return 1;
            }
            if (tr) {
                let value = this.updateF(oldVal, tr);
                if (!this.compareF(oldVal, value)) {
                    state.values[idx] = value;
                    return 1;
                }
            }
            return 0;
        };
    }
    init(create) {
        return [
            this,
            initField.of({
                field: this,
                create
            })
        ];
    }
    get extension() {
        return this;
    }
}
const Prec_ = {
    lowest: 4,
    low: 3,
    default: 2,
    high: 1,
    highest: 0
};
function prec(value) {
    return (ext)=>new PrecExtension(ext, value)
    ;
}
const Prec = {
    lowest: prec(Prec_.lowest),
    low: prec(Prec_.low),
    default: prec(Prec_.default),
    high: prec(Prec_.high),
    highest: prec(Prec_.highest),
    fallback: prec(Prec_.lowest),
    extend: prec(Prec_.high),
    override: prec(Prec_.highest)
};
class PrecExtension {
    constructor(inner, prec1){
        this.inner = inner;
        this.prec = prec1;
    }
}
class Compartment {
    of(ext) {
        return new CompartmentInstance(this, ext);
    }
    reconfigure(content1) {
        return Compartment.reconfigure.of({
            compartment: this,
            extension: content1
        });
    }
    get(state) {
        return state.config.compartments.get(this);
    }
}
class CompartmentInstance {
    constructor(compartment, inner){
        this.compartment = compartment;
        this.inner = inner;
    }
}
class Configuration {
    constructor(base1, compartments, dynamicSlots, address, staticValues){
        this.base = base1;
        this.compartments = compartments;
        this.dynamicSlots = dynamicSlots;
        this.address = address;
        this.staticValues = staticValues;
        this.statusTemplate = [];
        while(this.statusTemplate.length < dynamicSlots.length)this.statusTemplate.push(0);
    }
    staticFacet(facet) {
        let addr = this.address[facet.id];
        return addr == null ? facet.default : this.staticValues[addr >> 1];
    }
    static resolve(base2, compartments, oldState) {
        let fields = [];
        let facets = Object.create(null);
        let newCompartments = new Map();
        for (let ext of flatten(base2, compartments, newCompartments)){
            if (ext instanceof StateField) fields.push(ext);
            else (facets[ext.facet.id] || (facets[ext.facet.id] = [])).push(ext);
        }
        let address = Object.create(null);
        let staticValues = [];
        let dynamicSlots = [];
        let dynamicDeps = [];
        for (let field of fields){
            address[field.id] = dynamicSlots.length << 1;
            dynamicSlots.push((a)=>field.slot(a)
            );
            dynamicDeps.push([]);
        }
        for(let id3 in facets){
            let providers = facets[id3], facet = providers[0].facet;
            if (providers.every((p3)=>p3.type == 0
            )) {
                address[facet.id] = staticValues.length << 1 | 1;
                let value = facet.combine(providers.map((p4)=>p4.value
                ));
                let oldAddr = oldState ? oldState.config.address[facet.id] : null;
                if (oldAddr != null) {
                    let oldVal = getAddr(oldState, oldAddr);
                    if (facet.compare(value, oldVal)) value = oldVal;
                }
                staticValues.push(value);
            } else {
                for (let p5 of providers){
                    if (p5.type == 0) {
                        address[p5.id] = staticValues.length << 1 | 1;
                        staticValues.push(p5.value);
                    } else {
                        address[p5.id] = dynamicSlots.length << 1;
                        dynamicSlots.push((a)=>p5.dynamicSlot(a)
                        );
                        dynamicDeps.push(p5.dependencies.filter((d)=>typeof d != "string"
                        ).map((d)=>d.id
                        ));
                    }
                }
                address[facet.id] = dynamicSlots.length << 1;
                dynamicSlots.push((a)=>dynamicFacetSlot(a, facet, providers)
                );
                dynamicDeps.push(providers.filter((p6)=>p6.type != 0
                ).map((d)=>d.id
                ));
            }
        }
        let dynamicValues = dynamicSlots.map((_)=>Uninitialized
        );
        if (oldState) {
            let canReuse = (id2, depth)=>{
                if (depth > 7) return false;
                let addr = address[id2];
                if (!(addr & 1)) return dynamicDeps[addr >> 1].every((id)=>canReuse(id, depth + 1)
                );
                let oldAddr = oldState.config.address[id2];
                return oldAddr != null && getAddr(oldState, oldAddr) == staticValues[addr >> 1];
            };
            for(let id1 in address){
                let cur1 = address[id1], prev = oldState.config.address[id1];
                if (prev != null && (cur1 & 1) == 0 && canReuse(+id1, 0)) dynamicValues[cur1 >> 1] = getAddr(oldState, prev);
            }
        }
        return {
            configuration: new Configuration(base2, newCompartments, dynamicSlots.map((f)=>f(address)
            ), address, staticValues),
            values: dynamicValues
        };
    }
}
function flatten(extension, compartments, newCompartments) {
    let result = [
        [],
        [],
        [],
        [],
        []
    ];
    let seen = new Map();
    function inner(ext, prec2) {
        let known = seen.get(ext);
        if (known != null) {
            if (known >= prec2) return;
            let found = result[known].indexOf(ext);
            if (found > -1) result[known].splice(found, 1);
            if (ext instanceof CompartmentInstance) newCompartments.delete(ext.compartment);
        }
        seen.set(ext, prec2);
        if (Array.isArray(ext)) {
            for (let e of ext)inner(e, prec2);
        } else if (ext instanceof CompartmentInstance) {
            if (newCompartments.has(ext.compartment)) throw new RangeError(`Duplicate use of compartment in extensions`);
            let content2 = compartments.get(ext.compartment) || ext.inner;
            newCompartments.set(ext.compartment, content2);
            inner(content2, prec2);
        } else if (ext instanceof PrecExtension) {
            inner(ext.inner, ext.prec);
        } else if (ext instanceof StateField) {
            result[prec2].push(ext);
            if (ext.provides) inner(ext.provides, prec2);
        } else if (ext instanceof FacetProvider) {
            result[prec2].push(ext);
            if (ext.facet.extensions) inner(ext.facet.extensions, prec2);
        } else {
            let content3 = ext.extension;
            if (!content3) throw new Error(`Unrecognized extension value in extension set (${ext}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
            inner(content3, prec2);
        }
    }
    inner(extension, Prec_.default);
    return result.reduce((a, b)=>a.concat(b)
    );
}
const Uninitialized = {
};
function ensureAddr(state, addr) {
    if (addr & 1) return 2;
    let idx = addr >> 1;
    let status = state.status[idx];
    if (status == 4) throw new Error("Cyclic dependency between fields and/or facets");
    if (status & 2) return status;
    state.status[idx] = 4;
    let changed = state.config.dynamicSlots[idx](state, state.applying);
    return state.status[idx] = 2 | changed;
}
function getAddr(state, addr) {
    return addr & 1 ? state.config.staticValues[addr >> 1] : state.values[addr >> 1];
}
const languageData = Facet.define();
const allowMultipleSelections = Facet.define({
    combine: (values)=>values.some((v)=>v
        )
    ,
    static: true
});
const lineSeparator = Facet.define({
    combine: (values)=>values.length ? values[0] : undefined
    ,
    static: true
});
const changeFilter = Facet.define();
const transactionFilter = Facet.define();
const transactionExtender = Facet.define();
const readOnly = Facet.define({
    combine: (values)=>values.length ? values[0] : false
});
class Annotation {
    constructor(type, value){
        this.type = type;
        this.value = value;
    }
    static define() {
        return new AnnotationType();
    }
}
class AnnotationType {
    of(value) {
        return new Annotation(this, value);
    }
}
class StateEffectType {
    constructor(map){
        this.map = map;
    }
    of(value) {
        return new StateEffect(this, value);
    }
}
class StateEffect {
    constructor(type, value){
        this.type = type;
        this.value = value;
    }
    map(mapping) {
        let mapped = this.type.map(this.value, mapping);
        return mapped === undefined ? undefined : mapped == this.value ? this : new StateEffect(this.type, mapped);
    }
    is(type) {
        return this.type == type;
    }
    static define(spec = {
    }) {
        return new StateEffectType(spec.map || ((v)=>v
        ));
    }
    static mapEffects(effects, mapping) {
        if (!effects.length) return effects;
        let result = [];
        for (let effect of effects){
            let mapped = effect.map(mapping);
            if (mapped) result.push(mapped);
        }
        return result;
    }
}
StateEffect.reconfigure = StateEffect.define();
StateEffect.appendConfig = StateEffect.define();
class Transaction {
    constructor(startState, changes, selection2, effects, annotations, scrollIntoView1){
        this.startState = startState;
        this.changes = changes;
        this.selection = selection2;
        this.effects = effects;
        this.annotations = annotations;
        this.scrollIntoView = scrollIntoView1;
        this._doc = null;
        this._state = null;
        if (selection2) checkSelection(selection2, changes.newLength);
        if (!annotations.some((a)=>a.type == Transaction.time
        )) this.annotations = annotations.concat(Transaction.time.of(Date.now()));
    }
    get newDoc() {
        return this._doc || (this._doc = this.changes.apply(this.startState.doc));
    }
    get newSelection() {
        return this.selection || this.startState.selection.map(this.changes);
    }
    get state() {
        if (!this._state) this.startState.applyTransaction(this);
        return this._state;
    }
    annotation(type) {
        for (let ann of this.annotations)if (ann.type == type) return ann.value;
        return undefined;
    }
    get docChanged() {
        return !this.changes.empty;
    }
    get reconfigured() {
        return this.startState.config != this.state.config;
    }
    isUserEvent(event) {
        let e = this.annotation(Transaction.userEvent);
        return !!(e && (e == event || e.length > event.length && e.slice(0, event.length) == event && e[event.length] == "."));
    }
}
Transaction.time = Annotation.define();
Transaction.userEvent = Annotation.define();
Transaction.addToHistory = Annotation.define();
Transaction.remote = Annotation.define();
function joinRanges(a, b) {
    let result = [];
    for(let iA = 0, iB = 0;;){
        let from, to;
        if (iA < a.length && (iB == b.length || b[iB] >= a[iA])) {
            from = a[iA++];
            to = a[iA++];
        } else if (iB < b.length) {
            from = b[iB++];
            to = b[iB++];
        } else return result;
        if (!result.length || result[result.length - 1] < from) result.push(from, to);
        else if (result[result.length - 1] < to) result[result.length - 1] = to;
    }
}
function mergeTransaction(a, b, sequential) {
    var _a;
    let mapForA, mapForB, changes;
    if (sequential) {
        mapForA = b.changes;
        mapForB = ChangeSet.empty(b.changes.length);
        changes = a.changes.compose(b.changes);
    } else {
        mapForA = b.changes.map(a.changes);
        mapForB = a.changes.mapDesc(b.changes, true);
        changes = a.changes.compose(mapForA);
    }
    return {
        changes,
        selection: b.selection ? b.selection.map(mapForB) : (_a = a.selection) === null || _a === void 0 ? void 0 : _a.map(mapForA),
        effects: StateEffect.mapEffects(a.effects, mapForA).concat(StateEffect.mapEffects(b.effects, mapForB)),
        annotations: a.annotations.length ? a.annotations.concat(b.annotations) : b.annotations,
        scrollIntoView: a.scrollIntoView || b.scrollIntoView
    };
}
function resolveTransactionInner(state, spec, docSize) {
    let sel = spec.selection, annotations = asArray$1(spec.annotations);
    if (spec.userEvent) annotations = annotations.concat(Transaction.userEvent.of(spec.userEvent));
    return {
        changes: spec.changes instanceof ChangeSet ? spec.changes : ChangeSet.of(spec.changes || [], docSize, state.facet(lineSeparator)),
        selection: sel && (sel instanceof EditorSelection ? sel : EditorSelection.single(sel.anchor, sel.head)),
        effects: asArray$1(spec.effects),
        annotations,
        scrollIntoView: !!spec.scrollIntoView
    };
}
function resolveTransaction(state, specs, filter) {
    let s = resolveTransactionInner(state, specs.length ? specs[0] : {
    }, state.doc.length);
    if (specs.length && specs[0].filter === false) filter = false;
    for(let i32 = 1; i32 < specs.length; i32++){
        if (specs[i32].filter === false) filter = false;
        let seq = !!specs[i32].sequential;
        s = mergeTransaction(s, resolveTransactionInner(state, specs[i32], seq ? s.changes.newLength : state.doc.length), seq);
    }
    let tr = new Transaction(state, s.changes, s.selection, s.effects, s.annotations, s.scrollIntoView);
    return extendTransaction(filter ? filterTransaction(tr) : tr);
}
function filterTransaction(tr) {
    let state = tr.startState;
    let result = true;
    for (let filter of state.facet(changeFilter)){
        let value = filter(tr);
        if (value === false) {
            result = false;
            break;
        }
        if (Array.isArray(value)) result = result === true ? value : joinRanges(result, value);
    }
    if (result !== true) {
        let changes, back;
        if (result === false) {
            back = tr.changes.invertedDesc;
            changes = ChangeSet.empty(state.doc.length);
        } else {
            let filtered = tr.changes.filter(result);
            changes = filtered.changes;
            back = filtered.filtered.invertedDesc;
        }
        tr = new Transaction(state, changes, tr.selection && tr.selection.map(back), StateEffect.mapEffects(tr.effects, back), tr.annotations, tr.scrollIntoView);
    }
    let filters = state.facet(transactionFilter);
    for(let i33 = filters.length - 1; i33 >= 0; i33--){
        let filtered = filters[i33](tr);
        if (filtered instanceof Transaction) tr = filtered;
        else if (Array.isArray(filtered) && filtered.length == 1 && filtered[0] instanceof Transaction) tr = filtered[0];
        else tr = resolveTransaction(state, asArray$1(filtered), false);
    }
    return tr;
}
function extendTransaction(tr) {
    let state = tr.startState, extenders = state.facet(transactionExtender), spec = tr;
    for(let i34 = extenders.length - 1; i34 >= 0; i34--){
        let extension = extenders[i34](tr);
        if (extension && Object.keys(extension).length) spec = mergeTransaction(tr, resolveTransactionInner(state, extension, tr.changes.newLength), true);
    }
    return spec == tr ? tr : new Transaction(state, tr.changes, tr.selection, spec.effects, spec.annotations, spec.scrollIntoView);
}
const none$3 = [];
function asArray$1(value) {
    return value == null ? none$3 : Array.isArray(value) ? value : [
        value
    ];
}
var CharCategory = function(CharCategory1) {
    CharCategory1[CharCategory1["Word"] = 0] = "Word";
    CharCategory1[CharCategory1["Space"] = 1] = "Space";
    CharCategory1[CharCategory1["Other"] = 2] = "Other";
    return CharCategory1;
}(CharCategory || (CharCategory = {
}));
const nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let wordChar;
try {
    wordChar = new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch (_) {
}
function hasWordChar(str) {
    if (wordChar) return wordChar.test(str);
    for(let i35 = 0; i35 < str.length; i35++){
        let ch = str[i35];
        if (/\w/.test(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch))) return true;
    }
    return false;
}
function makeCategorizer(wordChars) {
    return (__char)=>{
        if (!/\S/.test(__char)) return CharCategory.Space;
        if (hasWordChar(__char)) return CharCategory.Word;
        for(let i36 = 0; i36 < wordChars.length; i36++)if (__char.indexOf(wordChars[i36]) > -1) return CharCategory.Word;
        return CharCategory.Other;
    };
}
class EditorState {
    constructor(config3, doc3, selection3, values, tr = null){
        this.config = config3;
        this.doc = doc3;
        this.selection = selection3;
        this.values = values;
        this.applying = null;
        this.status = config3.statusTemplate.slice();
        this.applying = tr;
        if (tr) tr._state = this;
        for(let i37 = 0; i37 < this.config.dynamicSlots.length; i37++)ensureAddr(this, i37 << 1);
        this.applying = null;
    }
    field(field, require = true) {
        let addr = this.config.address[field.id];
        if (addr == null) {
            if (require) throw new RangeError("Field is not present in this state");
            return undefined;
        }
        ensureAddr(this, addr);
        return getAddr(this, addr);
    }
    update(...specs) {
        return resolveTransaction(this, specs, true);
    }
    applyTransaction(tr) {
        let conf = this.config, { base: base3 , compartments  } = conf;
        for (let effect of tr.effects){
            if (effect.is(Compartment.reconfigure)) {
                if (conf) {
                    compartments = new Map;
                    conf.compartments.forEach((val, key)=>compartments.set(key, val)
                    );
                    conf = null;
                }
                compartments.set(effect.value.compartment, effect.value.extension);
            } else if (effect.is(StateEffect.reconfigure)) {
                conf = null;
                base3 = effect.value;
            } else if (effect.is(StateEffect.appendConfig)) {
                conf = null;
                base3 = asArray$1(base3).concat(effect.value);
            }
        }
        let startValues;
        if (!conf) {
            let resolved = Configuration.resolve(base3, compartments, this);
            conf = resolved.configuration;
            let intermediateState = new EditorState(conf, this.doc, this.selection, resolved.values, null);
            startValues = intermediateState.values;
        } else {
            startValues = tr.startState.values.slice();
        }
        new EditorState(conf, tr.newDoc, tr.newSelection, startValues, tr);
    }
    replaceSelection(text) {
        if (typeof text == "string") text = this.toText(text);
        return this.changeByRange((range)=>({
                changes: {
                    from: range.from,
                    to: range.to,
                    insert: text
                },
                range: EditorSelection.cursor(range.from + text.length)
            })
        );
    }
    changeByRange(f) {
        let sel = this.selection;
        let result1 = f(sel.ranges[0]);
        let changes = this.changes(result1.changes), ranges = [
            result1.range
        ];
        let effects = asArray$1(result1.effects);
        for(let i38 = 1; i38 < sel.ranges.length; i38++){
            let result = f(sel.ranges[i38]);
            let newChanges = this.changes(result.changes), newMapped = newChanges.map(changes);
            for(let j = 0; j < i38; j++)ranges[j] = ranges[j].map(newMapped);
            let mapBy = changes.mapDesc(newChanges, true);
            ranges.push(result.range.map(mapBy));
            changes = changes.compose(newMapped);
            effects = StateEffect.mapEffects(effects, newMapped).concat(StateEffect.mapEffects(asArray$1(result.effects), mapBy));
        }
        return {
            changes,
            selection: EditorSelection.create(ranges, sel.mainIndex),
            effects
        };
    }
    changes(spec = []) {
        if (spec instanceof ChangeSet) return spec;
        return ChangeSet.of(spec, this.doc.length, this.facet(EditorState.lineSeparator));
    }
    toText(string4) {
        return Text.of(string4.split(this.facet(EditorState.lineSeparator) || DefaultSplit));
    }
    sliceDoc(from = 0, to = this.doc.length) {
        return this.doc.sliceString(from, to, this.lineBreak);
    }
    facet(facet) {
        let addr = this.config.address[facet.id];
        if (addr == null) return facet.default;
        ensureAddr(this, addr);
        return getAddr(this, addr);
    }
    toJSON(fields) {
        let result = {
            doc: this.sliceDoc(),
            selection: this.selection.toJSON()
        };
        if (fields) for(let prop in fields){
            let value = fields[prop];
            if (value instanceof StateField) result[prop] = value.spec.toJSON(this.field(fields[prop]), this);
        }
        return result;
    }
    static fromJSON(json5, config4 = {
    }, fields) {
        if (!json5 || typeof json5.doc != "string") throw new RangeError("Invalid JSON representation for EditorState");
        let fieldInit = [];
        if (fields) for(let prop in fields){
            let field = fields[prop], value = json5[prop];
            fieldInit.push(field.init((state)=>field.spec.fromJSON(value, state)
            ));
        }
        return EditorState.create({
            doc: json5.doc,
            selection: EditorSelection.fromJSON(json5.selection),
            extensions: config4.extensions ? fieldInit.concat([
                config4.extensions
            ]) : fieldInit
        });
    }
    static create(config5 = {
    }) {
        let { configuration , values  } = Configuration.resolve(config5.extensions || [], new Map);
        let doc4 = config5.doc instanceof Text ? config5.doc : Text.of((config5.doc || "").split(configuration.staticFacet(EditorState.lineSeparator) || DefaultSplit));
        let selection4 = !config5.selection ? EditorSelection.single(0) : config5.selection instanceof EditorSelection ? config5.selection : EditorSelection.single(config5.selection.anchor, config5.selection.head);
        checkSelection(selection4, doc4.length);
        if (!configuration.staticFacet(allowMultipleSelections)) selection4 = selection4.asSingle();
        return new EditorState(configuration, doc4, selection4, values);
    }
    get tabSize() {
        return this.facet(EditorState.tabSize);
    }
    get lineBreak() {
        return this.facet(EditorState.lineSeparator) || "\n";
    }
    get readOnly() {
        return this.facet(readOnly);
    }
    phrase(phrase1) {
        for (let map of this.facet(EditorState.phrases))if (Object.prototype.hasOwnProperty.call(map, phrase1)) return map[phrase1];
        return phrase1;
    }
    languageDataAt(name1, pos, side = -1) {
        let values = [];
        for (let provider of this.facet(languageData)){
            for (let result of provider(this, pos, side)){
                if (Object.prototype.hasOwnProperty.call(result, name1)) values.push(result[name1]);
            }
        }
        return values;
    }
    charCategorizer(at) {
        return makeCategorizer(this.languageDataAt("wordChars", at).join(""));
    }
    wordAt(pos) {
        let { text , from , length  } = this.doc.lineAt(pos);
        let cat = this.charCategorizer(pos);
        let start = pos - from, end = pos - from;
        while(start > 0){
            let prev = findClusterBreak(text, start, false);
            if (cat(text.slice(prev, start)) != CharCategory.Word) break;
            start = prev;
        }
        while(end < length){
            let next = findClusterBreak(text, end);
            if (cat(text.slice(end, next)) != CharCategory.Word) break;
            end = next;
        }
        return start == end ? null : EditorSelection.range(start + from, end + from);
    }
}
EditorState.allowMultipleSelections = allowMultipleSelections;
EditorState.tabSize = Facet.define({
    combine: (values)=>values.length ? values[0] : 4
});
EditorState.lineSeparator = lineSeparator;
EditorState.readOnly = readOnly;
EditorState.phrases = Facet.define();
EditorState.languageData = languageData;
EditorState.changeFilter = changeFilter;
EditorState.transactionFilter = transactionFilter;
EditorState.transactionExtender = transactionExtender;
Compartment.reconfigure = StateEffect.define();
function combineConfig(configs, defaults1, combine = {
}) {
    let result = {
    };
    for (let config6 of configs)for (let key of Object.keys(config6)){
        let value = config6[key], current = result[key];
        if (current === undefined) result[key] = value;
        else if (current === value || value === undefined) ;
        else if (Object.hasOwnProperty.call(combine, key)) result[key] = combine[key](current, value);
        else throw new Error("Config merge conflict for field " + key);
    }
    for(let key1 in defaults1)if (result[key1] === undefined) result[key1] = defaults1[key1];
    return result;
}
const C = "\u037c";
const COUNT = typeof Symbol == "undefined" ? "__" + C : Symbol.for(C);
const SET = typeof Symbol == "undefined" ? "__styleSet" + Math.floor(Math.random() * 100000000) : Symbol("styleSet");
const top = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : {
};
class StyleModule {
    constructor(spec1, options){
        this.rules = [];
        let { finish  } = options || {
        };
        function splitSelector(selector) {
            return /^@/.test(selector) ? [
                selector
            ] : selector.split(/,\s*/);
        }
        function render(selectors, spec, target, isKeyframes) {
            let local = [], isAt = /^@(\w+)\b/.exec(selectors[0]), keyframes = isAt && isAt[1] == "keyframes";
            if (isAt && spec == null) return target.push(selectors[0] + ";");
            for(let prop in spec){
                let value = spec[prop];
                if (/&/.test(prop)) {
                    render(prop.split(/,\s*/).map((part)=>selectors.map((sel)=>part.replace(/&/, sel)
                        )
                    ).reduce((a, b)=>a.concat(b)
                    ), value, target);
                } else if (value && typeof value == "object") {
                    if (!isAt) throw new RangeError("The value of a property (" + prop + ") should be a primitive value.");
                    render(splitSelector(prop), value, local, keyframes);
                } else if (value != null) {
                    local.push(prop.replace(/_.*/, "").replace(/[A-Z]/g, (l)=>"-" + l.toLowerCase()
                    ) + ": " + value + ";");
                }
            }
            if (local.length || keyframes) {
                target.push((finish && !isAt && !isKeyframes ? selectors.map(finish) : selectors).join(", ") + " {" + local.join(" ") + "}");
            }
        }
        for(let prop1 in spec1)render(splitSelector(prop1), spec1[prop1], this.rules);
    }
    getRules() {
        return this.rules.join("\n");
    }
    static newName() {
        let id = top[COUNT] || 1;
        top[COUNT] = id + 1;
        return C + id.toString(36);
    }
    static mount(root, modules) {
        (root[SET] || new StyleSet(root)).mount(Array.isArray(modules) ? modules : [
            modules
        ]);
    }
}
let adoptedSet = null;
class StyleSet {
    constructor(root){
        if (!root.head && root.adoptedStyleSheets && typeof CSSStyleSheet != "undefined") {
            if (adoptedSet) {
                root.adoptedStyleSheets = [
                    adoptedSet.sheet
                ].concat(root.adoptedStyleSheets);
                return root[SET] = adoptedSet;
            }
            this.sheet = new CSSStyleSheet;
            root.adoptedStyleSheets = [
                this.sheet
            ].concat(root.adoptedStyleSheets);
            adoptedSet = this;
        } else {
            this.styleTag = (root.ownerDocument || root).createElement("style");
            let target = root.head || root;
            target.insertBefore(this.styleTag, target.firstChild);
        }
        this.modules = [];
        root[SET] = this;
    }
    mount(modules) {
        let sheet = this.sheet;
        let pos = 0, j = 0;
        for(let i39 = 0; i39 < modules.length; i39++){
            let mod = modules[i39], index = this.modules.indexOf(mod);
            if (index < j && index > -1) {
                this.modules.splice(index, 1);
                j--;
                index = -1;
            }
            if (index == -1) {
                this.modules.splice(j++, 0, mod);
                if (sheet) for(let k = 0; k < mod.rules.length; k++)sheet.insertRule(mod.rules[k], pos++);
            } else {
                while(j < index)pos += this.modules[j++].rules.length;
                pos += mod.rules.length;
                j++;
            }
        }
        if (!sheet) {
            let text = "";
            for(let i40 = 0; i40 < this.modules.length; i40++)text += this.modules[i40].getRules() + "\n";
            this.styleTag.textContent = text;
        }
    }
}
class RangeValue {
    eq(other) {
        return this == other;
    }
    range(from, to = from) {
        return new Range$1(from, to, this);
    }
}
RangeValue.prototype.startSide = RangeValue.prototype.endSide = 0;
RangeValue.prototype.point = false;
RangeValue.prototype.mapMode = MapMode.TrackDel;
class Range$1 {
    constructor(from, to, value){
        this.from = from;
        this.to = to;
        this.value = value;
    }
}
function cmpRange(a, b) {
    return a.from - b.from || a.value.startSide - b.value.startSide;
}
class Chunk {
    constructor(from, to, value, maxPoint){
        this.from = from;
        this.to = to;
        this.value = value;
        this.maxPoint = maxPoint;
    }
    get length() {
        return this.to[this.to.length - 1];
    }
    findIndex(pos, side, end, startAt = 0) {
        let arr = end ? this.to : this.from;
        for(let lo = startAt, hi = arr.length;;){
            if (lo == hi) return lo;
            let mid = lo + hi >> 1;
            let diff = arr[mid] - pos || (end ? this.value[mid].endSide : this.value[mid].startSide) - side;
            if (mid == lo) return diff >= 0 ? lo : hi;
            if (diff >= 0) hi = mid;
            else lo = mid + 1;
        }
    }
    between(offset, from, to, f) {
        for(let i41 = this.findIndex(from, -1000000000, true), e = this.findIndex(to, 1000000000, false, i41); i41 < e; i41++)if (f(this.from[i41] + offset, this.to[i41] + offset, this.value[i41]) === false) return false;
    }
    map(offset, changes) {
        let value = [], from = [], to = [], newPos = -1, maxPoint = -1;
        for(let i42 = 0; i42 < this.value.length; i42++){
            let val = this.value[i42], curFrom = this.from[i42] + offset, curTo = this.to[i42] + offset, newFrom, newTo;
            if (curFrom == curTo) {
                let mapped = changes.mapPos(curFrom, val.startSide, val.mapMode);
                if (mapped == null) continue;
                newFrom = newTo = mapped;
                if (val.startSide != val.endSide) {
                    newTo = changes.mapPos(curFrom, val.endSide);
                    if (newTo < newFrom) continue;
                }
            } else {
                newFrom = changes.mapPos(curFrom, val.startSide);
                newTo = changes.mapPos(curTo, val.endSide);
                if (newFrom > newTo || newFrom == newTo && val.startSide > 0 && val.endSide <= 0) continue;
            }
            if ((newTo - newFrom || val.endSide - val.startSide) < 0) continue;
            if (newPos < 0) newPos = newFrom;
            if (val.point) maxPoint = Math.max(maxPoint, newTo - newFrom);
            value.push(val);
            from.push(newFrom - newPos);
            to.push(newTo - newPos);
        }
        return {
            mapped: value.length ? new Chunk(from, to, value, maxPoint) : null,
            pos: newPos
        };
    }
}
class RangeSet {
    constructor(chunkPos, chunk, nextLayer = RangeSet.empty, maxPoint){
        this.chunkPos = chunkPos;
        this.chunk = chunk;
        this.nextLayer = nextLayer;
        this.maxPoint = maxPoint;
    }
    get length() {
        let last = this.chunk.length - 1;
        return last < 0 ? 0 : Math.max(this.chunkEnd(last), this.nextLayer.length);
    }
    get size() {
        if (this.isEmpty) return 0;
        let size = this.nextLayer.size;
        for (let chunk of this.chunk)size += chunk.value.length;
        return size;
    }
    chunkEnd(index) {
        return this.chunkPos[index] + this.chunk[index].length;
    }
    update(updateSpec) {
        let { add: add2 = [] , sort =false , filterFrom =0 , filterTo =this.length  } = updateSpec;
        let filter = updateSpec.filter;
        if (add2.length == 0 && !filter) return this;
        if (sort) add2.slice().sort(cmpRange);
        if (this.isEmpty) return add2.length ? RangeSet.of(add2) : this;
        let cur2 = new LayerCursor(this, null, -1).goto(0), i43 = 0, spill = [];
        let builder = new RangeSetBuilder();
        while(cur2.value || i43 < add2.length){
            if (i43 < add2.length && (cur2.from - add2[i43].from || cur2.startSide - add2[i43].value.startSide) >= 0) {
                let range = add2[i43++];
                if (!builder.addInner(range.from, range.to, range.value)) spill.push(range);
            } else if (cur2.rangeIndex == 1 && cur2.chunkIndex < this.chunk.length && (i43 == add2.length || this.chunkEnd(cur2.chunkIndex) < add2[i43].from) && (!filter || filterFrom > this.chunkEnd(cur2.chunkIndex) || filterTo < this.chunkPos[cur2.chunkIndex]) && builder.addChunk(this.chunkPos[cur2.chunkIndex], this.chunk[cur2.chunkIndex])) {
                cur2.nextChunk();
            } else {
                if (!filter || filterFrom > cur2.to || filterTo < cur2.from || filter(cur2.from, cur2.to, cur2.value)) {
                    if (!builder.addInner(cur2.from, cur2.to, cur2.value)) spill.push(new Range$1(cur2.from, cur2.to, cur2.value));
                }
                cur2.next();
            }
        }
        return builder.finishInner(this.nextLayer.isEmpty && !spill.length ? RangeSet.empty : this.nextLayer.update({
            add: spill,
            filter,
            filterFrom,
            filterTo
        }));
    }
    map(changes) {
        if (changes.length == 0 || this.isEmpty) return this;
        let chunks = [], chunkPos = [], maxPoint = -1;
        for(let i44 = 0; i44 < this.chunk.length; i44++){
            let start = this.chunkPos[i44], chunk = this.chunk[i44];
            let touch = changes.touchesRange(start, start + chunk.length);
            if (touch === false) {
                maxPoint = Math.max(maxPoint, chunk.maxPoint);
                chunks.push(chunk);
                chunkPos.push(changes.mapPos(start));
            } else if (touch === true) {
                let { mapped , pos  } = chunk.map(start, changes);
                if (mapped) {
                    maxPoint = Math.max(maxPoint, mapped.maxPoint);
                    chunks.push(mapped);
                    chunkPos.push(pos);
                }
            }
        }
        let next = this.nextLayer.map(changes);
        return chunks.length == 0 ? next : new RangeSet(chunkPos, chunks, next, maxPoint);
    }
    between(from, to, f) {
        if (this.isEmpty) return;
        for(let i45 = 0; i45 < this.chunk.length; i45++){
            let start = this.chunkPos[i45], chunk = this.chunk[i45];
            if (to >= start && from <= start + chunk.length && chunk.between(start, from - start, to - start, f) === false) return;
        }
        this.nextLayer.between(from, to, f);
    }
    iter(from = 0) {
        return HeapCursor.from([
            this
        ]).goto(from);
    }
    get isEmpty() {
        return this.nextLayer == this;
    }
    static iter(sets, from = 0) {
        return HeapCursor.from(sets).goto(from);
    }
    static compare(oldSets, newSets, textDiff, comparator, minPointSize = -1) {
        let a = oldSets.filter((set)=>set.maxPoint > 0 || !set.isEmpty && set.maxPoint >= minPointSize
        );
        let b = newSets.filter((set)=>set.maxPoint > 0 || !set.isEmpty && set.maxPoint >= minPointSize
        );
        let sharedChunks = findSharedChunks(a, b, textDiff);
        let sideA = new SpanCursor(a, sharedChunks, minPointSize);
        let sideB = new SpanCursor(b, sharedChunks, minPointSize);
        textDiff.iterGaps((fromA, fromB, length)=>compare(sideA, fromA, sideB, fromB, length, comparator)
        );
        if (textDiff.empty && textDiff.length == 0) compare(sideA, 0, sideB, 0, 0, comparator);
    }
    static eq(oldSets, newSets, from = 0, to) {
        if (to == null) to = 1000000000;
        let a = oldSets.filter((set)=>!set.isEmpty && newSets.indexOf(set) < 0
        );
        let b = newSets.filter((set)=>!set.isEmpty && oldSets.indexOf(set) < 0
        );
        if (a.length != b.length) return false;
        if (!a.length) return true;
        let sharedChunks = findSharedChunks(a, b);
        let sideA = new SpanCursor(a, sharedChunks, 0).goto(from), sideB = new SpanCursor(b, sharedChunks, 0).goto(from);
        for(;;){
            if (sideA.to != sideB.to || !sameValues(sideA.active, sideB.active) || sideA.point && (!sideB.point || !sideA.point.eq(sideB.point))) return false;
            if (sideA.to > to) return true;
            sideA.next();
            sideB.next();
        }
    }
    static spans(sets, from, to, iterator, minPointSize = -1) {
        var _a;
        let cursor1 = new SpanCursor(sets, null, minPointSize, (_a = iterator.filterPoint) === null || _a === void 0 ? void 0 : _a.bind(iterator)).goto(from), pos = from;
        let open = cursor1.openStart;
        for(;;){
            let curTo = Math.min(cursor1.to, to);
            if (cursor1.point) {
                iterator.point(pos, curTo, cursor1.point, cursor1.activeForPoint(cursor1.to), open);
                open = cursor1.openEnd(curTo) + (cursor1.to > curTo ? 1 : 0);
            } else if (curTo > pos) {
                iterator.span(pos, curTo, cursor1.active, open);
                open = cursor1.openEnd(curTo);
            }
            if (cursor1.to > to) break;
            pos = cursor1.to;
            cursor1.next();
        }
        return open;
    }
    static of(ranges, sort = false) {
        let build = new RangeSetBuilder();
        for (let range of ranges instanceof Range$1 ? [
            ranges
        ] : sort ? lazySort(ranges) : ranges)build.add(range.from, range.to, range.value);
        return build.finish();
    }
}
RangeSet.empty = new RangeSet([], [], null, -1);
function lazySort(ranges) {
    if (ranges.length > 1) for(let prev = ranges[0], i46 = 1; i46 < ranges.length; i46++){
        let cur3 = ranges[i46];
        if (cmpRange(prev, cur3) > 0) return ranges.slice().sort(cmpRange);
        prev = cur3;
    }
    return ranges;
}
RangeSet.empty.nextLayer = RangeSet.empty;
class RangeSetBuilder {
    constructor(){
        this.chunks = [];
        this.chunkPos = [];
        this.chunkStart = -1;
        this.last = null;
        this.lastFrom = -1000000000;
        this.lastTo = -1000000000;
        this.from = [];
        this.to = [];
        this.value = [];
        this.maxPoint = -1;
        this.setMaxPoint = -1;
        this.nextLayer = null;
    }
    finishChunk(newArrays) {
        this.chunks.push(new Chunk(this.from, this.to, this.value, this.maxPoint));
        this.chunkPos.push(this.chunkStart);
        this.chunkStart = -1;
        this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint);
        this.maxPoint = -1;
        if (newArrays) {
            this.from = [];
            this.to = [];
            this.value = [];
        }
    }
    add(from, to, value) {
        if (!this.addInner(from, to, value)) (this.nextLayer || (this.nextLayer = new RangeSetBuilder)).add(from, to, value);
    }
    addInner(from, to, value) {
        let diff = from - this.lastTo || value.startSide - this.last.endSide;
        if (diff <= 0 && (from - this.lastFrom || value.startSide - this.last.startSide) < 0) throw new Error("Ranges must be added sorted by `from` position and `startSide`");
        if (diff < 0) return false;
        if (this.from.length == 250) this.finishChunk(true);
        if (this.chunkStart < 0) this.chunkStart = from;
        this.from.push(from - this.chunkStart);
        this.to.push(to - this.chunkStart);
        this.last = value;
        this.lastFrom = from;
        this.lastTo = to;
        this.value.push(value);
        if (value.point) this.maxPoint = Math.max(this.maxPoint, to - from);
        return true;
    }
    addChunk(from, chunk) {
        if ((from - this.lastTo || chunk.value[0].startSide - this.last.endSide) < 0) return false;
        if (this.from.length) this.finishChunk(true);
        this.setMaxPoint = Math.max(this.setMaxPoint, chunk.maxPoint);
        this.chunks.push(chunk);
        this.chunkPos.push(from);
        let last = chunk.value.length - 1;
        this.last = chunk.value[last];
        this.lastFrom = chunk.from[last] + from;
        this.lastTo = chunk.to[last] + from;
        return true;
    }
    finish() {
        return this.finishInner(RangeSet.empty);
    }
    finishInner(next) {
        if (this.from.length) this.finishChunk(false);
        if (this.chunks.length == 0) return next;
        let result = new RangeSet(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(next) : next, this.setMaxPoint);
        this.from = null;
        return result;
    }
}
function findSharedChunks(a, b, textDiff) {
    let inA = new Map();
    for (let set of a)for(let i48 = 0; i48 < set.chunk.length; i48++)if (set.chunk[i48].maxPoint <= 0) inA.set(set.chunk[i48], set.chunkPos[i48]);
    let shared = new Set();
    for (let set1 of b)for(let i47 = 0; i47 < set1.chunk.length; i47++){
        let known = inA.get(set1.chunk[i47]);
        if (known != null && (textDiff ? textDiff.mapPos(known) : known) == set1.chunkPos[i47] && !(textDiff === null || textDiff === void 0 ? void 0 : textDiff.touchesRange(known, known + set1.chunk[i47].length))) shared.add(set1.chunk[i47]);
    }
    return shared;
}
class LayerCursor {
    constructor(layer, skip, minPoint, rank = 0){
        this.layer = layer;
        this.skip = skip;
        this.minPoint = minPoint;
        this.rank = rank;
    }
    get startSide() {
        return this.value ? this.value.startSide : 0;
    }
    get endSide() {
        return this.value ? this.value.endSide : 0;
    }
    goto(pos, side = -1000000000) {
        this.chunkIndex = this.rangeIndex = 0;
        this.gotoInner(pos, side, false);
        return this;
    }
    gotoInner(pos, side, forward) {
        while(this.chunkIndex < this.layer.chunk.length){
            let next = this.layer.chunk[this.chunkIndex];
            if (!(this.skip && this.skip.has(next) || this.layer.chunkEnd(this.chunkIndex) < pos || next.maxPoint < this.minPoint)) break;
            this.chunkIndex++;
            forward = false;
        }
        if (this.chunkIndex < this.layer.chunk.length) {
            let rangeIndex = this.layer.chunk[this.chunkIndex].findIndex(pos - this.layer.chunkPos[this.chunkIndex], side, true);
            if (!forward || this.rangeIndex < rangeIndex) this.setRangeIndex(rangeIndex);
        }
        this.next();
    }
    forward(pos, side) {
        if ((this.to - pos || this.endSide - side) < 0) this.gotoInner(pos, side, true);
    }
    next() {
        for(;;){
            if (this.chunkIndex == this.layer.chunk.length) {
                this.from = this.to = 1000000000;
                this.value = null;
                break;
            } else {
                let chunkPos = this.layer.chunkPos[this.chunkIndex], chunk = this.layer.chunk[this.chunkIndex];
                let from = chunkPos + chunk.from[this.rangeIndex];
                this.from = from;
                this.to = chunkPos + chunk.to[this.rangeIndex];
                this.value = chunk.value[this.rangeIndex];
                this.setRangeIndex(this.rangeIndex + 1);
                if (this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint) break;
            }
        }
    }
    setRangeIndex(index) {
        if (index == this.layer.chunk[this.chunkIndex].value.length) {
            this.chunkIndex++;
            if (this.skip) {
                while(this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]))this.chunkIndex++;
            }
            this.rangeIndex = 0;
        } else {
            this.rangeIndex = index;
        }
    }
    nextChunk() {
        this.chunkIndex++;
        this.rangeIndex = 0;
        this.next();
    }
    compare(other) {
        return this.from - other.from || this.startSide - other.startSide || this.to - other.to || this.endSide - other.endSide;
    }
}
class HeapCursor {
    constructor(heap){
        this.heap = heap;
    }
    static from(sets, skip = null, minPoint = -1) {
        let heap = [];
        for(let i49 = 0; i49 < sets.length; i49++){
            for(let cur4 = sets[i49]; !cur4.isEmpty; cur4 = cur4.nextLayer){
                if (cur4.maxPoint >= minPoint) heap.push(new LayerCursor(cur4, skip, minPoint, i49));
            }
        }
        return heap.length == 1 ? heap[0] : new HeapCursor(heap);
    }
    get startSide() {
        return this.value ? this.value.startSide : 0;
    }
    goto(pos, side = -1000000000) {
        for (let cur5 of this.heap)cur5.goto(pos, side);
        for(let i50 = this.heap.length >> 1; i50 >= 0; i50--)heapBubble(this.heap, i50);
        this.next();
        return this;
    }
    forward(pos, side) {
        for (let cur6 of this.heap)cur6.forward(pos, side);
        for(let i51 = this.heap.length >> 1; i51 >= 0; i51--)heapBubble(this.heap, i51);
        if ((this.to - pos || this.value.endSide - side) < 0) this.next();
    }
    next() {
        if (this.heap.length == 0) {
            this.from = this.to = 1000000000;
            this.value = null;
            this.rank = -1;
        } else {
            let top2 = this.heap[0];
            this.from = top2.from;
            this.to = top2.to;
            this.value = top2.value;
            this.rank = top2.rank;
            if (top2.value) top2.next();
            heapBubble(this.heap, 0);
        }
    }
}
function heapBubble(heap, index) {
    for(let cur7 = heap[index];;){
        let childIndex = (index << 1) + 1;
        if (childIndex >= heap.length) break;
        let child = heap[childIndex];
        if (childIndex + 1 < heap.length && child.compare(heap[childIndex + 1]) >= 0) {
            child = heap[childIndex + 1];
            childIndex++;
        }
        if (cur7.compare(child) < 0) break;
        heap[childIndex] = cur7;
        heap[index] = child;
        index = childIndex;
    }
}
class SpanCursor {
    constructor(sets, skip, minPoint, filterPoint = ()=>true
    ){
        this.minPoint = minPoint;
        this.filterPoint = filterPoint;
        this.active = [];
        this.activeTo = [];
        this.activeRank = [];
        this.minActive = -1;
        this.point = null;
        this.pointFrom = 0;
        this.pointRank = 0;
        this.to = -1000000000;
        this.endSide = 0;
        this.openStart = -1;
        this.cursor = HeapCursor.from(sets, skip, minPoint);
    }
    goto(pos, side = -1000000000) {
        this.cursor.goto(pos, side);
        this.active.length = this.activeTo.length = this.activeRank.length = 0;
        this.minActive = -1;
        this.to = pos;
        this.endSide = side;
        this.openStart = -1;
        this.next();
        return this;
    }
    forward(pos, side) {
        while(this.minActive > -1 && (this.activeTo[this.minActive] - pos || this.active[this.minActive].endSide - side) < 0)this.removeActive(this.minActive);
        this.cursor.forward(pos, side);
    }
    removeActive(index) {
        remove(this.active, index);
        remove(this.activeTo, index);
        remove(this.activeRank, index);
        this.minActive = findMinIndex(this.active, this.activeTo);
    }
    addActive(trackOpen) {
        let i52 = 0, { value , to , rank  } = this.cursor;
        while(i52 < this.activeRank.length && this.activeRank[i52] <= rank)i52++;
        insert(this.active, i52, value);
        insert(this.activeTo, i52, to);
        insert(this.activeRank, i52, rank);
        if (trackOpen) insert(trackOpen, i52, this.cursor.from);
        this.minActive = findMinIndex(this.active, this.activeTo);
    }
    next() {
        let from = this.to, wasPoint = this.point;
        this.point = null;
        let trackOpen = this.openStart < 0 ? [] : null, trackExtra = 0;
        for(;;){
            let a = this.minActive;
            if (a > -1 && (this.activeTo[a] - this.cursor.from || this.active[a].endSide - this.cursor.startSide) < 0) {
                if (this.activeTo[a] > from) {
                    this.to = this.activeTo[a];
                    this.endSide = this.active[a].endSide;
                    break;
                }
                this.removeActive(a);
                if (trackOpen) remove(trackOpen, a);
            } else if (!this.cursor.value) {
                this.to = this.endSide = 1000000000;
                break;
            } else if (this.cursor.from > from) {
                this.to = this.cursor.from;
                this.endSide = this.cursor.startSide;
                break;
            } else {
                let nextVal = this.cursor.value;
                if (!nextVal.point) {
                    this.addActive(trackOpen);
                    this.cursor.next();
                } else if (wasPoint && this.cursor.to == this.to && this.cursor.from < this.cursor.to) {
                    this.cursor.next();
                } else if (!this.filterPoint(this.cursor.from, this.cursor.to, this.cursor.value, this.cursor.rank)) {
                    this.cursor.next();
                } else {
                    this.point = nextVal;
                    this.pointFrom = this.cursor.from;
                    this.pointRank = this.cursor.rank;
                    this.to = this.cursor.to;
                    this.endSide = nextVal.endSide;
                    if (this.cursor.from < from) trackExtra = 1;
                    this.cursor.next();
                    if (this.to > from) this.forward(this.to, this.endSide);
                    break;
                }
            }
        }
        if (trackOpen) {
            let openStart = 0;
            while(openStart < trackOpen.length && trackOpen[openStart] < from)openStart++;
            this.openStart = openStart + trackExtra;
        }
    }
    activeForPoint(to) {
        if (!this.active.length) return this.active;
        let active = [];
        for(let i53 = this.active.length - 1; i53 >= 0; i53--){
            if (this.activeRank[i53] < this.pointRank) break;
            if (this.activeTo[i53] > to || this.activeTo[i53] == to && this.active[i53].endSide >= this.point.endSide) active.push(this.active[i53]);
        }
        return active.reverse();
    }
    openEnd(to) {
        let open = 0;
        for(let i54 = this.activeTo.length - 1; i54 >= 0 && this.activeTo[i54] > to; i54--)open++;
        return open;
    }
}
function compare(a, startA, b, startB, length, comparator) {
    a.goto(startA);
    b.goto(startB);
    let endB = startB + length;
    let pos = startB, dPos = startB - startA;
    for(;;){
        let diff = a.to + dPos - b.to || a.endSide - b.endSide;
        let end = diff < 0 ? a.to + dPos : b.to, clipEnd = Math.min(end, endB);
        if (a.point || b.point) {
            if (!(a.point && b.point && (a.point == b.point || a.point.eq(b.point)) && sameValues(a.activeForPoint(a.to + dPos), b.activeForPoint(b.to)))) comparator.comparePoint(pos, clipEnd, a.point, b.point);
        } else {
            if (clipEnd > pos && !sameValues(a.active, b.active)) comparator.compareRange(pos, clipEnd, a.active, b.active);
        }
        if (end > endB) break;
        pos = end;
        if (diff <= 0) a.next();
        if (diff >= 0) b.next();
    }
}
function sameValues(a, b) {
    if (a.length != b.length) return false;
    for(let i55 = 0; i55 < a.length; i55++)if (a[i55] != b[i55] && !a[i55].eq(b[i55])) return false;
    return true;
}
function remove(array, index) {
    for(let i56 = index, e = array.length - 1; i56 < e; i56++)array[i56] = array[i56 + 1];
    array.pop();
}
function insert(array, index, value) {
    for(let i57 = array.length - 1; i57 >= index; i57--)array[i57 + 1] = array[i57];
    array[index] = value;
}
function findMinIndex(value, array) {
    let found = -1, foundPos = 1000000000;
    for(let i58 = 0; i58 < array.length; i58++)if ((array[i58] - foundPos || value[i58].endSide - value[found].endSide) < 0) {
        found = i58;
        foundPos = array[i58];
    }
    return found;
}
var base = {
    8: "Backspace",
    9: "Tab",
    10: "Enter",
    12: "NumLock",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    44: "PrintScreen",
    45: "Insert",
    46: "Delete",
    59: ";",
    61: "=",
    91: "Meta",
    92: "Meta",
    106: "*",
    107: "+",
    108: ",",
    109: "-",
    110: ".",
    111: "/",
    144: "NumLock",
    145: "ScrollLock",
    160: "Shift",
    161: "Shift",
    162: "Control",
    163: "Control",
    164: "Alt",
    165: "Alt",
    173: "-",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
    229: "q"
};
var shift = {
    48: ")",
    49: "!",
    50: "@",
    51: "#",
    52: "$",
    53: "%",
    54: "^",
    55: "&",
    56: "*",
    57: "(",
    59: ":",
    61: "+",
    173: "_",
    186: ":",
    187: "+",
    188: "<",
    189: "_",
    190: ">",
    191: "?",
    192: "~",
    219: "{",
    220: "|",
    221: "}",
    222: "\"",
    229: "Q"
};
var chrome$1 = typeof navigator != "undefined" && /Chrome\/(\d+)/.exec(navigator.userAgent);
var safari$1 = typeof navigator != "undefined" && /Apple Computer/.test(navigator.vendor);
var gecko$1 = typeof navigator != "undefined" && /Gecko\/\d+/.test(navigator.userAgent);
var mac = typeof navigator != "undefined" && /Mac/.test(navigator.platform);
var ie$1 = typeof navigator != "undefined" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
var brokenModifierNames = chrome$1 && (mac || +chrome$1[1] < 57) || gecko$1 && mac;
for(var i1 = 0; i1 < 10; i1++)base[48 + i1] = base[96 + i1] = String(i1);
for(var i1 = 1; i1 <= 24; i1++)base[i1 + 111] = "F" + i1;
for(var i1 = 65; i1 <= 90; i1++){
    base[i1] = String.fromCharCode(i1 + 32);
    shift[i1] = String.fromCharCode(i1);
}
for(var code in base)if (!shift.hasOwnProperty(code)) shift[code] = base[code];
function keyName(event) {
    var ignoreKey = brokenModifierNames && (event.ctrlKey || event.altKey || event.metaKey) || (safari$1 || ie$1) && event.shiftKey && event.key && event.key.length == 1;
    var name2 = !ignoreKey && event.key || (event.shiftKey ? shift : base)[event.keyCode] || event.key || "Unidentified";
    if (name2 == "Esc") name2 = "Escape";
    if (name2 == "Del") name2 = "Delete";
    if (name2 == "Left") name2 = "ArrowLeft";
    if (name2 == "Up") name2 = "ArrowUp";
    if (name2 == "Right") name2 = "ArrowRight";
    if (name2 == "Down") name2 = "ArrowDown";
    return name2;
}
function getSelection(root) {
    let target;
    if (root.nodeType == 11) {
        target = root.getSelection ? root : root.ownerDocument;
    } else {
        target = root;
    }
    return target.getSelection();
}
function contains(dom, node) {
    return node ? dom.contains(node.nodeType != 1 ? node.parentNode : node) : false;
}
function deepActiveElement() {
    let elt = document.activeElement;
    while(elt && elt.shadowRoot)elt = elt.shadowRoot.activeElement;
    return elt;
}
function hasSelection(dom, selection5) {
    if (!selection5.anchorNode) return false;
    try {
        return contains(dom, selection5.anchorNode);
    } catch (_) {
        return false;
    }
}
function clientRectsFor(dom) {
    if (dom.nodeType == 3) return textRange(dom, 0, dom.nodeValue.length).getClientRects();
    else if (dom.nodeType == 1) return dom.getClientRects();
    else return [];
}
function isEquivalentPosition(node, off, targetNode, targetOff) {
    return targetNode ? scanFor(node, off, targetNode, targetOff, -1) || scanFor(node, off, targetNode, targetOff, 1) : false;
}
function domIndex(node) {
    for(var index = 0;; index++){
        node = node.previousSibling;
        if (!node) return index;
    }
}
function scanFor(node, off, targetNode, targetOff, dir) {
    for(;;){
        if (node == targetNode && off == targetOff) return true;
        if (off == (dir < 0 ? 0 : maxOffset(node))) {
            if (node.nodeName == "DIV") return false;
            let parent = node.parentNode;
            if (!parent || parent.nodeType != 1) return false;
            off = domIndex(node) + (dir < 0 ? 0 : 1);
            node = parent;
        } else if (node.nodeType == 1) {
            node = node.childNodes[off + (dir < 0 ? -1 : 0)];
            if (node.nodeType == 1 && node.contentEditable == "false") return false;
            off = dir < 0 ? maxOffset(node) : 0;
        } else {
            return false;
        }
    }
}
function maxOffset(node) {
    return node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length;
}
const Rect0 = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
};
function flattenRect(rect, left) {
    let x = left ? rect.left : rect.right;
    return {
        left: x,
        right: x,
        top: rect.top,
        bottom: rect.bottom
    };
}
function windowRect(win) {
    return {
        left: 0,
        right: win.innerWidth,
        top: 0,
        bottom: win.innerHeight
    };
}
function scrollRectIntoView(dom, rect, side, x, y, xMargin, yMargin, ltr) {
    let doc5 = dom.ownerDocument, win = doc5.defaultView;
    for(let cur8 = dom; cur8;){
        if (cur8.nodeType == 1) {
            let bounding, top3 = cur8 == doc5.body;
            if (top3) {
                bounding = windowRect(win);
            } else {
                if (cur8.scrollHeight <= cur8.clientHeight && cur8.scrollWidth <= cur8.clientWidth) {
                    cur8 = cur8.parentNode;
                    continue;
                }
                let rect = cur8.getBoundingClientRect();
                bounding = {
                    left: rect.left,
                    right: rect.left + cur8.clientWidth,
                    top: rect.top,
                    bottom: rect.top + cur8.clientHeight
                };
            }
            let moveX = 0, moveY = 0;
            if (y == "nearest") {
                if (rect.top < bounding.top) {
                    moveY = -(bounding.top - rect.top + yMargin);
                    if (side > 0 && rect.bottom > bounding.bottom + moveY) moveY = rect.bottom - bounding.bottom + moveY + yMargin;
                } else if (rect.bottom > bounding.bottom) {
                    moveY = rect.bottom - bounding.bottom + yMargin;
                    if (side < 0 && rect.top - moveY < bounding.top) moveY = -(bounding.top + moveY - rect.top + yMargin);
                }
            } else {
                let rectHeight = rect.bottom - rect.top, boundingHeight = bounding.bottom - bounding.top;
                let targetTop = y == "center" && rectHeight <= boundingHeight ? rect.top + rectHeight / 2 - boundingHeight / 2 : y == "start" || y == "center" && side < 0 ? rect.top - yMargin : rect.bottom - boundingHeight + yMargin;
                moveY = targetTop - bounding.top;
            }
            if (x == "nearest") {
                if (rect.left < bounding.left) {
                    moveX = -(bounding.left - rect.left + xMargin);
                    if (side > 0 && rect.right > bounding.right + moveX) moveX = rect.right - bounding.right + moveX + xMargin;
                } else if (rect.right > bounding.right) {
                    moveX = rect.right - bounding.right + xMargin;
                    if (side < 0 && rect.left < bounding.left + moveX) moveX = -(bounding.left + moveX - rect.left + xMargin);
                }
            } else {
                let targetLeft = x == "center" ? rect.left + (rect.right - rect.left) / 2 - (bounding.right - bounding.left) / 2 : x == "start" == ltr ? rect.left - xMargin : rect.right - (bounding.right - bounding.left) + xMargin;
                moveX = targetLeft - bounding.left;
            }
            if (moveX || moveY) {
                if (top3) {
                    win.scrollBy(moveX, moveY);
                } else {
                    if (moveY) {
                        let start = cur8.scrollTop;
                        cur8.scrollTop += moveY;
                        moveY = cur8.scrollTop - start;
                    }
                    if (moveX) {
                        let start = cur8.scrollLeft;
                        cur8.scrollLeft += moveX;
                        moveX = cur8.scrollLeft - start;
                    }
                    rect = {
                        left: rect.left - moveX,
                        top: rect.top - moveY,
                        right: rect.right - moveX,
                        bottom: rect.bottom - moveY
                    };
                }
            }
            if (top3) break;
            cur8 = cur8.assignedSlot || cur8.parentNode;
            x = y = "nearest";
        } else if (cur8.nodeType == 11) {
            cur8 = cur8.host;
        } else {
            break;
        }
    }
}
class DOMSelectionState {
    constructor(){
        this.anchorNode = null;
        this.anchorOffset = 0;
        this.focusNode = null;
        this.focusOffset = 0;
    }
    eq(domSel) {
        return this.anchorNode == domSel.anchorNode && this.anchorOffset == domSel.anchorOffset && this.focusNode == domSel.focusNode && this.focusOffset == domSel.focusOffset;
    }
    setRange(range) {
        this.set(range.anchorNode, range.anchorOffset, range.focusNode, range.focusOffset);
    }
    set(anchorNode, anchorOffset, focusNode, focusOffset) {
        this.anchorNode = anchorNode;
        this.anchorOffset = anchorOffset;
        this.focusNode = focusNode;
        this.focusOffset = focusOffset;
    }
}
let preventScrollSupported = null;
function focusPreventScroll(dom) {
    if (dom.setActive) return dom.setActive();
    if (preventScrollSupported) return dom.focus(preventScrollSupported);
    let stack = [];
    for(let cur9 = dom; cur9; cur9 = cur9.parentNode){
        stack.push(cur9, cur9.scrollTop, cur9.scrollLeft);
        if (cur9 == cur9.ownerDocument) break;
    }
    dom.focus(preventScrollSupported == null ? {
        get preventScroll () {
            preventScrollSupported = {
                preventScroll: true
            };
            return true;
        }
    } : undefined);
    if (!preventScrollSupported) {
        preventScrollSupported = false;
        for(let i59 = 0; i59 < stack.length;){
            let elt = stack[i59++], top4 = stack[i59++], left = stack[i59++];
            if (elt.scrollTop != top4) elt.scrollTop = top4;
            if (elt.scrollLeft != left) elt.scrollLeft = left;
        }
    }
}
let scratchRange;
function textRange(node, from, to = from) {
    let range = scratchRange || (scratchRange = document.createRange());
    range.setEnd(node, to);
    range.setStart(node, from);
    return range;
}
function dispatchKey(elt, name3, code5) {
    let options = {
        key: name3,
        code: name3,
        keyCode: code5,
        which: code5,
        cancelable: true
    };
    let down = new KeyboardEvent("keydown", options);
    down.synthetic = true;
    elt.dispatchEvent(down);
    let up = new KeyboardEvent("keyup", options);
    up.synthetic = true;
    elt.dispatchEvent(up);
    return down.defaultPrevented || up.defaultPrevented;
}
function getRoot(node) {
    while(node){
        if (node && (node.nodeType == 9 || node.nodeType == 11 && node.host)) return node;
        node = node.assignedSlot || node.parentNode;
    }
    return null;
}
function clearAttributes(node) {
    while(node.attributes.length)node.removeAttributeNode(node.attributes[0]);
}
class DOMPos {
    constructor(node, offset, precise = true){
        this.node = node;
        this.offset = offset;
        this.precise = precise;
    }
    static before(dom, precise) {
        return new DOMPos(dom.parentNode, domIndex(dom), precise);
    }
    static after(dom, precise) {
        return new DOMPos(dom.parentNode, domIndex(dom) + 1, precise);
    }
}
const noChildren = [];
class ContentView {
    constructor(){
        this.parent = null;
        this.dom = null;
        this.dirty = 2;
    }
    get editorView() {
        if (!this.parent) throw new Error("Accessing view in orphan content view");
        return this.parent.editorView;
    }
    get overrideDOMText() {
        return null;
    }
    get posAtStart() {
        return this.parent ? this.parent.posBefore(this) : 0;
    }
    get posAtEnd() {
        return this.posAtStart + this.length;
    }
    posBefore(view) {
        let pos = this.posAtStart;
        for (let child of this.children){
            if (child == view) return pos;
            pos += child.length + child.breakAfter;
        }
        throw new RangeError("Invalid child in posBefore");
    }
    posAfter(view) {
        return this.posBefore(view) + view.length;
    }
    coordsAt(_pos, _side) {
        return null;
    }
    sync(track) {
        if (this.dirty & 2) {
            let parent = this.dom;
            let pos = parent.firstChild;
            for (let child of this.children){
                if (child.dirty) {
                    if (!child.dom && pos) {
                        let contentView = ContentView.get(pos);
                        if (!contentView || !contentView.parent && contentView.constructor == child.constructor) child.reuseDOM(pos);
                    }
                    child.sync(track);
                    child.dirty = 0;
                }
                if (track && !track.written && track.node == parent && pos != child.dom) track.written = true;
                if (child.dom.parentNode == parent) {
                    while(pos && pos != child.dom)pos = rm$1(pos);
                    pos = child.dom.nextSibling;
                } else {
                    parent.insertBefore(child.dom, pos);
                }
            }
            if (pos && track && track.node == parent) track.written = true;
            while(pos)pos = rm$1(pos);
        } else if (this.dirty & 1) {
            for (let child of this.children)if (child.dirty) {
                child.sync(track);
                child.dirty = 0;
            }
        }
    }
    reuseDOM(_dom) {
    }
    localPosFromDOM(node, offset) {
        let after;
        if (node == this.dom) {
            after = this.dom.childNodes[offset];
        } else {
            let bias = maxOffset(node) == 0 ? 0 : offset == 0 ? -1 : 1;
            for(;;){
                let parent = node.parentNode;
                if (parent == this.dom) break;
                if (bias == 0 && parent.firstChild != parent.lastChild) {
                    if (node == parent.firstChild) bias = -1;
                    else bias = 1;
                }
                node = parent;
            }
            if (bias < 0) after = node;
            else after = node.nextSibling;
        }
        if (after == this.dom.firstChild) return 0;
        while(after && !ContentView.get(after))after = after.nextSibling;
        if (!after) return this.length;
        for(let i60 = 0, pos = 0;; i60++){
            let child = this.children[i60];
            if (child.dom == after) return pos;
            pos += child.length + child.breakAfter;
        }
    }
    domBoundsAround(from, to, offset = 0) {
        let fromI = -1, fromStart = -1, toI = -1, toEnd = -1;
        for(let i61 = 0, pos = offset, prevEnd = offset; i61 < this.children.length; i61++){
            let child = this.children[i61], end = pos + child.length;
            if (pos < from && end > to) return child.domBoundsAround(from, to, pos);
            if (end >= from && fromI == -1) {
                fromI = i61;
                fromStart = pos;
            }
            if (pos > to && child.dom.parentNode == this.dom) {
                toI = i61;
                toEnd = prevEnd;
                break;
            }
            prevEnd = end;
            pos = end + child.breakAfter;
        }
        return {
            from: fromStart,
            to: toEnd < 0 ? offset + this.length : toEnd,
            startDOM: (fromI ? this.children[fromI - 1].dom.nextSibling : null) || this.dom.firstChild,
            endDOM: toI < this.children.length && toI >= 0 ? this.children[toI].dom : null
        };
    }
    markDirty(andParent = false) {
        this.dirty |= 2;
        this.markParentsDirty(andParent);
    }
    markParentsDirty(childList) {
        for(let parent = this.parent; parent; parent = parent.parent){
            if (childList) parent.dirty |= 2;
            if (parent.dirty & 1) return;
            parent.dirty |= 1;
            childList = false;
        }
    }
    setParent(parent) {
        if (this.parent != parent) {
            this.parent = parent;
            if (this.dirty) this.markParentsDirty(true);
        }
    }
    setDOM(dom) {
        if (this.dom) this.dom.cmView = null;
        this.dom = dom;
        dom.cmView = this;
    }
    get rootView() {
        for(let v = this;;){
            let parent = v.parent;
            if (!parent) return v;
            v = parent;
        }
    }
    replaceChildren(from, to, children = noChildren) {
        this.markDirty();
        for(let i63 = from; i63 < to; i63++){
            let child = this.children[i63];
            if (child.parent == this) child.destroy();
        }
        this.children.splice(from, to - from, ...children);
        for(let i62 = 0; i62 < children.length; i62++)children[i62].setParent(this);
    }
    ignoreMutation(_rec) {
        return false;
    }
    ignoreEvent(_event) {
        return false;
    }
    childCursor(pos = this.length) {
        return new ChildCursor(this.children, pos, this.children.length);
    }
    childPos(pos, bias = 1) {
        return this.childCursor().findPos(pos, bias);
    }
    toString() {
        let name4 = this.constructor.name.replace("View", "");
        return name4 + (this.children.length ? "(" + this.children.join() + ")" : this.length ? "[" + (name4 == "Text" ? this.text : this.length) + "]" : "") + (this.breakAfter ? "#" : "");
    }
    static get(node) {
        return node.cmView;
    }
    get isEditable() {
        return true;
    }
    merge(from, to, source, hasStart, openStart, openEnd) {
        return false;
    }
    become(other) {
        return false;
    }
    getSide() {
        return 0;
    }
    destroy() {
        this.parent = null;
    }
}
ContentView.prototype.breakAfter = 0;
function rm$1(dom) {
    let next = dom.nextSibling;
    dom.parentNode.removeChild(dom);
    return next;
}
class ChildCursor {
    constructor(children, pos, i64){
        this.children = children;
        this.pos = pos;
        this.i = i64;
        this.off = 0;
    }
    findPos(pos, bias = 1) {
        for(;;){
            if (pos > this.pos || pos == this.pos && (bias > 0 || this.i == 0 || this.children[this.i - 1].breakAfter)) {
                this.off = pos - this.pos;
                return this;
            }
            let next = this.children[--this.i];
            this.pos -= next.length + next.breakAfter;
        }
    }
}
function replaceRange(parent, fromI, fromOff, toI, toOff, insert4, breakAtStart, openStart, openEnd) {
    let { children  } = parent;
    let before = children.length ? children[fromI] : null;
    let last = insert4.length ? insert4[insert4.length - 1] : null;
    let breakAtEnd = last ? last.breakAfter : breakAtStart;
    if (fromI == toI && before && !breakAtStart && !breakAtEnd && insert4.length < 2 && before.merge(fromOff, toOff, insert4.length ? last : null, fromOff == 0, openStart, openEnd)) return;
    if (toI < children.length) {
        let after = children[toI];
        if (after && toOff < after.length) {
            if (fromI == toI) {
                after = after.split(toOff);
                toOff = 0;
            }
            if (!breakAtEnd && last && after.merge(0, toOff, last, true, 0, openEnd)) {
                insert4[insert4.length - 1] = after;
            } else {
                if (toOff) after.merge(0, toOff, null, false, 0, openEnd);
                insert4.push(after);
            }
        } else if (after === null || after === void 0 ? void 0 : after.breakAfter) {
            if (last) last.breakAfter = 1;
            else breakAtStart = 1;
        }
        toI++;
    }
    if (before) {
        before.breakAfter = breakAtStart;
        if (fromOff > 0) {
            if (!breakAtStart && insert4.length && before.merge(fromOff, before.length, insert4[0], false, openStart, 0)) {
                before.breakAfter = insert4.shift().breakAfter;
            } else if (fromOff < before.length || before.children.length && before.children[before.children.length - 1].length == 0) {
                before.merge(fromOff, before.length, null, false, openStart, 0);
            }
            fromI++;
        }
    }
    while(fromI < toI && insert4.length){
        if (children[toI - 1].become(insert4[insert4.length - 1])) {
            toI--;
            insert4.pop();
            openEnd = insert4.length ? 0 : openStart;
        } else if (children[fromI].become(insert4[0])) {
            fromI++;
            insert4.shift();
            openStart = insert4.length ? 0 : openEnd;
        } else {
            break;
        }
    }
    if (!insert4.length && fromI && toI < children.length && !children[fromI - 1].breakAfter && children[toI].merge(0, 0, children[fromI - 1], false, openStart, openEnd)) fromI--;
    if (fromI < toI || insert4.length) parent.replaceChildren(fromI, toI, insert4);
}
function mergeChildrenInto(parent, from, to, insert5, openStart, openEnd) {
    let cur10 = parent.childCursor();
    let { i: toI , off: toOff  } = cur10.findPos(to, 1);
    let { i: fromI , off: fromOff  } = cur10.findPos(from, -1);
    let dLen = from - to;
    for (let view of insert5)dLen += view.length;
    parent.length += dLen;
    replaceRange(parent, fromI, fromOff, toI, toOff, insert5, 0, openStart, openEnd);
}
let [nav, doc] = typeof navigator != "undefined" ? [
    navigator,
    document
] : [
    {
        userAgent: "",
        vendor: "",
        platform: ""
    },
    {
        documentElement: {
            style: {
            }
        }
    }
];
const ie_edge = /Edge\/(\d+)/.exec(nav.userAgent);
const ie_upto10 = /MSIE \d/.test(nav.userAgent);
const ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(nav.userAgent);
const ie = !!(ie_upto10 || ie_11up || ie_edge);
const gecko = !ie && /gecko\/(\d+)/i.test(nav.userAgent);
const chrome = !ie && /Chrome\/(\d+)/.exec(nav.userAgent);
const webkit = "webkitFontSmoothing" in doc.documentElement.style;
const safari = !ie && /Apple Computer/.test(nav.vendor);
const ios$1 = safari && (/Mobile\/\w+/.test(nav.userAgent) || nav.maxTouchPoints > 2);
var browser = {
    mac: ios$1 || /Mac/.test(nav.platform),
    windows: /Win/.test(nav.platform),
    linux: /Linux|X11/.test(nav.platform),
    ie,
    ie_version: ie_upto10 ? doc.documentMode || 6 : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : 0,
    gecko,
    gecko_version: gecko ? +(/Firefox\/(\d+)/.exec(nav.userAgent) || [
        0,
        0
    ])[1] : 0,
    chrome: !!chrome,
    chrome_version: chrome ? +chrome[1] : 0,
    ios: ios$1,
    android: /Android\b/.test(nav.userAgent),
    webkit,
    safari,
    webkit_version: webkit ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [
        0,
        0
    ])[1] : 0,
    tabSize: doc.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
class TextView extends ContentView {
    constructor(text){
        super();
        this.text = text;
    }
    get length() {
        return this.text.length;
    }
    createDOM(textDOM) {
        this.setDOM(textDOM || document.createTextNode(this.text));
    }
    sync(track) {
        if (!this.dom) this.createDOM();
        if (this.dom.nodeValue != this.text) {
            if (track && track.node == this.dom) track.written = true;
            this.dom.nodeValue = this.text;
        }
    }
    reuseDOM(dom) {
        if (dom.nodeType == 3) this.createDOM(dom);
    }
    merge(from, to, source) {
        if (source && (!(source instanceof TextView) || this.length - (to - from) + source.length > 256)) return false;
        this.text = this.text.slice(0, from) + (source ? source.text : "") + this.text.slice(to);
        this.markDirty();
        return true;
    }
    split(from) {
        let result = new TextView(this.text.slice(from));
        this.text = this.text.slice(0, from);
        this.markDirty();
        return result;
    }
    localPosFromDOM(node, offset) {
        return node == this.dom ? offset : offset ? this.text.length : 0;
    }
    domAtPos(pos) {
        return new DOMPos(this.dom, pos);
    }
    domBoundsAround(_from, _to, offset) {
        return {
            from: offset,
            to: offset + this.length,
            startDOM: this.dom,
            endDOM: this.dom.nextSibling
        };
    }
    coordsAt(pos, side) {
        return textCoords(this.dom, pos, side);
    }
}
class MarkView extends ContentView {
    constructor(mark, children = [], length = 0){
        super();
        this.mark = mark;
        this.children = children;
        this.length = length;
        for (let ch of children)ch.setParent(this);
    }
    setAttrs(dom) {
        clearAttributes(dom);
        if (this.mark.class) dom.className = this.mark.class;
        if (this.mark.attrs) for(let name5 in this.mark.attrs)dom.setAttribute(name5, this.mark.attrs[name5]);
        return dom;
    }
    reuseDOM(node) {
        if (node.nodeName == this.mark.tagName.toUpperCase()) {
            this.setDOM(node);
            this.dirty |= 4 | 2;
        }
    }
    sync(track) {
        if (!this.dom) this.setDOM(this.setAttrs(document.createElement(this.mark.tagName)));
        else if (this.dirty & 4) this.setAttrs(this.dom);
        super.sync(track);
    }
    merge(from, to, source, _hasStart, openStart, openEnd) {
        if (source && (!(source instanceof MarkView && source.mark.eq(this.mark)) || from && openStart <= 0 || to < this.length && openEnd <= 0)) return false;
        mergeChildrenInto(this, from, to, source ? source.children : [], openStart - 1, openEnd - 1);
        this.markDirty();
        return true;
    }
    split(from) {
        let result = [], off = 0, detachFrom = -1, i65 = 0;
        for (let elt of this.children){
            let end = off + elt.length;
            if (end > from) result.push(off < from ? elt.split(from - off) : elt);
            if (detachFrom < 0 && off >= from) detachFrom = i65;
            off = end;
            i65++;
        }
        let length = this.length - from;
        this.length = from;
        if (detachFrom > -1) {
            this.children.length = detachFrom;
            this.markDirty();
        }
        return new MarkView(this.mark, result, length);
    }
    domAtPos(pos) {
        return inlineDOMAtPos(this.dom, this.children, pos);
    }
    coordsAt(pos, side) {
        return coordsInChildren(this, pos, side);
    }
}
function textCoords(text, pos, side) {
    let length = text.nodeValue.length;
    if (pos > length) pos = length;
    let from = pos, to = pos, flatten1 = 0;
    if (pos == 0 && side < 0 || pos == length && side >= 0) {
        if (!(browser.chrome || browser.gecko)) {
            if (pos) {
                from--;
                flatten1 = 1;
            } else {
                to++;
                flatten1 = -1;
            }
        }
    } else {
        if (side < 0) from--;
        else to++;
    }
    let rects = textRange(text, from, to).getClientRects();
    if (!rects.length) return Rect0;
    let rect = rects[(flatten1 ? flatten1 < 0 : side >= 0) ? 0 : rects.length - 1];
    if (browser.safari && !flatten1 && rect.width == 0) rect = Array.prototype.find.call(rects, (r)=>r.width
    ) || rect;
    return flatten1 ? flattenRect(rect, flatten1 < 0) : rect || null;
}
class WidgetView extends ContentView {
    constructor(widget, length, side){
        super();
        this.widget = widget;
        this.length = length;
        this.side = side;
    }
    static create(widget, length, side) {
        return new (widget.customView || WidgetView)(widget, length, side);
    }
    split(from) {
        let result = WidgetView.create(this.widget, this.length - from, this.side);
        this.length -= from;
        return result;
    }
    sync() {
        if (!this.dom || !this.widget.updateDOM(this.dom)) {
            this.setDOM(this.widget.toDOM(this.editorView));
            this.dom.contentEditable = "false";
        }
    }
    getSide() {
        return this.side;
    }
    merge(from, to, source, hasStart, openStart, openEnd) {
        if (source && (!(source instanceof WidgetView) || !this.widget.compare(source.widget) || from > 0 && openStart <= 0 || to < this.length && openEnd <= 0)) return false;
        this.length = from + (source ? source.length : 0) + (this.length - to);
        return true;
    }
    become(other) {
        if (other.length == this.length && other instanceof WidgetView && other.side == this.side) {
            if (this.widget.constructor == other.widget.constructor) {
                if (!this.widget.eq(other.widget)) this.markDirty(true);
                this.widget = other.widget;
                return true;
            }
        }
        return false;
    }
    ignoreMutation() {
        return true;
    }
    ignoreEvent(event) {
        return this.widget.ignoreEvent(event);
    }
    get overrideDOMText() {
        if (this.length == 0) return Text.empty;
        let top5 = this;
        while(top5.parent)top5 = top5.parent;
        let view = top5.editorView, text = view && view.state.doc, start = this.posAtStart;
        return text ? text.slice(start, start + this.length) : Text.empty;
    }
    domAtPos(pos) {
        return pos == 0 ? DOMPos.before(this.dom) : DOMPos.after(this.dom, pos == this.length);
    }
    domBoundsAround() {
        return null;
    }
    coordsAt(pos, side) {
        let rects = this.dom.getClientRects(), rect = null;
        if (!rects.length) return Rect0;
        for(let i66 = pos > 0 ? rects.length - 1 : 0;; i66 += pos > 0 ? -1 : 1){
            rect = rects[i66];
            if (pos > 0 ? i66 == 0 : i66 == rects.length - 1 || rect.top < rect.bottom) break;
        }
        return pos == 0 && side > 0 || pos == this.length && side <= 0 ? rect : flattenRect(rect, pos == 0);
    }
    get isEditable() {
        return false;
    }
    destroy() {
        super.destroy();
        if (this.dom) this.widget.destroy(this.dom);
    }
}
class CompositionView extends WidgetView {
    domAtPos(pos) {
        return new DOMPos(this.widget.text, pos);
    }
    sync() {
        this.setDOM(this.widget.toDOM());
    }
    localPosFromDOM(node, offset) {
        return !offset ? 0 : node.nodeType == 3 ? Math.min(offset, this.length) : this.length;
    }
    ignoreMutation() {
        return false;
    }
    get overrideDOMText() {
        return null;
    }
    coordsAt(pos, side) {
        return textCoords(this.widget.text, pos, side);
    }
    get isEditable() {
        return true;
    }
}
const ZeroWidthSpace = browser.android ? "\u200b\u200b" : "\u200b";
class WidgetBufferView extends ContentView {
    constructor(side){
        super();
        this.side = side;
    }
    get length() {
        return 0;
    }
    merge() {
        return false;
    }
    become(other) {
        return other instanceof WidgetBufferView && other.side == this.side;
    }
    split() {
        return new WidgetBufferView(this.side);
    }
    sync() {
        if (!this.dom) this.setDOM(document.createTextNode(ZeroWidthSpace));
        else if (this.dirty && this.dom.nodeValue != ZeroWidthSpace) this.dom.nodeValue = ZeroWidthSpace;
    }
    getSide() {
        return this.side;
    }
    domAtPos(pos) {
        return DOMPos.before(this.dom);
    }
    localPosFromDOM() {
        return 0;
    }
    domBoundsAround() {
        return null;
    }
    coordsAt(pos) {
        let rects = clientRectsFor(this.dom);
        return rects[rects.length - 1] || null;
    }
    get overrideDOMText() {
        return Text.of([
            this.dom.nodeValue.replace(/\u200b/g, "")
        ]);
    }
}
TextView.prototype.children = WidgetView.prototype.children = WidgetBufferView.prototype.children = noChildren;
function inlineDOMAtPos(dom, children, pos) {
    let i67 = 0;
    for(let off = 0; i67 < children.length; i67++){
        let child = children[i67], end = off + child.length;
        if (end == off && child.getSide() <= 0) continue;
        if (pos > off && pos < end && child.dom.parentNode == dom) return child.domAtPos(pos - off);
        if (pos <= off) break;
        off = end;
    }
    for(; i67 > 0; i67--){
        let before = children[i67 - 1].dom;
        if (before.parentNode == dom) return DOMPos.after(before);
    }
    return new DOMPos(dom, 0);
}
function joinInlineInto(parent, view, open) {
    let last, { children  } = parent;
    if (open > 0 && view instanceof MarkView && children.length && (last = children[children.length - 1]) instanceof MarkView && last.mark.eq(view.mark)) {
        joinInlineInto(last, view.children[0], open - 1);
    } else {
        children.push(view);
        view.setParent(parent);
    }
    parent.length += view.length;
}
function coordsInChildren(view, pos, side) {
    for(let off = 0, i68 = 0; i68 < view.children.length; i68++){
        let child = view.children[i68], end = off + child.length, next;
        if ((side <= 0 || end == view.length || child.getSide() > 0 ? end >= pos : end > pos) && (pos < end || i68 + 1 == view.children.length || (next = view.children[i68 + 1]).length || next.getSide() > 0)) {
            let flatten2 = 0;
            if (end == off) {
                if (child.getSide() <= 0) continue;
                flatten2 = side = -child.getSide();
            }
            let rect = child.coordsAt(pos - off, side);
            return flatten2 && rect ? flattenRect(rect, side < 0) : rect;
        }
        off = end;
    }
    let last = view.dom.lastChild;
    if (!last) return view.dom.getBoundingClientRect();
    let rects = clientRectsFor(last);
    return rects[rects.length - 1] || null;
}
function combineAttrs(source, target) {
    for(let name6 in source){
        if (name6 == "class" && target.class) target.class += " " + source.class;
        else if (name6 == "style" && target.style) target.style += ";" + source.style;
        else target[name6] = source[name6];
    }
    return target;
}
function attrsEq(a, b) {
    if (a == b) return true;
    if (!a || !b) return false;
    let keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length != keysB.length) return false;
    for (let key of keysA){
        if (keysB.indexOf(key) == -1 || a[key] !== b[key]) return false;
    }
    return true;
}
function updateAttrs(dom, prev, attrs) {
    if (prev) {
        for(let name7 in prev)if (!(attrs && name7 in attrs)) dom.removeAttribute(name7);
    }
    if (attrs) {
        for(let name8 in attrs)if (!(prev && prev[name8] == attrs[name8])) dom.setAttribute(name8, attrs[name8]);
    }
}
class WidgetType {
    eq(_widget) {
        return false;
    }
    updateDOM(_dom) {
        return false;
    }
    compare(other) {
        return this == other || this.constructor == other.constructor && this.eq(other);
    }
    get estimatedHeight() {
        return -1;
    }
    ignoreEvent(_event) {
        return true;
    }
    get customView() {
        return null;
    }
    destroy(_dom) {
    }
}
var BlockType = function(BlockType1) {
    BlockType1[BlockType1["Text"] = 0] = "Text";
    BlockType1[BlockType1["WidgetBefore"] = 1] = "WidgetBefore";
    BlockType1[BlockType1["WidgetAfter"] = 2] = "WidgetAfter";
    BlockType1[BlockType1["WidgetRange"] = 3] = "WidgetRange";
    return BlockType1;
}(BlockType || (BlockType = {
}));
class Decoration extends RangeValue {
    constructor(startSide, endSide, widget, spec){
        super();
        this.startSide = startSide;
        this.endSide = endSide;
        this.widget = widget;
        this.spec = spec;
    }
    get heightRelevant() {
        return false;
    }
    static mark(spec) {
        return new MarkDecoration(spec);
    }
    static widget(spec) {
        let side = spec.side || 0, block = !!spec.block;
        side += block ? side > 0 ? 300000000 : -400000000 : side > 0 ? 100000000 : -100000000;
        return new PointDecoration(spec, side, side, block, spec.widget || null, false);
    }
    static replace(spec) {
        let block = !!spec.block;
        let { start , end  } = getInclusive(spec, block);
        let startSide = block ? start ? -300000000 : -1 : 400000000;
        let endSide = block ? end ? 200000000 : 1 : -500000000;
        return new PointDecoration(spec, startSide, endSide, block, spec.widget || null, true);
    }
    static line(spec) {
        return new LineDecoration(spec);
    }
    static set(of, sort = false) {
        return RangeSet.of(of, sort);
    }
    hasHeight() {
        return this.widget ? this.widget.estimatedHeight > -1 : false;
    }
}
Decoration.none = RangeSet.empty;
class MarkDecoration extends Decoration {
    constructor(spec){
        let { start , end  } = getInclusive(spec);
        super(start ? -1 : 400000000, end ? 1 : -500000000, null, spec);
        this.tagName = spec.tagName || "span";
        this.class = spec.class || "";
        this.attrs = spec.attributes || null;
    }
    eq(other) {
        return this == other || other instanceof MarkDecoration && this.tagName == other.tagName && this.class == other.class && attrsEq(this.attrs, other.attrs);
    }
    range(from, to = from) {
        if (from >= to) throw new RangeError("Mark decorations may not be empty");
        return super.range(from, to);
    }
}
MarkDecoration.prototype.point = false;
class LineDecoration extends Decoration {
    constructor(spec){
        super(-200000000, -200000000, null, spec);
    }
    eq(other) {
        return other instanceof LineDecoration && attrsEq(this.spec.attributes, other.spec.attributes);
    }
    range(from, to = from) {
        if (to != from) throw new RangeError("Line decoration ranges must be zero-length");
        return super.range(from, to);
    }
}
LineDecoration.prototype.mapMode = MapMode.TrackBefore;
LineDecoration.prototype.point = true;
class PointDecoration extends Decoration {
    constructor(spec, startSide, endSide, block, widget, isReplace){
        super(startSide, endSide, widget, spec);
        this.block = block;
        this.isReplace = isReplace;
        this.mapMode = !block ? MapMode.TrackDel : startSide <= 0 ? MapMode.TrackBefore : MapMode.TrackAfter;
    }
    get type() {
        return this.startSide < this.endSide ? BlockType.WidgetRange : this.startSide <= 0 ? BlockType.WidgetBefore : BlockType.WidgetAfter;
    }
    get heightRelevant() {
        return this.block || !!this.widget && this.widget.estimatedHeight >= 5;
    }
    eq(other) {
        return other instanceof PointDecoration && widgetsEq(this.widget, other.widget) && this.block == other.block && this.startSide == other.startSide && this.endSide == other.endSide;
    }
    range(from, to = from) {
        if (this.isReplace && (from > to || from == to && this.startSide > 0 && this.endSide <= 0)) throw new RangeError("Invalid range for replacement decoration");
        if (!this.isReplace && to != from) throw new RangeError("Widget decorations can only have zero-length ranges");
        return super.range(from, to);
    }
}
PointDecoration.prototype.point = true;
function getInclusive(spec, block = false) {
    let { inclusiveStart: start , inclusiveEnd: end  } = spec;
    if (start == null) start = spec.inclusive;
    if (end == null) end = spec.inclusive;
    return {
        start: start !== null && start !== void 0 ? start : block,
        end: end !== null && end !== void 0 ? end : block
    };
}
function widgetsEq(a, b) {
    return a == b || !!(a && b && a.compare(b));
}
function addRange(from, to, ranges, margin = 0) {
    let last = ranges.length - 1;
    if (last >= 0 && ranges[last] + margin >= from) ranges[last] = Math.max(ranges[last], to);
    else ranges.push(from, to);
}
class LineView extends ContentView {
    constructor(){
        super(...arguments);
        this.children = [];
        this.length = 0;
        this.prevAttrs = undefined;
        this.attrs = null;
        this.breakAfter = 0;
    }
    merge(from, to, source, hasStart, openStart, openEnd) {
        if (source) {
            if (!(source instanceof LineView)) return false;
            if (!this.dom) source.transferDOM(this);
        }
        if (hasStart) this.setDeco(source ? source.attrs : null);
        mergeChildrenInto(this, from, to, source ? source.children : [], openStart, openEnd);
        return true;
    }
    split(at) {
        let end = new LineView;
        end.breakAfter = this.breakAfter;
        if (this.length == 0) return end;
        let { i: i69 , off  } = this.childPos(at);
        if (off) {
            end.append(this.children[i69].split(off), 0);
            this.children[i69].merge(off, this.children[i69].length, null, false, 0, 0);
            i69++;
        }
        for(let j = i69; j < this.children.length; j++)end.append(this.children[j], 0);
        while(i69 > 0 && this.children[i69 - 1].length == 0)this.children[--i69].destroy();
        this.children.length = i69;
        this.markDirty();
        this.length = at;
        return end;
    }
    transferDOM(other) {
        if (!this.dom) return;
        other.setDOM(this.dom);
        other.prevAttrs = this.prevAttrs === undefined ? this.attrs : this.prevAttrs;
        this.prevAttrs = undefined;
        this.dom = null;
    }
    setDeco(attrs) {
        if (!attrsEq(this.attrs, attrs)) {
            if (this.dom) {
                this.prevAttrs = this.attrs;
                this.markDirty();
            }
            this.attrs = attrs;
        }
    }
    append(child, openStart) {
        joinInlineInto(this, child, openStart);
    }
    addLineDeco(deco) {
        let attrs = deco.spec.attributes, cls = deco.spec.class;
        if (attrs) this.attrs = combineAttrs(attrs, this.attrs || {
        });
        if (cls) this.attrs = combineAttrs({
            class: cls
        }, this.attrs || {
        });
    }
    domAtPos(pos) {
        return inlineDOMAtPos(this.dom, this.children, pos);
    }
    reuseDOM(node) {
        if (node.nodeName == "DIV") {
            this.setDOM(node);
            this.dirty |= 4 | 2;
        }
    }
    sync(track) {
        var _a;
        if (!this.dom) {
            this.setDOM(document.createElement("div"));
            this.dom.className = "cm-line";
            this.prevAttrs = this.attrs ? null : undefined;
        } else if (this.dirty & 4) {
            clearAttributes(this.dom);
            this.dom.className = "cm-line";
            this.prevAttrs = this.attrs ? null : undefined;
        }
        if (this.prevAttrs !== undefined) {
            updateAttrs(this.dom, this.prevAttrs, this.attrs);
            this.dom.classList.add("cm-line");
            this.prevAttrs = undefined;
        }
        super.sync(track);
        let last = this.dom.lastChild;
        while(last && ContentView.get(last) instanceof MarkView)last = last.lastChild;
        if (!last || last.nodeName != "BR" && ((_a = ContentView.get(last)) === null || _a === void 0 ? void 0 : _a.isEditable) == false && (!browser.ios || !this.children.some((ch)=>ch instanceof TextView
        ))) {
            let hack = document.createElement("BR");
            hack.cmIgnore = true;
            this.dom.appendChild(hack);
        }
    }
    measureTextSize() {
        if (this.children.length == 0 || this.length > 20) return null;
        let totalWidth = 0;
        for (let child of this.children){
            if (!(child instanceof TextView)) return null;
            let rects = clientRectsFor(child.dom);
            if (rects.length != 1) return null;
            totalWidth += rects[0].width;
        }
        return {
            lineHeight: this.dom.getBoundingClientRect().height,
            charWidth: totalWidth / this.length
        };
    }
    coordsAt(pos, side) {
        return coordsInChildren(this, pos, side);
    }
    become(_other) {
        return false;
    }
    get type() {
        return BlockType.Text;
    }
    static find(docView, pos) {
        for(let i70 = 0, off = 0; i70 < docView.children.length; i70++){
            let block = docView.children[i70], end = off + block.length;
            if (end >= pos) {
                if (block instanceof LineView) return block;
                if (end > pos) break;
            }
            off = end + block.breakAfter;
        }
        return null;
    }
}
class BlockWidgetView extends ContentView {
    constructor(widget, length, type){
        super();
        this.widget = widget;
        this.length = length;
        this.type = type;
        this.breakAfter = 0;
    }
    merge(from, to, source, _takeDeco, openStart, openEnd) {
        if (source && (!(source instanceof BlockWidgetView) || !this.widget.compare(source.widget) || from > 0 && openStart <= 0 || to < this.length && openEnd <= 0)) return false;
        this.length = from + (source ? source.length : 0) + (this.length - to);
        return true;
    }
    domAtPos(pos) {
        return pos == 0 ? DOMPos.before(this.dom) : DOMPos.after(this.dom, pos == this.length);
    }
    split(at) {
        let len = this.length - at;
        this.length = at;
        let end = new BlockWidgetView(this.widget, len, this.type);
        end.breakAfter = this.breakAfter;
        return end;
    }
    get children() {
        return noChildren;
    }
    sync() {
        if (!this.dom || !this.widget.updateDOM(this.dom)) {
            this.setDOM(this.widget.toDOM(this.editorView));
            this.dom.contentEditable = "false";
        }
    }
    get overrideDOMText() {
        return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : Text.empty;
    }
    domBoundsAround() {
        return null;
    }
    become(other) {
        if (other instanceof BlockWidgetView && other.type == this.type && other.widget.constructor == this.widget.constructor) {
            if (!other.widget.eq(this.widget)) this.markDirty(true);
            this.widget = other.widget;
            this.length = other.length;
            this.breakAfter = other.breakAfter;
            return true;
        }
        return false;
    }
    ignoreMutation() {
        return true;
    }
    ignoreEvent(event) {
        return this.widget.ignoreEvent(event);
    }
    destroy() {
        super.destroy();
        if (this.dom) this.widget.destroy(this.dom);
    }
}
class ContentBuilder {
    constructor(doc6, pos, end, disallowBlockEffectsBelow){
        this.doc = doc6;
        this.pos = pos;
        this.end = end;
        this.disallowBlockEffectsBelow = disallowBlockEffectsBelow;
        this.content = [];
        this.curLine = null;
        this.breakAtStart = 0;
        this.pendingBuffer = 0;
        this.atCursorPos = true;
        this.openStart = -1;
        this.openEnd = -1;
        this.text = "";
        this.textOff = 0;
        this.cursor = doc6.iter();
        this.skip = pos;
    }
    posCovered() {
        if (this.content.length == 0) return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
        let last = this.content[this.content.length - 1];
        return !last.breakAfter && !(last instanceof BlockWidgetView && last.type == BlockType.WidgetBefore);
    }
    getLine() {
        if (!this.curLine) {
            this.content.push(this.curLine = new LineView);
            this.atCursorPos = true;
        }
        return this.curLine;
    }
    flushBuffer(active) {
        if (this.pendingBuffer) {
            this.curLine.append(wrapMarks(new WidgetBufferView(-1), active), active.length);
            this.pendingBuffer = 0;
        }
    }
    addBlockWidget(view) {
        this.flushBuffer([]);
        this.curLine = null;
        this.content.push(view);
    }
    finish(openEnd) {
        if (!openEnd) this.flushBuffer([]);
        else this.pendingBuffer = 0;
        if (!this.posCovered()) this.getLine();
    }
    buildText(length, active, openStart) {
        while(length > 0){
            if (this.textOff == this.text.length) {
                let { value , lineBreak , done  } = this.cursor.next(this.skip);
                this.skip = 0;
                if (done) throw new Error("Ran out of text content when drawing inline views");
                if (lineBreak) {
                    if (!this.posCovered()) this.getLine();
                    if (this.content.length) this.content[this.content.length - 1].breakAfter = 1;
                    else this.breakAtStart = 1;
                    this.flushBuffer([]);
                    this.curLine = null;
                    length--;
                    continue;
                } else {
                    this.text = value;
                    this.textOff = 0;
                }
            }
            let take = Math.min(this.text.length - this.textOff, length, 512);
            this.flushBuffer(active.slice(0, openStart));
            this.getLine().append(wrapMarks(new TextView(this.text.slice(this.textOff, this.textOff + take)), active), openStart);
            this.atCursorPos = true;
            this.textOff += take;
            length -= take;
            openStart = 0;
        }
    }
    span(from, to, active, openStart) {
        this.buildText(to - from, active, openStart);
        this.pos = to;
        if (this.openStart < 0) this.openStart = openStart;
    }
    point(from, to, deco, active, openStart) {
        let len = to - from;
        if (deco instanceof PointDecoration) {
            if (deco.block) {
                let { type  } = deco;
                if (type == BlockType.WidgetAfter && !this.posCovered()) this.getLine();
                this.addBlockWidget(new BlockWidgetView(deco.widget || new NullWidget("div"), len, type));
            } else {
                let view = WidgetView.create(deco.widget || new NullWidget("span"), len, deco.startSide);
                let cursorBefore = this.atCursorPos && !view.isEditable && openStart <= active.length && (from < to || deco.startSide > 0);
                let cursorAfter = !view.isEditable && (from < to || deco.startSide <= 0);
                let line = this.getLine();
                if (this.pendingBuffer == 2 && !cursorBefore) this.pendingBuffer = 0;
                this.flushBuffer(active);
                if (cursorBefore) {
                    line.append(wrapMarks(new WidgetBufferView(1), active), openStart);
                    openStart = active.length + Math.max(0, openStart - active.length);
                }
                line.append(wrapMarks(view, active), openStart);
                this.atCursorPos = cursorAfter;
                this.pendingBuffer = !cursorAfter ? 0 : from < to ? 1 : 2;
            }
        } else if (this.doc.lineAt(this.pos).from == this.pos) {
            this.getLine().addLineDeco(deco);
        }
        if (len) {
            if (this.textOff + len <= this.text.length) {
                this.textOff += len;
            } else {
                this.skip += len - (this.text.length - this.textOff);
                this.text = "";
                this.textOff = 0;
            }
            this.pos = to;
        }
        if (this.openStart < 0) this.openStart = openStart;
    }
    filterPoint(from, to, value, index) {
        if (index >= this.disallowBlockEffectsBelow || !(value instanceof PointDecoration)) return true;
        if (value.block) throw new RangeError("Block decorations may not be specified via plugins");
        return to <= this.doc.lineAt(this.pos).to;
    }
    static build(text, from, to, decorations1, pluginDecorationLength) {
        let builder = new ContentBuilder(text, from, to, pluginDecorationLength);
        builder.openEnd = RangeSet.spans(decorations1, from, to, builder);
        if (builder.openStart < 0) builder.openStart = builder.openEnd;
        builder.finish(builder.openEnd);
        return builder;
    }
}
function wrapMarks(view, active) {
    for (let mark of active)view = new MarkView(mark, [
        view
    ], view.length);
    return view;
}
class NullWidget extends WidgetType {
    constructor(tag){
        super();
        this.tag = tag;
    }
    eq(other) {
        return other.tag == this.tag;
    }
    toDOM() {
        return document.createElement(this.tag);
    }
    updateDOM(elt) {
        return elt.nodeName.toLowerCase() == this.tag;
    }
}
const none$2 = [];
const clickAddsSelectionRange = Facet.define();
const dragMovesSelection$1 = Facet.define();
const mouseSelectionStyle = Facet.define();
const exceptionSink = Facet.define();
const updateListener = Facet.define();
const inputHandler = Facet.define();
const scrollTo = StateEffect.define({
    map: (range, changes)=>range.map(changes)
});
const centerOn = StateEffect.define({
    map: (range, changes)=>range.map(changes)
});
class ScrollTarget {
    constructor(range, y = "nearest", x = "nearest", yMargin = 5, xMargin = 5){
        this.range = range;
        this.y = y;
        this.x = x;
        this.yMargin = yMargin;
        this.xMargin = xMargin;
    }
    map(changes) {
        return changes.empty ? this : new ScrollTarget(this.range.map(changes), this.y, this.x, this.yMargin, this.xMargin);
    }
}
const scrollIntoView$1 = StateEffect.define({
    map: (t1, ch)=>t1.map(ch)
});
function logException(state, exception, context) {
    let handler = state.facet(exceptionSink);
    if (handler.length) handler[0](exception);
    else if (window.onerror) window.onerror(String(exception), context, undefined, undefined, exception);
    else if (context) console.error(context + ":", exception);
    else console.error(exception);
}
const editable = Facet.define({
    combine: (values)=>values.length ? values[0] : true
});
class PluginFieldProvider {
    constructor(field, get){
        this.field = field;
        this.get = get;
    }
}
class PluginField {
    from(get) {
        return new PluginFieldProvider(this, get);
    }
    static define() {
        return new PluginField();
    }
}
PluginField.decorations = PluginField.define();
PluginField.atomicRanges = PluginField.define();
PluginField.scrollMargins = PluginField.define();
let nextPluginID = 0;
const viewPlugin = Facet.define();
class ViewPlugin {
    constructor(id, create, fields){
        this.id = id;
        this.create = create;
        this.fields = fields;
        this.extension = viewPlugin.of(this);
    }
    static define(create, spec) {
        let { eventHandlers , provide , decorations: decorations2  } = spec || {
        };
        let fields = [];
        if (provide) for (let provider of Array.isArray(provide) ? provide : [
            provide
        ])fields.push(provider);
        if (eventHandlers) fields.push(domEventHandlers.from((value)=>({
                plugin: value,
                handlers: eventHandlers
            })
        ));
        if (decorations2) fields.push(PluginField.decorations.from(decorations2));
        return new ViewPlugin(nextPluginID++, create, fields);
    }
    static fromClass(cls, spec) {
        return ViewPlugin.define((view)=>new cls(view)
        , spec);
    }
}
const domEventHandlers = PluginField.define();
class PluginInstance {
    constructor(spec){
        this.spec = spec;
        this.mustUpdate = null;
        this.value = null;
    }
    takeField(type, target) {
        if (this.spec) {
            for (let { field , get  } of this.spec.fields)if (field == type) target.push(get(this.value));
        }
    }
    update(view) {
        if (!this.value) {
            if (this.spec) {
                try {
                    this.value = this.spec.create(view);
                } catch (e) {
                    logException(view.state, e, "CodeMirror plugin crashed");
                    this.deactivate();
                }
            }
        } else if (this.mustUpdate) {
            let update = this.mustUpdate;
            this.mustUpdate = null;
            if (this.value.update) {
                try {
                    this.value.update(update);
                } catch (e) {
                    logException(update.state, e, "CodeMirror plugin crashed");
                    if (this.value.destroy) try {
                        this.value.destroy();
                    } catch (_) {
                    }
                    this.deactivate();
                }
            }
        }
        return this;
    }
    destroy(view) {
        var _a;
        if ((_a = this.value) === null || _a === void 0 ? void 0 : _a.destroy) {
            try {
                this.value.destroy();
            } catch (e) {
                logException(view.state, e, "CodeMirror plugin crashed");
            }
        }
    }
    deactivate() {
        this.spec = this.value = null;
    }
}
const editorAttributes = Facet.define();
const contentAttributes = Facet.define();
const decorations = Facet.define();
const styleModule = Facet.define();
class ChangedRange {
    constructor(fromA, toA, fromB, toB){
        this.fromA = fromA;
        this.toA = toA;
        this.fromB = fromB;
        this.toB = toB;
    }
    join(other) {
        return new ChangedRange(Math.min(this.fromA, other.fromA), Math.max(this.toA, other.toA), Math.min(this.fromB, other.fromB), Math.max(this.toB, other.toB));
    }
    addToSet(set) {
        let i71 = set.length, me = this;
        for(; i71 > 0; i71--){
            let range = set[i71 - 1];
            if (range.fromA > me.toA) continue;
            if (range.toA < me.fromA) break;
            me = me.join(range);
            set.splice(i71 - 1, 1);
        }
        set.splice(i71, 0, me);
        return set;
    }
    static extendWithRanges(diff, ranges) {
        if (ranges.length == 0) return diff;
        let result = [];
        for(let dI = 0, rI = 0, posA = 0, posB = 0;; dI++){
            let next = dI == diff.length ? null : diff[dI], off = posA - posB;
            let end = next ? next.fromB : 1000000000;
            while(rI < ranges.length && ranges[rI] < end){
                let from = ranges[rI], to = ranges[rI + 1];
                let fromB = Math.max(posB, from), toB = Math.min(end, to);
                if (fromB <= toB) new ChangedRange(fromB + off, toB + off, fromB, toB).addToSet(result);
                if (to > end) break;
                else rI += 2;
            }
            if (!next) return result;
            new ChangedRange(next.fromA, next.toA, next.fromB, next.toB).addToSet(result);
            posA = next.toA;
            posB = next.toB;
        }
    }
}
class ViewUpdate {
    constructor(view, state, transactions = none$2){
        this.view = view;
        this.state = state;
        this.transactions = transactions;
        this.flags = 0;
        this.startState = view.state;
        this.changes = ChangeSet.empty(this.startState.doc.length);
        for (let tr of transactions)this.changes = this.changes.compose(tr.changes);
        let changedRanges = [];
        this.changes.iterChangedRanges((fromA, toA, fromB, toB)=>changedRanges.push(new ChangedRange(fromA, toA, fromB, toB))
        );
        this.changedRanges = changedRanges;
        let focus = view.hasFocus;
        if (focus != view.inputState.notifiedFocused) {
            view.inputState.notifiedFocused = focus;
            this.flags |= 1;
        }
    }
    get viewportChanged() {
        return (this.flags & 4) > 0;
    }
    get heightChanged() {
        return (this.flags & 2) > 0;
    }
    get geometryChanged() {
        return this.docChanged || (this.flags & (8 | 2)) > 0;
    }
    get focusChanged() {
        return (this.flags & 1) > 0;
    }
    get docChanged() {
        return !this.changes.empty;
    }
    get selectionSet() {
        return this.transactions.some((tr)=>tr.selection
        );
    }
    get empty() {
        return this.flags == 0 && this.transactions.length == 0;
    }
}
var Direction = function(Direction1) {
    Direction1[Direction1["LTR"] = 0] = "LTR";
    Direction1[Direction1["RTL"] = 1] = "RTL";
    return Direction1;
}(Direction || (Direction = {
}));
const LTR = Direction.LTR, RTL = Direction.RTL;
function dec(str) {
    let result = [];
    for(let i72 = 0; i72 < str.length; i72++)result.push(1 << +str[i72]);
    return result;
}
const LowTypes = dec("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008");
const ArabicTypes = dec("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333");
const Brackets = Object.create(null), BracketStack = [];
for (let p of [
    "()",
    "[]",
    "{}"
]){
    let l = p.charCodeAt(0), r = p.charCodeAt(1);
    Brackets[l] = r;
    Brackets[r] = -l;
}
function charType(ch) {
    return ch <= 247 ? LowTypes[ch] : 1424 <= ch && ch <= 1524 ? 2 : 1536 <= ch && ch <= 1785 ? ArabicTypes[ch - 1536] : 1774 <= ch && ch <= 2220 ? 4 : 8192 <= ch && ch <= 8203 ? 256 : ch == 8204 ? 256 : 1;
}
const BidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
class BidiSpan {
    constructor(from, to, level){
        this.from = from;
        this.to = to;
        this.level = level;
    }
    get dir() {
        return this.level % 2 ? RTL : LTR;
    }
    side(end, dir) {
        return this.dir == dir == end ? this.to : this.from;
    }
    static find(order, index, level, assoc) {
        let maybe = -1;
        for(let i73 = 0; i73 < order.length; i73++){
            let span = order[i73];
            if (span.from <= index && span.to >= index) {
                if (span.level == level) return i73;
                if (maybe < 0 || (assoc != 0 ? assoc < 0 ? span.from < index : span.to > index : order[maybe].level > span.level)) maybe = i73;
            }
        }
        if (maybe < 0) throw new RangeError("Index out of range");
        return maybe;
    }
}
const types = [];
function computeOrder(line, direction) {
    let len = line.length, outerType = direction == LTR ? 1 : 2, oppositeType = direction == LTR ? 2 : 1;
    if (!line || outerType == 1 && !BidiRE.test(line)) return trivialOrder(len);
    for(let i77 = 0, prev = outerType, prevStrong = outerType; i77 < len; i77++){
        let type = charType(line.charCodeAt(i77));
        if (type == 512) type = prev;
        else if (type == 8 && prevStrong == 4) type = 16;
        types[i77] = type == 4 ? 2 : type;
        if (type & 7) prevStrong = type;
        prev = type;
    }
    for(let i74 = 0, prev1 = outerType, prevStrong1 = outerType; i74 < len; i74++){
        let type = types[i74];
        if (type == 128) {
            if (i74 < len - 1 && prev1 == types[i74 + 1] && prev1 & 24) type = types[i74] = prev1;
            else types[i74] = 256;
        } else if (type == 64) {
            let end = i74 + 1;
            while(end < len && types[end] == 64)end++;
            let replace = i74 && prev1 == 8 || end < len && types[end] == 8 ? prevStrong1 == 1 ? 1 : 8 : 256;
            for(let j = i74; j < end; j++)types[j] = replace;
            i74 = end - 1;
        } else if (type == 8 && prevStrong1 == 1) {
            types[i74] = 1;
        }
        prev1 = type;
        if (type & 7) prevStrong1 = type;
    }
    for(let i75 = 0, sI = 0, context = 0, ch, br, type; i75 < len; i75++){
        if (br = Brackets[ch = line.charCodeAt(i75)]) {
            if (br < 0) {
                for(let sJ = sI - 3; sJ >= 0; sJ -= 3){
                    if (BracketStack[sJ + 1] == -br) {
                        let flags = BracketStack[sJ + 2];
                        let type = flags & 2 ? outerType : !(flags & 4) ? 0 : flags & 1 ? oppositeType : outerType;
                        if (type) types[i75] = types[BracketStack[sJ]] = type;
                        sI = sJ;
                        break;
                    }
                }
            } else if (BracketStack.length == 189) {
                break;
            } else {
                BracketStack[sI++] = i75;
                BracketStack[sI++] = ch;
                BracketStack[sI++] = context;
            }
        } else if ((type = types[i75]) == 2 || type == 1) {
            let embed = type == outerType;
            context = embed ? 0 : 1;
            for(let sJ = sI - 3; sJ >= 0; sJ -= 3){
                let cur11 = BracketStack[sJ + 2];
                if (cur11 & 2) break;
                if (embed) {
                    BracketStack[sJ + 2] |= 2;
                } else {
                    if (cur11 & 4) break;
                    BracketStack[sJ + 2] |= 4;
                }
            }
        }
    }
    for(let i76 = 0; i76 < len; i76++){
        if (types[i76] == 256) {
            let end = i76 + 1;
            while(end < len && types[end] == 256)end++;
            let beforeL = (i76 ? types[i76 - 1] : outerType) == 1;
            let afterL = (end < len ? types[end] : outerType) == 1;
            let replace = beforeL == afterL ? beforeL ? 1 : 2 : outerType;
            for(let j = i76; j < end; j++)types[j] = replace;
            i76 = end - 1;
        }
    }
    let order = [];
    if (outerType == 1) {
        for(let i78 = 0; i78 < len;){
            let start = i78, rtl = types[i78++] != 1;
            while(i78 < len && rtl == (types[i78] != 1))i78++;
            if (rtl) {
                for(let j = i78; j > start;){
                    let end = j, l = types[--j] != 2;
                    while(j > start && l == (types[j - 1] != 2))j--;
                    order.push(new BidiSpan(j, end, l ? 2 : 1));
                }
            } else {
                order.push(new BidiSpan(start, i78, 0));
            }
        }
    } else {
        for(let i79 = 0; i79 < len;){
            let start = i79, rtl = types[i79++] == 2;
            while(i79 < len && rtl == (types[i79] == 2))i79++;
            order.push(new BidiSpan(start, i79, rtl ? 1 : 2));
        }
    }
    return order;
}
function trivialOrder(length) {
    return [
        new BidiSpan(0, length, 0)
    ];
}
let movedOver = "";
function moveVisually(line, order, dir, start, forward) {
    var _a;
    let startIndex = start.head - line.from, spanI = -1;
    if (startIndex == 0) {
        if (!forward || !line.length) return null;
        if (order[0].level != dir) {
            startIndex = order[0].side(false, dir);
            spanI = 0;
        }
    } else if (startIndex == line.length) {
        if (forward) return null;
        let last = order[order.length - 1];
        if (last.level != dir) {
            startIndex = last.side(true, dir);
            spanI = order.length - 1;
        }
    }
    if (spanI < 0) spanI = BidiSpan.find(order, startIndex, (_a = start.bidiLevel) !== null && _a !== void 0 ? _a : -1, start.assoc);
    let span = order[spanI];
    if (startIndex == span.side(forward, dir)) {
        span = order[spanI += forward ? 1 : -1];
        startIndex = span.side(!forward, dir);
    }
    let indexForward = forward == (span.dir == dir);
    let nextIndex = findClusterBreak(line.text, startIndex, indexForward);
    movedOver = line.text.slice(Math.min(startIndex, nextIndex), Math.max(startIndex, nextIndex));
    if (nextIndex != span.side(forward, dir)) return EditorSelection.cursor(nextIndex + line.from, indexForward ? -1 : 1, span.level);
    let nextSpan = spanI == (forward ? order.length - 1 : 0) ? null : order[spanI + (forward ? 1 : -1)];
    if (!nextSpan && span.level != dir) return EditorSelection.cursor(forward ? line.to : line.from, forward ? -1 : 1, dir);
    if (nextSpan && nextSpan.level < span.level) return EditorSelection.cursor(nextSpan.side(!forward, dir) + line.from, forward ? 1 : -1, nextSpan.level);
    return EditorSelection.cursor(nextIndex + line.from, forward ? -1 : 1, span.level);
}
class DOMReader {
    constructor(points, view){
        this.points = points;
        this.view = view;
        this.text = "";
        this.lineBreak = view.state.lineBreak;
    }
    readRange(start, end) {
        if (!start) return this;
        let parent = start.parentNode;
        for(let cur12 = start;;){
            this.findPointBefore(parent, cur12);
            this.readNode(cur12);
            let next = cur12.nextSibling;
            if (next == end) break;
            let view = ContentView.get(cur12), nextView = ContentView.get(next);
            if (view && nextView ? view.breakAfter : (view ? view.breakAfter : isBlockElement(cur12)) || isBlockElement(next) && (cur12.nodeName != "BR" || cur12.cmIgnore)) this.text += this.lineBreak;
            cur12 = next;
        }
        this.findPointBefore(parent, end);
        return this;
    }
    readTextNode(node) {
        var _a, _b;
        let text = node.nodeValue;
        if (/^\u200b/.test(text) && ((_a = node.previousSibling) === null || _a === void 0 ? void 0 : _a.contentEditable) == "false") text = text.slice(1);
        if (/\u200b$/.test(text) && ((_b = node.nextSibling) === null || _b === void 0 ? void 0 : _b.contentEditable) == "false") text = text.slice(0, text.length - 1);
        return text;
    }
    readNode(node) {
        if (node.cmIgnore) return;
        let view = ContentView.get(node);
        let fromView = view && view.overrideDOMText;
        let text;
        if (fromView != null) text = fromView.sliceString(0, undefined, this.lineBreak);
        else if (node.nodeType == 3) text = this.readTextNode(node);
        else if (node.nodeName == "BR") text = node.nextSibling ? this.lineBreak : "";
        else if (node.nodeType == 1) this.readRange(node.firstChild, null);
        if (text != null) {
            this.findPointIn(node, text.length);
            this.text += text;
            if (browser.chrome && this.view.inputState.lastKeyCode == 13 && !node.nextSibling && /\n\n$/.test(this.text)) this.text = this.text.slice(0, -1);
        }
    }
    findPointBefore(node, next) {
        for (let point of this.points)if (point.node == node && node.childNodes[point.offset] == next) point.pos = this.text.length;
    }
    findPointIn(node, maxLen) {
        for (let point of this.points)if (point.node == node) point.pos = this.text.length + Math.min(point.offset, maxLen);
    }
}
function isBlockElement(node) {
    return node.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(node.nodeName);
}
class DOMPoint {
    constructor(node, offset){
        this.node = node;
        this.offset = offset;
        this.pos = -1;
    }
}
class DocView extends ContentView {
    constructor(view){
        super();
        this.view = view;
        this.compositionDeco = Decoration.none;
        this.decorations = [];
        this.pluginDecorationLength = 0;
        this.minWidth = 0;
        this.minWidthFrom = 0;
        this.minWidthTo = 0;
        this.impreciseAnchor = null;
        this.impreciseHead = null;
        this.forceSelection = false;
        this.lastUpdate = Date.now();
        this.setDOM(view.contentDOM);
        this.children = [
            new LineView
        ];
        this.children[0].setParent(this);
        this.updateDeco();
        this.updateInner([
            new ChangedRange(0, 0, 0, view.state.doc.length)
        ], 0);
    }
    get root() {
        return this.view.root;
    }
    get editorView() {
        return this.view;
    }
    get length() {
        return this.view.state.doc.length;
    }
    update(update) {
        let changedRanges = update.changedRanges;
        if (this.minWidth > 0 && changedRanges.length) {
            if (!changedRanges.every(({ fromA , toA  })=>toA < this.minWidthFrom || fromA > this.minWidthTo
            )) {
                this.minWidth = this.minWidthFrom = this.minWidthTo = 0;
            } else {
                this.minWidthFrom = update.changes.mapPos(this.minWidthFrom, 1);
                this.minWidthTo = update.changes.mapPos(this.minWidthTo, 1);
            }
        }
        if (this.view.inputState.composing < 0) this.compositionDeco = Decoration.none;
        else if (update.transactions.length || this.dirty) this.compositionDeco = computeCompositionDeco(this.view, update.changes);
        if ((browser.ie || browser.chrome) && !this.compositionDeco.size && update && update.state.doc.lines != update.startState.doc.lines) this.forceSelection = true;
        let prevDeco = this.decorations, deco = this.updateDeco();
        let decoDiff = findChangedDeco(prevDeco, deco, update.changes);
        changedRanges = ChangedRange.extendWithRanges(changedRanges, decoDiff);
        if (this.dirty == 0 && changedRanges.length == 0) {
            return false;
        } else {
            this.updateInner(changedRanges, update.startState.doc.length);
            if (update.transactions.length) this.lastUpdate = Date.now();
            return true;
        }
    }
    updateInner(changes, oldLength) {
        this.view.viewState.mustMeasureContent = true;
        this.updateChildren(changes, oldLength);
        let { observer  } = this.view;
        observer.ignore(()=>{
            this.dom.style.height = this.view.viewState.contentHeight + "px";
            this.dom.style.minWidth = this.minWidth ? this.minWidth + "px" : "";
            let track = browser.chrome || browser.ios ? {
                node: observer.selectionRange.focusNode,
                written: false
            } : undefined;
            this.sync(track);
            this.dirty = 0;
            if (track && (track.written || observer.selectionRange.focusNode != track.node)) this.forceSelection = true;
            this.dom.style.height = "";
        });
        let gaps = [];
        if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length) {
            for (let child of this.children)if (child instanceof BlockWidgetView && child.widget instanceof BlockGapWidget) gaps.push(child.dom);
        }
        observer.updateGaps(gaps);
    }
    updateChildren(changes, oldLength) {
        let cursor2 = this.childCursor(oldLength);
        for(let i80 = changes.length - 1;; i80--){
            let next = i80 >= 0 ? changes[i80] : null;
            if (!next) break;
            let { fromA , toA , fromB , toB  } = next;
            let { content: content4 , breakAtStart , openStart , openEnd  } = ContentBuilder.build(this.view.state.doc, fromB, toB, this.decorations, this.pluginDecorationLength);
            let { i: toI , off: toOff  } = cursor2.findPos(toA, 1);
            let { i: fromI , off: fromOff  } = cursor2.findPos(fromA, -1);
            replaceRange(this, fromI, fromOff, toI, toOff, content4, breakAtStart, openStart, openEnd);
        }
    }
    updateSelection(mustRead = false, fromPointer = false) {
        if (mustRead) this.view.observer.readSelectionRange();
        if (!(fromPointer || this.mayControlSelection()) || browser.ios && this.view.inputState.rapidCompositionStart) return;
        let force = this.forceSelection;
        this.forceSelection = false;
        let main = this.view.state.selection.main;
        let anchor = this.domAtPos(main.anchor);
        let head = main.empty ? anchor : this.domAtPos(main.head);
        if (browser.gecko && main.empty && betweenUneditable(anchor)) {
            let dummy = document.createTextNode("");
            this.view.observer.ignore(()=>anchor.node.insertBefore(dummy, anchor.node.childNodes[anchor.offset] || null)
            );
            anchor = head = new DOMPos(dummy, 0);
            force = true;
        }
        let domSel = this.view.observer.selectionRange;
        if (force || !domSel.focusNode || !isEquivalentPosition(anchor.node, anchor.offset, domSel.anchorNode, domSel.anchorOffset) || !isEquivalentPosition(head.node, head.offset, domSel.focusNode, domSel.focusOffset)) {
            this.view.observer.ignore(()=>{
                if (browser.android && browser.chrome && this.dom.contains(domSel.focusNode) && inUneditable(domSel.focusNode, this.dom)) {
                    this.dom.blur();
                    this.dom.focus({
                        preventScroll: true
                    });
                }
                let rawSel = getSelection(this.root);
                if (main.empty) {
                    if (browser.gecko) {
                        let nextTo = nextToUneditable(anchor.node, anchor.offset);
                        if (nextTo && nextTo != (1 | 2)) {
                            let text = nearbyTextNode(anchor.node, anchor.offset, nextTo == 1 ? 1 : -1);
                            if (text) anchor = new DOMPos(text, nextTo == 1 ? 0 : text.nodeValue.length);
                        }
                    }
                    rawSel.collapse(anchor.node, anchor.offset);
                    if (main.bidiLevel != null && domSel.cursorBidiLevel != null) domSel.cursorBidiLevel = main.bidiLevel;
                } else if (rawSel.extend) {
                    rawSel.collapse(anchor.node, anchor.offset);
                    rawSel.extend(head.node, head.offset);
                } else {
                    let range = document.createRange();
                    if (main.anchor > main.head) [anchor, head] = [
                        head,
                        anchor
                    ];
                    range.setEnd(head.node, head.offset);
                    range.setStart(anchor.node, anchor.offset);
                    rawSel.removeAllRanges();
                    rawSel.addRange(range);
                }
            });
            this.view.observer.setSelectionRange(anchor, head);
        }
        this.impreciseAnchor = anchor.precise ? null : new DOMPos(domSel.anchorNode, domSel.anchorOffset);
        this.impreciseHead = head.precise ? null : new DOMPos(domSel.focusNode, domSel.focusOffset);
    }
    enforceCursorAssoc() {
        if (this.compositionDeco.size) return;
        let cursor3 = this.view.state.selection.main;
        let sel = getSelection(this.root);
        if (!cursor3.empty || !cursor3.assoc || !sel.modify) return;
        let line = LineView.find(this, cursor3.head);
        if (!line) return;
        let lineStart = line.posAtStart;
        if (cursor3.head == lineStart || cursor3.head == lineStart + line.length) return;
        let before = this.coordsAt(cursor3.head, -1), after = this.coordsAt(cursor3.head, 1);
        if (!before || !after || before.bottom > after.top) return;
        let dom = this.domAtPos(cursor3.head + cursor3.assoc);
        sel.collapse(dom.node, dom.offset);
        sel.modify("move", cursor3.assoc < 0 ? "forward" : "backward", "lineboundary");
    }
    mayControlSelection() {
        return this.view.state.facet(editable) ? this.root.activeElement == this.dom : hasSelection(this.dom, this.view.observer.selectionRange);
    }
    nearest(dom) {
        for(let cur13 = dom; cur13;){
            let domView = ContentView.get(cur13);
            if (domView && domView.rootView == this) return domView;
            cur13 = cur13.parentNode;
        }
        return null;
    }
    posFromDOM(node, offset) {
        let view = this.nearest(node);
        if (!view) throw new RangeError("Trying to find position for a DOM position outside of the document");
        return view.localPosFromDOM(node, offset) + view.posAtStart;
    }
    domAtPos(pos) {
        let { i: i81 , off  } = this.childCursor().findPos(pos, -1);
        for(; i81 < this.children.length - 1;){
            let child = this.children[i81];
            if (off < child.length || child instanceof LineView) break;
            i81++;
            off = 0;
        }
        return this.children[i81].domAtPos(off);
    }
    coordsAt(pos, side) {
        for(let off = this.length, i82 = this.children.length - 1;; i82--){
            let child = this.children[i82], start = off - child.breakAfter - child.length;
            if (pos > start || pos == start && child.type != BlockType.WidgetBefore && child.type != BlockType.WidgetAfter && (!i82 || side == 2 || this.children[i82 - 1].breakAfter || this.children[i82 - 1].type == BlockType.WidgetBefore && side > -2)) return child.coordsAt(pos - start, side);
            off = start;
        }
    }
    measureVisibleLineHeights() {
        let result = [], { from , to  } = this.view.viewState.viewport;
        let contentWidth = this.view.contentDOM.clientWidth;
        let isWider = contentWidth > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1;
        let widest = -1;
        for(let pos = 0, i83 = 0; i83 < this.children.length; i83++){
            let child = this.children[i83], end = pos + child.length;
            if (end > to) break;
            if (pos >= from) {
                let childRect = child.dom.getBoundingClientRect();
                result.push(childRect.height);
                if (isWider) {
                    let last = child.dom.lastChild;
                    let rects = last ? clientRectsFor(last) : [];
                    if (rects.length) {
                        let rect = rects[rects.length - 1];
                        let width = this.view.textDirection == Direction.LTR ? rect.right - childRect.left : childRect.right - rect.left;
                        if (width > widest) {
                            widest = width;
                            this.minWidth = contentWidth;
                            this.minWidthFrom = pos;
                            this.minWidthTo = end;
                        }
                    }
                }
            }
            pos = end + child.breakAfter;
        }
        return result;
    }
    measureTextSize() {
        for (let child of this.children){
            if (child instanceof LineView) {
                let measure = child.measureTextSize();
                if (measure) return measure;
            }
        }
        let dummy = document.createElement("div"), lineHeight, charWidth;
        dummy.className = "cm-line";
        dummy.textContent = "abc def ghi jkl mno pqr stu";
        this.view.observer.ignore(()=>{
            this.dom.appendChild(dummy);
            let rect = clientRectsFor(dummy.firstChild)[0];
            lineHeight = dummy.getBoundingClientRect().height;
            charWidth = rect ? rect.width / 27 : 7;
            dummy.remove();
        });
        return {
            lineHeight,
            charWidth
        };
    }
    childCursor(pos = this.length) {
        let i84 = this.children.length;
        if (i84) pos -= this.children[--i84].length;
        return new ChildCursor(this.children, pos, i84);
    }
    computeBlockGapDeco() {
        let deco = [], vs = this.view.viewState;
        for(let pos = 0, i85 = 0;; i85++){
            let next = i85 == vs.viewports.length ? null : vs.viewports[i85];
            let end = next ? next.from - 1 : this.length;
            if (end > pos) {
                let height = vs.lineBlockAt(end).bottom - vs.lineBlockAt(pos).top;
                deco.push(Decoration.replace({
                    widget: new BlockGapWidget(height),
                    block: true,
                    inclusive: true
                }).range(pos, end));
            }
            if (!next) break;
            pos = next.to + 1;
        }
        return Decoration.set(deco);
    }
    updateDeco() {
        let pluginDecorations = this.view.pluginField(PluginField.decorations);
        this.pluginDecorationLength = pluginDecorations.length;
        return this.decorations = [
            ...pluginDecorations,
            ...this.view.state.facet(decorations),
            this.compositionDeco,
            this.computeBlockGapDeco(),
            this.view.viewState.lineGapDeco
        ];
    }
    scrollIntoView(target) {
        let { range  } = target;
        let rect = this.coordsAt(range.head, range.empty ? range.assoc : range.head > range.anchor ? -1 : 1), other;
        if (!rect) return;
        if (!range.empty && (other = this.coordsAt(range.anchor, range.anchor > range.head ? -1 : 1))) rect = {
            left: Math.min(rect.left, other.left),
            top: Math.min(rect.top, other.top),
            right: Math.max(rect.right, other.right),
            bottom: Math.max(rect.bottom, other.bottom)
        };
        let mLeft = 0, mRight = 0, mTop = 0, mBottom = 0;
        for (let margins of this.view.pluginField(PluginField.scrollMargins))if (margins) {
            let { left , right , top: top6 , bottom  } = margins;
            if (left != null) mLeft = Math.max(mLeft, left);
            if (right != null) mRight = Math.max(mRight, right);
            if (top6 != null) mTop = Math.max(mTop, top6);
            if (bottom != null) mBottom = Math.max(mBottom, bottom);
        }
        let targetRect = {
            left: rect.left - mLeft,
            top: rect.top - mTop,
            right: rect.right + mRight,
            bottom: rect.bottom + mBottom
        };
        scrollRectIntoView(this.view.scrollDOM, targetRect, range.head < range.anchor ? -1 : 1, target.x, target.y, target.xMargin, target.yMargin, this.view.textDirection == Direction.LTR);
    }
}
function betweenUneditable(pos) {
    return pos.node.nodeType == 1 && pos.node.firstChild && (pos.offset == 0 || pos.node.childNodes[pos.offset - 1].contentEditable == "false") && (pos.offset == pos.node.childNodes.length || pos.node.childNodes[pos.offset].contentEditable == "false");
}
class BlockGapWidget extends WidgetType {
    constructor(height){
        super();
        this.height = height;
    }
    toDOM() {
        let elt = document.createElement("div");
        this.updateDOM(elt);
        return elt;
    }
    eq(other) {
        return other.height == this.height;
    }
    updateDOM(elt) {
        elt.style.height = this.height + "px";
        return true;
    }
    get estimatedHeight() {
        return this.height;
    }
}
function compositionSurroundingNode(view) {
    let sel = view.observer.selectionRange;
    let textNode = sel.focusNode && nearbyTextNode(sel.focusNode, sel.focusOffset, 0);
    if (!textNode) return null;
    let cView = view.docView.nearest(textNode);
    if (!cView) return null;
    if (cView instanceof LineView) {
        let topNode = textNode;
        while(topNode.parentNode != cView.dom)topNode = topNode.parentNode;
        let prev = topNode.previousSibling;
        while(prev && !ContentView.get(prev))prev = prev.previousSibling;
        let pos = prev ? ContentView.get(prev).posAtEnd : cView.posAtStart;
        return {
            from: pos,
            to: pos,
            node: topNode,
            text: textNode
        };
    } else {
        for(;;){
            let { parent  } = cView;
            if (!parent) return null;
            if (parent instanceof LineView) break;
            cView = parent;
        }
        let from = cView.posAtStart;
        return {
            from,
            to: from + cView.length,
            node: cView.dom,
            text: textNode
        };
    }
}
function computeCompositionDeco(view, changes) {
    let surrounding = compositionSurroundingNode(view);
    if (!surrounding) return Decoration.none;
    let { from , to , node , text: textNode  } = surrounding;
    let newFrom = changes.mapPos(from, 1), newTo = Math.max(newFrom, changes.mapPos(to, -1));
    let { state  } = view, text = node.nodeType == 3 ? node.nodeValue : new DOMReader([], view).readRange(node.firstChild, null).text;
    if (newTo - newFrom < text.length) {
        if (state.sliceDoc(newFrom, Math.min(state.doc.length, newFrom + text.length)) == text) newTo = newFrom + text.length;
        else if (state.sliceDoc(Math.max(0, newTo - text.length), newTo) == text) newFrom = newTo - text.length;
        else return Decoration.none;
    } else if (state.sliceDoc(newFrom, newTo) != text) {
        return Decoration.none;
    }
    return Decoration.set(Decoration.replace({
        widget: new CompositionWidget(node, textNode)
    }).range(newFrom, newTo));
}
class CompositionWidget extends WidgetType {
    constructor(top7, text){
        super();
        this.top = top7;
        this.text = text;
    }
    eq(other) {
        return this.top == other.top && this.text == other.text;
    }
    toDOM() {
        return this.top;
    }
    ignoreEvent() {
        return false;
    }
    get customView() {
        return CompositionView;
    }
}
function nearbyTextNode(node, offset, side) {
    for(;;){
        if (node.nodeType == 3) return node;
        if (node.nodeType == 1 && offset > 0 && side <= 0) {
            node = node.childNodes[offset - 1];
            offset = maxOffset(node);
        } else if (node.nodeType == 1 && offset < node.childNodes.length && side >= 0) {
            node = node.childNodes[offset];
            offset = 0;
        } else {
            return null;
        }
    }
}
function nextToUneditable(node, offset) {
    if (node.nodeType != 1) return 0;
    return (offset && node.childNodes[offset - 1].contentEditable == "false" ? 1 : 0) | (offset < node.childNodes.length && node.childNodes[offset].contentEditable == "false" ? 2 : 0);
}
class DecorationComparator$1 {
    constructor(){
        this.changes = [];
    }
    compareRange(from, to) {
        addRange(from, to, this.changes);
    }
    comparePoint(from, to) {
        addRange(from, to, this.changes);
    }
}
function findChangedDeco(a, b, diff) {
    let comp = new DecorationComparator$1;
    RangeSet.compare(a, b, diff, comp);
    return comp.changes;
}
function inUneditable(node, inside1) {
    for(let cur14 = node; cur14 && cur14 != inside1; cur14 = cur14.assignedSlot || cur14.parentNode){
        if (cur14.nodeType == 1 && cur14.contentEditable == 'false') {
            return true;
        }
    }
    return false;
}
function groupAt(state, pos, bias = 1) {
    let categorize = state.charCategorizer(pos);
    let line = state.doc.lineAt(pos), linePos = pos - line.from;
    if (line.length == 0) return EditorSelection.cursor(pos);
    if (linePos == 0) bias = 1;
    else if (linePos == line.length) bias = -1;
    let from = linePos, to = linePos;
    if (bias < 0) from = findClusterBreak(line.text, linePos, false);
    else to = findClusterBreak(line.text, linePos);
    let cat = categorize(line.text.slice(from, to));
    while(from > 0){
        let prev = findClusterBreak(line.text, from, false);
        if (categorize(line.text.slice(prev, from)) != cat) break;
        from = prev;
    }
    while(to < line.length){
        let next = findClusterBreak(line.text, to);
        if (categorize(line.text.slice(to, next)) != cat) break;
        to = next;
    }
    return EditorSelection.range(from + line.from, to + line.from);
}
function getdx(x, rect) {
    return rect.left > x ? rect.left - x : Math.max(0, x - rect.right);
}
function getdy(y, rect) {
    return rect.top > y ? rect.top - y : Math.max(0, y - rect.bottom);
}
function yOverlap(a, b) {
    return a.top < b.bottom - 1 && a.bottom > b.top + 1;
}
function upTop(rect, top8) {
    return top8 < rect.top ? {
        top: top8,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom
    } : rect;
}
function upBot(rect, bottom) {
    return bottom > rect.bottom ? {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom
    } : rect;
}
function domPosAtCoords(parent, x, y) {
    let closest, closestRect, closestX, closestY;
    let above, below, aboveRect, belowRect;
    for(let child = parent.firstChild; child; child = child.nextSibling){
        let rects = clientRectsFor(child);
        for(let i86 = 0; i86 < rects.length; i86++){
            let rect = rects[i86];
            if (closestRect && yOverlap(closestRect, rect)) rect = upTop(upBot(rect, closestRect.bottom), closestRect.top);
            let dx = getdx(x, rect), dy = getdy(y, rect);
            if (dx == 0 && dy == 0) return child.nodeType == 3 ? domPosInText(child, x, y) : domPosAtCoords(child, x, y);
            if (!closest || closestY > dy || closestY == dy && closestX > dx) {
                closest = child;
                closestRect = rect;
                closestX = dx;
                closestY = dy;
            }
            if (dx == 0) {
                if (y > rect.bottom && (!aboveRect || aboveRect.bottom < rect.bottom)) {
                    above = child;
                    aboveRect = rect;
                } else if (y < rect.top && (!belowRect || belowRect.top > rect.top)) {
                    below = child;
                    belowRect = rect;
                }
            } else if (aboveRect && yOverlap(aboveRect, rect)) {
                aboveRect = upBot(aboveRect, rect.bottom);
            } else if (belowRect && yOverlap(belowRect, rect)) {
                belowRect = upTop(belowRect, rect.top);
            }
        }
    }
    if (aboveRect && aboveRect.bottom >= y) {
        closest = above;
        closestRect = aboveRect;
    } else if (belowRect && belowRect.top <= y) {
        closest = below;
        closestRect = belowRect;
    }
    if (!closest) return {
        node: parent,
        offset: 0
    };
    let clipX = Math.max(closestRect.left, Math.min(closestRect.right, x));
    if (closest.nodeType == 3) return domPosInText(closest, clipX, y);
    if (!closestX && closest.contentEditable == "true") return domPosAtCoords(closest, clipX, y);
    let offset = Array.prototype.indexOf.call(parent.childNodes, closest) + (x >= (closestRect.left + closestRect.right) / 2 ? 1 : 0);
    return {
        node: parent,
        offset
    };
}
function domPosInText(node, x, y) {
    let len = node.nodeValue.length;
    let closestOffset = -1, closestDY = 1000000000, generalSide = 0;
    for(let i87 = 0; i87 < len; i87++){
        let rects = textRange(node, i87, i87 + 1).getClientRects();
        for(let j = 0; j < rects.length; j++){
            let rect = rects[j];
            if (rect.top == rect.bottom) continue;
            if (!generalSide) generalSide = x - rect.left;
            let dy = (rect.top > y ? rect.top - y : y - rect.bottom) - 1;
            if (rect.left - 1 <= x && rect.right + 1 >= x && dy < closestDY) {
                let right = x >= (rect.left + rect.right) / 2, after = right;
                if (browser.chrome || browser.gecko) {
                    let rectBefore = textRange(node, i87).getBoundingClientRect();
                    if (rectBefore.left == rect.right) after = !right;
                }
                if (dy <= 0) return {
                    node,
                    offset: i87 + (after ? 1 : 0)
                };
                closestOffset = i87 + (after ? 1 : 0);
                closestDY = dy;
            }
        }
    }
    return {
        node,
        offset: closestOffset > -1 ? closestOffset : generalSide > 0 ? node.nodeValue.length : 0
    };
}
function posAtCoords(view, { x , y  }, precise, bias = -1) {
    var _a;
    let content5 = view.contentDOM.getBoundingClientRect(), docTop = content5.top + view.viewState.paddingTop;
    let block, { docHeight  } = view.viewState;
    let yOffset = y - docTop;
    if (yOffset < 0) return 0;
    if (yOffset > docHeight) return view.state.doc.length;
    for(let halfLine = view.defaultLineHeight / 2, bounced = false;;){
        block = view.elementAtHeight(yOffset);
        if (block.type == BlockType.Text) break;
        for(;;){
            yOffset = bias > 0 ? block.bottom + halfLine : block.top - halfLine;
            if (yOffset >= 0 && yOffset <= docHeight) break;
            if (bounced) return precise ? null : 0;
            bounced = true;
            bias = -bias;
        }
    }
    y = docTop + yOffset;
    let lineStart = block.from;
    if (lineStart < view.viewport.from) return view.viewport.from == 0 ? 0 : precise ? null : posAtCoordsImprecise(view, content5, block, x, y);
    if (lineStart > view.viewport.to) return view.viewport.to == view.state.doc.length ? view.state.doc.length : precise ? null : posAtCoordsImprecise(view, content5, block, x, y);
    let doc7 = view.dom.ownerDocument;
    let root = view.root.elementFromPoint ? view.root : doc7;
    let element = root.elementFromPoint(x, y);
    if (element && !view.contentDOM.contains(element)) element = null;
    if (!element) {
        x = Math.max(content5.left + 1, Math.min(content5.right - 1, x));
        element = root.elementFromPoint(x, y);
        if (element && !view.contentDOM.contains(element)) element = null;
    }
    let node, offset = -1;
    if (element && ((_a = view.docView.nearest(element)) === null || _a === void 0 ? void 0 : _a.isEditable) != false) {
        if (doc7.caretPositionFromPoint) {
            let pos = doc7.caretPositionFromPoint(x, y);
            if (pos) ({ offsetNode: node , offset  } = pos);
        } else if (doc7.caretRangeFromPoint) {
            let range = doc7.caretRangeFromPoint(x, y);
            if (range) {
                ({ startContainer: node , startOffset: offset  } = range);
                if (browser.safari && isSuspiciousCaretResult(node, offset, x)) node = undefined;
            }
        }
    }
    if (!node || !view.docView.dom.contains(node)) {
        let line = LineView.find(view.docView, lineStart);
        if (!line) return yOffset > block.top + block.height / 2 ? block.to : block.from;
        ({ node , offset  } = domPosAtCoords(line.dom, x, y));
    }
    return view.docView.posFromDOM(node, offset);
}
function posAtCoordsImprecise(view, contentRect, block, x, y) {
    let into = Math.round((x - contentRect.left) * view.defaultCharacterWidth);
    if (view.lineWrapping && block.height > view.defaultLineHeight * 1.5) {
        let line = Math.floor((y - block.top) / view.defaultLineHeight);
        into += line * view.viewState.heightOracle.lineLength;
    }
    let content6 = view.state.sliceDoc(block.from, block.to);
    return block.from + findColumn(content6, into, view.state.tabSize);
}
function isSuspiciousCaretResult(node, offset, x) {
    let len;
    if (node.nodeType != 3 || offset != (len = node.nodeValue.length)) return false;
    for(let next = node.nextSibling; next; next = next.nextSibling)if (next.nodeType != 1 || next.nodeName != "BR") return false;
    return textRange(node, len - 1, len).getBoundingClientRect().left > x;
}
function moveToLineBoundary(view, start, forward, includeWrap) {
    let line = view.state.doc.lineAt(start.head);
    let coords = !includeWrap || !view.lineWrapping ? null : view.coordsAtPos(start.assoc < 0 && start.head > line.from ? start.head - 1 : start.head);
    if (coords) {
        let editorRect = view.dom.getBoundingClientRect();
        let pos = view.posAtCoords({
            x: forward == (view.textDirection == Direction.LTR) ? editorRect.right - 1 : editorRect.left + 1,
            y: (coords.top + coords.bottom) / 2
        });
        if (pos != null) return EditorSelection.cursor(pos, forward ? -1 : 1);
    }
    let lineView = LineView.find(view.docView, start.head);
    let end = lineView ? forward ? lineView.posAtEnd : lineView.posAtStart : forward ? line.to : line.from;
    return EditorSelection.cursor(end, forward ? -1 : 1);
}
function moveByChar(view, start, forward, by) {
    let line = view.state.doc.lineAt(start.head), spans = view.bidiSpans(line);
    for(let cur15 = start, check = null;;){
        let next = moveVisually(line, spans, view.textDirection, cur15, forward), __char = movedOver;
        if (!next) {
            if (line.number == (forward ? view.state.doc.lines : 1)) return cur15;
            __char = "\n";
            line = view.state.doc.line(line.number + (forward ? 1 : -1));
            spans = view.bidiSpans(line);
            next = EditorSelection.cursor(forward ? line.from : line.to);
        }
        if (!check) {
            if (!by) return next;
            check = by(__char);
        } else if (!check(__char)) {
            return cur15;
        }
        cur15 = next;
    }
}
function byGroup(view, pos, start) {
    let categorize = view.state.charCategorizer(pos);
    let cat = categorize(start);
    return (next)=>{
        let nextCat = categorize(next);
        if (cat == CharCategory.Space) cat = nextCat;
        return cat == nextCat;
    };
}
function moveVertically(view, start, forward, distance) {
    let startPos = start.head, dir = forward ? 1 : -1;
    if (startPos == (forward ? view.state.doc.length : 0)) return EditorSelection.cursor(startPos, start.assoc);
    let goal = start.goalColumn, startY;
    let rect = view.contentDOM.getBoundingClientRect();
    let startCoords = view.coordsAtPos(startPos), docTop = view.documentTop;
    if (startCoords) {
        if (goal == null) goal = startCoords.left - rect.left;
        startY = dir < 0 ? startCoords.top : startCoords.bottom;
    } else {
        let line = view.viewState.lineBlockAt(startPos - docTop);
        if (goal == null) goal = Math.min(rect.right - rect.left, view.defaultCharacterWidth * (startPos - line.from));
        startY = (dir < 0 ? line.top : line.bottom) + docTop;
    }
    let resolvedGoal = rect.left + goal;
    let dist = distance !== null && distance !== void 0 ? distance : view.defaultLineHeight >> 1;
    for(let extra = 0;; extra += 10){
        let curY = startY + (dist + extra) * dir;
        let pos = posAtCoords(view, {
            x: resolvedGoal,
            y: curY
        }, false, dir);
        if (curY < rect.top || curY > rect.bottom || (dir < 0 ? pos < startPos : pos > startPos)) return EditorSelection.cursor(pos, start.assoc, undefined, goal);
    }
}
function skipAtoms(view, oldPos, pos) {
    let atoms = view.pluginField(PluginField.atomicRanges);
    for(;;){
        let moved = false;
        for (let set of atoms){
            set.between(pos.from - 1, pos.from + 1, (from, to, value)=>{
                if (pos.from > from && pos.from < to) {
                    pos = oldPos.from > pos.from ? EditorSelection.cursor(from, 1) : EditorSelection.cursor(to, -1);
                    moved = true;
                }
            });
        }
        if (!moved) return pos;
    }
}
class InputState {
    constructor(view){
        this.lastKeyCode = 0;
        this.lastKeyTime = 0;
        this.pendingIOSKey = undefined;
        this.lastSelectionOrigin = null;
        this.lastSelectionTime = 0;
        this.lastEscPress = 0;
        this.lastContextMenu = 0;
        this.scrollHandlers = [];
        this.registeredEvents = [];
        this.customHandlers = [];
        this.composing = -1;
        this.compositionFirstChange = null;
        this.compositionEndedAt = 0;
        this.rapidCompositionStart = false;
        this.mouseSelection = null;
        for(let type in handlers){
            let handler = handlers[type];
            view.contentDOM.addEventListener(type, (event)=>{
                if (type == "keydown" && this.keydown(view, event)) return;
                if (!eventBelongsToEditor(view, event) || this.ignoreDuringComposition(event)) return;
                if (this.mustFlushObserver(event)) view.observer.forceFlush();
                if (this.runCustomHandlers(type, view, event)) event.preventDefault();
                else handler(view, event);
            });
            this.registeredEvents.push(type);
        }
        this.notifiedFocused = view.hasFocus;
        this.ensureHandlers(view);
        if (browser.safari) view.contentDOM.addEventListener("input", ()=>null
        );
    }
    setSelectionOrigin(origin) {
        this.lastSelectionOrigin = origin;
        this.lastSelectionTime = Date.now();
    }
    ensureHandlers(view) {
        let handlers1 = this.customHandlers = view.pluginField(domEventHandlers);
        for (let set of handlers1){
            for(let type in set.handlers)if (this.registeredEvents.indexOf(type) < 0 && type != "scroll") {
                this.registeredEvents.push(type);
                view.contentDOM.addEventListener(type, (event)=>{
                    if (!eventBelongsToEditor(view, event)) return;
                    if (this.runCustomHandlers(type, view, event)) event.preventDefault();
                });
            }
        }
    }
    runCustomHandlers(type, view, event) {
        for (let set of this.customHandlers){
            let handler = set.handlers[type];
            if (handler) {
                try {
                    if (handler.call(set.plugin, event, view) || event.defaultPrevented) return true;
                } catch (e) {
                    logException(view.state, e);
                }
            }
        }
        return false;
    }
    runScrollHandlers(view, event) {
        for (let set of this.customHandlers){
            let handler = set.handlers.scroll;
            if (handler) {
                try {
                    handler.call(set.plugin, event, view);
                } catch (e) {
                    logException(view.state, e);
                }
            }
        }
    }
    keydown(view, event) {
        this.lastKeyCode = event.keyCode;
        this.lastKeyTime = Date.now();
        if (this.screenKeyEvent(view, event)) return true;
        if (browser.android && browser.chrome && !event.synthetic && (event.keyCode == 13 || event.keyCode == 8)) {
            view.observer.delayAndroidKey(event.key, event.keyCode);
            return true;
        }
        let pending;
        if (browser.ios && (pending = PendingKeys.find((key)=>key.keyCode == event.keyCode
        )) && !(event.ctrlKey || event.altKey || event.metaKey) && !event.synthetic) {
            this.pendingIOSKey = pending;
            setTimeout(()=>this.flushIOSKey(view)
            , 250);
            return true;
        }
        return false;
    }
    flushIOSKey(view) {
        let key = this.pendingIOSKey;
        if (!key) return false;
        this.pendingIOSKey = undefined;
        return dispatchKey(view.contentDOM, key.key, key.keyCode);
    }
    ignoreDuringComposition(event) {
        if (!/^key/.test(event.type)) return false;
        if (this.composing > 0) return true;
        if (browser.safari && Date.now() - this.compositionEndedAt < 500) {
            this.compositionEndedAt = 0;
            return true;
        }
        return false;
    }
    screenKeyEvent(view, event) {
        let protectedTab = event.keyCode == 9 && Date.now() < this.lastEscPress + 2000;
        if (event.keyCode == 27) this.lastEscPress = Date.now();
        else if (modifierCodes.indexOf(event.keyCode) < 0) this.lastEscPress = 0;
        return protectedTab;
    }
    mustFlushObserver(event) {
        return event.type == "keydown" && event.keyCode != 229 || event.type == "compositionend" && !browser.ios;
    }
    startMouseSelection(mouseSelection) {
        if (this.mouseSelection) this.mouseSelection.destroy();
        this.mouseSelection = mouseSelection;
    }
    update(update) {
        if (this.mouseSelection) this.mouseSelection.update(update);
        if (update.transactions.length) this.lastKeyCode = this.lastSelectionTime = 0;
    }
    destroy() {
        if (this.mouseSelection) this.mouseSelection.destroy();
    }
}
const PendingKeys = [
    {
        key: "Backspace",
        keyCode: 8,
        inputType: "deleteContentBackward"
    },
    {
        key: "Enter",
        keyCode: 13,
        inputType: "insertParagraph"
    },
    {
        key: "Delete",
        keyCode: 46,
        inputType: "deleteContentForward"
    }
];
const modifierCodes = [
    16,
    17,
    18,
    20,
    91,
    92,
    224,
    225
];
class MouseSelection {
    constructor(view, startEvent, style, mustSelect){
        this.view = view;
        this.style = style;
        this.mustSelect = mustSelect;
        this.lastEvent = startEvent;
        let doc8 = view.contentDOM.ownerDocument;
        doc8.addEventListener("mousemove", this.move = this.move.bind(this));
        doc8.addEventListener("mouseup", this.up = this.up.bind(this));
        this.extend = startEvent.shiftKey;
        this.multiple = view.state.facet(EditorState.allowMultipleSelections) && addsSelectionRange(view, startEvent);
        this.dragMove = dragMovesSelection(view, startEvent);
        this.dragging = isInPrimarySelection(view, startEvent) && getClickType(startEvent) == 1 ? null : false;
        if (this.dragging === false) {
            startEvent.preventDefault();
            this.select(startEvent);
        }
    }
    move(event) {
        if (event.buttons == 0) return this.destroy();
        if (this.dragging !== false) return;
        this.select(this.lastEvent = event);
    }
    up(event) {
        if (this.dragging == null) this.select(this.lastEvent);
        if (!this.dragging) event.preventDefault();
        this.destroy();
    }
    destroy() {
        let doc9 = this.view.contentDOM.ownerDocument;
        doc9.removeEventListener("mousemove", this.move);
        doc9.removeEventListener("mouseup", this.up);
        this.view.inputState.mouseSelection = null;
    }
    select(event) {
        let selection6 = this.style.get(event, this.extend, this.multiple);
        if (this.mustSelect || !selection6.eq(this.view.state.selection) || selection6.main.assoc != this.view.state.selection.main.assoc) this.view.dispatch({
            selection: selection6,
            userEvent: "select.pointer",
            scrollIntoView: true
        });
        this.mustSelect = false;
    }
    update(update) {
        if (update.docChanged && this.dragging) this.dragging = this.dragging.map(update.changes);
        if (this.style.update(update)) setTimeout(()=>this.select(this.lastEvent)
        , 20);
    }
}
function addsSelectionRange(view, event) {
    let facet = view.state.facet(clickAddsSelectionRange);
    return facet.length ? facet[0](event) : browser.mac ? event.metaKey : event.ctrlKey;
}
function dragMovesSelection(view, event) {
    let facet = view.state.facet(dragMovesSelection$1);
    return facet.length ? facet[0](event) : browser.mac ? !event.altKey : !event.ctrlKey;
}
function isInPrimarySelection(view, event) {
    let { main  } = view.state.selection;
    if (main.empty) return false;
    let sel = getSelection(view.root);
    if (sel.rangeCount == 0) return true;
    let rects = sel.getRangeAt(0).getClientRects();
    for(let i88 = 0; i88 < rects.length; i88++){
        let rect = rects[i88];
        if (rect.left <= event.clientX && rect.right >= event.clientX && rect.top <= event.clientY && rect.bottom >= event.clientY) return true;
    }
    return false;
}
function eventBelongsToEditor(view, event) {
    if (!event.bubbles) return true;
    if (event.defaultPrevented) return false;
    for(let node = event.target, cView; node != view.contentDOM; node = node.parentNode)if (!node || node.nodeType == 11 || (cView = ContentView.get(node)) && cView.ignoreEvent(event)) return false;
    return true;
}
const handlers = Object.create(null);
const brokenClipboardAPI = browser.ie && browser.ie_version < 15 || browser.ios && browser.webkit_version < 604;
function capturePaste(view) {
    let parent = view.dom.parentNode;
    if (!parent) return;
    let target = parent.appendChild(document.createElement("textarea"));
    target.style.cssText = "position: fixed; left: -10000px; top: 10px";
    target.focus();
    setTimeout(()=>{
        view.focus();
        target.remove();
        doPaste(view, target.value);
    }, 50);
}
function doPaste(view, input) {
    let { state  } = view, changes, i89 = 1, text = state.toText(input);
    let byLine = text.lines == state.selection.ranges.length;
    let linewise = lastLinewiseCopy != null && state.selection.ranges.every((r)=>r.empty
    ) && lastLinewiseCopy == text.toString();
    if (linewise) {
        let lastLine = -1;
        changes = state.changeByRange((range)=>{
            let line = state.doc.lineAt(range.from);
            if (line.from == lastLine) return {
                range
            };
            lastLine = line.from;
            let insert6 = state.toText((byLine ? text.line(i89++).text : input) + state.lineBreak);
            return {
                changes: {
                    from: line.from,
                    insert: insert6
                },
                range: EditorSelection.cursor(range.from + insert6.length)
            };
        });
    } else if (byLine) {
        changes = state.changeByRange((range)=>{
            let line = text.line(i89++);
            return {
                changes: {
                    from: range.from,
                    to: range.to,
                    insert: line.text
                },
                range: EditorSelection.cursor(range.from + line.length)
            };
        });
    } else {
        changes = state.replaceSelection(text);
    }
    view.dispatch(changes, {
        userEvent: "input.paste",
        scrollIntoView: true
    });
}
handlers.keydown = (view, event)=>{
    view.inputState.setSelectionOrigin("select");
};
let lastTouch = 0;
handlers.touchstart = (view, e)=>{
    lastTouch = Date.now();
    view.inputState.setSelectionOrigin("select.pointer");
};
handlers.touchmove = (view)=>{
    view.inputState.setSelectionOrigin("select.pointer");
};
handlers.mousedown = (view, event)=>{
    view.observer.flush();
    if (lastTouch > Date.now() - 2000 && getClickType(event) == 1) return;
    let style = null;
    for (let makeStyle of view.state.facet(mouseSelectionStyle)){
        style = makeStyle(view, event);
        if (style) break;
    }
    if (!style && event.button == 0) style = basicMouseSelection(view, event);
    if (style) {
        let mustFocus = view.root.activeElement != view.contentDOM;
        if (mustFocus) view.observer.ignore(()=>focusPreventScroll(view.contentDOM)
        );
        view.inputState.startMouseSelection(new MouseSelection(view, event, style, mustFocus));
    }
};
function rangeForClick(view, pos, bias, type) {
    if (type == 1) {
        return EditorSelection.cursor(pos, bias);
    } else if (type == 2) {
        return groupAt(view.state, pos, bias);
    } else {
        let visual = LineView.find(view.docView, pos), line = view.state.doc.lineAt(visual ? visual.posAtEnd : pos);
        let from = visual ? visual.posAtStart : line.from, to = visual ? visual.posAtEnd : line.to;
        if (to < view.state.doc.length && to == line.to) to++;
        return EditorSelection.range(from, to);
    }
}
let insideY = (y, rect)=>y >= rect.top && y <= rect.bottom
;
let inside = (x, y, rect)=>insideY(y, rect) && x >= rect.left && x <= rect.right
;
function findPositionSide(view, pos, x, y) {
    let line = LineView.find(view.docView, pos);
    if (!line) return 1;
    let off = pos - line.posAtStart;
    if (off == 0) return 1;
    if (off == line.length) return -1;
    let before = line.coordsAt(off, -1);
    if (before && inside(x, y, before)) return -1;
    let after = line.coordsAt(off, 1);
    if (after && inside(x, y, after)) return 1;
    return before && insideY(y, before) ? -1 : 1;
}
function queryPos(view, event) {
    let pos = view.posAtCoords({
        x: event.clientX,
        y: event.clientY
    }, false);
    return {
        pos,
        bias: findPositionSide(view, pos, event.clientX, event.clientY)
    };
}
const BadMouseDetail = browser.ie && browser.ie_version <= 11;
let lastMouseDown = null, lastMouseDownCount = 0, lastMouseDownTime = 0;
function getClickType(event) {
    if (!BadMouseDetail) return event.detail;
    let last = lastMouseDown, lastTime = lastMouseDownTime;
    lastMouseDown = event;
    lastMouseDownTime = Date.now();
    return lastMouseDownCount = !last || lastTime > Date.now() - 400 && Math.abs(last.clientX - event.clientX) < 2 && Math.abs(last.clientY - event.clientY) < 2 ? (lastMouseDownCount + 1) % 3 : 1;
}
function basicMouseSelection(view, event1) {
    let start = queryPos(view, event1), type = getClickType(event1);
    let startSel = view.state.selection;
    let last = start, lastEvent = event1;
    return {
        update (update) {
            if (update.docChanged) {
                if (start) start.pos = update.changes.mapPos(start.pos);
                startSel = startSel.map(update.changes);
                lastEvent = null;
            }
        },
        get (event, extend1, multiple) {
            let cur16;
            if (lastEvent && event.clientX == lastEvent.clientX && event.clientY == lastEvent.clientY) cur16 = last;
            else {
                cur16 = last = queryPos(view, event);
                lastEvent = event;
            }
            if (!cur16 || !start) return startSel;
            let range = rangeForClick(view, cur16.pos, cur16.bias, type);
            if (start.pos != cur16.pos && !extend1) {
                let startRange = rangeForClick(view, start.pos, start.bias, type);
                let from = Math.min(startRange.from, range.from), to = Math.max(startRange.to, range.to);
                range = from < range.from ? EditorSelection.range(from, to) : EditorSelection.range(to, from);
            }
            if (extend1) return startSel.replaceRange(startSel.main.extend(range.from, range.to));
            else if (multiple) return startSel.addRange(range);
            else return EditorSelection.create([
                range
            ]);
        }
    };
}
handlers.dragstart = (view, event)=>{
    let { selection: { main  }  } = view.state;
    let { mouseSelection  } = view.inputState;
    if (mouseSelection) mouseSelection.dragging = main;
    if (event.dataTransfer) {
        event.dataTransfer.setData("Text", view.state.sliceDoc(main.from, main.to));
        event.dataTransfer.effectAllowed = "copyMove";
    }
};
function dropText(view, event, text, direct) {
    if (!text) return;
    let dropPos = view.posAtCoords({
        x: event.clientX,
        y: event.clientY
    }, false);
    event.preventDefault();
    let { mouseSelection  } = view.inputState;
    let del = direct && mouseSelection && mouseSelection.dragging && mouseSelection.dragMove ? {
        from: mouseSelection.dragging.from,
        to: mouseSelection.dragging.to
    } : null;
    let ins = {
        from: dropPos,
        insert: text
    };
    let changes = view.state.changes(del ? [
        del,
        ins
    ] : ins);
    view.focus();
    view.dispatch({
        changes,
        selection: {
            anchor: changes.mapPos(dropPos, -1),
            head: changes.mapPos(dropPos, 1)
        },
        userEvent: del ? "move.drop" : "input.drop"
    });
}
handlers.drop = (view, event)=>{
    if (!event.dataTransfer) return;
    if (view.state.readOnly) return event.preventDefault();
    let files = event.dataTransfer.files;
    if (files && files.length) {
        event.preventDefault();
        let text = Array(files.length), read = 0;
        let finishFile = ()=>{
            if (++read == files.length) dropText(view, event, text.filter((s)=>s != null
            ).join(view.state.lineBreak), false);
        };
        for(let i90 = 0; i90 < files.length; i90++){
            let reader = new FileReader;
            reader.onerror = finishFile;
            reader.onload = ()=>{
                if (!/[\x00-\x08\x0e-\x1f]{2}/.test(reader.result)) text[i90] = reader.result;
                finishFile();
            };
            reader.readAsText(files[i90]);
        }
    } else {
        dropText(view, event, event.dataTransfer.getData("Text"), true);
    }
};
handlers.paste = (view, event)=>{
    if (view.state.readOnly) return event.preventDefault();
    view.observer.flush();
    let data = brokenClipboardAPI ? null : event.clipboardData;
    if (data) {
        doPaste(view, data.getData("text/plain"));
        event.preventDefault();
    } else {
        capturePaste(view);
    }
};
function captureCopy(view, text) {
    let parent = view.dom.parentNode;
    if (!parent) return;
    let target = parent.appendChild(document.createElement("textarea"));
    target.style.cssText = "position: fixed; left: -10000px; top: 10px";
    target.value = text;
    target.focus();
    target.selectionEnd = text.length;
    target.selectionStart = 0;
    setTimeout(()=>{
        target.remove();
        view.focus();
    }, 50);
}
function copiedRange(state) {
    let content7 = [], ranges = [], linewise = false;
    for (let range of state.selection.ranges)if (!range.empty) {
        content7.push(state.sliceDoc(range.from, range.to));
        ranges.push(range);
    }
    if (!content7.length) {
        let upto = -1;
        for (let { from  } of state.selection.ranges){
            let line = state.doc.lineAt(from);
            if (line.number > upto) {
                content7.push(line.text);
                ranges.push({
                    from: line.from,
                    to: Math.min(state.doc.length, line.to + 1)
                });
            }
            upto = line.number;
        }
        linewise = true;
    }
    return {
        text: content7.join(state.lineBreak),
        ranges,
        linewise
    };
}
let lastLinewiseCopy = null;
handlers.copy = handlers.cut = (view, event)=>{
    let { text , ranges , linewise  } = copiedRange(view.state);
    if (!text && !linewise) return;
    lastLinewiseCopy = linewise ? text : null;
    let data = brokenClipboardAPI ? null : event.clipboardData;
    if (data) {
        event.preventDefault();
        data.clearData();
        data.setData("text/plain", text);
    } else {
        captureCopy(view, text);
    }
    if (event.type == "cut" && !view.state.readOnly) view.dispatch({
        changes: ranges,
        scrollIntoView: true,
        userEvent: "delete.cut"
    });
};
handlers.focus = handlers.blur = (view)=>{
    setTimeout(()=>{
        if (view.hasFocus != view.inputState.notifiedFocused) view.update([]);
    }, 10);
};
handlers.beforeprint = (view)=>{
    view.viewState.printing = true;
    view.requestMeasure();
    setTimeout(()=>{
        view.viewState.printing = false;
        view.requestMeasure();
    }, 2000);
};
function forceClearComposition(view, rapid) {
    if (view.docView.compositionDeco.size) {
        view.inputState.rapidCompositionStart = rapid;
        try {
            view.update([]);
        } finally{
            view.inputState.rapidCompositionStart = false;
        }
    }
}
handlers.compositionstart = handlers.compositionupdate = (view)=>{
    if (view.inputState.compositionFirstChange == null) view.inputState.compositionFirstChange = true;
    if (view.inputState.composing < 0) {
        view.inputState.composing = 0;
        if (view.docView.compositionDeco.size) {
            view.observer.flush();
            forceClearComposition(view, true);
        }
    }
};
handlers.compositionend = (view)=>{
    view.inputState.composing = -1;
    view.inputState.compositionEndedAt = Date.now();
    view.inputState.compositionFirstChange = null;
    setTimeout(()=>{
        if (view.inputState.composing < 0) forceClearComposition(view, false);
    }, 50);
};
handlers.contextmenu = (view)=>{
    view.inputState.lastContextMenu = Date.now();
};
handlers.beforeinput = (view, event)=>{
    var _a1;
    let pending;
    if (browser.chrome && browser.android && (pending = PendingKeys.find((key)=>key.inputType == event.inputType
    ))) {
        view.observer.delayAndroidKey(pending.key, pending.keyCode);
        if (pending.key == "Backspace" || pending.key == "Delete") {
            let startViewHeight = ((_a1 = window.visualViewport) === null || _a1 === void 0 ? void 0 : _a1.height) || 0;
            setTimeout(()=>{
                var _a;
                if ((((_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.height) || 0) > startViewHeight + 10 && view.hasFocus) {
                    view.contentDOM.blur();
                    view.focus();
                }
            }, 100);
        }
    }
};
const wrappingWhiteSpace = [
    "pre-wrap",
    "normal",
    "pre-line",
    "break-spaces"
];
class HeightOracle {
    constructor(){
        this.doc = Text.empty;
        this.lineWrapping = false;
        this.direction = Direction.LTR;
        this.heightSamples = {
        };
        this.lineHeight = 14;
        this.charWidth = 7;
        this.lineLength = 30;
        this.heightChanged = false;
    }
    heightForGap(from, to) {
        let lines = this.doc.lineAt(to).number - this.doc.lineAt(from).number + 1;
        if (this.lineWrapping) lines += Math.ceil((to - from - lines * this.lineLength * 0.5) / this.lineLength);
        return this.lineHeight * lines;
    }
    heightForLine(length) {
        if (!this.lineWrapping) return this.lineHeight;
        let lines = 1 + Math.max(0, Math.ceil((length - this.lineLength) / (this.lineLength - 5)));
        return lines * this.lineHeight;
    }
    setDoc(doc10) {
        this.doc = doc10;
        return this;
    }
    mustRefreshForStyle(whiteSpace, direction) {
        return wrappingWhiteSpace.indexOf(whiteSpace) > -1 != this.lineWrapping || this.direction != direction;
    }
    mustRefreshForHeights(lineHeights) {
        let newHeight = false;
        for(let i91 = 0; i91 < lineHeights.length; i91++){
            let h = lineHeights[i91];
            if (h < 0) {
                i91++;
            } else if (!this.heightSamples[Math.floor(h * 10)]) {
                newHeight = true;
                this.heightSamples[Math.floor(h * 10)] = true;
            }
        }
        return newHeight;
    }
    refresh(whiteSpace, direction, lineHeight, charWidth, lineLength, knownHeights) {
        let lineWrapping = wrappingWhiteSpace.indexOf(whiteSpace) > -1;
        let changed = Math.round(lineHeight) != Math.round(this.lineHeight) || this.lineWrapping != lineWrapping || this.direction != direction;
        this.lineWrapping = lineWrapping;
        this.direction = direction;
        this.lineHeight = lineHeight;
        this.charWidth = charWidth;
        this.lineLength = lineLength;
        if (changed) {
            this.heightSamples = {
            };
            for(let i92 = 0; i92 < knownHeights.length; i92++){
                let h = knownHeights[i92];
                if (h < 0) i92++;
                else this.heightSamples[Math.floor(h * 10)] = true;
            }
        }
        return changed;
    }
}
class MeasuredHeights {
    constructor(from, heights){
        this.from = from;
        this.heights = heights;
        this.index = 0;
    }
    get more() {
        return this.index < this.heights.length;
    }
}
class BlockInfo {
    constructor(from, length, top9, height, type){
        this.from = from;
        this.length = length;
        this.top = top9;
        this.height = height;
        this.type = type;
    }
    get to() {
        return this.from + this.length;
    }
    get bottom() {
        return this.top + this.height;
    }
    join(other) {
        let detail = (Array.isArray(this.type) ? this.type : [
            this
        ]).concat(Array.isArray(other.type) ? other.type : [
            other
        ]);
        return new BlockInfo(this.from, this.length + other.length, this.top, this.height + other.height, detail);
    }
    moveY(offset) {
        return !offset ? this : new BlockInfo(this.from, this.length, this.top + offset, this.height, Array.isArray(this.type) ? this.type.map((b)=>b.moveY(offset)
        ) : this.type);
    }
}
var QueryType$1 = function(QueryType1) {
    QueryType1[QueryType1["ByPos"] = 0] = "ByPos";
    QueryType1[QueryType1["ByHeight"] = 1] = "ByHeight";
    QueryType1[QueryType1["ByPosNoHeight"] = 2] = "ByPosNoHeight";
    return QueryType1;
}(QueryType$1 || (QueryType$1 = {
}));
const Epsilon = 0.001;
class HeightMap {
    constructor(length, height, flags = 2){
        this.length = length;
        this.height = height;
        this.flags = flags;
    }
    get outdated() {
        return (this.flags & 2) > 0;
    }
    set outdated(value) {
        this.flags = (value ? 2 : 0) | this.flags & ~2;
    }
    setHeight(oracle, height) {
        if (this.height != height) {
            if (Math.abs(this.height - height) > 0.001) oracle.heightChanged = true;
            this.height = height;
        }
    }
    replace(_from, _to, nodes) {
        return HeightMap.of(nodes);
    }
    decomposeLeft(_to, result) {
        result.push(this);
    }
    decomposeRight(_from, result) {
        result.push(this);
    }
    applyChanges(decorations3, oldDoc, oracle, changes) {
        let me = this;
        for(let i93 = changes.length - 1; i93 >= 0; i93--){
            let { fromA , toA , fromB , toB  } = changes[i93];
            let start = me.lineAt(fromA, QueryType$1.ByPosNoHeight, oldDoc, 0, 0);
            let end = start.to >= toA ? start : me.lineAt(toA, QueryType$1.ByPosNoHeight, oldDoc, 0, 0);
            toB += end.to - toA;
            toA = end.to;
            while(i93 > 0 && start.from <= changes[i93 - 1].toA){
                fromA = changes[i93 - 1].fromA;
                fromB = changes[i93 - 1].fromB;
                i93--;
                if (fromA < start.from) start = me.lineAt(fromA, QueryType$1.ByPosNoHeight, oldDoc, 0, 0);
            }
            fromB += start.from - fromA;
            fromA = start.from;
            let nodes = NodeBuilder.build(oracle, decorations3, fromB, toB);
            me = me.replace(fromA, toA, nodes);
        }
        return me.updateHeight(oracle, 0);
    }
    static empty() {
        return new HeightMapText(0, 0);
    }
    static of(nodes) {
        if (nodes.length == 1) return nodes[0];
        let i94 = 0, j = nodes.length, before = 0, after = 0;
        for(;;){
            if (i94 == j) {
                if (before > after * 2) {
                    let split = nodes[i94 - 1];
                    if (split.break) nodes.splice(--i94, 1, split.left, null, split.right);
                    else nodes.splice(--i94, 1, split.left, split.right);
                    j += 1 + split.break;
                    before -= split.size;
                } else if (after > before * 2) {
                    let split = nodes[j];
                    if (split.break) nodes.splice(j, 1, split.left, null, split.right);
                    else nodes.splice(j, 1, split.left, split.right);
                    j += 2 + split.break;
                    after -= split.size;
                } else {
                    break;
                }
            } else if (before < after) {
                let next = nodes[i94++];
                if (next) before += next.size;
            } else {
                let next = nodes[--j];
                if (next) after += next.size;
            }
        }
        let brk = 0;
        if (nodes[i94 - 1] == null) {
            brk = 1;
            i94--;
        } else if (nodes[i94] == null) {
            brk = 1;
            j++;
        }
        return new HeightMapBranch(HeightMap.of(nodes.slice(0, i94)), brk, HeightMap.of(nodes.slice(j)));
    }
}
HeightMap.prototype.size = 1;
class HeightMapBlock extends HeightMap {
    constructor(length, height, type){
        super(length, height);
        this.type = type;
    }
    blockAt(_height, _doc, top10, offset) {
        return new BlockInfo(offset, this.length, top10, this.height, this.type);
    }
    lineAt(_value, _type, doc11, top11, offset) {
        return this.blockAt(0, doc11, top11, offset);
    }
    forEachLine(_from, _to, doc12, top12, offset, f) {
        f(this.blockAt(0, doc12, top12, offset));
    }
    updateHeight(oracle, offset = 0, _force = false, measured) {
        if (measured && measured.from <= offset && measured.more) this.setHeight(oracle, measured.heights[measured.index++]);
        this.outdated = false;
        return this;
    }
    toString() {
        return `block(${this.length})`;
    }
}
class HeightMapText extends HeightMapBlock {
    constructor(length, height){
        super(length, height, BlockType.Text);
        this.collapsed = 0;
        this.widgetHeight = 0;
    }
    replace(_from, _to, nodes) {
        let node = nodes[0];
        if (nodes.length == 1 && (node instanceof HeightMapText || node instanceof HeightMapGap && node.flags & 4) && Math.abs(this.length - node.length) < 10) {
            if (node instanceof HeightMapGap) node = new HeightMapText(node.length, this.height);
            else node.height = this.height;
            if (!this.outdated) node.outdated = false;
            return node;
        } else {
            return HeightMap.of(nodes);
        }
    }
    updateHeight(oracle, offset = 0, force = false, measured) {
        if (measured && measured.from <= offset && measured.more) this.setHeight(oracle, measured.heights[measured.index++]);
        else if (force || this.outdated) this.setHeight(oracle, Math.max(this.widgetHeight, oracle.heightForLine(this.length - this.collapsed)));
        this.outdated = false;
        return this;
    }
    toString() {
        return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
    }
}
class HeightMapGap extends HeightMap {
    constructor(length){
        super(length, 0);
    }
    lines(doc13, offset) {
        let firstLine = doc13.lineAt(offset).number, lastLine = doc13.lineAt(offset + this.length).number;
        return {
            firstLine,
            lastLine,
            lineHeight: this.height / (lastLine - firstLine + 1)
        };
    }
    blockAt(height, doc14, top13, offset) {
        let { firstLine , lastLine , lineHeight  } = this.lines(doc14, offset);
        let line = Math.max(0, Math.min(lastLine - firstLine, Math.floor((height - top13) / lineHeight)));
        let { from , length  } = doc14.line(firstLine + line);
        return new BlockInfo(from, length, top13 + lineHeight * line, lineHeight, BlockType.Text);
    }
    lineAt(value, type, doc15, top14, offset) {
        if (type == QueryType$1.ByHeight) return this.blockAt(value, doc15, top14, offset);
        if (type == QueryType$1.ByPosNoHeight) {
            let { from , to  } = doc15.lineAt(value);
            return new BlockInfo(from, to - from, 0, 0, BlockType.Text);
        }
        let { firstLine , lineHeight  } = this.lines(doc15, offset);
        let { from , length , number: number2  } = doc15.lineAt(value);
        return new BlockInfo(from, length, top14 + lineHeight * (number2 - firstLine), lineHeight, BlockType.Text);
    }
    forEachLine(from, to, doc16, top15, offset, f) {
        let { firstLine , lineHeight  } = this.lines(doc16, offset);
        for(let pos = Math.max(from, offset), end = Math.min(offset + this.length, to); pos <= end;){
            let line = doc16.lineAt(pos);
            if (pos == from) top15 += lineHeight * (line.number - firstLine);
            f(new BlockInfo(line.from, line.length, top15, lineHeight, BlockType.Text));
            top15 += lineHeight;
            pos = line.to + 1;
        }
    }
    replace(from, to, nodes) {
        let after = this.length - to;
        if (after > 0) {
            let last = nodes[nodes.length - 1];
            if (last instanceof HeightMapGap) nodes[nodes.length - 1] = new HeightMapGap(last.length + after);
            else nodes.push(null, new HeightMapGap(after - 1));
        }
        if (from > 0) {
            let first = nodes[0];
            if (first instanceof HeightMapGap) nodes[0] = new HeightMapGap(from + first.length);
            else nodes.unshift(new HeightMapGap(from - 1), null);
        }
        return HeightMap.of(nodes);
    }
    decomposeLeft(to, result) {
        result.push(new HeightMapGap(to - 1), null);
    }
    decomposeRight(from, result) {
        result.push(null, new HeightMapGap(this.length - from - 1));
    }
    updateHeight(oracle, offset = 0, force = false, measured) {
        let end = offset + this.length;
        if (measured && measured.from <= offset + this.length && measured.more) {
            let nodes = [], pos = Math.max(offset, measured.from), singleHeight = -1;
            let wasChanged = oracle.heightChanged;
            if (measured.from > offset) nodes.push(new HeightMapGap(measured.from - offset - 1).updateHeight(oracle, offset));
            while(pos <= end && measured.more){
                let len = oracle.doc.lineAt(pos).length;
                if (nodes.length) nodes.push(null);
                let height = measured.heights[measured.index++];
                if (singleHeight == -1) singleHeight = height;
                else if (Math.abs(height - singleHeight) >= 0.001) singleHeight = -2;
                let line = new HeightMapText(len, height);
                line.outdated = false;
                nodes.push(line);
                pos += len + 1;
            }
            if (pos <= end) nodes.push(null, new HeightMapGap(end - pos).updateHeight(oracle, pos));
            let result = HeightMap.of(nodes);
            oracle.heightChanged = wasChanged || singleHeight < 0 || Math.abs(result.height - this.height) >= Epsilon || Math.abs(singleHeight - this.lines(oracle.doc, offset).lineHeight) >= Epsilon;
            return result;
        } else if (force || this.outdated) {
            this.setHeight(oracle, oracle.heightForGap(offset, offset + this.length));
            this.outdated = false;
        }
        return this;
    }
    toString() {
        return `gap(${this.length})`;
    }
}
class HeightMapBranch extends HeightMap {
    constructor(left, brk, right){
        super(left.length + brk + right.length, left.height + right.height, brk | (left.outdated || right.outdated ? 2 : 0));
        this.left = left;
        this.right = right;
        this.size = left.size + right.size;
    }
    get break() {
        return this.flags & 1;
    }
    blockAt(height, doc17, top16, offset) {
        let mid = top16 + this.left.height;
        return height < mid ? this.left.blockAt(height, doc17, top16, offset) : this.right.blockAt(height, doc17, mid, offset + this.left.length + this.break);
    }
    lineAt(value, type, doc18, top17, offset) {
        let rightTop = top17 + this.left.height, rightOffset = offset + this.left.length + this.break;
        let left = type == QueryType$1.ByHeight ? value < rightTop : value < rightOffset;
        let base4 = left ? this.left.lineAt(value, type, doc18, top17, offset) : this.right.lineAt(value, type, doc18, rightTop, rightOffset);
        if (this.break || (left ? base4.to < rightOffset : base4.from > rightOffset)) return base4;
        let subQuery = type == QueryType$1.ByPosNoHeight ? QueryType$1.ByPosNoHeight : QueryType$1.ByPos;
        if (left) return base4.join(this.right.lineAt(rightOffset, subQuery, doc18, rightTop, rightOffset));
        else return this.left.lineAt(rightOffset, subQuery, doc18, top17, offset).join(base4);
    }
    forEachLine(from, to, doc19, top18, offset, f) {
        let rightTop = top18 + this.left.height, rightOffset = offset + this.left.length + this.break;
        if (this.break) {
            if (from < rightOffset) this.left.forEachLine(from, to, doc19, top18, offset, f);
            if (to >= rightOffset) this.right.forEachLine(from, to, doc19, rightTop, rightOffset, f);
        } else {
            let mid = this.lineAt(rightOffset, QueryType$1.ByPos, doc19, top18, offset);
            if (from < mid.from) this.left.forEachLine(from, mid.from - 1, doc19, top18, offset, f);
            if (mid.to >= from && mid.from <= to) f(mid);
            if (to > mid.to) this.right.forEachLine(mid.to + 1, to, doc19, rightTop, rightOffset, f);
        }
    }
    replace(from, to, nodes) {
        let rightStart = this.left.length + this.break;
        if (to < rightStart) return this.balanced(this.left.replace(from, to, nodes), this.right);
        if (from > this.left.length) return this.balanced(this.left, this.right.replace(from - rightStart, to - rightStart, nodes));
        let result = [];
        if (from > 0) this.decomposeLeft(from, result);
        let left = result.length;
        for (let node of nodes)result.push(node);
        if (from > 0) mergeGaps(result, left - 1);
        if (to < this.length) {
            let right = result.length;
            this.decomposeRight(to, result);
            mergeGaps(result, right);
        }
        return HeightMap.of(result);
    }
    decomposeLeft(to, result) {
        let left = this.left.length;
        if (to <= left) return this.left.decomposeLeft(to, result);
        result.push(this.left);
        if (this.break) {
            left++;
            if (to >= left) result.push(null);
        }
        if (to > left) this.right.decomposeLeft(to - left, result);
    }
    decomposeRight(from, result) {
        let left = this.left.length, right = left + this.break;
        if (from >= right) return this.right.decomposeRight(from - right, result);
        if (from < left) this.left.decomposeRight(from, result);
        if (this.break && from < right) result.push(null);
        result.push(this.right);
    }
    balanced(left, right) {
        if (left.size > 2 * right.size || right.size > 2 * left.size) return HeightMap.of(this.break ? [
            left,
            null,
            right
        ] : [
            left,
            right
        ]);
        this.left = left;
        this.right = right;
        this.height = left.height + right.height;
        this.outdated = left.outdated || right.outdated;
        this.size = left.size + right.size;
        this.length = left.length + this.break + right.length;
        return this;
    }
    updateHeight(oracle, offset = 0, force = false, measured) {
        let { left , right  } = this, rightStart = offset + left.length + this.break, rebalance = null;
        if (measured && measured.from <= offset + left.length && measured.more) rebalance = left = left.updateHeight(oracle, offset, force, measured);
        else left.updateHeight(oracle, offset, force);
        if (measured && measured.from <= rightStart + right.length && measured.more) rebalance = right = right.updateHeight(oracle, rightStart, force, measured);
        else right.updateHeight(oracle, rightStart, force);
        if (rebalance) return this.balanced(left, right);
        this.height = this.left.height + this.right.height;
        this.outdated = false;
        return this;
    }
    toString() {
        return this.left + (this.break ? " " : "-") + this.right;
    }
}
function mergeGaps(nodes, around) {
    let before, after;
    if (nodes[around] == null && (before = nodes[around - 1]) instanceof HeightMapGap && (after = nodes[around + 1]) instanceof HeightMapGap) nodes.splice(around - 1, 3, new HeightMapGap(before.length + 1 + after.length));
}
class NodeBuilder {
    constructor(pos, oracle){
        this.pos = pos;
        this.oracle = oracle;
        this.nodes = [];
        this.lineStart = -1;
        this.lineEnd = -1;
        this.covering = null;
        this.writtenTo = pos;
    }
    get isCovered() {
        return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
    }
    span(_from, to) {
        if (this.lineStart > -1) {
            let end = Math.min(to, this.lineEnd), last = this.nodes[this.nodes.length - 1];
            if (last instanceof HeightMapText) last.length += end - this.pos;
            else if (end > this.pos || !this.isCovered) this.nodes.push(new HeightMapText(end - this.pos, -1));
            this.writtenTo = end;
            if (to > end) {
                this.nodes.push(null);
                this.writtenTo++;
                this.lineStart = -1;
            }
        }
        this.pos = to;
    }
    point(from, to, deco) {
        if (from < to || deco.heightRelevant) {
            let height = deco.widget ? deco.widget.estimatedHeight : 0;
            if (height < 0) height = this.oracle.lineHeight;
            let len = to - from;
            if (deco.block) {
                this.addBlock(new HeightMapBlock(len, height, deco.type));
            } else if (len || height >= 5) {
                this.addLineDeco(height, len);
            }
        } else if (to > from) {
            this.span(from, to);
        }
        if (this.lineEnd > -1 && this.lineEnd < this.pos) this.lineEnd = this.oracle.doc.lineAt(this.pos).to;
    }
    enterLine() {
        if (this.lineStart > -1) return;
        let { from , to  } = this.oracle.doc.lineAt(this.pos);
        this.lineStart = from;
        this.lineEnd = to;
        if (this.writtenTo < from) {
            if (this.writtenTo < from - 1 || this.nodes[this.nodes.length - 1] == null) this.nodes.push(this.blankContent(this.writtenTo, from - 1));
            this.nodes.push(null);
        }
        if (this.pos > from) this.nodes.push(new HeightMapText(this.pos - from, -1));
        this.writtenTo = this.pos;
    }
    blankContent(from, to) {
        let gap = new HeightMapGap(to - from);
        if (this.oracle.doc.lineAt(from).to == to) gap.flags |= 4;
        return gap;
    }
    ensureLine() {
        this.enterLine();
        let last = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
        if (last instanceof HeightMapText) return last;
        let line = new HeightMapText(0, -1);
        this.nodes.push(line);
        return line;
    }
    addBlock(block) {
        this.enterLine();
        if (block.type == BlockType.WidgetAfter && !this.isCovered) this.ensureLine();
        this.nodes.push(block);
        this.writtenTo = this.pos = this.pos + block.length;
        if (block.type != BlockType.WidgetBefore) this.covering = block;
    }
    addLineDeco(height, length) {
        let line = this.ensureLine();
        line.length += length;
        line.collapsed += length;
        line.widgetHeight = Math.max(line.widgetHeight, height);
        this.writtenTo = this.pos = this.pos + length;
    }
    finish(from) {
        let last = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
        if (this.lineStart > -1 && !(last instanceof HeightMapText) && !this.isCovered) this.nodes.push(new HeightMapText(0, -1));
        else if (this.writtenTo < this.pos || last == null) this.nodes.push(this.blankContent(this.writtenTo, this.pos));
        let pos = from;
        for (let node of this.nodes){
            if (node instanceof HeightMapText) node.updateHeight(this.oracle, pos);
            pos += node ? node.length : 1;
        }
        return this.nodes;
    }
    static build(oracle, decorations4, from, to) {
        let builder = new NodeBuilder(from, oracle);
        RangeSet.spans(decorations4, from, to, builder, 0);
        return builder.finish(from);
    }
}
function heightRelevantDecoChanges(a, b, diff) {
    let comp = new DecorationComparator;
    RangeSet.compare(a, b, diff, comp, 0);
    return comp.changes;
}
class DecorationComparator {
    constructor(){
        this.changes = [];
    }
    compareRange() {
    }
    comparePoint(from, to, a, b) {
        if (from < to || a && a.heightRelevant || b && b.heightRelevant) addRange(from, to, this.changes, 5);
    }
}
function visiblePixelRange(dom, paddingTop) {
    let rect = dom.getBoundingClientRect();
    let left = Math.max(0, rect.left), right = Math.min(innerWidth, rect.right);
    let top19 = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
    let body = dom.ownerDocument.body;
    for(let parent = dom.parentNode; parent && parent != body;){
        if (parent.nodeType == 1) {
            let elt = parent;
            let style = window.getComputedStyle(elt);
            if ((elt.scrollHeight > elt.clientHeight || elt.scrollWidth > elt.clientWidth) && style.overflow != "visible") {
                let parentRect = elt.getBoundingClientRect();
                left = Math.max(left, parentRect.left);
                right = Math.min(right, parentRect.right);
                top19 = Math.max(top19, parentRect.top);
                bottom = Math.min(bottom, parentRect.bottom);
            }
            parent = style.position == "absolute" || style.position == "fixed" ? elt.offsetParent : elt.parentNode;
        } else if (parent.nodeType == 11) {
            parent = parent.host;
        } else {
            break;
        }
    }
    return {
        left: left - rect.left,
        right: Math.max(left, right) - rect.left,
        top: top19 - (rect.top + paddingTop),
        bottom: Math.max(top19, bottom) - (rect.top + paddingTop)
    };
}
class LineGap {
    constructor(from, to, size){
        this.from = from;
        this.to = to;
        this.size = size;
    }
    static same(a, b) {
        if (a.length != b.length) return false;
        for(let i95 = 0; i95 < a.length; i95++){
            let gA = a[i95], gB = b[i95];
            if (gA.from != gB.from || gA.to != gB.to || gA.size != gB.size) return false;
        }
        return true;
    }
    draw(wrapping) {
        return Decoration.replace({
            widget: new LineGapWidget(this.size, wrapping)
        }).range(this.from, this.to);
    }
}
class LineGapWidget extends WidgetType {
    constructor(size, vertical){
        super();
        this.size = size;
        this.vertical = vertical;
    }
    eq(other) {
        return other.size == this.size && other.vertical == this.vertical;
    }
    toDOM() {
        let elt = document.createElement("div");
        if (this.vertical) {
            elt.style.height = this.size + "px";
        } else {
            elt.style.width = this.size + "px";
            elt.style.height = "2px";
            elt.style.display = "inline-block";
        }
        return elt;
    }
    get estimatedHeight() {
        return this.vertical ? this.size : -1;
    }
}
class ViewState {
    constructor(state){
        this.state = state;
        this.pixelViewport = {
            left: 0,
            right: window.innerWidth,
            top: 0,
            bottom: 0
        };
        this.inView = true;
        this.paddingTop = 0;
        this.paddingBottom = 0;
        this.contentDOMWidth = 0;
        this.contentDOMHeight = 0;
        this.editorHeight = 0;
        this.editorWidth = 0;
        this.heightOracle = new HeightOracle;
        this.scaler = IdScaler;
        this.scrollTarget = null;
        this.printing = false;
        this.mustMeasureContent = true;
        this.visibleRanges = [];
        this.mustEnforceCursorAssoc = false;
        this.heightMap = HeightMap.empty().applyChanges(state.facet(decorations), Text.empty, this.heightOracle.setDoc(state.doc), [
            new ChangedRange(0, 0, 0, state.doc.length)
        ]);
        this.viewport = this.getViewport(0, null);
        this.updateViewportLines();
        this.updateForViewport();
        this.lineGaps = this.ensureLineGaps([]);
        this.lineGapDeco = Decoration.set(this.lineGaps.map((gap)=>gap.draw(false)
        ));
        this.computeVisibleRanges();
    }
    updateForViewport() {
        let viewports = [
            this.viewport
        ], { main  } = this.state.selection;
        for(let i96 = 0; i96 <= 1; i96++){
            let pos = i96 ? main.head : main.anchor;
            if (!viewports.some(({ from , to  })=>pos >= from && pos <= to
            )) {
                let { from , to  } = this.lineBlockAt(pos);
                viewports.push(new Viewport(from, to));
            }
        }
        this.viewports = viewports.sort((a, b)=>a.from - b.from
        );
        this.scaler = this.heightMap.height <= 7000000 ? IdScaler : new BigScaler(this.heightOracle.doc, this.heightMap, this.viewports);
    }
    updateViewportLines() {
        this.viewportLines = [];
        this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.state.doc, 0, 0, (block)=>{
            this.viewportLines.push(this.scaler.scale == 1 ? block : scaleBlock(block, this.scaler));
        });
    }
    update(update, scrollTarget = null) {
        let prev = this.state;
        this.state = update.state;
        let newDeco = this.state.facet(decorations);
        let contentChanges = update.changedRanges;
        let heightChanges = ChangedRange.extendWithRanges(contentChanges, heightRelevantDecoChanges(update.startState.facet(decorations), newDeco, update ? update.changes : ChangeSet.empty(this.state.doc.length)));
        let prevHeight = this.heightMap.height;
        this.heightMap = this.heightMap.applyChanges(newDeco, prev.doc, this.heightOracle.setDoc(this.state.doc), heightChanges);
        if (this.heightMap.height != prevHeight) update.flags |= 2;
        let viewport = heightChanges.length ? this.mapViewport(this.viewport, update.changes) : this.viewport;
        if (scrollTarget && (scrollTarget.range.head < viewport.from || scrollTarget.range.head > viewport.to) || !this.viewportIsAppropriate(viewport)) viewport = this.getViewport(0, scrollTarget);
        let updateLines = !update.changes.empty || update.flags & 2 || viewport.from != this.viewport.from || viewport.to != this.viewport.to;
        this.viewport = viewport;
        this.updateForViewport();
        if (updateLines) this.updateViewportLines();
        if (this.lineGaps.length || this.viewport.to - this.viewport.from > 4000) this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, update.changes)));
        update.flags |= this.computeVisibleRanges();
        if (scrollTarget) this.scrollTarget = scrollTarget;
        if (!this.mustEnforceCursorAssoc && update.selectionSet && update.view.lineWrapping && update.state.selection.main.empty && update.state.selection.main.assoc) this.mustEnforceCursorAssoc = true;
    }
    measure(view) {
        let dom = view.contentDOM, style = window.getComputedStyle(dom);
        let oracle = this.heightOracle;
        let whiteSpace = style.whiteSpace, direction = style.direction == "rtl" ? Direction.RTL : Direction.LTR;
        let refresh = this.heightOracle.mustRefreshForStyle(whiteSpace, direction);
        let measureContent = refresh || this.mustMeasureContent || this.contentDOMHeight != dom.clientHeight;
        let result = 0, bias = 0;
        if (measureContent) {
            this.mustMeasureContent = false;
            this.contentDOMHeight = dom.clientHeight;
            let paddingTop = parseInt(style.paddingTop) || 0, paddingBottom = parseInt(style.paddingBottom) || 0;
            if (this.paddingTop != paddingTop || this.paddingBottom != paddingBottom) {
                result |= 8;
                this.paddingTop = paddingTop;
                this.paddingBottom = paddingBottom;
            }
        }
        let pixelViewport = this.printing ? {
            top: -100000000,
            bottom: 100000000,
            left: -100000000,
            right: 100000000
        } : visiblePixelRange(dom, this.paddingTop);
        let dTop = pixelViewport.top - this.pixelViewport.top, dBottom = pixelViewport.bottom - this.pixelViewport.bottom;
        this.pixelViewport = pixelViewport;
        let inView = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
        if (inView != this.inView) {
            this.inView = inView;
            if (inView) measureContent = true;
        }
        if (!this.inView) return 0;
        let contentWidth = dom.clientWidth;
        if (this.contentDOMWidth != contentWidth || this.editorHeight != view.scrollDOM.clientHeight || this.editorWidth != view.scrollDOM.clientWidth) {
            this.contentDOMWidth = contentWidth;
            this.editorHeight = view.scrollDOM.clientHeight;
            this.editorWidth = view.scrollDOM.clientWidth;
            result |= 8;
        }
        if (measureContent) {
            let lineHeights = view.docView.measureVisibleLineHeights();
            if (oracle.mustRefreshForHeights(lineHeights)) refresh = true;
            if (refresh || oracle.lineWrapping && Math.abs(contentWidth - this.contentDOMWidth) > oracle.charWidth) {
                let { lineHeight , charWidth  } = view.docView.measureTextSize();
                refresh = oracle.refresh(whiteSpace, direction, lineHeight, charWidth, contentWidth / charWidth, lineHeights);
                if (refresh) {
                    view.docView.minWidth = 0;
                    result |= 8;
                }
            }
            if (dTop > 0 && dBottom > 0) bias = Math.max(dTop, dBottom);
            else if (dTop < 0 && dBottom < 0) bias = Math.min(dTop, dBottom);
            oracle.heightChanged = false;
            this.heightMap = this.heightMap.updateHeight(oracle, 0, refresh, new MeasuredHeights(this.viewport.from, lineHeights));
            if (oracle.heightChanged) result |= 2;
        }
        let viewportChange = !this.viewportIsAppropriate(this.viewport, bias) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
        if (viewportChange) this.viewport = this.getViewport(bias, this.scrollTarget);
        this.updateForViewport();
        if (result & 2 || viewportChange) this.updateViewportLines();
        if (this.lineGaps.length || this.viewport.to - this.viewport.from > 4000) this.updateLineGaps(this.ensureLineGaps(refresh ? [] : this.lineGaps));
        result |= this.computeVisibleRanges();
        if (this.mustEnforceCursorAssoc) {
            this.mustEnforceCursorAssoc = false;
            view.docView.enforceCursorAssoc();
        }
        return result;
    }
    get visibleTop() {
        return this.scaler.fromDOM(this.pixelViewport.top);
    }
    get visibleBottom() {
        return this.scaler.fromDOM(this.pixelViewport.bottom);
    }
    getViewport(bias, scrollTarget) {
        let marginTop = 0.5 - Math.max(-0.5, Math.min(0.5, bias / 1000 / 2));
        let map = this.heightMap, doc20 = this.state.doc, { visibleTop , visibleBottom  } = this;
        let viewport = new Viewport(map.lineAt(visibleTop - marginTop * 1000, QueryType$1.ByHeight, doc20, 0, 0).from, map.lineAt(visibleBottom + (1 - marginTop) * 1000, QueryType$1.ByHeight, doc20, 0, 0).to);
        if (scrollTarget) {
            let { head  } = scrollTarget.range, viewHeight = this.editorHeight;
            if (head < viewport.from || head > viewport.to) {
                let block = map.lineAt(head, QueryType$1.ByPos, doc20, 0, 0), topPos;
                if (scrollTarget.y == "center") topPos = (block.top + block.bottom) / 2 - viewHeight / 2;
                else if (scrollTarget.y == "start" || scrollTarget.y == "nearest" && head < viewport.from) topPos = block.top;
                else topPos = block.bottom - viewHeight;
                viewport = new Viewport(map.lineAt(topPos - 1000 / 2, QueryType$1.ByHeight, doc20, 0, 0).from, map.lineAt(topPos + viewHeight + 1000 / 2, QueryType$1.ByHeight, doc20, 0, 0).to);
            }
        }
        return viewport;
    }
    mapViewport(viewport, changes) {
        let from = changes.mapPos(viewport.from, -1), to = changes.mapPos(viewport.to, 1);
        return new Viewport(this.heightMap.lineAt(from, QueryType$1.ByPos, this.state.doc, 0, 0).from, this.heightMap.lineAt(to, QueryType$1.ByPos, this.state.doc, 0, 0).to);
    }
    viewportIsAppropriate({ from , to  }, bias = 0) {
        if (!this.inView) return true;
        let { top: top20  } = this.heightMap.lineAt(from, QueryType$1.ByPos, this.state.doc, 0, 0);
        let { bottom  } = this.heightMap.lineAt(to, QueryType$1.ByPos, this.state.doc, 0, 0);
        let { visibleTop , visibleBottom  } = this;
        return (from == 0 || top20 <= visibleTop - Math.max(10, Math.min(-bias, 250))) && (to == this.state.doc.length || bottom >= visibleBottom + Math.max(10, Math.min(bias, 250))) && top20 > visibleTop - 2 * 1000 && bottom < visibleBottom + 2 * 1000;
    }
    mapLineGaps(gaps, changes) {
        if (!gaps.length || changes.empty) return gaps;
        let mapped = [];
        for (let gap of gaps)if (!changes.touchesRange(gap.from, gap.to)) mapped.push(new LineGap(changes.mapPos(gap.from), changes.mapPos(gap.to), gap.size));
        return mapped;
    }
    ensureLineGaps(current) {
        let gaps = [];
        if (this.heightOracle.direction != Direction.LTR) return gaps;
        for (let line of this.viewportLines){
            if (line.length < 4000) continue;
            let structure = lineStructure(line.from, line.to, this.state);
            if (structure.total < 4000) continue;
            let viewFrom, viewTo;
            if (this.heightOracle.lineWrapping) {
                let marginHeight = 2000 / this.heightOracle.lineLength * this.heightOracle.lineHeight;
                viewFrom = findPosition(structure, (this.visibleTop - line.top - marginHeight) / line.height);
                viewTo = findPosition(structure, (this.visibleBottom - line.top + marginHeight) / line.height);
            } else {
                let totalWidth = structure.total * this.heightOracle.charWidth;
                let marginWidth = 2000 * this.heightOracle.charWidth;
                viewFrom = findPosition(structure, (this.pixelViewport.left - marginWidth) / totalWidth);
                viewTo = findPosition(structure, (this.pixelViewport.right + marginWidth) / totalWidth);
            }
            let outside = [];
            if (viewFrom > line.from) outside.push({
                from: line.from,
                to: viewFrom
            });
            if (viewTo < line.to) outside.push({
                from: viewTo,
                to: line.to
            });
            let sel = this.state.selection.main;
            if (sel.from >= line.from && sel.from <= line.to) cutRange(outside, sel.from - 10, sel.from + 10);
            if (!sel.empty && sel.to >= line.from && sel.to <= line.to) cutRange(outside, sel.to - 10, sel.to + 10);
            for (let { from , to  } of outside)if (to - from > 1000) {
                gaps.push(find(current, (gap)=>gap.from >= line.from && gap.to <= line.to && Math.abs(gap.from - from) < 1000 && Math.abs(gap.to - to) < 1000
                ) || new LineGap(from, to, this.gapSize(line, from, to, structure)));
            }
        }
        return gaps;
    }
    gapSize(line, from, to, structure) {
        let fraction = findFraction(structure, to) - findFraction(structure, from);
        if (this.heightOracle.lineWrapping) {
            return line.height * fraction;
        } else {
            return structure.total * this.heightOracle.charWidth * fraction;
        }
    }
    updateLineGaps(gaps) {
        if (!LineGap.same(gaps, this.lineGaps)) {
            this.lineGaps = gaps;
            this.lineGapDeco = Decoration.set(gaps.map((gap)=>gap.draw(this.heightOracle.lineWrapping)
            ));
        }
    }
    computeVisibleRanges() {
        let deco = this.state.facet(decorations);
        if (this.lineGaps.length) deco = deco.concat(this.lineGapDeco);
        let ranges = [];
        RangeSet.spans(deco, this.viewport.from, this.viewport.to, {
            span (from, to) {
                ranges.push({
                    from,
                    to
                });
            },
            point () {
            }
        }, 20);
        let changed = ranges.length != this.visibleRanges.length || this.visibleRanges.some((r, i)=>r.from != ranges[i].from || r.to != ranges[i].to
        );
        this.visibleRanges = ranges;
        return changed ? 4 : 0;
    }
    lineBlockAt(pos) {
        return pos >= this.viewport.from && pos <= this.viewport.to && this.viewportLines.find((b)=>b.from <= pos && b.to >= pos
        ) || scaleBlock(this.heightMap.lineAt(pos, QueryType$1.ByPos, this.state.doc, 0, 0), this.scaler);
    }
    lineBlockAtHeight(height) {
        return scaleBlock(this.heightMap.lineAt(this.scaler.fromDOM(height), QueryType$1.ByHeight, this.state.doc, 0, 0), this.scaler);
    }
    elementAtHeight(height) {
        return scaleBlock(this.heightMap.blockAt(this.scaler.fromDOM(height), this.state.doc, 0, 0), this.scaler);
    }
    get docHeight() {
        return this.scaler.toDOM(this.heightMap.height);
    }
    get contentHeight() {
        return this.docHeight + this.paddingTop + this.paddingBottom;
    }
}
class Viewport {
    constructor(from, to){
        this.from = from;
        this.to = to;
    }
}
function lineStructure(from1, to1, state) {
    let ranges = [], pos = from1, total = 0;
    RangeSet.spans(state.facet(decorations), from1, to1, {
        span () {
        },
        point (from, to) {
            if (from > pos) {
                ranges.push({
                    from: pos,
                    to: from
                });
                total += from - pos;
            }
            pos = to;
        }
    }, 20);
    if (pos < to1) {
        ranges.push({
            from: pos,
            to: to1
        });
        total += to1 - pos;
    }
    return {
        total,
        ranges
    };
}
function findPosition({ total , ranges  }, ratio) {
    if (ratio <= 0) return ranges[0].from;
    if (ratio >= 1) return ranges[ranges.length - 1].to;
    let dist = Math.floor(total * ratio);
    for(let i97 = 0;; i97++){
        let { from , to  } = ranges[i97], size = to - from;
        if (dist <= size) return from + dist;
        dist -= size;
    }
}
function findFraction(structure, pos) {
    let counted = 0;
    for (let { from , to  } of structure.ranges){
        if (pos <= to) {
            counted += pos - from;
            break;
        }
        counted += to - from;
    }
    return counted / structure.total;
}
function cutRange(ranges, from, to) {
    for(let i98 = 0; i98 < ranges.length; i98++){
        let r = ranges[i98];
        if (r.from < to && r.to > from) {
            let pieces = [];
            if (r.from < from) pieces.push({
                from: r.from,
                to: from
            });
            if (r.to > to) pieces.push({
                from: to,
                to: r.to
            });
            ranges.splice(i98, 1, ...pieces);
            i98 += pieces.length - 1;
        }
    }
}
function find(array, f) {
    for (let val of array)if (f(val)) return val;
    return undefined;
}
const IdScaler = {
    toDOM (n) {
        return n;
    },
    fromDOM (n) {
        return n;
    },
    scale: 1
};
class BigScaler {
    constructor(doc21, heightMap, viewports){
        let vpHeight = 0, base5 = 0, domBase = 0;
        this.viewports = viewports.map(({ from , to  })=>{
            let top21 = heightMap.lineAt(from, QueryType$1.ByPos, doc21, 0, 0).top;
            let bottom = heightMap.lineAt(to, QueryType$1.ByPos, doc21, 0, 0).bottom;
            vpHeight += bottom - top21;
            return {
                from,
                to,
                top: top21,
                bottom,
                domTop: 0,
                domBottom: 0
            };
        });
        this.scale = (7000000 - vpHeight) / (heightMap.height - vpHeight);
        for (let obj of this.viewports){
            obj.domTop = domBase + (obj.top - base5) * this.scale;
            domBase = obj.domBottom = obj.domTop + (obj.bottom - obj.top);
            base5 = obj.bottom;
        }
    }
    toDOM(n) {
        for(let i99 = 0, base6 = 0, domBase = 0;; i99++){
            let vp = i99 < this.viewports.length ? this.viewports[i99] : null;
            if (!vp || n < vp.top) return domBase + (n - base6) * this.scale;
            if (n <= vp.bottom) return vp.domTop + (n - vp.top);
            base6 = vp.bottom;
            domBase = vp.domBottom;
        }
    }
    fromDOM(n) {
        for(let i100 = 0, base7 = 0, domBase = 0;; i100++){
            let vp = i100 < this.viewports.length ? this.viewports[i100] : null;
            if (!vp || n < vp.domTop) return base7 + (n - domBase) / this.scale;
            if (n <= vp.domBottom) return vp.top + (n - vp.domTop);
            base7 = vp.bottom;
            domBase = vp.domBottom;
        }
    }
}
function scaleBlock(block, scaler) {
    if (scaler.scale == 1) return block;
    let bTop = scaler.toDOM(block.top), bBottom = scaler.toDOM(block.bottom);
    return new BlockInfo(block.from, block.length, bTop, bBottom - bTop, Array.isArray(block.type) ? block.type.map((b)=>scaleBlock(b, scaler)
    ) : block.type);
}
const theme = Facet.define({
    combine: (strs)=>strs.join(" ")
});
const darkTheme = Facet.define({
    combine: (values)=>values.indexOf(true) > -1
});
const baseThemeID = StyleModule.newName(), baseLightID = StyleModule.newName(), baseDarkID = StyleModule.newName();
const lightDarkIDs = {
    "&light": "." + baseLightID,
    "&dark": "." + baseDarkID
};
function buildTheme(main, spec, scopes) {
    return new StyleModule(spec, {
        finish (sel) {
            return /&/.test(sel) ? sel.replace(/&\w*/, (m)=>{
                if (m == "&") return main;
                if (!scopes || !scopes[m]) throw new RangeError(`Unsupported selector: ${m}`);
                return scopes[m];
            }) : main + " " + sel;
        }
    });
}
const baseTheme$8 = buildTheme("." + baseThemeID, {
    "&.cm-editor": {
        position: "relative !important",
        boxSizing: "border-box",
        "&.cm-focused": {
            outline: "1px dotted #212121"
        },
        display: "flex !important",
        flexDirection: "column"
    },
    ".cm-scroller": {
        display: "flex !important",
        alignItems: "flex-start !important",
        fontFamily: "monospace",
        lineHeight: 1.4,
        height: "100%",
        overflowX: "auto",
        position: "relative",
        zIndex: 0
    },
    ".cm-content": {
        margin: 0,
        flexGrow: 2,
        minHeight: "100%",
        display: "block",
        whiteSpace: "pre",
        wordWrap: "normal",
        boxSizing: "border-box",
        padding: "4px 0",
        outline: "none",
        "&[contenteditable=true]": {
            WebkitUserModify: "read-write-plaintext-only"
        }
    },
    ".cm-lineWrapping": {
        whiteSpace_fallback: "pre-wrap",
        whiteSpace: "break-spaces",
        wordBreak: "break-word",
        overflowWrap: "anywhere"
    },
    "&light .cm-content": {
        caretColor: "black"
    },
    "&dark .cm-content": {
        caretColor: "white"
    },
    ".cm-line": {
        display: "block",
        padding: "0 2px 0 4px"
    },
    ".cm-selectionLayer": {
        zIndex: -1,
        contain: "size style"
    },
    ".cm-selectionBackground": {
        position: "absolute"
    },
    "&light .cm-selectionBackground": {
        background: "#d9d9d9"
    },
    "&dark .cm-selectionBackground": {
        background: "#222"
    },
    "&light.cm-focused .cm-selectionBackground": {
        background: "#d7d4f0"
    },
    "&dark.cm-focused .cm-selectionBackground": {
        background: "#233"
    },
    ".cm-cursorLayer": {
        zIndex: 100,
        contain: "size style",
        pointerEvents: "none"
    },
    "&.cm-focused .cm-cursorLayer": {
        animation: "steps(1) cm-blink 1.2s infinite"
    },
    "@keyframes cm-blink": {
        "0%": {
        },
        "50%": {
            visibility: "hidden"
        },
        "100%": {
        }
    },
    "@keyframes cm-blink2": {
        "0%": {
        },
        "50%": {
            visibility: "hidden"
        },
        "100%": {
        }
    },
    ".cm-cursor, .cm-dropCursor": {
        position: "absolute",
        borderLeft: "1.2px solid black",
        marginLeft: "-0.6px",
        pointerEvents: "none"
    },
    ".cm-cursor": {
        display: "none"
    },
    "&dark .cm-cursor": {
        borderLeftColor: "#444"
    },
    "&.cm-focused .cm-cursor": {
        display: "block"
    },
    "&light .cm-activeLine": {
        backgroundColor: "#f3f9ff"
    },
    "&dark .cm-activeLine": {
        backgroundColor: "#223039"
    },
    "&light .cm-specialChar": {
        color: "red"
    },
    "&dark .cm-specialChar": {
        color: "#f78"
    },
    ".cm-tab": {
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "bottom"
    },
    ".cm-placeholder": {
        color: "#888",
        display: "inline-block",
        verticalAlign: "top"
    },
    ".cm-button": {
        verticalAlign: "middle",
        color: "inherit",
        fontSize: "70%",
        padding: ".2em 1em",
        borderRadius: "1px"
    },
    "&light .cm-button": {
        backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
        border: "1px solid #888",
        "&:active": {
            backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
        }
    },
    "&dark .cm-button": {
        backgroundImage: "linear-gradient(#393939, #111)",
        border: "1px solid #888",
        "&:active": {
            backgroundImage: "linear-gradient(#111, #333)"
        }
    },
    ".cm-textfield": {
        verticalAlign: "middle",
        color: "inherit",
        fontSize: "70%",
        border: "1px solid silver",
        padding: ".2em .5em"
    },
    "&light .cm-textfield": {
        backgroundColor: "white"
    },
    "&dark .cm-textfield": {
        border: "1px solid #555",
        backgroundColor: "inherit"
    }
}, lightDarkIDs);
const observeOptions = {
    childList: true,
    characterData: true,
    subtree: true,
    attributes: true,
    characterDataOldValue: true
};
const useCharData = browser.ie && browser.ie_version <= 11;
class DOMObserver {
    constructor(view, onChange, onScrollChanged){
        this.view = view;
        this.onChange = onChange;
        this.onScrollChanged = onScrollChanged;
        this.active = false;
        this.selectionRange = new DOMSelectionState;
        this.selectionChanged = false;
        this.delayedFlush = -1;
        this.resizeTimeout = -1;
        this.queue = [];
        this.delayedAndroidKey = null;
        this.scrollTargets = [];
        this.intersection = null;
        this.resize = null;
        this.intersecting = false;
        this.gapIntersection = null;
        this.gaps = [];
        this.parentCheck = -1;
        this.dom = view.contentDOM;
        this.observer = new MutationObserver((mutations)=>{
            for (let mut of mutations)this.queue.push(mut);
            if ((browser.ie && browser.ie_version <= 11 || browser.ios && view.composing) && mutations.some((m)=>m.type == "childList" && m.removedNodes.length || m.type == "characterData" && m.oldValue.length > m.target.nodeValue.length
            )) this.flushSoon();
            else this.flush();
        });
        if (useCharData) this.onCharData = (event)=>{
            this.queue.push({
                target: event.target,
                type: "characterData",
                oldValue: event.prevValue
            });
            this.flushSoon();
        };
        this.onSelectionChange = this.onSelectionChange.bind(this);
        if (typeof ResizeObserver == "function") {
            this.resize = new ResizeObserver(()=>{
                if (this.view.docView.lastUpdate < Date.now() - 75 && this.resizeTimeout < 0) this.resizeTimeout = setTimeout(()=>{
                    this.resizeTimeout = -1;
                    this.view.requestMeasure();
                }, 50);
            });
            this.resize.observe(view.scrollDOM);
        }
        this.start();
        this.onScroll = this.onScroll.bind(this);
        window.addEventListener("scroll", this.onScroll);
        if (typeof IntersectionObserver == "function") {
            this.intersection = new IntersectionObserver((entries)=>{
                if (this.parentCheck < 0) this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1000);
                if (entries.length > 0 && entries[entries.length - 1].intersectionRatio > 0 != this.intersecting) {
                    this.intersecting = !this.intersecting;
                    if (this.intersecting != this.view.inView) this.onScrollChanged(document.createEvent("Event"));
                }
            }, {
            });
            this.intersection.observe(this.dom);
            this.gapIntersection = new IntersectionObserver((entries)=>{
                if (entries.length > 0 && entries[entries.length - 1].intersectionRatio > 0) this.onScrollChanged(document.createEvent("Event"));
            }, {
            });
        }
        this.listenForScroll();
        this.readSelectionRange();
        this.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
    }
    onScroll(e) {
        if (this.intersecting) this.flush(false);
        this.onScrollChanged(e);
    }
    updateGaps(gaps) {
        if (this.gapIntersection && (gaps.length != this.gaps.length || this.gaps.some((g, i)=>g != gaps[i]
        ))) {
            this.gapIntersection.disconnect();
            for (let gap of gaps)this.gapIntersection.observe(gap);
            this.gaps = gaps;
        }
    }
    onSelectionChange(event) {
        if (!this.readSelectionRange() || this.delayedAndroidKey) return;
        let { view  } = this, sel = this.selectionRange;
        if (view.state.facet(editable) ? view.root.activeElement != this.dom : !hasSelection(view.dom, sel)) return;
        let context = sel.anchorNode && view.docView.nearest(sel.anchorNode);
        if (context && context.ignoreEvent(event)) return;
        if ((browser.ie && browser.ie_version <= 11 || browser.android && browser.chrome) && !view.state.selection.main.empty && sel.focusNode && isEquivalentPosition(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset)) this.flushSoon();
        else this.flush(false);
    }
    readSelectionRange() {
        let { root  } = this.view, domSel = getSelection(root);
        let range = browser.safari && root.nodeType == 11 && deepActiveElement() == this.view.contentDOM && safariSelectionRangeHack(this.view) || domSel;
        if (this.selectionRange.eq(range)) return false;
        this.selectionRange.setRange(range);
        return this.selectionChanged = true;
    }
    setSelectionRange(anchor, head) {
        this.selectionRange.set(anchor.node, anchor.offset, head.node, head.offset);
        this.selectionChanged = false;
    }
    listenForScroll() {
        this.parentCheck = -1;
        let i101 = 0, changed = null;
        for(let dom = this.dom; dom;){
            if (dom.nodeType == 1) {
                if (!changed && i101 < this.scrollTargets.length && this.scrollTargets[i101] == dom) i101++;
                else if (!changed) changed = this.scrollTargets.slice(0, i101);
                if (changed) changed.push(dom);
                dom = dom.assignedSlot || dom.parentNode;
            } else if (dom.nodeType == 11) {
                dom = dom.host;
            } else {
                break;
            }
        }
        if (i101 < this.scrollTargets.length && !changed) changed = this.scrollTargets.slice(0, i101);
        if (changed) {
            for (let dom of this.scrollTargets)dom.removeEventListener("scroll", this.onScroll);
            for (let dom1 of this.scrollTargets = changed)dom1.addEventListener("scroll", this.onScroll);
        }
    }
    ignore(f) {
        if (!this.active) return f();
        try {
            this.stop();
            return f();
        } finally{
            this.start();
            this.clear();
        }
    }
    start() {
        if (this.active) return;
        this.observer.observe(this.dom, observeOptions);
        if (useCharData) this.dom.addEventListener("DOMCharacterDataModified", this.onCharData);
        this.active = true;
    }
    stop() {
        if (!this.active) return;
        this.active = false;
        this.observer.disconnect();
        if (useCharData) this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData);
    }
    clear() {
        this.observer.takeRecords();
        this.queue.length = 0;
        this.selectionChanged = false;
    }
    delayAndroidKey(key2, keyCode) {
        if (!this.delayedAndroidKey) requestAnimationFrame(()=>{
            let key = this.delayedAndroidKey;
            this.delayedAndroidKey = null;
            let startState = this.view.state;
            if (dispatchKey(this.view.contentDOM, key.key, key.keyCode)) this.processRecords();
            else this.flush();
            if (this.view.state == startState) this.view.update([]);
        });
        if (!this.delayedAndroidKey || key2 == "Enter") this.delayedAndroidKey = {
            key: key2,
            keyCode
        };
    }
    flushSoon() {
        if (this.delayedFlush < 0) this.delayedFlush = window.setTimeout(()=>{
            this.delayedFlush = -1;
            this.flush();
        }, 20);
    }
    forceFlush() {
        if (this.delayedFlush >= 0) {
            window.clearTimeout(this.delayedFlush);
            this.delayedFlush = -1;
            this.flush();
        }
    }
    processRecords() {
        let records = this.queue;
        for (let mut of this.observer.takeRecords())records.push(mut);
        if (records.length) this.queue = [];
        let from = -1, to = -1, typeOver = false;
        for (let record of records){
            let range = this.readMutation(record);
            if (!range) continue;
            if (range.typeOver) typeOver = true;
            if (from == -1) {
                ({ from , to  } = range);
            } else {
                from = Math.min(range.from, from);
                to = Math.max(range.to, to);
            }
        }
        return {
            from,
            to,
            typeOver
        };
    }
    flush(readSelection = true) {
        if (this.delayedFlush >= 0 || this.delayedAndroidKey) return;
        if (readSelection) this.readSelectionRange();
        let { from , to , typeOver  } = this.processRecords();
        let newSel = this.selectionChanged && hasSelection(this.dom, this.selectionRange);
        if (from < 0 && !newSel) return;
        this.selectionChanged = false;
        let startState = this.view.state;
        this.onChange(from, to, typeOver);
        if (this.view.state == startState) this.view.update([]);
    }
    readMutation(rec) {
        let cView = this.view.docView.nearest(rec.target);
        if (!cView || cView.ignoreMutation(rec)) return null;
        cView.markDirty(rec.type == "attributes");
        if (rec.type == "attributes") cView.dirty |= 4;
        if (rec.type == "childList") {
            let childBefore = findChild(cView, rec.previousSibling || rec.target.previousSibling, -1);
            let childAfter = findChild(cView, rec.nextSibling || rec.target.nextSibling, 1);
            return {
                from: childBefore ? cView.posAfter(childBefore) : cView.posAtStart,
                to: childAfter ? cView.posBefore(childAfter) : cView.posAtEnd,
                typeOver: false
            };
        } else if (rec.type == "characterData") {
            return {
                from: cView.posAtStart,
                to: cView.posAtEnd,
                typeOver: rec.target.nodeValue == rec.oldValue
            };
        } else {
            return null;
        }
    }
    destroy() {
        var _a, _b, _c;
        this.stop();
        (_a = this.intersection) === null || _a === void 0 ? void 0 : _a.disconnect();
        (_b = this.gapIntersection) === null || _b === void 0 ? void 0 : _b.disconnect();
        (_c = this.resize) === null || _c === void 0 ? void 0 : _c.disconnect();
        for (let dom of this.scrollTargets)dom.removeEventListener("scroll", this.onScroll);
        window.removeEventListener("scroll", this.onScroll);
        this.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
        clearTimeout(this.parentCheck);
        clearTimeout(this.resizeTimeout);
    }
}
function findChild(cView, dom, dir) {
    while(dom){
        let curView = ContentView.get(dom);
        if (curView && curView.parent == cView) return curView;
        let parent = dom.parentNode;
        dom = parent != cView.dom ? parent : dir > 0 ? dom.nextSibling : dom.previousSibling;
    }
    return null;
}
function safariSelectionRangeHack(view) {
    let found = null;
    function read(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        found = event.getTargetRanges()[0];
    }
    view.contentDOM.addEventListener("beforeinput", read, true);
    document.execCommand("indent");
    view.contentDOM.removeEventListener("beforeinput", read, true);
    if (!found) return null;
    let anchorNode = found.startContainer, anchorOffset = found.startOffset;
    let focusNode = found.endContainer, focusOffset = found.endOffset;
    let curAnchor = view.docView.domAtPos(view.state.selection.main.anchor);
    if (isEquivalentPosition(curAnchor.node, curAnchor.offset, focusNode, focusOffset)) [anchorNode, anchorOffset, focusNode, focusOffset] = [
        focusNode,
        focusOffset,
        anchorNode,
        anchorOffset
    ];
    return {
        anchorNode,
        anchorOffset,
        focusNode,
        focusOffset
    };
}
function applyDOMChange(view, start, end, typeOver) {
    let change, newSel;
    let sel = view.state.selection.main;
    if (start > -1) {
        let bounds = view.docView.domBoundsAround(start, end, 0);
        if (!bounds || view.state.readOnly) return;
        let { from , to  } = bounds;
        let selPoints = view.docView.impreciseHead || view.docView.impreciseAnchor ? [] : selectionPoints(view);
        let reader = new DOMReader(selPoints, view);
        reader.readRange(bounds.startDOM, bounds.endDOM);
        newSel = selectionFromPoints(selPoints, from);
        let preferredPos = sel.from, preferredSide = null;
        if (view.inputState.lastKeyCode === 8 && view.inputState.lastKeyTime > Date.now() - 100 || browser.android && reader.text.length < to - from) {
            preferredPos = sel.to;
            preferredSide = "end";
        }
        let diff = findDiff(view.state.sliceDoc(from, to), reader.text, preferredPos - from, preferredSide);
        if (diff) change = {
            from: from + diff.from,
            to: from + diff.toA,
            insert: view.state.toText(reader.text.slice(diff.from, diff.toB))
        };
    } else if (view.hasFocus || !view.state.facet(editable)) {
        let domSel = view.observer.selectionRange;
        let { impreciseHead: iHead , impreciseAnchor: iAnchor  } = view.docView;
        let head = iHead && iHead.node == domSel.focusNode && iHead.offset == domSel.focusOffset || !contains(view.contentDOM, domSel.focusNode) ? view.state.selection.main.head : view.docView.posFromDOM(domSel.focusNode, domSel.focusOffset);
        let anchor = iAnchor && iAnchor.node == domSel.anchorNode && iAnchor.offset == domSel.anchorOffset || !contains(view.contentDOM, domSel.anchorNode) ? view.state.selection.main.anchor : view.docView.posFromDOM(domSel.anchorNode, domSel.anchorOffset);
        if (head != sel.head || anchor != sel.anchor) newSel = EditorSelection.single(anchor, head);
    }
    if (!change && !newSel) return;
    if (!change && typeOver && !sel.empty && newSel && newSel.main.empty) change = {
        from: sel.from,
        to: sel.to,
        insert: view.state.doc.slice(sel.from, sel.to)
    };
    else if (change && change.from >= sel.from && change.to <= sel.to && (change.from != sel.from || change.to != sel.to) && sel.to - sel.from - (change.to - change.from) <= 4) change = {
        from: sel.from,
        to: sel.to,
        insert: view.state.doc.slice(sel.from, change.from).append(change.insert).append(view.state.doc.slice(change.to, sel.to))
    };
    if (change) {
        let startState = view.state;
        if (browser.ios && view.inputState.flushIOSKey(view)) return;
        if (browser.android && (change.from == sel.from && change.to == sel.to && change.insert.length == 1 && change.insert.lines == 2 && dispatchKey(view.contentDOM, "Enter", 13) || change.from == sel.from - 1 && change.to == sel.to && change.insert.length == 0 && dispatchKey(view.contentDOM, "Backspace", 8) || change.from == sel.from && change.to == sel.to + 1 && change.insert.length == 0 && dispatchKey(view.contentDOM, "Delete", 46))) return;
        let text = change.insert.toString();
        if (view.state.facet(inputHandler).some((h)=>h(view, change.from, change.to, text)
        )) return;
        if (view.inputState.composing >= 0) view.inputState.composing++;
        let tr;
        if (change.from >= sel.from && change.to <= sel.to && change.to - change.from >= (sel.to - sel.from) / 3 && (!newSel || newSel.main.empty && newSel.main.from == change.from + change.insert.length) && view.inputState.composing < 0) {
            let before = sel.from < change.from ? startState.sliceDoc(sel.from, change.from) : "";
            let after = sel.to > change.to ? startState.sliceDoc(change.to, sel.to) : "";
            tr = startState.replaceSelection(view.state.toText(before + change.insert.sliceString(0, undefined, view.state.lineBreak) + after));
        } else {
            let changes = startState.changes(change);
            let mainSel = newSel && !startState.selection.main.eq(newSel.main) && newSel.main.to <= changes.newLength ? newSel.main : undefined;
            if (startState.selection.ranges.length > 1 && view.inputState.composing >= 0 && change.to <= sel.to && change.to >= sel.to - 10) {
                let replaced = view.state.sliceDoc(change.from, change.to);
                let compositionRange = compositionSurroundingNode(view) || view.state.doc.lineAt(sel.head);
                let offset = sel.to - change.to, size = sel.to - sel.from;
                tr = startState.changeByRange((range)=>{
                    if (range.from == sel.from && range.to == sel.to) return {
                        changes,
                        range: mainSel || range.map(changes)
                    };
                    let to = range.to - offset, from = to - replaced.length;
                    if (range.to - range.from != size || view.state.sliceDoc(from, to) != replaced || compositionRange && range.to >= compositionRange.from && range.from <= compositionRange.to) return {
                        range
                    };
                    let rangeChanges = startState.changes({
                        from,
                        to,
                        insert: change.insert
                    }), selOff = range.to - sel.to;
                    return {
                        changes: rangeChanges,
                        range: !mainSel ? range.map(rangeChanges) : EditorSelection.range(Math.max(0, mainSel.anchor + selOff), Math.max(0, mainSel.head + selOff))
                    };
                });
            } else {
                tr = {
                    changes,
                    selection: mainSel && startState.selection.replaceRange(mainSel)
                };
            }
        }
        let userEvent = "input.type";
        if (view.composing) {
            userEvent += ".compose";
            if (view.inputState.compositionFirstChange) {
                userEvent += ".start";
                view.inputState.compositionFirstChange = false;
            }
        }
        view.dispatch(tr, {
            scrollIntoView: true,
            userEvent
        });
    } else if (newSel && !newSel.main.eq(sel)) {
        let scrollIntoView2 = false, userEvent = "select";
        if (view.inputState.lastSelectionTime > Date.now() - 50) {
            if (view.inputState.lastSelectionOrigin == "select") scrollIntoView2 = true;
            userEvent = view.inputState.lastSelectionOrigin;
        }
        view.dispatch({
            selection: newSel,
            scrollIntoView: scrollIntoView2,
            userEvent
        });
    }
}
function findDiff(a, b, preferredPos, preferredSide) {
    let minLen = Math.min(a.length, b.length);
    let from = 0;
    while(from < minLen && a.charCodeAt(from) == b.charCodeAt(from))from++;
    if (from == minLen && a.length == b.length) return null;
    let toA = a.length, toB = b.length;
    while(toA > 0 && toB > 0 && a.charCodeAt(toA - 1) == b.charCodeAt(toB - 1)){
        toA--;
        toB--;
    }
    if (preferredSide == "end") {
        let adjust = Math.max(0, from - Math.min(toA, toB));
        preferredPos -= toA + adjust - from;
    }
    if (toA < from && a.length < b.length) {
        let move = preferredPos <= from && preferredPos >= toA ? from - preferredPos : 0;
        from -= move;
        toB = from + (toB - toA);
        toA = from;
    } else if (toB < from) {
        let move = preferredPos <= from && preferredPos >= toB ? from - preferredPos : 0;
        from -= move;
        toA = from + (toA - toB);
        toB = from;
    }
    return {
        from,
        toA,
        toB
    };
}
function selectionPoints(view) {
    let result = [];
    if (view.root.activeElement != view.contentDOM) return result;
    let { anchorNode , anchorOffset , focusNode , focusOffset  } = view.observer.selectionRange;
    if (anchorNode) {
        result.push(new DOMPoint(anchorNode, anchorOffset));
        if (focusNode != anchorNode || focusOffset != anchorOffset) result.push(new DOMPoint(focusNode, focusOffset));
    }
    return result;
}
function selectionFromPoints(points, base8) {
    if (points.length == 0) return null;
    let anchor = points[0].pos, head = points.length == 2 ? points[1].pos : anchor;
    return anchor > -1 && head > -1 ? EditorSelection.single(anchor + base8, head + base8) : null;
}
class EditorView {
    constructor(config7 = {
    }){
        this.plugins = [];
        this.pluginMap = new Map;
        this.editorAttrs = {
        };
        this.contentAttrs = {
        };
        this.bidiCache = [];
        this.destroyed = false;
        this.updateState = 2;
        this.measureScheduled = -1;
        this.measureRequests = [];
        this.contentDOM = document.createElement("div");
        this.scrollDOM = document.createElement("div");
        this.scrollDOM.tabIndex = -1;
        this.scrollDOM.className = "cm-scroller";
        this.scrollDOM.appendChild(this.contentDOM);
        this.announceDOM = document.createElement("div");
        this.announceDOM.style.cssText = "position: absolute; top: -10000px";
        this.announceDOM.setAttribute("aria-live", "polite");
        this.dom = document.createElement("div");
        this.dom.appendChild(this.announceDOM);
        this.dom.appendChild(this.scrollDOM);
        this._dispatch = config7.dispatch || ((tr)=>this.update([
                tr
            ])
        );
        this.dispatch = this.dispatch.bind(this);
        this.root = config7.root || getRoot(config7.parent) || document;
        this.viewState = new ViewState(config7.state || EditorState.create());
        this.plugins = this.state.facet(viewPlugin).map((spec)=>new PluginInstance(spec)
        );
        for (let plugin of this.plugins)plugin.update(this);
        this.observer = new DOMObserver(this, (from, to, typeOver)=>{
            applyDOMChange(this, from, to, typeOver);
        }, (event)=>{
            this.inputState.runScrollHandlers(this, event);
            if (this.observer.intersecting) this.measure();
        });
        this.inputState = new InputState(this);
        this.docView = new DocView(this);
        this.mountStyles();
        this.updateAttrs();
        this.updateState = 0;
        ensureGlobalHandler();
        this.requestMeasure();
        if (config7.parent) config7.parent.appendChild(this.dom);
    }
    get state() {
        return this.viewState.state;
    }
    get viewport() {
        return this.viewState.viewport;
    }
    get visibleRanges() {
        return this.viewState.visibleRanges;
    }
    get inView() {
        return this.viewState.inView;
    }
    get composing() {
        return this.inputState.composing > 0;
    }
    dispatch(...input) {
        this._dispatch(input.length == 1 && input[0] instanceof Transaction ? input[0] : this.state.update(...input));
    }
    update(transactions) {
        if (this.updateState != 0) throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
        let redrawn = false, update;
        let state = this.state;
        for (let tr2 of transactions){
            if (tr2.startState != state) throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
            state = tr2.state;
        }
        if (this.destroyed) {
            this.viewState.state = state;
            return;
        }
        if (state.facet(EditorState.phrases) != this.state.facet(EditorState.phrases)) return this.setState(state);
        update = new ViewUpdate(this, state, transactions);
        let scrollTarget = this.viewState.scrollTarget;
        try {
            this.updateState = 2;
            for (let tr1 of transactions){
                if (scrollTarget) scrollTarget = scrollTarget.map(tr1.changes);
                if (tr1.scrollIntoView) {
                    let { main  } = tr1.state.selection;
                    scrollTarget = new ScrollTarget(main.empty ? main : EditorSelection.cursor(main.head, main.head > main.anchor ? -1 : 1));
                }
                for (let e of tr1.effects){
                    if (e.is(scrollTo)) scrollTarget = new ScrollTarget(e.value);
                    else if (e.is(centerOn)) scrollTarget = new ScrollTarget(e.value, "center");
                    else if (e.is(scrollIntoView$1)) scrollTarget = e.value;
                }
            }
            this.viewState.update(update, scrollTarget);
            this.bidiCache = CachedOrder.update(this.bidiCache, update.changes);
            if (!update.empty) {
                this.updatePlugins(update);
                this.inputState.update(update);
            }
            redrawn = this.docView.update(update);
            if (this.state.facet(styleModule) != this.styleModules) this.mountStyles();
            this.updateAttrs();
            this.showAnnouncements(transactions);
            this.docView.updateSelection(redrawn, transactions.some((tr)=>tr.isUserEvent("select.pointer")
            ));
        } finally{
            this.updateState = 0;
        }
        if (redrawn || scrollTarget || this.viewState.mustEnforceCursorAssoc) this.requestMeasure();
        if (!update.empty) for (let listener of this.state.facet(updateListener))listener(update);
    }
    setState(newState) {
        if (this.updateState != 0) throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
        if (this.destroyed) {
            this.viewState.state = newState;
            return;
        }
        this.updateState = 2;
        let hadFocus = this.hasFocus;
        try {
            for (let plugin of this.plugins)plugin.destroy(this);
            this.viewState = new ViewState(newState);
            this.plugins = newState.facet(viewPlugin).map((spec)=>new PluginInstance(spec)
            );
            this.pluginMap.clear();
            for (let plugin1 of this.plugins)plugin1.update(this);
            this.docView = new DocView(this);
            this.inputState.ensureHandlers(this);
            this.mountStyles();
            this.updateAttrs();
            this.bidiCache = [];
        } finally{
            this.updateState = 0;
        }
        if (hadFocus) this.focus();
        this.requestMeasure();
    }
    updatePlugins(update) {
        let prevSpecs = update.startState.facet(viewPlugin), specs = update.state.facet(viewPlugin);
        if (prevSpecs != specs) {
            let newPlugins = [];
            for (let spec of specs){
                let found = prevSpecs.indexOf(spec);
                if (found < 0) {
                    newPlugins.push(new PluginInstance(spec));
                } else {
                    let plugin = this.plugins[found];
                    plugin.mustUpdate = update;
                    newPlugins.push(plugin);
                }
            }
            for (let plugin of this.plugins)if (plugin.mustUpdate != update) plugin.destroy(this);
            this.plugins = newPlugins;
            this.pluginMap.clear();
            this.inputState.ensureHandlers(this);
        } else {
            for (let p7 of this.plugins)p7.mustUpdate = update;
        }
        for(let i102 = 0; i102 < this.plugins.length; i102++)this.plugins[i102].update(this);
    }
    measure(flush = true) {
        if (this.destroyed) return;
        if (this.measureScheduled > -1) cancelAnimationFrame(this.measureScheduled);
        this.measureScheduled = 0;
        if (flush) this.observer.flush();
        let updated = null;
        try {
            for(let i103 = 0;; i103++){
                this.updateState = 1;
                let oldViewport = this.viewport;
                let changed = this.viewState.measure(this);
                if (!changed && !this.measureRequests.length && this.viewState.scrollTarget == null) break;
                if (i103 > 5) {
                    console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
                    break;
                }
                let measuring = [];
                if (!(changed & 4)) [this.measureRequests, measuring] = [
                    measuring,
                    this.measureRequests
                ];
                let measured = measuring.map((m)=>{
                    try {
                        return m.read(this);
                    } catch (e) {
                        logException(this.state, e);
                        return BadMeasure;
                    }
                });
                let update = new ViewUpdate(this, this.state), redrawn = false, scrolled = false;
                update.flags |= changed;
                if (!updated) updated = update;
                else updated.flags |= changed;
                this.updateState = 2;
                if (!update.empty) {
                    this.updatePlugins(update);
                    this.inputState.update(update);
                    this.updateAttrs();
                    redrawn = this.docView.update(update);
                }
                for(let i104 = 0; i104 < measuring.length; i104++)if (measured[i104] != BadMeasure) {
                    try {
                        let m = measuring[i104];
                        if (m.write) m.write(measured[i104], this);
                    } catch (e) {
                        logException(this.state, e);
                    }
                }
                if (this.viewState.scrollTarget) {
                    this.docView.scrollIntoView(this.viewState.scrollTarget);
                    this.viewState.scrollTarget = null;
                    scrolled = true;
                }
                if (redrawn) this.docView.updateSelection(true);
                if (this.viewport.from == oldViewport.from && this.viewport.to == oldViewport.to && !scrolled && this.measureRequests.length == 0) break;
            }
        } finally{
            this.updateState = 0;
            this.measureScheduled = -1;
        }
        if (updated && !updated.empty) for (let listener of this.state.facet(updateListener))listener(updated);
    }
    get themeClasses() {
        return baseThemeID + " " + (this.state.facet(darkTheme) ? baseDarkID : baseLightID) + " " + this.state.facet(theme);
    }
    updateAttrs() {
        let editorAttrs = attrsFromFacet(this, editorAttributes, {
            class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
        });
        let contentAttrs = {
            spellcheck: "false",
            autocorrect: "off",
            autocapitalize: "off",
            translate: "no",
            contenteditable: !this.state.facet(editable) ? "false" : "true",
            class: "cm-content",
            style: `${browser.tabSize}: ${this.state.tabSize}`,
            role: "textbox",
            "aria-multiline": "true"
        };
        if (this.state.readOnly) contentAttrs["aria-readonly"] = "true";
        attrsFromFacet(this, contentAttributes, contentAttrs);
        this.observer.ignore(()=>{
            updateAttrs(this.contentDOM, this.contentAttrs, contentAttrs);
            updateAttrs(this.dom, this.editorAttrs, editorAttrs);
        });
        this.editorAttrs = editorAttrs;
        this.contentAttrs = contentAttrs;
    }
    showAnnouncements(trs) {
        let first = true;
        for (let tr of trs)for (let effect of tr.effects)if (effect.is(EditorView.announce)) {
            if (first) this.announceDOM.textContent = "";
            first = false;
            let div = this.announceDOM.appendChild(document.createElement("div"));
            div.textContent = effect.value;
        }
    }
    mountStyles() {
        this.styleModules = this.state.facet(styleModule);
        StyleModule.mount(this.root, this.styleModules.concat(baseTheme$8).reverse());
    }
    readMeasured() {
        if (this.updateState == 2) throw new Error("Reading the editor layout isn't allowed during an update");
        if (this.updateState == 0 && this.measureScheduled > -1) this.measure(false);
    }
    requestMeasure(request) {
        if (this.measureScheduled < 0) this.measureScheduled = requestAnimationFrame(()=>this.measure()
        );
        if (request) {
            if (request.key != null) for(let i105 = 0; i105 < this.measureRequests.length; i105++){
                if (this.measureRequests[i105].key === request.key) {
                    this.measureRequests[i105] = request;
                    return;
                }
            }
            this.measureRequests.push(request);
        }
    }
    pluginField(field) {
        let result = [];
        for (let plugin of this.plugins)plugin.update(this).takeField(field, result);
        return result;
    }
    plugin(plugin) {
        let known = this.pluginMap.get(plugin);
        if (known === undefined || known && known.spec != plugin) this.pluginMap.set(plugin, known = this.plugins.find((p8)=>p8.spec == plugin
        ) || null);
        return known && known.update(this).value;
    }
    get documentTop() {
        return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
    }
    get documentPadding() {
        return {
            top: this.viewState.paddingTop,
            bottom: this.viewState.paddingBottom
        };
    }
    blockAtHeight(height, docTop) {
        let top22 = ensureTop(docTop, this);
        return this.elementAtHeight(height - top22).moveY(top22);
    }
    elementAtHeight(height) {
        this.readMeasured();
        return this.viewState.elementAtHeight(height);
    }
    visualLineAtHeight(height, docTop) {
        let top23 = ensureTop(docTop, this);
        return this.lineBlockAtHeight(height - top23).moveY(top23);
    }
    lineBlockAtHeight(height) {
        this.readMeasured();
        return this.viewState.lineBlockAtHeight(height);
    }
    viewportLines(f, docTop) {
        let top24 = ensureTop(docTop, this);
        for (let line of this.viewportLineBlocks)f(line.moveY(top24));
    }
    get viewportLineBlocks() {
        return this.viewState.viewportLines;
    }
    visualLineAt(pos, docTop = 0) {
        return this.lineBlockAt(pos).moveY(docTop + this.viewState.paddingTop);
    }
    lineBlockAt(pos) {
        return this.viewState.lineBlockAt(pos);
    }
    get contentHeight() {
        return this.viewState.contentHeight;
    }
    moveByChar(start, forward, by) {
        return skipAtoms(this, start, moveByChar(this, start, forward, by));
    }
    moveByGroup(start, forward) {
        return skipAtoms(this, start, moveByChar(this, start, forward, (initial)=>byGroup(this, start.head, initial)
        ));
    }
    moveToLineBoundary(start, forward, includeWrap = true) {
        return moveToLineBoundary(this, start, forward, includeWrap);
    }
    moveVertically(start, forward, distance) {
        return skipAtoms(this, start, moveVertically(this, start, forward, distance));
    }
    scrollPosIntoView(pos) {
        this.dispatch({
            effects: scrollTo.of(EditorSelection.cursor(pos))
        });
    }
    domAtPos(pos) {
        return this.docView.domAtPos(pos);
    }
    posAtDOM(node, offset = 0) {
        return this.docView.posFromDOM(node, offset);
    }
    posAtCoords(coords, precise = true) {
        this.readMeasured();
        return posAtCoords(this, coords, precise);
    }
    coordsAtPos(pos, side = 1) {
        this.readMeasured();
        let rect = this.docView.coordsAt(pos, side);
        if (!rect || rect.left == rect.right) return rect;
        let line = this.state.doc.lineAt(pos), order = this.bidiSpans(line);
        let span = order[BidiSpan.find(order, pos - line.from, -1, side)];
        return flattenRect(rect, span.dir == Direction.LTR == side > 0);
    }
    get defaultCharacterWidth() {
        return this.viewState.heightOracle.charWidth;
    }
    get defaultLineHeight() {
        return this.viewState.heightOracle.lineHeight;
    }
    get textDirection() {
        return this.viewState.heightOracle.direction;
    }
    get lineWrapping() {
        return this.viewState.heightOracle.lineWrapping;
    }
    bidiSpans(line) {
        if (line.length > MaxBidiLine) return trivialOrder(line.length);
        let dir = this.textDirection;
        for (let entry of this.bidiCache)if (entry.from == line.from && entry.dir == dir) return entry.order;
        let order = computeOrder(line.text, this.textDirection);
        this.bidiCache.push(new CachedOrder(line.from, line.to, dir, order));
        return order;
    }
    get hasFocus() {
        var _a;
        return (document.hasFocus() || browser.safari && ((_a = this.inputState) === null || _a === void 0 ? void 0 : _a.lastContextMenu) > Date.now() - 30000) && this.root.activeElement == this.contentDOM;
    }
    focus() {
        this.observer.ignore(()=>{
            focusPreventScroll(this.contentDOM);
            this.docView.updateSelection();
        });
    }
    destroy() {
        for (let plugin of this.plugins)plugin.destroy(this);
        this.plugins = [];
        this.inputState.destroy();
        this.dom.remove();
        this.observer.destroy();
        if (this.measureScheduled > -1) cancelAnimationFrame(this.measureScheduled);
        this.destroyed = true;
    }
    static scrollIntoView(pos, options = {
    }) {
        return scrollIntoView$1.of(new ScrollTarget(typeof pos == "number" ? EditorSelection.cursor(pos) : pos, options.y, options.x, options.yMargin, options.xMargin));
    }
    static domEventHandlers(handlers2) {
        return ViewPlugin.define(()=>({
            })
        , {
            eventHandlers: handlers2
        });
    }
    static theme(spec, options) {
        let prefix = StyleModule.newName();
        let result = [
            theme.of(prefix),
            styleModule.of(buildTheme(`.${prefix}`, spec))
        ];
        if (options && options.dark) result.push(darkTheme.of(true));
        return result;
    }
    static baseTheme(spec) {
        return Prec.lowest(styleModule.of(buildTheme("." + baseThemeID, spec, lightDarkIDs)));
    }
}
EditorView.scrollTo = scrollTo;
EditorView.centerOn = centerOn;
EditorView.styleModule = styleModule;
EditorView.inputHandler = inputHandler;
EditorView.exceptionSink = exceptionSink;
EditorView.updateListener = updateListener;
EditorView.editable = editable;
EditorView.mouseSelectionStyle = mouseSelectionStyle;
EditorView.dragMovesSelection = dragMovesSelection$1;
EditorView.clickAddsSelectionRange = clickAddsSelectionRange;
EditorView.decorations = decorations;
EditorView.darkTheme = darkTheme;
EditorView.contentAttributes = contentAttributes;
EditorView.editorAttributes = editorAttributes;
EditorView.lineWrapping = EditorView.contentAttributes.of({
    "class": "cm-lineWrapping"
});
EditorView.announce = StateEffect.define();
const MaxBidiLine = 4096;
function ensureTop(given, view) {
    return (given == null ? view.contentDOM.getBoundingClientRect().top : given) + view.viewState.paddingTop;
}
let resizeDebounce = -1;
function ensureGlobalHandler() {
    window.addEventListener("resize", ()=>{
        if (resizeDebounce == -1) resizeDebounce = setTimeout(handleResize, 50);
    });
}
function handleResize() {
    resizeDebounce = -1;
    let found = document.querySelectorAll(".cm-content");
    for(let i106 = 0; i106 < found.length; i106++){
        let docView = ContentView.get(found[i106]);
        if (docView) docView.editorView.requestMeasure();
    }
}
const BadMeasure = {
};
class CachedOrder {
    constructor(from, to, dir, order){
        this.from = from;
        this.to = to;
        this.dir = dir;
        this.order = order;
    }
    static update(cache, changes) {
        if (changes.empty) return cache;
        let result = [], lastDir = cache.length ? cache[cache.length - 1].dir : Direction.LTR;
        for(let i107 = Math.max(0, cache.length - 10); i107 < cache.length; i107++){
            let entry = cache[i107];
            if (entry.dir == lastDir && !changes.touchesRange(entry.from, entry.to)) result.push(new CachedOrder(changes.mapPos(entry.from, 1), changes.mapPos(entry.to, -1), entry.dir, entry.order));
        }
        return result;
    }
}
function attrsFromFacet(view, facet, base9) {
    for(let sources = view.state.facet(facet), i108 = sources.length - 1; i108 >= 0; i108--){
        let source = sources[i108], value = typeof source == "function" ? source(view) : source;
        if (value) combineAttrs(value, base9);
    }
    return base9;
}
const currentPlatform = browser.mac ? "mac" : browser.windows ? "win" : browser.linux ? "linux" : "key";
function normalizeKeyName(name9, platform) {
    const parts = name9.split(/-(?!$)/);
    let result = parts[parts.length - 1];
    if (result == "Space") result = " ";
    let alt, ctrl, shift1, meta1;
    for(let i109 = 0; i109 < parts.length - 1; ++i109){
        const mod = parts[i109];
        if (/^(cmd|meta|m)$/i.test(mod)) meta1 = true;
        else if (/^a(lt)?$/i.test(mod)) alt = true;
        else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true;
        else if (/^s(hift)?$/i.test(mod)) shift1 = true;
        else if (/^mod$/i.test(mod)) {
            if (platform == "mac") meta1 = true;
            else ctrl = true;
        } else throw new Error("Unrecognized modifier name: " + mod);
    }
    if (alt) result = "Alt-" + result;
    if (ctrl) result = "Ctrl-" + result;
    if (meta1) result = "Meta-" + result;
    if (shift1) result = "Shift-" + result;
    return result;
}
function modifiers(name10, event, shift2) {
    if (event.altKey) name10 = "Alt-" + name10;
    if (event.ctrlKey) name10 = "Ctrl-" + name10;
    if (event.metaKey) name10 = "Meta-" + name10;
    if (shift2 !== false && event.shiftKey) name10 = "Shift-" + name10;
    return name10;
}
const handleKeyEvents = EditorView.domEventHandlers({
    keydown (event, view) {
        return runHandlers(getKeymap(view.state), event, view, "editor");
    }
});
const keymap = Facet.define({
    enables: handleKeyEvents
});
const Keymaps = new WeakMap();
function getKeymap(state) {
    let bindings = state.facet(keymap);
    let map = Keymaps.get(bindings);
    if (!map) Keymaps.set(bindings, map = buildKeymap(bindings.reduce((a, b)=>a.concat(b)
    , [])));
    return map;
}
function runScopeHandlers(view, event, scope) {
    return runHandlers(getKeymap(view.state), event, view, scope);
}
let storedPrefix = null;
const PrefixTimeout = 4000;
function buildKeymap(bindings, platform = currentPlatform) {
    let bound = Object.create(null);
    let isPrefix = Object.create(null);
    let checkPrefix = (name11, is)=>{
        let current = isPrefix[name11];
        if (current == null) isPrefix[name11] = is;
        else if (current != is) throw new Error("Key binding " + name11 + " is used both as a regular binding and as a multi-stroke prefix");
    };
    let add3 = (scope, key, command1, preventDefault)=>{
        let scopeObj = bound[scope] || (bound[scope] = Object.create(null));
        let parts = key.split(/ (?!$)/).map((k)=>normalizeKeyName(k, platform)
        );
        for(let i110 = 1; i110 < parts.length; i110++){
            let prefix = parts.slice(0, i110).join(" ");
            checkPrefix(prefix, true);
            if (!scopeObj[prefix]) scopeObj[prefix] = {
                preventDefault: true,
                commands: [
                    (view)=>{
                        let ourObj = storedPrefix = {
                            view,
                            prefix,
                            scope
                        };
                        setTimeout(()=>{
                            if (storedPrefix == ourObj) storedPrefix = null;
                        }, PrefixTimeout);
                        return true;
                    }
                ]
            };
        }
        let full = parts.join(" ");
        checkPrefix(full, false);
        let binding = scopeObj[full] || (scopeObj[full] = {
            preventDefault: false,
            commands: []
        });
        binding.commands.push(command1);
        if (preventDefault) binding.preventDefault = true;
    };
    for (let b of bindings){
        let name12 = b[platform] || b.key;
        if (!name12) continue;
        for (let scope of b.scope ? b.scope.split(" ") : [
            "editor"
        ]){
            add3(scope, name12, b.run, b.preventDefault);
            if (b.shift) add3(scope, "Shift-" + name12, b.shift, b.preventDefault);
        }
    }
    return bound;
}
function runHandlers(map, event, view, scope) {
    let name13 = keyName(event), isChar = name13.length == 1 && name13 != " ";
    let prefix = "", fallthrough = false;
    if (storedPrefix && storedPrefix.view == view && storedPrefix.scope == scope) {
        prefix = storedPrefix.prefix + " ";
        if (fallthrough = modifierCodes.indexOf(event.keyCode) < 0) storedPrefix = null;
    }
    let runFor = (binding)=>{
        if (binding) {
            for (let cmd1 of binding.commands)if (cmd1(view)) return true;
            if (binding.preventDefault) fallthrough = true;
        }
        return false;
    };
    let scopeObj = map[scope], baseName;
    if (scopeObj) {
        if (runFor(scopeObj[prefix + modifiers(name13, event, !isChar)])) return true;
        if (isChar && (event.shiftKey || event.altKey || event.metaKey) && (baseName = base[event.keyCode]) && baseName != name13) {
            if (runFor(scopeObj[prefix + modifiers(baseName, event, true)])) return true;
        } else if (isChar && event.shiftKey) {
            if (runFor(scopeObj[prefix + modifiers(name13, event, true)])) return true;
        }
    }
    return fallthrough;
}
const CanHidePrimary = !browser.ios;
const selectionConfig = Facet.define({
    combine (configs) {
        return combineConfig(configs, {
            cursorBlinkRate: 1200,
            drawRangeCursor: true
        }, {
            cursorBlinkRate: (a, b)=>Math.min(a, b)
            ,
            drawRangeCursor: (a, b)=>a || b
        });
    }
});
function drawSelection(config8 = {
}) {
    return [
        selectionConfig.of(config8),
        drawSelectionPlugin,
        hideNativeSelection
    ];
}
class Piece {
    constructor(left, top25, width, height, className){
        this.left = left;
        this.top = top25;
        this.width = width;
        this.height = height;
        this.className = className;
    }
    draw() {
        let elt = document.createElement("div");
        elt.className = this.className;
        this.adjust(elt);
        return elt;
    }
    adjust(elt) {
        elt.style.left = this.left + "px";
        elt.style.top = this.top + "px";
        if (this.width >= 0) elt.style.width = this.width + "px";
        elt.style.height = this.height + "px";
    }
    eq(p9) {
        return this.left == p9.left && this.top == p9.top && this.width == p9.width && this.height == p9.height && this.className == p9.className;
    }
}
const drawSelectionPlugin = ViewPlugin.fromClass(class {
    constructor(view){
        this.view = view;
        this.rangePieces = [];
        this.cursors = [];
        this.measureReq = {
            read: this.readPos.bind(this),
            write: this.drawSel.bind(this)
        };
        this.selectionLayer = view.scrollDOM.appendChild(document.createElement("div"));
        this.selectionLayer.className = "cm-selectionLayer";
        this.selectionLayer.setAttribute("aria-hidden", "true");
        this.cursorLayer = view.scrollDOM.appendChild(document.createElement("div"));
        this.cursorLayer.className = "cm-cursorLayer";
        this.cursorLayer.setAttribute("aria-hidden", "true");
        view.requestMeasure(this.measureReq);
        this.setBlinkRate();
    }
    setBlinkRate() {
        this.cursorLayer.style.animationDuration = this.view.state.facet(selectionConfig).cursorBlinkRate + "ms";
    }
    update(update) {
        let confChanged = update.startState.facet(selectionConfig) != update.state.facet(selectionConfig);
        if (confChanged || update.selectionSet || update.geometryChanged || update.viewportChanged) this.view.requestMeasure(this.measureReq);
        if (update.transactions.some((tr)=>tr.scrollIntoView
        )) this.cursorLayer.style.animationName = this.cursorLayer.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink";
        if (confChanged) this.setBlinkRate();
    }
    readPos() {
        let { state  } = this.view, conf = state.facet(selectionConfig);
        let rangePieces = state.selection.ranges.map((r)=>r.empty ? [] : measureRange(this.view, r)
        ).reduce((a, b)=>a.concat(b)
        );
        let cursors = [];
        for (let r1 of state.selection.ranges){
            let prim = r1 == state.selection.main;
            if (r1.empty ? !prim || CanHidePrimary : conf.drawRangeCursor) {
                let piece = measureCursor(this.view, r1, prim);
                if (piece) cursors.push(piece);
            }
        }
        return {
            rangePieces,
            cursors
        };
    }
    drawSel({ rangePieces , cursors  }) {
        if (rangePieces.length != this.rangePieces.length || rangePieces.some((p10, i)=>!p10.eq(this.rangePieces[i])
        )) {
            this.selectionLayer.textContent = "";
            for (let p11 of rangePieces)this.selectionLayer.appendChild(p11.draw());
            this.rangePieces = rangePieces;
        }
        if (cursors.length != this.cursors.length || cursors.some((c, i)=>!c.eq(this.cursors[i])
        )) {
            let oldCursors = this.cursorLayer.children;
            if (oldCursors.length !== cursors.length) {
                this.cursorLayer.textContent = "";
                for (const c of cursors)this.cursorLayer.appendChild(c.draw());
            } else {
                cursors.forEach((c, idx)=>c.adjust(oldCursors[idx])
                );
            }
            this.cursors = cursors;
        }
    }
    destroy() {
        this.selectionLayer.remove();
        this.cursorLayer.remove();
    }
});
const themeSpec = {
    ".cm-line": {
        "& ::selection": {
            backgroundColor: "transparent !important"
        },
        "&::selection": {
            backgroundColor: "transparent !important"
        }
    }
};
if (CanHidePrimary) themeSpec[".cm-line"].caretColor = "transparent !important";
const hideNativeSelection = Prec.highest(EditorView.theme(themeSpec));
function getBase(view) {
    let rect = view.scrollDOM.getBoundingClientRect();
    let left = view.textDirection == Direction.LTR ? rect.left : rect.right - view.scrollDOM.clientWidth;
    return {
        left: left - view.scrollDOM.scrollLeft,
        top: rect.top - view.scrollDOM.scrollTop
    };
}
function wrappedLine(view, pos, inside2) {
    let range = EditorSelection.cursor(pos);
    return {
        from: Math.max(inside2.from, view.moveToLineBoundary(range, false, true).from),
        to: Math.min(inside2.to, view.moveToLineBoundary(range, true, true).from),
        type: BlockType.Text
    };
}
function blockAt(view, pos) {
    let line = view.lineBlockAt(pos);
    if (Array.isArray(line.type)) for (let l of line.type){
        if (l.to > pos || l.to == pos && (l.to == line.to || l.type == BlockType.Text)) return l;
    }
    return line;
}
function measureRange(view, range) {
    if (range.to <= view.viewport.from || range.from >= view.viewport.to) return [];
    let from2 = Math.max(range.from, view.viewport.from), to2 = Math.min(range.to, view.viewport.to);
    let ltr = view.textDirection == Direction.LTR;
    let content8 = view.contentDOM, contentRect = content8.getBoundingClientRect(), base10 = getBase(view);
    let lineStyle = window.getComputedStyle(content8.firstChild);
    let leftSide = contentRect.left + parseInt(lineStyle.paddingLeft) + Math.min(0, parseInt(lineStyle.textIndent));
    let rightSide = contentRect.right - parseInt(lineStyle.paddingRight);
    let startBlock = blockAt(view, from2), endBlock = blockAt(view, to2);
    let visualStart = startBlock.type == BlockType.Text ? startBlock : null;
    let visualEnd = endBlock.type == BlockType.Text ? endBlock : null;
    if (view.lineWrapping) {
        if (visualStart) visualStart = wrappedLine(view, from2, visualStart);
        if (visualEnd) visualEnd = wrappedLine(view, to2, visualEnd);
    }
    if (visualStart && visualEnd && visualStart.from == visualEnd.from) {
        return pieces1(drawForLine(range.from, range.to, visualStart));
    } else {
        let top26 = visualStart ? drawForLine(range.from, null, visualStart) : drawForWidget(startBlock, false);
        let bottom = visualEnd ? drawForLine(null, range.to, visualEnd) : drawForWidget(endBlock, true);
        let between = [];
        if ((visualStart || startBlock).to < (visualEnd || endBlock).from - 1) between.push(piece(leftSide, top26.bottom, rightSide, bottom.top));
        else if (top26.bottom < bottom.top && view.elementAtHeight((top26.bottom + bottom.top) / 2).type == BlockType.Text) top26.bottom = bottom.top = (top26.bottom + bottom.top) / 2;
        return pieces1(top26).concat(between).concat(pieces1(bottom));
    }
    function piece(left, top27, right, bottom) {
        return new Piece(left - base10.left, top27 - base10.top - 0.01, right - left, bottom - top27 + 0.01, "cm-selectionBackground");
    }
    function pieces1({ top: top28 , bottom , horizontal  }) {
        let pieces = [];
        for(let i111 = 0; i111 < horizontal.length; i111 += 2)pieces.push(piece(horizontal[i111], top28, horizontal[i111 + 1], bottom));
        return pieces;
    }
    function drawForLine(from3, to3, line) {
        let top29 = 1000000000, bottom = -1000000000, horizontal = [];
        function addSpan(from, fromOpen, to, toOpen, dir) {
            let fromCoords = view.coordsAtPos(from, from == line.to ? -2 : 2);
            let toCoords = view.coordsAtPos(to, to == line.from ? 2 : -2);
            top29 = Math.min(fromCoords.top, toCoords.top, top29);
            bottom = Math.max(fromCoords.bottom, toCoords.bottom, bottom);
            if (dir == Direction.LTR) horizontal.push(ltr && fromOpen ? leftSide : fromCoords.left, ltr && toOpen ? rightSide : toCoords.right);
            else horizontal.push(!ltr && toOpen ? leftSide : toCoords.left, !ltr && fromOpen ? rightSide : fromCoords.right);
        }
        let start = from3 !== null && from3 !== void 0 ? from3 : line.from, end = to3 !== null && to3 !== void 0 ? to3 : line.to;
        for (let r of view.visibleRanges)if (r.to > start && r.from < end) {
            for(let pos = Math.max(r.from, start), endPos = Math.min(r.to, end);;){
                let docLine = view.state.doc.lineAt(pos);
                for (let span of view.bidiSpans(docLine)){
                    let spanFrom = span.from + docLine.from, spanTo = span.to + docLine.from;
                    if (spanFrom >= endPos) break;
                    if (spanTo > pos) addSpan(Math.max(spanFrom, pos), from3 == null && spanFrom <= start, Math.min(spanTo, endPos), to3 == null && spanTo >= end, span.dir);
                }
                pos = docLine.to + 1;
                if (pos >= endPos) break;
            }
        }
        if (horizontal.length == 0) addSpan(start, from3 == null, end, to3 == null, view.textDirection);
        return {
            top: top29,
            bottom,
            horizontal
        };
    }
    function drawForWidget(block, top30) {
        let y = contentRect.top + (top30 ? block.top : block.bottom);
        return {
            top: y,
            bottom: y,
            horizontal: []
        };
    }
}
function measureCursor(view, cursor4, primary) {
    let pos = view.coordsAtPos(cursor4.head, cursor4.assoc || 1);
    if (!pos) return null;
    let base11 = getBase(view);
    return new Piece(pos.left - base11.left, pos.top - base11.top, -1, pos.bottom - pos.top, primary ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary");
}
const setDropCursorPos = StateEffect.define({
    map (pos, mapping) {
        return pos == null ? null : mapping.mapPos(pos);
    }
});
const dropCursorPos = StateField.define({
    create () {
        return null;
    },
    update (pos1, tr) {
        if (pos1 != null) pos1 = tr.changes.mapPos(pos1);
        return tr.effects.reduce((pos, e)=>e.is(setDropCursorPos) ? e.value : pos
        , pos1);
    }
});
const drawDropCursor = ViewPlugin.fromClass(class {
    constructor(view){
        this.view = view;
        this.cursor = null;
        this.measureReq = {
            read: this.readPos.bind(this),
            write: this.drawCursor.bind(this)
        };
    }
    update(update) {
        var _a;
        let cursorPos = update.state.field(dropCursorPos);
        if (cursorPos == null) {
            if (this.cursor != null) {
                (_a = this.cursor) === null || _a === void 0 ? void 0 : _a.remove();
                this.cursor = null;
            }
        } else {
            if (!this.cursor) {
                this.cursor = this.view.scrollDOM.appendChild(document.createElement("div"));
                this.cursor.className = "cm-dropCursor";
            }
            if (update.startState.field(dropCursorPos) != cursorPos || update.docChanged || update.geometryChanged) this.view.requestMeasure(this.measureReq);
        }
    }
    readPos() {
        let pos = this.view.state.field(dropCursorPos);
        let rect = pos != null && this.view.coordsAtPos(pos);
        if (!rect) return null;
        let outer = this.view.scrollDOM.getBoundingClientRect();
        return {
            left: rect.left - outer.left + this.view.scrollDOM.scrollLeft,
            top: rect.top - outer.top + this.view.scrollDOM.scrollTop,
            height: rect.bottom - rect.top
        };
    }
    drawCursor(pos) {
        if (this.cursor) {
            if (pos) {
                this.cursor.style.left = pos.left + "px";
                this.cursor.style.top = pos.top + "px";
                this.cursor.style.height = pos.height + "px";
            } else {
                this.cursor.style.left = "-100000px";
            }
        }
    }
    destroy() {
        if (this.cursor) this.cursor.remove();
    }
    setDropPos(pos) {
        if (this.view.state.field(dropCursorPos) != pos) this.view.dispatch({
            effects: setDropCursorPos.of(pos)
        });
    }
}, {
    eventHandlers: {
        dragover (event) {
            this.setDropPos(this.view.posAtCoords({
                x: event.clientX,
                y: event.clientY
            }));
        },
        dragleave (event) {
            if (event.target == this.view.contentDOM || !this.view.contentDOM.contains(event.relatedTarget)) this.setDropPos(null);
        },
        dragend () {
            this.setDropPos(null);
        },
        drop () {
            this.setDropPos(null);
        }
    }
});
function dropCursor() {
    return [
        dropCursorPos,
        drawDropCursor
    ];
}
function iterMatches(doc22, re, from, to, f) {
    re.lastIndex = 0;
    for(let cursor5 = doc22.iterRange(from, to), pos = from, m; !cursor5.next().done; pos += cursor5.value.length){
        if (!cursor5.lineBreak) while(m = re.exec(cursor5.value))f(pos + m.index, pos + m.index + m[0].length, m);
    }
}
function matchRanges(view, maxLength) {
    let visible = view.visibleRanges;
    if (visible.length == 1 && visible[0].from == view.viewport.from && visible[0].to == view.viewport.to) return visible;
    let result = [];
    for (let { from , to  } of visible){
        from = Math.max(view.state.doc.lineAt(from).from, from - maxLength);
        to = Math.min(view.state.doc.lineAt(to).to, to + maxLength);
        if (result.length && result[result.length - 1].to >= from) result[result.length - 1].to = to;
        else result.push({
            from,
            to
        });
    }
    return result;
}
class MatchDecorator {
    constructor(config9){
        let { regexp , decoration , boundary , maxLength =1000  } = config9;
        if (!regexp.global) throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
        this.regexp = regexp;
        this.getDeco = typeof decoration == "function" ? decoration : ()=>decoration
        ;
        this.boundary = boundary;
        this.maxLength = maxLength;
    }
    createDeco(view) {
        let build = new RangeSetBuilder();
        for (let { from , to  } of matchRanges(view, this.maxLength))iterMatches(view.state.doc, this.regexp, from, to, (a, b, m)=>build.add(a, b, this.getDeco(m, view, a))
        );
        return build.finish();
    }
    updateDeco(update, deco) {
        let changeFrom = 1000000000, changeTo = -1;
        if (update.docChanged) update.changes.iterChanges((_f, _t, from, to)=>{
            if (to > update.view.viewport.from && from < update.view.viewport.to) {
                changeFrom = Math.min(from, changeFrom);
                changeTo = Math.max(to, changeTo);
            }
        });
        if (update.viewportChanged || changeTo - changeFrom > 1000) return this.createDeco(update.view);
        if (changeTo > -1) return this.updateRange(update.view, deco.map(update.changes), changeFrom, changeTo);
        return deco;
    }
    updateRange(view, deco, updateFrom, updateTo) {
        for (let r of view.visibleRanges){
            let from4 = Math.max(r.from, updateFrom), to4 = Math.min(r.to, updateTo);
            if (to4 > from4) {
                let fromLine = view.state.doc.lineAt(from4), toLine = fromLine.to < to4 ? view.state.doc.lineAt(to4) : fromLine;
                let start = Math.max(r.from, fromLine.from), end = Math.min(r.to, toLine.to);
                if (this.boundary) {
                    for(; from4 > fromLine.from; from4--)if (this.boundary.test(fromLine.text[from4 - 1 - fromLine.from])) {
                        start = from4;
                        break;
                    }
                    for(; to4 < toLine.to; to4++)if (this.boundary.test(toLine.text[to4 - toLine.from])) {
                        end = to4;
                        break;
                    }
                }
                let ranges = [], m1;
                if (fromLine == toLine) {
                    this.regexp.lastIndex = start - fromLine.from;
                    while((m1 = this.regexp.exec(fromLine.text)) && m1.index < end - fromLine.from){
                        let pos = m1.index + fromLine.from;
                        ranges.push(this.getDeco(m1, view, pos).range(pos, pos + m1[0].length));
                    }
                } else {
                    iterMatches(view.state.doc, this.regexp, start, end, (from, to, m)=>ranges.push(this.getDeco(m, view, from).range(from, to))
                    );
                }
                deco = deco.update({
                    filterFrom: start,
                    filterTo: end,
                    filter: (from, to)=>from < start || to > end
                    ,
                    add: ranges
                });
            }
        }
        return deco;
    }
}
const UnicodeRegexpSupport = /x/.unicode != null ? "gu" : "g";
const Specials = new RegExp("[\u0000-\u0008\u000a-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\u202d\u202e\ufeff\ufff9-\ufffc]", UnicodeRegexpSupport);
const Names = {
    0: "null",
    7: "bell",
    8: "backspace",
    10: "newline",
    11: "vertical tab",
    13: "carriage return",
    27: "escape",
    8203: "zero width space",
    8204: "zero width non-joiner",
    8205: "zero width joiner",
    8206: "left-to-right mark",
    8207: "right-to-left mark",
    8232: "line separator",
    8237: "left-to-right override",
    8238: "right-to-left override",
    8233: "paragraph separator",
    65279: "zero width no-break space",
    65532: "object replacement"
};
let _supportsTabSize = null;
function supportsTabSize() {
    var _a;
    if (_supportsTabSize == null && typeof document != "undefined" && document.body) {
        let styles = document.body.style;
        _supportsTabSize = ((_a = styles.tabSize) !== null && _a !== void 0 ? _a : styles.MozTabSize) != null;
    }
    return _supportsTabSize || false;
}
const specialCharConfig = Facet.define({
    combine (configs) {
        let config10 = combineConfig(configs, {
            render: null,
            specialChars: Specials,
            addSpecialChars: null
        });
        if (config10.replaceTabs = !supportsTabSize()) config10.specialChars = new RegExp("\t|" + config10.specialChars.source, UnicodeRegexpSupport);
        if (config10.addSpecialChars) config10.specialChars = new RegExp(config10.specialChars.source + "|" + config10.addSpecialChars.source, UnicodeRegexpSupport);
        return config10;
    }
});
function highlightSpecialChars(config11 = {
}) {
    return [
        specialCharConfig.of(config11),
        specialCharPlugin()
    ];
}
let _plugin = null;
function specialCharPlugin() {
    return _plugin || (_plugin = ViewPlugin.fromClass(class {
        constructor(view){
            this.view = view;
            this.decorations = Decoration.none;
            this.decorationCache = Object.create(null);
            this.decorator = this.makeDecorator(view.state.facet(specialCharConfig));
            this.decorations = this.decorator.createDeco(view);
        }
        makeDecorator(conf) {
            return new MatchDecorator({
                regexp: conf.specialChars,
                decoration: (m, view, pos)=>{
                    let { doc: doc23  } = view.state;
                    let code6 = codePointAt(m[0], 0);
                    if (code6 == 9) {
                        let line = doc23.lineAt(pos);
                        let size = view.state.tabSize, col = countColumn(line.text, size, pos - line.from);
                        return Decoration.replace({
                            widget: new TabWidget((size - col % size) * this.view.defaultCharacterWidth)
                        });
                    }
                    return this.decorationCache[code6] || (this.decorationCache[code6] = Decoration.replace({
                        widget: new SpecialCharWidget(conf, code6)
                    }));
                },
                boundary: conf.replaceTabs ? undefined : /[^]/
            });
        }
        update(update) {
            let conf = update.state.facet(specialCharConfig);
            if (update.startState.facet(specialCharConfig) != conf) {
                this.decorator = this.makeDecorator(conf);
                this.decorations = this.decorator.createDeco(update.view);
            } else {
                this.decorations = this.decorator.updateDeco(update, this.decorations);
            }
        }
    }, {
        decorations: (v)=>v.decorations
    }));
}
const DefaultPlaceholder = "\u2022";
function placeholder$1(code7) {
    if (code7 >= 32) return DefaultPlaceholder;
    if (code7 == 10) return "\u2424";
    return String.fromCharCode(9216 + code7);
}
class SpecialCharWidget extends WidgetType {
    constructor(options, code8){
        super();
        this.options = options;
        this.code = code8;
    }
    eq(other) {
        return other.code == this.code;
    }
    toDOM(view) {
        let ph = placeholder$1(this.code);
        let desc = view.state.phrase("Control character") + " " + (Names[this.code] || "0x" + this.code.toString(16));
        let custom = this.options.render && this.options.render(this.code, desc, ph);
        if (custom) return custom;
        let span = document.createElement("span");
        span.textContent = ph;
        span.title = desc;
        span.setAttribute("aria-label", desc);
        span.className = "cm-specialChar";
        return span;
    }
    ignoreEvent() {
        return false;
    }
}
class TabWidget extends WidgetType {
    constructor(width){
        super();
        this.width = width;
    }
    eq(other) {
        return other.width == this.width;
    }
    toDOM() {
        let span = document.createElement("span");
        span.textContent = "\t";
        span.className = "cm-tab";
        span.style.width = this.width + "px";
        return span;
    }
    ignoreEvent() {
        return false;
    }
}
function highlightActiveLine() {
    return activeLineHighlighter;
}
const lineDeco = Decoration.line({
    class: "cm-activeLine"
});
const activeLineHighlighter = ViewPlugin.fromClass(class {
    constructor(view){
        this.decorations = this.getDeco(view);
    }
    update(update) {
        if (update.docChanged || update.selectionSet) this.decorations = this.getDeco(update.view);
    }
    getDeco(view) {
        let lastLineStart = -1, deco = [];
        for (let r of view.state.selection.ranges){
            if (!r.empty) return Decoration.none;
            let line = view.lineBlockAt(r.head);
            if (line.from > lastLineStart) {
                deco.push(lineDeco.range(line.from));
                lastLineStart = line.from;
            }
        }
        return Decoration.set(deco);
    }
}, {
    decorations: (v)=>v.decorations
});
const fromHistory = Annotation.define();
const isolateHistory = Annotation.define();
const invertedEffects = Facet.define();
const historyConfig = Facet.define({
    combine (configs) {
        return combineConfig(configs, {
            minDepth: 100,
            newGroupDelay: 500
        }, {
            minDepth: Math.max,
            newGroupDelay: Math.min
        });
    }
});
function changeEnd(changes) {
    let end = 0;
    changes.iterChangedRanges((_, to)=>end = to
    );
    return end;
}
const historyField_ = StateField.define({
    create () {
        return HistoryState.empty;
    },
    update (state, tr) {
        let config12 = tr.state.facet(historyConfig);
        let fromHist = tr.annotation(fromHistory);
        if (fromHist) {
            let selection7 = tr.docChanged ? EditorSelection.single(changeEnd(tr.changes)) : undefined;
            let item = HistEvent.fromTransaction(tr, selection7), from = fromHist.side;
            let other = from == 0 ? state.undone : state.done;
            if (item) other = updateBranch(other, other.length, config12.minDepth, item);
            else other = addSelection(other, tr.startState.selection);
            return new HistoryState(from == 0 ? fromHist.rest : other, from == 0 ? other : fromHist.rest);
        }
        let isolate = tr.annotation(isolateHistory);
        if (isolate == "full" || isolate == "before") state = state.isolate();
        if (tr.annotation(Transaction.addToHistory) === false) return !tr.changes.empty ? state.addMapping(tr.changes.desc) : state;
        let event = HistEvent.fromTransaction(tr);
        let time = tr.annotation(Transaction.time), userEvent = tr.annotation(Transaction.userEvent);
        if (event) state = state.addChanges(event, time, userEvent, config12.newGroupDelay, config12.minDepth);
        else if (tr.selection) state = state.addSelection(tr.startState.selection, time, userEvent, config12.newGroupDelay);
        if (isolate == "full" || isolate == "after") state = state.isolate();
        return state;
    },
    toJSON (value) {
        return {
            done: value.done.map((e)=>e.toJSON()
            ),
            undone: value.undone.map((e)=>e.toJSON()
            )
        };
    },
    fromJSON (json6) {
        return new HistoryState(json6.done.map(HistEvent.fromJSON), json6.undone.map(HistEvent.fromJSON));
    }
});
function history(config13 = {
}) {
    return [
        historyField_,
        historyConfig.of(config13),
        EditorView.domEventHandlers({
            beforeinput (e, view) {
                let command2 = e.inputType == "historyUndo" ? undo : e.inputType == "historyRedo" ? redo : null;
                if (!command2) return false;
                e.preventDefault();
                return command2(view);
            }
        })
    ];
}
function cmd(side, selection8) {
    return function({ state , dispatch  }) {
        if (!selection8 && state.readOnly) return false;
        let historyState = state.field(historyField_, false);
        if (!historyState) return false;
        let tr = historyState.pop(side, state, selection8);
        if (!tr) return false;
        dispatch(tr);
        return true;
    };
}
const undo = cmd(0, false);
const redo = cmd(1, false);
const undoSelection = cmd(0, true);
const redoSelection = cmd(1, true);
class HistEvent {
    constructor(changes, effects, mapped, startSelection, selectionsAfter){
        this.changes = changes;
        this.effects = effects;
        this.mapped = mapped;
        this.startSelection = startSelection;
        this.selectionsAfter = selectionsAfter;
    }
    setSelAfter(after) {
        return new HistEvent(this.changes, this.effects, this.mapped, this.startSelection, after);
    }
    toJSON() {
        var _a, _b, _c;
        return {
            changes: (_a = this.changes) === null || _a === void 0 ? void 0 : _a.toJSON(),
            mapped: (_b = this.mapped) === null || _b === void 0 ? void 0 : _b.toJSON(),
            startSelection: (_c = this.startSelection) === null || _c === void 0 ? void 0 : _c.toJSON(),
            selectionsAfter: this.selectionsAfter.map((s)=>s.toJSON()
            )
        };
    }
    static fromJSON(json7) {
        return new HistEvent(json7.changes && ChangeSet.fromJSON(json7.changes), [], json7.mapped && ChangeDesc.fromJSON(json7.mapped), json7.startSelection && EditorSelection.fromJSON(json7.startSelection), json7.selectionsAfter.map(EditorSelection.fromJSON));
    }
    static fromTransaction(tr, selection9) {
        let effects = none$1;
        for (let invert of tr.startState.facet(invertedEffects)){
            let result = invert(tr);
            if (result.length) effects = effects.concat(result);
        }
        if (!effects.length && tr.changes.empty) return null;
        return new HistEvent(tr.changes.invert(tr.startState.doc), effects, undefined, selection9 || tr.startState.selection, none$1);
    }
    static selection(selections) {
        return new HistEvent(undefined, none$1, undefined, undefined, selections);
    }
}
function updateBranch(branch, to, maxLen, newEvent) {
    let start = to + 1 > maxLen + 20 ? to - maxLen - 1 : 0;
    let newBranch = branch.slice(start, to);
    newBranch.push(newEvent);
    return newBranch;
}
function isAdjacent(a, b) {
    let ranges = [], isAdjacent1 = false;
    a.iterChangedRanges((f, t2)=>ranges.push(f, t2)
    );
    b.iterChangedRanges((_f, _t, f, t3)=>{
        for(let i112 = 0; i112 < ranges.length;){
            let from = ranges[i112++], to = ranges[i112++];
            if (t3 >= from && f <= to) isAdjacent1 = true;
        }
    });
    return isAdjacent1;
}
function eqSelectionShape(a, b) {
    return a.ranges.length == b.ranges.length && a.ranges.filter((r, i)=>r.empty != b.ranges[i].empty
    ).length === 0;
}
function conc(a, b) {
    return !a.length ? b : !b.length ? a : a.concat(b);
}
const none$1 = [];
function addSelection(branch, selection10) {
    if (!branch.length) {
        return [
            HistEvent.selection([
                selection10
            ])
        ];
    } else {
        let lastEvent = branch[branch.length - 1];
        let sels = lastEvent.selectionsAfter.slice(Math.max(0, lastEvent.selectionsAfter.length - 200));
        if (sels.length && sels[sels.length - 1].eq(selection10)) return branch;
        sels.push(selection10);
        return updateBranch(branch, branch.length - 1, 1000000000, lastEvent.setSelAfter(sels));
    }
}
function popSelection(branch) {
    let last = branch[branch.length - 1];
    let newBranch = branch.slice();
    newBranch[branch.length - 1] = last.setSelAfter(last.selectionsAfter.slice(0, last.selectionsAfter.length - 1));
    return newBranch;
}
function addMappingToBranch(branch, mapping) {
    if (!branch.length) return branch;
    let length = branch.length, selections = none$1;
    while(length){
        let event = mapEvent(branch[length - 1], mapping, selections);
        if (event.changes && !event.changes.empty || event.effects.length) {
            let result = branch.slice(0, length);
            result[length - 1] = event;
            return result;
        } else {
            mapping = event.mapped;
            length--;
            selections = event.selectionsAfter;
        }
    }
    return selections.length ? [
        HistEvent.selection(selections)
    ] : none$1;
}
function mapEvent(event, mapping, extraSelections) {
    let selections = conc(event.selectionsAfter.length ? event.selectionsAfter.map((s)=>s.map(mapping)
    ) : none$1, extraSelections);
    if (!event.changes) return HistEvent.selection(selections);
    let mappedChanges = event.changes.map(mapping), before = mapping.mapDesc(event.changes, true);
    let fullMapping = event.mapped ? event.mapped.composeDesc(before) : before;
    return new HistEvent(mappedChanges, StateEffect.mapEffects(event.effects, mapping), fullMapping, event.startSelection.map(before), selections);
}
const joinableUserEvent = /^(input\.type|delete)($|\.)/;
class HistoryState {
    constructor(done, undone, prevTime = 0, prevUserEvent = undefined){
        this.done = done;
        this.undone = undone;
        this.prevTime = prevTime;
        this.prevUserEvent = prevUserEvent;
    }
    isolate() {
        return this.prevTime ? new HistoryState(this.done, this.undone) : this;
    }
    addChanges(event, time, userEvent, newGroupDelay, maxLen) {
        let done = this.done, lastEvent = done[done.length - 1];
        if (lastEvent && lastEvent.changes && !lastEvent.changes.empty && event.changes && (!userEvent || joinableUserEvent.test(userEvent)) && (!lastEvent.selectionsAfter.length && time - this.prevTime < newGroupDelay && isAdjacent(lastEvent.changes, event.changes) || userEvent == "input.type.compose")) {
            done = updateBranch(done, done.length - 1, maxLen, new HistEvent(event.changes.compose(lastEvent.changes), conc(event.effects, lastEvent.effects), lastEvent.mapped, lastEvent.startSelection, none$1));
        } else {
            done = updateBranch(done, done.length, maxLen, event);
        }
        return new HistoryState(done, none$1, time, userEvent);
    }
    addSelection(selection11, time, userEvent, newGroupDelay) {
        let last = this.done.length ? this.done[this.done.length - 1].selectionsAfter : none$1;
        if (last.length > 0 && time - this.prevTime < newGroupDelay && userEvent == this.prevUserEvent && userEvent && /^select($|\.)/.test(userEvent) && eqSelectionShape(last[last.length - 1], selection11)) return this;
        return new HistoryState(addSelection(this.done, selection11), this.undone, time, userEvent);
    }
    addMapping(mapping) {
        return new HistoryState(addMappingToBranch(this.done, mapping), addMappingToBranch(this.undone, mapping), this.prevTime, this.prevUserEvent);
    }
    pop(side, state, selection12) {
        let branch = side == 0 ? this.done : this.undone;
        if (branch.length == 0) return null;
        let event = branch[branch.length - 1];
        if (selection12 && event.selectionsAfter.length) {
            return state.update({
                selection: event.selectionsAfter[event.selectionsAfter.length - 1],
                annotations: fromHistory.of({
                    side,
                    rest: popSelection(branch)
                }),
                userEvent: side == 0 ? "select.undo" : "select.redo",
                scrollIntoView: true
            });
        } else if (!event.changes) {
            return null;
        } else {
            let rest = branch.length == 1 ? none$1 : branch.slice(0, branch.length - 1);
            if (event.mapped) rest = addMappingToBranch(rest, event.mapped);
            return state.update({
                changes: event.changes,
                selection: event.startSelection,
                effects: event.effects,
                annotations: fromHistory.of({
                    side,
                    rest
                }),
                filter: false,
                userEvent: side == 0 ? "undo" : "redo",
                scrollIntoView: true
            });
        }
    }
}
HistoryState.empty = new HistoryState(none$1, none$1);
const historyKeymap = [
    {
        key: "Mod-z",
        run: undo,
        preventDefault: true
    },
    {
        key: "Mod-y",
        mac: "Mod-Shift-z",
        run: redo,
        preventDefault: true
    },
    {
        key: "Mod-u",
        run: undoSelection,
        preventDefault: true
    },
    {
        key: "Alt-u",
        mac: "Mod-Shift-u",
        run: redoSelection,
        preventDefault: true
    }
];
const DefaultBufferLength = 1024;
let nextPropID = 0;
class Range {
    constructor(from, to){
        this.from = from;
        this.to = to;
    }
}
class NodeProp {
    constructor(config14 = {
    }){
        this.id = nextPropID++;
        this.perNode = !!config14.perNode;
        this.deserialize = config14.deserialize || (()=>{
            throw new Error("This node type doesn't define a deserialize function");
        });
    }
    add(match) {
        if (this.perNode) throw new RangeError("Can't add per-node props to node types");
        if (typeof match != "function") match = NodeType.match(match);
        return (type)=>{
            let result = match(type);
            return result === undefined ? null : [
                this,
                result
            ];
        };
    }
}
NodeProp.closedBy = new NodeProp({
    deserialize: (str)=>str.split(" ")
});
NodeProp.openedBy = new NodeProp({
    deserialize: (str)=>str.split(" ")
});
NodeProp.group = new NodeProp({
    deserialize: (str)=>str.split(" ")
});
NodeProp.contextHash = new NodeProp({
    perNode: true
});
NodeProp.lookAhead = new NodeProp({
    perNode: true
});
NodeProp.mounted = new NodeProp({
    perNode: true
});
const noProps = Object.create(null);
class NodeType {
    constructor(name14, props, id, flags = 0){
        this.name = name14;
        this.props = props;
        this.id = id;
        this.flags = flags;
    }
    static define(spec) {
        let props = spec.props && spec.props.length ? Object.create(null) : noProps;
        let flags = (spec.top ? 1 : 0) | (spec.skipped ? 2 : 0) | (spec.error ? 4 : 0) | (spec.name == null ? 8 : 0);
        let type = new NodeType(spec.name || "", props, spec.id, flags);
        if (spec.props) for (let src of spec.props){
            if (!Array.isArray(src)) src = src(type);
            if (src) {
                if (src[0].perNode) throw new RangeError("Can't store a per-node prop on a node type");
                props[src[0].id] = src[1];
            }
        }
        return type;
    }
    prop(prop) {
        return this.props[prop.id];
    }
    get isTop() {
        return (this.flags & 1) > 0;
    }
    get isSkipped() {
        return (this.flags & 2) > 0;
    }
    get isError() {
        return (this.flags & 4) > 0;
    }
    get isAnonymous() {
        return (this.flags & 8) > 0;
    }
    is(name15) {
        if (typeof name15 == 'string') {
            if (this.name == name15) return true;
            let group = this.prop(NodeProp.group);
            return group ? group.indexOf(name15) > -1 : false;
        }
        return this.id == name15;
    }
    static match(map) {
        let direct = Object.create(null);
        for(let prop in map)for (let name of prop.split(" "))direct[name] = map[prop];
        return (node)=>{
            for(let groups = node.prop(NodeProp.group), i113 = -1; i113 < (groups ? groups.length : 0); i113++){
                let found = direct[i113 < 0 ? node.name : groups[i113]];
                if (found) return found;
            }
        };
    }
}
NodeType.none = new NodeType("", Object.create(null), 0, 8);
class NodeSet {
    constructor(types1){
        this.types = types1;
        for(let i114 = 0; i114 < types1.length; i114++)if (types1[i114].id != i114) throw new RangeError("Node type ids should correspond to array positions when creating a node set");
    }
    extend(...props) {
        let newTypes = [];
        for (let type of this.types){
            let newProps = null;
            for (let source of props){
                let add4 = source(type);
                if (add4) {
                    if (!newProps) newProps = Object.assign({
                    }, type.props);
                    newProps[add4[0].id] = add4[1];
                }
            }
            newTypes.push(newProps ? new NodeType(type.name, newProps, type.id, type.flags) : type);
        }
        return new NodeSet(newTypes);
    }
}
const CachedNode = new WeakMap(), CachedInnerNode = new WeakMap();
class Tree {
    constructor(type, children, positions, length, props){
        this.type = type;
        this.children = children;
        this.positions = positions;
        this.length = length;
        this.props = null;
        if (props && props.length) {
            this.props = Object.create(null);
            for (let [prop, value] of props)this.props[typeof prop == "number" ? prop : prop.id] = value;
        }
    }
    toString() {
        let mounted = this.prop(NodeProp.mounted);
        if (mounted && !mounted.overlay) return mounted.tree.toString();
        let children = "";
        for (let ch of this.children){
            let str = ch.toString();
            if (str) {
                if (children) children += ",";
                children += str;
            }
        }
        return !this.type.name ? children : (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (children.length ? "(" + children + ")" : "");
    }
    cursor(pos, side = 0) {
        let scope = pos != null && CachedNode.get(this) || this.topNode;
        let cursor6 = new TreeCursor(scope);
        if (pos != null) {
            cursor6.moveTo(pos, side);
            CachedNode.set(this, cursor6._tree);
        }
        return cursor6;
    }
    fullCursor() {
        return new TreeCursor(this.topNode, 1);
    }
    get topNode() {
        return new TreeNode(this, 0, 0, null);
    }
    resolve(pos, side = 0) {
        let node = resolveNode(CachedNode.get(this) || this.topNode, pos, side, false);
        CachedNode.set(this, node);
        return node;
    }
    resolveInner(pos, side = 0) {
        let node = resolveNode(CachedInnerNode.get(this) || this.topNode, pos, side, true);
        CachedInnerNode.set(this, node);
        return node;
    }
    iterate(spec) {
        let { enter , leave , from =0 , to =this.length  } = spec;
        for(let c = this.cursor(), get = ()=>c.node
        ;;){
            let mustLeave = false;
            if (c.from <= to && c.to >= from && (c.type.isAnonymous || enter(c.type, c.from, c.to, get) !== false)) {
                if (c.firstChild()) continue;
                if (!c.type.isAnonymous) mustLeave = true;
            }
            for(;;){
                if (mustLeave && leave) leave(c.type, c.from, c.to, get);
                mustLeave = c.type.isAnonymous;
                if (c.nextSibling()) break;
                if (!c.parent()) return;
                mustLeave = true;
            }
        }
    }
    prop(prop) {
        return !prop.perNode ? this.type.prop(prop) : this.props ? this.props[prop.id] : undefined;
    }
    get propValues() {
        let result = [];
        if (this.props) for(let id in this.props)result.push([
            +id,
            this.props[id]
        ]);
        return result;
    }
    balance(config15 = {
    }) {
        return this.children.length <= 8 ? this : balanceRange(NodeType.none, this.children, this.positions, 0, this.children.length, 0, this.length, (children, positions, length)=>new Tree(this.type, children, positions, length, this.propValues)
        , config15.makeTree || ((children, positions, length)=>new Tree(NodeType.none, children, positions, length)
        ));
    }
    static build(data) {
        return buildTree(data);
    }
}
Tree.empty = new Tree(NodeType.none, [], [], 0);
class FlatBufferCursor {
    constructor(buffer, index){
        this.buffer = buffer;
        this.index = index;
    }
    get id() {
        return this.buffer[this.index - 4];
    }
    get start() {
        return this.buffer[this.index - 3];
    }
    get end() {
        return this.buffer[this.index - 2];
    }
    get size() {
        return this.buffer[this.index - 1];
    }
    get pos() {
        return this.index;
    }
    next() {
        this.index -= 4;
    }
    fork() {
        return new FlatBufferCursor(this.buffer, this.index);
    }
}
class TreeBuffer {
    constructor(buffer, length, set){
        this.buffer = buffer;
        this.length = length;
        this.set = set;
    }
    get type() {
        return NodeType.none;
    }
    toString() {
        let result = [];
        for(let index = 0; index < this.buffer.length;){
            result.push(this.childString(index));
            index = this.buffer[index + 3];
        }
        return result.join(",");
    }
    childString(index) {
        let id = this.buffer[index], endIndex = this.buffer[index + 3];
        let type = this.set.types[id], result = type.name;
        if (/\W/.test(result) && !type.isError) result = JSON.stringify(result);
        index += 4;
        if (endIndex == index) return result;
        let children = [];
        while(index < endIndex){
            children.push(this.childString(index));
            index = this.buffer[index + 3];
        }
        return result + "(" + children.join(",") + ")";
    }
    findChild(startIndex, endIndex, dir, pos, side) {
        let { buffer  } = this, pick = -1;
        for(let i115 = startIndex; i115 != endIndex; i115 = buffer[i115 + 3]){
            if (checkSide(side, pos, buffer[i115 + 1], buffer[i115 + 2])) {
                pick = i115;
                if (dir > 0) break;
            }
        }
        return pick;
    }
    slice(startI, endI, from, to) {
        let b = this.buffer;
        let copy = new Uint16Array(endI - startI);
        for(let i116 = startI, j = 0; i116 < endI;){
            copy[j++] = b[i116++];
            copy[j++] = b[i116++] - from;
            copy[j++] = b[i116++] - from;
            copy[j++] = b[i116++] - startI;
        }
        return new TreeBuffer(copy, to - from, this.set);
    }
}
function checkSide(side, pos, from, to) {
    switch(side){
        case -2:
            return from < pos;
        case -1:
            return to >= pos && from < pos;
        case 0:
            return from < pos && to > pos;
        case 1:
            return from <= pos && to > pos;
        case 2:
            return to > pos;
        case 4:
            return true;
    }
}
function enterUnfinishedNodesBefore(node, pos) {
    let scan = node.childBefore(pos);
    while(scan){
        let last = scan.lastChild;
        if (!last || last.to != scan.to) break;
        if (last.type.isError && last.from == last.to) {
            node = scan;
            scan = last.prevSibling;
        } else {
            scan = last;
        }
    }
    return node;
}
function resolveNode(node, pos, side, overlays) {
    var _a;
    while(node.from == node.to || (side < 1 ? node.from >= pos : node.from > pos) || (side > -1 ? node.to <= pos : node.to < pos)){
        let parent = !overlays && node instanceof TreeNode && node.index < 0 ? null : node.parent;
        if (!parent) return node;
        node = parent;
    }
    if (overlays) for(let scan = node, parent = scan.parent; parent; scan = parent, parent = scan.parent){
        if (scan instanceof TreeNode && scan.index < 0 && ((_a = parent.enter(pos, side, true)) === null || _a === void 0 ? void 0 : _a.from) != scan.from) node = parent;
    }
    for(;;){
        let inner = node.enter(pos, side, overlays);
        if (!inner) return node;
        node = inner;
    }
}
class TreeNode {
    constructor(node, _from, index, _parent){
        this.node = node;
        this._from = _from;
        this.index = index;
        this._parent = _parent;
    }
    get type() {
        return this.node.type;
    }
    get name() {
        return this.node.type.name;
    }
    get from() {
        return this._from;
    }
    get to() {
        return this._from + this.node.length;
    }
    nextChild(i117, dir, pos, side, mode = 0) {
        for(let parent = this;;){
            for(let { children , positions  } = parent.node, e = dir > 0 ? children.length : -1; i117 != e; i117 += dir){
                let next = children[i117], start = positions[i117] + parent._from;
                if (!checkSide(side, pos, start, start + next.length)) continue;
                if (next instanceof TreeBuffer) {
                    if (mode & 2) continue;
                    let index = next.findChild(0, next.buffer.length, dir, pos - start, side);
                    if (index > -1) return new BufferNode(new BufferContext(parent, next, i117, start), null, index);
                } else if (mode & 1 || !next.type.isAnonymous || hasChild(next)) {
                    let mounted;
                    if (!(mode & 1) && next.props && (mounted = next.prop(NodeProp.mounted)) && !mounted.overlay) return new TreeNode(mounted.tree, start, i117, parent);
                    let inner = new TreeNode(next, start, i117, parent);
                    return mode & 1 || !inner.type.isAnonymous ? inner : inner.nextChild(dir < 0 ? next.children.length - 1 : 0, dir, pos, side);
                }
            }
            if (mode & 1 || !parent.type.isAnonymous) return null;
            if (parent.index >= 0) i117 = parent.index + dir;
            else i117 = dir < 0 ? -1 : parent._parent.node.children.length;
            parent = parent._parent;
            if (!parent) return null;
        }
    }
    get firstChild() {
        return this.nextChild(0, 1, 0, 4);
    }
    get lastChild() {
        return this.nextChild(this.node.children.length - 1, -1, 0, 4);
    }
    childAfter(pos) {
        return this.nextChild(0, 1, pos, 2);
    }
    childBefore(pos) {
        return this.nextChild(this.node.children.length - 1, -1, pos, -2);
    }
    enter(pos, side, overlays = true, buffers = true) {
        let mounted;
        if (overlays && (mounted = this.node.prop(NodeProp.mounted)) && mounted.overlay) {
            let rPos = pos - this.from;
            for (let { from , to  } of mounted.overlay){
                if ((side > 0 ? from <= rPos : from < rPos) && (side < 0 ? to >= rPos : to > rPos)) return new TreeNode(mounted.tree, mounted.overlay[0].from + this.from, -1, this);
            }
        }
        return this.nextChild(0, 1, pos, side, buffers ? 0 : 2);
    }
    nextSignificantParent() {
        let val = this;
        while(val.type.isAnonymous && val._parent)val = val._parent;
        return val;
    }
    get parent() {
        return this._parent ? this._parent.nextSignificantParent() : null;
    }
    get nextSibling() {
        return this._parent && this.index >= 0 ? this._parent.nextChild(this.index + 1, 1, 0, 4) : null;
    }
    get prevSibling() {
        return this._parent && this.index >= 0 ? this._parent.nextChild(this.index - 1, -1, 0, 4) : null;
    }
    get cursor() {
        return new TreeCursor(this);
    }
    get tree() {
        return this.node;
    }
    toTree() {
        return this.node;
    }
    resolve(pos, side = 0) {
        return resolveNode(this, pos, side, false);
    }
    resolveInner(pos, side = 0) {
        return resolveNode(this, pos, side, true);
    }
    enterUnfinishedNodesBefore(pos) {
        return enterUnfinishedNodesBefore(this, pos);
    }
    getChild(type, before = null, after = null) {
        let r = getChildren(this, type, before, after);
        return r.length ? r[0] : null;
    }
    getChildren(type, before = null, after = null) {
        return getChildren(this, type, before, after);
    }
    toString() {
        return this.node.toString();
    }
}
function getChildren(node, type, before, after) {
    let cur17 = node.cursor, result = [];
    if (!cur17.firstChild()) return result;
    if (before != null) {
        while(!cur17.type.is(before))if (!cur17.nextSibling()) return result;
    }
    for(;;){
        if (after != null && cur17.type.is(after)) return result;
        if (cur17.type.is(type)) result.push(cur17.node);
        if (!cur17.nextSibling()) return after == null ? result : [];
    }
}
class BufferContext {
    constructor(parent, buffer, index, start){
        this.parent = parent;
        this.buffer = buffer;
        this.index = index;
        this.start = start;
    }
}
class BufferNode {
    constructor(context, _parent, index){
        this.context = context;
        this._parent = _parent;
        this.index = index;
        this.type = context.buffer.set.types[context.buffer.buffer[index]];
    }
    get name() {
        return this.type.name;
    }
    get from() {
        return this.context.start + this.context.buffer.buffer[this.index + 1];
    }
    get to() {
        return this.context.start + this.context.buffer.buffer[this.index + 2];
    }
    child(dir, pos, side) {
        let { buffer  } = this.context;
        let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.context.start, side);
        return index < 0 ? null : new BufferNode(this.context, this, index);
    }
    get firstChild() {
        return this.child(1, 0, 4);
    }
    get lastChild() {
        return this.child(-1, 0, 4);
    }
    childAfter(pos) {
        return this.child(1, pos, 2);
    }
    childBefore(pos) {
        return this.child(-1, pos, -2);
    }
    enter(pos, side, overlays, buffers = true) {
        if (!buffers) return null;
        let { buffer  } = this.context;
        let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], side > 0 ? 1 : -1, pos - this.context.start, side);
        return index < 0 ? null : new BufferNode(this.context, this, index);
    }
    get parent() {
        return this._parent || this.context.parent.nextSignificantParent();
    }
    externalSibling(dir) {
        return this._parent ? null : this.context.parent.nextChild(this.context.index + dir, dir, 0, 4);
    }
    get nextSibling() {
        let { buffer  } = this.context;
        let after = buffer.buffer[this.index + 3];
        if (after < (this._parent ? buffer.buffer[this._parent.index + 3] : buffer.buffer.length)) return new BufferNode(this.context, this._parent, after);
        return this.externalSibling(1);
    }
    get prevSibling() {
        let { buffer  } = this.context;
        let parentStart = this._parent ? this._parent.index + 4 : 0;
        if (this.index == parentStart) return this.externalSibling(-1);
        return new BufferNode(this.context, this._parent, buffer.findChild(parentStart, this.index, -1, 0, 4));
    }
    get cursor() {
        return new TreeCursor(this);
    }
    get tree() {
        return null;
    }
    toTree() {
        let children = [], positions = [];
        let { buffer  } = this.context;
        let startI = this.index + 4, endI = buffer.buffer[this.index + 3];
        if (endI > startI) {
            let from = buffer.buffer[this.index + 1], to = buffer.buffer[this.index + 2];
            children.push(buffer.slice(startI, endI, from, to));
            positions.push(0);
        }
        return new Tree(this.type, children, positions, this.to - this.from);
    }
    resolve(pos, side = 0) {
        return resolveNode(this, pos, side, false);
    }
    resolveInner(pos, side = 0) {
        return resolveNode(this, pos, side, true);
    }
    enterUnfinishedNodesBefore(pos) {
        return enterUnfinishedNodesBefore(this, pos);
    }
    toString() {
        return this.context.buffer.childString(this.index);
    }
    getChild(type, before = null, after = null) {
        let r = getChildren(this, type, before, after);
        return r.length ? r[0] : null;
    }
    getChildren(type, before = null, after = null) {
        return getChildren(this, type, before, after);
    }
}
class TreeCursor {
    constructor(node, mode = 0){
        this.mode = mode;
        this.buffer = null;
        this.stack = [];
        this.index = 0;
        this.bufferNode = null;
        if (node instanceof TreeNode) {
            this.yieldNode(node);
        } else {
            this._tree = node.context.parent;
            this.buffer = node.context;
            for(let n = node._parent; n; n = n._parent)this.stack.unshift(n.index);
            this.bufferNode = node;
            this.yieldBuf(node.index);
        }
    }
    get name() {
        return this.type.name;
    }
    yieldNode(node) {
        if (!node) return false;
        this._tree = node;
        this.type = node.type;
        this.from = node.from;
        this.to = node.to;
        return true;
    }
    yieldBuf(index, type) {
        this.index = index;
        let { start , buffer  } = this.buffer;
        this.type = type || buffer.set.types[buffer.buffer[index]];
        this.from = start + buffer.buffer[index + 1];
        this.to = start + buffer.buffer[index + 2];
        return true;
    }
    yield(node) {
        if (!node) return false;
        if (node instanceof TreeNode) {
            this.buffer = null;
            return this.yieldNode(node);
        }
        this.buffer = node.context;
        return this.yieldBuf(node.index, node.type);
    }
    toString() {
        return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
    }
    enterChild(dir, pos, side) {
        if (!this.buffer) return this.yield(this._tree.nextChild(dir < 0 ? this._tree.node.children.length - 1 : 0, dir, pos, side, this.mode));
        let { buffer  } = this.buffer;
        let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.buffer.start, side);
        if (index < 0) return false;
        this.stack.push(this.index);
        return this.yieldBuf(index);
    }
    firstChild() {
        return this.enterChild(1, 0, 4);
    }
    lastChild() {
        return this.enterChild(-1, 0, 4);
    }
    childAfter(pos) {
        return this.enterChild(1, pos, 2);
    }
    childBefore(pos) {
        return this.enterChild(-1, pos, -2);
    }
    enter(pos, side, overlays = true, buffers = true) {
        if (!this.buffer) return this.yield(this._tree.enter(pos, side, overlays && !(this.mode & 1), buffers));
        return buffers ? this.enterChild(1, pos, side) : false;
    }
    parent() {
        if (!this.buffer) return this.yieldNode(this.mode & 1 ? this._tree._parent : this._tree.parent);
        if (this.stack.length) return this.yieldBuf(this.stack.pop());
        let parent = this.mode & 1 ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
        this.buffer = null;
        return this.yieldNode(parent);
    }
    sibling(dir) {
        if (!this.buffer) return !this._tree._parent ? false : this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + dir, dir, 0, 4, this.mode));
        let { buffer  } = this.buffer, d = this.stack.length - 1;
        if (dir < 0) {
            let parentStart = d < 0 ? 0 : this.stack[d] + 4;
            if (this.index != parentStart) return this.yieldBuf(buffer.findChild(parentStart, this.index, -1, 0, 4));
        } else {
            let after = buffer.buffer[this.index + 3];
            if (after < (d < 0 ? buffer.buffer.length : buffer.buffer[this.stack[d] + 3])) return this.yieldBuf(after);
        }
        return d < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + dir, dir, 0, 4, this.mode)) : false;
    }
    nextSibling() {
        return this.sibling(1);
    }
    prevSibling() {
        return this.sibling(-1);
    }
    atLastNode(dir) {
        let index, parent, { buffer  } = this;
        if (buffer) {
            if (dir > 0) {
                if (this.index < buffer.buffer.buffer.length) return false;
            } else {
                for(let i118 = 0; i118 < this.index; i118++)if (buffer.buffer.buffer[i118 + 3] < this.index) return false;
            }
            ({ index , parent  } = buffer);
        } else {
            ({ index , _parent: parent  } = this._tree);
        }
        for(; parent; { index , _parent: parent  } = parent){
            if (index > -1) for(let i119 = index + dir, e = dir < 0 ? -1 : parent.node.children.length; i119 != e; i119 += dir){
                let child = parent.node.children[i119];
                if (this.mode & 1 || child instanceof TreeBuffer || !child.type.isAnonymous || hasChild(child)) return false;
            }
        }
        return true;
    }
    move(dir, enter) {
        if (enter && this.enterChild(dir, 0, 4)) return true;
        for(;;){
            if (this.sibling(dir)) return true;
            if (this.atLastNode(dir) || !this.parent()) return false;
        }
    }
    next(enter = true) {
        return this.move(1, enter);
    }
    prev(enter = true) {
        return this.move(-1, enter);
    }
    moveTo(pos, side = 0) {
        while(this.from == this.to || (side < 1 ? this.from >= pos : this.from > pos) || (side > -1 ? this.to <= pos : this.to < pos))if (!this.parent()) break;
        while(this.enterChild(1, pos, side)){
        }
        return this;
    }
    get node() {
        if (!this.buffer) return this._tree;
        let cache = this.bufferNode, result = null, depth = 0;
        if (cache && cache.context == this.buffer) {
            scan: for(let index = this.index, d = this.stack.length; d >= 0;){
                for(let c = cache; c; c = c._parent)if (c.index == index) {
                    if (index == this.index) return c;
                    result = c;
                    depth = d + 1;
                    break scan;
                }
                index = this.stack[--d];
            }
        }
        for(let i120 = depth; i120 < this.stack.length; i120++)result = new BufferNode(this.buffer, result, this.stack[i120]);
        return this.bufferNode = new BufferNode(this.buffer, result, this.index);
    }
    get tree() {
        return this.buffer ? null : this._tree.node;
    }
}
function hasChild(tree) {
    return tree.children.some((ch)=>ch instanceof TreeBuffer || !ch.type.isAnonymous || hasChild(ch)
    );
}
function buildTree(data1) {
    var _a;
    let { buffer: buffer1 , nodeSet , maxBufferLength =1024 , reused =[] , minRepeatType =nodeSet.types.length  } = data1;
    let cursor7 = Array.isArray(buffer1) ? new FlatBufferCursor(buffer1, buffer1.length) : buffer1;
    let types2 = nodeSet.types;
    let contextHash = 0, lookAhead1 = 0;
    function takeNode(parentStart, minPos, children, positions, inRepeat) {
        let { id , start , end , size  } = cursor7;
        let lookAheadAtStart = lookAhead1;
        while(size < 0){
            cursor7.next();
            if (size == -1) {
                let node = reused[id];
                children.push(node);
                positions.push(start - parentStart);
                return;
            } else if (size == -3) {
                contextHash = id;
                return;
            } else if (size == -4) {
                lookAhead1 = id;
                return;
            } else {
                throw new RangeError(`Unrecognized record size: ${size}`);
            }
        }
        let type = types2[id], node, buffer;
        let startPos = start - parentStart;
        if (end - start <= maxBufferLength && (buffer = findBufferSize(cursor7.pos - minPos, inRepeat))) {
            let data = new Uint16Array(buffer.size - buffer.skip);
            let endPos = cursor7.pos - buffer.size, index = data.length;
            while(cursor7.pos > endPos)index = copyToBuffer(buffer.start, data, index);
            node = new TreeBuffer(data, end - buffer.start, nodeSet);
            startPos = buffer.start - parentStart;
        } else {
            let endPos = cursor7.pos - size;
            cursor7.next();
            let localChildren = [], localPositions = [];
            let localInRepeat = id >= minRepeatType ? id : -1;
            let lastGroup = 0, lastEnd = end;
            while(cursor7.pos > endPos){
                if (localInRepeat >= 0 && cursor7.id == localInRepeat && cursor7.size >= 0) {
                    if (cursor7.end <= lastEnd - maxBufferLength) {
                        makeRepeatLeaf(localChildren, localPositions, start, lastGroup, cursor7.end, lastEnd, localInRepeat, lookAheadAtStart);
                        lastGroup = localChildren.length;
                        lastEnd = cursor7.end;
                    }
                    cursor7.next();
                } else {
                    takeNode(start, endPos, localChildren, localPositions, localInRepeat);
                }
            }
            if (localInRepeat >= 0 && lastGroup > 0 && lastGroup < localChildren.length) makeRepeatLeaf(localChildren, localPositions, start, lastGroup, start, lastEnd, localInRepeat, lookAheadAtStart);
            localChildren.reverse();
            localPositions.reverse();
            if (localInRepeat > -1 && lastGroup > 0) {
                let make = makeBalanced(type);
                node = balanceRange(type, localChildren, localPositions, 0, localChildren.length, 0, end - start, make, make);
            } else {
                node = makeTree(type, localChildren, localPositions, end - start, lookAheadAtStart - end);
            }
        }
        children.push(node);
        positions.push(startPos);
    }
    function makeBalanced(type) {
        return (children, positions, length)=>{
            let lookAhead = 0, lastI = children.length - 1, last, lookAheadProp;
            if (lastI >= 0 && (last = children[lastI]) instanceof Tree) {
                if (!lastI && last.type == type && last.length == length) return last;
                if (lookAheadProp = last.prop(NodeProp.lookAhead)) lookAhead = positions[lastI] + last.length + lookAheadProp;
            }
            return makeTree(type, children, positions, length, lookAhead);
        };
    }
    function makeRepeatLeaf(children, positions, base12, i121, from, to, type, lookAhead) {
        let localChildren = [], localPositions = [];
        while(children.length > i121){
            localChildren.push(children.pop());
            localPositions.push(positions.pop() + base12 - from);
        }
        children.push(makeTree(nodeSet.types[type], localChildren, localPositions, to - from, lookAhead - to));
        positions.push(from - base12);
    }
    function makeTree(type, children, positions, length, lookAhead = 0, props) {
        if (contextHash) {
            let pair1 = [
                NodeProp.contextHash,
                contextHash
            ];
            props = props ? [
                pair1
            ].concat(props) : [
                pair1
            ];
        }
        if (lookAhead > 25) {
            let pair2 = [
                NodeProp.lookAhead,
                lookAhead
            ];
            props = props ? [
                pair2
            ].concat(props) : [
                pair2
            ];
        }
        return new Tree(type, children, positions, length, props);
    }
    function findBufferSize(maxSize, inRepeat) {
        let fork = cursor7.fork();
        let size = 0, start = 0, skip = 0, minStart = fork.end - maxBufferLength;
        let result = {
            size: 0,
            start: 0,
            skip: 0
        };
        scan: for(let minPos = fork.pos - maxSize; fork.pos > minPos;){
            let nodeSize1 = fork.size;
            if (fork.id == inRepeat && nodeSize1 >= 0) {
                result.size = size;
                result.start = start;
                result.skip = skip;
                skip += 4;
                size += 4;
                fork.next();
                continue;
            }
            let startPos = fork.pos - nodeSize1;
            if (nodeSize1 < 0 || startPos < minPos || fork.start < minStart) break;
            let localSkipped = fork.id >= minRepeatType ? 4 : 0;
            let nodeStart1 = fork.start;
            fork.next();
            while(fork.pos > startPos){
                if (fork.size < 0) {
                    if (fork.size == -3) localSkipped += 4;
                    else break scan;
                } else if (fork.id >= minRepeatType) {
                    localSkipped += 4;
                }
                fork.next();
            }
            start = nodeStart1;
            size += nodeSize1;
            skip += localSkipped;
        }
        if (inRepeat < 0 || size == maxSize) {
            result.size = size;
            result.start = start;
            result.skip = skip;
        }
        return result.size > 4 ? result : undefined;
    }
    function copyToBuffer(bufferStart, buffer, index) {
        let { id , start , end , size  } = cursor7;
        cursor7.next();
        if (size >= 0 && id < minRepeatType) {
            let startIndex = index;
            if (size > 4) {
                let endPos = cursor7.pos - (size - 4);
                while(cursor7.pos > endPos)index = copyToBuffer(bufferStart, buffer, index);
            }
            buffer[--index] = startIndex;
            buffer[--index] = end - bufferStart;
            buffer[--index] = start - bufferStart;
            buffer[--index] = id;
        } else if (size == -3) {
            contextHash = id;
        } else if (size == -4) {
            lookAhead1 = id;
        }
        return index;
    }
    let children1 = [], positions1 = [];
    while(cursor7.pos > 0)takeNode(data1.start || 0, data1.bufferStart || 0, children1, positions1, -1);
    let length1 = (_a = data1.length) !== null && _a !== void 0 ? _a : children1.length ? positions1[0] + children1[0].length : 0;
    return new Tree(types2[data1.topID], children1.reverse(), positions1.reverse(), length1);
}
const nodeSizeCache = new WeakMap;
function nodeSize(balanceType, node) {
    if (!balanceType.isAnonymous || node instanceof TreeBuffer || node.type != balanceType) return 1;
    let size = nodeSizeCache.get(node);
    if (size == null) {
        size = 1;
        for (let child of node.children){
            if (child.type != balanceType || !(child instanceof Tree)) {
                size = 1;
                break;
            }
            size += nodeSize(balanceType, child);
        }
        nodeSizeCache.set(node, size);
    }
    return size;
}
function balanceRange(balanceType, children2, positions2, from5, to5, start, length2, mkTop, mkTree) {
    let total = 0;
    for(let i122 = from5; i122 < to5; i122++)total += nodeSize(balanceType, children2[i122]);
    let maxChild = Math.ceil(total * 1.5 / 8);
    let localChildren = [], localPositions = [];
    function divide(children, positions, from, to, offset) {
        for(let i123 = from; i123 < to;){
            let groupFrom = i123, groupStart = positions[i123], groupSize = nodeSize(balanceType, children[i123]);
            i123++;
            for(; i123 < to; i123++){
                let nextSize = nodeSize(balanceType, children[i123]);
                if (groupSize + nextSize >= maxChild) break;
                groupSize += nextSize;
            }
            if (i123 == groupFrom + 1) {
                if (groupSize > maxChild) {
                    let only = children[groupFrom];
                    divide(only.children, only.positions, 0, only.children.length, positions[groupFrom] + offset);
                    continue;
                }
                localChildren.push(children[groupFrom]);
            } else {
                let length = positions[i123 - 1] + children[i123 - 1].length - groupStart;
                localChildren.push(balanceRange(balanceType, children, positions, groupFrom, i123, groupStart, length, null, mkTree));
            }
            localPositions.push(groupStart + offset - start);
        }
    }
    divide(children2, positions2, from5, to5, 0);
    return (mkTop || mkTree)(localChildren, localPositions, length2);
}
class TreeFragment {
    constructor(from, to, tree, offset, openStart = false, openEnd = false){
        this.from = from;
        this.to = to;
        this.tree = tree;
        this.offset = offset;
        this.open = (openStart ? 1 : 0) | (openEnd ? 2 : 0);
    }
    get openStart() {
        return (this.open & 1) > 0;
    }
    get openEnd() {
        return (this.open & 2) > 0;
    }
    static addTree(tree, fragments = [], partial = false) {
        let result = [
            new TreeFragment(0, tree.length, tree, 0, false, partial)
        ];
        for (let f of fragments)if (f.to > tree.length) result.push(f);
        return result;
    }
    static applyChanges(fragments, changes, minGap = 128) {
        if (!changes.length) return fragments;
        let result = [];
        let fI = 1, nextF = fragments.length ? fragments[0] : null;
        for(let cI = 0, pos = 0, off = 0;; cI++){
            let nextC = cI < changes.length ? changes[cI] : null;
            let nextPos = nextC ? nextC.fromA : 1000000000;
            if (nextPos - pos >= minGap) while(nextF && nextF.from < nextPos){
                let cut = nextF;
                if (pos >= cut.from || nextPos <= cut.to || off) {
                    let fFrom = Math.max(cut.from, pos) - off, fTo = Math.min(cut.to, nextPos) - off;
                    cut = fFrom >= fTo ? null : new TreeFragment(fFrom, fTo, cut.tree, cut.offset + off, cI > 0, !!nextC);
                }
                if (cut) result.push(cut);
                if (nextF.to > nextPos) break;
                nextF = fI < fragments.length ? fragments[fI++] : null;
            }
            if (!nextC) break;
            pos = nextC.toA;
            off = nextC.toA - nextC.toB;
        }
        return result;
    }
}
class Parser {
    startParse(input, fragments, ranges) {
        if (typeof input == "string") input = new StringInput(input);
        ranges = !ranges ? [
            new Range(0, input.length)
        ] : ranges.length ? ranges.map((r)=>new Range(r.from, r.to)
        ) : [
            new Range(0, 0)
        ];
        return this.createParse(input, fragments || [], ranges);
    }
    parse(input, fragments, ranges) {
        let parse = this.startParse(input, fragments, ranges);
        for(;;){
            let done = parse.advance();
            if (done) return done;
        }
    }
}
class StringInput {
    constructor(string5){
        this.string = string5;
    }
    get length() {
        return this.string.length;
    }
    chunk(from) {
        return this.string.slice(from);
    }
    get lineChunks() {
        return false;
    }
    read(from, to) {
        return this.string.slice(from, to);
    }
}
new NodeProp({
    perNode: true
});
const languageDataProp = new NodeProp();
function defineLanguageFacet(baseData) {
    return Facet.define({
        combine: baseData ? (values)=>values.concat(baseData)
         : undefined
    });
}
class Language {
    constructor(data, parser1, topNode, extraExtensions = []){
        this.data = data;
        this.topNode = topNode;
        if (!EditorState.prototype.hasOwnProperty("tree")) Object.defineProperty(EditorState.prototype, "tree", {
            get () {
                return syntaxTree(this);
            }
        });
        this.parser = parser1;
        this.extension = [
            language.of(this),
            EditorState.languageData.of((state, pos, side)=>state.facet(languageDataFacetAt(state, pos, side))
            )
        ].concat(extraExtensions);
    }
    isActiveAt(state, pos, side = -1) {
        return languageDataFacetAt(state, pos, side) == this.data;
    }
    findRegions(state) {
        let lang = state.facet(language);
        if ((lang === null || lang === void 0 ? void 0 : lang.data) == this.data) return [
            {
                from: 0,
                to: state.doc.length
            }
        ];
        if (!lang || !lang.allowsNesting) return [];
        let result = [];
        let explore = (tree, from)=>{
            if (tree.prop(languageDataProp) == this.data) {
                result.push({
                    from,
                    to: from + tree.length
                });
                return;
            }
            let mount = tree.prop(NodeProp.mounted);
            if (mount) {
                if (mount.tree.prop(languageDataProp) == this.data) {
                    if (mount.overlay) for (let r of mount.overlay)result.push({
                        from: r.from + from,
                        to: r.to + from
                    });
                    else result.push({
                        from: from,
                        to: from + tree.length
                    });
                    return;
                } else if (mount.overlay) {
                    let size = result.length;
                    explore(mount.tree, mount.overlay[0].from + from);
                    if (result.length > size) return;
                }
            }
            for(let i124 = 0; i124 < tree.children.length; i124++){
                let ch = tree.children[i124];
                if (ch instanceof Tree) explore(ch, tree.positions[i124] + from);
            }
        };
        explore(syntaxTree(state), 0);
        return result;
    }
    get allowsNesting() {
        return true;
    }
}
Language.setState = StateEffect.define();
function languageDataFacetAt(state, pos, side) {
    let topLang = state.facet(language);
    if (!topLang) return null;
    let facet = topLang.data;
    if (topLang.allowsNesting) {
        for(let node = syntaxTree(state).topNode; node; node = node.enter(pos, side, true, false))facet = node.type.prop(languageDataProp) || facet;
    }
    return facet;
}
class LRLanguage extends Language {
    constructor(data, parser2){
        super(data, parser2, parser2.topNode);
        this.parser = parser2;
    }
    static define(spec) {
        let data = defineLanguageFacet(spec.languageData);
        return new LRLanguage(data, spec.parser.configure({
            props: [
                languageDataProp.add((type)=>type.isTop ? data : undefined
                )
            ]
        }));
    }
    configure(options) {
        return new LRLanguage(this.data, this.parser.configure(options));
    }
    get allowsNesting() {
        return this.parser.wrappers.length > 0;
    }
}
function syntaxTree(state) {
    let field = state.field(Language.state, false);
    return field ? field.tree : Tree.empty;
}
class DocInput {
    constructor(doc24, length = doc24.length){
        this.doc = doc24;
        this.length = length;
        this.cursorPos = 0;
        this.string = "";
        this.cursor = doc24.iter();
    }
    syncTo(pos) {
        this.string = this.cursor.next(pos - this.cursorPos).value;
        this.cursorPos = pos + this.string.length;
        return this.cursorPos - this.string.length;
    }
    chunk(pos) {
        this.syncTo(pos);
        return this.string;
    }
    get lineChunks() {
        return true;
    }
    read(from, to) {
        let stringStart = this.cursorPos - this.string.length;
        if (from < stringStart || to >= this.cursorPos) return this.doc.sliceString(from, to);
        else return this.string.slice(from - stringStart, to - stringStart);
    }
}
let currentContext = null;
class ParseContext {
    constructor(parser3, state, fragments = [], tree, treeLen, viewport, skipped, scheduleOn){
        this.parser = parser3;
        this.state = state;
        this.fragments = fragments;
        this.tree = tree;
        this.treeLen = treeLen;
        this.viewport = viewport;
        this.skipped = skipped;
        this.scheduleOn = scheduleOn;
        this.parse = null;
        this.tempSkipped = [];
    }
    startParse() {
        return this.parser.startParse(new DocInput(this.state.doc), this.fragments);
    }
    work(time, upto) {
        if (upto != null && upto >= this.state.doc.length) upto = undefined;
        if (this.tree != Tree.empty && this.isDone(upto !== null && upto !== void 0 ? upto : this.state.doc.length)) {
            this.takeTree();
            return true;
        }
        return this.withContext(()=>{
            var _a;
            let endTime = Date.now() + time;
            if (!this.parse) this.parse = this.startParse();
            if (upto != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > upto) && upto < this.state.doc.length) this.parse.stopAt(upto);
            for(;;){
                let done = this.parse.advance();
                if (done) {
                    this.fragments = this.withoutTempSkipped(TreeFragment.addTree(done, this.fragments, this.parse.stoppedAt != null));
                    this.treeLen = (_a = this.parse.stoppedAt) !== null && _a !== void 0 ? _a : this.state.doc.length;
                    this.tree = done;
                    this.parse = null;
                    if (this.treeLen < (upto !== null && upto !== void 0 ? upto : this.state.doc.length)) this.parse = this.startParse();
                    else return true;
                }
                if (Date.now() > endTime) return false;
            }
        });
    }
    takeTree() {
        let pos, tree;
        if (this.parse && (pos = this.parse.parsedPos) >= this.treeLen) {
            if (this.parse.stoppedAt == null || this.parse.stoppedAt > pos) this.parse.stopAt(pos);
            this.withContext(()=>{
                while(!(tree = this.parse.advance())){
                }
            });
            this.treeLen = pos;
            this.tree = tree;
            this.fragments = this.withoutTempSkipped(TreeFragment.addTree(this.tree, this.fragments, true));
            this.parse = null;
        }
    }
    withContext(f) {
        let prev = currentContext;
        currentContext = this;
        try {
            return f();
        } finally{
            currentContext = prev;
        }
    }
    withoutTempSkipped(fragments) {
        for(let r; r = this.tempSkipped.pop();)fragments = cutFragments(fragments, r.from, r.to);
        return fragments;
    }
    changes(changes, newState) {
        let { fragments , tree , treeLen , viewport , skipped  } = this;
        this.takeTree();
        if (!changes.empty) {
            let ranges = [];
            changes.iterChangedRanges((fromA, toA, fromB, toB)=>ranges.push({
                    fromA,
                    toA,
                    fromB,
                    toB
                })
            );
            fragments = TreeFragment.applyChanges(fragments, ranges);
            tree = Tree.empty;
            treeLen = 0;
            viewport = {
                from: changes.mapPos(viewport.from, -1),
                to: changes.mapPos(viewport.to, 1)
            };
            if (this.skipped.length) {
                skipped = [];
                for (let r of this.skipped){
                    let from = changes.mapPos(r.from, 1), to = changes.mapPos(r.to, -1);
                    if (from < to) skipped.push({
                        from,
                        to
                    });
                }
            }
        }
        return new ParseContext(this.parser, newState, fragments, tree, treeLen, viewport, skipped, this.scheduleOn);
    }
    updateViewport(viewport) {
        if (this.viewport.from == viewport.from && this.viewport.to == viewport.to) return false;
        this.viewport = viewport;
        let startLen = this.skipped.length;
        for(let i125 = 0; i125 < this.skipped.length; i125++){
            let { from , to  } = this.skipped[i125];
            if (from < viewport.to && to > viewport.from) {
                this.fragments = cutFragments(this.fragments, from, to);
                this.skipped.splice(i125--, 1);
            }
        }
        if (this.skipped.length >= startLen) return false;
        this.reset();
        return true;
    }
    reset() {
        if (this.parse) {
            this.takeTree();
            this.parse = null;
        }
    }
    skipUntilInView(from, to) {
        this.skipped.push({
            from,
            to
        });
    }
    static getSkippingParser(until) {
        return new class extends Parser {
            createParse(input, fragments, ranges) {
                let from = ranges[0].from, to = ranges[ranges.length - 1].to;
                let parser4 = {
                    parsedPos: from,
                    advance () {
                        let cx = currentContext;
                        if (cx) {
                            for (let r of ranges)cx.tempSkipped.push(r);
                            if (until) cx.scheduleOn = cx.scheduleOn ? Promise.all([
                                cx.scheduleOn,
                                until
                            ]) : until;
                        }
                        this.parsedPos = to;
                        return new Tree(NodeType.none, [], [], to - from);
                    },
                    stoppedAt: null,
                    stopAt () {
                    }
                };
                return parser4;
            }
        };
    }
    isDone(upto) {
        upto = Math.min(upto, this.state.doc.length);
        let frags = this.fragments;
        return this.treeLen >= upto && frags.length && frags[0].from == 0 && frags[0].to >= upto;
    }
    static get() {
        return currentContext;
    }
}
function cutFragments(fragments, from, to) {
    return TreeFragment.applyChanges(fragments, [
        {
            fromA: from,
            toA: to,
            fromB: from,
            toB: to
        }
    ]);
}
class LanguageState {
    constructor(context){
        this.context = context;
        this.tree = context.tree;
    }
    apply(tr) {
        if (!tr.docChanged) return this;
        let newCx = this.context.changes(tr.changes, tr.state);
        let upto = this.context.treeLen == tr.startState.doc.length ? undefined : Math.max(tr.changes.mapPos(this.context.treeLen), newCx.viewport.to);
        if (!newCx.work(20, upto)) newCx.takeTree();
        return new LanguageState(newCx);
    }
    static init(state) {
        let vpTo = Math.min(3000, state.doc.length);
        let parseState = new ParseContext(state.facet(language).parser, state, [], Tree.empty, 0, {
            from: 0,
            to: vpTo
        }, [], null);
        if (!parseState.work(20, vpTo)) parseState.takeTree();
        return new LanguageState(parseState);
    }
}
Language.state = StateField.define({
    create: LanguageState.init,
    update (value, tr) {
        for (let e of tr.effects)if (e.is(Language.setState)) return e.value;
        if (tr.startState.facet(language) != tr.state.facet(language)) return LanguageState.init(tr.state);
        return value.apply(tr);
    }
});
let requestIdle = (callback)=>{
    let timeout = setTimeout(()=>callback()
    , 500);
    return ()=>clearTimeout(timeout)
    ;
};
if (typeof requestIdleCallback != "undefined") requestIdle = (callback)=>{
    let idle = -1, timeout = setTimeout(()=>{
        idle = requestIdleCallback(callback, {
            timeout: 500 - 100
        });
    }, 100);
    return ()=>idle < 0 ? clearTimeout(timeout) : cancelIdleCallback(idle)
    ;
};
const parseWorker = ViewPlugin.fromClass(class ParseWorker {
    constructor(view){
        this.view = view;
        this.working = null;
        this.workScheduled = 0;
        this.chunkEnd = -1;
        this.chunkBudget = -1;
        this.work = this.work.bind(this);
        this.scheduleWork();
    }
    update(update) {
        let cx = this.view.state.field(Language.state).context;
        if (cx.updateViewport(update.view.viewport) || this.view.viewport.to > cx.treeLen) this.scheduleWork();
        if (update.docChanged) {
            if (this.view.hasFocus) this.chunkBudget += 50;
            this.scheduleWork();
        }
        this.checkAsyncSchedule(cx);
    }
    scheduleWork() {
        if (this.working) return;
        let { state  } = this.view, field = state.field(Language.state);
        if (field.tree != field.context.tree || !field.context.isDone(state.doc.length)) this.working = requestIdle(this.work);
    }
    work(deadline) {
        this.working = null;
        let now = Date.now();
        if (this.chunkEnd < now && (this.chunkEnd < 0 || this.view.hasFocus)) {
            this.chunkEnd = now + 30000;
            this.chunkBudget = 3000;
        }
        if (this.chunkBudget <= 0) return;
        let { state , viewport: { to: vpTo  }  } = this.view, field = state.field(Language.state);
        if (field.tree == field.context.tree && field.context.isDone(vpTo + 100000)) return;
        let time = Math.min(this.chunkBudget, 100, deadline ? Math.max(25, deadline.timeRemaining() - 5) : 1000000000);
        let viewportFirst = field.context.treeLen < vpTo && state.doc.length > vpTo + 1000;
        let done = field.context.work(time, vpTo + (viewportFirst ? 0 : 100000));
        this.chunkBudget -= Date.now() - now;
        if (done || this.chunkBudget <= 0) {
            field.context.takeTree();
            this.view.dispatch({
                effects: Language.setState.of(new LanguageState(field.context))
            });
        }
        if (this.chunkBudget > 0 && !(done && !viewportFirst)) this.scheduleWork();
        this.checkAsyncSchedule(field.context);
    }
    checkAsyncSchedule(cx) {
        if (cx.scheduleOn) {
            this.workScheduled++;
            cx.scheduleOn.then(()=>this.scheduleWork()
            ).catch((err)=>logException(this.view.state, err)
            ).then(()=>this.workScheduled--
            );
            cx.scheduleOn = null;
        }
    }
    destroy() {
        if (this.working) this.working();
    }
    isWorking() {
        return this.working || this.workScheduled > 0;
    }
}, {
    eventHandlers: {
        focus () {
            this.scheduleWork();
        }
    }
});
const language = Facet.define({
    combine (languages) {
        return languages.length ? languages[0] : null;
    },
    enables: [
        Language.state,
        parseWorker
    ]
});
class LanguageSupport {
    constructor(language1, support = []){
        this.language = language1;
        this.support = support;
        this.extension = [
            language1,
            support
        ];
    }
}
const indentService = Facet.define();
const indentUnit = Facet.define({
    combine: (values)=>{
        if (!values.length) return "  ";
        if (!/^(?: +|\t+)$/.test(values[0])) throw new Error("Invalid indent unit: " + JSON.stringify(values[0]));
        return values[0];
    }
});
function getIndentUnit(state) {
    let unit = state.facet(indentUnit);
    return unit.charCodeAt(0) == 9 ? state.tabSize * unit.length : unit.length;
}
function indentString(state, cols) {
    let result = "", ts = state.tabSize;
    if (state.facet(indentUnit).charCodeAt(0) == 9) while(cols >= ts){
        result += "\t";
        cols -= ts;
    }
    for(let i126 = 0; i126 < cols; i126++)result += " ";
    return result;
}
function getIndentation(context, pos) {
    if (context instanceof EditorState) context = new IndentContext(context);
    for (let service of context.state.facet(indentService)){
        let result = service(context, pos);
        if (result != null) return result;
    }
    let tree = syntaxTree(context.state);
    return tree ? syntaxIndentation(context, tree, pos) : null;
}
class IndentContext {
    constructor(state, options = {
    }){
        this.state = state;
        this.options = options;
        this.unit = getIndentUnit(state);
    }
    lineAt(pos, bias = 1) {
        let line = this.state.doc.lineAt(pos);
        let { simulateBreak  } = this.options;
        if (simulateBreak != null && simulateBreak >= line.from && simulateBreak <= line.to) {
            if (bias < 0 ? simulateBreak < pos : simulateBreak <= pos) return {
                text: line.text.slice(simulateBreak - line.from),
                from: simulateBreak
            };
            else return {
                text: line.text.slice(0, simulateBreak - line.from),
                from: line.from
            };
        }
        return line;
    }
    textAfterPos(pos, bias = 1) {
        if (this.options.simulateDoubleBreak && pos == this.options.simulateBreak) return "";
        let { text , from  } = this.lineAt(pos, bias);
        return text.slice(pos - from, Math.min(text.length, pos + 100 - from));
    }
    column(pos, bias = 1) {
        let { text , from  } = this.lineAt(pos, bias);
        let result = this.countColumn(text, pos - from);
        let override = this.options.overrideIndentation ? this.options.overrideIndentation(from) : -1;
        if (override > -1) result += override - this.countColumn(text, text.search(/\S|$/));
        return result;
    }
    countColumn(line, pos = line.length) {
        return countColumn(line, this.state.tabSize, pos);
    }
    lineIndent(pos, bias = 1) {
        let { text , from  } = this.lineAt(pos, bias);
        let override = this.options.overrideIndentation;
        if (override) {
            let overriden = override(from);
            if (overriden > -1) return overriden;
        }
        return this.countColumn(text, text.search(/\S|$/));
    }
    get simulatedBreak() {
        return this.options.simulateBreak || null;
    }
}
const indentNodeProp = new NodeProp();
function syntaxIndentation(cx, ast, pos) {
    return indentFrom(ast.resolveInner(pos).enterUnfinishedNodesBefore(pos), pos, cx);
}
function ignoreClosed(cx) {
    return cx.pos == cx.options.simulateBreak && cx.options.simulateDoubleBreak;
}
function indentStrategy(tree) {
    let strategy = tree.type.prop(indentNodeProp);
    if (strategy) return strategy;
    let first = tree.firstChild, close;
    if (first && (close = first.type.prop(NodeProp.closedBy))) {
        let last = tree.lastChild, closed = last && close.indexOf(last.name) > -1;
        return (cx)=>delimitedStrategy(cx, true, 1, undefined, closed && !ignoreClosed(cx) ? last.from : undefined)
        ;
    }
    return tree.parent == null ? topIndent : null;
}
function indentFrom(node, pos, base13) {
    for(; node; node = node.parent){
        let strategy = indentStrategy(node);
        if (strategy) return strategy(new TreeIndentContext(base13, pos, node));
    }
    return null;
}
function topIndent() {
    return 0;
}
class TreeIndentContext extends IndentContext {
    constructor(base14, pos, node){
        super(base14.state, base14.options);
        this.base = base14;
        this.pos = pos;
        this.node = node;
    }
    get textAfter() {
        return this.textAfterPos(this.pos);
    }
    get baseIndent() {
        let line = this.state.doc.lineAt(this.node.from);
        for(;;){
            let atBreak = this.node.resolve(line.from);
            while(atBreak.parent && atBreak.parent.from == atBreak.from)atBreak = atBreak.parent;
            if (isParent(atBreak, this.node)) break;
            line = this.state.doc.lineAt(atBreak.from);
        }
        return this.lineIndent(line.from);
    }
    continue() {
        let parent = this.node.parent;
        return parent ? indentFrom(parent, this.pos, this.base) : 0;
    }
}
function isParent(parent, of) {
    for(let cur18 = of; cur18; cur18 = cur18.parent)if (parent == cur18) return true;
    return false;
}
function bracketedAligned(context) {
    let tree = context.node;
    let openToken = tree.childAfter(tree.from), last = tree.lastChild;
    if (!openToken) return null;
    let sim = context.options.simulateBreak;
    let openLine = context.state.doc.lineAt(openToken.from);
    let lineEnd = sim == null || sim <= openLine.from ? openLine.to : Math.min(openLine.to, sim);
    for(let pos = openToken.to;;){
        let next = tree.childAfter(pos);
        if (!next || next == last) return null;
        if (!next.type.isSkipped) return next.from < lineEnd ? openToken : null;
        pos = next.to;
    }
}
function delimitedStrategy(context, align, units, closing1, closedAt) {
    let after = context.textAfter, space1 = after.match(/^\s*/)[0].length;
    let closed = closing1 && after.slice(space1, space1 + closing1.length) == closing1 || closedAt == context.pos + space1;
    let aligned = align ? bracketedAligned(context) : null;
    if (aligned) return closed ? context.column(aligned.from) : context.column(aligned.to);
    return context.baseIndent + (closed ? 0 : context.unit * units);
}
function continuedIndent({ except , units =1  } = {
}) {
    return (context)=>{
        let matchExcept = except && except.test(context.textAfter);
        return context.baseIndent + (matchExcept ? 0 : units * context.unit);
    };
}
function indentOnInput() {
    return EditorState.transactionFilter.of((tr)=>{
        if (!tr.docChanged || !tr.isUserEvent("input.type")) return tr;
        let rules = tr.startState.languageDataAt("indentOnInput", tr.startState.selection.main.head);
        if (!rules.length) return tr;
        let doc25 = tr.newDoc, { head  } = tr.newSelection.main, line = doc25.lineAt(head);
        if (head > line.from + 200) return tr;
        let lineStart = doc25.sliceString(line.from, head);
        if (!rules.some((r)=>r.test(lineStart)
        )) return tr;
        let { state  } = tr, last = -1, changes = [];
        for (let { head: head1  } of state.selection.ranges){
            let line = state.doc.lineAt(head1);
            if (line.from == last) continue;
            last = line.from;
            let indent = getIndentation(state, line.from);
            if (indent == null) continue;
            let cur19 = /^\s*/.exec(line.text)[0];
            let norm = indentString(state, indent);
            if (cur19 != norm) changes.push({
                from: line.from,
                to: line.from + cur19.length,
                insert: norm
            });
        }
        return changes.length ? [
            tr,
            {
                changes,
                sequential: true
            }
        ] : tr;
    });
}
const foldService = Facet.define();
const foldNodeProp = new NodeProp();
function foldInside$1(node) {
    let first = node.firstChild, last = node.lastChild;
    return first && first.to < last.from ? {
        from: first.to,
        to: last.type.isError ? node.to : last.from
    } : null;
}
function syntaxFolding(state, start, end) {
    let tree = syntaxTree(state);
    if (tree.length == 0) return null;
    let inner = tree.resolveInner(end);
    let found = null;
    for(let cur20 = inner; cur20; cur20 = cur20.parent){
        if (cur20.to <= end || cur20.from > end) continue;
        if (found && cur20.from < start) break;
        let prop = cur20.type.prop(foldNodeProp);
        if (prop) {
            let value = prop(cur20, state);
            if (value && value.from <= end && value.from >= start && value.to > end) found = value;
        }
    }
    return found;
}
function foldable(state, lineStart, lineEnd) {
    for (let service of state.facet(foldService)){
        let result = service(state, lineStart, lineEnd);
        if (result) return result;
    }
    return syntaxFolding(state, lineStart, lineEnd);
}
class GutterMarker extends RangeValue {
    compare(other) {
        return this == other || this.constructor == other.constructor && this.eq(other);
    }
    eq(other) {
        return false;
    }
    destroy(dom) {
    }
}
GutterMarker.prototype.elementClass = "";
GutterMarker.prototype.toDOM = undefined;
GutterMarker.prototype.mapMode = MapMode.TrackBefore;
GutterMarker.prototype.startSide = GutterMarker.prototype.endSide = -1;
GutterMarker.prototype.point = true;
const gutterLineClass = Facet.define();
const defaults$1 = {
    class: "",
    renderEmptyElements: false,
    elementStyle: "",
    markers: ()=>RangeSet.empty
    ,
    lineMarker: ()=>null
    ,
    lineMarkerChange: null,
    initialSpacer: null,
    updateSpacer: null,
    domEventHandlers: {
    }
};
const activeGutters = Facet.define();
function gutter(config16) {
    return [
        gutters(),
        activeGutters.of(Object.assign(Object.assign({
        }, defaults$1), config16))
    ];
}
const baseTheme$7 = EditorView.baseTheme({
    ".cm-gutters": {
        display: "flex",
        height: "100%",
        boxSizing: "border-box",
        left: 0,
        zIndex: 200
    },
    "&light .cm-gutters": {
        backgroundColor: "#f5f5f5",
        color: "#999",
        borderRight: "1px solid #ddd"
    },
    "&dark .cm-gutters": {
        backgroundColor: "#333338",
        color: "#ccc"
    },
    ".cm-gutter": {
        display: "flex !important",
        flexDirection: "column",
        flexShrink: 0,
        boxSizing: "border-box",
        minHeight: "100%",
        overflow: "hidden"
    },
    ".cm-gutterElement": {
        boxSizing: "border-box"
    },
    ".cm-lineNumbers .cm-gutterElement": {
        padding: "0 3px 0 5px",
        minWidth: "20px",
        textAlign: "right",
        whiteSpace: "nowrap"
    },
    "&light .cm-activeLineGutter": {
        backgroundColor: "#e2f2ff"
    },
    "&dark .cm-activeLineGutter": {
        backgroundColor: "#222227"
    }
});
const unfixGutters = Facet.define({
    combine: (values)=>values.some((x)=>x
        )
});
function gutters(config17) {
    let result = [
        gutterView,
        baseTheme$7
    ];
    if (config17 && config17.fixed === false) result.push(unfixGutters.of(true));
    return result;
}
const gutterView = ViewPlugin.fromClass(class {
    constructor(view){
        this.view = view;
        this.prevViewport = view.viewport;
        this.dom = document.createElement("div");
        this.dom.className = "cm-gutters";
        this.dom.setAttribute("aria-hidden", "true");
        this.dom.style.minHeight = this.view.contentHeight + "px";
        this.gutters = view.state.facet(activeGutters).map((conf)=>new SingleGutterView(view, conf)
        );
        for (let gutter1 of this.gutters)this.dom.appendChild(gutter1.dom);
        this.fixed = !view.state.facet(unfixGutters);
        if (this.fixed) {
            this.dom.style.position = "sticky";
        }
        this.syncGutters(false);
        view.scrollDOM.insertBefore(this.dom, view.contentDOM);
    }
    update(update) {
        if (this.updateGutters(update)) {
            let vpA = this.prevViewport, vpB = update.view.viewport;
            let vpOverlap = Math.min(vpA.to, vpB.to) - Math.max(vpA.from, vpB.from);
            this.syncGutters(vpOverlap < (vpB.to - vpB.from) * 0.8);
        }
        if (update.geometryChanged) this.dom.style.minHeight = this.view.contentHeight + "px";
        if (this.view.state.facet(unfixGutters) != !this.fixed) {
            this.fixed = !this.fixed;
            this.dom.style.position = this.fixed ? "sticky" : "";
        }
        this.prevViewport = update.view.viewport;
    }
    syncGutters(detach) {
        let after = this.dom.nextSibling;
        if (detach) this.dom.remove();
        let lineClasses = RangeSet.iter(this.view.state.facet(gutterLineClass), this.view.viewport.from);
        let classSet = [];
        let contexts = this.gutters.map((gutter2)=>new UpdateContext(gutter2, this.view.viewport, -this.view.documentPadding.top)
        );
        for (let line of this.view.viewportLineBlocks){
            let text;
            if (Array.isArray(line.type)) {
                for (let b of line.type)if (b.type == BlockType.Text) {
                    text = b;
                    break;
                }
            } else {
                text = line.type == BlockType.Text ? line : undefined;
            }
            if (!text) continue;
            if (classSet.length) classSet = [];
            advanceCursor(lineClasses, classSet, line.from);
            for (let cx of contexts)cx.line(this.view, text, classSet);
        }
        for (let cx of contexts)cx.finish();
        if (detach) this.view.scrollDOM.insertBefore(this.dom, after);
    }
    updateGutters(update) {
        let prev = update.startState.facet(activeGutters), cur21 = update.state.facet(activeGutters);
        let change = update.docChanged || update.heightChanged || update.viewportChanged || !RangeSet.eq(update.startState.facet(gutterLineClass), update.state.facet(gutterLineClass), update.view.viewport.from, update.view.viewport.to);
        if (prev == cur21) {
            for (let gutter3 of this.gutters)if (gutter3.update(update)) change = true;
        } else {
            change = true;
            let gutters1 = [];
            for (let conf of cur21){
                let known = prev.indexOf(conf);
                if (known < 0) {
                    gutters1.push(new SingleGutterView(this.view, conf));
                } else {
                    this.gutters[known].update(update);
                    gutters1.push(this.gutters[known]);
                }
            }
            for (let g of this.gutters){
                g.dom.remove();
                if (gutters1.indexOf(g) < 0) g.destroy();
            }
            for (let g1 of gutters1)this.dom.appendChild(g1.dom);
            this.gutters = gutters1;
        }
        return change;
    }
    destroy() {
        for (let view of this.gutters)view.destroy();
        this.dom.remove();
    }
}, {
    provide: PluginField.scrollMargins.from((value)=>{
        if (value.gutters.length == 0 || !value.fixed) return null;
        return value.view.textDirection == Direction.LTR ? {
            left: value.dom.offsetWidth
        } : {
            right: value.dom.offsetWidth
        };
    })
});
function asArray(val) {
    return Array.isArray(val) ? val : [
        val
    ];
}
function advanceCursor(cursor8, collect, pos) {
    while(cursor8.value && cursor8.from <= pos){
        if (cursor8.from == pos) collect.push(cursor8.value);
        cursor8.next();
    }
}
class UpdateContext {
    constructor(gutter4, viewport, height){
        this.gutter = gutter4;
        this.height = height;
        this.localMarkers = [];
        this.i = 0;
        this.cursor = RangeSet.iter(gutter4.markers, viewport.from);
    }
    line(view, line, extraMarkers) {
        if (this.localMarkers.length) this.localMarkers = [];
        advanceCursor(this.cursor, this.localMarkers, line.from);
        let localMarkers = extraMarkers.length ? this.localMarkers.concat(extraMarkers) : this.localMarkers;
        let forLine = this.gutter.config.lineMarker(view, line, localMarkers);
        if (forLine) localMarkers.unshift(forLine);
        let gutter5 = this.gutter;
        if (localMarkers.length == 0 && !gutter5.config.renderEmptyElements) return;
        let above = line.top - this.height;
        if (this.i == gutter5.elements.length) {
            let newElt = new GutterElement(view, line.height, above, localMarkers);
            gutter5.elements.push(newElt);
            gutter5.dom.appendChild(newElt.dom);
        } else {
            gutter5.elements[this.i].update(view, line.height, above, localMarkers);
        }
        this.height = line.bottom;
        this.i++;
    }
    finish() {
        let gutter6 = this.gutter;
        while(gutter6.elements.length > this.i){
            let last = gutter6.elements.pop();
            gutter6.dom.removeChild(last.dom);
            last.destroy();
        }
    }
}
class SingleGutterView {
    constructor(view, config18){
        this.view = view;
        this.config = config18;
        this.elements = [];
        this.spacer = null;
        this.dom = document.createElement("div");
        this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
        for(let prop in config18.domEventHandlers){
            this.dom.addEventListener(prop, (event)=>{
                let line = view.lineBlockAtHeight(event.clientY - view.documentTop);
                if (config18.domEventHandlers[prop](view, line, event)) event.preventDefault();
            });
        }
        this.markers = asArray(config18.markers(view));
        if (config18.initialSpacer) {
            this.spacer = new GutterElement(view, 0, 0, [
                config18.initialSpacer(view)
            ]);
            this.dom.appendChild(this.spacer.dom);
            this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none";
        }
    }
    update(update) {
        let prevMarkers = this.markers;
        this.markers = asArray(this.config.markers(update.view));
        if (this.spacer && this.config.updateSpacer) {
            let updated = this.config.updateSpacer(this.spacer.markers[0], update);
            if (updated != this.spacer.markers[0]) this.spacer.update(update.view, 0, 0, [
                updated
            ]);
        }
        let vp = update.view.viewport;
        return !RangeSet.eq(this.markers, prevMarkers, vp.from, vp.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(update) : false);
    }
    destroy() {
        for (let elt of this.elements)elt.destroy();
    }
}
class GutterElement {
    constructor(view, height, above, markers){
        this.height = -1;
        this.above = 0;
        this.markers = [];
        this.dom = document.createElement("div");
        this.update(view, height, above, markers);
    }
    update(view, height, above, markers) {
        if (this.height != height) this.dom.style.height = (this.height = height) + "px";
        if (this.above != above) this.dom.style.marginTop = (this.above = above) ? above + "px" : "";
        if (!sameMarkers(this.markers, markers)) this.setMarkers(view, markers);
    }
    setMarkers(view, markers) {
        let cls = "cm-gutterElement", domPos = this.dom.firstChild;
        for(let iNew = 0, iOld = 0;;){
            let skipTo = iOld, marker = iNew < markers.length ? markers[iNew++] : null, matched = false;
            if (marker) {
                let c = marker.elementClass;
                if (c) cls += " " + c;
                for(let i127 = iOld; i127 < this.markers.length; i127++)if (this.markers[i127].compare(marker)) {
                    skipTo = i127;
                    matched = true;
                    break;
                }
            } else {
                skipTo = this.markers.length;
            }
            while(iOld < skipTo){
                let next = this.markers[iOld++];
                if (next.toDOM) {
                    next.destroy(domPos);
                    let after = domPos.nextSibling;
                    domPos.remove();
                    domPos = after;
                }
            }
            if (!marker) break;
            if (marker.toDOM) {
                if (matched) domPos = domPos.nextSibling;
                else this.dom.insertBefore(marker.toDOM(view), domPos);
            }
            if (matched) iOld++;
        }
        this.dom.className = cls;
        this.markers = markers;
    }
    destroy() {
        this.setMarkers(null, []);
    }
}
function sameMarkers(a, b) {
    if (a.length != b.length) return false;
    for(let i128 = 0; i128 < a.length; i128++)if (!a[i128].compare(b[i128])) return false;
    return true;
}
const lineNumberMarkers = Facet.define();
const lineNumberConfig = Facet.define({
    combine (values) {
        return combineConfig(values, {
            formatNumber: String,
            domEventHandlers: {
            }
        }, {
            domEventHandlers (a, b) {
                let result = Object.assign({
                }, a);
                for(let event2 in b){
                    let exists = result[event2], add5 = b[event2];
                    result[event2] = exists ? (view, line, event)=>exists(view, line, event) || add5(view, line, event)
                     : add5;
                }
                return result;
            }
        });
    }
});
class NumberMarker extends GutterMarker {
    constructor(number3){
        super();
        this.number = number3;
    }
    eq(other) {
        return this.number == other.number;
    }
    toDOM() {
        return document.createTextNode(this.number);
    }
}
function formatNumber(view, number4) {
    return view.state.facet(lineNumberConfig).formatNumber(number4, view.state);
}
const lineNumberGutter = activeGutters.compute([
    lineNumberConfig
], (state)=>({
        class: "cm-lineNumbers",
        renderEmptyElements: false,
        markers (view) {
            return view.state.facet(lineNumberMarkers);
        },
        lineMarker (view, line, others) {
            if (others.some((m)=>m.toDOM
            )) return null;
            return new NumberMarker(formatNumber(view, view.state.doc.lineAt(line.from).number));
        },
        lineMarkerChange: (update)=>update.startState.facet(lineNumberConfig) != update.state.facet(lineNumberConfig)
        ,
        initialSpacer (view) {
            return new NumberMarker(formatNumber(view, maxLineNumber(view.state.doc.lines)));
        },
        updateSpacer (spacer, update) {
            let max = formatNumber(update.view, maxLineNumber(update.view.state.doc.lines));
            return max == spacer.number ? spacer : new NumberMarker(max);
        },
        domEventHandlers: state.facet(lineNumberConfig).domEventHandlers
    })
);
function lineNumbers(config19 = {
}) {
    return [
        lineNumberConfig.of(config19),
        gutters(),
        lineNumberGutter
    ];
}
function maxLineNumber(lines) {
    let last = 9;
    while(last < lines)last = last * 10 + 9;
    return last;
}
const activeLineGutterMarker = new class extends GutterMarker {
    constructor(){
        super(...arguments);
        this.elementClass = "cm-activeLineGutter";
    }
};
const activeLineGutterHighlighter = gutterLineClass.compute([
    "selection"
], (state)=>{
    let marks = [], last = -1;
    for (let range of state.selection.ranges)if (range.empty) {
        let linePos = state.doc.lineAt(range.head).from;
        if (linePos > last) {
            last = linePos;
            marks.push(activeLineGutterMarker.range(linePos));
        }
    }
    return RangeSet.of(marks);
});
function highlightActiveLineGutter() {
    return activeLineGutterHighlighter;
}
function mapRange(range, mapping) {
    let from = mapping.mapPos(range.from, 1), to = mapping.mapPos(range.to, -1);
    return from >= to ? undefined : {
        from,
        to
    };
}
const foldEffect = StateEffect.define({
    map: mapRange
});
const unfoldEffect = StateEffect.define({
    map: mapRange
});
function selectedLines(view) {
    let lines = [];
    for (let { head  } of view.state.selection.ranges){
        if (lines.some((l)=>l.from <= head && l.to >= head
        )) continue;
        lines.push(view.lineBlockAt(head));
    }
    return lines;
}
const foldState = StateField.define({
    create () {
        return Decoration.none;
    },
    update (folded, tr) {
        folded = folded.map(tr.changes);
        for (let e of tr.effects){
            if (e.is(foldEffect) && !foldExists(folded, e.value.from, e.value.to)) folded = folded.update({
                add: [
                    foldWidget.range(e.value.from, e.value.to)
                ]
            });
            else if (e.is(unfoldEffect)) folded = folded.update({
                filter: (from, to)=>e.value.from != from || e.value.to != to
                ,
                filterFrom: e.value.from,
                filterTo: e.value.to
            });
        }
        if (tr.selection) {
            let onSelection = false, { head  } = tr.selection.main;
            folded.between(head, head, (a, b)=>{
                if (a < head && b > head) onSelection = true;
            });
            if (onSelection) folded = folded.update({
                filterFrom: head,
                filterTo: head,
                filter: (a, b)=>b <= head || a >= head
            });
        }
        return folded;
    },
    provide: (f)=>EditorView.decorations.from(f)
});
function foldInside(state, from6, to6) {
    var _a;
    let found = null;
    (_a = state.field(foldState, false)) === null || _a === void 0 ? void 0 : _a.between(from6, to6, (from, to)=>{
        if (!found || found.from > from) found = {
            from,
            to
        };
    });
    return found;
}
function foldExists(folded, from, to) {
    let found = false;
    folded.between(from, from, (a, b)=>{
        if (a == from && b == to) found = true;
    });
    return found;
}
function maybeEnable(state, other) {
    return state.field(foldState, false) ? other : other.concat(StateEffect.appendConfig.of(codeFolding()));
}
const foldCode = (view)=>{
    for (let line of selectedLines(view)){
        let range = foldable(view.state, line.from, line.to);
        if (range) {
            view.dispatch({
                effects: maybeEnable(view.state, [
                    foldEffect.of(range),
                    announceFold(view, range)
                ])
            });
            return true;
        }
    }
    return false;
};
const unfoldCode = (view)=>{
    if (!view.state.field(foldState, false)) return false;
    let effects = [];
    for (let line of selectedLines(view)){
        let folded = foldInside(view.state, line.from, line.to);
        if (folded) effects.push(unfoldEffect.of(folded), announceFold(view, folded, false));
    }
    if (effects.length) view.dispatch({
        effects
    });
    return effects.length > 0;
};
function announceFold(view, range, fold = true) {
    let lineFrom = view.state.doc.lineAt(range.from).number, lineTo = view.state.doc.lineAt(range.to).number;
    return EditorView.announce.of(`${view.state.phrase(fold ? "Folded lines" : "Unfolded lines")} ${lineFrom} ${view.state.phrase("to")} ${lineTo}.`);
}
const foldAll = (view)=>{
    let { state  } = view, effects = [];
    for(let pos = 0; pos < state.doc.length;){
        let line = view.lineBlockAt(pos), range = foldable(state, line.from, line.to);
        if (range) effects.push(foldEffect.of(range));
        pos = (range ? view.lineBlockAt(range.to) : line).to + 1;
    }
    if (effects.length) view.dispatch({
        effects: maybeEnable(view.state, effects)
    });
    return !!effects.length;
};
const unfoldAll = (view)=>{
    let field = view.state.field(foldState, false);
    if (!field || !field.size) return false;
    let effects = [];
    field.between(0, view.state.doc.length, (from, to)=>{
        effects.push(unfoldEffect.of({
            from,
            to
        }));
    });
    view.dispatch({
        effects
    });
    return true;
};
const foldKeymap = [
    {
        key: "Ctrl-Shift-[",
        mac: "Cmd-Alt-[",
        run: foldCode
    },
    {
        key: "Ctrl-Shift-]",
        mac: "Cmd-Alt-]",
        run: unfoldCode
    },
    {
        key: "Ctrl-Alt-[",
        run: foldAll
    },
    {
        key: "Ctrl-Alt-]",
        run: unfoldAll
    }
];
const defaultConfig = {
    placeholderDOM: null,
    placeholderText: "…"
};
const foldConfig = Facet.define({
    combine (values) {
        return combineConfig(values, defaultConfig);
    }
});
function codeFolding(config20) {
    let result = [
        foldState,
        baseTheme$6
    ];
    if (config20) result.push(foldConfig.of(config20));
    return result;
}
const foldWidget = Decoration.replace({
    widget: new class extends WidgetType {
        toDOM(view) {
            let { state  } = view, conf = state.facet(foldConfig);
            let onclick = (event)=>{
                let line = view.lineBlockAt(view.posAtDOM(event.target));
                let folded = foldInside(view.state, line.from, line.to);
                if (folded) view.dispatch({
                    effects: unfoldEffect.of(folded)
                });
                event.preventDefault();
            };
            if (conf.placeholderDOM) return conf.placeholderDOM(view, onclick);
            let element = document.createElement("span");
            element.textContent = conf.placeholderText;
            element.setAttribute("aria-label", state.phrase("folded code"));
            element.title = state.phrase("unfold");
            element.className = "cm-foldPlaceholder";
            element.onclick = onclick;
            return element;
        }
    }
});
const foldGutterDefaults = {
    openText: "⌄",
    closedText: "›",
    markerDOM: null,
    domEventHandlers: {
    }
};
class FoldMarker extends GutterMarker {
    constructor(config21, open){
        super();
        this.config = config21;
        this.open = open;
    }
    eq(other) {
        return this.config == other.config && this.open == other.open;
    }
    toDOM(view) {
        if (this.config.markerDOM) return this.config.markerDOM(this.open);
        let span = document.createElement("span");
        span.textContent = this.open ? this.config.openText : this.config.closedText;
        span.title = view.state.phrase(this.open ? "Fold line" : "Unfold line");
        return span;
    }
}
function foldGutter(config22 = {
}) {
    let fullConfig = Object.assign(Object.assign({
    }, foldGutterDefaults), config22);
    let canFold = new FoldMarker(fullConfig, true), canUnfold = new FoldMarker(fullConfig, false);
    let markers = ViewPlugin.fromClass(class {
        constructor(view){
            this.from = view.viewport.from;
            this.markers = this.buildMarkers(view);
        }
        update(update) {
            if (update.docChanged || update.viewportChanged || update.startState.facet(language) != update.state.facet(language) || update.startState.field(foldState, false) != update.state.field(foldState, false)) this.markers = this.buildMarkers(update.view);
        }
        buildMarkers(view) {
            let builder = new RangeSetBuilder();
            for (let line of view.viewportLineBlocks){
                let mark = foldInside(view.state, line.from, line.to) ? canUnfold : foldable(view.state, line.from, line.to) ? canFold : null;
                if (mark) builder.add(line.from, line.from, mark);
            }
            return builder.finish();
        }
    });
    let { domEventHandlers: domEventHandlers1  } = fullConfig;
    return [
        markers,
        gutter({
            class: "cm-foldGutter",
            markers (view) {
                var _a;
                return ((_a = view.plugin(markers)) === null || _a === void 0 ? void 0 : _a.markers) || RangeSet.empty;
            },
            initialSpacer () {
                return new FoldMarker(fullConfig, false);
            },
            domEventHandlers: Object.assign(Object.assign({
            }, domEventHandlers1), {
                click: (view, line, event)=>{
                    if (domEventHandlers1.click && domEventHandlers1.click(view, line, event)) return true;
                    let folded = foldInside(view.state, line.from, line.to);
                    if (folded) {
                        view.dispatch({
                            effects: unfoldEffect.of(folded)
                        });
                        return true;
                    }
                    let range = foldable(view.state, line.from, line.to);
                    if (range) {
                        view.dispatch({
                            effects: foldEffect.of(range)
                        });
                        return true;
                    }
                    return false;
                }
            })
        }),
        codeFolding()
    ];
}
const baseTheme$6 = EditorView.baseTheme({
    ".cm-foldPlaceholder": {
        backgroundColor: "#eee",
        border: "1px solid #ddd",
        color: "#888",
        borderRadius: ".2em",
        margin: "0 1px",
        padding: "0 1px",
        cursor: "pointer"
    },
    ".cm-foldGutter span": {
        padding: "0 1px",
        cursor: "pointer"
    }
});
const baseTheme$5 = EditorView.baseTheme({
    ".cm-matchingBracket": {
        backgroundColor: "#328c8252"
    },
    ".cm-nonmatchingBracket": {
        backgroundColor: "#bb555544"
    }
});
const DefaultBrackets = "()[]{}";
const bracketMatchingConfig = Facet.define({
    combine (configs) {
        return combineConfig(configs, {
            afterCursor: true,
            brackets: DefaultBrackets,
            maxScanDistance: 10000
        });
    }
});
const matchingMark = Decoration.mark({
    class: "cm-matchingBracket"
}), nonmatchingMark = Decoration.mark({
    class: "cm-nonmatchingBracket"
});
const bracketMatchingState = StateField.define({
    create () {
        return Decoration.none;
    },
    update (deco, tr) {
        if (!tr.docChanged && !tr.selection) return deco;
        let decorations5 = [];
        let config23 = tr.state.facet(bracketMatchingConfig);
        for (let range of tr.state.selection.ranges){
            if (!range.empty) continue;
            let match = matchBrackets(tr.state, range.head, -1, config23) || range.head > 0 && matchBrackets(tr.state, range.head - 1, 1, config23) || config23.afterCursor && (matchBrackets(tr.state, range.head, 1, config23) || range.head < tr.state.doc.length && matchBrackets(tr.state, range.head + 1, -1, config23));
            if (!match) continue;
            let mark = match.matched ? matchingMark : nonmatchingMark;
            decorations5.push(mark.range(match.start.from, match.start.to));
            if (match.end) decorations5.push(mark.range(match.end.from, match.end.to));
        }
        return Decoration.set(decorations5, true);
    },
    provide: (f)=>EditorView.decorations.from(f)
});
const bracketMatchingUnique = [
    bracketMatchingState,
    baseTheme$5
];
function bracketMatching(config24 = {
}) {
    return [
        bracketMatchingConfig.of(config24),
        bracketMatchingUnique
    ];
}
function matchingNodes(node, dir, brackets) {
    let byProp = node.prop(dir < 0 ? NodeProp.openedBy : NodeProp.closedBy);
    if (byProp) return byProp;
    if (node.name.length == 1) {
        let index = brackets.indexOf(node.name);
        if (index > -1 && index % 2 == (dir < 0 ? 1 : 0)) return [
            brackets[index + dir]
        ];
    }
    return null;
}
function matchBrackets(state, pos, dir, config25 = {
}) {
    let maxScanDistance = config25.maxScanDistance || 10000, brackets = config25.brackets || DefaultBrackets;
    let tree = syntaxTree(state), node = tree.resolveInner(pos, dir);
    for(let cur22 = node; cur22; cur22 = cur22.parent){
        let matches = matchingNodes(cur22.type, dir, brackets);
        if (matches && cur22.from < cur22.to) return matchMarkedBrackets(state, pos, dir, cur22, matches, brackets);
    }
    return matchPlainBrackets(state, pos, dir, tree, node.type, maxScanDistance, brackets);
}
function matchMarkedBrackets(_state, _pos, dir, token, matching, brackets) {
    let parent = token.parent, firstToken = {
        from: token.from,
        to: token.to
    };
    let depth = 0, cursor9 = parent === null || parent === void 0 ? void 0 : parent.cursor;
    if (cursor9 && (dir < 0 ? cursor9.childBefore(token.from) : cursor9.childAfter(token.to))) do {
        if (dir < 0 ? cursor9.to <= token.from : cursor9.from >= token.to) {
            if (depth == 0 && matching.indexOf(cursor9.type.name) > -1 && cursor9.from < cursor9.to) {
                return {
                    start: firstToken,
                    end: {
                        from: cursor9.from,
                        to: cursor9.to
                    },
                    matched: true
                };
            } else if (matchingNodes(cursor9.type, dir, brackets)) {
                depth++;
            } else if (matchingNodes(cursor9.type, -dir, brackets)) {
                depth--;
                if (depth == 0) return {
                    start: firstToken,
                    end: cursor9.from == cursor9.to ? undefined : {
                        from: cursor9.from,
                        to: cursor9.to
                    },
                    matched: false
                };
            }
        }
    }while (dir < 0 ? cursor9.prevSibling() : cursor9.nextSibling())
    return {
        start: firstToken,
        matched: false
    };
}
function matchPlainBrackets(state, pos, dir, tree, tokenType, maxScanDistance, brackets) {
    let startCh = dir < 0 ? state.sliceDoc(pos - 1, pos) : state.sliceDoc(pos, pos + 1);
    let bracket1 = brackets.indexOf(startCh);
    if (bracket1 < 0 || bracket1 % 2 == 0 != dir > 0) return null;
    let startToken = {
        from: dir < 0 ? pos - 1 : pos,
        to: dir > 0 ? pos + 1 : pos
    };
    let iter = state.doc.iterRange(pos, dir > 0 ? state.doc.length : 0), depth = 0;
    for(let distance = 0; !iter.next().done && distance <= maxScanDistance;){
        let text = iter.value;
        if (dir < 0) distance += text.length;
        let basePos = pos + distance * dir;
        for(let pos2 = dir > 0 ? 0 : text.length - 1, end = dir > 0 ? text.length : -1; pos2 != end; pos2 += dir){
            let found = brackets.indexOf(text[pos2]);
            if (found < 0 || tree.resolve(basePos + pos2, 1).type != tokenType) continue;
            if (found % 2 == 0 == dir > 0) {
                depth++;
            } else if (depth == 1) {
                return {
                    start: startToken,
                    end: {
                        from: basePos + pos2,
                        to: basePos + pos2 + 1
                    },
                    matched: found >> 1 == bracket1 >> 1
                };
            } else {
                depth--;
            }
        }
        if (dir > 0) distance += text.length;
    }
    return iter.done ? {
        start: startToken,
        matched: false
    } : null;
}
function updateSel(sel, by) {
    return EditorSelection.create(sel.ranges.map(by), sel.mainIndex);
}
function setSel(state, selection13) {
    return state.update({
        selection: selection13,
        scrollIntoView: true,
        userEvent: "select"
    });
}
function moveSel({ state , dispatch  }, how) {
    let selection14 = updateSel(state.selection, how);
    if (selection14.eq(state.selection)) return false;
    dispatch(setSel(state, selection14));
    return true;
}
function rangeEnd(range, forward) {
    return EditorSelection.cursor(forward ? range.to : range.from);
}
function cursorByChar(view, forward) {
    return moveSel(view, (range)=>range.empty ? view.moveByChar(range, forward) : rangeEnd(range, forward)
    );
}
const cursorCharLeft = (view)=>cursorByChar(view, view.textDirection != Direction.LTR)
;
const cursorCharRight = (view)=>cursorByChar(view, view.textDirection == Direction.LTR)
;
function cursorByGroup(view, forward) {
    return moveSel(view, (range)=>range.empty ? view.moveByGroup(range, forward) : rangeEnd(range, forward)
    );
}
const cursorGroupLeft = (view)=>cursorByGroup(view, view.textDirection != Direction.LTR)
;
const cursorGroupRight = (view)=>cursorByGroup(view, view.textDirection == Direction.LTR)
;
function interestingNode(state, node, bracketProp) {
    if (node.type.prop(bracketProp)) return true;
    let len = node.to - node.from;
    return len && (len > 2 || /[^\s,.;:]/.test(state.sliceDoc(node.from, node.to))) || node.firstChild;
}
function moveBySyntax(state, start, forward) {
    let pos = syntaxTree(state).resolveInner(start.head);
    let bracketProp = forward ? NodeProp.closedBy : NodeProp.openedBy;
    for(let at = start.head;;){
        let next = forward ? pos.childAfter(at) : pos.childBefore(at);
        if (!next) break;
        if (interestingNode(state, next, bracketProp)) pos = next;
        else at = forward ? next.to : next.from;
    }
    let bracket2 = pos.type.prop(bracketProp), match, newPos;
    if (bracket2 && (match = forward ? matchBrackets(state, pos.from, 1) : matchBrackets(state, pos.to, -1)) && match.matched) newPos = forward ? match.end.to : match.end.from;
    else newPos = forward ? pos.to : pos.from;
    return EditorSelection.cursor(newPos, forward ? -1 : 1);
}
const cursorSyntaxLeft = (view)=>moveSel(view, (range)=>moveBySyntax(view.state, range, view.textDirection != Direction.LTR)
    )
;
const cursorSyntaxRight = (view)=>moveSel(view, (range)=>moveBySyntax(view.state, range, view.textDirection == Direction.LTR)
    )
;
function cursorByLine(view, forward) {
    return moveSel(view, (range)=>{
        if (!range.empty) return rangeEnd(range, forward);
        let moved = view.moveVertically(range, forward);
        return moved.head != range.head ? moved : view.moveToLineBoundary(range, forward);
    });
}
const cursorLineUp = (view)=>cursorByLine(view, false)
;
const cursorLineDown = (view)=>cursorByLine(view, true)
;
function cursorByPage(view, forward) {
    let { state  } = view, selection15 = updateSel(state.selection, (range)=>{
        return range.empty ? view.moveVertically(range, forward, view.dom.clientHeight) : rangeEnd(range, forward);
    });
    if (selection15.eq(state.selection)) return false;
    let startPos = view.coordsAtPos(state.selection.main.head);
    let scrollRect = view.scrollDOM.getBoundingClientRect();
    view.dispatch(setSel(state, selection15), {
        effects: startPos && startPos.top > scrollRect.top && startPos.bottom < scrollRect.bottom ? EditorView.scrollIntoView(selection15.main.head, {
            y: "start",
            yMargin: startPos.top - scrollRect.top
        }) : undefined
    });
    return true;
}
const cursorPageUp = (view)=>cursorByPage(view, false)
;
const cursorPageDown = (view)=>cursorByPage(view, true)
;
function moveByLineBoundary(view, start, forward) {
    let line = view.lineBlockAt(start.head), moved = view.moveToLineBoundary(start, forward);
    if (moved.head == start.head && moved.head != (forward ? line.to : line.from)) moved = view.moveToLineBoundary(start, forward, false);
    if (!forward && moved.head == line.from && line.length) {
        let space2 = /^\s*/.exec(view.state.sliceDoc(line.from, Math.min(line.from + 100, line.to)))[0].length;
        if (space2 && start.head != line.from + space2) moved = EditorSelection.cursor(line.from + space2);
    }
    return moved;
}
const cursorLineBoundaryForward = (view)=>moveSel(view, (range)=>moveByLineBoundary(view, range, true)
    )
;
const cursorLineBoundaryBackward = (view)=>moveSel(view, (range)=>moveByLineBoundary(view, range, false)
    )
;
const cursorLineStart = (view)=>moveSel(view, (range)=>EditorSelection.cursor(view.lineBlockAt(range.head).from, 1)
    )
;
const cursorLineEnd = (view)=>moveSel(view, (range)=>EditorSelection.cursor(view.lineBlockAt(range.head).to, -1)
    )
;
function toMatchingBracket(state, dispatch, extend2) {
    let found = false, selection16 = updateSel(state.selection, (range)=>{
        let matching = matchBrackets(state, range.head, -1) || matchBrackets(state, range.head, 1) || range.head > 0 && matchBrackets(state, range.head - 1, 1) || range.head < state.doc.length && matchBrackets(state, range.head + 1, -1);
        if (!matching || !matching.end) return range;
        found = true;
        let head = matching.start.from == range.head ? matching.end.to : matching.end.from;
        return extend2 ? EditorSelection.range(range.anchor, head) : EditorSelection.cursor(head);
    });
    if (!found) return false;
    dispatch(setSel(state, selection16));
    return true;
}
const cursorMatchingBracket = ({ state , dispatch  })=>toMatchingBracket(state, dispatch, false)
;
function extendSel(view, how) {
    let selection17 = updateSel(view.state.selection, (range)=>{
        let head = how(range);
        return EditorSelection.range(range.anchor, head.head, head.goalColumn);
    });
    if (selection17.eq(view.state.selection)) return false;
    view.dispatch(setSel(view.state, selection17));
    return true;
}
function selectByChar(view, forward) {
    return extendSel(view, (range)=>view.moveByChar(range, forward)
    );
}
const selectCharLeft = (view)=>selectByChar(view, view.textDirection != Direction.LTR)
;
const selectCharRight = (view)=>selectByChar(view, view.textDirection == Direction.LTR)
;
function selectByGroup(view, forward) {
    return extendSel(view, (range)=>view.moveByGroup(range, forward)
    );
}
const selectGroupLeft = (view)=>selectByGroup(view, view.textDirection != Direction.LTR)
;
const selectGroupRight = (view)=>selectByGroup(view, view.textDirection == Direction.LTR)
;
const selectSyntaxLeft = (view)=>extendSel(view, (range)=>moveBySyntax(view.state, range, view.textDirection != Direction.LTR)
    )
;
const selectSyntaxRight = (view)=>extendSel(view, (range)=>moveBySyntax(view.state, range, view.textDirection == Direction.LTR)
    )
;
function selectByLine(view, forward) {
    return extendSel(view, (range)=>view.moveVertically(range, forward)
    );
}
const selectLineUp = (view)=>selectByLine(view, false)
;
const selectLineDown = (view)=>selectByLine(view, true)
;
function selectByPage(view, forward) {
    return extendSel(view, (range)=>view.moveVertically(range, forward, view.dom.clientHeight)
    );
}
const selectPageUp = (view)=>selectByPage(view, false)
;
const selectPageDown = (view)=>selectByPage(view, true)
;
const selectLineBoundaryForward = (view)=>extendSel(view, (range)=>moveByLineBoundary(view, range, true)
    )
;
const selectLineBoundaryBackward = (view)=>extendSel(view, (range)=>moveByLineBoundary(view, range, false)
    )
;
const selectLineStart = (view)=>extendSel(view, (range)=>EditorSelection.cursor(view.lineBlockAt(range.head).from)
    )
;
const selectLineEnd = (view)=>extendSel(view, (range)=>EditorSelection.cursor(view.lineBlockAt(range.head).to)
    )
;
const cursorDocStart = ({ state , dispatch  })=>{
    dispatch(setSel(state, {
        anchor: 0
    }));
    return true;
};
const cursorDocEnd = ({ state , dispatch  })=>{
    dispatch(setSel(state, {
        anchor: state.doc.length
    }));
    return true;
};
const selectDocStart = ({ state , dispatch  })=>{
    dispatch(setSel(state, {
        anchor: state.selection.main.anchor,
        head: 0
    }));
    return true;
};
const selectDocEnd = ({ state , dispatch  })=>{
    dispatch(setSel(state, {
        anchor: state.selection.main.anchor,
        head: state.doc.length
    }));
    return true;
};
const selectAll = ({ state , dispatch  })=>{
    dispatch(state.update({
        selection: {
            anchor: 0,
            head: state.doc.length
        },
        userEvent: "select"
    }));
    return true;
};
const selectLine = ({ state , dispatch  })=>{
    let ranges = selectedLineBlocks(state).map(({ from , to  })=>EditorSelection.range(from, Math.min(to + 1, state.doc.length))
    );
    dispatch(state.update({
        selection: EditorSelection.create(ranges),
        userEvent: "select"
    }));
    return true;
};
const selectParentSyntax = ({ state , dispatch  })=>{
    let selection18 = updateSel(state.selection, (range)=>{
        var _a;
        let context = syntaxTree(state).resolveInner(range.head, 1);
        while(!(context.from < range.from && context.to >= range.to || context.to > range.to && context.from <= range.from || !((_a = context.parent) === null || _a === void 0 ? void 0 : _a.parent)))context = context.parent;
        return EditorSelection.range(context.to, context.from);
    });
    dispatch(setSel(state, selection18));
    return true;
};
const simplifySelection = ({ state , dispatch  })=>{
    let cur23 = state.selection, selection19 = null;
    if (cur23.ranges.length > 1) selection19 = EditorSelection.create([
        cur23.main
    ]);
    else if (!cur23.main.empty) selection19 = EditorSelection.create([
        EditorSelection.cursor(cur23.main.head)
    ]);
    if (!selection19) return false;
    dispatch(setSel(state, selection19));
    return true;
};
function deleteBy({ state , dispatch  }, by) {
    if (state.readOnly) return false;
    let event = "delete.selection";
    let changes = state.changeByRange((range)=>{
        let { from , to  } = range;
        if (from == to) {
            let towards = by(from);
            if (towards < from) event = "delete.backward";
            else if (towards > from) event = "delete.forward";
            from = Math.min(from, towards);
            to = Math.max(to, towards);
        }
        return from == to ? {
            range
        } : {
            changes: {
                from,
                to
            },
            range: EditorSelection.cursor(from)
        };
    });
    if (changes.changes.empty) return false;
    dispatch(state.update(changes, {
        scrollIntoView: true,
        userEvent: event
    }));
    return true;
}
function skipAtomic(target, pos, forward) {
    if (target instanceof EditorView) for (let ranges of target.pluginField(PluginField.atomicRanges))ranges.between(pos, pos, (from, to)=>{
        if (from < pos && to > pos) pos = forward ? to : from;
    });
    return pos;
}
const deleteByChar = (target, forward)=>deleteBy(target, (pos)=>{
        let { state  } = target, line = state.doc.lineAt(pos), before, targetPos;
        if (!forward && pos > line.from && pos < line.from + 200 && !/[^ \t]/.test(before = line.text.slice(0, pos - line.from))) {
            if (before[before.length - 1] == "\t") return pos - 1;
            let col = countColumn(before, state.tabSize), drop = col % getIndentUnit(state) || getIndentUnit(state);
            for(let i129 = 0; i129 < drop && before[before.length - 1 - i129] == " "; i129++)pos--;
            targetPos = pos;
        } else {
            targetPos = findClusterBreak(line.text, pos - line.from, forward, forward) + line.from;
            if (targetPos == pos && line.number != (forward ? state.doc.lines : 1)) targetPos += forward ? 1 : -1;
        }
        return skipAtomic(target, targetPos, forward);
    })
;
const deleteCharBackward = (view)=>deleteByChar(view, false)
;
const deleteCharForward = (view)=>deleteByChar(view, true)
;
const deleteByGroup = (target, forward)=>deleteBy(target, (start)=>{
        let pos = start, { state  } = target, line = state.doc.lineAt(pos);
        let categorize = state.charCategorizer(pos);
        for(let cat = null;;){
            if (pos == (forward ? line.to : line.from)) {
                if (pos == start && line.number != (forward ? state.doc.lines : 1)) pos += forward ? 1 : -1;
                break;
            }
            let next = findClusterBreak(line.text, pos - line.from, forward) + line.from;
            let nextChar1 = line.text.slice(Math.min(pos, next) - line.from, Math.max(pos, next) - line.from);
            let nextCat = categorize(nextChar1);
            if (cat != null && nextCat != cat) break;
            if (nextChar1 != " " || pos != start) cat = nextCat;
            pos = next;
        }
        return skipAtomic(target, pos, forward);
    })
;
const deleteGroupBackward = (target)=>deleteByGroup(target, false)
;
const deleteGroupForward = (target)=>deleteByGroup(target, true)
;
const deleteToLineEnd = (view)=>deleteBy(view, (pos)=>{
        let lineEnd = view.lineBlockAt(pos).to;
        return skipAtomic(view, pos < lineEnd ? lineEnd : Math.min(view.state.doc.length, pos + 1), true);
    })
;
const deleteToLineStart = (view)=>deleteBy(view, (pos)=>{
        let lineStart = view.lineBlockAt(pos).from;
        return skipAtomic(view, pos > lineStart ? lineStart : Math.max(0, pos - 1), false);
    })
;
const splitLine = ({ state , dispatch  })=>{
    if (state.readOnly) return false;
    let changes = state.changeByRange((range)=>{
        return {
            changes: {
                from: range.from,
                to: range.to,
                insert: Text.of([
                    "",
                    ""
                ])
            },
            range: EditorSelection.cursor(range.from)
        };
    });
    dispatch(state.update(changes, {
        scrollIntoView: true,
        userEvent: "input"
    }));
    return true;
};
const transposeChars = ({ state , dispatch  })=>{
    if (state.readOnly) return false;
    let changes = state.changeByRange((range)=>{
        if (!range.empty || range.from == 0 || range.from == state.doc.length) return {
            range
        };
        let pos = range.from, line = state.doc.lineAt(pos);
        let from = pos == line.from ? pos - 1 : findClusterBreak(line.text, pos - line.from, false) + line.from;
        let to = pos == line.to ? pos + 1 : findClusterBreak(line.text, pos - line.from, true) + line.from;
        return {
            changes: {
                from,
                to,
                insert: state.doc.slice(pos, to).append(state.doc.slice(from, pos))
            },
            range: EditorSelection.cursor(to)
        };
    });
    if (changes.changes.empty) return false;
    dispatch(state.update(changes, {
        scrollIntoView: true,
        userEvent: "move.character"
    }));
    return true;
};
function selectedLineBlocks(state) {
    let blocks = [], upto = -1;
    for (let range of state.selection.ranges){
        let startLine = state.doc.lineAt(range.from), endLine = state.doc.lineAt(range.to);
        if (!range.empty && range.to == endLine.from) endLine = state.doc.lineAt(range.to - 1);
        if (upto >= startLine.number) {
            let prev = blocks[blocks.length - 1];
            prev.to = endLine.to;
            prev.ranges.push(range);
        } else {
            blocks.push({
                from: startLine.from,
                to: endLine.to,
                ranges: [
                    range
                ]
            });
        }
        upto = endLine.number + 1;
    }
    return blocks;
}
function moveLine(state, dispatch, forward) {
    if (state.readOnly) return false;
    let changes = [], ranges = [];
    for (let block of selectedLineBlocks(state)){
        if (forward ? block.to == state.doc.length : block.from == 0) continue;
        let nextLine = state.doc.lineAt(forward ? block.to + 1 : block.from - 1);
        let size = nextLine.length + 1;
        if (forward) {
            changes.push({
                from: block.to,
                to: nextLine.to
            }, {
                from: block.from,
                insert: nextLine.text + state.lineBreak
            });
            for (let r of block.ranges)ranges.push(EditorSelection.range(Math.min(state.doc.length, r.anchor + size), Math.min(state.doc.length, r.head + size)));
        } else {
            changes.push({
                from: nextLine.from,
                to: block.from
            }, {
                from: block.to,
                insert: state.lineBreak + nextLine.text
            });
            for (let r of block.ranges)ranges.push(EditorSelection.range(r.anchor - size, r.head - size));
        }
    }
    if (!changes.length) return false;
    dispatch(state.update({
        changes,
        scrollIntoView: true,
        selection: EditorSelection.create(ranges, state.selection.mainIndex),
        userEvent: "move.line"
    }));
    return true;
}
const moveLineUp = ({ state , dispatch  })=>moveLine(state, dispatch, false)
;
const moveLineDown = ({ state , dispatch  })=>moveLine(state, dispatch, true)
;
function copyLine(state, dispatch, forward) {
    if (state.readOnly) return false;
    let changes = [];
    for (let block of selectedLineBlocks(state)){
        if (forward) changes.push({
            from: block.from,
            insert: state.doc.slice(block.from, block.to) + state.lineBreak
        });
        else changes.push({
            from: block.to,
            insert: state.lineBreak + state.doc.slice(block.from, block.to)
        });
    }
    dispatch(state.update({
        changes,
        scrollIntoView: true,
        userEvent: "input.copyline"
    }));
    return true;
}
const copyLineUp = ({ state , dispatch  })=>copyLine(state, dispatch, false)
;
const copyLineDown = ({ state , dispatch  })=>copyLine(state, dispatch, true)
;
const deleteLine = (view)=>{
    if (view.state.readOnly) return false;
    let { state  } = view, changes = state.changes(selectedLineBlocks(state).map(({ from , to  })=>{
        if (from > 0) from--;
        else if (to < state.doc.length) to++;
        return {
            from,
            to
        };
    }));
    let selection20 = updateSel(state.selection, (range)=>view.moveVertically(range, true)
    ).map(changes);
    view.dispatch({
        changes,
        selection: selection20,
        scrollIntoView: true,
        userEvent: "delete.line"
    });
    return true;
};
function isBetweenBrackets(state, pos) {
    if (/\(\)|\[\]|\{\}/.test(state.sliceDoc(pos - 1, pos + 1))) return {
        from: pos,
        to: pos
    };
    let context = syntaxTree(state).resolveInner(pos);
    let before = context.childBefore(pos), after = context.childAfter(pos), closedBy;
    if (before && after && before.to <= pos && after.from >= pos && (closedBy = before.type.prop(NodeProp.closedBy)) && closedBy.indexOf(after.name) > -1 && state.doc.lineAt(before.to).from == state.doc.lineAt(after.from).from) return {
        from: before.to,
        to: after.from
    };
    return null;
}
const insertNewlineAndIndent = newlineAndIndent(false);
const insertBlankLine = newlineAndIndent(true);
function newlineAndIndent(atEof) {
    return ({ state , dispatch  })=>{
        if (state.readOnly) return false;
        let changes = state.changeByRange((range)=>{
            let { from , to  } = range, line = state.doc.lineAt(from);
            let explode = !atEof && from == to && isBetweenBrackets(state, from);
            if (atEof) from = to = (to <= line.to ? line : state.doc.lineAt(to)).to;
            let cx = new IndentContext(state, {
                simulateBreak: from,
                simulateDoubleBreak: !!explode
            });
            let indent = getIndentation(cx, from);
            if (indent == null) indent = /^\s*/.exec(state.doc.lineAt(from).text)[0].length;
            while(to < line.to && /\s/.test(line.text[to - line.from]))to++;
            if (explode) ({ from , to  } = explode);
            else if (from > line.from && from < line.from + 100 && !/\S/.test(line.text.slice(0, from))) from = line.from;
            let insert7 = [
                "",
                indentString(state, indent)
            ];
            if (explode) insert7.push(indentString(state, cx.lineIndent(line.from, -1)));
            return {
                changes: {
                    from,
                    to,
                    insert: Text.of(insert7)
                },
                range: EditorSelection.cursor(from + 1 + insert7[1].length)
            };
        });
        dispatch(state.update(changes, {
            scrollIntoView: true,
            userEvent: "input"
        }));
        return true;
    };
}
function changeBySelectedLine(state, f) {
    let atLine = -1;
    return state.changeByRange((range)=>{
        let changes = [];
        for(let pos = range.from; pos <= range.to;){
            let line = state.doc.lineAt(pos);
            if (line.number > atLine && (range.empty || range.to > line.from)) {
                f(line, changes, range);
                atLine = line.number;
            }
            pos = line.to + 1;
        }
        let changeSet = state.changes(changes);
        return {
            changes,
            range: EditorSelection.range(changeSet.mapPos(range.anchor, 1), changeSet.mapPos(range.head, 1))
        };
    });
}
const indentSelection = ({ state , dispatch  })=>{
    if (state.readOnly) return false;
    let updated = Object.create(null);
    let context = new IndentContext(state, {
        overrideIndentation: (start)=>{
            let found = updated[start];
            return found == null ? -1 : found;
        }
    });
    let changes1 = changeBySelectedLine(state, (line, changes, range)=>{
        let indent = getIndentation(context, line.from);
        if (indent == null) return;
        if (!/\S/.test(line.text)) indent = 0;
        let cur24 = /^\s*/.exec(line.text)[0];
        let norm = indentString(state, indent);
        if (cur24 != norm || range.from < line.from + cur24.length) {
            updated[line.from] = indent;
            changes.push({
                from: line.from,
                to: line.from + cur24.length,
                insert: norm
            });
        }
    });
    if (!changes1.changes.empty) dispatch(state.update(changes1, {
        userEvent: "indent"
    }));
    return true;
};
const indentMore = ({ state , dispatch  })=>{
    if (state.readOnly) return false;
    dispatch(state.update(changeBySelectedLine(state, (line, changes)=>{
        changes.push({
            from: line.from,
            insert: state.facet(indentUnit)
        });
    }), {
        userEvent: "input.indent"
    }));
    return true;
};
const indentLess = ({ state , dispatch  })=>{
    if (state.readOnly) return false;
    dispatch(state.update(changeBySelectedLine(state, (line, changes)=>{
        let space3 = /^\s*/.exec(line.text)[0];
        if (!space3) return;
        let col = countColumn(space3, state.tabSize), keep = 0;
        let insert8 = indentString(state, Math.max(0, col - getIndentUnit(state)));
        while(keep < space3.length && keep < insert8.length && space3.charCodeAt(keep) == insert8.charCodeAt(keep))keep++;
        changes.push({
            from: line.from + keep,
            to: line.from + space3.length,
            insert: insert8.slice(keep)
        });
    }), {
        userEvent: "delete.dedent"
    }));
    return true;
};
const emacsStyleKeymap = [
    {
        key: "Ctrl-b",
        run: cursorCharLeft,
        shift: selectCharLeft,
        preventDefault: true
    },
    {
        key: "Ctrl-f",
        run: cursorCharRight,
        shift: selectCharRight
    },
    {
        key: "Ctrl-p",
        run: cursorLineUp,
        shift: selectLineUp
    },
    {
        key: "Ctrl-n",
        run: cursorLineDown,
        shift: selectLineDown
    },
    {
        key: "Ctrl-a",
        run: cursorLineStart,
        shift: selectLineStart
    },
    {
        key: "Ctrl-e",
        run: cursorLineEnd,
        shift: selectLineEnd
    },
    {
        key: "Ctrl-d",
        run: deleteCharForward
    },
    {
        key: "Ctrl-h",
        run: deleteCharBackward
    },
    {
        key: "Ctrl-k",
        run: deleteToLineEnd
    },
    {
        key: "Ctrl-Alt-h",
        run: deleteGroupBackward
    },
    {
        key: "Ctrl-o",
        run: splitLine
    },
    {
        key: "Ctrl-t",
        run: transposeChars
    },
    {
        key: "Ctrl-v",
        run: cursorPageDown
    }, 
];
const standardKeymap = [
    {
        key: "ArrowLeft",
        run: cursorCharLeft,
        shift: selectCharLeft,
        preventDefault: true
    },
    {
        key: "Mod-ArrowLeft",
        mac: "Alt-ArrowLeft",
        run: cursorGroupLeft,
        shift: selectGroupLeft
    },
    {
        mac: "Cmd-ArrowLeft",
        run: cursorLineBoundaryBackward,
        shift: selectLineBoundaryBackward
    },
    {
        key: "ArrowRight",
        run: cursorCharRight,
        shift: selectCharRight,
        preventDefault: true
    },
    {
        key: "Mod-ArrowRight",
        mac: "Alt-ArrowRight",
        run: cursorGroupRight,
        shift: selectGroupRight
    },
    {
        mac: "Cmd-ArrowRight",
        run: cursorLineBoundaryForward,
        shift: selectLineBoundaryForward
    },
    {
        key: "ArrowUp",
        run: cursorLineUp,
        shift: selectLineUp,
        preventDefault: true
    },
    {
        mac: "Cmd-ArrowUp",
        run: cursorDocStart,
        shift: selectDocStart
    },
    {
        mac: "Ctrl-ArrowUp",
        run: cursorPageUp,
        shift: selectPageUp
    },
    {
        key: "ArrowDown",
        run: cursorLineDown,
        shift: selectLineDown,
        preventDefault: true
    },
    {
        mac: "Cmd-ArrowDown",
        run: cursorDocEnd,
        shift: selectDocEnd
    },
    {
        mac: "Ctrl-ArrowDown",
        run: cursorPageDown,
        shift: selectPageDown
    },
    {
        key: "PageUp",
        run: cursorPageUp,
        shift: selectPageUp
    },
    {
        key: "PageDown",
        run: cursorPageDown,
        shift: selectPageDown
    },
    {
        key: "Home",
        run: cursorLineBoundaryBackward,
        shift: selectLineBoundaryBackward
    },
    {
        key: "Mod-Home",
        run: cursorDocStart,
        shift: selectDocStart
    },
    {
        key: "End",
        run: cursorLineBoundaryForward,
        shift: selectLineBoundaryForward
    },
    {
        key: "Mod-End",
        run: cursorDocEnd,
        shift: selectDocEnd
    },
    {
        key: "Enter",
        run: insertNewlineAndIndent
    },
    {
        key: "Mod-a",
        run: selectAll
    },
    {
        key: "Backspace",
        run: deleteCharBackward,
        shift: deleteCharBackward
    },
    {
        key: "Delete",
        run: deleteCharForward
    },
    {
        key: "Mod-Backspace",
        mac: "Alt-Backspace",
        run: deleteGroupBackward
    },
    {
        key: "Mod-Delete",
        mac: "Alt-Delete",
        run: deleteGroupForward
    },
    {
        mac: "Mod-Backspace",
        run: deleteToLineStart
    },
    {
        mac: "Mod-Delete",
        run: deleteToLineEnd
    }
].concat(emacsStyleKeymap.map((b)=>({
        mac: b.key,
        run: b.run,
        shift: b.shift
    })
));
const defaultKeymap = [
    {
        key: "Alt-ArrowLeft",
        mac: "Ctrl-ArrowLeft",
        run: cursorSyntaxLeft,
        shift: selectSyntaxLeft
    },
    {
        key: "Alt-ArrowRight",
        mac: "Ctrl-ArrowRight",
        run: cursorSyntaxRight,
        shift: selectSyntaxRight
    },
    {
        key: "Alt-ArrowUp",
        run: moveLineUp
    },
    {
        key: "Shift-Alt-ArrowUp",
        run: copyLineUp
    },
    {
        key: "Alt-ArrowDown",
        run: moveLineDown
    },
    {
        key: "Shift-Alt-ArrowDown",
        run: copyLineDown
    },
    {
        key: "Escape",
        run: simplifySelection
    },
    {
        key: "Mod-Enter",
        run: insertBlankLine
    },
    {
        key: "Alt-l",
        mac: "Ctrl-l",
        run: selectLine
    },
    {
        key: "Mod-i",
        run: selectParentSyntax,
        preventDefault: true
    },
    {
        key: "Mod-[",
        run: indentLess
    },
    {
        key: "Mod-]",
        run: indentMore
    },
    {
        key: "Mod-Alt-\\",
        run: indentSelection
    },
    {
        key: "Shift-Mod-k",
        run: deleteLine
    },
    {
        key: "Shift-Mod-\\",
        run: cursorMatchingBracket
    }
].concat(standardKeymap);
const defaults = {
    brackets: [
        "(",
        "[",
        "{",
        "'",
        '"'
    ],
    before: ")]}'\":;>"
};
const closeBracketEffect = StateEffect.define({
    map (value, mapping) {
        let mapped = mapping.mapPos(value, -1, MapMode.TrackAfter);
        return mapped == null ? undefined : mapped;
    }
});
const skipBracketEffect = StateEffect.define({
    map (value, mapping) {
        return mapping.mapPos(value);
    }
});
const closedBracket = new class extends RangeValue {
};
closedBracket.startSide = 1;
closedBracket.endSide = -1;
const bracketState = StateField.define({
    create () {
        return RangeSet.empty;
    },
    update (value, tr) {
        if (tr.selection) {
            let lineStart = tr.state.doc.lineAt(tr.selection.main.head).from;
            let prevLineStart = tr.startState.doc.lineAt(tr.startState.selection.main.head).from;
            if (lineStart != tr.changes.mapPos(prevLineStart, -1)) value = RangeSet.empty;
        }
        value = value.map(tr.changes);
        for (let effect of tr.effects){
            if (effect.is(closeBracketEffect)) value = value.update({
                add: [
                    closedBracket.range(effect.value, effect.value + 1)
                ]
            });
            else if (effect.is(skipBracketEffect)) value = value.update({
                filter: (from)=>from != effect.value
            });
        }
        return value;
    }
});
function closeBrackets() {
    return [
        EditorView.inputHandler.of(handleInput),
        bracketState
    ];
}
const definedClosing = "()[]{}<>";
function closing(ch) {
    for(let i130 = 0; i130 < definedClosing.length; i130 += 2)if (definedClosing.charCodeAt(i130) == ch) return definedClosing.charAt(i130 + 1);
    return fromCodePoint(ch < 128 ? ch : ch + 1);
}
function config(state, pos) {
    return state.languageDataAt("closeBrackets", pos)[0] || defaults;
}
function handleInput(view, from, to, insert9) {
    if (view.composing) return false;
    let sel = view.state.selection.main;
    if (insert9.length > 2 || insert9.length == 2 && codePointSize(codePointAt(insert9, 0)) == 1 || from != sel.from || to != sel.to) return false;
    let tr = insertBracket(view.state, insert9);
    if (!tr) return false;
    view.dispatch(tr);
    return true;
}
const deleteBracketPair = ({ state , dispatch  })=>{
    let conf = config(state, state.selection.main.head);
    let tokens = conf.brackets || defaults.brackets;
    let dont = null, changes = state.changeByRange((range)=>{
        if (range.empty) {
            let before = prevChar(state.doc, range.head);
            for (let token of tokens){
                if (token == before && nextChar(state.doc, range.head) == closing(codePointAt(token, 0))) return {
                    changes: {
                        from: range.head - token.length,
                        to: range.head + token.length
                    },
                    range: EditorSelection.cursor(range.head - token.length),
                    userEvent: "delete.backward"
                };
            }
        }
        return {
            range: dont = range
        };
    });
    if (!dont) dispatch(state.update(changes, {
        scrollIntoView: true
    }));
    return !dont;
};
const closeBracketsKeymap = [
    {
        key: "Backspace",
        run: deleteBracketPair
    }
];
function insertBracket(state, bracket3) {
    let conf = config(state, state.selection.main.head);
    let tokens = conf.brackets || defaults.brackets;
    for (let tok of tokens){
        let closed = closing(codePointAt(tok, 0));
        if (bracket3 == tok) return closed == tok ? handleSame(state, tok, tokens.indexOf(tok + tok + tok) > -1) : handleOpen(state, tok, closed, conf.before || defaults.before);
        if (bracket3 == closed && closedBracketAt(state, state.selection.main.from)) return handleClose(state, tok, closed);
    }
    return null;
}
function closedBracketAt(state, pos) {
    let found = false;
    state.field(bracketState).between(0, state.doc.length, (from)=>{
        if (from == pos) found = true;
    });
    return found;
}
function nextChar(doc26, pos) {
    let next = doc26.sliceString(pos, pos + 2);
    return next.slice(0, codePointSize(codePointAt(next, 0)));
}
function prevChar(doc27, pos) {
    let prev = doc27.sliceString(pos - 2, pos);
    return codePointSize(codePointAt(prev, 0)) == prev.length ? prev : prev.slice(1);
}
function handleOpen(state, open, close, closeBefore) {
    let dont = null, changes = state.changeByRange((range)=>{
        if (!range.empty) return {
            changes: [
                {
                    insert: open,
                    from: range.from
                },
                {
                    insert: close,
                    from: range.to
                }
            ],
            effects: closeBracketEffect.of(range.to + open.length),
            range: EditorSelection.range(range.anchor + open.length, range.head + open.length)
        };
        let next = nextChar(state.doc, range.head);
        if (!next || /\s/.test(next) || closeBefore.indexOf(next) > -1) return {
            changes: {
                insert: open + close,
                from: range.head
            },
            effects: closeBracketEffect.of(range.head + open.length),
            range: EditorSelection.cursor(range.head + open.length)
        };
        return {
            range: dont = range
        };
    });
    return dont ? null : state.update(changes, {
        scrollIntoView: true,
        userEvent: "input.type"
    });
}
function handleClose(state, _open, close) {
    let dont = null, moved = state.selection.ranges.map((range)=>{
        if (range.empty && nextChar(state.doc, range.head) == close) return EditorSelection.cursor(range.head + close.length);
        return dont = range;
    });
    return dont ? null : state.update({
        selection: EditorSelection.create(moved, state.selection.mainIndex),
        scrollIntoView: true,
        effects: state.selection.ranges.map(({ from  })=>skipBracketEffect.of(from)
        )
    });
}
function handleSame(state, token, allowTriple) {
    let dont = null, changes = state.changeByRange((range)=>{
        if (!range.empty) return {
            changes: [
                {
                    insert: token,
                    from: range.from
                },
                {
                    insert: token,
                    from: range.to
                }
            ],
            effects: closeBracketEffect.of(range.to + token.length),
            range: EditorSelection.range(range.anchor + token.length, range.head + token.length)
        };
        let pos = range.head, next = nextChar(state.doc, pos);
        if (next == token) {
            if (nodeStart(state, pos)) {
                return {
                    changes: {
                        insert: token + token,
                        from: pos
                    },
                    effects: closeBracketEffect.of(pos + token.length),
                    range: EditorSelection.cursor(pos + token.length)
                };
            } else if (closedBracketAt(state, pos)) {
                let isTriple = allowTriple && state.sliceDoc(pos, pos + token.length * 3) == token + token + token;
                return {
                    range: EditorSelection.cursor(pos + token.length * (isTriple ? 3 : 1)),
                    effects: skipBracketEffect.of(pos)
                };
            }
        } else if (allowTriple && state.sliceDoc(pos - 2 * token.length, pos) == token + token && nodeStart(state, pos - 2 * token.length)) {
            return {
                changes: {
                    insert: token + token + token + token,
                    from: pos
                },
                effects: closeBracketEffect.of(pos + token.length),
                range: EditorSelection.cursor(pos + token.length)
            };
        } else if (state.charCategorizer(pos)(next) != CharCategory.Word) {
            let prev = state.sliceDoc(pos - 1, pos);
            if (prev != token && state.charCategorizer(pos)(prev) != CharCategory.Word) return {
                changes: {
                    insert: token + token,
                    from: pos
                },
                effects: closeBracketEffect.of(pos + token.length),
                range: EditorSelection.cursor(pos + token.length)
            };
        }
        return {
            range: dont = range
        };
    });
    return dont ? null : state.update(changes, {
        scrollIntoView: true,
        userEvent: "input.type"
    });
}
function nodeStart(state, pos) {
    let tree = syntaxTree(state).resolveInner(pos + 1);
    return tree.parent && tree.from == pos;
}
const panelConfig = Facet.define({
    combine (configs) {
        let topContainer, bottomContainer;
        for (let c of configs){
            topContainer = topContainer || c.topContainer;
            bottomContainer = bottomContainer || c.bottomContainer;
        }
        return {
            topContainer,
            bottomContainer
        };
    }
});
function getPanel(view, panel) {
    let plugin = view.plugin(panelPlugin);
    let index = plugin ? plugin.specs.indexOf(panel) : -1;
    return index > -1 ? plugin.panels[index] : null;
}
const panelPlugin = ViewPlugin.fromClass(class {
    constructor(view){
        this.input = view.state.facet(showPanel);
        this.specs = this.input.filter((s)=>s
        );
        this.panels = this.specs.map((spec)=>spec(view)
        );
        let conf = view.state.facet(panelConfig);
        this.top = new PanelGroup(view, true, conf.topContainer);
        this.bottom = new PanelGroup(view, false, conf.bottomContainer);
        this.top.sync(this.panels.filter((p13)=>p13.top
        ));
        this.bottom.sync(this.panels.filter((p14)=>!p14.top
        ));
        for (let p12 of this.panels){
            p12.dom.classList.add("cm-panel");
            if (p12.mount) p12.mount();
        }
    }
    update(update) {
        let conf = update.state.facet(panelConfig);
        if (this.top.container != conf.topContainer) {
            this.top.sync([]);
            this.top = new PanelGroup(update.view, true, conf.topContainer);
        }
        if (this.bottom.container != conf.bottomContainer) {
            this.bottom.sync([]);
            this.bottom = new PanelGroup(update.view, false, conf.bottomContainer);
        }
        this.top.syncClasses();
        this.bottom.syncClasses();
        let input = update.state.facet(showPanel);
        if (input != this.input) {
            let specs = input.filter((x)=>x
            );
            let panels = [], top31 = [], bottom = [], mount = [];
            for (let spec of specs){
                let known = this.specs.indexOf(spec), panel;
                if (known < 0) {
                    panel = spec(update.view);
                    mount.push(panel);
                } else {
                    panel = this.panels[known];
                    if (panel.update) panel.update(update);
                }
                panels.push(panel);
                (panel.top ? top31 : bottom).push(panel);
            }
            this.specs = specs;
            this.panels = panels;
            this.top.sync(top31);
            this.bottom.sync(bottom);
            for (let p15 of mount){
                p15.dom.classList.add("cm-panel");
                if (p15.mount) p15.mount();
            }
        } else {
            for (let p16 of this.panels)if (p16.update) p16.update(update);
        }
    }
    destroy() {
        this.top.sync([]);
        this.bottom.sync([]);
    }
}, {
    provide: PluginField.scrollMargins.from((value)=>({
            top: value.top.scrollMargin(),
            bottom: value.bottom.scrollMargin()
        })
    )
});
class PanelGroup {
    constructor(view, top32, container){
        this.view = view;
        this.top = top32;
        this.container = container;
        this.dom = undefined;
        this.classes = "";
        this.panels = [];
        this.syncClasses();
    }
    sync(panels) {
        for (let p17 of this.panels)if (p17.destroy && panels.indexOf(p17) < 0) p17.destroy();
        this.panels = panels;
        this.syncDOM();
    }
    syncDOM() {
        if (this.panels.length == 0) {
            if (this.dom) {
                this.dom.remove();
                this.dom = undefined;
            }
            return;
        }
        if (!this.dom) {
            this.dom = document.createElement("div");
            this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom";
            this.dom.style[this.top ? "top" : "bottom"] = "0";
            let parent = this.container || this.view.dom;
            parent.insertBefore(this.dom, this.top ? parent.firstChild : null);
        }
        let curDOM = this.dom.firstChild;
        for (let panel of this.panels){
            if (panel.dom.parentNode == this.dom) {
                while(curDOM != panel.dom)curDOM = rm(curDOM);
                curDOM = curDOM.nextSibling;
            } else {
                this.dom.insertBefore(panel.dom, curDOM);
            }
        }
        while(curDOM)curDOM = rm(curDOM);
    }
    scrollMargin() {
        return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
    }
    syncClasses() {
        if (!this.container || this.classes == this.view.themeClasses) return;
        for (let cls of this.classes.split(" "))if (cls) this.container.classList.remove(cls);
        for (let cls1 of (this.classes = this.view.themeClasses).split(" "))if (cls1) this.container.classList.add(cls1);
    }
}
function rm(node) {
    let next = node.nextSibling;
    node.remove();
    return next;
}
const baseTheme$4 = EditorView.baseTheme({
    ".cm-panels": {
        boxSizing: "border-box",
        position: "sticky",
        left: 0,
        right: 0
    },
    "&light .cm-panels": {
        backgroundColor: "#f5f5f5",
        color: "black"
    },
    "&light .cm-panels-top": {
        borderBottom: "1px solid #ddd"
    },
    "&light .cm-panels-bottom": {
        borderTop: "1px solid #ddd"
    },
    "&dark .cm-panels": {
        backgroundColor: "#333338",
        color: "white"
    }
});
const showPanel = Facet.define({
    enables: [
        panelPlugin,
        baseTheme$4
    ]
});
function crelt() {
    var elt = arguments[0];
    if (typeof elt == "string") elt = document.createElement(elt);
    var i131 = 1, next = arguments[1];
    if (next && typeof next == "object" && next.nodeType == null && !Array.isArray(next)) {
        for(var name16 in next)if (Object.prototype.hasOwnProperty.call(next, name16)) {
            var value = next[name16];
            if (typeof value == "string") elt.setAttribute(name16, value);
            else if (value != null) elt[name16] = value;
        }
        i131++;
    }
    for(; i131 < arguments.length; i131++)add(elt, arguments[i131]);
    return elt;
}
function add(elt, child) {
    if (typeof child == "string") {
        elt.appendChild(document.createTextNode(child));
    } else if (child == null) ;
    else if (child.nodeType != null) {
        elt.appendChild(child);
    } else if (Array.isArray(child)) {
        for(var i132 = 0; i132 < child.length; i132++)add(elt, child[i132]);
    } else {
        throw new RangeError("Unsupported child node: " + child);
    }
}
const basicNormalize = typeof String.prototype.normalize == "function" ? (x)=>x.normalize("NFKD")
 : (x)=>x
;
class SearchCursor {
    constructor(text, query, from = 0, to = text.length, normalize){
        this.value = {
            from: 0,
            to: 0
        };
        this.done = false;
        this.matches = [];
        this.buffer = "";
        this.bufferPos = 0;
        this.iter = text.iterRange(from, to);
        this.bufferStart = from;
        this.normalize = normalize ? (x)=>normalize(basicNormalize(x))
         : basicNormalize;
        this.query = this.normalize(query);
    }
    peek() {
        if (this.bufferPos == this.buffer.length) {
            this.bufferStart += this.buffer.length;
            this.iter.next();
            if (this.iter.done) return -1;
            this.bufferPos = 0;
            this.buffer = this.iter.value;
        }
        return codePointAt(this.buffer, this.bufferPos);
    }
    next() {
        while(this.matches.length)this.matches.pop();
        return this.nextOverlapping();
    }
    nextOverlapping() {
        for(;;){
            let next = this.peek();
            if (next < 0) {
                this.done = true;
                return this;
            }
            let str = fromCodePoint(next), start = this.bufferStart + this.bufferPos;
            this.bufferPos += codePointSize(next);
            let norm = this.normalize(str);
            for(let i133 = 0, pos = start;; i133++){
                let code9 = norm.charCodeAt(i133);
                let match = this.match(code9, pos);
                if (match) {
                    this.value = match;
                    return this;
                }
                if (i133 == norm.length - 1) break;
                if (pos == start && i133 < str.length && str.charCodeAt(i133) == code9) pos++;
            }
        }
    }
    match(code10, pos) {
        let match = null;
        for(let i134 = 0; i134 < this.matches.length; i134 += 2){
            let index = this.matches[i134], keep = false;
            if (this.query.charCodeAt(index) == code10) {
                if (index == this.query.length - 1) {
                    match = {
                        from: this.matches[i134 + 1],
                        to: pos + 1
                    };
                } else {
                    this.matches[i134]++;
                    keep = true;
                }
            }
            if (!keep) {
                this.matches.splice(i134, 2);
                i134 -= 2;
            }
        }
        if (this.query.charCodeAt(0) == code10) {
            if (this.query.length == 1) match = {
                from: pos,
                to: pos + 1
            };
            else this.matches.push(1, pos);
        }
        return match;
    }
}
if (typeof Symbol != "undefined") SearchCursor.prototype[Symbol.iterator] = function() {
    return this;
};
const empty = {
    from: -1,
    to: -1,
    match: /.*/.exec("")
};
const baseFlags = "gm" + (/x/.unicode == null ? "" : "u");
class RegExpCursor {
    constructor(text, query, options, from = 0, to = text.length){
        this.to = to;
        this.curLine = "";
        this.done = false;
        this.value = empty;
        if (/\\[sWDnr]|\n|\r|\[\^/.test(query)) return new MultilineRegExpCursor(text, query, options, from, to);
        this.re = new RegExp(query, baseFlags + ((options === null || options === void 0 ? void 0 : options.ignoreCase) ? "i" : ""));
        this.iter = text.iter();
        let startLine = text.lineAt(from);
        this.curLineStart = startLine.from;
        this.matchPos = from;
        this.getLine(this.curLineStart);
    }
    getLine(skip) {
        this.iter.next(skip);
        if (this.iter.lineBreak) {
            this.curLine = "";
        } else {
            this.curLine = this.iter.value;
            if (this.curLineStart + this.curLine.length > this.to) this.curLine = this.curLine.slice(0, this.to - this.curLineStart);
            this.iter.next();
        }
    }
    nextLine() {
        this.curLineStart = this.curLineStart + this.curLine.length + 1;
        if (this.curLineStart > this.to) this.curLine = "";
        else this.getLine(0);
    }
    next() {
        for(let off = this.matchPos - this.curLineStart;;){
            this.re.lastIndex = off;
            let match = this.matchPos <= this.to && this.re.exec(this.curLine);
            if (match) {
                let from = this.curLineStart + match.index, to = from + match[0].length;
                this.matchPos = to + (from == to ? 1 : 0);
                if (from == this.curLine.length) this.nextLine();
                if (from < to || from > this.value.to) {
                    this.value = {
                        from,
                        to,
                        match
                    };
                    return this;
                }
                off = this.matchPos - this.curLineStart;
            } else if (this.curLineStart + this.curLine.length < this.to) {
                this.nextLine();
                off = 0;
            } else {
                this.done = true;
                return this;
            }
        }
    }
}
const flattened = new WeakMap();
class FlattenedDoc {
    constructor(from, text){
        this.from = from;
        this.text = text;
    }
    get to() {
        return this.from + this.text.length;
    }
    static get(doc28, from, to) {
        let cached = flattened.get(doc28);
        if (!cached || cached.from >= to || cached.to <= from) {
            let flat = new FlattenedDoc(from, doc28.sliceString(from, to));
            flattened.set(doc28, flat);
            return flat;
        }
        if (cached.from == from && cached.to == to) return cached;
        let { text , from: cachedFrom  } = cached;
        if (cachedFrom > from) {
            text = doc28.sliceString(from, cachedFrom) + text;
            cachedFrom = from;
        }
        if (cached.to < to) text += doc28.sliceString(cached.to, to);
        flattened.set(doc28, new FlattenedDoc(cachedFrom, text));
        return new FlattenedDoc(from, text.slice(from - cachedFrom, to - cachedFrom));
    }
}
class MultilineRegExpCursor {
    constructor(text, query, options, from, to){
        this.text = text;
        this.to = to;
        this.done = false;
        this.value = empty;
        this.matchPos = from;
        this.re = new RegExp(query, baseFlags + ((options === null || options === void 0 ? void 0 : options.ignoreCase) ? "i" : ""));
        this.flat = FlattenedDoc.get(text, from, this.chunkEnd(from + 5000));
    }
    chunkEnd(pos) {
        return pos >= this.to ? this.to : this.text.lineAt(pos).to;
    }
    next() {
        for(;;){
            let off = this.re.lastIndex = this.matchPos - this.flat.from;
            let match = this.re.exec(this.flat.text);
            if (match && !match[0] && match.index == off) {
                this.re.lastIndex = off + 1;
                match = this.re.exec(this.flat.text);
            }
            if (match && this.flat.to < this.to && match.index + match[0].length > this.flat.text.length - 10) match = null;
            if (match) {
                let from = this.flat.from + match.index, to = from + match[0].length;
                this.value = {
                    from,
                    to,
                    match
                };
                this.matchPos = to + (from == to ? 1 : 0);
                return this;
            } else {
                if (this.flat.to == this.to) {
                    this.done = true;
                    return this;
                }
                this.flat = FlattenedDoc.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
            }
        }
    }
}
if (typeof Symbol != "undefined") {
    RegExpCursor.prototype[Symbol.iterator] = MultilineRegExpCursor.prototype[Symbol.iterator] = function() {
        return this;
    };
}
function validRegExp(source) {
    try {
        new RegExp(source, baseFlags);
        return true;
    } catch (_a) {
        return false;
    }
}
function createLineDialog(view) {
    let input = crelt("input", {
        class: "cm-textfield",
        name: "line"
    });
    let dom = crelt("form", {
        class: "cm-gotoLine",
        onkeydown: (event)=>{
            if (event.keyCode == 27) {
                event.preventDefault();
                view.dispatch({
                    effects: dialogEffect.of(false)
                });
                view.focus();
            } else if (event.keyCode == 13) {
                event.preventDefault();
                go();
            }
        },
        onsubmit: (event)=>{
            event.preventDefault();
            go();
        }
    }, crelt("label", view.state.phrase("Go to line"), ": ", input), " ", crelt("button", {
        class: "cm-button",
        type: "submit"
    }, view.state.phrase("go")));
    function go() {
        let match = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(input.value);
        if (!match) return;
        let { state  } = view, startLine = state.doc.lineAt(state.selection.main.head);
        let [, sign, ln, cl, percent] = match;
        let col = cl ? +cl.slice(1) : 0;
        let line = ln ? +ln : startLine.number;
        if (ln && percent) {
            let pc = line / 100;
            if (sign) pc = pc * (sign == "-" ? -1 : 1) + startLine.number / state.doc.lines;
            line = Math.round(state.doc.lines * pc);
        } else if (ln && sign) {
            line = line * (sign == "-" ? -1 : 1) + startLine.number;
        }
        let docLine = state.doc.line(Math.max(1, Math.min(state.doc.lines, line)));
        view.dispatch({
            effects: dialogEffect.of(false),
            selection: EditorSelection.cursor(docLine.from + Math.max(0, Math.min(col, docLine.length))),
            scrollIntoView: true
        });
        view.focus();
    }
    return {
        dom,
        pos: -10
    };
}
const dialogEffect = StateEffect.define();
const dialogField = StateField.define({
    create () {
        return true;
    },
    update (value, tr) {
        for (let e of tr.effects)if (e.is(dialogEffect)) value = e.value;
        return value;
    },
    provide: (f)=>showPanel.from(f, (val)=>val ? createLineDialog : null
        )
});
const gotoLine = (view)=>{
    let panel = getPanel(view, createLineDialog);
    if (!panel) {
        let effects = [
            dialogEffect.of(true)
        ];
        if (view.state.field(dialogField, false) == null) effects.push(StateEffect.appendConfig.of([
            dialogField,
            baseTheme$1$1
        ]));
        view.dispatch({
            effects
        });
        panel = getPanel(view, createLineDialog);
    }
    if (panel) panel.dom.querySelector("input").focus();
    return true;
};
const baseTheme$1$1 = EditorView.baseTheme({
    ".cm-panel.cm-gotoLine": {
        padding: "2px 6px 4px",
        "& label": {
            fontSize: "80%"
        }
    }
});
const defaultHighlightOptions = {
    highlightWordAroundCursor: false,
    minSelectionLength: 1,
    maxMatches: 100
};
const highlightConfig = Facet.define({
    combine (options) {
        return combineConfig(options, defaultHighlightOptions, {
            highlightWordAroundCursor: (a, b)=>a || b
            ,
            minSelectionLength: Math.min,
            maxMatches: Math.min
        });
    }
});
function highlightSelectionMatches(options) {
    let ext = [
        defaultTheme,
        matchHighlighter
    ];
    if (options) ext.push(highlightConfig.of(options));
    return ext;
}
const matchDeco = Decoration.mark({
    class: "cm-selectionMatch"
});
const mainMatchDeco = Decoration.mark({
    class: "cm-selectionMatch cm-selectionMatch-main"
});
const matchHighlighter = ViewPlugin.fromClass(class {
    constructor(view){
        this.decorations = this.getDeco(view);
    }
    update(update) {
        if (update.selectionSet || update.docChanged || update.viewportChanged) this.decorations = this.getDeco(update.view);
    }
    getDeco(view) {
        let conf = view.state.facet(highlightConfig);
        let { state  } = view, sel = state.selection;
        if (sel.ranges.length > 1) return Decoration.none;
        let range = sel.main, query, check = null;
        if (range.empty) {
            if (!conf.highlightWordAroundCursor) return Decoration.none;
            let word = state.wordAt(range.head);
            if (!word) return Decoration.none;
            check = state.charCategorizer(range.head);
            query = state.sliceDoc(word.from, word.to);
        } else {
            let len = range.to - range.from;
            if (len < conf.minSelectionLength || len > 200) return Decoration.none;
            query = state.sliceDoc(range.from, range.to).trim();
            if (!query) return Decoration.none;
        }
        let deco = [];
        for (let part of view.visibleRanges){
            let cursor10 = new SearchCursor(state.doc, query, part.from, part.to);
            while(!cursor10.next().done){
                let { from , to  } = cursor10.value;
                if (!check || (from == 0 || check(state.sliceDoc(from - 1, from)) != CharCategory.Word) && (to == state.doc.length || check(state.sliceDoc(to, to + 1)) != CharCategory.Word)) {
                    if (check && from <= range.from && to >= range.to) deco.push(mainMatchDeco.range(from, to));
                    else if (from >= range.to || to <= range.from) deco.push(matchDeco.range(from, to));
                    if (deco.length > conf.maxMatches) return Decoration.none;
                }
            }
        }
        return Decoration.set(deco);
    }
}, {
    decorations: (v)=>v.decorations
});
const defaultTheme = EditorView.baseTheme({
    ".cm-selectionMatch": {
        backgroundColor: "#99ff7780"
    },
    ".cm-searchMatch .cm-selectionMatch": {
        backgroundColor: "transparent"
    }
});
const selectWord = ({ state , dispatch  })=>{
    let { selection: selection21  } = state;
    let newSel = EditorSelection.create(selection21.ranges.map((range)=>state.wordAt(range.head) || EditorSelection.cursor(range.head)
    ), selection21.mainIndex);
    if (newSel.eq(selection21)) return false;
    dispatch(state.update({
        selection: newSel
    }));
    return true;
};
function findNextOccurrence(state, query) {
    let { main , ranges  } = state.selection;
    let word = state.wordAt(main.head), fullWord = word && word.from == main.from && word.to == main.to;
    for(let cycled = false, cursor11 = new SearchCursor(state.doc, query, ranges[ranges.length - 1].to);;){
        cursor11.next();
        if (cursor11.done) {
            if (cycled) return null;
            cursor11 = new SearchCursor(state.doc, query, 0, Math.max(0, ranges[ranges.length - 1].from - 1));
            cycled = true;
        } else {
            if (cycled && ranges.some((r)=>r.from == cursor11.value.from
            )) continue;
            if (fullWord) {
                let word = state.wordAt(cursor11.value.from);
                if (!word || word.from != cursor11.value.from || word.to != cursor11.value.to) continue;
            }
            return cursor11.value;
        }
    }
}
const selectNextOccurrence = ({ state , dispatch  })=>{
    let { ranges  } = state.selection;
    if (ranges.some((sel)=>sel.from === sel.to
    )) return selectWord({
        state,
        dispatch
    });
    let searchedText = state.sliceDoc(ranges[0].from, ranges[0].to);
    if (state.selection.ranges.some((r)=>state.sliceDoc(r.from, r.to) != searchedText
    )) return false;
    let range = findNextOccurrence(state, searchedText);
    if (!range) return false;
    dispatch(state.update({
        selection: state.selection.addRange(EditorSelection.range(range.from, range.to), false),
        effects: EditorView.scrollIntoView(range.to)
    }));
    return true;
};
const searchConfigFacet = Facet.define({
    combine (configs) {
        var _a;
        return {
            top: configs.reduce((val, conf)=>val !== null && val !== void 0 ? val : conf.top
            , undefined) || false,
            caseSensitive: configs.reduce((val, conf)=>val !== null && val !== void 0 ? val : conf.caseSensitive || conf.matchCase
            , undefined) || false,
            createPanel: ((_a = configs.find((c)=>c.createPanel
            )) === null || _a === void 0 ? void 0 : _a.createPanel) || ((view)=>new SearchPanel(view)
            )
        };
    }
});
class SearchQuery {
    constructor(config26){
        this.search = config26.search;
        this.caseSensitive = !!config26.caseSensitive;
        this.regexp = !!config26.regexp;
        this.replace = config26.replace || "";
        this.valid = !!this.search && (!this.regexp || validRegExp(this.search));
    }
    eq(other) {
        return this.search == other.search && this.replace == other.replace && this.caseSensitive == other.caseSensitive && this.regexp == other.regexp;
    }
    create() {
        return this.regexp ? new RegExpQuery(this) : new StringQuery(this);
    }
}
class QueryType {
    constructor(spec){
        this.spec = spec;
    }
}
class StringQuery extends QueryType {
    constructor(spec){
        super(spec);
        this.unquoted = spec.search.replace(/\\([nrt\\])/g, (_, ch)=>ch == "n" ? "\n" : ch == "r" ? "\r" : ch == "t" ? "\t" : "\\"
        );
    }
    cursor(doc29, from = 0, to = doc29.length) {
        return new SearchCursor(doc29, this.unquoted, from, to, this.spec.caseSensitive ? undefined : (x)=>x.toLowerCase()
        );
    }
    nextMatch(doc30, curFrom, curTo) {
        let cursor12 = this.cursor(doc30, curTo).nextOverlapping();
        if (cursor12.done) cursor12 = this.cursor(doc30, 0, curFrom).nextOverlapping();
        return cursor12.done ? null : cursor12.value;
    }
    prevMatchInRange(doc31, from, to) {
        for(let pos = to;;){
            let start = Math.max(from, pos - 10000 - this.unquoted.length);
            let cursor13 = this.cursor(doc31, start, pos), range = null;
            while(!cursor13.nextOverlapping().done)range = cursor13.value;
            if (range) return range;
            if (start == from) return null;
            pos -= 10000;
        }
    }
    prevMatch(doc32, curFrom, curTo) {
        return this.prevMatchInRange(doc32, 0, curFrom) || this.prevMatchInRange(doc32, curTo, doc32.length);
    }
    getReplacement(_result) {
        return this.spec.replace;
    }
    matchAll(doc33, limit) {
        let cursor14 = this.cursor(doc33), ranges = [];
        while(!cursor14.next().done){
            if (ranges.length >= limit) return null;
            ranges.push(cursor14.value);
        }
        return ranges;
    }
    highlight(doc34, from, to, add6) {
        let cursor15 = this.cursor(doc34, Math.max(0, from - this.unquoted.length), Math.min(to + this.unquoted.length, doc34.length));
        while(!cursor15.next().done)add6(cursor15.value.from, cursor15.value.to);
    }
}
class RegExpQuery extends QueryType {
    cursor(doc35, from = 0, to = doc35.length) {
        return new RegExpCursor(doc35, this.spec.search, this.spec.caseSensitive ? undefined : {
            ignoreCase: true
        }, from, to);
    }
    nextMatch(doc36, curFrom, curTo) {
        let cursor16 = this.cursor(doc36, curTo).next();
        if (cursor16.done) cursor16 = this.cursor(doc36, 0, curFrom).next();
        return cursor16.done ? null : cursor16.value;
    }
    prevMatchInRange(doc37, from, to) {
        for(let size = 1;; size++){
            let start = Math.max(from, to - size * 10000);
            let cursor17 = this.cursor(doc37, start, to), range = null;
            while(!cursor17.next().done)range = cursor17.value;
            if (range && (start == from || range.from > start + 10)) return range;
            if (start == from) return null;
        }
    }
    prevMatch(doc38, curFrom, curTo) {
        return this.prevMatchInRange(doc38, 0, curFrom) || this.prevMatchInRange(doc38, curTo, doc38.length);
    }
    getReplacement(result) {
        return this.spec.replace.replace(/\$([$&\d+])/g, (m, i135)=>i135 == "$" ? "$" : i135 == "&" ? result.match[0] : i135 != "0" && +i135 < result.match.length ? result.match[i135] : m
        );
    }
    matchAll(doc39, limit) {
        let cursor18 = this.cursor(doc39), ranges = [];
        while(!cursor18.next().done){
            if (ranges.length >= limit) return null;
            ranges.push(cursor18.value);
        }
        return ranges;
    }
    highlight(doc40, from, to, add7) {
        let cursor19 = this.cursor(doc40, Math.max(0, from - 250), Math.min(to + 250, doc40.length));
        while(!cursor19.next().done)add7(cursor19.value.from, cursor19.value.to);
    }
}
const setSearchQuery = StateEffect.define();
const togglePanel$1 = StateEffect.define();
const searchState = StateField.define({
    create (state) {
        return new SearchState(defaultQuery(state).create(), createSearchPanel);
    },
    update (value, tr) {
        for (let effect of tr.effects){
            if (effect.is(setSearchQuery)) value = new SearchState(effect.value.create(), value.panel);
            else if (effect.is(togglePanel$1)) value = new SearchState(value.query, effect.value ? createSearchPanel : null);
        }
        return value;
    },
    provide: (f)=>showPanel.from(f, (val)=>val.panel
        )
});
class SearchState {
    constructor(query, panel){
        this.query = query;
        this.panel = panel;
    }
}
const matchMark = Decoration.mark({
    class: "cm-searchMatch"
}), selectedMatchMark = Decoration.mark({
    class: "cm-searchMatch cm-searchMatch-selected"
});
const searchHighlighter = ViewPlugin.fromClass(class {
    constructor(view){
        this.view = view;
        this.decorations = this.highlight(view.state.field(searchState));
    }
    update(update) {
        let state = update.state.field(searchState);
        if (state != update.startState.field(searchState) || update.docChanged || update.selectionSet) this.decorations = this.highlight(state);
    }
    highlight({ query , panel  }) {
        if (!panel || !query.spec.valid) return Decoration.none;
        let { view  } = this;
        let builder = new RangeSetBuilder();
        for(let i136 = 0, ranges = view.visibleRanges, l = ranges.length; i136 < l; i136++){
            let { from: from7 , to: to7  } = ranges[i136];
            while(i136 < l - 1 && to7 > ranges[i136 + 1].from - 2 * 250)to7 = ranges[++i136].to;
            query.highlight(view.state.doc, from7, to7, (from, to)=>{
                let selected = view.state.selection.ranges.some((r)=>r.from == from && r.to == to
                );
                builder.add(from, to, selected ? selectedMatchMark : matchMark);
            });
        }
        return builder.finish();
    }
}, {
    decorations: (v)=>v.decorations
});
function searchCommand(f) {
    return (view)=>{
        let state = view.state.field(searchState, false);
        return state && state.query.spec.valid ? f(view, state) : openSearchPanel(view);
    };
}
const findNext = searchCommand((view, { query  })=>{
    let { from , to  } = view.state.selection.main;
    let next = query.nextMatch(view.state.doc, from, to);
    if (!next || next.from == from && next.to == to) return false;
    view.dispatch({
        selection: {
            anchor: next.from,
            head: next.to
        },
        scrollIntoView: true,
        effects: announceMatch(view, next),
        userEvent: "select.search"
    });
    return true;
});
const findPrevious = searchCommand((view, { query  })=>{
    let { state  } = view, { from , to  } = state.selection.main;
    let range = query.prevMatch(state.doc, from, to);
    if (!range) return false;
    view.dispatch({
        selection: {
            anchor: range.from,
            head: range.to
        },
        scrollIntoView: true,
        effects: announceMatch(view, range),
        userEvent: "select.search"
    });
    return true;
});
const selectMatches = searchCommand((view, { query  })=>{
    let ranges = query.matchAll(view.state.doc, 1000);
    if (!ranges || !ranges.length) return false;
    view.dispatch({
        selection: EditorSelection.create(ranges.map((r)=>EditorSelection.range(r.from, r.to)
        )),
        userEvent: "select.search.matches"
    });
    return true;
});
const selectSelectionMatches = ({ state , dispatch  })=>{
    let sel = state.selection;
    if (sel.ranges.length > 1 || sel.main.empty) return false;
    let { from , to  } = sel.main;
    let ranges = [], main = 0;
    for(let cur25 = new SearchCursor(state.doc, state.sliceDoc(from, to)); !cur25.next().done;){
        if (ranges.length > 1000) return false;
        if (cur25.value.from == from) main = ranges.length;
        ranges.push(EditorSelection.range(cur25.value.from, cur25.value.to));
    }
    dispatch(state.update({
        selection: EditorSelection.create(ranges, main),
        userEvent: "select.search.matches"
    }));
    return true;
};
const replaceNext = searchCommand((view, { query  })=>{
    let { state  } = view, { from , to  } = state.selection.main;
    if (state.readOnly) return false;
    let next = query.nextMatch(state.doc, from, from);
    if (!next) return false;
    let changes = [], selection22, replacement;
    if (next.from == from && next.to == to) {
        replacement = state.toText(query.getReplacement(next));
        changes.push({
            from: next.from,
            to: next.to,
            insert: replacement
        });
        next = query.nextMatch(state.doc, next.from, next.to);
    }
    if (next) {
        let off = changes.length == 0 || changes[0].from >= next.to ? 0 : next.to - next.from - replacement.length;
        selection22 = {
            anchor: next.from - off,
            head: next.to - off
        };
    }
    view.dispatch({
        changes,
        selection: selection22,
        scrollIntoView: !!selection22,
        effects: next ? announceMatch(view, next) : undefined,
        userEvent: "input.replace"
    });
    return true;
});
const replaceAll = searchCommand((view, { query  })=>{
    if (view.state.readOnly) return false;
    let changes = query.matchAll(view.state.doc, 1000000000).map((match)=>{
        let { from , to  } = match;
        return {
            from,
            to,
            insert: query.getReplacement(match)
        };
    });
    if (!changes.length) return false;
    view.dispatch({
        changes,
        userEvent: "input.replace.all"
    });
    return true;
});
function createSearchPanel(view) {
    return view.state.facet(searchConfigFacet).createPanel(view);
}
function defaultQuery(state, fallback) {
    var _a;
    let sel = state.selection.main;
    let selText = sel.empty || sel.to > sel.from + 100 ? "" : state.sliceDoc(sel.from, sel.to);
    let caseSensitive = (_a = fallback === null || fallback === void 0 ? void 0 : fallback.caseSensitive) !== null && _a !== void 0 ? _a : state.facet(searchConfigFacet).caseSensitive;
    return fallback && !selText ? fallback : new SearchQuery({
        search: selText.replace(/\n/g, "\\n"),
        caseSensitive
    });
}
const openSearchPanel = (view)=>{
    let state = view.state.field(searchState, false);
    if (state && state.panel) {
        let panel = getPanel(view, createSearchPanel);
        if (!panel) return false;
        let searchInput = panel.dom.querySelector("[name=search]");
        if (searchInput != view.root.activeElement) {
            let query = defaultQuery(view.state, state.query.spec);
            if (query.valid) view.dispatch({
                effects: setSearchQuery.of(query)
            });
            searchInput.focus();
            searchInput.select();
        }
    } else {
        view.dispatch({
            effects: [
                togglePanel$1.of(true),
                state ? setSearchQuery.of(defaultQuery(view.state, state.query.spec)) : StateEffect.appendConfig.of(searchExtensions)
            ]
        });
    }
    return true;
};
const closeSearchPanel = (view)=>{
    let state = view.state.field(searchState, false);
    if (!state || !state.panel) return false;
    let panel = getPanel(view, createSearchPanel);
    if (panel && panel.dom.contains(view.root.activeElement)) view.focus();
    view.dispatch({
        effects: togglePanel$1.of(false)
    });
    return true;
};
const searchKeymap = [
    {
        key: "Mod-f",
        run: openSearchPanel,
        scope: "editor search-panel"
    },
    {
        key: "F3",
        run: findNext,
        shift: findPrevious,
        scope: "editor search-panel",
        preventDefault: true
    },
    {
        key: "Mod-g",
        run: findNext,
        shift: findPrevious,
        scope: "editor search-panel",
        preventDefault: true
    },
    {
        key: "Escape",
        run: closeSearchPanel,
        scope: "editor search-panel"
    },
    {
        key: "Mod-Shift-l",
        run: selectSelectionMatches
    },
    {
        key: "Alt-g",
        run: gotoLine
    },
    {
        key: "Mod-d",
        run: selectNextOccurrence,
        preventDefault: true
    }, 
];
class SearchPanel {
    constructor(view){
        this.view = view;
        let query = this.query = view.state.field(searchState).query.spec;
        this.commit = this.commit.bind(this);
        this.searchField = crelt("input", {
            value: query.search,
            placeholder: phrase(view, "Find"),
            "aria-label": phrase(view, "Find"),
            class: "cm-textfield",
            name: "search",
            onchange: this.commit,
            onkeyup: this.commit
        });
        this.replaceField = crelt("input", {
            value: query.replace,
            placeholder: phrase(view, "Replace"),
            "aria-label": phrase(view, "Replace"),
            class: "cm-textfield",
            name: "replace",
            onchange: this.commit,
            onkeyup: this.commit
        });
        this.caseField = crelt("input", {
            type: "checkbox",
            name: "case",
            checked: query.caseSensitive,
            onchange: this.commit
        });
        this.reField = crelt("input", {
            type: "checkbox",
            name: "re",
            checked: query.regexp,
            onchange: this.commit
        });
        function button(name17, onclick, content9) {
            return crelt("button", {
                class: "cm-button",
                name: name17,
                onclick,
                type: "button"
            }, content9);
        }
        this.dom = crelt("div", {
            onkeydown: (e)=>this.keydown(e)
            ,
            class: "cm-search"
        }, [
            this.searchField,
            button("next", ()=>findNext(view)
            , [
                phrase(view, "next")
            ]),
            button("prev", ()=>findPrevious(view)
            , [
                phrase(view, "previous")
            ]),
            button("select", ()=>selectMatches(view)
            , [
                phrase(view, "all")
            ]),
            crelt("label", null, [
                this.caseField,
                phrase(view, "match case")
            ]),
            crelt("label", null, [
                this.reField,
                phrase(view, "regexp")
            ]),
            ...view.state.readOnly ? [] : [
                crelt("br"),
                this.replaceField,
                button("replace", ()=>replaceNext(view)
                , [
                    phrase(view, "replace")
                ]),
                button("replaceAll", ()=>replaceAll(view)
                , [
                    phrase(view, "replace all")
                ]),
                crelt("button", {
                    name: "close",
                    onclick: ()=>closeSearchPanel(view)
                    ,
                    "aria-label": phrase(view, "close"),
                    type: "button"
                }, [
                    "×"
                ])
            ]
        ]);
    }
    commit() {
        let query = new SearchQuery({
            search: this.searchField.value,
            caseSensitive: this.caseField.checked,
            regexp: this.reField.checked,
            replace: this.replaceField.value
        });
        if (!query.eq(this.query)) {
            this.query = query;
            this.view.dispatch({
                effects: setSearchQuery.of(query)
            });
        }
    }
    keydown(e) {
        if (runScopeHandlers(this.view, e, "search-panel")) {
            e.preventDefault();
        } else if (e.keyCode == 13 && e.target == this.searchField) {
            e.preventDefault();
            (e.shiftKey ? findPrevious : findNext)(this.view);
        } else if (e.keyCode == 13 && e.target == this.replaceField) {
            e.preventDefault();
            replaceNext(this.view);
        }
    }
    update(update) {
        for (let tr of update.transactions)for (let effect of tr.effects){
            if (effect.is(setSearchQuery) && !effect.value.eq(this.query)) this.setQuery(effect.value);
        }
    }
    setQuery(query) {
        this.query = query;
        this.searchField.value = query.search;
        this.replaceField.value = query.replace;
        this.caseField.checked = query.caseSensitive;
        this.reField.checked = query.regexp;
    }
    mount() {
        this.searchField.select();
    }
    get pos() {
        return 80;
    }
    get top() {
        return this.view.state.facet(searchConfigFacet).top;
    }
}
function phrase(view, phrase2) {
    return view.state.phrase(phrase2);
}
const Break = /[\s\.,:;?!]/;
function announceMatch(view, { from , to  }) {
    let lineStart = view.state.doc.lineAt(from).from, lineEnd = view.state.doc.lineAt(to).to;
    let start = Math.max(lineStart, from - 30), end = Math.min(lineEnd, to + 30);
    let text = view.state.sliceDoc(start, end);
    if (start != lineStart) {
        for(let i137 = 0; i137 < 30; i137++)if (!Break.test(text[i137 + 1]) && Break.test(text[i137])) {
            text = text.slice(i137);
            break;
        }
    }
    if (end != lineEnd) {
        for(let i138 = text.length - 1; i138 > text.length - 30; i138--)if (!Break.test(text[i138 - 1]) && Break.test(text[i138])) {
            text = text.slice(0, i138);
            break;
        }
    }
    return EditorView.announce.of(`${view.state.phrase("current match")}. ${text} ${view.state.phrase("on line")} ${view.state.doc.lineAt(from).number}`);
}
const baseTheme$3 = EditorView.baseTheme({
    ".cm-panel.cm-search": {
        padding: "2px 6px 4px",
        position: "relative",
        "& [name=close]": {
            position: "absolute",
            top: "0",
            right: "4px",
            backgroundColor: "inherit",
            border: "none",
            font: "inherit",
            padding: 0,
            margin: 0
        },
        "& input, & button, & label": {
            margin: ".2em .6em .2em 0"
        },
        "& input[type=checkbox]": {
            marginRight: ".2em"
        },
        "& label": {
            fontSize: "80%",
            whiteSpace: "pre"
        }
    },
    "&light .cm-searchMatch": {
        backgroundColor: "#ffff0054"
    },
    "&dark .cm-searchMatch": {
        backgroundColor: "#00ffff8a"
    },
    "&light .cm-searchMatch-selected": {
        backgroundColor: "#ff6a0054"
    },
    "&dark .cm-searchMatch-selected": {
        backgroundColor: "#ff00ff8a"
    }
});
const searchExtensions = [
    searchState,
    Prec.lowest(searchHighlighter),
    baseTheme$3
];
const ios = typeof navigator != "undefined" && !/Edge\/(\d+)/.exec(navigator.userAgent) && /Apple Computer/.test(navigator.vendor) && (/Mobile\/\w+/.test(navigator.userAgent) || navigator.maxTouchPoints > 2);
const Outside = "-10000px";
class TooltipViewManager {
    constructor(view, facet, createTooltipView){
        this.facet = facet;
        this.createTooltipView = createTooltipView;
        this.input = view.state.facet(facet);
        this.tooltips = this.input.filter((t4)=>t4
        );
        this.tooltipViews = this.tooltips.map(createTooltipView);
    }
    update(update) {
        let input = update.state.facet(this.facet);
        let tooltips = input.filter((x)=>x
        );
        if (input === this.input) {
            for (let t5 of this.tooltipViews)if (t5.update) t5.update(update);
            return false;
        }
        let tooltipViews = [];
        for(let i139 = 0; i139 < tooltips.length; i139++){
            let tip = tooltips[i139], known = -1;
            if (!tip) continue;
            for(let i140 = 0; i140 < this.tooltips.length; i140++){
                let other = this.tooltips[i140];
                if (other && other.create == tip.create) known = i140;
            }
            if (known < 0) {
                tooltipViews[i139] = this.createTooltipView(tip);
            } else {
                let tooltipView = tooltipViews[i139] = this.tooltipViews[known];
                if (tooltipView.update) tooltipView.update(update);
            }
        }
        for (let t6 of this.tooltipViews)if (tooltipViews.indexOf(t6) < 0) t6.dom.remove();
        this.input = input;
        this.tooltips = tooltips;
        this.tooltipViews = tooltipViews;
        return true;
    }
}
function windowSpace() {
    return {
        top: 0,
        left: 0,
        bottom: innerHeight,
        right: innerWidth
    };
}
const tooltipConfig = Facet.define({
    combine: (values)=>{
        var _a, _b, _c;
        return {
            position: ios ? "absolute" : ((_a = values.find((conf)=>conf.position
            )) === null || _a === void 0 ? void 0 : _a.position) || "fixed",
            parent: ((_b = values.find((conf)=>conf.parent
            )) === null || _b === void 0 ? void 0 : _b.parent) || null,
            tooltipSpace: ((_c = values.find((conf)=>conf.tooltipSpace
            )) === null || _c === void 0 ? void 0 : _c.tooltipSpace) || windowSpace
        };
    }
});
const tooltipPlugin = ViewPlugin.fromClass(class {
    constructor(view){
        var _a;
        this.view = view;
        this.inView = true;
        this.lastTransaction = 0;
        this.measureTimeout = -1;
        let config27 = view.state.facet(tooltipConfig);
        this.position = config27.position;
        this.parent = config27.parent;
        this.classes = view.themeClasses;
        this.createContainer();
        this.measureReq = {
            read: this.readMeasure.bind(this),
            write: this.writeMeasure.bind(this),
            key: this
        };
        this.manager = new TooltipViewManager(view, showTooltip, (t7)=>this.createTooltip(t7)
        );
        this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((entries)=>{
            if (Date.now() > this.lastTransaction - 50 && entries.length > 0 && entries[entries.length - 1].intersectionRatio < 1) this.measureSoon();
        }, {
            threshold: [
                1
            ]
        }) : null;
        this.observeIntersection();
        (_a = view.dom.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this));
        this.maybeMeasure();
    }
    createContainer() {
        if (this.parent) {
            this.container = document.createElement("div");
            this.container.style.position = "relative";
            this.container.className = this.view.themeClasses;
            this.parent.appendChild(this.container);
        } else {
            this.container = this.view.dom;
        }
    }
    observeIntersection() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            for (let tooltip of this.manager.tooltipViews)this.intersectionObserver.observe(tooltip.dom);
        }
    }
    measureSoon() {
        if (this.measureTimeout < 0) this.measureTimeout = setTimeout(()=>{
            this.measureTimeout = -1;
            this.maybeMeasure();
        }, 50);
    }
    update(update) {
        if (update.transactions.length) this.lastTransaction = Date.now();
        let updated = this.manager.update(update);
        if (updated) this.observeIntersection();
        let shouldMeasure = updated || update.geometryChanged;
        let newConfig = update.state.facet(tooltipConfig);
        if (newConfig.position != this.position) {
            this.position = newConfig.position;
            for (let t8 of this.manager.tooltipViews)t8.dom.style.position = this.position;
            shouldMeasure = true;
        }
        if (newConfig.parent != this.parent) {
            if (this.parent) this.container.remove();
            this.parent = newConfig.parent;
            this.createContainer();
            for (let t9 of this.manager.tooltipViews)this.container.appendChild(t9.dom);
            shouldMeasure = true;
        } else if (this.parent && this.view.themeClasses != this.classes) {
            this.classes = this.container.className = this.view.themeClasses;
        }
        if (shouldMeasure) this.maybeMeasure();
    }
    createTooltip(tooltip) {
        let tooltipView = tooltip.create(this.view);
        tooltipView.dom.classList.add("cm-tooltip");
        if (tooltip.arrow && !tooltipView.dom.querySelector("cm-tooltip > cm-tooltip-arrow")) {
            let arrow = document.createElement("div");
            arrow.className = "cm-tooltip-arrow";
            tooltipView.dom.appendChild(arrow);
        }
        tooltipView.dom.style.position = this.position;
        tooltipView.dom.style.top = Outside;
        this.container.appendChild(tooltipView.dom);
        if (tooltipView.mount) tooltipView.mount(this.view);
        return tooltipView;
    }
    destroy() {
        var _a, _b;
        (_a = this.view.dom.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.removeEventListener("resize", this.measureSoon);
        for (let { dom  } of this.manager.tooltipViews)dom.remove();
        (_b = this.intersectionObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
        clearTimeout(this.measureTimeout);
    }
    readMeasure() {
        let editor = this.view.dom.getBoundingClientRect();
        return {
            editor,
            parent: this.parent ? this.container.getBoundingClientRect() : editor,
            pos: this.manager.tooltips.map((t10)=>this.view.coordsAtPos(t10.pos)
            ),
            size: this.manager.tooltipViews.map(({ dom  })=>dom.getBoundingClientRect()
            ),
            space: this.view.state.facet(tooltipConfig).tooltipSpace(this.view)
        };
    }
    writeMeasure(measured) {
        let { editor , space: space4  } = measured;
        let others = [];
        for(let i141 = 0; i141 < this.manager.tooltips.length; i141++){
            let tooltip = this.manager.tooltips[i141], tView = this.manager.tooltipViews[i141], { dom  } = tView;
            let pos = measured.pos[i141], size = measured.size[i141];
            if (!pos || pos.bottom <= Math.max(editor.top, space4.top) || pos.top >= Math.min(editor.bottom, space4.bottom) || pos.right <= Math.max(editor.left, space4.left) || pos.left >= Math.min(editor.right, space4.right)) {
                dom.style.top = Outside;
                continue;
            }
            let arrow = tooltip.arrow ? tView.dom.querySelector(".cm-tooltip-arrow") : null;
            let arrowHeight = arrow ? 7 : 0;
            let width = size.right - size.left, height = size.bottom - size.top;
            let offset = tView.offset || noOffset, ltr = this.view.textDirection == Direction.LTR;
            let left = size.width > space4.right - space4.left ? ltr ? space4.left : space4.right - size.width : ltr ? Math.min(pos.left - (arrow ? 14 : 0) + offset.x, space4.right - width) : Math.max(space4.left, pos.left - width + (arrow ? 14 : 0) - offset.x);
            let above = !!tooltip.above;
            if (!tooltip.strictSide && (above ? pos.top - (size.bottom - size.top) - offset.y < space4.top : pos.bottom + (size.bottom - size.top) + offset.y > space4.bottom) && above == space4.bottom - pos.bottom > pos.top - space4.top) above = !above;
            let top33 = above ? pos.top - height - arrowHeight - offset.y : pos.bottom + arrowHeight + offset.y;
            let right = left + width;
            if (tView.overlap !== true) {
                for (let r of others)if (r.left < right && r.right > left && r.top < top33 + height && r.bottom > top33) top33 = above ? r.top - height - 2 - arrowHeight : r.bottom + arrowHeight + 2;
            }
            if (this.position == "absolute") {
                dom.style.top = top33 - measured.parent.top + "px";
                dom.style.left = left - measured.parent.left + "px";
            } else {
                dom.style.top = top33 + "px";
                dom.style.left = left + "px";
            }
            if (arrow) arrow.style.left = `${pos.left + (ltr ? offset.x : -offset.x) - (left + 14 - 7)}px`;
            if (tView.overlap !== true) others.push({
                left,
                top: top33,
                right,
                bottom: top33 + height
            });
            dom.classList.toggle("cm-tooltip-above", above);
            dom.classList.toggle("cm-tooltip-below", !above);
            if (tView.positioned) tView.positioned();
        }
    }
    maybeMeasure() {
        if (this.manager.tooltips.length) {
            if (this.view.inView) this.view.requestMeasure(this.measureReq);
            if (this.inView != this.view.inView) {
                this.inView = this.view.inView;
                if (!this.inView) for (let tv of this.manager.tooltipViews)tv.dom.style.top = Outside;
            }
        }
    }
}, {
    eventHandlers: {
        scroll () {
            this.maybeMeasure();
        }
    }
});
const baseTheme$2 = EditorView.baseTheme({
    ".cm-tooltip": {
        zIndex: 100
    },
    "&light .cm-tooltip": {
        border: "1px solid #bbb",
        backgroundColor: "#f5f5f5"
    },
    "&light .cm-tooltip-section:not(:first-child)": {
        borderTop: "1px solid #bbb"
    },
    "&dark .cm-tooltip": {
        backgroundColor: "#333338",
        color: "white"
    },
    ".cm-tooltip-arrow": {
        height: `${7}px`,
        width: `${7 * 2}px`,
        position: "absolute",
        zIndex: -1,
        overflow: "hidden",
        "&:before, &:after": {
            content: "''",
            position: "absolute",
            width: 0,
            height: 0,
            borderLeft: `${7}px solid transparent`,
            borderRight: `${7}px solid transparent`
        },
        ".cm-tooltip-above &": {
            bottom: `-${7}px`,
            "&:before": {
                borderTop: `${7}px solid #bbb`
            },
            "&:after": {
                borderTop: `${7}px solid #f5f5f5`,
                bottom: "1px"
            }
        },
        ".cm-tooltip-below &": {
            top: `-${7}px`,
            "&:before": {
                borderBottom: `${7}px solid #bbb`
            },
            "&:after": {
                borderBottom: `${7}px solid #f5f5f5`,
                top: "1px"
            }
        }
    },
    "&dark .cm-tooltip .cm-tooltip-arrow": {
        "&:before": {
            borderTopColor: "#333338",
            borderBottomColor: "#333338"
        },
        "&:after": {
            borderTopColor: "transparent",
            borderBottomColor: "transparent"
        }
    }
});
const noOffset = {
    x: 0,
    y: 0
};
const showTooltip = Facet.define({
    enables: [
        tooltipPlugin,
        baseTheme$2
    ]
});
const showHoverTooltip = Facet.define();
class HoverTooltipHost {
    constructor(view){
        this.view = view;
        this.mounted = false;
        this.dom = document.createElement("div");
        this.dom.classList.add("cm-tooltip-hover");
        this.manager = new TooltipViewManager(view, showHoverTooltip, (t11)=>this.createHostedView(t11)
        );
    }
    static create(view) {
        return new HoverTooltipHost(view);
    }
    createHostedView(tooltip) {
        let hostedView = tooltip.create(this.view);
        hostedView.dom.classList.add("cm-tooltip-section");
        this.dom.appendChild(hostedView.dom);
        if (this.mounted && hostedView.mount) hostedView.mount(this.view);
        return hostedView;
    }
    mount(view) {
        for (let hostedView of this.manager.tooltipViews){
            if (hostedView.mount) hostedView.mount(view);
        }
        this.mounted = true;
    }
    positioned() {
        for (let hostedView of this.manager.tooltipViews){
            if (hostedView.positioned) hostedView.positioned();
        }
    }
    update(update) {
        this.manager.update(update);
    }
}
const showHoverTooltipHost = showTooltip.compute([
    showHoverTooltip
], (state)=>{
    let tooltips = state.facet(showHoverTooltip).filter((t12)=>t12
    );
    if (tooltips.length === 0) return null;
    return {
        pos: Math.min(...tooltips.map((t13)=>t13.pos
        )),
        end: Math.max(...tooltips.filter((t14)=>t14.end != null
        ).map((t15)=>t15.end
        )),
        create: HoverTooltipHost.create,
        above: tooltips[0].above,
        arrow: tooltips.some((t16)=>t16.arrow
        )
    };
});
class HoverPlugin {
    constructor(view, source, field, setHover, hoverTime){
        this.view = view;
        this.source = source;
        this.field = field;
        this.setHover = setHover;
        this.hoverTime = hoverTime;
        this.hoverTimeout = -1;
        this.restartTimeout = -1;
        this.pending = null;
        this.lastMove = {
            x: 0,
            y: 0,
            target: view.dom,
            time: 0
        };
        this.checkHover = this.checkHover.bind(this);
        view.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this));
        view.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
    }
    update() {
        if (this.pending) {
            this.pending = null;
            clearTimeout(this.restartTimeout);
            this.restartTimeout = setTimeout(()=>this.startHover()
            , 20);
        }
    }
    get active() {
        return this.view.state.field(this.field);
    }
    checkHover() {
        this.hoverTimeout = -1;
        if (this.active) return;
        let hovered = Date.now() - this.lastMove.time;
        if (hovered < this.hoverTime) this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - hovered);
        else this.startHover();
    }
    startHover() {
        var _a;
        clearTimeout(this.restartTimeout);
        let { lastMove  } = this;
        let pos = this.view.contentDOM.contains(lastMove.target) ? this.view.posAtCoords(lastMove) : null;
        if (pos == null) return;
        let posCoords = this.view.coordsAtPos(pos);
        if (posCoords == null || lastMove.y < posCoords.top || lastMove.y > posCoords.bottom || lastMove.x < posCoords.left - this.view.defaultCharacterWidth || lastMove.x > posCoords.right + this.view.defaultCharacterWidth) return;
        let bidi = this.view.bidiSpans(this.view.state.doc.lineAt(pos)).find((s)=>s.from <= pos && s.to >= pos
        );
        let rtl = bidi && bidi.dir == Direction.RTL ? -1 : 1;
        let open = this.source(this.view, pos, lastMove.x < posCoords.left ? -rtl : rtl);
        if ((_a = open) === null || _a === void 0 ? void 0 : _a.then) {
            let pending = this.pending = {
                pos
            };
            open.then((result)=>{
                if (this.pending == pending) {
                    this.pending = null;
                    if (result) this.view.dispatch({
                        effects: this.setHover.of(result)
                    });
                }
            }, (e)=>logException(this.view.state, e, "hover tooltip")
            );
        } else if (open) {
            this.view.dispatch({
                effects: this.setHover.of(open)
            });
        }
    }
    mousemove(event) {
        var _a;
        this.lastMove = {
            x: event.clientX,
            y: event.clientY,
            target: event.target,
            time: Date.now()
        };
        if (this.hoverTimeout < 0) this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime);
        let tooltip = this.active;
        if (tooltip && !isInTooltip(this.lastMove.target) || this.pending) {
            let { pos  } = tooltip || this.pending, end = (_a = tooltip === null || tooltip === void 0 ? void 0 : tooltip.end) !== null && _a !== void 0 ? _a : pos;
            if (pos == end ? this.view.posAtCoords(this.lastMove) != pos : !isOverRange(this.view, pos, end, event.clientX, event.clientY, 6)) {
                this.view.dispatch({
                    effects: this.setHover.of(null)
                });
                this.pending = null;
            }
        }
    }
    mouseleave() {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = -1;
        if (this.active) this.view.dispatch({
            effects: this.setHover.of(null)
        });
    }
    destroy() {
        clearTimeout(this.hoverTimeout);
        this.view.dom.removeEventListener("mouseleave", this.mouseleave);
        this.view.dom.removeEventListener("mousemove", this.mousemove);
    }
}
function isInTooltip(elt) {
    for(let cur26 = elt; cur26; cur26 = cur26.parentNode)if (cur26.nodeType == 1 && cur26.classList.contains("cm-tooltip")) return true;
    return false;
}
function isOverRange(view, from, to, x, y, margin) {
    let range = document.createRange();
    let fromDOM = view.domAtPos(from), toDOM = view.domAtPos(to);
    range.setEnd(toDOM.node, toDOM.offset);
    range.setStart(fromDOM.node, fromDOM.offset);
    let rects = range.getClientRects();
    range.detach();
    for(let i142 = 0; i142 < rects.length; i142++){
        let rect = rects[i142];
        let dist = Math.max(rect.top - y, y - rect.bottom, rect.left - x, x - rect.right);
        if (dist <= margin) return true;
    }
    return false;
}
function hoverTooltip(source, options = {
}) {
    let setHover = StateEffect.define();
    let hoverState = StateField.define({
        create () {
            return null;
        },
        update (value, tr) {
            if (value && options.hideOnChange && (tr.docChanged || tr.selection)) return null;
            for (let effect of tr.effects){
                if (effect.is(setHover)) return effect.value;
                if (effect.is(closeHoverTooltipEffect)) return null;
            }
            if (value && tr.docChanged) {
                let newPos = tr.changes.mapPos(value.pos, -1, MapMode.TrackDel);
                if (newPos == null) return null;
                let copy = Object.assign(Object.create(null), value);
                copy.pos = newPos;
                if (value.end != null) copy.end = tr.changes.mapPos(value.end);
                return copy;
            }
            return value;
        },
        provide: (f)=>showHoverTooltip.from(f)
    });
    let hoverTime = options.hoverTime || 600;
    return [
        hoverState,
        ViewPlugin.define((view)=>new HoverPlugin(view, source, hoverState, setHover, hoverTime)
        ),
        showHoverTooltipHost
    ];
}
function getTooltip(view, tooltip) {
    let plugin = view.plugin(tooltipPlugin);
    if (!plugin) return null;
    let found = plugin.manager.tooltips.indexOf(tooltip);
    return found < 0 ? null : plugin.manager.tooltipViews[found];
}
const closeHoverTooltipEffect = StateEffect.define();
class CompletionContext {
    constructor(state, pos, explicit){
        this.state = state;
        this.pos = pos;
        this.explicit = explicit;
        this.abortListeners = [];
    }
    tokenBefore(types3) {
        let token = syntaxTree(this.state).resolveInner(this.pos, -1);
        while(token && types3.indexOf(token.name) < 0)token = token.parent;
        return token ? {
            from: token.from,
            to: this.pos,
            text: this.state.sliceDoc(token.from, this.pos),
            type: token.type
        } : null;
    }
    matchBefore(expr) {
        let line = this.state.doc.lineAt(this.pos);
        let start = Math.max(line.from, this.pos - 250);
        let str = line.text.slice(start - line.from, this.pos - line.from);
        let found = str.search(ensureAnchor(expr, false));
        return found < 0 ? null : {
            from: start + found,
            to: this.pos,
            text: str.slice(found)
        };
    }
    get aborted() {
        return this.abortListeners == null;
    }
    addEventListener(type, listener) {
        if (type == "abort" && this.abortListeners) this.abortListeners.push(listener);
    }
}
function toSet(chars) {
    let flat = Object.keys(chars).join("");
    let words = /\w/.test(flat);
    if (words) flat = flat.replace(/\w/g, "");
    return `[${words ? "\\w" : ""}${flat.replace(/[^\w\s]/g, "\\$&")}]`;
}
function prefixMatch(options) {
    let first = Object.create(null), rest = Object.create(null);
    for (let { label  } of options){
        first[label[0]] = true;
        for(let i143 = 1; i143 < label.length; i143++)rest[label[i143]] = true;
    }
    let source = toSet(first) + toSet(rest) + "*$";
    return [
        new RegExp("^" + source),
        new RegExp(source)
    ];
}
function completeFromList(list) {
    let options = list.map((o)=>typeof o == "string" ? {
            label: o
        } : o
    );
    let [span, match] = options.every((o)=>/^\w+$/.test(o.label)
    ) ? [
        /\w*$/,
        /\w+$/
    ] : prefixMatch(options);
    return (context)=>{
        let token = context.matchBefore(match);
        return token || context.explicit ? {
            from: token ? token.from : context.pos,
            options,
            span
        } : null;
    };
}
class Option {
    constructor(completion, source, match){
        this.completion = completion;
        this.source = source;
        this.match = match;
    }
}
function cur(state) {
    return state.selection.main.head;
}
function ensureAnchor(expr, start) {
    var _a;
    let { source  } = expr;
    let addStart = start && source[0] != "^", addEnd = source[source.length - 1] != "$";
    if (!addStart && !addEnd) return expr;
    return new RegExp(`${addStart ? "^" : ""}(?:${source})${addEnd ? "$" : ""}`, (_a = expr.flags) !== null && _a !== void 0 ? _a : expr.ignoreCase ? "i" : "");
}
const pickedCompletion = Annotation.define();
function applyCompletion(view, option) {
    let apply = option.completion.apply || option.completion.label;
    let result = option.source;
    if (typeof apply == "string") {
        view.dispatch({
            changes: {
                from: result.from,
                to: result.to,
                insert: apply
            },
            selection: {
                anchor: result.from + apply.length
            },
            userEvent: "input.complete",
            annotations: pickedCompletion.of(option.completion)
        });
    } else {
        apply(view, option.completion, result.from, result.to);
    }
}
const SourceCache = new WeakMap();
function asSource(source) {
    if (!Array.isArray(source)) return source;
    let known = SourceCache.get(source);
    if (!known) SourceCache.set(source, known = completeFromList(source));
    return known;
}
class FuzzyMatcher {
    constructor(pattern){
        this.pattern = pattern;
        this.chars = [];
        this.folded = [];
        this.any = [];
        this.precise = [];
        this.byWord = [];
        for(let p18 = 0; p18 < pattern.length;){
            let __char = codePointAt(pattern, p18), size = codePointSize(__char);
            this.chars.push(__char);
            let part = pattern.slice(p18, p18 + size), upper = part.toUpperCase();
            this.folded.push(codePointAt(upper == part ? part.toLowerCase() : upper, 0));
            p18 += size;
        }
        this.astral = pattern.length != this.chars.length;
    }
    match(word) {
        if (this.pattern.length == 0) return [
            0
        ];
        if (word.length < this.pattern.length) return null;
        let { chars , folded , any , precise , byWord  } = this;
        if (chars.length == 1) {
            let first = codePointAt(word, 0);
            return first == chars[0] ? [
                0,
                0,
                codePointSize(first)
            ] : first == folded[0] ? [
                -200,
                0,
                codePointSize(first)
            ] : null;
        }
        let direct = word.indexOf(this.pattern);
        if (direct == 0) return [
            0,
            0,
            this.pattern.length
        ];
        let len = chars.length, anyTo = 0;
        if (direct < 0) {
            for(let i144 = 0, e = Math.min(word.length, 200); i144 < e && anyTo < len;){
                let next = codePointAt(word, i144);
                if (next == chars[anyTo] || next == folded[anyTo]) any[anyTo++] = i144;
                i144 += codePointSize(next);
            }
            if (anyTo < len) return null;
        }
        let preciseTo = 0;
        let byWordTo = 0, byWordFolded = false;
        let adjacentTo = 0, adjacentStart = -1, adjacentEnd = -1;
        let hasLower = /[a-z]/.test(word), wordAdjacent = true;
        for(let i145 = 0, e = Math.min(word.length, 200), prevType = 0; i145 < e && byWordTo < len;){
            let next = codePointAt(word, i145);
            if (direct < 0) {
                if (preciseTo < len && next == chars[preciseTo]) precise[preciseTo++] = i145;
                if (adjacentTo < len) {
                    if (next == chars[adjacentTo] || next == folded[adjacentTo]) {
                        if (adjacentTo == 0) adjacentStart = i145;
                        adjacentEnd = i145 + 1;
                        adjacentTo++;
                    } else {
                        adjacentTo = 0;
                    }
                }
            }
            let ch, type = next < 255 ? next >= 48 && next <= 57 || next >= 97 && next <= 122 ? 2 : next >= 65 && next <= 90 ? 1 : 0 : (ch = fromCodePoint(next)) != ch.toLowerCase() ? 1 : ch != ch.toUpperCase() ? 2 : 0;
            if (!i145 || type == 1 && hasLower || prevType == 0 && type != 0) {
                if (chars[byWordTo] == next || folded[byWordTo] == next && (byWordFolded = true)) byWord[byWordTo++] = i145;
                else if (byWord.length) wordAdjacent = false;
            }
            prevType = type;
            i145 += codePointSize(next);
        }
        if (byWordTo == len && byWord[0] == 0 && wordAdjacent) return this.result(-100 + (byWordFolded ? -200 : 0), byWord, word);
        if (adjacentTo == len && adjacentStart == 0) return [
            -200 - word.length,
            0,
            adjacentEnd
        ];
        if (direct > -1) return [
            -700 - word.length,
            direct,
            direct + this.pattern.length
        ];
        if (adjacentTo == len) return [
            -200 + -700 - word.length,
            adjacentStart,
            adjacentEnd
        ];
        if (byWordTo == len) return this.result(-100 + (byWordFolded ? -200 : 0) + -700 + (wordAdjacent ? 0 : -1100), byWord, word);
        return chars.length == 2 ? null : this.result((any[0] ? -700 : 0) + -200 + -1100, any, word);
    }
    result(score1, positions, word) {
        let result = [
            score1 - word.length
        ], i146 = 1;
        for (let pos of positions){
            let to = pos + (this.astral ? codePointSize(codePointAt(word, pos)) : 1);
            if (i146 > 1 && result[i146 - 1] == pos) result[i146 - 1] = to;
            else {
                result[i146++] = pos;
                result[i146++] = to;
            }
        }
        return result;
    }
}
const completionConfig = Facet.define({
    combine (configs) {
        return combineConfig(configs, {
            activateOnTyping: true,
            override: null,
            maxRenderedOptions: 100,
            defaultKeymap: true,
            optionClass: ()=>""
            ,
            aboveCursor: false,
            icons: true,
            addToOptions: []
        }, {
            defaultKeymap: (a, b)=>a && b
            ,
            icons: (a, b)=>a && b
            ,
            optionClass: (a, b)=>(c)=>joinClass(a(c), b(c))
            ,
            addToOptions: (a, b)=>a.concat(b)
        });
    }
});
function joinClass(a, b) {
    return a ? b ? a + " " + b : a : b;
}
function optionContent(config28) {
    let content10 = config28.addToOptions.slice();
    if (config28.icons) content10.push({
        render (completion) {
            let icon = document.createElement("div");
            icon.classList.add("cm-completionIcon");
            if (completion.type) icon.classList.add(...completion.type.split(/\s+/g).map((cls)=>"cm-completionIcon-" + cls
            ));
            icon.setAttribute("aria-hidden", "true");
            return icon;
        },
        position: 20
    });
    content10.push({
        render (completion, _s, match) {
            let labelElt = document.createElement("span");
            labelElt.className = "cm-completionLabel";
            let { label  } = completion, off = 0;
            for(let j = 1; j < match.length;){
                let from = match[j++], to = match[j++];
                if (from > off) labelElt.appendChild(document.createTextNode(label.slice(off, from)));
                let span = labelElt.appendChild(document.createElement("span"));
                span.appendChild(document.createTextNode(label.slice(from, to)));
                span.className = "cm-completionMatchedText";
                off = to;
            }
            if (off < label.length) labelElt.appendChild(document.createTextNode(label.slice(off)));
            return labelElt;
        },
        position: 50
    }, {
        render (completion) {
            if (!completion.detail) return null;
            let detailElt = document.createElement("span");
            detailElt.className = "cm-completionDetail";
            detailElt.textContent = completion.detail;
            return detailElt;
        },
        position: 80
    });
    return content10.sort((a, b)=>a.position - b.position
    ).map((a)=>a.render
    );
}
function createInfoDialog(option, view) {
    let dom = document.createElement("div");
    dom.className = "cm-tooltip cm-completionInfo";
    let { info  } = option.completion;
    if (typeof info == "string") {
        dom.textContent = info;
    } else {
        let content11 = info(option.completion);
        if (content11.then) content11.then((node)=>dom.appendChild(node)
        , (e)=>logException(view.state, e, "completion info")
        );
        else dom.appendChild(content11);
    }
    return dom;
}
function rangeAroundSelected(total, selected, max) {
    if (total <= max) return {
        from: 0,
        to: total
    };
    if (selected <= total >> 1) {
        let off = Math.floor(selected / max);
        return {
            from: off * max,
            to: (off + 1) * max
        };
    }
    let off = Math.floor((total - selected) / max);
    return {
        from: total - (off + 1) * max,
        to: total - off * max
    };
}
class CompletionTooltip {
    constructor(view, stateField){
        this.view = view;
        this.stateField = stateField;
        this.info = null;
        this.placeInfo = {
            read: ()=>this.measureInfo()
            ,
            write: (pos)=>this.positionInfo(pos)
            ,
            key: this
        };
        let cState = view.state.field(stateField);
        let { options , selected  } = cState.open;
        let config29 = view.state.facet(completionConfig);
        this.optionContent = optionContent(config29);
        this.optionClass = config29.optionClass;
        this.range = rangeAroundSelected(options.length, selected, config29.maxRenderedOptions);
        this.dom = document.createElement("div");
        this.dom.className = "cm-tooltip-autocomplete";
        this.dom.addEventListener("mousedown", (e)=>{
            for(let dom = e.target, match; dom && dom != this.dom; dom = dom.parentNode){
                if (dom.nodeName == "LI" && (match = /-(\d+)$/.exec(dom.id)) && +match[1] < options.length) {
                    applyCompletion(view, options[+match[1]]);
                    e.preventDefault();
                    return;
                }
            }
        });
        this.list = this.dom.appendChild(this.createListBox(options, cState.id, this.range));
        this.list.addEventListener("scroll", ()=>{
            if (this.info) this.view.requestMeasure(this.placeInfo);
        });
    }
    mount() {
        this.updateSel();
    }
    update(update) {
        if (update.state.field(this.stateField) != update.startState.field(this.stateField)) this.updateSel();
    }
    positioned() {
        if (this.info) this.view.requestMeasure(this.placeInfo);
    }
    updateSel() {
        let cState = this.view.state.field(this.stateField), open = cState.open;
        if (open.selected < this.range.from || open.selected >= this.range.to) {
            this.range = rangeAroundSelected(open.options.length, open.selected, this.view.state.facet(completionConfig).maxRenderedOptions);
            this.list.remove();
            this.list = this.dom.appendChild(this.createListBox(open.options, cState.id, this.range));
            this.list.addEventListener("scroll", ()=>{
                if (this.info) this.view.requestMeasure(this.placeInfo);
            });
        }
        if (this.updateSelectedOption(open.selected)) {
            if (this.info) {
                this.info.remove();
                this.info = null;
            }
            let option = open.options[open.selected];
            if (option.completion.info) {
                this.info = this.dom.appendChild(createInfoDialog(option, this.view));
                this.view.requestMeasure(this.placeInfo);
            }
        }
    }
    updateSelectedOption(selected) {
        let set = null;
        for(let opt = this.list.firstChild, i147 = this.range.from; opt; opt = opt.nextSibling, i147++){
            if (i147 == selected) {
                if (!opt.hasAttribute("aria-selected")) {
                    opt.setAttribute("aria-selected", "true");
                    set = opt;
                }
            } else {
                if (opt.hasAttribute("aria-selected")) opt.removeAttribute("aria-selected");
            }
        }
        if (set) scrollIntoView(this.list, set);
        return set;
    }
    measureInfo() {
        let sel = this.dom.querySelector("[aria-selected]");
        if (!sel || !this.info) return null;
        let listRect = this.dom.getBoundingClientRect();
        let infoRect = this.info.getBoundingClientRect();
        let selRect = sel.getBoundingClientRect();
        if (selRect.top > Math.min(innerHeight, listRect.bottom) - 10 || selRect.bottom < Math.max(0, listRect.top) + 10) return null;
        let top34 = Math.max(0, Math.min(selRect.top, innerHeight - infoRect.height)) - listRect.top;
        let left = this.view.textDirection == Direction.RTL;
        let spaceLeft = listRect.left, spaceRight = innerWidth - listRect.right;
        if (left && spaceLeft < Math.min(infoRect.width, spaceRight)) left = false;
        else if (!left && spaceRight < Math.min(infoRect.width, spaceLeft)) left = true;
        return {
            top: top34,
            left
        };
    }
    positionInfo(pos) {
        if (this.info) {
            this.info.style.top = (pos ? pos.top : -1000000) + "px";
            if (pos) {
                this.info.classList.toggle("cm-completionInfo-left", pos.left);
                this.info.classList.toggle("cm-completionInfo-right", !pos.left);
            }
        }
    }
    createListBox(options, id, range) {
        const ul = document.createElement("ul");
        ul.id = id;
        ul.setAttribute("role", "listbox");
        for(let i148 = range.from; i148 < range.to; i148++){
            let { completion , match  } = options[i148];
            const li = ul.appendChild(document.createElement("li"));
            li.id = id + "-" + i148;
            li.setAttribute("role", "option");
            let cls = this.optionClass(completion);
            if (cls) li.className = cls;
            for (let source of this.optionContent){
                let node = source(completion, this.view.state, match);
                if (node) li.appendChild(node);
            }
        }
        if (range.from) ul.classList.add("cm-completionListIncompleteTop");
        if (range.to < options.length) ul.classList.add("cm-completionListIncompleteBottom");
        return ul;
    }
}
function completionTooltip(stateField) {
    return (view)=>new CompletionTooltip(view, stateField)
    ;
}
function scrollIntoView(container, element) {
    let parent = container.getBoundingClientRect();
    let self = element.getBoundingClientRect();
    if (self.top < parent.top) container.scrollTop -= parent.top - self.top;
    else if (self.bottom > parent.bottom) container.scrollTop += self.bottom - parent.bottom;
}
function score(option) {
    return (option.boost || 0) * 100 + (option.apply ? 10 : 0) + (option.info ? 5 : 0) + (option.type ? 1 : 0);
}
function sortOptions(active, state) {
    let options = [], i149 = 0;
    for (let a of active)if (a.hasResult()) {
        if (a.result.filter === false) {
            for (let option of a.result.options)options.push(new Option(option, a, [
                1000000000 - i149++
            ]));
        } else {
            let matcher = new FuzzyMatcher(state.sliceDoc(a.from, a.to)), match;
            for (let option of a.result.options)if (match = matcher.match(option.label)) {
                if (option.boost != null) match[0] += option.boost;
                options.push(new Option(option, a, match));
            }
        }
    }
    options.sort(cmpOption);
    let result = [], prev = null;
    for (let opt of options.sort(cmpOption)){
        if (result.length == 300) break;
        if (!prev || prev.label != opt.completion.label || prev.detail != opt.completion.detail || prev.type != opt.completion.type || prev.apply != opt.completion.apply) result.push(opt);
        else if (score(opt.completion) > score(prev)) result[result.length - 1] = opt;
        prev = opt.completion;
    }
    return result;
}
class CompletionDialog {
    constructor(options, attrs, tooltip, timestamp, selected){
        this.options = options;
        this.attrs = attrs;
        this.tooltip = tooltip;
        this.timestamp = timestamp;
        this.selected = selected;
    }
    setSelected(selected, id) {
        return selected == this.selected || selected >= this.options.length ? this : new CompletionDialog(this.options, makeAttrs(id, selected), this.tooltip, this.timestamp, selected);
    }
    static build(active, state, id, prev, conf) {
        let options = sortOptions(active, state);
        if (!options.length) return null;
        let selected = 0;
        if (prev && prev.selected) {
            let selectedValue = prev.options[prev.selected].completion;
            for(let i150 = 0; i150 < options.length && !selected; i150++){
                if (options[i150].completion == selectedValue) selected = i150;
            }
        }
        return new CompletionDialog(options, makeAttrs(id, selected), {
            pos: active.reduce((a, b)=>b.hasResult() ? Math.min(a, b.from) : a
            , 100000000),
            create: completionTooltip(completionState),
            above: conf.aboveCursor
        }, prev ? prev.timestamp : Date.now(), selected);
    }
    map(changes) {
        return new CompletionDialog(this.options, this.attrs, Object.assign(Object.assign({
        }, this.tooltip), {
            pos: changes.mapPos(this.tooltip.pos)
        }), this.timestamp, this.selected);
    }
}
class CompletionState {
    constructor(active, id, open){
        this.active = active;
        this.id = id;
        this.open = open;
    }
    static start() {
        return new CompletionState(none, "cm-ac-" + Math.floor(Math.random() * 2000000).toString(36), null);
    }
    update(tr) {
        let { state  } = tr, conf = state.facet(completionConfig);
        let sources = conf.override || state.languageDataAt("autocomplete", cur(state)).map(asSource);
        let active = sources.map((source)=>{
            let value = this.active.find((s)=>s.source == source
            ) || new ActiveSource(source, this.active.some((a)=>a.state != 0
            ) ? 1 : 0);
            return value.update(tr, conf);
        });
        if (active.length == this.active.length && active.every((a, i)=>a == this.active[i]
        )) active = this.active;
        let open = tr.selection || active.some((a)=>a.hasResult() && tr.changes.touchesRange(a.from, a.to)
        ) || !sameResults(active, this.active) ? CompletionDialog.build(active, state, this.id, this.open, conf) : this.open && tr.docChanged ? this.open.map(tr.changes) : this.open;
        if (!open && active.every((a)=>a.state != 1
        ) && active.some((a)=>a.hasResult()
        )) active = active.map((a)=>a.hasResult() ? new ActiveSource(a.source, 0) : a
        );
        for (let effect of tr.effects)if (effect.is(setSelectedEffect)) open = open && open.setSelected(effect.value, this.id);
        return active == this.active && open == this.open ? this : new CompletionState(active, this.id, open);
    }
    get tooltip() {
        return this.open ? this.open.tooltip : null;
    }
    get attrs() {
        return this.open ? this.open.attrs : baseAttrs;
    }
}
function sameResults(a, b) {
    if (a == b) return true;
    for(let iA = 0, iB = 0;;){
        while(iA < a.length && !a[iA].hasResult)iA++;
        while(iB < b.length && !b[iB].hasResult)iB++;
        let endA = iA == a.length, endB = iB == b.length;
        if (endA || endB) return endA == endB;
        if (a[iA++].result != b[iB++].result) return false;
    }
}
const baseAttrs = {
    "aria-autocomplete": "list",
    "aria-expanded": "false"
};
function makeAttrs(id, selected) {
    return {
        "aria-autocomplete": "list",
        "aria-expanded": "true",
        "aria-activedescendant": id + "-" + selected,
        "aria-controls": id
    };
}
const none = [];
function cmpOption(a, b) {
    let dScore = b.match[0] - a.match[0];
    if (dScore) return dScore;
    return a.completion.label.localeCompare(b.completion.label);
}
function getUserEvent(tr) {
    return tr.isUserEvent("input.type") ? "input" : tr.isUserEvent("delete.backward") ? "delete" : null;
}
class ActiveSource {
    constructor(source, state, explicitPos = -1){
        this.source = source;
        this.state = state;
        this.explicitPos = explicitPos;
    }
    hasResult() {
        return false;
    }
    update(tr, conf) {
        let event = getUserEvent(tr), value = this;
        if (event) value = value.handleUserEvent(tr, event, conf);
        else if (tr.docChanged) value = value.handleChange(tr);
        else if (tr.selection && value.state != 0) value = new ActiveSource(value.source, 0);
        for (let effect of tr.effects){
            if (effect.is(startCompletionEffect)) value = new ActiveSource(value.source, 1, effect.value ? cur(tr.state) : -1);
            else if (effect.is(closeCompletionEffect)) value = new ActiveSource(value.source, 0);
            else if (effect.is(setActiveEffect)) {
                for (let active of effect.value)if (active.source == value.source) value = active;
            }
        }
        return value;
    }
    handleUserEvent(tr, type, conf) {
        return type == "delete" || !conf.activateOnTyping ? this.map(tr.changes) : new ActiveSource(this.source, 1);
    }
    handleChange(tr) {
        return tr.changes.touchesRange(cur(tr.startState)) ? new ActiveSource(this.source, 0) : this.map(tr.changes);
    }
    map(changes) {
        return changes.empty || this.explicitPos < 0 ? this : new ActiveSource(this.source, this.state, changes.mapPos(this.explicitPos));
    }
}
class ActiveResult extends ActiveSource {
    constructor(source, explicitPos, result, from, to, span){
        super(source, 2, explicitPos);
        this.result = result;
        this.from = from;
        this.to = to;
        this.span = span;
    }
    hasResult() {
        return true;
    }
    handleUserEvent(tr, type, conf) {
        let from = tr.changes.mapPos(this.from), to = tr.changes.mapPos(this.to, 1);
        let pos = cur(tr.state);
        if ((this.explicitPos > -1 ? pos < from : pos <= from) || pos > to) return new ActiveSource(this.source, type == "input" && conf.activateOnTyping ? 1 : 0);
        let explicitPos = this.explicitPos < 0 ? -1 : tr.changes.mapPos(this.explicitPos);
        if (this.span && (from == to || this.span.test(tr.state.sliceDoc(from, to)))) return new ActiveResult(this.source, explicitPos, this.result, from, to, this.span);
        return new ActiveSource(this.source, 1, explicitPos);
    }
    handleChange(tr) {
        return tr.changes.touchesRange(this.from, this.to) ? new ActiveSource(this.source, 0) : this.map(tr.changes);
    }
    map(mapping) {
        return mapping.empty ? this : new ActiveResult(this.source, this.explicitPos < 0 ? -1 : mapping.mapPos(this.explicitPos), this.result, mapping.mapPos(this.from), mapping.mapPos(this.to, 1), this.span);
    }
}
const startCompletionEffect = StateEffect.define();
const closeCompletionEffect = StateEffect.define();
const setActiveEffect = StateEffect.define({
    map (sources, mapping) {
        return sources.map((s)=>s.map(mapping)
        );
    }
});
const setSelectedEffect = StateEffect.define();
const completionState = StateField.define({
    create () {
        return CompletionState.start();
    },
    update (value, tr) {
        return value.update(tr);
    },
    provide: (f)=>[
            showTooltip.from(f, (val)=>val.tooltip
            ),
            EditorView.contentAttributes.from(f, (state)=>state.attrs
            )
        ]
});
function moveCompletionSelection(forward, by = "option") {
    return (view)=>{
        let cState = view.state.field(completionState, false);
        if (!cState || !cState.open || Date.now() - cState.open.timestamp < 75) return false;
        let step = 1, tooltip;
        if (by == "page" && (tooltip = getTooltip(view, cState.open.tooltip))) step = Math.max(2, Math.floor(tooltip.dom.offsetHeight / tooltip.dom.querySelector("li").offsetHeight) - 1);
        let selected = cState.open.selected + step * (forward ? 1 : -1), { length  } = cState.open.options;
        if (selected < 0) selected = by == "page" ? 0 : length - 1;
        else if (selected >= length) selected = by == "page" ? length - 1 : 0;
        view.dispatch({
            effects: setSelectedEffect.of(selected)
        });
        return true;
    };
}
const acceptCompletion = (view)=>{
    let cState = view.state.field(completionState, false);
    if (view.state.readOnly || !cState || !cState.open || Date.now() - cState.open.timestamp < 75) return false;
    applyCompletion(view, cState.open.options[cState.open.selected]);
    return true;
};
const startCompletion = (view)=>{
    let cState = view.state.field(completionState, false);
    if (!cState) return false;
    view.dispatch({
        effects: startCompletionEffect.of(true)
    });
    return true;
};
const closeCompletion = (view)=>{
    let cState = view.state.field(completionState, false);
    if (!cState || !cState.active.some((a)=>a.state != 0
    )) return false;
    view.dispatch({
        effects: closeCompletionEffect.of(null)
    });
    return true;
};
class RunningQuery {
    constructor(active, context){
        this.active = active;
        this.context = context;
        this.time = Date.now();
        this.updates = [];
        this.done = undefined;
    }
}
const DebounceTime = 50;
const completionPlugin = ViewPlugin.fromClass(class {
    constructor(view){
        this.view = view;
        this.debounceUpdate = -1;
        this.running = [];
        this.debounceAccept = -1;
        this.composing = 0;
        for (let active of view.state.field(completionState).active)if (active.state == 1) this.startQuery(active);
    }
    update(update) {
        let cState = update.state.field(completionState);
        if (!update.selectionSet && !update.docChanged && update.startState.field(completionState) == cState) return;
        let doesReset = update.transactions.some((tr)=>{
            return (tr.selection || tr.docChanged) && !getUserEvent(tr);
        });
        for(let i151 = 0; i151 < this.running.length; i151++){
            let query = this.running[i151];
            if (doesReset || query.updates.length + update.transactions.length > 50 && query.time - Date.now() > 1000) {
                for (let handler of query.context.abortListeners){
                    try {
                        handler();
                    } catch (e) {
                        logException(this.view.state, e);
                    }
                }
                query.context.abortListeners = null;
                this.running.splice(i151--, 1);
            } else {
                query.updates.push(...update.transactions);
            }
        }
        if (this.debounceUpdate > -1) clearTimeout(this.debounceUpdate);
        this.debounceUpdate = cState.active.some((a)=>a.state == 1 && !this.running.some((q)=>q.active.source == a.source
            )
        ) ? setTimeout(()=>this.startUpdate()
        , DebounceTime) : -1;
        if (this.composing != 0) for (let tr2 of update.transactions){
            if (getUserEvent(tr2) == "input") this.composing = 2;
            else if (this.composing == 2 && tr2.selection) this.composing = 3;
        }
    }
    startUpdate() {
        this.debounceUpdate = -1;
        let { state  } = this.view, cState = state.field(completionState);
        for (let active of cState.active){
            if (active.state == 1 && !this.running.some((r)=>r.active.source == active.source
            )) this.startQuery(active);
        }
    }
    startQuery(active) {
        let { state  } = this.view, pos = cur(state);
        let context = new CompletionContext(state, pos, active.explicitPos == pos);
        let pending = new RunningQuery(active, context);
        this.running.push(pending);
        Promise.resolve(active.source(context)).then((result)=>{
            if (!pending.context.aborted) {
                pending.done = result || null;
                this.scheduleAccept();
            }
        }, (err)=>{
            this.view.dispatch({
                effects: closeCompletionEffect.of(null)
            });
            logException(this.view.state, err);
        });
    }
    scheduleAccept() {
        if (this.running.every((q)=>q.done !== undefined
        )) this.accept();
        else if (this.debounceAccept < 0) this.debounceAccept = setTimeout(()=>this.accept()
        , DebounceTime);
    }
    accept() {
        var _a;
        if (this.debounceAccept > -1) clearTimeout(this.debounceAccept);
        this.debounceAccept = -1;
        let updated = [];
        let conf = this.view.state.facet(completionConfig);
        for(let i152 = 0; i152 < this.running.length; i152++){
            let query = this.running[i152];
            if (query.done === undefined) continue;
            this.running.splice(i152--, 1);
            if (query.done) {
                let active = new ActiveResult(query.active.source, query.active.explicitPos, query.done, query.done.from, (_a = query.done.to) !== null && _a !== void 0 ? _a : cur(query.updates.length ? query.updates[0].startState : this.view.state), query.done.span && query.done.filter !== false ? ensureAnchor(query.done.span, true) : null);
                for (let tr of query.updates)active = active.update(tr, conf);
                if (active.hasResult()) {
                    updated.push(active);
                    continue;
                }
            }
            let current = this.view.state.field(completionState).active.find((a)=>a.source == query.active.source
            );
            if (current && current.state == 1) {
                if (query.done == null) {
                    let active = new ActiveSource(query.active.source, 0);
                    for (let tr of query.updates)active = active.update(tr, conf);
                    if (active.state != 1) updated.push(active);
                } else {
                    this.startQuery(current);
                }
            }
        }
        if (updated.length) this.view.dispatch({
            effects: setActiveEffect.of(updated)
        });
    }
}, {
    eventHandlers: {
        compositionstart () {
            this.composing = 1;
        },
        compositionend () {
            if (this.composing == 3) {
                setTimeout(()=>this.view.dispatch({
                        effects: startCompletionEffect.of(false)
                    })
                , 20);
            }
            this.composing = 0;
        }
    }
});
const baseTheme$1 = EditorView.baseTheme({
    ".cm-tooltip.cm-tooltip-autocomplete": {
        "& > ul": {
            fontFamily: "monospace",
            whiteSpace: "nowrap",
            overflow: "hidden auto",
            maxWidth_fallback: "700px",
            maxWidth: "min(700px, 95vw)",
            minWidth: "250px",
            maxHeight: "10em",
            listStyle: "none",
            margin: 0,
            padding: 0,
            "& > li": {
                overflowX: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
                padding: "1px 3px",
                lineHeight: 1.2
            }
        }
    },
    "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
        background: "#17c",
        color: "white"
    },
    "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
        background: "#347",
        color: "white"
    },
    ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
        content: '"···"',
        opacity: 0.5,
        display: "block",
        textAlign: "center"
    },
    ".cm-tooltip.cm-completionInfo": {
        position: "absolute",
        padding: "3px 9px",
        width: "max-content",
        maxWidth: "300px"
    },
    ".cm-completionInfo.cm-completionInfo-left": {
        right: "100%"
    },
    ".cm-completionInfo.cm-completionInfo-right": {
        left: "100%"
    },
    "&light .cm-snippetField": {
        backgroundColor: "#00000022"
    },
    "&dark .cm-snippetField": {
        backgroundColor: "#ffffff22"
    },
    ".cm-snippetFieldPosition": {
        verticalAlign: "text-top",
        width: 0,
        height: "1.15em",
        margin: "0 -0.7px -.7em",
        borderLeft: "1.4px dotted #888"
    },
    ".cm-completionMatchedText": {
        textDecoration: "underline"
    },
    ".cm-completionDetail": {
        marginLeft: "0.5em",
        fontStyle: "italic"
    },
    ".cm-completionIcon": {
        fontSize: "90%",
        width: ".8em",
        display: "inline-block",
        textAlign: "center",
        paddingRight: ".6em",
        opacity: "0.6"
    },
    ".cm-completionIcon-function, .cm-completionIcon-method": {
        "&:after": {
            content: "'ƒ'"
        }
    },
    ".cm-completionIcon-class": {
        "&:after": {
            content: "'○'"
        }
    },
    ".cm-completionIcon-interface": {
        "&:after": {
            content: "'◌'"
        }
    },
    ".cm-completionIcon-variable": {
        "&:after": {
            content: "'𝑥'"
        }
    },
    ".cm-completionIcon-constant": {
        "&:after": {
            content: "'𝐶'"
        }
    },
    ".cm-completionIcon-type": {
        "&:after": {
            content: "'𝑡'"
        }
    },
    ".cm-completionIcon-enum": {
        "&:after": {
            content: "'∪'"
        }
    },
    ".cm-completionIcon-property": {
        "&:after": {
            content: "'□'"
        }
    },
    ".cm-completionIcon-keyword": {
        "&:after": {
            content: "'🔑\uFE0E'"
        }
    },
    ".cm-completionIcon-namespace": {
        "&:after": {
            content: "'▢'"
        }
    },
    ".cm-completionIcon-text": {
        "&:after": {
            content: "'abc'",
            fontSize: "50%",
            verticalAlign: "middle"
        }
    }
});
function autocompletion(config30 = {
}) {
    return [
        completionState,
        completionConfig.of(config30),
        completionPlugin,
        completionKeymapExt,
        baseTheme$1
    ];
}
const completionKeymap = [
    {
        key: "Ctrl-Space",
        run: startCompletion
    },
    {
        key: "Escape",
        run: closeCompletion
    },
    {
        key: "ArrowDown",
        run: moveCompletionSelection(true)
    },
    {
        key: "ArrowUp",
        run: moveCompletionSelection(false)
    },
    {
        key: "PageDown",
        run: moveCompletionSelection(true, "page")
    },
    {
        key: "PageUp",
        run: moveCompletionSelection(false, "page")
    },
    {
        key: "Enter",
        run: acceptCompletion
    }
];
const completionKeymapExt = Prec.highest(keymap.computeN([
    completionConfig
], (state)=>state.facet(completionConfig).defaultKeymap ? [
        completionKeymap
    ] : []
));
const toggleComment = (target)=>{
    let config31 = getConfig(target.state);
    return config31.line ? toggleLineComment(target) : config31.block ? toggleBlockComment(target) : false;
};
function command(f, option) {
    return ({ state , dispatch  })=>{
        let tr = f(option, state.selection.ranges, state);
        if (!tr) return false;
        dispatch(state.update(tr));
        return true;
    };
}
const toggleLineComment = command(changeLineComment, 0);
const toggleBlockComment = command(changeBlockComment, 0);
const commentKeymap = [
    {
        key: "Mod-/",
        run: toggleComment
    },
    {
        key: "Alt-A",
        run: toggleBlockComment
    }
];
function getConfig(state, pos = state.selection.main.head) {
    let data = state.languageDataAt("commentTokens", pos);
    return data.length ? data[0] : {
    };
}
const SearchMargin = 50;
function findBlockComment(state, { open , close  }, from, to) {
    let textBefore = state.sliceDoc(from - 50, from);
    let textAfter = state.sliceDoc(to, to + 50);
    let spaceBefore = /\s*$/.exec(textBefore)[0].length, spaceAfter = /^\s*/.exec(textAfter)[0].length;
    let beforeOff = textBefore.length - spaceBefore;
    if (textBefore.slice(beforeOff - open.length, beforeOff) == open && textAfter.slice(spaceAfter, spaceAfter + close.length) == close) {
        return {
            open: {
                pos: from - spaceBefore,
                margin: spaceBefore && 1
            },
            close: {
                pos: to + spaceAfter,
                margin: spaceAfter && 1
            }
        };
    }
    let startText, endText;
    if (to - from <= 2 * 50) {
        startText = endText = state.sliceDoc(from, to);
    } else {
        startText = state.sliceDoc(from, from + SearchMargin);
        endText = state.sliceDoc(to - SearchMargin, to);
    }
    let startSpace = /^\s*/.exec(startText)[0].length, endSpace = /\s*$/.exec(endText)[0].length;
    let endOff = endText.length - endSpace - close.length;
    if (startText.slice(startSpace, startSpace + open.length) == open && endText.slice(endOff, endOff + close.length) == close) {
        return {
            open: {
                pos: from + startSpace + open.length,
                margin: /\s/.test(startText.charAt(startSpace + open.length)) ? 1 : 0
            },
            close: {
                pos: to - endSpace - close.length,
                margin: /\s/.test(endText.charAt(endOff - 1)) ? 1 : 0
            }
        };
    }
    return null;
}
function changeBlockComment(option, ranges, state) {
    let tokens = ranges.map((r)=>getConfig(state, r.from).block
    );
    if (!tokens.every((c)=>c
    )) return null;
    let comments = ranges.map((r, i)=>findBlockComment(state, tokens[i], r.from, r.to)
    );
    if (option != 2 && !comments.every((c)=>c
    )) {
        let index = 0;
        return state.changeByRange((range)=>{
            let { open , close  } = tokens[index++];
            if (comments[index]) return {
                range
            };
            let shift3 = open.length + 1;
            return {
                changes: [
                    {
                        from: range.from,
                        insert: open + " "
                    },
                    {
                        from: range.to,
                        insert: " " + close
                    }
                ],
                range: EditorSelection.range(range.anchor + shift3, range.head + shift3)
            };
        });
    } else if (option != 1 && comments.some((c)=>c
    )) {
        let changes = [];
        for(let i153 = 0, comment1; i153 < comments.length; i153++)if (comment1 = comments[i153]) {
            let token = tokens[i153], { open , close  } = comment1;
            changes.push({
                from: open.pos - token.open.length,
                to: open.pos + open.margin
            }, {
                from: close.pos - close.margin,
                to: close.pos + token.close.length
            });
        }
        return {
            changes
        };
    }
    return null;
}
function changeLineComment(option, ranges, state) {
    let lines = [];
    let prevLine = -1;
    for (let { from , to  } of ranges){
        let startI = lines.length, minIndent = 1000000000;
        for(let pos = from; pos <= to;){
            let line = state.doc.lineAt(pos);
            if (line.from > prevLine && (from == to || to > line.from)) {
                prevLine = line.from;
                let token = getConfig(state, pos).line;
                if (!token) continue;
                let indent = /^\s*/.exec(line.text)[0].length;
                let empty1 = indent == line.length;
                let comment2 = line.text.slice(indent, indent + token.length) == token ? indent : -1;
                if (indent < line.text.length && indent < minIndent) minIndent = indent;
                lines.push({
                    line,
                    comment: comment2,
                    token,
                    indent,
                    empty: empty1,
                    single: false
                });
            }
            pos = line.to + 1;
        }
        if (minIndent < 1000000000) {
            for(let i154 = startI; i154 < lines.length; i154++)if (lines[i154].indent < lines[i154].line.text.length) lines[i154].indent = minIndent;
        }
        if (lines.length == startI + 1) lines[startI].single = true;
    }
    if (option != 2 && lines.some((l)=>l.comment < 0 && (!l.empty || l.single)
    )) {
        let changes = [];
        for (let { line , token , indent , empty: empty2 , single  } of lines)if (single || !empty2) changes.push({
            from: line.from + indent,
            insert: token + " "
        });
        let changeSet = state.changes(changes);
        return {
            changes: changeSet,
            selection: state.selection.map(changeSet, 1)
        };
    } else if (option != 1 && lines.some((l)=>l.comment >= 0
    )) {
        let changes = [];
        for (let { line , comment: comment3 , token  } of lines)if (comment3 >= 0) {
            let from = line.from + comment3, to = from + token.length;
            if (line.text[to - line.from] == " ") to++;
            changes.push({
                from,
                to
            });
        }
        return {
            changes
        };
    }
    return null;
}
function rectangleFor(state, a, b) {
    let startLine = Math.min(a.line, b.line), endLine = Math.max(a.line, b.line);
    let ranges = [];
    if (a.off > 2000 || b.off > 2000 || a.col < 0 || b.col < 0) {
        let startOff = Math.min(a.off, b.off), endOff = Math.max(a.off, b.off);
        for(let i155 = startLine; i155 <= endLine; i155++){
            let line = state.doc.line(i155);
            if (line.length <= endOff) ranges.push(EditorSelection.range(line.from + startOff, line.to + endOff));
        }
    } else {
        let startCol = Math.min(a.col, b.col), endCol = Math.max(a.col, b.col);
        for(let i156 = startLine; i156 <= endLine; i156++){
            let line = state.doc.line(i156);
            let start = findColumn(line.text, startCol, state.tabSize, true);
            if (start > -1) {
                let end = findColumn(line.text, endCol, state.tabSize);
                ranges.push(EditorSelection.range(line.from + start, line.from + end));
            }
        }
    }
    return ranges;
}
function absoluteColumn(view, x) {
    let ref = view.coordsAtPos(view.viewport.from);
    return ref ? Math.round(Math.abs((ref.left - x) / view.defaultCharacterWidth)) : -1;
}
function getPos(view, event) {
    let offset = view.posAtCoords({
        x: event.clientX,
        y: event.clientY
    }, false);
    let line = view.state.doc.lineAt(offset), off = offset - line.from;
    let col = off > 2000 ? -1 : off == line.length ? absoluteColumn(view, event.clientX) : countColumn(line.text, view.state.tabSize, offset - line.from);
    return {
        line: line.number,
        col,
        off
    };
}
function rectangleSelectionStyle(view, event3) {
    let start = getPos(view, event3), startSel = view.state.selection;
    if (!start) return null;
    return {
        update (update) {
            if (update.docChanged) {
                let newStart = update.changes.mapPos(update.startState.doc.line(start.line).from);
                let newLine = update.state.doc.lineAt(newStart);
                start = {
                    line: newLine.number,
                    col: start.col,
                    off: Math.min(start.off, newLine.length)
                };
                startSel = startSel.map(update.changes);
            }
        },
        get (event, _extend, multiple) {
            let cur27 = getPos(view, event);
            if (!cur27) return startSel;
            let ranges = rectangleFor(view.state, start, cur27);
            if (!ranges.length) return startSel;
            if (multiple) return EditorSelection.create(ranges.concat(startSel.ranges));
            else return EditorSelection.create(ranges);
        }
    };
}
function rectangularSelection(options) {
    let filter = (options === null || options === void 0 ? void 0 : options.eventFilter) || ((e)=>e.altKey && e.button == 0
    );
    return EditorView.mouseSelectionStyle.of((view, event)=>filter(event) ? rectangleSelectionStyle(view, event) : null
    );
}
let nextTagID = 0;
class Tag {
    constructor(set, base15, modified){
        this.set = set;
        this.base = base15;
        this.modified = modified;
        this.id = nextTagID++;
    }
    static define(parent) {
        if (parent === null || parent === void 0 ? void 0 : parent.base) throw new Error("Can not derive from a modified tag");
        let tag = new Tag([], null, []);
        tag.set.push(tag);
        if (parent) for (let t17 of parent.set)tag.set.push(t17);
        return tag;
    }
    static defineModifier() {
        let mod = new Modifier;
        return (tag)=>{
            if (tag.modified.indexOf(mod) > -1) return tag;
            return Modifier.get(tag.base || tag, tag.modified.concat(mod).sort((a, b)=>a.id - b.id
            ));
        };
    }
}
let nextModifierID = 0;
class Modifier {
    constructor(){
        this.instances = [];
        this.id = nextModifierID++;
    }
    static get(base16, mods) {
        if (!mods.length) return base16;
        let exists = mods[0].instances.find((t18)=>t18.base == base16 && sameArray(mods, t18.modified)
        );
        if (exists) return exists;
        let set = [], tag = new Tag(set, base16, mods);
        for (let m of mods)m.instances.push(tag);
        let configs = permute(mods);
        for (let parent of base16.set)for (let config32 of configs)set.push(Modifier.get(parent, config32));
        return tag;
    }
}
function sameArray(a, b) {
    return a.length == b.length && a.every((x, i)=>x == b[i]
    );
}
function permute(array) {
    let result = [
        array
    ];
    for(let i157 = 0; i157 < array.length; i157++){
        for (let a of permute(array.slice(0, i157).concat(array.slice(i157 + 1))))result.push(a);
    }
    return result;
}
function styleTags(spec) {
    let byName = Object.create(null);
    for(let prop in spec){
        let tags1 = spec[prop];
        if (!Array.isArray(tags1)) tags1 = [
            tags1
        ];
        for (let part of prop.split(" "))if (part) {
            let pieces = [], mode = 2, rest = part;
            for(let pos = 0;;){
                if (rest == "..." && pos > 0 && pos + 3 == part.length) {
                    mode = 1;
                    break;
                }
                let m = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(rest);
                if (!m) throw new RangeError("Invalid path: " + part);
                pieces.push(m[0] == "*" ? null : m[0][0] == '"' ? JSON.parse(m[0]) : m[0]);
                pos += m[0].length;
                if (pos == part.length) break;
                let next = part[pos++];
                if (pos == part.length && next == "!") {
                    mode = 0;
                    break;
                }
                if (next != "/") throw new RangeError("Invalid path: " + part);
                rest = part.slice(pos);
            }
            let last = pieces.length - 1, inner = pieces[last];
            if (!inner) throw new RangeError("Invalid path: " + part);
            let rule = new Rule(tags1, mode, last > 0 ? pieces.slice(0, last) : null);
            byName[inner] = rule.sort(byName[inner]);
        }
    }
    return ruleNodeProp.add(byName);
}
const ruleNodeProp = new NodeProp();
const highlightStyle = Facet.define({
    combine (stylings) {
        return stylings.length ? HighlightStyle.combinedMatch(stylings) : null;
    }
});
const fallbackHighlightStyle = Facet.define({
    combine (values) {
        return values.length ? values[0].match : null;
    }
});
function getHighlightStyle(state) {
    return state.facet(highlightStyle) || state.facet(fallbackHighlightStyle);
}
class Rule {
    constructor(tags2, mode, context, next){
        this.tags = tags2;
        this.mode = mode;
        this.context = context;
        this.next = next;
    }
    sort(other) {
        if (!other || other.depth < this.depth) {
            this.next = other;
            return this;
        }
        other.next = this.sort(other.next);
        return other;
    }
    get depth() {
        return this.context ? this.context.length : 0;
    }
}
class HighlightStyle {
    constructor(spec2, options){
        this.map = Object.create(null);
        let modSpec;
        function def(spec) {
            let cls = StyleModule.newName();
            (modSpec || (modSpec = Object.create(null)))["." + cls] = spec;
            return cls;
        }
        this.all = typeof options.all == "string" ? options.all : options.all ? def(options.all) : null;
        for (let style of spec2){
            let cls = (style.class || def(Object.assign({
            }, style, {
                tag: null
            }))) + (this.all ? " " + this.all : "");
            let tags3 = style.tag;
            if (!Array.isArray(tags3)) this.map[tags3.id] = cls;
            else for (let tag of tags3)this.map[tag.id] = cls;
        }
        this.module = modSpec ? new StyleModule(modSpec) : null;
        this.scope = options.scope || null;
        this.match = this.match.bind(this);
        let ext = [
            treeHighlighter
        ];
        if (this.module) ext.push(EditorView.styleModule.of(this.module));
        this.extension = ext.concat(highlightStyle.of(this));
        this.fallback = ext.concat(fallbackHighlightStyle.of(this));
    }
    match(tag, scope) {
        if (this.scope && scope != this.scope) return null;
        for (let t19 of tag.set){
            let match = this.map[t19.id];
            if (match !== undefined) {
                if (t19 != tag) this.map[tag.id] = match;
                return match;
            }
        }
        return this.map[tag.id] = this.all;
    }
    static combinedMatch(styles) {
        if (styles.length == 1) return styles[0].match;
        let cache = styles.some((s)=>s.scope
        ) ? undefined : Object.create(null);
        return (tag, scope)=>{
            let cached = cache && cache[tag.id];
            if (cached !== undefined) return cached;
            let result = null;
            for (let style of styles){
                let value = style.match(tag, scope);
                if (value) result = result ? result + " " + value : value;
            }
            if (cache) cache[tag.id] = result;
            return result;
        };
    }
    static define(specs, options) {
        return new HighlightStyle(specs, options || {
        });
    }
    static get(state, tag, scope) {
        let style = getHighlightStyle(state);
        return style && style(tag, scope || NodeType.none);
    }
}
class TreeHighlighter {
    constructor(view){
        this.markCache = Object.create(null);
        this.tree = syntaxTree(view.state);
        this.decorations = this.buildDeco(view, getHighlightStyle(view.state));
    }
    update(update) {
        let tree = syntaxTree(update.state), style = getHighlightStyle(update.state);
        let styleChange = style != update.startState.facet(highlightStyle);
        if (tree.length < update.view.viewport.to && !styleChange && tree.type == this.tree.type) {
            this.decorations = this.decorations.map(update.changes);
        } else if (tree != this.tree || update.viewportChanged || styleChange) {
            this.tree = tree;
            this.decorations = this.buildDeco(update.view, style);
        }
    }
    buildDeco(view, match) {
        if (!match || !this.tree.length) return Decoration.none;
        let builder = new RangeSetBuilder();
        for (let { from: from8 , to: to8  } of view.visibleRanges){
            highlightTreeRange(this.tree, from8, to8, match, (from, to, style)=>{
                builder.add(from, to, this.markCache[style] || (this.markCache[style] = Decoration.mark({
                    class: style
                })));
            });
        }
        return builder.finish();
    }
}
const treeHighlighter = Prec.high(ViewPlugin.fromClass(TreeHighlighter, {
    decorations: (v)=>v.decorations
}));
const nodeStack = [
    ""
];
class HighlightBuilder {
    constructor(at, style, span){
        this.at = at;
        this.style = style;
        this.span = span;
        this.class = "";
    }
    startSpan(at, cls) {
        if (cls != this.class) {
            this.flush(at);
            if (at > this.at) this.at = at;
            this.class = cls;
        }
    }
    flush(to) {
        if (to > this.at && this.class) this.span(this.at, to, this.class);
    }
    highlightRange(cursor20, from, to, inheritedClass, depth, scope) {
        let { type , from: start , to: end  } = cursor20;
        if (start >= to || end <= from) return;
        nodeStack[depth] = type.name;
        if (type.isTop) scope = type;
        let cls = inheritedClass;
        let rule = type.prop(ruleNodeProp), opaque = false;
        while(rule){
            if (!rule.context || matchContext(rule.context, nodeStack, depth)) {
                for (let tag of rule.tags){
                    let st = this.style(tag, scope);
                    if (st) {
                        if (cls) cls += " ";
                        cls += st;
                        if (rule.mode == 1) inheritedClass += (inheritedClass ? " " : "") + st;
                        else if (rule.mode == 0) opaque = true;
                    }
                }
                break;
            }
            rule = rule.next;
        }
        this.startSpan(cursor20.from, cls);
        if (opaque) return;
        let mounted = cursor20.tree && cursor20.tree.prop(NodeProp.mounted);
        if (mounted && mounted.overlay) {
            let inner = cursor20.node.enter(mounted.overlay[0].from + start, 1);
            let hasChild1 = cursor20.firstChild();
            for(let i158 = 0, pos = start;; i158++){
                let next = i158 < mounted.overlay.length ? mounted.overlay[i158] : null;
                let nextPos = next ? next.from + start : end;
                let rangeFrom = Math.max(from, pos), rangeTo = Math.min(to, nextPos);
                if (rangeFrom < rangeTo && hasChild1) {
                    while(cursor20.from < rangeTo){
                        this.highlightRange(cursor20, rangeFrom, rangeTo, inheritedClass, depth + 1, scope);
                        this.startSpan(Math.min(to, cursor20.to), cls);
                        if (cursor20.to >= nextPos || !cursor20.nextSibling()) break;
                    }
                }
                if (!next || nextPos > to) break;
                pos = next.to + start;
                if (pos > from) {
                    this.highlightRange(inner.cursor, Math.max(from, next.from + start), Math.min(to, pos), inheritedClass, depth, mounted.tree.type);
                    this.startSpan(pos, cls);
                }
            }
            if (hasChild1) cursor20.parent();
        } else if (cursor20.firstChild()) {
            do {
                if (cursor20.to <= from) continue;
                if (cursor20.from >= to) break;
                this.highlightRange(cursor20, from, to, inheritedClass, depth + 1, scope);
                this.startSpan(Math.min(to, cursor20.to), cls);
            }while (cursor20.nextSibling())
            cursor20.parent();
        }
    }
}
function highlightTreeRange(tree, from, to, style, span) {
    let builder = new HighlightBuilder(from, style, span);
    builder.highlightRange(tree.cursor(), from, to, "", 0, tree.type);
    builder.flush(to);
}
function matchContext(context, stack, depth) {
    if (context.length > depth - 1) return false;
    for(let d = depth - 1, i159 = context.length - 1; i159 >= 0; i159--, d--){
        let check = context[i159];
        if (check && check != stack[d]) return false;
    }
    return true;
}
const t = Tag.define;
const comment = t(), name = t(), typeName = t(name), propertyName = t(name), literal = t(), string = t(literal), number = t(literal), content = t(), heading = t(content), keyword = t(), operator = t(), punctuation = t(), bracket = t(punctuation), meta = t();
const tags = {
    comment,
    lineComment: t(comment),
    blockComment: t(comment),
    docComment: t(comment),
    name,
    variableName: t(name),
    typeName: typeName,
    tagName: t(typeName),
    propertyName: propertyName,
    attributeName: t(propertyName),
    className: t(name),
    labelName: t(name),
    namespace: t(name),
    macroName: t(name),
    literal,
    string,
    docString: t(string),
    character: t(string),
    attributeValue: t(string),
    number,
    integer: t(number),
    float: t(number),
    bool: t(literal),
    regexp: t(literal),
    escape: t(literal),
    color: t(literal),
    url: t(literal),
    keyword,
    self: t(keyword),
    null: t(keyword),
    atom: t(keyword),
    unit: t(keyword),
    modifier: t(keyword),
    operatorKeyword: t(keyword),
    controlKeyword: t(keyword),
    definitionKeyword: t(keyword),
    moduleKeyword: t(keyword),
    operator,
    derefOperator: t(operator),
    arithmeticOperator: t(operator),
    logicOperator: t(operator),
    bitwiseOperator: t(operator),
    compareOperator: t(operator),
    updateOperator: t(operator),
    definitionOperator: t(operator),
    typeOperator: t(operator),
    controlOperator: t(operator),
    punctuation,
    separator: t(punctuation),
    bracket,
    angleBracket: t(bracket),
    squareBracket: t(bracket),
    paren: t(bracket),
    brace: t(bracket),
    content,
    heading,
    heading1: t(heading),
    heading2: t(heading),
    heading3: t(heading),
    heading4: t(heading),
    heading5: t(heading),
    heading6: t(heading),
    contentSeparator: t(content),
    list: t(content),
    quote: t(content),
    emphasis: t(content),
    strong: t(content),
    link: t(content),
    monospace: t(content),
    strikethrough: t(content),
    inserted: t(),
    deleted: t(),
    changed: t(),
    invalid: t(),
    meta,
    documentMeta: t(meta),
    annotation: t(meta),
    processingInstruction: t(meta),
    definition: Tag.defineModifier(),
    constant: Tag.defineModifier(),
    function: Tag.defineModifier(),
    standard: Tag.defineModifier(),
    local: Tag.defineModifier(),
    special: Tag.defineModifier()
};
const defaultHighlightStyle = HighlightStyle.define([
    {
        tag: tags.link,
        textDecoration: "underline"
    },
    {
        tag: tags.heading,
        textDecoration: "underline",
        fontWeight: "bold"
    },
    {
        tag: tags.emphasis,
        fontStyle: "italic"
    },
    {
        tag: tags.strong,
        fontWeight: "bold"
    },
    {
        tag: tags.strikethrough,
        textDecoration: "line-through"
    },
    {
        tag: tags.keyword,
        color: "#708"
    },
    {
        tag: [
            tags.atom,
            tags.bool,
            tags.url,
            tags.contentSeparator,
            tags.labelName
        ],
        color: "#219"
    },
    {
        tag: [
            tags.literal,
            tags.inserted
        ],
        color: "#164"
    },
    {
        tag: [
            tags.string,
            tags.deleted
        ],
        color: "#a11"
    },
    {
        tag: [
            tags.regexp,
            tags.escape,
            tags.special(tags.string)
        ],
        color: "#e40"
    },
    {
        tag: tags.definition(tags.variableName),
        color: "#00f"
    },
    {
        tag: tags.local(tags.variableName),
        color: "#30a"
    },
    {
        tag: [
            tags.typeName,
            tags.namespace
        ],
        color: "#085"
    },
    {
        tag: tags.className,
        color: "#167"
    },
    {
        tag: [
            tags.special(tags.variableName),
            tags.macroName
        ],
        color: "#256"
    },
    {
        tag: tags.definition(tags.propertyName),
        color: "#00c"
    },
    {
        tag: tags.comment,
        color: "#940"
    },
    {
        tag: tags.meta,
        color: "#7a757a"
    },
    {
        tag: tags.invalid,
        color: "#f00"
    }
]);
class SelectedDiagnostic {
    constructor(from, to, diagnostic){
        this.from = from;
        this.to = to;
        this.diagnostic = diagnostic;
    }
}
class LintState {
    constructor(diagnostics, panel, selected){
        this.diagnostics = diagnostics;
        this.panel = panel;
        this.selected = selected;
    }
    static init(diagnostics, panel, state) {
        let ranges = Decoration.set(diagnostics.map((d)=>{
            return d.from == d.to || d.from == d.to - 1 && state.doc.lineAt(d.from).to == d.from ? Decoration.widget({
                widget: new DiagnosticWidget(d),
                diagnostic: d
            }).range(d.from) : Decoration.mark({
                attributes: {
                    class: "cm-lintRange cm-lintRange-" + d.severity
                },
                diagnostic: d
            }).range(d.from, d.to);
        }), true);
        return new LintState(ranges, panel, findDiagnostic(ranges));
    }
}
function findDiagnostic(diagnostics, diagnostic = null, after = 0) {
    let found = null;
    diagnostics.between(after, 1000000000, (from, to, { spec  })=>{
        if (diagnostic && spec.diagnostic != diagnostic) return;
        found = new SelectedDiagnostic(from, to, spec.diagnostic);
        return false;
    });
    return found;
}
function maybeEnableLint(state1, effects) {
    return state1.field(lintState, false) ? effects : effects.concat(StateEffect.appendConfig.of([
        lintState,
        EditorView.decorations.compute([
            lintState
        ], (state)=>{
            let { selected , panel  } = state.field(lintState);
            return !selected || !panel || selected.from == selected.to ? Decoration.none : Decoration.set([
                activeMark.range(selected.from, selected.to)
            ]);
        }),
        hoverTooltip(lintTooltip),
        baseTheme
    ]));
}
const setDiagnosticsEffect = StateEffect.define();
const togglePanel = StateEffect.define();
const movePanelSelection = StateEffect.define();
const lintState = StateField.define({
    create () {
        return new LintState(Decoration.none, null, null);
    },
    update (value, tr) {
        if (tr.docChanged) {
            let mapped = value.diagnostics.map(tr.changes), selected = null;
            if (value.selected) {
                let selPos = tr.changes.mapPos(value.selected.from, 1);
                selected = findDiagnostic(mapped, value.selected.diagnostic, selPos) || findDiagnostic(mapped, null, selPos);
            }
            value = new LintState(mapped, value.panel, selected);
        }
        for (let effect of tr.effects){
            if (effect.is(setDiagnosticsEffect)) {
                value = LintState.init(effect.value, value.panel, tr.state);
            } else if (effect.is(togglePanel)) {
                value = new LintState(value.diagnostics, effect.value ? LintPanel.open : null, value.selected);
            } else if (effect.is(movePanelSelection)) {
                value = new LintState(value.diagnostics, value.panel, effect.value);
            }
        }
        return value;
    },
    provide: (f)=>[
            showPanel.from(f, (val)=>val.panel
            ),
            EditorView.decorations.from(f, (s)=>s.diagnostics
            )
        ]
});
const activeMark = Decoration.mark({
    class: "cm-lintRange cm-lintRange-active"
});
function lintTooltip(view, pos, side) {
    let { diagnostics  } = view.state.field(lintState);
    let found = [], stackStart = 200000000, stackEnd = 0;
    diagnostics.between(pos - (side < 0 ? 1 : 0), pos + (side > 0 ? 1 : 0), (from, to, { spec  })=>{
        if (pos >= from && pos <= to && (from == to || (pos > from || side > 0) && (pos < to || side < 0))) {
            found.push(spec.diagnostic);
            stackStart = Math.min(from, stackStart);
            stackEnd = Math.max(to, stackEnd);
        }
    });
    if (!found.length) return null;
    return {
        pos: stackStart,
        end: stackEnd,
        above: view.state.doc.lineAt(stackStart).to < stackEnd,
        create () {
            return {
                dom: diagnosticsTooltip(view, found)
            };
        }
    };
}
function diagnosticsTooltip(view, diagnostics) {
    return crelt("ul", {
        class: "cm-tooltip-lint"
    }, diagnostics.map((d)=>renderDiagnostic(view, d, false)
    ));
}
const openLintPanel = (view)=>{
    let field = view.state.field(lintState, false);
    if (!field || !field.panel) view.dispatch({
        effects: maybeEnableLint(view.state, [
            togglePanel.of(true)
        ])
    });
    let panel = getPanel(view, LintPanel.open);
    if (panel) panel.dom.querySelector(".cm-panel-lint ul").focus();
    return true;
};
const closeLintPanel = (view)=>{
    let field = view.state.field(lintState, false);
    if (!field || !field.panel) return false;
    view.dispatch({
        effects: togglePanel.of(false)
    });
    return true;
};
const nextDiagnostic = (view)=>{
    let field = view.state.field(lintState, false);
    if (!field) return false;
    let sel = view.state.selection.main, next = field.diagnostics.iter(sel.to + 1);
    if (!next.value) {
        next = field.diagnostics.iter(0);
        if (!next.value || next.from == sel.from && next.to == sel.to) return false;
    }
    view.dispatch({
        selection: {
            anchor: next.from,
            head: next.to
        },
        scrollIntoView: true
    });
    return true;
};
const lintKeymap = [
    {
        key: "Mod-Shift-m",
        run: openLintPanel
    },
    {
        key: "F8",
        run: nextDiagnostic
    }
];
function assignKeys(actions) {
    let assigned = [];
    if (actions) actions: for (let { name: name18  } of actions){
        for(let i160 = 0; i160 < name18.length; i160++){
            let ch = name18[i160];
            if (/[a-zA-Z]/.test(ch) && !assigned.some((c)=>c.toLowerCase() == ch.toLowerCase()
            )) {
                assigned.push(ch);
                continue actions;
            }
        }
        assigned.push("");
    }
    return assigned;
}
function renderDiagnostic(view, diagnostic, inPanel) {
    var _a;
    let keys = inPanel ? assignKeys(diagnostic.actions) : [];
    return crelt("li", {
        class: "cm-diagnostic cm-diagnostic-" + diagnostic.severity
    }, crelt("span", {
        class: "cm-diagnosticText"
    }, diagnostic.message), (_a = diagnostic.actions) === null || _a === void 0 ? void 0 : _a.map((action, i)=>{
        let click = (e)=>{
            e.preventDefault();
            let found = findDiagnostic(view.state.field(lintState).diagnostics, diagnostic);
            if (found) action.apply(view, found.from, found.to);
        };
        let { name: name19  } = action, keyIndex = keys[i] ? name19.indexOf(keys[i]) : -1;
        let nameElt = keyIndex < 0 ? name19 : [
            name19.slice(0, keyIndex),
            crelt("u", name19.slice(keyIndex, keyIndex + 1)),
            name19.slice(keyIndex + 1)
        ];
        return crelt("button", {
            type: "button",
            class: "cm-diagnosticAction",
            onclick: click,
            onmousedown: click,
            "aria-label": ` Action: ${name19}${keyIndex < 0 ? "" : ` (access key "${keys[i]})"`}.`
        }, nameElt);
    }), diagnostic.source && crelt("div", {
        class: "cm-diagnosticSource"
    }, diagnostic.source));
}
class DiagnosticWidget extends WidgetType {
    constructor(diagnostic){
        super();
        this.diagnostic = diagnostic;
    }
    eq(other) {
        return other.diagnostic == this.diagnostic;
    }
    toDOM() {
        return crelt("span", {
            class: "cm-lintPoint cm-lintPoint-" + this.diagnostic.severity
        });
    }
}
class PanelItem {
    constructor(view, diagnostic){
        this.diagnostic = diagnostic;
        this.id = "item_" + Math.floor(Math.random() * 4294967295).toString(16);
        this.dom = renderDiagnostic(view, diagnostic, true);
        this.dom.id = this.id;
        this.dom.setAttribute("role", "option");
    }
}
class LintPanel {
    constructor(view){
        this.view = view;
        this.items = [];
        let onkeydown = (event)=>{
            if (event.keyCode == 27) {
                closeLintPanel(this.view);
                this.view.focus();
            } else if (event.keyCode == 38 || event.keyCode == 33) {
                this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
            } else if (event.keyCode == 40 || event.keyCode == 34) {
                this.moveSelection((this.selectedIndex + 1) % this.items.length);
            } else if (event.keyCode == 36) {
                this.moveSelection(0);
            } else if (event.keyCode == 35) {
                this.moveSelection(this.items.length - 1);
            } else if (event.keyCode == 13) {
                this.view.focus();
            } else if (event.keyCode >= 65 && event.keyCode <= 90 && this.selectedIndex >= 0) {
                let { diagnostic  } = this.items[this.selectedIndex], keys = assignKeys(diagnostic.actions);
                for(let i161 = 0; i161 < keys.length; i161++)if (keys[i161].toUpperCase().charCodeAt(0) == event.keyCode) {
                    let found = findDiagnostic(this.view.state.field(lintState).diagnostics, diagnostic);
                    if (found) diagnostic.actions[i161].apply(view, found.from, found.to);
                }
            } else {
                return;
            }
            event.preventDefault();
        };
        let onclick = (event)=>{
            for(let i162 = 0; i162 < this.items.length; i162++){
                if (this.items[i162].dom.contains(event.target)) this.moveSelection(i162);
            }
        };
        this.list = crelt("ul", {
            tabIndex: 0,
            role: "listbox",
            "aria-label": this.view.state.phrase("Diagnostics"),
            onkeydown,
            onclick
        });
        this.dom = crelt("div", {
            class: "cm-panel-lint"
        }, this.list, crelt("button", {
            type: "button",
            name: "close",
            "aria-label": this.view.state.phrase("close"),
            onclick: ()=>closeLintPanel(this.view)
        }, "×"));
        this.update();
    }
    get selectedIndex() {
        let selected = this.view.state.field(lintState).selected;
        if (!selected) return -1;
        for(let i163 = 0; i163 < this.items.length; i163++)if (this.items[i163].diagnostic == selected.diagnostic) return i163;
        return -1;
    }
    update() {
        let { diagnostics , selected  } = this.view.state.field(lintState);
        let i164 = 0, needsSync = false, newSelectedItem = null;
        diagnostics.between(0, this.view.state.doc.length, (_start, _end, { spec  })=>{
            let found = -1, item;
            for(let j = i164; j < this.items.length; j++)if (this.items[j].diagnostic == spec.diagnostic) {
                found = j;
                break;
            }
            if (found < 0) {
                item = new PanelItem(this.view, spec.diagnostic);
                this.items.splice(i164, 0, item);
                needsSync = true;
            } else {
                item = this.items[found];
                if (found > i164) {
                    this.items.splice(i164, found - i164);
                    needsSync = true;
                }
            }
            if (selected && item.diagnostic == selected.diagnostic) {
                if (!item.dom.hasAttribute("aria-selected")) {
                    item.dom.setAttribute("aria-selected", "true");
                    newSelectedItem = item;
                }
            } else if (item.dom.hasAttribute("aria-selected")) {
                item.dom.removeAttribute("aria-selected");
            }
            i164++;
        });
        while(i164 < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0)){
            needsSync = true;
            this.items.pop();
        }
        if (this.items.length == 0) {
            this.items.push(new PanelItem(this.view, {
                from: -1,
                to: -1,
                severity: "info",
                message: this.view.state.phrase("No diagnostics")
            }));
            needsSync = true;
        }
        if (newSelectedItem) {
            this.list.setAttribute("aria-activedescendant", newSelectedItem.id);
            this.view.requestMeasure({
                key: this,
                read: ()=>({
                        sel: newSelectedItem.dom.getBoundingClientRect(),
                        panel: this.list.getBoundingClientRect()
                    })
                ,
                write: ({ sel , panel  })=>{
                    if (sel.top < panel.top) this.list.scrollTop -= panel.top - sel.top;
                    else if (sel.bottom > panel.bottom) this.list.scrollTop += sel.bottom - panel.bottom;
                }
            });
        } else if (this.selectedIndex < 0) {
            this.list.removeAttribute("aria-activedescendant");
        }
        if (needsSync) this.sync();
    }
    sync() {
        let domPos = this.list.firstChild;
        function rm1() {
            let prev = domPos;
            domPos = prev.nextSibling;
            prev.remove();
        }
        for (let item of this.items){
            if (item.dom.parentNode == this.list) {
                while(domPos != item.dom)rm1();
                domPos = item.dom.nextSibling;
            } else {
                this.list.insertBefore(item.dom, domPos);
            }
        }
        while(domPos)rm1();
    }
    moveSelection(selectedIndex) {
        if (this.selectedIndex < 0) return;
        let field = this.view.state.field(lintState);
        let selection23 = findDiagnostic(field.diagnostics, this.items[selectedIndex].diagnostic);
        if (!selection23) return;
        this.view.dispatch({
            selection: {
                anchor: selection23.from,
                head: selection23.to
            },
            scrollIntoView: true,
            effects: movePanelSelection.of(selection23)
        });
    }
    static open(view) {
        return new LintPanel(view);
    }
}
function svg(content12, attrs = `viewBox="0 0 40 40"`) {
    return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${encodeURIComponent(content12)}</svg>')`;
}
function underline(color) {
    return svg(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${color}" fill="none" stroke-width=".7"/>`, `width="6" height="3"`);
}
const baseTheme = EditorView.baseTheme({
    ".cm-diagnostic": {
        padding: "3px 6px 3px 8px",
        marginLeft: "-1px",
        display: "block",
        whiteSpace: "pre-wrap"
    },
    ".cm-diagnostic-error": {
        borderLeft: "5px solid #d11"
    },
    ".cm-diagnostic-warning": {
        borderLeft: "5px solid orange"
    },
    ".cm-diagnostic-info": {
        borderLeft: "5px solid #999"
    },
    ".cm-diagnosticAction": {
        font: "inherit",
        border: "none",
        padding: "2px 4px",
        backgroundColor: "#444",
        color: "white",
        borderRadius: "3px",
        marginLeft: "8px"
    },
    ".cm-diagnosticSource": {
        fontSize: "70%",
        opacity: 0.7
    },
    ".cm-lintRange": {
        backgroundPosition: "left bottom",
        backgroundRepeat: "repeat-x",
        paddingBottom: "0.7px"
    },
    ".cm-lintRange-error": {
        backgroundImage: underline("#d11")
    },
    ".cm-lintRange-warning": {
        backgroundImage: underline("orange")
    },
    ".cm-lintRange-info": {
        backgroundImage: underline("#999")
    },
    ".cm-lintRange-active": {
        backgroundColor: "#ffdd9980"
    },
    ".cm-tooltip-lint": {
        padding: 0,
        margin: 0
    },
    ".cm-lintPoint": {
        position: "relative",
        "&:after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "-2px",
            borderLeft: "3px solid transparent",
            borderRight: "3px solid transparent",
            borderBottom: "4px solid #d11"
        }
    },
    ".cm-lintPoint-warning": {
        "&:after": {
            borderBottomColor: "orange"
        }
    },
    ".cm-lintPoint-info": {
        "&:after": {
            borderBottomColor: "#999"
        }
    },
    ".cm-panel.cm-panel-lint": {
        position: "relative",
        "& ul": {
            maxHeight: "100px",
            overflowY: "auto",
            "& [aria-selected]": {
                backgroundColor: "#ddd",
                "& u": {
                    textDecoration: "underline"
                }
            },
            "&:focus [aria-selected]": {
                background_fallback: "#bdf",
                backgroundColor: "Highlight",
                color_fallback: "white",
                color: "HighlightText"
            },
            "& u": {
                textDecoration: "none"
            },
            padding: 0,
            margin: 0
        },
        "& [name=close]": {
            position: "absolute",
            top: "0",
            right: "2px",
            background: "inherit",
            border: "none",
            font: "inherit",
            padding: 0,
            margin: 0
        }
    }
});
const basicSetup = [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    defaultHighlightStyle.fallback,
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...commentKeymap,
        ...completionKeymap,
        ...lintKeymap
    ])
];
const chalky = "#e5c07b", coral = "#e06c75", cyan = "#56b6c2", invalid = "#ffffff", ivory = "#abb2bf", stone = "#7d8799", malibu = "#61afef", sage = "#98c379", whiskey = "#d19a66", violet = "#c678dd", darkBackground = "#21252b", highlightBackground = "#2c313a", background = "#282c34", tooltipBackground = "#353a42", selection = "#3E4451", cursor = "#528bff";
const oneDarkTheme = EditorView.theme({
    "&": {
        color: ivory,
        backgroundColor: background
    },
    ".cm-content": {
        caretColor: cursor
    },
    "&.cm-focused .cm-cursor": {
        borderLeftColor: cursor
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: selection
    },
    ".cm-panels": {
        backgroundColor: darkBackground,
        color: ivory
    },
    ".cm-panels.cm-panels-top": {
        borderBottom: "2px solid black"
    },
    ".cm-panels.cm-panels-bottom": {
        borderTop: "2px solid black"
    },
    ".cm-searchMatch": {
        backgroundColor: "#72a1ff59",
        outline: "1px solid #457dff"
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: "#6199ff2f"
    },
    ".cm-activeLine": {
        backgroundColor: highlightBackground
    },
    ".cm-selectionMatch": {
        backgroundColor: "#aafe661a"
    },
    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
        backgroundColor: "#bad0f847",
        outline: "1px solid #515a6b"
    },
    ".cm-gutters": {
        backgroundColor: background,
        color: stone,
        border: "none"
    },
    ".cm-activeLineGutter": {
        backgroundColor: highlightBackground
    },
    ".cm-foldPlaceholder": {
        backgroundColor: "transparent",
        border: "none",
        color: "#ddd"
    },
    ".cm-tooltip": {
        border: "none",
        backgroundColor: tooltipBackground
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
        borderTopColor: "transparent",
        borderBottomColor: "transparent"
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
        borderTopColor: tooltipBackground,
        borderBottomColor: tooltipBackground
    },
    ".cm-tooltip-autocomplete": {
        "& > ul > li[aria-selected]": {
            backgroundColor: highlightBackground,
            color: ivory
        }
    }
}, {
    dark: true
});
const oneDarkHighlightStyle = HighlightStyle.define([
    {
        tag: tags.keyword,
        color: violet
    },
    {
        tag: [
            tags.name,
            tags.deleted,
            tags.character,
            tags.propertyName,
            tags.macroName
        ],
        color: coral
    },
    {
        tag: [
            tags.function(tags.variableName),
            tags.labelName
        ],
        color: malibu
    },
    {
        tag: [
            tags.color,
            tags.constant(tags.name),
            tags.standard(tags.name)
        ],
        color: whiskey
    },
    {
        tag: [
            tags.definition(tags.name),
            tags.separator
        ],
        color: ivory
    },
    {
        tag: [
            tags.typeName,
            tags.className,
            tags.number,
            tags.changed,
            tags.annotation,
            tags.modifier,
            tags.self,
            tags.namespace
        ],
        color: chalky
    },
    {
        tag: [
            tags.operator,
            tags.operatorKeyword,
            tags.url,
            tags.escape,
            tags.regexp,
            tags.link,
            tags.special(tags.string)
        ],
        color: cyan
    },
    {
        tag: [
            tags.meta,
            tags.comment
        ],
        color: stone
    },
    {
        tag: tags.strong,
        fontWeight: "bold"
    },
    {
        tag: tags.emphasis,
        fontStyle: "italic"
    },
    {
        tag: tags.strikethrough,
        textDecoration: "line-through"
    },
    {
        tag: tags.link,
        color: stone,
        textDecoration: "underline"
    },
    {
        tag: tags.heading,
        fontWeight: "bold",
        color: coral
    },
    {
        tag: [
            tags.atom,
            tags.bool,
            tags.special(tags.variableName)
        ],
        color: whiskey
    },
    {
        tag: [
            tags.processingInstruction,
            tags.string,
            tags.inserted
        ],
        color: sage
    },
    {
        tag: tags.invalid,
        color: invalid
    }, 
]);
const oneDark = [
    oneDarkTheme,
    oneDarkHighlightStyle
];
class Stack {
    constructor(p19, stack, state, reducePos, pos, score2, buffer, bufferBase, curContext, lookAhead = 0, parent){
        this.p = p19;
        this.stack = stack;
        this.state = state;
        this.reducePos = reducePos;
        this.pos = pos;
        this.score = score2;
        this.buffer = buffer;
        this.bufferBase = bufferBase;
        this.curContext = curContext;
        this.lookAhead = lookAhead;
        this.parent = parent;
    }
    toString() {
        return `[${this.stack.filter((_, i165)=>i165 % 3 == 0
        ).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
    }
    static start(p20, state, pos = 0) {
        let cx = p20.parser.context;
        return new Stack(p20, [], state, pos, pos, 0, [], 0, cx ? new StackContext(cx, cx.start) : null, 0, null);
    }
    get context() {
        return this.curContext ? this.curContext.context : null;
    }
    pushState(state, start) {
        this.stack.push(this.state, start, this.bufferBase + this.buffer.length);
        this.state = state;
    }
    reduce(action) {
        let depth = action >> 19, type = action & 65535;
        let { parser: parser5  } = this.p;
        let dPrec = parser5.dynamicPrecedence(type);
        if (dPrec) this.score += dPrec;
        if (depth == 0) {
            if (type < parser5.minRepeatTerm) this.storeNode(type, this.reducePos, this.reducePos, 4, true);
            this.pushState(parser5.getGoto(this.state, type, true), this.reducePos);
            this.reduceContext(type, this.reducePos);
            return;
        }
        let base17 = this.stack.length - (depth - 1) * 3 - (action & 262144 ? 6 : 0);
        let start = this.stack[base17 - 2];
        let bufferBase = this.stack[base17 - 1], count = this.bufferBase + this.buffer.length - bufferBase;
        if (type < parser5.minRepeatTerm || action & 131072) {
            let pos = parser5.stateFlag(this.state, 1) ? this.pos : this.reducePos;
            this.storeNode(type, start, pos, count + 4, true);
        }
        if (action & 262144) {
            this.state = this.stack[base17];
        } else {
            let baseStateID = this.stack[base17 - 3];
            this.state = parser5.getGoto(baseStateID, type, true);
        }
        while(this.stack.length > base17)this.stack.pop();
        this.reduceContext(type, start);
    }
    storeNode(term, start, end, size = 4, isReduce = false) {
        if (term == 0) {
            let cur28 = this, top35 = this.buffer.length;
            if (top35 == 0 && cur28.parent) {
                top35 = cur28.bufferBase - cur28.parent.bufferBase;
                cur28 = cur28.parent;
            }
            if (top35 > 0 && cur28.buffer[top35 - 4] == 0 && cur28.buffer[top35 - 1] > -1) {
                if (start == end) return;
                if (cur28.buffer[top35 - 2] >= start) {
                    cur28.buffer[top35 - 2] = end;
                    return;
                }
            }
        }
        if (!isReduce || this.pos == end) {
            this.buffer.push(term, start, end, size);
        } else {
            let index = this.buffer.length;
            if (index > 0 && this.buffer[index - 4] != 0) while(index > 0 && this.buffer[index - 2] > end){
                this.buffer[index] = this.buffer[index - 4];
                this.buffer[index + 1] = this.buffer[index - 3];
                this.buffer[index + 2] = this.buffer[index - 2];
                this.buffer[index + 3] = this.buffer[index - 1];
                index -= 4;
                if (size > 4) size -= 4;
            }
            this.buffer[index] = term;
            this.buffer[index + 1] = start;
            this.buffer[index + 2] = end;
            this.buffer[index + 3] = size;
        }
    }
    shift(action, next, nextEnd) {
        let start = this.pos;
        if (action & 131072) {
            this.pushState(action & 65535, this.pos);
        } else if ((action & 262144) == 0) {
            let nextState = action, { parser: parser6  } = this.p;
            if (nextEnd > this.pos || next <= parser6.maxNode) {
                this.pos = nextEnd;
                if (!parser6.stateFlag(nextState, 1)) this.reducePos = nextEnd;
            }
            this.pushState(nextState, start);
            this.shiftContext(next, start);
            if (next <= parser6.maxNode) this.buffer.push(next, start, nextEnd, 4);
        } else {
            this.pos = nextEnd;
            this.shiftContext(next, start);
            if (next <= this.p.parser.maxNode) this.buffer.push(next, start, nextEnd, 4);
        }
    }
    apply(action, next, nextEnd) {
        if (action & 65536) this.reduce(action);
        else this.shift(action, next, nextEnd);
    }
    useNode(value, next) {
        let index = this.p.reused.length - 1;
        if (index < 0 || this.p.reused[index] != value) {
            this.p.reused.push(value);
            index++;
        }
        let start = this.pos;
        this.reducePos = this.pos = start + value.length;
        this.pushState(next, start);
        this.buffer.push(index, start, this.reducePos, -1);
        if (this.curContext) this.updateContext(this.curContext.tracker.reuse(this.curContext.context, value, this, this.p.stream.reset(this.pos - value.length)));
    }
    split() {
        let parent = this;
        let off = parent.buffer.length;
        while(off > 0 && parent.buffer[off - 2] > parent.reducePos)off -= 4;
        let buffer = parent.buffer.slice(off), base18 = parent.bufferBase + off;
        while(parent && base18 == parent.bufferBase)parent = parent.parent;
        return new Stack(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, buffer, base18, this.curContext, this.lookAhead, parent);
    }
    recoverByDelete(next, nextEnd) {
        let isNode = next <= this.p.parser.maxNode;
        if (isNode) this.storeNode(next, this.pos, nextEnd, 4);
        this.storeNode(0, this.pos, nextEnd, isNode ? 8 : 4);
        this.pos = this.reducePos = nextEnd;
        this.score -= 190;
    }
    canShift(term) {
        for(let sim = new SimulatedStack(this);;){
            let action = this.p.parser.stateSlot(sim.state, 4) || this.p.parser.hasAction(sim.state, term);
            if ((action & 65536) == 0) return true;
            if (action == 0) return false;
            sim.reduce(action);
        }
    }
    recoverByInsert(next) {
        if (this.stack.length >= 300) return [];
        let nextStates = this.p.parser.nextStates(this.state);
        if (nextStates.length > 4 << 1 || this.stack.length >= 120) {
            let best = [];
            for(let i167 = 0, s; i167 < nextStates.length; i167 += 2){
                if ((s = nextStates[i167 + 1]) != this.state && this.p.parser.hasAction(s, next)) best.push(nextStates[i167], s);
            }
            if (this.stack.length < 120) for(let i166 = 0; best.length < 4 << 1 && i166 < nextStates.length; i166 += 2){
                let s = nextStates[i166 + 1];
                if (!best.some((v, i169)=>i169 & 1 && v == s
                )) best.push(nextStates[i166], s);
            }
            nextStates = best;
        }
        let result = [];
        for(let i168 = 0; i168 < nextStates.length && result.length < 4; i168 += 2){
            let s = nextStates[i168 + 1];
            if (s == this.state) continue;
            let stack = this.split();
            stack.storeNode(0, stack.pos, stack.pos, 4, true);
            stack.pushState(s, this.pos);
            stack.shiftContext(nextStates[i168], this.pos);
            stack.score -= 200;
            result.push(stack);
        }
        return result;
    }
    forceReduce() {
        let reduce = this.p.parser.stateSlot(this.state, 5);
        if ((reduce & 65536) == 0) return false;
        let { parser: parser7  } = this.p;
        if (!parser7.validAction(this.state, reduce)) {
            let depth = reduce >> 19, term = reduce & 65535;
            let target = this.stack.length - depth * 3;
            if (target < 0 || parser7.getGoto(this.stack[target], term, false) < 0) return false;
            this.storeNode(0, this.reducePos, this.reducePos, 4, true);
            this.score -= 100;
        }
        this.reduce(reduce);
        return true;
    }
    forceAll() {
        while(!this.p.parser.stateFlag(this.state, 2)){
            if (!this.forceReduce()) {
                this.storeNode(0, this.pos, this.pos, 4, true);
                break;
            }
        }
        return this;
    }
    get deadEnd() {
        if (this.stack.length != 3) return false;
        let { parser: parser8  } = this.p;
        return parser8.data[parser8.stateSlot(this.state, 1)] == 65535 && !parser8.stateSlot(this.state, 4);
    }
    restart() {
        this.state = this.stack[0];
        this.stack.length = 0;
    }
    sameState(other) {
        if (this.state != other.state || this.stack.length != other.stack.length) return false;
        for(let i170 = 0; i170 < this.stack.length; i170 += 3)if (this.stack[i170] != other.stack[i170]) return false;
        return true;
    }
    get parser() {
        return this.p.parser;
    }
    dialectEnabled(dialectID) {
        return this.p.parser.dialect.flags[dialectID];
    }
    shiftContext(term, start) {
        if (this.curContext) this.updateContext(this.curContext.tracker.shift(this.curContext.context, term, this, this.p.stream.reset(start)));
    }
    reduceContext(term, start) {
        if (this.curContext) this.updateContext(this.curContext.tracker.reduce(this.curContext.context, term, this, this.p.stream.reset(start)));
    }
    emitContext() {
        let last = this.buffer.length - 1;
        if (last < 0 || this.buffer[last] != -3) this.buffer.push(this.curContext.hash, this.reducePos, this.reducePos, -3);
    }
    emitLookAhead() {
        let last = this.buffer.length - 1;
        if (last < 0 || this.buffer[last] != -4) this.buffer.push(this.lookAhead, this.reducePos, this.reducePos, -4);
    }
    updateContext(context) {
        if (context != this.curContext.context) {
            let newCx = new StackContext(this.curContext.tracker, context);
            if (newCx.hash != this.curContext.hash) this.emitContext();
            this.curContext = newCx;
        }
    }
    setLookAhead(lookAhead) {
        if (lookAhead > this.lookAhead) {
            this.emitLookAhead();
            this.lookAhead = lookAhead;
        }
    }
    close() {
        if (this.curContext && this.curContext.tracker.strict) this.emitContext();
        if (this.lookAhead > 0) this.emitLookAhead();
    }
}
class StackContext {
    constructor(tracker, context){
        this.tracker = tracker;
        this.context = context;
        this.hash = tracker.strict ? tracker.hash(context) : 0;
    }
}
var Recover;
(function(Recover1) {
    Recover1[Recover1["Insert"] = 200] = "Insert";
    Recover1[Recover1["Delete"] = 190] = "Delete";
    Recover1[Recover1["Reduce"] = 100] = "Reduce";
    Recover1[Recover1["MaxNext"] = 4] = "MaxNext";
    Recover1[Recover1["MaxInsertStackDepth"] = 300] = "MaxInsertStackDepth";
    Recover1[Recover1["DampenInsertStackDepth"] = 120] = "DampenInsertStackDepth";
})(Recover || (Recover = {
}));
class SimulatedStack {
    constructor(start){
        this.start = start;
        this.state = start.state;
        this.stack = start.stack;
        this.base = this.stack.length;
    }
    reduce(action) {
        let term = action & 65535, depth = action >> 19;
        if (depth == 0) {
            if (this.stack == this.start.stack) this.stack = this.stack.slice();
            this.stack.push(this.state, 0, 0);
            this.base += 3;
        } else {
            this.base -= (depth - 1) * 3;
        }
        let __goto = this.start.p.parser.getGoto(this.stack[this.base - 3], term, true);
        this.state = __goto;
    }
}
class StackBufferCursor {
    constructor(stack, pos, index){
        this.stack = stack;
        this.pos = pos;
        this.index = index;
        this.buffer = stack.buffer;
        if (this.index == 0) this.maybeNext();
    }
    static create(stack, pos = stack.bufferBase + stack.buffer.length) {
        return new StackBufferCursor(stack, pos, pos - stack.bufferBase);
    }
    maybeNext() {
        let next = this.stack.parent;
        if (next != null) {
            this.index = this.stack.bufferBase - next.bufferBase;
            this.stack = next;
            this.buffer = next.buffer;
        }
    }
    get id() {
        return this.buffer[this.index - 4];
    }
    get start() {
        return this.buffer[this.index - 3];
    }
    get end() {
        return this.buffer[this.index - 2];
    }
    get size() {
        return this.buffer[this.index - 1];
    }
    next() {
        this.index -= 4;
        this.pos -= 4;
        if (this.index == 0) this.maybeNext();
    }
    fork() {
        return new StackBufferCursor(this.stack, this.pos, this.index);
    }
}
class CachedToken {
    constructor(){
        this.start = -1;
        this.value = -1;
        this.end = -1;
        this.extended = -1;
        this.lookAhead = 0;
        this.mask = 0;
        this.context = 0;
    }
}
const nullToken = new CachedToken;
class InputStream {
    constructor(input, ranges){
        this.input = input;
        this.ranges = ranges;
        this.chunk = "";
        this.chunkOff = 0;
        this.chunk2 = "";
        this.chunk2Pos = 0;
        this.next = -1;
        this.token = nullToken;
        this.rangeIndex = 0;
        this.pos = this.chunkPos = ranges[0].from;
        this.range = ranges[0];
        this.end = ranges[ranges.length - 1].to;
        this.readNext();
    }
    resolveOffset(offset, assoc) {
        let range = this.range, index = this.rangeIndex;
        let pos = this.pos + offset;
        while(pos < range.from){
            if (!index) return null;
            let next = this.ranges[--index];
            pos -= range.from - next.to;
            range = next;
        }
        while(assoc < 0 ? pos > range.to : pos >= range.to){
            if (index == this.ranges.length - 1) return null;
            let next = this.ranges[++index];
            pos += next.from - range.to;
            range = next;
        }
        return pos;
    }
    peek(offset) {
        let idx = this.chunkOff + offset, pos, result;
        if (idx >= 0 && idx < this.chunk.length) {
            pos = this.pos + offset;
            result = this.chunk.charCodeAt(idx);
        } else {
            let resolved = this.resolveOffset(offset, 1);
            if (resolved == null) return -1;
            pos = resolved;
            if (pos >= this.chunk2Pos && pos < this.chunk2Pos + this.chunk2.length) {
                result = this.chunk2.charCodeAt(pos - this.chunk2Pos);
            } else {
                let i = this.rangeIndex, range = this.range;
                while(range.to <= pos)range = this.ranges[++i];
                this.chunk2 = this.input.chunk(this.chunk2Pos = pos);
                if (pos + this.chunk2.length > range.to) this.chunk2 = this.chunk2.slice(0, range.to - pos);
                result = this.chunk2.charCodeAt(0);
            }
        }
        if (pos >= this.token.lookAhead) this.token.lookAhead = pos + 1;
        return result;
    }
    acceptToken(token, endOffset = 0) {
        let end = endOffset ? this.resolveOffset(endOffset, -1) : this.pos;
        if (end == null || end < this.token.start) throw new RangeError("Token end out of bounds");
        this.token.value = token;
        this.token.end = end;
    }
    getChunk() {
        if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
            let { chunk , chunkPos  } = this;
            this.chunk = this.chunk2;
            this.chunkPos = this.chunk2Pos;
            this.chunk2 = chunk;
            this.chunk2Pos = chunkPos;
            this.chunkOff = this.pos - this.chunkPos;
        } else {
            this.chunk2 = this.chunk;
            this.chunk2Pos = this.chunkPos;
            let nextChunk = this.input.chunk(this.pos);
            let end = this.pos + nextChunk.length;
            this.chunk = end > this.range.to ? nextChunk.slice(0, this.range.to - this.pos) : nextChunk;
            this.chunkPos = this.pos;
            this.chunkOff = 0;
        }
    }
    readNext() {
        if (this.chunkOff >= this.chunk.length) {
            this.getChunk();
            if (this.chunkOff == this.chunk.length) return this.next = -1;
        }
        return this.next = this.chunk.charCodeAt(this.chunkOff);
    }
    advance(n = 1) {
        this.chunkOff += n;
        while(this.pos + n >= this.range.to){
            if (this.rangeIndex == this.ranges.length - 1) return this.setDone();
            n -= this.range.to - this.pos;
            this.range = this.ranges[++this.rangeIndex];
            this.pos = this.range.from;
        }
        this.pos += n;
        if (this.pos >= this.token.lookAhead) this.token.lookAhead = this.pos + 1;
        return this.readNext();
    }
    setDone() {
        this.pos = this.chunkPos = this.end;
        this.range = this.ranges[this.rangeIndex = this.ranges.length - 1];
        this.chunk = "";
        return this.next = -1;
    }
    reset(pos, token) {
        if (token) {
            this.token = token;
            token.start = pos;
            token.lookAhead = pos + 1;
            token.value = token.extended = -1;
        } else {
            this.token = nullToken;
        }
        if (this.pos != pos) {
            this.pos = pos;
            if (pos == this.end) {
                this.setDone();
                return this;
            }
            while(pos < this.range.from)this.range = this.ranges[--this.rangeIndex];
            while(pos >= this.range.to)this.range = this.ranges[++this.rangeIndex];
            if (pos >= this.chunkPos && pos < this.chunkPos + this.chunk.length) {
                this.chunkOff = pos - this.chunkPos;
            } else {
                this.chunk = "";
                this.chunkOff = 0;
            }
            this.readNext();
        }
        return this;
    }
    read(from, to) {
        if (from >= this.chunkPos && to <= this.chunkPos + this.chunk.length) return this.chunk.slice(from - this.chunkPos, to - this.chunkPos);
        if (from >= this.range.from && to <= this.range.to) return this.input.read(from, to);
        let result = "";
        for (let r of this.ranges){
            if (r.from >= to) break;
            if (r.to > from) result += this.input.read(Math.max(r.from, from), Math.min(r.to, to));
        }
        return result;
    }
}
class TokenGroup {
    constructor(data, id){
        this.data = data;
        this.id = id;
    }
    token(input, stack) {
        readToken(this.data, input, stack, this.id);
    }
}
TokenGroup.prototype.contextual = TokenGroup.prototype.fallback = TokenGroup.prototype.extend = false;
function readToken(data, input, stack, group) {
    let state = 0, groupMask = 1 << group, { parser: parser9  } = stack.p, { dialect  } = parser9;
    scan: for(;;){
        if ((groupMask & data[state]) == 0) break;
        let accEnd = data[state + 1];
        for(let i171 = state + 3; i171 < accEnd; i171 += 2)if ((data[i171 + 1] & groupMask) > 0) {
            let term = data[i171];
            if (dialect.allows(term) && (input.token.value == -1 || input.token.value == term || parser9.overrides(term, input.token.value))) {
                input.acceptToken(term);
                break;
            }
        }
        for(let next = input.next, low = 0, high = data[state + 2]; low < high;){
            let mid = low + high >> 1;
            let index = accEnd + mid + (mid << 1);
            let from = data[index], to = data[index + 1];
            if (next < from) high = mid;
            else if (next >= to) low = mid + 1;
            else {
                state = data[index + 2];
                input.advance();
                continue scan;
            }
        }
        break;
    }
}
function decodeArray(input, Type = Uint16Array) {
    if (typeof input != "string") return input;
    let array = null;
    for(let pos = 0, out = 0; pos < input.length;){
        let value = 0;
        for(;;){
            let next = input.charCodeAt(pos++), stop = false;
            if (next == 126) {
                value = 65535;
                break;
            }
            if (next >= 92) next--;
            if (next >= 34) next--;
            let digit = next - 32;
            if (digit >= 46) {
                digit -= 46;
                stop = true;
            }
            value += digit;
            if (stop) break;
            value *= 46;
        }
        if (array) array[out++] = value;
        else array = new Type(value);
    }
    return array;
}
const verbose = typeof process != "undefined" && /\bparse\b/.test(process.env.LOG);
let stackIDs = null;
var Safety;
(function(Safety1) {
    Safety1[Safety1["Margin"] = 25] = "Margin";
})(Safety || (Safety = {
}));
function cutAt(tree, pos, side) {
    let cursor21 = tree.fullCursor();
    cursor21.moveTo(pos);
    for(;;){
        if (!(side < 0 ? cursor21.childBefore(pos) : cursor21.childAfter(pos))) for(;;){
            if ((side < 0 ? cursor21.to < pos : cursor21.from > pos) && !cursor21.type.isError) return side < 0 ? Math.max(0, Math.min(cursor21.to - 1, pos - 25)) : Math.min(tree.length, Math.max(cursor21.from + 1, pos + 25));
            if (side < 0 ? cursor21.prevSibling() : cursor21.nextSibling()) break;
            if (!cursor21.parent()) return side < 0 ? 0 : tree.length;
        }
    }
}
class FragmentCursor {
    constructor(fragments, nodeSet){
        this.fragments = fragments;
        this.nodeSet = nodeSet;
        this.i = 0;
        this.fragment = null;
        this.safeFrom = -1;
        this.safeTo = -1;
        this.trees = [];
        this.start = [];
        this.index = [];
        this.nextFragment();
    }
    nextFragment() {
        let fr = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
        if (fr) {
            this.safeFrom = fr.openStart ? cutAt(fr.tree, fr.from + fr.offset, 1) - fr.offset : fr.from;
            this.safeTo = fr.openEnd ? cutAt(fr.tree, fr.to + fr.offset, -1) - fr.offset : fr.to;
            while(this.trees.length){
                this.trees.pop();
                this.start.pop();
                this.index.pop();
            }
            this.trees.push(fr.tree);
            this.start.push(-fr.offset);
            this.index.push(0);
            this.nextStart = this.safeFrom;
        } else {
            this.nextStart = 1000000000;
        }
    }
    nodeAt(pos) {
        if (pos < this.nextStart) return null;
        while(this.fragment && this.safeTo <= pos)this.nextFragment();
        if (!this.fragment) return null;
        for(;;){
            let last = this.trees.length - 1;
            if (last < 0) {
                this.nextFragment();
                return null;
            }
            let top36 = this.trees[last], index = this.index[last];
            if (index == top36.children.length) {
                this.trees.pop();
                this.start.pop();
                this.index.pop();
                continue;
            }
            let next = top36.children[index];
            let start = this.start[last] + top36.positions[index];
            if (start > pos) {
                this.nextStart = start;
                return null;
            }
            if (next instanceof Tree) {
                if (start == pos) {
                    if (start < this.safeFrom) return null;
                    let end = start + next.length;
                    if (end <= this.safeTo) {
                        let lookAhead = next.prop(NodeProp.lookAhead);
                        if (!lookAhead || end + lookAhead < this.fragment.to) return next;
                    }
                }
                this.index[last]++;
                if (start + next.length >= Math.max(this.safeFrom, pos)) {
                    this.trees.push(next);
                    this.start.push(start);
                    this.index.push(0);
                }
            } else {
                this.index[last]++;
                this.nextStart = start + next.length;
            }
        }
    }
}
class TokenCache {
    constructor(parser10, stream){
        this.stream = stream;
        this.tokens = [];
        this.mainToken = null;
        this.actions = [];
        this.tokens = parser10.tokenizers.map((_)=>new CachedToken
        );
    }
    getActions(stack) {
        let actionIndex = 0;
        let main = null;
        let { parser: parser11  } = stack.p, { tokenizers  } = parser11;
        let mask = parser11.stateSlot(stack.state, 3);
        let context = stack.curContext ? stack.curContext.hash : 0;
        let lookAhead = 0;
        for(let i172 = 0; i172 < tokenizers.length; i172++){
            if ((1 << i172 & mask) == 0) continue;
            let tokenizer = tokenizers[i172], token = this.tokens[i172];
            if (main && !tokenizer.fallback) continue;
            if (tokenizer.contextual || token.start != stack.pos || token.mask != mask || token.context != context) {
                this.updateCachedToken(token, tokenizer, stack);
                token.mask = mask;
                token.context = context;
            }
            if (token.lookAhead > token.end + 25) lookAhead = Math.max(token.lookAhead, lookAhead);
            if (token.value != 0) {
                let startIndex = actionIndex;
                if (token.extended > -1) actionIndex = this.addActions(stack, token.extended, token.end, actionIndex);
                actionIndex = this.addActions(stack, token.value, token.end, actionIndex);
                if (!tokenizer.extend) {
                    main = token;
                    if (actionIndex > startIndex) break;
                }
            }
        }
        while(this.actions.length > actionIndex)this.actions.pop();
        if (lookAhead) stack.setLookAhead(lookAhead);
        if (!main && stack.pos == this.stream.end) {
            main = new CachedToken;
            main.value = stack.p.parser.eofTerm;
            main.start = main.end = stack.pos;
            actionIndex = this.addActions(stack, main.value, main.end, actionIndex);
        }
        this.mainToken = main;
        return this.actions;
    }
    getMainToken(stack) {
        if (this.mainToken) return this.mainToken;
        let main = new CachedToken, { pos , p: p21  } = stack;
        main.start = pos;
        main.end = Math.min(pos + 1, p21.stream.end);
        main.value = pos == p21.stream.end ? p21.parser.eofTerm : 0;
        return main;
    }
    updateCachedToken(token, tokenizer, stack) {
        tokenizer.token(this.stream.reset(stack.pos, token), stack);
        if (token.value > -1) {
            let { parser: parser12  } = stack.p;
            for(let i173 = 0; i173 < parser12.specialized.length; i173++)if (parser12.specialized[i173] == token.value) {
                let result = parser12.specializers[i173](this.stream.read(token.start, token.end), stack);
                if (result >= 0 && stack.p.parser.dialect.allows(result >> 1)) {
                    if ((result & 1) == 0) token.value = result >> 1;
                    else token.extended = result >> 1;
                    break;
                }
            }
        } else {
            token.value = 0;
            token.end = Math.min(stack.p.stream.end, stack.pos + 1);
        }
    }
    putAction(action, token, end, index) {
        for(let i174 = 0; i174 < index; i174 += 3)if (this.actions[i174] == action) return index;
        this.actions[index++] = action;
        this.actions[index++] = token;
        this.actions[index++] = end;
        return index;
    }
    addActions(stack, token, end, index) {
        let { state  } = stack, { parser: parser13  } = stack.p, { data  } = parser13;
        for(let set = 0; set < 2; set++){
            for(let i175 = parser13.stateSlot(state, set ? 2 : 1);; i175 += 3){
                if (data[i175] == 65535) {
                    if (data[i175 + 1] == 1) {
                        i175 = pair(data, i175 + 2);
                    } else {
                        if (index == 0 && data[i175 + 1] == 2) index = this.putAction(pair(data, i175 + 2), token, end, index);
                        break;
                    }
                }
                if (data[i175] == token) index = this.putAction(pair(data, i175 + 1), token, end, index);
            }
        }
        return index;
    }
}
var Rec;
(function(Rec1) {
    Rec1[Rec1["Distance"] = 5] = "Distance";
    Rec1[Rec1["MaxRemainingPerStep"] = 3] = "MaxRemainingPerStep";
    Rec1[Rec1["MinBufferLengthPrune"] = 500] = "MinBufferLengthPrune";
    Rec1[Rec1["ForceReduceLimit"] = 10] = "ForceReduceLimit";
    Rec1[Rec1["CutDepth"] = 15000] = "CutDepth";
    Rec1[Rec1["CutTo"] = 9000] = "CutTo";
})(Rec || (Rec = {
}));
class Parse {
    constructor(parser14, input, fragments, ranges){
        this.parser = parser14;
        this.input = input;
        this.ranges = ranges;
        this.recovering = 0;
        this.nextStackID = 9812;
        this.minStackPos = 0;
        this.reused = [];
        this.stoppedAt = null;
        this.stream = new InputStream(input, ranges);
        this.tokens = new TokenCache(parser14, this.stream);
        this.topTerm = parser14.top[1];
        let { from  } = ranges[0];
        this.stacks = [
            Stack.start(this, parser14.top[0], from)
        ];
        this.fragments = fragments.length && this.stream.end - from > parser14.bufferLength * 4 ? new FragmentCursor(fragments, parser14.nodeSet) : null;
    }
    get parsedPos() {
        return this.minStackPos;
    }
    advance() {
        let stacks = this.stacks, pos = this.minStackPos;
        let newStacks = this.stacks = [];
        let stopped, stoppedTokens;
        for(let i177 = 0; i177 < stacks.length; i177++){
            let stack = stacks[i177];
            for(;;){
                this.tokens.mainToken = null;
                if (stack.pos > pos) {
                    newStacks.push(stack);
                } else if (this.advanceStack(stack, newStacks, stacks)) {
                    continue;
                } else {
                    if (!stopped) {
                        stopped = [];
                        stoppedTokens = [];
                    }
                    stopped.push(stack);
                    let tok = this.tokens.getMainToken(stack);
                    stoppedTokens.push(tok.value, tok.end);
                }
                break;
            }
        }
        if (!newStacks.length) {
            let finished = stopped && findFinished(stopped);
            if (finished) return this.stackToTree(finished);
            if (this.parser.strict) {
                if (verbose && stopped) console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none"));
                throw new SyntaxError("No parse at " + pos);
            }
            if (!this.recovering) this.recovering = 5;
        }
        if (this.recovering && stopped) {
            let finished = this.stoppedAt != null && stopped[0].pos > this.stoppedAt ? stopped[0] : this.runRecovery(stopped, stoppedTokens, newStacks);
            if (finished) return this.stackToTree(finished.forceAll());
        }
        if (this.recovering) {
            let maxRemaining = this.recovering == 1 ? 1 : this.recovering * 3;
            if (newStacks.length > maxRemaining) {
                newStacks.sort((a, b)=>b.score - a.score
                );
                while(newStacks.length > maxRemaining)newStacks.pop();
            }
            if (newStacks.some((s)=>s.reducePos > pos
            )) this.recovering--;
        } else if (newStacks.length > 1) {
            outer: for(let i178 = 0; i178 < newStacks.length - 1; i178++){
                let stack = newStacks[i178];
                for(let j = i178 + 1; j < newStacks.length; j++){
                    let other = newStacks[j];
                    if (stack.sameState(other) || stack.buffer.length > 500 && other.buffer.length > 500) {
                        if ((stack.score - other.score || stack.buffer.length - other.buffer.length) > 0) {
                            newStacks.splice(j--, 1);
                        } else {
                            newStacks.splice(i178--, 1);
                            continue outer;
                        }
                    }
                }
            }
        }
        this.minStackPos = newStacks[0].pos;
        for(let i176 = 1; i176 < newStacks.length; i176++)if (newStacks[i176].pos < this.minStackPos) this.minStackPos = newStacks[i176].pos;
        return null;
    }
    stopAt(pos) {
        if (this.stoppedAt != null && this.stoppedAt < pos) throw new RangeError("Can't move stoppedAt forward");
        this.stoppedAt = pos;
    }
    advanceStack(stack, stacks, split) {
        let start = stack.pos, { parser: parser15  } = this;
        let base19 = verbose ? this.stackID(stack) + " -> " : "";
        if (this.stoppedAt != null && start > this.stoppedAt) return stack.forceReduce() ? stack : null;
        if (this.fragments) {
            let strictCx = stack.curContext && stack.curContext.tracker.strict, cxHash = strictCx ? stack.curContext.hash : 0;
            for(let cached = this.fragments.nodeAt(start); cached;){
                let match = this.parser.nodeSet.types[cached.type.id] == cached.type ? parser15.getGoto(stack.state, cached.type.id) : -1;
                if (match > -1 && cached.length && (!strictCx || (cached.prop(NodeProp.contextHash) || 0) == cxHash)) {
                    stack.useNode(cached, match);
                    if (verbose) console.log(base19 + this.stackID(stack) + ` (via reuse of ${parser15.getName(cached.type.id)})`);
                    return true;
                }
                if (!(cached instanceof Tree) || cached.children.length == 0 || cached.positions[0] > 0) break;
                let inner = cached.children[0];
                if (inner instanceof Tree && cached.positions[0] == 0) cached = inner;
                else break;
            }
        }
        let defaultReduce = parser15.stateSlot(stack.state, 4);
        if (defaultReduce > 0) {
            stack.reduce(defaultReduce);
            if (verbose) console.log(base19 + this.stackID(stack) + ` (via always-reduce ${parser15.getName(defaultReduce & 65535)})`);
            return true;
        }
        if (stack.stack.length >= 15000) {
            while(stack.stack.length > 9000 && stack.forceReduce()){
            }
        }
        let actions = this.tokens.getActions(stack);
        for(let i179 = 0; i179 < actions.length;){
            let action = actions[i179++], term = actions[i179++], end = actions[i179++];
            let last = i179 == actions.length || !split;
            let localStack = last ? stack : stack.split();
            localStack.apply(action, term, end);
            if (verbose) console.log(base19 + this.stackID(localStack) + ` (via ${(action & 65536) == 0 ? "shift" : `reduce of ${parser15.getName(action & 65535)}`} for ${parser15.getName(term)} @ ${start}${localStack == stack ? "" : ", split"})`);
            if (last) return true;
            else if (localStack.pos > start) stacks.push(localStack);
            else split.push(localStack);
        }
        return false;
    }
    advanceFully(stack, newStacks) {
        let pos = stack.pos;
        for(;;){
            if (!this.advanceStack(stack, null, null)) return false;
            if (stack.pos > pos) {
                pushStackDedup(stack, newStacks);
                return true;
            }
        }
    }
    runRecovery(stacks, tokens, newStacks) {
        let finished = null, restarted = false;
        for(let i180 = 0; i180 < stacks.length; i180++){
            let stack = stacks[i180], token = tokens[i180 << 1], tokenEnd = tokens[(i180 << 1) + 1];
            let base20 = verbose ? this.stackID(stack) + " -> " : "";
            if (stack.deadEnd) {
                if (restarted) continue;
                restarted = true;
                stack.restart();
                if (verbose) console.log(base20 + this.stackID(stack) + " (restarted)");
                let done = this.advanceFully(stack, newStacks);
                if (done) continue;
            }
            let force = stack.split(), forceBase = base20;
            for(let j = 0; force.forceReduce() && j < 10; j++){
                if (verbose) console.log(forceBase + this.stackID(force) + " (via force-reduce)");
                let done = this.advanceFully(force, newStacks);
                if (done) break;
                if (verbose) forceBase = this.stackID(force) + " -> ";
            }
            for (let insert10 of stack.recoverByInsert(token)){
                if (verbose) console.log(base20 + this.stackID(insert10) + " (via recover-insert)");
                this.advanceFully(insert10, newStacks);
            }
            if (this.stream.end > stack.pos) {
                if (tokenEnd == stack.pos) {
                    tokenEnd++;
                    token = 0;
                }
                stack.recoverByDelete(token, tokenEnd);
                if (verbose) console.log(base20 + this.stackID(stack) + ` (via recover-delete ${this.parser.getName(token)})`);
                pushStackDedup(stack, newStacks);
            } else if (!finished || finished.score < stack.score) {
                finished = stack;
            }
        }
        return finished;
    }
    stackToTree(stack) {
        stack.close();
        return Tree.build({
            buffer: StackBufferCursor.create(stack),
            nodeSet: this.parser.nodeSet,
            topID: this.topTerm,
            maxBufferLength: this.parser.bufferLength,
            reused: this.reused,
            start: this.ranges[0].from,
            length: stack.pos - this.ranges[0].from,
            minRepeatType: this.parser.minRepeatTerm
        });
    }
    stackID(stack) {
        let id = (stackIDs || (stackIDs = new WeakMap)).get(stack);
        if (!id) stackIDs.set(stack, id = String.fromCodePoint(this.nextStackID++));
        return id + stack;
    }
}
function pushStackDedup(stack, newStacks) {
    for(let i181 = 0; i181 < newStacks.length; i181++){
        let other = newStacks[i181];
        if (other.pos == stack.pos && other.sameState(stack)) {
            if (newStacks[i181].score < stack.score) newStacks[i181] = stack;
            return;
        }
    }
    newStacks.push(stack);
}
class Dialect {
    constructor(source, flags, disabled){
        this.source = source;
        this.flags = flags;
        this.disabled = disabled;
    }
    allows(term) {
        return !this.disabled || this.disabled[term] == 0;
    }
}
class LRParser extends Parser {
    constructor(spec){
        super();
        this.wrappers = [];
        if (spec.version != 13) throw new RangeError(`Parser version (${spec.version}) doesn't match runtime version (${13})`);
        let nodeNames = spec.nodeNames.split(" ");
        this.minRepeatTerm = nodeNames.length;
        for(let i184 = 0; i184 < spec.repeatNodeCount; i184++)nodeNames.push("");
        let topTerms = Object.keys(spec.topRules).map((r)=>spec.topRules[r][1]
        );
        let nodeProps = [];
        for(let i182 = 0; i182 < nodeNames.length; i182++)nodeProps.push([]);
        function setProp(nodeID, prop, value) {
            nodeProps[nodeID].push([
                prop,
                prop.deserialize(String(value))
            ]);
        }
        if (spec.nodeProps) for (let propSpec of spec.nodeProps){
            let prop = propSpec[0];
            for(let i185 = 1; i185 < propSpec.length;){
                let next = propSpec[i185++];
                if (next >= 0) {
                    setProp(next, prop, propSpec[i185++]);
                } else {
                    let value = propSpec[i185 + -next];
                    for(let j = -next; j > 0; j--)setProp(propSpec[i185++], prop, value);
                    i185++;
                }
            }
        }
        this.nodeSet = new NodeSet(nodeNames.map((name20, i186)=>NodeType.define({
                name: i186 >= this.minRepeatTerm ? undefined : name20,
                id: i186,
                props: nodeProps[i186],
                top: topTerms.indexOf(i186) > -1,
                error: i186 == 0,
                skipped: spec.skippedNodes && spec.skippedNodes.indexOf(i186) > -1
            })
        ));
        this.strict = false;
        this.bufferLength = DefaultBufferLength;
        let tokenArray = decodeArray(spec.tokenData);
        this.context = spec.context;
        this.specialized = new Uint16Array(spec.specialized ? spec.specialized.length : 0);
        this.specializers = [];
        if (spec.specialized) for(let i183 = 0; i183 < spec.specialized.length; i183++){
            this.specialized[i183] = spec.specialized[i183].term;
            this.specializers[i183] = spec.specialized[i183].get;
        }
        this.states = decodeArray(spec.states, Uint32Array);
        this.data = decodeArray(spec.stateData);
        this.goto = decodeArray(spec.goto);
        this.maxTerm = spec.maxTerm;
        this.tokenizers = spec.tokenizers.map((value)=>typeof value == "number" ? new TokenGroup(tokenArray, value) : value
        );
        this.topRules = spec.topRules;
        this.dialects = spec.dialects || {
        };
        this.dynamicPrecedences = spec.dynamicPrecedences || null;
        this.tokenPrecTable = spec.tokenPrec;
        this.termNames = spec.termNames || null;
        this.maxNode = this.nodeSet.types.length - 1;
        this.dialect = this.parseDialect();
        this.top = this.topRules[Object.keys(this.topRules)[0]];
    }
    createParse(input, fragments, ranges) {
        let parse = new Parse(this, input, fragments, ranges);
        for (let w of this.wrappers)parse = w(parse, input, fragments, ranges);
        return parse;
    }
    getGoto(state, term, loose = false) {
        let table = this.goto;
        if (term >= table[0]) return -1;
        for(let pos = table[term + 1];;){
            let groupTag = table[pos++], last = groupTag & 1;
            let target = table[pos++];
            if (last && loose) return target;
            for(let end = pos + (groupTag >> 1); pos < end; pos++)if (table[pos] == state) return target;
            if (last) return -1;
        }
    }
    hasAction(state, terminal) {
        let data = this.data;
        for(let set = 0; set < 2; set++){
            for(let i187 = this.stateSlot(state, set ? 2 : 1), next;; i187 += 3){
                if ((next = data[i187]) == 65535) {
                    if (data[i187 + 1] == 1) next = data[i187 = pair(data, i187 + 2)];
                    else if (data[i187 + 1] == 2) return pair(data, i187 + 2);
                    else break;
                }
                if (next == terminal || next == 0) return pair(data, i187 + 1);
            }
        }
        return 0;
    }
    stateSlot(state, slot) {
        return this.states[state * 6 + slot];
    }
    stateFlag(state, flag) {
        return (this.stateSlot(state, 0) & flag) > 0;
    }
    validAction(state, action) {
        if (action == this.stateSlot(state, 4)) return true;
        for(let i188 = this.stateSlot(state, 1);; i188 += 3){
            if (this.data[i188] == 65535) {
                if (this.data[i188 + 1] == 1) i188 = pair(this.data, i188 + 2);
                else return false;
            }
            if (action == pair(this.data, i188 + 1)) return true;
        }
    }
    nextStates(state) {
        let result = [];
        for(let i189 = this.stateSlot(state, 1);; i189 += 3){
            if (this.data[i189] == 65535) {
                if (this.data[i189 + 1] == 1) i189 = pair(this.data, i189 + 2);
                else break;
            }
            if ((this.data[i189 + 2] & 65536 >> 16) == 0) {
                let value = this.data[i189 + 1];
                if (!result.some((v, i190)=>i190 & 1 && v == value
                )) result.push(this.data[i189], value);
            }
        }
        return result;
    }
    overrides(token, prev) {
        let iPrev = findOffset(this.data, this.tokenPrecTable, prev);
        return iPrev < 0 || findOffset(this.data, this.tokenPrecTable, token) < iPrev;
    }
    configure(config33) {
        let copy = Object.assign(Object.create(LRParser.prototype), this);
        if (config33.props) copy.nodeSet = this.nodeSet.extend(...config33.props);
        if (config33.top) {
            let info = this.topRules[config33.top];
            if (!info) throw new RangeError(`Invalid top rule name ${config33.top}`);
            copy.top = info;
        }
        if (config33.tokenizers) copy.tokenizers = this.tokenizers.map((t20)=>{
            let found = config33.tokenizers.find((r)=>r.from == t20
            );
            return found ? found.to : t20;
        });
        if (config33.contextTracker) copy.context = config33.contextTracker;
        if (config33.dialect) copy.dialect = this.parseDialect(config33.dialect);
        if (config33.strict != null) copy.strict = config33.strict;
        if (config33.wrap) copy.wrappers = copy.wrappers.concat(config33.wrap);
        if (config33.bufferLength != null) copy.bufferLength = config33.bufferLength;
        return copy;
    }
    getName(term) {
        return this.termNames ? this.termNames[term] : String(term <= this.maxNode && this.nodeSet.types[term].name || term);
    }
    get eofTerm() {
        return this.maxNode + 1;
    }
    get topNode() {
        return this.nodeSet.types[this.top[1]];
    }
    dynamicPrecedence(term) {
        let prec3 = this.dynamicPrecedences;
        return prec3 == null ? 0 : prec3[term] || 0;
    }
    parseDialect(dialect) {
        let values = Object.keys(this.dialects), flags = values.map(()=>false
        );
        if (dialect) for (let part of dialect.split(" ")){
            let id = values.indexOf(part);
            if (id >= 0) flags[id] = true;
        }
        let disabled = null;
        for(let i191 = 0; i191 < values.length; i191++)if (!flags[i191]) {
            for(let j = this.dialects[values[i191]], id; (id = this.data[j++]) != 65535;)(disabled || (disabled = new Uint8Array(this.maxTerm + 1)))[id] = 1;
        }
        return new Dialect(dialect, flags, disabled);
    }
    static deserialize(spec) {
        return new LRParser(spec);
    }
}
function pair(data, off) {
    return data[off] | data[off + 1] << 16;
}
function findOffset(data, start, term) {
    for(let i192 = start, next; (next = data[i192]) != 65535; i192++)if (next == term) return i192 - start;
    return -1;
}
function findFinished(stacks) {
    let best = null;
    for (let stack of stacks){
        let stopped = stack.p.stoppedAt;
        if ((stack.pos == stack.p.stream.end || stopped != null && stack.pos > stopped) && stack.p.parser.stateFlag(stack.state, 2) && (!best || best.score < stack.score)) best = stack;
    }
    return best;
}
const parser$1 = LRParser.deserialize({
    version: 13,
    states: "!vOQOPOOO]OPO'#C`OhOPO'#C^OOOO'#Cc'#CcOsOPO'#C^QOOOOOO!ROPO,58zO]OPO,58zO!WOPO,58xOOOO-E6a-E6aOOOO1G.f1G.fO!cOPO1G.fP!hOPO'#C`OOOO7+$Q7+$Q",
    stateData: "!m~OTQOUPOWQP~OTQOUPORQP~OUVOWQXRQX~OTWOUPOWQXRQX~ORYO~OUVOWQaRQa~OR]O~OUVO~O",
    goto: "pWPPXPbPPhQTOQUPRZVXROPSVUSOPVRXS",
    nodeNames: "⚠ Top Jevko ] Subjevko Text [",
    maxTerm: 8,
    skippedNodes: [
        0
    ],
    repeatNodeCount: 1,
    tokenData: "!d~RVO!}h!}#O!Y#O#Ph#P#Q!_#Q#Sh#S#T|#T~h~mTT~O!}h#O#Ph#Q#Sh#S#T|#T~h~!PR!}#Oh#P#Qh#S#Th~!_OU~~!dOR~",
    tokenizers: [
        0
    ],
    topRules: {
        "Top": [
            0,
            1
        ]
    },
    tokenPrec: 0
});
const jevkoLanguage = LRLanguage.define({
    parser: parser$1.configure({
        props: [
            indentNodeProp.add({
                'Subjevko': (context)=>{
                    return (context.continue() || context.baseIndent) + 1 * context.unit;
                }
            }),
            foldNodeProp.add({
                Subjevko: foldInside$1
            }),
            styleTags({
                'Jevko/Text': tags.string,
                'Subjevko/Text': tags.labelName,
                "[ ]": tags.paren
            })
        ]
    }),
    languageData: {
    }
});
function jevko() {
    return new LanguageSupport(jevkoLanguage);
}
const parser = LRParser.deserialize({
    version: 13,
    states: "$bOVQPOOOOQO'#Cb'#CbOnQPO'#CeOvQPO'#CjOOQO'#Cp'#CpQOQPOOOOQO'#Cg'#CgO}QPO'#CfO!SQPO'#CrOOQO,59P,59PO![QPO,59PO!aQPO'#CuOOQO,59U,59UO!iQPO,59UOVQPO,59QOqQPO'#CkO!nQPO,59^OOQO1G.k1G.kOVQPO'#ClO!vQPO,59aOOQO1G.p1G.pOOQO1G.l1G.lOOQO,59V,59VOOQO-E6i-E6iOOQO,59W,59WOOQO-E6j-E6j",
    stateData: "#O~OcOS~OQSORSOSSOTSOWQO]ROePO~OVXOeUO~O[[O~PVOg^O~Oh_OVfX~OVaO~OhbO[iX~O[dO~Oh_OVfa~OhbO[ia~O",
    goto: "!kjPPPPPPkPPkqwPPk{!RPPP!XP!ePP!hXSOR^bQWQRf_TVQ_Q`WRg`QcZRicQTOQZRQe^RhbRYQR]R",
    nodeNames: "⚠ JsonText True False Null Number String } { Object Property PropertyName ] [ Array",
    maxTerm: 25,
    nodeProps: [
        [
            NodeProp.openedBy,
            7,
            "{",
            12,
            "["
        ],
        [
            NodeProp.closedBy,
            8,
            "}",
            13,
            "]"
        ]
    ],
    skippedNodes: [
        0
    ],
    repeatNodeCount: 2,
    tokenData: "(p~RaXY!WYZ!W]^!Wpq!Wrs!]|}$i}!O$n!Q!R$w!R![&V![!]&h!}#O&m#P#Q&r#Y#Z&w#b#c'f#h#i'}#o#p(f#q#r(k~!]Oc~~!`Upq!]qr!]rs!rs#O!]#O#P!w#P~!]~!wOe~~!zXrs!]!P!Q!]#O#P!]#U#V!]#Y#Z!]#b#c!]#f#g!]#h#i!]#i#j#g~#jR!Q![#s!c!i#s#T#Z#s~#vR!Q![$P!c!i$P#T#Z$P~$SR!Q![$]!c!i$]#T#Z$]~$`R!Q![!]!c!i!]#T#Z!]~$nOh~~$qQ!Q!R$w!R![&V~$|RT~!O!P%V!g!h%k#X#Y%k~%YP!Q![%]~%bRT~!Q![%]!g!h%k#X#Y%k~%nR{|%w}!O%w!Q![%}~%zP!Q![%}~&SPT~!Q![%}~&[ST~!O!P%V!Q![&V!g!h%k#X#Y%k~&mOg~~&rO]~~&wO[~~&zP#T#U&}~'QP#`#a'T~'WP#g#h'Z~'^P#X#Y'a~'fOR~~'iP#i#j'l~'oP#`#a'r~'uP#`#a'x~'}OS~~(QP#f#g(T~(WP#i#j(Z~(^P#X#Y(a~(fOQ~~(kOW~~(pOV~",
    tokenizers: [
        0
    ],
    topRules: {
        "JsonText": [
            0,
            1
        ]
    },
    tokenPrec: 0
});
const jsonLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            indentNodeProp.add({
                Object: continuedIndent({
                    except: /^\s*\}/
                }),
                Array: continuedIndent({
                    except: /^\s*\]/
                })
            }),
            foldNodeProp.add({
                "Object Array": foldInside$1
            }),
            styleTags({
                String: tags.string,
                Number: tags.number,
                "True False": tags.bool,
                PropertyName: tags.propertyName,
                null: tags.null,
                ",": tags.separator,
                "[ ]": tags.squareBracket,
                "{ }": tags.brace
            })
        ]
    }),
    languageData: {
        closeBrackets: {
            brackets: [
                "[",
                "{",
                '"'
            ]
        },
        indentOnInput: /^\s*[\}\]]$/
    }
});
function json() {
    return new LanguageSupport(jsonLanguage);
}
const makeJevkoEditor = (parent)=>{
    return new EditorView({
        state: EditorState.create({
            extensions: [
                basicSetup,
                oneDark,
                jevko()
            ]
        }),
        parent
    });
};
const makeJsonEditor = (parent)=>{
    return new EditorView({
        state: EditorState.create({
            extensions: [
                basicSetup,
                oneDark,
                json()
            ]
        }),
        parent
    });
};
const jsonToSchema = (json1)=>{
    if (typeof json1 === 'string') {
        return {
            type: 'string'
        };
    }
    if (typeof json1 === 'number') {
        return {
            type: 'float64'
        };
    }
    if (typeof json1 === 'boolean') {
        return {
            type: 'boolean'
        };
    }
    if (json1 === null) {
        return {
            type: 'null'
        };
    }
    if (Array.isArray(json1)) {
        const itemSchemas = [];
        for (const val of json1){
            itemSchemas.push(jsonToSchema(val));
        }
        return {
            type: 'tuple',
            itemSchemas
        };
    }
    const entries = Object.entries(json1);
    let props = Object.create(null);
    for (const [key, val] of entries){
        props[key] = jsonToSchema(val);
    }
    return {
        type: 'object',
        props
    };
};
const jsonToJevko = (json2)=>{
    if ([
        'string',
        'boolean',
        'number'
    ].includes(typeof json2)) return {
        subjevkos: [],
        suffix: json2.toString()
    };
    if (json2 === null) return {
        subjevkos: [],
        suffix: ''
    };
    if (Array.isArray(json2)) {
        return {
            subjevkos: json2.map((v)=>({
                    prefix: '',
                    jevko: jsonToJevko(v)
                })
            ),
            suffix: ''
        };
    }
    const entries = Object.entries(json2);
    return {
        suffix: '',
        subjevkos: entries.map(([k, v])=>({
                prefix: k,
                jevko: jsonToJevko(v)
            })
        )
    };
};
const interJevkoToSchema = (jevko2)=>{
    const { subjevkos , suffix  } = jevko2;
    const trimmed = suffix.trim();
    if (subjevkos.length === 0) {
        if ([
            'true',
            'false'
        ].includes(trimmed)) return {
            type: 'boolean'
        };
        if (trimmed === 'null' || suffix === '') return {
            type: 'null'
        };
        if (trimmed === 'NaN') return {
            type: 'float64'
        };
        const num = Number(trimmed);
        if (Number.isNaN(num)) return {
            type: 'string'
        };
        return {
            type: 'float64'
        };
    }
    if (trimmed !== '') throw Error('suffix must be blank');
    const { prefix  } = subjevkos[0];
    if (prefix.trim() === '') {
        const itemSchemas = [];
        for (const { prefix , jevko: jevko3  } of subjevkos){
            if (prefix.trim() !== '') throw Error('bad tuple/array');
            itemSchemas.push(interJevkoToSchema(jevko3));
        }
        return {
            type: 'tuple',
            itemSchemas
        };
    }
    const props = Object.create(null);
    for (const { prefix: prefix1 , jevko: jevko1  } of subjevkos){
        const key = prefix1.trim();
        if (key in props) throw Error(`duplicate key (${key})`);
        props[key] = interJevkoToSchema(jevko1);
    }
    return {
        type: 'object',
        props
    };
};
const escape = (str)=>{
    let ret = '';
    for (const c of str){
        if (c === '[' || c === ']' || c === '`') ret += '`';
        ret += c;
    }
    return ret;
};
const jevkoToPrettyString = (jevko4)=>{
    const { subjevkos , suffix  } = jevko4;
    let ret = '';
    for (const { prefix , jevko: jevko1  } of subjevkos){
        ret += `${escapePrefix(prefix)}[${recur(jevko1, '  ', '')}]\n`;
    }
    return ret + escape(suffix);
};
const escapePrefix = (prefix)=>prefix === '' ? '' : escape(prefix) + ' '
;
const recur = (jevko1, indent, prevIndent)=>{
    const { subjevkos , suffix  } = jevko1;
    let ret = '';
    if (subjevkos.length > 0) {
        ret += '\n';
        for (const { prefix , jevko: jevko5  } of subjevkos){
            ret += `${indent}${escapePrefix(prefix)}[${recur(jevko5, indent + '  ', indent)}]\n`;
        }
        ret += prevIndent;
    }
    return ret + escape(suffix);
};
const argsToJevko = (...args)=>{
    const subjevkos = [];
    let subjevko = {
        prefix: ''
    };
    for(let i2 = 0; i2 < args.length; ++i2){
        const arg = args[i2];
        if (Array.isArray(arg)) {
            subjevko.jevko = argsToJevko(...arg);
            subjevkos.push(subjevko);
            subjevko = {
                prefix: ''
            };
        } else if (typeof arg === 'string') {
            subjevko.prefix += arg;
        } else throw Error(`Argument #${i2} has unrecognized type (${typeof arg})! Only strings and arrays are allowed. The argument's value is: ${arg}`);
    }
    return {
        subjevkos,
        suffix: subjevko.prefix
    };
};
const jevkoToPrettyJevko = (jevko6)=>{
    return argsToJevko(...recur0(jevko6));
};
const recur0 = (jevko7)=>{
    const { subjevkos , suffix  } = jevko7;
    let ret = [];
    for (const { prefix , jevko: jevko1  } of subjevkos){
        ret.push(escapePrefix1(prefix), recur1(jevko1, '  ', ''), '\n');
    }
    ret.push(suffix);
    return ret;
};
const escapePrefix1 = (prefix)=>prefix === '' ? '' : prefix + ' '
;
const recur1 = (jevko8, indent, prevIndent)=>{
    const { subjevkos , suffix  } = jevko8;
    let ret = [];
    if (subjevkos.length > 0) {
        ret.push('\n');
        for (const { prefix , jevko: jevko9  } of subjevkos){
            ret.push(indent, escapePrefix1(prefix), recur1(jevko9, indent + '  ', indent), '\n');
        }
        ret.push(prevIndent);
    }
    ret.push(suffix);
    return ret;
};
const jevkoToString = (jevko10)=>{
    const { subjevkos , suffix  } = jevko10;
    let ret = '';
    for (const { prefix , jevko: jevko1  } of subjevkos){
        ret += `${escape(prefix)}[${jevkoToString(jevko1)}]`;
    }
    return ret + escape(suffix);
};
const jv = (strings, ...keys)=>{
    let ret = '';
    for(let i3 = 0; i3 < strings.length - 1; ++i3){
        const str = strings[i3];
        const k = keys[i3];
        ret += str + escape(k.toString());
    }
    return ret + strings[strings.length - 1];
};
const jsonToSchema1 = (json3)=>{
    if (typeof json3 === 'string') {
        return {
            type: 'string'
        };
    }
    if (typeof json3 === 'number') {
        return {
            type: 'float64'
        };
    }
    if (typeof json3 === 'boolean') {
        return {
            type: 'boolean'
        };
    }
    if (json3 === null) {
        return {
            type: 'null'
        };
    }
    if (Array.isArray(json3)) {
        const itemSchemas = [];
        for (const val of json3){
            itemSchemas.push(jsonToSchema1(val));
        }
        return {
            type: 'tuple',
            itemSchemas
        };
    }
    const entries = Object.entries(json3);
    let props = Object.create(null);
    for (const [key, val] of entries){
        props[key] = jsonToSchema1(val);
    }
    return {
        type: 'object',
        props
    };
};
const jsonToJevko1 = (json4)=>{
    if ([
        'string',
        'boolean',
        'number'
    ].includes(typeof json4)) return {
        subjevkos: [],
        suffix: json4.toString()
    };
    if (json4 === null) return {
        subjevkos: [],
        suffix: ''
    };
    if (Array.isArray(json4)) {
        return {
            subjevkos: json4.map((v)=>({
                    prefix: '',
                    jevko: jsonToJevko1(v)
                })
            ),
            suffix: ''
        };
    }
    const entries = Object.entries(json4);
    return {
        suffix: '',
        subjevkos: entries.map(([k, v])=>({
                prefix: k,
                jevko: jsonToJevko1(v)
            })
        )
    };
};
const parseJevko = (str, { opener ='[' , closer =']' , escaper ='`'  } = {
})=>{
    const parents = [];
    let parent = {
        subjevkos: []
    }, buffer = '', isEscaped = false;
    let line = 1, column = 1;
    for(let i4 = 0; i4 < str.length; ++i4){
        const c = str[i4];
        if (isEscaped) {
            if (c === escaper || c === opener || c === closer) {
                buffer += c;
                isEscaped = false;
            } else throw SyntaxError(`Invalid digraph (${escaper}${c}) at ${line}:${column}!`);
        } else if (c === escaper) {
            isEscaped = true;
        } else if (c === opener) {
            const jevko11 = {
                subjevkos: []
            };
            parent.subjevkos.push({
                prefix: buffer,
                jevko: jevko11
            });
            parents.push(parent);
            parent = jevko11;
            buffer = '';
        } else if (c === closer) {
            parent.suffix = buffer;
            buffer = '';
            if (parents.length < 1) throw SyntaxError(`Unexpected closer (${closer}) at ${line}:${column}!`);
            parent = parents.pop();
        } else {
            buffer += c;
        }
        if (c === '\n') {
            ++line;
            column = 1;
        } else {
            ++column;
        }
    }
    if (isEscaped) throw SyntaxError(`Unexpected end after escaper (${escaper})!`);
    if (parents.length > 0) throw SyntaxError(`Unexpected end: missing ${parents.length} closer(s) (${closer})!`);
    parent.suffix = buffer;
    parent.opener = opener;
    parent.closer = closer;
    parent.escaper = escaper;
    return parent;
};
const escape1 = (str)=>{
    let ret = '';
    for (const c of str){
        if (c === '[' || c === ']' || c === '`') ret += '`';
        ret += c;
    }
    return ret;
};
const escapePrefix2 = (prefix)=>prefix === '' ? '' : escape1(prefix) + ' '
;
const recur2 = (jevko12, indent, prevIndent)=>{
    const { subjevkos , suffix  } = jevko12;
    let ret = '';
    if (subjevkos.length > 0) {
        ret += '\n';
        for (const { prefix , jevko: jevko13  } of subjevkos){
            ret += `${indent}${escapePrefix2(prefix)}[${recur2(jevko13, indent + '  ', indent)}]\n`;
        }
        ret += prevIndent;
    }
    return ret + escape1(suffix);
};
const argsToJevko1 = (...args)=>{
    const subjevkos = [];
    let subjevko = {
        prefix: ''
    };
    for(let i5 = 0; i5 < args.length; ++i5){
        const arg = args[i5];
        if (Array.isArray(arg)) {
            subjevko.jevko = argsToJevko1(...arg);
            subjevkos.push(subjevko);
            subjevko = {
                prefix: ''
            };
        } else if (typeof arg === 'string') {
            subjevko.prefix += arg;
        } else throw Error(`Argument #${i5} has unrecognized type (${typeof arg})! Only strings and arrays are allowed. The argument's value is: ${arg}`);
    }
    return {
        subjevkos,
        suffix: subjevko.prefix
    };
};
const escapePrefix3 = (prefix)=>prefix === '' ? '' : prefix + ' '
;
const recur3 = (jevko14, indent, prevIndent)=>{
    const { subjevkos , suffix  } = jevko14;
    let ret = [];
    if (subjevkos.length > 0) {
        ret.push('\n');
        for (const { prefix , jevko: jevko15  } of subjevkos){
            ret.push(indent, escapePrefix3(prefix), recur3(jevko15, indent + '  ', indent), '\n');
        }
        ret.push(prevIndent);
    }
    ret.push(suffix);
    return ret;
};
const trim3 = (prefix)=>{
    let i6 = 0, j = 0;
    for(; i6 < prefix.length; ++i6){
        if (isWhitespace(prefix[i6]) === false) break;
    }
    for(j = prefix.length - 1; j > i6; --j){
        if (isWhitespace(prefix[j]) === false) break;
    }
    ++j;
    return [
        prefix.slice(0, i6),
        prefix.slice(i6, j),
        prefix.slice(j)
    ];
};
const isWhitespace = (c)=>{
    return ' \n\r\t'.includes(c);
};
const jevkoToString1 = (jevko16)=>{
    const { subjevkos , suffix  } = jevko16;
    let ret = '';
    for (const { prefix , jevko: jevko1  } of subjevkos){
        ret += `${escape1(prefix)}[${jevkoToString1(jevko1)}]`;
    }
    return ret + escape1(suffix);
};
const interJevkoToSchema1 = (jevko17)=>{
    const { subjevkos , suffix  } = jevko17;
    const trimmed = suffix.trim();
    if (subjevkos.length === 0) {
        if ([
            'true',
            'false'
        ].includes(trimmed)) return {
            type: 'boolean'
        };
        if (trimmed === 'null') return {
            type: 'null'
        };
        if (trimmed === 'NaN') return {
            type: 'float64'
        };
        if (trimmed === '') return {
            type: 'string'
        };
        const num = Number(trimmed);
        if (Number.isNaN(num)) return {
            type: 'string'
        };
        return {
            type: 'float64'
        };
    }
    if (trimmed !== '') throw Error('suffix must be blank');
    const { prefix  } = subjevkos[0];
    if (prefix.trim() === '') {
        const itemSchemas = [];
        for (const { prefix , jevko: jevko18  } of subjevkos){
            if (prefix.trim() !== '') throw Error('bad tuple/array');
            itemSchemas.push(interJevkoToSchema1(jevko18));
        }
        return {
            type: 'tuple',
            itemSchemas
        };
    }
    const props = Object.create(null);
    for (const { prefix: prefix1 , jevko: jevko1  } of subjevkos){
        const key = prefix1.trim();
        if (key in props) throw Error(`duplicate key (${key})`);
        props[key] = interJevkoToSchema1(jevko1);
    }
    return {
        type: 'object',
        props
    };
};
const sjevkoToSchema = (jevko19)=>{
    const { subjevkos , suffix  } = jevko19;
    const type = suffix.trim();
    if ([
        'string',
        'float64',
        'boolean',
        'empty',
        'null'
    ].includes(type)) {
        if (subjevkos.length > 0) throw Error('subs > 0 in primitive type');
        return {
            type
        };
    }
    if (type === 'array') return toArray(jevko19);
    if (type === 'tuple') return toTuple(jevko19);
    if (type === 'first match') return toFirstMatch(jevko19);
    if (type === 'object') return toObject(jevko19);
    throw Error(`Unknown type (${type})`);
};
const toArray = (jevko20)=>{
    const { subjevkos , suffix  } = jevko20;
    if (subjevkos.length !== 1) throw Error('subs !== 1 in array');
    const { prefix , jevko: j  } = subjevkos[0];
    if (prefix.trim() !== '') throw Error('empty prefix expected');
    return {
        type: 'array',
        itemSchema: sjevkoToSchema(j)
    };
};
const toTuple = (jevko21)=>{
    const { subjevkos , suffix  } = jevko21;
    const itemSchemas = [];
    for (const { prefix , jevko: jevko1  } of subjevkos){
        if (prefix.trim() !== '') throw Error('empty prefix expected');
        itemSchemas.push(sjevkoToSchema(jevko1));
    }
    return {
        type: 'tuple',
        itemSchemas
    };
};
const toFirstMatch = (jevko22)=>{
    const { subjevkos , suffix  } = jevko22;
    const alternatives = [];
    for (const { prefix , jevko: jevko2  } of subjevkos){
        if (prefix.trim() !== '') throw Error('empty prefix expected');
        alternatives.push(sjevkoToSchema(jevko2));
    }
    return {
        type: 'first match',
        alternatives
    };
};
const toObject = (jevko23)=>{
    const { subjevkos , suffix  } = jevko23;
    const props = Object.create(null);
    for (const { prefix , jevko: jevko3  } of subjevkos){
        const [pre, mid, post] = trim3(prefix);
        if (mid === '') throw Error('empty key');
        if (mid.startsWith('-')) continue;
        const key = mid.startsWith('|') ? mid.slice(1) + post : mid;
        if (key in props) throw Error('duplicate key');
        props[key] = sjevkoToSchema(jevko3);
    }
    return {
        type: 'object',
        props
    };
};
const schemaToSjevko = (schema)=>{
    const { type  } = schema;
    if ([
        'string',
        'float64',
        'boolean',
        'empty',
        'null'
    ].includes(type)) {
        return {
            suffix: type,
            subjevkos: []
        };
    }
    if (type === 'array') return toArray1(schema);
    if (type === 'tuple') return toTuple1(schema);
    if (type === 'object') return toObject1(schema);
    if (type === 'first match') return toFirstMatch1(schema);
    throw Error(`Unknown schema type ${type}`);
};
const toArray1 = (schema)=>{
    const { itemSchema  } = schema;
    return {
        suffix: 'array',
        subjevkos: [
            {
                prefix: '',
                jevko: schemaToSjevko(itemSchema)
            }
        ]
    };
};
const toTuple1 = (schema)=>{
    const { itemSchemas , isSealed  } = schema;
    return {
        suffix: 'tuple',
        subjevkos: itemSchemas.map((s)=>({
                prefix: '',
                jevko: schemaToSjevko(s)
            })
        )
    };
};
const toObject1 = (schema)=>{
    const { props , isSealed  } = schema;
    return {
        suffix: 'object',
        subjevkos: Object.entries(props).map(([k, v])=>{
            let prefix = '';
            if (k === '') prefix = '|';
            else {
                const [pre, mid, post] = trim3(k);
                if (pre !== '') prefix += '|' + pre;
                prefix += mid;
                if (post !== '') prefix += post + '|';
            }
            return {
                prefix,
                jevko: schemaToSjevko(v)
            };
        })
    };
};
const toFirstMatch1 = (schema)=>{
    const { alternatives  } = schema;
    return {
        suffix: 'first match',
        subjevkos: alternatives.map((s)=>({
                prefix: '',
                jevko: schemaToSjevko(s)
            })
        )
    };
};
const escape2 = (str)=>{
    let ret = '';
    for (const c of str){
        if (c === '[' || c === ']' || c === '`') ret += '`';
        ret += c;
    }
    return ret;
};
const escapePrefix4 = (prefix)=>prefix === '' ? '' : escape2(prefix) + ' '
;
const recur4 = (jevko24, indent, prevIndent)=>{
    const { subjevkos , suffix  } = jevko24;
    let ret = '';
    if (subjevkos.length > 0) {
        ret += '\n';
        for (const { prefix , jevko: jevko25  } of subjevkos){
            ret += `${indent}${escapePrefix4(prefix)}[${recur4(jevko25, indent + '  ', indent)}]\n`;
        }
        ret += prevIndent;
    }
    return ret + escape2(suffix);
};
const trim31 = (prefix)=>{
    let i7 = 0, j = 0;
    for(; i7 < prefix.length; ++i7){
        if (isWhitespace1(prefix[i7]) === false) break;
    }
    for(j = prefix.length - 1; j > i7; --j){
        if (isWhitespace1(prefix[j]) === false) break;
    }
    ++j;
    return [
        prefix.slice(0, i7),
        prefix.slice(i7, j),
        prefix.slice(j)
    ];
};
const isWhitespace1 = (c)=>{
    return ' \n\r\t'.includes(c);
};
const jevkoToString2 = (jevko26)=>{
    const { subjevkos , suffix  } = jevko26;
    let ret = '';
    for (const { prefix , jevko: jevko1  } of subjevkos){
        ret += `${escape2(prefix)}[${jevkoToString2(jevko1)}]`;
    }
    return ret + escape2(suffix);
};
const jevkoBySchemaToVerified = (jevko27, schema)=>{
    const { type  } = schema;
    if (type === 'string') return toString(jevko27, schema);
    if (type === 'float64' || type === 'number') return toFloat64(jevko27, schema);
    if (type === 'boolean') return toBoolean(jevko27, schema);
    if (type === 'null') return toNull(jevko27, schema);
    if (type === 'array') return toArray2(jevko27, schema);
    if (type === 'tuple') return toTuple2(jevko27, schema);
    if (type === 'object') return toObject2(jevko27, schema);
    if (type === 'first match') return toFirstMatch2(jevko27, schema);
    throw Error(`Unknown schema type ${type}`);
};
const toString = (jevko28, schema)=>{
    const { subjevkos  } = jevko28;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    return {
        schema,
        jevko: jevko28
    };
};
const toFloat64 = (jevko29, schema)=>{
    const { subjevkos , suffix  } = jevko29;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    const trimmed = suffix.trim();
    if (trimmed === 'NaN') return {
        schema,
        jevko: jevko29,
        trimmed,
        value: NaN
    };
    const value = Number(trimmed);
    if (Number.isNaN(value) || trimmed === '') throw Error(`Not a number (${trimmed})`);
    return {
        schema,
        jevko: jevko29,
        trimmed,
        value
    };
};
const toBoolean = (jevko30, schema)=>{
    const { subjevkos , suffix  } = jevko30;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    const trimmed = suffix.trim();
    if (trimmed === 'true') return {
        schema,
        jevko: jevko30,
        trimmed,
        value: true
    };
    if (trimmed === 'false') return {
        schema,
        jevko: jevko30,
        trimmed,
        value: false
    };
    throw Error(`not a boolean (${suffix})`);
};
const toNull = (jevko31, schema)=>{
    const { subjevkos , suffix  } = jevko31;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    const trimmed = suffix.trim();
    if (trimmed === 'null' || suffix === '') return {
        schema,
        jevko: jevko31,
        trimmed,
        value: null
    };
    throw Error(`not a null (${suffix})`);
};
const toArray2 = (jevko32, schema)=>{
    const { subjevkos , suffix  } = jevko32;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    const items = [];
    const { itemSchema  } = schema;
    for (const { prefix , jevko: jevko1  } of subjevkos){
        if (prefix.trim() !== '') throw Error(`nonempty prefix (${prefix})`);
        items.push({
            prefix,
            value: jevkoBySchemaToVerified(jevko1, itemSchema)
        });
    }
    return {
        schema,
        jevko: jevko32,
        items
    };
};
const toTuple2 = (jevko33, schema)=>{
    const { subjevkos , suffix  } = jevko33;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    const items = [];
    const { itemSchemas , isSealed  } = schema;
    if (itemSchemas.length > subjevkos.length) throw Error('bad tuple');
    if (isSealed && itemSchemas.length !== subjevkos.length) throw Error('also bad tuple');
    for(let i8 = 0; i8 < itemSchemas.length; ++i8){
        const { prefix , jevko: jevko34  } = subjevkos[i8];
        if (prefix.trim() !== '') throw Error(`nonempty prefix (${prefix})`);
        items.push({
            prefix,
            value: jevkoBySchemaToVerified(jevko34, itemSchemas[i8])
        });
    }
    return {
        schema,
        jevko: jevko33,
        items
    };
};
const toObject2 = (jevko35, schema)=>{
    const { subjevkos , suffix  } = jevko35;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    const keyJevkos = Object.create(null);
    const items = [];
    const { optional =[] , isSealed =true , props  } = schema;
    const keys = Object.keys(props);
    for (const { prefix , jevko: jevko2  } of subjevkos){
        const [pre, key, post] = trim31(prefix);
        if (key.startsWith('-')) {
            items.push({
                prefix,
                ignored: true,
                jevkoStr: jevkoToString2(jevko2)
            });
            continue;
        }
        if (key === '') throw Error('empty key');
        if (key in keyJevkos) throw Error('duplicate key');
        if (isSealed && keys.includes(key) === false) throw Error(`unknown key (${key}) ${post}`);
        items.push({
            prefix,
            pre,
            key,
            post,
            value: jevkoBySchemaToVerified(jevko2, props[key])
        });
    }
    return {
        schema,
        jevko: jevko35,
        items
    };
};
const toFirstMatch2 = (jevko36, schema)=>{
    const { alternatives  } = schema;
    for (const alt of alternatives){
        try {
            const x = jevkoBySchemaToVerified(jevko36, alt);
            return x;
        } catch (e) {
            continue;
        }
    }
    throw Error('toFirstMatch: invalid jevko');
};
const zipWithSchema = (jevko0, schema0)=>{
    const verified = jevkoBySchemaToVerified(jevko0, schema0);
    return recur5(verified);
};
const recur5 = (verified)=>{
    const { schema , jevko: jevko37  } = verified;
    const { type  } = schema;
    const sigil = typeToSigil[type] || '';
    const { subjevkos , suffix  } = jevko37;
    if (subjevkos.length === 0) return {
        subjevkos,
        suffix: sigil + suffix
    };
    const { items  } = verified;
    let i9 = 0;
    const { prefix , jevko: j  } = subjevkos[i9];
    const item = items[i9];
    const mapped = [
        {
            prefix: sigil + prefix,
            jevko: item.ignored ? j : recur5(item.value)
        }
    ];
    ++i9;
    for(; i9 < subjevkos.length; ++i9){
        const { prefix , jevko: jevko38  } = subjevkos[i9];
        if (items[i9].ignored === true) {
            mapped.push({
                prefix,
                jevko: jevko38
            });
        } else mapped.push({
            prefix,
            jevko: recur5(items[i9].value)
        });
    }
    return {
        subjevkos: mapped,
        suffix
    };
};
const typeToSigil = {
    object: ':',
    array: '*',
    tuple: '.',
    string: "'"
};
const zjevkoToDjevko = (zjevko)=>{
    return argsToJevko1(...recur6(zjevko));
};
const recur6 = (zjevko)=>{
    const { subjevkos , suffix  } = zjevko;
    if (subjevkos.length === 0) {
        if (suffix === '') return [
            "span",
            [
                "class=",
                [
                    "null"
                ],
                [
                    suffix
                ]
            ]
        ];
        const type = sigilToType[suffix[0]] || 'float64';
        return [
            "span",
            [
                "class=",
                [
                    type
                ],
                [
                    suffix
                ]
            ]
        ];
    }
    const { prefix , jevko: jevko39  } = subjevkos[0];
    const type = sigilToType[prefix[0]] || 'float64';
    let ret = [];
    if (type === 'object') {
        const [pre, mid, post] = trim3(prefix.slice(1));
        ret.push([
            prefix[0] + pre
        ], "span", [
            "class=",
            [
                "key"
            ],
            [
                mid
            ]
        ], [
            post
        ], [
            "["
        ], ...recur6(jevko39), [
            "]"
        ]);
        for(let i10 = 1; i10 < subjevkos.length; ++i10){
            const { prefix , jevko: jevko40  } = subjevkos[i10];
            const [pre, mid, post] = trim3(prefix);
            ret.push([
                pre
            ], "span", [
                "class=",
                [
                    "key"
                ],
                [
                    mid
                ]
            ], [
                post
            ], [
                "["
            ], ...recur6(jevko40), [
                "]"
            ]);
        }
    } else for (const { prefix: prefix1 , jevko: jevko1  } of subjevkos){
        ret.push([
            prefix1
        ], [
            "["
        ], ...recur6(jevko1), [
            "]"
        ]);
    }
    return [
        "span",
        [
            "class=",
            [
                type
            ],
            ...ret,
            [
                suffix
            ]
        ]
    ];
};
const sigilToType = {
    ':': 'object',
    '.': 'tuple',
    '*': 'array',
    "'": 'string',
    'n': 'null',
    't': 'boolean',
    'f': 'boolean'
};
const CodePoint = {
    _0_: '0'.codePointAt(0),
    _1_: '1'.codePointAt(0),
    _9_: '9'.codePointAt(0),
    _a_: 'a'.codePointAt(0),
    _f_: 'f'.codePointAt(0),
    _A_: 'A'.codePointAt(0),
    _F_: 'F'.codePointAt(0),
    _openCurly_: '{'.codePointAt(0),
    _openSquare_: '['.codePointAt(0),
    _closeCurly_: '}'.codePointAt(0),
    _closeSquare_: ']'.codePointAt(0),
    _quoteMark_: '"'.codePointAt(0),
    _plus_: '+'.codePointAt(0),
    _minus_: '-'.codePointAt(0),
    _space_: ' '.codePointAt(0),
    _newline_: '\n'.codePointAt(0),
    _tab_: '\t'.codePointAt(0),
    _return_: '\r'.codePointAt(0),
    _backslash_: '\\'.codePointAt(0),
    _slash_: '/'.codePointAt(0),
    _comma_: ','.codePointAt(0),
    _colon_: ':'.codePointAt(0),
    _t_: 't'.codePointAt(0),
    _n_: 'n'.codePointAt(0),
    _b_: 'b'.codePointAt(0),
    _r_: 'r'.codePointAt(0),
    _u_: 'u'.codePointAt(0),
    _dot_: '.'.codePointAt(0),
    _e_: 'e'.codePointAt(0),
    _E_: 'E'.codePointAt(0),
    _l_: 'l'.codePointAt(0),
    _s_: 's'.codePointAt(0)
};
const { _0_ , _1_ , _9_ , _A_ , _E_ , _F_ , _a_ , _b_ , _backslash_ , _closeCurly_ , _closeSquare_ , _colon_ , _comma_ , _dot_ , _e_ , _f_ , _l_ , _minus_ , _n_ , _newline_ , _openCurly_ , _openSquare_ , _plus_ , _quoteMark_ , _r_ , _return_ , _s_ , _slash_ , _space_ , _t_ , _tab_ , _u_ ,  } = CodePoint;
const JsonFeedbackType = {
    error: 'JsonFeedbackType.error'
};
const JsonErrorType = {
    unexpected: 'JsonErrorType.unexpected',
    unexpectedEnd: 'JsonErrorType.unexpectedEnd'
};
const error = (message)=>{
    return {
        type: JsonFeedbackType.error,
        message
    };
};
const unexpected = (code1, context, expected)=>{
    return {
        type: JsonFeedbackType.error,
        errorType: JsonErrorType.unexpected,
        codePoint: code1,
        context,
        expected
    };
};
const unexpectedEnd = (context, expected)=>{
    return {
        type: JsonFeedbackType.error,
        errorType: JsonErrorType.unexpectedEnd,
        context,
        expected
    };
};
const isZeroNine = (code2)=>code2 >= _0_ && code2 <= _9_
;
const isOneNine = (code3)=>code3 >= _1_ && code3 <= _9_
;
const isWhitespace2 = (code4)=>code4 === _space_ || code4 === _newline_ || code4 === _tab_ || code4 === _return_
;
const JsonLow = (next, initialState = {
})=>{
    let mode = initialState.mode ?? 'Mode._value';
    let parents = initialState.parents ?? [
        'Parent.top'
    ];
    let hexIndex = initialState.hexIndex ?? 0;
    let maxDepth = initialState.maxDepth ?? 65536;
    const fraction = (code5)=>{
        if (code5 === _dot_) {
            mode = 'Mode.dot_';
            return next.codePoint?.(code5);
        }
        return exponent(code5);
    };
    const exponent = (code6)=>{
        if (code6 === _e_ || code6 === _E_) {
            mode = 'Mode.exponent_';
            return next.codePoint?.(code6);
        }
        return number1(code6);
    };
    const number1 = (code7)=>{
        mode = parents[parents.length - 1] === 'Parent.top' ? 'Mode._value' : 'Mode.value_';
        next.closeNumber?.();
        return self.codePoint(code7);
    };
    const maxDepthExceeded = ()=>error(`Invalid parser state! Max depth of ${maxDepth} exceeded!`)
    ;
    const closeParent = (code8)=>{
        const parent = parents.pop();
        if (code8 === _closeCurly_) {
            if (parent === 'Parent.object') {
                mode = parents[parents.length - 1] === 'Parent.top' ? 'Mode._value' : 'Mode.value_';
                return next.closeObject?.(code8);
            }
        }
        if (code8 === _closeSquare_) {
            if (parent === 'Parent.array') {
                mode = parents[parents.length - 1] === 'Parent.top' ? 'Mode._value' : 'Mode.value_';
                return next.closeArray?.(code8);
            }
        }
        return unexpected(code8, `in ${parentToString(parent)}`);
    };
    const self = {
        codePoint: (code9)=>{
            switch(mode){
                case 'Mode._value':
                    switch(code9){
                        case _openCurly_:
                            {
                                if (parents.length >= maxDepth) return maxDepthExceeded();
                                parents.push('Parent.object');
                                parents.push('Parent.key');
                                mode = 'Mode._key';
                                return next.openObject?.(code9);
                            }
                        case _openSquare_:
                            {
                                if (parents.length >= maxDepth) return maxDepthExceeded();
                                parents.push('Parent.array');
                                mode = 'Mode._value';
                                return next.openArray?.(code9);
                            }
                        case _quoteMark_:
                            mode = 'Mode.string_';
                            return next.openString?.(code9);
                        case _t_:
                            mode = 'Mode.t_rue';
                            return next.openTrue?.(code9);
                        case _f_:
                            mode = 'Mode.f_alse';
                            return next.openFalse?.(code9);
                        case _n_:
                            mode = 'Mode.n_ull';
                            return next.openNull?.(code9);
                        case _minus_:
                            mode = 'Mode.minus_';
                            return next.openNumber?.(code9);
                        case _0_:
                            mode = 'Mode.zero_';
                            return next.openNumber?.(code9);
                        default:
                            if (isOneNine(code9)) {
                                mode = 'Mode.onenine_';
                                return next.openNumber?.(code9);
                            }
                            if (isWhitespace2(code9)) return next.whitespace?.(code9);
                            return closeParent(code9);
                    }
                case 'Mode.value_':
                    if (code9 === _comma_) {
                        const parent = parents[parents.length - 1];
                        if (parent === 'Parent.object') {
                            parents.push('Parent.key');
                            mode = 'Mode._key';
                            return next.comma?.(code9);
                        }
                        if (parent === 'Parent.array') {
                            mode = 'Mode._value';
                            return next.comma?.(code9);
                        }
                        return error(`Invalid parser state! Unexpected parent ${parent}.`);
                    }
                    if (isWhitespace2(code9)) return next.whitespace?.(code9);
                    return closeParent(code9);
                case 'Mode._key':
                    if (code9 === _quoteMark_) {
                        mode = 'Mode.string_';
                        return next.openKey?.(code9);
                    }
                    if (code9 === _closeCurly_) {
                        parents.pop();
                        parents.pop();
                        mode = parents[parents.length - 1] === 'Parent.top' ? 'Mode._value' : 'Mode.value_';
                        return next.closeObject?.(code9);
                    }
                    if (isWhitespace2(code9)) return next.whitespace?.(code9);
                    return unexpected(code9, 'in an object', [
                        '"',
                        '}',
                        'whitespace'
                    ]);
                case 'Mode.key_':
                    if (code9 === _colon_) {
                        parents.pop();
                        mode = 'Mode._value';
                        return next.colon?.(code9);
                    }
                    if (isWhitespace2(code9)) return next.whitespace?.(code9);
                    return unexpected(code9, 'after key', [
                        ':',
                        'whitespace'
                    ]);
                case 'Mode.string_':
                    if (code9 === _quoteMark_) {
                        const parent = parents[parents.length - 1];
                        if (parent === 'Parent.key') {
                            mode = 'Mode.key_';
                            return next.closeKey?.(code9);
                        }
                        mode = parents[parents.length - 1] === 'Parent.top' ? 'Mode._value' : 'Mode.value_';
                        return next.closeString?.(code9);
                    }
                    if (code9 === _backslash_) {
                        mode = 'Mode.escape_';
                        return next.escape?.(code9);
                    }
                    if (code9 >= 32 && code9 <= 1114111) return next.codePoint?.(code9);
                    return unexpected(code9, 'in a string', [
                        '"',
                        '\\',
                        'a code point 0x0020 thru 0x10ffff'
                    ]);
                case 'Mode.escape_':
                    if (code9 === _quoteMark_ || code9 === _n_ || code9 === _backslash_ || code9 === _t_ || code9 === _slash_ || code9 === _b_ || code9 === _f_ || code9 === _r_) {
                        mode = 'Mode.string_';
                        return next.codePoint?.(code9);
                    }
                    if (code9 === _u_) {
                        mode = 'Mode.hex_';
                        return next.openHex?.(code9);
                    }
                    return unexpected(code9, 'after escape', [
                        '"',
                        'n',
                        '\\',
                        't',
                        '/',
                        'b',
                        'f',
                        'r',
                        'u'
                    ]);
                case 'Mode.hex_':
                    if (code9 >= _0_ && code9 <= _9_ || code9 >= _a_ && code9 <= _f_ || code9 >= _A_ && code9 <= _F_) {
                        if (hexIndex < 3) {
                            hexIndex += 1;
                            return next.codePoint?.(code9);
                        }
                        hexIndex = 0;
                        mode = 'Mode.string_';
                        return next.closeHex?.(code9);
                    }
                    return unexpected(code9, `at index ${hexIndex} of a hexadecimal escape sequence`, [
                        [
                            'a',
                            'f'
                        ],
                        [
                            'A',
                            'F'
                        ],
                        [
                            '0',
                            '9'
                        ]
                    ]);
                case 'Mode.minus_':
                    if (code9 === _0_) {
                        mode = 'Mode.zero_';
                        return next.codePoint?.(code9);
                    }
                    if (isOneNine(code9)) {
                        mode = 'Mode.onenine_';
                        return next.codePoint?.(code9);
                    }
                    return unexpected(code9, `after '-'`, [
                        [
                            '0',
                            '9'
                        ]
                    ]);
                case 'Mode.zero_':
                    return fraction(code9);
                case 'Mode.onenine_':
                    if (isZeroNine(code9)) {
                        mode = 'Mode.onenineDigit_';
                        return next.codePoint?.(code9);
                    }
                    return fraction(code9);
                case 'Mode.dot_':
                    if (isZeroNine(code9)) {
                        mode = 'Mode.digitDotDigit_';
                        return next.codePoint?.(code9);
                    }
                    return unexpected(code9, `after '.'`, [
                        [
                            '0',
                            '9'
                        ]
                    ]);
                case 'Mode.exponent_':
                    if (code9 === _plus_ || code9 === _minus_) {
                        mode = 'Mode.exponentSign_';
                        return next.codePoint?.(code9);
                    }
                    if (isZeroNine(code9)) {
                        mode = 'Mode.exponentSignDigit_';
                        return next.codePoint?.(code9);
                    }
                    return unexpected(code9, `after exponent`, [
                        '+',
                        '-',
                        [
                            '0',
                            '9'
                        ]
                    ]);
                case 'Mode.exponentSign_':
                    if (isZeroNine(code9)) {
                        mode = 'Mode.exponentSignDigit_';
                        return next.codePoint?.(code9);
                    }
                    return unexpected(code9, `after exponent sign`, [
                        [
                            '0',
                            '9'
                        ]
                    ]);
                case 'Mode.onenineDigit_':
                    if (isZeroNine(code9)) return next.codePoint?.(code9);
                    return fraction(code9);
                case 'Mode.digitDotDigit_':
                    if (isZeroNine(code9)) return next.codePoint?.(code9);
                    return exponent(code9);
                case 'Mode.exponentSignDigit_':
                    if (isZeroNine(code9)) return next.codePoint?.(code9);
                    return number1(code9);
                case 'Mode.t_rue':
                    if (code9 === _r_) {
                        mode = 'Mode.tr_ue';
                        return next.codePoint?.(code9);
                    }
                    return unexpected(code9, `at the second position in true`, [
                        'r'
                    ]);
                case 'Mode.tr_ue':
                    if (code9 === _u_) {
                        mode = 'Mode.tru_e';
                        return next.codePoint?.(code9);
                    }
                    return unexpected(code9, `at the third position in true`, [
                        'u'
                    ]);
                case 'Mode.tru_e':
                    if (code9 === _e_) {
                        mode = parents[parents.length - 1] === 'Parent.top' ? 'Mode._value' : 'Mode.value_';
                        return next.closeTrue?.(code9);
                    }
                    return unexpected(code9, `at the fourth position in true`, [
                        'e'
                    ]);
                case 'Mode.f_alse':
                    if (code9 === _a_) {
                        mode = 'Mode.fa_lse';
                        return next.codePoint?.(code9);
                    }
                    return unexpected(code9, `at the second position in false`, [
                        'a'
                    ]);
                case 'Mode.fa_lse':
                    if (code9 === _l_) {
                        mode = 'Mode.fal_se';
                        return next.codePoint?.(code9);
                    }
                    return unexpected(code9, `at the third position in false`, [
                        'l'
                    ]);
                case 'Mode.fal_se':
                    if (code9 === _s_) {
                        mode = 'Mode.fals_e';
                        return next.codePoint?.(code9);
                    }
                    return unexpected(code9, `at the fourth position in false`, [
                        's'
                    ]);
                case 'Mode.fals_e':
                    if (code9 === _e_) {
                        mode = parents[parents.length - 1] === 'Parent.top' ? 'Mode._value' : 'Mode.value_';
                        return next.closeFalse?.(code9);
                    }
                    return unexpected(code9, `at the fifth position in false`, [
                        'e'
                    ]);
                case 'Mode.n_ull':
                    if (code9 === _u_) {
                        mode = 'Mode.nu_ll';
                        return next.codePoint?.(code9);
                    }
                    return unexpected(code9, `at the second position in null`, [
                        'u'
                    ]);
                case 'Mode.nu_ll':
                    if (code9 === _l_) {
                        mode = 'Mode.nul_l';
                        return next.codePoint?.(code9);
                    }
                    return unexpected(code9, `at the third position in null`, [
                        'l'
                    ]);
                case 'Mode.nul_l':
                    if (code9 === _l_) {
                        mode = parents[parents.length - 1] === 'Parent.top' ? 'Mode._value' : 'Mode.value_';
                        return next.closeNull?.(code9);
                    }
                    return unexpected(code9, `at the fourth position in null`, [
                        'l'
                    ]);
                default:
                    return error(`Invalid parser mode: ${mode}`);
            }
        },
        end: ()=>{
            const parent = parents[parents.length - 1];
            switch(parent){
                case 'Parent.key':
                    return unexpectedEnd(`a key/object left unclosed!`);
                case 'Parent.top':
                    break;
                default:
                    return unexpectedEnd(`${parentToString(parent)} left unclosed!`);
            }
            switch(mode){
                case 'Mode._value':
                    return next.end?.();
                case 'Mode.key_':
                    return error('a key/object left unclosed!');
                case 'Mode._key':
                    return unexpectedEnd('an object left unclosed!');
                case 'Mode.exponentSignDigit_':
                case 'Mode.onenine_':
                case 'Mode.onenineDigit_':
                case 'Mode.digitDotDigit_':
                case 'Mode.zero_':
                    mode = parents[parents.length - 1] === 'Parent.top' ? 'Mode._value' : 'Mode.value_';
                    next.closeNumber?.();
                    return next.end?.();
                case 'Mode.minus_':
                case 'Mode.dot_':
                case 'Mode.exponent_':
                case 'Mode.exponentSign_':
                    return unexpectedEnd(`incomplete number!`);
                case 'Mode.hex_':
                    return unexpectedEnd('after hexadecimal escape in string!');
                case 'Mode.escape_':
                    return unexpectedEnd('after escape in string!');
                case 'Mode.string_':
                    return unexpectedEnd('a string left unclosed!');
                case 'Mode.t_rue':
                    return unexpectedEnd(`before the second position in true!`, [
                        'r'
                    ]);
                case 'Mode.tr_ue':
                    return unexpectedEnd(`before the third position in true!`, [
                        'u'
                    ]);
                case 'Mode.tru_e':
                    return unexpectedEnd(`before the fourth position in true!`, [
                        'e'
                    ]);
                case 'Mode.f_alse':
                    return unexpectedEnd(`before the second position in false!`, [
                        'a'
                    ]);
                case 'Mode.fa_lse':
                    return unexpectedEnd(`before the third position in false!`, [
                        'l'
                    ]);
                case 'Mode.fal_se':
                    return unexpectedEnd(`before the fourth position in false!`, [
                        's'
                    ]);
                case 'Mode.fals_e':
                    return unexpectedEnd(`before the fifth position in false!`, [
                        'e'
                    ]);
                case 'Mode.n_ull':
                    return unexpectedEnd(`before the second position in null!`, [
                        'u'
                    ]);
                case 'Mode.nu_ll':
                    return unexpectedEnd(`before the third position in null!`, [
                        'l'
                    ]);
                case 'Mode.nul_l':
                    return unexpectedEnd(`before the fourth position in null!`, [
                        'l'
                    ]);
                default:
                    return unexpectedEnd();
            }
        },
        state: ()=>{
            const downstream = next.state?.();
            return {
                mode,
                parents,
                downstream
            };
        }
    };
    return self;
};
const parentToString = (parent)=>{
    switch(parent){
        case 'Parent.array':
            return 'an array';
        case 'Parent.object':
            return 'an object';
        case 'Parent.key':
            return 'a key';
        case 'Parent.top':
            return 'the top-level value';
    }
};
const { _t_: _t_1 , _n_: _n_1 , _b_: _b_1 , _r_: _r_1 , _f_: _f_1  } = CodePoint;
'\n'.charCodeAt(0);
const space = ' '.codePointAt(0);
const newline = '\n'.codePointAt(0);
const PrettyJsonLow = (next)=>{
    const indent = ()=>{
        for(let i11 = 0; i11 < currentIndent; ++i11){
            next.whitespace?.(space);
        }
    };
    const bufferIndent = ()=>{
        justOpened = true;
        buffer.push(()=>next.whitespace?.(newline)
        , indent);
    };
    const flushIndent = ()=>{
        if (justOpened) {
            justOpened = false;
            for (const f of buffer)f();
            buffer = [];
        }
    };
    const closeIndent = ()=>{
        if (justOpened) {
            justOpened = false;
            buffer = [];
        } else {
            next.whitespace?.(newline);
            indent();
        }
    };
    const indentSize = 2;
    let currentIndent = 0;
    let prevIndent = 0;
    let justOpened = false;
    let buffer = [];
    const stream = JsonLow(new Proxy({
        openObject: (codePoint)=>{
            flushIndent();
            prevIndent = currentIndent;
            currentIndent += indentSize;
            next.openObject?.(codePoint);
            bufferIndent();
        },
        closeObject: (codePoint)=>{
            currentIndent = prevIndent;
            prevIndent -= indentSize;
            closeIndent();
            next.closeObject?.(codePoint);
        },
        openArray: (codePoint)=>{
            flushIndent();
            prevIndent = currentIndent;
            currentIndent += indentSize;
            next.openArray?.(codePoint);
            bufferIndent();
        },
        closeArray: (codePoint)=>{
            currentIndent = prevIndent;
            prevIndent -= indentSize;
            closeIndent();
            next.closeArray?.(codePoint);
        },
        comma: (codePoint)=>{
            next.comma?.(codePoint);
            next.whitespace?.(newline);
            indent();
        },
        colon: (codePoint)=>{
            next.colon?.(codePoint);
            next.whitespace?.(space);
        },
        whitespace: ()=>{
        }
    }, {
        get (target, prop, rec) {
            return target[prop] ?? ((...args)=>{
                flushIndent();
                next[prop]?.(...args);
            });
        }
    }));
    return stream;
};
const stringToCodePoints = (str)=>{
    const points = [];
    for(let i12 = 0; i12 < str.length; ++i12){
        points.push(str.codePointAt(i12));
    }
    return points;
};
const escape3 = (str)=>{
    let ret = '';
    for (const c of str){
        if (c === '[' || c === ']' || c === '`') ret += '`';
        ret += c;
    }
    return ret;
};
const escapePrefix5 = (prefix)=>prefix === '' ? '' : escape3(prefix) + ' '
;
const recur7 = (jevko41, indent, prevIndent)=>{
    const { subjevkos , suffix  } = jevko41;
    let ret = '';
    if (subjevkos.length > 0) {
        ret += '\n';
        for (const { prefix , jevko: jevko42  } of subjevkos){
            ret += `${indent}${escapePrefix5(prefix)}[${recur7(jevko42, indent + '  ', indent)}]\n`;
        }
        ret += prevIndent;
    }
    return ret + escape3(suffix);
};
const argsToJevko2 = (...args)=>{
    const subjevkos = [];
    let subjevko = {
        prefix: ''
    };
    for(let i13 = 0; i13 < args.length; ++i13){
        const arg = args[i13];
        if (Array.isArray(arg)) {
            subjevko.jevko = argsToJevko2(...arg);
            subjevkos.push(subjevko);
            subjevko = {
                prefix: ''
            };
        } else if (typeof arg === 'string') {
            subjevko.prefix += arg;
        } else throw Error(`Argument #${i13} has unrecognized type (${typeof arg})! Only strings and arrays are allowed. The argument's value is: ${arg}`);
    }
    return {
        subjevkos,
        suffix: subjevko.prefix
    };
};
const escapePrefix11 = (prefix)=>prefix === '' ? '' : prefix + ' '
;
const recur13 = (jevko43, indent, prevIndent)=>{
    const { subjevkos , suffix  } = jevko43;
    let ret = [];
    if (subjevkos.length > 0) {
        ret.push('\n');
        for (const { prefix , jevko: jevko44  } of subjevkos){
            ret.push(indent, escapePrefix11(prefix), recur13(jevko44, indent + '  ', indent), '\n');
        }
        ret.push(prevIndent);
    }
    ret.push(suffix);
    return ret;
};
const jevkoToString3 = (jevko45)=>{
    const { subjevkos , suffix  } = jevko45;
    let ret = '';
    for (const { prefix , jevko: jevko1  } of subjevkos){
        ret += `${escape3(prefix)}[${jevkoToString3(jevko1)}]`;
    }
    return ret + escape3(suffix);
};
const jsonStrToHtmlSpans = (str, { pretty =false  } = {
})=>{
    const ancestors = [];
    let parent = [];
    const object = (codePoint)=>{
        ancestors.push(parent);
        const node = [
            "class=",
            [
                "object"
            ],
            [
                String.fromCodePoint(codePoint)
            ]
        ];
        parent.push("span", node);
        parent = node;
    };
    const array = (codePoint)=>{
        ancestors.push(parent);
        const node = [
            "class=",
            [
                "array"
            ],
            [
                String.fromCodePoint(codePoint)
            ]
        ];
        parent.push("span", node);
        parent = node;
    };
    const inter = (codePoint)=>{
        parent.push("span", [
            "class=",
            [
                "inter"
            ],
            [
                String.fromCodePoint(codePoint)
            ]
        ]);
    };
    const close = (codePoint)=>{
        const prev = parent[parent.length - 1];
        if (Array.isArray(prev) && prev.length === 1 && typeof prev[0] === 'string') {
            prev[0] += String.fromCodePoint(codePoint);
        } else parent.push([
            String.fromCodePoint(codePoint)
        ]);
        if (ancestors.length === 0) throw Error('oops');
        parent = ancestors.pop();
    };
    const __boolean = (codePoint)=>{
        ancestors.push(parent);
        const node = [
            "class=",
            [
                "boolean"
            ],
            [
                String.fromCodePoint(codePoint)
            ]
        ];
        parent.push("span", node);
        parent = node;
    };
    const ctor = pretty ? PrettyJsonLow : JsonLow;
    const stream = ctor(new Proxy({
        openKey: (codePoint)=>{
            ancestors.push(parent);
            const node = [
                "class=",
                [
                    "key"
                ],
                [
                    String.fromCodePoint(codePoint)
                ]
            ];
            parent.push("span", node);
            parent = node;
        },
        openObject: object,
        openArray: array,
        openNumber: (codePoint)=>{
            ancestors.push(parent);
            const node = [
                "class=",
                [
                    "number"
                ],
                [
                    String.fromCodePoint(codePoint)
                ]
            ];
            parent.push("span", node);
            parent = node;
        },
        openString: (codePoint)=>{
            ancestors.push(parent);
            const node = [
                "class=",
                [
                    "string"
                ],
                [
                    String.fromCodePoint(codePoint)
                ]
            ];
            parent.push("span", node);
            parent = node;
        },
        colon: inter,
        comma: inter,
        closeString: close,
        closeKey: close,
        closeObject: close,
        closeArray: close,
        openTrue: __boolean,
        openFalse: __boolean,
        closeTrue: close,
        closeFalse: close,
        closeNumber: ()=>{
            if (ancestors.length === 0) throw Error('oops');
            parent = ancestors.pop();
        },
        end: ()=>{
        }
    }, {
        get (target, prop, _rec) {
            return target[prop] ?? ((codePoint)=>{
                const prev = parent[parent.length - 1];
                if (Array.isArray(prev) && prev.length === 1 && typeof prev[0] === 'string') {
                    prev[0] += String.fromCodePoint(codePoint);
                } else parent.push([
                    String.fromCodePoint(codePoint)
                ]);
            });
        }
    }));
    for (const point of stringToCodePoints(str)){
        stream.codePoint(point);
    }
    stream.end();
    return argsToJevko2("span", [
        "class=",
        [
            "json"
        ],
        ...parent
    ]);
};
const jevkoBySchemaToValue = (jevko46, schema)=>{
    const { type  } = schema;
    if (type === 'string') return toString1(jevko46, schema);
    if (type === 'float64') return toNumber(jevko46, schema);
    if (type === 'boolean') return toBoolean1(jevko46, schema);
    if (type === 'null') return toNull1(jevko46, schema);
    if (type === 'array') return toArray3(jevko46, schema);
    if (type === 'tuple') return toTuple3(jevko46, schema);
    if (type === 'object') return toObject3(jevko46, schema);
    if (type === 'first match') return toFirstMatch3(jevko46, schema);
    throw Error(`Unknown schema type ${type}`);
};
const toString1 = (jevko47, schema)=>{
    const { subjevkos , suffix  } = jevko47;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    return suffix;
};
const toNumber = (jevko48, schema)=>{
    const { subjevkos , suffix  } = jevko48;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in number');
    const trimmed = suffix.trim();
    if (trimmed === 'NaN') return NaN;
    const num = Number(trimmed);
    if (Number.isNaN(num) || trimmed === '') throw Error('nan');
    return num;
};
const toBoolean1 = (jevko49, schema)=>{
    const { subjevkos , suffix  } = jevko49;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in boolean');
    if (suffix === 'true') return true;
    if (suffix === 'false') return false;
    throw Error('not a boolean');
};
const toNull1 = (jevko50, schema)=>{
    const { subjevkos , suffix  } = jevko50;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in null');
    const trimmed = suffix.trim();
    if (trimmed === 'null' || suffix === '') return null;
    throw Error('not a null');
};
const toArray3 = (jevko51, schema)=>{
    const { subjevkos , suffix  } = jevko51;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    const ret = [];
    const { itemSchema  } = schema;
    for (const { prefix , jevko: jevko1  } of subjevkos){
        if (prefix.trim() !== '') throw Error('nonempty prefix');
        ret.push(jevkoBySchemaToValue(jevko1, itemSchema));
    }
    return ret;
};
const toTuple3 = (jevko52, schema)=>{
    const { subjevkos , suffix  } = jevko52;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    const ret = [];
    const { itemSchemas , isSealed  } = schema;
    if (itemSchemas.length > subjevkos.length) throw Error('bad tuple');
    if (isSealed && itemSchemas.length !== subjevkos.length) throw Error('also bad tuple');
    for(let i14 = 0; i14 < itemSchemas.length; ++i14){
        const { prefix , jevko: jevko53  } = subjevkos[i14];
        if (prefix.trim() !== '') throw Error('nonempty prefix');
        ret.push(jevkoBySchemaToValue(jevko53, itemSchemas[i14]));
    }
    return ret;
};
const toObject3 = (jevko54, schema)=>{
    const { subjevkos , suffix  } = jevko54;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    const keyJevkos = Object.create(null);
    const ret = Object.create(null);
    const { optional =[] , isSealed =true , props  } = schema;
    const keys = Object.keys(props);
    for (const { prefix , jevko: jevko2  } of subjevkos){
        const key = prefix.trim();
        if (key === '') throw Error('empty key');
        if (key in keyJevkos) throw Error('duplicate key');
        if (isSealed && keys.includes(key) === false) throw Error('unknown key');
        keyJevkos[key] = jevko2;
    }
    for (const key of keys){
        if (key in keyJevkos === false) {
            if (optional.includes(key) === false) throw Error(`key required (${key})`);
            continue;
        }
        ret[key] = jevkoBySchemaToValue(keyJevkos[key], props[key]);
    }
    return ret;
};
const toFirstMatch3 = (jevko55, schema)=>{
    const { alternatives  } = schema;
    for (const alt of alternatives){
        try {
            const x = jevkoBySchemaToValue(jevko55, alt);
            return x;
        } catch (e) {
            continue;
        }
    }
    throw Error('union: invalid jevko');
};
const highlightBySchema = (jevko56, schema)=>{
    const { type  } = schema;
    if (type === 'string') return toString2(jevko56, schema);
    if (type === 'float64' || type === 'number') return toFloat641(jevko56, schema);
    if (type === 'boolean') return toBoolean2(jevko56, schema);
    if (type === 'null') return toNull2(jevko56, schema);
    if (type === 'array') return toArray4(jevko56, schema);
    if (type === 'tuple') return toTuple4(jevko56, schema);
    if (type === 'object') return toObject4(jevko56, schema);
    if (type === 'first match') return toFirstMatch4(jevko56, schema);
    throw Error(`Unknown schema type ${type}`);
};
const toString2 = (jevko57, schema)=>{
    const { subjevkos , suffix  } = jevko57;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    return `<span class="string">${suffix}</span>`;
};
const toFloat641 = (jevko58, schema)=>{
    const { subjevkos , suffix  } = jevko58;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    const trimmed = suffix.trim();
    if (trimmed === 'NaN') return `<span class="float64">NaN</span>`;
    const num = Number(trimmed);
    if (Number.isNaN(num) || trimmed === '') throw Error(`Not a number (${trimmed})`);
    return `<span class="float64">${num}</span>`;
};
const toBoolean2 = (jevko59, schema)=>{
    const { subjevkos , suffix  } = jevko59;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    if (suffix === 'true') return `<span class="boolean">true</span>`;
    if (suffix === 'false') return `<span class="boolean">false</span>`;
    throw Error('not a boolean');
};
const toNull2 = (jevko60, schema)=>{
    const { subjevkos , suffix  } = jevko60;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    if (suffix === 'null') return `<span class="null">null</span>`;
    throw Error('not a null');
};
const toArray4 = (jevko61, schema)=>{
    const { subjevkos , suffix  } = jevko61;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    let ret = '';
    const { itemSchema  } = schema;
    for (const { prefix , jevko: jevko1  } of subjevkos){
        if (prefix.trim() !== '') throw Error('nonempty prefix');
        ret += `${prefix}[<span class="item">${highlightBySchema(jevko1, itemSchema)}</span>]`;
    }
    return `<span class="array">${ret}${suffix}</span>`;
};
const toTuple4 = (jevko62, schema)=>{
    const { subjevkos , suffix  } = jevko62;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    let ret = '';
    const { itemSchemas , isSealed  } = schema;
    if (itemSchemas.length > subjevkos.length) throw Error('bad tuple');
    if (isSealed && itemSchemas.length !== subjevkos.length) throw Error('also bad tuple');
    for(let i15 = 0; i15 < itemSchemas.length; ++i15){
        const { prefix , jevko: jevko63  } = subjevkos[i15];
        if (prefix.trim() !== '') throw Error('nonempty prefix');
        ret += `${prefix}[<span class="item">${highlightBySchema(jevko63, itemSchemas[i15])}</span>]`;
    }
    return `<span class="tuple">${ret}${suffix}</span>`;
};
const toObject4 = (jevko64, schema)=>{
    const { subjevkos , suffix  } = jevko64;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    const keyJevkos = Object.create(null);
    let ret = '';
    const { optional =[] , isSealed =true , props  } = schema;
    const keys = Object.keys(props);
    for (const { prefix , jevko: jevko2  } of subjevkos){
        const [pre, key, post] = trim31(prefix);
        if (key.startsWith('-')) {
            ret += `<span class="ignored">${prefix}[${jevkoToString2(jevko2)}]</span>`;
            continue;
        }
        if (key === '') throw Error('empty key');
        if (key in keyJevkos) throw Error('duplicate key');
        if (isSealed && keys.includes(key) === false) throw Error(`unknown key (${key}) ${post}`);
        ret += `<span class="item">${pre}<span class="key">${key}</span>${post}[<span class="value">${highlightBySchema(jevko2, props[key])}</span>]</span>`;
    }
    return `<span class="object">${ret}${suffix}</span>`;
};
const toFirstMatch4 = (jevko65, schema)=>{
    const { alternatives  } = schema;
    for (const alt of alternatives){
        try {
            const x = highlightBySchema(jevko65, alt);
            return x;
        } catch (e) {
            continue;
        }
    }
    throw Error('union: invalid jevko');
};
const escape4 = (str)=>{
    let ret = '';
    for (const c of str){
        if (c === '[' || c === ']' || c === '`') ret += '`';
        ret += c;
    }
    return ret;
};
const escapePrefix6 = (prefix)=>prefix === '' ? '' : escape4(prefix) + ' '
;
const recur8 = (jevko66, indent, prevIndent)=>{
    const { subjevkos , suffix  } = jevko66;
    let ret = '';
    if (subjevkos.length > 0) {
        ret += '\n';
        for (const { prefix , jevko: jevko67  } of subjevkos){
            ret += `${indent}${escapePrefix6(prefix)}[${recur8(jevko67, indent + '  ', indent)}]\n`;
        }
        ret += prevIndent;
    }
    return ret + escape4(suffix);
};
const argsToJevko3 = (...args)=>{
    const subjevkos = [];
    let subjevko = {
        prefix: ''
    };
    for(let i16 = 0; i16 < args.length; ++i16){
        const arg = args[i16];
        if (Array.isArray(arg)) {
            subjevko.jevko = argsToJevko3(...arg);
            subjevkos.push(subjevko);
            subjevko = {
                prefix: ''
            };
        } else if (typeof arg === 'string') {
            subjevko.prefix += arg;
        } else throw Error(`Argument #${i16} has unrecognized type (${typeof arg})! Only strings and arrays are allowed. The argument's value is: ${arg}`);
    }
    return {
        subjevkos,
        suffix: subjevko.prefix
    };
};
const trim32 = (prefix)=>{
    let i17 = 0, j = 0;
    for(; i17 < prefix.length; ++i17){
        if (isWhitespace3(prefix[i17]) === false) break;
    }
    for(j = prefix.length - 1; j > i17; --j){
        if (isWhitespace3(prefix[j]) === false) break;
    }
    ++j;
    return [
        prefix.slice(0, i17),
        prefix.slice(i17, j),
        prefix.slice(j)
    ];
};
const isWhitespace3 = (c)=>{
    return ' \n\r\t'.includes(c);
};
const jevkoToString4 = (jevko68)=>{
    const { subjevkos , suffix  } = jevko68;
    let ret = '';
    for (const { prefix , jevko: jevko1  } of subjevkos){
        ret += `${escape4(prefix)}[${jevkoToString4(jevko1)}]`;
    }
    return ret + escape4(suffix);
};
const highlightSjevko = (jevko69)=>{
    return argsToJevko3(...recur9(jevko69));
};
const recur9 = (jevko70)=>{
    const { subjevkos , suffix  } = jevko70;
    const type = suffix.trim();
    if ([
        'string',
        'float64',
        'boolean',
        'empty',
        'null'
    ].includes(type)) {
        if (subjevkos.length > 0) throw Error('subs > 0 in primitive type');
        return [
            "span",
            [
                "class=",
                [
                    type
                ],
                [
                    suffix
                ]
            ]
        ];
    }
    if (type === 'array') return toArray5(jevko70);
    if (type === 'tuple') return toTuple5(jevko70);
    if (type === 'first match') return toFirstMatch5(jevko70);
    if (type === 'object') return toObject5(jevko70);
    throw Error(`Unknown type (${type})`);
};
const toArray5 = (jevko71)=>{
    const { subjevkos , suffix  } = jevko71;
    if (subjevkos.length !== 1) throw Error('subs !== 1 in array');
    const { prefix , jevko: j  } = subjevkos[0];
    if (prefix.trim() !== '') throw Error('empty prefix expected');
    return [
        "span",
        [
            "class=",
            [
                "array"
            ],
            [
                "["
            ],
            ...recur9(j),
            [
                "]"
            ],
            [
                suffix
            ]
        ]
    ];
};
const toTuple5 = (jevko72)=>{
    const { subjevkos , suffix  } = jevko72;
    let ret = [];
    for (const { prefix , jevko: jevko1  } of subjevkos){
        ret.push([
            prefix
        ], [
            "["
        ], ...recur9(jevko1), [
            "]"
        ]);
    }
    return [
        "span",
        [
            "class=",
            [
                "tuple"
            ],
            ...ret,
            [
                suffix
            ]
        ]
    ];
};
const toFirstMatch5 = (jevko73)=>{
    const { subjevkos , suffix  } = jevko73;
    let ret = [];
    for (const { prefix , jevko: jevko2  } of subjevkos){
        ret.push([
            prefix
        ], [
            "["
        ], ...recur9(jevko2), [
            "]"
        ]);
    }
    return [
        "span",
        [
            "class=",
            [
                "firstMatch"
            ],
            ...ret,
            [
                suffix
            ]
        ]
    ];
};
const toObject5 = (jevko74)=>{
    const { subjevkos , suffix  } = jevko74;
    let ret = [];
    for (const { prefix , jevko: jevko3  } of subjevkos){
        const [pre, mid, post] = trim32(prefix);
        ret.push([
            pre
        ], "span", [
            "class=",
            [
                "key"
            ],
            [
                mid
            ]
        ], [
            post
        ], [
            "["
        ], ...recur9(jevko3), [
            "]"
        ]);
    }
    return [
        "span",
        [
            "class=",
            [
                "object"
            ],
            ...ret,
            [
                suffix
            ]
        ]
    ];
};
const sjevkoToSchema1 = (jevko75)=>{
    const { subjevkos , suffix  } = jevko75;
    const type = suffix.trim();
    if ([
        'string',
        'float64',
        'boolean',
        'empty',
        'null'
    ].includes(type)) {
        if (subjevkos.length > 0) throw Error('subs > 0 in primitive type');
        return {
            type
        };
    }
    if (type === 'array') return toArray6(jevko75);
    if (type === 'tuple') return toTuple6(jevko75);
    if (type === 'first match') return toFirstMatch6(jevko75);
    if (type === 'object') return toObject6(jevko75);
    throw Error(`Unknown type (${type})`);
};
const toArray6 = (jevko76)=>{
    const { subjevkos , suffix  } = jevko76;
    if (subjevkos.length !== 1) throw Error('subs !== 1 in array');
    const { prefix , jevko: j  } = subjevkos[0];
    if (prefix.trim() !== '') throw Error('empty prefix expected');
    return {
        type: 'array',
        itemSchema: sjevkoToSchema1(j)
    };
};
const toTuple6 = (jevko77)=>{
    const { subjevkos , suffix  } = jevko77;
    const itemSchemas = [];
    for (const { prefix , jevko: jevko1  } of subjevkos){
        if (prefix.trim() !== '') throw Error('empty prefix expected');
        itemSchemas.push(sjevkoToSchema1(jevko1));
    }
    return {
        type: 'tuple',
        itemSchemas
    };
};
const toFirstMatch6 = (jevko78)=>{
    const { subjevkos , suffix  } = jevko78;
    const alternatives = [];
    for (const { prefix , jevko: jevko2  } of subjevkos){
        if (prefix.trim() !== '') throw Error('empty prefix expected');
        alternatives.push(sjevkoToSchema1(jevko2));
    }
    return {
        type: 'first match',
        alternatives
    };
};
const toObject6 = (jevko79)=>{
    const { subjevkos , suffix  } = jevko79;
    const props = Object.create(null);
    for (const { prefix , jevko: jevko3  } of subjevkos){
        const [pre, mid, post] = trim31(prefix);
        if (mid === '') throw Error('empty key');
        if (mid.startsWith('-')) continue;
        const key = mid.startsWith('|') ? mid.slice(1) + post : mid;
        if (key in props) throw Error('duplicate key');
        props[key] = sjevkoToSchema1(jevko3);
    }
    return {
        type: 'object',
        props
    };
};
const schemaToSjevko1 = (schema)=>{
    const { type  } = schema;
    if ([
        'string',
        'float64',
        'boolean',
        'empty',
        'null'
    ].includes(type)) {
        return {
            suffix: type,
            subjevkos: []
        };
    }
    if (type === 'array') return toArray7(schema);
    if (type === 'tuple') return toTuple7(schema);
    if (type === 'object') return toObject7(schema);
    if (type === 'first match') return toFirstMatch7(schema);
    throw Error(`Unknown schema type ${type}`);
};
const toArray7 = (schema)=>{
    const { itemSchema  } = schema;
    return {
        suffix: 'array',
        subjevkos: [
            {
                prefix: '',
                jevko: schemaToSjevko1(itemSchema)
            }
        ]
    };
};
const toTuple7 = (schema)=>{
    const { itemSchemas , isSealed  } = schema;
    return {
        suffix: 'tuple',
        subjevkos: itemSchemas.map((s)=>({
                prefix: '',
                jevko: schemaToSjevko1(s)
            })
        )
    };
};
const toObject7 = (schema)=>{
    const { props , isSealed  } = schema;
    return {
        suffix: 'object',
        subjevkos: Object.entries(props).map(([k, v])=>{
            let prefix = '';
            if (k === '') prefix = '|';
            else {
                const [pre, mid, post] = trim31(k);
                if (pre !== '') prefix += '|' + pre;
                prefix += mid;
                if (post !== '') prefix += post + '|';
            }
            return {
                prefix,
                jevko: schemaToSjevko1(v)
            };
        })
    };
};
const toFirstMatch7 = (schema)=>{
    const { alternatives  } = schema;
    return {
        suffix: 'first match',
        subjevkos: alternatives.map((s)=>({
                prefix: '',
                jevko: schemaToSjevko1(s)
            })
        )
    };
};
const jevkoBySchemaToVerified1 = (jevko80, schema)=>{
    const { type  } = schema;
    if (type === 'string') return toString3(jevko80, schema);
    if (type === 'float64' || type === 'number') return toFloat642(jevko80, schema);
    if (type === 'boolean') return toBoolean3(jevko80, schema);
    if (type === 'null') return toNull3(jevko80, schema);
    if (type === 'array') return toArray8(jevko80, schema);
    if (type === 'tuple') return toTuple8(jevko80, schema);
    if (type === 'object') return toObject8(jevko80, schema);
    if (type === 'first match') return toFirstMatch8(jevko80, schema);
    throw Error(`Unknown schema type ${type}`);
};
const toString3 = (jevko81, schema)=>{
    const { subjevkos  } = jevko81;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    return {
        schema,
        jevko: jevko81
    };
};
const toFloat642 = (jevko82, schema)=>{
    const { subjevkos , suffix  } = jevko82;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    const trimmed = suffix.trim();
    if (trimmed === 'NaN') return {
        schema,
        jevko: jevko82,
        trimmed,
        value: NaN
    };
    const value = Number(trimmed);
    if (Number.isNaN(value) || trimmed === '') throw Error(`Not a number (${trimmed})`);
    return {
        schema,
        jevko: jevko82,
        trimmed,
        value
    };
};
const toBoolean3 = (jevko83, schema)=>{
    const { subjevkos , suffix  } = jevko83;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    const trimmed = suffix.trim();
    if (trimmed === 'true') return {
        schema,
        jevko: jevko83,
        trimmed,
        value: true
    };
    if (trimmed === 'false') return {
        schema,
        jevko: jevko83,
        trimmed,
        value: false
    };
    throw Error(`not a boolean (${suffix})`);
};
const toNull3 = (jevko84, schema)=>{
    const { subjevkos , suffix  } = jevko84;
    if (subjevkos.length > 0) throw Error('nonempty subjevkos in string');
    const trimmed = suffix.trim();
    if (trimmed === 'null' || suffix === '') return {
        schema,
        jevko: jevko84,
        trimmed,
        value: null
    };
    throw Error(`not a null (${suffix})`);
};
const toArray8 = (jevko85, schema)=>{
    const { subjevkos , suffix  } = jevko85;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    const items = [];
    const { itemSchema  } = schema;
    for (const { prefix , jevko: jevko1  } of subjevkos){
        if (prefix.trim() !== '') throw Error(`nonempty prefix (${prefix})`);
        items.push({
            prefix,
            value: jevkoBySchemaToVerified1(jevko1, itemSchema)
        });
    }
    return {
        schema,
        jevko: jevko85,
        items
    };
};
const toTuple8 = (jevko86, schema)=>{
    const { subjevkos , suffix  } = jevko86;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    const items = [];
    const { itemSchemas , isSealed  } = schema;
    if (itemSchemas.length > subjevkos.length) throw Error('bad tuple');
    if (isSealed && itemSchemas.length !== subjevkos.length) throw Error('also bad tuple');
    for(let i18 = 0; i18 < itemSchemas.length; ++i18){
        const { prefix , jevko: jevko87  } = subjevkos[i18];
        if (prefix.trim() !== '') throw Error(`nonempty prefix (${prefix})`);
        items.push({
            prefix,
            value: jevkoBySchemaToVerified1(jevko87, itemSchemas[i18])
        });
    }
    return {
        schema,
        jevko: jevko86,
        items
    };
};
const toObject8 = (jevko88, schema)=>{
    const { subjevkos , suffix  } = jevko88;
    if (suffix.trim() !== '') throw Error('suffix !== ""');
    const keyJevkos = Object.create(null);
    const items = [];
    const { optional =[] , isSealed =true , props  } = schema;
    const keys = Object.keys(props);
    for (const { prefix , jevko: jevko2  } of subjevkos){
        const [pre, key, post] = trim31(prefix);
        if (key.startsWith('-')) {
            items.push({
                prefix,
                ignored: true,
                jevkoStr: jevkoToString2(jevko2)
            });
            continue;
        }
        if (key === '') throw Error('empty key');
        if (key in keyJevkos) throw Error('duplicate key');
        if (isSealed && keys.includes(key) === false) throw Error(`unknown key (${key}) ${post}`);
        items.push({
            prefix,
            pre,
            key,
            post,
            value: jevkoBySchemaToVerified1(jevko2, props[key])
        });
    }
    return {
        schema,
        jevko: jevko88,
        items
    };
};
const toFirstMatch8 = (jevko89, schema)=>{
    const { alternatives  } = schema;
    for (const alt of alternatives){
        try {
            const x = jevkoBySchemaToVerified1(jevko89, alt);
            return x;
        } catch (e) {
            continue;
        }
    }
    throw Error('toFirstMatch: invalid jevko');
};
const recur10 = (verified)=>{
    const { schema , jevko: jevko90  } = verified;
    const { type  } = schema;
    const sigil = typeToSigil1[type] || '';
    const { subjevkos , suffix  } = jevko90;
    if (subjevkos.length === 0) return {
        subjevkos,
        suffix: sigil + suffix
    };
    const { items  } = verified;
    let i19 = 0;
    const { prefix , jevko: j  } = subjevkos[i19];
    const item = items[i19];
    const mapped = [
        {
            prefix: sigil + prefix,
            jevko: item.ignored ? j : recur10(item.value)
        }
    ];
    ++i19;
    for(; i19 < subjevkos.length; ++i19){
        const { prefix , jevko: jevko91  } = subjevkos[i19];
        if (items[i19].ignored === true) {
            mapped.push({
                prefix,
                jevko: jevko91
            });
        } else mapped.push({
            prefix,
            jevko: recur10(items[i19].value)
        });
    }
    return {
        subjevkos: mapped,
        suffix
    };
};
const typeToSigil1 = {
    object: ':',
    array: '*',
    tuple: '.',
    string: "'"
};
const jevkoBySchemaToHtml = (jevko92, schema)=>{
    const verified = jevkoBySchemaToVerified1(jevko92, schema);
    return recur11(verified);
};
const recur11 = (verified)=>{
    const { schema , jevko: jevko93  } = verified;
    const { type  } = schema;
    const { subjevkos , suffix  } = jevko93;
    if (subjevkos.length === 0) return `<span class="${type}">${escape(suffix)}</span>`;
    if (type === 'object') return toObject9(verified);
    return toArrayOrTuple(verified);
};
const toObject9 = (verified)=>{
    const { items , jevko: jevko94  } = verified;
    const { subjevkos , suffix  } = jevko94;
    let ret = '';
    for(let i20 = 0; i20 < subjevkos.length; ++i20){
        const { prefix , jevko: jevko95  } = subjevkos[i20];
        const { ignored , value , key , pre , post  } = items[i20];
        if (ignored === true) {
            ret += `<span class="ignored">${escape(prefix)}[${jevkoToString(jevko95)}]</span>`;
        } else {
            ret += `<span class="item">${pre}<span class="key">${escape(key)}</span>${post}[<span class="value">${recur11(value)}</span>]</span>`;
        }
    }
    return `<span class="${ret === '' ? 'empty ' : ''}object">${ret}${suffix}</span>`;
};
const toArrayOrTuple = (verified)=>{
    const { schema , jevko: jevko96 , items  } = verified;
    const { subjevkos , suffix  } = jevko96;
    const { type  } = schema;
    let ret = '';
    for(let i21 = 0; i21 < subjevkos.length; ++i21){
        const { jevko: jevko97  } = subjevkos[i21];
        const { ignored , value , prefix  } = items[i21];
        if (ignored === true) {
            ret += `<span class="ignored">${escape(prefix)}[${jevkoToString(jevko97)}]</span>`;
        } else {
            ret += `<span class="item">${escape(prefix)}[${recur11(value)}]</span>`;
        }
    }
    return `<span class="${ret === '' ? 'empty ' : ''}${type}">${ret}${suffix}</span>`;
};
const djevkoToDomNodesById = (jevko98)=>{
    const byId = Object.create(null);
    const elems = djevkoToDomNodes(jevko98, byId);
    return [
        elems,
        byId
    ];
};
const djevkoToDomNodes = (jevko99, byId = Object.create(null))=>{
    const ret = recur12(jevko99, byId);
    for (const node of ret){
        if (Array.isArray(node)) throw Error(`Unexpected top-level attribute (${node[0]})`);
    }
    return ret;
};
const recur12 = (jevko100, byId = Object.create(null))=>{
    const { subjevkos , suffix  } = jevko100;
    if (subjevkos.length === 0) return [
        document.createTextNode(suffix)
    ];
    if (suffix.trim() !== '') throw Error(`Unexpected nonblank suffix (${suffix})`);
    const ret = [];
    for (const { prefix , jevko: jevko1  } of subjevkos){
        const [pre, mid, post] = trim3(prefix);
        if (mid === '') ret.push(...recur12(jevko1, byId));
        else if (mid.endsWith('=')) ret.push([
            mid.slice(0, -1),
            jevko1
        ]);
        else {
            const element = document.createElement(mid);
            const nodes = recur12(jevko1, byId);
            for (const e of nodes){
                if (Array.isArray(e)) {
                    const [name1, jevko101] = e;
                    if (jevko101.subjevkos.length > 0) throw Error('Unexpected subjevko in attribute value.');
                    const { suffix  } = jevko101;
                    element.setAttribute(name1, suffix);
                    if (name1 === 'id') byId[suffix] = element;
                } else {
                    element.append(e);
                }
            }
            ret.push(element);
        }
    }
    return ret;
};
const ejevkoToDomNodes = (jevko102)=>{
    const { subjevkos , suffix  } = jevko102;
    let mode = 'text';
    let tag = '', attrs = [];
    let ret = [];
    for (const { prefix , jevko: jevko1  } of subjevkos){
        if (mode === 'text') {
            [tag, attrs] = jevkoToTagAttrs(jevko1);
            ret.push(document.createTextNode(prefix));
            mode = 'content';
        } else {
            if (prefix.trim() !== '') throw Error('oops');
            const el = document.createElement(tag);
            for (const [k, v] of attrs){
                el.setAttribute(k, v);
            }
            el.append(...ejevkoToDomNodes(jevko1));
            ret.push(el);
            mode = 'text';
        }
    }
    ret.push(document.createTextNode(suffix));
    return ret;
};
const jevkoToTagAttrs = (jevko103)=>{
    const { subjevkos , suffix  } = jevko103;
    const [pre, tag, post] = trim3(suffix);
    let attrs = [];
    for (const { prefix , jevko: jevko2  } of subjevkos){
        const [pre, mid, post] = trim3(prefix);
        attrs.push([
            mid,
            jevkoToAttrValue(jevko2)
        ]);
    }
    return [
        tag,
        attrs
    ];
};
const jevkoToAttrValue = (jevko104)=>{
    const { subjevkos , suffix  } = jevko104;
    if (subjevkos.length > 0) throw Error('oops');
    return suffix;
};
const examples = {
    '': '',
    'The Dog': `Name [Dog]
Temporal range [At least 14,200 years ago – present]
Conservation status [Domesticated]
Scientific classification [
  Kingdom [Animalia]
  Phylum [Chordata]
  Class [Mammalia]
  Order [Carnivora]
  Family [Canidae]
  Genus [Canis]
  Species [C. familiaris]
]
Binomial name [
  [Canis familiaris]
  [Linnaeus, 1758]
]
Synonyms [
  [C. aegyptius Linnaeus, 1758]
  [C. alco C. E. H. Smith, 1839]
  [C. americanus Gmelin, 1792]
  [C. anglicus Gmelin, 1792]
  [C. antarcticus Gmelin, 1792]
]`,
    'John Smith': `first name [John]
last name [Smith]
is alive [true]
age [27]
address [
  street address [21 2nd Street]
  city [New York]
  state [NY]
  postal code [10021-3100]
]
phone numbers [
  [
    type [home]
    number [212 555-1234]
  ]
  [
    type [office]
    number [646 555-4567]
  ]
]
children []
spouse []`,
    rivers: `Rivers [
  [
    Name [Robinson River]
    Location [
      Country [Australia]
    ]
    Physical characteristics [
      Source [
        elevation [152 metres (499 ft)]
      ]
      Mouth [
        location [Stokes Bay]
        elevation [sea level]
      ]
      Length [107 kilometres (66 mi)]
      Basin size [3,329 square kilometres (1,285 sq mi)]
    ]
  ]
  [
    Name [Wooramel]
    Location [
      Country [Australia]
      State [Western Australia]
      Region [Gascoyne]
    ]
    Physical characteristics [
      Source [
        Name [McLeod Pyramid]
        coordinates [25°47′12″S 116°40′23″E]
        elevation [357 m (1,171 ft)]
      ]
      Mouth	[
        Name [Shark Bay]
        location [near Herald Loop]
        coordinates [25°52′59″S 114°13′57″E]
        elevation [0 m (0 ft)]
      ]
      Length [363 km (226 mi)]
      Basin size [40,500 km2 (15,600 sq mi)]
      Discharge [
        location [mouth]
      ]
    ]
  ]
]`,
    tree: `Prefix 1 [Suffix 1] 
Prefix 2 [
  Prefix 2.1 [Suffix 2.1] 
  Prefix 2.2 [Suffix 2.2]
]
Prefix 3 [Suffix 3]`,
    vscode: `editor.quickSuggestions [
  other [true]
  comments [false]
  strings [false]
]
terminal.integrated.wordSeparators [ ()\`[\`]{}',"\`\`─‘’]
terminal.integrated.scrollback [1000]
remote.extensionKind [
  pub.name [[ui]]
]
git.checkoutType [[local] [remote] [tags]]
git.defaultCloneDirectory [null]`,
    'Sumerian': `Name [Sumerian]
Native name [[𒅴𒂠][Emegir]]
Native to [[Sumer][Akkadian Empire]]
Region [Mesopotamia (modern-day Iraq)]
Era [Attested from c. 3000 BC. Effectively extinct from about 2000–1800 BC; used as classical language until about 100 AD.]
Language family [Language isolate]
Writing system [Sumero-Akkadian cuneiform]
language codes [
  ISO 639-2 [sux]
  ISO 639-3 [sux]
  Glottolog [sume1241]
]`,
    'Ray Jackson': `Name [Ray Jackson]
Number [[3][33]]
Position [Running back]
Personal information [
  Born [
    [August 1, 1978 (age 43)]
    [Indianapolis, Indiana]
  ]
  Height [6 ft 1 in (1.85 m)]
  Weight [223 lb (101 kg)]
]
Career information [
  High school [Indianapolis (IN) Lawrence Central]
  College [Cincinnati]
  Undrafted [2002]
]
Career history [
  [Cincinnati Bengals (2003)*]
  [Tennessee Titans (2003–2004)]
  [Berlin Thunder (2004)]
  [Cincinnati Marshals (2006)]
  [Cincinnati Commandos (2010)]
]
Career NFL statistics [
  Kick returns [3]
  Yards [77]
]`,
    'Moko the Dolphin': `Name [Moko]
Species [Bottlenose dolphin]
Born [2006]
Died [July 2010 (aged 4)]
Resting place [
  [Matakana Island, NZ]
  [Bay of Plenty, NZ]
]
Years active [2007–2010]
Known for [Rescue of pygmy sperm whales]`,
    'The Horse': `Name [Horse]

Conservation status [Domesticated]
Scientific classification [
  Kingdom [Animalia]
  Phylum [Chordata]
  Class [Mammalia]
  Order [Perissodactyla]
  Family [Equidae]
  Genus [Equus]
  Species [E. ferus]
  Subspecies [E. f. caballus]
]
Trinomial name [
  [Equus ferus caballus]
  [Linnaeus, 1758]
] 
Synonyms [at least 48 published]`
};
function shuffleArray(array) {
    for(let i22 = array.length - 1; i22 > 0; i22--){
        const j = Math.floor(Math.random() * (i22 + 1));
        [array[i22], array[j]] = [
            array[j],
            array[i22]
        ];
    }
    return array;
}
document.body.onload = ()=>{
    const containerStyle = `display: flex; width: 100%; overflow: auto; padding-right: 1rem; box-sizing: border-box`;
    const editorStyle = `flex: 1; min-width: 30%; margin-left: 1rem;`;
    const apiUrls = shuffleArray([
        "https://hacker-news.firebaseio.com/v0/user/jl.json?print=pretty",
        "https://api.github.com/users/octocat",
        "https://www.7timer.info/bin/astro.php?lon=113.2&lat=23.1&ac=0&unit=metric&output=json&tzshift=0",
        "https://archive.org/metadata/TheAdventuresOfTomSawyer_201303",
        "https://www.boredapi.com/api/activity",
        "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita",
        "https://api.coindesk.com/v1/bpi/currentprice.json",
        "https://api.coingecko.com/api/v3/exchange_rates",
        "https://datausa.io/api/data?drilldowns=Nation&measures=Population",
        "https://freegeoip.app/json/",
        "http://httpbin.org/get", 
    ]);
    const [elems, elemsById] = djevkoToDomNodesById(parseJevko(`
  style [
    .cm-editor {
      height: 30rem;
    }
    .float64, .number {
      color: #e5c07b;
    }
    .json .key {
      color: #e06c75;
      text-decoration: none;
    }
    .key {
      color: #61afef;
      text-decoration: underline;
      text-decoration-color: #014f8f;
      text-decoration-thickness: 3px;
    }
    .string {
      color: #98c379;
    }
    .boolean {
      color: #d19a66;
    }
    .tuple {
      color: #31bf7f;
    }
    .object {
      color: #317fbf;
    }
    .json .object {
      color: #abb2bf;
    }
    .null {
      color: #abb2bf;
    }
    .empty.object, .empty.tuple {
      position: relative;
    }
    .empty.object::before, .empty.tuple::before {
      position: absolute;
      content: ' ';
      text-decoration: underline 3px;
      left: -0.3rem;
      width: 100%;
    }
    /*.empty.object::before {
      content: ':';
    }
    .empty.tuple::before {
      content: '.';
    }*/
    #jsonSchema, #jevko, #json {
      color: #abb2bf;
      background-color: #282c34;
      margin-top: 0;
      padding-top: 2px;

      height: 30rem;
      overflow: auto;
      box-sizing: border-box;
      line-height: 1.4;
    }
    .error {
      color: red;
    }
  ]
  div [
    style=[margin-left: 1rem]
    [click on code to edit]
    br []
    [click away to apply changes]
  ]
  div [
    style=[${containerStyle}]
    div [
      id=[jsonEditorSettings] 
      style=[${editorStyle}] 
      [JSON]
      button [
        id=[convert]
        [convert]
      ]
      br []
      button [
        id=[submit]
        [get from]
      ]
      select[id=[apis]\n${apiUrls.map((v)=>{
        return jv`option[value=[${v}][${v}]]`;
    }).join('\n')}]
      input [
        id=[url]
        type=[text]
        style=[width: 30rem]
        value=[${apiUrls[Math.random() * apiUrls.length | 0]}]
      ]
      br []
    ]
    div [
      id=[schemaContainerSettings] 
      style=[${editorStyle}; text-align: center]
      [Schema]
      br[]
      button [
        id=[toggleSchema]
        [toggle]
      ]
    ]
    div [ 
      style=[${editorStyle}; text-align: right] 
      label [
        input [
          id=[selfDescribing]
          type=[checkbox]
        ]
        [self-describing ]
      ]
      select[id=[examples]\n${Object.entries(examples).map(([k, v])=>{
        return jv`option[value=[${v}][${k}]]`;
    }).join('\n')}]
      [InterJevko]
    ]
  ]
  div [
    style=[${containerStyle}]
    div [
      style=[${editorStyle}] 
      pre [id=[json]]
      div [id=[jsonEditor] style=[display: none]]
    ]
    div [
      id=[schemaContainer] 
      style=[${editorStyle}]
      pre [id=[jsonSchema]]
    ]
    div [ 
      style=[${editorStyle}] 
      pre [id=[jevko]]
      div [id=[jevkoEditor] style=[display: none]]
    ]
  ]
  `));
    elemsById.toggleSchema.onclick = ()=>{
        const { style  } = elemsById.schemaContainer;
        if (style.display === 'none') style.display = '';
        else {
            style.display = 'none';
        }
    };
    elemsById.jevko.onclick = ()=>{
        const { scrollLeft , scrollTop  } = elemsById.jevko;
        elemsById.jevko.style.display = 'none';
        elemsById.jevkoEditor.style.display = 'block';
        jevkoEditor.scrollDOM.scroll(scrollLeft, scrollTop);
        jevkoEditor.focus();
        jevkoEditor.dispatch({
            changes: {
                from: 0,
                to: jevkoEditor.state.doc.length,
                insert: elemsById.jevko.textContent
            }
        });
    };
    elemsById.json.onclick = ()=>{
        const { scrollLeft , scrollTop  } = elemsById.json;
        elemsById.json.style.display = 'none';
        elemsById.jsonEditor.style.display = 'block';
        jsonEditor.scrollDOM.scroll(scrollLeft, scrollTop);
        jsonEditor.focus();
        jsonEditor.dispatch({
            changes: {
                from: 0,
                to: jsonEditor.state.doc.length,
                insert: elemsById.json.textContent
            }
        });
    };
    const jevkoEditor = makeJevkoEditor(elemsById.jevkoEditor);
    const jsonEditor = makeJsonEditor(elemsById.jsonEditor);
    elemsById.jevkoEditor.addEventListener('focusout', ()=>{
        const { scrollLeft , scrollTop  } = jevkoEditor.scrollDOM;
        elemsById.jevko.style.display = 'block';
        elemsById.jevkoEditor.style.display = 'none';
        elemsById.jevko.scroll(scrollLeft, scrollTop);
        console.log(jevkoEditor.state.doc.toString());
        applyExample(jevkoEditor.state.doc.toString());
    });
    elemsById.jsonEditor.addEventListener('focusout', ()=>{
        const { scrollLeft , scrollTop  } = jsonEditor.scrollDOM;
        elemsById.json.style.display = 'block';
        elemsById.jsonEditor.style.display = 'none';
        elemsById.json.scroll(scrollLeft, scrollTop);
        console.log(jsonEditor.state.doc.toString());
        convertJson();
        elemsById.json.replaceChildren(...djevkoToDomNodes(jsonStrToHtmlSpans(jsonEditor.state.doc.toString(), {
            pretty: true
        })));
    });
    const fetchJson = async (url)=>fetch(url).then(async (res)=>{
            const jsonStr = await res.text();
            return jsonStr;
        }).then((jsonStr)=>{
            jsonEditor.dispatch({
                changes: {
                    from: 0,
                    to: jsonEditor.state.doc.length,
                    insert: JSON.stringify(JSON.parse(jsonStr), null, 2)
                }
            });
            elemsById.json.replaceChildren(...djevkoToDomNodes(jsonStrToHtmlSpans(jsonStr, {
                pretty: true
            })));
            convertJson();
        })
    ;
    elemsById.submit.onclick = ()=>{
        fetchJson(elemsById.url.value);
    };
    elemsById.apis.onchange = (e)=>{
        elemsById.url.value = e.target.value;
        fetchJson(e.target.value);
    };
    elemsById.selfDescribing.onchange = (e)=>{
        const { checked  } = e.target;
    };
    const applyExample = (jevkoStr)=>{
        const jevko105 = parseJevko(jevkoStr);
        console.log(elemsById.selfDescribing.checked);
        try {
            const schema = interJevkoToSchema(jevko105);
            console.log(schema);
            const sjevko = highlightSjevko(jevkoToPrettyJevko(schemaToSjevko(schema)));
            elemsById.jsonSchema.replaceChildren(...djevkoToDomNodes(sjevko));
            if (elemsById.selfDescribing.checked) {
                const zipped = zipWithSchema(jevko105, schema);
                console.log(zipped);
                elemsById.jevko.replaceChildren(...djevkoToDomNodes(zjevkoToDjevko(zipped, schema)));
            } else {
                elemsById.jevko.innerHTML = jevkoBySchemaToHtml(jevko105, schema);
            }
            const val = jevkoBySchemaToValue(jevko105, schema);
            replaceEditorContents(jsonEditor, JSON.stringify(val, null, 2));
            elemsById.json.replaceChildren(...djevkoToDomNodes(jsonStrToHtmlSpans(jsonEditor.state.doc.toString(), {
                pretty: true
            })));
        } catch (e) {
            elemsById.jsonSchema.replaceChildren(...djevkoToDomNodes(parseJevko(`span[class=[error][Error: ${e.message}]]`)));
            throw e;
        }
    };
    elemsById.examples.onchange = (e)=>{
        const jevkoStr = e.target.value;
        applyExample(jevkoStr);
    };
    const initialJsonStr = `  {
  "a": 1, 
  "b": "3", 
  "c": true, 
  "d": null, 
  "e": [5, 4], 
  "f": {
    "a": [], 
    "b": {}
  }
}`;
    document.body.append(...elems);
    jsonEditor.dispatch({
        changes: {
            from: 0,
            insert: initialJsonStr
        }
    });
    const sss = jsonStrToHtmlSpans(initialJsonStr, {
        pretty: true
    });
    console.log(sss, parseJevko(sss));
    elemsById.json.replaceChildren(...djevkoToDomNodes(sss));
    const convertJson = ()=>{
        const jsonStr = jsonEditor.state.doc.sliceString(0);
        const json5 = JSON.parse(jsonStr);
        const jevko106 = jsonToJevko1(json5);
        const schema = jsonToSchema(json5);
        const jevkoStr = jevkoToPrettyString(jevko106);
        const sjevko = highlightSjevko(jevkoToPrettyJevko(schemaToSjevko(schema)));
        console.log(sjevko);
        elemsById.jsonSchema.replaceChildren(...djevkoToDomNodes(sjevko));
        elemsById.jevko.innerHTML = jevkoBySchemaToHtml(jevkoToPrettyJevko(jevko106), schema);
        jevkoEditor.dispatch({
            changes: {
                from: 0,
                insert: jevkoStr
            }
        });
    };
    elemsById.convert.onclick = convertJson;
};
const replaceEditorContents = (editor, str)=>{
    editor.dispatch({
        changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: str
        }
    });
};
