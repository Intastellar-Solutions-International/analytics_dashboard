/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Components/Header/logo.png":
/*!****************************************!*\
  !*** ./src/Components/Header/logo.png ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "e275e7aca6ee39ff06396126f40f419f.png");

/***/ }),

/***/ "./node_modules/punycode/punycode.es6.js":
/*!***********************************************!*\
  !*** ./node_modules/punycode/punycode.es6.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decode": () => (/* binding */ decode),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "encode": () => (/* binding */ encode),
/* harmony export */   "toASCII": () => (/* binding */ toASCII),
/* harmony export */   "toUnicode": () => (/* binding */ toUnicode),
/* harmony export */   "ucs2decode": () => (/* binding */ ucs2decode),
/* harmony export */   "ucs2encode": () => (/* binding */ ucs2encode)
/* harmony export */ });


/** Highest positive signed 32-bit float value */
const maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128; // 0x80
const delimiter = '-'; // '\x2D'

/** Regular expressions */
const regexPunycode = /^xn--/;
const regexNonASCII = /[^\0-\x7F]/; // Note: U+007F DEL is excluded too.
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
const errors = {
	'overflow': 'Overflow: input needs wider integers to process',
	'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
	'invalid-input': 'Invalid input'
};

/** Convenience shortcuts */
const baseMinusTMin = base - tMin;
const floor = Math.floor;
const stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error(type) {
	throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map(array, callback) {
	const result = [];
	let length = array.length;
	while (length--) {
		result[length] = callback(array[length]);
	}
	return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {String} A new string of characters returned by the callback
 * function.
 */
function mapDomain(domain, callback) {
	const parts = domain.split('@');
	let result = '';
	if (parts.length > 1) {
		// In email addresses, only the domain name should be punycoded. Leave
		// the local part (i.e. everything up to `@`) intact.
		result = parts[0] + '@';
		domain = parts[1];
	}
	// Avoid `split(regex)` for IE8 compatibility. See #17.
	domain = domain.replace(regexSeparators, '\x2E');
	const labels = domain.split('.');
	const encoded = map(labels, callback).join('.');
	return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
	const output = [];
	let counter = 0;
	const length = string.length;
	while (counter < length) {
		const value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			// It's a high surrogate, and there is a next character.
			const extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				// It's an unmatched surrogate; only append this code unit, in case the
				// next code unit is the high surrogate of a surrogate pair.
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}
	return output;
}

/**
 * Creates a string based on an array of numeric code points.
 * @see `punycode.ucs2.decode`
 * @memberOf punycode.ucs2
 * @name encode
 * @param {Array} codePoints The array of numeric code points.
 * @returns {String} The new Unicode string (UCS-2).
 */
const ucs2encode = codePoints => String.fromCodePoint(...codePoints);

/**
 * Converts a basic code point into a digit/integer.
 * @see `digitToBasic()`
 * @private
 * @param {Number} codePoint The basic numeric code point value.
 * @returns {Number} The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */
const basicToDigit = function(codePoint) {
	if (codePoint >= 0x30 && codePoint < 0x3A) {
		return 26 + (codePoint - 0x30);
	}
	if (codePoint >= 0x41 && codePoint < 0x5B) {
		return codePoint - 0x41;
	}
	if (codePoint >= 0x61 && codePoint < 0x7B) {
		return codePoint - 0x61;
	}
	return base;
};

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
const digitToBasic = function(digit, flag) {
	//  0..25 map to ASCII a..z or A..Z
	// 26..35 map to ASCII 0..9
	return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
const adapt = function(delta, numPoints, firstTime) {
	let k = 0;
	delta = firstTime ? floor(delta / damp) : delta >> 1;
	delta += floor(delta / numPoints);
	for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
		delta = floor(delta / baseMinusTMin);
	}
	return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
 * symbols.
 * @memberOf punycode
 * @param {String} input The Punycode string of ASCII-only symbols.
 * @returns {String} The resulting string of Unicode symbols.
 */
const decode = function(input) {
	// Don't use UCS-2.
	const output = [];
	const inputLength = input.length;
	let i = 0;
	let n = initialN;
	let bias = initialBias;

	// Handle the basic code points: let `basic` be the number of input code
	// points before the last delimiter, or `0` if there is none, then copy
	// the first basic code points to the output.

	let basic = input.lastIndexOf(delimiter);
	if (basic < 0) {
		basic = 0;
	}

	for (let j = 0; j < basic; ++j) {
		// if it's not a basic code point
		if (input.charCodeAt(j) >= 0x80) {
			error('not-basic');
		}
		output.push(input.charCodeAt(j));
	}

	// Main decoding loop: start just after the last delimiter if any basic code
	// points were copied; start at the beginning otherwise.

	for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

		// `index` is the index of the next character to be consumed.
		// Decode a generalized variable-length integer into `delta`,
		// which gets added to `i`. The overflow checking is easier
		// if we increase `i` as we go, then subtract off its starting
		// value at the end to obtain `delta`.
		const oldi = i;
		for (let w = 1, k = base; /* no condition */; k += base) {

			if (index >= inputLength) {
				error('invalid-input');
			}

			const digit = basicToDigit(input.charCodeAt(index++));

			if (digit >= base) {
				error('invalid-input');
			}
			if (digit > floor((maxInt - i) / w)) {
				error('overflow');
			}

			i += digit * w;
			const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

			if (digit < t) {
				break;
			}

			const baseMinusT = base - t;
			if (w > floor(maxInt / baseMinusT)) {
				error('overflow');
			}

			w *= baseMinusT;

		}

		const out = output.length + 1;
		bias = adapt(i - oldi, out, oldi == 0);

		// `i` was supposed to wrap around from `out` to `0`,
		// incrementing `n` each time, so we'll fix that now:
		if (floor(i / out) > maxInt - n) {
			error('overflow');
		}

		n += floor(i / out);
		i %= out;

		// Insert `n` at position `i` of the output.
		output.splice(i++, 0, n);

	}

	return String.fromCodePoint(...output);
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
const encode = function(input) {
	const output = [];

	// Convert the input in UCS-2 to an array of Unicode code points.
	input = ucs2decode(input);

	// Cache the length.
	const inputLength = input.length;

	// Initialize the state.
	let n = initialN;
	let delta = 0;
	let bias = initialBias;

	// Handle the basic code points.
	for (const currentValue of input) {
		if (currentValue < 0x80) {
			output.push(stringFromCharCode(currentValue));
		}
	}

	const basicLength = output.length;
	let handledCPCount = basicLength;

	// `handledCPCount` is the number of code points that have been handled;
	// `basicLength` is the number of basic code points.

	// Finish the basic string with a delimiter unless it's empty.
	if (basicLength) {
		output.push(delimiter);
	}

	// Main encoding loop:
	while (handledCPCount < inputLength) {

		// All non-basic code points < n have been handled already. Find the next
		// larger one:
		let m = maxInt;
		for (const currentValue of input) {
			if (currentValue >= n && currentValue < m) {
				m = currentValue;
			}
		}

		// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
		// but guard against overflow.
		const handledCPCountPlusOne = handledCPCount + 1;
		if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
			error('overflow');
		}

		delta += (m - n) * handledCPCountPlusOne;
		n = m;

		for (const currentValue of input) {
			if (currentValue < n && ++delta > maxInt) {
				error('overflow');
			}
			if (currentValue === n) {
				// Represent delta as a generalized variable-length integer.
				let q = delta;
				for (let k = base; /* no condition */; k += base) {
					const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
					if (q < t) {
						break;
					}
					const qMinusT = q - t;
					const baseMinusT = base - t;
					output.push(
						stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
					);
					q = floor(qMinusT / baseMinusT);
				}

				output.push(stringFromCharCode(digitToBasic(q, 0)));
				bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
				delta = 0;
				++handledCPCount;
			}
		}

		++delta;
		++n;

	}
	return output.join('');
};

/**
 * Converts a Punycode string representing a domain name or an email address
 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
 * it doesn't matter if you call it on a string that has already been
 * converted to Unicode.
 * @memberOf punycode
 * @param {String} input The Punycoded domain name or email address to
 * convert to Unicode.
 * @returns {String} The Unicode representation of the given Punycode
 * string.
 */
const toUnicode = function(input) {
	return mapDomain(input, function(string) {
		return regexPunycode.test(string)
			? decode(string.slice(4).toLowerCase())
			: string;
	});
};

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
const toASCII = function(input) {
	return mapDomain(input, function(string) {
		return regexNonASCII.test(string)
			? 'xn--' + encode(string)
			: string;
	});
};

/*--------------------------------------------------------------------------*/

/** Define the public API */
const punycode = {
	/**
	 * A string representing the current Punycode.js version number.
	 * @memberOf punycode
	 * @type String
	 */
	'version': '2.1.0',
	/**
	 * An object of methods to convert from JavaScript's internal character
	 * representation (UCS-2) to Unicode code points, and back.
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode
	 * @type Object
	 */
	'ucs2': {
		'decode': ucs2decode,
		'encode': ucs2encode
	},
	'decode': decode,
	'encode': encode,
	'toASCII': toASCII,
	'toUnicode': toUnicode
};


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (punycode);


/***/ }),

/***/ "./src/API/api.js":
/*!************************!*\
  !*** ./src/API/api.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _host__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./host */ "./src/API/host.js");
/* harmony import */ var _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Authentication/Auth */ "./src/Authentication/Auth.js");


const API = {
  Login: {
    url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.LoginHost, "/signin/v2/signin.php")
  },
  gdpr: {
    getTotalNumber: {
      url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.PrimaryHost, "/analytics/gdpr/getTotalNumber.php"),
      method: "GET",
      headers: {
        "Authorization": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getToken(),
        "Organisation": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getOrganisation()
      }
    },
    getInteractions: {
      url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.PrimaryHost, "/analytics/gdpr/getInteractions.php"),
      method: "GET",
      headers: {
        "Authorization": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getToken(),
        "Organisation": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getOrganisation()
      }
    },
    getDomains: {
      url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.PrimaryHost, "/analytics/gdpr/getDomains.php"),
      method: "GET",
      headers: {
        "Authorization": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getToken(),
        "Organisation": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getOrganisation()
      }
    }
  },
  ferry: {
    getTotalSales: {
      url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.PrimaryHost, "/analytics/ferry/getTotalSales.php"),
      method: "GET",
      headers: {
        "Authorization": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getToken()
      }
    }
  },
  settings: {
    getOrganisation: {
      url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.PrimaryHost, "/analytics/settings/getOrganisation.php"),
      method: "POST",
      headers: {
        "Authorization": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getToken()
      }
    },
    createOrganisation: {
      url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.PrimaryHost, "/analytics/settings/create-organisation.php"),
      method: "POST",
      headers: {
        "Authorization": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getToken()
      }
    },
    updateSettings: {
      url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.PrimaryHost, "/analytics/settings/updateSettings.php"),
      method: "POST",
      headers: {
        "Authorization": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getToken(),
        "Organisation": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getOrganisation()
      }
    },
    addUser: {
      url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.PrimaryHost, "/analytics/settings/add-user.php"),
      method: "POST",
      headers: {
        "Authorization": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getToken()
      }
    },
    getSettings: {
      url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.PrimaryHost, "/analytics/settings/getOrganisation.php"),
      method: "GET",
      headers: {
        "Authorization": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getToken(),
        "Organisation": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getOrganisation()
      }
    },
    createSettings: {
      url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.PrimaryHost, "/analytics/settings/create-organisation.php"),
      method: "POST",
      headers: {
        "Authorization": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getToken(),
        "Organisation": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getOrganisation()
      }
    }
  },
  ferry: {
    getTotalSales: {
      url: "".concat(_host__WEBPACK_IMPORTED_MODULE_0__.PrimaryHost, "/analytics/ferry/getTotalSales.php"),
      method: "GET",
      headers: {
        "Authorization": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getToken(),
        "Organisation": _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].getOrganisation()
      }
    }
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (API);

/***/ }),

/***/ "./src/API/host.js":
/*!*************************!*\
  !*** ./src/API/host.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoginHost": () => (/* binding */ LoginHost),
/* harmony export */   "PrimaryHost": () => (/* binding */ PrimaryHost)
/* harmony export */ });
const PrimaryHost = "https://apis.intastellarsolutions.com";
const LoginHost = "https://apis.intastellaraccounts.com";


/***/ }),

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomainContext": () => (/* binding */ DomainContext),
/* harmony export */   "OrganisationContext": () => (/* binding */ OrganisationContext),
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App.css */ "./src/App.css");
/* harmony import */ var _Components_Header_header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Components/Header/header */ "./src/Components/Header/header.js");
/* harmony import */ var _Login_Login__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Login/Login */ "./src/Login/Login.js");
/* harmony import */ var _Components_Header_Nav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/Header/Nav */ "./src/Components/Header/Nav.js");
/* harmony import */ var _API_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./API/api */ "./src/API/api.js");
/* harmony import */ var _Pages_Dashboard_Dashboard_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Pages/Dashboard/Dashboard.js */ "./src/Pages/Dashboard/Dashboard.js");
/* harmony import */ var _Pages_Domains_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Pages/Domains/index.js */ "./src/Pages/Domains/index.js");
/* harmony import */ var _Pages_Settings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Pages/Settings */ "./src/Pages/Settings/index.js");
/* harmony import */ var _Pages_Settings_CreateOrganisation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Pages/Settings/CreateOrganisation */ "./src/Pages/Settings/CreateOrganisation/index.js");
/* harmony import */ var _Pages_Settings_AddUser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Pages/Settings/AddUser */ "./src/Pages/Settings/AddUser/index.js");
/* harmony import */ var _Pages_Settings_ViewOrganisations__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Pages/Settings/ViewOrganisations */ "./src/Pages/Settings/ViewOrganisations/index.js");
/* harmony import */ var _Login_LoginOverlay__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Login/LoginOverlay */ "./src/Login/LoginOverlay.js");
/* harmony import */ var _Pages_Dashboard_DomainDashbord__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Pages/Dashboard/DomainDashbord */ "./src/Pages/Dashboard/DomainDashbord.js");
/* harmony import */ var _Functions_fetch__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Functions/fetch */ "./src/Functions/fetch.js");
/* harmony import */ var _Components_AddDomain_AddDomain__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Components/AddDomain/AddDomain */ "./src/Components/AddDomain/AddDomain.js");





const {
  useState,
  useEffect,
  useRef,
  createContext
} = React;
const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;










const OrganisationContext = createContext(localStorage.getItem("organisation"));
const DomainContext = createContext(null);
function App() {
  var _JSON$parse, _JSON$parse2, _JSON$parse3;

  const [dashboardView, setDashboardView] = useState("GDPR Cookiebanner");
  const [organisation, setOrganisation] = useState(localStorage.getItem("organisation") ? localStorage.getItem("organisation") : null);
  const [currentDomain, setCurrentDomain] = useState("all");
  const [handle, setHandle] = useState(null);

  if (((_JSON$parse = JSON.parse(localStorage.getItem("globals"))) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.token) != undefined || (_JSON$parse2 = JSON.parse(localStorage.getItem("globals"))) !== null && _JSON$parse2 !== void 0 && _JSON$parse2.status) {
    if (window.location.href.indexOf("/login") > -1) {
      window.location.href = "/dashboard";
    }

    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement(OrganisationContext.Provider, {
      value: [organisation, setOrganisation]
    }, /*#__PURE__*/React.createElement(DomainContext.Provider, {
      value: [currentDomain, setCurrentDomain]
    }, /*#__PURE__*/React.createElement(_Components_Header_header__WEBPACK_IMPORTED_MODULE_1__["default"], {
      handle: handle
    }), /*#__PURE__*/React.createElement("div", {
      className: "main-grid"
    }, /*#__PURE__*/React.createElement(_Components_Header_Nav__WEBPACK_IMPORTED_MODULE_3__["default"], null), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
      path: "/dashboard",
      exact: true
    }, /*#__PURE__*/React.createElement(_Pages_Dashboard_Dashboard_js__WEBPACK_IMPORTED_MODULE_5__["default"], {
      dashboardView: dashboardView,
      setDashboardView: setDashboardView
    })), /*#__PURE__*/React.createElement(Route, {
      path: "/domains",
      exact: true
    }, /*#__PURE__*/React.createElement(_Pages_Domains_index_js__WEBPACK_IMPORTED_MODULE_6__["default"], null)), /*#__PURE__*/React.createElement(Route, {
      path: "/settings",
      exact: true
    }, /*#__PURE__*/React.createElement(_Pages_Settings__WEBPACK_IMPORTED_MODULE_7__["default"], null)), /*#__PURE__*/React.createElement(Route, {
      path: "/settings/create-organisation"
    }, /*#__PURE__*/React.createElement(_Pages_Settings_CreateOrganisation__WEBPACK_IMPORTED_MODULE_8__["default"], null)), /*#__PURE__*/React.createElement(Route, {
      path: "/settings/add-user"
    }, /*#__PURE__*/React.createElement(_Pages_Settings_AddUser__WEBPACK_IMPORTED_MODULE_9__["default"], null)), /*#__PURE__*/React.createElement(Route, {
      path: "/settings/view-organisations"
    }, /*#__PURE__*/React.createElement(_Pages_Settings_ViewOrganisations__WEBPACK_IMPORTED_MODULE_10__["default"], null)), /*#__PURE__*/React.createElement(Route, {
      path: "/view/:handle"
    }, /*#__PURE__*/React.createElement(_Pages_Dashboard_DomainDashbord__WEBPACK_IMPORTED_MODULE_12__["default"], {
      setHandle: setHandle
    })), /*#__PURE__*/React.createElement(Route, {
      path: "/add-domain"
    }, /*#__PURE__*/React.createElement(_Components_AddDomain_AddDomain__WEBPACK_IMPORTED_MODULE_14__["default"], null)), /*#__PURE__*/React.createElement(Redirect, {
      to: "/login"
    })))))));
  } else if (((_JSON$parse3 = JSON.parse(localStorage.getItem("globals"))) === null || _JSON$parse3 === void 0 ? void 0 : _JSON$parse3.token) == undefined) {
    return /*#__PURE__*/React.createElement(Router, {
      path: "/login",
      exact: true
    }, /*#__PURE__*/React.createElement(_Login_Login__WEBPACK_IMPORTED_MODULE_2__["default"], null));
  }
}

/***/ }),

/***/ "./src/Authentication/Auth.js":
/*!************************************!*\
  !*** ./src/Authentication/Auth.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Authentication = {
  Login: function (url, email, password, type, setErrorMessage, setLoading) {
    setLoading(true);
    fetch(url, {
      withCredentials: false,
      method: "POST",
      headers: {
        'LoginType': 'employee',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        type: type
      })
    }).then(response => {
      return response.json();
    }).then(response => {
      if (response === "Err_Logon_Fail") {
        setErrorMessage("We having trouble to log you in");
        return;
      }

      if (response === "Err_Logon_Deny") {
        setErrorMessage("Your account has been locked due to too many incorrect password attempts – please contact your Intastellar Account Manager for assistance");
        return;
      }

      setLoading(false);
      localStorage.setItem("organisation", response.organisation);
      localStorage.setItem("globals", JSON.stringify(response));

      if (window.location.href === "/login") {
        window.location.href = "/dashboard";
      } else {
        window.location.reload();
      }
    });
  },
  Logout: function () {
    localStorage.removeItem("globals");
    window.location.reload();
  },
  getToken: function () {
    var _JSON$parse, _JSON$parse2;

    const token = (_JSON$parse = JSON.parse(localStorage.getItem("globals"))) !== null && _JSON$parse !== void 0 && _JSON$parse.token ? "Bearer " + ((_JSON$parse2 = JSON.parse(localStorage.getItem("globals"))) === null || _JSON$parse2 === void 0 ? void 0 : _JSON$parse2.token) : undefined;
    return token;
  },
  getUserId: function () {
    var _JSON$parse3, _JSON$parse3$profile, _JSON$parse4, _JSON$parse4$profile;

    const email = (_JSON$parse3 = JSON.parse(localStorage.getItem("globals"))) !== null && _JSON$parse3 !== void 0 && (_JSON$parse3$profile = _JSON$parse3.profile) !== null && _JSON$parse3$profile !== void 0 && _JSON$parse3$profile.email ? (_JSON$parse4 = JSON.parse(localStorage.getItem("globals"))) === null || _JSON$parse4 === void 0 ? void 0 : (_JSON$parse4$profile = _JSON$parse4.profile) === null || _JSON$parse4$profile === void 0 ? void 0 : _JSON$parse4$profile.email : undefined;
    return email;
  },
  getOrganisation: function () {
    var _JSON$parse5;

    const organisation = localStorage.getItem("organisation") != null || localStorage.getItem("organisation") != undefined ? (_JSON$parse5 = JSON.parse(localStorage.getItem("organisation"))) === null || _JSON$parse5 === void 0 ? void 0 : _JSON$parse5.id : undefined;
    return organisation;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Authentication);

/***/ }),

/***/ "./src/Components/AddDomain/AddDomain.js":
/*!***********************************************!*\
  !*** ./src/Components/AddDomain/AddDomain.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AddDomain)
/* harmony export */ });
/* harmony import */ var _InputFields_textInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InputFields/textInput */ "./src/Components/InputFields/textInput.js");

function AddDomain() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement("h2", null, "Add domain"), /*#__PURE__*/React.createElement("p", null, "Here you can add a domain to your organisation."), /*#__PURE__*/React.createElement("p", null, "After adding a domain you can implement the GDPR cookiebanner on your website."), /*#__PURE__*/React.createElement(_InputFields_textInput__WEBPACK_IMPORTED_MODULE_0__["default"], {
    placeholder: "Add domain"
  })));
}

/***/ }),

/***/ "./src/Components/Charts/WorldMap/WorldMap.js":
/*!****************************************************!*\
  !*** ./src/Components/Charts/WorldMap/WorldMap.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Map)
/* harmony export */ });
/* harmony import */ var _Style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Style.css */ "./src/Components/Charts/WorldMap/Style.css");
/* harmony import */ var _Countries_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Countries.module.css */ "./src/Components/Charts/WorldMap/Countries.module.css");


function Map(props) {
  const data = props.data;
  const countries = data.Countries;
  const countryFill = {
    fill: "",
    country: ""
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grid-container grid-3"
  }, countries === null || countries === void 0 ? void 0 : countries.map((country, key) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "widget overviewTotal",
      key: key
    }, /*#__PURE__*/React.createElement("h3", null, country.country != "" ? country.country : "Unknown"), /*#__PURE__*/React.createElement("h4", null, "Total: ", country.num.total), /*#__PURE__*/React.createElement("section", {
      className: "countryStats"
    }, /*#__PURE__*/React.createElement("p", null, "Accepted ", /*#__PURE__*/React.createElement("br", null), country.accepted.toLocaleString("de-DE"), "%  (", country.num.accept === null ? "0" : country.num.accept, ")"), /*#__PURE__*/React.createElement("p", null, "Declined ", /*#__PURE__*/React.createElement("br", null), country.declined.toLocaleString("de-DE"), "% (", country.num.decline === null ? "0" : country.num.decline, ")"), /*#__PURE__*/React.createElement("p", null, "Functional ", /*#__PURE__*/React.createElement("br", null), country.functional.toLocaleString("de-DE"), "% (", country.num.functional === null ? "0" : country.num.functional, ")"), /*#__PURE__*/React.createElement("p", null, "Marketing ", /*#__PURE__*/React.createElement("br", null), country.marketing.toLocaleString("de-DE"), "% (", country.num.marketing === null ? "0" : country.num.marketing, ")"), /*#__PURE__*/React.createElement("p", null, "Statics ", /*#__PURE__*/React.createElement("br", null), country.statics.toLocaleString("de-DE"), "% (", country.num.statics === null ? "0" : country.num.statics, ")")));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "1000px"
    }
  }));
}

/***/ }),

/***/ "./src/Components/Header/Nav.js":
/*!**************************************!*\
  !*** ./src/Components/Header/Nav.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Nav)
/* harmony export */ });
/* harmony import */ var _header_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header.css */ "./src/Components/Header/header.css");
/* harmony import */ var _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Authentication/Auth */ "./src/Authentication/Auth.js");


const Link = window.ReactRouterDOM.Link;
const useLocation = window.ReactRouterDOM.useLocation;
function Nav() {
  const Expand = function () {
    document.querySelector(".sidebar").classList.toggle("expand");
    document.querySelector(".collapsed").classList.toggle("expand");
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "collapsed"
  }, /*#__PURE__*/React.createElement("button", {
    className: "expandBtn",
    onClick: () => Expand()
  }), /*#__PURE__*/React.createElement(Link, {
    className: "navItems" + (useLocation().pathname === "/dashboard" ? " --active" : ""),
    to: "/dashboard"
  }, /*#__PURE__*/React.createElement("i", {
    className: "dashboard-icons dashboard"
  }), " ", /*#__PURE__*/React.createElement("span", {
    className: "hiddenCollapsed"
  }, "Dashboard")), /*#__PURE__*/React.createElement(Link, {
    className: "navItems" + (useLocation().pathname === "/domains" ? " --active" : ""),
    to: "/domains"
  }, /*#__PURE__*/React.createElement("i", {
    className: "dashboard-icons domains"
  }), " ", /*#__PURE__*/React.createElement("span", {
    className: "hiddenCollapsed"
  }, "Domains")), /*#__PURE__*/React.createElement("section", {
    className: "navItems--bottom"
  }, /*#__PURE__*/React.createElement(Link, {
    className: "navItems" + (useLocation().pathname.indexOf("/settings") > -1 ? " --active" : ""),
    to: "/settings"
  }, /*#__PURE__*/React.createElement("i", {
    className: "dashboard-icons settings"
  }), " ", /*#__PURE__*/React.createElement("span", {
    className: "hiddenCollapsed"
  }, "Settings")), /*#__PURE__*/React.createElement("button", {
    className: "navLogout",
    onClick: () => _Authentication_Auth__WEBPACK_IMPORTED_MODULE_1__["default"].Logout()
  }, /*#__PURE__*/React.createElement("i", {
    className: "dashboard-icons logout"
  }), " ", /*#__PURE__*/React.createElement("span", {
    className: "hiddenCollapsed"
  }, "Logout"))))));
}

/***/ }),

/***/ "./src/Components/Header/header.js":
/*!*****************************************!*\
  !*** ./src/Components/Header/header.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Header)
/* harmony export */ });
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../App */ "./src/App.js");
/* harmony import */ var _header_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./header.css */ "./src/Components/Header/header.css");
/* harmony import */ var _logo_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logo.png */ "./src/Components/Header/logo.png");
/* harmony import */ var _Functions_fetch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Functions/fetch */ "./src/Functions/fetch.js");
/* harmony import */ var _Functions_FetchHook__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Functions/FetchHook */ "./src/Functions/FetchHook.js");
/* harmony import */ var _API_api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../API/api */ "./src/API/api.js");
/* harmony import */ var _Authentication_Auth__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Authentication/Auth */ "./src/Authentication/Auth.js");
/* harmony import */ var _SelectInput_Selector__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../SelectInput/Selector */ "./src/Components/SelectInput/Selector.js");
const {
  useState,
  useEffect,
  useRef,
  useContext
} = React;








const useHistory = window.ReactRouterDOM.useHistory;

const punycode = __webpack_require__(/*! punycode */ "./node_modules/punycode/punycode.es6.js");

function Header(props) {
  var _window$location$path, _JSON$parse, _JSON$parse$profile, _JSON$parse2, _JSON$parse2$profile, _JSON$parse2$profile$, _JSON$parse3, _JSON$parse3$profile, _JSON$parse3$profile$;

  const [Organisation, setOrganisation] = useContext(_App__WEBPACK_IMPORTED_MODULE_0__.OrganisationContext);
  const [currentDomain, setCurrentDomain] = useState(window.location.pathname.split("/")[1] === "view" ? decodeURI((_window$location$path = window.location.pathname.split("/")[2]) === null || _window$location$path === void 0 ? void 0 : _window$location$path.replace("%2E", ".")) : "all");
  const profileImage = (_JSON$parse = JSON.parse(localStorage.getItem("globals"))) === null || _JSON$parse === void 0 ? void 0 : (_JSON$parse$profile = _JSON$parse.profile) === null || _JSON$parse$profile === void 0 ? void 0 : _JSON$parse$profile.image;
  let domainList = null;
  const Name = ((_JSON$parse2 = JSON.parse(localStorage.getItem("globals"))) === null || _JSON$parse2 === void 0 ? void 0 : (_JSON$parse2$profile = _JSON$parse2.profile) === null || _JSON$parse2$profile === void 0 ? void 0 : (_JSON$parse2$profile$ = _JSON$parse2$profile.name) === null || _JSON$parse2$profile$ === void 0 ? void 0 : _JSON$parse2$profile$.first_name) + " " + ((_JSON$parse3 = JSON.parse(localStorage.getItem("globals"))) === null || _JSON$parse3 === void 0 ? void 0 : (_JSON$parse3$profile = _JSON$parse3.profile) === null || _JSON$parse3$profile === void 0 ? void 0 : (_JSON$parse3$profile$ = _JSON$parse3$profile.name) === null || _JSON$parse3$profile$ === void 0 ? void 0 : _JSON$parse3$profile$.last_name);
  const navigate = useHistory();
  const [data, setData] = useState(null);
  const [domains, setDomains] = useState(null);
  useEffect(() => {
    (0,_Functions_fetch__WEBPACK_IMPORTED_MODULE_3__["default"])(_API_api__WEBPACK_IMPORTED_MODULE_5__["default"].settings.getOrganisation.url, _API_api__WEBPACK_IMPORTED_MODULE_5__["default"].settings.getOrganisation.method, _API_api__WEBPACK_IMPORTED_MODULE_5__["default"].settings.getOrganisation.headers, JSON.stringify({
      organisationMember: _Authentication_Auth__WEBPACK_IMPORTED_MODULE_6__["default"].getUserId()
    })).then(data => {
      if (data === "Err_Login_Expired") {
        localStorage.removeItem("globals");
        navigate.push("/login");
        return;
      }

      if (JSON.parse(localStorage.getItem("globals")).organisation == null) {
        JSON.parse(localStorage.getItem("globals")).organisation = data;
      }

      setData(data);
    });
  }, []);
  (0,_Functions_fetch__WEBPACK_IMPORTED_MODULE_3__["default"])(_API_api__WEBPACK_IMPORTED_MODULE_5__["default"].gdpr.getDomains.url, _API_api__WEBPACK_IMPORTED_MODULE_5__["default"].gdpr.getDomains.method, _API_api__WEBPACK_IMPORTED_MODULE_5__["default"].gdpr.getDomains.headers).then(data => {
    if (data === "Err_Login_Expired") {
      localStorage.removeItem("globals");
      window.location.href = "/#login";
      return;
    }

    if (data.error === "Err_No_Domains") {
      if (window.location.href.indexOf("/add-domain") == -1) {
        window.location.href = "/add-domain";
      }
    } else {
      data.unshift({
        domain: "all",
        installed: null,
        lastedVisited: null
      });
      data === null || data === void 0 ? void 0 : data.map(d => {
        return punycode.toUnicode(d.domain);
      }).filter(d => {
        return d !== undefined && d !== "" && d !== "undefined.";
      });
      setDomains(data);
      const allowedDomains = data === null || data === void 0 ? void 0 : data.map(d => {
        return punycode.toUnicode(d.domain);
      }).filter(d => {
        return d !== undefined && d !== "" && d !== "undefined." && d !== "all";
      });
      localStorage.setItem("domains", JSON.stringify(allowedDomains));

      if (window.location.href.indexOf("/add-domain") > -1) {
        window.location.href = "/dashboard";
      }
    }
  });
  domainList = domains === null || domains === void 0 ? void 0 : domains.map(d => {
    return punycode.toUnicode(d.domain);
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "dashboard-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-profile"
  }, /*#__PURE__*/React.createElement("img", {
    className: "dashboard-logo",
    src: _logo_png__WEBPACK_IMPORTED_MODULE_2__["default"],
    alt: "Intastellar Solutions Logo"
  }), domains && currentDomain ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_SelectInput_Selector__WEBPACK_IMPORTED_MODULE_7__["default"], {
    defaultValue: currentDomain,
    onChange: e => {
      const domain = e;
      setCurrentDomain(domain);
      window.location.href = "/view/".concat(domain.replace('.', '%2E'));
    },
    items: domainList,
    title: "Choose one of your domains",
    style: {
      left: "0"
    }
  })) : null, /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, /*#__PURE__*/React.createElement("img", {
    src: profileImage,
    className: "content-img",
    onClick: () => setViewUserProfile(!viewUserProfile)
  }), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-profile__nameContainer"
  }, /*#__PURE__*/React.createElement("p", {
    className: "dashboard-name"
  }, Name), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-organisationContainer"
  }, data && Organisation ? /*#__PURE__*/React.createElement(_SelectInput_Selector__WEBPACK_IMPORTED_MODULE_7__["default"], {
    defaultValue: Organisation,
    onChange: e => {
      setOrganisation(e);
      localStorage.setItem("organisation", e);
      window.location.reload();
    },
    items: data,
    style: {
      right: "0"
    }
  }) : null))))));
}
{
  /* <select defaultValue={Organisation} onChange={(e) => { setOrganisation({ id: JSON.parse(e.target.value).id, name: JSON.parse(e.target.value).name }) }} className="dashboard-organisationSelector">
     {
         (!data) ? "" : data.map((d, key) => {
             d = JSON.parse(d);
             return (
                 <>
                     <option key={key} value={JSON.stringify({ id: d.id, name: d.name })}>{d.name}</option>
                 </>
             )
         })
     }
  </select> */
}

/***/ }),

/***/ "./src/Components/InputFields/EmailInput.js":
/*!**************************************************!*\
  !*** ./src/Components/InputFields/EmailInput.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Email)
/* harmony export */ });
/* harmony import */ var _Style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Style.css */ "./src/Components/InputFields/Style.css");

function Email(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    className: "intInput",
    autoComplete: "off",
    type: "email",
    onChange: props.onChange
  }));
}

/***/ }),

/***/ "./src/Components/InputFields/textInput.js":
/*!*************************************************!*\
  !*** ./src/Components/InputFields/textInput.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Text)
/* harmony export */ });
/* harmony import */ var _Style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Style.css */ "./src/Components/InputFields/Style.css");

function Text(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    className: "intInput",
    placeholder: props === null || props === void 0 ? void 0 : props.placeholder,
    autoComplete: "off",
    type: "text",
    onChange: props.onChange
  }));
}

/***/ }),

/***/ "./src/Components/NotAllowed/NotAllowed.js":
/*!*************************************************!*\
  !*** ./src/Components/NotAllowed/NotAllowed.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NotAllowed)
/* harmony export */ });
function NotAllowed() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement("h1", null, "Not allowed"), /*#__PURE__*/React.createElement("p", null, "You\xB4re not allowed to view this domain")));
}

/***/ }),

/***/ "./src/Components/SelectInput/Selector.js":
/*!************************************************!*\
  !*** ./src/Components/SelectInput/Selector.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Select)
/* harmony export */ });
/* harmony import */ var _Style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Style.css */ "./src/Components/SelectInput/Style.css");
const {
  useState,
  useEffect,
  useRef,
  useContext
} = React;

const useParams = window.ReactRouterDOM.useParams;
function Select(props) {
  var _props$items;

  const [isOpen, setIsOpen] = useState(false);

  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }

    return true;
  }

  function openMenu() {
    setIsOpen(!isOpen);
  }

  function clickOutSide(e) {
    if (e.target.className !== "dropdown-menu-button") {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", clickOutSide);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "selectorContianer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "selector"
  }, /*#__PURE__*/React.createElement("button", {
    className: "dropdown-menu-button",
    onClick: openMenu
  }, isJson(props.defaultValue) ? JSON.parse(props.defaultValue).name : props.defaultValue), isOpen ? /*#__PURE__*/React.createElement("div", {
    className: "dropdown-menu"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "dropdown-menu__content",
    style: props.style
  }, props === null || props === void 0 ? void 0 : (_props$items = props.items) === null || _props$items === void 0 ? void 0 : _props$items.map((item, key) => {
    if (isJson(item)) {
      item = JSON.parse(item);
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", {
        onClick: () => props.onChange(JSON.stringify({
          id: item.id,
          name: item.name
        })),
        key: item.id
      }, item.name));
    } else {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", {
        onClick: e => props.onChange(e.target.innerText),
        key: item,
        value: item
      }, item));
    }
  }))) : null)));
}

/***/ }),

/***/ "./src/Components/SuccessWindow/index.js":
/*!***********************************************!*\
  !*** ./src/Components/SuccessWindow/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SuccessWindow)
/* harmony export */ });
/* harmony import */ var _Style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Style.css */ "./src/Components/SuccessWindow/Style.css");

function SuccessWindow(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: props.style,
    className: "successWindow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "successWindow-content"
  }, props === null || props === void 0 ? void 0 : props.message)));
}

/***/ }),

/***/ "./src/Components/widget/Loading.js":
/*!******************************************!*\
  !*** ./src/Components/widget/Loading.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CurrentPageLoading": () => (/* binding */ CurrentPageLoading),
/* harmony export */   "Loading": () => (/* binding */ Loading)
/* harmony export */ });
/* harmony import */ var _Widget_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Widget.css */ "./src/Components/widget/Widget.css");
/* harmony import */ var _Loading_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Loading.css */ "./src/Components/widget/Loading.css");



function Loading() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "widget"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bigNumIsLoading"
  }), /*#__PURE__*/React.createElement("div", {
    className: "smallIsLoading"
  })));
}

function CurrentPageLoading() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bigNumIsLoading"
  }), /*#__PURE__*/React.createElement("div", {
    className: "smallIsLoading"
  })));
}



/***/ }),

/***/ "./src/Components/widget/TopWidgets.js":
/*!*********************************************!*\
  !*** ./src/Components/widget/TopWidgets.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TopWidgets)
/* harmony export */ });
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./widget */ "./src/Components/widget/widget.js");
/* harmony import */ var _Functions_FetchHook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Functions/FetchHook */ "./src/Functions/FetchHook.js");
/* harmony import */ var _Loading__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Loading */ "./src/Components/widget/Loading.js");



function TopWidgets(props) {
  const APIUrl = props.API.url;
  const APIMethod = props.API.method;
  const APIHeader = props.API.header;
  const [loading, data, error, updated] = (0,_Functions_FetchHook__WEBPACK_IMPORTED_MODULE_1__["default"])(30, APIUrl, APIMethod, APIHeader);

  if (data === "Err_Login_Expired") {
    localStorage.removeItem("globals");
    window.location.href = "/#login";
    return;
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "Updated: ", updated), /*#__PURE__*/React.createElement("div", {
    className: "grid-container grid-3"
  }, loading ? /*#__PURE__*/React.createElement(_Loading__WEBPACK_IMPORTED_MODULE_2__.Loading, null) : /*#__PURE__*/React.createElement(_widget__WEBPACK_IMPORTED_MODULE_0__["default"], {
    overviewTotal: true,
    totalNumber: data.Total.toLocaleString("de-DE"),
    type: "Website"
  }), loading ? /*#__PURE__*/React.createElement(_Loading__WEBPACK_IMPORTED_MODULE_2__.Loading, null) : /*#__PURE__*/React.createElement(_widget__WEBPACK_IMPORTED_MODULE_0__["default"], {
    totalNumber: data.JS.toLocaleString("de-DE") + "%",
    type: "JS"
  }), loading ? /*#__PURE__*/React.createElement(_Loading__WEBPACK_IMPORTED_MODULE_2__.Loading, null) : /*#__PURE__*/React.createElement(_widget__WEBPACK_IMPORTED_MODULE_0__["default"], {
    totalNumber: data.WP.toLocaleString("de-DE") + "%",
    type: "WordPress"
  })));
}

/***/ }),

/***/ "./src/Components/widget/widget.js":
/*!*****************************************!*\
  !*** ./src/Components/widget/widget.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Widget)
/* harmony export */ });
/* harmony import */ var _Widget_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Widget.css */ "./src/Components/widget/Widget.css");

function Widget(props) {
  const overViewTotal = props !== null && props !== void 0 && props.overviewTotal ? " overviewTotal" : " overviewDistribution";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "widget" + overViewTotal
  }, /*#__PURE__*/React.createElement("h2", {
    className: "overvieTotal-num"
  }, props === null || props === void 0 ? void 0 : props.totalNumber), /*#__PURE__*/React.createElement("p", null, props === null || props === void 0 ? void 0 : props.type)));
}

/***/ }),

/***/ "./src/Functions/FetchHook.js":
/*!************************************!*\
  !*** ./src/Functions/FetchHook.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useFetch)
/* harmony export */ });
const {
  useState,
  useEffect
} = React;
function useFetch(updateInterval, url, method, headers, body, handle) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [lastUpdated, setLastUpdated] = useState(Math.floor(Date.now() / 100));
  const [updated, setUpdated] = useState("");
  let id = undefined;
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(url, {
      method: method,
      headers,
      body,
      signal: controller.signal
    }).then(res => {
      if (res.status === 401) {
        return "Err_Login_Expired";
      } else if (res.status === 403) {
        return "Err_No_Access";
      } else if (res.status === 404 || res.status === 500 || res.status === 502 || res.status === 503 || res.status === 504) {
        return "Err_Server_Error";
      }

      return res.json();
    }).then(setData).catch(setError).finally(() => {
      setLoading(false);
      setUpdated("Now");
      setLastUpdated(Math.floor(Date.now() / 1000));
    });

    if (typeof updateInterval !== 'undefined') {
      const interval1 = setInterval(() => {
        if (Math.floor(Date.now() / 1000) - lastUpdated >= 60) {
          setUpdated(Math.floor((Math.floor(Date.now() / 1000) - lastUpdated) / 60) + " minute ago");
        }
      }, 1000);
      id = setInterval(() => {
        fetch(url, {
          method: method,
          headers,
          body,
          signal: controller.signal
        }).then(res => res.json()).then(setData).catch(setError).finally(() => {
          setLoading(false);
          clearInterval(interval1);
          setUpdated("Now");
          setLastUpdated(Math.floor(Date.now() / 1000));
        });
      }, updateInterval * 60 * 1000);
    }

    return () => {
      controller.abort();

      if (typeof updateInterval !== 'undefined') {
        clearInterval(id);
      }
    };
  }, [url, handle]);

  if (data == "Err_Login_Expired") {
    localStorage.removeItem("globals");
    window.location.href = "/login";
    return;
  }

  return [loading, data, error, updated, lastUpdated, setUpdated];
}

/***/ }),

/***/ "./src/Functions/fetch.js":
/*!********************************!*\
  !*** ./src/Functions/fetch.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Fetch = async (url, method, headers, body, signal) => {
  const t = fetch(url, {
    method: method,
    headers,
    body,
    signal
  }).then(res => {
    if (res.status === 401) {
      return "Err_Login_Expired";
    } else if (res.status === 403) {
      return "Err_No_Permission";
    } else if (res.status === 404) {
      return "Err_Not_Found";
    } else if (res.status === 500) {
      return "Err_Server_Error";
    }

    return res.json();
  });
  return t;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Fetch);

/***/ }),

/***/ "./src/Login/Login.js":
/*!****************************!*\
  !*** ./src/Login/Login.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Login)
/* harmony export */ });
/* harmony import */ var _Login_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Login.css */ "./src/Login/Login.css");
/* harmony import */ var _Components_Header_logo_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Components/Header/logo.png */ "./src/Components/Header/logo.png");
/* harmony import */ var _API_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../API/api */ "./src/API/api.js");
/* harmony import */ var _Authentication_Auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Authentication/Auth */ "./src/Authentication/Auth.js");




function Login() {
  document.title = "Login | Intastellar Analytics";
  document.body.style.overflow = "hidden";
  document.body.style.height = "100vh";
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [isLoading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const type = "";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "loginForm-container"
  }, /*#__PURE__*/React.createElement("form", {
    className: "loginForm",
    onSubmit: e => {
      e.preventDefault(), _Authentication_Auth__WEBPACK_IMPORTED_MODULE_3__["default"].Login(_API_api__WEBPACK_IMPORTED_MODULE_2__["default"].Login.url, email, password, type, setErrorMessage, setLoading);
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "loginForm-logo",
    src: _Components_Header_logo_png__WEBPACK_IMPORTED_MODULE_1__["default"],
    alt: "Intastellar Solutions Logo"
  }), /*#__PURE__*/React.createElement("h1", {
    className: "loginForm-title"
  }, "Signin to Intastellar Analytics"), /*#__PURE__*/React.createElement("label", null, errorMessage != null ? errorMessage : null), /*#__PURE__*/React.createElement("label", null, "Email:"), /*#__PURE__*/React.createElement("input", {
    className: "loginForm-inputField",
    type: "email",
    placeholder: "email",
    onChange: e => {
      setEmail(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("label", null, "Password:"), /*#__PURE__*/React.createElement("input", {
    className: "loginForm-inputField",
    type: "password",
    placeholder: "password",
    onChange: e => {
      setPassword(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "loginForm-inputField --btn",
    type: "submit"
  }, isLoading ? "We are loggin you in..." : "SIGNIN"))));
}

/***/ }),

/***/ "./src/Login/LoginOverlay.js":
/*!***********************************!*\
  !*** ./src/Login/LoginOverlay.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LoginOverLay)
/* harmony export */ });
/* harmony import */ var _Login_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Login.css */ "./src/Login/Login.css");
/* harmony import */ var _Components_Header_logo_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Components/Header/logo.png */ "./src/Components/Header/logo.png");
/* harmony import */ var _API_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../API/api */ "./src/API/api.js");
/* harmony import */ var _Authentication_Auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Authentication/Auth */ "./src/Authentication/Auth.js");




function LoginOverLay() {
  var _JSON$parse, _JSON$parse2;

  document.title = "Login | Intastellar Analytics";
  document.body.style.overflow = "hidden";
  document.body.style.height = "100vh";
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [isLoading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  if (((_JSON$parse = JSON.parse(localStorage.getItem("globals"))) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.token) !== undefined || (_JSON$parse2 = JSON.parse(localStorage.getItem("globals"))) !== null && _JSON$parse2 !== void 0 && _JSON$parse2.status) {
    window.location.href = "/dashboard";
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "loginForm-overlay"
  }, /*#__PURE__*/React.createElement("form", {
    className: "loginForm",
    onSubmit: e => {
      e.preventDefault(), _Authentication_Auth__WEBPACK_IMPORTED_MODULE_3__["default"].Login(_API_api__WEBPACK_IMPORTED_MODULE_2__["default"].Login.url, email, password, setErrorMessage, setLoading);
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "loginForm-logo --hideMobile",
    src: _Components_Header_logo_png__WEBPACK_IMPORTED_MODULE_1__["default"],
    alt: "Intastellar Solutions Logo"
  }), /*#__PURE__*/React.createElement("h1", {
    className: "loginForm-title"
  }, "Signin"), /*#__PURE__*/React.createElement("label", null, errorMessage != null ? errorMessage : null), /*#__PURE__*/React.createElement("label", null, "Email:"), /*#__PURE__*/React.createElement("input", {
    className: "loginForm-inputField",
    type: "email",
    placeholder: "email",
    onChange: e => {
      setEmail(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("label", null, "Password:"), /*#__PURE__*/React.createElement("input", {
    className: "loginForm-inputField",
    type: "password",
    placeholder: "password",
    onChange: e => {
      setPassword(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "loginForm-inputField --btn",
    type: "submit"
  }, isLoading ? "We are loggin you in..." : "SIGNIN"))));
}

/***/ }),

/***/ "./src/Pages/Dashboard/Dashboard.js":
/*!******************************************!*\
  !*** ./src/Pages/Dashboard/Dashboard.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Dashboard)
/* harmony export */ });
/* harmony import */ var _Components_widget_TopWidgets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Components/widget/TopWidgets.js */ "./src/Components/widget/TopWidgets.js");
/* harmony import */ var _Functions_FetchHook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Functions/FetchHook */ "./src/Functions/FetchHook.js");
/* harmony import */ var _API_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../API/api */ "./src/API/api.js");
/* harmony import */ var _Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Components/widget/widget */ "./src/Components/widget/widget.js");
/* harmony import */ var _Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Components/widget/Loading */ "./src/Components/widget/Loading.js");
/* harmony import */ var _Components_AddDomain_AddDomain__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Components/AddDomain/AddDomain */ "./src/Components/AddDomain/AddDomain.js");
/* harmony import */ var _Style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Style.css */ "./src/Pages/Dashboard/Style.css");
/* harmony import */ var _Components_Charts_WorldMap_WorldMap_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../Components/Charts/WorldMap/WorldMap.js */ "./src/Components/Charts/WorldMap/WorldMap.js");
/* harmony import */ var _App_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../App.js */ "./src/App.js");
const {
  useState,
  useEffect,
  useRef,
  useContext
} = React;









function Dashboard(props) {
  document.title = "Dashboard | Intastellar Analytics";
  const [currentDomain, setCurrentDomain] = useContext(_App_js__WEBPACK_IMPORTED_MODULE_8__.DomainContext);
  const [organisation, setOrganisation] = useContext(_App_js__WEBPACK_IMPORTED_MODULE_8__.OrganisationContext);
  const dashboardView = props.dashboardView;
  let url = _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getInteractions.url;
  let method = _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getInteractions.method;
  let header = _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getInteractions.headers;

  if (dashboardView === "GDPR Cookiebanner") {
    _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getInteractions.headers.Domains = currentDomain;
    url = _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getInteractions.url;
    method = _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getInteractions.method;
    header = _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getInteractions.headers;
  }

  ;
  const [loading, data, error, getUpdated] = (0,_Functions_FetchHook__WEBPACK_IMPORTED_MODULE_1__["default"])(5, url, method, header);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement("h2", null, "Dashboard"), /*#__PURE__*/React.createElement("p", null, "Viewing all data for: ", organisation != null ? JSON.parse(organisation).name : null), dashboardView === "GDPR Cookiebanner" && organisation != null && JSON.parse(organisation).id == 1 ? /*#__PURE__*/React.createElement(_Components_widget_TopWidgets_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
    dashboardView: dashboardView,
    API: {
      url: _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getTotalNumber.url,
      method: _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getTotalNumber.method,
      header: _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getTotalNumber.headers
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    className: ""
  }, /*#__PURE__*/React.createElement("h2", null, "Data of user interaction"), /*#__PURE__*/React.createElement("p", null, "Updated: ", getUpdated), loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: data === null || data === void 0 ? void 0 : data.Total.toLocaleString("de-DE"),
    overviewTotal: true,
    type: "Total interactions"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid-container grid-3"
  }, loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: (data === null || data === void 0 ? void 0 : data.Accepted.toLocaleString("de-DE")) + "%",
    type: "Accepted cookies"
  }), loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: (data === null || data === void 0 ? void 0 : data.Declined.toLocaleString("de-DE")) + "%",
    type: "Declined cookies"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid-container grid-3"
  }, loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: (data === null || data === void 0 ? void 0 : data.Marketing.toLocaleString("de-DE")) + "%",
    type: "Accepted only Marketing"
  }), loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: (data === null || data === void 0 ? void 0 : data.Functional.toLocaleString("de-DE")) + "%",
    type: "Accepted only Functional"
  }), loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: (data === null || data === void 0 ? void 0 : data.Statics.toLocaleString("de-DE")) + "%",
    type: "Accepted only Statics"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", null, loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h3", null, "User interactions based on country"), /*#__PURE__*/React.createElement("p", null, "Updated: ", getUpdated), /*#__PURE__*/React.createElement(_Components_Charts_WorldMap_WorldMap_js__WEBPACK_IMPORTED_MODULE_7__["default"], {
    data: {
      Marketing: data === null || data === void 0 ? void 0 : data.Marketing.toLocaleString("de-DE"),
      Functional: data === null || data === void 0 ? void 0 : data.Functional.toLocaleString("de-DE"),
      Statistic: data === null || data === void 0 ? void 0 : data.Statics.toLocaleString("de-DE"),
      Accepted: data === null || data === void 0 ? void 0 : data.Accepted.toLocaleString("de-DE"),
      Declined: data === null || data === void 0 ? void 0 : data.Declined.toLocaleString("de-DE"),
      Countries: data === null || data === void 0 ? void 0 : data.Countries
    }
  }))))));
}

/***/ }),

/***/ "./src/Pages/Dashboard/DomainDashbord.js":
/*!***********************************************!*\
  !*** ./src/Pages/Dashboard/DomainDashbord.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DomainDashbord)
/* harmony export */ });
/* harmony import */ var _Functions_FetchHook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Functions/FetchHook */ "./src/Functions/FetchHook.js");
/* harmony import */ var _Functions_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Functions/fetch */ "./src/Functions/fetch.js");
/* harmony import */ var _API_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../API/api */ "./src/API/api.js");
/* harmony import */ var _Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Components/widget/widget */ "./src/Components/widget/widget.js");
/* harmony import */ var _Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Components/widget/Loading */ "./src/Components/widget/Loading.js");
/* harmony import */ var _Style_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Style.css */ "./src/Pages/Dashboard/Style.css");
/* harmony import */ var _Components_Charts_WorldMap_WorldMap_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Components/Charts/WorldMap/WorldMap.js */ "./src/Components/Charts/WorldMap/WorldMap.js");
/* harmony import */ var _App_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../App.js */ "./src/App.js");
/* harmony import */ var _Components_NotAllowed_NotAllowed__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../Components/NotAllowed/NotAllowed */ "./src/Components/NotAllowed/NotAllowed.js");
const {
  useState,
  useEffect,
  useRef,
  useContext
} = React;









const useParams = window.ReactRouterDOM.useParams;

const punycode = __webpack_require__(/*! punycode */ "./node_modules/punycode/punycode.es6.js");

function DomainDashbord(props) {
  var _localStorage, _localStorage$getItem;

  const {
    handle
  } = useParams();
  document.title = "".concat(punycode.toUnicode(handle), " Dashboard | Intastellar Analytics");
  _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getInteractions.headers.Domains = punycode.toASCII(handle);
  const [loading, data, error, updated] = (0,_Functions_FetchHook__WEBPACK_IMPORTED_MODULE_0__["default"])(5, _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getInteractions.url, _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getInteractions.method, _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].gdpr.getInteractions.headers, null, handle);
  return (_localStorage = localStorage) !== null && _localStorage !== void 0 && (_localStorage$getItem = _localStorage.getItem("domains")) !== null && _localStorage$getItem !== void 0 && _localStorage$getItem.includes(punycode.toUnicode(handle)) || handle == "all" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement("h1", null, "Dashboard"), /*#__PURE__*/React.createElement("p", null, "You\xB4re currently viewing the data for:"), /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    className: "activeDomain",
    href: "https://".concat(handle),
    target: "_blank"
  }, punycode.toUnicode(handle))), loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : data.Total === 0 ? /*#__PURE__*/React.createElement("h1", null, "No interactions yet") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: data.Total.toLocaleString("de-DE"),
    overviewTotal: true,
    type: "Total interactions"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid-container grid-3"
  }, loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: (data === null || data === void 0 ? void 0 : data.Accepted.toLocaleString("de-DE")) + "%",
    type: "Accepted cookies"
  }), loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: (data === null || data === void 0 ? void 0 : data.Declined.toLocaleString("de-DE")) + "%",
    type: "Declined cookies"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid-container grid-3"
  }, loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: (data === null || data === void 0 ? void 0 : data.Marketing.toLocaleString("de-DE")) + "%",
    type: "Accepted only Marketing"
  }), loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: (data === null || data === void 0 ? void 0 : data.Functional.toLocaleString("de-DE")) + "%",
    type: "Accepted only Functional"
  }), loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : /*#__PURE__*/React.createElement(_Components_widget_widget__WEBPACK_IMPORTED_MODULE_3__["default"], {
    totalNumber: (data === null || data === void 0 ? void 0 : data.Statics.toLocaleString("de-DE")) + "%",
    type: "Accepted only Statics"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid-container grid-3"
  }, /*#__PURE__*/React.createElement("section", null, loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : data.Total === 0 ? null : /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h3", null, "User interactions based on country"), /*#__PURE__*/React.createElement("p", null, "Updated: ", updated), /*#__PURE__*/React.createElement(_Components_Charts_WorldMap_WorldMap_js__WEBPACK_IMPORTED_MODULE_6__["default"], {
    data: {
      Marketing: data.Marketing.toLocaleString("de-DE"),
      Functional: data.Functional.toLocaleString("de-DE"),
      Statistic: data.Statics.toLocaleString("de-DE"),
      Accepted: data.Accepted.toLocaleString("de-DE"),
      Declined: data.Declined.toLocaleString("de-DE"),
      Countries: data.Countries
    }
  })))))) : loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.CurrentPageLoading, null) : /*#__PURE__*/React.createElement(_Components_NotAllowed_NotAllowed__WEBPACK_IMPORTED_MODULE_8__["default"], null);
}

/***/ }),

/***/ "./src/Pages/Domains/index.js":
/*!************************************!*\
  !*** ./src/Pages/Domains/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Websites)
/* harmony export */ });
/* harmony import */ var _Functions_FetchHook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Functions/FetchHook */ "./src/Functions/FetchHook.js");
/* harmony import */ var _API_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../API/api */ "./src/API/api.js");
/* harmony import */ var _Components_widget_Loading__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Components/widget/Loading */ "./src/Components/widget/Loading.js");



const {
  useState,
  useEffect,
  useRef
} = React;

const punycode = __webpack_require__(/*! punycode */ "./node_modules/punycode/punycode.es6.js");

function Websites() {
  const [loading, data, error] = (0,_Functions_FetchHook__WEBPACK_IMPORTED_MODULE_0__["default"])(10, _API_api__WEBPACK_IMPORTED_MODULE_1__["default"].gdpr.getDomains.url, _API_api__WEBPACK_IMPORTED_MODULE_1__["default"].gdpr.getDomains.method, _API_api__WEBPACK_IMPORTED_MODULE_1__["default"].gdpr.getDomains.headers);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("main", {
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement("h2", null, "Analytics"), /*#__PURE__*/React.createElement("h3", null, "List of all domains"), /*#__PURE__*/React.createElement("p", null, "On all these domains the GDPR cookiebanner is implemented"), /*#__PURE__*/React.createElement("section", {
    className: "grid-container grid-3"
  }, loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_2__.Loading, null) : data === null || data === void 0 ? void 0 : data.map((domain, key) => {
    const main = domain["domain"];
    const timestamp = domain[1];
    const installed = domain["installed"];
    const lastVisited = domain["lastedVisited"];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      key: key,
      className: "link widget",
      href: "http://" + main,
      target: "_blank",
      rel: "noopener nofollow noreferer"
    }, punycode.toUnicode(main), " ", /*#__PURE__*/React.createElement("br", null), "Last visited: ", lastVisited, " ", /*#__PURE__*/React.createElement("br", null), "Installed: ", installed));
  }))));
}

/***/ }),

/***/ "./src/Pages/Settings/AddUser/index.js":
/*!*********************************************!*\
  !*** ./src/Pages/Settings/AddUser/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AddUser)
/* harmony export */ });
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../App */ "./src/App.js");
/* harmony import */ var _Functions_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../Functions/fetch */ "./src/Functions/fetch.js");
/* harmony import */ var _API_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../API/api */ "./src/API/api.js");
/* harmony import */ var _Components_InputFields_textInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../Components/InputFields/textInput */ "./src/Components/InputFields/textInput.js");
/* harmony import */ var _Components_InputFields_EmailInput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../Components/InputFields/EmailInput */ "./src/Components/InputFields/EmailInput.js");
/* harmony import */ var _Components_SuccessWindow__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../Components/SuccessWindow */ "./src/Components/SuccessWindow/index.js");






const Link = window.ReactRouterDOM.Link;
const {
  useState,
  useEffect,
  useRef,
  useContext
} = React;
function AddUser() {
  document.title = "Add User to an Organisation | Intastellar Analytics";
  const [Organisation, setOrganisation] = useContext(_App__WEBPACK_IMPORTED_MODULE_0__.OrganisationContext);
  const [userMail, setUserMail] = useState("");
  const [userRole, setUserRole] = useState("Admin");
  const [userName, setUserName] = useState("");
  const [status, setStatus] = useState(null);
  const [organisationId, setOrganisationId] = useState(null);
  const [style, setStyle] = useState({
    right: "-100%"
  });

  const addUser = e => {
    e.preventDefault();
    setStatus("Loading...");
    (0,_Functions_fetch__WEBPACK_IMPORTED_MODULE_1__["default"])(_API_api__WEBPACK_IMPORTED_MODULE_2__["default"].settings.addUser.url, _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].settings.addUser.method, _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].settings.addUser.headers, JSON.stringify({
      organisationId: organisationId,
      userEmail: userMail,
      userRole: userRole
    })).then(re => {
      setStatus(null);

      if (re == "ERROR_ADDING_USER" || re === "Err_Token_Not_Found") {
        setStatus("We couldn\xB4t add the user");
        setStyle({
          right: "0",
          borderColor: "red"
        });
      } else {
        setStatus("User ".concat(userName, " added to ").concat(Organisation === null || Organisation === void 0 ? void 0 : Organisation.name));
        setStyle({
          right: "0"
        });
      }

      setTimeout(() => {
        setStyle({
          right: "-100%",
          borderColor: "red"
        });
      }, 6000);
    });
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("main", {
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement("h1", null, "Add user for ", Organisation === null || Organisation === void 0 ? void 0 : Organisation.name), /*#__PURE__*/React.createElement(Link, {
    className: "backLink",
    to: "/settings"
  }, "Back to settings"), /*#__PURE__*/React.createElement(_Components_SuccessWindow__WEBPACK_IMPORTED_MODULE_5__["default"], {
    style: style,
    message: status
  }), /*#__PURE__*/React.createElement("form", {
    onSubmit: addUser
  }, /*#__PURE__*/React.createElement("label", {
    for: "name"
  }, "Name"), /*#__PURE__*/React.createElement(_Components_InputFields_textInput__WEBPACK_IMPORTED_MODULE_3__["default"], {
    onChange: e => setUserName(e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    for: "email"
  }, "Email"), /*#__PURE__*/React.createElement(_Components_InputFields_EmailInput__WEBPACK_IMPORTED_MODULE_4__["default"], {
    onChange: e => setUserMail(e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    for: "role"
  }, "Role"), /*#__PURE__*/React.createElement("select", {
    id: "role",
    name: "role",
    onChange: e => setUserRole(e.target.value)
  }, /*#__PURE__*/React.createElement("option", null, "Admin"), /*#__PURE__*/React.createElement("option", null, "Manager")), /*#__PURE__*/React.createElement("label", {
    for: "organisation"
  }, "Organisation"), /*#__PURE__*/React.createElement("select", {
    id: "organisation",
    name: "organisation",
    onChange: e => setOrganisationId(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: Organisation === null || Organisation === void 0 ? void 0 : Organisation.id
  }, Organisation === null || Organisation === void 0 ? void 0 : Organisation.name)), /*#__PURE__*/React.createElement("button", null, "Add user"))));
}

/***/ }),

/***/ "./src/Pages/Settings/CreateOrganisation/index.js":
/*!********************************************************!*\
  !*** ./src/Pages/Settings/CreateOrganisation/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AddUser)
/* harmony export */ });
/* harmony import */ var _Functions_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../Functions/fetch */ "./src/Functions/fetch.js");
/* harmony import */ var _Components_InputFields_textInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../Components/InputFields/textInput */ "./src/Components/InputFields/textInput.js");
/* harmony import */ var _Components_InputFields_EmailInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../Components/InputFields/EmailInput */ "./src/Components/InputFields/EmailInput.js");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../App */ "./src/App.js");
/* harmony import */ var _API_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../API/api */ "./src/API/api.js");





const {
  useState,
  useEffect,
  useRef,
  useContext
} = React;
const Link = window.ReactRouterDOM.Link;
function AddUser() {
  document.title = "Create a new Organisation | Intastellar Analytics";
  const [organisationName, setOrganisationName] = useState("");
  const [organisationAdmin, setOrganisationAdmin] = useState("");
  const [status, setStatus] = useState(null);

  const create = e => {
    e.preventDefault();
    setStatus("Loading...");
    (0,_Functions_fetch__WEBPACK_IMPORTED_MODULE_0__["default"])(_API_api__WEBPACK_IMPORTED_MODULE_4__["default"].settings.createOrganisation.url, _API_api__WEBPACK_IMPORTED_MODULE_4__["default"].settings.createOrganisation.method, _API_api__WEBPACK_IMPORTED_MODULE_4__["default"].settings.createOrganisation.headers, JSON.stringify({
      organisationName: organisationName,
      organisationMember: organisationAdmin
    })).then(re => {
      setStatus(null);
      if (re == "ERROR_CREATING_ORGANISATION" || re === "Err_Token_Not_Found") return;
      setStatus("Organisation Created with the name: ".concat(organisationName));
    });
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("main", {
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement("h1", null, "Create a Organisation"), /*#__PURE__*/React.createElement(Link, {
    className: "backLink",
    to: "/settings"
  }, "Back to settings"), /*#__PURE__*/React.createElement("form", {
    onSubmit: create
  }, /*#__PURE__*/React.createElement("p", null, status != null ? status : null), /*#__PURE__*/React.createElement("label", {
    for: "orgName"
  }, "Organisation Name"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_Components_InputFields_textInput__WEBPACK_IMPORTED_MODULE_1__["default"], {
    onChange: e => setOrganisationName(e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    for: "MemberName"
  }, "Admin Email"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_Components_InputFields_EmailInput__WEBPACK_IMPORTED_MODULE_2__["default"], {
    onChange: e => setOrganisationAdmin(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, "Create Organisation"))));
}

/***/ }),

/***/ "./src/Pages/Settings/ViewOrganisations/index.js":
/*!*******************************************************!*\
  !*** ./src/Pages/Settings/ViewOrganisations/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ViewOrg)
/* harmony export */ });
/* harmony import */ var _Functions_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../Functions/fetch */ "./src/Functions/fetch.js");
/* harmony import */ var _Functions_FetchHook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../Functions/FetchHook */ "./src/Functions/FetchHook.js");
/* harmony import */ var _API_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../API/api */ "./src/API/api.js");
/* harmony import */ var _Authentication_Auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../Authentication/Auth */ "./src/Authentication/Auth.js");
/* harmony import */ var _Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../Components/widget/Loading */ "./src/Components/widget/Loading.js");





const {
  useState,
  useEffect,
  useRef
} = React;
const Link = window.ReactRouterDOM.Link;
function ViewOrg() {
  document.title = "My Organisation | Intastellar Analytics";
  const [loading, data, error, updated] = (0,_Functions_FetchHook__WEBPACK_IMPORTED_MODULE_1__["default"])(1, _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].settings.getOrganisation.url, _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].settings.getOrganisation.method, _API_api__WEBPACK_IMPORTED_MODULE_2__["default"].settings.getOrganisation.headers, JSON.stringify({
    organisationMember: _Authentication_Auth__WEBPACK_IMPORTED_MODULE_3__["default"].getUserId()
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("main", {
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement("h1", null, "My Organisation"), /*#__PURE__*/React.createElement(Link, {
    className: "backLink",
    to: "/settings"
  }, "Back to settings"), loading ? /*#__PURE__*/React.createElement(_Components_widget_Loading__WEBPACK_IMPORTED_MODULE_4__.Loading, null) : data.map((d, key) => {
    d = JSON.parse(d);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      key: key,
      className: "widget"
    }, d.name));
  })));
}

/***/ }),

/***/ "./src/Pages/Settings/index.js":
/*!*************************************!*\
  !*** ./src/Pages/Settings/index.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var _Style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Style.css */ "./src/Pages/Settings/Style.css");

const {
  useState,
  useEffect,
  useRef
} = React;
const Link = window.ReactRouterDOM.Link;
function Settings(props) {
  document.title = "Settings | Intastellar Analytics";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("main", {
    className: "dashboard-content"
  }, /*#__PURE__*/React.createElement("h1", null, "Settings"), /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement(Link, {
    className: "settingsNavItem",
    to: "/settings/add-user"
  }, "Add user"), /*#__PURE__*/React.createElement(Link, {
    className: "settingsNavItem",
    to: "/settings/create-organisation"
  }, "Create Organisation"), /*#__PURE__*/React.createElement(Link, {
    className: "settingsNavItem",
    to: "/settings/view-organisations"
  }, "View Organisations"))));
}

/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/App.css":
/*!************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/App.css ***!
  \************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap);"]);
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Questrial&display=swap);"]);
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Cinzel&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "*{\n    box-sizing: border-box;\n}\n\nbody{\n    background-color: rgb(36, 36, 36);\n    color: rgb(197, 197, 197);\n    font-family: \"Questrial\", Arial, Helvetica, sans-serif;\n    margin: 0;\n}\n\n.grid-container{\n    display: grid;\n}\n\n.overvieTotal-num {\n    font-size: 2.7em;\n    margin: 0px;\n    margin-block-start: 1em;\n    color: rgb(239, 239, 239);\n}\n\n.main-grid {\n    display: grid;\n    grid-template-columns: minmax(min-content, 150px) 1fr;\n    \n    scroll-padding-top: 88px;\n    padding-top: 88px;\n}\n\n.link{\n    color: rgb(207, 207, 207);\n    display: block;\n    padding: 15px;\n    text-decoration: none;\n    text-align: left;\n}\n\n.backLink{\n    text-decoration: none;\n    color: #fff;\n    padding: 15px 0px;\n    margin: 10px 0px;\n    display: block;\n    position: relative;\n    display: inline-flex;\n}\n\n.backLink::before{\n    content: \"\";\n    width: 10px;\n    height: 10px;\n    margin-right: 10px;\n    display: block;\n    border-top: 1px solid;\n    border-left: 1px solid;\n    transform: rotate(-45deg);\n}\n\n@media screen and (min-width: 320px) and (max-width: 900px) {\n    .main-grid{\n        display: block;\n    }\n}", "",{"version":3,"sources":["webpack://./src/App.css"],"names":[],"mappings":"AAIA;IACI,sBAAsB;AAC1B;;AAEA;IACI,iCAAiC;IACjC,yBAAyB;IACzB,sDAAsD;IACtD,SAAS;AACb;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,gBAAgB;IAChB,WAAW;IACX,uBAAuB;IACvB,yBAAyB;AAC7B;;AAEA;IACI,aAAa;IACb,qDAAqD;;IAErD,wBAAwB;IACxB,iBAAiB;AACrB;;AAEA;IACI,yBAAyB;IACzB,cAAc;IACd,aAAa;IACb,qBAAqB;IACrB,gBAAgB;AACpB;;AAEA;IACI,qBAAqB;IACrB,WAAW;IACX,iBAAiB;IACjB,gBAAgB;IAChB,cAAc;IACd,kBAAkB;IAClB,oBAAoB;AACxB;;AAEA;IACI,WAAW;IACX,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,cAAc;IACd,qBAAqB;IACrB,sBAAsB;IACtB,yBAAyB;AAC7B;;AAEA;IACI;QACI,cAAc;IAClB;AACJ","sourcesContent":["@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');\n@import url(\"https://fonts.googleapis.com/css2?family=Questrial&display=swap\");\n@import url(\"https://fonts.googleapis.com/css2?family=Cinzel&display=swap\");\n\n*{\n    box-sizing: border-box;\n}\n\nbody{\n    background-color: rgb(36, 36, 36);\n    color: rgb(197, 197, 197);\n    font-family: \"Questrial\", Arial, Helvetica, sans-serif;\n    margin: 0;\n}\n\n.grid-container{\n    display: grid;\n}\n\n.overvieTotal-num {\n    font-size: 2.7em;\n    margin: 0px;\n    margin-block-start: 1em;\n    color: rgb(239, 239, 239);\n}\n\n.main-grid {\n    display: grid;\n    grid-template-columns: minmax(min-content, 150px) 1fr;\n    \n    scroll-padding-top: 88px;\n    padding-top: 88px;\n}\n\n.link{\n    color: rgb(207, 207, 207);\n    display: block;\n    padding: 15px;\n    text-decoration: none;\n    text-align: left;\n}\n\n.backLink{\n    text-decoration: none;\n    color: #fff;\n    padding: 15px 0px;\n    margin: 10px 0px;\n    display: block;\n    position: relative;\n    display: inline-flex;\n}\n\n.backLink::before{\n    content: \"\";\n    width: 10px;\n    height: 10px;\n    margin-right: 10px;\n    display: block;\n    border-top: 1px solid;\n    border-left: 1px solid;\n    transform: rotate(-45deg);\n}\n\n@media screen and (min-width: 320px) and (max-width: 900px) {\n    .main-grid{\n        display: block;\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/Components/Charts/WorldMap/Countries.module.css":
/*!****************************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/Components/Charts/WorldMap/Countries.module.css ***!
  \****************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".xLdyFHzE6CuHlEdvImZO{\n\n}\n\n.FxrihR0xL5hGV8RWkwDF{\n\n}\n\n._INYMlkt9xsLfAOTHrKM{\n\n}\n.qNjCoveYSMjtKLaLpPA5{\n\n}\n.zQPx73Hi4hec9DTaKl5m{\n\n}\n\n.mBly0YRXb8neUzYn870K{\n\n}\n\n.Wotz_v5eZcg5V4UQO40V{\n\n}\n\n.qKQ2XlzsQzoEmIbTkdZI{\n\n}\n\n.GcgeHt3YqTfMLvuvXuPX{\n\n}\n.Ngp5fbkAxcYejEo_p_my{\n\n}\n\n.lJ7YWV3tmFvh5qkZpXtj{\n\n}\n\n.BPs_IQYlfypdpV0X0839{\n    fill: \"blue\";\n}\n\n.CRA8UxoKAioNlK_l6rnY{\n\n}\n\n.HKoWVr4diw20sU64SXLs{\n\n}\n\n\n.dcPxMl_5otj6lpmR96R8{\n\n}\n\n.K8bV65hiYdhs1W5naTWF{\n\n}\n\n.QdXxdU1fkTlMDBfOM1yU{\n\n}\n\n.TTez5TtDuELmXdyK7tvi{\n\n}\n\n.EMXEOnGoWbd7fc7Hoyv6{\n\n}\n\n.XpYs62Wa9pOYWQVyozz1{\n\n}\n\n.hPB3zLPUfgWfypCRZG8N{\n\n}\n\n.BneLNGShnfXx1PCjL3cN{\n\n}\n\n.cZZuYKV9buTIUEul9jia{\n\n}\n\n.W6SBo6pJ2ycQAl_3XAO2{\n\n}\n\n.TFvHKPaReb9_VE5dNlvS{\n    \n}\n\n.fTG87SrpZ7kY5C_eNqvu{\n\n}", "",{"version":3,"sources":["webpack://./src/Components/Charts/WorldMap/Countries.module.css"],"names":[],"mappings":"AAAA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;AACA;;AAEA;AACA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;AACA;;AAEA;;AAEA;;AAEA;;AAEA;IACI,YAAY;AAChB;;AAEA;;AAEA;;AAEA;;AAEA;;;AAGA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA;;AAEA","sourcesContent":[".Angola{\n\n}\n\n.Argentina{\n\n}\n\n.Australia{\n\n}\n.Azerbaijan{\n\n}\n.AmericaSamoa{\n\n}\n\n.AntiguaandBarbuda{\n\n}\n\n.Bahamas{\n\n}\n\n.Comoros{\n\n}\n\n.Canada{\n\n}\n.China{\n\n}\n\n.Chile{\n\n}\n\n.Denmark{\n    fill: \"blue\";\n}\n\n.France{\n\n}\n\n.Greece{\n\n}\n\n\n.Italy{\n\n}\n\n.Japan{\n\n}\n\n.Malaysia{\n\n}\n\n.Norway{\n\n}\n\n.NewZealand{\n\n}\n\n.UK{\n\n}\n\n.USA{\n\n}\n\n.Oman{\n\n}\n\n.Philippines{\n\n}\n\n.PapuaNewGuinea{\n\n}\n\n.Russia{\n    \n}\n\n.Turkey{\n\n}"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"Angola": "xLdyFHzE6CuHlEdvImZO",
	"Argentina": "FxrihR0xL5hGV8RWkwDF",
	"Australia": "_INYMlkt9xsLfAOTHrKM",
	"Azerbaijan": "qNjCoveYSMjtKLaLpPA5",
	"AmericaSamoa": "zQPx73Hi4hec9DTaKl5m",
	"AntiguaandBarbuda": "mBly0YRXb8neUzYn870K",
	"Bahamas": "Wotz_v5eZcg5V4UQO40V",
	"Comoros": "qKQ2XlzsQzoEmIbTkdZI",
	"Canada": "GcgeHt3YqTfMLvuvXuPX",
	"China": "Ngp5fbkAxcYejEo_p_my",
	"Chile": "lJ7YWV3tmFvh5qkZpXtj",
	"Denmark": "BPs_IQYlfypdpV0X0839",
	"France": "CRA8UxoKAioNlK_l6rnY",
	"Greece": "HKoWVr4diw20sU64SXLs",
	"Italy": "dcPxMl_5otj6lpmR96R8",
	"Japan": "K8bV65hiYdhs1W5naTWF",
	"Malaysia": "QdXxdU1fkTlMDBfOM1yU",
	"Norway": "TTez5TtDuELmXdyK7tvi",
	"NewZealand": "EMXEOnGoWbd7fc7Hoyv6",
	"UK": "XpYs62Wa9pOYWQVyozz1",
	"USA": "hPB3zLPUfgWfypCRZG8N",
	"Oman": "BneLNGShnfXx1PCjL3cN",
	"Philippines": "cZZuYKV9buTIUEul9jia",
	"PapuaNewGuinea": "W6SBo6pJ2ycQAl_3XAO2",
	"Russia": "TFvHKPaReb9_VE5dNlvS",
	"Turkey": "fTG87SrpZ7kY5C_eNqvu"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/Components/Charts/WorldMap/Style.css":
/*!*****************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/Components/Charts/WorldMap/Style.css ***!
  \*****************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".map-selected {\n    fill: #E3DA37;\n}\n  \n.map-unselected {\n    fill: #699EAA;\n}\n\n.map-selected:hover, .map-unselected:hover {\n    cursor: pointer;\n}\n\n.countryStats{\n    padding: 15px;\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));\n    text-align: center;\n}\n\n.country{\n    padding: 20px 0px;\n    background-color: #343434;\n    border-radius: 10px;\n}", "",{"version":3,"sources":["webpack://./src/Components/Charts/WorldMap/Style.css"],"names":[],"mappings":"AAAA;IACI,aAAa;AACjB;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,aAAa;IACb,aAAa;IACb,yDAAyD;IACzD,kBAAkB;AACtB;;AAEA;IACI,iBAAiB;IACjB,yBAAyB;IACzB,mBAAmB;AACvB","sourcesContent":[".map-selected {\n    fill: #E3DA37;\n}\n  \n.map-unselected {\n    fill: #699EAA;\n}\n\n.map-selected:hover, .map-unselected:hover {\n    cursor: pointer;\n}\n\n.countryStats{\n    padding: 15px;\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));\n    text-align: center;\n}\n\n.country{\n    padding: 20px 0px;\n    background-color: #343434;\n    border-radius: 10px;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/Components/Header/header.css":
/*!*********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/Components/Header/header.css ***!
  \*********************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/getUrl.js */ "../node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! icons/dashboard.svg */ "./src/Components/Header/icons/dashboard.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! icons/domain.svg */ "./src/Components/Header/icons/domain.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! icons/settings.svg */ "./src/Components/Header/icons/settings.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! icons/Logout.svg */ "./src/Components/Header/icons/Logout.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(/*! icons/expand.svg */ "./src/Components/Header/icons/expand.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".dashboard-header {\n    width: 100%;\n    max-height: 88px;\n    position: fixed;\n    top: 0;\n    left: 0;\n    z-index: 100;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 0px 25px 0px 0px;\n    background-color: rgb(63, 63, 63);\n    color: rgb(197, 197, 197);\n}\n\n.dashboard-profile {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    width: 100%;\n}\n\n.flex{\n    display: flex;\n    align-items: center;\n}\n\n.clock {\n    color: rgb(197, 197, 197);\n    margin: 0;\n}\n\n.dashboard-name {\n    font-size: 14px;\n    cursor: pointer;\n    margin: 0;\n}\n\n.dashboard-header>.dashboard-profile .content-img {\n    margin: 0;\n    width: 30px;\n    height: 30px;\n    border-width: 2.5px;\n    border-color: var(--intastellarGold);\n    border-radius: 50%;\n    object-fit: cover;\n    margin: auto;\n    box-shadow: 0 0 9px rgba(0, 0, 0, 0.14), 0 2px 1px rgba(0, 0, 0, 0.28);\n}\n\n.dashboard-logo {\n    filter: invert(100);\n    margin-right: 10px;\n    padding: 32px;\n    height: 88px;\n    text-align: left;\n    object-fit: contain;\n    object-position: 0;\n    position: relative;\n}\n\n.sidebar{\n    background: rgb(63, 63, 63);\n    transition: width .5s ease-in-out;\n    width: 65px;\n    min-height: 100vh;\n    position: fixed;\n}\n\n.collapsed {\n    width: auto;\n    height: calc(100vh - 88px);\n    \n    transition: width .5s ease-in-out;\n    display: flex;\n    flex-direction: column;\n}\n\n.collapsed .hiddenCollapsed{\n    opacity: 0;\n    width: 0;\n    visibility: hidden;\n    transform: all 1s ease-in-out;\n}\n\n.sidebar:hover, .sidebar:hover>.collapsed, .sidebar.expand,.collapsed.expand {\n    width: max-content;\n}\n\n.collapsed nav {\n    width: 100%;\n}\n\n.collapsed .navItems {\n    color: #fff;\n    display: flex;\n    width: 100%;\n    padding: 15px;\n    margin: 10px auto;\n    overflow: hidden;\n    align-items: center;\n    white-space: nowrap;\n    transition: width .5s ease-in-out;\n    text-decoration: none;\n}\n\n.navItems.--active{\n    background-color: rgb(95, 95, 95);\n    color: rgb(241, 241, 241);\n    transition: width .5s ease-in-out;\n}\n\n.collapsed:hover .navItems, .collapsed.expand a{\n    width: 100%;\n}\n\n.collapsed:hover nav, .collapsed.expand nav{\n    width: 150px;\n}\n\n.collapsed.expand .hiddenCollapsed, .collapsed:hover .hiddenCollapsed{\n    opacity: 1;\n    width: auto;\n    visibility: visible;\n}\n\n.dashboard-icons{\n    width: 25px;\n    height: 25px;\n    /* padding: 15px; */\n    margin-right: 10px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n.dashboard::after{\n    content: \"\";\n    background:  url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-blend-mode: lighten;\n    font-style: normal;\n    font-size: 20px;\n\n    display: block;\n    font-style: normal;\n    width: 20px;\n    height: 20px;\n}\n\n.domains::after{\n    content: \"\";\n    background:  url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-blend-mode: lighten;\n    display: block;\n    font-style: normal;\n    font-size: 20px;\n    width: 20px;\n    height: 20px;\n}\n\n.settings::after{\n    content: \"\";\n    background:  url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ");\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-blend-mode: lighten;\n    display: block;\n    font-style: normal;\n    font-size: 20px;\n    width: 20px;\n    height: 20px;\n}\n\n.logout::after{\n    content: \"\";\n    background:  url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ");\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-blend-mode: lighten;\n    display: block;\n    font-style: normal;\n    font-size: 20px;\n    width: 20px;\n    height: 20px;\n}\n\n.expandBtn{\n    float: right;\n    padding: 10px;\n    margin: 10px 0px;\n    border: none;\n    background: transparent;\n    color: #fff;\n\n    display: flex;\n    align-items: center;\n    justify-content: end;\n    cursor: pointer;\n}\n\n.expandBtn::after{\n    content: \"\";\n    width: 20px;\n    height: 20px;\n    display: block;\n    float: right;\n    margin-left: auto;\n    background:  url(" + ___CSS_LOADER_URL_REPLACEMENT_4___ + ");\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-blend-mode: lighten;\n}\n\n.navItems--bottom{\n    margin-top: auto;\n}\n\n.navLogout{\n    margin-top: auto;\n    background: transparent;\n    border: none;\n    width: 100%;\n    color: #fff;\n    padding: 30px 15px;\n    font-size: 15px;\n    text-align: center;\n    border-top: 1px solid #636363;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n\n}\n\n.dashboard-organisationSelector{\n    border: none;\n    padding: 0px 17px;\n    background: transparent;\n    color: #fff;\n    font-size: 12px;\n    appearance: none;\n    -webkit-appearance: none;\n    position: relative;\n}\n\n.dashboard-organisationSelector:focus, .dashboard-organisationSelector:focus-within, .dashboard-organisationSelector:focus-visible{\n    outline: none;\n}\n\n.dashboard-organisationContainer{\n    position: relative;\n}\n\n.dashboard-profile__nameContainer{\n    width: 250px;\n    margin-left: 10px;\n}\n\n@media screen and (min-width: 320px) and (max-width: 900px) {\n    .dashboard-header {\n        width: 100%;\n    }\n\n    .grid-3{\n        grid-template-columns: 1fr;\n    }\n\n    .grid-container{\n        display: block;\n    }\n\n    .dashboard-profile__nameContainer{\n        width: auto;\n    }\n}", "",{"version":3,"sources":["webpack://./src/Components/Header/header.css"],"names":[],"mappings":"AAAA;IACI,WAAW;IACX,gBAAgB;IAChB,eAAe;IACf,MAAM;IACN,OAAO;IACP,YAAY;IACZ,aAAa;IACb,mBAAmB;IACnB,8BAA8B;IAC9B,yBAAyB;IACzB,iCAAiC;IACjC,yBAAyB;AAC7B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,8BAA8B;IAC9B,WAAW;AACf;;AAEA;IACI,aAAa;IACb,mBAAmB;AACvB;;AAEA;IACI,yBAAyB;IACzB,SAAS;AACb;;AAEA;IACI,eAAe;IACf,eAAe;IACf,SAAS;AACb;;AAEA;IACI,SAAS;IACT,WAAW;IACX,YAAY;IACZ,mBAAmB;IACnB,oCAAoC;IACpC,kBAAkB;IAClB,iBAAiB;IACjB,YAAY;IACZ,sEAAsE;AAC1E;;AAEA;IACI,mBAAmB;IACnB,kBAAkB;IAClB,aAAa;IACb,YAAY;IACZ,gBAAgB;IAChB,mBAAmB;IACnB,kBAAkB;IAClB,kBAAkB;AACtB;;AAEA;IACI,2BAA2B;IAC3B,iCAAiC;IACjC,WAAW;IACX,iBAAiB;IACjB,eAAe;AACnB;;AAEA;IACI,WAAW;IACX,0BAA0B;;IAE1B,iCAAiC;IACjC,aAAa;IACb,sBAAsB;AAC1B;;AAEA;IACI,UAAU;IACV,QAAQ;IACR,kBAAkB;IAClB,6BAA6B;AACjC;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,WAAW;AACf;;AAEA;IACI,WAAW;IACX,aAAa;IACb,WAAW;IACX,aAAa;IACb,iBAAiB;IACjB,gBAAgB;IAChB,mBAAmB;IACnB,mBAAmB;IACnB,iCAAiC;IACjC,qBAAqB;AACzB;;AAEA;IACI,iCAAiC;IACjC,yBAAyB;IACzB,iCAAiC;AACrC;;AAEA;IACI,WAAW;AACf;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,UAAU;IACV,WAAW;IACX,mBAAmB;AACvB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,mBAAmB;IACnB,kBAAkB;IAClB,aAAa;IACb,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA;IACI,WAAW;IACX,oDAAuC;IACvC,wBAAwB;IACxB,4BAA4B;IAC5B,8BAA8B;IAC9B,kBAAkB;IAClB,eAAe;;IAEf,cAAc;IACd,kBAAkB;IAClB,WAAW;IACX,YAAY;AAChB;;AAEA;IACI,WAAW;IACX,oDAAoC;IACpC,wBAAwB;IACxB,4BAA4B;IAC5B,8BAA8B;IAC9B,cAAc;IACd,kBAAkB;IAClB,eAAe;IACf,WAAW;IACX,YAAY;AAChB;;AAEA;IACI,WAAW;IACX,oDAAsC;IACtC,wBAAwB;IACxB,4BAA4B;IAC5B,8BAA8B;IAC9B,cAAc;IACd,kBAAkB;IAClB,eAAe;IACf,WAAW;IACX,YAAY;AAChB;;AAEA;IACI,WAAW;IACX,oDAAoC;IACpC,wBAAwB;IACxB,4BAA4B;IAC5B,8BAA8B;IAC9B,cAAc;IACd,kBAAkB;IAClB,eAAe;IACf,WAAW;IACX,YAAY;AAChB;;AAEA;IACI,YAAY;IACZ,aAAa;IACb,gBAAgB;IAChB,YAAY;IACZ,uBAAuB;IACvB,WAAW;;IAEX,aAAa;IACb,mBAAmB;IACnB,oBAAoB;IACpB,eAAe;AACnB;;AAEA;IACI,WAAW;IACX,WAAW;IACX,YAAY;IACZ,cAAc;IACd,YAAY;IACZ,iBAAiB;IACjB,oDAAoC;IACpC,wBAAwB;IACxB,4BAA4B;IAC5B,8BAA8B;AAClC;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,gBAAgB;IAChB,uBAAuB;IACvB,YAAY;IACZ,WAAW;IACX,WAAW;IACX,kBAAkB;IAClB,eAAe;IACf,kBAAkB;IAClB,6BAA6B;IAC7B,eAAe;IACf,aAAa;IACb,mBAAmB;;AAEvB;;AAEA;IACI,YAAY;IACZ,iBAAiB;IACjB,uBAAuB;IACvB,WAAW;IACX,eAAe;IACf,gBAAgB;IAChB,wBAAwB;IACxB,kBAAkB;AACtB;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,YAAY;IACZ,iBAAiB;AACrB;;AAEA;IACI;QACI,WAAW;IACf;;IAEA;QACI,0BAA0B;IAC9B;;IAEA;QACI,cAAc;IAClB;;IAEA;QACI,WAAW;IACf;AACJ","sourcesContent":[".dashboard-header {\n    width: 100%;\n    max-height: 88px;\n    position: fixed;\n    top: 0;\n    left: 0;\n    z-index: 100;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 0px 25px 0px 0px;\n    background-color: rgb(63, 63, 63);\n    color: rgb(197, 197, 197);\n}\n\n.dashboard-profile {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    width: 100%;\n}\n\n.flex{\n    display: flex;\n    align-items: center;\n}\n\n.clock {\n    color: rgb(197, 197, 197);\n    margin: 0;\n}\n\n.dashboard-name {\n    font-size: 14px;\n    cursor: pointer;\n    margin: 0;\n}\n\n.dashboard-header>.dashboard-profile .content-img {\n    margin: 0;\n    width: 30px;\n    height: 30px;\n    border-width: 2.5px;\n    border-color: var(--intastellarGold);\n    border-radius: 50%;\n    object-fit: cover;\n    margin: auto;\n    box-shadow: 0 0 9px rgba(0, 0, 0, 0.14), 0 2px 1px rgba(0, 0, 0, 0.28);\n}\n\n.dashboard-logo {\n    filter: invert(100);\n    margin-right: 10px;\n    padding: 32px;\n    height: 88px;\n    text-align: left;\n    object-fit: contain;\n    object-position: 0;\n    position: relative;\n}\n\n.sidebar{\n    background: rgb(63, 63, 63);\n    transition: width .5s ease-in-out;\n    width: 65px;\n    min-height: 100vh;\n    position: fixed;\n}\n\n.collapsed {\n    width: auto;\n    height: calc(100vh - 88px);\n    \n    transition: width .5s ease-in-out;\n    display: flex;\n    flex-direction: column;\n}\n\n.collapsed .hiddenCollapsed{\n    opacity: 0;\n    width: 0;\n    visibility: hidden;\n    transform: all 1s ease-in-out;\n}\n\n.sidebar:hover, .sidebar:hover>.collapsed, .sidebar.expand,.collapsed.expand {\n    width: max-content;\n}\n\n.collapsed nav {\n    width: 100%;\n}\n\n.collapsed .navItems {\n    color: #fff;\n    display: flex;\n    width: 100%;\n    padding: 15px;\n    margin: 10px auto;\n    overflow: hidden;\n    align-items: center;\n    white-space: nowrap;\n    transition: width .5s ease-in-out;\n    text-decoration: none;\n}\n\n.navItems.--active{\n    background-color: rgb(95, 95, 95);\n    color: rgb(241, 241, 241);\n    transition: width .5s ease-in-out;\n}\n\n.collapsed:hover .navItems, .collapsed.expand a{\n    width: 100%;\n}\n\n.collapsed:hover nav, .collapsed.expand nav{\n    width: 150px;\n}\n\n.collapsed.expand .hiddenCollapsed, .collapsed:hover .hiddenCollapsed{\n    opacity: 1;\n    width: auto;\n    visibility: visible;\n}\n\n.dashboard-icons{\n    width: 25px;\n    height: 25px;\n    /* padding: 15px; */\n    margin-right: 10px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n.dashboard::after{\n    content: \"\";\n    background:  url(\"icons/dashboard.svg\");\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-blend-mode: lighten;\n    font-style: normal;\n    font-size: 20px;\n\n    display: block;\n    font-style: normal;\n    width: 20px;\n    height: 20px;\n}\n\n.domains::after{\n    content: \"\";\n    background:  url(\"icons/domain.svg\");\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-blend-mode: lighten;\n    display: block;\n    font-style: normal;\n    font-size: 20px;\n    width: 20px;\n    height: 20px;\n}\n\n.settings::after{\n    content: \"\";\n    background:  url(\"icons/settings.svg\");\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-blend-mode: lighten;\n    display: block;\n    font-style: normal;\n    font-size: 20px;\n    width: 20px;\n    height: 20px;\n}\n\n.logout::after{\n    content: \"\";\n    background:  url(\"icons/Logout.svg\");\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-blend-mode: lighten;\n    display: block;\n    font-style: normal;\n    font-size: 20px;\n    width: 20px;\n    height: 20px;\n}\n\n.expandBtn{\n    float: right;\n    padding: 10px;\n    margin: 10px 0px;\n    border: none;\n    background: transparent;\n    color: #fff;\n\n    display: flex;\n    align-items: center;\n    justify-content: end;\n    cursor: pointer;\n}\n\n.expandBtn::after{\n    content: \"\";\n    width: 20px;\n    height: 20px;\n    display: block;\n    float: right;\n    margin-left: auto;\n    background:  url(\"icons/expand.svg\");\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-blend-mode: lighten;\n}\n\n.navItems--bottom{\n    margin-top: auto;\n}\n\n.navLogout{\n    margin-top: auto;\n    background: transparent;\n    border: none;\n    width: 100%;\n    color: #fff;\n    padding: 30px 15px;\n    font-size: 15px;\n    text-align: center;\n    border-top: 1px solid #636363;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n\n}\n\n.dashboard-organisationSelector{\n    border: none;\n    padding: 0px 17px;\n    background: transparent;\n    color: #fff;\n    font-size: 12px;\n    appearance: none;\n    -webkit-appearance: none;\n    position: relative;\n}\n\n.dashboard-organisationSelector:focus, .dashboard-organisationSelector:focus-within, .dashboard-organisationSelector:focus-visible{\n    outline: none;\n}\n\n.dashboard-organisationContainer{\n    position: relative;\n}\n\n.dashboard-profile__nameContainer{\n    width: 250px;\n    margin-left: 10px;\n}\n\n@media screen and (min-width: 320px) and (max-width: 900px) {\n    .dashboard-header {\n        width: 100%;\n    }\n\n    .grid-3{\n        grid-template-columns: 1fr;\n    }\n\n    .grid-container{\n        display: block;\n    }\n\n    .dashboard-profile__nameContainer{\n        width: auto;\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/Components/InputFields/Style.css":
/*!*************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/Components/InputFields/Style.css ***!
  \*************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".intInput{\n    padding: 10px;\n    width: 100%;\n    border: none;\n}", "",{"version":3,"sources":["webpack://./src/Components/InputFields/Style.css"],"names":[],"mappings":"AAAA;IACI,aAAa;IACb,WAAW;IACX,YAAY;AAChB","sourcesContent":[".intInput{\n    padding: 10px;\n    width: 100%;\n    border: none;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/Components/SelectInput/Style.css":
/*!*************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/Components/SelectInput/Style.css ***!
  \*************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".selector{\n    width: calc(max-content + 20px);\n    position: relative;\n}\n\n.selectTitle{\n    margin-bottom: 10px;\n    display: block;\n}\n\n.selector select{\n    border: none;\n    background: transparent;\n    appearance: none;\n    -webkit-appearance: none;\n    color: #fff;\n    font-size: 12px;\n    margin: 0px;\n    padding-bottom: 5px;\n    border-radius: 0;\n    /* border-bottom: 1px solid; */\n    display: block;\n    width: 100%;\n}\n\n.selector select:focus, .selector select:focus-within, .selector select:focus-visible{\n    outline: none;\n    border-bottom: 1px solid;\n}\n\n.dropdown-menu__content{\n    position: absolute;\n    top: 100%;\n    width: max-content;\n    max-height: 500px;\n    overflow: scroll;\n    background: #fff;\n    color: #808080;\n    border-radius: 5px;\n    padding: 0;\n    box-shadow: 0px 0px 10px rgba(0,0,0,0.2);\n    /* display: none; */\n    list-style: none;\n}\n\n.dropdown-menu__content li{\n    padding: 10px;\n    border-bottom: 1px solid #eee;\n    cursor: pointer;\n}\n\n.dropdown-menu__content li:hover{\n    background: #eee;\n}\n\n.dropdown-menu__content li:last-child{\n    border-bottom: none;\n}\n\n.dropdown-menu-button{\n    border: none;\n    background-color: transparent;\n    font-size: 15px;\n    margin: 0px;\n    padding: 0px;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    color: #d6d6d6;\n    border-radius: 5px;\n    min-width: max-content;\n    position: relative;\n    width: 120px;\n}\n\n.dropdown-menu-button::after{\n    content: \"\";\n    width: 10px;\n    height: 10px;\n    margin-right: 10px;\n    display: block;\n    position: absolute;\n    top: 0;\n    right: -30px;\n    border-top: 1px solid;\n    border-left: 1px solid;\n    transform: rotate(-135deg);\n}", "",{"version":3,"sources":["webpack://./src/Components/SelectInput/Style.css"],"names":[],"mappings":"AAAA;IACI,+BAA+B;IAC/B,kBAAkB;AACtB;;AAEA;IACI,mBAAmB;IACnB,cAAc;AAClB;;AAEA;IACI,YAAY;IACZ,uBAAuB;IACvB,gBAAgB;IAChB,wBAAwB;IACxB,WAAW;IACX,eAAe;IACf,WAAW;IACX,mBAAmB;IACnB,gBAAgB;IAChB,8BAA8B;IAC9B,cAAc;IACd,WAAW;AACf;;AAEA;IACI,aAAa;IACb,wBAAwB;AAC5B;;AAEA;IACI,kBAAkB;IAClB,SAAS;IACT,kBAAkB;IAClB,iBAAiB;IACjB,gBAAgB;IAChB,gBAAgB;IAChB,cAAc;IACd,kBAAkB;IAClB,UAAU;IACV,wCAAwC;IACxC,mBAAmB;IACnB,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,6BAA6B;IAC7B,eAAe;AACnB;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,YAAY;IACZ,6BAA6B;IAC7B,eAAe;IACf,WAAW;IACX,YAAY;IACZ,eAAe;IACf,aAAa;IACb,mBAAmB;IACnB,cAAc;IACd,kBAAkB;IAClB,sBAAsB;IACtB,kBAAkB;IAClB,YAAY;AAChB;;AAEA;IACI,WAAW;IACX,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,cAAc;IACd,kBAAkB;IAClB,MAAM;IACN,YAAY;IACZ,qBAAqB;IACrB,sBAAsB;IACtB,0BAA0B;AAC9B","sourcesContent":[".selector{\n    width: calc(max-content + 20px);\n    position: relative;\n}\n\n.selectTitle{\n    margin-bottom: 10px;\n    display: block;\n}\n\n.selector select{\n    border: none;\n    background: transparent;\n    appearance: none;\n    -webkit-appearance: none;\n    color: #fff;\n    font-size: 12px;\n    margin: 0px;\n    padding-bottom: 5px;\n    border-radius: 0;\n    /* border-bottom: 1px solid; */\n    display: block;\n    width: 100%;\n}\n\n.selector select:focus, .selector select:focus-within, .selector select:focus-visible{\n    outline: none;\n    border-bottom: 1px solid;\n}\n\n.dropdown-menu__content{\n    position: absolute;\n    top: 100%;\n    width: max-content;\n    max-height: 500px;\n    overflow: scroll;\n    background: #fff;\n    color: #808080;\n    border-radius: 5px;\n    padding: 0;\n    box-shadow: 0px 0px 10px rgba(0,0,0,0.2);\n    /* display: none; */\n    list-style: none;\n}\n\n.dropdown-menu__content li{\n    padding: 10px;\n    border-bottom: 1px solid #eee;\n    cursor: pointer;\n}\n\n.dropdown-menu__content li:hover{\n    background: #eee;\n}\n\n.dropdown-menu__content li:last-child{\n    border-bottom: none;\n}\n\n.dropdown-menu-button{\n    border: none;\n    background-color: transparent;\n    font-size: 15px;\n    margin: 0px;\n    padding: 0px;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    color: #d6d6d6;\n    border-radius: 5px;\n    min-width: max-content;\n    position: relative;\n    width: 120px;\n}\n\n.dropdown-menu-button::after{\n    content: \"\";\n    width: 10px;\n    height: 10px;\n    margin-right: 10px;\n    display: block;\n    position: absolute;\n    top: 0;\n    right: -30px;\n    border-top: 1px solid;\n    border-left: 1px solid;\n    transform: rotate(-135deg);\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/Components/SuccessWindow/Style.css":
/*!***************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/Components/SuccessWindow/Style.css ***!
  \***************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".successWindow{\n    position: fixed;\n    right: 0;\n    top: 100px;\n    background: rgb(58, 58, 58);\n    width: auto;\n    border-top: 2px solid green;\n    transition: right .5s ease-in-out;\n}\n\n.successWindow-content{\n    padding: 15px;\n    color: #fff;\n}", "",{"version":3,"sources":["webpack://./src/Components/SuccessWindow/Style.css"],"names":[],"mappings":"AAAA;IACI,eAAe;IACf,QAAQ;IACR,UAAU;IACV,2BAA2B;IAC3B,WAAW;IACX,2BAA2B;IAC3B,iCAAiC;AACrC;;AAEA;IACI,aAAa;IACb,WAAW;AACf","sourcesContent":[".successWindow{\n    position: fixed;\n    right: 0;\n    top: 100px;\n    background: rgb(58, 58, 58);\n    width: auto;\n    border-top: 2px solid green;\n    transition: right .5s ease-in-out;\n}\n\n.successWindow-content{\n    padding: 15px;\n    color: #fff;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/Components/widget/Loading.css":
/*!**********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/Components/widget/Loading.css ***!
  \**********************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".bigNumIsLoading{\n    width: 100%;\n    height: 44px;\n    margin: 1em 0;\n    background: linear-gradient(to right, rgba(131, 131, 131, 0), rgb(66, 66, 66), rgba(131, 131, 131, 0));\n    animation-name: pulse;\n    animation-duration: 2s;\n    animation-iteration-count: infinite;\n    animation-delay: 1ms;\n}\n\n.smallIsLoading{\n    width: 70%;\n    height: 34px;\n    margin: 1em auto;\n    background: linear-gradient(to right, rgba(131, 131, 131, 0), rgb(66, 66, 66), rgba(131, 131, 131, 0));\n    animation-name: pulse;\n    animation-duration: 2s;\n    animation-iteration-count: infinite;\n    animation-delay: 1ms;\n}\n\n@keyframes pulse {\n    0%   {opacity: .5;}\n    50%  {opacity: 1;}\n    100% {opacity: .5;}\n}  ", "",{"version":3,"sources":["webpack://./src/Components/widget/Loading.css"],"names":[],"mappings":"AAAA;IACI,WAAW;IACX,YAAY;IACZ,aAAa;IACb,sGAAsG;IACtG,qBAAqB;IACrB,sBAAsB;IACtB,mCAAmC;IACnC,oBAAoB;AACxB;;AAEA;IACI,UAAU;IACV,YAAY;IACZ,gBAAgB;IAChB,sGAAsG;IACtG,qBAAqB;IACrB,sBAAsB;IACtB,mCAAmC;IACnC,oBAAoB;AACxB;;AAEA;IACI,MAAM,WAAW,CAAC;IAClB,MAAM,UAAU,CAAC;IACjB,MAAM,WAAW,CAAC;AACtB","sourcesContent":[".bigNumIsLoading{\n    width: 100%;\n    height: 44px;\n    margin: 1em 0;\n    background: linear-gradient(to right, rgba(131, 131, 131, 0), rgb(66, 66, 66), rgba(131, 131, 131, 0));\n    animation-name: pulse;\n    animation-duration: 2s;\n    animation-iteration-count: infinite;\n    animation-delay: 1ms;\n}\n\n.smallIsLoading{\n    width: 70%;\n    height: 34px;\n    margin: 1em auto;\n    background: linear-gradient(to right, rgba(131, 131, 131, 0), rgb(66, 66, 66), rgba(131, 131, 131, 0));\n    animation-name: pulse;\n    animation-duration: 2s;\n    animation-iteration-count: infinite;\n    animation-delay: 1ms;\n}\n\n@keyframes pulse {\n    0%   {opacity: .5;}\n    50%  {opacity: 1;}\n    100% {opacity: .5;}\n}  "],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/Components/widget/Widget.css":
/*!*********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/Components/widget/Widget.css ***!
  \*********************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".widget{\n    box-shadow: 0 0 3px 0 rgba(0,0,0,.22), inset -1px 1px 1px rgba(255, 255, 255, 0.5);\n    background: radial-gradient(circle at top, rgb(101, 101, 101) -10%, rgb(48, 48, 48));\n    border-radius: 10px;\n    padding: 40px;\n    position: relative;\n    overflow: hidden;\n    /* min-height: 200px; */\n    margin: 20px 0px;\n    color: rgb(197, 197, 197);\n    text-align: center;\n    backdrop-filter: saturate(180%) blur(20px);\n    -webkit-backdrop-filter: saturate(180%) blur(20px);\n    text-decoration: none;\n}\n\n.overviewTotal::before {\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 10px;\n    background-color: #c09f53;\n}\n\n.overviewDistribution::before {\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 10px;\n    background-color: #ddd29b;\n}", "",{"version":3,"sources":["webpack://./src/Components/widget/Widget.css"],"names":[],"mappings":"AAAA;IACI,kFAAkF;IAClF,oFAAoF;IACpF,mBAAmB;IACnB,aAAa;IACb,kBAAkB;IAClB,gBAAgB;IAChB,uBAAuB;IACvB,gBAAgB;IAChB,yBAAyB;IACzB,kBAAkB;IAClB,0CAA0C;IAC1C,kDAAkD;IAClD,qBAAqB;AACzB;;AAEA;IACI,WAAW;IACX,kBAAkB;IAClB,MAAM;IACN,OAAO;IACP,WAAW;IACX,YAAY;IACZ,yBAAyB;AAC7B;;AAEA;IACI,WAAW;IACX,kBAAkB;IAClB,MAAM;IACN,OAAO;IACP,WAAW;IACX,YAAY;IACZ,yBAAyB;AAC7B","sourcesContent":[".widget{\n    box-shadow: 0 0 3px 0 rgba(0,0,0,.22), inset -1px 1px 1px rgba(255, 255, 255, 0.5);\n    background: radial-gradient(circle at top, rgb(101, 101, 101) -10%, rgb(48, 48, 48));\n    border-radius: 10px;\n    padding: 40px;\n    position: relative;\n    overflow: hidden;\n    /* min-height: 200px; */\n    margin: 20px 0px;\n    color: rgb(197, 197, 197);\n    text-align: center;\n    backdrop-filter: saturate(180%) blur(20px);\n    -webkit-backdrop-filter: saturate(180%) blur(20px);\n    text-decoration: none;\n}\n\n.overviewTotal::before {\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 10px;\n    background-color: #c09f53;\n}\n\n.overviewDistribution::before {\n    content: '';\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 10px;\n    background-color: #ddd29b;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/Login/Login.css":
/*!********************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/Login/Login.css ***!
  \********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".loginForm-container{\n    display: grid;\n    grid-template-columns: 1fr .85fr;\n    height: 100vh;\n    width: 100%;\n    text-align: center;\n    background-color: #c09f53;\n    background-image: url(\"https://www.intastellaraccounts.com/images/AdobeStock_317238161.jpeg\");\n    background-position: left;\n    background-size: cover;\n    background-blend-mode: multiply;\n}\n\n.loginForm-overlay{\n    position: fixed;\n    top: 0;\n    z-index: 100;\n    width: 100%;\n    height: 100%;\n    margin: auto;\n    display: grid;\n    place-content: center;\n    background: rgba(0,0,0,.7);\n}\n\n.loginForm{\n    width: 100%;\n    height: 100%;\n    margin: auto;\n    background: radial-gradient(circle at top, rgba(188, 188, 188, .8) -10%, rgba(48, 48, 48, .6));\n    padding: 80px;\n    box-sizing: border-box;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    color: rgb(234, 234, 234);\n    backdrop-filter: saturate(180%) blur(20px);\n    -webkit-backdrop-filter: saturate(180%) blur(20px);\n    grid-column: 2/3;\n}\n\n.loginForm-overlay .loginForm{\n    width: 500px;\n}\n\n.loginForm label{\n    text-align: left;\n    display: block;\n    padding: 5px 0px;\n}\n\n.loginForm-inputField{\n    padding: 15px;\n    border: none;\n    width: 100%;\n    box-sizing: border-box;\n    font-size: 12px;\n    margin: 2px 0px;\n}\n\n.loginForm-forget{\n    padding: 15px;\n    color: rgb(234, 234, 234);\n    text-decoration: none;\n    display: block;\n    text-align: right;\n}\n\n.loginForm-logo{\n    width: 50%;\n    margin: 0 auto;\n    padding: 20px 15px;\n    filter: invert(100) brightness(100);\n}\n\n.loginForm-logo.--hideMobile{\n    display: none;\n}\n\n.loginForm-inputField.--btn{\n    background-color: #c09f53;\n    font-size: 16px;\n    color: #fff;\n    font-weight: bold;\n    letter-spacing: 5px;\n    text-transform: uppercase;\n}\n\n.loginForm-title{\n    font-size: 1.7em;\n    text-align: left;\n    padding: 15px 0px;\n    width: 100%;\n    text-transform: uppercase;\n    margin-bottom: -2px;\n}\n\n.loginForm-service{\n    margin: 0 0 10px;\n}\n\n@media screen and (min-width: 375px) and (max-width: 900px) {\n    .loginForm-container{\n        grid-template-columns: 1fr;\n    }\n\n    .loginForm-logo{\n        width: 100%;\n        padding: 0;\n        margin: 20px 0px;\n    }\n\n    .loginForm{\n        padding: 40px;\n        background: radial-gradient(circle at top, rgba(188, 188, 188, .6) -10%, rgba(48, 48, 48, .4));\n    }\n\n    .loginForm-container{\n        background-position: -250px;\n    }\n}", "",{"version":3,"sources":["webpack://./src/Login/Login.css"],"names":[],"mappings":"AAAA;IACI,aAAa;IACb,gCAAgC;IAChC,aAAa;IACb,WAAW;IACX,kBAAkB;IAClB,yBAAyB;IACzB,6FAA6F;IAC7F,yBAAyB;IACzB,sBAAsB;IACtB,+BAA+B;AACnC;;AAEA;IACI,eAAe;IACf,MAAM;IACN,YAAY;IACZ,WAAW;IACX,YAAY;IACZ,YAAY;IACZ,aAAa;IACb,qBAAqB;IACrB,0BAA0B;AAC9B;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,YAAY;IACZ,8FAA8F;IAC9F,aAAa;IACb,sBAAsB;IACtB,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,yBAAyB;IACzB,0CAA0C;IAC1C,kDAAkD;IAClD,gBAAgB;AACpB;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,gBAAgB;IAChB,cAAc;IACd,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,YAAY;IACZ,WAAW;IACX,sBAAsB;IACtB,eAAe;IACf,eAAe;AACnB;;AAEA;IACI,aAAa;IACb,yBAAyB;IACzB,qBAAqB;IACrB,cAAc;IACd,iBAAiB;AACrB;;AAEA;IACI,UAAU;IACV,cAAc;IACd,kBAAkB;IAClB,mCAAmC;AACvC;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,yBAAyB;IACzB,eAAe;IACf,WAAW;IACX,iBAAiB;IACjB,mBAAmB;IACnB,yBAAyB;AAC7B;;AAEA;IACI,gBAAgB;IAChB,gBAAgB;IAChB,iBAAiB;IACjB,WAAW;IACX,yBAAyB;IACzB,mBAAmB;AACvB;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI;QACI,0BAA0B;IAC9B;;IAEA;QACI,WAAW;QACX,UAAU;QACV,gBAAgB;IACpB;;IAEA;QACI,aAAa;QACb,8FAA8F;IAClG;;IAEA;QACI,2BAA2B;IAC/B;AACJ","sourcesContent":[".loginForm-container{\n    display: grid;\n    grid-template-columns: 1fr .85fr;\n    height: 100vh;\n    width: 100%;\n    text-align: center;\n    background-color: #c09f53;\n    background-image: url(\"https://www.intastellaraccounts.com/images/AdobeStock_317238161.jpeg\");\n    background-position: left;\n    background-size: cover;\n    background-blend-mode: multiply;\n}\n\n.loginForm-overlay{\n    position: fixed;\n    top: 0;\n    z-index: 100;\n    width: 100%;\n    height: 100%;\n    margin: auto;\n    display: grid;\n    place-content: center;\n    background: rgba(0,0,0,.7);\n}\n\n.loginForm{\n    width: 100%;\n    height: 100%;\n    margin: auto;\n    background: radial-gradient(circle at top, rgba(188, 188, 188, .8) -10%, rgba(48, 48, 48, .6));\n    padding: 80px;\n    box-sizing: border-box;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    color: rgb(234, 234, 234);\n    backdrop-filter: saturate(180%) blur(20px);\n    -webkit-backdrop-filter: saturate(180%) blur(20px);\n    grid-column: 2/3;\n}\n\n.loginForm-overlay .loginForm{\n    width: 500px;\n}\n\n.loginForm label{\n    text-align: left;\n    display: block;\n    padding: 5px 0px;\n}\n\n.loginForm-inputField{\n    padding: 15px;\n    border: none;\n    width: 100%;\n    box-sizing: border-box;\n    font-size: 12px;\n    margin: 2px 0px;\n}\n\n.loginForm-forget{\n    padding: 15px;\n    color: rgb(234, 234, 234);\n    text-decoration: none;\n    display: block;\n    text-align: right;\n}\n\n.loginForm-logo{\n    width: 50%;\n    margin: 0 auto;\n    padding: 20px 15px;\n    filter: invert(100) brightness(100);\n}\n\n.loginForm-logo.--hideMobile{\n    display: none;\n}\n\n.loginForm-inputField.--btn{\n    background-color: #c09f53;\n    font-size: 16px;\n    color: #fff;\n    font-weight: bold;\n    letter-spacing: 5px;\n    text-transform: uppercase;\n}\n\n.loginForm-title{\n    font-size: 1.7em;\n    text-align: left;\n    padding: 15px 0px;\n    width: 100%;\n    text-transform: uppercase;\n    margin-bottom: -2px;\n}\n\n.loginForm-service{\n    margin: 0 0 10px;\n}\n\n@media screen and (min-width: 375px) and (max-width: 900px) {\n    .loginForm-container{\n        grid-template-columns: 1fr;\n    }\n\n    .loginForm-logo{\n        width: 100%;\n        padding: 0;\n        margin: 20px 0px;\n    }\n\n    .loginForm{\n        padding: 40px;\n        background: radial-gradient(circle at top, rgba(188, 188, 188, .6) -10%, rgba(48, 48, 48, .4));\n    }\n\n    .loginForm-container{\n        background-position: -250px;\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/Pages/Dashboard/Style.css":
/*!******************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/Pages/Dashboard/Style.css ***!
  \******************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".grid-3{\n    grid-template-columns: repeat(auto-fit, minmax(25%, 1fr));\n    justify-content: center;\n    align-items: center;\n    gap: 20px;\n}\n\n.dashboard-content {\n    width: 100%;\n    margin: 0 auto;\n    grid-column: 2/4;\n    padding: 0 20px;\n}\n\n.activeDomain{\n    color: aliceblue;\n    text-decoration: none;\n    text-transform: uppercase;\n}", "",{"version":3,"sources":["webpack://./src/Pages/Dashboard/Style.css"],"names":[],"mappings":"AAAA;IACI,yDAAyD;IACzD,uBAAuB;IACvB,mBAAmB;IACnB,SAAS;AACb;;AAEA;IACI,WAAW;IACX,cAAc;IACd,gBAAgB;IAChB,eAAe;AACnB;;AAEA;IACI,gBAAgB;IAChB,qBAAqB;IACrB,yBAAyB;AAC7B","sourcesContent":[".grid-3{\n    grid-template-columns: repeat(auto-fit, minmax(25%, 1fr));\n    justify-content: center;\n    align-items: center;\n    gap: 20px;\n}\n\n.dashboard-content {\n    width: 100%;\n    margin: 0 auto;\n    grid-column: 2/4;\n    padding: 0 20px;\n}\n\n.activeDomain{\n    color: aliceblue;\n    text-decoration: none;\n    text-transform: uppercase;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/cjs.js!./src/Pages/Settings/Style.css":
/*!*****************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./src/Pages/Settings/Style.css ***!
  \*****************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "../node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".settingsNavItem{\n    display: inline-block;\n    padding: 15px;\n    color: inherit;\n    text-decoration: none;\n}\n\n.settingsNavItem:hover{\n    background-color: rgb(197, 197, 197);\n    color: initial;\n    border-radius: 10px;\n}", "",{"version":3,"sources":["webpack://./src/Pages/Settings/Style.css"],"names":[],"mappings":"AAAA;IACI,qBAAqB;IACrB,aAAa;IACb,cAAc;IACd,qBAAqB;AACzB;;AAEA;IACI,oCAAoC;IACpC,cAAc;IACd,mBAAmB;AACvB","sourcesContent":[".settingsNavItem{\n    display: inline-block;\n    padding: 15px;\n    color: inherit;\n    text-decoration: none;\n}\n\n.settingsNavItem:hover{\n    background-color: rgb(197, 197, 197);\n    color: initial;\n    border-radius: 10px;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../node_modules/css-loader/dist/runtime/api.js":
/*!******************************************************!*\
  !*** ../node_modules/css-loader/dist/runtime/api.js ***!
  \******************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "../node_modules/css-loader/dist/runtime/getUrl.js":
/*!*********************************************************!*\
  !*** ../node_modules/css-loader/dist/runtime/getUrl.js ***!
  \*********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }

  if (!url) {
    return url;
  }

  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them

  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }

  if (options.hash) {
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "../node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!*************************************************************!*\
  !*** ../node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \*************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/App.css":
/*!*********************!*\
  !*** ./src/App.css ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_App_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./App.css */ "../node_modules/css-loader/dist/cjs.js!./src/App.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_App_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_App_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_App_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_App_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/Components/Charts/WorldMap/Countries.module.css":
/*!*************************************************************!*\
  !*** ./src/Components/Charts/WorldMap/Countries.module.css ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_Countries_module_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./Countries.module.css */ "../node_modules/css-loader/dist/cjs.js!./src/Components/Charts/WorldMap/Countries.module.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Countries_module_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_Countries_module_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_Countries_module_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_Countries_module_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/Components/Charts/WorldMap/Style.css":
/*!**************************************************!*\
  !*** ./src/Components/Charts/WorldMap/Style.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!./Style.css */ "../node_modules/css-loader/dist/cjs.js!./src/Components/Charts/WorldMap/Style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/Components/Header/header.css":
/*!******************************************!*\
  !*** ./src/Components/Header/header.css ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_header_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!./header.css */ "../node_modules/css-loader/dist/cjs.js!./src/Components/Header/header.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_header_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_header_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_header_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_header_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/Components/InputFields/Style.css":
/*!**********************************************!*\
  !*** ./src/Components/InputFields/Style.css ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!./Style.css */ "../node_modules/css-loader/dist/cjs.js!./src/Components/InputFields/Style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/Components/SelectInput/Style.css":
/*!**********************************************!*\
  !*** ./src/Components/SelectInput/Style.css ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!./Style.css */ "../node_modules/css-loader/dist/cjs.js!./src/Components/SelectInput/Style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/Components/SuccessWindow/Style.css":
/*!************************************************!*\
  !*** ./src/Components/SuccessWindow/Style.css ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!./Style.css */ "../node_modules/css-loader/dist/cjs.js!./src/Components/SuccessWindow/Style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/Components/widget/Loading.css":
/*!*******************************************!*\
  !*** ./src/Components/widget/Loading.css ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_Loading_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!./Loading.css */ "../node_modules/css-loader/dist/cjs.js!./src/Components/widget/Loading.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Loading_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_Loading_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_Loading_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_Loading_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/Components/widget/Widget.css":
/*!******************************************!*\
  !*** ./src/Components/widget/Widget.css ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_Widget_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!./Widget.css */ "../node_modules/css-loader/dist/cjs.js!./src/Components/widget/Widget.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Widget_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_Widget_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_Widget_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_Widget_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/Login/Login.css":
/*!*****************************!*\
  !*** ./src/Login/Login.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_Login_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./Login.css */ "../node_modules/css-loader/dist/cjs.js!./src/Login/Login.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Login_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_Login_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_Login_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_Login_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/Pages/Dashboard/Style.css":
/*!***************************************!*\
  !*** ./src/Pages/Dashboard/Style.css ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!./Style.css */ "../node_modules/css-loader/dist/cjs.js!./src/Pages/Dashboard/Style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/Pages/Settings/Style.css":
/*!**************************************!*\
  !*** ./src/Pages/Settings/Style.css ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!./Style.css */ "../node_modules/css-loader/dist/cjs.js!./src/Pages/Settings/Style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_Style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!*****************************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \*****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "../node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!*********************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \*********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "../node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!***********************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \***********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!***********************************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \***********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "../node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!****************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \****************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "../node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!**********************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/Components/Header/icons/Logout.svg":
/*!************************************************!*\
  !*** ./src/Components/Header/icons/Logout.svg ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "1acb48d14c56f1e6f79f.svg";

/***/ }),

/***/ "./src/Components/Header/icons/dashboard.svg":
/*!***************************************************!*\
  !*** ./src/Components/Header/icons/dashboard.svg ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "4cf8d7739a7be174b8bf.svg";

/***/ }),

/***/ "./src/Components/Header/icons/domain.svg":
/*!************************************************!*\
  !*** ./src/Components/Header/icons/domain.svg ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "3b63ccd5fe8fe756ffca.svg";

/***/ }),

/***/ "./src/Components/Header/icons/expand.svg":
/*!************************************************!*\
  !*** ./src/Components/Header/icons/expand.svg ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "dc01a3dfd47967949745.svg";

/***/ }),

/***/ "./src/Components/Header/icons/settings.svg":
/*!**************************************************!*\
  !*** ./src/Components/Header/icons/settings.svg ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "75b7b5582fda92e18d8c.svg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_App_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/App.js */ "./src/App.js");

const createRoot = window.ReactDOM.createRoot;
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render( /*#__PURE__*/React.createElement(_src_App_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
  tab: "home"
}));
})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map