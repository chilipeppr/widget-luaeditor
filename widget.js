/* global macro requirejs cprequire cpdefine chilipeppr THREE */
// ignore this errormessage:

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
        //AceEditor: '//cdn.jsdelivr.net/ace/1.2.3/min/ace',
        ace: '//ace.c9.io/build/src/ace',
        aceAutoCompletion: '//ace.c9.io/build/src/ext-language_tools',
        AceEditorLua: '//cdn.jsdelivr.net/ace/1.2.3/min/mode-lua',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
        AceEditorLua: ["ace"],
        aceAutoCompletion: ["ace"]
    }
});

// ChiliPeppr Widget/Element Javascript
cprequire_test(["inline:com-chilipeppr-widget-luaeditor"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    console.log("test running of " + myWidget.id);

    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');
    $('#com-chilipeppr-widget-luaeditor').css('margin', '10px');

    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://raw.githubusercontent.com/chilipeppr/element-flash/master/auto-generated-widget.html",
        // "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );

    var testLoadScript = function() {
        var file = {
            name: "myfile.lua",
            content: "print(\"hello world\")\nprint(\"cool\")"
        }
        chilipeppr.publish("/com-chilipeppr-widget-luaeditor/loadScript", file);
    }
    var testLoadScript2 = function() {
        var file = {
            name: "myfile.lua",
            content: "print(\"hello world 2\")\nprint(\"cool 2\")\n"
        }
        chilipeppr.publish("/com-chilipeppr-widget-luaeditor/loadScript", file);
    }
    var testLoadScript3 = function() {
        var file = {
            name: "differentfile.lua",
            content: "print(\"hello world 3\")\r\nprint(\"cool 3\")\r\n"
        }
        chilipeppr.publish("/com-chilipeppr-widget-luaeditor/loadScript", file);
    }
    
    // init my widget
    myWidget.init();
    $('title').html(myWidget.name);
    
    // test
    setTimeout(testLoadScript, 200);
    // setTimeout(testLoadScript3, 4000);
    // setTimeout(testLoadScript2, 6000);
    
    //$('#' + myWidget.id + ' .alert-devicefilename').removeClass("hidden");
    //$('#' + myWidget.id + ' .luaeditor-uploadrun').trigger("click");

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-luaeditor", ["chilipeppr_ready", "aceAutoCompletion", /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-luaeditor", // Make the id the same as the cpdefine id
        name: "Widget / Lua Editor", // The descriptive name of your widget.
        desc: "Edit and run Lua code with a multi-file editor. Save locally or upload/run remotely on the Lua device.", // A description of what your widget does
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            '/loadScript': 'Publish an object of {name:"myfile.lua", content:"print(\\"hello world\\")"} and we will open a new tab with the contents of the file.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
        },
        jscript: null, // contains the javascript macro that the user is working with
        editor: null, // holds the Ace editor object
        init: function () {

            
            $('#' + this.id + ' .luaeditor-new').click(this.fileNew.bind(this));
            $('#' + this.id + ' .luaeditor-run').click(this.runScript.bind(this));
            
            // saveScript
            //$('#' + this.id + ' .luaeditor-save').click(this.saveScript.bind(this));
            $('#' + this.id + ' .luaeditor-save').click(this.fileLocalSave.bind(this));

            // resize
            $('#' + this.id + ' .btn-resize').click(this.resizeEditor.bind(this));
            
            // setup del files
            $('#' + this.id + ' .recent-file-delete').click( this.deleteRecentFiles.bind(this));

            //this.buildRecentFileMenu();
            
            // capture ctrl+enter on textarea
            $('#' + this.id + ' .luaeditor-maineditor').keypress(this.jscriptKeypress.bind(this));
            
            // capture alt+r and alt+u on textarea
            $('#' + this.id + ' .luaeditor-maineditor').keydown(this.jscriptKeydown.bind(this));
            
            // setup subscribe methods so others can publish to us and ask us to
            // open a file
            this.setupSubscribe();
            
            // samples
            //this.setupSamples();
            
            //this.makeTextareaAcceptTabs();
            
            // popovers
            $('#' + this.id + ' .panel-heading .btn').popover();
            
            this.setupUploadRun();
            
            this.refreshFileList();
            
            this.loadPrevFiles();
            
            setTimeout(this.loadAce.bind(this), 2000);
            
            // see if startup script
            //.setupStartup();
            
            this.forkSetup();
            
            
            
            console.log(this.name + " done loading.");
        },
        /**
         * Setup subscribe so others can publish to us and ask us to
         * open a file, i.e. the NodeMCU Files widget sends this to us.
         */
        setupSubscribe: function() {
            chilipeppr.subscribe("/" + this.id + "/loadScript", this, this.loadScript);
        },
        /**
         * The method that receives the /loadScript publishes
         */
        loadScript: function(data) {
            console.log("got loadScript. data:", data);
            
            // see if this name exists, if so load contents into existing tab, but
            // show flash msg
            var filename = data.name;
            filename = filename.replace(/\.lua$/, "");
            
            var id = "com-chilipeppr-widget-nodemcu-file-" + filename; 
            
            if (id in this.aceSessions) {
                // there is an existing tab/session
                this.flashMsg("Loading to Existing File", 
                "An editor tab exists for this filename, so replacing contents with this file. You can undo this by hitting Ctrl-Z.");
                var session = this.aceSessions[id]; 
                //session.setValue(data.content);
                
                // show the tab
                var tabAEl = $("#" + this.id + ' a[href="#' + id + '"] ');
                tabAEl.tab("show");
                
                // now we know it's our active tab, but since it is asynchronous
                // we have to do this a bit later
                var that = this;
                setTimeout(function() {
                    console.log("setting content of editor so we get undo");
                    that.editor.setValue(data.content);
                }, 100);
                
            } else {
                // we are creating a new tab/session
                // create the tab that represents our file
                this.createFileTab(id, filename);
                
                // get file content
                var content = data.content;
                
                // create the ace session before we load the ace editor
                // make sure we store this session by it's id in the main
                // array of sessions before we call loadAce, that way it
                // can look for an existing session and use that instead of
                // creating one
                var session = new ace.EditSession(content, "ace/mode/lua")
                this.aceSessions[id] = session;

                // load the ace editor for this new file
                this.loadAce(id);
            }
            

            
            this.resize();

        },
        loadPrevFiles: function() {
            // when we load, we try to reload previous files and tabs that
            // were open
            console.log("loading previous files");
            var prev = localStorage.getItem(this.id + "-prev");
            if (prev && prev.length > 0) {
                prev = JSON.parse(prev);
            } else {
                // there is no previous set of files
                // open a new unnamed file
                this.fileNew();
            }
            
        },
        getDeviceFileList: function() {
            var code = `l = file.list()
str = "{\"files\":["
for k,v in pairs(l) do
  str = str .. "{\"name\":\"" .. k .. "\", \"size\":" .. v .. "}, "
end
str = string.sub(str, 0, string.len(str) - 2)
str = str .. "]}"
print(str)
str = nil
l = nil`;    

            var jsoncode = `
            -- json file list
l = file.list()
str = "{\"files\":["
for k,v in pairs(l) do
  str = str .. "{\"name\":\"" .. k .. "\", \"size\":" .. v .. "}, "
end
str = string.sub(str, 0, string.len(str) - 2)
str = str .. "]}"
print(str)
str = nil
l = nil
`;
        },
        /**
         * The DOM ID of the element that should be the Ace Editor
         */
        aceId: "com-chilipeppr-luaeditor",
        aceSessionName: null,
        aceSessions: {},
        aceCurrentSession: null,
        aceIsLoaded: false,
        loadAce: function(sessionName) {

            //if (id && id.length > 0) this.aceId = id;
            if (sessionName && sessionName.length > 0) {
                this.aceSessionName = sessionName;
            }
            
            console.log("trying to get ace. ace:"); //, ace, " aceId:", this.aceId);
            //require("ace/mode/text_highlight_rules", function(xace) {
            if ('ace' in window && ace) { // && 'setValue' in ace) {
                console.log("got ace. ace:", ace);
                
                if (this.aceIsLoaded) {
                    console.log("You are asking Ace to load a 2nd time, but we are already loaded.");
                    //return;
                } else { 
                    // load ace
                    var editor = ace.edit(this.aceId);
                    editor.setTheme("ace/theme/monokai");
                    //document.getElementById('editor').style.fontSize='13px';
                    this.editor = editor;
                    //this.setScriptFromTemporaryFile();
                    
                    editor.commands.addCommand({
                        name: 'mySave',
                        bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
                        exec: this.fileLocalSave.bind(this),
                        readOnly: false // false if this command should not apply in readOnly mode
                    });
                    
                    editor.setOptions({
                        enableBasicAutocompletion: true,
                        enableSnippets: true,
                        enableLiveAutocompletion: true
                    });
                    
                    editor.on("changeSession", function(e) {
                        console.log("got editor changeSession");
                    });
                    
                    this.resize();
                    this.aceIsLoaded = true;
                }
            
                // now create the session just for this document
                //var docu = ace.createEditSession('', "ace/mode/lua");
                
                // see if we have a session already for this
                if (this.aceSessionName in this.aceSessions) {
                    // we actually already have a session, cool
                    this.aceCurrentSession = this.aceSessions[this.aceSessionName];
                    
                } else {
                    // we don't have a session, so need to create one
                    this.aceCurrentSession = new ace.EditSession('', "ace/mode/lua")
                    this.aceSessions[this.aceSessionName] = this.aceCurrentSession;
                    
                }

                this.editor.setSession(this.aceCurrentSession);
                //editor.getSession().setMode("ace/mode/lua");
                this.editor.getSession().setTabSize(2);
                this.editor.getSession().setUseSoftTabs(true);
                //this.editor.getSession().setUseWrapMode(true);
                this.editor.getSession().setUndoManager(new ace.UndoManager());
                
                /*
                this.editor.getSession().on('change', function(e) {
                    // e.type, etc
                    console.log("got change on editor. e:", e);
                });
                
                this.editor.getSession().selection.on('changeSelection', function(e) {
                    console.log("got changeSelection on editor. e:", e); 
                });
                */
                
                console.log("ace session created:", this.aceCurrentSession);

            } else {
                console.log("ace is currently undefined so retry later");
                setTimeout(this.loadAce.bind(this), 1000);
            }
            
            
         
        },
        
        fileNewCtr: 0,
        fileNew: function(evt) {
            
            console.log("fileNew. evt:", evt);
            if (evt) $(evt.currentTarget).popover('hide');
            
            // create a new unnamed file in the editor
            this.fileNewCtr++;
            var filename = "unnamed" + this.fileNewCtr;
            var id = 'com-chilipeppr-widget-nodemcu-file-' + filename;
            
            // create the tab that represents our file
            this.createFileTab(id, filename);
            
            // load the ace editor for this new file
            this.loadAce(id);
            
            this.resize();
        },
        createFileTab: function(id, filename) {
            // add the tab to the top
            var tabEl = $('#' + this.id + ' .panel-body .nav-tabs');
            //var tmpltEl = tabEl.find('.li-template').clone();
            var tmpltEl = $(`
<li class="active li-template"><a 
    href="#com-chilipeppr-widget-tab-nodemcu-firmware" role="tab" 
    data-toggle="tab"><span 
    class="tab-file-name">udp.lua</span></a><button 
    type="button" class="close" 
    data-dismiss="alert" aria-label="Close"><span 
    aria-hidden="true">×</span></button>
</li>`);
            tmpltEl.removeClass("active");
            tmpltEl.removeClass("li-template");
            
            filename = filename.replace(/\.lua$/, "");
            tmpltEl.find(".tab-file-name").text(filename + ".lua");
            tmpltEl.find("a").prop('href', '#' + id); //.addClass(id);
            //tmpltEl.find("a").attr("data-fileid", id);
            
            tabEl.append(tmpltEl);
            
            tmpltEl.find("a").tab('show')
                .on('shown.bs.tab', this.onFileTabShow.bind(this));
            tmpltEl.find(".close").click(this.onFileTabClose.bind(this));
            
            // make sure editor doesn't show as empty
            $('#' + this.id + ' .luaeditor-maineditor').removeClass("empty");

            // populate our name into the rename box
            $('#' + this.id + ' .devicefilename').val(filename);

        },
        onFileTabShow: function(e) {
            console.log("tab got shown. tab:", e.target, "prev tab:", e.relatedTarget);
            var tabEl = $(e.target); 
            var fileId = tabEl.attr("href");
            fileId = fileId.replace("#", "");
            var filename = tabEl.find('.tab-file-name').text();
            filename = filename.replace(/\.lua$/, "");
            //that.editor = ace.edit(id);
            console.log("id:", fileId, "filename:", filename);
            
            // set the file name in the edit file box (only needed when they rename
            // so could set later)
            $('#' + this.id + ' .devicefilename').val(filename);
            
            // set the active session of the editor. this is the most important
            // part
            this.editor.setSession(this.aceSessions[fileId]);
            
            
            console.log("set active session of:", this.aceSessions[fileId], " from overall sessions:", this.aceSessions);
        
        },
        onFileTabClose: function(e) {
            console.log("onFileTabClose. e:", e);
            this.aceCurrentSession.$stopWorker();
            
            var tabEl = $(e.currentTarget).parent().find('a');
            console.log("tab that was closed. tabEl:", tabEl);
            var fileId = tabEl.attr("href");
            fileId = fileId.replace("#", "");
            
            delete this.aceSessions[fileId];
            
            console.log("after delete from array aceSessions:", this.aceSessions);
            
            // see if this was the last tab to close
            if (Object.keys(this.aceSessions).length == 0) {
                // it was the last tab
                this.editor.setValue("");
                $('#' + this.id + ' .luaeditor-maineditor').addClass("empty");
            } else if (tabEl.parent().hasClass("active")) {
                // see if this was the currently active tab, cuz if
                // it was we need to make some other tab active
                // maybe just set the first tab as active
                $('#' + this.id + ' .nav-tabs li:not(.active) a:first').tab('show');
                
            } else {
                // do nothing
            }

        },
        renameFileNeedSaveAfter: false,
        renameFileShow: function(evt) {
            if (evt && 'needSaveAfter' in evt && evt.needSaveAfter) {
                // we are showing the rename box and need to save afterwards
                // so mark a bool that needs to get set to false later
            
                // FOR NOW, ALWAYS SAVE AFTER    
            }
            
            // see if upload/run area is showing or not
            
            $('#' + this.id + " .devicefilename-region").removeClass("hidden");
            $('#' + this.id + " .devicefilename").select();
            this.resize();
        },
        renameFileHide: function(evt) {
            $('#' + this.id + " .devicefilename-region").addClass("hidden");
            this.resize();
        },
        renameFile: function() {
            
            // TODO
            // we need to make sure they didn't pick a name in use on another tab
            
            // when this is called from the go button we need
            // to change lots of id's
            var newfilename = $("#" + this.id + ' .devicefilename').val();
            var newid = "com-chilipeppr-widget-nodemcu-file-" + newfilename;
            var af = this.getActiveFile();
            console.log("renameFile. old name:", af.filename, "new file:", newfilename);
            console.log("old id:", af.id, "new id:", newid);

            // change text on tab
            var tabSpan = $("#" + this.id + ' a[href="#' + af.id + '"] .tab-file-name');
            var tabAEl = $("#" + this.id + ' a[href="#' + af.id + '"] ');
            console.log("current data-fileid", tabAEl.attr('data-fileid'));
            console.log("tabAEl:", tabAEl);

            tabSpan.text(newfilename + ".lua");
            //tabSpan.data("fileid", newid);
            //tabAEl.removeClass(af.id);
            //tabAEl.addClass(newid);
            //tabAEl.data('fileidold', af.id);
            tabAEl.attr('data-fileid', newid);
            tabAEl.attr("href", '#' + newid);

            // change key name in this.aceSessions
            this.aceSessions[newid] = this.aceSessions[af.id];
            delete this.aceSessions[af.id];
            
            // change id on editor div
            //var editorEl = $("#" + this.id + ' #' + af.id);
            //editorEl.attr("id", newid);
            //editorEl.data('filename', newfilename)
            
            // reactive ace editor
            //this.editor = ace.edit(newid);
            
            // now save the file
            this.fileLocalSave();
            
            // hide the region
            this.renameFileHide();
        },
        getActiveFile: function() {
            // see which tab is active
            //var activeEl = $('#' + this.id + " .luaeditor-maineditor.active");
            var activeTabEl = $('#' + this.id + " .nav-tabs li.active a");
            console.log("activeTabEl:", activeTabEl);
            //var id = activeTabEl.attr('data-fileid');
            
            var id = activeTabEl.attr('href');
            id = id.replace("#", "");
            var filename = activeTabEl.find('.tab-file-name').text();
            console.log("id:", id, "activeTabEl:", activeTabEl);
            var content = this.editor.getSession().getValue();
            return { filename: filename, id: id, content: content };
        },
        fileLocalSave: function(evt) {
            
            console.log("fileLocalSave");
            
            $('#' + this.id + ' .luaeditor-save').popover('hide');
            
            $('#' + this.id + ' .luaeditor-save').addClass('active');
            var that = this;
            setTimeout(function() {
                $('#' + that.id + ' .luaeditor-save').removeClass('active');
            }, 500);
            
            var activeFile = this.getActiveFile();
            console.log("activeFile:", activeFile);
            
            // check the file name
            if (activeFile.filename.match(/^unnamed/i)) {
                // it is still unnamed. have then name it
                this.status("You need to give your script a name.");
                this.renameFileShow({needSaveAfter: true});
                return;
            }
            
            if (activeFile.content.length == 0) {
                this.status("Your script seems to be empty. Not saving.");
                return;
            }
                
            activeFile.lastModified = new Date()
            //var afStr = JSON.stringify(activeFile);
            //var afStr = JSON.stringify(activeFile.content);
            var afStr = activeFile.content;
            
            console.log("saving file:", activeFile);
            localStorage.setItem(activeFile.id, afStr);
            
            // now append the file index for this widget in localStorage
            // hopefully this never gets corrupted
            var fileindex = localStorage.getItem(this.id + "-fileindex");
            if (fileindex && fileindex.length > 0) {
                // we got an index, great
                fileindex = JSON.parse(fileindex);
                
            } else {
                // no file index, create one
                fileindex = {};
            }
            
            var version = 1;
            
            // see if there was a previous version in index
            if (activeFile.id in fileindex && 
                'version' in fileindex[activeFile.id]) {
                version = fileindex[activeFile.id].version + 1;
            }
            
            var filesize = parseInt(activeFile.content.length / 1024);
            if (filesize < 1) filesize = 1;
            
            // add index to array
            fileindex[activeFile.id] = {
                filename: activeFile.filename,
                lastModified: new Date(),
                version: version,
                size: filesize
            };
            
            // write it out
            var fileindexStr = JSON.stringify(fileindex);
            console.log("write fileindex:", fileindexStr);
            localStorage.setItem(this.id + "-fileindex", fileindexStr);
            
            //this.createRecentFileEntry(fileStr, info);
            this.status('Locally saved your file "' + activeFile.filename + '". Retrieve it from upper right pulldown.');

            this.refreshFileList();
        },
        /**
         * Update the file pulldown to show the new files in localStorage.
         */
        refreshFileList: function() {
            
            // debug wipe list
            //localStorage.removeItem(this.id + "-fileindex");
            
            var fileindex = localStorage.getItem(this.id + "-fileindex");
            if (fileindex && fileindex.length > 0) {
                // we got an index, great
                fileindex = JSON.parse(fileindex);
                console.log("fileindex:", fileindex);
            } else {
                // no file index, create one
                fileindex = {};
            }
            
            // cleanup prev recent files
            $('#' + this.id + ' .dropdown-menu-files > li.recent-file-item').remove();
            
            var li = $('#' + this.id + ' .dropdown-menu-files > li.recent-files');
            console.log("listItems:", li);
            
            //var ctr = 0;
            for(var i in fileindex) {
                var fi = fileindex[i];
                fi.id = i;
                var dt = new Date(fi.lastModified);
                console.log("adding menu:", fi);
                var newLi = $(
                    '<li class="recent-file-item"><a href="javascript:">' + fi.filename +
                    ' <span class="lastModifyDate">' + dt.toLocaleString() + '</span>' +
                    ' v:' + fi.version + 
                    ' ' + fi.size + 'KB' +
                    '</a></li>');
                    //' <button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-trash"></span></button></a></li>');
                newLi.insertAfter(li);
                var that = this;
                newLi.click(fi, function(data) {
                    var key = data.data;
                    console.log("got recent file click. key:", key, "data:", data);
                    //that.loadFileFromLocalStorageKey(key);
                    that.fileLocalOpen(key);
                });

                //ctr++;
                //recentName = localStorage.getItem("com-chilipeppr-widget-macro-recent" + ctr + "-name");
                
            }
        },
        fileLocalOpen: function(fi) {
            console.log("got fileLocalOpen. fi:", fi);
            
            // create a new file in the editor

            // create the tab that represents our file
            this.createFileTab(fi.id, fi.filename);
            
            // get file content
            var content = localStorage.getItem(fi.id);
            
            // create the ace session before we load the ace editor
            // make sure we store this session by it's id in the main
            // array of sessions before we call loadAce, that way it
            // can look for an existing session and use that instead of
            // creating one
            var session = new ace.EditSession(content, "ace/mode/lua")
            this.aceSessions[fi.id] = session;

            // load the ace editor for this new file
            this.loadAce(fi.id);
            
            this.resize();
        },
        fileUploadAll: function(evt) {
            console.log("fileUploadAll. evt:", evt);
            
        },
        fileUploadAndRun: function(evt) {
            this.fileUpload();
            this.fileRun();
        },
        fileUpload: function(evt) {
            
            console.log("fileUpload. evt:", evt);
            
            if (evt && 'currentTarget' in evt) $(evt.currentTarget).popover('hide');

            // grab txt of file
            var txt = this.getScript();
            var filename = this.cleanupFilename();
            
            if (filename == null || filename.length <= 0) {
                // problem with filename
                this.flashMsg("No Filename", "You need to provide a filename to upload.");
                return;
            }
            
            filename += ".lua";
            
            // cleanup text to remove \r\n
            txt = txt.replace(/\r\n/g, "\n");
            
            // split on newlines and upload per line
            this.send('file.open("' + filename + '", "w")');
            var txtArr = txt.split(/\n/g);
            for(var i in txtArr) {
                var line = txtArr[i];
                //var lineEsc = line.replace(/"/g, '\\"');
                
                // since we are using [[ and ]] for literal strings, we need to watch out a bit
                // so if the line starts or ends with those add spaces
                if (line.match(/^\[/)) {
                    console.log("got line starting with [ so adding space. line:", line);
                    line = " " + line;
                }
                if (line.match(/\]$/)) {
                    console.log("got line ending with ] so adding space. line:", line);
                    line = line + " ";
                }
                
                this.send('file.writeline([[' + line + ']])');
            }
            this.send('file.close()');
            this.send('node.compile("' + filename + '")');
        },
        rawUploadAndRun: function(txt, filename) {
            //filename = this.cleanupFilename();
            filename += ".lua";
            
            // split on newlines and upload per line
            this.send('file.open("' + filename + '", "w")');
            var txtArr = txt.split(/\n/g);
            for(var i in txtArr) {
                var line = txtArr[i];
                //var lineEsc = line.replace(/"/g, '\\"');
                this.send('file.writeline([[' + line + ']])')
            }
            this.send('file.close()');
            //this.send('node.compile("' + filename + '")');
            this.send('dofile("' + filename + '")');
            
        },
        fileDump: function(evt) {
            $(evt.currentTarget).popover('hide');
            var filename = this.cleanupFilename();
            if (filename == null || filename.length <= 0) {
                // problem with filename
                this.flashMsg("No Filename", "You need to provide a filename to dump it to the console.");
                return;
            }
            
            filename += ".lua";
            
            this.send('file.open("' + filename + '", "r")');
            this.send('fileline = file.readline()');
            this.send('while fileline do');
            this.send('    print(string.sub(fileline, 0, string.len(fileline) - 1))');
            this.send('  fileline = file.readline()');
            this.send('end');
            this.send('file.close()');
            this.send('fileline = nil');

            // create a file read script as temp file. save that file.
            // then run it. that way the dump is after everything so
            // folks can cut/paste cleanly
            /*
            var tmpFile = "" +
            'file.open("' + filename + '", "r")\n' +
            'print(file.read())\n' +
            'file.close()\n'
            '';
            this.rawUploadAndRun(tmpFile, "tmp");
            */
            

        },
        fileDelete: function(evt) {
            console.log("fileDel. evt:", evt);
            $(evt.currentTarget).popover('hide');
            var filename = this.cleanupFilename();
            if (filename == null || filename.length <= 0) {
                // problem with filename
                this.flashMsg("No Filename", "You need to provide a filename to dump it to the console.");
                return;
            }
            
            //filename += ".lua";
            this.send('file.remove("' + filename + '.lua", "r")');
            this.send('file.remove("' + filename + '.lc", "r")');

        },
        fileRun: function(evt) {
            
            if (evt && 'currentTarget' in evt) $(evt.currentTarget).popover('hide');
            
            var filename = this.cleanupFilename();
            if (filename == null || filename.length <= 0) {
                // problem with filename
                this.flashMsg("No Filename", "You need to provide a filename to run it.");
                return;
            }
            
            filename += ".lc";
            this.send('dofile("' + filename + '")');

        },
        cleanupFilename: function() {
            var fileEl = $('#' + this.id + ' .devicefilename');
            var fileName = fileEl.val();
            if (fileName && fileName.length > 0) {
                // good there's a filename
                // make sure there's no .lua extension
                if (fileName.match(/\.lua$/i)) {
                    fileEl.val(fileName.replace(/\.lua$/i, ""));
                    fileName = fileEl.val();
                }
                //return fileName;
            } else {
                //.flashMsg("Provide a Filename", "You need to provide a filename before you can upload and run.");
            }
            return fileName;

        },
        /**
         * Setup the Upload -> Run button
         */
        setupUploadRun: function() {
            $('#' + this.id + ' .luaeditor-uploadrun').click(this.onOpenUploadRunRegion.bind(this));
             // activate alert
            $('#' + this.id + ' .alert-devicefilename')
                //.alert()
                //.addClass("hidden")
                .on('closed.bs.alert', this.onCloseUploadRunRegion.bind(this));
            // onchange
            var boxEl = $('#' + this.id + ' .alert-devicefilename');
            boxEl.on('change', this.cleanupFilename.bind(this));
            
            // setup individual buttons
            $('#' + this.id + ' .btn-fileuploadall').click(this.fileUploadAll.bind(this));
            $('#' + this.id + ' .btn-fileuploadrun').click(this.fileUploadAndRun.bind(this));
            $('#' + this.id + ' .btn-fileupload').click(this.fileUpload.bind(this));
            $('#' + this.id + ' .btn-filerun').click(this.fileRun.bind(this));
            $('#' + this.id + ' .btn-filedump').click(this.fileDump.bind(this));
            $('#' + this.id + ' .btn-filedelete').click(this.fileDelete.bind(this));
            $('#' + this.id + ' .btn-filerename').click(this.renameFileShow.bind(this));
            
            // setup the go button on the file rename
            $('#' + this.id + ' .btn-devicefilenamego').click(this.renameFile.bind(this));
            var that = this;
            // setup input box keypress and blur
            $('#' + this.id + ' .devicefilename').keypress(function(evt) {
                console.log("keypress. evt:", evt);
                if (evt.keyCode == 13) {
                    // enter was hit, so mimic clicking Go
                    $('#' + that.id + ' .btn-devicefilenamego').trigger("click");
                }
            });
            $('#' + this.id + ' .devicefilename-region').focusout(function(evt) {
                console.log("got focusout. evt:", evt);
                //var regionEl = $(evt.currentTarget);
                //var newTarget = $(evt.relatedTarget);
                //console.log("regionEl:", regionEl, "newTarget:", newTarget);
                if (evt.currentTarget == evt.relatedTarget) {
                    console.log("we got focus to ourselves");
                } else if ($.contains(evt.currentTarget, evt.relatedTarget)) {
                    // not hiding cuz still inside ourselves
                    console.log("not hiding cuz still inside ourselves");
                } else {
                    that.renameFileHide();
                }
            });

        },
        onOpenUploadRunRegion: function(evt) {
            console.log("uploadRun called. evt:", evt);
            
            var btnEl = $('#' + this.id + ' .luaeditor-uploadrun');
            btnEl.popover('hide');
            
            // see if filename box is showing, if not show it
            var boxEl = $('#' + this.id + ' .alert-devicefilename');
            if (boxEl.hasClass("hidden")) {
                boxEl.removeClass("hidden");
                btnEl.addClass("active")

            } else {
                
                boxEl.addClass("hidden");
                btnEl.removeClass("active");
            }

            // since we size our height ourselves, we better trigger resize cuz
            // we just added height
            this.resize();

            
            // see if filename, and if not show flash message
            var fileEl = $('#' + this.id + ' .devicefilename');
            var fileName = fileEl.val();
            if (fileName && fileName.length > 0) {
                // good there's a filename
                // make sure there's no .lua extension
                if (fileName.match(/\.lua$/i)) {
                    fileEl.val(fileName.replace(/\.lua$/i, ""));
                    fileName = fileEl.val();
                }
            } else {
                //.flashMsg("Provide a Filename", "You need to provide a filename before you can upload and run.");
            }
        },
        onCloseUploadRunRegion: function() {
            $('#' + this.id + ' .luaeditor-uploadrun').removeClass("active");
            // see if filename box is showing, if it is hide it
            var boxEl = $('#' + this.id + ' .alert-devicefilename');
            if (!boxEl.hasClass("hidden")) {
                boxEl.addClass("hidden");
            }
        },
        flashMsg: function(title, msg) {
            chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", title, msg);
        },
        setupStartup: function() {
            
            // setup pulldown menu items
            $('#' + this.id + ' .luaeditor-startup-load').click(this.editStartup.bind(this));
            $('#' + this.id + ' .luaeditor-startup-save').click(this.saveStartup.bind(this));
            
            // run startup script
            //this.onStartup();
            
        },
        editStartup: function(evt) {
            console.log("editStartup. evt:", evt);
            
            var script = localStorage.getItem(this.id + '-startup');
            this.jscript = script;
            this.loadJscript(this.jscript);
            this.status("Loaded startup script");
            
        },
        saveStartup: function(evt) {
            console.log("saveStartup. evt:", evt);
            var fileStr = this.getScript();
            localStorage.setItem(this.id + '-startup', fileStr);
            this.status("Saved startup script");
        },
        makeTextareaAcceptTabs: function() {
            $(document).delegate('#' + this.id + ' .luaeditor-maineditor', 'keydown', function(e) {
                var keyCode = e.keyCode || e.which;
                
                if (keyCode == 9) {
                    e.preventDefault();
                    var start = $(this).get(0).selectionStart;
                    var end = $(this).get(0).selectionEnd;
                    
                    // set textarea value to: text before caret + tab + text after caret
                    $(this).val($(this).val().substring(0, start)
                                + "\t"
                                + $(this).val().substring(end));
                    
                    // put caret at right position again
                    $(this).get(0).selectionStart =
                        $(this).get(0).selectionEnd = start + 1;
                }
            });
        },
        /**
         * Keep a counter so each send has its own ID so we can use jsonSend
         * and get complete statuses back from SPJS when we send each line
         * to the serial port.
         */
        sendCtr: 0,
        sendQueue: [],
        sendIntervalId: null,
        /**
         * Send the script off to the serial port. Let's do this via a queue.
         */
        send: function(txt) {
            var cmds = txt.split(/\n/g);
            var ctr = 0;
            var that = this;

            // push cmds onto queue
            this.sendQueue = this.sendQueue.concat(cmds);
            
            // make sure we don't already have a start interval going
            if (this.sendIntervalId) {
                console.log("we already have an interval running, so don't start a new one");
                return;
            }
            
            // start the interval
            this.sendIntervalId = window.setInterval(function() {
                
                var cmd = that.sendQueue.shift(); //cmds[ctr];

                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {
                    D: cmd + '\n',
                    Id: "luaeditor-" + that.sendCtr++
                });

                if (that.sendQueue.length > 0) {
                    // keep going
                    console.log("we have more items on sendQueue. items:", that.sendQueue.length);
                } else {
                    console.log("no more items on queue. cancelling interval.");
                    clearInterval(that.sendIntervalId); 
                    that.sendIntervalId = null;
                }
                /*
                if (ctr == cmds.length - 1) {
                    // we are at end
                    // decide when to end this interval
                    clearInterval(intervalID);   
                } else {
                    // increment counter for next time in interval
                    ctr++;
                }
                */

            }, 2);
            
            /*            
            for (var indx in cmds) {
                setTimeout(function() {

                var cmd = cmds[ctr];

                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {
                    D: cmd + '\n',
                    Id: "luaeditor-" + that.sendCtr++
                });

                ctr++;

                }, 30 * indx);
            }
            */
        },

        getScript: function() {
            //this.jscript = $('#' + this.id + ' .luaeditor-maineditor').val();
            this.jscript = this.editor.getValue();
            return this.jscript;
        },
        runScript: function(macroStr, helpTxt) {
            
            // hide popover
            $('#' + this.id + ' .luaeditor-run').popover('hide');
            
            // allow a custom script to be passed in
            if (typeof macroStr === "string") {
                this.jscript = macroStr;
            } else {
                this.getScript();
            }
            
            //this.jscript = $('.com-chilipeppr-widget-macro-jscript').val();
            
            if (this.jscript && this.jscript.length > 1) {
            
                this.send(this.jscript);
                
                if (!helpTxt) helpTxt = "";
                helpTxt = helpTxt.trim();
                if (helpTxt.length > 0) helpTxt += " ";

                this.status("Ran " + helpTxt + "script. "); // + this.jscript);
            
            } else {
                this.status("No script to run. Empty.");
            }
        },
        jscriptKeypress: function(evt) {
            // console.log("got keypress textarea. evt.keyCode", evt.keyCode, "evt:", evt);
            
            // shortcut for ctrl+enter
            if (evt.ctrlKey && evt.keyCode == 10) {
                // run the macro
                //$('.com-chilipeppr-widget-macro-run').click();
                this.runScript();
                // mimic push on btn
                $('#' + this.id + ' .luaeditor-run').addClass('active');
                var that = this;
                setTimeout(function() {
                    $('#' + that.id + ' .luaeditor-run').removeClass('active');
                }, 200);
            }
            
            // if (evt.ctrlKey && evt.keyCode)
            
            // should we really do this on every keystroke
            this.saveTemporaryFile();
                
        },
        jscriptKeydown: function(evt) {
            console.log("got keydown textarea. evt.keyCode", evt.keyCode, "evt:", evt);
            
            if (evt.altKey && evt.keyCode == 82) {
                this.fileUploadAndRun();
                // mimic push on btn
                $('#' + this.id + ' .btn-fileuploadrun').addClass('active');
                var that = this;
                setTimeout(function() {
                    $('#' + that.id + ' .btn-fileuploadrun').removeClass('active');
                }, 200);
            }
            
            if (evt.altKey && evt.keyCode == 85) {
                this.fileUpload();
                // mimic push on btn
                $('#' + this.id + ' .btn-fileupload').addClass('active');
                var that = this;
                setTimeout(function() {
                    $('#' + that.id + ' .btn-fileupload').removeClass('active');
                }, 200);
            }
        },
        saveTemporaryFile: function(evt) {
            localStorage.setItem(this.id + "-tempfile", this.getScript()); 
            console.log("saved temp file");
        },
        getTemporaryFile: function() {
            return localStorage.getItem(this.id + "-tempfile");    
        },
        setScriptFromTemporaryFile: function() {
            this.jscript = this.getTemporaryFile();
            if (this.jscript) {
                $('#' + this.id + ' .luaeditor-maineditor').val(this.jscript);
            
                this.editor.setValue(this.jscript);
            }
        },
        showData: function(datatxt) {
            $('#com-chilipeppr-widget-modal-macro-view .modal-body textarea').val(datatxt);
            //$('#com-chilipeppr-widget-modal-macro-view .modal-title').text("View Probe Data");
            $('#com-chilipeppr-widget-modal-macro-view').modal('show');
        },
        saveScript: function() {
            
            $('#' + this.id + ' .luaeditor-save').popover('hide');
            
            $('#' + this.id + ' .luaeditor-save').addClass('active');
            var that = this;
            setTimeout(function() {
                $('#' + that.id + ' .luaeditor-save').removeClass('active');
            }, 500);
            
            var fileStr = this.getScript();
            
            if (fileStr.length == 0) {
                this.status("Your script seems to be empty. Not saving.");
                return;
            }
            
            var firstLine = "";
            if (fileStr.match(/(.*)\r{0,1}\n/)) {
                // we have our first line
                firstLine = RegExp.$1;
            } else if (fileStr.length > 20) {
                firstLine = fileStr.substring(0,20);
            } else if (fileStr.length > 0) {
                firstLine = fileStr;
            }
                
            var info = {
                name: "" + firstLine,
                lastModified: new Date()
            };
            this.createRecentFileEntry(fileStr, info);
            this.status('Saved your file "' + info.name + '". Retrieve it from upper right pulldown.');

        },
        deleteRecentFiles: function() {
            console.log("deleting files");
            // loop thru file storage and delete entries that match this widget
            var keysToDelete = [];
            for (var i = 0; i < localStorage.length; i++){
                console.log("localStorage.item.key:", localStorage.key(i));
                var key = localStorage.key(i);
                if (key.match(/com-chilipeppr-widget-macro-recent/)) {
                    //localStorage.removeItem(key);
                    keysToDelete.push(key);
                    console.log("going to remove localstorage key:", key);
                }
            }
            keysToDelete.forEach(function(key) {
                localStorage.removeItem(key);
            });
            //localStorage.clear();
            this.buildRecentFileMenu();
        },
        createRecentFileEntry: function(fileStr, info) {
            console.log("createRecentFileEntry. fileStr.length:", fileStr.length, "info:", info);
            // get the next avail slot
            var lastSlot = -1;
            for(var ctr = 0; ctr < 100; ctr++) {
                if (this.id + '-recent' + ctr in localStorage) {
                    console.log("found recent file entry. ctr:", ctr);
                    lastSlot = ctr;
                }
            }
            console.log("lastSlot we found:", lastSlot);
            
            var nextSlot = lastSlot + 1;
            var recent = localStorage.getItem(this.id + "-recent" + nextSlot);
            if (recent == null) {
                console.log("empty slot. filling.");
                localStorage.setItem(this.id + "-recent" + nextSlot, fileStr);
                localStorage.setItem(this.id + "-recent" + nextSlot + "-name", info.name);
                localStorage.setItem(this.id + "-recent" + nextSlot + "-lastMod", info.lastModified);
                this.buildRecentFileMenu();
            }
            
        },
        buildRecentFileMenu: function() {
            
            // cleanup prev recent files
            $('#' + this.id + ' .dropdown-menu-files > li.recent-file-item').remove();
            
            var li = $('#' + this.id + ' .dropdown-menu-files > li.recent-files');
            console.log("listItems:", li);
            
            // get all macro files
            var keysForMacros = [];
            for (var i = 0; i < localStorage.length; i++){
                console.log("localStorage.item.key:", localStorage.key(i));
                var key = localStorage.key(i);
                if (key.match(/com-chilipeppr-widget-luaeditor-recent(\d+)-name/)) {
                    //localStorage.removeItem(key);
                    var keyCtr = RegExp.$1;
                    keysForMacros.push(keyCtr);
                    console.log("found a macro name with localstorage key:", key, "keyCtr:", keyCtr);
                }
            }
            keysForMacros.forEach(function(key) {
                localStorage.removeItem(key);
            });
            
            //var ctr = 0;
            for(var i = 0; i < keysForMacros.length; i++) {
                var ctr = keysForMacros[i];
                var recentName = localStorage.getItem(this.id + "-recent" + ctr + "-name");
                //while(recentName != null) {
                console.log("recentFile ctr:", ctr, "recentName:", recentName);
                var recentLastModified = localStorage.getItem(this.id + "-recent" + ctr + "-lastMod");
                var rlm = new Date(recentLastModified);
                var recentSize = localStorage.getItem(this.id + "-recent" + ctr).length;
                var rsize = parseInt(recentSize / 1024);
                if (rsize == 0) rsize = 1;
                var newLi = $(
                    '<li class="recent-file-item"><a href="javascript:">' + recentName +
                    ' <span class="lastModifyDate">' + rlm.toLocaleString() + '</span>' +
                    ' ' + rsize + 'KB' +
                    '</a></li>');
                    //' <button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-trash"></span></button></a></li>');
                newLi.insertAfter(li);
                var that = this;
                newLi.click(this.id + "-recent" + ctr, function(data) {
                    console.log("got recent file click. data:", data);
                    var key = data.data;
                    that.loadFileFromLocalStorageKey(key);
                    
                });

                //ctr++;
                //recentName = localStorage.getItem("com-chilipeppr-widget-macro-recent" + ctr + "-name");
                
            }
        },
        loadFileFromLocalStorageKey: function(key) {
            // load file into probes
            var info = {
                name: localStorage.getItem(key + '-name'), 
                lastModified: localStorage.getItem(key + '-lastMod')
            };
            console.log("loading script data. localStorage.key:", key, "info:", info);
            
            // load the data
            this.jscript = localStorage.getItem(key);
            this.loadJscript(this.jscript);
            this.status("Loaded data \"" + info.name + "\"");
        },
        resizeEditor: function() {
            console.log("resizing editor");
            this.editor.resize();    
        },
        /**
         * Resize the widget to the height of the window
         */
        resize: function() {
            // add the top of the widget + height of widget
            // to get sizing. then subtract that from height of window to figure out what 
            // height to add (subtract) from log
            var wdgt = $('#' + this.id);
            var wht = wdgt.offset().top + wdgt.height();
            var delta = $(window).height() - wht;
            //console.log("delta:", delta, "wht:", wht);
            //var logEl = $('#' + this.id + ' .luaeditor-maineditor');
            //var logEl = $('#' + this.id + ' .tab-content');
            var logEl = $('#' + this.id + ' #' + this.aceId);
            var loght = logEl.height();
            logEl.height(loght + delta - 13);
            if (this.editor) this.editor.resize();
        },
        loadJscript: function(txt) {
            //this.jscript = txt;
            //$('#' + this.id + ' .luaeditor-maineditor').val(txt);
            this.editor.setValue(txt);
            console.log("loaded script into main editor textarea");
        },
        setupSamples: function() {
            var that = this;

            // watchChiliPepprPauseSolderDispenser
            $('.com-chilipeppr-widget-macro-sample.sample-watchChiliPepprPauseSolderDispenser').click(function() { 
                var txt = that.getMethodString(that.watchChiliPepprPauseSolderDispenser);
                that.loadJscript(txt);
            });
            
            // append the autoAddMacros
            var dropdownEl = $('#' + this.id + ' .dropdown-sample-macros');
            console.log("dropdown to append to", dropdownEl);
            for (var i in this.autoAddMacros) {
                var item = this.autoAddMacros[i];
                var id = item.id;
                var desc = item.desc;

                var menuToAdd = $('<li><a href="javascript:" class="com-chilipeppr-widget-macro-sample ' +
                    'sample-' + id + '">' + desc + '</a></li>');
                menuToAdd.click(function() {
                    var txt = that.getMethodString(that[id]);
                    that.loadJscript(txt);
                });
            
                console.log("adding macro id:", id, "desc:", desc, "el:", menuToAdd);
                
                // append to menu
                dropdownEl.append(menuToAdd);
                console.log("the new dropdown:", dropdownEl);
            }
                        
            
        },
        getMethodString: function(methodToGet) {
            var txt = methodToGet.toString();
            // remove first and last lines
            var arr = txt.split("\n");
            var ctr = 0;
            arr.forEach(function(item) {
                arr[ctr] = item.replace(/            /, "");
                arr[ctr] = arr[ctr].replace(/    /g, "\t");
                ctr++;
            });
            arr = arr.splice(1, arr.length - 2);
            return arr.join("\n");
        },
        autoAddMacros: [
            { id : 'generateZigZag', desc : "Generate Zig Zag Tool Path" }
        ],

        // START SAMPLES
        /**
         * This macro helps you generate a zig zag tool
         * path inside of an overall rectangular shape. 
         * Give it the width and height of the rectangular
         * shape. Then give it the step over value and it 
         * will generate the gcode and then send it to the 
         * workspace so you can visualize it and run it.
         * 
         * This can be used to mill out or pocket a work
         * piece. It can also be used to scan a laser
         * over a surface to ablate or cure material
         * by scanning back and forth with a step over.
         */
        generateZigZag: function() {
        },
        sendSerial: function(gcode) {
            // send our data
            chilipeppr.publish("/com-chilipeppr-widget-serialport/send", gcode);
        },
        // END SAMPLES
        
        statEl: null, // cache the status element in DOM
        status: function(txt) {
            console.log("status. txt:", txt);
            if (this.statEl == null) this.statEl = $('#' + this.id + ' .luaeditor-status');
            var len = this.statEl.val().length;
            if (len > 3000) {
                console.log("truncating status area text");
                this.statEl.val(this.statEl.val().substring(len-1500));
            }
            this.statEl.val(this.statEl.val() + "\n" + txt);
            this.statEl.scrollTop(
                this.statEl[0].scrollHeight - this.statEl.height()
            );
        },
        /**
         * Add the fork menu to upper right corner caret.
         */
        forkSetup: function () {
            var topCssSelector = '#' + this.id;
            
            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 200,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });
            
            var that = this;
            chilipeppr.load(
                "http://raw.githubusercontent.com/chilipeppr/widget-pubsubviewer/master/auto-generated-widget.html",
                // "http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", 
                function () {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function (pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown .dropdown-menu-fork'), that);
                });
            });
            
        },
    }
});