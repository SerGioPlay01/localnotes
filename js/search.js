document.addEventListener("DOMContentLoaded", function() {
    var searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function() {
        var searchTerm = searchInput.value.toLowerCase();
        var link_pages = document.querySelectorAll('.note-block');

        link_pages.forEach(function(link_page) {
            var name = link_page.textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                link_page.style.display = 'block';
            } else {
                link_page.style.display = 'none';
            }
        });
    });
});

