import re

class UrlParser:
    def soundcloud(input):
        return re.search("(?P<url>https?://[^\s]+)", input).group("url")
