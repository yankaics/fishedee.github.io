> 我的博客正式开通啦，快来围观吧

# demo
[点这里](http://fishedee.com)看一下这个基于jekyll的博客吧。

# 特点

## 超漂亮超简洁超丰富的动画效果

![Screen Shot 2016-03-15 at 8.40.14 P](/assets/img/Screen%20Shot%202016-03-15%20at%208.40.14%20PM.png)

## 超少超简单的配置项

![Screen Shot 2016-03-15 at 8.41.00 P](/assets/img/Screen%20Shot%202016-03-15%20at%208.41.00%20PM.png)

仅仅有25行的配置，没有更多。

## 必要的功能

* disqus的社交化评论系统
* baidu的统计配置
* 120种代码颜色高亮和行号展示
* 博客分类展示
* 博客目录显示
* 个人信息的自定义，头像，邮件，描述，一个都不能少。

没错，其实这些功能都是在_config.yml中配置的东西

# 工具链

* jekyll静态博客工具
* [novoland.github.io](http://novoland.github.io)的博客样式，感谢你的样式，非常漂亮
* mweb的markdown编辑器，粘贴图片时自动复制到/assets/img文件夹，非常爽

# 安装

## 下载博客模板

```
git clone https://github.com/fishedee/fishedee.github.io.git
```

## 新建博客
新建一个username.github.io的github仓库，username是你的github名。例如你的github名是myname，则新建一个myname.github.io的仓库。然后将fishedee.github.io的模板复制到自己仓库即可。

```
git clone https://github.com/myname/myname.github.io.git
cd myname.github.io
cp -r ../fishedee.github.io/* .
```

## 配置博客

打开仓库中的_config.yml，按照下面的提示修改好你对应的名字即可。

```
#基础信息
title: fishedee的博客 #博客名字
email: 306766045@qq.com #博主邮件
url: fishedee.com #博客域名，这里的url务必填写为username.github.io
avatar: http://image.fishedee.com/FulTCoakq411USQX_3HiZ79_fH0i #博主头像
description: 一个安静的程序猿 #博客描述

#文档配置（这里不要动）
markdown: kramdown
kramdown:
  input: GFM
  extensions:
    - autolink
    - footnotes
    - smart

#代码高亮主题配置
highlight-theme : my-github

#评论配置
disqus: fishedee #这里填写disqus的账号，没有的删掉这行。

#统计配置
baidu: 0a6da8c751d798199236954c919fd59e #这里填写百度的账号，没有的删掉这行。
```

删掉仓库根目录下的CNAME文件
```
rm CNAME
```

## 写博客

打开_posts文件夹，按照现有的博客文章格式写一篇markdown文章即可。下面展示写一个HelloWorld的博客文章。

```
cd _posts
rm -rf *
touch 2015-03-15-test.markdown
echo "---\nlayout: post\ncategory: 前端\n---\n # HelloWorld\n" > 2015-03-15-test.markdown
```

## 完成
在博客根目录提交文件

```
git add *
git commit -a -m "init commit"
git push origin master
```

然后在浏览器打开username.github.io即可看到你的博客！


