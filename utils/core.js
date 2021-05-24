
module.exports = {
    getUrl: function(n) {
        var a = getApp().globalData.api + n + ".html";
        return a;
    },
    json: function(t, n, o, i, a, c) {
        var s = getApp(), c = s.getCache("userinfo_openid"), u = s.getCache("usermid"), f = s.getCache("authkey");
        (n = n || {}).comefrom = "wxapp", n.openid = c, u && (n.mid = u.mid);
        uni.showLoading({
			title: 'Cargando'
		}), n && (n.authkey = f || "");
        var l = {
            url: (a ? this.getUrl(t) : this.getUrl(t)) + "?timestamp=" + +new Date(),
            method: a ? "POST" : "GET",
			data: n,
            header: {
                "Content-type": a ? "application/x-www-form-urlencoded" : "application/json",
                Cookie: "PHPSESSID=" + c
            }
        };
		// console.log('请求url',a);
        c || delete l.header.Cookie, o && (l.success = function(t) {
            // i && uni.hideLoading(), "request:ok" == t.errMsg && "function" == typeof o && (s.setCache("authkey", t.data.authkey || ""), o(t.data))
            i && uni.hideLoading(), "request:ok" == t.errMsg && "function" == typeof o && o(t.data)
        }),
		uni.request(l);
    },
    post: function(t, e, n, o, i) {
        this.json(t, e, n, o, !0, i);
    },
    get: function(t, e, n, o, i) {
        this.json(t, e, n, o, !1, i);
    },
};