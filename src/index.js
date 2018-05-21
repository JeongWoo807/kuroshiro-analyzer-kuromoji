import kuromoji from "kuromoji";

var isNode = false;
var isBrowser = (typeof window !== 'undefined');
if (!isBrowser && typeof module !== 'undefined' && module.exports) {
    isNode = true;
}

class Analyzer {
    constructor({ dicPath } = {}) {
        this._analyzer = null;

        if (!dicPath) {
            if (isNode) this._dicPath = require.resolve('kuromoji').replace(/src(?!.*src).*/, 'dict/');
            else this._dicPath = 'bower_components/kuroshiro/dist/dict/';
        } else {
            this._dicPath = dicPath;
        }
    }

    init() {
        return new Promise((resolve, reject) => {
            let self = this;
            if (this._analyzer == null) {
                kuromoji.builder({ dicPath: this._dicPath }).build(function (err, newAnalyzer) {
                    if (err)
                        return reject(err);

                    self._analyzer = newAnalyzer;
                    resolve();
                });
            } else {
                reject(new Error("This analyzer has already been initialized."));
            }
        });
    }

    parse(str = "") {
        return new Promise((resolve, reject) => {
            if (str.trim() == "") return resolve([]);
            resolve(this._analyzer.tokenize(str));
        });
    }
}

export default Analyzer;