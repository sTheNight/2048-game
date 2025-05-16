$buildFoldPath = "css"

if (Test-Path -Path $buildFoldPath -PathType Container) {
    try {
        Remove-Item -Path $buildFoldPath -Recurse -Force
    } catch {
        Write-Error "临时构建文件夹删除失败：$_"
    }
}

lessc less/styles.less css/styles.css