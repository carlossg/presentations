# [Slides from conferences](http://carlossg.github.io/presentations/)

# Export to PDF

    dir=2016-05_devopspro
    ip=$(ifconfig -a | awk '/inet /{print $2}' | grep -v 127.0.0.1 | head -n 1)
    docker run --rm --net=host -v `pwd`:/pwd astefanutti/decktape http://${ip}:8000/${dir} /pwd/${dir}/index.pdf
