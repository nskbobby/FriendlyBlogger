
document.addEventListener('DOMContentLoaded', function() {

        
    // Select the link with class 'myarticleslink-header'
    var element = document.querySelector('.myarticleslink-header');
    
    alert(element);
    // Add a highlight class to the selected link
    if (element) {
        element.classList.add('highlight');
    }
});