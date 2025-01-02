var blackDiv = document.getElementById('blackDiv');
var openMenuBtn = document.getElementById('openMenuBtn');

openMenuBtn.addEventListener('click', function() {
    if (blackDiv.style.display === 'none') {
        blackDiv.style.display = 'block';
    } else {
        blackDiv.style.display = 'none';
    }
});
