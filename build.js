var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
};
! function(t, e) {
    "use strict";
    "undefined" != typeof exports ? t(global, exports) : t(window, e)
}(function(t, e) {
    "use strict";

    function n() {}
    var o = Array.prototype.slice;
    n.prototype.on = function(t, e, n) {
        this._events = this._events || {};
        var o = this._events[t] || (this._events[t] = []);
        return o.push({
            callback: e,
            context: n || this
        }), this
    }, n.prototype.once = function(t, e, n) {
        var o = this,
            i = function r() {
                o.off(t, r), e.apply(this, arguments)
            };
        return i._callback = e, this.on(t, i, n)
    }, n.prototype.off = function(t, e, n) {
        n = n || this;
        var o, i, r;
        if (!t && !e && !n) return this._events = {}, this;
        for (var t in this._events)
            if (this._events.hasOwnProperty(t) && (r = this._events[t])) {
                if (this._events[t] = o = [], e || n)
                    for (var a = 0, s = r.length; a < s; a++) i = r[a], (e && e !== i.callback && e !== i.callback._callback || n && n !== i.context) && o.push(i);
                o.length || delete this._events[t]
            } return this
    }, n.prototype.trigger = function(t) {
        if (this._events) {
            var e, n = o.call(arguments, 1),
                i = this._events[t];
            if (i)
                for (var r in i) i.hasOwnProperty(r) && (e = i[r]).callback.apply(e.context, n)
        }
    }, e.BaseEvents = n
}, this.FBPublication || (this.FBPublication = {})),
function(t, e) {
    "use strict";
    if ("undefined" != typeof exports) {
        var n = require("../../libs/events").BaseEvents;
        t(global, exports, n)
    } else t(window, e, e.BaseEvents)
}(function(t, e, n) {
    "use strict";

    function o(t) {
        var e = "undefined" == typeof t ? "undefined" : _typeof(t);
        return "function" === e || "object" === e && !!t
    }

    function i() {
        return t.XDomainRequest && !/MSIE 1/.test(t.navigator.userAgent) ? new t.XDomainRequest : t.XMLHttpRequest ? new t.XMLHttpRequest : void 0
    }

    function r(t, e, n) {
        this.rootPath = e || "./", this.structure = n || {}, this.adapter = t, this._loading = {}, this._exports = {}, this.add("BaseEvents", {
            name: "LibraryManager",
            dependency: "BaseEvents"
        })
    }
    r.prototype = new n, r.prototype.constructor = r, r.prototype.add = function(t) {
        for (var e = !1, n = 0; n < arguments.length; n++) {
            var t = arguments[n];
            o(t) || (t = {
                name: t
            }), this.structure.hasOwnProperty(t.name) || (this.structure[t.name] = {
                name: t.name
            }, t.hasOwnProperty("path") && (this.structure[t.name].path = t.path), t.hasOwnProperty("dependency") && (this.structure[t.name].dependency = t.dependency), e = !0)
        }
        return e
    }, r.prototype.load = function(t) {
        for (var n = 0, i = 0; i < arguments.length; i++) {
            var t = arguments[i];
            if (o(t) || (t = {
                    name: t
                }), this.has(t.name) || this.add(t), t = this.structure[t.name], this.loaded(t.name) || this.loading(t.name)) this.loading(t.name) || this.trigger("library:" + t.name, {
                name: t.name,
                exports: e
            });
            else {
                n++;
                var a = this,
                    s = this.adapter.translatePath(t.path ? t.path : this.rootPath + t.name + ".js"),
                    p = !!a.adapter.getCrossOrigin && a.adapter.getCrossOrigin();
                if (t.dependency)
                    for (var l = 0, i = 0; i < t.dependency.length; i++) {
                        var d = t.dependency[i];
                        this.loaded(d) || (l++, this.on("library:" + d, function() {
                            l--, 0 === l && (a._loading[t.name] = !0, r.loadScript(s, function() {
                                a._loading[t.name] = !1, a._exports[t.name] = e[t.name], a.trigger("library:" + t.name, {
                                    name: t.name,
                                    exports: a._exports[t.name]
                                })
                            }, p))
                        }), this.loading(d) || this.load(d))
                    } else a._loading[t.name] = !0, r.loadScript(s, function() {
                        a._loading[t.name] = !1, a._exports[t.name] = e[t.name], a.trigger("library:" + t.name, {
                            name: t.name,
                            exports: a._exports[t.name]
                        })
                    }, p)
            }
        }
        return n > 0
    }, r.prototype.has = function(t) {
        return this.structure.hasOwnProperty(t)
    }, r.prototype.loaded = function(t) {
        return this._loading[t] === !1
    }, r.prototype.getExports = function(t) {
        return this._exports[t]
    }, r.prototype.loading = function(t) {
        return this._loading[t] === !0
    }, r._loadExternalUrl = function(t, e, n) {
        e = e || function() {}, n = n || function() {};
        var o = i();
        o.open("GET", t, !0), o.onerror = function() {
            console.error("Error loading " + t), n(o.status)
        }, null === o.onreadystatechange ? o.onreadystatechange = function() {
            4 === o.readyState && (200 === o.status ? e(o) : n(o.status))
        } : o.onload = function() {
            e(o)
        }, o.send(null)
    }, r.loadText = function(t, e, n) {
        e = e || function() {}, n = n || function() {}, r._loadExternalUrl(t, function(t) {
            e(t.responseText)
        }, function(t) {
            n(t)
        })
    }, r.loadJSON = function(t, e, n) {
        e = e || function() {}, n = n || function() {}, r.loadText(t, function(t) {
            e(JSON.parse(t))
        }, function(t) {
            n(t)
        })
    }, r.loadScript = function(e, n, o) {
        n = n || function() {};
        var i = t.document.getElementsByTagName("head")[0],
            r = t.document.createElement("script");
        r.type = "text/javascript", r.src = e, o && r.setAttribute("crossOrigin", o), r.readyState ? r.onreadystatechange = function() {
            "loaded" !== r.readyState && "complete" !== r.readyState || (r.onreadystatechange = null, n())
        } : r.onload = function() {
            n()
        }, i.appendChild(r)
    }, r.superLoad = function(t, e) {
        function n() {
            i--, 0 === i && e(a)
        }

        function o(t) {
            return function(e) {
                e && (t.result = e, t.name && (a[t.name] = e)), n()
            }
        }
        for (var i = t.length, a = {}, s = 0; s < t.length; s++) {
            var p = t[s];
            switch (p.type) {
                case "script":
                    r.loadScript(p.url, o(p), p.crossOrigin);
                    break;
                case "text":
                    r.loadText(p.url, o(p));
                    break;
                case "json":
                    p.loadFunc ? p.loadFunc().then(o(p)) : r.loadJSON(p.url, o(p))
            }
        }
    }, e.LibraryManager = r
}, this.FBPublication || (this.FBPublication = {})),
function(t) {
    "use strict";
    window.FBPublication = window.FBPublication || {};
    var e = window.FBPublication.Initial = window.FBPublication.Initial || {};
    e.isFunction = function(t) {
        return "function" == typeof t || !1
    }, e.isString = function(t) {
        return "[object String]" === Object.prototype.toString.call(t)
    }, e.isArray = Array.isArray || function(t) {
        return "[object Array]" === Object.prototype.toString.call(t)
    }, e.loadCSS = function(n, o) {
        var i = function(n) {
            var i = t.document.getElementsByTagName("head")[0],
                r = t.document.createElement("link");
            r.href = n, r.type = "text/css", r.rel = "stylesheet", e.isString(o) && (r.id = o), o && document.getElementById(o) ? i.replaceChild(r, document.getElementById(o)) : i.appendChild(r)
        };
        i(n)
    }, e.queryString = function() {
        var e = {},
            n = t.location.search.substring(1);
        if ("" === n) return e;
        for (var o = n.split("&"), i = 0; i < o.length; i++)
            if ("" !== o[i]) {
                var r = o[i].split("=");
                if ("undefined" == typeof e[r[0]]) e[r[0]] = r[1];
                else if ("string" == typeof e[r[0]]) {
                    var a = [e[r[0]], r[1]];
                    e[r[0]] = a
                } else e[r[0]].push(r[1])
            } return e
    }()
}(this),
function(t, e) {
    "use strict";
    "undefined" != typeof exports ? t(global, exports) : e.fbUtils = t(window, {})
}(function(t, e) {
    "use strict";
    return e.mergeObjects = function(t, e) {
        var n = {};
        for (var o in t) t.hasOwnProperty(o) && (n[o] = t[o]);
        for (var o in e) e.hasOwnProperty(o) && (n[o] = e[o]);
        return n
    }, e.decodeHtml = function(t) {
        var e = document.createElement("textarea");
        return e.innerHTML = t, e.value
    }, e
}, this),
function(t, e) {
    "use strict";
    if ("undefined" != typeof exports) {
        var n = require("../events").BaseEvents;
        t(global, exports, n)
    } else t(e, e, e.FBPublication.BaseEvents)
}(function(t, e, n) {
    "use strict";

    function o() {
        this.callback = null, this.isReady = !0
    }
    o.prototype = new n, o.prototype.constructor = o, o.prototype.ready = function() {
        this.isReady = !0, this.trigger("ready")
    }, o.prototype.setCallback = function(t) {
        this.callback = t
    }, o.prototype.getPathInfo = function() {
        throw new Error("Method getPathInfo() should be overridden")
    }, o.prototype.setPath = function() {
        throw new Error("Method setPath() should be overridden")
    }, o.prototype.getShareUrl = function() {
        throw new Error("Method getShareUrl() should be overridden")
    }, o.prototype.getEmbedUrl = function() {
        throw new Error("Method getEmbedUrl() should be overridden")
    }, o.prototype.translatePath = function() {
        throw new Error("Method translatePath() should be overridden")
    }, o.prototype.getFirstPage = function() {
        throw new Error("Method getEmbedPrefix() should be overridden")
    }, o.prototype.getCurrentPage = function() {
        throw new Error("Method getEmbedPrefix() should be overridden")
    }, o.prototype.getVersions = function() {
        throw new Error("Method getEmbedPrefix() should be overridden")
    }, o.prototype.getEmbedPrefix = function() {
        throw new Error("Method getEmbedPrefix() should be overridden")
    }, e.AbstractAdapter = o
}, this),
function(t, e) {
    "use strict";
    if ("undefined" != typeof exports) {
        var n = require("./abstract-adapter").AbstractAdapter;
        t(global, exports, n)
    } else t(e, e, e.AbstractAdapter)
}(function(t, e, n) {
    "use strict";

    function o(e) {
        this.mappings = e, this.baseUrl = "", t.location && (this.baseUrl = t.location.href.split("#")[0])
    }
    o.prototype = new n, o.constructor = o, o.prototype.translatePath = function(t) {
        if (this.mappings.hasOwnProperty("length"))
            for (var e = 0; e < this.mappings.length; e++)
                if (0 === t.indexOf(this.mappings[e][0])) return t.replace(this.mappings[e][0], this.mappings[e][1]);
        for (var n in this.mappings)
            if (this.mappings.hasOwnProperty(n) && 0 === t.indexOf(n)) return t.replace(n, this.mappings[n]);
        return t
    }, o.prototype.getShareUrl = function() {
        return this.baseUrl
    }, o.prototype.getEmbedUrl = function() {
        return this.baseUrl
    }, o.prototype.getCrossOrigin = function() {
        return !1
    }, e.AbstractLocalAdapter = o
}, this),
function(t, e) {
    "use strict";
    if ("undefined" != typeof exports) {
        var n = require("./local").AbstractLocalAdapter;
        t(global, exports, n)
    } else t(e, e, e.AbstractLocalAdapter)
}(function(t, e, n) {
    "use strict";

    function o(e) {
        function o() {
            var e = t.location.href.replace(r.options.baseUrl, "");
            return e = e.replace(t.location.hash, ""), e = e.split("?")[0], e = e.replace(r.options.currentPage + "/", ""), e === r.options.index
        }
        var i = {
            mappings: {},
            firstPage: "1",
            editorMode: !1,
            hashMode: !1,
            embedPrefix: "fbo",
            index: "index.html",
            crossOrigin: !1,
            uni: "2.19.4"
        };
        this.options = this._mergeObjects(i, e || {}), n.call(this, this.options.mappings), this.isReady = !1, this.options.hasOwnProperty("baseUrl") && (this.baseUrl = this.options.baseUrl);
        var r = this;
        if (t.history && t.history.pushState && !this.options.editorMode && !this.options.hashMode && addEventListener("popstate", function() {
                r._urlChanged.call(r)
            }), this.options.sign) {
            var a = this.getBaseUrl(),
                s = this.options.sign,
                r = this,
                p = function(t) {
                    r.isIndexAvailableAsDefault = t, r.ready()
                };
            t.FBPublication.LibraryManager.loadText(a, function(t) {
                var e = t.indexOf(s);
                p(e >= 0)
            }, function() {
                p(!1)
            })
        } else this.isIndexAvailableAsDefault = !o(), r.ready()
    }
    o.prototype = new n, o.prototype.constructor = o, o.prototype.getFirstPage = function() {
        return this.options.firstPage
    }, o.prototype.getCurrentPage = function() {
        return this.options.currentPage || this.getPathInfo().page
    };
    var i = /^([^\?]*)(\?.*)/;
    o.prototype.getPathInfo = function() {
        if (!t.location) return null;
        var e = t.location.href.replace(this.options.baseUrl, "");
        e = e.replace(t.location.hash, ""), e = e.replace(this.options.index, "");
        var n = null,
            o = e.split("?")[0].split("/");
        o[1] && "" !== o[1] ? n = o[1] : o[0] && "" !== o[0] && (n = o[0]);
        var r, a = {};
        r = "#" === t.location.hash.substr(0, 1) ? t.location.hash.substr(1) : t.location.hash;
        for (var s, p = {}, l = r.split("&"), d = 0; d < l.length; d++) s = l[d].split("="), p[s.length > 1 ? decodeURIComponent(s[0]) : "page"] = s.length > 1 ? decodeURIComponent(s[1]) : s[0];
        var h = new RegExp("^[\\w-]+.(html|htm|aspx|asp|jsp|php|xhtml)$", "i");
        p.page ? a.page = p.page : p.p ? a.page = p.p : n && null !== n && !h.test(n) ? a.page = n : a.page = this.options.firstPage, a.page && (a.page = a.page.replace(i, "$1"));
        var c = (p.zoom || p.z || "").replace(i, "$1");
        return a.zoom = "z" === c, a
    }, o.prototype.getBaseUrl = function(t) {
        return t ? this.baseUrl + ("/" === this.baseUrl[this.baseUrl.length - 1] ? "" : "/") : this.baseUrl
    }, o.prototype.setPath = function(e) {
        var n = this.getPath(e);
        null !== n && (!n.hash && n.historyApiEnabled ? t.history.pushState(e, null, n.url) : t.location && (n.historyApiEnabled && t.location.href.indexOf(n.url) < 0 && t.history.pushState(e, null, n.url), t.location.hash !== "#" + n.hash && (t.location.hash = "#" + n.hash)))
    }, o.prototype.getPath = function(e) {
        if (this.options.editorMode) return null;
        var n = {
                info: e,
                historyApiEnabled: t.history && t.history.pushState && !this.options.hashMode
            },
            o = this._getUrlParams(e, n.historyApiEnabled);
        return n.url = this.getBaseUrl(o.url || !this.isIndexAvailableAsDefault) + o.url + (this.isIndexAvailableAsDefault ? "" : this.options.index), n.historyApiEnabled ? o.params && (n.hash = o.params) : (o = this._getUrlParams(e), n.hash = o.params), n
    }, o.prototype.getShareUrl = function(t, e, n) {
        var o = this.getPathInfo(),
            i = this._getUrlParams(o, this.options.hashMode === !1 && !n),
            r = this.getBaseUrl(t && o.page || !this.isIndexAvailableAsDefault);
        return t && o.page && (r += i.url), r += this.isIndexAvailableAsDefault ? "" : this.options.index, e && (r += (r.indexOf("?") > 0 ? "&" : "?") + "utm_source=" + e), t && o.page && i.params && (r += "#" + i.params), r
    }, o.prototype.getEmbedPrefix = function() {
        return this.options.embedPrefix
    }, o.prototype._getUrlParams = function(t, e) {
        var n = [],
            o = "",
            i = "";
        return t.zoom && n.push("zoom=z"), t.page && (e ? (i = this.options.firstPage === t.page.toString() ? "" : t.page + "/", n.length > 0 && (o += "")) : (o = this.options.firstPage === t.page.toString() ? "" : "page=" + t.page, o.length > 0 && n.length > 0 && (o += "&"))), o += n.join("&"), {
            url: i,
            params: o
        }
    }, o.prototype._urlChanged = function() {
        if (t.location) {
            var e = this.getPathInfo();
            e && this.callback && this.callback(e)
        }
    }, o.prototype._mergeObjects = function(t, e) {
        var n = {};
        for (var o in t) t.hasOwnProperty(o) && (n[o] = t[o]);
        for (var o in e) e.hasOwnProperty(o) && (n[o] = e[o]);
        return n
    }, o.prototype.getCrossOrigin = function() {
        return this.options.crossOrigin
    }, o.prototype.translatePath = function() {
        var t = n.prototype.translatePath.apply(this, arguments);
        return t += (t.indexOf("?") === -1 ? "?uni=" : "&uni=") + this.options.uni
    }, e.HistoryApiAdapter = o
}, this),
function(t, e) {
    "use strict";
    "undefined" != typeof exports ? t(global, exports) : t(e, e)
}(function(t, e) {
    "use strict";

    function n(t, e) {
        this.userAgentInfo = t, this.priorities = e.versions
    }
    n.prototype.constructor = n, n.prototype.getSupportedVersions = function() {
        var t, e = [];
        if (this.userAgentInfo.browser.ie && (t = (this.userAgentInfo.browser.version || "7.0").split(".")[0]), this.userAgentInfo.device.desktop) this.userAgentInfo.browser.ie ? t > 10 && e.push("html") : e.push("html");
        else {
            var n = this.userAgentInfo.os.ios,
                o = this.userAgentInfo.os.android && (parseInt(this.userAgentInfo.os.version.split(".")[0], 10) > 4 || 4 === parseInt(this.userAgentInfo.os.version.split(".")[0], 10) && parseInt(this.userAgentInfo.os.version.split(".")[1], 10) >= 1);
            (n || o) && ((n && parseInt(this.userAgentInfo.os.version.split(".")[0], 10) >= 10 || o && parseInt(this.userAgentInfo.os.version.split(".")[0], 10) >= 6) && !this.userAgentInfo.browser.firefox ? e.push("mobile") : e.push("mobile-old"))
        }
        return (!this.userAgentInfo.browser.ie || t >= 10) && e.push("basic"), e
    }, n.prototype.mainVersion = function() {
        var t = this.getSupportedVersions();
        if (this.priorities) {
            for (var e = 0; e < this.priorities.length; e++)
                for (var n = 0; n < t.length; n++)
                    if (t[n].indexOf(this.priorities[e]) !== -1) return t[n]
        } else if (t && t.length > 0) return t[0];
        return null
    }, n.prototype.isRenderable = function() {
        return !0
    }, e.PublicationDetector = n
}, this),
function(t, e) {
    "use strict";
    "undefined" != typeof exports ? t(global, exports) : t(e, e)
}(function(t, e) {
    "use strict";

    function n(e) {
        this._navigator = e ? e : t.navigator ? t.navigator : window ? window.navigator : void 0, this.browser = this._getBrowser(), this.flash = this._getFlash(), this.os = this._getOS(), this.device = this._getDevice(), this.locales = this._getLocales(), this.locale = this.locales ? this.locales[0] : void 0
    }
    n.prototype.constructor = n, n.prototype._getBrowser = function() {
        var t, e = "undefined" != typeof this._navigator ? this._navigator.userAgent.toLowerCase() : "",
            n = function(t) {
                var n = e.match(t);
                return n && n.length > 1 && n[1] || ""
            },
            o = /CrOS/.test(e),
            i = n(/edge\/(\d+(\.\d+)?)/i),
            r = n(/version\/(\d+(\.\d+)?)/i),
            a = !1;
        return /opera|opr/i.test(e) ? t = {
            name: "Opera",
            opera: !0,
            version: r || n(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
        } : /yabrowser/i.test(e) ? t = {
            name: "Yandex Browser",
            yandexbrowser: !0,
            version: r || n(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
        } : /windows phone/i.test(e) ? (a = !0, t = {
            name: "Windows Phone IE",
            ie: !0
        }, i ? (t.msedge = !0, t.version = i) : (t.msie = !0, t.version = n(/iemobile\/(\d+(\.\d+)?)/i))) : /msie|trident/i.test(e) ? (t = {
            name: "Internet Explorer",
            msie: !0,
            ie: !0,
            version: n(/(?:msie |rv:)(\d+(\.\d+)?)/i)
        }, /trident/i.test(e) && ("7.0" === t.version && "4.0" === n(/(?:trident\/)(\d+(\.\d+)?)/i) && (t.version = "8.0"), "7.0" === t.version && "5.0" === n(/(?:trident\/)(\d+(\.\d+)?)/i) && (t.version = "9.0"))) : t = /silk/i.test(e) ? {
            name: "Amazon Silk",
            silk: !0,
            version: n(/silk\/(\d+(\.\d+)?)/i)
        } : o ? {
            name: "Chrome",
            chrome: !0,
            version: n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
        } : /chrome.+? edge/i.test(e) ? {
            name: "Microsoft Edge",
            ie: !0,
            msedge: !0,
            version: i
        } : /chrome|crios|crmo/i.test(e) ? {
            name: "Chrome",
            chrome: !0,
            version: n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
        } : /seamonkey\//i.test(e) ? {
            name: "SeaMonkey",
            seamonkey: !0,
            version: n(/seamonkey\/(\d+(\.\d+)?)/i)
        } : /firefox|iceweasel/i.test(e) ? {
            name: "Firefox",
            firefox: !0,
            version: n(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
        } : /phantom/i.test(e) ? {
            name: "PhantomJS",
            phantom: !0,
            version: n(/phantomjs\/(\d+(\.\d+)?)/i)
        } : /safari/i.test(e) ? {
            name: "Safari",
            safari: !0,
            version: r
        } : {
            other: !0
        }, a || t.msie || t.msedge || !/(apple)?webkit/i.test(e) ? !t.opera && /gecko\//i.test(e) && (t.name = t.name || "Gecko", t.gecko = !0, t.version = t.version || n(/gecko\/(\d+(\.\d+)?)/i)) : (t.name = t.name || "Webkit", t.webkit = !0, !t.version && r && (t.version = r)), t.name || (t.name = "Other"), e.toLowerCase().indexOf("publisher") !== -1 && (t.publisher = !0), t
    }, n.prototype._getFlash = function() {
        var e = "undefined",
            n = "object",
            o = "Shockwave Flash",
            i = "ShockwaveFlash.ShockwaveFlash",
            r = "application/x-shockwave-flash",
            a = null;
        if (_typeof(this._navigator.plugins) !== e && _typeof(this._navigator.plugins[o]) === n) {
            var s = this._navigator.plugins[o].description;
            if (s && (_typeof(this._navigator.mimeTypes) === e || !this._navigator.mimeTypes[r] || this._navigator.mimeTypes[r].enabledPlugin)) {
                var p = !1;
                s = s.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), a = [parseInt(s.replace(/^(.*)\..*$/, "$1"), 10), parseInt(s.replace(/^.*\.(.*)\s.*$/, "$1"), 10), /[a-zA-Z]/.test(s) ? parseInt(s.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0]
            }
        } else if (_typeof(t.ActiveXObject) !== e) try {
            var l = new t.ActiveXObject(i);
            l && (s = l.GetVariable("$version"), s && (p = !0, s = s.split(" ")[1].split(","), a = [parseInt(s[0], 10), parseInt(s[1], 10), parseInt(s[2], 10)]))
        } catch (d) {}
        return a
    }, n.prototype._getOS = function() {
        var t = "undefined" != typeof this._navigator ? this._navigator.userAgent.toLowerCase() : "",
            e = function(e) {
                var n = t.match(e);
                return n && n.length > 1 && n[1] || ""
            },
            n = {
                name: "Other",
                other: !0
            },
            o = e(/(ipod|iphone|ipad)/i).toLowerCase(),
            i = /like android/i.test(t),
            r = !i && /android/i.test(t),
            a = e(/version\/(\d+(\.\d+)?)/i);
        return o ? n = {
            name: "iOS",
            version: e(/os\s(\d+_*\d*_*\d*)/).split("_").join("."),
            ios: !0
        } : r ? n = {
            name: "Android",
            version: e(/android\s(\d+\.*\d*\.*\d*)/),
            android: !0
        } : /mac os/.test(t) ? n = {
            name: "Mac OS",
            mac: !0
        } : /windows/i.test(t) ? n = {
            name: "Windows",
            windows: !0
        } : /playbook|blackberry|\bbb\d+/i.test(t) || /rim\stablet/i.test(t) ? n = {
            name: "Blackberry",
            blackberry: !0,
            version: a || e(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
        } : /(web|hpw)os/i.test(t) ? (n = {
            name: "WebOS",
            webos: !0,
            version: a || e(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
        }, /touchpad\//i.test(t) && (n.touchpad = !0)) : /bada/i.test(t) ? n = {
            name: "Bada",
            bada: !0,
            version: e(/dolfin\/(\d+(\.\d+)?)/i)
        } : /tizen/i.test(t) ? n = {
            name: "Tizen",
            tizen: !0,
            version: e(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || a
        } : /sailfish/i.test(t) ? n = {
            name: "Sailfish",
            sailfish: !0,
            version: e(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
        } : /firefox|iceweasel/i.test(t) && /\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(t) && (n = {
            name: "Firefox OS",
            firefoxos: !0
        }), n
    }, n.prototype._getDevice = function() {
        var t = "undefined" != typeof this._navigator ? this._navigator.userAgent.toLowerCase() : "",
            e = {},
            n = /like android/i.test(t),
            o = !n && /android/i.test(t),
            i = /cros/.test(t);
        return e.name = t.match(/ipad/) ? "ipad" : t.match(/ipod/) ? "ipod" : t.match(/iphone/) ? "iphone" : o ? "android" : t.match(/windows phone/) ? "wphone" : t.match(/mobile/) ? "mobile" : t.match(/mac|win|linux/) || i ? "desktop" : "other", e[e.name] = !0, e
    }, n.prototype._getLocales = function() {
        if ("undefined" != typeof this._navigator) {
            if (this._navigator.languages && this._navigator.languages.length > 0) {
                for (var t, e = [], n = 0; n < this._navigator.languages.length; n++) t = this._navigator.languages[n], t = t.split("_")[0].split("-")[0], e.indexOf(t) === -1 && e.push(t);
                return e
            }
            var o = this._navigator.language || this._navigator.browserLanguage || this._navigator.userLanguage;
            if (o) {
                var i = o.split("_")[0].split("-")[0];
                return [i]
            }
        }
    }, e.UserAgentDetector = n
}, this),
function(t, e) {
    "use strict";
    if ("undefined" != typeof exports) {
        var n = require("./fb-utils");
        t(global, exports, n)
    } else t(e, e, e.fbUtils)
}(function(t, e, n) {
    "use strict";

    function o() {
        if (!window.getComputedStyle) return !1;
        var t, e = document.createElement("p"),
            n = {
                webkitTransform: "-webkit-transform",
                OTransform: "-o-transform",
                msTransform: "-ms-transform",
                MozTransform: "-moz-transform",
                transform: "transform"
            };
        document.body.insertBefore(e, null);
        for (var o in n) void 0 !== e.style[o] && (e.style[o] = "translate3d(1px,1px,1px)", t = window.getComputedStyle(e).getPropertyValue(n[o]));
        return document.body.removeChild(e), void 0 !== t && t.length > 0 && "none" !== t
    }

    function i(t) {
        var e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
        return e ? {
            r: parseInt(e[1], 16),
            g: parseInt(e[2], 16),
            b: parseInt(e[3], 16)
        } : null
    }

    function r(e, o, i, r, a) {
        var s = {
                backgroundColor: "#0b97c4",
                titleColor: "#fff",
                titleText: "",
                coverSrc: "",
                logoLink: {
                    image: "",
                    url: ""
                }
            },
            p = this,
            l = "mobile" === a ? "fixed" : "absolute";
        this.browser = r, this.adapter = o, this.options = n.mergeObjects(s, i), this.preloader = t.document.createElement("div"), this.preloader.id = "preloader", this.preloader.style.width = "100%", this.preloader.style.height = "100%", this.preloader.style.lineHeight = window.innerHeight + "px", this.preloader.style.position = l, this.preloader.style.top = "0px", this.preloader.style.left = "0px", this.preloader.style.right = "0px", this.preloader.style.bottom = "0px", this.browser.publisher && (this.preloader.className = "no-fade-in"), this.preloader.style.backgroundColor = this.options.backgroundColor, this.preloader.style.zIndex = 1e6, this._resize = function() {
            p.preloader.style.lineHeight = window.innerHeight + "px", p._setCoverSize()
        }, t.addEventListener("resize", this._resize), this._preventZoom = function(t) {
            t.preventDefault()
        }, this.preloader.addEventListener("touchstart", this._preventZoom, !0), e.appendChild(this.preloader), "" !== this.options.coverSrc && this.options.coverSrc ? this._renderCoverPreloader() : this._renderNewPreloader(), setTimeout(function() {
            p._resize()
        }, 10)
    }
    r.prototype._renderCoverPreloader = function() {
        var e, o;
        this.preloader.style.textAlign = "center", this._applyCoverStyles(), e = t.document.createElement("div"), e.className = "preloader-container", o = t.document.createElement("h3"), o.className = "preloader-title", o.innerText = n.decodeHtml(this.options.titleText), e.appendChild(o), this.coverContainer = t.document.createElement("div"), this.coverContainer.className = "preloader-cover", e.appendChild(this.coverContainer), "undefined" != typeof this.options.logoLink && this.options.logoLink.image && (this.logoContainer = t.document.createElement("a"), this.options.logoLink.url && (this.logoContainer.href = this.options.logoLink.url, this.logoContainer.target = this.options.logoLink.target || "_blank"), this.logoContainer.className = "preloader-logo", e.appendChild(this.logoContainer), this._tuneLogoSize()), this._injectImage(), this.preloader.appendChild(e)
    }, r.prototype._renderNewPreloader = function() {
        this._applyNewStyles();
        var e = t.document.createElement("div");
        e.className = "preloader-title-container";
        var i = t.document.createElement("h3");
        i.className = "preloader-title", i.innerText = n.decodeHtml(this.options.titleText), e.appendChild(i), this.preloader.appendChild(e), this.browser.msie ? this._renderFallbackPreloader() : o() ? this._render3dPreloader() : this._renderFallbackPreloader(), "undefined" != typeof this.options.logoLink && this.options.logoLink.image && (this.logoContainer = t.document.createElement("a"), this.options.logoLink.url && (this.logoContainer.href = this.options.logoLink.url, this.logoContainer.target = this.options.logoLink.target || "_blank"), this.logoContainer.className = "preloader-logo", this.preloader.appendChild(this.logoContainer), this._tuneLogoSize());
        var r = this;
        this.browser.publisher || setTimeout(function() {
            r.preloader.className = "show-on"
        }, 10)
    }, r.prototype._render3dPreloader = function() {
        this._apply3dBookStyles();
        var e = t.document.createElement("div"),
            n = t.document.createElement("div");
        n.className = "book-preloader", n.innerHTML = '\n        <div class="first-page-root"></div>\n        <div class="page10"></div>\n        <div class="page9"></div>\n        <div class="page8"></div>\n        <div class="page7"></div>\n        <div class="page6"></div>\n        <div class="page5"></div>\n        <div class="page4"></div>\n        <div class="page3"></div>\n        <div class="page2"></div>\n        <div class="page1"></div>\n        <div class="sec-page-root"></div>', e.appendChild(n), e.className = "book-preloader-shell", this.preloader.appendChild(e), setTimeout(function() {
            n.className = "book-preloader animation", this.bookInt = setInterval(function() {
                n.className = "book-preloader", setTimeout(function() {
                    n.className = "book-preloader animation"
                }, 100)
            }, 3300)
        }, 400)
    }, r.prototype._renderFallbackPreloader = function() {
        this._applyFallbackStyles();
        var e = t.document.createElement("div");
        e.className = "loading";
        var n = t.document.createElement("div");
        n.className = "inner", e.appendChild(n), this.preloader.appendChild(e)
    }, r.prototype._resize = function() {}, r.prototype._preventZoom = function() {}, r.prototype._applyCoverStyles = function() {
        var e, n, o = t.document.createElement("style");
        e = this.adapter.translatePath(this.options.coverSrc), n = "\n\t\t\t\t.preloader-container{\n\t\t\t\t\tline-height: 1;\n\t\t\t\t\toverflow: hidden;\n\t\t\t\t\ttext-align: center;\n\t\t\t\t\tdisplay: inline-block;\n\t\t\t\t\tvertical-align: middle;\n\t\t\t\t\twidth: 500px;\n\t\t\t\t}\n\t\t\n\t\t\t\t.preloader-title{\n\t\t\t\t\tmax-height: 55px;\n\t\t\t\t\twidth: 100%;\n\t\t\t\t\toverflow: hidden;\n\t\t\t\t\tfont-family: Arial, sans-serif;\n\t\t\t\t\tfont-weight: bold;\n\t\t\t\t\tfont-size: 24px;\n\t\t\t\t\tline-height: 1.2;\n\t\t\t\t\tmargin: 0;\n\t\t\t\t\tdisplay: inline-block;\n\t\t\t\t\tcolor: " + this.options.titleColor + ";\n\t\t\t\t}\n\t\t\n\t\t\t\t.preloader-cover{\n\t\t\t\t\tdisplay: inline-block;\n\t\t\t\t\tmargin: 70px 0;\n\t\t\t\t\twidth: 300px;\n\t\t\t\t\theight: 300px;\n\t\t\t\t\tposition: relative;\n\t\t\t\t\toverflow: hidden;\n\t\t\t\t}\n\t\t\n\t\t\t\t.preloader-cover img{\n\t\t\t\t\tposition: absolute;\n\t\t\t\t\tclip: rect(auto, 0px, auto, auto);\n\t\t\t\t}\n\t\t\n\t\t\t\t.preloader-cover:after{\n\t\t\t\t\tcontent: '';\n\t\t\t\t\ttop: 0;\n\t\t\t\t\tleft: 0;\n\t\t\t\t\twidth: 100%;\n\t\t\t\t\theight: 100%;\n\t\t\t\t\tbackground-image: url('" + e + "');\n\t\t\t\t\tbackground-position: 50% 50%;\n\t\t\t\t\tbackground-repeat: no-repeat;\n\t\t\t\t\tbackground-size: contain;\n\t\t\t\t\tposition: absolute;\n\t\t\t\t\topacity: 0.4;\n\t\t\t\t}\n\t\t\n\t\t\t\t.preloader-logo{\n\t\t\t\t\tdisplay: inline-block;\n\t\t\t\t\twidth: 250px;\n\t\t\t\t\theight: 190px;\n\t\t\t\t\t\n\t\t\t\t\tbackground-position: 50% 50%;\n\t\t\t\t\tbackground-repeat: no-repeat;\n\t\t\t\t\tbackground-size: contain;\n\t\t\t\t\tmargin: 0 100px;\n\t\t\t\t\tbox-sizing: content-box;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t@media all and (max-width: 1300px), all and (max-height: 768px){\n\t\t\t\t\t.preloader-container{\n\t\t\t\t\t\twidth: 500px;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-title{\n\t\t\t\t\t\twidth: 500px;\n\t\t\t\t\t\tmax-height: 55px;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-cover{\n\t\t\t\t\t\twidth: 240px;\n\t\t\t\t\t\theight: 240px;\n\t\t\t\t\t\tmargin: 50px 0;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-logo{\n\t\t\t\t\t\twidth: 240px;\n\t\t\t\t\t\theight: 90px;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t@media all and (max-width: 600px), all and (max-height: 600px){\n\t\t\t\t\t.preloader-container{\n\t\t\t\t\t\twidth: 500px;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-title{\n\t\t\t\t\t\twidth: 500px;\n\t\t\t\t\t\tmax-height: 55px;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-cover{\n\t\t\t\t\t\twidth: 200px;\n\t\t\t\t\t\theight: 200px;\n\t\t\t\t\t\tmargin: 20px 0 30px 0;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-logo{\n\t\t\t\t\t\twidth: 200px;\n\t\t\t\t\t\theight: 85px;\n\t\t\t\t\t\tmargin: 0 100px;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t@media all and (max-width: 550px), all and (max-height: 450px){\n\t\t\t\t\t.preloader-container{\n\t\t\t\t\t\twidth: 350px;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-title{\n\t\t\t\t\t\twidth: 350px;\n\t\t\t\t\t\tmax-height: 40px;\n\t\t\t\t\t\tfont-size: 18px;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-cover{\n\t\t\t\t\t\twidth: 160px;\n\t\t\t\t\t\theight: 160px;\n\t\t\t\t\t\tmargin: 10px 0;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-logo{\n\t\t\t\t\t\twidth: 160px;\n\t\t\t\t\t\theight: 40px;\n\t\t\t\t\t\tmargin: 0 80px;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t@media all and (max-width: 400px), all and (max-height: 300px){\n\t\t\t\t\t.preloader-container{\n\t\t\t\t\t\twidth: 190px;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-title{\n\t\t\t\t\t\twidth: 190px;\n\t\t\t\t\t\tmax-height: 40px;\n\t\t\t\t\t\tfont-size: 16px;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-cover{\n\t\t\t\t\t\twidth: 100px;\n\t\t\t\t\t\theight: 100px;\n\t\t\t\t\t\tmargin: 10px 0;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-logo{\n\t\t\t\t\t\twidth: 100px;\n\t\t\t\t\t\theight: 34px;\n\t\t\t\t\t\tmargin: 0 40px;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t@media all and (max-width: 242px), all and (max-height: 212px){\n\t\t\t\t\t\n\t\t\t\t\t.preloader-title{\n\t\t\t\t\t\tdisplay: none;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-cover{\n\t\t\t\t\t\twidth: 100px;\n\t\t\t\t\t\theight: 100px;\n\t\t\t\t\t\tmargin: 0;\n\t\t\t\t\t}\n\t\t\t\t\t.preloader-logo{\n\t\t\t\t\t\tdisplay: none;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\t", o.appendChild(t.document.createTextNode(n)), document.getElementsByTagName("head")[0].appendChild(o)
    }, r.prototype._applyNewStyles = function() {
        var e, n = t.document.createElement("style"),
            o = 584,
            i = o / 2,
            r = 180,
            a = 68,
            s = 28,
            p = 150,
            l = 124,
            d = p / 2,
            h = 54;
        e = "\n                .preloader-title-container {\n                    height: " + a + "px;\n                    width: " + o + "px;\n                    top: 50%;\n                    left: 50%;\n                    margin: -" + r + "px 0 0 -" + i + "px;\n                    position: absolute;\n                }\n                \n                .preloader-title {\n                    width: 100%;\n                    max-height: " + a + "px;\n                    overflow: hidden;\n                    font-family: Helvetica, Arial, sans serif;\n                    \n                    font-size: " + s + "px;\n                    line-height: 1.2;\n                    display: inline-block;\n                    color:  " + this.options.titleColor + ";\n                    position: absolute;\n                    bottom: 0;\n                    text-align: center;\n                }\n                \n                .preloader-logo {\n                    position: absolute;\n                    left: 50%;\n                    bottom: " + h + "px;\n                    margin-left: -" + d + "px;\n                    display: inline-block;\n                    width: " + p + "px;\n                    height: " + l + "px;\n                    \n                    background-position: 50% 100%;\n                    background-repeat: no-repeat;\n                    background-size: contain;\n                    box-sizing: content-box;\n                }\n                \n                .preloader-title-container {\n                    height: " + 1.2 * a + "px;\n                    width: " + 1.2 * o + "px;\n                    margin: " + 1.2 * -r + "px 0 0 -" + 1.2 * i + "px;\n                }\n                \n                .preloader-title {\n                    max-height: " + 1.2 * a + "px;\n                    font-size: " + 1.2 * s + "px;\n                }\n                \n                .preloader-logo {\n                    bottom: " + 1.3 * h + "px;\n                    margin-left: " + -1.3 * d + "px;\n                    width: " + 1.3 * p + "px;\n                    height: " + 1.3 * l + "px;\n                }\n                \n                #preloader > div, #preloader > a{\n                    opacity: 0;\n                    transition: opacity 1s;\n                }\n                #preloader.show-on > div, #preloader.show-on > a, #preloader.no-fade-in > div, #preloader.no-fade-in > a{\n                    opacity: 1;\n                }\n                \n                #preloader.show-off > div, #preloader.show-off > a{\n                    transition: opacity 0.2s;\n                }\n                #preloader.show-off, #preloader.show-off{\n                   \n                    transition: opacity 0.4s ease-out 0.2s;\n                    opacity: 0;\n                }\n                \n                @media all and (max-width: 1300px), all and (max-height: 768px) {\n                    .preloader-title-container {\n                        height: " + a + "px;\n                        width: " + o + "px;\n                        margin: -" + r + "px 0 0 -" + i + "px;\n                    }\n                \n                    .preloader-title {\n                        max-height: " + a + "px;\n                        font-size: " + s + "px;\n                    }\n                \n                    .preloader-logo {\n                        bottom: " + h + "px;\n                        margin-left: -" + d + "px;\n                        width: " + p + "px;\n                        height: " + l + "px;\n                    }\n                }\n                \n                @media all and (max-width: 600px), all and (max-height: 600px) {\n                    .preloader-title-container {\n                        height: " + .8 * a + "px;\n                        width: " + .8 * o + "px;\n                        margin: " + .8 * -r + "px 0 0 -" + .8 * i + "px;\n                    }\n                \n                    .preloader-title {\n                        max-height: " + .8 * a + "px;\n                        font-size: " + .8 * s + "px;\n                    }\n                \n                    .preloader-logo {\n                        bottom: " + .8 * h + "px;\n                        margin-left: " + -.8 * d + "px;\n                        width: " + .8 * p + "px;\n                        height: " + .8 * l + "px;\n                    }\n                }\n                \n                @media all and (max-width: 550px), all and (max-height: 450px) {\n                    .preloader-title-container {\n                        height: " + .7 * a + "px;\n                        width: " + .7 * o + "px;\n                        margin: " + .8 * -r + "px 0 0 -" + .7 * i + "px;\n                    }\n                \n                    .preloader-title {\n                        max-height: " + .7 * a + "px;\n                        font-size: " + .7 * s + "px;\n                    }\n                \n                    .preloader-logo {\n                        bottom: " + .6 * h + "px;\n                        margin-left: " + -.6 * d + "px;\n                        width: " + .6 * p + "px;\n                        height: " + .6 * l + "px;\n                    }\n                }\n                \n                @media all and (max-width: 400px), all and (max-height: 300px) {\n                    .preloader-title-container {\n                        height: " + .6 * a + "px;\n                        width: " + .6 * o + "px;\n                        margin: " + .7 * -r + "px 0 0 " + -.6 * i + "px;\n                    }\n                \n                    .preloader-title {\n                        max-height: " + .6 * a + "px;\n                        font-size: " + .6 * s + "px;\n                    }\n                \n                    .preloader-logo {\n                        bottom: " + .4 * h + "px;\n                        margin-left: " + -.4 * d + "px;\n                        width: " + .4 * p + "px;\n                        height: " + .4 * l + "px;\n                    }\n                }\n                \n                @media all and (max-width: 242px), all and (max-height: 212px) {\n                    .preloader-title-container{\n                        display: none;\n                    }\n                    .preloader-logo{\n                        display: none;\n                    }\n                }\n        ",
            n.appendChild(t.document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(n)
    }, r.prototype._apply3dBookStyles = function() {
        var e, n = t.document.createElement("style"),
            o = 60,
            r = .75 * o,
            a = o / 10,
            s = 2,
            p = -160,
            l = -20,
            d = o / 2,
            h = o / 2 - s,
            c = i(this.options.backgroundColor),
            u = .85;
        "#000000" === this.options.backgroundColor && (c.r = 35, c.g = 35, c.b = 35), c.r = (c.r * u).toFixed(0), c.g = (c.g * u).toFixed(0), c.b = (c.b * u).toFixed(0), e = "\n                .preloader{\n                    will-change: opacity;\n                }\n                .book-preloader-shell {\n                    border: none;\n                    width: " + o + "px;\n                    height: " + r + "px;\n                    position: absolute;\n                    top: 50%;\n                    left: 50%;\n                    margin-top: -" + r + "px;\n                    margin-left: -" + d + "px;\n                    background-color: " + this.options.backgroundColor + ";\n                    box-sizing: border-box;\n                }\n                .book-preloader {\n                    width: 100%;\n                    height: 100%;\n                    perspective: " + o * (this.browser.chrome ? 3 : 1.5) + "px;\n                    perspective-origin: 50% 50%;\n                    transform-style: preserve-3d;\n                }\n                \n                .animation {\n                    animation-name: book;\n                }\n                \n                .sec-page-root, .first-page-root, .page1, .page2, .page3, .page4, .page5, .page6, .page7, .page8, .page9, .page10 {\n                    border: " + s + "px solid  " + this.options.titleColor + ";\n                    border-left: 0px solid rgba(255, 255, 255, 0.6);\n                    box-sizing: border-box;\n                    width: " + o / 2 + "px;\n                    height: " + r + "px;\n                    position: absolute;\n                    left: " + h + "px;\n                    top: 0;\n                    border-radius: 0 " + a + "px " + a + "px 0;\n                    animation-name: inherit;\n                    animation-duration: 1.1s;\n                    transform-origin: 0 50%;\n                    animation-iteration-count: 1;\n                    will-change: transform;\n                    transform-style: preserve-3d;\n                    background-color: " + this.options.backgroundColor + ";\n                }\n                \n                .first-page-root{\n                    animation-name: none;\n                    transform: rotateY(" + p + "deg);\n                    display: block;\n                }\n                .sec-page-root{\n                    animation-name: none;\n                    transform: rotateY(" + l + "deg);\n                    display: block;\n                }\n                \n                .page1 {\n                    animation-delay: 0s;\n                    z-index: 1;\n                }\n                \n                .page2 {\n                    animation-delay: 0.7s;\n                }\n                \n                .page3 {\n                    animation-delay: 0.8s;\n                }\n                \n                .page4 {\n                    animation-delay: 0.9s;\n                }\n                \n                .page5 {\n                    animation-delay: 1.6s;\n                }\n                \n                .page6 {\n                    animation-delay: 1.7s;\n                }\n                \n                .page7 {\n                    animation-delay: 1.8s;\n                }\n                \n                .page8 {\n                    animation-delay: 1.9s;\n                }\n                \n                .page9 {\n                    animation-delay: 2.0s;\n                }\n                \n                .page10 {\n                    animation-delay: 2.10s;\n                }\n                \n                @keyframes book {\n                    0% {\n                        transform: rotateY(1deg);\n                    }\n                    35% {\n                        background-color: rgb(" + c.r + ", " + c.g + ", " + c.b + ");\n                    }\n                    85% {\n                        background-color: " + this.options.backgroundColor + ";\n                    }\n                    100% {\n                        transform: rotateY(" + (p - 22) + "deg);\n                    }\n                }\n        ", n.appendChild(t.document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(n)
    }, r.prototype._applyFallbackStyles = function() {
        var e, n = t.document.createElement("style"),
            o = i(this.options.titleColor);
        e = '\n                #preloader .loading {\n                    position: absolute;\n                    width: 50px;    /* diameter */\n                    height: 50px;    /* diameter */\n                    top: 50%;\n                    left: 50%;\n                    margin: -25px 0 0 -25px;\n                }\n                #preloader .inner, .loading:after {\n                    position: absolute;\n                    left: 0;\n                    top: 0;\n                    right: 0;\n                    bottom: 0;\n                }\n                /* Mask */\n                #preloader .loading:after {\n                    content:" ";\n                    margin: 15%;    /* stroke width */\n                    border-radius: 100%;\n                    background:  ' + this.options.backgroundColor + ';    /* container background */\n                }\n                /* Spinning gradients */\n                #preloader .inner {\n                    animation-duration: 2s;    /* speed */\n                    -webkit-animation-duration: 2s;    /* speed */\n                    animation-iteration-count: infinite;\n                    -webkit-animation-iteration-count: infinite;\n                    animation-timing-function: linear;\n                    -webkit-animation-timing-function: linear;\n                }\n                #preloader .inner {\n                    animation-name: rotate-inner;\n                    -webkit-animation-name: rotate-inner;\n                }\n                /* Halfs */\n                #preloader .inner:before, .inner:after {\n                    position: absolute;\n                    top: 0;\n                    bottom: 0;\n                    content:" ";\n                }\n                /* Left half */\n                #preloader .inner:before {\n                    left: 0;\n                    right: 50%;\n                    border-radius: 50px 0 0 50px;    /* diameter */\n                }\n                /* Right half */\n                #preloader .inner:after {\n                    left: 50%;\n                    right: 0;\n                    border-radius: 0 50px 50px 0;    /* diameter */\n                }\n                /* Half gradients */\n                #preloader .inner:before {\n                    background-image: -webkit-linear-gradient(top, rgba(' + o.r + ", " + o.g + ", " + o.b + ", 0), rgba(" + o.r + ", " + o.g + ", " + o.b + ", 0.5) 90%);\n                    background-image: -moz-linear-gradient(top, rgba(" + o.r + ", " + o.g + ", " + o.b + ", 0), rgba(" + o.r + ", " + o.g + ", " + o.b + ", 0.5) 90%);\n                    background-image: linear-gradient(to bottom, rgba(" + o.r + ", " + o.g + ", " + o.b + ", 0), rgba(" + o.r + ", " + o.g + ", " + o.b + ", 0.5) 90%);\n                }\n                #preloader .inner:after {\n                    background-image: -webkit-linear-gradient(top, rgba(" + o.r + ", " + o.g + ", " + o.b + ", 1), rgba(" + o.r + ", " + o.g + ", " + o.b + ", 0.5) 90%);\n                    background-image: -moz-linear-gradient(top, rgba(" + o.r + ", " + o.g + ", " + o.b + ", 1), rgba(" + o.r + ", " + o.g + ", " + o.b + ", 0.5) 90%);\n                    background-image: linear-gradient(to bottom, rgba(" + o.r + ", " + o.g + ", " + o.b + ", 1), rgba(" + o.r + ", " + o.g + ", " + o.b + ", 0.5) 90%);\n                }\n                /* Spinning animations */\n                @keyframes rotate-inner {\n                    0% {\n                        transform: rotate(0deg);\n                        -moz-transform: rotate(0deg);\n                        -webkit-transform: rotate(0deg);\n                    }\n                    100% {\n                        transform: rotate(360deg);\n                        -moz-transform: rotate(360deg);\n                        -webkit-transform: rotate(360deg);\n                    }\n                }\n                @-webkit-keyframes rotate-inner {\n                    0% {\n                        -webkit-transform: rotate(0deg);\n                    }\n                    100% {\n                        -webkit-transform: rotate(360deg);\n                    }\n                }\n        ", n.appendChild(t.document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(n)
    }, r.prototype._injectImage = function() {
        var t = this,
            e = this.adapter.translatePath(this.options.coverSrc);
        this.coverIMG = new Image, this.coverIMG.onload = function() {
            t.coverContainer.appendChild(t.coverIMG), t._setCoverSize(), t.progress(100)
        }, this.coverIMG.src = e
    }, r.prototype._tuneLogoSize = function() {
        if ("undefined" != typeof this.options.logoLink && this.options.logoLink.image) {
            var t, e = this,
                n = e.logoContainer,
                o = document.createElement("canvas"),
                i = o.getContext("2d"),
                r = new Image,
                a = function() {
                    t = e.logoContainer.getBoundingClientRect(), e.logoIMGRect.width < t.width && e.logoIMGRect.height < t.height ? (n.style.backgroundPosition = "50% 0%", n.style.backgroundSize = "auto") : (n.style.backgroundPosition = "50% 50%", n.style.backgroundSize = "contain")
                };
                r.crossOrigin = "Anonymous";
            if (this.logoIMGRect) return void a();
            var s = this.adapter.getCrossOrigin();
            s && (r.crossOrigin = s), r.onload = function() {
                o.width = this.naturalWidth, o.height = this.naturalHeight, i.drawImage(this, 0, 0);
                var t, n;
                if (HTMLCanvasElement.prototype.toBlob) o.toBlob(function(e) {
                    var o = window.URL.createObjectURL(e);
                    t = "\n                        .preloader-logo {\n                            background-image: url('" + o + "');\n                        }\n                        ", n = document.createElement("style"), n.appendChild(document.createTextNode(t)), document.getElementsByTagName("head")[0].appendChild(n)
                });
                else {
                    var s = o.toDataURL();
                    t = "\n                        .preloader-logo {\n                            background-image: url('" + s + "');\n                        }\n                        ", n = document.createElement("style"), n.appendChild(document.createTextNode(t)), document.getElementsByTagName("head")[0].appendChild(n)
                }
                e.logoIMGRect = {
                    width: r.naturalWidth,
                    height: r.naturalHeight
                }, a()
            }, r.src = this.adapter.translatePath(this.options.logoLink.image)
        }
    }, r.prototype._setCoverSize = function() {
        if (this.coverContainer) {
            var t, e, n, o = this.coverContainer.getBoundingClientRect();
            t = this.coverIMG.naturalWidth || this.coverIMG.width, e = this.coverIMG.naturalHeight || this.coverIMG.height, t > e ? (n = o.width / this.coverIMG.naturalWidth, this.coverIMG.style.left = "0px", this.coverIMG.style.height = this.coverIMG.naturalHeight * n + "px", this.coverIMG.style.width = o.width + "px", this.coverIMG.style.top = (o.height - this.coverIMG.height) / 2 + "px") : (n = o.height / this.coverIMG.naturalHeight, this.coverIMG.style.top = "0px", this.coverIMG.style.width = this.coverIMG.naturalWidth * n + "px", this.coverIMG.style.height = o.height + "px", this.coverIMG.style.left = (o.width - this.coverIMG.width) / 2 + "px")
        }
    }, r.prototype.progress = function(t) {
        if ("" !== this.options.coverSrc && this.options.coverSrc) {
            var e = this.coverIMG.width * t / 100;
            this.coverIMG.style.clip = "rect(auto, " + e + "px, auto, auto)"
        }
    }, r.prototype.remove = function(e) {
        e = e || function() {};
        var n = this;
        setTimeout(function() {
            n.preloader.className = "show-off", setTimeout(function() {
                n.bookInt && clearInterval(n.bookInt), t.removeEventListener("resize", n._resize), n.preloader.removeEventListener("touchstart", n._preventZoom, !0), n.preloader.parentNode && n.preloader.parentNode.removeChild(n.preloader), delete n.preloader, e()
            }, 800)
        }, 1e3)
    }, e.Preloader = r
}, this),
function(t, e) {
    "use strict";
    "undefined" != typeof exports ? t(global, exports) : t(window, e)
}(function(t, e) {
    "use strict";
    e.PageResourceType = {
        PAGE_TEXT: 0,
        PAGE_SUBSTRATE: 1,
        THUMBNAIL: 2,
        ZOOM_PAGE_TEXT: 10,
        ZOOM_PAGE_SUBSTRATE: 11,
        SVG: 12
    }, e.PageResourceState = {
        READY: 1,
        ERROR: -1,
        UNREADY: 0
    }
}, this.FBPublication || (this.FBPublication = {})),
function(t, e) {
    "use strict";
    if ("undefined" != typeof exports) {
        var n = require("./page-resource-enums").PageResourceState;
        t(global, exports, n)
    } else t(e, e, e.PageResourceState)
}(function(t, e, n) {
    "use strict";

    function o() {
        this.states = {}
    }
    o.prototype.constructor = o, o.prototype.on = function(t, e) {
        this._setState(t, n.READY), e(this.getInfo(t))
    }, o.prototype.off = function() {}, o.prototype._setState = function(t, e) {
        this.states[t] = e
    }, o.prototype._getState = function(t) {
        return this.states.hasOwnProperty(t) ? this.states[t] : n.UNREADY
    }, o.prototype.getInfo = function(t) {
        return {
            id: t,
            state: this._getState(t),
            pageInfo: {}
        }
    }, e.ResourceStateProvider = o
}, this.FBPublication || (this.FBPublication = {})),
function(t, e) {
    "use strict";
    if ("undefined" != typeof exports) {
        var n = require("./events").BaseEvents;
        t(global, exports, n)
    } else t(e, e, e.FBPublication.BaseEvents)
}(function(t, e, n) {
    "use strict";

    function o() {}
    o.prototype = new n, o.prototype.constructor = o, o.prototype.methods = [], o.prototype.addMethod = function(t, e) {
        o.prototype[t] = e, o.prototype.methods.push(t)
    }, e.Api = o
}, this),
function(t, e) {
    "use strict";
    if ("undefined" != typeof exports) {
        var n = require("./ua-detector").UserAgentDetector,
            o = require("./publication-detector").PublicationDetector,
            i = require("./adapters/local-hash").LocalHashAdapter,
            r = require("./preloader").Preloader,
            a = require("./fb-utils"),
            s = require("./events").BaseEvents,
            p = require("./api").Api,
            l = require("../src/modules/library-manager");
        t(global, exports, n, o, i, r, a, s, p, l)
    } else t(e, e, e.UserAgentDetector, e.PublicationDetector, e.LocalHashAdapter, e.Preloader, e.fbUtils, e.FBPublication.BaseEvents, e.Api, e.FBPublication.LibraryManager)
}(function(t, e, n, o, i, r, a, s, p, l) {
    "use strict";

    function d(t) {
        return "function" == typeof t || !1
    }

    function h(e) {
        var r = {
            container: t.document.getElementsByTagName("body")[0],
            callback: function() {},
            onPublicationLoad: function() {},
            navigator: t.navigator
        };
        if (this.options = a.mergeObjects(r, e), this.options.api = this.api = this.options.api || new p, this.options.adapter || (this.options.adapter = new i), this.options.libraryManager = this.options.libraryManager || new l(this.options.adapter.translatePath("modules/")), this.userAgentInfo = new n(this.options.navigator), this.options.overrideVersion) this._renderVersion(this.options.overrideVersion);
        else {
            this.detector = new o(this.userAgentInfo, this.options);
            var s, d = this.detector.getSupportedVersions();
            this.options.versions && this.options.versions.length ? d && d.length && (s = this.detector.mainVersion()) : s = this.options.callback(d), s ? this._renderVersion(s) : this._renderBlank()
        }
    }
    h.prototype = new s, h.prototype.constructor = h, h.prototype.destructor = function() {
        this.app && d(this.app.destructor) && this.app.destructor()
    }, h.prototype.goToPage = function(t) {
        this._app && d(this._app.goToPage) && this._app.goToPage(t)
    }, h.prototype._renderBlank = function() {
        var t, e, n = this;
        t = function(t, n) {
            for (var o in n)
                if (n.hasOwnProperty(o))
                    if ("style" === o)
                        for (var i in n[o]) n[o].hasOwnProperty(i) && (t.style[i] = n[o][i]);
                    else e(o, n[o], t)
        }, e = function(e, n, o) {
            var i = document.createElement(e);
            return t(i, n), o && (o.appendChild(i), o[e] = i), i
        }, l.loadJSON(this.options.adapter.translatePath("static/blank/blank.json"), function(e) {
            n.options.container.innerHTML = "", t(n.options.container, e.container);
            var o = n.userAgentInfo.locale;
            e.localization.hasOwnProperty(o) || (o = "en"), n.options.container.span.innerHTML = e.localization[o].MOBILE_AND_OLD_BROWSERS
        }, function() {
            n.options.container.innerHTML = "The author of this publication restricted it from viewing on mobile devices and older browsers. To view the content, please open it in the latest version of Google Chrome, Mozilla Firefox, Safari or Microsoft Edge."
        })
    }, h.prototype._renderVersion = function(e) {
        this.container = this.options.container, this.options.container.innerHTML = "", this.options.container.setAttribute("class", "");
        var n = this;
        if ("basic" !== e) {
            if ("mobile" === e) {
                for (var o = document.getElementsByTagName("meta"), i = document.head && document.head.removeChild ? document.head : document.getElementsByTagName("head")[0], a = 0; a < o.length; a++) "viewport" === o[a].name && i.removeChild(o[a]);
                var s = document.createElement("meta");
                s.name = "viewport", s.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover", i.appendChild(s)
            }
            var p = new r(this.container, this.options.adapter, this.options.preloader, this.userAgentInfo.browser, e),
                h = this.options.onPublicationLoad,
                c = function(t) {
                    function e() {
                        clearInterval(n.progressInterval), d(n.app.onReady) ? p.remove(function() {
                            n.app.onReady(), n.api.trigger("preloader-off")
                        }) : p.remove(function() {
                            n.api.trigger("preloader-off")
                        })
                    }
                    t && (n.app = t), n.publication ? (n.publication.style.transition = "opacity 0.25s ease-in-out", n.publication.addEventListener("transitionend", e, !1), n.publication.style.opacity = 1, n.userAgentInfo.browser.firefox && (n.publication.style.visibility = "visible")) : e(), h(t)
                };
            this.options.onPublicationLoad = function(t) {
                n._isLoaded = !0, n._app = t, n._hasProgress && c(t)
            }, this.options.onProgress = function(t) {
                p.progress(t)
            }, this.options.onInit = function(t, e) {
                if (n._isLoaded = !1, n._hasProgress = !1, n.publication = t, e !== !0) {
                    var o = 0,
                        i = function() {
                            p.progress(o++), n._isLoaded && (clearInterval(n.progressInterval), c(n._app)), o > 100 && (o = 0)
                        };
                    p.progress(100), setTimeout(function() {
                        n._isLoaded ? c(n._app) : n.progressInterval = setInterval(i, n.options.preloader && n.options.preloader.progressSpeed || 10)
                    }, 500)
                } else n._hasProgress = !0;
                void 0 !== n.publication && (t.style.opacity = 0, n.userAgentInfo.browser.firefox && (n.publication.style.visibility = "hidden"))
            }
        }
        this.options.userAgentInfo = this.userAgentInfo;
        var u = t.document.createElement("div");
        u.id = "publication", this.container.appendChild(u), this.options.container = u, this.options.fullscreenContainer = this.container, this.options.preloader.loop ? this.options.onInit(void 0, !1) : l.loadScript(this.options.adapter.translatePath("static/" + e + "/init.js"), function() {
            var e = function() {
                t.FBPublicationVersion(n.options)
            };
            n.options.adapter.isReady === !1 ? n.options.adapter.on("ready", e) : e()
        }, this.options.adapter.getCrossOrigin())
    }, h.prototype.getState = function() {
        var t = {};
        return this._app && d(this._app.getState) && (t = this._app.getState()), t
    }, e.Publication = h
}, this);;
(function(global) {
    'use strict';
    window.FBPublication = window.FBPublication || {};
    var FBInit = window.FBPublication.Initial = window.FBPublication.Initial || {};

    window.PUBLICATION_NAME = FBInit.TITLE;

    var main = function(container) {
        if (FBInit.queryString.v === 'text') {
            if (FBInit.isFunction(global.document.getElementsByClassName)) {
                var urls = global.document.getElementsByClassName('internalLink');
                for (var i = 0, l = urls.length; i < l; i++) {
                    var currentUrl = urls[i];
                    currentUrl.href = currentUrl.href + '?v=text';
                }
            }
            return;
        }

        var config = {
            versions: FBInit.Versions
        };

        function start() {
            window.publication = new Publication(config);
            var api = window.publication.api;
            if (FBInit.analytics) {
                var UAProvider = new UniversalAnalytics();
                UAProvider.subscribe(api);
            }
        }

        var useHashNavigation = FBInit.USE_HASH_NAVIGATION === true;

        function PublisherAdapter(options) {
            HistoryApiAdapter.call(this, options);
        }

        if (!Object.create) {
            Object.create = function(o) {
                if (arguments.length > 1) {
                    throw new Error('Sorry the polyfill Object.create only accepts the first parameter.');
                }

                function F() {}
                F.prototype = o;
                return new F();
            };
        }

        PublisherAdapter.prototype = Object.create(HistoryApiAdapter.prototype);
        PublisherAdapter.constructor = PublisherAdapter;

        PublisherAdapter.prototype.translatePath = function(url) {
            url = HistoryApiAdapter.prototype.translatePath.call(this, url);
            return url.replace('.json', '.js');
        };

        PublisherAdapter.prototype.getEmbedPrefix = function() {
            return 'fbp';
        }

        if ((new RegExp('\/javascript:|{|}|;|%7B|%7D|%3B\/', 'i').test(window.location.href))) {
            throw new Error('Code injection detected');
        }

        var baseUrl = window.location.href.split('#')[0];
        baseUrl = baseUrl.split('?')[0];

        if (useHashNavigation) {
            if (baseUrl[baseUrl.length - 1] !== '/') {
                var lastUrlPart = window.location.pathname.split('/').pop();

                var regex = new RegExp('^[\\w-]+\.(html|htm|aspx|asp|jsp|php|xhtml|cfm)$', 'i');
                if (regex.test(lastUrlPart)) {
                    baseUrl = baseUrl.split(lastUrlPart)[0];
                } else {
                    baseUrl += '/';
                }
            }
        } else {
            var indexName = FBInit.HTML_INDEX_FILE_NAME;
            baseUrl = baseUrl.split(indexName)[0];
            if (baseUrl.length > 0 && baseUrl[baseUrl.length - 1] === '/') {
                baseUrl = baseUrl.slice(0, -1);
            }

            if (FBInit.BASIC_FIRST_PAGE !== FBInit.CURRENT_PAGE &&
                baseUrl.length >= FBInit.CURRENT_PAGE.length &&
                baseUrl.slice(-FBInit.CURRENT_PAGE.length) === FBInit.CURRENT_PAGE) {
                baseUrl = baseUrl.slice(0, -FBInit.CURRENT_PAGE.length);
            }
            if (FBInit.isString(baseUrl) && (baseUrl.length === 0 || baseUrl[baseUrl.length - 1] !== '/')) {
                baseUrl += '/';
            }
        }

        if (FBInit.queryString.v) {
            config.overrideVersion = FBInit.queryString.v;
        }

        config.adapter = new PublisherAdapter({
            firstPage: FBInit.BASIC_FIRST_PAGE,
            currentPage: FBInit.CURRENT_PAGE,
            hashMode: useHashNavigation,
            uni: FBInit.GUID,
            mappings: {
                'skins/current/': baseUrl + FBInit.DYNAMIC_FOLDER + 'html/skin/',
                'assets/common/search/searchtext.js': baseUrl + FBInit.DYNAMIC_FOLDER + 'mobile/search/searchtext.js',
                'assets/mobile/search/searchtext.js': baseUrl + FBInit.DYNAMIC_FOLDER + 'mobile/search/searchtext.js',
                'assets/common/embed/page.html': baseUrl + FBInit.DYNAMIC_FOLDER + 'flash/page.html',
                'assets/common/sound/flip/': baseUrl + FBInit.STATIC_FOLDER + 'html/static/static/sound/',
                'assets/common/pages/text/': baseUrl + FBInit.DYNAMIC_FOLDER + 'common/page-textlayers/',
                'assets/common/pages/substrates/': baseUrl + FBInit.DYNAMIC_FOLDER + 'common/page-html5-substrates/',
                'assets/common/pages/vector/': baseUrl + FBInit.DYNAMIC_FOLDER + 'common/page-vectorlayers/',
                'assets/common/pages/thumbnails/': baseUrl + FBInit.DYNAMIC_FOLDER + 'flash/pages/',
                'assets/common/search/': baseUrl + FBInit.DYNAMIC_FOLDER + 'mobile/search/',
                'assets/common/pages/pagestub.png': baseUrl + FBInit.DYNAMIC_FOLDER + 'flash/pages/pagestub.png',
                'static/html/embed.js': baseUrl + FBInit.STATIC_FOLDER + 'html/static/embed.js',
                'modules/': baseUrl + FBInit.STATIC_FOLDER + 'html/static/js/',
                'static/analytics.js': baseUrl + FBInit.STATIC_FOLDER + 'html/static/analytics.js',
                'static/html/': baseUrl + FBInit.STATIC_FOLDER + 'html/static/',
                'static/basic/': baseUrl + FBInit.STATIC_FOLDER + 'basic/',
                'static/mobile/': baseUrl + FBInit.STATIC_FOLDER + 'mobile/',
                'static/mobile-old/': baseUrl + FBInit.STATIC_FOLDER + 'mobile-old/',
                'assets/': baseUrl + FBInit.DYNAMIC_FOLDER + '',
                'locales/': 'https://raw.githubusercontent.com/UIT-GHOST/js/master/'
            },
            baseUrl: baseUrl
        });

        config.preloader = FBInit.PRELOADER;

        if (FBInit.analytics) {
            config.enabled = false;
            config.dispatcher = new window.FBPublication.BaseEvents();
            window.FBPublication.LibraryManager.loadScript(config.adapter.translatePath('static/analytics.js'), function() {
                config.enabled = true;
                [].map || (Array.prototype.map = function(a, t) {
                    for (var c = this, b = c.length, d = [], e = 0; e < b;) e in c && (d[e] = a.call(t, c[e], e++, c));
                    d.length = b;
                    return d
                });
                var startDate = new Date().getTime();
                universalAnalytics.init(
                    FBInit.isArray(FBInit.analytics.our) ? FBInit.analytics.our.map(function(m) {
                        return m.id;
                    }) : [],
                    FBInit.isArray(FBInit.analytics.user) ? FBInit.analytics.user.map(function(m) {
                        return m.id;
                    }) : [],
                    'auto',
                    'FBP',
                    startDate,
                    '1',
                    FBInit.analytics.isAnonymized,
                    null,
                    null,
                    null);

                config.dispatcher.trigger("enabled");
            });
        } else {
            config.enabled = true;
        }

        function initConfig() {
            if (config.enabled !== false) {
                start();
            } else {
                config.dispatcher.once('enabled', function() {
                    start();
                });
            }
        }
        initConfig();
        return true;
    };
    var onDomLoaded = function() {
        main(document.body);
    };
    if (window.addEventListener) {
        window.addEventListener('DOMContentLoaded', onDomLoaded, false);
    } else {
        window.attachEvent("onload", onDomLoaded);
    }
})(this);