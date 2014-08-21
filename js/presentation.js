$(function() {
  $('#fullpage').fullpage({
    anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage', '5thPage' , '6thPage', '7thPage'],
    sectionsColor: ['#C63D0F', '#1BBC9B', '#7E8F7C', '#C63D0F', '#1BBC9B', '#7E8F7C', '#C63D0F', '#1BBC9B', '#7E8F7C', '#C63D0F', '#1BBC9B', '#7E8F7C'],
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: ['Intro', 'Index', 'Data Visualization in Summary', 'Overview', 'Declarative Frameworks', 'MVC Visualization Libraries'],
    slidesNavigation: true
  });

});