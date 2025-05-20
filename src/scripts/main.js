// Collapsible project cards for the Projects section
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.project-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const card = btn.closest('.project-card');
            const details = card.querySelector('.project-details');
            const icon = btn.querySelector('i');
            details.classList.toggle('open');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });
});