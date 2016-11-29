# compareInflections

The latest live version is located: [HERE](https://www.josephweidinger.com/compareInflections/)

The idea behind this app is that two people sitting at one computer can compare the pitch of their voice as they say words or short phrases.

Currently, the algorithm used to determine how the pitch changes isn't very good and only works decently with sounds that resemble a sine wave (I.E. a whistle). I'm currently learning more about digital signal processing in an effort to create a better algorithm.

## Dev Environment

`git clone https://github.com/jsphweid/compareInflections.git` to clone to directory

`npm install` to download dependencies

`http-server` to serve up the app

`grunt js-hint` to jshint on '/js' files and `grunt html-hint` to root html files (index.html)

`grunt build` to make production build to '/build' folder

## TODO
- move files to 'src' folder and change things accordingly in grunt
- improve pitch detection algorithm
- figure out why it is going so slow!
