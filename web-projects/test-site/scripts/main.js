let myImage = document.querySelector('img');

myImage.onclick = function() {
    let mySrc = myImage.getAttribute('src');
    if(mySrc === 'images/firefox-logo.jfif') {
      myImage.setAttribute ('src','images/firefox-blue.jfif');
    } else {
      myImage.setAttribute ('src','images/firefox-logo.jfif');
    }
}