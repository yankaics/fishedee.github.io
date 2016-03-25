---
layout: post
category: 前端
---

# 1 概述
ReactNative是facebook出的一整套跨平台的js框架，满足热更新的同时，保持了原生的性能

# 2 Android

## 2.1 打包assert文件

```
import org.apache.tools.ant.taskdefs.condition.Os

def config = project.hasProperty("react") ? project.react : [];

def bundleAssetName = config.bundleAssetName ?: "index.android.bundle"
def entryFile = config.entryFile ?: "index.android.js"

// because elvis operator
def elvisFile(thing) {
    return thing ? file(thing) : null;
}

def reactRoot = elvisFile(config.root) ?: file("../../")
def inputExcludes = config.inputExcludes ?: ["android/**", "ios/**"]

project.afterEvaluate {
    // Grab all build types and product flavors
    def buildTypes = android.buildTypes.collect { type -> type.name }
    def productFlavors = android.productFlavors.collect { flavor -> flavor.name }

    // When no product flavors defined, use empty
    if (!productFlavors) productFlavors.add('')
    productFlavors.each { productFlavorName ->
        buildTypes.each { buildTypeName ->
            def sourceName = "${buildTypeName}"
            if (productFlavorName) {
                sourceName = "${productFlavorName}${sourceName.capitalize()}"
            }
            def targetName = "${sourceName.capitalize()}"
            // Tasks
            def mergeResourcesTaskName = "merge${sourceName.capitalize()}Resources"
            def mergeAssetsTaskName = "merge${sourceName.capitalize()}Assets"
            def processResourcesTaskName = "process${sourceName.capitalize()}Resources"

            def bundleJsAndAssetsTaskName = "bundle${sourceName.capitalize()}JsAndAssets"

            // React
            def jsBundleDirConfigName = "jsBundleDir${targetName}"
            def jsBundleDir = elvisFile(config."$jsBundleDirConfigName") ?:
                    file("$buildDir/intermediates/assets/${productFlavorName}/${buildTypeName}")
            def jsBundleFile = file("$jsBundleDir/$bundleAssetName")

            def resourcesDirConfigName = "jsBundleDir${targetName}"
            def resourcesDir = elvisFile(config."${resourcesDirConfigName}") ?:
                    file("$buildDir/intermediates/res/merged/${productFlavorName}/${buildTypeName}")


            tasks.create(
                    name: "$bundleJsAndAssetsTaskName",
                    type: Exec) {
                group = "react"
                description = "bundle Js And assets for ${targetName}."

                // create dirs if they are not there (e.g. the "clean" task just ran)
                doFirst {
                    jsBundleDir.mkdirs()
                    resourcesDir.mkdirs()
                }

                // set up inputs and outputs so gradle can cache the result
                inputs.files fileTree(dir: reactRoot, excludes: inputExcludes)
                outputs.dir jsBundleDir
                outputs.dir resourcesDir

                // set up the call to the react-native cli

                workingDir reactRoot
                if (Os.isFamily(Os.FAMILY_WINDOWS)) {
                    commandLine "cmd","/c", "react-native", "bundle", "--platform", "android", "--dev", "false", "--entry-file",
                            entryFile, "--bundle-output", jsBundleFile, "--assets-dest", resourcesDir
                } else {
                    //commandLine "who"
                    commandLine "/usr/local/bin/node","/Users/fish/Project/BakeWeb/app/android-rn/node_modules/react-native/local-cli/cli.js", "bundle", "--platform", "android", "--dev", "false", "--entry-file",
                            entryFile, "--bundle-output", jsBundleFile, "--assets-dest", resourcesDir
                }

                def bundleInVariantName = "bundleIn${targetName}"
                enabled config."$bundleInVariantName" ?: true
                def stdout = new ByteArrayOutputStream();
                standardOutput = stdout;
            }

            // hook bundle<Variant>JsAndAssets into the android build process
            tasks["$bundleJsAndAssetsTaskName"].dependsOn("$mergeResourcesTaskName")
            tasks["$bundleJsAndAssetsTaskName"].dependsOn("$mergeAssetsTaskName")
            tasks["$processResourcesTaskName"].dependsOn("${bundleJsAndAssetsTaskName}")
        }
    }
}
```

安卓中需要将react-native生成的静态文件导入到安卓项目中，为了将这个动作自动化，我们在gradle中加入以上配置，在merge资源后执行react-native命令行，将静态数据导入到项目中

## 2.2 Entry FindNotFound入口

```
{"message":"Cannot find entry file index.android.js in any of the roots: [\"/Users/fish/Project/BakeWeb/app/android-rn\"]","name":"NotFoundError","type":"NotFoundError","status":404,"errors":[{}]}
```

安卓提示index.android.js找不到，这是个[bug](https://github.com/facebook/react-native/issues/5174)，解决方法是修改一下index.android.js，保存一下，再回滚，再保存，反正就是刷新一下入口文件就对了。


