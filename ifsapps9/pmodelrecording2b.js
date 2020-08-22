function findParentObject(nam) {
    var maxlevels = 7;
    var p = window;
    try {
        while ((p = p.parent) !== null && p !== window) {
            if (--maxlevels === 0) break;
            var o;
            if (typeof ((o = p[nam])) !== "undefined")
                return (o);
        }
    }
    catch (e) {
        var emsg = e.message;
    }
    return (null);
}
var swfplay = true;
function swfclick(event) {
    var e = event || window.event;
    if (e.button <= 1) {
        try {
            var swfe = document.embeds["swfobject"];
            swfplay = !swfplay;
            if (swfplay) swfe.play();
            else swfe.stop();
        } catch (e) {
            var emsg = e.message;
        }
    }
}
function recSendTracking(action, typ, obj) {
    try {
        if (typeof (CLTrackingSend) === "function") {
            var currentBookName = null;
            var cbName = findParentObject("currentBookName");
            if (cbName !== null) currentBookName = cbName;
            if (obj === null) {
                obj = { txtValue1: document.title, txtValue2: currentBookName, txtValue3: typ };
            }
            else {
                obj["txtValue1"] = document.title;
                obj["txtValue2"] = currentBookName;
            }
            CLTrackingSend(null, action, document.title, obj);
        }
    } catch (e) {
        var emsg = e.message;
    }
}
function clcontentviewStr(typ, p1, p2, p3, p4) {
    var htmcode = "";
    switch (typ) {
        case 'avi': htmcode = '<OBJECT ID="MediaPlayer" WIDTH="$2" HEIGHT="$3" CLASSID="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95" TYPE="application/x-oleobject"><PARAM NAME="windowlessvideo" VALUE="true"/><PARAM NAME="FileName" VALUE="$1.avi"/><PARAM name="autostart" VALUE="true"/><PARAM name="ShowControls" VALUE="true"/><param name="ShowStatusBar" value="false"/><PARAM name="ShowDisplay" VALUE="false"/><EMBED TYPE="application/x-mplayer2" SRC="$1.avi" NAME="MediaPlayer" WIDTH="$2" HEIGHT="$3" ShowControls="1" ShowStatusBar="0" ShowDisplay="0" autostart="0"> </EMBED></OBJECT>'; break;
        case 'swf': htmcode = '<OBJECT CLASSID="clsid:D27CDB6E-AE6D-11CF-96B8-444553540000" CODEBASE="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=3,0,0,0" WIDTH="$2" HEIGHT="$3" QUALITY="high" LOOP="false" ALLOWSCRIPTACCESS="ALWAYS" onclick="swfclick();"><PARAM NAME="wmode" VALUE="Transparent"/><PARAM NAME="movie" VALUE="$1.swf"/><PARAM NAME="quality" VALUE="high"/><PARAM NAME="loop" VALUE="false"/><PARAM NAME="allowScriptAccess" VALUE="always"/><EMBED SRC="$1.swf" QUALITY="high" WIDTH="$2" HEIGHT="$3" NAME="swfobject" LOOP="false" TYPE="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer" onmousedown="swfclick(event);"></EMBED></OBJECT>'; break;
        case 'xap': htmcode = '<object data="data:application/x-silverlight," type="application/x-silverlight-2" width="$2" height="$3"><PARAM NAME="windowless" VALUE="true"/><param name="source" value="$1.xap"/><param name="minRuntimeVersion" value="2.0.31005.0" /><param name="autoUpgrade" value="true" /><param name="InitParams" value="$4"/><a href="http://go.microsoft.com/fwlink/?LinkID=124807" style="text-decoration: none;"><img alt="" src="http://go.microsoft.com/fwlink/?LinkId=108181" alt="Get Microsoft Silverlight" style="border-style: none"/></a></object>'; break;
        case 'wmv': htmcode = '<OBJECT ID="MediaPlayer" WIDTH="$2" HEIGHT="$3" CLASSID="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95" TYPE="application/x-oleobject"><PARAM NAME="windowlessvideo" VALUE="true"/><PARAM NAME="FileName" VALUE="$1.wmv"/><PARAM name="autostart" VALUE="true"/><PARAM name="ShowControls" VALUE="true"/><param name="ShowStatusBar" value="false"/><PARAM name="ShowDisplay" VALUE="false"/><EMBED TYPE="application/x-mplayer2" SRC="$1.wmv" NAME="MediaPlayer" WIDTH="$2" HEIGHT="$3" ShowControls="1" ShowStatusBar="0" ShowDisplay="0" autostart="0"> </EMBED></OBJECT>'; break;
        case 'sbs': htmcode = document.getElementById('clsbs').innerHTML; break;
        case 'jsv':
            var isSP = false;
            if (self.location.href.indexOf(".aspx") >= 0) {
                isSP = true;
            }
            var jsvh = parseInt(p3) + 8;
            if (pathRecordingInShelfBook !== null || (typeof (ClickLearnTemplate) !== "undefined" && ClickLearnTemplate >= 2)) {
                if (isSP)
                    htmcode = '<iframe src="$1.jsv.htm" data-jsvpars="' + p4 + '" allowfullscreen="true"/>';
                else
                    htmcode = '<iframe src="$1.jsv.htm?jsvpars=' + p4 + '" allowfullscreen="true"/>';
            }
            else {
                if (isSP)
                    htmcode = '<iframe src="$1.jsv.htm" data-jsvpars="' + p4 + '" style="border:none;width:100%;height:' + jsvh + 'px;" allowfullscreen="true"/>';
                else
                    htmcode = '<iframe src="$1.jsv.htm?jsvpars=' + p4 + '" style="border:none;width:100%;height:' + jsvh + 'px;" allowfullscreen="true"/>';
            }
            if (isSP) {
                htmcode = htmcode.replace(".jsv.htm", ".jsv.aspx");
            }
            break;
    }
    recSendTracking("click", typ, null);
    htmcode = htmcode.replace(/\x24[1]/g, p1);
    htmcode = htmcode.replace(/\x24[2]/g, p2);
    htmcode = htmcode.replace(/\x24[3]/g, p3);
    htmcode = htmcode.replace(/\x24[4]/g, p4);
    return (htmcode);
}
function clcontentview(typ, p1, p2, p3, p4) {
    if (typeof (recordingLoaded) !== "undefined") {
        recordingLoaded();
    }
    if ((clcv = document.getElementById("content")) === null) return;
    clcv.innerHTML = clcontentviewStr(typ, p1, p2, p3, p4);
}
function getTopWindow() {
    var w = window;
    var i = 7;
    while (w !== window.top) {
        if (--i === 0)
            break;
        if (typeof (w["CL_BookAndRecordingAndLCID"]) !== "undefined")
            return (w);
        w = w.parent;
    }
    return (window.top);
}
function clcontentview2(typ, p1, p2, p3, p4) {
    try {
        if (typeof ($) !== "undefined") {
            if (typ === "download") {
                recSendTracking("click", p2, null);
                try {
                    window.open(p1 + "." + p2);
                } catch (e) {
                    var emsg = e.message;
                }
            }
            else if (pathRecordingInShelfBook !== null) {
                p1 = pathRecordingInShelfBook + "/" + p1;
                var cstr = clcontentviewStr(typ, p1, p2, p3, p4);
                getTopWindow().postMessage({ claction: "contentview", content: cstr }, "*");
            }
            else {
                clcontentview(typ, p1, p2, p3, p4);
                $('.video-modal').addClass('is-visible');
            }
        }
    } catch (e) {
        var emsgz = e.message;
    }
}
function recordingLoaded() {
    if (typeof (cl_feedbacksection_html) !== "undefined") {
        var fs = document.getElementById("cl_feedbacksection");
        if (fs !== null) {
            fs.innerHTML = cl_feedbacksection_html;
        }
    }
    var b, b1, l1, bcount;
    b = document.getElementById("videos");
    if (b !== null) {
        b = b.parentElement;
        b1 = document.getElementById("videos_badge");
        if (b1 !== null) {
            bcount = "0";
            l1 = b.getElementsByTagName("UL");
            if (l1 !== null && l1.length === 1) {
                l1 = l1[0].getElementsByTagName("LI");
                if (l1 !== null && l1.length >= 0) {
                    bcount = "" + l1.length;
                }
            }
            b1.innerText = bcount;
        }
    }
    b = document.getElementById("downloads");
    if (b !== null) {
        b = b.parentElement;
        b1 = document.getElementById("downloads_badge");
        if (b1 !== null) {
            bcount = "0";
            l1 = b.getElementsByTagName("UL");
            if (l1 !== null && l1.length === 1) {
                l1 = l1[0].getElementsByTagName("LI");
                if (l1 !== null && l1.length >= 0) {
                    bcount = "" + l1.length;
                }
            }
            b1.innerText = bcount;
        }
    }
    if (typeof ($) !== "undefined" && (typeof (ClickLearnTemplate) !== "undefined" && ClickLearnTemplate >= 2)) {
        if ($(window).width() > 480) {
            if (typeof (ClickLearnIsPreview) !== "undefined" && ClickLearnIsPreview) {
            }
            else {
                $('section.recording').addClass("sidebar-open");
            }
            $('.accordion-menu li > input').attr('checked', 'checked'); /* adds attribute checked to sidebar headers on larger screens*/
        }
    }
}
function DoWhenBookOrShelf() {
    var hdr = document.getElementById("clrecheader");
    if (hdr !== null) {
        hdr.style.display = "none";
        //getTopWindow().postMessage({ claction: "resizeiframe", height: document.body.scrollHeight }, "*");
        //onElementHeightChange(document.body, function () {
        //    getTopWindow().postMessage({ claction: "resizeiframe", height: document.body.scrollHeight }, "*");
        //});
    }
}
var pathRecordingInShelfBook = null;
function RecordingMessage(event) {
    try {
        if (typeof (event.data.claction) !== "undefined") {
            if (event.data.claction === "hideheader") {
                try {
                    pathRecordingInShelfBook = event.data.path;
                    DoWhenBookOrShelf();
                    recSendTracking("pageview", "sbs", null);
                } catch (e) {
                    var emsg = e.message;
                }
                if (typeof (event.data.AssistLinkOn) !== "undefined" && event.data.AssistLinkOn) {
                    var al = document.getElementById("assistlink");
                    if (al !== null) {
                        al.onclick = function () {
                            getTopWindow().postMessage({ claction: "assistnow" }, "*");
                        }
                    }
                    al = document.getElementById("assistlinkblock");
                    if (al !== null) {
                        al.style.display = "block";
                    }
                }
                if (typeof (event.data.FeedbackHtml) !== "undefined" && event.data.FeedbackHtml !== null) {
                    var fs = document.getElementById("cl_feedbacksection");
                    if (fs !== null) {
                        fs.innerHTML = event.data.FeedbackHtml;
                    }
                }
                if (typeof (event.data.fixedTab) !== "undefined" && event.data.fixedTab !== null && event.data.fixedTab !== "") {
                    var alnk = document.getElementById("rtab_" + event.data.fixedTab.toLowerCase());
                    if (alnk !== null) {
                        alnk.click();
                    }
                }
            }
        }
    } catch (e) {
        var emsg2 = e.message;
    }
};
function ZoomImage(t) {
    try {
        if (typeof ($) !== "undefined") {
            if (pathRecordingInShelfBook !== null) {
                var cstr = t.innerHTML;
                if (cstr.indexOf(".jpg") >= 0 || cstr.indexOf(".png") >= 0)
                    cstr = cstr.replace("src=\"", "src=\"" + pathRecordingInShelfBook + "/");
                getTopWindow().postMessage({ claction: "contentview", content: cstr }, "*");
            }
            else {
                if ((clcv = document.getElementById("content")) === null) return;
                clcv.innerHTML = t.innerHTML;
                $('.video-modal').addClass('is-visible');
            }
        }
    } catch (e) {
        var emsg = e.message;
    }
}

function reportFeedback() {
    var eId = "cl_feedbacksection";
    var pElement = document.getElementById(eId);
    if (eId === null || pElement === null)
        return (false);
    var Obj = {};
    Obj["action"] = "Feedback"; // required!
    Obj["txt"] = ""; // required!
    var ce = pElement.getElementsByTagName("INPUT");
    var e, Data;
    if (ce !== null) {
        for (i = 0; i < ce.length; i++) {
            e = ce[i];
            try {
                if (e.type === "radio" && !e.checked)
                    continue;
                Data = null;
                if (e.type === "checkbox")
                    Data = (e.checked) ? "1" : "0";
                else if (e.value !== null && "" + e.value !== "")
                    Data = "" + e.value;
                if (Data !== null) {
                    Obj[e.name] = Data;
                }
            } catch (e1) {
                var emsg = e1.message;
            }
        }
    }
    ce = pElement.getElementsByTagName("TEXTAREA");
    if (ce !== null) {
        for (i = 0; i < ce.length; i++) {
            e = ce[i];
            Data = e.innerHTML || e.innerText || e.value;
            if (Data !== null && Data !== "")
                Obj[e.name] = Data;
        }
    }
    recSendTracking("feedback", null, Obj);
    pElement.style.display = "none";
    return (true);
}

function onElementHeightChange(elm, callback) {
    var lastHeight = elm.scrollHeight, newHeight;
    (function run() {
        newHeight = elm.scrollHeight;
        if (lastHeight !== newHeight)
            callback();
        lastHeight = newHeight;

        if (elm.onElementHeightChangeTimer)
            clearTimeout(elm.onElementHeightChangeTimer);

        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}

window.addEventListener("message", RecordingMessage, false);