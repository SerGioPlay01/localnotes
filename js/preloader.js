document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        setTimeout(function() {
            document.querySelector('.preloader').remove();
        }, 1500);
    }
}
