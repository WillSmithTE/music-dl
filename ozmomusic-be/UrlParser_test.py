from UrlParser import UrlParser


def testShouldFixBadSoundcloudUrl():
    input = 'Listen to 04 - Grown Simba by KingOfNothing15 on #SoundCloud\nhttps://soundcloud.app.goo.gl/5RyQT'
    
    expectedOutput = 'https://soundcloud.app.goo.gl/5RyQT'
    actual = UrlParser.soundcloud(input)

    assert(expectedOutput == actual)

def testShouldNotTouchGoodSoundcloudUrl():
    input = 'https://soundcloud.app.goo.gl/5RyQT'
    
    actual = UrlParser.soundcloud(input)

    assert(input == actual)