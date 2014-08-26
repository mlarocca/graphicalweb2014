$(function() {
  $('#fullpage').fullpage({
    anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage', '5thPage' , '6thPage', '7thPage', '8thPage', '9thPage', '10thPage', '11thPage'],
    sectionsColor: ['#6666FF', '#1BBC9B', '#7E8F7C', '#263D83', '#33CC33', '#FF85AD', '#C63D0F', '#1BBC9B', '#7E8F7C', '#263D83', '#33CC33'],
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: ['Intro', 'Index', 'Data Visualization in Summary', 'Overview', 
                          'Declarative Frameworks', 'MVC Visualization Libraries',
                          'A Comparative Example', 'D3 Implementation', 'Ractive Version',
                          'PathsJs', 'Conclusions'],
    slidesNavigation: true
  });
  hljs.initHighlightingOnLoad();
});