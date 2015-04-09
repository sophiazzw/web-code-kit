var path = require('path');

// --------------------------------
// 支持 amd 设置
// --------------------------------
fis.config.set('modules.postprocessor.vm', 'amd');
fis.config.set('modules.postprocessor.js', 'amd');
fis.config.set('modules.postprocessor.jsp', 'amd');
fis.config.set('settings.postprocessor.amd', {

    packages: [
        // 用来存放 libs 库
        {
            name: 'libs',
            location: 'static/libs/',
            main: 'index'
        }
    ]
});

// --------------------------------
// sass/scss 配置
// --------------------------------

// 设置 sass 的 include_paths 便于组件引入
fis.config.set('settings.parser.sass.include_paths', [
    './static/scss',
    './components/compass-mixins'
]);

// 使用 depscombine 是因为，在配置 pack 的时候，命中的文件其依赖也会打包进来。
fis.config.set('modules.packager', 'depscombine');
fis.config.merge({
    deploy : {
        //使用fis release --dest remote来使用这个配置
        remote : {
            //如果配置了receiver，fis会把文件逐个post到接收端上
            receiver : 'http://www.example.com/path/to/receiver.php',
            //从产出的结果的static目录下找文件
            from : '/static',
            //保存到远端机器的/home/fis/www/static目录下
            //这个参数会跟随post请求一起发送
            to : '/home/fis/www/',
            //通配或正则过滤文件，表示只上传所有的js文件
            include : '**.js',
            //widget目录下的那些文件就不要发布了
            exclude : /\/widget\//i,
            //支持对文件进行字符串替换
            replace : {
                from : 'http://www.online.com',
                to : 'http://www.offline.com'
            }
        },
        //名字随便取的，没有特殊含义
        local : {
            //from参数省略，表示从发布后的根目录开始上传
            //发布到当前项目的上一级的output目录中
            to : '../beauty/src/main/webapp'
        },
        //也可以是一个数组
        remote2 : [
            {
                //将static目录上传到/home/fis/www/webroot下
                //上传文件路径为/home/fis/www/webroot/static/xxxx
                receiver : 'http://www.example.com/path/to/receiver.php',
                from : '/static',
                to : '/home/fis/www/webroot'
            },
            {
                //将template目录内的文件（不包括template一级）
                //上传到/home/fis/www/tpl下
                //上传文件路径为/home/fis/www/tpl/xxxx
                receiver : 'http://www.example.com/path/to/receiver.php',
                from : '/template',
                to : '/home/fis/www/tpl',
                subOnly : true
            }
        ]
    }
});

fis.config.set('pack', {

    // css
    'pkg/frame.css': ['page/layout/frame.vm'],   // 因为依赖会被打包，所以这个规则会把 frame.vm 依赖的 css 打包在一起。

    // js
    // 依赖也会自动打包进来。
    'pkg/boot.js': ['static/js/require.js', 'components/jquery/jquery.js', 'components/bootstrap/js/bootstrap.js'],
    'pkg/app.js': ['page/examples/form.js'],
    'pkg/main.css' : ['static\/.*\/\.css|scss']
});

fis.config.set('roadmap.path', [

        {
            reg: /^\/components\/.*\.(?:less|md)$/i,
            release: false
        },

        {
            reg: 'doc/**.md',
            release: false
        },

        {
            reg: /^\/static\/libs\/(.*\.js)$/i,
            isMod: true,
            release: '${statics}/${namespace}/libs/$1'
        }
    ].concat(fis.config.get('roadmap.path', [])));

// markdown 支持，因为需要写文档，不用 markdown 真是不习惯
// npm install -g fis-parser-marked
// use the `fis-parser-marked` plugin to parse *.md file
fis.config.set('modules.parser.md', 'marked');
// *.md will be released as *.html
fis.config.set('roadmap.ext.md', 'html');

// js 模板支持
fis.config.set('modules.parser.tmpl', 'utc');
// fis.config.set('roadmap.ext.tmpl', 'js');
